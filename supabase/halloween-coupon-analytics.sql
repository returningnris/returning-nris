-- Read-only. Run in the Supabase SQL Editor as the database owner.
-- One row per booking, including bookings awaiting payment. Empty code = no coupon.
select booking_reference, created_at, contact_name, email,
  nullif(coupon_code, '') as coupon_code,
  adult_count, child_count, greatest(adult_count, child_count) as paid_tickets,
  amount_inr, greatest(adult_count, child_count) * 500 - amount_inr as discount_inr,
  payment_verified, payment_submitted_at
from public.halloween_bookings
where event_id = 'halloween-2026'
order by created_at desc;

-- Summary per code. Export either query result as CSV from Supabase.
with offers(code, booking_limit) as (
  values ('QUANTIUM250', 30), ('AIRADENTAL250', 10), ('DRIPBAR250', 10)
), totals as (
  select case coupon_code when 'AIRADENTAL200' then 'AIRADENTAL250' when 'DRIPBAR200' then 'DRIPBAR250' else coupon_code end as coupon_code, count(*) as bookings,
    count(*) filter (where payment_verified) as verified_bookings,
    sum(greatest(adult_count, child_count)) as paid_tickets,
    sum(greatest(adult_count, child_count) * 500 - amount_inr) as discount_inr,
    sum(amount_inr) filter (where payment_verified) as verified_revenue_inr
  from public.halloween_bookings where event_id = 'halloween-2026'
  group by 1
)
select coalesce(nullif(t.coupon_code, ''), o.code, 'No coupon') as coupon_code,
  o.booking_limit, coalesce(t.bookings, 0) as bookings,
  case when o.booking_limit is not null then greatest(o.booking_limit - coalesce(t.bookings, 0), 0) end as remaining_bookings,
  coalesce(t.verified_bookings, 0) as verified_bookings,
  coalesce(t.paid_tickets, 0) as paid_tickets, coalesce(t.discount_inr, 0) as discount_inr,
  coalesce(t.verified_revenue_inr, 0) as verified_revenue_inr
from totals t full join offers o on o.code = t.coupon_code
order by coupon_code;
