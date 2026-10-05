-- OPTIONAL scheduled worker, using Supabase Cron + Vault. Run once after deployment.
-- Do NOT run with placeholders. Never commit a real worker secret to this repository.
-- Alternative: a Vercel Pro cron or another scheduler can call the same protected endpoint.
-- The worker GET requires: Authorization: Bearer <CRON_SECRET from the website>.

-- 1. Enable pg_cron and pg_net in Database > Extensions, or uncomment:
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;

-- 2. Store the REAL production origin and matching CRON_SECRET in Supabase Vault.
-- Create/update these named secrets through the Supabase dashboard, or replace
-- the placeholders and uncomment ONLY in SQL Editor (do not save real values here):
-- select vault.create_secret('https://YOUR-ACTUAL-DOMAIN', 'halloween_site_origin');
-- select vault.create_secret('YOUR-ACTUAL-WEBSITE-CRON-SECRET', 'halloween_cron_secret');

-- 3. Uncomment the scheduling statement after the two secrets exist.
-- cron.schedule replaces a named existing job; rerunning does not add a second worker.
-- select cron.schedule('halloween-confirmations', '*/5 * * * *', $worker$
--   select net.http_get(
--     url := (select decrypted_secret from vault.decrypted_secrets where name='halloween_site_origin')
--       || '/api/halloween/notifications',
--     headers := jsonb_build_object('Authorization', 'Bearer ' ||
--       (select decrypted_secret from vault.decrypted_secrets where name='halloween_cron_secret')),
--     timeout_milliseconds := 60000
--   );
-- $worker$);

-- Inspect Cron job runs / net._http_response without copying secrets or private links.
-- A 401 response means the Vault secret does not match CRON_SECRET in your website.
-- To stop this event worker after the event:
-- select cron.unschedule('halloween-confirmations');
