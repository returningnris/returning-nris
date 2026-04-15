import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returning to India for NRIs | RNOR, Checklist, City & School Planning',
  description:
    'Free tools and practical guides for NRIs returning to India. Plan RNOR tax timing, choose the right city, compare schools, and follow a clear move-back checklist.',
  alternates: {
    canonical: 'https://www.returningnris.com',
  },
  openGraph: {
    title: 'Returning to India for NRIs | RNOR, Checklist, City & School Planning',
    description:
      'Free tools and practical guides for NRIs returning to India. Plan RNOR tax timing, choose the right city, compare schools, and follow a clear move-back checklist.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning to India for NRIs | RNOR, Checklist, City & School Planning',
    description:
      'Free tools and practical guides for NRIs returning to India. Plan RNOR tax timing, choose the right city, compare schools, and follow a clear move-back checklist.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const HERO_FACTS = [
  ['RNOR timing', 'Avoid tax mistakes around residency, foreign income, and move date decisions.'],
  ['City shortlist', 'Compare where work, commute, family life, and cost fit your return.'],
  ['School planning', 'Understand board options and admission timing before you land.'],
  ['Move checklist', 'Stay on top of the decisions that matter before and after arrival.'],
]

const MOST_SEARCHED = [
  {
    href: '/resources/rnor-status-nri-returning-to-india',
    label: 'RNOR Status Explained for Returning NRIs',
    body: 'Understand the RNOR window, why it matters, and how it affects your return timeline.',
  },
  {
    href: '/resources/nri-returning-to-india-checklist',
    label: 'NRI Returning to India Checklist',
    body: 'A practical checklist covering pre-move, landing, and first-year priorities.',
  },
  {
    href: '/resources/should-i-return-to-india-from-usa',
    label: 'Should I Return to India from the USA?',
    body: 'Think through career, finances, family life, and timing before you commit.',
  },
  {
    href: '/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
    label: 'Hyderabad Neighbourhood Guide for Returning NRI Families',
    body: 'Explore neighborhoods, commute trade-offs, and family fit before house hunting.',
  },
  {
    href: '/resources/bangalore-neighbourhood-guide-for-returning-nri-families',
    label: 'Bangalore Neighbourhood Guide for Returning NRI Families',
    body: 'Shortlist areas based on schools, commute, lifestyle, and budget realities.',
  },
  {
    href: '/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
    label: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs',
    body: 'Compare school boards in plain English before you choose a city or admissions plan.',
  },
]

const HELP_TOPICS = [
  {
    title: 'RNOR and tax timing',
    body: 'Figure out when you become resident, how RNOR works, and what that means for foreign salary, brokerage income, RSUs, and other overseas assets.',
    href: '/resources/rnor-status-nri-returning-to-india',
    cta: 'Read the RNOR guide',
  },
  {
    title: 'Move timing',
    body: 'Line up visas, work exits, school calendars, travel plans, and tax residency so your move date supports the rest of the plan.',
    href: '/planner',
    cta: 'Start the readiness check',
  },
  {
    title: 'City selection',
    body: 'Compare cities based on commute, weather, cost of living, job access, and what daily life will feel like after years abroad.',
    href: '/city',
    cta: 'Explore city planning',
  },
  {
    title: 'School planning',
    body: 'Make sense of school boards, admission timing, curriculum fit, and how education choices affect where you should live.',
    href: '/schools',
    cta: 'Compare school options',
  },
  {
    title: 'Rent vs buy',
    body: 'Decide whether to rent first, which neighborhood type suits your family, and how much certainty you need before purchasing.',
    href: '/housing',
    cta: 'Plan housing decisions',
  },
  {
    title: 'US investments after moving',
    body: 'Think through how your move changes the way you manage US brokerage accounts, retirement assets, cash flow, and tax reporting.',
    href: '/resources',
    cta: 'Browse financial guides',
  },
]

const TOOL_CARDS = [
  ['Readiness Check', 'See how prepared you are across timing, tax, city, family, and housing decisions.', '/planner'],
  ['RNOR Calculator', 'Model the RNOR window before finalizing your move date.', '/rnor'],
  ['City Match', 'Shortlist cities using practical filters instead of guesswork.', '/city'],
  ['Schools Finder', 'Compare school options based on your child and move timing.', '/schools'],
  ['Housing Finder', 'Start with neighborhoods, rental options, and first-year trade-offs.', '/housing'],
  ['Free Guides', 'Go deeper with checklists, city guides, school guides, and planning articles.', '/resources'],
]

const FAQS = [
  {
    question: 'What is RNOR and why does it matter when returning to India?',
    answer:
      'RNOR stands for Resident but Not Ordinarily Resident. It can give returning NRIs a temporary window where some foreign income is treated differently for India tax purposes, which is why move timing matters so much.',
  },
  {
    question: 'What should I plan first when moving back to India from the USA?',
    answer:
      'Start with timing. Your move date affects RNOR eligibility, job transitions, school admissions, lease decisions, and when you need to make major financial changes.',
  },
  {
    question: 'Is it better to rent or buy when returning to India?',
    answer:
      'Many returning NRIs rent first so they can learn the city, commute, school fit, and neighborhood trade-offs before locking in a purchase. Buying usually makes more sense once your location is stable.',
  },
  {
    question: 'How do I choose the right city after living abroad?',
    answer:
      'The best city depends on work flexibility, family support, school options, commute tolerance, lifestyle, and budget. It helps to compare daily-life fit, not just salary or brand value.',
  },
  {
    question: 'What should returning NRIs focus on in the first 90 days after moving back?',
    answer:
      'The first 90 days usually revolve around housing setup, banking, school admissions, healthcare access, local paperwork, and making sure your financial and tax plan still matches your actual landing timeline.',
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
            radial-gradient(circle at top left, rgba(240, 138, 36, 0.16), transparent 34%),
            radial-gradient(circle at 82% 18%, rgba(23, 117, 58, 0.14), transparent 26%),
            linear-gradient(180deg, #fffaf3 0%, #f5efe6 56%, #f2eadf 100%);
          padding: 3rem 0 4.5rem;
        }
        .home-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
          gap: 1rem;
          align-items: stretch;
        }
        .home-proof-grid,
        .home-link-grid,
        .home-topic-grid,
        .home-tool-grid,
        .home-faq-grid {
          display: grid;
          gap: 1rem;
        }
        .home-proof-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          margin-top: 1rem;
        }
        .home-link-grid,
        .home-topic-grid,
        .home-tool-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-faq-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 1100px) {
          .home-hero-grid,
          .home-proof-grid,
          .home-link-grid,
          .home-topic-grid,
          .home-tool-grid,
          .home-faq-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 767px) {
          .home-shell {
            padding: 0 1rem;
          }
          .home-hero {
            padding: 1.5rem 0 3rem;
          }
          .home-hero-grid,
          .home-proof-grid,
          .home-link-grid,
          .home-topic-grid,
          .home-tool-grid,
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
          <div className="home-hero-grid">
            <div
              style={{
                background: '#fffdf9',
                border: '1px solid rgba(29,22,15,0.10)',
                borderRadius: 28,
                boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
                padding: '2rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.45rem 0.85rem',
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
                  fontSize: 'clamp(2.5rem, 5.4vw, 4.8rem)',
                  lineHeight: 0.98,
                  color: '#1d160f',
                  marginBottom: '1rem',
                  maxWidth: 760,
                }}
              >
                Returning to India? Plan your move back with clarity.
              </h1>

              <p
                style={{
                  fontSize: 17,
                  color: '#665848',
                  lineHeight: 1.8,
                  maxWidth: 720,
                  marginBottom: '2rem',
                }}
              >
                Get help with RNOR tax timing, city selection, school planning, housing decisions, and your move-back
                checklist - all in one place.
              </p>

              <div
                className="home-cta-row"
                style={{
                  display: 'flex',
                  gap: '1.1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Link href="/planner" className="btn-primary">
                  Start Readiness Check
                </Link>
                <Link href="/resources" className="btn-secondary">
                  Browse Free Guides
                </Link>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #20160f 0%, #302117 46%, #173e2c 100%)',
                borderRadius: 28,
                boxShadow: '0 22px 48px rgba(29,22,15,0.08)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '1.7rem 1.6rem 1.35rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '0.4rem 0.8rem',
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
                  Start here
                </div>

                <h2
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                    lineHeight: 1.05,
                    color: '#fff',
                    marginBottom: '0.8rem',
                  }}
                >
                  Most returning NRIs begin with the same questions.
                </h2>

                <p
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.72)',
                    lineHeight: 1.75,
                    marginBottom: '1.25rem',
                  }}
                >
                  When should we move? Can we use RNOR properly? Which city fits our family? What school path works?
                  Should we rent first? These are the decisions this site is built to help you plan.
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    ['Readiness Check', 'Get a practical starting point before making expensive decisions.', '/planner'],
                    ['RNOR Guide', 'Understand the tax window tied to your move timing.', '/resources/rnor-status-nri-returning-to-india'],
                    ['City Planning', 'Compare cities based on real day-to-day fit.', '/city'],
                    ['School Planning', 'Review school boards and admission trade-offs early.', '/schools'],
                  ].map(([title, body, href]) => (
                    <Link
                      key={title}
                      href={href}
                      style={{
                        padding: '1rem',
                        borderRadius: 20,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#fff',
                          marginBottom: 6,
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: 'rgba(255,255,255,0.68)',
                          lineHeight: 1.7,
                          marginBottom: 10,
                        }}
                      >
                        {body}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f3a44f' }}>Open</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="home-proof-grid">
            {HERO_FACTS.map(([title, body]) => (
              <div
                key={title}
                style={{
                  padding: '1rem',
                  borderRadius: 20,
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.08)',
                  boxShadow: '0 16px 32px rgba(29,22,15,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#9d907f',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 8,
                  }}
                >
                  {title}
                </div>
                <div style={{ fontSize: 14, color: '#665848', lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Most searched by returning NRIs</div>
            <h2 className="section-title">Popular guides people look for before moving back to India.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              These are the guides people usually need first when they are planning RNOR, choosing a city, working
              through schools, or building a move-back checklist.
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
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#9d907f',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
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

      <section style={{ background: '#f8f5f0', padding: '5rem 0' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Planning help</div>
            <h2 className="section-title">What returning NRIs usually need help with</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Most move-back plans touch the same areas: RNOR, timing, cities, schools, housing, and what to do with
              your US finances after you relocate.
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
                  padding: '1.4rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{topic.title}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 18 }}>{topic.body}</p>
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
            <div className="section-label">Free tools</div>
            <h2 className="section-title">Use tools and guides together while you plan your move.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Start with the readiness check, then use focused tools and practical guides when you need detail on a
              specific decision.
            </p>
          </div>

          <div className="home-tool-grid">
            {TOOL_CARDS.map(([title, body, href]) => (
              <Link
                key={title}
                href={href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.3rem',
                  textDecoration: 'none',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#9d907f',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 10,
                  }}
                >
                  Tool
                </div>
                <div style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{body}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>Open</div>
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
              A quick starting point for the questions people usually ask around RNOR, city choice, housing, and the
              first 90 days after moving back.
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
          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
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
              Start with your readiness, then work through the big decisions one by one.
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.85,
                maxWidth: 720,
                margin: '0 auto 1.75rem',
              }}
            >
              Use the readiness check for a practical starting point, then go deeper with RNOR, city, school,
              housing, and checklist guides as your move becomes real.
            </p>
            <div
              className="home-cta-row"
              style={{
                display: 'flex',
                gap: '0.85rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/planner" className="btn-primary">
                Start Readiness Check
              </Link>
              <Link href="/resources" className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}>
                Browse Free Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
