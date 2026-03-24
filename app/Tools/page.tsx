'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

const CITY_DATA: Record<string, {
  name: string; baseCost: number; match: number; schools: string;
  jobs: string; matchTag: string; alt: string; costRange: string;
  airQ: string; traffic: string; nri: string; why: string[]
}> = {
  hyd:  { name: 'Hyderabad',   baseCost: 180000, match: 94, schools: 'IB / IGCSE / CBSE', jobs: 'Excellent',  matchTag: 'IT hub',        alt: 'Pune',       costRange: '₹1.6–2.2L/mo', airQ: 'Moderate', traffic: 'Moderate',   nri: 'Very High', why: ['Largest returning NRI community in India', 'Top tech hiring — Google, Microsoft, Amazon HQs', 'IB & IGCSE schools with international curricula'] },
  blr:  { name: 'Bangalore',   baseCost: 240000, match: 88, schools: 'IB / IGCSE / CBSE', jobs: 'Excellent',  matchTag: 'Startup hub',   alt: 'Hyderabad',  costRange: '₹2.2–3.2L/mo', airQ: 'Moderate', traffic: 'Heavy',      nri: 'Very High', why: ['Best startup ecosystem and tech job market', 'Cosmopolitan culture — easiest adjustment from the West', 'Pleasant climate year-round with no extreme heat'] },
  mum:  { name: 'Mumbai',      baseCost: 280000, match: 78, schools: 'IB / IGCSE / CBSE', jobs: 'Excellent',  matchTag: 'Financial hub', alt: 'Pune',       costRange: '₹2.5–4.0L/mo', airQ: 'Poor',     traffic: 'Very heavy', nri: 'High',      why: ["India's financial capital — best for finance/media", 'Unmatched social and cultural life', 'Strong international school options in suburbs'] },
  del:  { name: 'Delhi / NCR', baseCost: 220000, match: 80, schools: 'IB / IGCSE / CBSE', jobs: 'Very Good',  matchTag: 'Capital city',  alt: 'Chandigarh', costRange: '₹1.8–3.0L/mo', airQ: 'Poor',     traffic: 'Heavy',      nri: 'High',      why: ['Best connectivity hub — flights across all of India', 'Strong job market across all sectors', 'Wide range from affordable to luxury neighbourhoods'] },
  pun:  { name: 'Pune',        baseCost: 160000, match: 89, schools: 'IB / IGCSE / CBSE', jobs: 'Very Good',  matchTag: 'Quality life',  alt: 'Hyderabad',  costRange: '₹1.4–2.0L/mo', airQ: 'Good',     traffic: 'Moderate',   nri: 'High',      why: ['Best quality of life among all Indian metros', 'Lower cost than Mumbai or Bangalore with similar lifestyle', 'Strong education system — universities and international schools'] },
  che:  { name: 'Chennai',     baseCost: 170000, match: 82, schools: 'IB / ICSE / CBSE',  jobs: 'Good',       matchTag: 'Cultural hub',  alt: 'Bangalore',  costRange: '₹1.4–2.2L/mo', airQ: 'Moderate', traffic: 'Moderate',   nri: 'High',      why: ['Strongest cultural identity — great for Tamil NRIs', 'Growing IT sector and manufacturing base', 'More affordable than Bangalore with good infrastructure'] },
  kol:  { name: 'Kolkata',     baseCost: 130000, match: 72, schools: 'CBSE / ICSE',       jobs: 'Moderate',   matchTag: 'Most affordable', alt: 'Hyderabad', costRange: '₹1.0–1.6L/mo', airQ: 'Moderate', traffic: 'Moderate',   nri: 'Moderate',  why: ['Most affordable major metro in India', 'Rich cultural life — arts, food, literature', 'Lower stress and a slower, more humane pace of life'] },
  coc:  { name: 'Kochi',       baseCost: 120000, match: 80, schools: 'CBSE / ICSE / IB',  jobs: 'Good',       matchTag: 'Smart city',    alt: 'Bangalore',  costRange: '₹95K–1.5L/mo',  airQ: 'Good',     traffic: 'Low',        nri: 'Very High', why: ['Highest NRI returnee density — massive returning community', 'Smart city infrastructure, modern metro connectivity', 'Excellent healthcare, high literacy, relaxed coastal lifestyle'] },
  vjw:  { name: 'Vijayawada',  baseCost: 95000,  match: 78, schools: 'CBSE / ICSE',       jobs: 'Moderate',   matchTag: 'Affordable',    alt: 'Hyderabad',  costRange: '₹75K–1.2L/mo',  airQ: 'Good',     traffic: 'Low',        nri: 'Moderate',  why: ['Most affordable option with modern amenities', 'Fast-developing city with good connectivity to Hyd', 'Strong Telugu community and familiar culture'] },
  vzg:  { name: 'Vizag',       baseCost: 85000,  match: 75, schools: 'CBSE',              jobs: 'Moderate',   matchTag: 'Coastal gem',   alt: 'Hyderabad',  costRange: '₹65K–1.1L/mo',  airQ: 'Good',     traffic: 'Low',        nri: 'Low',       why: ['Beautiful coastal city with a beach lifestyle', 'Lowest cost of living among all metros listed', 'Clean air, good quality of life, growing IT sector'] },
  open: { name: 'Hyderabad',   baseCost: 180000, match: 88, schools: 'IB / IGCSE / CBSE', jobs: 'Excellent',  matchTag: 'Recommended',   alt: 'Pune',       costRange: '₹1.6–2.2L/mo', airQ: 'Moderate', traffic: 'Moderate',   nri: 'Very High', why: ['Best default city for most NRI profiles', 'Largest returning NRI community in India', 'Strong tech jobs + IB schools + more affordable than Bangalore'] },
}

const STEPS = [
  {
    key: 'country', num: 1, q: 'Where are you currently based?', hint: 'Determines RNOR eligibility & tax rules.',
    opts: [{ k: 'usa', label: 'United States', sub: 'H1-B / Green Card' }, { k: 'uk', label: 'United Kingdom', sub: 'UK residents' }, { k: 'uae', label: 'UAE / Middle East', sub: 'Tax-free base' }, { k: 'canada', label: 'Canada', sub: 'Canadian residents' }, { k: 'other', label: 'Other country', sub: 'Rest of the world' }],
  },
  {
    key: 'income', num: 2, q: 'What is your monthly income?', hint: 'Used to estimate India purchasing power.',
    opts: [{ k: 'l50', label: 'Under $5,000/mo', sub: '~₹4L/mo' }, { k: 'm100', label: '$5,000–$10,000/mo', sub: '~₹4–8L/mo' }, { k: 'm200', label: '$10,000–$20,000/mo', sub: '~₹8–17L/mo' }, { k: 'h200', label: 'Over $20,000/mo', sub: '~₹17L+/mo' }],
  },
  {
    key: 'intent', num: 3, q: 'What is your return intent?', hint: 'Shapes the tone and urgency of your plan.',
    opts: [{ k: 'permanent', label: 'Permanently moving back', sub: 'Final decision made' }, { k: 'trial', label: 'Want to try first', sub: '6–12 month test run' }, { k: 'undecided', label: 'Still undecided', sub: 'Weighing options' }, { k: 'remote', label: 'Remote work from India', sub: 'Keep current job' }],
  },
  {
    key: 'timeline', num: 4, q: 'When are you planning to move?', hint: 'Affects your RNOR tax window.',
    opts: [{ k: 'asap', label: 'Within 6 months', sub: 'Urgent — act now' }, { k: 'year', label: '6–12 months', sub: 'Good runway' }, { k: 'two', label: '1–2 years', sub: 'Comfortable pace' }, { k: 'explore', label: 'Just exploring', sub: 'No rush yet' }],
  },
  {
    key: 'family', num: 5, q: 'Who is making the move?', hint: 'Affects cost and school planning.',
    opts: [{ k: 'solo', label: 'Just me', sub: 'Solo move' }, { k: 'couple', label: 'Me & spouse', sub: 'No kids' }, { k: 'kids', label: 'Family with kids', sub: 'School planning needed' }, { k: 'parents', label: 'With elderly parents', sub: 'Healthcare priority' }],
  },
  {
    key: 'city', num: 6, q: 'Which city are you considering?', hint: 'Real cost & match data shown.', dropdown: true,
    opts: [{ k: 'hyd', label: 'Hyderabad' }, { k: 'blr', label: 'Bangalore' }, { k: 'mum', label: 'Mumbai' }, { k: 'del', label: 'Delhi / NCR' }, { k: 'pun', label: 'Pune' }, { k: 'che', label: 'Chennai' }, { k: 'kol', label: 'Kolkata' }, { k: 'coc', label: 'Kochi' }, { k: 'vjw', label: 'Vijayawada' }, { k: 'vzg', label: 'Vizag' }, { k: 'open', label: 'Not sure yet' }],
  },
]

const INCOME_MULT: Record<string, number> = { l50: 0.8, m100: 1.0, m200: 1.2, h200: 1.5 }
const CURR_COST: Record<string, string> = { l50: '~$4K/mo', m100: '~$7.5K/mo', m200: '~$15K/mo', h200: '$20K+/mo' }
const SAVE_PCT: Record<string, string> = { l50: '~50%', m100: '~60%', m200: '~65%', h200: '~70%' }
const RNOR_SAVE: Record<string, string> = { l50: '₹10–18L', m100: '₹18–28L', m200: '₹28–40L', h200: '₹40–60L' }
const COUNTRY_NOTE: Record<string, string> = {
  usa: 'Your 401(k) and RSU vesting schedule need careful planning before you leave.',
  uk: 'UK domicile rules may still expose you to UK tax after leaving. Get a cross-border tax opinion.',
  uae: 'Your UAE income is already tax-free — your RNOR window in India is a pure bonus on top of that.',
  canada: 'Canada imposes a deemed disposition tax on exit. Factor in departure tax when calculating take-home.',
  other: "Check your home country's exit tax rules before leaving.",
}
const INTENT_INTRO: Record<string, string> = {
  permanent: "You've made the decision. Here's how to execute it without leaving money on the table.",
  trial: "Smart approach — a trial run de-risks everything. Here's how to structure it financially.",
  undecided: "You're doing the right thing by researching first. Here's what your move would actually look like.",
  remote: "Best of both worlds. A US salary in India is a superpower — here's how to maximise it.",
}

type PlannerState = {
  country: string; income: string; intent: string; timeline: string; family: string; city: string;
}

function fmtCost(n: number): string {
  return n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L/mo' : '₹' + Math.round(n / 1000) + 'K/mo'
}

function compute(S: PlannerState) {
  const city = CITY_DATA[S.city] || CITY_DATA['hyd']
  const mult = INCOME_MULT[S.income] || 1
  const cost = Math.round(city.baseCost * mult / 5000) * 5000
  let score = 70
  if (S.intent === 'permanent') score += 8
  if (S.intent === 'remote') score += 5
  if (S.intent === 'undecided') score -= 6
  if (S.timeline === 'two') score += 6
  if (S.timeline === 'asap') score -= 4
  if (S.income === 'h200' || S.income === 'm200') score += 4
  score = Math.min(97, Math.max(48, score))
  const readyColor = score >= 85 ? '#138808' : score >= 70 ? '#FF9933' : '#E24B4A'
  const readyLabel = score >= 85 ? 'Well positioned' : score >= 70 ? 'On track' : score >= 60 ? 'Almost ready' : 'Needs planning'
  const pctile = S.timeline === 'asap' ? 41 : S.timeline === 'year' ? 63 : S.timeline === 'two' ? 78 : 52
  const currCost = CURR_COST[S.income] || '~$7.5K/mo'
  const savePct = SAVE_PCT[S.income] || '~60%'
  const rnorSave = RNOR_SAVE[S.income] || '₹18–28L'
  const countryNote = COUNTRY_NOTE[S.country] || COUNTRY_NOTE['other']
  const intro = INTENT_INTRO[S.intent] || INTENT_INTRO['undecided']
  const countryName = ({ usa: 'USA', uk: 'UK', uae: 'UAE', canada: 'Canada', other: 'abroad' } as Record<string, string>)[S.country] || 'abroad'

  const risk = S.timeline === 'asap'
    ? `RNOR paperwork window is tight — missing it costs you ${rnorSave}.`
    : S.family === 'kids'
    ? `School admissions in ${city.name} fill 12–18 months ahead — start applications immediately.`
    : S.intent === 'undecided'
    ? 'Indecision risk: each month of delay erodes your RNOR window.'
    : 'NRE/NRO account transition must happen before you leave — not after.'

  const actions = S.intent === 'permanent' || S.timeline === 'asap'
    ? ['Open NRE account now and begin transferring liquid assets — tax-free in India.', 'File Form 12A within 30 days of arriving to lock your RNOR status.', S.family === 'kids' ? `Begin school applications in ${city.name} immediately — admissions close early.` : `Secure a 6-month rental in ${city.name} before landing.`]
    : S.intent === 'trial'
    ? ['Plan a 3-month scouting trip first — rent short-term before committing.', 'Keep your current job / remote arrangement during the trial period.', 'Open NRE account now to start the tax clock and transfer savings.']
    : S.intent === 'remote'
    ? ['Negotiate a remote-from-India arrangement with your employer before leaving.', `Open NRE account — your foreign salary stays tax-free during RNOR window (${rnorSave}).`, `Budget for co-working space and reliable internet in ${city.name}.`]
    : [`Research ${city.name} neighbourhoods on a scouting trip.`, 'Speak to 2–3 returned NRIs in your profession before deciding.', 'Calculate your exact RNOR window — it starts the day you land.']

  return { city, cost: fmtCost(cost), score, readyColor, readyLabel, pctile, currCost, savePct, rnorSave, countryNote, intro, countryName, risk, actions }
}

function PlannerWidget() {
  const [S, setS] = useState<PlannerState>({ country: '', income: '', intent: '', timeline: '', family: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPlanner, setShowPlanner] = useState(false)

  const KEYS: (keyof PlannerState)[] = ['country', 'income', 'intent', 'timeline', 'family', 'city']
  const answered = KEYS.filter(k => !!S[k]).length

  function pick(key: keyof PlannerState, val: string) {
    const next = { ...S, [key]: val }
    setS(next)
    const newAnswered = KEYS.filter(k => !!next[k]).length
    if (newAnswered === 6) {
      setLoading(true)
      setTimeout(() => { setLoading(false); setDone(true) }, 1300)
    }
  }

  const inputStyle: React.CSSProperties = {
    padding: '9px 11px', borderRadius: '12px', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', textAlign: 'left',
    transition: 'all 0.15s', width: '100%', border: '1px solid var(--border)',
    background: 'var(--white)',
  }

  if (!showPlanner) {
    return (
      <div style={{
        background: 'var(--white)', border: '1px solid var(--border)',
        borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
      }}>
        {/* SAMPLE RESULT CARD */}
        <div style={{ background: '#0F0D08', padding: '1.5rem 2rem', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Sample snapshot</div>
              <div style={{ color: '#fff', fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Hyderabad · Family with kids · Moving in ~1 year</div>
            </div>
            <div style={{ background: 'rgba(19,136,8,0.2)', color: '#4ABA48', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px', border: '0.5px solid rgba(19,136,8,0.4)' }}>Plan ready</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)' }}>
          {[
            { label: 'Tax saving', val: '₹18–28L', color: '#FF9933' },
            { label: 'Monthly cost', val: '₹1.8L/mo', color: 'var(--ink)' },
            { label: 'City match', val: '94%', color: '#138808' },
            { label: 'Readiness', val: '80/100', color: 'var(--ink)' },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '1rem 1.25rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { bg: '#FFF3E6', color: '#CC7A00', icon: '!', text: 'Good runway — begin NRE/NRO account transition within 60 days.' },
            { bg: '#E8F5E8', color: '#138808', icon: '✓', text: 'Hyderabad cost: ₹1.8L/mo — 25% lower than Bangalore.' },
            { bg: '#E8E8FF', color: '#000080', icon: 'i', text: 'IB & IGCSE schools available — apply 12–18 months early.' },
          ].map(r => (
            <div key={r.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: r.bg, color: r.color, fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{r.icon}</div>
              <span>{r.text}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '1.25rem 1.5rem', background: 'var(--india-white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>This is a sample. Yours takes 6 questions.</div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>Personalised to your timeline, family, and city — free, no signup.</div>
          </div>
          <button
            onClick={() => setShowPlanner(true)}
            style={{ background: '#FF9933', color: '#fff', border: 'none', borderRadius: '100px', padding: '0.85rem 2rem', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
          >
            Get my personalised plan →
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '24px', padding: '3rem', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 1.25rem' }} />
        <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>Generating your plan...</div>
        <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Personalising based on your profile</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (done) {
    const r = compute(S)
    return (
      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
        <div style={{ background: '#1A1208', padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '5px' }}>Your personalised plan</div>
              <div style={{ color: '#fff', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '420px' }}>{r.intro}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '8px 12px', textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 500, color: r.readyColor, lineHeight: 1 }}>{r.score}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>/ 100</div>
              <div style={{ fontSize: '10px', color: r.readyColor, marginTop: '3px', fontWeight: 500 }}>{r.readyLabel}</div>
            </div>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: r.readyColor, borderRadius: '4px', width: r.score + '%' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          {[
            { label: 'Tax saving', val: r.rnorSave, color: '#FF9933' },
            { label: 'India cost', val: r.cost, color: 'var(--ink)' },
            { label: 'City match', val: r.city.match + '%', color: '#138808' },
            { label: 'You vs peers', val: 'Top ' + (100 - r.pctile) + '%', color: 'var(--ink)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--india-white)', borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '9px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px' }}>{s.label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ background: '#FCEBEB', border: '0.5px solid #F7C1C1', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#A32D2D', marginBottom: '3px' }}>Now ({r.countryName})</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: '#791F1F' }}>{r.currCost}</div>
            </div>
            <div style={{ fontSize: '18px', color: 'var(--ink-soft)', textAlign: 'center' }}>→</div>
            <div style={{ background: '#EAF3DE', border: '0.5px solid #C0DD97', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#3B6D11', marginBottom: '3px' }}>India ({r.city.name})</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, color: '#27500A' }}>{r.cost}</div>
            </div>
          </div>
          <div style={{ background: 'rgba(255,153,51,0.08)', border: '0.5px solid rgba(255,153,51,0.25)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', fontSize: '13px', color: '#854F0B' }}>
            You save roughly <strong>{r.savePct}</strong> on monthly living costs
          </div>
        </div>
        <div style={{ padding: '1rem', background: '#FFF3E6', borderBottom: '1px solid var(--border)', fontSize: '13px', color: '#633806', lineHeight: 1.55, display: 'flex', gap: '8px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#FF9933', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>!</div>
          <span>{r.countryNote}</span>
        </div>
        <div style={{ padding: '1rem', background: '#FCEBEB', borderBottom: '1px solid var(--border)', fontSize: '13px', color: '#791F1F', lineHeight: 1.55, display: 'flex', gap: '8px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#E24B4A', color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>!</div>
          <span><strong>Top risk: </strong>{r.risk}</span>
        </div>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.75rem' }}>Your 3-step action plan</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {r.actions.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FF9933', color: '#fff', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--india-white)', fontSize: '12px', color: 'var(--ink-muted)', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
          You are more prepared than <strong style={{ color: 'var(--ink)' }}>{r.pctile}% of NRIs</strong> at your stage
        </div>
        <div style={{ padding: '1rem', display: 'flex', gap: '8px' }}>
          <Link href="/contact" style={{ flex: 2, padding: '11px', borderRadius: '100px', background: '#FF9933', color: '#fff', border: 'none', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>
            Unlock full plan →
          </Link>
          <button onClick={() => { setS({ country: '', income: '', intent: '', timeline: '', family: '', city: '' }); setDone(false); setLoading(false) }} style={{ flex: 1, padding: '11px', borderRadius: '100px', background: 'transparent', color: 'var(--ink-muted)', border: '1px solid var(--border)', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
            Start over
          </button>
        </div>
      </div>
    )
  }

  const currentStep = STEPS[answered]

  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>Answer 6 questions — get your intelligent plan instantly</div>
        <button onClick={() => setShowPlanner(false)} style={{ background: 'none', border: '0.5px solid var(--border)', borderRadius: '100px', padding: '5px 14px', fontSize: '12px', color: 'var(--ink-muted)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>← Back</button>
      </div>

      {/* Step circles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
        {STEPS.map((s, i) => {
          const done2 = !!S[s.key as keyof PlannerState]
          const active = i === answered
          const bg = done2 ? '#138808' : active ? '#FF9933' : 'rgba(26,18,8,0.1)'
          const col = (done2 || active) ? '#fff' : 'rgba(26,18,8,0.3)'
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 5 ? '1' : 'none' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: bg, color: col, fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {done2 ? '✓' : i + 1}
              </div>
              {i < 5 && <div style={{ flex: 1, height: '2px', background: done2 ? '#138808' : 'rgba(26,18,8,0.08)', borderRadius: '1px', margin: '0 4px' }} />}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: 'rgba(26,18,8,0.08)', borderRadius: '100px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ height: '100%', background: '#FF9933', borderRadius: '100px', width: Math.round((answered / 6) * 100) + '%', transition: 'width 0.4s ease' }} />
      </div>

      {/* Current question */}
      {currentStep && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            Step {answered + 1} of 6 — {currentStep.hint}
          </div>
          <div style={{ fontSize: '17px', fontWeight: 500, color: 'var(--ink)', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>{currentStep.q}</div>

          {(currentStep as { dropdown?: boolean }).dropdown ? (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '0.75rem' }}>
                {currentStep.opts.map(opt => {
                  const sel = S.city === opt.k
                  const cd = CITY_DATA[opt.k]
                  return (
                    <button
                      key={opt.k}
                      onClick={() => pick('city', opt.k)}
                      style={{
                        ...inputStyle,
                        border: sel ? '2px solid #138808' : '1px solid var(--border)',
                        background: sel ? 'rgba(19,136,8,0.06)' : 'var(--white)',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>{opt.label}</div>
                      {cd && <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>{cd.costRange}</div>}
                    </button>
                  )
                })}
              </div>
              {S.city && CITY_DATA[S.city] && (
                <div style={{ padding: '12px 14px', background: 'var(--india-white)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{CITY_DATA[S.city].name}</span>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: '#138808', background: 'rgba(19,136,8,0.1)', borderRadius: '100px', padding: '2px 8px' }}>{CITY_DATA[S.city].matchTag}</span>
                    <span style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>{CITY_DATA[S.city].match}% match</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    {[
                      { label: 'Cost', val: CITY_DATA[S.city].costRange },
                      { label: 'Jobs', val: CITY_DATA[S.city].jobs },
                      { label: 'NRI', val: CITY_DATA[S.city].nri.replace('Very High', 'V.High') },
                      { label: 'AQI', val: CITY_DATA[S.city].airQ, color: CITY_DATA[S.city].airQ === 'Good' ? '#138808' : CITY_DATA[S.city].airQ === 'Moderate' ? '#FF9933' : '#E24B4A' },
                    ].map(c => (
                      <div key={c.label} style={{ background: 'var(--white)', borderRadius: '8px', padding: '5px 7px', border: '0.5px solid var(--border)' }}>
                        <div style={{ fontSize: '8px', color: 'var(--ink-soft)', textTransform: 'uppercase', marginBottom: '2px' }}>{c.label}</div>
                        <div style={{ fontSize: '11px', fontWeight: 500, color: c.color || 'var(--ink)' }}>{c.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.45 }}>{CITY_DATA[S.city].why[0]}</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              {currentStep.opts.map(opt => {
                const sel = S[currentStep.key as keyof PlannerState] === opt.k
                return (
                  <button
                    key={opt.k}
                    onClick={() => pick(currentStep.key as keyof PlannerState, opt.k)}
                    style={{
                      ...inputStyle,
                      border: sel ? '2px solid #FF9933' : '1px solid var(--border)',
                      background: sel ? 'rgba(255,153,51,0.06)' : 'var(--white)',
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '3px' }}>{opt.label}</div>
                    {'sub' in opt && <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{(opt as { k: string; label: string; sub: string }).sub}</div>}
                  </button>
                )
              })}
            </div>
          )}

          {/* Answered chips */}
          {answered > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '0.75rem', borderTop: '0.5px solid var(--border)' }}>
              {STEPS.slice(0, answered).map(ps => {
                const val = S[ps.key as keyof PlannerState]
                const opt = ps.opts.find(o => o.k === val)
                return opt ? (
                  <div key={ps.key} style={{ fontSize: '11px', color: 'var(--ink-muted)', background: 'var(--india-white)', border: '0.5px solid var(--border)', borderRadius: '100px', padding: '3px 10px' }}>
                    {ps.q.split(' ').slice(0, 3).join(' ')}… <strong style={{ color: 'var(--ink)' }}>{opt.label}</strong>
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Tools() {
  const { shouldBlock } = useProtectedRoute()
  if (shouldBlock) return null

  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'var(--india-white)', padding: '5rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          
          <h1 className="section-title">Tools built for every decision you need to make</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Every feature exists because a real NRI needed it and couldn&apos;t find it anywhere else.
            Starting with the decisions that cost the most when you get them wrong.
          </p>
        </div>
      </section>



      {/* WHAT'S INSIDE */}
      <section style={{ padding: '5rem 2rem', background: 'var(--white)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">Free tools — live now</div>
            
            
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {[
              { href: '/planner', icon: '🗺️', color: '#FF9933', bg: '#FFF3E6', title: 'Return Readiness Check', desc: 'Answer 12 questions and get your personalised readiness score, top risks, financial snapshot, and a 3-phase action plan.', outcome: 'Know exactly where you stand' },
              { href: '/rnor', icon: '📊', color: '#138808', bg: '#E8F5E8', title: 'RNOR Tax Optimizer', desc: 'Calculate your exact tax-free window, RSU vesting strategy, 401(k) plan, and every form you need to file with deadlines.', outcome: 'Save ₹18–60L in year 1' },
              { href: '/city', icon: '🏙️', color: '#7C5CBF', bg: '#F0EEFF', title: 'City Match + Cost of Living', desc: 'Score 5 cities across jobs, schools, lifestyle, air quality, and NRI community — personalised to your family and income.', outcome: 'Pick the right city with data' },
              { href: '/schools', icon: '🎓', color: '#000080', bg: '#E8E8FF', title: 'Schools Comparison Tool', desc: '17 real schools across 5 cities with actual fees, boards, mid-year entry policy, US curriculum bridge programs, and contact details.', outcome: "Secure your child's school early" },
              { href: '/housing', icon: '🏠', color: '#D4695A', bg: '#FCEBEB', title: 'Rental & Housing Finder', desc: 'NRI-curated neighbourhoods with rent ranges, safety ratings, school proximity, serviced apartment options, and agent tips.', outcome: 'Have a home before you arrive' },
              { href: '/healthcare', icon: '🏥', color: '#1D9E75', bg: '#E8F5F0', title: 'Healthcare & Insurance Guide', desc: 'Top hospitals by city (JCI accredited), 6 insurance plans with premiums, and how to bridge the gap between US and India coverage.', outcome: 'Never be without coverage' },
              { href: '/citylife', icon: '☕', color: '#FF9933', bg: '#FFF3E6', title: 'City Life Guide', desc: 'Where to eat, buy international groceries, work out, co-work, and find your NRI community — curated by returnees, for returnees.', outcome: 'Feel at home from day one' },
              { href: '/jobs', icon: '💼', color: '#138808', bg: '#E8F5E8', title: 'Job & Career Guide', desc: 'India salary benchmarks vs US, 15 companies hiring NRI returnees, remote work negotiation script, and a 90-day job search plan.', outcome: 'Land the right role' },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.5rem', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = tool.color; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: tool.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{tool.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--ink)', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>{tool.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', lineHeight: 1.65, flex: 1, margin: 0 }}>{tool.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '0.5px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', color: tool.color, fontWeight: 500 }}>✓ {tool.outcome}</span>
                  <span style={{ fontSize: '13px', color: tool.color, fontWeight: 500 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>




      {/* CTA */}

    </>
  )
}
