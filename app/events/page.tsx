import type { Metadata } from 'next'
import Link from 'next/link'
import HalloweenArtwork from '@/components/HalloweenArtwork'
import styles from './events.module.css'
import { HALLOWEEN_PATH, HALLOWEEN_TIMINGS, HALLOWEEN_VENUE } from '@/lib/halloween'

export const metadata: Metadata = {
  title: 'Community Events | Returning NRIs',
  description: 'Meet returned NRI families and West Hyderabad locals at our Halloween Party in Mokila on 31 October 2026. Family fun and new neighborhood friendships.',
  alternates: { canonical: '/events' },
}

export default function EventsPage() {
  return <main style={{ background: '#f8fbff', padding: 'clamp(2.5rem, 6vw, 5rem) 1.25rem' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <p className="section-label">Meet your community</p>
      <h1 style={{ color: '#062c59', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', margin: '.75rem 0' }}>Events</h1>
      <p style={{ color: '#526476', lineHeight: 1.7, marginBottom: '2rem' }}>Meet returned NRI families and families from the neighborhood, share stories, and build new friendships.</p>
      <article className={styles.halloweenCard}>
        <HalloweenArtwork className={styles.artwork} />
        <p className={`section-label ${styles.label}`}>A family community event</p>
        <h2><Link href={HALLOWEEN_PATH}>Halloween Party</Link></h2>
        <p className={styles.date}>31 October 2026 · {HALLOWEEN_TIMINGS} IST</p>
        <p className={styles.description}>{HALLOWEEN_VENUE}</p>
        <p className={styles.activities}><strong>Where Global Roots Meet Local Neighbors.</strong> Meet returned NRI families and West Hyderabad locals while the kids enjoy music, trick or treat, and exciting games. Food available for purchase.</p>
        <Link href={HALLOWEEN_PATH} className={styles.cta}>View party details <span aria-hidden="true">→</span></Link>
      </article>
      <p style={{ marginTop: '2rem' }}><Link href="/community">Explore our community →</Link></p>
    </div>
  </main>
}
