import Link from 'next/link'

const REALITY_CARDS = [
  'You have 10+ tabs open and still no clear plan.',
  'You are unsure what to do with RNOR, taxes, 401K, RSUs, and investments.',
  'You do not know what to handle before leaving vs after landing.',
  'You are stuck on rent first, buy later, or wait.',
  'You are worried you might miss something expensive.',
]

const OUTCOME_CARDS = [
  {
    title: 'How ready you are',
    body: 'See where you stand right now.',
  },
  {
    title: 'What you are missing',
    body: 'Spot the gaps before they cost you later.',
  },
  {
    title: 'What to do next',
    body: 'Know your next move with clarity.',
  },
]

const STEPS = [
  'Check your readiness.',
  'See what you may be missing.',
  'Follow your next steps.',
]

const TRUST_POINTS = [
  'Built by NRIs who have been through this themselves.',
  'Designed to avoid costly mistakes.',
]

export default function Home() {
  return (
    <>
      <style>{`
        .home-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        .home-grid-2,
        .home-grid-3,
        .home-grid-4,
        .home-grid-5 {
          display: grid;
          gap: 1rem;
        }
        .home-grid-2 {
          grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
        }
        .home-grid-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .home-grid-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .home-grid-5 {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .home-card {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(26, 18, 8, 0.08);
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(26, 18, 8, 0.06);
        }
        .home-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 0.8rem;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .home-section {
          padding: 4.5rem 0;
        }
        .home-kicker {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b46b16;
          margin-bottom: 0.85rem;
        }
        .home-title {
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 0.98;
          margin-bottom: 0.8rem;
          color: #1a1208;
        }
        .home-sub {
          font-size: 1rem;
          line-height: 1.7;
          color: #5c5346;
          max-width: 640px;
        }
        @media (max-width: 1024px) {
          .home-grid-2,
          .home-grid-4,
          .home-grid-5 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .home-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 767px) {
          .home-shell {
            padding: 0 1rem;
          }
          .home-grid-2,
          .home-grid-3,
          .home-grid-4,
          .home-grid-5 {
            grid-template-columns: 1fr;
          }
          .home-section {
            padding: 3.25rem 0;
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

      <section
        style={{
          background:
            'radial-gradient(circle at top left, rgba(255,153,51,0.16), transparent 30%), radial-gradient(circle at 85% 12%, rgba(19,136,8,0.12), transparent 24%), linear-gradient(180deg, #fffaf3 0%, #f7efe4 54%, #f4ecdf 100%)',
          padding: '2.5rem 0 4.25rem',
        }}
      >
        <div className="home-shell">
          <div className="home-grid-2" style={{ alignItems: 'stretch' }}>
            <div className="home-card" style={{ padding: '2rem' }}>
              <div className="home-pill" style={{ background: '#fff0db', color: '#9a5d14', marginBottom: '1rem' }}>
                For NRIs planning a move back
              </div>

              <h1 style={{ fontSize: 'clamp(2.7rem, 5.8vw, 5.1rem)', lineHeight: 0.94, color: '#1a1208', marginBottom: '1rem' }}>
                Moving back to India is more complicated than it looks.
                <br />
                Do not figure it out the hard way.
              </h1>

              <p style={{ fontSize: 18, lineHeight: 1.7, color: '#5c5346', maxWidth: 720, marginBottom: '1rem' }}>
                Taxes, housing, money, schools, insurance, timing.
                <br />
                Check how ready you are and what to do next.
              </p>

              <div className="home-cta-row" style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <Link href="/planner" className="btn-primary">
                  Check my readiness
                </Link>
              </div>

              <div style={{ fontSize: 14, color: '#7a6d5d' }}>
                Free 3-min check. No signup required.
              </div>

              <div style={{ fontSize: 14, color: '#7a6d5d', marginTop: '0.55rem' }}>
                Most people only realize what they missed after they move.
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(145deg, #20160f 0%, #2f2118 48%, #183b2b 100%)',
                borderRadius: 28,
                boxShadow: '0 22px 50px rgba(26,18,8,0.12)',
                padding: '1.5rem',
                color: '#fff',
              }}
            >
              <div className="home-pill" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)', marginBottom: '1rem' }}>
                The reality
              </div>

              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', lineHeight: 1.02, marginBottom: '1rem' }}>
                You are not overthinking it.
              </h2>

              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.74)', marginBottom: '1rem' }}>
                Every decision affects five more, and the information is scattered.
              </p>

              <div style={{ display: 'grid', gap: '0.8rem' }}>
                {[
                  'RNOR, taxes, and timing',
                  '401K, RSUs, investments, and transfers',
                  'Rent first, buy later, or wait',
                  'Schools, insurance, and the first 90 days',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: 20,
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '0.95rem 1rem',
                      fontSize: 15,
                      color: '#fff7ee',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#fffdf9', paddingTop: 0 }}>
        <div className="home-shell">
          <div
            className="home-card"
            style={{
              marginTop: '-1.5rem',
              padding: '1.4rem',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,250,243,0.98) 100%)',
            }}
          >
            <div className="home-kicker">If this sounds familiar</div>
            <div className="home-grid-5">
              {REALITY_CARDS.map((item) => (
                <div
                  key={item}
                  style={{
                    borderRadius: 20,
                    padding: '1rem',
                    background: '#fff',
                    border: '1px solid rgba(26,18,8,0.08)',
                    fontSize: 15,
                    lineHeight: 1.55,
                    color: '#33281d',
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#fffdf9' }}>
        <div className="home-shell">
          <div className="home-kicker">Why we built this</div>
          <div className="home-card" style={{ padding: '1.6rem 1.5rem', background: '#fffaf3' }}>
            <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 720 }}>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', lineHeight: 1.02, color: '#1a1208' }}>
                We thought this would take a weekend.
              </h2>
              <p style={{ fontSize: 17, color: '#4f4639' }}>It turned into months of tabs, lists, calls, and second-guessing.</p>
              <p style={{ fontSize: 17, color: '#4f4639' }}>We kept asking: what are we missing?</p>
              <p style={{ fontSize: 17, color: '#4f4639' }}>So we built the tool we wish we had.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#f7f1e8' }}>
        <div className="home-shell">
          <div style={{ marginBottom: '1.8rem' }}>
            <div className="home-kicker">What you get</div>
            <h2 className="home-title">In 3 minutes, you&apos;ll know:</h2>
          </div>

          <div className="home-grid-3">
            {OUTCOME_CARDS.map((item) => (
              <div key={item.title} className="home-card" style={{ padding: '1.35rem', background: '#fff' }}>
                <h3 style={{ fontSize: 24, lineHeight: 1.05, color: '#1a1208', marginBottom: '0.65rem' }}>{item.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5c5346' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="home-section" style={{ background: '#fffdf9' }}>
        <div className="home-shell">
          <div style={{ marginBottom: '1.8rem' }}>
            <div className="home-kicker">How it works</div>
            <h2 className="home-title">A simple starting point</h2>
          </div>

          <div className="home-grid-3">
            {STEPS.map((step, index) => (
              <div key={step} className="home-card" style={{ padding: '1.35rem', background: '#fff' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#c46d09', marginBottom: '0.7rem' }}>Step {index + 1}</div>
                <div style={{ fontSize: 24, lineHeight: 1.15, color: '#1a1208' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#1f1610', color: '#fff' }}>
        <div className="home-shell">
          <div className="home-kicker" style={{ color: '#f0a048' }}>
            Why this matters
          </div>
          <div
            className="home-card"
            style={{
              padding: '1.4rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'grid', gap: '0.45rem', fontSize: 22, lineHeight: 1.2, color: '#fff8ef' }}>
              <div>Most people only realize what they missed after they move.</div>
              <div>A little clarity now can save months later.</div>
              <div>Small misses get expensive fast.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#fff6ea', paddingBottom: '3rem' }}>
        <div className="home-shell">
          <div
            className="home-card"
            style={{
              padding: '1.1rem 1.25rem',
              background: '#fff',
              display: 'grid',
              gap: '0.7rem',
            }}
          >
            <div className="home-kicker" style={{ marginBottom: 0 }}>
              Trust
            </div>
            {TRUST_POINTS.map((item) => (
              <div key={item} style={{ fontSize: 15, color: '#3f3429' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#fff6ea', padding: '0 0 4.5rem' }}>
        <div className="home-shell">
          <div
            style={{
              borderRadius: 30,
              padding: '2rem',
              background: 'linear-gradient(140deg, #fffaf2 0%, #ffe9c9 100%)',
              border: '1px solid rgba(26,18,8,0.08)',
              boxShadow: '0 24px 44px rgba(26,18,8,0.08)',
              textAlign: 'center',
            }}
          >
            <div className="home-kicker">Start here</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1, color: '#1a1208', marginBottom: '0.85rem' }}>
              Check your readiness before you make the big move-back decisions.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: '#5c5346', maxWidth: 680, margin: '0 auto 1.4rem' }}>
              Free 3-min check. No signup required.
            </p>
            <div className="home-cta-row" style={{ display: 'flex', justifyContent: 'center', gap: '0.9rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/planner" className="btn-primary">
                Check my readiness
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
