-- ============================================================
-- Phase 5: Analytics, Audit Logs & Security Hardening
-- ============================================================

-- ── Audit log — every sensitive action ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id      uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_email   text,
  action        text NOT NULL,        -- e.g. 'wallet.topup', 'fee.payment', 'partial.apply'
  entity_type   text,                 -- e.g. 'wallet', 'fee', 'transaction'
  entity_id     uuid,
  amount_bdt    numeric(12,2),
  metadata      jsonb DEFAULT '{}',
  ip_address    inet,
  user_agent    text,
  created_at    timestamptz DEFAULT now()
);

-- Ensure columns exist even if table was created earlier without them
ALTER TABLE public.audit_logs
  ADD COLUMN IF NOT EXISTS actor_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS actor_email text,
  ADD COLUMN IF NOT EXISTS action      text NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS entity_type text,
  ADD COLUMN IF NOT EXISTS entity_id   uuid,
  ADD COLUMN IF NOT EXISTS amount_bdt  numeric(12,2),
  ADD COLUMN IF NOT EXISTS metadata    jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS ip_address  inet,
  ADD COLUMN IF NOT EXISTS user_agent  text;



ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins and heads can read audit logs
DROP POLICY IF EXISTS "admin_read_audit" ON public.audit_logs;
CREATE POLICY "admin_read_audit" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('admin', 'head')
    )
  );


CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx  ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx    ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC);

-- ── Rate limiting table ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action       text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT date_trunc('minute', now()),
  request_count integer DEFAULT 1,
  UNIQUE (actor_id, action, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- ── RPC: check and increment rate limit ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_actor_id uuid,
  p_action   text,
  p_max_per_minute integer DEFAULT 10
)
RETURNS boolean   -- true = allowed, false = rate limited
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz := date_trunc('minute', now());
  v_count  integer;
BEGIN
  INSERT INTO public.rate_limits (actor_id, action, window_start, request_count)
  VALUES (p_actor_id, p_action, v_window, 1)
  ON CONFLICT (actor_id, action, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_max_per_minute;
END;
$$;

-- ── RPC: log audit event ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action       text,
  p_entity_type  text  DEFAULT NULL,
  p_entity_id    uuid  DEFAULT NULL,
  p_amount_bdt   numeric DEFAULT NULL,
  p_metadata     jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id       uuid;
  v_actor_id uuid := auth.uid();
  v_email    text;
BEGIN
  SELECT email INTO v_email FROM auth.users WHERE id = v_actor_id;

  INSERT INTO public.audit_logs (
    actor_id, actor_email, action,
    entity_type, entity_id,
    amount_bdt, metadata
  ) VALUES (
    v_actor_id, v_email, p_action,
    p_entity_type, p_entity_id,
    p_amount_bdt, p_metadata
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- ── Analytics view: daily transaction summary ─────────────────────────────────
CREATE OR REPLACE VIEW public.analytics_daily_transactions AS
SELECT
  date_trunc('day', occurred_at AT TIME ZONE 'Asia/Dhaka')::date       AS day,
  COUNT(*)                                                              AS total_count,
  SUM(amount)                                                           AS total_amount,
  COUNT(*) FILTER (WHERE kind IN ('topup','refund','donation','salary')) AS credit_count,
  SUM(amount) FILTER (WHERE kind IN ('topup','refund','donation'))       AS credit_amount,
  COUNT(*) FILTER (WHERE kind IN ('fee_payment','partial_payment'))     AS debit_count,
  SUM(amount) FILTER (WHERE kind IN ('fee_payment','partial_payment'))  AS debit_amount,
  COUNT(*) FILTER (WHERE status = 'completed')                          AS completed_count,
  COUNT(*) FILTER (WHERE status = 'failed')                             AS failed_count
FROM public.transactions
GROUP BY 1
ORDER BY 1 DESC;

-- ── Analytics view: institution fee summary ───────────────────────────────────
CREATE OR REPLACE VIEW public.analytics_fee_summary AS
SELECT
  i.name                                                              AS institution_name,
  i.id                                                                AS institution_code,
  COUNT(DISTINCT f.id)                                                AS total_fee_categories,
  COUNT(DISTINCT f.user_id)                                           AS total_students_with_fees,
  COALESCE(SUM(f.amount), 0)                                         AS total_fees_due,
  COALESCE(SUM(CASE WHEN f.status = 'paid' THEN f.amount ELSE 0 END), 0) AS total_fees_paid,
  COALESCE(SUM(CASE WHEN f.status IN ('due','overdue','pending_partial','partial_approved') THEN f.amount ELSE 0 END), 0) AS total_fees_outstanding,
  ROUND(
    COALESCE(SUM(CASE WHEN f.status = 'paid' THEN f.amount ELSE 0 END), 0)::numeric
    / NULLIF(SUM(f.amount), 0) * 100, 1
  )                                                                   AS collection_rate_pct
FROM public.institutions i
LEFT JOIN public.fees f ON f.institution_id = i.id
GROUP BY i.id, i.name;

-- ── Analytics view: wallet stats ─────────────────────────────────────────────
CREATE OR REPLACE VIEW public.analytics_wallet_stats AS
SELECT
  COUNT(*)                                                  AS total_wallets,
  COALESCE(SUM(wallet_balance), 0)                         AS total_balance,
  COALESCE(AVG(wallet_balance), 0)                         AS avg_balance,
  COALESCE(MAX(wallet_balance), 0)                         AS max_balance,
  COUNT(*) FILTER (WHERE wallet_balance = 0)                AS zero_balance_count,
  COUNT(*) FILTER (WHERE wallet_balance > 0)                AS active_wallets,
  COUNT(*) FILTER (WHERE wallet_balance > 1000)             AS high_balance_count,
  COALESCE(SUM(available_balance), 0)                      AS total_available_balance,
  COALESCE(SUM(wallet_balance), 0)                         AS total_wallet_balance
FROM public.wallets;



-- ── Analytics view: signature verification summary ───────────────────────────
CREATE OR REPLACE VIEW public.analytics_signature_stats AS
SELECT
  COUNT(*)                                                    AS total_verifications,
  COUNT(*) FILTER (WHERE ai_verdict = 'verified')             AS verified_count,
  COUNT(*) FILTER (WHERE ai_verdict = 'rejected')             AS rejected_count,
  COUNT(*) FILTER (WHERE ai_verdict = 'manual_review')        AS manual_review_count,
  ROUND(AVG(similarity_score), 1)                             AS avg_similarity_score,
  COUNT(*) FILTER (WHERE similarity_score >= 75)              AS high_confidence_count,
  COUNT(*) FILTER (WHERE admin_override = 'approved')         AS admin_approved_count,
  COUNT(*) FILTER (WHERE admin_override = 'rejected')         AS admin_rejected_count
FROM public.signature_verifications;

-- ── Realtime ──────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'audit_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_logs;
  END IF;
END $$;
