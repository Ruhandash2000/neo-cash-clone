-- User-owned financial data. Every private record is keyed to its Auth/profile
-- UUID; presentation state is never used for authorization.
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade,
  institution_id text not null, available_balance numeric(14,2) not null default 0, wallet_balance numeric(14,2) not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.fees (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null, title text not null, amount numeric(14,2) not null, due_date date, status text not null default 'due', created_at timestamptz not null default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null, title text not null, amount numeric(14,2) not null, kind text not null, status text not null,
  occurred_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table if not exists public.payment_methods (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null, masked_account text not null, is_default boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, body text not null, is_read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null, storage_path text not null, document_type text not null, created_at timestamptz not null default now()
);
create table if not exists public.partial_payment_applications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null, fee_id uuid references public.fees(id) on delete set null, status text not null default 'draft',
  requested_amount numeric(14,2) not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.activity_history (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  institution_id text not null, actor_user_id uuid not null references public.profiles(id), action text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index if not exists fees_user_id_idx on public.fees(user_id);
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists partial_payment_applications_user_id_idx on public.partial_payment_applications(user_id);
create index if not exists activity_history_user_id_idx on public.activity_history(user_id);

-- These helpers read trusted profile fields only. Clients cannot select a role
-- or institution by changing browser state.
create or replace function public.current_profile_role() returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;
create or replace function public.current_profile_institution() returns text language sql stable security definer set search_path = public as $$
  select institution_id from public.profiles where id = auth.uid()
$$;
create or replace function public.can_access_institution(target_institution text) returns boolean language sql stable security definer set search_path = public as $$
  select public.current_profile_role() in ('admin', 'head') and public.current_profile_institution() = target_institution
$$;

-- Student onboarding can update only the student-owned fields via this RPC;
-- role and institution tenancy cannot be self-escalated through a profile update.
create or replace function public.complete_student_onboarding(selected_institution_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.current_profile_role() <> 'student' then raise exception 'Only students can complete student onboarding'; end if;
  update public.profiles set institution_id = selected_institution_id, onboarding_completed = true, onboarding_completed_at = now() where id = auth.uid();
end;
$$;

revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant execute on function public.complete_student_onboarding(text) to authenticated;

do $$ declare t text; begin
  foreach t in array array['wallets','fees','transactions','documents','partial_payment_applications','activity_history'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists own_or_institution_staff_select on public.%I', t);
    execute format('create policy own_or_institution_staff_select on public.%I for select using (user_id = auth.uid() or public.can_access_institution(institution_id))', t);
    execute format('drop policy if exists own_insert on public.%I', t);
    execute format('create policy own_insert on public.%I for insert with check (user_id = auth.uid())', t);
    execute format('drop policy if exists own_or_institution_staff_update on public.%I', t);
    execute format('create policy own_or_institution_staff_update on public.%I for update using (user_id = auth.uid() or public.can_access_institution(institution_id)) with check (user_id = auth.uid() or public.can_access_institution(institution_id))', t);
    execute format('drop policy if exists own_or_institution_staff_delete on public.%I', t);
    execute format('create policy own_or_institution_staff_delete on public.%I for delete using (user_id = auth.uid() or public.can_access_institution(institution_id))', t);
  end loop;
end $$;

-- Payment methods and notifications are always strictly private.
alter table public.payment_methods enable row level security;
alter table public.notifications enable row level security;
grant select, insert, update, delete on public.payment_methods, public.notifications to authenticated;
create policy own_select on public.payment_methods for select using (user_id = auth.uid());
create policy own_insert on public.payment_methods for insert with check (user_id = auth.uid());
create policy own_update on public.payment_methods for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_delete on public.payment_methods for delete using (user_id = auth.uid());
create policy own_select on public.notifications for select using (user_id = auth.uid());
create policy own_insert on public.notifications for insert with check (user_id = auth.uid());
create policy own_update on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_delete on public.notifications for delete using (user_id = auth.uid());
