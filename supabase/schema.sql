create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  first_name text not null default '',
  last_name text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create table if not exists public.planner_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  age integer,
  gender text not null default '',
  country text not null default '',
  savings text not null default '',
  years_abroad text not null default '',
  has_kids text not null default '',
  kids_age text,
  has_job text not null default '',
  city text not null default '',
  timeline text not null default '',
  knows_rnor text not null default '',
  housing text not null default '',
  total_score integer not null default 0,
  financial_score integer not null default 0,
  life_score integer not null default 0,
  career_score integer not null default 0,
  planning_score integer not null default 0,
  readiness_status text not null default '',
  answers_json jsonb not null default '{}'::jsonb,
  result_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists planner_submissions_user_id_created_at_idx
  on public.planner_submissions (user_id, created_at desc);

drop trigger if exists planner_submissions_set_updated_at on public.planner_submissions;
create trigger planner_submissions_set_updated_at
before update on public.planner_submissions
for each row execute procedure public.set_updated_at();

alter table public.planner_submissions enable row level security;

drop policy if exists "planner_submissions_select_own" on public.planner_submissions;
create policy "planner_submissions_select_own"
on public.planner_submissions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "planner_submissions_insert_own" on public.planner_submissions;
create policy "planner_submissions_insert_own"
on public.planner_submissions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "planner_submissions_update_own" on public.planner_submissions;
create policy "planner_submissions_update_own"
on public.planner_submissions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
