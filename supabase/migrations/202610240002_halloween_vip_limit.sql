-- Apply after 202610240001. Limit VIP invitations to 20 family bookings.
begin;
create or replace function public.halloween_quantium_capacity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare used bigint; booking_limit integer; allocation_codes text[];
begin
  if new.coupon_code in ('QUANTIUM50', 'AIRADENTAL200', 'DRIPBAR200') then
    if tg_op = 'INSERT' then raise exception 'Invalid coupon code'; end if;
    if new.coupon_code is distinct from old.coupon_code then raise exception 'Invalid coupon code'; end if;
  end if;
  booking_limit := case new.coupon_code when 'QUANTIUM250' then 30 when 'AIRADENTAL250' then 10 when 'DRIPBAR250' then 10 when 'SPOOKYVIP2026' then 20 end;
  allocation_codes := case new.coupon_code
    when 'AIRADENTAL250' then array['AIRADENTAL250', 'AIRADENTAL200']
    when 'DRIPBAR250' then array['DRIPBAR250', 'DRIPBAR200']
    else array[new.coupon_code] end;
  if booking_limit is not null then
    perform 1 from public.halloween_events where id = new.event_id for update;
    select count(*) into used
      from public.halloween_bookings
      where event_id = new.event_id and coupon_code = any(allocation_codes) and id <> new.id;
    if used + 1 > booking_limit then
      raise exception 'Coupon limit exceeded. This code is limited to % bookings.', booking_limit;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.halloween_quantium_capacity() from public, anon, authenticated;
commit;
