# Halloween website launch

The guest experience is **register → pay by UPI → submit reference → await bank verification → one family QR**. A single QR covers every adult and child in the registration. Families arrive together; one organiser action admits the whole booking once.

## Pages

| URL | Purpose |
| --- | --- |
| `/events/halloween` | Public event details, pricing and family registration |
| `/events/halloween/booking#PRIVATE_TOKEN` | Private payment, pending status and the single family QR ticket |
| `/events/halloween/ticket#TICKET_TOKEN` | QR landing page; public visitors see a safe sign-in prompt; authorised organisers can preview/admit |
| `/events/halloween/check-in` | Organiser check-in and manual WhatsApp confirmation, using existing Supabase Auth |

Tokens are URL fragments, not path or query parameters. Browsers do not send fragments in HTTP request URLs. Sensitive lookups use no-store POST bodies, and private pages send no-referrer/noindex headers. Do not add analytics or error reporting that captures URL fragments, API bodies or private links on these pages.

## Apply the remaining migrations

You already ran the initial creation script. In Supabase SQL Editor, run these whole files in order:

1. `supabase/migrations/202610050002_halloween_delivery_payload.sql` — freezes notification retry content.
2. `supabase/migrations/202610050003_halloween_family_tickets.sql` — switches to one QR per registration, backfills previously confirmed bookings and prevents old individual codes admitting anyone.
3. `supabase/migrations/202610050004_halloween_event_details.sql` — saves The Quantium School, Mokila, Hyderabad and 5 PM–9 PM. Skip this if already executed.
4. `supabase/migrations/202610050005_halloween_payment_pending_email.sql` — queues a payment-pending email on first reference submission and supports separate pending and confirmation notifications. Apply before deploying the updated email worker. Does not send retrospective pending emails for existing submissions.

For a fresh database, apply migration 001 first. Do not rerun the rollback test on a live database with bookings; it requires empty tables before launch.

## Configure the event

In Table Editor → `halloween_events`, row `halloween-2026`, set:

- `name`: the party name when ready. Pages, page metadata and newly prepared confirmations use this value.
- `venue` and `timings`: your actual details; timings are displayed in IST/Asia/Kolkata.
- `upi_id`, `payment_recipient_name`, `payment_qr_image_url`: actual bank recipient and payment QR. Use a public HTTPS image URL or a website asset path such as `/your-uploaded-file.png`.
- Keep `registration_open=false` until configuration and deployed workflow are verified. The page displays “Registration opens soon” while closed or incomplete.

No party theme or new artwork has been invented. The new pages use existing fonts, warm backgrounds, rounded cards and green/saffron buttons. Theme changes can be made in `app/events/halloween/event.css` later.

Registration requires one adult and one child minimum, with a practical limit of 50 each. Pricing is recalculated on the server and generated again in PostgreSQL. A submitted client amount is ignored. Repeated clicks/refreshes reuse a saved UUID and identical details. The private link resumes payment/tickets without a customer account. If a saved attempt has uncertain network status, retry it rather than starting another booking.

## Environment variables

Retain existing Supabase and Resend values in your deployment settings, never browser code or Git:

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Existing browser Auth key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, privileged database operations |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Existing transactional provider; sender/domain must be authorised |
| `SITE_URL` | Your canonical HTTPS website origin, used in worker email links |
| `CRON_SECRET` | A cryptographically random server secret protecting the worker; use the same value in the scheduler |
| `HALLOWEEN_SECURITY_SECRET` (optional) | HMAC secret for signed bot challenges and hashed IP buckets; falls back to server service key |

The server includes a honeypot, a signed time-limited form challenge, origin/content-type/body-size validation and persistent database-backed submission limits. These are basic bot controls, not a CAPTCHA service. Vercel's forwarded client-IP header is preferred; on other hosts your trusted proxy must overwrite forwarded headers and the application port must not be publicly reachable.

## Organiser access

Use Authentication → Users to find your existing account UUID, then insert it into `halloween_organisers` as shown in `supabase/halloween-setup.sql`. No separate admin account system is created. Sign in at `/auth`, then open `/events/halloween/check-in`. All organiser requests are also authenticated and authorised on the server.

Sign in once and open check-in in Safari or Chrome over HTTPS. **Quick admission** is on by default: scanning a valid, paid family QR calls the atomic admission endpoint directly and displays adult/child counts with the result. Tap **Next family** to resume the same camera stream; no repeated sign-in or camera permission prompt is needed. Scanning pauses while results are reviewed, and a held QR is not repeatedly submitted. Turn Quick admission off to preview first, then tap **Admit family**. Manual ticket lookup always previews first. Duplicate and unpaid admissions remain blocked by PostgreSQL locks and checks. Native QR detection is used where available; otherwise a lazy-loaded jsQR decoder reads bounded-size frames locally. No camera images are uploaded. Camera stops on hiding the page, signing out, changing users, leaving check-in or tapping Stop camera. Physical phone camera testing remains a deployment check.

## Manual payment approval

1. Find the family booking in Table Editor → `halloween_bookings` by its readable reference.
2. Check the actual credited amount and transaction reference in your bank app. Inspect `halloween_payment_reference_review` for reuse across bookings.
3. Set `payment_verified=true` and save. This direct database edit timestamps first confirmation, creates one family ticket and inserts one outbox row.
4. The family can refresh its private booking page immediately to view its QR. The scheduled worker processes the email independently.

A reference submission never marks payment verified. Revoking approval blocks admission; reapproving reuses the same QR and preserves prior group admission.

## Automatic confirmation worker

The implemented worker is `GET /api/halloween/notifications` with `Authorization: Bearer YOUR_CRON_SECRET`. It claims three notifications per call, uses worker leases and stable Resend idempotency keys, retries transient failures with backoff and caps claims at 12. Only provider acceptance with a message ID records `sent`; that means accepted, not proven inbox delivery. Missing email/public-origin configuration records `manual_required` while leaving approval and the family ticket intact.

After payment reference submission, a separate `payment_pending` email explains that bank verification is pending. It contains the booking reference and amount, but no ticket token. After approval, a `booking_confirmation` email contains the private family ticket link. Both run through the existing five-minute schedule and retry independently; repeated form submissions do not queue another notice. If approval precedes delivery of a pending notice, that stale notice is cancelled and only the confirmation is sent. Guests are no longer asked to copy or save a private link.

Both messages include Halloween HTML styling, PNG artwork and an explicit plain-text fallback. Confirmation includes a ticket button and a fallback text link; important information remains available if images are blocked. Frozen payloads preserve both HTML and text during retries, including older text-only messages. Deploy `public/events/halloween/email-artwork.png` alongside the worker. Browser preview is not proof of rendering in every email client; test an actual inbox before launch.

Configure a scheduler to call it every five minutes **after deployment**. `supabase/halloween-worker-schedule.sql` contains a Supabase Cron + Vault option without plaintext repository secrets. Store your real website origin and matching worker secret in Vault, then uncomment its schedule statement. Enable pg_cron/pg_net first. Alternatively configure Vercel Pro Cron or another scheduler that supplies the same header. No schedule is active merely because this code is committed. A five-minute schedule is not assumed available on a Vercel Hobby plan.

Monitor outbox `status`, `attempts`, `last_error`, `provider_message_id` and `sent_at`. After 23 hours from the first attempt, uncertain sends move to manual review rather than risking another send outside Resend's 24-hour idempotency window. Check provider activity before manually retrying. Frozen retry content remains unchanged even if event details change. Do not reset `first_attempt_at` to force a resend.

An organiser can find the exact booking in **Send confirmation** and use **Send via WhatsApp** for a prefilled confirmation with the private family link. They must review and press Send in WhatsApp themselves. Availability does not depend on email status. No WhatsApp Business API or automated WhatsApp delivery is claimed.

## Verification

Standard checks:

```powershell
npm run lint
npm run build
node --test tests/halloween.test.mjs
node scripts/check-halloween-config.mjs
```

Optional isolated integration tests use PGlite in a temporary directory, without adding it to production dependencies:

```powershell
$halloweenTestRuntime = Join-Path $env:TEMP 'returningnris-halloween-sql-check'
npm install --prefix $halloweenTestRuntime --no-save --package-lock=false @electric-sql/pglite
$env:HALLOWEEN_SQL_TEST_RUNTIME = $halloweenTestRuntime
node --test tests/halloween.test.mjs tests/halloween.integration.test.mjs
```

These run real PostgreSQL triggers/functions plus actual server endpoint/worker code against fake Auth and email services. Coverage includes all pricing examples, registration idempotency, private access, unverified reference submission, direct approval, a single family ticket, lease/retry behavior, missing email, safe late retries, revocation, duplicate group check-in and upgrading old attendee tickets. Sequential duplicate requests are tested; cross-device exclusion relies on database row locks. Real provider delivery and physical QR camera scans are not claimed verified by these tests.

`tests/halloween-browser-fixture.mjs` is an optional local-only visual QA backend with test event values, an in-memory database and fake Auth. It generates a temporary `public/halloween-ui-test-only-qr.png` test asset and removes it on normal exit. Do not commit that asset. Point a separate local dev process at `http://127.0.0.1:54399` with fake Supabase keys, `SITE_URL=http://localhost:3001`, and `RESEND_API_KEY` empty. Never point deployed code at this fixture.
