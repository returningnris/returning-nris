import type { Metadata } from 'next'
import Link from 'next/link'
import HalloweenArtwork from '@/components/HalloweenArtwork'
import { HALLOWEEN_PATH, HALLOWEEN_TIMINGS, HALLOWEEN_VENUE } from '@/lib/halloween'

export const metadata: Metadata = {
  title: 'Halloween Party — Event Complete | Returning NRIs',
  description: 'Our Halloween Party on 31 October 2026 in Mokila, Hyderabad is complete. Thank you for joining us. Registration is closed.',
  alternates: { canonical: HALLOWEEN_PATH },
}

export default function HalloweenPage() {
  return <main className="event-shell event-stack" style={{ paddingBlock: '3rem' }}>
    <Link href="/events" className="event-link">← All events</Link>
    <section className="event-card event-stack">
      <HalloweenArtwork />
      <p className="section-label">Completed event</p>
      <h1 className="section-title">Halloween Party</h1>
      <p>31 October 2026 · {HALLOWEEN_TIMINGS} IST</p>
      <p>{HALLOWEEN_VENUE}</p>
      <p>Thank you to all the families who joined us for an evening of Halloween fun and new friendships.</p>
      <p><strong>This event is complete. Registration is closed.</strong></p>
      <Link href="/community" className="event-link">Explore our community →</Link>
    </section>
  </main>
}
