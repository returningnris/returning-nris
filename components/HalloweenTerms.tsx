import { HALLOWEEN_TERMS } from '@/lib/halloween-terms'

export default function HalloweenTerms() {
  return <ol className="halloween-terms-list">
    {HALLOWEEN_TERMS.map(term => <li key={term.title}><strong>{term.title}</strong><p className="event-muted">{term.text}</p></li>)}
  </ol>
}
