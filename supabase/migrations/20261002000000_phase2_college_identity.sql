-- ============================================================
-- Phase 2: College Identity & Authentication
-- student_roster + email_domains + verification metadata
-- ============================================================

-- 1. student_roster — admin-uploaded CSV/Excel enrolment data
CREATE TABLE IF NOT EXISTS public.student_roster (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id    text NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  student_id        text NOT NULL,
  full_name         text NOT NULL,
  email             text NOT NULL,
  department        text NOT NULL DEFAULT '',
  class_year        text,
  section           text,
  semester          text,
  is_claimed        boolean NOT NULL DEFAULT false,  -- true once a user linked to this row
  claimed_by        uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  claimed_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (institution_id, student_id),
  UNIQUE (institution_id, email)
);

-- Index for fast email & student_id lookups
CREATE INDEX IF NOT EXISTS idx_roster_institution_email
  ON public.student_roster (institution_id, lower(email));
CREATE INDEX IF NOT EXISTS idx_roster_institution_sid
  ON public.student_roster (institution_id, student_id);

-- Auto-update updated_at
CREATE OR REPLACE TRIGGER trg_roster_updated_at
  BEFORE UPDATE ON public.student_roster
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Add email_domains array to institutions if missing
-- (column was already defined in Phase 1 migration; this is a no-op if it exists)
ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS email_domains text[] NOT NULL DEFAULT '{}';

-- 3. Add verification_method to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS verification_method text
    CHECK (verification_method IN ('email_domain','roster_match','oauth_sso','admin_manual'));

-- 4. Row-Level Security for student_roster
ALTER TABLE public.student_roster ENABLE ROW LEVEL SECURITY;

-- Admins and head of the same institution can read and upsert
CREATE POLICY "admin_read_roster" ON public.student_roster
  FOR SELECT
  USING (
    public.can_access_institution(institution_id)
    AND public.current_profile_role() IN ('admin', 'head', 'demo_controller')
  );

CREATE POLICY "admin_upsert_roster" ON public.student_roster
  FOR INSERT
  WITH CHECK (
    public.can_access_institution(institution_id)
    AND public.current_profile_role() IN ('admin', 'head')
  );

CREATE POLICY "admin_update_roster" ON public.student_roster
  FOR UPDATE
  USING (
    public.can_access_institution(institution_id)
    AND public.current_profile_role() IN ('admin', 'head')
  );

-- Students can read their own row (self-lookup during verification)
CREATE POLICY "student_read_own_roster" ON public.student_roster
  FOR SELECT
  USING (claimed_by = auth.uid());

-- 5. Seed email domains for the built-in institutions
-- (Domains are illustrative; real institutions would configure these in the admin panel)
UPDATE public.institutions SET email_domains = ARRAY['du.ac.bd', 'student.du.ac.bd']
  WHERE short_name = 'DU';

UPDATE public.institutions SET email_domains = ARRAY['buet.ac.bd', 'student.buet.ac.bd']
  WHERE short_name = 'BUET';

UPDATE public.institutions SET email_domains = ARRAY['northsouth.edu', 'student.northsouth.edu']
  WHERE short_name = 'NSU';

UPDATE public.institutions SET email_domains = ARRAY['bracu.ac.bd', 'g.bracu.ac.bd']
  WHERE short_name = 'BRAC';

UPDATE public.institutions SET email_domains = ARRAY['dcc.ac.bd', 'student.dcc.ac.bd']
  WHERE name ILIKE '%Dhaka City College%';

-- 6. Enrich institutions with OAuth / SSO config column (for future Phase 2C)
ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS oauth_google_domain text,
  ADD COLUMN IF NOT EXISTS oauth_microsoft_tenant text,
  ADD COLUMN IF NOT EXISTS sso_enabled boolean NOT NULL DEFAULT false;

-- 7. Realtime publication for roster claims (admin dashboard updates live)
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_roster;

-- 8. Helper function: mark a roster row as claimed
CREATE OR REPLACE FUNCTION public.claim_roster_row(
  p_institution_id text,
  p_student_id     text
) RETURNS void
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.student_roster
  SET
    is_claimed  = true,
    claimed_by  = auth.uid(),
    claimed_at  = now(),
    updated_at  = now()
  WHERE institution_id = p_institution_id
    AND student_id     = p_student_id;
END;
$$;
