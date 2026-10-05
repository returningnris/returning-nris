export const HALLOWEEN_EVENT_ID = 'halloween-2026'
export const HALLOWEEN_PATH = '/events/halloween'
export const HALLOWEEN_VENUE = 'The Quantium School, Mokila, Hyderabad'
export const HALLOWEEN_TIMINGS = '5 PM – 9 PM'
export const HALLOWEEN_PAYMENT_CONTACT = { upiId: '7578827578@ybl', phone: '7578827578' } as const

export type HalloweenEvent = {
  id: string
  name: string
  event_date: string
  timezone: string
  venue: string | null
  timings: string | null
  upi_id: string | null
  payment_recipient_name: string | null
  payment_qr_image_url: string | null
  registration_open: boolean
}

export type HalloweenTicket = {
  ticket_identifier: string
  validation_token: string
  category: 'family'
  attendee_label: string
  checked_in_at: string | null
}

export type HalloweenBooking = {
  booking_reference: string
  contact_name: string
  adult_count: number
  child_count: number
  amount_inr: number
  payment_verified: boolean
  transaction_reference: string | null
  payment_submitted_at: string | null
  confirmed_at: string | null
}

export type PrivateBooking = {
  booking: HalloweenBooking
  event: HalloweenEvent
  tickets: HalloweenTicket[]
}

export function halloweenPrice(adults: number, children: number) {
  if (!Number.isInteger(adults) || !Number.isInteger(children) ||
      adults < 1 || children < 1 || adults > 50 || children > 50) {
    throw new Error('Choose between 1 and 50 adults and children.')
  }
  const includedAdults = Math.min(adults, children)
  const additionalAdults = Math.max(adults - children, 0)
  return { childCharges: children * 500, includedAdults, additionalAdults,
    adultCharges: additionalAdults * 500, total: (children + additionalAdults) * 500 }
}

export function validateHalloweenRegistration(body: Record<string, unknown>) {
  const contactName = typeof body.contactName === 'string' ? body.contactName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.replace(/[\s()-]/g, '') : ''
  const adults = body.adults
  const children = body.children
  const key = body.idempotencyKey
  if (contactName.length < 2 || contactName.length > 100) throw new Error('Enter your contact name (2–100 characters).')
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')
  if (!/^\+[1-9]\d{7,14}$/.test(whatsapp)) throw new Error('Enter your WhatsApp number with country code, such as +91.')
  if (typeof key !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) {
    throw new Error('Please reload the form and try again.')
  }
  if (typeof adults !== 'number' || typeof children !== 'number') throw new Error('Select adult and child counts.')
  const price = halloweenPrice(adults, children)
  return { contactName, email, whatsapp, adults, children, key, price }
}

export function isPrivateToken(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value)
}

export function paymentImageUrl(value: string | null) {
  if (!value) return null
  if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) return value
  try { return new URL(value).protocol === 'https:' ? value : null } catch { return null }
}

export function parseHalloweenTicket(value: string, origin: string) {
  const trimmed = value.trim()
  if (isPrivateToken(trimmed) || /^HW26-T-\d{8}$/i.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    const token = url.hash.slice(1)
    if (url.origin === origin && url.pathname === `${HALLOWEEN_PATH}/ticket` && isPrivateToken(token)) return token
  } catch { /* A manual identifier does not need to be a URL. */ }
  throw new Error('Enter a valid attendee ticket identifier or scan its QR code.')
}

export function confirmationText(booking: Pick<HalloweenBooking, 'booking_reference' | 'adult_count' | 'child_count' | 'amount_inr'>, event: HalloweenEvent, privateLink: string) {
  return `${event.name}\nBooking: ${booking.booking_reference}\nPayment verified: ₹${booking.amount_inr.toLocaleString('en-IN')}\n${booking.adult_count} adult(s) · ${booking.child_count} child(ren)\n31 October 2026 · ${event.timings || 'Timings to be announced'} (Asia/Kolkata)\nVenue: ${event.venue || 'To be announced'}\nYour family ticket: ${privateLink}\nKeep this link private. One QR code covers your entire registered group. Please arrive together for check-in.`
}
