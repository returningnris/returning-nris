import type { Metadata } from 'next'
import Link from 'next/link'
import { INSTAGRAM_URL } from '../lib/social-links'

export const metadata: Metadata = {
  title: 'ReturningNRIs | Planner, Community, Videos and Guides for Moving Back to India',
  description:
    'Moving back to India? Start with a clear planner, join the Returning NRI community, watch practical videos, and use focused guides on RNOR, schools, housing, and money.',
  alternates: {
    canonical: 'https://www.returningnris.com',
  },
  openGraph: {
    title: 'ReturningNRIs | Planner, Community, Videos and Guides for Moving Back to India',
    description:
      'Start with a clear planner, join a real Returning NRI community, and learn through practical videos and guides.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReturningNRIs | Planner, Community, Videos and Guides for Moving Back to India',
    description:
      'Start with a clear planner, join a real Returning NRI community, and learn through practical videos and guides.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const quickStartCards = [
  {
    title: 'Start with the planner',
    body: 'See where you stand, follow the move timeline, and track the essentials without a long quiz.',
    href: '/planner',
    cta: 'Open Planner',
  },
  {
    title: 'Join the community',
    body: 'Connect with 250+ active Hyderabad members, online sessions, and families already doing this.',
    href: '/community#join-community',
    cta: 'Join Community',
  },
  {
    title: 'Learn in the format you want',
    body: 'Use YouTube for deep dives and Instagram for short practical reminders as your move gets closer.',
    href: '/videos',
    cta: 'Explore Videos',
  },
]

const focusAreas = [
  {
    title: 'RNOR & Tax',
    body: 'Avoid timing mistakes before your move date hardens.',
    href: '/resources/rnor-status-nri-returning-to-india',
  },
  {
    title: 'Schools',
    body: 'Plan board choice, shortlist schools, and stay ahead of admissions pressure.',
    href: '/schools',
  },
  {
    title: 'Housing',
    body: 'Decide whether to rent first, where to look, and what not to rush.',
    href: '/housing',
  },
  {
    title: 'Money',
    body: 'Think through US accounts, banking, cash buffer, and post-move decisions.',
    href: '/resources',
  },
]

const trustSignals = [
  'Built from real return experience',
  'Planner, community, videos, and guides in one place',
  'Mobile-first and easy to scan',
]

const channelLinks = [
  {
    title: 'WhatsApp Community',
    label: 'Ask, discuss, connect',
    href: '/community#join-community',
    external: false,
  },
  {
    title: 'YouTube Guides',
    label: 'Deep-dive videos',
    href: '/videos',
    external: false,
  },
  {
    title: 'Instagram Tips',
    label: 'Short practical reels',
    href: INSTAGRAM_URL,
    external: true,
  },
]

const guideLinks = [
  {
    href: '/resources/nri-returning-to-india-checklist',
    title: 'Move-back checklist',
    body: 'A practical checklist for planning, landing, and the first year.',
  },
  {
    href: '/resources/should-i-return-to-india-from-usa',
    title: 'Should I return from the USA?',
    body: 'Think through family, finances, timing, and lifestyle tradeoffs.',
  },
  {
    href: '/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
    title: 'School board guide',
    body: 'Compare IB, Cambridge, CBSE, and ICSE in plain English.',
  },
  {
    href: '/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
    title: 'Hyderabad neighborhood guide',
    body: 'Explore commute, school, and family-fit tradeoffs before choosing an area.',
  },
]

const faqs = [
  {
    question: 'What should I plan first when moving back to India?',
    answer:
      'Start with the move window. It affects RNOR timing, school calendars, payroll, housing decisions, and when major financial changes need to happen.',
  },
  {
    question: 'Should I rent first or buy right away?',
    answer:
      'Many returning NRIs rent first so they can learn the commute, neighborhood fit, school routine, and daily-life tradeoffs before committing to a purchase.',
  },
  {
    question: 'How can I learn from people already doing this?',
    answer:
      'Use the Returning NRI community for practical peer support, regular online sessions, and city-specific conversations that are hard to get from generic content alone.',
  },
  {
    question: 'Where should I go for short tips versus detailed explanations?',
    answer:
      'Use Instagram for quick reminders and short reels. Use YouTube when you want longer deep-dive explainers on move-back decisions.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.9" r="0.9" fill="currentColor" />
    </svg>
  )
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
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .home-grid-2,
        .home-grid-3,
        .home-grid-4 {
          display: grid;
          gap: 1rem;
        }
        .home-grid-2 {
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
        }
        .home-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-grid-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        @media (max-width: 1024px) {
          .home-grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 900px) {
          .home-grid-2,
          .home-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .home-shell {
            padding: 0 0.95rem;
          }
          .home-grid-4 {
            grid-template-columns: 1fr;
          }
          .home-action-row {
            flex-direction: column;
            align-items: stretch !important;
          }
          .home-action-row a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section
        style={{
          background:
            'radial-gradient(circle at top left, rgba(240,138,36,0.12), transparent 34%), radial-gradient(circle at 82% 18%, rgba(23,117,58,0.1), transparent 26%), linear-gradient(180deg, #ffffff 0%, #fffdf9 100%)',
          padding: '1.4rem 0 2.2rem',
        }}
      >
        <div className="home-shell">
          <div className="home-grid-2">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(29,22,15,0.1)',
                borderRadius: 30,
                boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
                padding: '1.4rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.45rem 0.8rem',
                  borderRadius: 999,
                  background: '#fff1de',
                  color: '#8d5c22',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.95rem',
                }}
              >
                Start Here
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 6vw, 4.75rem)',
                  lineHeight: 0.97,
                  color: '#1d160f',
                  marginBottom: '0.85rem',
                  maxWidth: 660,
                }}
              >
                Moving back to India? Start with clarity, not chaos.
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: '#665848',
                  lineHeight: 1.75,
                  maxWidth: 640,
                  marginBottom: '1rem',
                }}
              >
                Use one simple planner, a real community, practical videos, and focused guides to make your move feel more manageable.
              </p>

              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {trustSignals.map((signal) => (
                  <span
                    key={signal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 999,
                      background: '#fcfbf8',
                      border: '1px solid rgba(29,22,15,0.08)',
                      color: '#4f4336',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                    }}
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <div className="home-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link href="/planner" className="btn-primary">
                  Start Planner
                </Link>
                <Link href="/community#join-community" className="btn-secondary">
                  Join Community
                </Link>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Instagram Tips
                </a>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(30,22,15,0.98) 0%, rgba(35,25,18,0.97) 58%, rgba(24,52,37,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 30,
                padding: '1.25rem',
                boxShadow: '0 26px 56px rgba(18,13,8,0.16)',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', marginBottom: 8 }}>
                Follow Our Channels
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.15rem)', marginBottom: '0.9rem' }}>
                Learn the way you actually use the site
              </h2>

              {channelLinks.map((channel) =>
                channel.external ? (
                  <a
                    key={channel.title}
                    href={channel.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      padding: '0.95rem',
                      borderRadius: 22,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '0.8rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{channel.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{channel.label}</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: 'rgba(255,153,51,0.18)',
                        color: '#f3b163',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <InstagramIcon />
                    </div>
                  </a>
                ) : (
                  <Link
                    key={channel.title}
                    href={channel.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      padding: '0.95rem',
                      borderRadius: 22,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      marginBottom: '0.8rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{channel.title}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{channel.label}</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: channel.title === 'WhatsApp Community' ? 'rgba(19,136,8,0.2)' : 'rgba(255,153,51,0.16)',
                        color: channel.title === 'WhatsApp Community' ? '#6ad182' : '#f3b163',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ArrowIcon />
                    </div>
                  </Link>
                )
              )}

              <div
                style={{
                  marginTop: '0.3rem',
                  padding: '0.8rem 0.9rem',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.64)',
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                Start with the planner. Then use community, videos, and guides only where you need more detail.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 3.5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Quick Start</div>
            <h2 className="section-title">Choose the next step that matches your situation</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Keep it simple. You do not need to read everything before you begin.
            </p>
          </div>

          <div className="home-grid-3">
            {quickStartCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.1)',
                  borderRadius: 26,
                  padding: '1.2rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 24, color: '#1d160f', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.75, marginBottom: 14 }}>{card.body}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#1d160f' }}>
                  {card.cta}
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#f8f5f0', padding: '3.5rem 0' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Plan Better</div>
            <h2 className="section-title">Go deeper only where you need clarity</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Most returning NRI decisions cluster around timing, money, schools, housing, and first-year adjustment.
            </p>
          </div>

          <div className="home-grid-4">
            {focusAreas.map((area) => (
              <Link
                key={area.title}
                href={area.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.1)',
                  borderRadius: 24,
                  padding: '1.1rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 8 }}>{area.title}</h3>
                <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75, marginBottom: 12 }}>{area.body}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1d160f' }}>
                  Open
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '3.5rem 0' }}>
        <div className="home-shell">
          <div
            style={{
              borderRadius: 30,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f3fbf4 0%, #ffffff 70%)',
              padding: '1.35rem',
              boxShadow: '0 22px 46px rgba(19,136,8,0.06)',
            }}
          >
            <div className="section-label" style={{ color: '#138808' }}>
              Community
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Need help from people actually doing this?
            </h2>
            <p style={{ maxWidth: 660, fontSize: 15, color: '#4f4336', lineHeight: 1.7, marginBottom: '1rem' }}>
              Join the Returning NRI community with 250+ active Hyderabad members, regular online sessions, and short practical content for families planning their move.
            </p>
            <div className="home-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/community#join-community" className="btn-secondary">
                Join Community
              </Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                Follow Instagram Tips
              </a>
              <Link href="/videos" className="btn-ghost">
                Watch Videos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 3.5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Guides</div>
            <h2 className="section-title">Popular guides before moving back to India</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Start with the articles people usually need first when they are narrowing timing, city, school, and family-fit decisions.
            </p>
          </div>

          <div className="home-grid-4">
            {guideLinks.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.1)',
                  borderRadius: 24,
                  padding: '1.1rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 21, color: '#1d160f', marginBottom: 8 }}>{guide.title}</h3>
                <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75, marginBottom: 12 }}>{guide.body}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1d160f' }}>
                  Read guide
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#1f1610', padding: '3.5rem 0' }}>
        <div className="home-shell">
          <div style={{ maxWidth: 940, margin: '0 auto', textAlign: 'center' }}>
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
              Start smart
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.35rem)', lineHeight: 1.02, color: '#fff', marginBottom: '1rem' }}>
              Start with your plan, then go deeper only where you need it.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)', lineHeight: 1.8, maxWidth: 720, margin: '0 auto 1.75rem' }}>
              Planner for structure. Community for real-world context. Videos for faster learning. Guides for the details that still matter.
            </p>
            <div className="home-action-row" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/planner" className="btn-primary">
                Start Planner
              </Link>
              <Link href="/community#join-community" className="btn-secondary">
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 3.5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.8rem' }}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Common questions people usually ask first</h2>
          </div>

          <div className="home-grid-4">
            {faqs.map((item) => (
              <div
                key={item.question}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.1)',
                  borderRadius: 24,
                  padding: '1.15rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: 20, color: '#1d160f', marginBottom: 8 }}>{item.question}</h3>
                <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75 }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
