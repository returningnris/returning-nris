import 'server-only'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from './supabase-admin'
import { requireAuthenticatedUser } from './supabase-server'
import { getSiteUrl } from './site-url'
import { HALLOWEEN_EVENT_ID, type HalloweenEvent, isPrivateToken, paymentImageUrl } from './halloween'

export class HalloweenError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export function privateJson(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: {
    'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff',
  } })
}

export function halloweenFailure(error: unknown) {
  // Never log request bodies, private URLs, contact details or provider responses.
  return privateJson({ error: error instanceof HalloweenError ? error.message : 'We could not complete this request. Please try again.' },
    error instanceof HalloweenError ? error.status : 503)
}

const fallbackEvent: HalloweenEvent = {
  id: HALLOWEEN_EVENT_ID, name: 'Halloween Party', event_date: '2026-10-31',
  timezone: 'Asia/Kolkata', venue: null, timings: null, upi_id: null,
  payment_recipient_name: null, payment_qr_image_url: null, registration_open: false,
}

export async function getHalloweenEvent(): Promise<HalloweenEvent> {
  const { data, error } = await getSupabaseAdmin().from('halloween_events')
    .select('id,name,event_date,timezone,venue,timings,upi_id,payment_recipient_name,payment_qr_image_url,registration_open')
    .eq('id', HALLOWEEN_EVENT_ID).single()
  if (error || !data) throw new HalloweenError('Event details are temporarily unavailable. Please try again later.', 503)
  return { ...data, name: 'Halloween Party', registration_open: Boolean(data.registration_open && data.venue && data.timings &&
    data.upi_id && data.payment_recipient_name && paymentImageUrl(data.payment_qr_image_url)) }
}

export async function publicHalloweenEvent() {
  try { return { event: await getHalloweenEvent(), available: true } }
  catch { return { event: fallbackEvent, available: false } }
}

function securitySecret() {
  const secret = process.env.HALLOWEEN_SECURITY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!secret) throw new HalloweenError('Registration is temporarily unavailable.', 503)
  return secret
}

function ipHash(request: Request) {
  // Vercel supplies its trusted forwarded IP. For other hosts, configure the proxy
  // to overwrite forwarded headers; never expose the application port directly.
  const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'local'
  return createHmac('sha256', securitySecret()).update(ip.split(',')[0].trim()).digest('hex')
}

export async function halloweenRateLimit(request: Request, action: string, limit = 60, seconds = 60) {
  const { data, error } = await getSupabaseAdmin().rpc('halloween_consume_rate_limit', {
    p_bucket: `${action}:${ipHash(request)}`, p_limit: limit, p_window_seconds: seconds,
  })
  if (error) throw new HalloweenError('Please try again shortly.', 503)
  if (!data) throw new HalloweenError('Too many requests. Please wait a minute and try again.', 429)
}

export function createBotChallenge(request: Request) {
  const payload = `${Date.now()}.${randomBytes(16).toString('hex')}`
  const signature = createHmac('sha256', securitySecret()).update(`${payload}:${ipHash(request)}`).digest('hex')
  return `${payload}.${signature}`
}

export function verifyBotChallenge(request: Request, challenge: unknown, honeypot: unknown) {
  if (honeypot || typeof challenge !== 'string' || challenge.length > 160) throw new HalloweenError('Please reload the form and try again.')
  const [timestamp, nonce, signature] = challenge.split('.')
  if (!/^\d{13}$/.test(timestamp || '') || !/^[a-f0-9]{32}$/.test(nonce || '') || !/^[a-f0-9]{64}$/.test(signature || '')) {
    throw new HalloweenError('Please reload the form and try again.')
  }
  const elapsed = Date.now() - Number(timestamp)
  if (elapsed < 2000 || elapsed > 60 * 60 * 1000) throw new HalloweenError('Please wait a moment, or reload the form if it has expired.')
  const expected = createHmac('sha256', securitySecret()).update(`${timestamp}.${nonce}:${ipHash(request)}`).digest()
  if (!timingSafeEqual(expected, Buffer.from(signature, 'hex'))) throw new HalloweenError('Please reload the form and try again.')
}

export async function readHalloweenBody(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get('origin')
  if (origin !== new URL(request.url).origin && origin !== getSiteUrl(request)) throw new HalloweenError('Request origin not allowed.', 403)
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new HalloweenError('JSON request required.', 415)
  const reader = request.body?.getReader()
  if (!reader) throw new HalloweenError('Request body required.')
  let bytes = 0
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.length
    if (bytes > 8192) { await reader.cancel(); throw new HalloweenError('Request is too large.', 413) }
    chunks.push(value)
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error()
    return data
  } catch { throw new HalloweenError('Invalid request.') }
}

export async function requireHalloweenOrganiser(request: Request) {
  const auth = await requireAuthenticatedUser(request)
  if (auth.errorResponse || !auth.user) throw new HalloweenError('Sign in with your organiser account.', 401)
  const { data, error } = await getSupabaseAdmin().from('halloween_organisers')
    .select('user_id').eq('user_id', auth.user.id).eq('active', true).maybeSingle()
  if (error) throw new HalloweenError('Organiser access is temporarily unavailable.', 503)
  if (!data) throw new HalloweenError('This account does not have organiser access.', 403)
  return auth.user
}

export async function getPrivateHalloweenBooking(token: unknown) {
  if (!isPrivateToken(token)) throw new HalloweenError('Invalid private booking link.', 404)
  const db = getSupabaseAdmin()
  const { data: booking, error } = await db.from('halloween_bookings')
    .select('id,booking_reference,contact_name,adult_count,child_count,amount_inr,payment_verified,transaction_reference,payment_submitted_at,confirmed_at')
    .eq('event_id', HALLOWEEN_EVENT_ID).eq('private_access_token', token).maybeSingle()
  if (error) throw new HalloweenError('Booking is temporarily unavailable.', 503)
  if (!booking) throw new HalloweenError('Invalid private booking link.', 404)
  const event = await getHalloweenEvent()
  const { data: tickets, error: ticketError } = booking.payment_verified
    ? await db.from('halloween_tickets').select('ticket_identifier,validation_token,category,attendee_label,checked_in_at')
      .eq('event_id', HALLOWEEN_EVENT_ID).eq('booking_id', booking.id).eq('category', 'family')
    : { data: [], error: null }
  if (ticketError) throw new HalloweenError('Tickets are temporarily unavailable.', 503)
  const { id: _id, ...publicBooking } = booking
  void _id
  return { booking: publicBooking, event, tickets: tickets || [] }
}

export function canonicalHalloweenOrigin(request?: Request) {
  const configured = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (!configured && !request) throw new HalloweenError('The public site URL has not been configured.', 503)
  const url = new URL(getSiteUrl(request))
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) {
    throw new HalloweenError('A secure public site URL is required.', 503)
  }
  return url.origin
}
