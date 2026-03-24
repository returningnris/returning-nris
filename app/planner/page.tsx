'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/useAuth'
import { useProtectedRoute } from '../../components/useProtectedRoute'
import { supabase } from '../../lib/supabase'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Answers = {
  country: string; savings: string; yearsAbroad: string; hasKids: string
  kidsAge: string; hasJob: string; city: string
  timeline: string; knowsRNOR: string; housing: string
}

export type ScoreBreakdown = { financial: number; lifeComplexity: number; career: number; planning: number; total: number }
type RiskItem = { level: 'high' | 'medium' | 'low'; title: string; detail: string; action: string }
export type FinancialSnapshot = { monthlyCost: string; runway: string; runwayMonths: number; rnorSaving: string; savingsLabel: string }
export type Rec = {
  icon: string; color: string; bg: string; border: string
  verdict: string
  directTalk: string
  actions: string[]
}
type Result = { score: ScoreBreakdown; status: string; statusColor: string; statusBg: string; headline: string; subheadline: string; risks: RiskItem[]; financial: FinancialSnapshot; cityName: string; recommendation: Rec }
type PlannerUser = { firstName: string; lastName: string; email: string }

async function submitPlannerReport(params: {
  answers: Partial<Answers>
  result: Result
  user: PlannerUser
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    throw new Error('AUTH_REQUIRED')
  }

  const response = await fetch('/api/submit-planner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      userDetails: {
        firstName: params.user.firstName,
        lastName: params.user.lastName,
        age: '',
        gender: '',
        email: params.user.email,
      },
      answers: params.answers,
      result: params.result,
    }),
  })

  if (!response.ok) {
    throw new Error('SUBMIT_FAILED')
  }

  return response.json()
}

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

// ─── OPTION POINTS ─────────────────────────────────────────────────────────────

export const OPTION_POINTS: Partial<Record<keyof Answers, Record<string, number>>> = {
  savings: { '200000+': 20, '100000': 15, '50000': 10, 'under50': 5 },
  yearsAbroad: { '10+': 10, '7': 10, '5': 7, '3': 5, 'under3': 2 },
  country: { 'USA': 5, 'UK': 5, 'UAE': 4, 'Canada': 3, 'Other': 3 },
  hasJob: { 'remote_us': 20, 'own_business': 17, 'india_job': 15, 'searching': 8, 'no': 4 },
  hasKids: { 'no': 22, 'yes': 8 },
  kidsAge: { 'under5': 6, '5to12': 4, 'teen': 2, 'adult': 6 },
  housing: { 'owned': 3, 'arranged': 2, 'searching': 0, 'no': 0 },
  city: { 'Hyderabad': 6, 'Bangalore': 6, 'Pune': 6, 'Chennai': 6, 'Mumbai': 6, 'Other': 6, 'undecided': 2 },
  timeline: { 'within6': 6, '6to12': 5, '1to2': 4, 'exploring': 2 },
  knowsRNOR: { 'yes_filed': 8, 'yes_aware': 5, 'partial': 3, 'no': 1 },
}

// Continue with all your scoring functions (computeScore, computeRisks, computeFinancial, computeRecommendation, computeResult)
// I'll include the key ones here - copy the rest from your original file

function calcRunwayMonths(savings: string, city: string): number {
  const savingsUsd = SAVINGS_USD[savings] || 35000
  const monthlyCost = CITY_BASE[city] || 185000
  const monthlyUsd = monthlyCost / 83
  return Math.floor(savingsUsd / monthlyUsd)
}

export function computeScore(A: Answers): ScoreBreakdown {
  let financial = 0, life = 0, career = 0, planning = 0
  const rm = calcRunwayMonths(A.savings, A.city)
  if (A.savings === '200000+') financial += 20; else if (A.savings === '100000') financial += 15; else if (A.savings === '50000') financial += 10; else financial += 5
  if (rm >= 24) financial += 10; else if (rm >= 18) financial += 7; else if (rm >= 12) financial += 4; else financial += 2
  if (A.yearsAbroad === '10+' || A.yearsAbroad === '7') financial += 10; else if (A.yearsAbroad === '5') financial += 7; else if (A.yearsAbroad === '3') financial += 5; else financial += 2
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
  const noIncome = A.hasJob === 'no'
  const searching = A.hasJob === 'searching'
  const lowSavings = A.savings === 'under50'
  const remote = A.hasJob === 'remote_us'
  const ownBiz = A.hasJob === 'own_business'
  const indiaJob = A.hasJob === 'india_job'
  const noHousing = A.housing === 'no'
  const rnorBlind = A.knowsRNOR === 'no'

  if (score >= 80 && !noIncome && !searching && !lowSavings) {
    const incomeStr = remote ? 'keeping your US salary' : ownBiz ? 'running your own business' : 'a confirmed job in India'
    return {
      icon: '✅', color: T.green, bg: T.greenLight, border: 'rgba(19,136,8,0.2)',
      verdict: 'You are ready. Move as planned.',
      directTalk: `With ${incomeStr}, ${A.savings === '200000+' ? 'strong savings' : 'solid savings'}, and your city decided — you've resolved the three things that derail most NRI returns before they start.`,
      actions: [
        rnorBlind ? 'Book a CA consultation before you leave — RNOR filing on Day 1 in India saves ₹18–40L' : 'File Form 12A on your first day in India',
        noHousing ? 'Arrange housing before landing — even a 2-month serviced apartment removes stress' : 'Transfer funds to your NRE account before you change tax residency',
      ],
    }
  }

  if (searching && !lowSavings) return {
    icon: '⚠️', color: '#CC7A00', bg: T.saffronLight, border: T.saffronBorder,
    verdict: 'Almost there — get the income confirmed before you book the flight.',
    directTalk: "Your finances are solid and your planning is further along than most. The gap that matters: you don't have confirmed income yet.",
    actions: [
      'Set a hard rule: no departure date until income is confirmed in writing',
      noHousing ? 'Keep researching housing now so you can move within weeks of the offer' : 'Everything else is ready — this is the only gap',
    ],
  }

  return {
    icon: '⏸️', color: '#C0392B', bg: '#FCEBEB', border: 'rgba(192,57,43,0.2)',
    verdict: 'Build your foundation before you move.',
    directTalk: 'Focus on securing income and building savings. These are the fundamentals that determine whether your first year feels smooth or stressful.',
    actions: [
      'Secure confirmed income — remote work or India job offer',
      'Build savings to at least $75K–100K',
      'Use this time to arrange housing and plan logistics',
    ],
  }
}

export function computeResult(A: Answers): Result {
  const score = computeScore(A)
  const financial = computeFinancial(A)
  const risks = computeRisks(A)
  const recommendation = computeRecommendation(A, score.total)
  const statusColor = score.total >= 80 ? T.green : score.total >= 60 ? '#CC7A00' : '#C0392B'
  const status = score.total >= 80 ? 'Ready to Return' : score.total >= 60 ? 'Moderately Ready' : 'Not Ready Yet'
  const statusBg = score.total >= 80 ? T.greenLight : score.total >= 60 ? T.saffronLight : '#FCEBEB'
  const headline = score.total >= 80 ? "you're ready to move" : score.total >= 60 ? "you're almost there" : 'build your foundation first'
  const subheadline = score.total >= 80 ? 'Your planning is solid. Time to execute.' : score.total >= 60 ? 'A few gaps remain before you\'re ready to move.' : 'Focus on income and savings before booking flights.'
  const cityName = A.city && A.city !== 'undecided' ? A.city : 'your target city'
  return { score, status, statusColor, statusBg, headline, subheadline, risks, financial, cityName, recommendation }
}

// ─── SIMULATOR COMPONENT ──────────────────────────────────────────────────────

// ADD THIS COMPONENT TO YOUR PLANNER FILE (before the main Planner component)

function UpdateSimulator({ 
  originalAnswers, 
  originalResult, 
  user, 
  onClose 
}: { 
  originalAnswers: Answers
  originalResult: Result
  user: PlannerUser
  onClose: (updatedResult?: Result) => void
}) {
  const [simAnswers, setSimAnswers] = useState<Answers>(originalAnswers)
  const [emailInput, setEmailInput] = useState(user.email)
  const [emailSending, setEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const simResult = computeResult(simAnswers)
  const hasChanges = JSON.stringify(simAnswers) !== JSON.stringify(originalAnswers)
  const scoreDelta = simResult.score.total - originalResult.score.total

  const visibleQs = QUESTIONS.filter(q => !q.skipIf || simAnswers[q.skipIf.key] !== q.skipIf.value)
  const sections: { name: string; qs: typeof QUESTIONS }[] = []
  visibleQs.forEach(q => {
    const last = sections[sections.length - 1]
    if (!last || last.name !== q.section) sections.push({ name: q.section, qs: [q] })
    else last.qs.push(q)
  })

  const changedKeys = (Object.keys(simAnswers) as Array<keyof Answers>).filter(k => simAnswers[k] !== originalAnswers[k])

  function setSimAnswer(key: keyof Answers, val: string) {
    setSimAnswers(prev => ({ ...prev, [key]: val }))
  }

  async function sendEmail() {
    setEmailSending(true)
    try {
      await submitPlannerReport({
        answers: simAnswers,
        result: simResult,
        user: {
          firstName: user.firstName,
          lastName: user.lastName || '',
          email: emailInput,
        },
      })
      setEmailSent(true)
    } catch (err) {
      console.error('Error sending email:', err)
      alert('Failed to send email. Please try again.')
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div style={{ background: T.bg, backgroundImage: T.heroGrad, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => onClose()} style={{ background: 'none', border: 'none', color: T.muted, fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Back to results
          </button>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.ink, marginBottom: '.5rem' }}>
            Update Milestone Changes
          </h1>
          <p style={{ color: T.muted, fontSize: '15px' }}>
            Adjust any answer below — your score updates live. Save to get an updated report by email.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
          
          {/* LEFT: Questions */}
          <div>
            {sections.map(section => (
              <div key={section.name} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: SECTION_COLORS[section.name] || T.saffron }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{section.name}</span>
                </div>
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {section.qs.map(q => {
                    const isChanged = simAnswers[q.key] !== originalAnswers[q.key]
                    const points = OPTION_POINTS[q.key]
                    const currentPts = points?.[simAnswers[q.key] || ''] || 0
                    const originalPts = points?.[originalAnswers[q.key] || ''] || 0
                    const ptsDelta = currentPts - originalPts

                    return (
                      <div key={q.key as string}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500, color: isChanged ? T.ink : T.muted, lineHeight: 1.3 }}>{q.q}</label>
                          {isChanged && (
                            <span style={{ fontSize: '10px', fontWeight: 600, color: T.saffron, background: T.saffronLight, border: `0.5px solid ${T.saffronBorder}`, padding: '2px 8px', borderRadius: '100px', flexShrink: 0, marginLeft: '8px' }}>
                              changed
                            </span>
                          )}
                        </div>
                        
                        <div style={{ position: 'relative' }}>
                          <select 
                            value={simAnswers[q.key] || ''} 
                            onChange={e => setSimAnswer(q.key, e.target.value)}
                            style={{ 
                              width: '100%', 
                              padding: '10px 36px 10px 12px', 
                              background: isChanged ? T.saffronLight : T.white,
                              border: `1.5px solid ${isChanged ? T.saffron : T.border}`, 
                              borderRadius: '10px', 
                              color: T.ink,
                              fontFamily: 'DM Sans, sans-serif', 
                              fontSize: '13px', 
                              outline: 'none', 
                              appearance: 'none', 
                              cursor: 'pointer' 
                            }}
                          >
                            <option value="" disabled>Select...</option>
                            {q.opts.map(o => {
                              const pts = points?.[o.k]
                              return (
                                <option key={o.k} value={o.k}>
                                  {o.label}{pts !== undefined ? ` (+${pts} pts)` : ''}
                                </option>
                              )
                            })}
                          </select>
                          <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 4l4 4 4-4" stroke={T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        {/* Show points bar */}
                        {currentPts > 0 && (
                          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: '4px', background: '#EDE9E0', borderRadius: '100px', overflow: 'hidden' }}>
                              <div style={{ 
                                height: '100%', 
                                background: SECTION_COLORS[q.section] || T.saffron, 
                                width: `${(currentPts / (points ? Math.max(...Object.values(points)) : 1)) * 100}%`,
                                borderRadius: '100px',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: SECTION_COLORS[q.section] || T.saffron }}>
                              {currentPts}/{points ? Math.max(...Object.values(points)) : 1} pts
                              {ptsDelta !== 0 && <span style={{ color: ptsDelta > 0 ? T.green : '#C0392B', marginLeft: '4px' }}>
                                {ptsDelta > 0 ? `+${ptsDelta}` : ptsDelta}
                              </span>}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Live score panel */}
          <div style={{ position: 'sticky', top: '2rem', alignSelf: 'flex-start' }}>
            
            {/* Simulated Score */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                {hasChanges ? 'Simulated Score' : 'Your Score'}
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '3.5rem', color: simResult.statusColor, lineHeight: 1, marginBottom: '6px', transition: 'color 0.3s' }}>
                {simResult.score.total}
              </div>
              <div style={{ fontSize: '11px', color: T.soft, marginBottom: '10px' }}>out of 100</div>
              <div style={{ display: 'inline-block', background: simResult.statusBg, color: simResult.statusColor, fontSize: '11px', fontWeight: 600, padding: '5px 14px', borderRadius: '100px' }}>
                {simResult.status}
              </div>
              {hasChanges && scoreDelta !== 0 && (
                <div style={{ marginTop: '12px', fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: scoreDelta > 0 ? T.green : '#C0392B', transition: 'color 0.3s' }}>
                  {scoreDelta > 0 ? `↑ +${scoreDelta} pts` : `↓ ${Math.abs(scoreDelta)} pts`}
                </div>
              )}
            </div>

            {/* Score Breakdown */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Breakdown</div>
              {[
                { label: 'Financial', orig: originalResult.score.financial, sim: simResult.score.financial, max: 40, color: T.saffron },
                { label: 'Life', orig: originalResult.score.lifeComplexity, sim: simResult.score.lifeComplexity, max: 25, color: '#7C5CBF' },
                { label: 'Career', orig: originalResult.score.career, sim: simResult.score.career, max: 20, color: T.green },
                { label: 'Planning', orig: originalResult.score.planning, sim: simResult.score.planning, max: 20, color: T.navy },
              ].map(s => {
                const d = s.sim - s.orig
                return (
                  <div key={s.label} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: T.muted }}>{s.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>
                        {s.sim}/{s.max}
                        {d !== 0 && <span style={{ fontSize: '10px', color: d > 0 ? T.green : '#C0392B', marginLeft: '5px' }}>
                          {d > 0 ? `+${d}` : d}
                        </span>}
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#EDE9E0', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                      {/* Original score (faded) */}
                      <div style={{ position: 'absolute', height: '100%', background: s.color, borderRadius: '100px', opacity: 0.25, width: `${(s.orig / s.max) * 100}%` }} />
                      {/* New score */}
                      <div style={{ position: 'absolute', height: '100%', background: s.color, borderRadius: '100px', width: `${(s.sim / s.max) * 100}%`, transition: 'width 0.35s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Financials */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Financials</div>
              {[
                { label: 'Monthly cost', val: simResult.financial.monthlyCost, prev: originalResult.financial.monthlyCost, color: T.ink },
                { label: 'Runway', val: simResult.financial.runway, prev: originalResult.financial.runway, color: simResult.financial.runwayMonths >= 18 ? T.green : '#CC7A00' },
                { label: 'RNOR saving', val: simResult.financial.rnorSaving, prev: originalResult.financial.rnorSaving, color: T.saffron },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', color: T.soft, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{f.label}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: f.color, lineHeight: 1.2 }}>{f.val}</div>
                  {hasChanges && f.val !== f.prev && (
                    <div style={{ fontSize: '10px', color: T.soft, textDecoration: 'line-through', marginTop: '2px' }}>{f.prev}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Changes summary */}
            {changedKeys.length > 0 && (
              <div style={{ background: T.saffronLight, border: `0.5px solid ${T.saffronBorder}`, borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '10px', fontWeight: 600, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {changedKeys.length} change{changedKeys.length > 1 ? 's' : ''}
                </div>
                {changedKeys.slice(0, 3).map(k => {
                  const q = QUESTIONS.find(x => x.key === k)
                  const origLabel = q?.opts.find(o => o.k === originalAnswers[k])?.label || originalAnswers[k]
                  const simLabel = q?.opts.find(o => o.k === simAnswers[k])?.label || simAnswers[k]
                  return (
                    <div key={k as string} style={{ fontSize: '11px', color: T.muted, marginBottom: '5px', lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 500, color: T.ink }}>{q?.q.split('?')[0]}:</span>{' '}
                      <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{origLabel.substring(0, 30)}</span>
                      {' → '}
                      <span style={{ color: '#CC7A00', fontWeight: 500 }}>{simLabel.substring(0, 30)}</span>
                    </div>
                  )
                })}
                {changedKeys.length > 3 && (
                  <div style={{ fontSize: '10px', color: T.soft, marginTop: '4px' }}>
                    +{changedKeys.length - 3} more change{changedKeys.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Updated Recommendation */}
            {hasChanges && (
              <div style={{ border: `1.5px solid ${simResult.recommendation.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ background: simResult.recommendation.bg, padding: '1.25rem' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: simResult.recommendation.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    Updated Recommendation
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0, lineHeight: 1 }}>{simResult.recommendation.icon}</span>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem', color: simResult.recommendation.color, lineHeight: 1.35 }}>
                      {simResult.recommendation.verdict}
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: simResult.recommendation.color, lineHeight: 1.6, margin: '0 0 12px 0', opacity: 0.88 }}>
                    {simResult.recommendation.directTalk.substring(0, 150)}...
                  </p>
                  <div style={{ borderTop: `0.5px solid ${simResult.recommendation.border}`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {simResult.recommendation.actions.slice(0, 2).map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ color: simResult.recommendation.color, fontSize: '11px', lineHeight: '18px', flexShrink: 0, fontWeight: 700 }}>→</span>
                        <span style={{ fontSize: '11px', color: simResult.recommendation.color, opacity: 0.85, lineHeight: 1.5 }}>{a.substring(0, 80)}...</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email form */}
                <div style={{ background: T.white, padding: '1.25rem', borderTop: `1px solid ${T.border}` }}>
                  {emailSent ? (
                    <div>
                      <div style={{ fontSize: '13px', color: T.green, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke={T.green} strokeWidth="1.5" />
                          <path d="M5 8l2 2 4-4" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Updated report sent to {emailInput}!
                      </div>
                      <button
                        onClick={() => onClose(simResult)}
                        style={{
                          width: '100%',
                          background: T.green,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                          boxShadow: '0 2px 10px rgba(19,136,8,0.3)',
                        }}
                      >
                        View Updated Results →
                      </button>
                    </div>
                  ) : emailSending ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: T.muted, fontSize: '13px' }}>
                      <div style={{ width: '14px', height: '14px', border: `2px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                      Sending to {emailInput}…
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: T.ink, marginBottom: '10px' }}>
                        Send updated report to your email?
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                          type="email"
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          placeholder="your@email.com"
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            background: T.bg,
                            border: `1.5px solid ${T.border}`,
                            borderRadius: '8px',
                            color: T.ink,
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                        <button
                          onClick={sendEmail}
                          disabled={!emailInput.includes('@')}
                          style={{
                            background: T.saffron,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: emailInput.includes('@') ? 'pointer' : 'not-allowed',
                            fontFamily: 'DM Sans, sans-serif',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 10px rgba(255,153,51,0.3)',
                            opacity: emailInput.includes('@') ? 1 : 0.5
                          }}
                        >
                          Email me →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ready to Start Journey */}
            <div style={{ background: T.white, borderRadius: '14px', padding: '1.25rem', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px' }}>🚀</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: T.ink, marginBottom: '6px', margin: 0 }}>
                    Ready to start your move?
                  </h3>
                  <p style={{ fontSize: '12px', color: T.muted, margin: 0, lineHeight: 1.5 }}>
                    Start your Journey with your saved profile and track your progress.
                  </p>
                </div>
              </div>
              <Link
                href="/journey"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  background: T.green,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textDecoration: 'none',
                }}
              >
                Start Journey →
              </Link>
            </div>

          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}



// Copy the entire SimQSelect and SimulatorSection components from your original file
// For brevity, I'll just note they go here

function QSelect({ value, onChange, opts, questionKey }: { value: string; onChange: (v: string) => void; opts: { k: string; label: string }[]; questionKey: keyof Answers }) {
  const points = OPTION_POINTS[questionKey] || {}
  
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '11px 36px 11px 14px', background: value ? T.saffronLight : T.white, border: `1.5px solid ${value ? T.saffron : T.border}`, borderRadius: '10px', color: value ? T.ink : T.soft, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
        <option value="" disabled>Select an answer…</option>
        {opts.map(o => {
          const pts = points[o.k]
          return (
            <option key={o.k} value={o.k}>
              {o.label}{pts !== undefined ? ` (+${pts} pts)` : ''}
            </option>
          )
        })}
      </select>
      <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke={T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      
      {/* Show points badge when selected */}
      {value && points[value] !== undefined && (
        <div style={{ 
          position: 'absolute', 
          right: '40px', 
          top: '50%', 
          transform: 'translateY(-50%)',
          background: T.green,
          color: '#fff',
          fontSize: '10px',
          fontWeight: 600,
          padding: '2px 6px',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}>
          +{points[value]}
        </div>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Planner() {
  const { shouldBlock } = useProtectedRoute()

  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const userId = user?.id ?? null
  
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [loading, setLoading] = useState(false)
  const [loadingSavedResult, setLoadingSavedResult] = useState(true)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  // Load saved readiness data from Supabase for the logged-in user
  useEffect(() => {
    let active = true

    async function loadSavedResult() {
      if (authLoading) {
        return
      }

      if (!isAuthenticated || !userId) {
        if (!active) return
        setAnswers({})
        setResult(null)
        setLoadingSavedResult(false)
        return
      }

      setLoadingSavedResult(true)

      const { data, error } = await supabase
        .from('planner_submissions')
        .select('answers_json, result_json')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) return

      if (error) {
        console.error('Error loading saved readiness data:', error)
        setLoadingSavedResult(false)
        return
      }

      if (data?.answers_json && data?.result_json) {
        setAnswers(data.answers_json as Partial<Answers>)
        setResult(data.result_json as Result)
      } else {
        setAnswers({})
        setResult(null)
      }

      setLoadingSavedResult(false)
    }

    void loadSavedResult()

    return () => {
      active = false
    }
  }, [authLoading, isAuthenticated, userId])

  // Scroll to top when result is set
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [result])

  if (shouldBlock) return null

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
    setSubmitError('')
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  async function handleGenerateReport() {
    if (!isAuthenticated || !user) {
      // Redirect to auth page
      router.push('/auth')
      return
    }

    setLoading(true)
    setSubmitError('')
    const computedResult = computeResult(answers as Answers)
    
    try {
      await submitPlannerReport({
        answers,
        result: computedResult,
        user: {
          firstName: user.firstName,
          lastName: user.lastName || '',
          email: user.email,
        },
      })
    } catch (err) { 
      console.error('Error:', err) 
      setSubmitError('We could not save your report to Supabase. Please try again.')
      setLoading(false)
      return
    }
    
    setTimeout(() => { 
      setResult(computedResult)
      setLoading(false)
    }, 1800)
  }

  function restart() {
    // Keep the answers, just hide results to allow editing
    setResult(null)
    setLoading(false)
    setSubmitError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authLoading || loadingSavedResult) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', border: `3px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: T.ink, marginBottom: '0.5rem' }}>Loading your saved report...</h2>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    )
  }

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '52px', height: '52px', border: `3px solid ${T.saffronBorder}`, borderTopColor: T.saffron, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: T.ink, marginBottom: '0.5rem' }}>Generating your report…</h2>
        <p style={{ color: T.muted }}>Saving to {user?.email}</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  // ── RESULT ──
  if (result && user) {
    const r = result
    return (
      <div style={{ background: T.bg, backgroundImage: T.heroGrad, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }} ref={reportRef}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

        {/* SCORE HEADER */}
        <div style={{ padding: '4rem 2rem 2.5rem', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: T.muted, letterSpacing: '0.06em' }}>Return Readiness Report · saved to {user.email}</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: T.ink, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {user?.firstName || 'Hi'}, <em style={{ fontStyle: 'italic', color: T.saffron }}>{r.headline}</em>
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

          {/* Account Saved Banner */}
          <div style={{ background: T.greenLight, border: `1px solid rgba(19,136,8,.2)`, borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke={T.green} strokeWidth="1.5" />
              <path d="M6 10l3 3 5-5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#27500A', marginBottom: '2px' }}>
                Readiness assessment saved
              </div>
              <div style={{ fontSize: '12px', color: '#27500A', opacity: .85, lineHeight: 1.5 }}>
                Your assessment is saved to {user.email}. Return anytime to view your results or start your Journey.
              </div>
            </div>
          </div>

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
          <div style={{ background: r.recommendation.bg, border: `1.5px solid ${r.recommendation.border}`, borderRadius: '16px', overflow: 'hidden', marginBottom: '0.75rem' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: r.recommendation.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Our Recommendation</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.75rem', flexShrink: 0, lineHeight: 1 }}>{r.recommendation.icon}</span>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: r.recommendation.color, lineHeight: 1.35, fontWeight: 400 }}>{r.recommendation.verdict}</div>
              </div>
              <p style={{ fontSize: '14px', color: r.recommendation.color, lineHeight: 1.75, margin: '0 0 1.25rem 0', opacity: 0.9 }}>{r.recommendation.directTalk}</p>
              <div style={{ borderTop: `1px solid ${r.recommendation.border}`, paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {r.recommendation.actions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: r.recommendation.color, fontSize: '12px', lineHeight: '20px', flexShrink: 0, fontWeight: 700 }}>→</span>
                    <span style={{ fontSize: '13px', color: r.recommendation.color, lineHeight: 1.6, opacity: 0.88 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ready to Start Journey Card */}
          <div style={{ background: T.white, borderRadius: '16px', padding: '2rem', border: `1px solid ${T.border}`, marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '32px' }}>🚀</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: T.ink, marginBottom: '8px', margin: 0 }}>
                  Ready to start your move?
                </h3>
                <p style={{ fontSize: '14px', color: T.muted, margin: 0, lineHeight: 1.6 }}>
                  When you&apos;re ready to begin your Back2India Journey, your saved answers will automatically pre-fill the setup form. Start tracking your progress with personalized tasks and milestones.
                </p>
              </div>
            </div>
            <Link
              href="/journey"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: T.green,
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                borderRadius: '10px',
                textDecoration: 'none',
                transition: 'all .15s',
              }}
            >
              Start Journey with Saved Profile →
            </Link>
          </div>

          <button onClick={restart} style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%', textAlign: 'center', padding: '0.875rem', borderRadius: '10px', marginTop: '0.5rem' }}>
            ✏️ Update Milestone Changes
          </button>
        </div>
      </div>
    )
  }

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
                  <QSelect value={answers[q.key] || ''} onChange={v => setAnswer(q.key, v)} opts={q.opts} questionKey={q.key} />
                  {!answers[q.key] && <div style={{ fontSize: '11px', color: T.soft, marginTop: '4px' }}>{q.hint}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <div style={{ marginTop: '0.75rem' }}>
          {submitError && (
            <div style={{ padding: '.875rem', background: '#FCEBEB', border: '1px solid #C0392B', borderRadius: '10px', marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '13px', color: '#C0392B', margin: 0 }}>{submitError}</p>
            </div>
          )}
          {allAnswered ? (
            <button onClick={handleGenerateReport} style={{ width: '100%', padding: '15px', background: T.saffron, color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>
              {!isAuthenticated ? 'Sign In to Generate Report →' : (result ? 'Save Updated Assessment →' : 'Generate My Readiness Report →')}
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
