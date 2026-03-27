import Link from 'next/link'

const PLATFORM_PILLARS = [
  {
    label: 'Step 1',
    title: 'Check your readiness',
    body: 'Answer a few practical questions about your move timeline, finances, family situation, city plans, and preparation.',
    links: [{ href: '/planner', label: 'Start Readiness Check' }],
  },
  {
    label: 'Step 2',
    title: 'See what gaps still need fixing',
    body: 'Get a readiness score, understand the risks, and see what still needs attention before you commit to the move.',
    links: [{ href: '/planner', label: 'See Your Results' }],
  },
  {
    label: 'Step 3',
    title: 'Follow a clearer move plan',
    body: 'Use your next steps to make better decisions on taxes, housing, schools, health insurance, and timing.',
    links: [
      { href: '/Tools', label: 'Explore Tools' },
      { href: '/resources', label: 'Browse Guides' },
    ],
  },
]

const TOOL_CARDS = [
  ['What about RNOR and taxes?', 'Understand the tax timing decisions that can materially affect your move back.', '/rnor'],
  ['Which city actually fits our life?', 'Compare cities through cost, lifestyle, and practical day-to-day tradeoffs.', '/city'],
  ['How do we think about schools?', 'Explore school options and timing if children are part of the move.', '/schools'],
  ['Should we rent or buy first?', 'Start with neighborhoods, rent direction, and landing practicality before committing.', '/housing'],
  ['What should we do about health insurance?', 'Get clearer on hospitals, cover, and what needs to be set up early.', '/healthcare'],
  ['What should happen in the first 90 days?', 'Use grounded guides built specifically for returning NRIs and families.', '/resources'],
]

export default function Home() {
  return (
    <>
      <style>{`
        .home-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        .home-hero {
          background:
            radial-gradient(circle at top left, rgba(240,138,36,0.16), transparent 34%),
            radial-gradient(circle at 82% 18%, rgba(23,117,58,0.14), transparent 26%),
            linear-gradient(180deg, #fffaf3 0%, #f5efe6 56%, #f2eadf 100%);
          padding: 3rem 0 4.5rem;
        }
        .home-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
          gap: 1rem;
          align-items: stretch;
        }
        .home-platform-grid,
        .home-tool-grid {
          display: grid;
          gap: 1rem;
        }
        .home-platform-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-tool-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-proof-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.9rem;
        }
        @media (max-width: 1100px) {
          .home-hero-grid,
          .home-platform-grid,
          .home-tool-grid,
          .home-proof-grid {
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
          .home-platform-grid,
          .home-tool-grid,
          .home-proof-grid {
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
                Platform for returning NRIs
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 5.4vw, 5rem)',
                  lineHeight: 0.96,
                  color: '#1d160f',
                  marginBottom: '1rem',
                }}
              >
                Moving back to India is a big life decision. It should not feel this confusing.
              </h1>

              <p style={{ fontSize: 18, color: '#665848', lineHeight: 1.8, maxWidth: 720, marginBottom: '0.85rem' }}>
                Taxes, RNOR, housing, schools, health insurance, timing, city choice, savings, and a hundred small decisions in between. ReturningNRIs helps you understand where you stand and what to do next without spending months piecing it together alone.
              </p>

              <div style={{ fontSize: 14, fontWeight: 700, color: '#8d5c22', marginBottom: '1.5rem' }}>
                Free 3-minute readiness check. No signup required.
              </div>

              <div
                className="home-cta-row"
                style={{
                  display: 'flex',
                  gap: '1.1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '0.5rem',
                }}
              >
                <Link href="/planner" className="btn-primary">
                  Start Readiness Check
                </Link>
                <Link href="#how-it-works" className="btn-secondary">
                  See How It Works
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
              <div style={{ padding: '1.6rem 1.55rem 1.2rem' }}>
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
                  Platform view
                </div>

                <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.02, color: '#fff', marginBottom: '0.8rem' }}>
                  We spent months figuring out what should have taken a weekend.
                </h2>

                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                  One tab for RNOR. Another for schools. Another for rent, taxes, insurance, investments, and what to do after landing. It was stressful, scattered, and much harder than it should have been.
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    ['Why we built this', 'We built the simple step-by-step guide we wish existed when we were planning our own move back.'],
                    ['Who it is for', 'NRIs and NRI families returning to India permanently who want clarity before making expensive decisions.'],
                    ['How to begin', 'Start with the free readiness check, see your results immediately, and go deeper only where you need help.'],
                  ].map(([title, body]) => (
                    <div
                      key={title}
                      style={{
                        padding: '1rem',
                        borderRadius: 20,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f3a44f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        ReturningNRIs
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{title}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '0 0 4.5rem' }}>
        <div className="home-shell">
          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              marginTop: '-1.5rem',
            }}
          >
            {[
              ['Readiness score', 'See how prepared you really are across finances, timing, family, housing, and planning.'],
              ['Personalized next steps', 'Understand what is already in place, what is still risky, and what to fix before you move.'],
              ['A clearer move-back plan', 'Stop guessing what matters most and focus on the next decisions that actually change your outcome.'],
            ].map(([title, body]) => (
              <div
                key={title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.25rem',
                  boxShadow: '0 16px 32px rgba(29,22,15,0.05)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  {title}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1d160f', marginBottom: 8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ background: '#fffdf9', padding: '0 0 5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">How It Works</div>
            <h2 className="section-title">A simple way to get clarity before you make the big move-back decisions.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Start with the free readiness check, see what still needs attention, and use that clarity to build a better move plan.
            </p>
          </div>

          <div className="home-platform-grid">
            {PLATFORM_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.4rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f08a24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  {pillar.label}
                </div>
                <h3 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{pillar.title}</h3>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 18 }}>{pillar.body}</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {pillar.links.map((link) => (
                    <Link key={link.href} href={link.href} className="btn-ghost">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fffdf9', padding: '5rem 0' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Real Questions NRIs Worry About</div>
            <h2 className="section-title">The practical questions that usually create the most stress and second-guessing.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              These are the concerns most families end up researching across dozens of tabs, WhatsApp groups, and conflicting advice.
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
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Question
                </div>
                <div style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{body}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>
                  Explore
                  {' ->'}
                </div>
              </Link>
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
              Start with clarity
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.02, color: '#fff', marginBottom: '1rem' }}>
              Start with your readiness before you commit to dates, rent, schools, taxes, or big financial moves.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, maxWidth: 720, margin: '0 auto 1.75rem' }}>
              Take the free readiness check and see where you stand in a few minutes. No signup required, and you can view your results immediately.
            </p>
            <div className="home-cta-row" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/planner" className="btn-primary">
                Start Free Readiness Check
              </Link>
              <Link href="/Tools" className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}>
                Browse Free Tools
              </Link>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', marginTop: '1rem' }}>
              Free 3-minute readiness check. No signup required.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
