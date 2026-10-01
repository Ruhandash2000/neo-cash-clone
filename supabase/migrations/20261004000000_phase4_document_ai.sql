-- ============================================================
-- Phase 4: Document Upload + AI Signature Verification
-- ============================================================

-- ── Document uploads table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.document_uploads (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  partial_app_id    uuid REFERENCES public.partial_payment_applications(id) ON DELETE SET NULL,
  doc_type          text NOT NULL CHECK (doc_type IN ('id_card', 'application_form')),
  storage_path      text NOT NULL,          -- Supabase storage path
  public_url        text,                    -- signed URL (refreshed on read)
  file_name         text NOT NULL,
  file_size_bytes   bigint,
  mime_type         text,
  uploaded_at       timestamptz DEFAULT now(),
  expires_at        timestamptz DEFAULT (now() + interval '90 days')
);

ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_own_docs" ON public.document_uploads
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "admin_view_docs" ON public.document_uploads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'head')
    )
  );

-- ── Signature verifications table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.signature_verifications (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partial_app_id      uuid NOT NULL REFERENCES public.partial_payment_applications(id) ON DELETE CASCADE,
  student_id          uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  id_card_doc_id      uuid REFERENCES public.document_uploads(id),
  application_doc_id  uuid REFERENCES public.document_uploads(id),
  similarity_score    numeric(5,2),           -- 0.00 to 100.00
  ai_verdict          text CHECK (ai_verdict IN ('verified', 'rejected', 'manual_review', 'pending')),
  ai_reasoning        text,                   -- Gemini's explanation
  ai_model            text DEFAULT 'gemini-1.5-flash',
  verified_at         timestamptz DEFAULT now(),
  reviewed_by         uuid REFERENCES public.profiles(id),
  admin_override      text CHECK (admin_override IN ('approved', 'rejected'))
);

ALTER TABLE public.signature_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_own_verif" ON public.signature_verifications
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "admin_view_verif" ON public.signature_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'head')
    )
  );

-- ── Add verification_status to partial_applications ───────────────────────────
ALTER TABLE public.partial_payment_applications
  ADD COLUMN IF NOT EXISTS signature_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS signature_score     numeric(5,2),
  ADD COLUMN IF NOT EXISTS id_card_doc_id      uuid REFERENCES public.document_uploads(id),
  ADD COLUMN IF NOT EXISTS application_doc_id  uuid REFERENCES public.document_uploads(id);

-- ── RPC: record signature verification result ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.record_signature_verification(
  p_partial_app_id      uuid,
  p_id_card_doc_id      uuid,
  p_application_doc_id  uuid,
  p_similarity_score    numeric,
  p_ai_verdict          text,
  p_ai_reasoning        text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id   uuid;
  v_uid  uuid := auth.uid();
BEGIN
  INSERT INTO public.signature_verifications (
    partial_app_id, student_id,
    id_card_doc_id, application_doc_id,
    similarity_score, ai_verdict, ai_reasoning
  ) VALUES (
    p_partial_app_id, v_uid,
    p_id_card_doc_id, p_application_doc_id,
    p_similarity_score, p_ai_verdict, p_ai_reasoning
  )
  RETURNING id INTO v_id;

  -- Update partial application with verification result
  UPDATE public.partial_payment_applications
  SET
    signature_verified   = (p_ai_verdict = 'verified'),
    signature_score      = p_similarity_score,
    id_card_doc_id       = p_id_card_doc_id,
    application_doc_id   = p_application_doc_id
  WHERE id = p_partial_app_id
    AND student_id = v_uid;

  RETURN v_id;
END;
$$;

-- ── Realtime ──────────────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE public.signature_verifications;
