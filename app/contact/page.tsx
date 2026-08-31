import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | ReturningNRIs',
  description: 'Get in touch with ReturningNRIs for practical help and feedback as you plan your move back to India.',
  alternates: { canonical: 'https://www.returningnris.com/contact' },
  openGraph: {
    title: 'Contact ReturningNRIs',
    description: 'Questions about moving back to India? We would love to hear from you.',
    url: 'https://www.returningnris.com/contact',
    type: 'website',
  },
}

const emailAddress = 'hello@returningnris.com'
const emailHref = `mailto:${emailAddress}?subject=Question%20for%20ReturningNRIs`

export default function ContactPage() {
  return (
    <main style={{ background: 'linear-gradient(180deg, #fffaf4 0, #ffffff 28rem)', minHeight: '100%' }}>
      <section style={{ padding: 'clamp(4rem, 9vw, 7rem) 1.25rem 3rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label">Contact us</p>
          <h1 className="section-title" style={{ marginBottom: '1.15rem' }}>Moving back is personal. Your questions can be, too.</h1>
          <p className="section-sub" style={{ margin: '0 auto', maxWidth: '650px' }}>
            Whether you are still exploring the idea, stuck on one decision, or have feedback on a guide, send us a note. We read every message.
          </p>
        </div>
      </section>

      <section style={{ padding: '1.5rem 1.25rem 5rem' }}>
        <div className="contact-grid" style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(280px, 0.75fr)', gap: '1.5rem', alignItems: 'stretch' }}>
          <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '24px', padding: 'clamp(1.5rem, 4vw, 2.75rem)', boxShadow: '0 16px 45px rgba(30, 42, 62, 0.07)' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.65rem, 3vw, 2.2rem)', color: 'var(--ink)', marginBottom: '0.85rem' }}>Start with a simple email</h2>
            <p style={{ color: 'var(--ink-muted)', lineHeight: 1.75, maxWidth: '600px', marginBottom: '1.75rem' }}>
              Tell us where you are in the process and what feels uncertain. You do not need to have it all figured out. A few lines about your family, timing, or the decision you are weighing is plenty.
            </p>
            <a href={emailHref} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '48px', padding: '0.75rem 1.15rem' }}>
              Email {emailAddress}
            </a>
            <p style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', marginTop: '1rem', lineHeight: 1.55 }}>
              For your privacy, please do not include passwords, bank details, tax identification numbers, or other sensitive documents in an email.
            </p>
          </div>

          <aside style={{ background: 'var(--ink)', color: '#ffffff', borderRadius: '24px', padding: 'clamp(1.5rem, 4vw, 2.3rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f8b35a', marginBottom: '0.75rem' }}>A good place to begin</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.7rem', lineHeight: 1.2, marginBottom: '0.85rem' }}>Not sure what to ask yet?</h2>
            <p style={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: '1.4rem' }}>
              Our guides and move planner can help you turn a big, vague decision into practical next steps.
            </p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <Link href="/planner" style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Try the return planner</Link>
              <Link href="/resources" style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Browse practical guides</Link>
            </div>
          </aside>
        </div>
      </section>

      <section style={{ padding: '0 1.25rem 5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.55rem, 3vw, 2rem)', color: 'var(--ink)', textAlign: 'center', marginBottom: '1.5rem' }}>What people usually write to us about</h2>
          <div className="contact-topics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
            {[
              ['Making the move', 'Timing your return, finding a city, or deciding whether this is the right move for your family.'],
              ['Money and planning', 'Questions about practical planning topics, or an idea that would make one of our tools more useful.'],
              ['Feedback and partnerships', 'A guide that needs improving, a useful resource to share, or a thoughtful way to work together.'],
            ].map(([title, description]) => (
              <article key={title} style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '18px', padding: '1.35rem' }}>
                <h3 style={{ color: 'var(--ink)', fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .contact-grid,
          .contact-topics {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
