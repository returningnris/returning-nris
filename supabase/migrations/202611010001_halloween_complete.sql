-- Preserve bookings, verification and tickets; stop all completed-event emails.
begin;
update public.halloween_events set registration_open = false where id = 'halloween-2026';

create or replace function public.halloween_suppress_completed_email()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.halloween_bookings b
    where b.id = new.booking_id and b.event_id = 'halloween-2026') then
    new.status := 'cancelled';
    new.lease_token := null;
    new.locked_until := null;
  end if;
  return new;
end;
$$;
revoke all on function public.halloween_suppress_completed_email() from public, anon, authenticated;
drop trigger if exists halloween_suppress_completed_email on public.halloween_notification_outbox;
create trigger halloween_suppress_completed_email
before insert or update on public.halloween_notification_outbox
for each row when (new.status <> 'sent')
execute function public.halloween_suppress_completed_email();

update public.halloween_notification_outbox o
set status = 'cancelled', lease_token = null, locked_until = null, updated_at = now()
from public.halloween_bookings b
where b.id = o.booking_id and b.event_id = 'halloween-2026' and o.status <> 'sent';
commit;
