import Image from 'next/image'
import Link from 'next/link'
import { PLANNING_CALL_URL, PLANNING_SOCIAL_PROOF, PLANNING_TESTIMONIALS, TOPMATE_PROFILE_URL } from '../lib/planning-call'

export default function PlanningCall({ testimonials = false, description }: { testimonials?: boolean; description?: string }) {
  return (
    <section className="planning-section" aria-label="1:1 Return to India Planning">
      <div className="planning-card">
        {testimonials && <Image src="/return-to-india-planning.png" alt="1:1 Return to India Planning: practical guidance on finances, schools, housing and settling in" width={964} height={534} sizes="(max-width: 760px) 100vw, 50vw" className="planning-artwork" />}
        <div className="planning-copy">
          <p className="section-label">Your questions. Your family. Your plan.</p>
          <h2 className="section-title">1:1 Return to India Planning</h2>
          <p>{description ?? 'Talk through your move with Swathi and Bharath. Get practical, experience-led guidance on finances, schools, housing, and settling back in India.'}</p>
          <p className="planning-rating"><span aria-hidden="true">★★★★★ </span>{PLANNING_SOCIAL_PROOF}</p>
          <a href={PLANNING_CALL_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book my 1:1 planning call ↗</a>
          <p className="planning-note">45-minute video call · View pricing and available times on Topmate</p>
          <Link href="/planner" className="planning-text-link">Start with the free return planner</Link>
        </div>
      </div>
      {testimonials && (
        <div className="planning-testimonials">
          <h2 className="section-title">Clarity for the move ahead.</h2>
          <p>Selected excerpts from families who shared their experience on Topmate.</p>
          <div className="planning-quotes">
            {PLANNING_TESTIMONIALS.map(({ quote, author }) => (
              <figure key={author}>
                <blockquote>“{quote}”</blockquote>
                <figcaption>{author} · Topmate testimonial excerpt</figcaption>
              </figure>
            ))}
          </div>
          <a href={`${TOPMATE_PROFILE_URL}#testimonials`} target="_blank" rel="noopener noreferrer" className="planning-text-link">Read all testimonials on Topmate ↗</a>
        </div>
      )}
    </section>
  )
}
