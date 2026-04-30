import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NRI Returning to India Checklist (2026 Complete Step-by-Step Guide)',
  description: 'Moving back to India from the USA? Use this complete NRI return checklist covering finances, tax (RNOR), job, housing, and relocation planning.',
  keywords: ['NRI returning to India checklist', 'NRI return checklist 2026', 'moving back to India from USA checklist', 'NRI relocation India', 'RNOR checklist NRI'],
  openGraph: {
    title: 'NRI Returning to India Checklist (2026 Complete Step-by-Step Guide)',
    description: 'Complete step-by-step checklist for NRIs moving back to India — finances, tax, job, housing, and family.',
    url: 'https://www.returningnris.com/resources/nri-returning-to-india-checklist',
    type: 'article',
  },
  alternates: { canonical: 'https://www.returningnris.com/resources/nri-returning-to-india-checklist' },
}

const prose: React.CSSProperties = { maxWidth: '720px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif', color: '#1A1208', lineHeight: 1.8 }
const h2Style: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.4rem,3vw,1.75rem)', color: '#1A1208', marginBottom: '0.75rem', marginTop: '2.5rem', lineHeight: 1.25 }
const h3Style: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#1A1208', marginBottom: '0.5rem', marginTop: '1.5rem' }
const pStyle: React.CSSProperties = { fontSize: '1rem', color: '#3D3229', lineHeight: 1.85, marginBottom: '1rem' }

const phases = [
  {
    phase: 'Phase 1',
    title: 'Before You Decide to Move',
    icon: '🧠',
    color: '#000080',
    bg: '#EEF2FF',
    border: 'rgba(0,0,128,0.15)',
    items: [
      {
        n: '1', title: 'Evaluate Financial Readiness', urgent: true,
        tasks: ['Calculate total liquid savings — be honest about what is truly accessible', 'Estimate realistic India monthly expenses for your family and city', 'Confirm you have 12–18 months of financial runway before giving notice'],
        note: 'Minimum $75K liquid savings. $100K–$150K is the comfortable zone.',
      },
      {
        n: '2', title: 'Secure Your Income Source', urgent: true,
        tasks: ['Negotiate a remote work arrangement with your current employer — fastest path', 'Get an India job offer in writing before committing to a move date', 'If running a business, confirm it is genuinely location-independent and revenue is stable'],
        note: 'Moving without confirmed income is the single most common reason NRIs return within 2 years.',
      },
      {
        n: '3', title: 'Plan RNOR Tax Status', urgent: true,
        tasks: ['Review your stay history to see whether RNOR may apply after you return', 'Book a consultation with an NRI CA at least 3–6 months before moving', 'Plan your return date and first tax year with foreign income, stock sales, dividends, and RSUs in mind'],
        note: 'RNOR status is not claimed through a separate pre-arrival form. It is determined based on your stay history under India’s tax residency rules and is typically reflected when you file your Indian income tax return for the relevant year.',
      },
      {
        n: '4', title: 'Shortlist Your Target City', urgent: false,
        tasks: ['Compare cost of living, job market density, and school quality', 'Visit shortlisted cities for at least 3–5 days each before deciding', 'Talk to at least 2–3 NRI families already settled in each city'],
        note: null,
      },
    ],
  },
  {
    phase: 'Phase 2',
    title: '3–6 Months Before Moving',
    icon: '📋',
    color: '#CC7A00',
    bg: '#FFF3E6',
    border: 'rgba(204,122,0,0.2)',
    items: [
      {
        n: '5', title: 'Activate Your Job Search', urgent: false,
        tasks: ['Start applying to India roles now — hiring cycles take 2–4 months', 'Activate your network before you need it — most senior roles are filled via referral', 'Attend India-focused virtual career events to build pipeline early'],
        note: null,
      },
      {
        n: '6', title: 'Sort Children\'s School Admissions', urgent: true,
        tasks: ['Research IGCSE, IB, and CBSE schools in your shortlisted city', 'Submit applications immediately — good schools fill 12–18 months in advance', 'Prepare US transcripts, recommendation letters, and curriculum mapping documents'],
        note: 'School admissions is the most time-sensitive task. Start this before you finalise anything else.',
      },
      {
        n: '7', title: 'Plan Housing', urgent: false,
        tasks: ['Shortlist 2–3 neighbourhoods close to target schools and commute routes', 'Arrange a serviced apartment for the first 60–90 days as a bridge', 'Research typical rental deposits, brokerage fees, and lease terms in your city'],
        note: null,
      },
      {
        n: '8', title: 'Organise Your Finances', urgent: false,
        tasks: ['Open NRE and NRO accounts if not already done — do this while still abroad', 'Begin systematic fund transfers to NRE account (tax-free repatriation)', 'Review US investments and plan for post-residency tax implications'],
        note: null,
      },
    ],
  },
  {
    phase: 'Phase 3',
    title: '1 Month Before Moving',
    icon: '✈️',
    color: '#7C5CBF',
    bg: '#F3F0FF',
    border: 'rgba(124,92,191,0.2)',
    items: [
      {
        n: '9', title: 'Finalise Logistics', urgent: false,
        tasks: ['Book one-way tickets — avoid committing to return dates', 'Arrange international shipping for essential belongings only (India has most things)', 'Cancel or transfer US subscriptions, utilities, and memberships before you leave'],
        note: null,
      },
      {
        n: '10', title: 'Health Insurance Transition', urgent: true,
        tasks: ['Purchase comprehensive India health insurance before arrival — not after', 'Include maternity and critical illness cover if relevant', 'Do not rely on corporate cover alone — have personal coverage as backup'],
        note: null,
      },
      {
        n: '11', title: 'Critical Documents', urgent: false,
        tasks: ['Renew PAN card and link to your bank accounts', 'Update Aadhaar with current address and mobile number', 'Carry original education certificates, marriage certificate, and property documents', 'Apostille key documents for any future official use in India'],
        note: null,
      },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'After Arriving in India',
    icon: '🏡',
    color: '#138808',
    bg: '#E8F5E8',
    border: 'rgba(19,136,8,0.2)',
    items: [
      {
        n: '12', title: 'Track RNOR Eligibility and First Tax Return', urgent: true,
        tasks: ['Track your move date and your days in India for each financial year', 'Review RNOR eligibility based on your stay history under India tax residency rules', 'Work with your CA so the correct RNOR status is reflected in your Indian tax return if eligible'],
        note: 'For individuals, RNOR does not require a separate application after landing. The work is in tracking, reviewing eligibility, and filing correctly.',
      },
      {
        n: '13', title: 'Set Up Your Financial Life', urgent: false,
        tasks: ['Convert NRE account to resident account once residency changes', 'Update KYC across all banks, mutual funds, and investment accounts if your residential status changes', 'Review and restructure investment portfolio for Indian tax residency'],
        note: null,
      },
      {
        n: '14', title: 'Complete Settling-In Tasks', urgent: false,
        tasks: ['Confirm children\'s school start dates and onboarding requirements', 'Register with local municipal authority if required', 'Set up local healthcare — identify a family GP and specialist network near home'],
        note: null,
      },
    ],
  },
]

export default function NRIChecklist() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'NRI Returning to India Checklist (2026 Complete Step-by-Step Guide)',
        description: 'Complete step-by-step checklist for NRIs moving back to India — finances, tax, job, housing, and family.',
        author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
        datePublished: '2026-03-01',
        dateModified: new Date().toISOString().split('T')[0],
        url: 'https://www.returningnris.com/resources/nri-returning-to-india-checklist',
      }) }} />

      {/* HERO */}
      <section style={{ background: '#FFFFFF', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '4rem 2rem 3rem' }}>
        <div style={{ ...prose }}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link>
            <span>›</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link>
            <span>›</span>
            <span style={{ color: '#6B5E50' }}>NRI Returning to India Checklist</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Planning</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>12 min read · Updated March 2026</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,5vw,2.75rem)', color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            NRI Returning to India:<br />The Complete 2026 Checklist
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#6B5E50', lineHeight: 1.75 }}>
            14 steps across 4 phases — from the decision to move through your first month in India. Built from the mistakes NRIs most commonly make and the preparation that consistently leads to a smooth transition.
          </p>
        </div>
      </section>

      {/* QUICK TIP */}
      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={{ ...prose }}>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.3)', borderRadius: '16px', padding: '1.5rem 1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>⚡ The Three Things Most NRIs Underestimate</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                { n: '1', label: 'How long India job hunts take', sub: 'Plan for 3–6 months, not weeks' },
                { n: '2', label: 'The RNOR tax window', sub: '₹18–60L at stake. Not optional to plan.' },
                { n: '3', label: 'School admission timelines', sub: 'Good schools fill 12–18 months ahead' },
              ].map(i => (
                <div key={i.n} style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', border: '1px solid rgba(255,153,51,0.2)' }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: '#FF9933', marginBottom: '4px' }}>{i.n}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>{i.label}</div>
                  <div style={{ fontSize: '11px', color: '#6B5E50', lineHeight: 1.5 }}>{i.sub}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#6B5E50', margin: 0 }}>
              Want a personalised checklist based on your exact situation? →{' '}
              <Link href="/planner" style={{ color: '#FF9933', fontWeight: 600, textDecoration: 'none' }}>Open the planner</Link>
            </p>
          </div>
        </div>
      </section>

      {/* PHASES */}
      <article style={{ background: '#fff', padding: '2.5rem 2rem 3rem' }}>
        <div style={{ ...prose }}>
          <p style={{ ...pStyle }}>
            Returning to India after years abroad is a multi-layered transition — financial, logistical, professional, and personal. The families who navigate it smoothly share one trait: they started planning earlier than felt necessary. This checklist gives you the structure to do that.
          </p>

          {phases.map(phase => (
            <div key={phase.phase}>
              {/* Phase header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2.5rem 0 1.25rem', padding: '1rem 1.25rem', background: phase.bg, border: `1.5px solid ${phase.border}`, borderRadius: '14px' }}>
                <span style={{ fontSize: '1.5rem' }}>{phase.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: phase.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>{phase.phase}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: '#1A1208' }}>{phase.title}</div>
                </div>
              </div>

              {/* Checklist items */}
              {phase.items.map(item => (
                <div key={item.n} style={{ marginBottom: '1.25rem', paddingLeft: '1rem', borderLeft: `3px solid ${item.urgent ? phase.color : '#E5E1DA'}` }}>
                  <h3 style={{ ...h3Style, marginTop: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: phase.color, color: '#fff', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.n}</span>
                    {item.title}
                    {item.urgent && <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: phase.bg, color: phase.color, border: `1px solid ${phase.border}`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Priority</span>}
                  </h3>
                  <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
                    {item.tasks.map((task, i) => (
                      <li key={i} style={{ fontSize: '14px', color: '#3D3229', lineHeight: 1.75, marginBottom: '4px' }}>□ {task}</li>
                    ))}
                  </ul>
                  {item.note && (
                    <div style={{ marginTop: '8px', padding: '8px 12px', background: phase.bg, borderRadius: '8px', fontSize: '12px', color: phase.color, fontWeight: 500, lineHeight: 1.55 }}>
                      → {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Common mistakes */}
          <h2 style={{ ...h2Style }}>Common Mistakes That Derail NRI Returns</h2>
          <p style={{ ...pStyle }}>These come up consistently — not as edge cases, but as patterns:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {[
              { m: 'Moving without a job or income confirmed', detail: 'The #1 reason NRIs return within 2 years. No exceptions to this rule.' },
              { m: 'Ignoring RNOR tax planning', detail: 'Poor day-count tracking, foreign-income planning, or tax-return reporting can create avoidable tax and compliance problems.' },
              { m: 'Underestimating India cost of living', detail: 'School fees, urban rent, and healthcare costs surprise most returnees. Budget conservatively.' },
              { m: 'Delaying school applications', detail: 'The best schools have 12–18 month waitlists. There is no workaround for this.' },
              { m: 'Arriving without housing arranged', detail: 'Settling into a new home while navigating everything else adds unnecessary pressure to an already demanding transition.' },
            ].map((e, i) => (
              <div key={i} style={{ background: '#FCEBEB', border: '0.5px solid rgba(192,57,43,0.15)', borderRadius: '10px', padding: '0.875rem 1.125rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#7B241C', marginBottom: '3px' }}>✗ {e.m}</div>
                <div style={{ fontSize: '12px', color: '#7B241C', opacity: 0.8, lineHeight: 1.55 }}>{e.detail}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <h2 style={{ ...h2Style }}>The 5-Point Readiness Summary</h2>
          <p style={{ ...pStyle }}>If these five are in place, you are in a strong position to move:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { icon: '💼', label: 'Income confirmed', sub: 'Job offer, remote work, or business revenue locked in' },
              { icon: '💰', label: 'Savings buffer ready', sub: '$75K–$100K+ liquid and accessible' },
              { icon: '📊', label: 'RNOR planned', sub: 'Stay history reviewed, return-year reporting ready' },
              { icon: '🏙️', label: 'City selected', sub: 'Schools researched, housing in process' },
              { icon: '👨‍👩‍👧', label: 'Family logistics sorted', sub: 'School applications in, housing arranged' },
            ].map(s => (
              <div key={s.label} style={{ background: '#E8F5E8', border: '1px solid rgba(19,136,8,0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#138808', marginBottom: '3px' }}>✔ {s.label}</div>
                <div style={{ fontSize: '11px', color: '#27500A', lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* PLANNER CTA */}
      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>Get your personalised checklist</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            This generic checklist gives you the structure. The planner helps you see where you stand, what to plan next, and which parts of the timeline matter most for your family — in under 2 minutes.
          </p>
          <Link href="/planner" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '13px 30px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,153,51,0.45)', marginBottom: '0.75rem' }}>
            Start my planner →
          </Link>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Free · no account needed · 2 minutes</div>
        </div>
      </section>

      {/* RELATED */}
      <article style={{ background: '#fff', padding: '2rem' }}>
        <div style={{ ...prose }}>
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Related Resources</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { href: '/planner', icon: '📋', label: 'Return Planner', sub: 'See where you stand and what to do next' },
                { href: '/rnor', icon: '📊', label: 'RNOR Calculator', sub: 'Estimate your tax savings' },
                { href: '/city', icon: '🏙️', label: 'City Match', sub: 'Find your ideal city' },
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
