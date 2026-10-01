-- =============================================================================
-- Neo Cash AI — Phase 1: Full Production Schema Migration
-- Extends the existing schema with all missing tables, columns, RPCs,
-- Storage buckets, and Realtime publications for the financial data layer.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. INSTITUTIONS
-- ---------------------------------------------------------------------------
create table if not exists public.institutions (
  id            text primary key,                        -- e.g. 'dhaka-city-college'
  name          text not null,
  short_name    text,
  type          text not null default 'College',         -- College, University, Polytechnic
  location      text,
  logo_url      text,
  email_domains text[] not null default '{}',            -- e.g. '{dcc.edu.bd}'
  is_verified   boolean not null default false,
  is_active     boolean not null default true,
  contact_email text,
  contact_phone text,
  website_url   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger update_institutions_updated_at before update on public.institutions
  for each row execute function public.update_updated_at_column();

-- Public read — students need to search institutions during onboarding
alter table public.institutions enable row level security;
grant select on public.institutions to authenticated, anon;
create policy institutions_public_read on public.institutions for select using (true);
-- Only service_role / admin can mutate institutions
grant all on public.institutions to service_role;

-- Seed with demo institution
insert into public.institutions (id, name, short_name, type, location, logo_url, email_domains, is_verified, contact_email, website_url)
values
  ('dhaka-city-college',    'Dhaka City College',          'DCC',  'Collegiate University', 'Dhanmondi, Dhaka',   null, '{dcc.edu.bd}',     true,  'admin@dcc.edu.bd',     'https://www.dcc.edu.bd'),
  ('buet',                   'Bangladesh University of Engineering and Technology', 'BUET', 'University', 'Palashi, Dhaka',   null, '{buet.ac.bd}',    true,  'admin@buet.ac.bd',    'https://www.buet.ac.bd'),
  ('dhaka-university',       'University of Dhaka',         'DU',   'University',            'Nilkhet, Dhaka',     null, '{du.ac.bd}',       true,  'admin@du.ac.bd',      'https://www.du.ac.bd'),
  ('nsu',                    'North South University',      'NSU',  'Private University',    'Bashundhara, Dhaka', null, '{northsouth.edu}', true,  'admin@northsouth.edu', 'https://www.northsouth.edu'),
  ('brac-university',        'BRAC University',             'BRACU','Private University',    'Mohakhali, Dhaka',   null, '{bracu.ac.bd}',    true,  'admin@bracu.ac.bd',   'https://www.bracu.ac.bd')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. EXTEND EXISTING TABLES WITH MISSING COLUMNS
-- ---------------------------------------------------------------------------

-- profiles — add student_id (college roll number), cgpa, phone, avatar_url
alter table public.profiles
  add column if not exists student_id   text,
  add column if not exists email        text,
  add column if not exists cgpa         numeric(3,2),
  add column if not exists phone        text,
  add column if not exists avatar_url   text,
  add column if not exists department   text,
  add column if not exists class_year   text,
  add column if not exists section      text,
  add column if not exists semester     text,
  add column if not exists session_year text,
  add column if not exists is_verified  boolean not null default false;

-- fees — add richer fields that exist in the store model
alter table public.fees
  add column if not exists original_amount      numeric(14,2),
  add column if not exists issued_date          date,
  add column if not exists paid_date            timestamptz,
  add column if not exists category             text not null default 'Tuition',
  add column if not exists description          text,
  add column if not exists partial_allowed      boolean not null default false,
  add column if not exists approved_partial_amt numeric(14,2),
  add column if not exists updated_at           timestamptz not null default now();

create trigger update_fees_updated_at before update on public.fees
  for each row execute function public.update_updated_at_column();

-- transactions — extend with receipt/reference fields
alter table public.transactions
  add column if not exists type            text not null default 'fee_payment',
  add column if not exists reference_id    text,
  add column if not exists receipt_number  text,
  add column if not exists fee_id          uuid references public.fees(id) on delete set null,
  add column if not exists payment_method  text,
  add column if not exists gateway_session text,        -- SSLCommerz tran_id
  add column if not exists updated_at      timestamptz not null default now();

create trigger update_transactions_updated_at before update on public.transactions
  for each row execute function public.update_updated_at_column();

-- partial_payment_applications — add all fields from the store model
alter table public.partial_payment_applications
  add column if not exists student_name              text,
  add column if not exists student_college_id        text,
  add column if not exists fee_title                 text,
  add column if not exists original_amount           numeric(14,2),
  add column if not exists approved_amount           numeric(14,2),
  add column if not exists remaining_amount          numeric(14,2),
  add column if not exists new_deadline              date,
  add column if not exists reason                    text,
  add column if not exists hardship_statement        text,
  add column if not exists guardian_name             text,
  add column if not exists guardian_phone            text,
  add column if not exists guardian_nid_doc_path     text,     -- Supabase Storage path
  add column if not exists guardian_signature_path   text,     -- Supabase Storage path
  add column if not exists student_signature_path    text,     -- Supabase Storage path
  add column if not exists ai_match_score            integer,
  add column if not exists ai_match_status           text,
  add column if not exists admin_notes               text,
  add column if not exists head_notes                text,
  add column if not exists rejection_reason          text,
  add column if not exists change_request_notes      text,
  add column if not exists submitted_at              timestamptz,
  add column if not exists reviewed_by_admin_id      uuid references public.profiles(id) on delete set null,
  add column if not exists reviewed_by_head_id       uuid references public.profiles(id) on delete set null;

-- notifications — add event_type + category
alter table public.notifications
  add column if not exists event_type   text,
  add column if not exists category     text default 'system',
  add column if not exists email_alert  boolean not null default false,
  add column if not exists updated_at   timestamptz not null default now();

create trigger update_notifications_updated_at before update on public.notifications
  for each row execute function public.update_updated_at_column();

-- wallets — add currency, add updated_at trigger
create trigger update_wallets_updated_at before update on public.wallets
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- 3. ACADEMIC STRUCTURE
-- ---------------------------------------------------------------------------
create table if not exists public.academic_departments (
  id              uuid primary key default gen_random_uuid(),
  institution_id  text not null references public.institutions(id) on delete cascade,
  code            text not null,
  name            text not null,
  head_name       text,
  total_students  integer not null default 0,
  created_at      timestamptz not null default now(),
  unique (institution_id, code)
);

create table if not exists public.academic_classes (
  id              uuid primary key default gen_random_uuid(),
  institution_id  text not null references public.institutions(id) on delete cascade,
  department_code text not null,
  name            text not null,
  year            text not null,
  semester        text not null,
  total_sections  integer not null default 1,
  total_students  integer not null default 0,
  created_at      timestamptz not null default now()
);

create table if not exists public.academic_sections (
  id              uuid primary key default gen_random_uuid(),
  institution_id  text not null references public.institutions(id) on delete cascade,
  department_code text not null,
  class_year      text not null,
  name            text not null,
  capacity        integer not null default 60,
  current_count   integer not null default 0,
  created_at      timestamptz not null default now()
);

alter table public.academic_departments enable row level security;
alter table public.academic_classes     enable row level security;
alter table public.academic_sections    enable row level security;

grant select on public.academic_departments, public.academic_classes, public.academic_sections to authenticated;
grant all on public.academic_departments, public.academic_classes, public.academic_sections to service_role;

create policy academic_institution_select on public.academic_departments for select
  using (public.can_access_institution(institution_id) or
         institution_id = public.current_profile_institution());
create policy academic_institution_select on public.academic_classes for select
  using (public.can_access_institution(institution_id) or
         institution_id = public.current_profile_institution());
create policy academic_institution_select on public.academic_sections for select
  using (public.can_access_institution(institution_id) or
         institution_id = public.current_profile_institution());

-- ---------------------------------------------------------------------------
-- 4. STUDENT DIRECTORY (admin-visible roster keyed to institution)
-- ---------------------------------------------------------------------------
-- The profiles table IS the student record; we create a view for admins
-- that joins profiles with wallets and fees aggregates.
create or replace view public.student_directory as
  select
    p.id,
    p.full_name        as name,
    p.student_id,
    p.department,
    p.class_year,
    p.section,
    p.semester,
    p.email            as email,
    p.phone,
    p.institution_id,
    p.is_verified,
    p.onboarding_completed,
    coalesce(w.wallet_balance, 0)     as wallet_balance,
    coalesce(w.available_balance, 0)  as available_balance,
    coalesce(
      (select sum(f.amount) from public.fees f
        where f.user_id = p.id and f.status in ('due','overdue','pending_partial','partial_approved')),
      0
    ) as total_dues,
    coalesce(
      (select count(*)::int from public.fees f
        where f.user_id = p.id and f.status = 'overdue'),
      0
    ) as overdue_count,
    p.created_at
  from public.profiles p
  left join public.wallets w on w.user_id = p.id
  where p.role = 'student';

grant select on public.student_directory to authenticated;

-- ---------------------------------------------------------------------------
-- 5. DONATION & LEADERBOARD
-- ---------------------------------------------------------------------------
create table if not exists public.donations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null,
  amount         numeric(14,2) not null,
  points_awarded integer not null default 0,   -- amount / 100
  message        text,
  transaction_id uuid references public.transactions(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists donations_user_id_idx on public.donations(user_id);
create index if not exists donations_institution_idx on public.donations(institution_id);

alter table public.donations enable row level security;
grant select, insert on public.donations to authenticated;
grant all on public.donations to service_role;

create policy donations_own_or_staff on public.donations for select
  using (user_id = auth.uid() or public.can_access_institution(institution_id));
create policy donations_own_insert on public.donations for insert
  with check (user_id = auth.uid());

-- Leaderboard view — aggregated donation points per user
create or replace view public.donation_leaderboard as
  select
    p.id              as user_id,
    p.full_name       as name,
    p.institution_id,
    p.department,
    p.class_year,
    p.section,
    coalesce(sum(d.amount), 0)         as total_donated,
    coalesce(sum(d.points_awarded), 0) as total_points,
    rank() over (
      partition by p.institution_id, p.class_year, p.section
      order by sum(d.points_awarded) desc
    ) as rank_class,
    rank() over (
      partition by p.institution_id, p.department
      order by sum(d.points_awarded) desc
    ) as rank_dept,
    rank() over (
      partition by p.institution_id
      order by sum(d.points_awarded) desc
    ) as rank_institution,
    rank() over (order by sum(d.points_awarded) desc) as rank_national
  from public.profiles p
  left join public.donations d on d.user_id = p.id
  where p.role = 'student'
  group by p.id, p.full_name, p.institution_id, p.department, p.class_year, p.section;

grant select on public.donation_leaderboard to authenticated;

-- ---------------------------------------------------------------------------
-- 6. AUDIT LOGS (6-dimension SHA-256 cryptographic ledger)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id                    uuid primary key default gen_random_uuid(),
  institution_id        text not null,
  actor_user_id         uuid references public.profiles(id) on delete set null,
  actor_name            text not null,
  actor_role            text not null,       -- Student | Admin | Head | System
  action_type           text not null,       -- fee_assignment | head_approval | payment | etc.
  action_description    text not null,
  target_student_id     uuid references public.profiles(id) on delete set null,
  target_student_name   text,
  target_student_college_id text,
  financial_record_title text,
  before_value          text,
  after_value           text,
  sha256_hash           text,               -- hex digest of canonical payload
  created_at            timestamptz not null default now()
);

create index if not exists audit_logs_institution_idx on public.audit_logs(institution_id);
create index if not exists audit_logs_created_at_idx  on public.audit_logs(created_at desc);

alter table public.audit_logs enable row level security;
grant select on public.audit_logs to authenticated;
grant all on public.audit_logs to service_role;

create policy audit_logs_institution_read on public.audit_logs for select
  using (public.can_access_institution(institution_id) or actor_user_id = auth.uid());
-- Audit logs are immutable: only service_role inserts them via RPCs
-- No authenticated insert policy — writes go through security-definer functions only

-- ---------------------------------------------------------------------------
-- 7. ESCALATION TICKETS (AI Support → Human Admin queue)
-- ---------------------------------------------------------------------------
create table if not exists public.escalation_tickets (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null,
  subject        text not null,
  status         text not null default 'open',   -- open | in_progress | resolved
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  last_reply_at  timestamptz not null default now()
);

create table if not exists public.escalation_messages (
  id         uuid primary key default gen_random_uuid(),
  ticket_id  uuid not null references public.escalation_tickets(id) on delete cascade,
  sender_id  uuid references public.profiles(id) on delete set null,
  sender_role text not null default 'student',   -- student | ai | admin
  sender_name text not null,
  text       text not null,
  action_type text,                              -- apply_partial | pay_fee | view_receipt
  created_at  timestamptz not null default now()
);

create index if not exists escalation_tickets_user_idx on public.escalation_tickets(user_id);
create index if not exists escalation_messages_ticket_idx on public.escalation_messages(ticket_id);

alter table public.escalation_tickets  enable row level security;
alter table public.escalation_messages enable row level security;
grant select, insert, update on public.escalation_tickets  to authenticated;
grant select, insert         on public.escalation_messages to authenticated;
grant all on public.escalation_tickets, public.escalation_messages to service_role;

create policy escalation_tickets_own_or_staff on public.escalation_tickets for select
  using (user_id = auth.uid() or public.can_access_institution(institution_id));
create policy escalation_tickets_own_insert on public.escalation_tickets for insert
  with check (user_id = auth.uid());
create policy escalation_tickets_own_or_staff_update on public.escalation_tickets for update
  using (user_id = auth.uid() or public.can_access_institution(institution_id));
create policy escalation_messages_ticket_select on public.escalation_messages for select
  using (
    exists (
      select 1 from public.escalation_tickets t
      where t.id = ticket_id
        and (t.user_id = auth.uid() or public.can_access_institution(t.institution_id))
    )
  );
create policy escalation_messages_insert on public.escalation_messages for insert
  with check (
    exists (
      select 1 from public.escalation_tickets t
      where t.id = ticket_id
        and (t.user_id = auth.uid() or public.can_access_institution(t.institution_id))
    )
  );

-- ---------------------------------------------------------------------------
-- 8. REMINDER RULES (admin-configured per institution)
-- ---------------------------------------------------------------------------
create table if not exists public.reminder_rules (
  id                        uuid primary key default gen_random_uuid(),
  institution_id            text not null unique references public.institutions(id) on delete cascade,
  weekly_reminder_enabled   boolean not null default true,
  near_deadline_days        integer not null default 3,
  final_day_alert_enabled   boolean not null default true,
  overdue_penalty_notice    boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create trigger update_reminder_rules_updated_at before update on public.reminder_rules
  for each row execute function public.update_updated_at_column();

alter table public.reminder_rules enable row level security;
grant select, insert, update on public.reminder_rules to authenticated;
grant all on public.reminder_rules to service_role;

create policy reminder_rules_institution_access on public.reminder_rules for select
  using (public.can_access_institution(institution_id) or institution_id = public.current_profile_institution());
create policy reminder_rules_admin_mutate on public.reminder_rules for insert
  with check (public.can_access_institution(institution_id));
create policy reminder_rules_admin_update on public.reminder_rules for update
  using (public.can_access_institution(institution_id));

-- ---------------------------------------------------------------------------
-- 9. IMPORT LOGS (CSV/Excel batch imports by admin)
-- ---------------------------------------------------------------------------
create table if not exists public.import_logs (
  id               uuid primary key default gen_random_uuid(),
  institution_id   text not null,
  admin_user_id    uuid not null references public.profiles(id) on delete cascade,
  admin_name       text not null,
  file_name        text not null,
  imported_count   integer not null default 0,
  rejected_count   integer not null default 0,
  warning_count    integer not null default 0,
  status           text not null default 'Completed',  -- Completed | Partial Success | Failed
  error_details    jsonb,
  created_at       timestamptz not null default now()
);

alter table public.import_logs enable row level security;
grant select, insert on public.import_logs to authenticated;
grant all on public.import_logs to service_role;

create policy import_logs_institution_access on public.import_logs for select
  using (public.can_access_institution(institution_id));
create policy import_logs_admin_insert on public.import_logs for insert
  with check (public.can_access_institution(institution_id) and admin_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 10. SSLCOMMERZ PAYMENT SESSIONS (tracks gateway round-trips)
-- ---------------------------------------------------------------------------
create table if not exists public.sslcommerz_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  institution_id    text not null,
  tran_id           text not null unique,       -- SSLCommerz transaction ID
  purpose           text not null,              -- wallet_topup | fee_payment | donation
  fee_id            uuid references public.fees(id) on delete set null,
  amount            numeric(14,2) not null,
  currency          text not null default 'BDT',
  status            text not null default 'initiated', -- initiated|success|failed|cancelled
  gateway_response  jsonb,                      -- raw IPN payload stored for audit
  val_id            text,                       -- SSLCommerz val_id for validation
  bank_tran_id      text,
  card_type         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists sslcommerz_tran_id_idx on public.sslcommerz_sessions(tran_id);
create index if not exists sslcommerz_user_id_idx  on public.sslcommerz_sessions(user_id);

create trigger update_sslcommerz_sessions_updated_at before update on public.sslcommerz_sessions
  for each row execute function public.update_updated_at_column();

alter table public.sslcommerz_sessions enable row level security;
grant select, insert on public.sslcommerz_sessions to authenticated;
grant all on public.sslcommerz_sessions to service_role;

create policy sslcommerz_own_select on public.sslcommerz_sessions for select
  using (user_id = auth.uid() or public.can_access_institution(institution_id));
create policy sslcommerz_own_insert on public.sslcommerz_sessions for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 11. STORAGE BUCKETS (for document uploads)
-- ---------------------------------------------------------------------------
-- Note: bucket creation must be done via the Supabase dashboard or CLI.
-- The policies below assume buckets named 'partial-applications' and 'avatars'.
-- Run: supabase storage create partial-applications --public=false
-- Run: supabase storage create avatars --public=true

-- Storage RLS policies for partial-applications bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('partial-applications', 'partial-applications', false, 10485760,
   array['image/jpeg','image/png','image/webp','application/pdf']),
  ('avatars', 'avatars', true, 2097152,
   array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Storage policies for partial-applications (private documents)
create policy "Students upload their own documents"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'partial-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owners and institution staff can view documents"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'partial-applications'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.can_access_institution((storage.foldername(name))[2])
    )
  );

create policy "Owners can delete their own documents"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'partial-applications'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for avatars (public read)
create policy "Anyone can view avatars"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'avatars');

create policy "Users upload their own avatar"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own avatar"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- 12. CORE RPCs — Financial Operations
-- ---------------------------------------------------------------------------

-- RPC: Create wallet on first onboarding (called by server after complete_student_onboarding)
create or replace function public.ensure_student_wallet(p_institution_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.wallets (user_id, institution_id, available_balance, wallet_balance)
  values (auth.uid(), p_institution_id, 0, 0)
  on conflict (user_id) do nothing;
end;
$$;
grant execute on function public.ensure_student_wallet(text) to authenticated;

-- RPC: Top-up wallet (called by server after successful SSLCommerz IPN)
-- This runs as SECURITY DEFINER — only the server can call it with service key.
create or replace function public.credit_wallet(
  p_user_id     uuid,
  p_amount      numeric,
  p_session_id  uuid
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_institution text;
  v_ref_id text;
  v_receipt text;
begin
  select institution_id into v_institution from public.profiles where id = p_user_id;
  v_ref_id   := 'SSL-' || upper(left(gen_random_uuid()::text, 8));
  v_receipt  := 'REC-' || floor(100000 + random() * 899999)::text;

  update public.wallets
  set wallet_balance    = wallet_balance + p_amount,
      available_balance = available_balance + p_amount
  where user_id = p_user_id;

  insert into public.transactions (user_id, institution_id, title, amount, kind, status,
      type, reference_id, receipt_number, gateway_session, occurred_at)
  values (p_user_id, v_institution, 'Wallet Top-Up via SSLCommerz', p_amount,
      'credit', 'Success', 'wallet', v_ref_id, v_receipt, p_session_id::text, now());

  insert into public.notifications (user_id, title, body, event_type, category)
  values (p_user_id,
    'Wallet Credited Successfully',
    '৳' || p_amount || ' has been added to your Neo Cash wallet.',
    'payment_success', 'payment');
end;
$$;
grant execute on function public.credit_wallet(uuid, numeric, uuid) to service_role;

-- RPC: Pay fee from wallet balance
create or replace function public.pay_fee_from_wallet(
  p_fee_id  uuid,
  p_amount  numeric        -- may differ from fee.amount for partial installment
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_fee         public.fees%rowtype;
  v_wallet      public.wallets%rowtype;
  v_ref_id      text;
  v_receipt     text;
  v_txn_id      uuid;
begin
  -- Lock and validate fee ownership
  select * into v_fee from public.fees
  where id = p_fee_id and user_id = auth.uid() for update;

  if not found then
    raise exception 'Fee not found or access denied';
  end if;
  if v_fee.status = 'paid' then
    raise exception 'Fee is already paid';
  end if;

  -- Lock wallet
  select * into v_wallet from public.wallets
  where user_id = auth.uid() for update;

  if v_wallet.available_balance < p_amount then
    raise exception 'Insufficient wallet balance';
  end if;

  v_ref_id  := 'NCW-' || upper(left(gen_random_uuid()::text, 8));
  v_receipt := 'REC-' || floor(100000 + random() * 899999)::text;

  -- Deduct wallet
  update public.wallets
  set available_balance = available_balance - p_amount,
      wallet_balance    = wallet_balance - p_amount
  where user_id = auth.uid();

  -- Mark fee paid (or reduce amount for partial)
  if p_amount >= v_fee.amount then
    update public.fees
    set status = 'paid', amount = 0, paid_date = now()
    where id = p_fee_id;
  else
    update public.fees
    set amount = amount - p_amount
    where id = p_fee_id;
  end if;

  -- Create transaction record
  insert into public.transactions
    (user_id, institution_id, title, amount, kind, status,
     type, reference_id, receipt_number, fee_id, occurred_at)
  values
    (auth.uid(), v_fee.institution_id, 'Fee Payment: ' || v_fee.title, p_amount,
     'debit', 'Success', 'fee_payment', v_ref_id, v_receipt, p_fee_id, now())
  returning id into v_txn_id;

  -- Notification
  insert into public.notifications (user_id, title, body, event_type, category)
  values (auth.uid(),
    'Payment Successful',
    'You paid ৳' || p_amount || ' for ' || v_fee.title || '. Receipt: ' || v_receipt,
    'payment_success', 'payment');

  -- Audit log entry (inserted by service_role function scope)
  insert into public.audit_logs
    (institution_id, actor_user_id, actor_name, actor_role,
     action_type, action_description, target_student_id,
     financial_record_title, before_value, after_value)
  select
    v_fee.institution_id, auth.uid(), p.full_name, 'Student',
    'payment', 'Student paid fee via wallet',
    auth.uid(), v_fee.title,
    '৳' || v_fee.amount, '৳' || (v_fee.amount - p_amount)
  from public.profiles p where p.id = auth.uid();

  return jsonb_build_object(
    'receipt_number', v_receipt,
    'reference_id', v_ref_id,
    'transaction_id', v_txn_id
  );
end;
$$;
grant execute on function public.pay_fee_from_wallet(uuid, numeric) to authenticated;

-- RPC: Admin assigns fee to cohort (department + class + semester)
create or replace function public.assign_fees_to_cohort(
  p_institution_id  text,
  p_title           text,
  p_amount          numeric,
  p_due_date        date,
  p_category        text,
  p_description     text,
  p_department      text default null,
  p_class_year      text default null,
  p_semester        text default null
) returns integer language plpgsql security definer set search_path = public as $$
declare
  v_count integer := 0;
  v_student record;
begin
  if not public.can_access_institution(p_institution_id) then
    raise exception 'Access denied';
  end if;

  for v_student in
    select id from public.profiles
    where institution_id = p_institution_id
      and role = 'student'
      and (p_department is null or department = p_department)
      and (p_class_year is null or class_year = p_class_year)
      and (p_semester   is null or semester   = p_semester)
  loop
    insert into public.fees
      (user_id, institution_id, title, amount, original_amount, due_date,
       issued_date, category, description, status)
    values
      (v_student.id, p_institution_id, p_title, p_amount, p_amount,
       p_due_date, current_date, p_category, p_description, 'due');

    insert into public.notifications (user_id, title, body, event_type, category)
    values (v_student.id,
      'New Fee Assigned: ' || p_title,
      'A new fee of ৳' || p_amount || ' has been assigned. Due: ' || p_due_date::text,
      'fee_assigned', 'fee');

    v_count := v_count + 1;
  end loop;

  insert into public.audit_logs
    (institution_id, actor_user_id, actor_name, actor_role,
     action_type, action_description, financial_record_title, after_value)
  select p_institution_id, auth.uid(), p.full_name, 'Admin',
    'fee_assignment',
    'Bulk fee assigned to ' || v_count || ' students: ' || p_title,
    p_title, '৳' || p_amount
  from public.profiles p where p.id = auth.uid();

  return v_count;
end;
$$;
grant execute on function public.assign_fees_to_cohort(text,text,numeric,date,text,text,text,text,text) to authenticated;

-- RPC: Admin forwards partial application to head
create or replace function public.forward_partial_to_head(
  p_application_id  uuid,
  p_admin_notes     text default null
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_app  public.partial_payment_applications%rowtype;
begin
  select * into v_app from public.partial_payment_applications where id = p_application_id;
  if not found then raise exception 'Application not found'; end if;
  if not public.can_access_institution(v_app.institution_id) then raise exception 'Access denied'; end if;

  update public.partial_payment_applications
  set status = 'forwarded_head', admin_notes = p_admin_notes,
      reviewed_by_admin_id = auth.uid(), updated_at = now()
  where id = p_application_id;

  -- Notify head
  insert into public.notifications (user_id, title, body, event_type, category)
  select p.id,
    'Partial Payment Application Forwarded',
    'Application ' || p_application_id || ' requires your review.',
    'admin_reviewed', 'application'
  from public.profiles p
  where p.institution_id = v_app.institution_id and p.role = 'head';
end;
$$;
grant execute on function public.forward_partial_to_head(uuid, text) to authenticated;

-- RPC: Head approves partial payment application
create or replace function public.head_approve_partial(
  p_application_id  uuid,
  p_approved_amount numeric,
  p_new_deadline    date,
  p_head_notes      text default null
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_app public.partial_payment_applications%rowtype;
begin
  select * into v_app from public.partial_payment_applications where id = p_application_id;
  if not found then raise exception 'Application not found'; end if;
  if not public.can_access_institution(v_app.institution_id) then raise exception 'Access denied'; end if;

  update public.partial_payment_applications
  set status = 'approved_head', approved_amount = p_approved_amount,
      remaining_amount = v_app.requested_amount - p_approved_amount,
      new_deadline = p_new_deadline, head_notes = p_head_notes,
      reviewed_by_head_id = auth.uid(), updated_at = now()
  where id = p_application_id;

  -- Unlock fee for partial payment
  update public.fees
  set status = 'partial_approved',
      partial_allowed = true,
      approved_partial_amt = p_approved_amount,
      due_date = p_new_deadline
  where id = v_app.fee_id;

  -- Notify student
  insert into public.notifications (user_id, title, body, event_type, category)
  values (v_app.user_id,
    'Partial Payment Approved!',
    'Your application has been approved. Pay ৳' || p_approved_amount || ' by ' || p_new_deadline::text,
    'head_approved', 'application');

  -- Audit log
  insert into public.audit_logs
    (institution_id, actor_user_id, actor_name, actor_role, action_type,
     action_description, target_student_id, target_student_name,
     financial_record_title, before_value, after_value)
  select v_app.institution_id, auth.uid(), p.full_name, 'Head',
    'head_approval',
    'Head approved partial payment application',
    v_app.user_id, v_app.student_name,
    v_app.fee_title,
    '৳' || v_app.requested_amount,
    '৳' || p_approved_amount || ' (Installment 1)'
  from public.profiles p where p.id = auth.uid();
end;
$$;
grant execute on function public.head_approve_partial(uuid, numeric, date, text) to authenticated;

-- RPC: Head rejects partial payment application
create or replace function public.head_reject_partial(
  p_application_id  uuid,
  p_rejection_reason text
) returns void language plpgsql security definer set search_path = public as $$
declare
  v_app public.partial_payment_applications%rowtype;
begin
  select * into v_app from public.partial_payment_applications where id = p_application_id;
  if not found then raise exception 'Application not found'; end if;
  if not public.can_access_institution(v_app.institution_id) then raise exception 'Access denied'; end if;

  update public.partial_payment_applications
  set status = 'rejected_head', rejection_reason = p_rejection_reason,
      reviewed_by_head_id = auth.uid(), updated_at = now()
  where id = p_application_id;

  insert into public.notifications (user_id, title, body, event_type, category)
  values (v_app.user_id,
    'Partial Payment Application Rejected',
    'Reason: ' || p_rejection_reason,
    'head_rejected', 'application');
end;
$$;
grant execute on function public.head_reject_partial(uuid, text) to authenticated;

-- RPC: Donate to welfare fund
create or replace function public.donate_to_welfare(
  p_amount  numeric,
  p_message text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_institution text;
  v_points      integer;
  v_ref_id      text;
  v_receipt     text;
  v_txn_id      uuid;
begin
  select institution_id into v_institution from public.profiles where id = auth.uid();

  -- Check wallet balance
  if (select available_balance from public.wallets where user_id = auth.uid()) < p_amount then
    raise exception 'Insufficient wallet balance';
  end if;

  v_points  := floor(p_amount / 100)::integer;
  v_ref_id  := 'DON-' || upper(left(gen_random_uuid()::text, 8));
  v_receipt := 'REC-' || floor(100000 + random() * 899999)::text;

  update public.wallets
  set available_balance = available_balance - p_amount,
      wallet_balance    = wallet_balance - p_amount
  where user_id = auth.uid();

  insert into public.transactions
    (user_id, institution_id, title, amount, kind, status, type, reference_id, receipt_number)
  values
    (auth.uid(), v_institution, 'Student Welfare Donation', p_amount,
     'debit', 'Success', 'donation', v_ref_id, v_receipt)
  returning id into v_txn_id;

  insert into public.donations (user_id, institution_id, amount, points_awarded, message, transaction_id)
  values (auth.uid(), v_institution, p_amount, v_points, p_message, v_txn_id);

  insert into public.notifications (user_id, title, body, event_type, category)
  values (auth.uid(),
    'Welfare Contribution Received ❤️',
    '৳' || p_amount || ' donated. +'|| v_points || ' Impact Points awarded!',
    'donation_completed', 'payment');

  return jsonb_build_object('points_awarded', v_points, 'receipt', v_receipt);
end;
$$;
grant execute on function public.donate_to_welfare(numeric, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 13. REALTIME — Enable subscriptions on financial tables
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.fees;
alter publication supabase_realtime add table public.wallets;
alter publication supabase_realtime add table public.partial_payment_applications;
alter publication supabase_realtime add table public.escalation_tickets;
alter publication supabase_realtime add table public.escalation_messages;

-- ---------------------------------------------------------------------------
-- 14. UPDATE types.ts reminder: regenerate after applying this migration
-- supabase gen types typescript --project-id <your-project-id> > src/integrations/supabase/types.ts
-- ---------------------------------------------------------------------------
