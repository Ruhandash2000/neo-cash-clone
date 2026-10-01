-- ============================================================
-- Phase 6: Notifications + Email Queue + PDF Receipts
-- ============================================================

-- ── In-app notifications ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN (
    'payment_success', 'payment_failed', 'fee_due', 'fee_overdue',
    'partial_approved', 'partial_rejected', 'partial_pending',
    'wallet_topup', 'signature_verified', 'signature_rejected',
    'admin_message', 'system'
  )),
  title        text NOT NULL,
  body         text NOT NULL,
  icon         text DEFAULT '🔔',
  action_url   text,                     -- deep link inside app
  entity_type  text,                     -- 'transaction', 'fee', 'partial_application'
  entity_id    uuid,
  is_read      boolean DEFAULT false,
  read_at      timestamptz,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_own_notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx   ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx   ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- ── Email queue (processed by Edge Function) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_queue (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email     text NOT NULL,
  to_name      text,
  subject      text NOT NULL,
  template     text NOT NULL,       -- template key
  payload      jsonb DEFAULT '{}',  -- template variables
  status       text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  attempts     integer DEFAULT 0,
  last_error   text,
  scheduled_at timestamptz DEFAULT now(),
  sent_at      timestamptz,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_email_queue" ON public.email_queue
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','head'))
  );

-- ── PDF receipts storage index ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.receipts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id  uuid REFERENCES public.transactions(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receipt_number  text UNIQUE NOT NULL,
  storage_path    text,                   -- Supabase Storage path
  amount_bdt      numeric(12,2),
  receipt_type    text DEFAULT 'payment', -- 'payment' | 'topup' | 'fee'
  generated_at    timestamptz DEFAULT now()
);

ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_own_receipts" ON public.receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admin_view_receipts" ON public.receipts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','head'))
  );

-- ── RPC: create notification ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id     uuid,
  p_type        text,
  p_title       text,
  p_body        text,
  p_icon        text    DEFAULT '🔔',
  p_action_url  text    DEFAULT NULL,
  p_entity_type text    DEFAULT NULL,
  p_entity_id   uuid    DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, body, icon, action_url, entity_type, entity_id
  ) VALUES (
    p_user_id, p_type, p_title, p_body, p_icon, p_action_url, p_entity_type, p_entity_id
  ) RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- ── RPC: mark notifications read ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.mark_notifications_read(
  p_notification_ids uuid[] DEFAULT NULL   -- NULL = mark all
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_count integer;
BEGIN
  UPDATE public.notifications
  SET is_read = true, read_at = now()
  WHERE user_id = auth.uid()
    AND is_read = false
    AND (p_notification_ids IS NULL OR id = ANY(p_notification_ids));
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- ── Trigger: auto-notify on payment success ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.trigger_payment_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Notify on completed credit (wallet top-up)
  IF NEW.status = 'completed' AND NEW.kind IN ('topup','refund','donation') AND
     (OLD IS NULL OR OLD.status != 'completed') THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'wallet_topup',
      'Wallet Top-Up Successful ✅',
      '৳' || NEW.amount::text || ' has been added to your wallet.',
      '💰',
      NULL,
      'transaction',
      NEW.id
    );
  END IF;

  -- Notify on failed payment
  IF NEW.status = 'failed' AND (OLD IS NULL OR OLD.status != 'failed') THEN
    PERFORM public.create_notification(
      NEW.user_id,
      'payment_failed',
      'Payment Failed ❌',
      'Your payment of ৳' || NEW.amount::text || ' could not be processed.',
      '❌',
      NULL,
      'transaction',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_transaction_status_change ON public.transactions;
CREATE TRIGGER on_transaction_status_change
  AFTER INSERT OR UPDATE OF status ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_payment_notification();

-- ── Trigger: auto-notify on partial application status change ─────────────────
CREATE OR REPLACE FUNCTION public.trigger_partial_app_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status != COALESCE(OLD.status, '') THEN
    PERFORM public.create_notification(
      NEW.student_id,
      CASE NEW.status
        WHEN 'approved'  THEN 'partial_approved'
        WHEN 'rejected'  THEN 'partial_rejected'
        ELSE 'partial_pending'
      END,
      CASE NEW.status
        WHEN 'approved'  THEN 'Partial Payment Approved ✅'
        WHEN 'rejected'  THEN 'Partial Payment Rejected ❌'
        WHEN 'under_review' THEN 'Application Under Review 🔍'
        ELSE 'Application Status Updated'
      END,
      CASE NEW.status
        WHEN 'approved'  THEN 'Your partial payment application has been approved.'
        WHEN 'rejected'  THEN 'Your partial payment application was not approved.'
        ELSE 'Your application status has been updated to: ' || NEW.status
      END,
      CASE NEW.status WHEN 'approved' THEN '✅' WHEN 'rejected' THEN '❌' ELSE '📋' END,
      NULL,
      'partial_application',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_partial_app_status_change ON public.partial_payment_applications;
CREATE TRIGGER on_partial_app_status_change
  AFTER UPDATE OF status ON public.partial_payment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_partial_app_notification();

-- ── Realtime ──────────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'email_queue'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.email_queue;
  END IF;
END $$;
