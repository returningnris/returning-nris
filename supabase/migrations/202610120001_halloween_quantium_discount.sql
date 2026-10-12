-- Apply before deploying the Quantium coupon form. Existing bookings keep their price.
begin;
alter table public.halloween_bookings add column if not exists coupon_code text not null default ''
  check (coupon_code in ('', 'QUANTIUM50'));
-- Recreate the generated price; do not accept amounts supplied by clients.
alter table public.halloween_bookings drop column amount_inr;
alter table public.halloween_bookings add column amount_inr integer generated always as
  ((child_count + greatest(adult_count - child_count, 0)) *
    (case when coupon_code = 'QUANTIUM50' then 450 else 500 end)) stored;
drop function if exists public.halloween_register(uuid,text,text,text,integer,integer);
create or replace function public.halloween_register(
  p_idempotency_key uuid, p_contact_name text, p_email text,
  p_whatsapp_number text, p_adult_count integer, p_child_count integer, p_coupon_code text default ''
) returns public.halloween_bookings
language plpgsql security definer set search_path = '' as $$
declare b public.halloween_bookings; code text := upper(btrim(coalesce(p_coupon_code, '')));
begin
  if code not in ('', 'QUANTIUM50') then raise exception 'Invalid coupon code'; end if;
  select * into b from public.halloween_bookings where idempotency_key = p_idempotency_key;
  if not found then
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
  return b;
end;
$$;

revoke all on function public.halloween_register(uuid,text,text,text,integer,integer,text) from public,anon,authenticated;
grant execute on function public.halloween_register(uuid,text,text,text,integer,integer,text) to service_role;
commit;
