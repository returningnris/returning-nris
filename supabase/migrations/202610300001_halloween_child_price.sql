-- Apply before deploying the revised website pricing.
-- The stored rate applies to children and additional adults.
-- Existing bookings retain their original amounts, including unpaid bookings.
-- Safe to rerun: existing child_price_inr values are not reset.
begin;
alter table public.halloween_bookings
  add column if not exists child_price_inr integer not null default 500
  check (child_price_inr in (500, 750));
alter table public.halloween_bookings alter column child_price_inr set default 750;
alter table public.halloween_bookings drop column amount_inr;
alter table public.halloween_bookings add column amount_inr integer generated always as (
  case when coupon_code = '' then
    child_count * child_price_inr + greatest(adult_count - child_count, 0) * child_price_inr
  else greatest(adult_count, child_count) *
    (case coupon_code when 'QUANTIUM50' then 450 when 'QUANTIUM250' then 250
      when 'AIRADENTAL200' then 300 when 'DRIPBAR200' then 300
      when 'AIRADENTAL250' then 250 when 'DRIPBAR250' then 250
      when 'SPOOKYVIP2026' then 0 else 500 end)
  end
) stored;
commit;
