-- User-requested change: ONE QR per family registration, not per attendee.
-- Apply after migrations 001 and 002. Safe to rerun; existing legacy tickets remain
-- for audit but can no longer validate or admit anyone.
begin;

alter table public.halloween_tickets drop constraint if exists halloween_tickets_category_check;
alter table public.halloween_tickets add constraint halloween_tickets_category_check
  check (category in ('adult', 'child', 'family'));
alter table public.halloween_tickets drop constraint if exists halloween_family_number_check;
alter table public.halloween_tickets add constraint halloween_family_number_check
  check (category <> 'family' or attendee_number = 1);
alter table public.halloween_tickets drop column if exists attendee_label;
alter table public.halloween_tickets add column attendee_label text generated always as
  (case category when 'family' then 'Family booking' when 'adult' then 'Adult ' || attendee_number::text
    else 'Child ' || attendee_number::text end) stored;
create unique index if not exists halloween_one_family_ticket_idx
  on public.halloween_tickets(booking_id) where category='family';

-- Backfill one family token for any booking approved before this migration.
-- If a legacy attendee ticket has already been admitted, conservatively preserve
-- its admission on the family ticket to prevent re-entry. Review partial legacy
-- admissions manually. The legacy rows themselves are preserved for audit.
insert into public.halloween_tickets(booking_id,event_id,category,attendee_number,checked_in_at,checked_in_by)
select b.id,b.event_id,'family',1,legacy.checked_in_at,legacy.checked_in_by
from public.halloween_bookings b
left join lateral (
  select t.checked_in_at,t.checked_in_by from public.halloween_tickets t
  where t.booking_id=b.id and t.category in ('adult','child') and t.checked_in_at is not null
  order by t.checked_in_at limit 1
) legacy on true
where b.confirmed_at is not null
on conflict (booking_id,category,attendee_number) do nothing;

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
    insert into public.halloween_notification_outbox(booking_id) values(new.id)
      on conflict (booking_id) do update set
        status=case when halloween_notification_outbox.status='cancelled' then 'pending'
          else halloween_notification_outbox.status end,
        next_attempt_at=now(),updated_at=now();
  else
    update public.halloween_notification_outbox set status='cancelled',lease_token=null,
      locked_until=null,updated_at=now() where booking_id=new.id and status<>'sent';
  end if;
  return new;
end;
$$;

create or replace function public.halloween_check_ticket(
  p_organiser_id uuid,p_ticket text,p_admit boolean default false
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare t public.halloween_tickets; b public.halloween_bookings;
begin
  perform 1 from public.halloween_organisers where user_id=p_organiser_id and active;
  if not found then raise exception 'Organiser access required'; end if;
  select * into t from public.halloween_tickets
    where event_id='halloween-2026' and category='family'
      and (validation_token=p_ticket or ticket_identifier=upper(btrim(p_ticket)));
  if not found then return jsonb_build_object('status','Invalid ticket'); end if;
  select * into b from public.halloween_bookings where id=t.booking_id for update;
  select * into t from public.halloween_tickets where id=t.id for update;
  if not b.payment_verified then
    return jsonb_build_object('status','Payment not verified','category','family',
      'booking_reference',b.booking_reference,'adult_count',b.adult_count,'child_count',b.child_count);
  end if;
  if t.checked_in_at is not null then
    return jsonb_build_object('status','Already checked in','category','family',
      'label',t.attendee_label,'booking_reference',b.booking_reference,
      'adult_count',b.adult_count,'child_count',b.child_count,
      'checked_in_at',t.checked_in_at,'ticket_identifier',t.ticket_identifier);
  end if;
  if p_admit then
    update public.halloween_tickets set checked_in_at=now(),checked_in_by=p_organiser_id
      where id=t.id returning * into t;
  end if;
  return jsonb_build_object('status',case when p_admit then 'Checked in' else 'Ready for admission' end,
    'category','family','label',t.attendee_label,'booking_reference',b.booking_reference,
    'adult_count',b.adult_count,'child_count',b.child_count,
    'checked_in_at',t.checked_in_at,'ticket_identifier',t.ticket_identifier);
end;
$$;

revoke all on function public.halloween_after_payment_change() from public,anon,authenticated;
revoke all on function public.halloween_check_ticket(uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.halloween_check_ticket(uuid,text,boolean) to service_role;
commit;
