import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)',
        padding: '6rem 2rem 5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,153,51,0.1)', border: '0.5px solid rgba(255,153,51,0.3)',
            borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }}/>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>
              Used by 165 NRIs · Free forever for first 200
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', marginBottom: '1.25rem', color: 'var(--ink)' }}>
            Stop losing <em style={{ fontStyle: 'italic', color: 'var(--saffron)' }}>₹20–40L</em> to mistakes<br />
            NRIs make before they move back
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--ink-muted)', fontWeight: 300, lineHeight: 1.75, marginBottom: '2rem', maxWidth: '540px', margin: '0 auto 2rem' }}>
            In 10 minutes, get a personalised plan — your exact RNOR tax window, the right city for your family, and a step-by-step checklist.
          </p>

   <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <Link href="/planner" className="btn-primary">
              Get Your Free Plan →
            </Link>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', marginTop: '0.75rem' }}>
            ⚡ Only 35 founding spots left · No credit card · Takes 10 minutes
          </p>
        </div>

        {/* STAT CARDS */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem', maxWidth: '800px', margin: '3rem auto 0',
        }}>
          {[
            { num: '₹20–40L', label: 'Tax NRIs lose by missing the RNOR window', tag: 'Avoid this mistake', color: 'var(--saffron)' },
            { num: '10 min', label: 'To get your personalised plan vs 9 months DIY', tag: 'Time saved', color: 'var(--navy)' },
            { num: '0 regrets', label: 'The goal — every tool built to eliminate mistakes', tag: 'The outcome', color: 'var(--green)' },
          ].map((s) => (
            <div key={s.num} className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 500, color: s.color, marginBottom: '0.5rem' }}>{s.num}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{s.label}</div>
              <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--india-white)', color: 'var(--ink-soft)' }}>
                {s.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div style={{
        borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)',
        padding: '1.25rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
        background: 'var(--white)',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>NRIs from</span>
        {['USA', 'UK', 'Canada', 'Australia', 'Singapore', 'UAE'].map(c => (
          <span key={c} style={{
            fontSize: '0.8rem', fontWeight: 500, padding: '4px 12px',
            borderRadius: '100px', border: '0.5px solid var(--border)',
            color: 'var(--ink-muted)',
          }}>{c}</span>
        ))}
        <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>165 people on the waitlist</span>
      </div>

      {/* MISTAKES SECTION */}
      <section style={{ background: '#1A1208', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Common NRI mistakes</div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
              Most NRIs get this wrong
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '480px', margin: '0 auto' }}>
              Five expensive, avoidable mistakes — and the regret that follows.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { title: 'Missing the RNOR tax window — ₹20–40L down the drain', desc: "Most NRIs don't know they have a 2–3 year window where foreign income is tax-free in India. They arrive, start filing as residents, and lose lakhs they legally didn't have to pay.", color: '#E24B4A' },
              { title: 'Choosing a city based on vibes, not data', desc: '"We always imagined Hyderabad" — but after 6 months, the commute kills quality of life and the cost of living is double what they expected.', color: '#BA7517' },
              { title: 'Leaving school admissions too late', desc: 'Good schools in Hyderabad and Bangalore fill up 12–18 months in advance. Families who start researching after they arrive scramble and compromise.', color: '#E24B4A' },
              { title: 'Wrong timing — moving at the worst financial moment', desc: 'RSUs vesting, 401(k) penalties, lease break fees, and an unplanned India property purchase all hitting in the same 90-day window.', color: '#BA7517' },
              { title: 'Not getting the family aligned before the move', desc: "The logistics are fixable. The family friction — if it surprises you at the last minute — is what unravels moves.", color: '#E24B4A' },
            ].map((m, i) => (
              <div key={i} style={{
                background: `rgba(${m.color === '#E24B4A' ? '226,75,74' : '186,117,23'},0.08)`,
                border: `0.5px solid rgba(${m.color === '#E24B4A' ? '226,75,74' : '186,117,23'},0.2)`,
                borderRadius: '16px', padding: '1.25rem 1.5rem',
              }}>
                <div style={{ fontWeight: 500, color: '#fff', marginBottom: '4px', fontSize: '15px' }}>{m.title}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
             <Link href="/planner" className="btn-primary">
              Avoid these mistakes → Get your plan
            </Link>
          </div>
        </div>
      </section>

      {/* TOOLS PREVIEW */}
      <section style={{ padding: '5rem 2rem', background: 'var(--india-white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">What&apos;s Inside</div>
            <h2 className="section-title">Eight tools. One decision made easy.</h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Every feature exists because a real NRI needed it and couldn&apos;t find it anywhere else.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: '🗺️', tag: 'Your Plan', title: 'Personalised Return Plan', desc: 'Answer 6 questions. Get your RNOR window, city match, cost estimate, and 3-step action plan instantly.', mvp: true },
              { icon: '📊', tag: 'Tax', title: 'RNOR Tax Optimizer', desc: 'Calculate your exact tax-free window. What to do with RSUs and 401(k). Which forms to file.', mvp: true },
              { icon: '🏙️', tag: 'Lifestyle', title: 'City Match + Cost of Living', desc: 'Compare Hyderabad, Bangalore, Pune and more across cost, schools, commute, AQI, and NRI community.', mvp: true },
              { icon: '🎓', tag: 'Education', title: 'Schools Comparison Tool', desc: 'Compare IB, IGCSE, CBSE schools by fees, admissions timeline, and mid-year entry policy.', mvp: true },
              { icon: '💼', tag: 'Careers', title: 'Job & Career Transition', desc: 'Tech hiring benchmarks, remote-from-India options, and how to position your US experience.', mvp: false },
              { icon: '🤝', tag: 'Community', title: 'Peer Community', desc: 'Talk to NRIs who already moved — by city, profession, and family situation.', mvp: false },
            ].map((tool) => (
              <div key={tool.title} className="card">
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{tool.icon}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{tool.tag}</div>
                <h3 style={{ fontSize: '1rem', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--ink)' }}>{tool.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{tool.desc}</p>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                  background: tool.mvp ? 'var(--green-light)' : 'var(--india-white)',
                  color: tool.mvp ? 'var(--green)' : 'var(--ink-soft)',
                }}>
                  {tool.mvp ? '✓ In MVP' : '⏳ Coming Soon'}
                </span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/Tools" className="btn-ghost">See all tools →</Link>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: 'var(--saffron)', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#1A1208', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Only 35 founding spots left
          </h2>
          <p style={{ color: 'rgba(26,18,8,0.7)', marginBottom: '2rem', fontSize: '1rem' }}>
            Free lifetime access for the first 200 members. After that, it&apos;s a paid subscription. This offer never comes back.
          </p>
          <Link href="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: '#1A1208', color: '#fff', borderRadius: '100px',
            padding: '0.9rem 2.25rem', fontSize: '1rem', fontWeight: 500,
            textDecoration: 'none',
          }}>
            Claim my founding spot — free →
          </Link>
        </div>
      </section>
    </>
  )
}