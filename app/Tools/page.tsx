'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type State = { country: string; income: string; intent: string; timeline: string; family: string; city: string }
type Step = { key: keyof State; section: string; q: string; hint: string; opts: { k: string; label: string; sub: string }[] }

const T = {
  bg: '#F8F5F0', white: '#FFFFFF', ink: '#1A1208', muted: '#6B5E50', soft: '#B5A898', border: '#E5E1DA',
  saffron: '#FF9933', saffronLight: '#FFF3E6', saffronBorder: 'rgba(255,153,51,0.25)',
  green: '#138808', greenLight: '#E8F5E8', navy: '#000080', navyLight: '#E8E8FF',
  heroGrad: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

const CITY: Record<string, { name: string; cost: string; base: number; match: number; jobs: string; schools: string; nri: string; reason: string }> = {
  hyd: { name: 'Hyderabad', cost: 'Rs 1.6-2.2L/mo', base: 180000, match: 94, jobs: 'Excellent', schools: 'IB / IGCSE / CBSE', nri: 'Very High', reason: 'Balanced cost, strong jobs, and the deepest returnee familiarity.' },
  blr: { name: 'Bangalore', cost: 'Rs 2.2-3.2L/mo', base: 240000, match: 88, jobs: 'Excellent', schools: 'IB / IGCSE / CBSE', nri: 'Very High', reason: 'Best startup and technology density if career upside dominates.' },
  mum: { name: 'Mumbai', cost: 'Rs 2.5-4.0L/mo', base: 280000, match: 78, jobs: 'Excellent', schools: 'IB / IGCSE / CBSE', nri: 'High', reason: 'Best fit for finance and premium urban networks, but expensive.' },
  del: { name: 'Delhi / NCR', cost: 'Rs 1.8-3.0L/mo', base: 220000, match: 80, jobs: 'Very Good', schools: 'IB / IGCSE / CBSE', nri: 'High', reason: 'Strong cross-sector jobs and the best connectivity footprint.' },
  pun: { name: 'Pune', cost: 'Rs 1.4-2.0L/mo', base: 160000, match: 89, jobs: 'Very Good', schools: 'IB / IGCSE / CBSE', nri: 'High', reason: 'Quality-of-life leader with lower burn than larger metros.' },
  che: { name: 'Chennai', cost: 'Rs 1.4-2.2L/mo', base: 170000, match: 82, jobs: 'Good', schools: 'IB / ICSE / CBSE', nri: 'High', reason: 'Strong cultural fit and affordability for many Tamil families.' },
  coc: { name: 'Kochi', cost: 'Rs 95K-1.5L/mo', base: 120000, match: 80, jobs: 'Good', schools: 'CBSE / ICSE / IB', nri: 'Very High', reason: 'Relaxed landing option with unusually strong NRI familiarity.' },
  open: { name: 'Hyderabad', cost: 'Rs 1.6-2.2L/mo', base: 180000, match: 88, jobs: 'Excellent', schools: 'IB / IGCSE / CBSE', nri: 'Very High', reason: 'Default recommendation when you need the safest all-round starting point.' },
}

const STEPS: Step[] = [
  { key: 'country', section: 'Current base', q: 'Where are you currently based?', hint: 'Sets the tax and RNOR angle.', opts: [{ k: 'usa', label: 'United States', sub: 'US resident profile' }, { k: 'uk', label: 'United Kingdom', sub: 'UK resident profile' }, { k: 'uae', label: 'UAE / Middle East', sub: 'Tax-free income base' }, { k: 'canada', label: 'Canada', sub: 'Canadian resident profile' }, { k: 'other', label: 'Other country', sub: 'Rest of world' }] },
  { key: 'income', section: 'Income', q: 'What is your monthly income band?', hint: 'Used to estimate purchasing power.', opts: [{ k: 'l50', label: 'Under $5,000', sub: 'Under Rs 4L/mo' }, { k: 'm100', label: '$5,000-$10,000', sub: 'Rs 4L-8L/mo' }, { k: 'm200', label: '$10,000-$20,000', sub: 'Rs 8L-17L/mo' }, { k: 'h200', label: 'Over $20,000', sub: 'Rs 17L+/mo' }] },
  { key: 'intent', section: 'Move intent', q: 'What kind of return are you planning?', hint: 'Changes the action sequence.', opts: [{ k: 'permanent', label: 'Permanent move back', sub: 'Decision already made' }, { k: 'trial', label: 'Trial move first', sub: 'Test before committing' }, { k: 'undecided', label: 'Still undecided', sub: 'Researching first' }, { k: 'remote', label: 'Remote work from India', sub: 'Keep current job if possible' }] },
  { key: 'timeline', section: 'Timeline', q: 'When are you planning to move?', hint: 'Determines urgency and RNOR timing.', opts: [{ k: 'asap', label: 'Within 6 months', sub: 'High urgency' }, { k: 'year', label: '6-12 months', sub: 'Healthy prep window' }, { k: 'two', label: '1-2 years', sub: 'Comfortable pace' }, { k: 'explore', label: 'Just exploring', sub: 'No move date yet' }] },
  { key: 'family', section: 'Family', q: 'Who is part of the move?', hint: 'Changes cost and complexity.', opts: [{ k: 'solo', label: 'Just me', sub: 'Solo move' }, { k: 'couple', label: 'Me and spouse', sub: 'No kids in plan' }, { k: 'kids', label: 'Family with kids', sub: 'School planning matters' }, { k: 'parents', label: 'With elderly parents', sub: 'Healthcare rises in priority' }] },
  { key: 'city', section: 'Target city', q: 'Which city are you evaluating?', hint: 'Gives the plan a landing context.', opts: [{ k: 'hyd', label: 'Hyderabad', sub: 'Balanced default' }, { k: 'blr', label: 'Bangalore', sub: 'Jobs and startups' }, { k: 'mum', label: 'Mumbai', sub: 'Finance and premium urban life' }, { k: 'del', label: 'Delhi / NCR', sub: 'Connectivity and cross-sector jobs' }, { k: 'pun', label: 'Pune', sub: 'Quality of life' }, { k: 'che', label: 'Chennai', sub: 'Cultural fit and affordability' }, { k: 'coc', label: 'Kochi', sub: 'Strong returnee familiarity' }, { k: 'open', label: 'Not sure yet', sub: 'Show the default recommendation' }] },
]

const COST_NOW: Record<string, string> = { l50: '~$4K/mo', m100: '~$7.5K/mo', m200: '~$15K/mo', h200: '$20K+/mo' }
const SAVE_PCT: Record<string, string> = { l50: '~50%', m100: '~60%', m200: '~65%', h200: '~70%' }
const RNOR: Record<string, string> = { l50: 'Rs 10-18L', m100: 'Rs 18-28L', m200: 'Rs 28-40L', h200: 'Rs 40-60L' }

function compute(s: State) {
  const city = CITY[s.city] || CITY.open
  let score = 70 + (s.intent === 'permanent' ? 8 : 0) + (s.intent === 'remote' ? 5 : 0) - (s.intent === 'undecided' ? 6 : 0) + (s.timeline === 'two' ? 6 : 0) - (s.timeline === 'asap' ? 4 : 0) + (s.income === 'm200' || s.income === 'h200' ? 4 : 0)
  score = Math.min(97, Math.max(48, score))
  const readyColor = score >= 85 ? T.green : score >= 70 ? '#CC7A00' : '#C0392B'
  const statusBg = score >= 85 ? T.greenLight : score >= 70 ? T.saffronLight : '#FCEBEB'
  const readyLabel = score >= 85 ? 'Well positioned' : score >= 70 ? 'On track' : 'Needs planning'
  const countryName = ({ usa: 'USA', uk: 'UK', uae: 'UAE', canada: 'Canada', other: 'abroad' } as Record<string, string>)[s.country] || 'abroad'
  const intro = s.intent === 'permanent' ? 'You have already made the strategic decision. The job now is clean execution.' : s.intent === 'trial' ? 'A trial move is smart if you structure it deliberately.' : s.intent === 'remote' ? 'Remote income from India can be a powerful version of this move.' : 'Research first is the right move. This gives you a realistic preview.'
  const risk = s.timeline === 'asap' ? `RNOR paperwork timing is tight. Missing it can cost you ${RNOR[s.income] || RNOR.m100}.` : s.family === 'kids' ? `School admissions in ${city.name} often need 12-18 months of lead time.` : s.intent === 'undecided' ? 'Delay can quietly burn the RNOR advantage without creating real clarity.' : 'Banking and NRE / NRO setup should happen before leaving, not after landing.'
  const actions = s.intent === 'remote'
    ? ['Negotiate and document a remote-from-India arrangement before leaving.', `Use the RNOR window deliberately while foreign income remains high leverage (${RNOR[s.income] || RNOR.m100}).`, `Plan reliable internet and workspace rhythm in ${city.name}.`]
    : s.intent === 'trial'
      ? ['Structure a 3-month scouting or trial period before a final one-way move.', 'Keep current income continuity during the trial if possible.', 'Use the trial to validate neighborhood, school, and routine fit.']
      : ['Open or organize NRE and NRO banking now.', 'Map RNOR filing and residency sequence before you lock flights.', s.family === 'kids' ? `Start school research and applications in ${city.name} immediately.` : `Secure a 60-90 day housing bridge in ${city.name} before landing.`]
  return {
    city, score, readyColor, statusBg, readyLabel, countryName, intro, risk, actions,
    currCost: COST_NOW[s.income] || COST_NOW.m100, savePct: SAVE_PCT[s.income] || SAVE_PCT.m100, rnorSave: RNOR[s.income] || RNOR.m100,
    recommendationTitle: score >= 85 ? 'You can plan this as a live move program.' : score >= 70 ? 'Close the gaps before you commit.' : 'Use the tools to build the foundation first.',
    statusDetail: score >= 85 ? 'Your profile can move from exploration into execution.' : score >= 70 ? 'The move looks viable, but a few details still determine whether it feels smooth or stressful.' : 'You need more structure before this turns into a confident move plan.',
  }
}

function QuestionCard({ step, index, value, setValue }: { step: Step; index: number; value: string; setValue: (v: string) => void }) {
  return (
    <div className="tools-section-card" style={{ padding: '1.2rem' }}>
      <div className="tools-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{step.hint}</p>
        </div>
        {value ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: T.greenLight, color: T.green, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}
      </div>
      <div className="tools-option-grid">
        {step.opts.map((opt) => {
          const selected = value === opt.k
          return (
            <button
              key={opt.k}
              type="button"
              onClick={() => setValue(opt.k)}
              style={{
                textAlign: 'left',
                padding: '1rem 1rem 0.95rem',
                borderRadius: 18,
                border: `1.5px solid ${selected ? T.saffron : T.border}`,
                background: selected ? T.saffronLight : T.white,
                boxShadow: selected ? '0 10px 24px rgba(255,153,51,0.14)' : 'none',
                transition: 'all .18s ease',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.45 }}>{opt.label}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{opt.sub}</div>
                </div>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `1.5px solid ${selected ? T.saffron : T.border}`,
                    background: selected ? T.saffron : 'transparent',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Tools() {
  const { shouldBlock } = useProtectedRoute()
  const [state, setState] = useState<State>({ country: '', income: '', intent: '', timeline: '', family: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  if (shouldBlock) return null

  const keys: (keyof State)[] = ['country', 'income', 'intent', 'timeline', 'family', 'city']
  const answered = keys.filter((k) => !!state[k]).length
  const progress = Math.round((answered / keys.length) * 100)
  const result = compute(state)

  const css = `
    .tools-page { overflow-x: hidden; }
    .tools-shell, .tools-result-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    .tools-grid { display:grid; grid-template-columns:minmax(280px,360px) minmax(0,1fr); gap:1.25rem; align-items:start; }
    .tools-sticky { position:sticky; top:96px; }
    .tools-stack { display:grid; gap:1rem; }
    .tools-section-card, .tools-question-card { background:${T.white}; border:1px solid ${T.border}; border-radius:24px; box-shadow:0 22px 48px rgba(29,22,15,0.06); }
    .tools-option-grid { display:grid; gap:.8rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
    .tools-hero-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(280px,.8fr); gap:.9rem; align-items:start; }
    .tools-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.9rem; }
    .tools-overview, .tools-cards { display:grid; grid-template-columns:1.05fr .95fr; gap:1rem; margin-top:1rem; }
    .tools-cards { grid-template-columns:1fr 1fr; }
    @media (max-width:980px){ .tools-grid,.tools-hero-grid,.tools-overview,.tools-cards{grid-template-columns:1fr;} .tools-sticky{position:static;} .tools-stats{grid-template-columns:repeat(2,minmax(0,1fr));}}
    @media (max-width:767px){ .tools-shell,.tools-result-shell{padding:1rem .9rem 2rem;} .tools-option-grid,.tools-stats{grid-template-columns:1fr !important;} .tools-question-label,.tools-progress-row{flex-direction:column !important; align-items:flex-start !important;} .tools-section-card,.tools-question-card{padding:1rem !important;} }
  `

  if (loading) {
    return <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><style>{css + '@keyframes spin{to{transform:rotate(360deg)}}'}</style><div style={{ textAlign: 'center' }}><div style={{ width: 52, height: 52, border: `3px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 1.5rem' }} /><h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: T.ink, marginBottom: '.5rem' }}>Generating your tools dashboard...</h2><p style={{ color: T.muted }}>Pulling together the right view for your move profile.</p></div></div>
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
        <style>{css}</style>
        <div className="tools-result-shell">
          <div className="tools-hero-grid">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ padding: '1.2rem 1.25rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '0.45rem 0.85rem', marginBottom: '1rem' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: T.saffron }} /><span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tools dashboard</span></div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,4vw,3rem)', lineHeight: 0.98, color: T.white, marginBottom: 8 }}>{result.city.name} looks like your current lead.</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 620 }}>{result.intro}</p>
                <div className="tools-stats" style={{ marginTop: 16 }}>
                  {[{ label: 'Score', value: String(result.score) }, { label: 'Status', value: result.readyLabel }, { label: 'India cost', value: result.city.cost }, { label: 'RNOR upside', value: result.rnorSave }].map((item) => <div key={item.label} style={{ padding: '1rem', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{item.label}</div><div style={{ fontSize: 15, fontWeight: 700, color: T.white, lineHeight: 1.45 }}>{item.value}</div></div>)}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: '.9rem' }}>
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 22, padding: '1.05rem 1.1rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}><div><div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Next best action</div><h2 style={{ fontSize: '1.15rem', color: T.ink, marginBottom: 6 }}>{result.recommendationTitle}</h2></div><div style={{ background: result.statusBg, color: result.readyColor, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, alignSelf: 'flex-start' }}>{result.readyLabel}</div></div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, marginBottom: 14 }}>{result.statusDetail}</p>
                <div style={{ padding: '1rem', borderRadius: 18, background: T.saffronLight, border: `1px solid ${T.saffronBorder}` }}><div style={{ fontSize: 12, fontWeight: 700, color: '#8d5c22', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Why this matters</div><div style={{ fontSize: 14, color: '#8d5c22', lineHeight: 1.75 }}>{result.actions[0]}</div></div>
              </div>
              <Link href="/planner" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 1.15rem', background: T.saffron, color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 999, textDecoration: 'none' }}>Open Readiness Check</Link>
              <Link href="/journey" style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', padding: '1rem 1.15rem', background: T.green, color: '#fff', fontSize: 14, fontWeight: 700, borderRadius: 999, textDecoration: 'none' }}>Open Journey</Link>
              <button type="button" onClick={() => setDone(false)} style={{ width: '100%', padding: '1rem 1.15rem', borderRadius: 999, border: `1px solid ${T.saffronBorder}`, background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF2E2 100%)', color: T.ink, fontSize: 14, fontWeight: 700, fontFamily: 'DM Sans, sans-serif' }}>Rebuild Tools Plan</button>
            </div>
          </div>

          <div className="tools-overview">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Planning signals</div>
              <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 16 }}>What the tools are telling you right now</h2>
              {[{ label: 'City fit', value: `${result.city.match}%`, note: result.city.reason, pct: result.city.match, color: T.green }, { label: 'Current spend', value: result.currCost, note: `Current operating baseline in ${result.countryName}`, pct: Math.max(40, result.score - 10), color: '#791F1F' }, { label: 'Projected spend', value: result.city.cost, note: `Estimated operating cost in ${result.city.name}`, pct: Math.max(45, result.score - 6), color: T.ink }, { label: 'Peer position', value: `Top ${100 - (state.timeline === 'asap' ? 41 : state.timeline === 'year' ? 37 : state.timeline === 'two' ? 22 : 48)}%`, note: 'How prepared you look versus similar returnees', pct: 100 - (state.timeline === 'asap' ? 41 : state.timeline === 'year' ? 37 : state.timeline === 'two' ? 22 : 48), color: T.navy }].map((item) => <div key={item.label} style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{item.label}</div><div style={{ fontSize: 12, color: T.muted }}>{item.note}</div></div><div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</div></div><div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}><div style={{ width: `${item.pct}%`, height: '100%', background: item.color }} /></div></div>)}
            </div>
            <div style={{ background: result.statusBg, border: `1.5px solid ${result.readyColor}22`, borderRadius: 24, padding: '1.35rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: result.readyColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recommendation</div>
              <h2 style={{ fontSize: '1.35rem', color: result.readyColor, marginBottom: 12 }}>{result.recommendationTitle}</h2>
              <p style={{ fontSize: 14, color: result.readyColor, lineHeight: 1.75, margin: '0 0 1rem 0', opacity: 0.92 }}>{result.intro}</p>
              <div style={{ display: 'grid', gap: 10 }}>{result.actions.map((action, index) => <div key={index} style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: 12, alignItems: 'start', padding: '.95rem', borderRadius: 18, background: 'rgba(255,255,255,0.45)' }}><div style={{ width: 26, height: 26, borderRadius: '50%', background: result.readyColor, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>{index + 1}</div><div style={{ fontSize: 14, color: result.readyColor, lineHeight: 1.7 }}>{action}</div></div>)}</div>
            </div>
          </div>

          <div className="tools-cards">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Financial translation</div>
              <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 14 }}>How the move changes the financial picture</h2>
              {[{ label: `Current spend (${result.countryName})`, val: result.currCost, sub: 'Current operating baseline', bg: '#FCEBEB', border: 'rgba(192,57,43,0.12)', color: '#791F1F' }, { label: `Projected spend (${result.city.name})`, val: result.city.cost, sub: result.city.reason, bg: T.greenLight, border: 'rgba(19,136,8,0.12)', color: T.green }, { label: 'Savings improvement', val: result.savePct, sub: 'Rough reduction in living-cost burn', bg: T.saffronLight, border: T.saffronBorder, color: '#8d5c22' }, { label: 'RNOR upside', val: result.rnorSave, sub: 'Potential first-year tax value if handled correctly', bg: T.navyLight, border: 'rgba(0,0,128,0.12)', color: T.navy }].map((item) => <div key={item.label} style={{ padding: '1rem', borderRadius: 18, background: item.bg, border: `1px solid ${item.border}`, marginBottom: 12 }}><div style={{ fontSize: 11, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.label}</div><div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.45rem', color: item.color, marginBottom: 3 }}>{item.val}</div><div style={{ fontSize: 12, color: T.muted }}>{item.sub}</div></div>)}
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Risk and fit</div>
              <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 14 }}>What needs attention before you trust the plan</h2>
              {[{ label: 'Top risk', body: result.risk, bg: '#FCEBEB', border: 'rgba(192,57,43,0.18)', color: '#C0392B' }, { label: 'Country-specific note', body: ({ usa: 'Your 401(k), RSUs, and tax residency sequence need planning before departure.', uk: 'UK departure and domicile implications can still matter after leaving.', uae: 'Your tax-free base makes the RNOR window especially valuable.', canada: 'Departure tax can materially change available capital.', other: 'Check home-country exit taxes and reporting before you leave.' } as Record<string, string>)[state.country] || 'Check home-country exit taxes and reporting before you leave.', bg: T.saffronLight, border: T.saffronBorder, color: '#CC7A00' }, { label: 'City fit read', body: `${result.city.name} combines ${result.city.jobs.toLowerCase()} job depth, ${result.city.schools.toLowerCase()} schooling options, and a ${result.city.nri.toLowerCase()} NRI community profile.`, bg: T.navyLight, border: 'rgba(0,0,128,0.12)', color: T.navy }].map((item) => <div key={item.label} style={{ padding: '1rem', borderRadius: 18, background: item.bg, border: `1px solid ${item.border}`, marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: item.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{item.label}</div><div style={{ fontSize: 14, color: T.ink, lineHeight: 1.7 }}>{item.body}</div></div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tools-page" style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{css}</style>
      <div className="tools-shell">
        <div className="tools-grid">
          <div className="tools-sticky">
            <div className="tools-section-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Tools Planning
                  </span>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: T.white, marginBottom: '.9rem' }}>Use the tools like a <em style={{ fontStyle: 'italic', color: T.saffron }}>real system.</em></h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions and get a tools-first recommendation, your strongest fit, and the next surface to open.</p>
              </div>
              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.muted, marginBottom: 8 }}><span>Assessment progress</span><span style={{ fontWeight: 700 }}>{progress}%</span></div>
                  <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} /></div>
                </div>
                {[{ title: 'What you’ll get', body: 'A city recommendation, a financial translation, and the next tools to open.' }, { title: 'Your progress', body: answered === keys.length ? 'Everything is filled in and ready for your personalised dashboard.' : `${answered} of ${keys.length} questions answered. ${keys.length - answered} left before you can generate your dashboard.` }, { title: 'How to answer', body: 'Pick the option that best describes your current situation. You can change answers anytime before generating the dashboard.' }].map((item) => <div key={item.title} className="tools-section-card" style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>{item.body}</div></div>)}
              </div>
            </div>
          </div>

          <div className="tools-stack">
            <div className="tools-section-card" style={{ padding: '1.25rem 1.3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: T.saffron }} /><span style={{ fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: '0.06em' }}>Tools Assessment · Free · {keys.length} questions</span></div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: T.ink, marginBottom: '0.6rem' }}>Build your tools plan</h2>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8, maxWidth: 760 }}>Move through the questions below and we’ll turn your answers into a clear tools-first dashboard and recommendation.</p>
            </div>
            {STEPS.map((step, index) => <QuestionCard key={step.key} index={index} step={step} value={state[step.key]} setValue={(v) => setState((prev) => ({ ...prev, [step.key]: v }))} />)}
            <div style={{ marginTop: '0.25rem' }}>
              {answered === keys.length ? (
                <button
                  type="button"
                  onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }, 1100) }}
                  style={{ width: '100%', padding: '15px', background: T.saffron, color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}
                >
                  Generate My Tools Dashboard →
                </button>
              ) : (
                <div className="tools-progress-row tools-question-card" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '1.25rem' }}>📋</div>
                  <div>
                    <div style={{ fontSize: '13px', color: T.muted }}>Answer all {keys.length} questions to generate your dashboard</div>
                    <div style={{ fontSize: '11px', color: T.soft, marginTop: '2px' }}>{keys.length - answered} question{keys.length - answered !== 1 ? 's' : ''} remaining</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
