import Link from 'next/link'

export const metadata = {
  title: 'Our Story — ReturningNRIs',
  description: 'Built by Bharath Mandava and Swathi Bandla — two NRIs, 16 years in the US, two kids, permanently moving back to India in April 2026.',
}

export default function OurStory() {
  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'var(--india-white)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="section-label">Our Story</div>
          <h1 className="section-title">We&apos;re not building this from a whiteboard</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            We&apos;re living every problem this platform solves — right now, in real time.
          </p>
        </div>
      </section>

      {/* FOUNDER STORY */}
      <section style={{ padding: '5rem 2rem', background: 'var(--white)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '320px 1fr',
            gap: '3rem', alignItems: 'start',
          }}>

            {/* LEFT — PROFILE CARD */}
            <div style={{ background: 'var(--india-white)', borderRadius: '20px', overflow: 'hidden', border: '0.5px solid var(--border)' }}>
              <div style={{ background: '#1A1208', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--saffron)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', fontWeight: 500, color: '#1A1208',
                }}>BS</div>
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', marginBottom: '3px' }}>Bharath Mandava &amp; Swathi Bandla</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '1rem' }}>Co-founders · ReturningNRIs</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                  {['16 yrs in USA', 'Moving Apr 2026', '2 kids'].map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px', fontWeight: 500, padding: '3px 10px',
                      borderRadius: '100px', background: '#FFF3E6', color: '#854F0B',
                    }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'From', value: 'Bay Area, California' },
                    { label: 'Moving to', value: 'Hyderabad' },
                    { label: 'Industries', value: 'Tech & Product' },
                    { label: 'Launch', value: '31st March 2026' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>{item.label}</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — STORY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>
                  16 years in the US. One decision that changed everything.
                </h2>
                <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                  We came to the US in 2008 — fresh out of college, full of ambition. Built careers in tech,
                  bought a home, had two kids who know more about Minecraft than cricket. The American dream,
                  ticked off.
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                Then in 2024, we started seriously thinking about moving back. What followed was 8 months of
                the most chaotic, confusing research of our lives. Tax advisors who contradicted each other.
                Facebook groups full of opinions, not data. School admission processes that nobody could
                explain clearly. City comparisons based on vibes.
              </p>

              <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                We almost missed our RNOR window entirely. We spent ₹40,000 on a tax consultant who gave us
                information we later found was outdated. We made a city shortlist based on where our college
                friends lived — not data. We started researching schools 6 months too late.
              </p>

              <div style={{
                background: 'var(--india-white)', borderLeft: '3px solid var(--saffron)',
                padding: '1.25rem 1.5rem', borderRadius: '0 12px 12px 0',
              }}>
                <p style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;We&apos;re not advisors. We&apos;re NRIs who went through this mess and decided to
                  clean it up — for ourselves, and for everyone who comes after.&rdquo;
                </p>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                ReturningNRIs is the platform we wished existed when we started this journey.
                Every tool we build is solving a problem we personally ran into. Every city data point
                is one we personally verified. Every mistake in the &ldquo;Most NRIs get this wrong&rdquo;
                section — we made at least one of them ourselves.
              </p>

              <p style={{ fontSize: '0.95rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
                We&apos;re moving to Hyderabad in April 2026 with our 9-year-old daughter and 5-year-old son.
                This platform launches the same month. We&apos;re building it and living it simultaneously —
                which means everything we ship is tested on our own family first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section style={{ background: 'var(--india-white)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label">Why we built this</div>
            <h2 className="section-title">The problems we personally ran into</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '💸', title: 'Nearly missed our RNOR window', desc: 'Nobody told us about the 2-year tax-free window. We found out 3 months before moving — just in time. Most NRIs aren\'t that lucky.' },
              { icon: '🏙️', title: 'City research took 4 months', desc: 'We made spreadsheets, called friends, read Reddit threads. There was no single place with reliable, comparable data for returning NRIs.' },
              { icon: '🎓', title: 'Schools nearly derailed the move', desc: 'Our daughter\'s school application had a 14-month waitlist. We almost missed it. No guide told us to start this first.' },
              { icon: '🏠', title: 'Landing pad was a nightmare', desc: 'Finding a good furnished rental in Hyderabad from the US — with a lease that starts on a specific date — took 3 months of calls.' },
            ].map((p) => (
              <div key={p.title} className="card">
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{p.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', marginBottom: '0.5rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ background: '#1A1208', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="section-label">Our mission</div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1.25rem' }}>
            Make returning to India as well-planned as leaving was
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '1rem' }}>
            When NRIs left India for the US, they had everything — job offers, visa paperwork, housing sorted,
            bank accounts set up. The return should be just as planned. We&apos;re building the infrastructure
            that makes that possible.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary">Join the waitlist →</Link>
            <Link href="/community" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', color: 'rgba(255,255,255,0.7)',
              border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px',
              padding: '0.85rem 1.75rem', fontSize: '0.95rem', textDecoration: 'none',
            }}>
              Meet the community →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}