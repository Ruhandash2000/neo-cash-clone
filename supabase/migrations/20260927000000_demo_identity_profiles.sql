-- Phase 1 identity model. Passwords are owned and hashed by Supabase Auth,
-- never stored in this table.
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists role text not null default 'student'
    check (role in ('student', 'admin', 'head', 'demo_controller')),
  add column if not exists institution_id text,
  add column if not exists is_demo_user boolean not null default false,
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Profiles are updated by their owner" on public.profiles;
create policy "Profiles are updated by their owner"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- A server-side/admin provisioning process must create the demo Auth users and
-- then insert matching profile rows. Do not insert password values here.
