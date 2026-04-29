import type { Metadata } from 'next'
import Link from 'next/link'
import CommunityJoinForm from '../../components/CommunityJoinForm'

export const metadata: Metadata = {
  title: 'Free Returning NRI WhatsApp Community | ReturningNRIs.com',
  description:
    'Join the free Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ Hyderabad members and get practical support on schools, housing, tax, finance, and settling in.',
  alternates: {
    canonical: 'https://www.returningnris.com/community',
  },
  openGraph: {
    title: 'Free Returning NRI WhatsApp Community | ReturningNRIs.com',
    description:
      'Join the free Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ Hyderabad members and get practical support on schools, housing, tax, finance, and settling in.',
    url: 'https://www.returningnris.com/community',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Returning NRI WhatsApp Community | ReturningNRIs.com',
    description:
      'Join the free Returning NRI WhatsApp Community for families moving back to India. Connect with 250+ Hyderabad members and get practical support on schools, housing, tax, finance, and settling in.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const trustBadges = [
  'Free WhatsApp community for returning NRI families',
  '250+ active Hyderabad members',
  'Successfully conducting online group meetings',
  'Hyderabad meetup planned for 2026 returnees',
]

const benefits = [
  {
    title: 'Real returned NRI experiences',
    body: 'Learn from families who have already done it.',
  },
  {
    title: 'Hyderabad-specific help',
    body: 'Schools, rentals, gated communities, and the first 90 days.',
  },
  {
    title: 'Money and tax clarity',
    body: 'RNOR, US assets, banking, insurance, and planning questions.',
  },
  {
    title: 'Trusted referrals over time',
    body: 'Useful connections for tax, planning, insurance, and relocation support.',
  },
]

const beyondWhatsAppCards = [
  {
    title: 'Regular Online Meets',
    body: 'Simple, topic-based sessions for families preparing their move.',
  },
  {
    title: 'Hyderabad 2026 Meetup',
    body: 'An in-person meetup planned for families moving in 2026.',
  },
  {
    title: 'Practical Peer Support',
    body: 'Advice from people planning, moving, and already back in India.',
  },
]

const audiencePoints = [
  'NRIs planning a move back to India in 2025, 2026, or later',
  'Families moving from the USA, Canada, UK, Australia, the Middle East, or elsewhere',
  'People considering Hyderabad as their return city',
  'Families who want help with schools, housing, tax, money, and settling in',
  'NRIs who want real conversations, not generic content',
  'Returned NRIs who want to support others',
]

const guidelines = [
  'Be respectful and helpful',
  'No spam or random promotions',
  'Share real experiences where possible',
  'Keep referrals transparent',
  'Admins may remove posts or members that do not fit the group purpose',
]

export default function CommunityPage() {
  return (
    <>
      <style>{`
        .community-shell {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .community-section {
          padding: 3rem 0;
        }
        .community-card-grid,
        .community-trust-grid,
        .community-beyond-grid {
          display: grid;
          gap: 1rem;
        }
        .community-card-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .community-trust-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .community-beyond-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 900px) {
          .community-beyond-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .community-section {
            padding: 2.35rem 0;
          }
          .community-card-grid,
          .community-trust-grid,
          .community-beyond-grid {
            grid-template-columns: 1fr;
          }
          .community-hero-card,
          .community-cta-card,
          .community-simple-card {
            padding: 1.35rem !important;
          }
          .community-hero-badge {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>

      <section
        style={{
          background:
            'radial-gradient(circle at top left, rgba(19,136,8,0.12), transparent 30%), radial-gradient(circle at 85% 18%, rgba(255,153,51,0.12), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%)',
          padding: '2rem 0 2.5rem',
        }}
      >
        <div className="community-shell">
          <div
            className="community-hero-card"
            style={{
              maxWidth: 960,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.1)',
              borderRadius: 30,
              padding: '1.7rem',
              boxShadow: '0 24px 54px rgba(29,22,15,0.07)',
            }}
          >
            <div
              className="community-hero-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.7rem',
                padding: '0.65rem 1rem',
                borderRadius: 999,
                background: '#edf9f0',
                border: '1px solid rgba(19,136,8,0.18)',
                color: '#0f6f07',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.95rem',
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#1a9a42',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 22px rgba(26,154,66,0.18)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 11.5C20 16.194 16.194 20 11.5 20C10.095 20 8.77 19.659 7.604 19.055L4 20L4.979 16.534C4.349 15.1 4 13.515 4 11.5C4 6.806 7.806 3 12.5 3C17.194 3 21 6.806 21 11.5H20Z"
                    fill="white"
                    fillOpacity="0.18"
                  />
                  <path
                    d="M9.25 8.8C9.44 8.36 9.61 8.35 9.92 8.34C10.17 8.33 10.46 8.33 10.75 8.33C11.04 8.33 11.51 8.22 11.9 8.68C12.29 9.14 13.39 10.21 13.39 10.39C13.39 10.57 13.1 10.84 12.96 11C12.82 11.16 12.68 11.35 12.96 11.82C13.24 12.29 14.18 13.81 15.62 14.43C16.76 14.92 16.98 14.83 17.24 14.55C17.5 14.27 18.34 13.29 18.66 12.82C18.98 12.35 19.31 12.43 19.58 12.59C19.85 12.75 21.31 13.46 21.61 13.63C21.91 13.8 22.11 13.88 22.19 14.02C22.27 14.16 22.27 14.84 21.95 15.74C21.63 16.64 20.12 17.46 19.46 17.55C18.8 17.64 17.99 17.95 15.08 16.81C12.17 15.67 10.27 13.16 9.75 12.43C9.23 11.7 8.23 10.35 8.23 8.96C8.23 7.57 8.96 6.9 9.25 6.57"
                    stroke="white"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Free Returning NRI WhatsApp Community
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.15rem, 6vw, 4.1rem)',
                lineHeight: 1,
                color: '#1a1208',
                maxWidth: 760,
                marginBottom: '0.85rem',
              }}
            >
              Moving back to India? You do not have to do it alone.
            </h1>

            <p
              style={{
                maxWidth: 660,
                fontSize: '1rem',
                color: '#5c5346',
                lineHeight: 1.75,
                marginBottom: '1rem',
              }}
            >
              Join our free WhatsApp community to learn from returning NRI families, ask practical questions, and feel more confident about the move.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.7rem 0.95rem',
                borderRadius: 18,
                background: '#f4fbf5',
                border: '1px solid rgba(19,136,8,0.16)',
                color: '#21542d',
                fontSize: '0.9rem',
                lineHeight: 1.55,
                marginBottom: '1rem',
              }}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#138808', flexShrink: 0 }} />
              We are successfully conducting online group meetings and planning Hyderabad meetups for 2026 returnees.
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '1.4rem',
              }}
            >
              <Link
                href="#join-community"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  justifyContent: 'center',
                  padding: '0.95rem 1.35rem',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.18)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 11.5C20 16.194 16.194 20 11.5 20C10.095 20 8.77 19.659 7.604 19.055L4 20L4.979 16.534C4.349 15.1 4 13.515 4 11.5C4 6.806 7.806 3 12.5 3C17.194 3 21 6.806 21 11.5H20Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Join the Free WhatsApp Community
              </Link>
              <p style={{ fontSize: '0.92rem', color: '#6d6357' }}>
                Currently active city: Hyderabad. More cities coming soon.
              </p>
            </div>

            <div className="community-trust-grid">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="community-simple-card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    borderRadius: 20,
                    border: '1px solid rgba(26,18,8,0.08)',
                    background: '#fcfbf8',
                  }}
                >
                  <span
                    style={{
                      width: 30,
                      height: 30,
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
                  <p style={{ fontSize: '0.94rem', color: '#3f352a', lineHeight: 1.55 }}>{badge}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#fffdf9' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 1.9rem' }}>
            <div className="section-label">Why Join?</div>
            <h2 className="section-title">Why families join</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Practical support from people who truly understand this move.
            </p>
          </div>

          <div className="community-card-grid">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="community-simple-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(26,18,8,0.1)',
                  borderRadius: 24,
                  padding: '1.25rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', color: '#1a1208', marginBottom: '0.55rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#5c5346', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#f7fbf8' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 1.9rem' }}>
            <div className="section-label">Beyond WhatsApp</div>
            <h2 className="section-title">Real conversations, real support</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              This is not just a chat group. We are building regular online conversations and real local connections for families preparing their move.
            </p>
          </div>

          <div className="community-beyond-grid">
            {beyondWhatsAppCards.map((item) => (
              <div
                key={item.title}
                className="community-simple-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(19,136,8,0.12)',
                  borderRadius: 24,
                  padding: '1.25rem',
                  boxShadow: '0 18px 38px rgba(19,136,8,0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: '#1a1208', marginBottom: '0.55rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.94rem', color: '#5c5346', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#ffffff' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Who Is This For?</div>
            <h2 className="section-title">Who this is for</h2>
          </div>

          <div
            className="community-simple-card"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              background: '#fcfbf8',
              border: '1px solid rgba(26,18,8,0.08)',
              borderRadius: 28,
              padding: '1.35rem',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.85rem' }}>
              {audiencePoints.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
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
                  <span style={{ fontSize: '0.97rem', color: '#3f352a', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#f8fbf8' }}>
        <div className="community-shell">
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <CommunityJoinForm />
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#fffdf9', paddingTop: 0 }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Community Guidelines</div>
            <h2 className="section-title">Keep it useful for everyone</h2>
          </div>

          <div
            className="community-simple-card"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.1)',
              borderRadius: 28,
              padding: '1.35rem',
              boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.8rem' }}>
              {guidelines.map((item) => (
                <li key={item} style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#138808', fontWeight: 700, marginTop: 2 }}>-</span>
                  <span style={{ fontSize: '0.96rem', color: '#3f352a', lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#ffffff', paddingTop: 0 }}>
        <div className="community-shell">
          <div
            className="community-simple-card"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              borderRadius: 30,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f4fbf5 0%, #ffffff 100%)',
              padding: '1.5rem',
            }}
          >
            <div className="section-label">Built By Returned NRIs</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.35rem)', color: '#1a1208', marginBottom: '0.7rem' }}>
              Built by people who made the move themselves
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#4f4438', lineHeight: 1.7 }}>
              Built by returned NRIs who lived in the USA for 16 years, went through the India transition firsthand, evaluated schools and communities, bought a home, and now help other families make the move with more clarity.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#1f1610', padding: '3.2rem 0' }}>
        <div className="community-shell">
          <div
            className="community-cta-card"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              textAlign: 'center',
              borderRadius: 32,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.03) 100%)',
              padding: '1.8rem',
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
              Free to join
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '0.8rem' }}>
              Join the free Returning NRI WhatsApp community.
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 1.2rem' }}>
              Share your details and we will send the right invite for your move and city.
            </p>
            <Link
              href="#join-community"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.95rem 1.35rem',
                borderRadius: 999,
                background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
              }}
            >
              Join the Free WhatsApp Community
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
