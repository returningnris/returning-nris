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

create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  source text not null default '',
  readiness_status text not null default '',
  consultation_type text not null default 'founder_intro',
  status text not null default 'initiated',
  calendly_url text not null default '',
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists consultation_requests_user_id_created_at_idx
  on public.consultation_requests (user_id, created_at desc);

drop trigger if exists consultation_requests_set_updated_at on public.consultation_requests;
create trigger consultation_requests_set_updated_at
before update on public.consultation_requests
for each row execute procedure public.set_updated_at();

alter table public.consultation_requests enable row level security;

drop policy if exists "consultation_requests_select_own" on public.consultation_requests;
create policy "consultation_requests_select_own"
on public.consultation_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "consultation_requests_insert_own" on public.consultation_requests;
create policy "consultation_requests_insert_own"
on public.consultation_requests
for insert
to authenticated
with check (user_id is null or auth.uid() = user_id);

create table if not exists public.resource_comments (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  user_id uuid references auth.users(id) on delete set null,
  display_name text not null default 'Anonymous',
  comment text not null default '',
  status text not null default 'published',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists resource_comments_article_slug_created_at_idx
  on public.resource_comments (article_slug, created_at desc);

drop trigger if exists resource_comments_set_updated_at on public.resource_comments;
create trigger resource_comments_set_updated_at
before update on public.resource_comments
for each row execute procedure public.set_updated_at();

alter table public.resource_comments enable row level security;

create table if not exists public.community_join_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  current_city_country text not null,
  returning_city text not null,
  returning_year text not null,
  mobile_number text not null,
  consent boolean not null default false,
  help_topics_json jsonb not null default '[]'::jsonb,
  status text not null default 'pending_review',
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists community_join_requests_created_at_idx
  on public.community_join_requests (created_at desc);

drop trigger if exists community_join_requests_set_updated_at on public.community_join_requests;
create trigger community_join_requests_set_updated_at
before update on public.community_join_requests
for each row execute procedure public.set_updated_at();

alter table public.community_join_requests enable row level security;
