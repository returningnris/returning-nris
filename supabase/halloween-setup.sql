-- Run AFTER all three numbered Halloween migrations.
-- Configure these values in Table Editor > halloween_events, row halloween-2026.
-- Leave registration_open=false until the website and worker are deployed.
-- Venue and time below were supplied by the organiser.
update public.halloween_events
set venue = 'The Quantium School, Mokila, Hyderabad', timings = '5 PM – 9 PM'
where id = 'halloween-2026';

-- OPTION 1: use Table Editor for configuration (recommended).
-- Set venue, timings, upi_id, payment_recipient_name, payment_qr_image_url.
-- payment_qr_image_url must be a public HTTPS image or a local website asset path.
-- This is the organiser's payment QR image, distinct from the family admission QR.

-- OPTION 2: uncomment and replace EVERY placeholder before running:
-- update public.halloween_events set
--   upi_id = 'REPLACE WITH ACTUAL UPI ID',
--   payment_recipient_name = 'REPLACE WITH ACTUAL BANK RECIPIENT NAME',
--   payment_qr_image_url = 'REPLACE WITH ACTUAL QR IMAGE URL'
-- where id = 'halloween-2026';

-- Grant organiser access to an EXISTING Supabase Auth account.
-- Find its UUID in Authentication > Users; do not enter an email address here.
-- Uncomment after replacing the placeholder:
-- insert into public.halloween_organisers(user_id, active)
-- values ('REPLACE-WITH-AUTH-USER-UUID'::uuid, true)
-- on conflict (user_id) do update set active = true;

-- Only after deployment and end-to-end verification:
-- update public.halloween_events set registration_open = true where id = 'halloween-2026';

-- Duplicate transaction references requiring bank reconciliation:
select * from public.halloween_payment_reference_review;

-- Safe operational summary: does not display private access/ticket tokens.
select b.booking_reference, b.adult_count, b.child_count, b.amount_inr,
  b.transaction_reference, b.payment_submitted_at, b.payment_verified, b.confirmed_at,
  o.status as email_status, o.attempts, o.last_error, o.provider_message_id, o.sent_at
from public.halloween_bookings b
left join public.halloween_notification_outbox o on o.booking_id = b.id
order by b.created_at desc;

-- MANUAL APPROVAL:
-- Table Editor > halloween_bookings > find booking_reference.
-- Verify actual bank receipt, recipient, amount_inr and transaction_reference.
-- Review halloween_payment_reference_review for reference reuse.
-- Edit payment_verified from false to true and Save.
-- The trigger sets confirmed_at, creates ONE family QR ticket and queues one notification.
-- Do not edit amount_inr, ticket tokens, attendee counts or notification status to approve.
-- Setting payment_verified=false blocks admission. Reapproval reuses existing tickets.

-- Retry only after fixing email configuration / checking the provider for delivery.
-- Stable provider idempotency keys must be used by the worker. Resend retains keys for
-- 24 hours: reconcile ambiguous sends before a late retry to prevent duplicate emails.
-- update public.halloween_notification_outbox
-- set status='pending', attempts=0, next_attempt_at=now(),
--     lease_token=null, locked_until=null, last_error=null
-- where booking_id=(select id from public.halloween_bookings where booking_reference='ACTUAL-REFERENCE')
--   and status in ('manual_required','failed');

-- Periodic housekeeping for hashed rate-limit buckets:
-- delete from public.halloween_rate_limits where window_started_at < now() - interval '2 days';
