'use client'

import { useState } from 'react'
import Link from 'next/link'

type Answers = {
  country: string; savings: string; yearsAbroad: string; hasKids: string
  kidsAge: string; hasJob: string; employment: string; city: string
  timeline: string; knowsRNOR: string; income: string; housing: string
}

type UserDetails = {
  firstName: string; lastName: string; age: string; gender: string; email: string
}

type ScoreBreakdown = {
  financial: number; lifeComplexity: number; career: number; planning: number; total: number
}

type RiskItem = {
  level: 'high' | 'medium' | 'low'; title: string; detail: string; action: string
}

type Insight = {
  icon: string; title: string; detail: string; type: 'positive' | 'warning' | 'info'
}

type FinancialSnapshot = {
  monthlyCost: string; runway: string; rnorSaving: string; savingsLabel: string
}

type ActionItem = {
  phase: string; timing: string; tasks: string[]; color: string
}

type Result = {
  score: ScoreBreakdown; status: string; statusColor: string; statusBg: string
  headline: string; subheadline: string; risks: RiskItem[]; insights: Insight[]
  financial: FinancialSnapshot; actionPlan: ActionItem[]; cityName: string
}

const STEPS = [
  { key: 'country', section: 'Financial Readiness', q: 'Where are you currently based?', hint: 'Affects RNOR eligibility and tax rules', opts: [{ k: 'USA', label: 'United States', sub: 'H1-B / Green Card holders' }, { k: 'UK', label: 'United Kingdom', sub: 'UK residents & citizens' }, { k: 'UAE', label: 'UAE / Middle East', sub: 'Tax-free income base' }, { k: 'Canada', label: 'Canada', sub: 'Canadian residents' }, { k: 'Other', label: 'Other country', sub: 'Rest of the world' }] },
  { key: 'savings', section: 'Financial Readiness', q: 'What are your total liquid savings (USD)?', hint: 'Savings buffer is the #1 factor in return readiness', opts: [{ k: '200000+', label: '$200,000+', sub: 'Strong financial base' }, { k: '100000', label: '$100,000–$200,000', sub: 'Good buffer' }, { k: '50000', label: '$50,000–$100,000', sub: 'Moderate buffer' }, { k: 'under50', label: 'Under $50,000', sub: 'Needs strengthening' }] },
  { key: 'yearsAbroad', section: 'Financial Readiness', q: 'How many years have you lived abroad?', hint: '7+ years qualifies for the full RNOR window', opts: [{ k: '10+', label: '10+ years', sub: 'Full RNOR eligibility' }, { k: '7', label: '7–10 years', sub: 'Full RNOR eligibility' }, { k: '5', label: '5–7 years', sub: 'Partial RNOR eligibility' }, { k: '3', label: '3–5 years', sub: 'Limited RNOR eligibility' }, { k: 'under3', label: 'Under 3 years', sub: 'Minimal RNOR benefit' }] },
  { key: 'income', section: 'Financial Readiness', q: 'What is your current monthly income?', hint: 'Determines India purchasing power and runway', opts: [{ k: 'h200', label: 'Over $20,000/mo', sub: '~₹17L+/mo equivalent' }, { k: 'm200', label: '$10,000–$20,000/mo', sub: '~₹8–17L/mo' }, { k: 'm100', label: '$5,000–$10,000/mo', sub: '~₹4–8L/mo' }, { k: 'l50', label: 'Under $5,000/mo', sub: '~₹4L/mo' }] },
  { key: 'hasKids', section: 'Life Complexity', q: 'Do you have children?', hint: 'School transitions are one of the top reasons moves get delayed', opts: [{ k: 'no', label: 'No children', sub: 'Less complex move' }, { k: 'yes', label: 'Yes, I have kids', sub: 'School planning needed' }] },
  { key: 'kidsAge', section: 'Life Complexity', q: 'What are the ages of your children?', hint: 'Older kids face harder school transitions', opts: [{ k: 'under5', label: 'Under 5 years', sub: 'Easiest transition' }, { k: '5to12', label: '5–12 years', sub: 'Moderate adjustment' }, { k: 'teen', label: '13–17 years', sub: 'Most challenging transition' }, { k: 'adult', label: '18+ (adults)', sub: 'Independent, no impact' }], skipIf: { key: 'hasKids', value: 'no' } },
  { key: 'hasJob', section: 'Career Stability', q: 'Do you have a job or income source secured in India?', hint: 'The single biggest career risk factor', opts: [{ k: 'yes', label: 'Yes — job confirmed', sub: 'Offer letter in hand' }, { k: 'remote', label: 'Remote work arranged', sub: 'Keeping current job' }, { k: 'searching', label: 'Actively searching', sub: 'No offer yet' }, { k: 'no', label: 'Not yet started', sub: 'Will figure it out after' }] },
  { key: 'employment', section: 'Career Stability', q: 'What best describes your employment situation?', hint: 'Remote work and business owners have the most flexibility', opts: [{ k: 'remote', label: 'Remote — keeping US job', sub: 'Best financial position' }, { k: 'business', label: 'Running own business', sub: 'Location independent' }, { k: 'switching', label: 'Switching to India job', sub: 'Job search required' }, { k: 'break', label: 'Taking a career break', sub: 'Sabbatical or pause' }] },
  { key: 'city', section: 'Planning Preparedness', q: 'Have you decided on your target city?', hint: 'City clarity reduces school, housing, and career uncertainty', opts: [{ k: 'Hyderabad', label: 'Hyderabad', sub: 'IT hub · ₹1.6–2.2L/mo' }, { k: 'Bangalore', label: 'Bangalore', sub: 'Startup hub · ₹2.2–3.2L/mo' }, { k: 'Pune', label: 'Pune', sub: 'Quality life · ₹1.4–2.0L/mo' }, { k: 'Chennai', label: 'Chennai', sub: 'Cultural hub · ₹1.4–2.2L/mo' }, { k: 'Mumbai', label: 'Mumbai', sub: 'Financial hub · ₹2.5–4.0L/mo' }, { k: 'Other', label: 'Another city', sub: 'Kochi, Delhi, Vizag etc.' }, { k: 'undecided', label: 'Not decided yet', sub: 'Still researching' }] },
  { key: 'timeline', section: 'Planning Preparedness', q: 'What is your target move timeline?', hint: 'Closer timelines require more urgent action', opts: [{ k: 'within6', label: 'Within 6 months', sub: 'Urgent planning needed' }, { k: '6to12', label: '6–12 months', sub: 'Good planning runway' }, { k: '1to2', label: '1–2 years', sub: 'Comfortable pace' }, { k: 'exploring', label: 'Just exploring', sub: 'No timeline yet' }] },
  { key: 'knowsRNOR', section: 'Planning Preparedness', q: 'Are you aware of RNOR status and its tax benefits?', hint: 'Missing RNOR can cost ₹18–40L in year 1 alone', opts: [{ k: 'yes_filed', label: 'Yes — already planned for it', sub: 'Tax strategy in place' }, { k: 'yes_aware', label: 'Yes — aware but not planned', sub: 'Need to act on it' }, { k: 'partial', label: 'Heard of it but unsure', sub: 'Need to understand it' }, { k: 'no', label: 'No — not aware', sub: 'Critical gap to address' }] },
  { key: 'housing', section: 'Planning Preparedness', q: 'Have you sorted housing in India?', hint: 'The first 90 days are the hardest without a home sorted', opts: [{ k: 'owned', label: 'Own a home in India', sub: 'Ready to move in' }, { k: 'arranged', label: 'Rental arranged', sub: 'Sorted remotely' }, { k: 'searching', label: 'Actively searching', sub: 'In progress' }, { k: 'no', label: 'Not started yet', sub: 'Need to sort this' }] },
]

function computeScore(A: Answers): ScoreBreakdown {
  let financial = 0, life = 0, career = 0, planning = 0
  if (A.savings === '200000+') financial += 20; else if (A.savings === '100000') financial += 15; else if (A.savings === '50000') financial += 10; else financial += 5
  if (A.yearsAbroad === '10+' || A.yearsAbroad === '7') financial += 10; else if (A.yearsAbroad === '5') financial += 7; else if (A.yearsAbroad === '3') financial += 5; else financial += 2
  if (A.country === 'USA' || A.country === 'UK') financial += 5; else if (A.country === 'UAE') financial += 4; else financial += 3
  if (A.hasKids === 'no') life += 15; else life += 8
  if (A.hasKids === 'no') life += 10; else if (A.kidsAge === 'under5') life += 8; else if (A.kidsAge === '5to12') life += 5; else if (A.kidsAge === 'adult') life += 9; else life += 3
  if (A.housing === 'owned') life += 3; else if (A.housing === 'arranged') life += 2
  if (A.hasJob === 'yes') career += 15; else if (A.hasJob === 'remote') career += 14; else if (A.hasJob === 'searching') career += 7; else career += 3
  if (A.employment === 'remote' || A.employment === 'business') career += 5; else if (A.employment === 'switching') career += 3; else career += 2
  if (A.city && A.city !== 'undecided') planning += 5; else planning += 2
  if (A.timeline === 'within6') planning += 5; else if (A.timeline === '6to12') planning += 4; else if (A.timeline === '1to2') planning += 3; else planning += 2
  if (A.knowsRNOR === 'yes_filed') planning += 10; else if (A.knowsRNOR === 'yes_aware') planning += 7; else if (A.knowsRNOR === 'partial') planning += 4; else planning += 1
  return { financial, lifeComplexity: life, career, planning, total: Math.min(100, financial + life + career + planning) }
}

function computeRisks(A: Answers): RiskItem[] {
  const risks: RiskItem[] = []
  if (A.hasJob === 'no' || A.hasJob === 'searching') risks.push({ level: 'high', title: 'No income source secured in India', detail: 'Moving without confirmed income creates financial pressure within 3–6 months.', action: 'Start India job search 6 months before moving. Target companies known to hire returned NRIs.' })
  if (A.knowsRNOR === 'no' || A.knowsRNOR === 'partial') risks.push({ level: 'high', title: 'RNOR tax window at risk', detail: `Missing your RNOR status could cost ₹${A.income === 'h200' ? '40–60L' : A.income === 'm200' ? '28–40L' : '18–28L'} in year 1 alone. This window cannot be recovered once missed.`, action: 'Consult a CA specialising in NRI taxation before you move. File Form 12A within 30 days of arriving.' })
  if (A.savings === 'under50') risks.push({ level: 'high', title: 'Insufficient financial buffer', detail: 'Under $50K savings gives you less than 12 months runway in India.', action: 'Target at least $75K–100K before moving. Consider delaying 6–12 months to build buffer.' })
  if (A.hasKids === 'yes' && A.kidsAge === 'teen') risks.push({ level: 'high', title: 'Teenage school transition is high-risk', detail: 'Moving teenagers mid-schooling is the #1 reason NRI families delay or reverse their move.', action: 'Time the move around board exam completion. Research IGCSE schools which accept international transfers.' })
  if (A.housing === 'no' || A.housing === 'searching') risks.push({ level: 'medium', title: 'Housing not arranged', detail: 'Arriving without confirmed housing adds significant stress in the first 90 days.', action: 'Start rental search 4–6 months before move date. Consider serviced apartments for the first 2–3 months.' })
  if (A.city === 'undecided') risks.push({ level: 'medium', title: 'Target city undecided', detail: 'Without a city decision, you cannot start school applications, housing search, or job search.', action: 'Use our City Match tool to narrow to 2 cities. Visit both on a scouting trip before committing.' })
  if (A.yearsAbroad === 'under3') risks.push({ level: 'low', title: 'Limited RNOR eligibility', detail: 'Fewer than 3 years abroad may limit your RNOR tax benefit.', action: 'Get a professional NRI tax opinion to understand your exact RNOR eligibility.' })
  const order = { high: 0, medium: 1, low: 2 }
  return risks.sort((a, b) => order[a.level] - order[b.level]).slice(0, 3)
}

function computeInsights(A: Answers): Insight[] {
  const insights: Insight[] = []
  if (A.savings === '200000+' || A.savings === '100000') insights.push({ icon: '💰', title: 'Strong financial foundation', detail: `Your savings give you ${A.savings === '200000+' ? '2+ years' : '12–18 months'} of runway in India. This removes financial pressure and lets you make career decisions without desperation.`, type: 'positive' })
  else insights.push({ icon: '⚠️', title: 'Build your buffer before moving', detail: 'Financial stress is the #1 reason NRIs return to the US within 2 years. Every extra $10K saved is 1–2 months of decision-making time.', type: 'warning' })
  if (A.yearsAbroad === '10+' || A.yearsAbroad === '7') insights.push({ icon: '📊', title: 'You qualify for the full RNOR window', detail: `With ${A.yearsAbroad === '10+' ? '10+' : '7–10'} years abroad, you get a 2–3 year RNOR window. Foreign income during this period is completely tax-free in India.`, type: 'positive' })
  if (A.employment === 'remote') insights.push({ icon: '🚀', title: 'Remote work is your biggest financial lever', detail: 'A US salary in India gives you 3–4x the purchasing power. Save aggressively, pay off loans, or invest in property.', type: 'positive' })
  if (A.hasKids === 'yes' && A.kidsAge === 'under5') insights.push({ icon: '🎓', title: 'Ideal time to move with young children', detail: 'Children under 5 adapt fastest. They will grow up bilingual, connected to Indian culture.', type: 'positive' })
  else if (A.hasKids === 'yes' && A.kidsAge === '5to12') insights.push({ icon: '🎓', title: 'Start school applications immediately', detail: `IB and IGCSE schools in ${A.city !== 'undecided' ? A.city : 'your target city'} fill admissions 12–18 months in advance. Apply now.`, type: 'warning' })
  if (A.city && A.city !== 'undecided' && A.city !== 'Other') { const costs: Record<string, string> = { Hyderabad: '₹1.6–2.2L/mo', Bangalore: '₹2.2–3.2L/mo', Pune: '₹1.4–2.0L/mo', Chennai: '₹1.4–2.2L/mo', Mumbai: '₹2.5–4.0L/mo' }; insights.push({ icon: '🏙️', title: `${A.city} matches your profile`, detail: `Expected monthly cost in ${A.city}: ${costs[A.city] || '₹1.5–2.5L/mo'}. Plan your India budget around this.`, type: 'info' }) }
  return insights.slice(0, 4)
}

function computeFinancial(A: Answers): FinancialSnapshot {
  const cityBase: Record<string, number> = { Hyderabad: 180000, Bangalore: 240000, Pune: 160000, Chennai: 170000, Mumbai: 280000, Other: 180000, undecided: 180000 }
  const incomeMult: Record<string, number> = { h200: 1.5, m200: 1.2, m100: 1.0, l50: 0.8 }
  const monthly = Math.round((cityBase[A.city] || 180000) * (incomeMult[A.income] || 1.0) / 5000) * 5000
  const fmt = (n: number) => n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L/mo' : '₹' + Math.round(n / 1000) + 'K/mo'
  const savingsUSD: Record<string, number> = { '200000+': 200000, '100000': 150000, '50000': 75000, 'under50': 35000 }
  const runwayMonths = Math.round((savingsUSD[A.savings] || 75000) * 83 / monthly)
  return {
    monthlyCost: fmt(monthly),
    runway: runwayMonths >= 12 ? Math.floor(runwayMonths / 12) + ' yr ' + (runwayMonths % 12) + ' mo' : runwayMonths + ' months',
    rnorSaving: ({ h200: '₹40–60L', m200: '₹28–40L', m100: '₹18–28L', l50: '₹10–18L' } as Record<string, string>)[A.income] || '₹18–28L',
    savingsLabel: ({ '200000+': '$200K+', '100000': '~$150K', '50000': '~$75K', 'under50': '<$50K' } as Record<string, string>)[A.savings] || '–',
  }
}

function computeActionPlan(A: Answers): ActionItem[] {
  return [
    { phase: 'Phase 1 — Prepare Now', timing: 'Start immediately', color: '#FF9933', tasks: ['Open NRE / NRO account — start transferring savings tax-free immediately', A.knowsRNOR !== 'yes_filed' ? 'Book consultation with NRI tax specialist — understand your RNOR window' : 'File Form 12A within 30 days of arriving in India', A.city === 'undecided' ? 'Shortlist 2 target cities using data — visit on a scouting trip' : `Research ${A.city} neighbourhoods, commute times, and expat areas`] },
    { phase: 'Phase 2 — Execute', timing: A.timeline === 'within6' ? '1–3 months before move' : '3–6 months before move', color: '#138808', tasks: [A.hasJob === 'no' || A.hasJob === 'searching' ? 'Begin India job search — target companies hiring returned NRIs' : 'Finalise remote work arrangement with current employer', A.hasKids === 'yes' ? `Submit school applications in ${A.city !== 'undecided' ? A.city : 'target city'} — 12–18 months lead time required` : `Secure rental in ${A.city !== 'undecided' ? A.city : 'target city'} — 3–6 months before arrival`, A.housing === 'no' ? 'Start housing search remotely — explore NRI-popular neighbourhoods' : 'Confirm housing start date aligns with move date'] },
    { phase: 'Phase 3 — Land & Settle', timing: 'First 90 days in India', color: '#000080', tasks: ['File Form 12A to register RNOR status — do this in month 1', 'Update Aadhaar, PAN, and link all financial accounts', A.hasKids === 'yes' ? 'Support children through school transition — 3 months is the typical adjustment period' : 'Connect with local returning NRI community in your city', 'Set up health insurance for the family before US coverage lapses'] },
  ]
}

function computeResult(A: Answers): Result {
  const score = computeScore(A)
  const risks = computeRisks(A)
  const insights = computeInsights(A)
  const financial = computeFinancial(A)
  const actionPlan = computeActionPlan(A)
  let status = '', statusColor = '', statusBg = '', headline = '', subheadline = ''
  if (score.total >= 80) { status = 'Ready to Return'; statusColor = '#138808'; statusBg = '#E8F5E8'; headline = 'You are in a strong position to return.'; subheadline = 'Focus on optimising your tax strategy and finalising relocation logistics. The foundation is solid — now execute.' }
  else if (score.total >= 60) { status = 'Moderately Ready'; statusColor = '#FF9933'; statusBg = '#FFF3E6'; headline = 'You are on track, but key gaps need attention.'; subheadline = 'Address the risks below before moving — especially financial planning and career stability.' }
  else { status = 'Not Ready Yet'; statusColor = '#E24B4A'; statusBg = '#FCEBEB'; headline = 'Delaying your move will put you in a stronger position.'; subheadline = 'Focus on building financial buffer, securing income in India, and addressing the planning gaps below.' }
  return { score, status, statusColor, statusBg, headline, subheadline, risks, insights, financial, actionPlan, cityName: A.city !== 'undecided' ? A.city : 'your target city' }
}

export default function Planner() {
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails>({ firstName: '', lastName: '', age: '', gender: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  const visibleSteps = STEPS.filter(step => {
    if (!('skipIf' in step) || !step.skipIf) return true
    return answers[step.skipIf.key as keyof Answers] !== step.skipIf.value
  })
  const step = visibleSteps[currentStep]
  const totalSteps = visibleSteps.length
  const progress = Math.round((currentStep / totalSteps) * 100)
  const sectionColors: Record<string, string> = { 'Financial Readiness': '#FF9933', 'Life Complexity': '#7C5CBF', 'Career Stability': '#138808', 'Planning Preparedness': '#000080' }

  function pick(key: string, val: string) {
    const next = { ...answers, [key]: val }
    setAnswers(next)
    if (currentStep < visibleSteps.length - 1) setTimeout(() => setCurrentStep(s => s + 1), 300)
    else setTimeout(() => setShowDetailsForm(true), 300)
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    if (!userDetails.firstName.trim()) { setSubmitError('Please enter your first name.'); return }
    if (!userDetails.email.trim() || !userDetails.email.includes('@')) { setSubmitError('Please enter a valid email address.'); return }
    if (!userDetails.age || isNaN(parseInt(userDetails.age))) { setSubmitError('Please enter your age.'); return }
    if (!userDetails.gender) { setSubmitError('Please select your gender.'); return }
    setSubmitting(true)
    const computedResult = computeResult(answers as Answers)
    setShowDetailsForm(false)
    setLoading(true)
    try {
      await fetch('/api/submit-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userDetails, answers, result: computedResult }),
      })
    } catch (err) { console.error('Submit error:', err) }
    setTimeout(() => { setResult(computedResult); setLoading(false); setSubmitting(false) }, 1800)
  }

  function restart() {
    setAnswers({}); setCurrentStep(0); setShowDetailsForm(false)
    setUserDetails({ firstName: '', lastName: '', age: '', gender: '', email: '' })
    setResult(null); setLoading(false); setSubmitting(false); setSubmitError('')
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none' }

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.75rem' }}>Generating your report, {userDetails.firstName}...</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginBottom: '0.5rem' }}>Building your personalised return readiness report</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>We&apos;ll also email a copy to {userDetails.email}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  // ── RESULT ──
  if (result) {
    const r = result
    const riskColors = { high: { bg: '#FCEBEB', border: 'rgba(226,75,74,0.2)', icon: '#E24B4A', text: '#791F1F' }, medium: { bg: '#FFF3E6', border: 'rgba(255,153,51,0.2)', icon: '#FF9933', text: '#633806' }, low: { bg: '#E8E8FF', border: 'rgba(0,0,128,0.15)', icon: '#000080', text: '#0C447C' } }
    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Return Readiness Report</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>A copy has been sent to {userDetails.email}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>{userDetails.firstName}, {r.headline}</h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '540px' }}>{r.subheadline}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem 2rem', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '3.5rem', color: r.statusColor, lineHeight: 1, marginBottom: '4px' }}>{r.score.total}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>out of 100</div>
                <div style={{ background: r.statusBg, color: r.statusColor, fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '100px' }}>{r.status}</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
                {[{ label: 'Financial', score: r.score.financial, max: 35, color: '#FF9933' }, { label: 'Life Complexity', score: r.score.lifeComplexity, max: 28, color: '#7C5CBF' }, { label: 'Career', score: r.score.career, max: 20, color: '#138808' }, { label: 'Planning', score: r.score.planning, max: 20, color: '#6B8CFF' }].map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</span><span style={{ fontSize: '11px', fontWeight: 600, color: s.color }}>{s.score}/{s.max}</span></div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}><div style={{ height: '100%', background: s.color, borderRadius: '100px', width: Math.round((s.score / s.max) * 100) + '%' }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
          {/* FINANCIAL SNAPSHOT */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Financial Snapshot</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
              {[{ label: 'Savings', val: r.financial.savingsLabel, sub: 'Liquid assets', color: 'var(--ink)' }, { label: 'India monthly cost', val: r.financial.monthlyCost, sub: r.cityName, color: 'var(--ink)' }, { label: 'Financial runway', val: r.financial.runway, sub: 'Without income', color: r.financial.runway.includes('yr') ? '#138808' : '#FF9933' }, { label: 'RNOR tax saving', val: r.financial.rnorSaving, sub: 'If claimed correctly', color: '#FF9933' }].map(s => (
                <div key={s.label} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: s.color, marginBottom: '2px' }}>{s.val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP RISKS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Top {r.risks.length} Risks For Your Profile</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {r.risks.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', color: '#138808' }}><div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div><div>No major risks detected — your profile is well-prepared.</div></div>
                : r.risks.map((risk, i) => { const c = riskColors[risk.level]; return (
                  <div key={i} style={{ background: c.bg, border: `0.5px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: c.icon, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{risk.level === 'high' ? '!' : risk.level === 'medium' ? '⚠' : 'i'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: c.text }}>{risk.title}</div>
                        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: c.icon, color: '#fff', textTransform: 'uppercase' }}>{risk.level}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: c.text, opacity: 0.8, lineHeight: 1.6, marginBottom: '8px' }}>{risk.detail}</div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: c.text }}>→ {risk.action}</div>
                    </div>
                  </div>
                )})}
            </div>
          </div>

          {/* KEY INSIGHTS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Key Personalised Insights</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {r.insights.map((ins, i) => (
                <div key={i} style={{ background: ins.type === 'positive' ? '#E8F5E8' : ins.type === 'warning' ? '#FFF3E6' : 'var(--india-white)', border: `0.5px solid ${ins.type === 'positive' ? 'rgba(19,136,8,0.15)' : ins.type === 'warning' ? 'rgba(255,153,51,0.2)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{ins.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>{ins.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{ins.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION TIMELINE */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Your Action Timeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {r.actionPlan.map((phase, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: phase.color, color: '#fff', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                    {i < r.actionPlan.length - 1 && <div style={{ width: '2px', height: '100%', minHeight: '40px', background: 'var(--border)', margin: '6px 0' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{phase.phase}</div>
                      <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '100px', background: 'var(--india-white)', color: 'var(--ink-soft)', border: '0.5px solid var(--border)' }}>{phase.timing}</span>
                    </div>
                    {phase.tasks.map((task, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--india-white)', border: `1.5px solid ${phase.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: phase.color, flexShrink: 0, marginTop: '1px' }}>○</div>
                        <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{task}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA STRIP */}
          <div style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Want your full personalised plan?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Join 165 NRIs already planning their return. Free lifetime access for the first 200 members.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Join waitlist →</Link>
              <button onClick={restart} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>Retake assessment</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── USER DETAILS FORM ──
  if (showDetailsForm) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,153,51,0.15)', border: '1px solid rgba(255,153,51,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem' }}>🎉</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>You&apos;re almost there!</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.6 }}>Enter your details to generate your personalised report.<br />We&apos;ll also email you a copy to keep.</p>
        </div>

        <form onSubmit={handleDetailsSubmit} style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>First Name *</label>
              <input type="text" placeholder="Rahul" value={userDetails.firstName} onChange={e => setUserDetails(d => ({ ...d, firstName: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Last Name</label>
              <input type="text" placeholder="Sharma" value={userDetails.lastName} onChange={e => setUserDetails(d => ({ ...d, lastName: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Age *</label>
              <input type="number" placeholder="38" min="18" max="70" value={userDetails.age} onChange={e => setUserDetails(d => ({ ...d, age: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Gender *</label>
              <select value={userDetails.gender} onChange={e => setUserDetails(d => ({ ...d, gender: e.target.value }))} style={{ ...inputStyle, appearance: 'none' as const }}>
                <option value="" style={{ background: '#1A1208' }}>Select…</option>
                <option value="male" style={{ background: '#1A1208' }}>Male</option>
                <option value="female" style={{ background: '#1A1208' }}>Female</option>
                <option value="other" style={{ background: '#1A1208' }}>Other</option>
                <option value="prefer_not" style={{ background: '#1A1208' }}>Prefer not to say</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>Email Address *</label>
            <input type="email" placeholder="rahul@company.com" value={userDetails.email} onChange={e => setUserDetails(d => ({ ...d, email: e.target.value }))} style={inputStyle} />
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>📧 Your full report will be emailed to this address</div>
          </div>
          {submitError && <div style={{ background: 'rgba(226,75,74,0.1)', border: '0.5px solid rgba(226,75,74,0.3)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#E24B4A', marginBottom: '1rem' }}>{submitError}</div>}
          <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px', background: submitting ? 'rgba(255,153,51,0.5)' : '#FF9933', color: '#1A1208', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {submitting ? 'Generating your report...' : 'Generate My Report →'}
          </button>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '0.75rem' }}>🔒 Your data is private. We never sell or share your information.</p>
        </form>

        <button onClick={() => { setShowDetailsForm(false); setCurrentStep(totalSteps - 1) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'block', margin: '1rem auto 0' }}>
          ← Go back
        </button>
      </div>
    </div>
  )

  // ── QUESTIONS ──
  return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>Return Readiness Assessment · Free · 12 questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>How ready are you to return to India?</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Answer {totalSteps} questions — get your personalised readiness score, top risks, and action plan.</p>
      </div>

      <div style={{ padding: '0 2rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Question {currentStep + 1} of {totalSteps}</span>
          <span style={{ fontSize: '12px', color: '#FF9933', fontWeight: 500 }}>{progress}% complete</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ height: '100%', background: '#FF9933', borderRadius: '100px', width: progress + '%', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {step && (
        <div style={{ flex: 1, padding: '0 2rem 4rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '20px', padding: '2rem', border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sectionColors[step.section] || '#FF9933' }} />
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{step.section}</span>
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '6px' }}>{step.q}</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>{step.hint}</p>
            <div style={{ display: 'grid', gridTemplateColumns: step.opts.length <= 3 ? '1fr' : '1fr 1fr', gap: '10px' }}>
              {step.opts.map(opt => {
                const sel = answers[step.key as keyof Answers] === opt.k
                return (
                  <button key={opt.k} onClick={() => pick(step.key, opt.k)} style={{ padding: '14px 18px', borderRadius: '14px', border: sel ? '2px solid #FF9933' : '1px solid rgba(255,255,255,0.1)', background: sel ? 'rgba(255,153,51,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left', transition: 'all 0.18s' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{opt.sub}</div>
                  </button>
                )
              })}
            </div>
            {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>← Back</button>}
          </div>
        </div>
      )}
    </div>
  )
}