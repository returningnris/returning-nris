import type { Metadata } from 'next'
import Link from 'next/link'
import HalloweenTerms from '@/components/HalloweenTerms'
import { HALLOWEEN_PATH } from '@/lib/halloween'
import { HALLOWEEN_TERMS_PATH } from '@/lib/halloween-terms'

export const metadata: Metadata = {
  title: 'Halloween Party Terms & Conditions | Returning NRIs',
  description: 'Read the Returning NRIs Halloween Party terms for family registration, child supervision, venue safety, participation risks and liability at The Quantium School.',
  alternates: { canonical: HALLOWEEN_TERMS_PATH },
}

export default function HalloweenTermsPage() {
  return <div className="event-shell event-stack">
    <Link href={HALLOWEEN_PATH} className="event-link">← Back to Halloween registration</Link>
    <section className="event-card event-stack">
      <div className="section-label">Halloween Party · 31 October 2026</div>
      <h1 className="section-title">Terms &amp; Conditions</h1>
      <p className="event-muted">The Quantium School, Mokila, Hyderabad</p>
      <HalloweenTerms />
      <Link href="/contact" className="event-link">Contact the organisers</Link>
    </section>
  </div>
}
