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
    description: 'Meet returned NRI families and West Hyderabad neighbors at our Halloween Party in Mokila on 31 October 2026, 5 PM–9 PM. Family fun and new friendships.',
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
      <p className="event-lead"><strong>Where Global Roots Meet Local Neighbors.</strong></p>
      <p className="event-lead">Bring your little monsters out for a spooktacular evening of festive fun, games, and treats!</p>
      <p className="event-muted">It’s the perfect space for <strong>returned NRI families</strong> and <strong>West Hyderabad locals</strong> to chat, share stories, and build lasting neighborhood friendships while the kids dive into the spooky fun.</p>
      <EventDetails event={event} />
      </div><HalloweenArtwork animated className="halloween-hero-art" /></div>
    </div></header>
    <div className="event-shell"><BookingSteps step={1} /><div className="event-grid">
      <HalloweenRegistration event={event} available={available} />
      <aside className="event-stack">
        <section className="event-card event-stack"><div className="section-label">An evening of family fun</div><h2>What’s happening</h2>
          <p><strong>Music to keep the evening lively</strong></p>
          <p><strong>Trick or treat</strong><br /><span className="event-muted">Halloween fun for the kids.</span></p>
          <p><strong>Exciting games for kids</strong><br /><span className="event-muted">Plenty of fun for our little guests.</span></p>
          <p><strong>New neighborhood friendships</strong><br /><span className="event-muted">Meet returned NRI families and local families, share stories, and get to know your neighbors.</span></p>
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
          <p><strong>2. Pay the exact amount by UPI.</strong><br /><span className="event-muted">Submit your transaction reference. We’ll email you that payment is pending verification. No screenshot needed.</span></p>
          <p><strong>3. Get one QR for your whole family.</strong><br /><span className="event-muted">After bank verification, we’ll email a private link to access one ticket covering every adult and child in your booking.</span></p>
        </section>
      </aside>
    </div><EventLinks /></div>
  </>
}
