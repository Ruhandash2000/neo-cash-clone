/**
 * Document Upload + AI Signature Verification Panel
 *
 * Used inside the partial payment application modal.
 * Lets students upload:
 *   1. National ID / Student ID card photo
 *   2. Signed application form photo
 *
 * Then calls Gemini Vision AI to compare signatures and returns
 * a similarity score with verdict.
 */

import { useState, useRef } from "react";
import {
  Upload, ScanLine, CheckCircle2, XCircle, AlertCircle,
  FileImage, Loader2, ShieldCheck, Eye, Sparkles,
} from "lucide-react";
import { uploadDocument, verifySignatures } from "@/lib/signature-verification.functions";
import type { SignatureVerificationResult } from "@/lib/signature-verification.functions";

interface Props {
  studentId: string;
  partialAppId: string;
  onVerified: (result: SignatureVerificationResult) => void;
}

interface DocState {
  file: File | null;
  base64: string;
  preview: string;
  docId: string;
  uploading: boolean;
  uploaded: boolean;
  error: string | null;
}

const EMPTY_DOC: DocState = {
  file: null, base64: "", preview: "",
  docId: "", uploading: false, uploaded: false, error: null,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:...;base64, prefix
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function scoreColor(score: number): string {
  if (score >= 90) return "#047857";
  if (score >= 70) return "#10B981";
  if (score >= 50) return "#D97706";
  return "#DC2626";
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Auto-Approved! (≥90% High Confidence Match)";
  if (score >= 70) return "High Confidence Match — Standard Review";
  if (score >= 50) return "Requires Manual Review";
  return "Low Confidence — Likely Mismatch";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DocumentUploadVerifier({ studentId, partialAppId, onVerified }: Props) {
  const [idCard, setIdCard] = useState<DocState>({ ...EMPTY_DOC });
  const [appForm, setAppForm] = useState<DocState>({ ...EMPTY_DOC });
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<SignatureVerificationResult | null>(null);

  const idRef = useRef<HTMLInputElement>(null);
  const appRef = useRef<HTMLInputElement>(null);

  // ── Upload handler ──────────────────────────────────────────────────────────
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: "id_card" | "application_form",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setter = docType === "id_card" ? setIdCard : setAppForm;

    // Validate
    if (!file.type.startsWith("image/")) {
      setter(prev => ({ ...prev, error: "Please upload an image file (JPG, PNG, WEBP)" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setter(prev => ({ ...prev, error: "File too large. Max 5MB." }));
      return;
    }

    const preview = URL.createObjectURL(file);
    const base64 = await fileToBase64(file);

    setter(prev => ({
      ...prev, file, base64, preview,
      uploading: true, uploaded: false, error: null,
    }));

    // Upload to Supabase Storage
    const res = await uploadDocument({
      data: {
        base64Data: base64,
        mimeType: file.type,
        fileName: file.name,
        fileSizeBytes: file.size,
        docType,
        studentId,
        partialAppId,
      },
    });

    if (res.ok && res.docId) {
      setter(prev => ({ ...prev, docId: res.docId!, uploading: false, uploaded: true }));
    } else {
      setter(prev => ({
        ...prev, uploading: false,
        error: res.error ?? "Upload failed. Try again.",
      }));
    }
  };

  // ── Run AI verification ─────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (!idCard.uploaded || !appForm.uploaded) return;
    setVerifying(true);

    const res = await verifySignatures({
      data: {
        idCardBase64:      idCard.base64,
        idCardMimeType:    idCard.file!.type,
        applicationBase64: appForm.base64,
        applicationMimeType: appForm.file!.type,
        partialAppId,
        idCardDocId:      idCard.docId,
        applicationDocId: appForm.docId,
        studentId,
      },
    });

    setVerifying(false);
    setResult(res);
    if (res.ok) onVerified(res);
  };

  // ── Upload box component ────────────────────────────────────────────────────
  const UploadBox = ({
    label, hint, docType, state, inputRef,
  }: {
    label: string;
    hint: string;
    docType: "id_card" | "application_form";
    state: DocState;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div style={{
      flex: 1, minWidth: 0,
      border: state.uploaded
        ? "2px solid rgba(4, 120, 87, 0.5)"
        : state.error
        ? "2px solid rgba(220, 38, 38, 0.5)"
        : "2px dashed rgba(196, 154, 108, 0.5)",
      borderRadius: "14px",
      padding: "16px",
      background: state.uploaded ? "rgba(4, 120, 87, 0.04)" : "#FDF9F3",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
    onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => void handleFileSelect(e, docType)}
      />

      {state.preview ? (
        <div style={{ position: "relative" }}>
          <img
            src={state.preview}
            alt={label}
            style={{
              width: "100%", height: "140px", objectFit: "cover",
              borderRadius: "10px", display: "block",
            }}
          />
          {state.uploading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.5)", borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Loader2 size={28} style={{ color: "#fff", animation: "spin 1s linear infinite" }} />
            </div>
          )}
          {state.uploaded && (
            <div style={{
              position: "absolute", top: 8, right: 8,
              background: "#047857", borderRadius: "50%", padding: "4px",
            }}>
              <CheckCircle2 size={16} style={{ color: "#fff" }} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <FileImage size={36} style={{ color: "#C49A6C", margin: "0 auto 10px", display: "block" }} />
          <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#241A14" }}>{label}</p>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#8C7A6A" }}>{hint}</p>
        </div>
      )}

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
        {state.uploading && (
          <><Loader2 size={13} style={{ color: "#D35400" }} />
          <span style={{ fontSize: "0.75rem", color: "#D35400", fontWeight: 600 }}>Uploading…</span></>
        )}
        {state.uploaded && (
          <><CheckCircle2 size={13} style={{ color: "#047857" }} />
          <span style={{ fontSize: "0.75rem", color: "#047857", fontWeight: 600 }}>Uploaded</span></>
        )}
        {state.error && (
          <><XCircle size={13} style={{ color: "#DC2626" }} />
          <span style={{ fontSize: "0.72rem", color: "#DC2626" }}>{state.error}</span></>
        )}
        {!state.uploading && !state.uploaded && !state.error && (
          <><Upload size={13} style={{ color: "#8C7A6A" }} />
          <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Click to upload</span></>
        )}
      </div>
    </div>
  );

  // ── Result display ──────────────────────────────────────────────────────────
  const ResultPanel = () => {
    if (!result) return null;
    if (!result.ok) return (
      <div style={{
        background: "rgba(220, 38, 38, 0.08)", border: "1px solid rgba(220, 38, 38, 0.3)",
        borderRadius: "12px", padding: "14px", marginTop: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <XCircle size={18} style={{ color: "#DC2626" }} />
          <span style={{ fontWeight: 700, color: "#DC2626", fontSize: "0.9rem" }}>Verification Failed</span>
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#66564A" }}>{result.error}</p>
      </div>
    );

    const score = result.similarityScore ?? 0;
    const color = scoreColor(score);

    return (
      <div style={{
        background: "#FFFFFF", border: `1.5px solid ${color}40`,
        borderRadius: "14px", padding: "16px", marginTop: "16px",
      }}>
        {/* Score bar */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>
              Signature Match Score
            </span>
            <span style={{ fontSize: "1.4rem", fontWeight: 900, color }}>
              {score.toFixed(0)}%
            </span>
          </div>
          <div style={{ height: "10px", background: "#F3E8D7", borderRadius: "999px", overflow: "hidden" }}>
            <div style={{
              width: `${score}%`, height: "100%",
              background: color, borderRadius: "999px",
              transition: "width 1s ease",
            }} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: "0.78rem", color, fontWeight: 700 }}>
            {scoreLabel(score)}
          </p>
        </div>

        {/* Auto-Approval Callout */}
        {score >= 90 && (
          <div style={{
            background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "10px", padding: "10px 12px", marginBottom: "12px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <Sparkles size={16} style={{ color: "#10B981", flexShrink: 0 }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#047857" }}>
              🎉 90%+ Match Achieved! Your partial payment will be <strong>automatically approved</strong> upon submission.
            </span>
          </div>
        )}

        {/* Verdict badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: `${color}15`, border: `1px solid ${color}40`,
          borderRadius: "999px", padding: "5px 14px", marginBottom: "12px",
        }}>
          {result.verdict === "verified"
            ? <CheckCircle2 size={14} style={{ color }} />
            : result.verdict === "rejected"
            ? <XCircle size={14} style={{ color }} />
            : <AlertCircle size={14} style={{ color }} />}
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color, textTransform: "uppercase" }}>
            {score >= 90 ? "Auto-Approved" : result.verdict === "verified" ? "Verified"
              : result.verdict === "rejected" ? "Rejected"
              : "Manual Review Required"}
          </span>
        </div>

        {/* AI reasoning */}
        {result.reasoning && (
          <div style={{
            background: "#FDF9F3", borderRadius: "10px", padding: "12px",
            fontSize: "0.82rem", color: "#66564A", lineHeight: 1.5,
            borderLeft: `3px solid ${color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Eye size={13} style={{ color: "#D35400" }} />
              <span style={{ fontWeight: 700, color: "#241A14", fontSize: "0.78rem" }}>AI Analysis</span>
            </div>
            {result.reasoning}
          </div>
        )}
      </div>
    );
  };

  const bothUploaded = idCard.uploaded && appForm.uploaded;

  return (
    <div style={{ marginTop: "4px" }}>
      {/* Header with 90%+ Auto-Approval Badge */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
        marginBottom: "14px", padding: "12px 14px",
        background: "linear-gradient(135deg, #241A14, #3D2B1F)",
        borderRadius: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldCheck size={20} style={{ color: "#FF8C42" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#FFFFFF" }}>
                AI Document & Signature Verification Engine
              </p>
              <span style={{
                fontSize: "0.7rem", padding: "2px 8px",
                background: "rgba(16, 185, 129, 0.2)", color: "#34D399",
                borderRadius: "999px", fontWeight: 700, border: "1px solid rgba(16, 185, 129, 0.4)",
              }}>
                Auto-approve at 90%+
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "0.74rem", color: "#C49A6C" }}>
              Upload your Signed Application Form and ID Card below. Signatures scoring ≥90% match are automatically approved.
            </p>
          </div>
        </div>
      </div>

      {/* Upload boxes: 1. Signed Application Form first, 2. ID Card second */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
        <UploadBox
          label="Signed Application Form"
          hint="Photo of your signed application form"
          docType="application_form"
          state={appForm}
          inputRef={appRef}
        />
        <UploadBox
          label="National ID / Student ID Card"
          hint="Photo of your ID card (front & back)"
          docType="id_card"
          state={idCard}
          inputRef={idRef}
        />
      </div>

      {/* Verify button */}
      {!result && (
        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={!bothUploaded || verifying}
          style={{
            width: "100%", padding: "13px",
            background: bothUploaded && !verifying
              ? "linear-gradient(135deg, #7C3AED, #9D4EDD)"
              : "rgba(196, 154, 108, 0.3)",
            color: bothUploaded ? "#FFFFFF" : "#8C7A6A",
            border: "none", borderRadius: "12px",
            fontWeight: 800, fontSize: "0.92rem", cursor: bothUploaded ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            boxShadow: bothUploaded && !verifying ? "0 4px 16px rgba(124, 58, 237, 0.25)" : "none",
            transition: "all 0.2s",
          }}
        >
          {verifying ? (
            <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Gemini AI is analyzing signatures & documents…</>
          ) : (
            <><Sparkles size={16} />
            {bothUploaded ? "Run AI Signature Match & Auto-Check ⚡" : "Upload both documents first"}</>
          )}
        </button>
      )}

      {/* Result */}
      <ResultPanel />

      {/* Re-verify button */}
      {result && result.ok && (
        <button
          type="button"
          onClick={() => { setResult(null); setIdCard({ ...EMPTY_DOC }); setAppForm({ ...EMPTY_DOC }); }}
          style={{
            marginTop: "10px", width: "100%", padding: "8px",
            background: "transparent", color: "#8C7A6A",
            border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px",
            fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
          }}
        >
          Re-upload & Verify Again
        </button>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
