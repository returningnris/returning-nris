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
  { key: 'timeline', section: 'Timeline', q: 'When are you planning to move?', hint: 'Closer timelines need more urgent action', opts: [{ k: 'within6', label: 'Within 6 months' }, { k: '6to12', label: '6–12 months' }, { k: '1to2', label: '1–2 years' }] },
  { key: 'knowsRNOR', section: 'Tax Planning', q: 'Aware of RNOR tax status?', hint: 'RNOR can save ₹18–60L — worth planning before you move', opts: [{ k: 'yes_filed', label: 'Yes — already planned with a CA specialist' }, { k: 'yes_aware', label: 'Yes — aware but not planned yet' }, { k: 'partial', label: 'Heard of it, not sure what it means' }, { k: 'no', label: 'No — first time hearing this' }] },
]

const SECTION_COLORS: Record<string, string> = {
  'Where You Are': T.saffron, 'Finances': T.green, 'Career': T.navy,
  'Family': '#7C5CBF', "Where You're Going": '#E0531A',
  'Timeline': T.saffron, 'Tax Planning': '#7C5CBF',
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getPlannerYearRange(): number[] {
  const year = new Date().getFullYear()
  return [year, year + 1, year + 2, year + 3]
}

function plannerTimelineFromMoveDate(moveDate: string): Answers['timeline'] {
  if (!moveDate) return 'within6'
  const now = new Date()
  const [y, mo] = moveDate.split('-').map(Number)
  const target = new Date(y, mo - 1, 1)
  const diffMonths = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  if (diffMonths <= 6) return 'within6'
  if (diffMonths <= 12) return '6to12'
  return '1to2'
}

function defaultMoveDateForTimeline(timeline?: string): string {
  if (!timeline || timeline === 'exploring') return ''

  const now = new Date()
  const monthOffset = timeline === 'within6' ? 3 : timeline === '6to12' ? 9 : 15
  const target = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`
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
    <div className="planner-option-grid" style={{ display: 'grid', gap: '0.7rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
      {opts.map(o => {
        const selected = value === o.k
        const pts = points[o.k]

        return (
          <button
            key={o.k}
            type="button"
            onClick={() => onChange(o.k)}
            style={{
              textAlign: 'left',
              padding: '1rem 1rem 0.95rem',
              borderRadius: 18,
              border: `1.5px solid ${selected ? T.saffron : T.border}`,
              background: selected ? T.saffronLight : T.white,
              boxShadow: selected ? '0 10px 24px rgba(255,153,51,0.14)' : 'none',
              transition: 'all .18s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.45 }}>{o.label}</div>
                {pts !== undefined ? (
                  <div style={{ marginTop: 6, fontSize: 12, color: selected ? T.saffron : T.muted, lineHeight: 1.5 }}>
                    {pts > 0 ? `Adds ${pts} readiness point${pts === 1 ? '' : 's'}` : 'No readiness points'}
                  </div>
                ) : null}
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
  )
}

function PlannerTimelinePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string, timeline: Exclude<Answers['timeline'], 'exploring'>) => void
}) {
  const selectedYear = value ? Number(value.split('-')[0]) : null
  const selectedMonth = value ? Number(value.split('-')[1]) : null
  const now = new Date()

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Year
        </div>
        <div className="planner-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {getPlannerYearRange().map((year) => {
            const selected = selectedYear === year
            return (
              <button
                type="button"
                key={year}
                onClick={() => {
                  const month = selectedMonth || Math.max(now.getMonth() + 1, 1)
                  const safeMonth = year === now.getFullYear() && month < now.getMonth() + 1 ? now.getMonth() + 1 : month
                  const moveDate = `${year}-${String(safeMonth).padStart(2, '0')}`
                  onChange(moveDate, plannerTimelineFromMoveDate(moveDate))
                }}
                style={{
                  padding: '0.9rem 0.75rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? T.saffron : T.border}`,
                  background: selected ? T.saffronLight : T.white,
                  color: selected ? T.ink : T.muted,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {year}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Month
        </div>
        <div className="planner-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {MONTHS_SHORT.map((month, idx) => {
            const monthNumber = idx + 1
            const selected = selectedMonth === monthNumber
            const disabled = !selectedYear || (selectedYear === now.getFullYear() && monthNumber < now.getMonth() + 1)
            return (
              <button
                type="button"
                key={month}
                disabled={disabled}
                onClick={() => {
                  if (!selectedYear || disabled) return
                  const moveDate = `${selectedYear}-${String(monthNumber).padStart(2, '0')}`
                  onChange(moveDate, plannerTimelineFromMoveDate(moveDate))
                }}
                style={{
                  padding: '0.95rem 0.5rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? T.saffron : T.border}`,
                  background: selected ? T.saffronLight : selectedYear ? T.white : 'rgba(29,22,15,0.03)',
                  color: selected ? T.ink : !selectedYear ? T.soft : disabled ? T.soft : T.muted,
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: disabled ? 0.55 : 1,
                }}
              >
                {month}
              </button>
            )
          })}
        </div>
      </div>
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
  const [plannerMoveDate, setPlannerMoveDate] = useState(() => defaultMoveDateForTimeline(''))
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
        setPlannerMoveDate('')
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
        const savedAnswers = data.answers_json as Partial<Answers>
        setAnswers(savedAnswers)
        setResult(data.result_json as Result)
        setPlannerMoveDate(defaultMoveDateForTimeline(savedAnswers.timeline))
      } else {
        setAnswers({})
        setResult(null)
        setPlannerMoveDate('')
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

  function setAnswer(key: keyof Answers, val: string) {
    setSubmitError('')
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  function setTimelineAnswer(moveDate: string, timeline: Answers['timeline']) {
    setSubmitError('')
    setPlannerMoveDate(moveDate)
    setAnswers(prev => ({ ...prev, timeline }))
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

  const responsiveStyles = `
    .planner-page {
      overflow-x: hidden;
    }
    .planner-shell {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }
    .planner-grid {
      display: grid;
      grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
      gap: 1.25rem;
      align-items: start;
    }
    .planner-sticky-panel {
      position: sticky;
      top: 96px;
    }
    .planner-question-stack {
      display: grid;
      gap: 1rem;
    }
    .planner-result-shell {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2rem 1.25rem 4rem;
    }
    .planner-result-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.8fr);
      gap: 0.9rem;
      align-items: start;
      margin-bottom: 1rem;
    }
    .planner-result-overview-grid {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .planner-result-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .planner-option-grid {
      display: grid;
      gap: 0.7rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    @media (max-width: 980px) {
      .planner-grid {
        grid-template-columns: 1fr;
      }
      .planner-result-hero-grid,
      .planner-result-overview-grid,
      .planner-result-cards-grid {
        grid-template-columns: 1fr;
      }
      .planner-sticky-panel {
        position: static;
      }
    }
    @media (max-width: 767px) {
      .planner-form-header,
      .planner-result-header,
      .planner-result-content {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
      }
      .planner-form-header {
        padding-top: 2rem !important;
      }
      .planner-result-header {
        padding-top: 2.25rem !important;
        padding-bottom: 1.5rem !important;
      }
      .planner-form-content,
      .planner-result-content {
        padding-bottom: 2rem !important;
      }
      .planner-shell {
        padding: 1rem 0.9rem 2rem;
      }
      .planner-result-shell {
        padding: 1rem 0.9rem 2rem;
      }
      .planner-score-grid,
      .planner-financial-grid,
      .planner-sim-grid {
        grid-template-columns: 1fr !important;
      }
      .planner-progress-row,
      .planner-question-label,
      .planner-saved-banner,
      .planner-journey-row {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      .planner-section-card,
      .planner-question-card,
      .planner-score-card,
      .planner-journey-card {
        padding: 1rem !important;
      }
      .planner-result-pill {
        max-width: 100%;
        white-space: normal;
        text-align: left;
      }
      .planner-journey-link {
        width: 100%;
        text-align: center;
      }
      .planner-option-grid {
        grid-template-columns: 1fr !important;
      }
      .planner-timeline-grid {
        grid-template-columns: 1fr 1fr !important;
      }
    }
    @media (max-width: 480px) {
      .planner-score-total {
        font-size: 3rem !important;
      }
      .planner-financial-value {
        font-size: 1.2rem !important;
      }
    }
  `

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
    const scoreBreakdown = [
      { label: 'Financial', s: r.score.financial, max: 40, c: T.saffron, note: 'Buffer, runway, and tax timing' },
      { label: 'Life Complexity', s: r.score.lifeComplexity, max: 25, c: '#7C5CBF', note: 'Family, housing, and move friction' },
      { label: 'Career', s: r.score.career, max: 20, c: T.green, note: 'Income continuity after the move' },
      { label: 'Planning', s: r.score.planning, max: 20, c: T.navy, note: 'City clarity, RNOR, and timing' },
    ]
    const topRisk = r.risks[0]
    const nextMove = r.recommendation.actions[0] || 'Keep refining the move plan before you commit.'

    return (
      <div className="planner-page" style={{ background: T.bg, backgroundImage: T.heroGrad, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif' }} ref={reportRef}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} ${responsiveStyles}`}</style>

        <div className="planner-result-shell">
          <div className="planner-result-hero-grid">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ padding: '1.2rem 1.25rem', background: '#20160f', display: 'grid', gap: '1.1rem', minHeight: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div>
                    <div className="planner-result-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Readiness dashboard
                      </span>
                    </div>
                    <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 4vw, 3rem)', lineHeight: 0.98, color: T.white, marginBottom: 8 }}>
                      {user?.firstName ? `${user.firstName}'s readiness` : 'Your readiness'}
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, maxWidth: 620 }}>
                      {r.subheadline}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 92 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Score</div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.4rem', color: '#fff', lineHeight: 1 }}>{r.score.total}</div>
                    </div>
                    <div style={{ minWidth: 92 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Status</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.status}</div>
                    </div>
                    <div style={{ minWidth: 92 }}>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>City</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{r.cityName}</div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gap: 10,
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Planner summary
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.white, lineHeight: 1.55 }}>
                    {r.headline.charAt(0).toUpperCase() + r.headline.slice(1)}, with {r.financial.runway} of runway around a {r.cityName} plan.
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.7, maxWidth: 640 }}>
                    Your readiness score blends finances, life complexity, career stability, and planning signals into one view so you can focus on the next decision instead of chasing scattered metrics.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.9rem' }}>
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 22, padding: '1.05rem 1.1rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Next best action
                    </div>
                    <h2 style={{ fontSize: '1.15rem', color: T.ink, marginBottom: 6 }}>{topRisk ? topRisk.title : r.recommendation.verdict}</h2>
                  </div>
                  <div style={{ background: r.statusBg, color: r.statusColor, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 999, alignSelf: 'flex-start' }}>
                    {r.status}
                  </div>
                </div>

                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, marginBottom: 14 }}>
                  {topRisk ? topRisk.detail : r.recommendation.directTalk}
                </p>

                <div
                  style={{
                    padding: '1rem',
                    borderRadius: 18,
                    background: T.saffronLight,
                    border: `1px solid ${T.saffronBorder}`,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#8d5c22', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Why this matters
                  </div>
                  <div style={{ fontSize: 14, color: '#8d5c22', lineHeight: 1.75 }}>
                    {nextMove}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <Link
                  href="/journey"
                  className="planner-journey-link"
                  style={{
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '1rem 1.15rem',
                    background: T.green,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    borderRadius: 999,
                    textDecoration: 'none',
                  }}
                >
                  Start Journey with Saved Profile
                </Link>

                <button
                  onClick={restart}
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '1rem 1.15rem',
                    borderRadius: 999,
                    border: `1px solid ${T.saffronBorder}`,
                    background: 'linear-gradient(180deg, #FFF8F0 0%, #FFF2E2 100%)',
                    color: T.ink,
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span style={{ fontSize: '16px', lineHeight: 1 }}>??</span>
                  <span>Update Milestone Changes</span>
                </button>
              </div>
            </div>
          </div>

          <div className="planner-result-overview-grid">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Readiness health
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: T.ink }}>Where your score is strong and where it is fragile</h2>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {scoreBreakdown.map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: T.muted }}>{item.note}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: item.c }}>{item.s}/{item.max}</div>
                    </div>
                    <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((item.s / item.max) * 100)}%`, height: '100%', background: item.c }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: r.recommendation.bg, border: `1.5px solid ${r.recommendation.border}`, borderRadius: 24, padding: '1.35rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: r.recommendation.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Recommendation
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: '1.75rem', flexShrink: 0, lineHeight: 1 }}>{r.recommendation.icon}</span>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: r.recommendation.color, lineHeight: 1.35 }}>
                  {r.recommendation.verdict}
                </div>
              </div>
              <p style={{ fontSize: 14, color: r.recommendation.color, lineHeight: 1.75, margin: '0 0 1rem 0', opacity: 0.92 }}>
                {r.recommendation.directTalk}
              </p>
              <div style={{ display: 'grid', gap: 10 }}>
                {r.recommendation.actions.map((action, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '26px minmax(0, 1fr)',
                      gap: 12,
                      alignItems: 'start',
                      padding: '0.95rem',
                      borderRadius: 18,
                      background: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: r.recommendation.color,
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ fontSize: 14, color: r.recommendation.color, lineHeight: 1.7 }}>{action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="planner-result-cards-grid">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Financial snapshot
              </div>
              <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 14 }}>What the move looks like financially right now</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { label: 'India monthly cost', val: r.financial.monthlyCost, sub: r.cityName, color: T.ink },
                  { label: 'Financial runway', val: r.financial.runway, sub: 'on savings alone', color: r.financial.runwayMonths >= 18 ? T.green : '#CC7A00' },
                  { label: 'RNOR tax saving', val: r.financial.rnorSaving, sub: 'if claimed correctly', color: T.saffron },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '1rem',
                      borderRadius: 18,
                      background: 'rgba(29,22,15,0.03)',
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <div style={{ fontSize: 11, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.label}</div>
                    <div className="planner-financial-value" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.45rem', color: item.color, marginBottom: 3 }}>{item.val}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 24, padding: '1.35rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Top risks
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: T.ink }}>The issues most likely to slow or break the move</h2>
                </div>
                <div style={{ background: T.bg, color: T.muted, fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 999 }}>
                  {r.risks.length} flagged
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {r.risks.map((risk, index) => {
                  const tone = risk.level === 'high' ? { bg: '#FCEBEB', border: 'rgba(192,57,43,0.18)', color: '#C0392B' } : risk.level === 'medium' ? { bg: T.saffronLight, border: T.saffronBorder, color: '#CC7A00' } : { bg: T.greenLight, border: 'rgba(19,136,8,0.18)', color: T.green }
                  return (
                    <div
                      key={risk.title}
                      style={{
                        padding: '1rem',
                        borderRadius: 18,
                        background: tone.bg,
                        border: `1px solid ${tone.border}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{risk.title}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: tone.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {risk.level} {index === 0 ? 'priority' : ''}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 10 }}>{risk.detail}</div>
                      <div style={{ fontSize: 13, color: tone.color, lineHeight: 1.7, fontWeight: 600 }}>{risk.action}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="planner-page" style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`select option { background: #fff; color: ${T.ink}; } select:focus { box-shadow: 0 0 0 3px ${T.saffronBorder}; } ${responsiveStyles}`}</style>

      <div className="planner-shell">
        <div className="planner-grid">
          <div className="planner-sticky-panel">
            <div className="planner-section-card" style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div className="planner-result-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron, animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Readiness Check
                  </span>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: T.white, marginBottom: '0.9rem' }}>
                  Plan your move like a <em style={{ fontStyle: 'italic', color: T.saffron }}>real transition.</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>
                  Answer the same readiness questions in a more guided format and get your score, top risks, and next-step recommendation in one pass.
                </p>
              </div>

              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.muted, marginBottom: 8 }}>
                    <span>Assessment progress</span>
                    <span style={{ fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="planner-section-card" style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      What you’ll get
                    </div>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14, color: T.muted }}>
                      <div>A readiness score built from the same Planner logic you already use</div>
                      <div>Top financial and move-planning risks based on your answers</div>
                      <div>A clear recommendation before you commit to timing your return</div>
                    </div>
                  </div>

                  <div className="planner-section-card" style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      Your progress
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
                      {answered} of {total} questions answered
                    </div>
                    <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>
                      {allAnswered
                        ? 'Everything is filled in and ready for your personalised report.'
                        : `${total - answered} question${total - answered === 1 ? '' : 's'} left before you can generate your report.`}
                    </div>
                  </div>

                  <div className="planner-section-card" style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      How to answer
                    </div>
                    <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>
                      Pick the option that best describes your current situation. You can change answers anytime before generating the report.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="planner-question-stack">
            <div className="planner-section-card" style={{ padding: '1.25rem 1.3rem' }}>
              <div>
                <div className="planner-result-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.saffron }} />
                  <span style={{ fontSize: '11px', fontWeight: 500, color: T.muted, letterSpacing: '0.06em' }}>Return Readiness Assessment · Free · {total} questions</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: T.ink, marginBottom: '0.6rem' }}>
                  How ready are you to return to India?
                </h2>
                <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8 }}>
                  Move through the questions below and we’ll turn your answers into a clear readiness score and recommendation.
                </p>
              </div>
            </div>

            {visibleQs.map((q, index) => (
              <div key={q.key as string} className="planner-section-card" style={{ padding: '1.2rem' }}>
                <div className="planner-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      {q.section}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>
                      {index + 1}. {q.q}
                    </h3>
                    <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{q.hint}</p>
                  </div>
                  {answers[q.key] ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: T.greenLight, color: T.green, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Set
                    </span>
                  ) : null}
                </div>
                {q.key === 'timeline' ? (
                  <PlannerTimelinePicker value={plannerMoveDate} onChange={setTimelineAnswer} />
                ) : (
                  <QSelect value={answers[q.key] || ''} onChange={v => setAnswer(q.key, v)} opts={q.opts} questionKey={q.key} />
                )}
              </div>
            ))}

            <div style={{ marginTop: '0.25rem' }}>
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
            <div className="planner-progress-row planner-question-card" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
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
      </div>
    </div>
  )
}
