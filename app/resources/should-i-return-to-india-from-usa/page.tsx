import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Should I Return to India from the USA? (2026 Decision Guide for NRIs)',
  description: 'Thinking of returning to India from the USA? Understand salary trade-offs, cost of living, taxes, and readiness. Get a personalized return plan in 2 minutes.',
  keywords: ['NRI return to India', 'should I move back to India from USA', 'NRI returning India 2026', 'moving back to India from USA', 'RNOR tax NRI', 'NRI financial planning India'],
  openGraph: {
    title: 'Should I Return to India from the USA? (2026 Decision Guide for NRIs)',
    description: 'Understand salary trade-offs, cost of living, taxes, and readiness before making the move.',
    url: 'https://www.returningnris.com/resources/should-i-return-to-india-from-usa',
    type: 'article',
  },
  alternates: { canonical: 'https://www.returningnris.com/resources/should-i-return-to-india-from-usa' },
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const prose = { maxWidth: '720px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif', color: '#1A1208', lineHeight: 1.8 }
const h2Style = { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem,3vw,1.75rem)', color: '#1A1208', marginBottom: '0.75rem', marginTop: '2.5rem', lineHeight: 1.25 }
const h3Style = { fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#1A1208', marginBottom: '0.5rem', marginTop: '1.75rem' }
const pStyle = { fontSize: '1rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }
const liStyle = { fontSize: '1rem', color: '#3D3229', lineHeight: 1.8, marginBottom: '0.4rem' }

export default function ShouldIReturnToIndia() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Should I Return to India from the USA? (2026 Decision Guide for NRIs)',
        description: 'Thinking of returning to India from the USA? Understand salary trade-offs, cost of living, taxes, and readiness.',
        author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        datePublished: '2026-03-01',
        dateModified: new Date().toISOString().split('T')[0],
        url: 'https://www.returningnris.com/resources/should-i-return-to-india-from-usa',
        mainEntityOfPage: 'https://www.returningnris.com/resources/should-i-return-to-india-from-usa',
      }) }} />

      {/* HERO */}
      <section style={{ background: '#F8F5F0', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '4rem 2rem 3rem' }}>
        <div style={{ ...prose }}>
          {/* Breadcrumb */}
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link>
            <span>›</span>
            <span style={{ color: '#6B5E50' }}>Should I Return to India from the USA?</span>
          </nav>

          {/* Category + read time */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Decision Making</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>8 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>· Updated March 2026</span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,5vw,2.75rem)', color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            Should You Return to India<br />from the USA?
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6B5E50', lineHeight: 1.75, marginBottom: '0' }}>
            A practical 2026 decision guide for NRIs — covering finances, career, taxes, family, and how to know if the timing is right.
          </p>
        </div>
      </section>

      {/* QUICK ANSWER BOX */}
      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={{ ...prose }}>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.3)', borderRadius: '16px', padding: '1.5rem 1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>⚡ Quick Answer — Read This First</div>
            <p style={{ fontSize: '1rem', color: '#3D3229', lineHeight: 1.7, marginBottom: '0.875rem' }}>
              You are likely ready to return to India if <strong>most of the following are true</strong>:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0' }}>
              {['You have secured a job or stable income source in India', 'You have at least $75K–$100K in liquid savings', 'You understand your RNOR tax window and have planned for it', 'You have planned schooling and housing (if you have children)'].map(item => (
                <li key={item} style={{ ...liStyle, color: '#27500A' }}>✓ {item}</li>
              ))}
            </ul>
            <p style={{ fontSize: '13px', color: '#6B5E50', margin: 0 }}>
              Not sure how you score? →{' '}
              <Link href="/planner" style={{ color: '#FF9933', fontWeight: 600, textDecoration: 'none' }}>
                Take the 2-minute readiness check
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={{ ...prose }}>

          <p style={{ ...pStyle }}>
            For many NRIs living in the United States, the question isn't <em>if</em> they should return to India — it's <em>when</em>, and whether they're truly ready. After years abroad, the pull of family, roots, and a rapidly growing India is real. But so are the risks of a poorly timed move.
          </p>
          <p style={{ ...pStyle }}>
            A rushed decision can lead to financial stress, career setbacks, and family disruption. A well-planned move, on the other hand, can significantly improve quality of life and long-term wealth. This guide walks through the five factors that actually determine readiness — and how to assess where you stand.
          </p>

          {/* Section 1 */}
          <h2 style={{ ...h2Style }}>The 5 Factors That Determine If You're Ready</h2>

          <h3 style={{ ...h3Style }}>1. Financial Readiness</h3>
          <p style={{ ...pStyle }}>
            Financial readiness is the single most important factor — and the most common reason returns fail. The question isn't just "do I have savings?" but "how long can I survive without income if something doesn't go to plan?"
          </p>
          <p style={{ ...pStyle }}>
            As a rule of thumb: you need a minimum of 12–18 months of financial runway before you move. That means enough liquid savings to cover your India lifestyle costs (rent, school fees, food, healthcare, EMIs) without touching any investment accounts. For most families moving to cities like Hyderabad, Bangalore, or Pune, this translates to <strong>$75K–$100K in accessible savings minimum</strong>, with $150K–$200K being a much more comfortable position.
          </p>
          <p style={{ ...pStyle }}>
            Without this buffer, even a short delay in job start dates or a slower-than-expected business ramp can create pressure that forces bad decisions — like taking the first job that comes along, or returning to the US sooner than planned.
          </p>

          <h3 style={{ ...h3Style }}>2. Career Transition Risk</h3>
          <p style={{ ...pStyle }}>
            Moving without a job or confirmed income source in India is the single most common mistake NRIs make — and the #1 reason they return within 2 years. The challenges are real: India salaries are typically 40–60% lower than equivalent US roles, senior hiring cycles take longer than expected, and the job market at leadership levels is more relationship-driven than in the US.
          </p>
          <p style={{ ...pStyle }}>
            The best-case career scenarios for a return, in order:
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0' }}>
            <li style={{ ...liStyle }}><strong>Keeping your remote US job</strong> — gives you a US salary in India (3–4x purchasing power), maximum time to assess the market without financial pressure</li>
            <li style={{ ...liStyle }}><strong>An India job offer in hand before you move</strong> — removes uncertainty even if the salary adjustment is significant</li>
            <li style={{ ...liStyle }}><strong>Running your own business</strong> — works if you're genuinely location-independent and revenue is stable</li>
          </ul>
          <p style={{ ...pStyle }}>
            If you don't have one of these in place, your return is a financial gamble, not a plan.
          </p>

          <h3 style={{ ...h3Style }}>3. Cost of Living vs Income Reality</h3>
          <p style={{ ...pStyle }}>
            Yes, India is cheaper than the US — but not always in the ways NRIs expect. The first thing that surprises most returnees is that <em>quality-of-life costs scale up faster than anticipated</em>.
          </p>
          <p style={{ ...pStyle }}>
            In cities like Hyderabad, Bangalore, or Mumbai, a family accustomed to a certain lifestyle in the US will typically spend:
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0' }}>
            <li style={{ ...liStyle }}>Rent in good areas: ₹40,000 – ₹1,00,000/month</li>
            <li style={{ ...liStyle }}>International or IGCSE school fees: ₹1L – ₹5L per child per year</li>
            <li style={{ ...liStyle }}>Healthcare (good insurance + out-of-pocket): ₹1.5L – ₹3L/year for a family</li>
            <li style={{ ...liStyle }}>Lifestyle expenses (dining, travel, domestic help): ₹50K – ₹1.5L/month</li>
          </ul>
          <p style={{ ...pStyle }}>
            A comfortable family lifestyle in Hyderabad or Pune runs ₹1.5L–₹2.5L/month. In Bangalore or Mumbai, expect ₹2.5L–₹4L/month. Many NRIs budget for the lower end and are surprised by how quickly costs add up — especially once children's school fees are factored in.
          </p>

          <h3 style={{ ...h3Style }}>4. Tax Planning — RNOR Status Is Critical</h3>
          <p style={{ ...pStyle }}>
            One of the most financially significant and most overlooked aspects of returning to India is <strong>RNOR (Resident but Not Ordinarily Resident)</strong> status.
          </p>
          <p style={{ ...pStyle }}>
            When you return to India after living abroad for 7+ years, you may qualify for RNOR status — a tax classification that treats you as a non-resident for income tax purposes on foreign-sourced income. This can mean:
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0' }}>
            <li style={{ ...liStyle }}>Foreign income (US salary, dividends, rental income) is tax-free in India during the RNOR period</li>
            <li style={{ ...liStyle }}>The RNOR window typically lasts 2–3 years depending on your specific residency history</li>
            <li style={{ ...liStyle }}>Tax savings can range from ₹18L to ₹60L+ over the RNOR period depending on your income level</li>
          </ul>
          <p style={{ ...pStyle }}>
            The critical catch: <strong>you must file Form 12A within 30 days of arriving in India to register your RNOR status</strong>. Miss this window and it cannot be backdated. Missing RNOR can permanently increase your tax liability by ₹18–40L in the first year alone.
          </p>
          <p style={{ ...pStyle }}>
            If you don't yet understand RNOR, you are almost certainly leaving significant money on the table. A single consultation with a CA who specialises in NRI taxation is strongly recommended before you move.
          </p>
          <div style={{ background: '#FFF3E6', border: '1px solid rgba(255,153,51,0.25)', borderRadius: '12px', padding: '1rem 1.25rem', margin: '1rem 0 1.5rem' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#7D5300', lineHeight: 1.65 }}>
              💡 <strong>Use the RNOR Calculator →</strong>{' '}
              <Link href="/rnor" style={{ color: '#FF9933', textDecoration: 'none', fontWeight: 600 }}>
                Estimate your exact RNOR window and potential tax savings
              </Link>
            </p>
          </div>

          <h3 style={{ ...h3Style }}>5. Family and Lifestyle Adjustment</h3>
          <p style={{ ...pStyle }}>
            If you have children — particularly teenagers — this factor can outweigh all others. School admission timelines in India are longer than most NRIs expect: good schools fill their waitlists 12–18 months in advance, and the board transition (from US curriculum to CBSE, IGCSE, or IB) requires careful planning to avoid setting children back academically.
          </p>
          <p style={{ ...pStyle }}>
            Other family factors to consider:
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem 0' }}>
            <li style={{ ...liStyle }}>Healthcare quality varies significantly by city — some cities have JCI-accredited hospitals that match international standards, others don't</li>
            <li style={{ ...liStyle }}>Cultural readjustment takes 6–12 months for most families, especially for children who have grown up in the US</li>
            <li style={{ ...liStyle }}>Spouse career continuity — if both partners work, India career opportunities need to be evaluated for both</li>
          </ul>

          {/* Common Mistakes */}
          <h2 style={{ ...h2Style }}>Common Mistakes NRIs Make When Returning</h2>
          <p style={{ ...pStyle }}>These are the mistakes that most consistently derail NRI returns:</p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem 0' }}>
            {[
              'Moving without a job or confirmed income — the #1 reason NRIs return within 2 years',
              'Ignoring RNOR tax planning — missing this window can cost ₹18–40L in year 1',
              'Underestimating India cost of living — especially school fees and urban rent',
              'Not planning school admissions early — 12–18 month timelines are standard for good schools',
              'Rushing the move due to emotion — excitement about returning is real but shouldn\'t override financial readiness',
              'Arriving without housing arranged — the first 90 days are chaotic enough without an unsettled home base',
            ].map(m => (
              <li key={m} style={{ ...liStyle }}>
                <span style={{ color: '#C0392B', fontWeight: 600 }}>✗ </span>{m}
              </li>
            ))}
          </ul>

          {/* Decision Framework */}
          <h2 style={{ ...h2Style }}>So… Should You Move Back Now?</h2>
          <p style={{ ...pStyle }}>Here's a simple framework:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.25rem 0 1.75rem' }}>
            {[
              { title: '✅ Move now', color: '#138808', bg: '#E8F5E8', border: 'rgba(19,136,8,0.2)', points: ['Income secured in India', 'Strong savings buffer ($100K+)', 'RNOR and logistics planned'] },
              { title: '⚠️ Delay 6–12 months', color: '#CC7A00', bg: '#FFF3E6', border: 'rgba(255,153,51,0.25)', points: ['No job confirmed yet', 'Savings need building', 'School or housing unsorted'] },
              { title: '⏸️ Not ready yet', color: '#C0392B', bg: '#FCEBEB', border: 'rgba(192,57,43,0.2)', points: ['No income + low savings', 'Moving from emotion alone', 'Career prospects unclear'] },
            ].map(card => (
              <div key={card.title} style={{ background: card.bg, border: `1.5px solid ${card.border}`, borderRadius: '14px', padding: '1.125rem 1.25rem' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: card.color, marginBottom: '0.75rem' }}>{card.title}</div>
                <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                  {card.points.map(p => <li key={p} style={{ fontSize: '13px', color: card.color, lineHeight: 1.6, marginBottom: '4px', opacity: 0.9 }}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h2 style={{ ...h2Style }}>The Smarter Approach: Don't Guess — Calculate</h2>
          <p style={{ ...pStyle }}>
            Every NRI situation is different. Your timeline, savings, family situation, career type, and target city all combine to determine your actual readiness — and there's no one-size-fits-all answer.
          </p>
          <p style={{ ...pStyle }}>
            Instead of relying on generic advice or gut feel, use a structured assessment that looks at your specific situation:
          </p>
        </div>
      </article>

      {/* PLANNER CTA — full width */}
      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem', margin: '2rem 0' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Get your personalised readiness score
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Answer 10 questions about your finances, career, family, and timeline. Get a score out of 100, your key risks, and a clear move-or-delay recommendation — in under 2 minutes.
          </p>
          <Link href="/planner" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '13px 30px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,153,51,0.45)', marginBottom: '1rem' }}>
            Check my readiness score →
          </Link>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Free · no account needed · takes 2 minutes</div>
        </div>
      </section>

      {/* FINAL SECTION */}
      <article style={{ background: '#fff', padding: '0 2rem 3rem' }}>
        <div style={{ ...prose }}>
          <h2 style={{ ...h2Style }}>Final Thoughts</h2>
          <p style={{ ...pStyle }}>
            Returning to India can be one of the best decisions you make — but timing matters more than intention. The NRIs who have the smoothest transitions are consistently the ones who prepared deliberately rather than moved impulsively.
          </p>
          <p style={{ ...pStyle }}>
            A 6–12 month delay to get income confirmed, savings built, RNOR planned, and housing sorted isn't a failure of commitment. It's the difference between arriving in India from a position of strength versus arriving and immediately dealing with financial pressure on top of an already complex transition.
          </p>
          <p style={{ ...pStyle }}>
            Use the tools available to you. Get your readiness score. Talk to an NRI CA about RNOR. Do a scouting trip. Research schools before you leave. The families who plan carefully almost always report that their return was the right decision. The families who rush it almost always wish they'd waited six more months.
          </p>

          {/* Related guides */}
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '2rem', marginTop: '2rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Related Tools</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { href: '/planner', icon: '📋', label: 'Readiness Check', sub: 'Get your personalised score' },
                { href: '/rnor', icon: '📊', label: 'RNOR Calculator', sub: 'Calculate your tax savings' },
                { href: '/city', icon: '🏙️', label: 'City Match', sub: 'Find your ideal city' },
                { href: '/schools', icon: '🎓', label: 'Schools Finder', sub: 'Compare international schools' },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '0.875rem 1rem', textDecoration: 'none' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#B5A898' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Author */}
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem', marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933, #CC7A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: '#fff', flexShrink: 0 }}>B</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1208' }}>Bharath Mandava &amp; Swathi Bandla</div>
              <div style={{ fontSize: '12px', color: '#B5A898' }}>Co-founders, ReturningNRIs · 16 years in the USA · Moving back April 2026</div>
            </div>
          </div>
        </div>
      </article>

      {/* BOTTOM PADDING */}
      <div style={{ height: '3rem', background: '#fff' }} />
    </>
  )
}