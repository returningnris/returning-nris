'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Answers = {
  country: string; savings: string; yearsAbroad: string; hasKids: string
  kidsAge: string; hasJob: string; city: string
  timeline: string; knowsRNOR: string; housing: string
}

type UserDetails = { firstName: string; lastName: string; age: string; gender: string; email: string }
export type ScoreBreakdown = { financial: number; lifeComplexity: number; career: number; planning: number; total: number }
type RiskItem = { level: 'high' | 'medium' | 'low'; title: string; detail: string; action: string }
export type FinancialSnapshot = { monthlyCost: string; runway: string; runwayMonths: number; rnorSaving: string; savingsLabel: string }
export type Rec = { verdict: string; icon: string; color: string; bg: string; border: string; actions: string[]; timeframe: string }
type Result = { score: ScoreBreakdown; status: string; statusColor: string; statusBg: string; headline: string; subheadline: string; risks: RiskItem[]; financial: FinancialSnapshot; cityName: string; recommendation: Rec }

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────

const T = {
  bg: '#F8F5F0',
  white: '#FFFFFF',
  ink: '#1A1208',
  muted: '#6B5E50',
  soft: '#B5A898',
  border: '#E5E1DA',
  saffron: '#FF9933',
  saffronLight: '#FFF3E6',
  saffronBorder: 'rgba(255,153,51,0.25)',
  green: '#138808',
  greenLight: '#E8F5E8',
  navy: '#000080',
  heroGrad: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const CITY_BASE: Record<string, number> = { Hyderabad: 180000, Bangalore: 240000, Pune: 160000, Chennai: 170000, Mumbai: 280000, Other: 185000, undecided: 185000 }
export const SAVINGS_USD: Record<string, number> = { '200000+': 200000, '100000': 150000, '50000': 75000, 'under50': 35000 }

// ─── QUESTIONS ────────────────────────────────────────────────────────────────

export const QUESTIONS: {
  key: keyof Answers; section: string; q: string; hint: string
  opts: { k: string; label: string }[]
  skipIf?: { key: keyof Answers; value: string }
}[] = [
  { key: 'country', section: 'Where You Are', q: 'Where are you currently based?', hint: 'Affects RNOR eligibility and tax rules', opts: [{ k: 'USA', label: 'United States' }, { k: 'UK', label: 'United Kingdom' }, { k: 'UAE', label: 'UAE / Middle East' }, { k: 'Canada', label: 'Canada' }, { k: 'Other', label: 'Other country' }] },
  { key: 'yearsAbroad', section: 'Where You Are', q: 'Years lived abroad?', hint: '7+ years qualifies for the full RNOR tax window', opts: [{ k: '10+', label: '10+ years' }, { k: '7', label: '7–10 years' }, { k: '5', label: '5–7 years' }, { k: '3', label: '3–5 years' }, { k: 'under3', label: 'Under 3 years' }] },
  { key: 'savings', section: 'Finances', q: 'Total liquid savings?', hint: 'Your financial buffer — the #1 factor in return readiness', opts: [{ k: '200000+', label: '$200,000 or more' }, { k: '100000', label: '$100,000 – $200,000' }, { k: '50000', label: '$50,000 – $100,000' }, { k: 'under50', label: 'Under $50,000' }] },
  {
    key: 'hasJob', section: 'Career',
    q: 'Career situation after moving to India?', hint: 'The single biggest factor in your readiness score',
    opts: [
      { k: 'remote_us', label: 'Keeping remote US / abroad job — same salary' },
      { k: 'own_business', label: 'Running my own business — location independent' },
      { k: 'india_job', label: 'India job confirmed — offer letter in hand' },
      { k: 'searching', label: 'Actively job hunting in India — no offer yet' },
      { k: 'no', label: 'No income plan yet — will figure it out after moving' },
    ],
  },
  { key: 'hasKids', section: 'Family', q: 'Do you have children?', hint: 'School transitions are a top reason moves get delayed', opts: [{ k: 'no', label: 'No children' }, { k: 'yes', label: 'Yes, I have kids' }] },
  { key: 'kidsAge', section: 'Family', q: "Children's age range?", hint: 'Teenagers face the hardest school transitions', opts: [{ k: 'under5', label: 'Under 5 years' }, { k: '5to12', label: '5–12 years' }, { k: 'teen', label: '13–17 years' }, { k: 'adult', label: '18+ (adults, independent)' }], skipIf: { key: 'hasKids', value: 'no' } },
  { key: 'city', section: "Where You're Going", q: 'Target city in India?', hint: 'City directly affects cost of living and financial runway score', opts: [{ k: 'Hyderabad', label: 'Hyderabad — ₹1.6–2.2L/mo' }, { k: 'Bangalore', label: 'Bangalore — ₹2.2–3.2L/mo' }, { k: 'Pune', label: 'Pune — ₹1.4–2.0L/mo' }, { k: 'Chennai', label: 'Chennai — ₹1.4–2.2L/mo' }, { k: 'Mumbai', label: 'Mumbai — ₹2.5–4.0L/mo' }, { k: 'Other', label: 'Another city (Kochi, Delhi, Vizag…)' }, { k: 'undecided', label: 'Not decided yet' }] },
  { key: 'housing', section: "Where You're Going", q: 'Housing sorted in India?', hint: 'First 90 days are hardest without a home arranged', opts: [{ k: 'owned', label: 'Own a home — ready to move in' }, { k: 'arranged', label: 'Rental arranged remotely' }, { k: 'searching', label: 'Actively searching' }, { k: 'no', label: 'Not started yet' }] },
  { key: 'timeline', section: 'Timeline', q: 'When are you planning to move?', hint: 'Closer timelines need more urgent action', opts: [{ k: 'within6', label: 'Within 6 months' }, { k: '6to12', label: '6–12 months' }, { k: '1to2', label: '1–2 years' }, { k: 'exploring', label: 'Just exploring — no timeline yet' }] },
  { key: 'knowsRNOR', section: 'Tax Planning', q: 'Aware of RNOR tax status?', hint: 'RNOR can save ₹18–60L — worth planning before you move', opts: [{ k: 'yes_filed', label: 'Yes — already planned with a CA specialist' }, { k: 'yes_aware', label: 'Yes — aware but not planned yet' }, { k: 'partial', label: 'Heard of it, not sure what it means' }, { k: 'no', label: 'No — first time hearing this' }] },
]

const SECTION_COLORS: Record<string, string> = {
  'Where You Are': T.saffron, 'Finances': T.green, 'Career': T.navy,
  'Family': '#7C5CBF', "Where You're Going": '#E0531A',
  'Timeline': T.saffron, 'Tax Planning': '#7C5CBF',
}

// ─── SCORING ─────────────────────────────────────────────────────────────────

export function calcRunwayMonths(savings: string, city: string): number {
  const monthly = CITY_BASE[city] || 185000
  return Math.round((SAVINGS_USD[savings] || 75000) * 83 / monthly)
}

export function computeScore(A: Answers): ScoreBreakdown {
  let financial = 0, life = 0, career = 0, planning = 0
  if (A.savings === '200000+') financial += 20; else if (A.savings === '100000') financial += 15; else if (A.savings === '50000') financial += 10; else financial += 5
  if (A.yearsAbroad === '10+' || A.yearsAbroad === '7') financial += 10; else if (A.yearsAbroad === '5') financial += 7; else if (A.yearsAbroad === '3') financial += 5; else financial += 2
  if (A.country === 'USA' || A.country === 'UK') financial += 5; else if (A.country === 'UAE') financial += 4; else financial += 3
  const runway = calcRunwayMonths(A.savings, A.city)
  if (runway >= 30) financial += 5; else if (runway >= 24) financial += 4; else if (runway >= 18) financial += 3; else if (runway >= 12) financial += 2; else financial += 1
  if (A.hasKids === 'no') life += 15; else life += 8
  if (A.hasKids === 'no') life += 7; else if (A.kidsAge === 'under5') life += 6; else if (A.kidsAge === '5to12') life += 4; else if (A.kidsAge === 'adult') life += 6; else life += 2
  if (A.housing === 'owned') life += 3; else if (A.housing === 'arranged') life += 2
  if (A.hasJob === 'remote_us') career = 20; else if (A.hasJob === 'own_business') career = 17; else if (A.hasJob === 'india_job') career = 15; else if (A.hasJob === 'searching') career = 8; else career = 4
  if (A.city && A.city !== 'undecided') planning += 6; else planning += 2
  if (A.timeline === 'within6') planning += 6; else if (A.timeline === '6to12') planning += 5; else if (A.timeline === '1to2') planning += 4; else planning += 2
  if (A.knowsRNOR === 'yes_filed') planning += 8; else if (A.knowsRNOR === 'yes_aware') planning += 5; else if (A.knowsRNOR === 'partial') planning += 3; else planning += 1
  return { financial, lifeComplexity: life, career, planning, total: Math.min(100, financial + life + career + planning) }
}

function computeRisks(A: Answers): RiskItem[] {
  const risks: RiskItem[] = []
  if (A.hasJob === 'no' || A.hasJob === 'searching') risks.push({ level: 'high', title: 'No income secured in India', detail: 'Moving without confirmed income creates pressure within 3–6 months. The #1 reason NRIs return.', action: A.hasJob === 'searching' ? 'Convert job search to confirmed offer before moving.' : 'Secure India job or arrange remote work in writing before moving.' })
  if (A.savings === 'under50') risks.push({ level: 'high', title: 'Insufficient financial buffer', detail: 'Under $50K gives less than 12 months runway. Career transitions take longer than expected.', action: 'Build to $75K–100K minimum. Consider delaying 6–12 months.' })
  if (A.hasKids === 'yes' && A.kidsAge === 'teen') risks.push({ level: 'high', title: 'Teenage school transition is high-risk', detail: 'Moving teenagers mid-schooling is the #1 reason families delay or reverse their move.', action: 'Time move around board exams. Research IGCSE schools that accept transfers.' })
  if (A.housing === 'no') risks.push({ level: 'medium', title: 'Housing not arranged', detail: 'Arriving without confirmed housing adds major stress in the first 90 days.', action: 'Book a serviced apartment for 2–3 months as a bridge while you search.' })
  if (A.city === 'undecided') risks.push({ level: 'medium', title: 'Target city not decided', detail: 'Without a city, you cannot start school applications, housing, or job searches.', action: 'Use the City Match tool to narrow to 2 cities, then do a scouting trip.' })
  if (A.knowsRNOR === 'no') risks.push({ level: 'low', title: 'RNOR tax planning opportunity', detail: `RNOR planning could save ₹18–40L in year 1. Not a move blocker — but sort before you leave.`, action: 'Book a session with an NRI CA. Use the RNOR Calculator tool.' })
  return risks.sort((a, b) => ['high', 'medium', 'low'].indexOf(a.level) - ['high', 'medium', 'low'].indexOf(b.level)).slice(0, 3)
}

export function computeFinancial(A: Answers): FinancialSnapshot {
  const monthly = CITY_BASE[A.city] || 185000
  const fmt = (n: number) => n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L/mo' : '₹' + Math.round(n / 1000) + 'K/mo'
  const runwayMonths = calcRunwayMonths(A.savings, A.city)
  const runway = runwayMonths >= 12 ? Math.floor(runwayMonths / 12) + ' yr' + (runwayMonths % 12 > 0 ? ' ' + runwayMonths % 12 + ' mo' : '') : runwayMonths + ' months'
  return { monthlyCost: fmt(monthly), runway, runwayMonths, rnorSaving: '₹18–40L', savingsLabel: ({ '200000+': '$200K+', '100000': '~$150K', '50000': '~$75K', 'under50': '<$50K' } as Record<string, string>)[A.savings] || '–' }
}

export function computeRecommendation(A: Answers, score: number): Rec {
  const gaps: string[] = []
  if (A.hasJob === 'no' || A.hasJob === 'searching') gaps.push('no confirmed income')
  if (A.savings === 'under50') gaps.push('low savings')
  if (A.hasKids === 'yes' && A.kidsAge === 'teen') gaps.push('teen school transition')
  if (score >= 80 && gaps.length === 0) return { verdict: 'Move as planned — you are financially and logistically ready.', icon: '✅', color: T.green, bg: T.greenLight, border: 'rgba(19,136,8,0.2)', timeframe: 'Proceed on your current timeline', actions: ['File Form 12A within 30 days of arriving — locks in your RNOR status', A.knowsRNOR !== 'yes_filed' ? 'Book NRI CA consultation to finalise your RNOR tax strategy' : 'Confirm NRE account transfers are scheduled', 'Lock in school admissions and housing before you land'] }
  if (gaps.length <= 1 || score >= 60) return { verdict: gaps.length > 0 ? `Move with preparation — close ${gaps.length} gap${gaps.length > 1 ? 's' : ''} before committing.` : 'Almost ready — a few things to sort first.', icon: '⚠️', color: '#CC7A00', bg: T.saffronLight, border: T.saffronBorder, timeframe: 'Target move in 6–12 months after addressing gaps', actions: [A.hasJob === 'no' || A.hasJob === 'searching' ? 'Secure income before moving — job offer or remote arrangement confirmed in writing' : 'Confirm your employment arrangement in writing before giving notice', A.housing === 'no' ? 'Arrange housing remotely — book a serviced apartment as a bridge' : 'Confirm housing start date aligns with your move date', A.knowsRNOR !== 'yes_filed' ? 'Book NRI CA consultation to protect your RNOR tax window before you leave' : 'Open NRE account and begin systematic savings transfers now'] }
  return { verdict: `Delay your move by 6–12 months — ${gaps.length} critical gap${gaps.length !== 1 ? 's' : ''} need closing first.`, icon: '⏸️', color: '#C0392B', bg: '#FCEBEB', border: 'rgba(192,57,43,0.2)', timeframe: 'Delay 6–12 months — strengthen your position first', actions: [A.savings === 'under50' ? 'Build savings to $75K–100K minimum — this is non-negotiable' : 'Protect savings — avoid large pre-move expenses', A.hasJob === 'no' ? 'Do not move without confirmed income — #1 reason NRIs return within 2 years' : 'Convert job search to a confirmed offer before leaving', 'Use the simulator below to find your fastest path to readiness'] }
}

export function computeResult(A: Answers): Result {
  const score = computeScore(A)
  const risks = computeRisks(A)
  const financial = computeFinancial(A)
  const recommendation = computeRecommendation(A, score.total)
  let status = '', statusColor = '', statusBg = '', headline = '', subheadline = ''
  if (recommendation.icon === '✅') { status = 'Ready to Return'; statusColor = T.green; statusBg = T.greenLight; headline = 'You are in a strong position to return.'; subheadline = 'Execute your plan — the foundation is solid.' }
  else if (recommendation.icon === '⚠️') { status = 'Moderately Ready'; statusColor = '#CC7A00'; statusBg = T.saffronLight; headline = 'On track, but key gaps need attention.'; subheadline = 'Address the risks below before committing to a move date.' }
  else { status = 'Not Ready Yet'; statusColor = '#C0392B'; statusBg = '#FCEBEB'; headline = 'Delaying will put you in a stronger position.'; subheadline = 'Use the next 6–12 months to close critical gaps.' }
  return { score, status, statusColor, statusBg, headline, subheadline, risks, financial, recommendation, cityName: A.city !== 'undecided' ? A.city : 'your target city' }
}

// ─── SELECT COMPONENT (light theme) ──────────────────────────────────────────

function QSelect({ value, onChange, opts, placeholder = 'Select an answer…' }: { value: string; onChange: (v: string) => void; opts: { k: string; label: string }[]; placeholder?: string }) {
  const hasValue = !!value
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 36px 11px 14px',
          background: hasValue ? T.saffronLight : T.white,
          border: `1.5px solid ${hasValue ? T.saffron : T.border}`,
          borderRadius: '10px',
          color: hasValue ? T.ink : T.soft,
          fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
          outline: 'none', appearance: 'none' as const, cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <option value="" disabled style={{ color: T.soft }}>{placeholder}</option>
        {opts.map(o => <option key={o.k} value={o.k} style={{ color: T.ink, background: '#fff' }}>{o.label}</option>)}
      </select>
      <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke={hasValue ? T.saffron : T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── SIMULATOR SECTION ────────────────────────────────────────────────────────

function SimulatorSection({ original, userEmail, userName }: { original: Answers; userEmail: string; userName: string }) {
  const [simAnswers, setSimAnswers] = useState<Answers>({ ...original })
  const [saveState, setSaveState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [emailInput, setEmailInput] = useState(userEmail)

  const origScore = computeScore(original)
  const simScore = computeScore(simAnswers)
  const delta = simScore.total - origScore.total
  const origFin = computeFinancial(original)
  const simFin = computeFinancial(simAnswers)
  const simRec = computeRecommendation(simAnswers, simScore.total)
  const origRec = computeRecommendation(original, origScore.total)

  const visibleQs = QUESTIONS.filter(q => !q.skipIf || simAnswers[q.skipIf.key] !== q.skipIf.value)
  const changedKeys = Object.keys(original).filter(k => simAnswers[k as keyof Answers] !== original[k as keyof Answers]) as (keyof Answers)[]
  const hasChanges = changedKeys.length > 0

  function setSimAnswer(key: keyof Answers, val: string) {
    setSimAnswers(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'hasKids' && val === 'no') next.kidsAge = original.kidsAge // reset to original if skipped
      return next
    })
    setSaveState('idle')
  }

  function reset() { setSimAnswers({ ...original }); setSaveState('idle') }

  async function sendEmail() {
    if (!emailInput.includes('@')) return
    setSaveState('sending')
    try {
      await fetch('/api/submit-planner', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userDetails: { firstName: userName, lastName: '', age: '', gender: '', email: emailInput }, answers: simAnswers, result: computeResult(simAnswers) }),
      })
    } catch (e) { console.error(e) }
    setTimeout(() => setSaveState('sent'), 800)
  }

  const SCORE_BARS = [
    { label: 'Financial', orig: origScore.financial, sim: simScore.financial, max: 40, color: T.saffron },
    { label: 'Life', orig: origScore.lifeComplexity, sim: simScore.lifeComplexity, max: 25, color: '#7C5CBF' },
    { label: 'Career', orig: origScore.career, sim: simScore.career, max: 20, color: T.green },
    { label: 'Planning', orig: origScore.planning, sim: simScore.planning, max: 20, color: T.navy },
  ]

  // group visible sim questions by section
  const simSections: { name: string; qs: typeof QUESTIONS }[] = []
  visibleQs.forEach(q => {
    const last = simSections[simSections.length - 1]
    if (!last || last.name !== q.section) simSections.push({ name: q.section, qs: [q] })
    else last.qs.push(q)
  })

  const statusColor = simScore.total >= 80 ? T.green : simScore.total >= 60 ? '#CC7A00' : '#C0392B'
  const statusLabel = simScore.total >= 80 ? 'Ready to Return' : simScore.total >= 60 ? 'Moderately Ready' : 'Not Ready Yet'
  const statusBg = simScore.total >= 80 ? T.greenLight : simScore.total >= 60 ? T.saffronLight : '#FCEBEB'

  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', overflow: 'hidden', marginBottom: '0.75rem' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${T.border}`, background: T.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: T.saffronLight, border: `1px solid ${T.saffronBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🔬</div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: T.ink }}>What-If Simulator</div>
            <div style={{ fontSize: '12px', color: T.muted }}>Adjust any answer below — score updates live. Save to get an updated report by email.</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>

        {/* LEFT: all questions */}
        <div style={{ padding: '1.5rem', borderRight: `1px solid ${T.border}` }}>
          {simSections.map(section => (
            <div key={section.name} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.6rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: SECTION_COLORS[section.name] || T.saffron }} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.name}</span>
              </div>
              <div style={{ background: T.bg, border: `0.5px solid ${T.border}`, borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {section.qs.map(q => {
                  const isChanged = simAnswers[q.key] !== original[q.key]
                  return (
                    <div key={q.key as string}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 500, color: isChanged ? T.ink : T.muted }}>{q.q}</label>
                        {isChanged && (
                          <span style={{ fontSize: '10px', fontWeight: 600, color: T.saffron, background: T.saffronLight, border: `0.5px solid ${T.saffronBorder}`, padding: '1px 7px', borderRadius: '100px', flexShrink: 0, marginLeft: '8px' }}>changed</span>
                        )}
                      </div>
                      <QSelect
                        value={simAnswers[q.key] || ''}
                        onChange={v => setSimAnswer(q.key, v)}
                        opts={q.opts}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* SAVE PANEL — shown as soon as changes exist */}
          {hasChanges && (
            <div style={{ border: `1.5px solid ${simRec.border}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '0.75rem' }}>

              {/* Updated recommendation */}
              <div style={{ background: simRec.bg, padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: simRec.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Updated Recommendation</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{simRec.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.95rem', color: simRec.color, lineHeight: 1.4, marginBottom: '2px' }}>{simRec.verdict}</div>
                    <div style={{ fontSize: '11px', color: simRec.color, opacity: 0.75 }}>→ {simRec.timeframe}</div>
                  </div>
                </div>
                <div style={{ borderTop: `0.5px solid ${simRec.border}`, paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {simRec.actions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                      <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: simRec.color, color: '#fff', fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                      <div style={{ fontSize: '11px', color: simRec.color, opacity: 0.85, lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email prompt */}
              <div style={{ background: T.white, padding: '1rem 1.25rem', borderTop: `1px solid ${T.border}` }}>
                {saveState === 'sent' ? (
                  <div style={{ fontSize: '13px', color: T.green, fontWeight: 500 }}>✓ Updated report sent to {emailInput}!</div>
                ) : saveState === 'sending' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: T.muted, fontSize: '13px' }}>
                    <div style={{ width: '14px', height: '14px', border: `2px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                    Sending to {emailInput}…
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: T.ink, marginBottom: '8px' }}>Send updated report to your email?</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                        placeholder="your@email.com"
                        style={{ flex: 1, minWidth: '160px', padding: '9px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '8px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '13px', outline: 'none' }}
                      />
                      <button onClick={sendEmail} style={{ background: T.saffron, color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(255,153,51,0.3)' }}>
                        Email me →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT: live score panel */}
        <div style={{ padding: '1.25rem', background: T.bg, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

          {/* Score card */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {hasChanges ? 'Simulated Score' : 'Your Score'}
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '3rem', color: statusColor, lineHeight: 1, marginBottom: '4px', transition: 'color 0.3s' }}>{simScore.total}</div>
            <div style={{ fontSize: '11px', color: T.soft, marginBottom: '8px' }}>out of 100</div>
            <div style={{ display: 'inline-block', background: statusBg, color: statusColor, fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px' }}>{statusLabel}</div>
            {hasChanges && delta !== 0 && (
              <div style={{ marginTop: '8px', fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: delta > 0 ? T.green : '#C0392B', transition: 'color 0.3s' }}>
                {delta > 0 ? `↑ +${delta} pts` : `↓ ${Math.abs(delta)} pts`}
              </div>
            )}
          </div>

          {/* Score breakdown */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '1.125rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Breakdown</div>
            {SCORE_BARS.map(s => {
              const d = s.sim - s.orig
              return (
                <div key={s.label} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: T.muted }}>{s.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>
                      {s.sim}/{s.max}
                      {d !== 0 && <span style={{ fontSize: '10px', color: d > 0 ? T.green : '#C0392B', marginLeft: '4px' }}>{d > 0 ? `+${d}` : d}</span>}
                    </span>
                  </div>
                  <div style={{ height: '5px', background: '#EDE9E0', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', height: '100%', background: s.color, borderRadius: '100px', opacity: 0.25, width: Math.round((s.orig / s.max) * 100) + '%' }} />
                    <div style={{ position: 'absolute', height: '100%', background: s.color, borderRadius: '100px', width: Math.round((s.sim / s.max) * 100) + '%', transition: 'width 0.35s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Financial snapshot */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '1.125rem' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Financials</div>
            {[
              { label: 'Monthly cost', val: simFin.monthlyCost, prev: origFin.monthlyCost, color: T.ink },
              { label: 'Runway', val: simFin.runway, prev: origFin.runway, color: simFin.runwayMonths >= 18 ? T.green : '#CC7A00' },
              { label: 'RNOR saving', val: simFin.rnorSaving, prev: origFin.rnorSaving, color: T.saffron },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', color: T.soft, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{f.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: f.color, lineHeight: 1.2 }}>{f.val}</div>
                {hasChanges && f.val !== f.prev && (
                  <div style={{ fontSize: '10px', color: T.soft, textDecoration: 'line-through' }}>{f.prev}</div>
                )}
              </div>
            ))}
          </div>

          {/* Changed fields */}
          {changedKeys.length > 0 && (
            <div style={{ background: T.saffronLight, border: `0.5px solid ${T.saffronBorder}`, borderRadius: '12px', padding: '0.875rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{changedKeys.length} change{changedKeys.length > 1 ? 's' : ''}</div>
              {changedKeys.map(k => {
                const q = QUESTIONS.find(x => x.key === k)
                const origLabel = q?.opts.find(o => o.k === original[k])?.label || original[k]
                const simLabel = q?.opts.find(o => o.k === simAnswers[k])?.label || simAnswers[k]
                return (
                  <div key={k as string} style={{ fontSize: '11px', color: T.muted, marginBottom: '4px', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 500, color: T.ink }}>{q?.q.split('?')[0]}:</span>{' '}
                    <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>{origLabel}</span>
                    {' → '}
                    <span style={{ color: '#CC7A00', fontWeight: 500 }}>{simLabel}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Planner() {
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails>({ firstName: '', lastName: '', age: '', gender: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  // Scroll to top of report when result is set
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [result])

  const visibleQs = QUESTIONS.filter(q => !q.skipIf || answers[q.skipIf.key] !== q.skipIf.value)
  const answered = visibleQs.filter(q => answers[q.key]).length
  const total = visibleQs.length
  const progress = Math.round((answered / total) * 100)
  const allAnswered = answered === total

  // Group visible questions by section
  const sections: { name: string; qs: typeof QUESTIONS }[] = []
  visibleQs.forEach(q => {
    const last = sections[sections.length - 1]
    if (!last || last.name !== q.section) sections.push({ name: q.section, qs: [q] })
    else last.qs.push(q)
  })

  function setAnswer(key: keyof Answers, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    if (!userDetails.firstName.trim()) { setSubmitError('Please enter your first name.'); return }
    if (!userDetails.email.trim() || !userDetails.email.includes('@')) { setSubmitError('Please enter a valid email.'); return }
    if (!userDetails.age || isNaN(parseInt(userDetails.age))) { setSubmitError('Please enter your age.'); return }
    if (!userDetails.gender) { setSubmitError('Please select your gender.'); return }
    setSubmitting(true)
    const computedResult = computeResult(answers as Answers)
    setShowDetailsForm(false)
    setLoading(true)
    try {
      await fetch('/api/submit-planner', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userDetails, answers, result: computedResult }) })
    } catch (err) { console.error(err) }
    setTimeout(() => { setResult(computedResult); setLoading(false); setSubmitting(false) }, 1800)
  }

  function restart() {
    setAnswers({}); setShowDetailsForm(false)
    setUserDetails({ firstName: '', lastName: '', age: '', gender: '', email: '' })
    setResult(null); setLoading(false); setSubmitting(false); setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '52px', height: '52px', border: `3px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: T.ink, marginBottom: '0.5rem' }}>Generating your report…</h2>
        <p style={{ color: T.muted }}>Emailing a copy to {userDetails.email}</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  // ── RESULT ──
  if (result) {
    const r = result
    return (
      <div style={{ background: T.bg, backgroundImage: T.heroGrad, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }} ref={reportRef}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* SCORE HEADER */}
        <div style={{ padding: '4rem 2rem 2.5rem', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: T.muted, letterSpacing: '0.06em' }}>Return Readiness Report · emailed to {userDetails.email}</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: T.ink, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {userDetails.firstName}, <em style={{ fontStyle: 'italic', color: T.saffron }}>{r.headline}</em>
          </h1>
          <p style={{ color: T.muted, fontSize: '1rem', marginBottom: '2rem' }}>{r.subheadline}</p>

          {/* Score + breakdown cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '1.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '3.5rem', color: r.statusColor, lineHeight: 1 }}>{r.score.total}</div>
              <div style={{ fontSize: '12px', color: T.soft, margin: '4px 0 10px' }}>out of 100</div>
              <div style={{ background: r.statusBg, color: r.statusColor, fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px', display: 'inline-block' }}>{r.status}</div>
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '18px', padding: '1.25rem 1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              {[{ label: 'Financial', s: r.score.financial, max: 40, c: T.saffron }, { label: 'Life Complexity', s: r.score.lifeComplexity, max: 25, c: '#7C5CBF' }, { label: 'Career', s: r.score.career, max: 20, c: T.green }, { label: 'Planning', s: r.score.planning, max: 20, c: T.navy }].map(x => (
                <div key={x.label} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: T.muted }}>{x.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: x.c }}>{x.s}/{x.max}</span>
                  </div>
                  <div style={{ height: '5px', background: '#EDE9E0', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: x.c, width: Math.round((x.s / x.max) * 100) + '%', borderRadius: '100px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 2rem 3rem' }}>

          {/* Financial snapshot */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'India monthly cost', val: r.financial.monthlyCost, sub: r.cityName, color: T.ink },
              { label: 'Financial runway', val: r.financial.runway, sub: 'on savings alone', color: r.financial.runwayMonths >= 18 ? T.green : '#CC7A00' },
              { label: 'RNOR tax saving', val: r.financial.rnorSaving, sub: 'if claimed correctly', color: T.saffron },
            ].map(s => (
              <div key={s.label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '10px', color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '5px' }}>{s.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: s.color, marginBottom: '2px' }}>{s.val}</div>
                <div style={{ fontSize: '11px', color: T.soft }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div style={{ background: r.recommendation.bg, border: `1.5px solid ${r.recommendation.border}`, borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: r.recommendation.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Final Recommendation</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{r.recommendation.icon}</span>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: r.recommendation.color, lineHeight: 1.4, marginBottom: '3px' }}>{r.recommendation.verdict}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: r.recommendation.color, opacity: 0.7 }}>→ {r.recommendation.timeframe}</div>
              </div>
            </div>
            <div style={{ borderTop: `0.5px solid ${r.recommendation.border}`, paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {r.recommendation.actions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '17px', height: '17px', borderRadius: '50%', background: r.recommendation.color, color: '#fff', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                  <div style={{ fontSize: '12px', color: r.recommendation.color, lineHeight: 1.55, opacity: 0.85 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Waitlist CTA */}
          <Link href="/contact" style={{ background: T.saffron, borderRadius: '14px', padding: '1.125rem 1.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(255,153,51,0.35)' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>Join the waitlist — free lifetime access</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>First 200 founding members · all tools included</div>
            </div>
            <span style={{ color: '#fff', fontSize: '1.25rem' }}>→</span>
          </Link>

          {/* EMBEDDED SIMULATOR */}
          <SimulatorSection original={answers as Answers} userEmail={userDetails.email} userName={userDetails.firstName} />

          <button onClick={restart} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%', textAlign: 'center', padding: '0.875rem', borderRadius: '10px', marginTop: '0.5rem' }}>
            ← Retake assessment from scratch
          </button>
        </div>
      </div>
    )
  }

  // ── DETAILS FORM ──
  if (showDetailsForm) return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: T.saffronLight, border: `1px solid ${T.saffronBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>🎉</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: T.ink, marginBottom: '0.5rem' }}>One last step</h2>
          <p style={{ color: T.muted, fontSize: '0.9rem', lineHeight: 1.6 }}>Enter your details to get your personalised report. We&apos;ll also email you a full copy.</p>
        </div>
        <form onSubmit={handleDetailsSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '1.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            {[{ id: 'firstName', label: 'First Name *', placeholder: 'Rahul', type: 'text', value: userDetails.firstName, onChange: (v: string) => setUserDetails(d => ({ ...d, firstName: v })) },
              { id: 'lastName', label: 'Last Name', placeholder: 'Sharma', type: 'text', value: userDetails.lastName, onChange: (v: string) => setUserDetails(d => ({ ...d, lastName: v })) }
            ].map(f => (
              <div key={f.id}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '5px' }}>Age *</label>
              <input type="number" placeholder="38" min="18" max="70" value={userDetails.age} onChange={e => setUserDetails(d => ({ ...d, age: e.target.value }))} style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '5px' }}>Gender *</label>
              <div style={{ position: 'relative' }}>
                <select value={userDetails.gender} onChange={e => setUserDetails(d => ({ ...d, gender: e.target.value }))} style={{ width: '100%', padding: '11px 32px 11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: userDetails.gender ? T.ink : T.soft, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', appearance: 'none' as const }}>
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not">Prefer not to say</option>
                </select>
                <svg style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke={T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '5px' }}>Email Address *</label>
            <input type="email" placeholder="rahul@company.com" value={userDetails.email} onChange={e => setUserDetails(d => ({ ...d, email: e.target.value }))} style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }} />
            <div style={{ fontSize: '11px', color: T.soft, marginTop: '4px' }}>📧 Your full report will be sent here</div>
          </div>
          {submitError && <div style={{ background: '#FCEBEB', border: '0.5px solid rgba(192,57,43,0.2)', borderRadius: '8px', padding: '9px 12px', fontSize: '12px', color: '#C0392B', marginBottom: '0.875rem' }}>{submitError}</div>}
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: '13px', background: submitting ? 'rgba(255,153,51,0.5)' : T.saffron, color: '#fff', border: 'none', borderRadius: '10px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: submitting ? 'none' : '0 4px 16px rgba(255,153,51,0.4)' }}>
            {submitting ? 'Generating…' : 'Get My Report →'}
          </button>
          <p style={{ fontSize: '11px', color: T.soft, textAlign: 'center', marginTop: '0.75rem' }}>🔒 We never sell or share your information.</p>
        </form>
        <button onClick={() => setShowDetailsForm(false)} style={{ background: 'none', border: 'none', color: T.soft, fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'block', margin: '1rem auto 0' }}>← Go back</button>
      </div>
    </div>
  )

  // ── QUESTIONNAIRE ──
  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`select option { background: #fff; color: ${T.ink}; } select:focus { box-shadow: 0 0 0 3px ${T.saffronBorder}; }`}</style>

      <div style={{ padding: '3rem 2rem 1.5rem', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: '100px', padding: '5px 14px', marginBottom: '1.25rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: T.muted, letterSpacing: '0.06em' }}>Return Readiness Assessment · Free · {total} questions</span>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: T.ink, marginBottom: '0.5rem', lineHeight: 1.2 }}>
          How ready are you to <em style={{ fontStyle: 'italic', color: T.saffron }}>return to India?</em>
        </h1>
        <p style={{ color: T.muted, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Answer all {total} questions below and get your personalised score, top risks, and a clear recommendation.
        </p>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.25rem' }}>
          <div style={{ flex: 1, height: '5px', background: '#EDE9E0', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: T.saffron, borderRadius: '100px', width: progress + '%', transition: 'width 0.3s ease', boxShadow: progress > 0 ? '0 0 8px rgba(255,153,51,0.4)' : 'none' }} />
          </div>
          <span style={{ fontSize: '12px', color: progress === 100 ? T.green : T.saffron, fontWeight: 600, flexShrink: 0 }}>
            {answered}/{total}{progress === 100 ? ' ✓ All done!' : ''}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0.5rem 2rem 3rem' }}>
        {sections.map(section => (
          <div key={section.name} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.6rem', paddingLeft: '2px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SECTION_COLORS[section.name] || T.saffron }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.name}</span>
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {section.qs.map(q => (
                <div key={q.key as string}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 500, color: answers[q.key] ? T.ink : T.muted, lineHeight: 1.3 }}>{q.q}</label>
                    {answers[q.key] && <span style={{ fontSize: '11px', color: T.green, flexShrink: 0, marginLeft: '8px' }}>✓</span>}
                  </div>
                  <QSelect value={answers[q.key] || ''} onChange={v => setAnswer(q.key, v)} opts={q.opts} />
                  {!answers[q.key] && <div style={{ fontSize: '11px', color: T.soft, marginTop: '4px' }}>{q.hint}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div style={{ marginTop: '0.75rem' }}>
          {allAnswered ? (
            <button onClick={() => setShowDetailsForm(true)} style={{ width: '100%', padding: '15px', background: T.saffron, color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>
              Generate My Readiness Report →
            </button>
          ) : (
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.25rem' }}>📋</div>
              <div>
                <div style={{ fontSize: '13px', color: T.muted }}>Answer all {total} questions to generate your report</div>
                <div style={{ fontSize: '11px', color: T.soft, marginTop: '2px' }}>{total - answered} question{total - answered !== 1 ? 's' : ''} remaining</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}