import Link from 'next/link'

const PLATFORM_PILLARS = [
  {
    label: 'Readiness Check',
    title: 'Know where you stand before you move.',
    body: 'Assess income readiness, RNOR timing, city clarity, family complexity, and housing preparation in one guided flow.',
    links: [{ href: '/planner', label: 'Open Readiness Check' }],
  },
  {
    label: 'Journey Tracker',
    title: 'Turn a big move into a managed program.',
    body: 'Move from decision to arrival and year one with phased tasks, milestone tracking, and a clear next-best action.',
    links: [{ href: '/journey', label: 'Open Journey Tracker' }],
  },
  {
    label: 'Tools + Resources',
    title: 'Go deeper with specialist tools and guides.',
    body: 'Use RNOR, city, school, housing, healthcare, and career tools alongside practical returning-NRI articles.',
    links: [
      { href: '/Tools', label: 'Explore Tools' },
      { href: '/resources', label: 'Browse Resources' },
    ],
  },
]

const FEATURE_SURFACES = [
  ['RNOR planning', 'Protect the tax window most NRIs miss'],
  ['City and cost fit', 'Compare where life actually works'],
  ['Schools and family timing', 'Reduce the hardest move friction'],
  ['Housing and landing setup', 'Stabilize the first 90 days'],
]

const TOOL_CARDS = [
  ['RNOR Calculator', 'Model your tax timing before you become India-resident.', '/rnor'],
  ['City Match', 'Shortlist cities using cost, lifestyle, and practical tradeoffs.', '/city'],
  ['Schools Finder', 'Compare international and local school options by move timing.', '/schools'],
  ['Housing Finder', 'Start with neighborhoods and rental direction before landing.', '/housing'],
  ['Healthcare Guide', 'Map hospitals, insurance, and care decisions early.', '/healthcare'],
  ['Resource Guide', 'Read grounded guides built specifically for returning NRIs.', '/resources'],
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
                The operating system for your move back to India.
              </h1>

              <div
                className="home-cta-row"
                style={{
                  display: 'flex',
                  gap: '1.1rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '2.5rem',
                }}
              >
                <Link href="/planner" className="btn-primary">
                  Start Readiness Check
                </Link>
                <Link href="/journey" className="btn-secondary">
                  View Journey Tracker
                </Link>
              </div>

              <div className="home-proof-grid">
                {[
                  ['Readiness first', 'Get clear before making expensive timing mistakes.'],
                  ['Journey managed', 'Track phases, tasks, and milestones through year one.'],
                  ['Specialist tools', 'Use focused tools when you need depth, not guesswork.'],
                  ['Built for NRIs', 'Everything is shaped around real returning-NRI decisions.'],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    style={{
                      padding: '1rem',
                      borderRadius: 20,
                      background: 'rgba(29,22,15,0.03)',
                      border: '1px solid rgba(29,22,15,0.08)',
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
                  One platform, three core surfaces.
                </h2>

                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                  Start with Readiness Check, move into the Journey Tracker, and go deeper with targeted tools and resources when specific decisions need detail.
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  {PLATFORM_PILLARS.map((pillar) => (
                    <div
                      key={pillar.title}
                      style={{
                        padding: '1rem',
                        borderRadius: 20,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#f3a44f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        {pillar.label}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{pillar.title}</div>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 10 }}>{pillar.body}</div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        {pillar.links.map((link) => (
                          <Link key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                            {link.label}
                            {' ->'}
                          </Link>
                        ))}
                      </div>
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
              ['Decision quality', 'Assess readiness before booking flights or making tax moves.'],
              ['Program structure', 'Track the move as phases, not scattered to-dos.'],
              ['Decision support', 'Use purpose-built tools for the hard questions.'],
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

      <section style={{ background: '#fffdf9', padding: '0 0 5rem' }}>
        <div className="home-shell">
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 2.5rem' }}>
            <div className="section-label">Core Platform</div>
            <h2 className="section-title">Designed for the full returning-NRI journey, not just one moment.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              The platform is structured to support the move from early evaluation through landing and the first year back in India.
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
            <div className="section-label">Useful Tools And Resources</div>
            <h2 className="section-title">Specialist surfaces for the decisions that matter most.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Use the right tool when you need depth, then return to the platform to keep the broader move on track.
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
                  Tool
                </div>
                <div style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{body}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>
                  Open
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
              Start with your readiness. Manage the rest of the journey with confidence.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)', lineHeight: 1.85, maxWidth: 720, margin: '0 auto 1.75rem' }}>
              Use the Readiness Check to establish where you stand, then continue inside the Journey Tracker and specialist tools as your move plan becomes real.
            </p>
            <div className="home-cta-row" style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/planner" className="btn-primary">
                Start Readiness Check
              </Link>
              <Link href="/resources" className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.16)' }}>
                Browse Resources
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
