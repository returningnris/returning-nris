import 'server-only'
import { Resend } from 'resend'
import { getSupabaseAdmin } from './supabase-admin'
import { canonicalHalloweenOrigin, getHalloweenEvent } from './halloween-server'
import { HALLOWEEN_EVENT_ID, HALLOWEEN_PATH, confirmationText } from './halloween'

type EmailPayload = { from: string; to: string; subject: string; text: string }
type Notification = { id: string; booking_id: string; lease_token: string; first_attempt_at: string;
  attempts: number; delivery_payload: EmailPayload | null }

export async function processHalloweenNotifications() {
  const db = getSupabaseAdmin()
  // Promote exhausted/expired work to an actionable manual state, not a stuck lease.
  const { error: exhaustedError } = await db.from('halloween_notification_outbox')
    .update({ status: 'manual_required', last_error: 'retry_limit_reached', lease_token: null, locked_until: null })
    .gte('attempts', 12).or('status.eq.failed,and(status.eq.processing,locked_until.lt.' + new Date().toISOString() + ')')
  if (exhaustedError) throw new Error('outbox_unavailable')
  const { data: rows, error } = await db.rpc('halloween_claim_notifications', { p_limit: 3 })
  if (error) throw new Error('outbox_unavailable')
  const counts = { accepted: 0, failed: 0, manual: 0, skipped: 0 }
  for (const row of (rows || []) as Notification[]) {
    async function finish(status: 'sent' | 'failed' | 'manual_required', providerId: string | null, errorCode: string | null) {
      const { data, error: finishError } = await db.rpc('halloween_finish_notification', {
        p_id: row.id, p_lease_token: row.lease_token, p_status: status,
        p_provider_message_id: providerId, p_error: errorCode,
      })
      if (finishError || !data) throw new Error('outbox_finish_failed')
    }
    try {
      if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
        await finish('manual_required', null, 'email_not_configured'); counts.manual++; continue
      }
      // Avoid sending again after Resend's 24-hour idempotency window expires.
      if (Date.now() - new Date(row.first_attempt_at).getTime() > 23 * 60 * 60 * 1000) {
        await finish('manual_required', null, 'provider_reconciliation_required'); counts.manual++; continue
      }
      const { data: booking, error: bookingError } = await db.from('halloween_bookings')
        .select('booking_reference,contact_name,email,adult_count,child_count,amount_inr,payment_verified,private_access_token')
        .eq('event_id', HALLOWEEN_EVENT_ID).eq('id', row.booking_id).maybeSingle()
      if (bookingError) throw new Error('booking_unavailable')
      if (!booking?.payment_verified) { counts.skipped++; continue }
      let payload = row.delivery_payload
      if (!payload) {
        const event = await getHalloweenEvent()
        let origin
        try { origin = canonicalHalloweenOrigin() }
        catch { await finish('manual_required', null, 'site_url_not_configured'); counts.manual++; continue }
        payload = { from: `Returning NRIs <${process.env.RESEND_FROM_EMAIL}>`, to: booking.email,
          subject: `Booking confirmed: ${event.name} · ${booking.booking_reference}`,
          text: confirmationText(booking, event, `${origin}${HALLOWEEN_PATH}/booking#${booking.private_access_token}`) }
        const { data: saved, error: saveError } = await db.from('halloween_notification_outbox')
          .update({ delivery_payload: payload }).eq('id', row.id).eq('lease_token', row.lease_token)
          .eq('status', 'processing').gt('locked_until', new Date().toISOString())
          .select('id').maybeSingle()
        if (saveError) throw new Error('payload_unavailable')
        if (!saved) { counts.skipped++; continue }
      }
      // Recheck current approval and lease immediately before the external send.
      const { data: stillApproved, error: approvalError } = await db.from('halloween_bookings')
        .select('id').eq('id', row.booking_id).eq('payment_verified', true).maybeSingle()
      const { data: leased, error: leaseError } = await db.from('halloween_notification_outbox')
        .select('id').eq('id', row.id).eq('lease_token', row.lease_token).eq('status', 'processing')
        .gt('locked_until', new Date().toISOString()).maybeSingle()
      if (approvalError || leaseError) throw new Error('approval_unavailable')
      if (!stillApproved || !leased) { counts.skipped++; continue }
      const resend = new Resend(process.env.RESEND_API_KEY)
      // JSONB can reorder object keys. Rebuild the same field order on every attempt.
      const providerPayload = { from: payload.from, to: payload.to, subject: payload.subject, text: payload.text }
      const { data: accepted, error: sendError } = await resend.emails.send(providerPayload, { idempotencyKey: `halloween-confirmation-${row.id}` })
      if (sendError || !accepted?.id) throw new Error('provider_not_accepted')
      await finish('sent', accepted.id, null)
      counts.accepted++
    } catch {
      counts.failed++
      // Only an error code is stored, never tokens, addresses or provider response bodies.
      try { await finish(row.attempts >= 12 ? 'manual_required' : 'failed', null, 'notification_attempt_failed') }
      catch { /* Lease expiration recovers a transient database failure; stable provider key prevents immediate resend. */ }
    }
  }
  const { error: cleanupError } = await db.from('halloween_rate_limits').delete()
    .lt('window_started_at', new Date(Date.now() - 2 * 86400000).toISOString())
  if (cleanupError) throw new Error('rate_limit_cleanup_failed')
  return counts
}
