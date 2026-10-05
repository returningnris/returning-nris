-- Run this entire file in the Supabase SQL Editor as the project database owner.
-- Transactional and re-runnable. No existing Returning NRIs tables are changed.
begin;

create table if not exists public.halloween_events (
  id text primary key check (id = 'halloween-2026'),
  name text not null default 'Returning NRIs Halloween Party',
  event_date date not null default '2026-10-31' check (event_date = date '2026-10-31'),
  timezone text not null default 'Asia/Kolkata' check (timezone = 'Asia/Kolkata'),
  venue text,
  timings text,
  upi_id text,
  payment_recipient_name text,
  payment_qr_image_url text,
  registration_open boolean not null default false,
  created_at timestamptz not null default now(),
  constraint halloween_ready_to_register check (
    not registration_open or (
      nullif(btrim(venue), '') is not null and
      nullif(btrim(timings), '') is not null and
      nullif(btrim(upi_id), '') is not null and
      nullif(btrim(payment_recipient_name), '') is not null and
      nullif(btrim(payment_qr_image_url), '') is not null
    )
  )
);
insert into public.halloween_events(id) values ('halloween-2026') on conflict do nothing;

create sequence if not exists public.halloween_booking_number;
create sequence if not exists public.halloween_ticket_number;

create table if not exists public.halloween_bookings (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references public.halloween_events(id) check (event_id = 'halloween-2026'),
  booking_reference text not null unique default
    ('HW26-' || lpad(nextval('public.halloween_booking_number')::text, 8, '0')),
  idempotency_key uuid not null unique,
  -- Two independently generated cryptographic UUIDs: 244 random bits.
  private_access_token text not null unique default
    (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  contact_name text not null check (length(btrim(contact_name)) between 2 and 100),
  email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  whatsapp_number text not null check (whatsapp_number ~ '^\+[1-9][0-9]{7,14}$'),
  adult_count integer not null check (adult_count between 1 and 50),
  child_count integer not null check (child_count between 1 and 50),
  -- Rupees, not paise. Impossible for browser or Table Editor to override.
  amount_inr integer generated always as
    (child_count * 500 + greatest(adult_count - child_count, 0) * 500) stored,
  transaction_reference text check (
    transaction_reference is null or transaction_reference ~ '^[A-Z0-9]{6,64}$'
  ),
  payment_submitted_at timestamptz,
  payment_verified boolean not null default false,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint halloween_payment_submission_pair check (
    (transaction_reference is null) = (payment_submitted_at is null)
  ),
  constraint halloween_confirmation_timestamp check (not payment_verified or confirmed_at is not null)
);
create index if not exists halloween_bookings_event_payment_idx
  on public.halloween_bookings(event_id, payment_verified, created_at);
create index if not exists halloween_bookings_transaction_idx
  on public.halloween_bookings(event_id, transaction_reference) where transaction_reference is not null;

create table if not exists public.halloween_organisers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.halloween_tickets (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.halloween_bookings(id),
  event_id text not null references public.halloween_events(id) check (event_id = 'halloween-2026'),
  ticket_identifier text not null unique default
    ('HW26-T-' || lpad(nextval('public.halloween_ticket_number')::text, 8, '0')),
  validation_token text not null unique default
    (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  category text not null check (category in ('adult', 'child')),
  attendee_number integer not null check (attendee_number between 1 and 50),
  attendee_label text generated always as
    (case category when 'adult' then 'Adult ' else 'Child ' end || attendee_number::text) stored,
  checked_in_at timestamptz,
  checked_in_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (booking_id, category, attendee_number),
  constraint halloween_checkin_pair check ((checked_in_at is null) = (checked_in_by is null))
);
create index if not exists halloween_tickets_booking_idx on public.halloween_tickets(booking_id);

create table if not exists public.halloween_notification_outbox (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.halloween_bookings(id),
  kind text not null default 'booking_confirmation' check (kind = 'booking_confirmation'),
  status text not null default 'pending' check
    (status in ('pending', 'processing', 'sent', 'failed', 'manual_required', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  lease_token uuid,
  locked_until timestamptz,
  provider_message_id text,
  last_error text,
  first_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint halloween_sent_receipt check
    (status <> 'sent' or (sent_at is not null and provider_message_id is not null))
);
create index if not exists halloween_outbox_retry_idx
  on public.halloween_notification_outbox(status, next_attempt_at);

-- Persistent, cross-instance rate limiting. Store only a salted IP hash, not an IP.
create table if not exists public.halloween_rate_limits (
  bucket text primary key,
  window_started_at timestamptz not null default now(),
  hits integer not null default 1 check (hits > 0)
);

-- BEFORE trigger also covers direct edits through Supabase Table Editor.
create or replace function public.halloween_before_booking_write()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    if row(new.id, new.event_id, new.booking_reference, new.idempotency_key,
           new.private_access_token, new.adult_count, new.child_count)
       is distinct from
       row(old.id, old.event_id, old.booking_reference, old.idempotency_key,
           old.private_access_token, old.adult_count, old.child_count) then
      raise exception 'Booking identity and attendee counts cannot be changed; create a new booking';
    end if;
    new.confirmed_at := old.confirmed_at;
  else
    new.confirmed_at := null;
  end if;
  if new.payment_verified and new.confirmed_at is null then
    new.confirmed_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists halloween_booking_before_write on public.halloween_bookings;
create trigger halloween_booking_before_write before insert or update on public.halloween_bookings
for each row execute function public.halloween_before_booking_write();

create or replace function public.halloween_after_payment_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.payment_verified then
    if TG_OP = 'UPDATE' then
      if old.payment_verified then return new; end if;
    end if;
    insert into public.halloween_tickets(booking_id, event_id, category, attendee_number)
      select new.id, new.event_id, 'adult', n from generate_series(1, new.adult_count) n
      on conflict (booking_id, category, attendee_number) do nothing;
    insert into public.halloween_tickets(booking_id, event_id, category, attendee_number)
      select new.id, new.event_id, 'child', n from generate_series(1, new.child_count) n
      on conflict (booking_id, category, attendee_number) do nothing;
    insert into public.halloween_notification_outbox(booking_id) values (new.id)
      on conflict (booking_id) do update set
        status = case when halloween_notification_outbox.status = 'cancelled' then 'pending'
          else halloween_notification_outbox.status end,
        next_attempt_at = now(), updated_at = now();
  else
    -- Do not delete tickets or reset admissions. Validation always checks this Boolean.
    update public.halloween_notification_outbox
      set status = 'cancelled', lease_token = null, locked_until = null, updated_at = now()
      where booking_id = new.id and status <> 'sent';
  end if;
  return new;
end;
$$;
drop trigger if exists halloween_payment_changed on public.halloween_bookings;
create trigger halloween_payment_changed after insert or update of payment_verified
on public.halloween_bookings for each row execute function public.halloween_after_payment_change();

-- Called ONLY by the server, after bot checks and rate limiting.
-- No amount argument: pricing is calculated by the database itself.
create or replace function public.halloween_register(
  p_idempotency_key uuid, p_contact_name text, p_email text,
  p_whatsapp_number text, p_adult_count integer, p_child_count integer
) returns public.halloween_bookings
language plpgsql security definer set search_path = '' as $$
declare b public.halloween_bookings;
begin
  select * into b from public.halloween_bookings where idempotency_key = p_idempotency_key;
  if not found then
    perform 1 from public.halloween_events where id = 'halloween-2026' and registration_open;
    if not found then raise exception 'Registration is not open'; end if;
    insert into public.halloween_bookings(event_id, idempotency_key, contact_name, email,
      whatsapp_number, adult_count, child_count)
    values ('halloween-2026', p_idempotency_key, btrim(p_contact_name), lower(btrim(p_email)),
      p_whatsapp_number, p_adult_count, p_child_count)
    on conflict (idempotency_key) do nothing returning * into b;
    if b.id is null then
      select * into b from public.halloween_bookings where idempotency_key = p_idempotency_key;
    end if;
  end if;
  if row(b.contact_name, b.email, b.whatsapp_number, b.adult_count, b.child_count)
    is distinct from row(btrim(p_contact_name), lower(btrim(p_email)), p_whatsapp_number,
      p_adult_count, p_child_count) then
    raise exception 'Idempotency key already used for different booking details';
  end if;
  return b;
end;
$$;

create or replace function public.halloween_submit_payment(p_private_token text, p_reference text)
returns void language plpgsql security definer set search_path = '' as $$
declare b public.halloween_bookings; ref text := upper(btrim(p_reference));
begin
  select * into b from public.halloween_bookings
    where private_access_token = p_private_token and event_id = 'halloween-2026' for update;
  if not found then raise exception 'Invalid private booking link'; end if;
  if ref is null or ref !~ '^[A-Z0-9]{6,64}$' then raise exception 'Invalid transaction reference'; end if;
  if b.transaction_reference = ref then return; end if;
  if b.payment_verified then raise exception 'Payment is already verified'; end if;
  if b.transaction_reference is not null then
    raise exception 'Reference already submitted; contact the organiser to correct it';
  end if;
  update public.halloween_bookings set transaction_reference = ref, payment_submitted_at = now()
    where id = b.id;
end;
$$;

-- Dynamic review view flags ALL bookings sharing a reference, even under concurrent writes.
-- A flag is for bank reconciliation only; it never confirms payment.
create or replace view public.halloween_payment_reference_review with (security_invoker = true) as
select event_id, transaction_reference, count(*) as booking_count,
  array_agg(booking_reference order by booking_reference) as booking_references
from public.halloween_bookings where transaction_reference is not null
group by event_id, transaction_reference having count(*) > 1;

-- Lookup and admission are separate actions. Server validates the caller's Supabase JWT
-- and passes its user id, never an id submitted by the browser.
create or replace function public.halloween_check_ticket(
  p_organiser_id uuid, p_ticket text, p_admit boolean default false
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare t public.halloween_tickets; b public.halloween_bookings;
begin
  perform 1 from public.halloween_organisers where user_id = p_organiser_id and active;
  if not found then raise exception 'Organiser access required'; end if;
  select * into t from public.halloween_tickets
    where event_id = 'halloween-2026'
      and (validation_token = p_ticket or ticket_identifier = upper(btrim(p_ticket)));
  if not found then return jsonb_build_object('status', 'Invalid ticket'); end if;
  -- Lock booking before ticket: serialises revocation with admission and avoids deadlocks.
  select * into b from public.halloween_bookings where id = t.booking_id for update;
  select * into t from public.halloween_tickets where id = t.id for update;
  if not b.payment_verified then
    return jsonb_build_object('status', 'Payment not verified',
      'category', t.category, 'booking_reference', b.booking_reference);
  end if;
  if t.checked_in_at is not null then
    return jsonb_build_object('status', 'Already checked in', 'category', t.category,
      'label', t.attendee_label, 'booking_reference', b.booking_reference,
      'checked_in_at', t.checked_in_at, 'ticket_identifier', t.ticket_identifier);
  end if;
  if p_admit then
    update public.halloween_tickets set checked_in_at = now(), checked_in_by = p_organiser_id
      where id = t.id returning * into t;
  end if;
  return jsonb_build_object('status', case when p_admit then 'Checked in' else 'Ready for admission' end,
    'category', t.category, 'label', t.attendee_label, 'booking_reference', b.booking_reference,
    'checked_in_at', t.checked_in_at, 'ticket_identifier', t.ticket_identifier);
end;
$$;

-- Worker claims with SKIP LOCKED and a fencing token. A crashed worker's lease expires.
create or replace function public.halloween_claim_notifications(p_limit integer default 10)
returns setof public.halloween_notification_outbox
language plpgsql security definer set search_path = '' as $$
begin
  return query
  with candidates as (
    select o.id from public.halloween_notification_outbox o
    join public.halloween_bookings b on b.id = o.booking_id
    where b.payment_verified and o.attempts < 12 and o.next_attempt_at <= now()
      and (o.status in ('pending', 'failed') or
        (o.status = 'processing' and o.locked_until < now()))
    order by o.next_attempt_at
    for update of o skip locked limit greatest(1, least(p_limit, 25))
  )
  update public.halloween_notification_outbox o set status = 'processing',
    attempts = o.attempts + 1, first_attempt_at = coalesce(o.first_attempt_at, now()),
    lease_token = gen_random_uuid(), locked_until = now() + interval '5 minutes', updated_at = now()
  from candidates c where o.id = c.id returning o.*;
end;
$$;

create or replace function public.halloween_finish_notification(
  p_id uuid, p_lease_token uuid, p_status text,
  p_provider_message_id text default null, p_error text default null
) returns boolean language plpgsql security definer set search_path = '' as $$
declare affected integer;
begin
  if p_status not in ('sent', 'failed', 'manual_required') then
    raise exception 'Invalid notification outcome';
  end if;
  if p_status = 'sent' and nullif(btrim(p_provider_message_id), '') is null then
    raise exception 'Provider acceptance ID required';
  end if;
  update public.halloween_notification_outbox set status = p_status,
    provider_message_id = p_provider_message_id,
    sent_at = case when p_status = 'sent' then now() else null end,
    -- Pass a sanitised error code, never a provider response containing private links.
    last_error = left(p_error, 500), lease_token = null, locked_until = null,
    next_attempt_at = now() + make_interval(secs => least(3600, 30 * power(2, least(attempts, 7)))::integer),
    updated_at = now()
  where id = p_id and lease_token = p_lease_token and status = 'processing' and locked_until > now();
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

create or replace function public.halloween_consume_rate_limit(
  p_bucket text, p_limit integer, p_window_seconds integer
) returns boolean language plpgsql security definer set search_path = '' as $$
declare current_hits integer;
begin
  if length(p_bucket) > 200 or p_limit < 1 or p_window_seconds < 1 then
    raise exception 'Invalid rate limit';
  end if;
  insert into public.halloween_rate_limits(bucket) values (p_bucket)
  on conflict (bucket) do update set
    hits = case when halloween_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then 1 else halloween_rate_limits.hits + 1 end,
    window_started_at = case
      when halloween_rate_limits.window_started_at <= now() - make_interval(secs => p_window_seconds)
      then now() else halloween_rate_limits.window_started_at end
  returning hits into current_hits;
  return current_hits <= p_limit;
end;
$$;

-- No public policies: browsers cannot SELECT/INSERT/UPDATE/DELETE these tables.
-- Organisers use authenticated server endpoints; Table Editor uses owner privileges.
alter table public.halloween_events enable row level security;
alter table public.halloween_bookings enable row level security;
alter table public.halloween_organisers enable row level security;
alter table public.halloween_tickets enable row level security;
alter table public.halloween_notification_outbox enable row level security;
alter table public.halloween_rate_limits enable row level security;

revoke all on table public.halloween_events, public.halloween_bookings, public.halloween_organisers,
  public.halloween_tickets, public.halloween_notification_outbox, public.halloween_rate_limits,
  public.halloween_payment_reference_review from public, anon, authenticated;
grant all on table public.halloween_events, public.halloween_bookings, public.halloween_organisers,
  public.halloween_tickets, public.halloween_notification_outbox, public.halloween_rate_limits
  to service_role;
grant select on public.halloween_payment_reference_review to service_role;
revoke all on sequence public.halloween_booking_number, public.halloween_ticket_number from public, anon, authenticated;
grant usage, select on sequence public.halloween_booking_number, public.halloween_ticket_number to service_role;

-- PostgreSQL grants EXECUTE to PUBLIC by default; explicitly close every function.
revoke all on function public.halloween_before_booking_write() from public, anon, authenticated;
revoke all on function public.halloween_after_payment_change() from public, anon, authenticated;
revoke all on function public.halloween_register(uuid,text,text,text,integer,integer) from public, anon, authenticated;
revoke all on function public.halloween_submit_payment(text,text) from public, anon, authenticated;
revoke all on function public.halloween_check_ticket(uuid,text,boolean) from public, anon, authenticated;
revoke all on function public.halloween_claim_notifications(integer) from public, anon, authenticated;
revoke all on function public.halloween_finish_notification(uuid,uuid,text,text,text) from public, anon, authenticated;
revoke all on function public.halloween_consume_rate_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.halloween_register(uuid,text,text,text,integer,integer),
  public.halloween_submit_payment(text,text), public.halloween_check_ticket(uuid,text,boolean),
  public.halloween_claim_notifications(integer), public.halloween_finish_notification(uuid,uuid,text,text,text),
  public.halloween_consume_rate_limit(text,integer,integer) to service_role;

commit;
