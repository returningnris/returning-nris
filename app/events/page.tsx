import type { Metadata } from 'next'
import Link from 'next/link'
import { HALLOWEEN_PATH, HALLOWEEN_TIMINGS, HALLOWEEN_VENUE } from '@/lib/halloween'

export const metadata: Metadata = {
  title: 'Community Events | Returning NRIs',
  description: 'Meet Returning NRI families at community events. Explore our Halloween Party in Mokila, Hyderabad on 31 October 2026.',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  return <main style={{ background: '#f8fbff', padding: 'clamp(2.5rem, 6vw, 5rem) 1.25rem' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <p className="section-label">Meet your community</p>
      <h1 style={{ color: '#062c59', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', margin: '.75rem 0' }}>Events</h1>
      <p style={{ color: '#526476', lineHeight: 1.7, marginBottom: '2rem' }}>Spend time with other Returning NRI families and make new connections.</p>
      <article style={{ maxWidth: 640, background: '#fff', border: '1px solid #e8e2d9', borderRadius: 22, padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
        <p className="section-label">A family community event</p>
        <h2 style={{ color: '#062c59', fontSize: '2rem', margin: '.75rem 0' }}><Link href={HALLOWEEN_PATH}>Halloween Party</Link></h2>
        <p style={{ fontWeight: 600, marginBottom: '.65rem' }}>31 October 2026 · {HALLOWEEN_TIMINGS} IST</p>
        <p style={{ color: '#526476', lineHeight: 1.7 }}>{HALLOWEEN_VENUE}</p>
        <p style={{ color: '#526476', lineHeight: 1.7, marginTop: '1rem' }}>Live DJ, trick or treat and exciting games for kids. Food available for purchase.</p>
        <Link href={HALLOWEEN_PATH} className="btn-primary" style={{ marginTop: '1.5rem' }}>View party details →</Link>
      </article>
      <p style={{ marginTop: '2rem' }}><Link href="/community">Explore our community →</Link></p>
    </div>
  </main>
}
