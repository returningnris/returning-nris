/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RNOR Status Explained for NRIs Returning to India (2026 Tax Guide)',
  description: 'What is RNOR status? Learn how NRIs returning to India can reduce taxes on foreign income and avoid costly mistakes. Full 2026 guide.',
  keywords: ['RNOR status NRI', 'RNOR tax India returning NRI', 'resident not ordinarily resident India', 'NRI tax planning India 2026', 'RNOR benefits NRI'],
  openGraph: {
    title: 'RNOR Status Explained for NRIs Returning to India (2026 Tax Guide)',
    description: 'How NRIs returning to India can use RNOR status to legally reduce taxes on foreign income. Full 2026 guide.',
    url: 'https://www.returningnris.com/resources/rnor-status-nri-returning-to-india',
    type: 'article',
  },
  alternates: { canonical: 'https://www.returningnris.com/resources/rnor-status-nri-returning-to-india' },
}

const prose: React.CSSProperties = { maxWidth: '720px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif', color: '#1A1208', lineHeight: 1.8 }
const h2Style: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem,3vw,1.75rem)', color: '#1A1208', marginBottom: '0.75rem', marginTop: '2.5rem', lineHeight: 1.25 }
const h3Style: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#1A1208', marginBottom: '0.5rem', marginTop: '1.5rem' }
const pStyle: React.CSSProperties = { fontSize: '1rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }

export default function RNORGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'RNOR Status Explained for NRIs Returning to India (2026 Tax Guide)',
        description: 'How NRIs returning to India can use RNOR status to legally reduce taxes on foreign income.',
        author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        datePublished: '2026-03-01',
        dateModified: new Date().toISOString().split('T')[0],
        url: 'https://www.returningnris.com/resources/rnor-status-nri-returning-to-india',
      }) }} />

      {/* HERO */}
      <section style={{ background: '#FFFFFF', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '4rem 2rem 3rem' }}>
        <div style={{ ...prose }}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link>
            <span>›</span>
            <span style={{ color: '#6B5E50' }}>RNOR Status Explained</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#EEF2FF', color: '#000080', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tax Planning</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>10 min read · Updated March 2026</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,5vw,2.75rem)', color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            RNOR Status Explained for<br />NRIs Returning to India
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6B5E50', lineHeight: 1.75 }}>
            RNOR is the most financially significant benefit available to returning NRIs — and the most commonly missed. This guide explains exactly what it is, who qualifies, what it saves, and what happens if you get it wrong.
          </p>
        </div>
      </section>

      {/* QUICK SUMMARY */}
      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={{ ...prose }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: '#E8F5E8', border: '1px solid rgba(19,136,8,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#138808', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>✅ Done right</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#138808', lineHeight: 1.4, marginBottom: '6px' }}>Foreign income is not taxed in India during the RNOR window</div>
              <div style={{ fontSize: '13px', color: '#27500A', lineHeight: 1.6 }}>Potential saving: <strong>₹18L–₹60L+</strong> over 2–3 years depending on income level</div>
            </div>
            <div style={{ background: '#FCEBEB', border: '1px solid rgba(192,57,43,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>❌ Done wrong</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#C0392B', lineHeight: 1.4, marginBottom: '6px' }}>Full Indian tax applies on global income from day one of residency</div>
              <div style={{ fontSize: '13px', color: '#7B241C', lineHeight: 1.6 }}>The window is time-bound and <strong>cannot be recovered</strong> once missed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE */}
      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={{ ...prose }}>

          <h2 style={{ ...h2Style }}>What is RNOR Status?</h2>
          <p style={{ ...pStyle }}>
            RNOR stands for <strong>Resident but Not Ordinarily Resident</strong>. It is a transitional tax classification under the Indian Income Tax Act specifically designed for people who have lived abroad for an extended period and are now returning to India permanently.
          </p>
          <p style={{ ...pStyle }}>
            Under Indian tax law, there are three residency categories: Non-Resident (NRI), Resident and Ordinarily Resident (ROR), and the in-between classification — Resident but Not Ordinarily Resident (RNOR). When you first return to India after years abroad, you don't immediately become a full tax resident. RNOR is the transitional status that sits between NRI and full residency.
          </p>
          <p style={{ ...pStyle }}>
            The critical financial benefit of RNOR: <strong>your foreign-sourced income is not taxed in India</strong> during the RNOR period. This includes US salary from a remote job, foreign dividends and capital gains, rental income from overseas properties, and interest on foreign bank accounts.
          </p>

          <h2 style={{ ...h2Style }}>Who Qualifies for RNOR Status?</h2>
          <p style={{ ...pStyle }}>
            RNOR status applies when you meet the general definition of "Resident" in India (183+ days in a financial year, or 60+ days in a year and 365+ days over the prior 4 years) but fail one of two additional conditions that would make you "Ordinarily Resident":
          </p>
          <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1rem 0' }}>
            <li style={{ fontSize: '1rem', color: '#3D3229', lineHeight: 1.8, marginBottom: '6px' }}>You have been a Non-Resident in India in <strong>9 or more of the preceding 10 financial years</strong>, OR</li>
            <li style={{ fontSize: '1rem', color: '#3D3229', lineHeight: 1.8, marginBottom: '6px' }}>Your total stay in India in the preceding <strong>7 financial years has been 729 days or less</strong></li>
          </ul>
          <p style={{ ...pStyle }}>
            Most NRIs who have lived abroad for 7+ years will satisfy one or both of these conditions, making them eligible for RNOR status for the first 2–3 years after returning. The exact duration depends on your specific residency history — which is why consulting a CA before you move is essential.
          </p>

          <div style={{ background: '#EEF2FF', border: '1.5px solid rgba(0,0,128,0.15)', borderRadius: '14px', padding: '1.25rem 1.5rem', margin: '1.5rem 0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#000080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📊 Typical RNOR Eligibility by Years Abroad</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {[
                { years: '7–8 years abroad', rnor: '~1–2 years of RNOR', color: '#000080' },
                { years: '9–10 years abroad', rnor: '~2–3 years of RNOR', color: '#000080' },
                { years: '10+ years abroad', rnor: '~3 years of RNOR', color: '#138808' },
              ].map(r => (
                <div key={r.years} style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(0,0,128,0.1)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1208', marginBottom: '3px' }}>{r.years}</div>
                  <div style={{ fontSize: '11px', color: r.color, fontWeight: 500 }}>{r.rnor}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#6B5E50', marginTop: '10px', marginBottom: 0, lineHeight: 1.5 }}>
              These are approximate. Your exact window depends on your specific year-by-year residency history. A CA can calculate this precisely.
            </p>
          </div>

          <h2 style={{ ...h2Style }}>What Income is Protected Under RNOR?</h2>
          <p style={{ ...pStyle }}>
            Under RNOR status, the following income is generally not taxable in India (subject to applicable tax treaties and specific structuring):
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
            {[
              { icon: '💼', label: 'Remote US/foreign salary', detail: 'If work is performed outside India and paid into a foreign account' },
              { icon: '📈', label: 'Foreign investment income', detail: 'Dividends, capital gains, and interest from overseas accounts' },
              { icon: '🏠', label: 'Foreign rental income', detail: 'Rental income from properties located outside India' },
              { icon: '🏦', label: 'NRE account interest', detail: 'Interest on NRE accounts remains tax-free even after RNOR status begins' },
            ].map(i => (
              <div key={i.label} style={{ background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{i.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '4px' }}>{i.label}</div>
                <div style={{ fontSize: '12px', color: '#6B5E50', lineHeight: 1.5 }}>{i.detail}</div>
              </div>
            ))}
          </div>
          <p style={{ ...pStyle }}>
            Income earned in India — salary from an India employer, business income generated in India, rental income from Indian properties — is taxable as normal regardless of RNOR status.
          </p>

          <h2 style={{ ...h2Style }}>How Much Can RNOR Actually Save?</h2>
          <p style={{ ...pStyle }}>
            The savings are substantial — and specific to your income level. Here's a realistic scenario:
          </p>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.3)', borderRadius: '14px', padding: '1.5rem', margin: '1rem 0 1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Example: NRI returning from USA after 12 years</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7D5300', marginBottom: '6px' }}>Profile</div>
                <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                  {['Remote US job: $120,000/year', 'Foreign investments: $8,000 annual income', 'RNOR period: ~3 years'].map(d => (
                    <li key={d} style={{ fontSize: '13px', color: '#7D5300', lineHeight: 1.7 }}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7D5300', marginBottom: '6px' }}>Tax impact</div>
                <div style={{ background: '#fff', borderRadius: '8px', padding: '10px 12px', border: '1px solid rgba(255,153,51,0.2)' }}>
                  <div style={{ fontSize: '13px', color: '#138808', fontWeight: 600, marginBottom: '4px' }}>✓ With RNOR: US income not taxable in India</div>
                  <div style={{ fontSize: '13px', color: '#C0392B', fontWeight: 600, marginBottom: '8px' }}>✗ Without RNOR: ~30% Indian tax on foreign income</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#CC7A00' }}>Estimated saving over 3 years: ₹90L–₹1.1Cr</div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ ...pStyle }}>
            Even for more modest income levels, RNOR savings are significant. An NRI with $60,000 in annual foreign income can expect to save ₹15–25L per year they remain in RNOR status.
          </p>

          <h2 style={{ ...h2Style }}>Do you need to file any separate form to get RNOR status?</h2>
          <p style={{ ...pStyle }}>
            No. Individuals do not file a separate RNOR form. RNOR is determined by tax residency rules and generally reflected in the tax return.
          </p>
          <p style={{ ...pStyle }}>
            RNOR status is not claimed through a separate pre-arrival form. It is determined based on your stay history under India’s tax residency rules and is typically reflected when you file your Indian income tax return for the relevant year.
          </p>
          <div style={{ background: '#FCEBEB', border: '1.5px solid rgba(192,57,43,0.2)', borderRadius: '14px', padding: '1.25rem 1.5rem', margin: '1rem 0 1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>⚠️ Common mistake</div>
            <p style={{ fontSize: '14px', color: '#7B241C', lineHeight: 1.65, margin: 0 }}>
              Many returning NRIs think RNOR requires a separate form right after landing. For individuals, that is not how RNOR works.
            </p>
          </div>

          <h2 style={{ ...h2Style }}>The 3 Most Common RNOR Mistakes</h2>

          <h3 style={{ ...h3Style }}>1. Assuming RNOR needs a separate application</h3>
          <p style={{ ...pStyle }}>
            Many NRIs hear about RNOR, then go looking for a form, approval, or registration step that does not exist. The real work is different: keep clean travel records, count India days carefully, and make sure the first India tax return uses the correct residency position.
          </p>

          <h3 style={{ ...h3Style }}>2. Incorrect residency classification in tax returns</h3>
          <p style={{ ...pStyle }}>
            Filing your first India tax return with the wrong residency status — even accidentally — can trigger scrutiny. Foreign income that wasn't declared because it was assumed to be RNOR-exempt may be reassessed if the underlying documentation isn't in order. Work with a CA who specialises in NRI taxation, not a generalist.
          </p>

          <h3 style={{ ...h3Style }}>3. Not planning the return date to maximise RNOR</h3>
          <p style={{ ...pStyle }}>
            The financial year in India runs April–March. The number of days you spend in India within a financial year determines when you become "Resident." A well-timed return — arriving in India in January or February rather than April — can extend your RNOR benefit by an additional year. This is worth planning around.
          </p>

          <h2 style={{ ...h2Style }}>How to Prepare: 5 Steps Before You Move</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0 1.5rem' }}>
            {[
              { n: 1, step: 'Calculate your RNOR window', detail: 'Give your CA a complete year-by-year record of days spent in India for the past 10 years. They will calculate your exact eligibility period.' },
              { n: 2, step: 'Time your return date strategically', detail: 'Work with your CA to identify the return date that maximises your RNOR period. Even a few weeks\' difference can add a full year of benefit.' },
              { n: 3, step: 'Structure your foreign income', detail: 'Ensure foreign income sources such as salary, dividends, stock sales, RSUs, and rental income are clearly mapped before you arrive.' },
              { n: 4, step: 'Track your India day count', detail: 'Keep clean records of your move date and your total days in India for each financial year so RNOR can be reviewed correctly.' },
              { n: 5, step: 'Prepare for the first India tax return', detail: 'Update banks if your residential status changes and work with your CA so RNOR is reflected correctly in the return if you are eligible.' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#F8F5F0', borderRadius: '12px', padding: '1rem 1.125rem', border: '1px solid #E5E1DA' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#000080', color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1208', marginBottom: '3px' }}>{s.step}</div>
                  <div style={{ fontSize: '13px', color: '#6B5E50', lineHeight: 1.65 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ ...h2Style }}>Final Thoughts</h2>
          <p style={{ ...pStyle }}>
            RNOR is not a loophole or a tax hack — it is a provision specifically created for returning NRIs to ease their financial transition back to Indian residency. The government designed it to give you time to restructure your global finances without being hit with full Indian tax rates on income you earned abroad.
          </p>
          <p style={{ ...pStyle }}>
            Use it. But use it correctly. A single consultation with a qualified NRI CA — ideally 3–6 months before your planned return date — is the highest-return 30 minutes you will spend in your entire pre-move planning process.
          </p>
        </div>
      </article>

      {/* RNOR TOOL CTA */}
      <section style={{ background: 'linear-gradient(135deg, #000080 0%, #0000AA 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Estimate your RNOR savings
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Use the RNOR Calculator to estimate your eligibility window and approximate tax savings — or take the readiness check to see how RNOR fits into your overall return plan.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/rnor" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,153,51,0.4)' }}>
              RNOR Calculator →
            </Link>
            <Link href="/planner" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              Readiness Check →
            </Link>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '1rem' }}>Free · no account needed</div>
        </div>
      </section>

      {/* RELATED */}
      <article style={{ background: '#fff', padding: '2rem' }}>
        <div style={{ ...prose }}>
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Related Resources</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { href: '/rnor', icon: '📊', label: 'RNOR Calculator', sub: 'Estimate your tax savings instantly' },
                { href: '/planner', icon: '📋', label: 'Readiness Check', sub: 'Full return readiness score' },
                { href: '/resources/nri-returning-to-india-checklist', icon: '✅', label: 'NRI Return Checklist', sub: '14-step complete guide' },
                { href: '/resources/should-i-return-to-india-from-usa', icon: '🤔', label: 'Should I return?', sub: '2026 decision guide' },
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
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem', marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933, #CC7A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: '#fff', flexShrink: 0 }}>B</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1208' }}>Bharath Mandava &amp; Swathi Bandla</div>
              <div style={{ fontSize: '12px', color: '#B5A898' }}>Co-founders, ReturningNRIs · 16 years in the USA · Moving back April 2026</div>
            </div>
          </div>
        </div>
      </article>
      <div style={{ height: '2rem', background: '#fff' }} />
    </>
  )
}
