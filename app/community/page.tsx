import type { Metadata } from 'next'
import Link from 'next/link'
import CommunityJoinForm from '../../components/CommunityJoinForm'
import { InstagramIcon, WhatsAppIcon } from '../../lib/social-icons'
import { INSTAGRAM_URL } from '../../lib/social-links'

export const metadata: Metadata = {
  title: 'Returning NRI Community | WhatsApp, Online Meets & Hyderabad 2026 Meetups',
  description:
    'Join the Returning NRI community for families moving back to India. Connect with 250+ active Hyderabad members, online sessions, short videos, and practical support on schools, housing, tax, finance, and settling in.',
  alternates: {
    canonical: 'https://www.returningnris.com/community',
  },
  openGraph: {
    title: 'Returning NRI Community | WhatsApp, Online Meets & Hyderabad 2026 Meetups',
    description:
      'Join the Returning NRI community for families moving back to India. Connect with 250+ active Hyderabad members, online sessions, short videos, and practical support on schools, housing, tax, finance, and settling in.',
    url: 'https://www.returningnris.com/community',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning NRI Community | WhatsApp, Online Meets & Hyderabad 2026 Meetups',
    description:
      'Join the Returning NRI community for families moving back to India. Connect with 250+ active Hyderabad members, online sessions, short videos, and practical support on schools, housing, tax, finance, and settling in.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const trustBadges = [
  '250+ active members in our Hyderabad Returning NRI group',
  'Successful first online group meeting completed',
  'Regular online sessions being planned',
  'In-person Hyderabad meetup planned for 2026 returnees',
]

const communityModes = ['WhatsApp conversations', 'Online meets', 'Short practical videos', 'Hyderabad 2026 meetups']

const benefits = [
  {
    title: 'Real experiences from returned NRIs',
    body: 'Learn from families who have already gone through the move.',
  },
  {
    title: 'Hyderabad-specific discussions',
    body: 'Schools, gated communities, rentals, local setup, and the first 90 days.',
  },
  {
    title: 'Tax and financial planning awareness',
    body: 'RNOR, US assets, banking, insurance, and investment planning discussions.',
  },
  {
    title: 'Trusted professional connections',
    body: 'Get access over time to vetted CPAs, financial planners, insurance advisors, relocation support, and other useful services.',
  },
]

const supportCards = [
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
  'Families planning to return to India in 2026 and interested in online or in-person community sessions',
  'Returned NRIs who want to share their experience and support others',
  'NRIs looking for reliable guidance on tax, housing, schools, money, and settling in',
]

const guidelines = [
  'Be respectful and helpful',
  'No spam or random promotions',
  'Share personal experiences where possible',
  'Professional referrals should be transparent',
  'Admins may remove posts or members that do not follow the community purpose',
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
        .community-grid-2,
        .community-grid-3,
        .community-grid-4 {
          display: grid;
          gap: 1rem;
        }
        .community-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .community-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .community-grid-4 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        @media (max-width: 900px) {
          .community-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .community-section {
            padding: 2.35rem 0;
          }
          .community-grid-2,
          .community-grid-3,
          .community-grid-4 {
            grid-template-columns: 1fr;
          }
          .community-action-row {
            flex-direction: column;
            align-items: stretch !important;
          }
          .community-action-row a {
            width: 100%;
            justify-content: center;
          }
          .community-card {
            padding: 1.2rem !important;
          }
        }
      `}</style>

      <section
        style={{
          background:
            'radial-gradient(circle at top left, rgba(19,136,8,0.12), transparent 30%), radial-gradient(circle at 85% 18%, rgba(255,153,51,0.12), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fbf8 100%)',
          padding: '2rem 0 2.75rem',
        }}
      >
        <div className="community-shell">
          <div
            className="community-card"
            style={{
              maxWidth: 980,
              margin: '0 auto',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.1)',
              borderRadius: 30,
              padding: '1.6rem',
              boxShadow: '0 24px 54px rgba(29,22,15,0.07)',
            }}
          >
            <div
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
              Returning NRI Community
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4.15rem)',
                lineHeight: 1,
                color: '#1a1208',
                maxWidth: 820,
                marginBottom: '0.85rem',
              }}
            >
              Moving back to India? Join a real community, not just another WhatsApp group.
            </h1>

            <p
              style={{
                maxWidth: 760,
                fontSize: '1rem',
                color: '#5c5346',
                lineHeight: 1.75,
                marginBottom: '1rem',
              }}
            >
              Connect with NRIs planning their return, families already navigating the transition, and returned NRIs sharing practical experiences around schools, housing, tax planning, money transfer, and settling back in India.
            </p>

            <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {communityModes.map((item) => (
                <span
                  key={item}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.45rem 0.75rem',
                    borderRadius: 999,
                    background: '#fcfbf8',
                    border: '1px solid rgba(26,18,8,0.08)',
                    color: '#4f4336',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="community-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
              <Link
                href="#join-community"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.95rem 1.35rem',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
                }}
              >
                <WhatsAppIcon size={18} />
                Join the Community
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <InstagramIcon size={18} />
                Follow on Instagram
              </a>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#6d6357', marginBottom: '1.2rem' }}>
              Currently active city group: Hyderabad. More city groups coming soon.
            </p>

            <div className="community-grid-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="community-card"
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
            <h2 className="section-title">Why join?</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Practical support from people who understand the confusion, the tradeoffs, and the emotional weight of this move.
            </p>
          </div>

          <div className="community-grid-2">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="community-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(26,18,8,0.1)',
                  borderRadius: 24,
                  padding: '1.25rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: '#1a1208', marginBottom: '0.55rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#5c5346', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#f7fbf8' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 1.9rem' }}>
            <div className="section-label">Beyond WhatsApp</div>
            <h2 className="section-title">Real conversations, real support</h2>
          </div>

          <div
            className="community-card"
            style={{
              maxWidth: 920,
              margin: '0 auto 1.25rem',
              background: '#ffffff',
              border: '1px solid rgba(26,18,8,0.08)',
              borderRadius: 28,
              padding: '1.35rem',
              boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
            }}
          >
            <p style={{ fontSize: '0.98rem', color: '#4f4438', lineHeight: 1.8, marginBottom: '0.9rem' }}>
              The Returning NRI journey can feel overwhelming when you are trying to figure everything out alone from another country. That is why this community is being built beyond messages and forwarded links.
            </p>
            <p style={{ fontSize: '0.98rem', color: '#4f4438', lineHeight: 1.8 }}>
              We have already completed a successful online group meeting with Returning NRIs and are planning more regular sessions around practical topics like schools, housing, RNOR/tax planning, money movement, healthcare, and the first 90 days after moving. We are also planning an in-person Hyderabad get-together for 2026 returnees so families can build real connections before and after the move.
            </p>
          </div>

          <div className="community-grid-3">
            {supportCards.map((item) => (
              <div
                key={item.title}
                className="community-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(19,136,8,0.12)',
                  borderRadius: 24,
                  padding: '1.25rem',
                  boxShadow: '0 18px 38px rgba(19,136,8,0.05)',
                }}
              >
                <h3 style={{ fontSize: '1.18rem', color: '#1a1208', marginBottom: '0.55rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.94rem', color: '#5c5346', lineHeight: 1.65 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#ffffff', paddingBottom: '2.2rem' }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Who Is This For?</div>
            <h2 className="section-title">Who is this for?</h2>
          </div>

          <div
            className="community-card"
            style={{
              maxWidth: 880,
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
          <div className="community-grid-2" style={{ alignItems: 'start' }}>
            <div
              className="community-card"
              style={{
                background: '#ffffff',
                border: '1px solid rgba(19,136,8,0.12)',
                borderRadius: 28,
                padding: '1.35rem',
                boxShadow: '0 18px 38px rgba(19,136,8,0.05)',
              }}
            >
              <div className="section-label" style={{ color: '#138808' }}>
                What Happens Next
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.35rem)', color: '#1a1208', marginBottom: '0.7rem' }}>
                We do not post the WhatsApp link publicly
              </h2>
              <p style={{ fontSize: '0.97rem', color: '#4f4438', lineHeight: 1.75, marginBottom: '1rem' }}>
                Share your details so we can understand where you are moving from, your likely timeline, and the city you are returning to. That helps us send the most relevant WhatsApp group, online session, or future meetup invite.
              </p>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[
                  'Submit a few basic details',
                  'We review and route you to the right invite',
                  'You receive the community link privately on WhatsApp',
                ].map((step, index) => (
                  <div
                    key={step}
                    style={{
                      display: 'flex',
                      gap: '0.8rem',
                      alignItems: 'flex-start',
                      padding: '0.9rem',
                      borderRadius: 20,
                      background: '#fcfbf8',
                      border: '1px solid rgba(26,18,8,0.08)',
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: '#edf9f0',
                        color: '#138808',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span style={{ fontSize: '0.94rem', color: '#3f352a', lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  borderRadius: 22,
                  background: 'linear-gradient(135deg, #fff5ea 0%, #ffffff 100%)',
                  border: '1px solid rgba(255,153,51,0.16)',
                  padding: '1rem',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1208', marginBottom: '0.4rem' }}>
                  Short practical tips also live on Instagram
                </div>
                <p style={{ fontSize: '0.92rem', color: '#5c5346', lineHeight: 1.65, marginBottom: '0.7rem' }}>
                  Follow quick move-back tips on RNOR, schools, housing, Hyderabad living, money, and the first 90 days.
                </p>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <InstagramIcon size={18} />
                  Follow on Instagram
                </a>
              </div>
            </div>

            <div style={{ maxWidth: 860, margin: '0 auto', width: '100%' }}>
              <CommunityJoinForm />
            </div>
          </div>
        </div>
      </section>

      <section className="community-section" style={{ background: '#fffdf9', paddingTop: 0 }}>
        <div className="community-shell">
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 1.8rem' }}>
            <div className="section-label">Community Guidelines</div>
            <h2 className="section-title">To keep the group useful for everyone</h2>
          </div>

          <div
            className="community-card"
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
            className="community-card"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              borderRadius: 30,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f4fbf5 0%, #ffffff 100%)',
              padding: '1.5rem',
            }}
          >
            <div className="section-label">Founder / Trust</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.35rem)', color: '#1a1208', marginBottom: '0.7rem' }}>
              Built by returned NRIs who have lived this transition
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#4f4438', lineHeight: 1.75 }}>
              Built by returned NRIs who lived in the USA for 16 years, experienced the India transition firsthand, spent a full school year in India, evaluated schools and communities, bought a home, interacted with many returned NRI families, and built ReturningNRIs.com to make the process easier for others.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#1f1610', padding: '3.2rem 0' }}>
        <div className="community-shell">
          <div
            className="community-card"
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
              Ready to join?
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '0.8rem' }}>
              Submit your details and we will send you the WhatsApp invite.
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 1.2rem' }}>
              Start with the form. We will review and route you to the most relevant community touchpoint for your move.
            </p>
            <Link
              href="#join-community"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.95rem 1.35rem',
                borderRadius: 999,
                background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 16px 30px rgba(19,136,8,0.22)',
              }}
            >
              <WhatsAppIcon size={18} />
              Request WhatsApp Invite
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
