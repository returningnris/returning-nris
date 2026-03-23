import Link from 'next/link'
import Image from 'next/image'

export default function OurStory() {
  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'var(--india-white)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="section-label">About Us</div>
          <h1 className="section-title">We&apos;re not building this<br />from a whiteboard.</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            We&apos;re living every problem this platform solves — right now, in real time.
          </p>
        </div>
      </section>

      {/* MAIN STORY */}
      <section style={{ padding: '5rem 2rem', background: 'var(--white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3rem', alignItems: 'start' }}>

            {/* PROFILE CARD */}
            <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', position: 'sticky', top: '80px' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <Image
                  src="/founders.jpg"
                  alt="Bharath Mandava and Swathi Bandla — Co-founders of ReturningNRIs"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  priority
                />
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)', marginBottom: '3px' }}>Bharath Mandava &amp; Swathi Bandla</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '1rem' }}>Co-founders · ReturningNRIs</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', background: '#FFF3E6', color: '#854F0B' }}>16 yrs in USA</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', background: '#E8F5E8', color: '#27500A' }}>Moving Apr 2026</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, padding: '3px 10px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C' }}>2 kids</span>
                </div>
              </div>
            </div>

            {/* STORY RIGHT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* QUICK FACTS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'In the US since', val: '2008 — 16 years', color: '#FF9933' },
                  { label: 'Moving back', val: 'April 2026', color: '#138808' },
                  { label: 'Family', val: 'Bharath, Swathi + 2 kids', sub: 'Girl 9 · Boy 5', color: 'var(--ink)' },
                  { label: 'Background', val: 'Developer → Data Analyst → Product Owner', color: 'var(--ink)' },
                ].map(fact => (
                  <div key={fact.label} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{fact.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: fact.color, lineHeight: 1.35 }}>
                      {fact.val}
                      {fact.sub && <><br /><span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--ink-soft)' }}>{fact.sub}</span></>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ height: '0.5px', background: 'var(--border)' }} />

              {/* THE STORY */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Our story</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.75, fontFamily: "'DM Serif Display', serif" }}>
                    In 2008, we moved to the US for work. One opportunity led to another, two kids arrived, and 16 years passed faster than we expected.
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>
                    In 2023, we decided to move back permanently. We thought it would take a few months to plan. It took over a year — and we nearly made several expensive mistakes along the way.
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>
                    The RNOR tax window was almost missed. Our older daughter&apos;s school transition was harder than expected. We had 12 browser tabs open at any given time, conflicting advice from 4 different consultants, and no single place that put it all together.
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>
                    So we built what we wished had existed. Not as advisors — as NRIs going through the exact same process.
                  </p>
                </div>
              </div>

              <div style={{ height: '0.5px', background: 'var(--border)' }} />

              {/* WHY WE BUILT THIS */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Why we built this</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { icon: '⏱️', title: 'Spent 9 months researching', desc: 'what should take a weekend — tax, cities, schools, banking, scattered across 12 tabs and 4 consultants' },
                    { icon: '⚠️', title: 'Nearly missed the RNOR window', desc: 'No single resource explained how to preserve it while winding down US income' },
                    { icon: '🏫', title: 'School decision almost stopped us', desc: 'Two US-raised kids, no idea how CBSE vs IB would work for their grade levels in India' },
                    { icon: '✅', title: 'Tested it for real', desc: 'Lived in India Jun 2024–2025 with the whole family before committing. Now back in USA, wrapping up, moving for good.' },
                  ].map(item => (
                    <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF3E6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px' }}>
                        {item.icon}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
                        <strong style={{ fontWeight: 500, color: 'var(--ink)' }}>{item.title}</strong> — {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUOTE */}
              <div style={{ background: 'var(--india-white)', borderRadius: '0 14px 14px 0', padding: '1.25rem 1.5rem', borderLeft: '3px solid #FF9933' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  &ldquo;We&apos;re not advisors. We&apos;re NRIs who went through this mess and decided to clean it up — for ourselves, and for everyone who comes after.&rdquo;
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '8px' }}>— Bharath &amp; Swathi, Co-founders</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section style={{ padding: '5rem 2rem', background: '#1A1208' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Our mission</div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#fff', lineHeight: 1.2, marginBottom: '1rem' }}>
              Make returning to India a decision, not a decade-long project.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto' }}>
              Every NRI family considering a move back deserves access to clear, accurate, personalised information — not generic blog posts and conflicting advice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '🎯', title: 'Built by NRIs', desc: 'Not consultants, not advisors. We are the exact customer we are building for. Every tool we ship, we use ourselves.' },
              { icon: '📊', title: 'Data over opinions', desc: 'Real school fees. Real rent ranges. Real tax windows. Everything quantified and personalised to your specific situation.' },
              { icon: '🤝', title: 'Community-driven', desc: 'The best intelligence comes from NRIs who have already done this. We aggregate that knowledge and make it accessible.' },
              { icon: '🆓', title: 'Free to use', desc: 'All tools — readiness check, RNOR calculator, city match, school finder — are free. We believe this information should be accessible.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--india-white)', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '1rem', color: 'var(--ink)' }}>
            Same boat? Let&apos;s figure this out together.
          </h2>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Start with the readiness check — get your personalised score, top risks, and a clear recommendation in 2 minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planner" className="btn-primary">Take the readiness check →</Link>
            <Link href="/journey" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.75rem 1.5rem', borderRadius: '100px', border: '1px solid var(--border)', color: 'var(--ink)', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>
              Start my journey →
            </Link>
          </div>
        </div>
      </section>

      {/* FEEDBACK PANEL */}
      <section style={{ background: 'var(--white)', padding: '3rem 2rem' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'var(--india-white)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.4rem' }}>
              Have a suggestion or feedback?
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
              We read every message. If you have a specific situation, a tool idea, or just want to say hi — reach out directly.
              This is a founder-built product and your input shapes what gets built next.
            </p>
          </div>
          <a
            href="mailto:hello@returningnris.com?subject=Feedback for ReturningNRIs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--white)',
              border: '1px solid rgba(255,153,51,0.3)',
              color: '#CC7A00',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.65rem 1.25rem',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 8px rgba(255,153,51,0.1)',
            }}
          >
            ✉ hello@returningnris.com
          </a>
        </div>
      </section>
    </>
  )
}