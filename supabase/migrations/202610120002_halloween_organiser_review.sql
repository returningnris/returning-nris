-- Apply before deploying organiser review emails. No retrospective emails are sent.
begin;
alter table public.halloween_bookings add column if not exists payment_review_token text not null default
  (replace(gen_random_uuid()::text,'-','') || replace(gen_random_uuid()::text,'-','')) unique;
alter table public.halloween_bookings add column if not exists payment_review_used_at timestamptz;
alter table public.halloween_notification_outbox drop constraint if exists halloween_notification_outbox_kind_check;
alter table public.halloween_notification_outbox add constraint halloween_notification_outbox_kind_check
  check (kind in ('booking_confirmation','payment_pending','organiser_review'));
create or replace function public.halloween_after_payment_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.payment_verified then
    if TG_OP = 'UPDATE' then
      if old.payment_verified then return new; end if;
    end if;
    insert into public.halloween_tickets(booking_id,event_id,category,attendee_number)
      values(new.id,new.event_id,'family',1)
      on conflict (booking_id,category,attendee_number) do nothing;
    insert into public.halloween_notification_outbox(booking_id,kind)
      values(new.id,'booking_confirmation')
      on conflict (booking_id,kind) do update set
        status=case when halloween_notification_outbox.status='cancelled' then 'pending'
          else halloween_notification_outbox.status end,
        next_attempt_at=now(),updated_at=now();
    -- If approval beats the first scheduled send, send the current confirmation
    -- rather than an obsolete pending notice. Already sent pending emails stay intact.
    update public.halloween_notification_outbox set status='cancelled',lease_token=null,
      locked_until=null,updated_at=now()
      where booking_id=new.id and kind in ('payment_pending','organiser_review') and status<>'sent';
  else
    update public.halloween_notification_outbox set status='cancelled',lease_token=null,
      locked_until=null,updated_at=now()
      where booking_id=new.id and kind='booking_confirmation' and status<>'sent';
  end if;
  return new;
end;
$$;

create or replace function public.halloween_queue_payment_pending()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.transaction_reference is null and new.transaction_reference is not null
    and not new.payment_verified then
    insert into public.halloween_notification_outbox(booking_id,kind)
      values(new.id,'payment_pending'),(new.id,'organiser_review') on conflict (booking_id,kind) do nothing;
  end if;
  return new;
end;
$$;
create or replace function public.halloween_claim_notifications(p_limit integer default 10)
returns setof public.halloween_notification_outbox
language plpgsql security definer set search_path = '' as $$
begin
  return query
  with candidates as (
    select o.id from public.halloween_notification_outbox o
    join public.halloween_bookings b on b.id=o.booking_id
    where ((o.kind='booking_confirmation' and b.payment_verified)
      or (o.kind in ('payment_pending','organiser_review') and not b.payment_verified and b.transaction_reference is not null))
      and o.attempts<12 and o.next_attempt_at<=now()
      and (o.status in ('pending','failed') or (o.status='processing' and o.locked_until<now()))
    order by o.next_attempt_at,o.created_at
    for update of o skip locked limit greatest(1,least(p_limit,25))
  )
  update public.halloween_notification_outbox o set status='processing',attempts=o.attempts+1,
    first_attempt_at=coalesce(o.first_attempt_at,now()),lease_token=gen_random_uuid(),
    locked_until=now()+interval '5 minutes',updated_at=now()
  from candidates c where o.id=c.id returning o.*;
end;
$$;

create or replace function public.halloween_approve_payment(p_review_token text,p_reference text,p_amount integer)
returns void language plpgsql security definer set search_path = '' as $$
declare b public.halloween_bookings;
begin
  -- Serialise approvals, including reused-reference checks across bookings.
  perform pg_advisory_xact_lock(20261031);
  select * into b from public.halloween_bookings
    where event_id='halloween-2026' and payment_review_token=p_review_token for update;
  if not found or b.transaction_reference is null then raise exception 'Invalid review link'; end if;
  if b.payment_verified then return; end if;
  if b.payment_review_used_at is not null or b.payment_submitted_at < now()-interval '7 days' then
    raise exception 'Review link expired';
  end if;
  if b.transaction_reference is distinct from p_reference or b.amount_inr is distinct from p_amount then
    raise exception 'Payment details changed';
  end if;
  if exists(select 1 from public.halloween_bookings where event_id=b.event_id
    and transaction_reference=b.transaction_reference and id<>b.id) then
    raise exception 'Payment reference reused';
  end if;
  update public.halloween_bookings set payment_verified=true,payment_review_used_at=now() where id=b.id;
end;
$$;
revoke all on function public.halloween_approve_payment(text,text,integer) from public,anon,authenticated;
grant execute on function public.halloween_approve_payment(text,text,integer) to service_role;
commit;
