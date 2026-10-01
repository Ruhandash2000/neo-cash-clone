/**
 * Phase 4: AI Signature Verification
 *
 * Uses Gemini 1.5 Flash Vision via Vertex AI (service account auth) to:
 * 1. Accept two uploaded images (ID card + application form)
 * 2. Extract and compare signatures from both
 * 3. Return a similarity score (0–100) and verdict
 *
 * Also handles document upload to Supabase Storage.
 */
"use server";

import { createServerFn } from "@tanstack/react-start";
import { VertexAI } from "@google-cloud/vertexai";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadDocumentInput {
  base64Data: string;       // base64-encoded file content
  mimeType: string;         // e.g. "image/jpeg"
  fileName: string;
  fileSizeBytes: number;
  docType: "id_card" | "application_form";
  studentId: string;
  partialAppId?: string;
}

export interface UploadDocumentResult {
  ok: boolean;
  docId?: string;
  storagePath?: string;
  error?: string;
}

export interface VerifySignaturesInput {
  idCardBase64: string;
  idCardMimeType: string;
  applicationBase64: string;
  applicationMimeType: string;
  partialAppId: string;
  idCardDocId: string;
  applicationDocId: string;
  studentId: string;
}

export interface SignatureVerificationResult {
  ok: boolean;
  similarityScore?: number;
  verdict?: "verified" | "rejected" | "manual_review";
  reasoning?: string;
  verificationId?: string;
  error?: string;
}

// ─── Upload document to Supabase Storage ─────────────────────────────────────

export const uploadDocument = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as UploadDocumentInput)
  .handler(async ({ data }): Promise<UploadDocumentResult> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;

      // Convert base64 to buffer
      const buffer = Buffer.from(data.base64Data, "base64");
      const storagePath = `${data.studentId}/${data.docType}/${Date.now()}_${data.fileName}`;

      // Upload to Supabase Storage bucket
      const { error: uploadError } = await db.storage
        .from("partial-payment-docs")
        .upload(storagePath, buffer, {
          contentType: data.mimeType,
          upsert: true,
        });

      if (uploadError) {
        return { ok: false, error: uploadError.message };
      }

      // Get public URL (signed for 90 days)
      const { data: signedData } = await db.storage
        .from("partial-payment-docs")
        .createSignedUrl(storagePath, 60 * 60 * 24 * 90);

      // Record in DB
      const { data: doc, error: dbError } = await db
        .from("document_uploads")
        .insert({
          student_id:      data.studentId,
          partial_app_id:  data.partialAppId ?? null,
          doc_type:        data.docType,
          storage_path:    storagePath,
          public_url:      signedData?.signedUrl ?? null,
          file_name:       data.fileName,
          file_size_bytes: data.fileSizeBytes,
          mime_type:       data.mimeType,
        })
        .select("id")
        .single();

      if (dbError) {
        return { ok: false, error: dbError.message };
      }

      return { ok: true, docId: doc.id, storagePath };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Upload failed" };
    }
  });

// ─── AI Signature Verification ───────────────────────────────────────────────

export const verifySignatures = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as VerifySignaturesInput)
  .handler(async ({ data }): Promise<SignatureVerificationResult> => {
    try {
      const project  = process.env["GOOGLE_CLOUD_PROJECT"]  ?? "neo-cashless";
      const location = process.env["GOOGLE_CLOUD_LOCATION"] ?? "us-central1";

      // Vertex AI uses GOOGLE_APPLICATION_CREDENTIALS env var automatically
      const vertexAI = new VertexAI({ project, location });
      const model = vertexAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

      const prompt = `You are an expert forensic document examiner specializing in handwriting and signature analysis.

You are given two images:
1. IMAGE 1: A National ID card or Student ID card
2. IMAGE 2: A signed application form

Your task:
1. Locate the SIGNATURE on Image 1 (ID card signature field)
2. Locate the SIGNATURE on Image 2 (application form signature)
3. Compare them carefully looking at:
   - Overall shape and flow of strokes
   - Starting and ending points
   - Pressure patterns and stroke thickness
   - Unique flourishes or distinctive marks
   - Letter formations if legible

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation outside JSON):
{
  "similarityScore": <number 0-100>,
  "verdict": "<verified|rejected|manual_review>",
  "reasoning": "<2-3 sentences explaining your analysis>"
}

Rules:
- similarityScore >= 75 → verdict must be "verified"
- similarityScore 50-74 → verdict must be "manual_review"  
- similarityScore < 50 → verdict must be "rejected"
- If you cannot find a signature in either image, set similarityScore to 0 and verdict to "manual_review"`;

      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { mimeType: data.idCardMimeType,      data: data.idCardBase64 } },
            { inlineData: { mimeType: data.applicationMimeType, data: data.applicationBase64 } },
          ],
        }],
      });

      const raw = (result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? "").trim();

      // Parse JSON response from Gemini
      let parsed: { similarityScore: number; verdict: string; reasoning: string };
      try {
        // Strip markdown code fences if present
        const clean = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        parsed = JSON.parse(clean) as typeof parsed;
      } catch {
        // Fallback: extract numbers from response
        const scoreMatch = raw.match(/(\d+(?:\.\d+)?)/);
        const score = scoreMatch ? parseFloat(scoreMatch[1] ?? "50") : 50;
        parsed = {
          similarityScore: score,
          verdict: score >= 75 ? "verified" : score >= 50 ? "manual_review" : "rejected",
          reasoning: raw.slice(0, 200),
        };
      }

      const score = Math.min(100, Math.max(0, Number(parsed.similarityScore)));
      const verdict = parsed.verdict as "verified" | "rejected" | "manual_review";

      // Save result to DB via RPC
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabaseAdmin as any;
      const { data: verifData } = await db.rpc("record_signature_verification", {
        p_partial_app_id:     data.partialAppId,
        p_id_card_doc_id:     data.idCardDocId,
        p_application_doc_id: data.applicationDocId,
        p_similarity_score:   score,
        p_ai_verdict:         verdict,
        p_ai_reasoning:       parsed.reasoning,
      });

      return {
        ok:             true,
        similarityScore: score,
        verdict,
        reasoning:      parsed.reasoning,
        verificationId: verifData as string,
      };
    } catch (err) {
      return {
        ok:    false,
        error: err instanceof Error ? err.message : "AI verification failed",
      };
    }
  });
