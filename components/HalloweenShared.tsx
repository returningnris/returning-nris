import Link from 'next/link'
import { HALLOWEEN_PATH, HALLOWEEN_VENUE, HALLOWEEN_TIMINGS, halloweenPrice, type HalloweenEvent } from '@/lib/halloween'

export function EventDetails({ event }: { event: HalloweenEvent }) {
  return <div className="event-details">
    <span>31 October 2026</span><span>{event.timings || HALLOWEEN_TIMINGS} · IST</span>
    <span>{event.venue || HALLOWEEN_VENUE}</span>
  </div>
}

export function BookingSteps({ step }: { step: number }) {
  return <nav aria-label="Booking steps" className="event-steps">
    {[['Register', 'Your family details'], ['Pay by UPI', 'Submit your reference'], ['Get your QR', 'One for the whole booking']].map(([title, description], i) =>
      <div key={title} className="event-step" aria-current={step === i + 1 ? 'step' : undefined}>
        <strong>{i + 1}. {title}</strong><span>{description}</span>
      </div>)}
  </nav>
}

export function PriceBreakdown({ adults, childCount }: { adults: number; childCount: number }) {
  let price
  try { price = halloweenPrice(adults, childCount) }
  catch { return <p className="event-notice">Choose at least one adult and one child (up to 50 each).</p> }
  return <div className="event-price" aria-live="polite">
    <dl><dt>{childCount} child{childCount === 1 ? '' : 'ren'} × ₹500</dt><dd>₹{price.childCharges.toLocaleString('en-IN')}</dd>
      <dt>{price.includedAdults} included adult{price.includedAdults === 1 ? '' : 's'}</dt><dd>Free</dd>
      <dt>{price.additionalAdults} additional adult{price.additionalAdults === 1 ? '' : 's'} × ₹500</dt><dd>₹{price.adultCharges.toLocaleString('en-IN')}</dd></dl>
    <div className="event-total"><span>Total</span><span>₹{price.total.toLocaleString('en-IN')}</span></div>
  </div>
}

export function EventLinks() {
  return <div className="event-actions event-muted" style={{ marginTop: '1.5rem' }}>
    <Link href="/community" className="event-link">Our community</Link>
    <Link href="/contact" className="event-link">Contact the organiser</Link>
    <Link href={HALLOWEEN_PATH} className="event-link">Event details</Link>
  </div>
}
