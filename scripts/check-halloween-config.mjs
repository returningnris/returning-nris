import { createRequire } from 'node:module'
import { createClient } from '@supabase/supabase-js'

const require = createRequire(import.meta.url)
require('@next/env').loadEnvConfig(process.cwd())
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.log('Supabase server configuration is missing.')
  process.exitCode = 1
} else {
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await db.from('halloween_events')
    .select('id,venue,timings,upi_id,payment_recipient_name,payment_qr_image_url,registration_open')
    .eq('id', 'halloween-2026').maybeSingle()
  // Report readiness only: never print credentials, actual payment details or private links.
  console.log(error ? { database: 'unavailable', code: error.code || 'network_or_configuration' } : {
    database: 'reachable', eventPresent: !!data, registrationOpen: data?.registration_open,
    configured: Object.fromEntries(['venue','timings','upi_id','payment_recipient_name','payment_qr_image_url'].map(field => [field, !!data?.[field]])),
  })
  if (!error) {
    const { error: migrationError } = await db.from('halloween_notification_outbox').select('delivery_payload').limit(0)
    console.log({ deliveryMigration: !migrationError ? 'applied' : migrationError.code === '42703' ? 'needed' : 'unverified' })
    const { count, error: organiserError } = await db.from('halloween_organisers').select('user_id', { count: 'exact', head: true }).eq('active', true)
    console.log({ activeOrganisers: organiserError ? 'unverified' : count })
  }
  console.log({ siteUrlConfigured: !!(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL),
    workerSecretConfigured: !!process.env.CRON_SECRET, emailSettingsPresent: !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) })
}
