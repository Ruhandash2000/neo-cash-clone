-- ============================================================
-- Phase 3: SSLCommerz Payment Gateway Integration
-- Tracks payment sessions from initiation through IPN callback
-- ============================================================

-- 1. SSLCommerz payment sessions — one row per gateway initiation
--    Tracks the full lifecycle: initiated → success / failed / cancelled
CREATE TABLE IF NOT EXISTS public.sslcommerz_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tran_id             text NOT NULL UNIQUE,             -- Our generated transaction ID sent to SSLCommerz
  session_key         text,                             -- SSLCommerz sessionkey returned on init
  user_id             uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id      text NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  purpose             text NOT NULL                     -- 'wallet_topup' | 'fee_payment'
    CHECK (purpose IN ('wallet_topup', 'fee_payment')),
  fee_id              uuid REFERENCES public.fees(id) ON DELETE SET NULL,
  amount              numeric(14,2) NOT NULL,           -- BDT
  currency            text NOT NULL DEFAULT 'BDT',
  status              text NOT NULL DEFAULT 'initiated' -- initiated | validated | failed | cancelled | refunded
    CHECK (status IN ('initiated', 'validated', 'failed', 'cancelled', 'refunded')),
  -- SSLCommerz IPN fields (populated on callback)
  val_id              text,                             -- SSLCommerz validation ID
  bank_tran_id        text,                             -- Bank transaction ID
  card_type           text,                             -- bKash / Visa / MasterCard etc
  store_amount        numeric(14,2),                    -- Amount received by store
  ipn_received_at     timestamptz,
  ipn_raw             jsonb,                            -- Full IPN payload for audit
  -- Refund
  refund_ref_id       text,
  refunded_amount     numeric(14,2),
  refunded_at         timestamptz,
  -- Linked transaction (set after successful validation)
  transaction_id      uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sslcz_user      ON public.sslcommerz_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sslcz_status    ON public.sslcommerz_sessions (status);
CREATE INDEX IF NOT EXISTS idx_sslcz_fee       ON public.sslcommerz_sessions (fee_id);

CREATE OR REPLACE TRIGGER trg_sslcz_updated_at
  BEFORE UPDATE ON public.sslcommerz_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. RLS — users can only see their own sessions; service_role handles IPN
ALTER TABLE public.sslcommerz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_read_own_sessions" ON public.sslcommerz_sessions
  FOR SELECT USING (user_id = auth.uid());

-- IPN endpoint runs as service_role (bypasses RLS) — no policy needed for INSERT/UPDATE

-- 3. Realtime — live payment status updates in the UI
ALTER PUBLICATION supabase_realtime ADD TABLE public.sslcommerz_sessions;

-- 4. Helper: credit wallet after successful payment
CREATE OR REPLACE FUNCTION public.credit_wallet_after_payment(
  p_user_id        uuid,
  p_institution_id text,
  p_amount         numeric,
  p_tran_id        text,
  p_val_id         text,
  p_card_type      text
) RETURNS uuid
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_wallet_id  uuid;
  v_txn_id     uuid;
BEGIN
  -- Find or create wallet
  SELECT id INTO v_wallet_id
  FROM public.wallets
  WHERE user_id = p_user_id AND institution_id = p_institution_id;

  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id, institution_id, balance, currency)
    VALUES (p_user_id, p_institution_id, 0, 'BDT')
    RETURNING id INTO v_wallet_id;
  END IF;

  -- Credit balance
  UPDATE public.wallets
  SET balance = balance + p_amount, updated_at = now()
  WHERE id = v_wallet_id;

  -- Record transaction
  INSERT INTO public.transactions (
    user_id, institution_id, amount, type,
    reference_id, receipt_number, payment_method, gateway_session
  ) VALUES (
    p_user_id, p_institution_id, p_amount, 'wallet_topup',
    p_val_id, p_tran_id, p_card_type, p_tran_id
  ) RETURNING id INTO v_txn_id;

  RETURN v_txn_id;
END;
$$;

-- 5. Helper: pay a fee from wallet
CREATE OR REPLACE FUNCTION public.pay_fee_from_gateway(
  p_user_id        uuid,
  p_fee_id         uuid,
  p_institution_id text,
  p_amount         numeric,
  p_tran_id        text,
  p_val_id         text,
  p_card_type      text
) RETURNS uuid
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_txn_id   uuid;
  v_fee_amt  numeric;
  v_fee_stat text;
BEGIN
  SELECT amount, status INTO v_fee_amt, v_fee_stat
  FROM public.fees WHERE id = p_fee_id AND user_id = p_user_id;

  IF v_fee_stat IN ('paid', 'approved') THEN
    RAISE EXCEPTION 'Fee is already paid.';
  END IF;

  -- Mark fee paid
  UPDATE public.fees
  SET
    status    = 'paid',
    paid_date = now(),
    updated_at = now()
  WHERE id = p_fee_id;

  -- Record transaction
  INSERT INTO public.transactions (
    user_id, institution_id, amount, type,
    fee_id, reference_id, receipt_number, payment_method, gateway_session
  ) VALUES (
    p_user_id, p_institution_id, p_amount, 'fee_payment',
    p_fee_id, p_val_id, p_tran_id, p_card_type, p_tran_id
  ) RETURNING id INTO v_txn_id;

  RETURN v_txn_id;
END;
$$;
