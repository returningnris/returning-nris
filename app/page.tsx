import type { Metadata } from 'next'
import Link from 'next/link'
import ReadinessPersonaCard from '../components/ReadinessPersonaCard'
import YouTubeFeed from '../components/YouTubeFeed'
import { READINESS_PERSONAS } from '../lib/moveBackContent'

export const metadata: Metadata = {
  title: 'Returning to India for NRIs | Readiness, Checklist, RNOR, Cities and Schools',
  description:
    'Free tools and practical guides for NRIs returning to India. Explore readiness by persona, follow a move-back checklist, and plan RNOR, city, school, housing, and first-year decisions.',
  alternates: {
    canonical: 'https://www.returningnris.com',
  },
  openGraph: {
    title: 'Returning to India for NRIs | Readiness, Checklist, RNOR, Cities and Schools',
    description:
      'Free tools and practical guides for NRIs returning to India. Explore readiness by persona, follow a move-back checklist, and plan RNOR, city, school, housing, and first-year decisions.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning to India for NRIs | Readiness, Checklist, RNOR, Cities and Schools',
    description:
      'Free tools and practical guides for NRIs returning to India. Explore readiness by persona, follow a move-back checklist, and plan RNOR, city, school, housing, and first-year decisions.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const MOST_SEARCHED = [
  {
    href: '/resources/rnor-status-nri-returning-to-india',
    label: 'RNOR Status Explained for Returning NRIs',
    body: 'Understand the RNOR window, why timing matters, and how it affects your return.',
  },
  {
    href: '/resources/nri-returning-to-india-checklist',
    label: 'NRI Returning to India Checklist',
    body: 'A practical checklist that covers planning, landing, and the first year back.',
  },
  {
    href: '/resources/should-i-return-to-india-from-usa',
    label: 'Should I return to India from the USA?',
    body: 'Think through career, family life, finances, and timing before you commit.',
  },
  {
    href: '/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
    label: 'Hyderabad Neighbourhood Guide for Returning NRI Families',
    body: 'Explore commute, school, and family-fit tradeoffs before you choose an area.',
  },
  {
    href: '/resources/bangalore-neighbourhood-guide-for-returning-nri-families',
    label: 'Bangalore Neighbourhood Guide for Returning NRI Families',
    body: 'Shortlist neighborhoods based on daily life, school fit, and budget realities.',
  },
  {
    href: '/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
    label: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs',
    body: 'Compare boards in plain English before school planning becomes urgent.',
  },
]

const HELP_TOPICS = [
  {
    title: 'RNOR tax timing',
    body: 'Work out how residency, foreign income, and account changes line up with your move date.',
    href: '/resources/rnor-status-nri-returning-to-india',
    cta: 'Read the RNOR guide',
  },
  {
    title: 'Move timing',
    body: 'Decide when to move based on work, tax, school calendars, and how prepared the family really is.',
    href: '/journey',
    cta: 'View the checklist',
  },
  {
    title: 'City selection',
    body: 'Compare where work, family support, weather, commute, and daily life actually fit.',
    href: '/city',
    cta: 'Explore city planning',
  },
  {
    title: 'School planning',
    body: 'Choose boards, shortlist schools, and line up admissions before the move gets close.',
    href: '/schools',
    cta: 'Compare school options',
  },
  {
    title: 'Rent vs buy',
    body: 'Decide whether to rent first, how stable your location needs to be, and what to avoid rushing.',
    href: '/housing',
    cta: 'Plan housing decisions',
  },
  {
    title: 'US investments after moving',
    body: 'Think through brokerage access, retirement assets, taxes, and how you will manage accounts after relocating.',
    href: '/resources',
    cta: 'Browse practical guides',
  },
]

const FAQS = [
  {
    question: 'What is RNOR and why does it matter when returning to India?',
    answer:
      'RNOR stands for Resident but Not Ordinarily Resident. It can create a temporary window where some foreign income is treated differently for India tax purposes, which is why move timing matters so much.',
  },
  {
    question: 'What should I plan first when moving back to India from the USA?',
    answer:
      'Start with the move window. It affects RNOR, payroll, school admissions, lease timing, banking, and when you need to make major financial changes.',
  },
  {
    question: 'Is it better to rent or buy when returning to India?',
    answer:
      'Many returning NRIs rent first so they can learn the city, commute, school fit, and neighborhood tradeoffs before locking in a purchase.',
  },
  {
    question: 'How do I choose the right city after living abroad?',
    answer:
      'The right city depends on work flexibility, family support, school options, commute tolerance, lifestyle, and budget. Daily-life fit matters more than brand value alone.',
  },
  {
    question: 'What should returning NRIs focus on in the first 90 days after moving back?',
    answer:
      'Housing setup, banking, school admissions, healthcare, local paperwork, and making sure the financial and tax plan still matches the actual landing timeline usually matter most.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <style>{`
        .home-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        .home-hero {
          background:
            radial-gradient(circle at top left, rgba(240,138,36,0.12), transparent 34%),
            radial-gradient(circle at 82% 18%, rgba(23,117,58,0.1), transparent 26%),
            linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
          padding: 3rem 0 2.25rem;
        }
        .home-hero-grid,
        .home-persona-grid,
        .home-topic-grid,
        .home-link-grid,
        .home-faq-grid {
          display: grid;
          gap: 1rem;
        }
        .home-persona-grid,
        .home-topic-grid,
        .home-link-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-faq-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 1100px) {
          .home-persona-grid,
          .home-topic-grid,
          .home-link-grid,
          .home-faq-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 767px) {
          .home-shell {
            padding: 0 1rem;
          }
          .home-hero {
            padding: 1.5rem 0 2rem;
          }
          .home-persona-grid,
          .home-topic-grid,
          .home-link-grid,
          .home-faq-grid {
            grid-template-columns: 1fr;
          }
          .home-cta-row {
            flex-direction: column;
            align-items: stretch !important;
          }
          .home-cta-row a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section className="home-hero">
        <div className="home-shell">
          <div
            style={{
              maxWidth: 1040,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(29,22,15,0.10)',
              borderRadius: 28,
              boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
              padding: '2.35rem 2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 1.3rem',
                borderRadius: 999,
                background: '#fff1de',
                color: '#8d5c22',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Free tools for NRIs returning to India
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.7rem, 5.6vw, 5rem)',
                lineHeight: 0.98,
                color: '#1d160f',
                margin: '0 auto 1rem',
                maxWidth: 860,
              }}
            >
              Returning to India? Start with clarity.
            </h1>

            <p
              style={{
                fontSize: 17,
                color: '#665848',
                lineHeight: 1.8,
                maxWidth: 820,
                margin: '0 auto 2rem',
              }}
            >
              Explore readiness by persona, follow a practical move-back checklist, and use focused tools for RNOR, cities, schools, housing, and first-year planning.
            </p>

            <div
              className="home-cta-row"
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/planner" className="btn-primary">
                See Readiness by Persona
              </Link>
              <Link href="/journey" className="btn-secondary">
                View Move-Back Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      <YouTubeFeed />

      <section style={{ background: '#fffdf9', padding: '0 0 5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Readiness</div>
            <h2 className="section-title">Start with the situation closest to yours</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              These personas are designed to help you see where you broadly stand before you dive into detailed planning.
            </p>
          </div>

          <div className="home-persona-grid">
            {READINESS_PERSONAS.map((persona) => (
              <ReadinessPersonaCard key={persona.id} persona={persona} compact />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#f8f5f0', padding: '5rem 0' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Planning help</div>
            <h2 className="section-title">What returning NRIs usually need help with</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Most move-back plans hit the same questions around timing, money, city, school, housing, and what to do with assets abroad.
            </p>
          </div>

          <div className="home-topic-grid">
            {HELP_TOPICS.map((topic) => (
              <div
                key={topic.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.35rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{topic.title}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{topic.body}</p>
                <Link href={topic.href} className="btn-ghost">
                  {topic.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '5rem 0' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Most searched by returning NRIs</div>
            <h2 className="section-title">Popular guides before moving back to India</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              These are the topics people usually search for first when they are planning RNOR, cities, schools, and their move-back checklist.
            </p>
          </div>

          <div className="home-link-grid">
            {MOST_SEARCHED.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.35rem',
                  textDecoration: 'none',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Guide
                </div>
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{guide.label}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{guide.body}</p>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>Read guide</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Common questions about returning to India</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              A quick starting point for the questions people usually ask around RNOR, the move window, city choice, and the first 90 days back.
            </p>
          </div>

          <div className="home-faq-grid">
            {FAQS.map((item) => (
              <div
                key={item.question}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.4rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{item.question}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#1f1610', padding: '5rem 0' }}>
        <div className="home-shell">
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.45rem 0.85rem',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.76)',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
              }}
            >
              Plan your move with clarity
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.02, color: '#fff', marginBottom: '1rem' }}>
              See where you broadly stand, then work through the plan.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, maxWidth: 720, margin: '0 auto 1.75rem' }}>
              Start with readiness by persona, then use the move-back checklist and practical guides to go deeper where you need it.
            </p>
            <div className="home-cta-row" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/planner" className="btn-primary">
                See Readiness by Persona
              </Link>
              <Link href="/journey" className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}>
                View Move-Back Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
