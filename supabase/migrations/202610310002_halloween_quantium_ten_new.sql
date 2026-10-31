-- Allow ten additional Quantium family bookings after this migration.
-- Snapshot once; rerunning does not reset the allocation.
begin;
alter table public.halloween_events add column if not exists quantium_existing_booking_ids uuid[];
select 1 from public.halloween_events where id = 'halloween-2026' for update;
update public.halloween_events e
set quantium_existing_booking_ids = array(select b.id from public.halloween_bookings b where b.event_id = e.id and b.coupon_code = 'QUANTIUM250')
where e.id = 'halloween-2026' and e.quantium_existing_booking_ids is null;
create or replace function public.halloween_quantium_capacity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare used bigint; booking_limit integer; allocation_codes text[];
begin
  if new.coupon_code in ('QUANTIUM50', 'AIRADENTAL200', 'DRIPBAR200', 'AIRADENTAL250', 'DRIPBAR250') then
    if tg_op = 'INSERT' then raise exception 'Invalid coupon code'; end if;
    if new.coupon_code is distinct from old.coupon_code then raise exception 'Invalid coupon code'; end if;
  end if;
  booking_limit := case new.coupon_code when 'QUANTIUM250' then 10 when 'SPOOKYVIP2026' then 20 end;
  allocation_codes := case new.coupon_code
    when 'AIRADENTAL250' then array['AIRADENTAL250', 'AIRADENTAL200']
    when 'DRIPBAR250' then array['DRIPBAR250', 'DRIPBAR200']
    else array[new.coupon_code] end;
  if booking_limit is not null then
    perform 1 from public.halloween_events where id = new.event_id for update;
    select count(*) into used
      from public.halloween_bookings
      where event_id = new.event_id and coupon_code = any(allocation_codes) and id <> new.id
        and (new.coupon_code <> 'QUANTIUM250' or not (id = any(coalesce((select quantium_existing_booking_ids from public.halloween_events where id = new.event_id), '{}'::uuid[]))));
    if used + (case when new.coupon_code = 'QUANTIUM250' and new.id = any(coalesce((select quantium_existing_booking_ids from public.halloween_events where id = new.event_id), '{}'::uuid[])) then 0 else 1 end) > booking_limit then
      raise exception 'Coupon limit exceeded. This code is limited to % bookings.', booking_limit;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.halloween_quantium_capacity() from public, anon, authenticated;


create or replace function public.halloween_quantium_available()
returns boolean language sql security definer set search_path = '' as $$
  select count(*) < 10 from public.halloween_bookings b
  where b.event_id = 'halloween-2026' and b.coupon_code = 'QUANTIUM250'
    and not (b.id = any(coalesce((select quantium_existing_booking_ids from public.halloween_events where id = 'halloween-2026'), '{}'::uuid[])));
$$;
revoke all on function public.halloween_quantium_available() from public, anon, authenticated;
grant execute on function public.halloween_quantium_available() to service_role;
commit;
