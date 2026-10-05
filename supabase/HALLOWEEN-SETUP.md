# Halloween 2026 database setup

## Run order

1. In the existing Supabase project, open **SQL Editor → New query**.
2. Apply migrations in order: `202610050001_halloween_event.sql`, `202610050002_halloween_delivery_payload.sql`, then `202610050003_halloween_family_tickets.sql`. They run in transactions and can be rerun. If you already ran the initial migration, apply only 002 and 003 now. Existing site tables are untouched.
3. Optionally run `tests/halloween-event.sql` on empty Halloween tables before launch, with no guest or worker traffic. It refuses to run if bookings already exist; use a fresh staging database in that case. Its assertions test pricing, retries, reference reuse, private-token rejection, Boolean approval, ticket uniqueness, reconfirmation, permissions and sequential duplicate admission. Test rows roll back; sequence numbers may advance. Check-in assertions require an existing Auth user. This is not a two-connection concurrency test; admission uses database row locks to serialise competing requests.
4. Follow `halloween-setup.sql` to configure the event and organiser accounts. Its mutations are commented out until you replace the placeholders; its operational SELECT statements are safe to run as supplied.

## New objects

| Table / view | Purpose |
| --- | --- |
| `halloween_events` | One event: October 31, 2026, Asia/Kolkata; actual venue, times and payment details |
| `halloween_bookings` | Contact details, counts, database-calculated rupee amount, private resume token and manual payment approval |
| `halloween_tickets` | One family token and readable identifier per registration; admission audit. Legacy attendee rows, if any, remain for audit but cannot validate. |
| `halloween_organisers` | Allowed existing Supabase Auth users |
| `halloween_notification_outbox` | Separate email delivery state, retry counter, worker leases and provider acceptance ID |
| `halloween_rate_limits` | Shared rate-limit buckets containing salted IP hashes |
| `halloween_payment_reference_review` (view) | References used on more than one booking, for organiser review |

RLS is enabled and public/anonymous/authenticated table and function permissions are revoked. Limited website endpoints must use the existing server-only service-role client. Ordinary users, including organisers, must not receive the service-role key. Organiser endpoints must verify the Supabase JWT and use the verified user ID when calling check-in.

## Configuration

Registration starts **closed**. Set actual values for `venue`, `timings`, `upi_id`, `payment_recipient_name` and `payment_qr_image_url` in `halloween_events`. No values have been guessed. Only open registration after the guest flow and worker are deployed and tested.

Add each organiser's existing Authentication → Users UUID to `halloween_organisers`. Set `active=false` to remove access. No new guest accounts are required.

## Exactly how to approve payment

1. Open **Table Editor → halloween_bookings**, and find the readable `booking_reference`.
2. Verify the real credit in your bank app against the booking's amount and transaction reference. Review `halloween_payment_reference_review` for reused references.
3. Change **`payment_verified` from `false` to `true`**, then save the row.
4. The database trigger sets the first `confirmed_at`, creates ONE QR ticket for the entire booking and queues one confirmation notification. Adult and child counts stay on the booking and appear during check-in.
5. Check the outbox separately for delivery status. An approved payment is not proof of email delivery.

Setting `payment_verified=false` immediately prevents subsequent admission. Setting it back to true reuses existing ticket tokens and preserves existing check-ins and the first confirmation timestamp. Repeated true updates do not create new tickets or outbox rows.

Families should arrive together: one explicit admission checks in the entire registered group. Separate arrivals/partial group admissions are outside this flow. Migration 003 preserves any previous individual-ticket admission on the new family ticket conservatively; if you had partial legacy admissions, review those manually.

Attendee counts and booking identity cannot be changed after creation. Create a replacement booking for attendance changes. A submitted payment reference is immutable through the submission RPC; an organiser can correct it in Table Editor before reconciliation. The generated `amount_inr` cannot be edited.

## Website / worker integration contract

The website now implements these endpoints, pages and worker. The SQL alone does not deploy them or configure their schedule. See `../docs/halloween-website.md` for launch instructions.

- Registration endpoint: validate and normalise fields; verify bot protection and consume a persistent rate-limit bucket; call `halloween_register`. Persist a random UUID idempotency key across refreshes and reuse it only for identical booking details. Never accept an amount from the guest.
- Private access endpoint: look up exactly one booking by its 64-character `private_access_token`. Do not allow lookup by a readable reference or list access. Return only required family fields; never log tokens or links. QR payloads must contain the validation URL/token alone.
- Payment endpoint: rate-limit and call `halloween_submit_payment`. This saves the reference and timestamp without verifying payment. Repeated identical submissions are no-ops.
- Organiser endpoint: verify the existing Supabase Auth JWT, then check active membership. `halloween_check_ticket(verified_user_id, token_or_identifier, false)` previews; the explicit admission action passes `true`. A public QR URL must never call admission or expose contact information.
- Worker: schedule a protected server job frequently; call `halloween_claim_notifications`. Process only still-verified bookings. Generate confirmation text with the booking's verified amount, counts, event details and private link. Use a stable Resend idempotency key derived from the outbox ID. On provider acceptance, call `halloween_finish_notification` with `sent` and the returned provider message ID; failures use a sanitised error code. Use `manual_required` if email configuration is missing. Failed rows back off; a crashed worker's lease expires in five minutes. Twelve claims cap automatic attempts; inspect exhausted rows.
- The worker must not automatically resend an ambiguous provider request after its idempotency retention window. Resend retains keys for 24 hours: reconcile late ambiguous sends with the provider before retrying. Keep the request body stable for the same idempotency key. [Resend idempotency documentation](https://resend.com/changelog/idempotency-keys).
- A payment revocation can race with an external send already in flight; validation still blocks admission. Lease fencing prevents a stale worker recording success after cancellation. A sent confirmation is preserved on reconfirmation to avoid repeated confirmation messages.
- Manual WhatsApp sending remains organiser-only and must be available independently of email status. Opening a prefilled WhatsApp message is not proof of delivery.
- Clean rate-limit rows older than two days periodically using the commented housekeeping query.

Existing server variables are `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. The website also needs `SITE_URL`, `CRON_SECRET` and a scheduled worker call. `HALLOWEEN_SECURITY_SECRET` is optional; the server-only service key is the fallback for challenge/rate-limit HMACs. Supabase has been checked using read-only queries; no production booking, confirmation or email has been created by the implementation tests.

## Validation performed

SQL assertions and website integration tests run in an isolated PGlite PostgreSQL engine with stubbed Auth/provider services. The tests cover one family ticket, retry payload stability, private access, direct Boolean approval, duplicate admission, revocation and legacy migration. They do not prove actual bank payment, real provider delivery or deployment. Website build and lint are checked separately.
