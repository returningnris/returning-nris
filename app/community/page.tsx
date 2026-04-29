import type { Metadata } from 'next'
import Link from 'next/link'
import CommunityJoinForm from '../../components/CommunityJoinForm'

export const metadata: Metadata = {
  title: 'Returning NRI WhatsApp Community | ReturningNRIs.com',
  description:
    'Join the Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ active Hyderabad members and get practical help on schools, housing, tax, finance, and settling in.',
  alternates: {
    canonical: 'https://www.returningnris.com/community',
  },
  openGraph: {
    title: 'Returning NRI Community - WhatsApp, Online Meets & Hyderabad 2026 Meetups',
    description:
      'Join the Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ active Hyderabad members and get practical help on schools, housing, tax, finance, and settling in.',
    url: 'https://www.returningnris.com/community',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning NRI WhatsApp Community | ReturningNRIs.com',
    description:
      'Join the Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ active Hyderabad members and get practical help on schools, housing, tax, finance, and settling in.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const trustBadges = [
  '250+ active members in our Hyderabad Returning NRI group',
  'Successful first online group meeting completed',
  'Regular online sessions being planned',
  'In-person Hyderabad meetup planned for 2026 returnees',
]

const benefits = [
  {
    title: 'Real experiences from returned NRIs',
    body: 'Learn from families who have already gone through the move.',
  },
  {
    title: 'Hyderabad-specific discussions',
    body: 'Schools, gated communities, rentals, local setup, and first 90 days.',
  },
  {
    title: 'Tax and financial planning awareness',
    body: 'RNOR, US assets, banking, insurance, and investment planning discussions.',
  },
  {
    title: 'Trusted professional connections',
    body: 'Get access to vetted CPAs, financial planners, insurance advisors, relocation support, and other useful services over time.',
  },
]

const beyondWhatsAppCards = [
  {
    title: 'Regular Online Meets',
    body: 'Topic-based sessions for families planning their move back to India.',
  },
  {
    title: 'Hyderabad 2026 Returnees Meetup',
    body: 'In-person gathering planned for families moving to Hyderabad in 2026.',
  },
  {
    title: 'Practical Peer Support',
    body: 'Learn from people who are planning, moving, or have already moved back.',
  },
]

const audiencePoints = [
  'NRIs planning to move back to India in 2025, 2026, or later',
  'Families moving from the USA, Canada, UK, Australia, Middle East, or other countries',
  'People considering Hyderabad as their return city',
  'Returned NRIs who want to share their experience and support others',
  'NRIs looking for reliable guidance on tax, housing, schools, money, and settling in',
  'Families planning to return to India in 2026 and interested in joining future online or in-person community sessions',
  'NRIs who want real conversations, not just generic online content',
]

const guidelines = [
  'Be respectful and helpful',
  'No spam or random promotions',
  'Share personal experiences where possible',
  'Professional referrals should be transparent',
  'Admins may remove posts or members that do not follow the community purpose',
]

const relatedLinks = [
  {
    href: '/resources/rnor-status-nri-returning-to-india',
    label: 'RNOR guide',
    body: 'Understand the RNOR window before your move timeline locks in.',
  },
  {
    href: '/schools',
    label: 'Schools planning',
    body: 'Compare school options before admissions become time-sensitive.',
  },
  {
    href: '/housing',
    label: 'Housing decisions',
    body: 'Think through rentals, neighborhoods, and whether to rent first.',
  },
  {
    href: '/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
    label: 'Hyderabad neighborhoods',
    body: 'Explore practical Hyderabad tradeoffs before you shortlist areas.',
  },
]

export default function CommunityPage() {
  return (
    <>
      <style>{`
        .community-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .community-soft-section {
          padding: 4.5rem 0;
        }
        .community-card-grid,
        .community-trust-grid,
        .community-link-grid,
        .community-beyond-grid {
          display: grid;
          gap: 1rem;
        }
        .community-card-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .community-trust-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .community-link-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .community-beyond-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 1100px) {
          .community-card-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .community-link-grid,
          .community-beyond-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 767px) {
          .community-shell {
            padding: 0 1rem;
          }
          .community-soft-section {
            padding: 3.25rem 0;
          }
          .community-card-grid,
          .community-trust-grid,
          .community-link-grid,
          .community-beyond-grid {
            grid-template-columns: 1fr;
          }
          .community-hero-card,
          .community-cta-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>

      <section
        style={{
          background:
            'radial-gradient(circle at top left, rgba(19,136,8,0.12), transparent 30%), radial-gradient(circle at 85% 18%, rgba(255,153,51,0.12), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%)',
          padding: '2.5rem 0 3rem',
        }}
      >
        <div className="community-shell">
          <div
            className="community-hero-card"
            style={{
              maxWidth: 1040,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.1)',
              borderRadius: 30,
              padding: '2rem',
              boxShadow: '0 24px 54px rgba(29,22,15,0.07)',
            }}
          >
            <div className="section-label">Returning NRI Community - WhatsApp, Online Meets & Hyderabad 2026 Meetups</div>
            <h1
              style={{
                fontSize: 'clamp(2.35rem, 6vw, 4.7rem)',
                lineHeight: 1,
                color: '#1a1208',
                maxWidth: 880,
                marginBottom: '1rem',
              }}
            >
              Moving back to India? Join a real community, not just another WhatsApp group.
            </h1>
            <p
              style={{
                maxWidth: 820,
                fontSize: '1.05rem',
                color: '#5c5346',
                lineHeight: 1.85,
                marginBottom: '1.4rem',
              }}
            >
              Connect with NRIs who are planning their return, families already navigating the transition, and returned NRIs sharing practical experiences around schools, housing, tax planning, money transfer, and settling back in India.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.75rem 1rem',
                borderRadius: 18,
                background: '#f4fbf5',
                border: '1px solid rgba(19,136,8,0.16)',
                color: '#21542d',
                fontSize: '0.94rem',
                lineHeight: 1.6,
                marginBottom: '1.4rem',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#138808', flexShrink: 0 }} />
              Recently completed our first successful Returning NRI group meeting. More regular online sessions and Hyderabad in-person meetups are being planned for 2026 returnees.
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.85rem',
                marginBottom: '1.75rem',
              }}
            >
              <Link
                href="#join-community"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.95rem 1.5rem',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
                }}
              >
                Join the Community
              </Link>
              <p style={{ fontSize: '0.92rem', color: '#6d6357' }}>
                Currently active city group: Hyderabad. More city groups coming soon.
              </p>
            </div>

            <div className="community-trust-grid">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    padding: '1rem',
                    borderRadius: 20,
                    border: '1px solid rgba(26,18,8,0.08)',
                    background: '#fcfbf8',
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(19,136,8,0.12)',
                      color: '#138808',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                  <p style={{ fontSize: '0.95rem', color: '#3f352a', lineHeight: 1.65 }}>{badge}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#fffdf9' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.4rem' }}>
            <div className="section-label">Why Join?</div>
            <h2 className="section-title">Useful conversations for families planning the move back</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              The goal is simple: practical support from people who understand what this transition really looks like.
            </p>
          </div>

          <div className="community-card-grid">
            {benefits.map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(26,18,8,0.1)',
                  borderRadius: 24,
                  padding: '1.4rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: '#edf7ef',
                    color: '#138808',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    marginBottom: '1rem',
                  }}
                >
                  {item.title.split(' ')[0][0]}
                </div>
                <h3 style={{ fontSize: '1.35rem', color: '#1a1208', marginBottom: '0.65rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.96rem', color: '#5c5346', lineHeight: 1.75 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#f7fbf8' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 2.4rem' }}>
            <div className="section-label">Beyond WhatsApp</div>
            <h2 className="section-title">Real conversations, real support</h2>
            <p className="section-sub" style={{ margin: '0 auto 1rem', maxWidth: 760 }}>
              The Returning NRI journey can feel overwhelming when you are trying to figure everything out alone from another country. That is why this community is being built beyond messages and forwarded links.
            </p>
            <p className="section-sub" style={{ margin: '0 auto 1rem', maxWidth: 760 }}>
              We have already completed a successful online group meeting with Returning NRIs and are planning more regular sessions around practical topics like schools, housing, RNOR/tax planning, money movement, healthcare, and the first 90 days after moving.
            </p>
            <p className="section-sub" style={{ margin: '0 auto', maxWidth: 760 }}>
              We are also planning an in-person Hyderabad get-together for 2026 returnees so families can build real connections before and after the move.
            </p>
          </div>

          <div className="community-beyond-grid">
            {beyondWhatsAppCards.map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(19,136,8,0.12)',
                  borderRadius: 24,
                  padding: '1.4rem',
                  boxShadow: '0 18px 38px rgba(19,136,8,0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.35rem', color: '#1a1208', marginBottom: '0.7rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.96rem', color: '#5c5346', lineHeight: 1.75 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#ffffff' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.25rem' }}>
            <div className="section-label">Who Is This For?</div>
            <h2 className="section-title">Built for people actively preparing a real move</h2>
          </div>

          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              background: '#fcfbf8',
              border: '1px solid rgba(26,18,8,0.08)',
              borderRadius: 28,
              padding: '1.5rem',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.95rem' }}>
              {audiencePoints.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(19,136,8,0.12)',
                      color: '#138808',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                  <span style={{ fontSize: '1rem', color: '#3f352a', lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#f8fbf8' }}>
        <div className="community-shell">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <CommunityJoinForm />
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#fffdf9', paddingTop: 0 }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.25rem' }}>
            <div className="section-label">Community Guidelines</div>
            <h2 className="section-title">A useful group depends on good community behavior</h2>
          </div>

          <div
            style={{
              maxWidth: 900,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.1)',
              borderRadius: 28,
              padding: '1.6rem',
              boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
            }}
          >
            <p style={{ fontSize: '1rem', color: '#5c5346', lineHeight: 1.75, marginBottom: '1rem' }}>
              To keep the group useful for everyone:
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.85rem' }}>
              {guidelines.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#138808', fontWeight: 700, marginTop: 2 }}>-</span>
                  <span style={{ fontSize: '0.98rem', color: '#3f352a', lineHeight: 1.7 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="community-soft-section" style={{ background: '#ffffff', paddingTop: 0 }}>
        <div className="community-shell">
          <div
            style={{
              maxWidth: 960,
              margin: '0 auto',
              borderRadius: 30,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f4fbf5 0%, #ffffff 100%)',
              padding: '1.8rem',
            }}
          >
            <div className="section-label">Built By Returned NRIs</div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', color: '#1a1208', marginBottom: '0.85rem' }}>
              Built from lived experience, not theory
            </h2>
            <p style={{ fontSize: '1rem', color: '#4f4438', lineHeight: 1.85, marginBottom: '1.25rem' }}>
              Built by returned NRIs who lived in the USA for 16 years, experienced the India transition firsthand, spent a full school year in India, evaluated schools and communities, bought a home, interacted with many returned NRI families, and built ReturningNRIs.com to make the process easier for others.
            </p>

            <div className="community-link-grid">
              {relatedLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    background: '#ffffff',
                    border: '1px solid rgba(26,18,8,0.08)',
                    borderRadius: 22,
                    padding: '1.15rem',
                    boxShadow: '0 12px 28px rgba(29,22,15,0.04)',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#138808', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.55rem' }}>
                    {item.label}
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#5c5346', lineHeight: 1.7 }}>{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#1f1610', padding: '4.5rem 0' }}>
        <div className="community-shell">
          <div
            className="community-cta-card"
            style={{
              maxWidth: 920,
              margin: '0 auto',
              textAlign: 'center',
              borderRadius: 32,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 100%)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem 0.95rem',
                borderRadius: 999,
                background: 'rgba(19,136,8,0.18)',
                color: '#d6f0d9',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Ready to join?
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.3rem)', color: '#ffffff', marginBottom: '0.9rem' }}>
              Join the Returning NRI community and be part of upcoming WhatsApp discussions, online sessions, and Hyderabad 2026 returnee meetups.
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, maxWidth: 720, margin: '0 auto 1.5rem' }}>
              Submit your details and we will send you the WhatsApp invite.
            </p>
            <Link
              href="#join-community"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.95rem 1.5rem',
                borderRadius: 999,
                background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
              }}
            >
              Join the WhatsApp Community
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
