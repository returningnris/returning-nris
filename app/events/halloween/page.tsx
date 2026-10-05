import type { Metadata } from 'next'
import Link from 'next/link'
import HalloweenRegistration from '@/components/HalloweenRegistration'
import HalloweenArtwork from '@/components/HalloweenArtwork'
import { BookingSteps, EventDetails, EventLinks } from '@/components/HalloweenShared'
import { publicHalloweenEvent } from '@/lib/halloween-server'
import { HALLOWEEN_PATH } from '@/lib/halloween'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { event } = await publicHalloweenEvent()
  return { title: `${event.name} | Returning NRIs`,
    description: 'Halloween at The Quantium School, Mokila, Hyderabad on 31 October 2026, 5 PM–9 PM. Live DJ, trick or treat, exciting games for kids and food available for purchase.',
    alternates: { canonical: HALLOWEEN_PATH } }
}

export default async function HalloweenPage() {
  const { event, available } = await publicHalloweenEvent()
  return <>
    <header className="event-hero halloween-themed-hero"><div className="event-shell">
      <Link href="/events" className="event-link event-muted">← All events</Link>
      <div className="halloween-hero-grid"><div>
      <div className="section-label halloween-eyebrow" style={{ marginTop: '1.4rem' }}>A family community event</div>
      <h1>{event.name}</h1>
      <p className="event-lead">A chance to meet other Returning NRI families and spend an evening together. Book your family in a few easy steps.</p>
      <EventDetails event={event} />
      </div><HalloweenArtwork className="halloween-hero-art" /></div>
    </div></header>
    <div className="event-shell"><BookingSteps step={1} /><div className="event-grid">
      <HalloweenRegistration event={event} available={available} />
      <aside className="event-stack">
        <section className="event-card event-stack"><div className="section-label">An evening of family fun</div><h2>What’s happening</h2>
          <p><strong>Live DJ</strong><br /><span className="event-muted">Music to keep the evening lively.</span></p>
          <p><strong>Trick or treat</strong><br /><span className="event-muted">Halloween fun for the kids.</span></p>
          <p><strong>Exciting games for kids</strong><br /><span className="event-muted">Plenty of fun for our little guests.</span></p>
          <p><strong>Food available for purchase</strong><br /><span className="event-muted">Food is paid for separately from your registration.</span></p>
        </section>
        <section className="event-card"><div className="section-label">Simple family pricing</div><h2>Bring the family</h2>
          <p className="event-muted">₹500 per child includes one adult free. Additional adults are ₹500 each.</p>
          <div className="event-price" style={{ marginTop: '1rem' }}><dl>
            <dt>1 child + 1 adult</dt><dd>₹500</dd><dt>1 child + 2 adults</dt><dd>₹1,000</dd>
            <dt>2 children + 2 adults</dt><dd>₹1,000</dd><dt>2 children + 3 adults</dt><dd>₹1,500</dd>
          </dl></div>
        </section>
        <section className="event-card event-stack"><h2>How it works</h2>
          <p><strong>1. Register your family.</strong><br /><span className="event-muted">Share your contact details and adult/child counts.</span></p>
          <p><strong>2. Pay the exact amount by UPI.</strong><br /><span className="event-muted">Submit the transaction reference from your UPI app. No screenshot needed.</span></p>
          <p><strong>3. Get one QR for your whole family.</strong><br /><span className="event-muted">After bank verification, your private page shows one ticket covering every adult and child in your booking.</span></p>
        </section>
        <p className="event-muted">Keep your private booking link saved. You can return to it to submit payment or view your family ticket.</p>
      </aside>
    </div><EventLinks /></div>
  </>
}
