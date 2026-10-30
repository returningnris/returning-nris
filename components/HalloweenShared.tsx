import Link from 'next/link'
import { HALLOWEEN_PATH, HALLOWEEN_VENUE, HALLOWEEN_TIMINGS, halloweenPrice, type HalloweenEvent } from '@/lib/halloween'

export function EventDetails({ event }: { event: HalloweenEvent }) {
  return <div className="event-details">
    <span>31 October 2026</span><span>{event.timings || HALLOWEEN_TIMINGS} · IST</span>
    <span>{event.venue || HALLOWEEN_VENUE}</span>
  </div>
}

export function BookingSteps({ step, complimentary = false }: { step: number; complimentary?: boolean }) {
  return <nav aria-label="Booking steps" className="event-steps">
    {[['Register', 'Your family details'], [complimentary ? 'Our treat' : 'Pay by UPI', complimentary ? 'No payment needed' : 'Submit your reference'], ['Get your QR', 'One for the whole booking']].map(([title, description], i) =>
      <div key={title} className="event-step" aria-current={step === i + 1 ? 'step' : undefined}>
        <strong>{i + 1}. {title}</strong><span>{description}</span>
      </div>)}
  </nav>
}

export function PriceBreakdown({ adults, childCount, discountApplied = false, discountPerTicket = 250, totalInr }: { adults: number; childCount: number; discountApplied?: boolean; discountPerTicket?: number; totalInr?: number }) {
  let price
  try { price = halloweenPrice(adults, childCount, discountApplied ? discountPerTicket : 0) }
  catch (error) { return <p role="alert" className="event-notice">{error instanceof Error ? error.message : 'Check your booking details.'}</p> }
  // Preserve the breakdown of bookings made at the previous rate.
  const storedUnitPrice = totalInr !== undefined && (discountApplied || totalInr !== price.total)
    ? totalInr / Math.max(adults, childCount) : undefined
  const childUnitPrice = storedUnitPrice ?? price.childCharges / childCount - (discountApplied ? discountPerTicket : 0)
  const adultUnitPrice = childUnitPrice
  const savings = discountApplied ? Math.max(adults, childCount) * 500 - (totalInr ?? price.total) : 0
  return <div className="event-price" aria-live="polite">
    <dl><dt>{childCount} child{childCount === 1 ? '' : 'ren'} × ₹{childUnitPrice}</dt><dd>₹{(childCount * childUnitPrice).toLocaleString('en-IN')}</dd>
      <dt>{price.includedAdults} included adult{price.includedAdults === 1 ? '' : 's'}</dt><dd>Free</dd>
      <dt>{price.additionalAdults} additional adult{price.additionalAdults === 1 ? '' : 's'} × ₹{adultUnitPrice}</dt><dd>₹{(price.additionalAdults * adultUnitPrice).toLocaleString('en-IN')}</dd>
    </dl>
    {savings > 0 && <p className="event-muted">You save ₹{savings.toLocaleString('en-IN')} with your family discount.</p>}
    <div className="event-total"><span>Total</span><span>₹{(totalInr ?? price.total).toLocaleString('en-IN')}</span></div>
  </div>
}

export function EventLinks() {
  return <div className="event-actions event-muted" style={{ marginTop: '1.5rem' }}>
    <Link href="/community" className="event-link">Our community</Link>
    <Link href="/contact" className="event-link">Contact the organiser</Link>
    <Link href={HALLOWEEN_PATH} className="event-link">Event details</Link>
  </div>
}
