-- Disable new uses of all coupons except the existing special invitation.
-- Historical coupon attribution and booking amounts are preserved.
begin;
create or replace function public.halloween_quantium_capacity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare used bigint; booking_limit integer; allocation_codes text[];
begin
  if new.coupon_code in ('QUANTIUM50', 'AIRADENTAL200', 'DRIPBAR200', 'QUANTIUM250', 'AIRADENTAL250', 'DRIPBAR250') then
    if tg_op = 'INSERT' then raise exception 'Invalid coupon code'; end if;
    if new.coupon_code is distinct from old.coupon_code then raise exception 'Invalid coupon code'; end if;
  end if;
  booking_limit := case new.coupon_code when 'SPOOKYVIP2026' then 20 end;
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

create or replace function public.halloween_register(
  p_idempotency_key uuid, p_contact_name text, p_email text,
  p_whatsapp_number text, p_adult_count integer, p_child_count integer, p_coupon_code text default ''
) returns public.halloween_bookings
language plpgsql security definer set search_path = '' as $$
declare b public.halloween_bookings; code text := upper(btrim(coalesce(p_coupon_code, '')));
begin
  -- Serialise registrations before checking existing attempts or coupon capacity.
  perform 1 from public.halloween_events where id = 'halloween-2026' for update;
  select * into b from public.halloween_bookings where idempotency_key = p_idempotency_key;
  if not found then
    if code not in ('', 'SPOOKYVIP2026') then raise exception 'Invalid coupon code'; end if;
    perform 1 from public.halloween_events where id = 'halloween-2026' and registration_open;
    if not found then raise exception 'Registration is not open'; end if;
    insert into public.halloween_bookings(event_id, idempotency_key, contact_name, email,
      whatsapp_number, adult_count, child_count, coupon_code)
    values ('halloween-2026', p_idempotency_key, btrim(p_contact_name), lower(btrim(p_email)),
      p_whatsapp_number, p_adult_count, p_child_count, code)
    on conflict (idempotency_key) do nothing returning * into b;
    if b.id is null then
      select * into b from public.halloween_bookings where idempotency_key = p_idempotency_key;
    end if;
  end if;
  if row(b.contact_name, b.email, b.whatsapp_number, b.adult_count, b.child_count, b.coupon_code)
    is distinct from row(btrim(p_contact_name), lower(btrim(p_email)), p_whatsapp_number,
      p_adult_count, p_child_count, code) then
    raise exception 'Idempotency key already used for different booking details';
  end if;
  if code = 'SPOOKYVIP2026' and not b.payment_verified and not exists (select 1 from public.halloween_tickets where booking_id = b.id) then
    update public.halloween_bookings set payment_verified = true where id = b.id returning * into b;
  end if;
  return b;
end;
$$;

revoke all on function public.halloween_register(uuid,text,text,text,integer,integer,text) from public,anon,authenticated;
grant execute on function public.halloween_register(uuid,text,text,text,integer,integer,text) to service_role;
commit;
