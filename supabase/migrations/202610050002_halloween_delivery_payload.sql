-- Run AFTER 202610050001_halloween_event.sql (including on the already configured project).
-- Freeze the provider request once, so configuration changes cannot alter an email retry.
begin;
alter table public.halloween_notification_outbox
  add column if not exists delivery_payload jsonb;
comment on column public.halloween_notification_outbox.delivery_payload is
  'Server-only frozen transactional email payload. Contains a private link; never log or expose publicly.';
commit;
