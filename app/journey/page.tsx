'use client'

import { useReducer, useMemo, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

// ─── EXACT SCORING ENGINE (mirrors planner-page.tsx) ─────────────────────────

type Answers = {
  country: string; savings: string; yearsAbroad: string; hasKids: string
  kidsAge: string; hasJob: string; city: string
  timeline: string; knowsRNOR: string; housing: string
  moveDate: string      // 'YYYY-MM' or 'exploring'
  alreadyMoved: string  // 'yes' | 'no' | '' — only shown when moveDate is in the past
}

const CITY_BASE: Record<string, number> = {
  Hyderabad: 180000, Bangalore: 240000, Pune: 160000,
  Chennai: 170000, Mumbai: 280000, Other: 185000, undecided: 185000,
}
const SAVINGS_USD: Record<string, number> = {
  '200000+': 200000, '100000': 150000, '50000': 75000, 'under50': 35000,
}

function calcRunwayMonths(savings: string, city: string): number {
  const monthly = CITY_BASE[city] || 185000
  return Math.round((SAVINGS_USD[savings] || 75000) * 83 / monthly)
}

type ScoreBreakdown = { financial: number; lifeComplexity: number; career: number; planning: number; total: number }

function computeScore(A: Answers): ScoreBreakdown {
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

// ─── THEME ────────────────────────────────────────────────────────────────────

const T = {
  bg: '#F8F5F0', white: '#FFFFFF', ink: '#1A1208', muted: '#6B5E50', soft: '#B5A898',
  border: '#E5E1DA', saffron: '#FF9933', saffronLight: '#FFF3E6',
  saffronBorder: 'rgba(255,153,51,0.25)', green: '#138808', greenLight: '#E8F5E8',
  navy: '#000080', navyLight: '#EEF2FF', red: '#C0392B', redLight: '#FCEBEB',
  heroGrad: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

// ─── MILESTONES — mapped to planner scoring pillars ───────────────────────────

type Milestone = {
  id: string; label: string; icon: string; scoreImpact: number
  pillar: string; description: string; answerKey: keyof Answers
  completedWhen: (a: Answers) => boolean
}

const MILESTONES: Milestone[] = [
  {
    id: 'income', label: 'Income Secured', icon: '💼', scoreImpact: 20,
    pillar: 'Career — 20 pts max',
    description: 'Job offer, remote work, or business income confirmed in writing before moving',
    answerKey: 'hasJob',
    completedWhen: (a) => ['remote_us', 'own_business', 'india_job'].includes(a.hasJob),
  },
  {
    id: 'savings', label: 'Financial Runway', icon: '💰', scoreImpact: 15,
    pillar: 'Financial — savings pillar',
    description: '$100K+ liquid savings available — 18+ months of runway secured',
    answerKey: 'savings',
    completedWhen: (a) => ['200000+', '100000'].includes(a.savings),
  },
  {
    id: 'rnor', label: 'Tax Strategy Ready', icon: '📊', scoreImpact: 8,
    pillar: 'Planning — RNOR pillar',
    description: 'RNOR window understood and CA consultation booked or done',
    answerKey: 'knowsRNOR',
    completedWhen: (a) => ['yes_filed', 'yes_aware'].includes(a.knowsRNOR),
  },
  {
    id: 'housing', label: 'Housing Planned', icon: '🏠', scoreImpact: 3,
    pillar: 'Life — housing pillar',
    description: 'Home owned or rental arranged — not arriving without a plan',
    answerKey: 'housing',
    completedWhen: (a) => ['owned', 'arranged'].includes(a.housing),
  },
  {
    id: 'city', label: 'City Decided', icon: '🏙️', scoreImpact: 6,
    pillar: 'Planning — city pillar',
    description: 'Target city confirmed — enables school search, housing, and job applications',
    answerKey: 'city',
    completedWhen: (a) => !!a.city && a.city !== 'undecided',
  },
  {
    id: 'family', label: 'Family Ready', icon: '👨‍👩‍👧', scoreImpact: 6,
    pillar: 'Life — family pillar',
    description: 'Children\'s school plan sorted and family aligned on move timeline',
    answerKey: 'hasKids',
    completedWhen: (a) => a.hasKids === 'no' || (a.hasKids === 'yes' && ['under5', '5to12', 'adult'].includes(a.kidsAge)),
  },
]

// ─── QUESTIONS for profile setup ───────────────────────────────────────────────

type Question = {
  key: keyof Answers; section: string; q: string; hint: string
  opts: { k: string; label: string }[]
  skipIf?: { key: keyof Answers; value: string }
}

const SETUP_QUESTIONS: Question[] = [
  { key: 'country', section: 'Where You Are', q: 'Where are you based?', hint: 'Affects RNOR eligibility',
    opts: [{ k: 'USA', label: 'United States' }, { k: 'UK', label: 'United Kingdom' }, { k: 'UAE', label: 'UAE / Middle East' }, { k: 'Canada', label: 'Canada' }, { k: 'Other', label: 'Other' }] },
  { key: 'yearsAbroad', section: 'Where You Are', q: 'Years lived abroad?', hint: '7+ qualifies for full RNOR window',
    opts: [{ k: '10+', label: '10+ years' }, { k: '7', label: '7–10 years' }, { k: '5', label: '5–7 years' }, { k: '3', label: '3–5 years' }, { k: 'under3', label: 'Under 3 years' }] },
  { key: 'savings', section: 'Finances', q: 'Total liquid savings?', hint: 'Your financial buffer — #1 readiness factor',
    opts: [{ k: '200000+', label: '$200,000+' }, { k: '100000', label: '$100K–$200K' }, { k: '50000', label: '$50K–$100K' }, { k: 'under50', label: 'Under $50K' }] },
  { key: 'hasJob', section: 'Career', q: 'Income after moving?', hint: 'The single biggest risk factor',
    opts: [{ k: 'remote_us', label: 'Remote US job — keeping same salary' }, { k: 'own_business', label: 'Own business — location independent' }, { k: 'india_job', label: 'India job confirmed' }, { k: 'searching', label: 'Actively searching' }, { k: 'no', label: 'No plan yet' }] },
  { key: 'hasKids', section: 'Family', q: 'Do you have children?', hint: 'School timing is a top delay factor',
    opts: [{ k: 'no', label: 'No children' }, { k: 'yes', label: 'Yes, I have kids' }] },
  { key: 'kidsAge', section: 'Family', q: "Children's age range?", hint: 'Teens face hardest transitions',
    opts: [{ k: 'under5', label: 'Under 5' }, { k: '5to12', label: '5–12 years' }, { k: 'teen', label: '13–17 (teen)' }, { k: 'adult', label: '18+ adults' }],
    skipIf: { key: 'hasKids', value: 'no' } },
  { key: 'city', section: "Where You're Going", q: 'Target city?', hint: 'Affects cost, runway, and planning score',
    opts: [{ k: 'Hyderabad', label: 'Hyderabad' }, { k: 'Bangalore', label: 'Bangalore' }, { k: 'Pune', label: 'Pune' }, { k: 'Chennai', label: 'Chennai' }, { k: 'Mumbai', label: 'Mumbai' }, { k: 'Other', label: 'Other city' }, { k: 'undecided', label: 'Not decided yet' }] },
  { key: 'housing', section: "Where You're Going", q: 'Housing status?', hint: 'First 90 days without housing is high-stress',
    opts: [{ k: 'owned', label: 'Own a home in India' }, { k: 'arranged', label: 'Rental arranged' }, { k: 'searching', label: 'Actively searching' }, { k: 'no', label: 'Not started' }] },
  { key: 'knowsRNOR', section: 'Tax Planning', q: 'Aware of RNOR tax status?', hint: 'RNOR can save ₹18–40L',
    opts: [{ k: 'yes_filed', label: 'Yes — planned with CA specialist' }, { k: 'yes_aware', label: 'Yes — aware, not planned' }, { k: 'partial', label: 'Heard of it' }, { k: 'no', label: 'No — first time hearing this' }] },
]

// ─── MOVE DATE HELPERS ────────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getYearRange(): number[] {
  const y = new Date().getFullYear()
  return [y - 1, y, y + 1, y + 2]
}
function moveDateToTimeline(moveDate: string): string {
  if (!moveDate || moveDate === 'exploring') return 'exploring'
  const now = new Date()
  const [y, mo] = moveDate.split('-').map(Number)
  const target = new Date(y, mo - 1, 1)
  const diffMs = target.getTime() - now.getTime()
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44)
  if (diffMonths <= 0) return 'within6'   // already moved or this month
  if (diffMonths <= 6) return 'within6'
  if (diffMonths <= 12) return '6to12'
  return '1to2'
}

function isMoveDatePast(moveDate: string): boolean {
  if (!moveDate || moveDate === 'exploring') return false
  const now = new Date()
  const [y, mo] = moveDate.split('-').map(Number)
  return new Date(y, mo - 1, 1) < new Date(now.getFullYear(), now.getMonth(), 1)
}


type Task = {
  id: string; phase: number; title: string; desc: string
  priority: 'critical' | 'essential'; milestoneId: string | null; isScoreImpact: boolean
}

const PHASES = ['Decide & Plan', 'Prepare & Execute', 'Move & Settle', 'First Year in India']

const TASKS: Task[] = [
  // Phase 0 — Decide & Plan
  { id: 't01', phase: 0, title: 'Calculate financial runway', desc: 'Estimate India monthly costs; confirm 12–18 months buffer in savings', priority: 'critical', milestoneId: 'savings', isScoreImpact: true },
  { id: 't02', phase: 0, title: 'Research target cities', desc: 'Compare Hyderabad, Pune, Bangalore on cost, schools, and career', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't03', phase: 0, title: 'Book NRI CA consultation', desc: 'Calculate your exact RNOR window — do this 3–6 months before moving', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't04', phase: 0, title: 'Assess career situation', desc: 'Negotiate remote work, start India job search, or confirm business income', priority: 'critical', milestoneId: 'income', isScoreImpact: true },
  { id: 't06', phase: 0, title: 'Commit to a target city', desc: 'Without a city decision, nothing else can move forward', priority: 'critical', milestoneId: 'city', isScoreImpact: true },
  { id: 't07', phase: 0, title: 'Run What-If Simulator', desc: 'See how changing job, savings, or city affects your readiness score', priority: 'essential', milestoneId: null, isScoreImpact: false },
  // Phase 1 — Prepare & Execute
  { id: 't08', phase: 1, title: 'Confirm income in writing', desc: 'Job offer letter, remote work contract, or business revenue proof', priority: 'critical', milestoneId: 'income', isScoreImpact: true },
  { id: 't09', phase: 1, title: 'Apply to schools', desc: 'Good schools fill 12–18 months ahead — submit applications now', priority: 'critical', milestoneId: 'family', isScoreImpact: true },
  { id: 't10', phase: 1, title: 'Open NRE and NRO accounts', desc: 'Much easier to open while you still have a foreign address', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't11', phase: 1, title: 'Begin NRE fund transfers', desc: 'Systematic transfers before your residency changes', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't12', phase: 1, title: 'Arrange temporary housing', desc: 'Book a serviced apartment for 60–90 days as a bridge on arrival', priority: 'critical', milestoneId: 'housing', isScoreImpact: true },
  { id: 't13', phase: 1, title: 'Optimise RNOR return date', desc: 'Time your arrival with CA advice to maximise RNOR window', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't14', phase: 1, title: 'Purchase India health insurance', desc: 'Buy comprehensive cover before arrival — do not wait until after', priority: 'critical', milestoneId: null, isScoreImpact: false },
  { id: 't15', phase: 1, title: 'Apostille key documents', desc: 'Education, marriage, and property documents for India use', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't16', phase: 1, title: 'Research schools in target city', desc: 'Shortlist IGCSE and IB schools near your planned neighbourhood', priority: 'essential', milestoneId: null, isScoreImpact: false },
  // Phase 2 — Move & Settle
  { id: 't17', phase: 2, title: 'File Form 12A — Day 1 priority', desc: 'Cannot be backdated. Locks in RNOR status. Do this within 30 days of arriving.', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't18', phase: 2, title: 'Update KYC across all accounts', desc: 'Banks, mutual funds, insurance — all need your new India address', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't19', phase: 2, title: 'Confirm school start dates', desc: 'Collect uniforms, books, and arrange teacher introductions', priority: 'critical', milestoneId: 'family', isScoreImpact: true },
  { id: 't20', phase: 2, title: 'Find permanent housing', desc: 'Transition from serviced apartment to long-term rental or purchase', priority: 'critical', milestoneId: 'housing', isScoreImpact: true },
  { id: 't21', phase: 2, title: 'Set up local healthcare', desc: 'Identify GP, specialist network, and nearest quality hospital', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't22', phase: 2, title: 'Cancel US services', desc: 'Utilities, subscriptions, storage — eliminate recurring costs', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't23', phase: 2, title: 'Convert NRE account', desc: 'Check timing with CA before converting — affects tax treatment', priority: 'essential', milestoneId: null, isScoreImpact: false },
  // Phase 3 — First Year
  { id: 't24', phase: 3, title: 'File first India tax return as RNOR', desc: 'Ensure foreign income is classified correctly — use your NRI CA', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't25', phase: 3, title: 'Track RNOR residency days', desc: 'Count carefully each financial year — overstaying triggers full ROR status', priority: 'critical', milestoneId: null, isScoreImpact: false },
  { id: 't26', phase: 3, title: 'Restructure investment portfolio', desc: 'Rebalance for Indian tax residency — MF, NPS, ELSS, LTCG planning', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't27', phase: 3, title: 'Build local professional network', desc: 'LinkedIn India, alumni groups, industry events in your city', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't28', phase: 3, title: 'Annual financial review', desc: 'Review NRE conversion, tax liability, investment performance with CA', priority: 'essential', milestoneId: null, isScoreImpact: false },
]

// ─── STATE ────────────────────────────────────────────────────────────────────

type JourneyState = {
  step: 'profile' | 'journey'
  answers: Partial<Answers>
  completedTasks: Set<string>
  manualMilestones: Set<string>
  currentPhase: number
  lastMilestone: string | null
  firstName: string
}

const blankAnswers: Partial<Answers> = {}

type Action =
  | { type: 'SET_ANSWER'; key: keyof Answers; value: string }
  | { type: 'SET_MOVE_DATE'; value: string }
  | { type: 'START_JOURNEY' }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'TOGGLE_MILESTONE'; id: string }
  | { type: 'COMPLETE_PHASE'; phase: number }
  | { type: 'UNCOMPLETE_PHASE'; phase: number }
  | { type: 'SET_PHASE'; phase: number }
  | { type: 'SET_NAME'; name: string }

function journeyReducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.key]: action.value } }
    case 'SET_MOVE_DATE': {
      const timeline = moveDateToTimeline(action.value)
      const isPast = isMoveDatePast(action.value)
      return {
        ...state,
        answers: {
          ...state.answers,
          moveDate: action.value,
          timeline,
          alreadyMoved: isPast ? state.answers.alreadyMoved || '' : '',
        },
      }
    }
    case 'SET_NAME':
      return { ...state, firstName: action.name }
    case 'START_JOURNEY':
      return { ...state, step: 'journey' }
    case 'SET_PHASE':
      return { ...state, currentPhase: state.currentPhase === action.phase ? -1 : action.phase }
    case 'COMPLETE_PHASE': {
      const newTasks = new Set(state.completedTasks)
      let lastMilestone = state.lastMilestone
      TASKS.filter(t => t.phase === action.phase).forEach(t => {
        newTasks.add(t.id)
        if (t.milestoneId && t.isScoreImpact) lastMilestone = t.milestoneId
      })
      const nextPhase = action.phase + 1
      const hasNext = nextPhase < PHASES.length
      return { ...state, completedTasks: newTasks, lastMilestone, currentPhase: hasNext ? nextPhase : -1 }
    }
    case 'UNCOMPLETE_PHASE': {
      const newTasks = new Set(state.completedTasks)
      TASKS.filter(t => t.phase === action.phase).forEach(t => newTasks.delete(t.id))
      return { ...state, completedTasks: newTasks, currentPhase: action.phase }
    }
    case 'TOGGLE_MILESTONE': {
      const manualMs = new Set(state.manualMilestones || [])
      if (manualMs.has(action.id)) manualMs.delete(action.id)
      else manualMs.add(action.id)
      return { ...state, manualMilestones: manualMs, lastMilestone: manualMs.has(action.id) ? action.id : null }
    }
    case 'TOGGLE_TASK': {
      const newTasks = new Set(state.completedTasks)
      let lastMilestone = state.lastMilestone
      if (newTasks.has(action.id)) {
        newTasks.delete(action.id)
        lastMilestone = null
      } else {
        newTasks.add(action.id)
        const t = TASKS.find(x => x.id === action.id)
        if (t?.milestoneId && t.isScoreImpact) lastMilestone = t.milestoneId
      }
      return { ...state, completedTasks: newTasks, lastMilestone }
    }
    default:
      return state
  }
}

const initialState: JourneyState = {
  step: 'profile', answers: blankAnswers, completedTasks: new Set(),
  manualMilestones: new Set(), currentPhase: 0, lastMilestone: null, firstName: '',
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function journeyPct(completedTasks: Set<string>) {
  return Math.round((completedTasks.size / TASKS.length) * 100)
}

function getStatusMeta(total: number) {
  if (total >= 80) return { label: 'Ready to Return', color: T.green, bg: T.greenLight }
  if (total >= 55) return { label: 'Moderately Ready', color: '#CC7A00', bg: T.saffronLight }
  return { label: 'Not Ready Yet', color: T.red, bg: T.redLight }
}

function getVerdict(answers: Partial<Answers>, score: number): { icon: string; text: string; color: string } {
  const a = answers as Answers
  if (score >= 80 && !['no', 'searching'].includes(a.hasJob || '') && a.savings !== 'under50')
    return { icon: '✅', text: 'Move as planned — you are financially and logistically ready.', color: T.green }
  if (a.hasJob === 'no' && a.savings === 'under50')
    return { icon: '⏸️', text: 'Delay your move — confirm income and build savings to $75K+ first. Both gaps together are high-risk.', color: T.red }
  if (a.hasJob === 'no' || a.hasJob === 'searching')
    return { icon: '⚠️', text: 'Almost ready — confirm income before setting a departure date. This is the single highest-risk gap.', color: '#CC7A00' }
  if (a.savings === 'under50')
    return { icon: '⚠️', text: 'Build savings to $75K+ before moving. Financial pressure is the #1 reason NRI returns fail.', color: '#CC7A00' }
  return { icon: '⚠️', text: 'Good progress — close remaining gaps before committing to a firm move date.', color: '#CC7A00' }
}

// ─── POST-MOVE RECOMMENDATION — for users already in India ───────────────────

function getPostMoveRecommendation(A: Answers): { icon: string; title: string; text: string; actions: string[]; color: string; bg: string; border: string } {
  const noIncome = A.hasJob === 'no' || A.hasJob === 'searching'
  const lowSavings = A.savings === 'under50'
  const rnorBlind = A.knowsRNOR === 'no' || A.knowsRNOR === 'partial'
  const noHousing = A.housing === 'no' || A.housing === 'searching'
  const hasTeens = A.hasKids === 'yes' && A.kidsAge === 'teen'

  // Critical — income not sorted
  if (noIncome && lowSavings) return {
    icon: '🚨', color: '#C0392B', bg: '#FCEBEB', border: 'rgba(192,57,43,0.2)',
    title: 'Urgent: income and savings need immediate attention',
    text: 'You\'ve made the move — now the financial pressure is real. Without confirmed income and a savings buffer, the first 90 days will be stressful. This is the most important thing to fix right now.',
    actions: [
      'Activate your network immediately — referrals fill roles faster than job boards in India',
      'Freeze all non-essential spending until income is confirmed — protect every dollar of savings',
      'Explore interim remote consulting work with your former employer to bridge the gap',
    ],
  }

  if (noIncome) return {
    icon: '⚡', color: '#CC7A00', bg: T.saffronLight, border: T.saffronBorder,
    title: 'Focus everything on securing income — this is your #1 priority',
    text: 'You\'re settled in India — great. Now the clock is running on your savings. Job hunts in India take 2–4 months on average. The sooner you focus, the more runway you protect.',
    actions: [
      'Prioritise warm referrals over cold applications — most senior India roles fill via network',
      A.savings !== 'under50'
        ? 'Your savings give you 12+ months of runway — use this time confidently but urgently'
        : 'Build a 90-day budget and track every expense — know exactly where you stand each week',
      'Consider a remote consulting arrangement with your previous employer as a bridge income',
    ],
  }

  // RNOR critical — they may have missed the window
  if (rnorBlind) return {
    icon: '📊', color: '#000080', bg: '#EEF2FF', border: 'rgba(0,0,128,0.2)',
    title: 'File Form 12A immediately — every day you wait costs money',
    text: 'RNOR registration must happen within 30 days of your arrival date. If you haven\'t filed yet, this is your most urgent financial task. Missing this window permanently increases your tax liability by ₹18–40L.',
    actions: [
      'Contact an NRI-specialist CA today — not next week. The 30-day window from arrival is strict.',
      'Gather your passport entry stamps, travel history, and foreign income details for the filing',
      'Do not transfer large funds from your NRE account until RNOR status is confirmed',
    ],
  }

  if (noHousing) return {
    icon: '🏠', color: '#7C5CBF', bg: '#F3F0FF', border: 'rgba(124,92,191,0.2)',
    title: 'Sort permanent housing — everything else depends on it',
    text: 'Settling into a permanent home is the foundation for everything else — school commute, daily routine, and your family\'s sense of stability. Living in temporary accommodation adds daily friction that slows every other transition.',
    actions: [
      'Give yourself a hard deadline: permanent rental signed within 60 days of arrival',
      'Prioritise proximity to children\'s school over other preferences — commute shapes daily wellbeing',
      'Use a local broker who specialises in expat/NRI tenants — they know which landlords are flexible on deposits',
    ],
  }

  if (hasTeens) return {
    icon: '🏫', color: '#CC7A00', bg: T.saffronLight, border: T.saffronBorder,
    title: 'Your teenager\'s school transition is the critical variable right now',
    text: 'For families with teenagers, school adjustment shapes how the entire family feels about the move for years. Getting this right — right school, right curriculum, right timing — is worth more time than anything else on the list.',
    actions: [
      'Have a direct, honest conversation with your teenager about their adjustment — address concerns before they become resentment',
      'Research whether an IGCSE or IB school can accept a mid-term transfer — many have NRI-specific intake processes',
      'Give it 6 months before judging the school — the first term is almost always harder than it should be',
    ],
  }

  // All good
  return {
    icon: '✅', color: T.green, bg: T.greenLight, border: 'rgba(19,136,8,0.2)',
    title: 'You\'re well-positioned — focus on settling in fully',
    text: `You've handled the biggest risks. Income sorted, finances solid${A.knowsRNOR === 'yes_filed' ? ', RNOR filed' : ''}. The transition from here is about depth, not urgency — building routines, community, and feeling truly at home.`,
    actions: [
      'File your first India tax return as RNOR — ensure foreign income is classified correctly',
      'Start building your local professional network — alumni groups, industry events, LinkedIn India connections',
      'Do a 6-month financial review with your CA — rebalance investments for Indian tax residency',
    ],
  }
}

// ─── SELECT COMPONENT ─────────────────────────────────────────────────────────

function QSelect({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: { k: string; label: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '11px 36px 11px 14px',
          background: value ? T.saffronLight : T.white,
          border: `1.5px solid ${value ? T.saffron : T.border}`,
          borderRadius: 10, color: value ? T.ink : T.soft,
          fontFamily: 'DM Sans, sans-serif', fontSize: 14,
          outline: 'none', appearance: 'none' as const, cursor: 'pointer',
          transition: 'all 0.15s',
        }}>
        <option value="" disabled style={{ color: T.soft }}>Select an answer…</option>
        {opts.map(o => <option key={o.k} value={o.k} style={{ color: T.ink, background: '#fff' }}>{o.label}</option>)}
      </select>
      <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke={value ? T.saffron : T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── PROFILE SETUP ────────────────────────────────────────────────────────────

function ProfileSetup({ state, dispatch }: { state: JourneyState; dispatch: React.Dispatch<Action> }) {
  const visible = SETUP_QUESTIONS.filter(q => !q.skipIf || state.answers[q.skipIf.key] !== q.skipIf.value)
  const answered = visible.filter(q => state.answers[q.key]).length
  const moveDateAnswered = !!state.answers.moveDate
  const alreadyMovedRequired = isMoveDatePast(state.answers.moveDate || '')
  const alreadyMovedAnswered = !alreadyMovedRequired || !!state.answers.alreadyMoved
  const totalRequired = visible.length + 1 + (alreadyMovedRequired ? 1 : 0) // +1 for moveDate
  const totalAnswered = answered + (moveDateAnswered ? 1 : 0) + (alreadyMovedRequired && state.answers.alreadyMoved ? 1 : 0)
  const allDone = totalAnswered === totalRequired && !!state.firstName.trim()
  const progress = Math.round((totalAnswered / totalRequired) * 100)

  const isPast = isMoveDatePast(state.answers.moveDate || '')

  const sections: { name: string; qs: typeof SETUP_QUESTIONS }[] = []
  visible.forEach(q => {
    const last = sections[sections.length - 1]
    if (!last || last.name !== q.section) sections.push({ name: q.section, qs: [q] })
    else last.qs.push(q)
  })

  const sectionColor: Record<string, string> = {
    'Where You Are': T.saffron, 'Finances': T.green, 'Career': T.navy,
    'Family': '#7C5CBF', "Where You're Going": '#E0531A', 'Timeline': T.saffron, 'Tax Planning': '#7C5CBF',
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`select option{background:#fff;color:${T.ink}} select:focus{box-shadow:0 0 0 3px ${T.saffronBorder}}`}</style>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: T.white, border: `1px solid ${T.saffronBorder}`, borderRadius: 100, padding: '5px 14px', marginBottom: '1.25rem', boxShadow: '0 1px 8px rgba(255,153,51,.1)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.saffron }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: T.muted, letterSpacing: '.06em' }}>Back2India Journey · Personalised relocation system</span>
        </div>

        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.7rem,4vw,2.4rem)', color: T.ink, marginBottom: '.5rem', lineHeight: 1.2 }}>
          Set up your <em style={{ fontStyle: 'italic', color: T.saffron }}>journey profile</em>
        </h1>
        <p style={{ color: T.muted, fontSize: '.95rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Answer {visible.length} questions. We'll calculate your exact readiness score, identify your risks, and build your personalised action plan — using the same engine as the Readiness Check.
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '.5rem' }}>
          <div style={{ flex: 1, height: 4, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: T.saffron, borderRadius: 100, width: progress + '%', transition: 'width .3s ease' }} />
          </div>
          <span style={{ fontSize: 12, color: progress === 100 ? T.green : T.saffron, fontWeight: 600, flexShrink: 0 }}>
            {answered}/{visible.length}{progress === 100 ? ' ✓' : ''}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        {/* Name */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '0.6rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.saffron }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.1em' }}>Your Name</span>
          </div>
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.125rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: state.firstName ? T.ink : T.muted, display: 'block', marginBottom: 6 }}>What should we call you?</label>
            <input type="text" placeholder="Your first name" value={state.firstName}
              onChange={e => dispatch({ type: 'SET_NAME', name: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', background: state.firstName ? T.saffronLight : T.white, border: `1.5px solid ${state.firstName ? T.saffron : T.border}`, borderRadius: 10, color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
        </div>

        {/* Questions grouped by section */}
        {sections.map(section => (
          <div key={section.name} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '.6rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: sectionColor[section.name] || T.saffron }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.1em' }}>{section.name}</span>
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '1.125rem', boxShadow: '0 2px 8px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {section.qs.map(q => (
                <div key={q.key as string}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 14, fontWeight: 500, color: state.answers[q.key] ? T.ink : T.muted }}>{q.q}</label>
                    {state.answers[q.key] && <span style={{ fontSize: 11, color: T.green }}>✓</span>}
                  </div>
                  <QSelect value={state.answers[q.key] || ''} onChange={v => dispatch({ type: 'SET_ANSWER', key: q.key, value: v })} opts={q.opts} />
                  {!state.answers[q.key] && <div style={{ fontSize: 11, color: T.soft, marginTop: 4 }}>{q.hint}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── TIMELINE SECTION — premium calendar picker ── */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '.6rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.saffron }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.1em' }}>Timeline</span>
          </div>
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>

            {/* Header row */}
            <div style={{ padding: '1rem 1.25rem .875rem', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: state.answers.moveDate ? T.ink : T.muted }}>When are you planning to move to India?</span>
              {state.answers.moveDate && (
                <span style={{ fontSize: 12, fontWeight: 600, color: T.green, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="#138808"/><path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {state.answers.moveDate === 'exploring' ? 'Just exploring' : `${MONTHS_FULL[parseInt(state.answers.moveDate.split('-')[1]) - 1]} ${state.answers.moveDate.split('-')[0]}`}
                </span>
              )}
            </div>

            {/* Year selector */}
            <div style={{ padding: '.875rem 1.25rem .75rem', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.soft, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Year</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {getYearRange().map(y => {
                  const selYear = state.answers.moveDate && state.answers.moveDate !== 'exploring' ? parseInt(state.answers.moveDate.split('-')[0]) : null
                  const sel = selYear === y
                  return (
                    <button key={y} onClick={() => {
                      const mo = state.answers.moveDate && state.answers.moveDate !== 'exploring' ? state.answers.moveDate.split('-')[1] : String(new Date().getMonth() + 1).padStart(2, '0')
                      dispatch({ type: 'SET_MOVE_DATE', value: `${y}-${mo}` })
                    }} style={{
                      padding: '11px 0', borderRadius: 12, cursor: 'pointer', textAlign: 'center' as const,
                      fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, transition: 'all .15s',
                      border: `2px solid ${sel ? T.saffron : T.border}`,
                      background: sel ? T.saffron : T.white,
                      color: sel ? '#fff' : y < new Date().getFullYear() ? T.soft : T.ink,
                      boxShadow: sel ? '0 4px 14px rgba(255,153,51,.3)' : 'none',
                    }}>{y}</button>
                  )
                })}
              </div>
            </div>

            {/* Month grid */}
            <div style={{ padding: '.875rem 1.25rem 1rem' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.soft, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Month</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {MONTHS_FULL.map((m, idx) => {
                  const hasYear = !!(state.answers.moveDate && state.answers.moveDate !== 'exploring')
                  const selYear = hasYear ? parseInt(state.answers.moveDate!.split('-')[0]) : null
                  const selMonth = hasYear ? parseInt(state.answers.moveDate!.split('-')[1]) : null
                  const sel = selMonth === idx + 1
                  const now = new Date()
                  const isPast = selYear !== null && new Date(selYear, idx, 1) < new Date(now.getFullYear(), now.getMonth(), 1)
                  return (
                    <button key={m} disabled={!hasYear}
                      onClick={() => selYear && dispatch({ type: 'SET_MOVE_DATE', value: `${selYear}-${String(idx + 1).padStart(2, '0')}` })}
                      style={{
                        padding: '9px 4px 7px', borderRadius: 10, cursor: hasYear ? 'pointer' : 'not-allowed',
                        fontFamily: 'DM Sans, sans-serif', textAlign: 'center' as const, transition: 'all .15s', position: 'relative' as const,
                        fontSize: 13, fontWeight: sel ? 600 : 400,
                        border: `1.5px solid ${sel ? T.saffron : T.border}`,
                        background: sel ? T.saffronLight : isPast && hasYear ? '#F9F7F4' : !hasYear ? '#FAFAF8' : T.white,
                        color: sel ? T.ink : !hasYear ? '#D0CABC' : isPast ? T.soft : T.muted,
                        opacity: !hasYear ? 0.55 : 1,
                      }}>
                      <div>{m.slice(0, 3)}</div>
                      {isPast && hasYear && !sel && <div style={{ fontSize: 8, color: T.soft, marginTop: 1 }}>past</div>}
                      {sel && <div style={{ position: 'absolute', top: 4, right: 4, width: 5, height: 5, borderRadius: '50%', background: T.saffron }} />}
                    </button>
                  )
                })}
              </div>

              {/* Not sure option */}
              <button onClick={() => dispatch({ type: 'SET_MOVE_DATE', value: 'exploring' })}
                style={{
                  width: '100%', marginTop: 8, padding: '10px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 500, textAlign: 'center' as const,
                  border: `1.5px dashed ${state.answers.moveDate === 'exploring' ? T.saffron : T.border}`,
                  background: state.answers.moveDate === 'exploring' ? T.saffronLight : 'transparent',
                  color: state.answers.moveDate === 'exploring' ? T.ink : T.muted, transition: 'all .15s',
                }}>
                🤔 &nbsp;Not sure yet — just exploring
              </button>

              {/* Hint */}
              {state.answers.moveDate && state.answers.moveDate !== 'exploring' && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.saffron, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: T.muted }}>
                    Scored as: <strong style={{ color: T.ink, fontWeight: 600 }}>
                      {state.answers.timeline === 'within6' ? 'Within 6 months' : state.answers.timeline === '6to12' ? '6–12 months' : '1–2 years'}
                    </strong>
                    {isMoveDatePast(state.answers.moveDate) && <span style={{ color: '#CC7A00' }}> · past date</span>}
                  </span>
                </div>
              )}
            </div>

            {/* Already moved — shown when past date selected */}
            {isMoveDatePast(state.answers.moveDate || '') && state.answers.moveDate && (
              <div style={{ borderTop: `1px solid ${T.border}`, padding: '1rem 1.25rem', background: '#FFFBF5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#CC7A00', background: T.saffronLight, border: `1px solid ${T.saffronBorder}`, padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
                    ✋ That date has passed
                  </span>
                  {state.answers.alreadyMoved && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="6.5" fill="#138808"/><path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.muted, marginBottom: 10 }}>Have you already moved to India?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ k: 'yes', icon: '🇮🇳', line1: 'Yes — I\'ve moved', line2: 'I\'m in India now' }, { k: 'no', icon: '⏳', line1: 'Not yet', line2: 'Still planning' }].map(opt => (
                    <button key={opt.k} onClick={() => dispatch({ type: 'SET_ANSWER', key: 'alreadyMoved', value: opt.k })}
                      style={{
                        padding: '14px 10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center' as const,
                        fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
                        border: `2px solid ${state.answers.alreadyMoved === opt.k ? T.saffron : T.border}`,
                        background: state.answers.alreadyMoved === opt.k ? T.saffronLight : T.white,
                        boxShadow: state.answers.alreadyMoved === opt.k ? '0 2px 12px rgba(255,153,51,.2)' : 'none',
                      }}>
                      <div style={{ fontSize: 22, marginBottom: 5 }}>{opt.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: state.answers.alreadyMoved === opt.k ? T.ink : T.muted }}>{opt.line1}</div>
                      <div style={{ fontSize: 11, color: T.soft, marginTop: 2 }}>{opt.line2}</div>
                    </button>
                  ))}
                </div>
                {state.answers.alreadyMoved === 'yes' && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: T.greenLight, borderRadius: 10, fontSize: 12, color: '#27500A', lineHeight: 1.55 }}>
                    🎉 Welcome back! Your dashboard focuses on settling in and your first year.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        {allDone ? (
          <button onClick={() => dispatch({ type: 'START_JOURNEY' })}
            style={{ width: '100%', padding: 15, background: T.saffron, color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,.4)' }}>
            Start My Journey Dashboard →
          </button>
        ) : (
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
            <span style={{ fontSize: '1.2rem' }}>📋</span>
            <div>
              <div style={{ fontSize: 13, color: T.muted }}>Answer all questions + your name to start</div>
              <div style={{ fontSize: 11, color: T.soft, marginTop: 2 }}>{totalRequired - totalAnswered} question{totalRequired - totalAnswered !== 1 ? 's' : ''} remaining</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── JOURNEY DASHBOARD ────────────────────────────────────────────────────────

function JourneyDashboard({ state, dispatch }: { state: JourneyState; dispatch: React.Dispatch<Action> }) {
  const [tab, setTab] = useState<'overview' | 'tasks'>('overview')
  const [changedBanner, setChangedBanner] = useState<{ ms: Milestone; prevScore: number; newScore: number } | null>(null)
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevScoreRef = useRef<number | null>(null)

  const A = state.answers as Answers
  const alreadyMoved = A.alreadyMoved === 'yes'

  // Milestone completion: answers + task completions + manual toggles
  const msCompleted = useMemo(() => new Set(
    MILESTONES.filter(m =>
      m.completedWhen(A) ||
      TASKS.filter(t => t.milestoneId === m.id && t.isScoreImpact).some(t => state.completedTasks.has(t.id)) ||
      state.manualMilestones.has(m.id)
    ).map(m => m.id)
  ), [state.answers, state.completedTasks, state.manualMilestones])

  // Score: base from answers + bonus pts from milestones completed beyond what answers alone give
  const scoreBreakdown = useMemo(() => {
    const base = computeScore(A)
    // Add points for milestones that are completed (manually or via tasks) but NOT already captured by answers
    let bonus = 0
    MILESTONES.forEach(m => {
      const inScore = m.completedWhen(A)
      const manualOrTask = state.manualMilestones.has(m.id) ||
        TASKS.filter(t => t.milestoneId === m.id && t.isScoreImpact).some(t => state.completedTasks.has(t.id))
      if (!inScore && manualOrTask) bonus += m.scoreImpact
    })
    const total = Math.min(100, base.total + bonus)
    return { ...base, total }
  }, [state.answers, state.completedTasks, state.manualMilestones])

  const score = scoreBreakdown.total

  // Auto-complete tasks based on profile answers
  const autoCompletedTasks = useMemo(() => {
    const auto = new Set<string>()
    TASKS.forEach(t => {
      if (!t.milestoneId) return
      const ms = MILESTONES.find(m => m.id === t.milestoneId)
      if (ms && ms.completedWhen(A)) auto.add(t.id)
    })
    // Also auto-complete specific tasks based on answers
    if (['owned', 'arranged'].includes(A.housing)) {
      // Housing arranged — mark arrange temp housing as done
      auto.add('t12')
    }
    if (['yes_filed', 'yes_aware'].includes(A.knowsRNOR)) {
      auto.add('t03') // CA consultation booked
    }
    if (A.city && A.city !== 'undecided') {
      auto.add('t06') // committed to city
      auto.add('t02') // researched cities
    }
    if (['remote_us', 'own_business', 'india_job'].includes(A.hasJob)) {
      auto.add('t04') // assessed career
      auto.add('t08') // confirmed income in writing
    }
    if (A.hasKids === 'no') {
      // No kids — school tasks not applicable, mark them done
      auto.add('t07') // run simulator
      auto.add('t09') // apply to schools — not applicable
    }
    return auto
  }, [state.answers])

  // Effective completed tasks = manual completions ∪ auto-completed from answers
  const effectiveCompletedTasks = useMemo(() => {
    const merged = new Set(state.completedTasks)
    autoCompletedTasks.forEach(id => merged.add(id))
    return merged
  }, [state.completedTasks, autoCompletedTasks])

  const statusMeta = useMemo(() => getStatusMeta(score), [score])
  const verdict = useMemo(() => getVerdict(state.answers, score), [state.answers, score])
  const pct = useMemo(() => journeyPct(effectiveCompletedTasks), [effectiveCompletedTasks])
  const completedMsCount = msCompleted.size
  const highImpact = MILESTONES.find(m => !msCompleted.has(m.id))

  // Auto-set phase to Move & Settle if already moved
  useEffect(() => {
    if (alreadyMoved && state.currentPhase < 2) {
      dispatch({ type: 'SET_PHASE', phase: 2 })
    }
  }, [alreadyMoved])
  useEffect(() => {
    if (state.lastMilestone) {
      const ms = MILESTONES.find(m => m.id === state.lastMilestone)
      if (ms && prevScoreRef.current !== null) {
        setChangedBanner({ ms, prevScore: prevScoreRef.current, newScore: score })
        if (bannerTimer.current) clearTimeout(bannerTimer.current)
        bannerTimer.current = setTimeout(() => setChangedBanner(null), 5000)
      }
    }
    prevScoreRef.current = score
  }, [state.lastMilestone, score])

  const scoreSegments = [
    { label: 'Financial', s: scoreBreakdown.financial, max: 40, color: T.saffron },
    { label: 'Life', s: scoreBreakdown.lifeComplexity, max: 25, color: '#7C5CBF' },
    { label: 'Career', s: scoreBreakdown.career, max: 20, color: T.green },
    { label: 'Planning', s: scoreBreakdown.planning, max: 20, color: T.navy },
  ]

  const iStyle = { fontFamily: 'DM Sans, sans-serif' }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .slide-in{animation:slideIn .35s ease both}
        .task-check{transition:all .15s}
        .task-check:hover{opacity:.8}
        select option{background:#fff;color:${T.ink}}
      `}</style>

      {/* ── DARK HEADER ── */}
      <div style={{ background: '#1A1208', padding: '2rem 1.5rem 1.75rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Back2India Journey</div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.2rem,3vw,1.8rem)', color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
                {state.firstName ? `${state.firstName}'s` : 'Your'} Relocation Dashboard
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 }}>
                {completedMsCount} of {MILESTONES.length} milestones complete · {effectiveCompletedTasks.size} of {TASKS.length} tasks done
                {A.moveDate && A.moveDate !== 'exploring' && (
                  <span> · {alreadyMoved ? '✅ Moved' : '📅 Moving'} {MONTHS[parseInt(A.moveDate.split('-')[1]) - 1]} {A.moveDate.split('-')[0]}</span>
                )}
              </p>
            </div>
            {/* Headline numbers — readiness hidden for already-moved users */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                ...(!alreadyMoved ? [{ label: 'Readiness', val: score + '/100', color: statusMeta.color }] : []),
                { label: 'Journey', val: pct + '%', color: '#4ADE80' },
                { label: 'Milestones', val: `${completedMsCount}/${MILESTONES.length}`, color: '#60A5FA' },
                ...(alreadyMoved ? [{ label: 'Status', val: 'In India', color: '#4ADE80' }] : []),
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>

        {/* ALREADY MOVED banner */}
        {alreadyMoved && (
          <div style={{ background: T.greenLight, border: `1.5px solid rgba(19,136,8,.25)`, borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🎉</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#27500A', marginBottom: 2 }}>
                You&apos;ve made the move
                {A.moveDate && A.moveDate !== 'exploring' ? ` — ${MONTHS[parseInt(A.moveDate.split('-')[1]) - 1]} ${A.moveDate.split('-')[0]}` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#27500A', opacity: .8, lineHeight: 1.5 }}>
                Your dashboard is focused on settling-in tasks and first-year actions. Welcome back to India!
              </div>
            </div>
          </div>
        )}

        {/* WHAT CHANGED banner */}
        {changedBanner && (
          <div className="slide-in" style={{ background: T.greenLight, border: `1px solid rgba(19,136,8,.2)`, borderRadius: 12, padding: '.875rem 1.125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{changedBanner.ms.icon}</span>
            <div style={{ fontSize: 13, color: '#27500A' }}>
              <strong>Milestone unlocked: {changedBanner.ms.label}</strong>
              {' — '}Score improved {changedBanner.prevScore} → {changedBanner.newScore}/100
            </div>
            <button onClick={() => setChangedBanner(null)} style={{ marginLeft: 'auto', color: '#27500A', opacity: .5, fontSize: 16, cursor: 'pointer', background: 'none', border: 'none' }}>×</button>
          </div>
        )}

        {/* RECOMMENDATION — different for pre/post move */}
        {alreadyMoved ? (() => {
          const pm = getPostMoveRecommendation(A)
          return (
            <div style={{ background: pm.bg, border: `1.5px solid ${pm.border}`, borderRadius: 14, padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: pm.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>What to focus on now</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{pm.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: pm.color, marginBottom: 4, lineHeight: 1.4 }}>{pm.title}</div>
                  <div style={{ fontSize: 13, color: pm.color, lineHeight: 1.65, opacity: .88 }}>{pm.text}</div>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${pm.border}`, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pm.actions.map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 17, height: 17, borderRadius: '50%', background: pm.color, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: pm.color, lineHeight: 1.55, opacity: .85 }}>{a}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })() : (
          <div style={{
            background: T.white, border: `1.5px solid`,
            borderColor: verdict.icon === '✅' ? 'rgba(19,136,8,.25)' : verdict.icon === '⏸️' ? 'rgba(192,57,43,.2)' : T.saffronBorder,
            borderRadius: 14, padding: '1.125rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{verdict.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: verdict.color, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Recommendation</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.ink, lineHeight: 1.6 }}>{verdict.text}</div>
            </div>
            <Link href="/planner" style={{ marginLeft: 'auto', fontSize: 12, color: T.saffron, textDecoration: 'none', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
              Full analysis →
            </Link>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {([['overview', 'Overview'], ['tasks', 'Journey Progress']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k as any)}
              style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
                background: tab === k ? T.white : 'transparent',
                color: tab === k ? T.ink : T.muted,
                border: `1px solid ${tab === k ? T.border : 'transparent'}`,
                boxShadow: tab === k ? '0 1px 4px rgba(0,0,0,.06)' : 'none',
              }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className="slide-in" style={{ display: 'grid', gap: '1rem' }}>

            {/* Top row: score ring (or moved card) + highest impact */}
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>

              {/* Score ring (pre-move) | Journey progress card (post-move) */}
              {alreadyMoved ? (
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', paddingBottom: '1rem', borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>🇮🇳</span>
                    <div>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.05rem', color: T.green, lineHeight: 1.2 }}>
                        You&apos;re in India{A.moveDate && A.moveDate !== 'exploring' ? ` — since ${MONTHS_FULL[parseInt(A.moveDate.split('-')[1]) - 1]} ${A.moveDate.split('-')[0]}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: '#27500A', opacity: .75, marginTop: 2 }}>Settling in &amp; first year</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Journey Progress</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2.2rem', color: T.green }}>{pct}%</span>
                    <span style={{ fontSize: 12, color: T.muted }}>{effectiveCompletedTasks.size} of {TASKS.length} tasks</span>
                  </div>
                  <div style={{ height: 7, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ height: '100%', background: T.green, width: pct + '%', borderRadius: 100, transition: 'width .6s ease' }} />
                  </div>
                  {[2, 3].map(i => {
                    const pt = TASKS.filter(t => t.phase === i)
                    const dn = pt.filter(t => effectiveCompletedTasks.has(t.id)).length
                    const pp = pt.length ? Math.round((dn / pt.length) * 100) : 0
                    return (
                      <div key={PHASES[i]} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.muted, marginBottom: 3 }}>
                          <span style={{ fontWeight: 500 }}>{PHASES[i]}</span><span>{dn}/{pt.length}</span>
                        </div>
                        <div style={{ height: 4, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: T.green, width: pp + '%', borderRadius: 100 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <svg width="108" height="108" viewBox="0 0 108 108">
                    {(() => { const r = 44, circ = 2 * Math.PI * r, p = score / 100; return <>
                      <circle cx="54" cy="54" r={r} fill="none" stroke="#EDE9E0" strokeWidth="8" />
                      <circle cx="54" cy="54" r={r} fill="none" stroke={statusMeta.color} strokeWidth="8"
                        strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} strokeLinecap="round" transform="rotate(-90 54 54)"
                        style={{ transition: 'stroke-dashoffset .8s ease' }} />
                      <text x="54" y="50" textAnchor="middle" fontSize="26" fontWeight="600" fill={statusMeta.color} fontFamily="inherit">{score}</text>
                      <text x="54" y="67" textAnchor="middle" fontSize="12" fill={T.soft} fontFamily="inherit">/ 100</text>
                    </> })()}
                  </svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Readiness Score</div>
                    <div style={{ display: 'inline-block', background: statusMeta.bg, color: statusMeta.color, fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 100, marginBottom: 12 }}>{statusMeta.label}</div>
                    {scoreSegments.map(s => (
                      <div key={s.label} style={{ marginBottom: 7 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.soft, marginBottom: 3 }}>
                          <span>{s.label}</span><span style={{ fontWeight: 600, color: s.color }}>{s.s}/{s.max}</span>
                        </div>
                        <div style={{ height: 3, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: s.color, width: Math.round((s.s / s.max) * 100) + '%', borderRadius: 100 }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.soft, marginBottom: 4 }}>
                        <span>Total</span>
                        <span style={{ fontWeight: 700, color: statusMeta.color }}>{score}/100</span>
                      </div>
                      <div style={{ height: 5, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: statusMeta.color, width: score + '%', borderRadius: 100, transition: 'width .6s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                        {[0,25,50,75,100].map(v => <span key={v} style={{ fontSize: 9, color: T.soft }}>{v}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Highest impact / post-move priority */}
              {!alreadyMoved && highImpact && (
                <div style={{ background: '#1A1208', borderRadius: 16, padding: '1.25rem 1.5rem', color: '#fff' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>Highest impact action</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{highImpact.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: T.saffron, lineHeight: 1.3 }}>{highImpact.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.6, marginBottom: 14 }}>{highImpact.description}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,153,51,.12)', border: '1px solid rgba(255,153,51,.25)', borderRadius: 100, padding: '5px 14px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.saffron }}>+{highImpact.scoreImpact} pts to score</span>
                  </div>
                </div>
              )}
              {alreadyMoved && (() => {
                const pm = getPostMoveRecommendation(A)
                return (
                  <div style={{ background: '#1A1208', borderRadius: 16, padding: '1.25rem 1.5rem', color: '#fff' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'rgba(255,255,255,.35)', marginBottom: 8 }}>Top priority right now</div>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{pm.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', lineHeight: 1.4, marginBottom: 8 }}>{pm.title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>{pm.actions[0]}</div>
                  </div>
                )
              })()}
            </div>

            {/* Risk insight */}
            {!alreadyMoved && verdict.icon !== '✅' && highImpact && (
              <div style={{ background: T.saffronLight, border: `1px solid ${T.saffronBorder}`, borderRadius: 12, padding: '.875rem 1.125rem' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Key Risk</div>
                <div style={{ fontWeight: 500, color: '#7D5300', marginBottom: 4 }}>{highImpact.label} — pending</div>
                <div style={{ fontSize: 13, color: '#7D5300', lineHeight: 1.6, opacity: .85 }}>{highImpact.description}</div>
              </div>
            )}

            {/* ── MILESTONE CARDS — clickable, full width ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '.08em' }}>Milestones</div>
                <div style={{ fontSize: 12, color: T.muted }}>{msCompleted.size}/{MILESTONES.length} complete</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '.75rem' }}>
                {MILESTONES.map(m => {
                  const done = msCompleted.has(m.id)
                  const autoDetected = m.completedWhen(A)
                  return (
                    <div key={m.id}
                      onClick={() => !autoDetected && dispatch({ type: 'TOGGLE_MILESTONE', id: m.id })}
                      style={{
                        borderRadius: 14, padding: '1rem 1.125rem',
                        border: `1.5px solid ${done ? 'rgba(19,136,8,.3)' : T.border}`,
                        background: done ? T.greenLight : T.white,
                        cursor: autoDetected ? 'default' : 'pointer',
                        transition: 'all .2s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{m.icon}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: done ? '#27500A' : T.ink }}>{m.label}</span>
                        </div>
                        {/* Checkbox */}
                        <div style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          border: `1.5px solid ${done ? T.green : T.border}`,
                          background: done ? T.green : T.white,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: 6,
                          boxShadow: done ? '0 1px 6px rgba(19,136,8,.2)' : 'none',
                          transition: 'all .15s',
                        }}>
                          {done && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: done ? '#27500A' : T.muted, lineHeight: 1.5, marginBottom: 8, opacity: done ? .85 : 1 }}>{m.description}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {autoDetected
                          ? <span style={{ fontSize: 10, color: done ? '#27500A' : T.soft, background: done ? 'rgba(19,136,8,.1)' : '#F0EDE8', padding: '2px 8px', borderRadius: 100, fontWeight: 500 }}>Auto-detected</span>
                          : <span style={{ fontSize: 10, color: T.soft, fontStyle: 'italic' }}>{done ? 'Marked complete' : 'Click to mark complete'}</span>
                        }
                        {!alreadyMoved && <span style={{ fontSize: 11, fontWeight: 600, color: done ? T.green : T.soft, background: done ? 'rgba(19,136,8,.1)' : T.bg, padding: '2px 8px', borderRadius: 100 }}>+{m.scoreImpact} pts</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}


        {/* ── JOURNEY PROGRESS TAB ── */}
        {tab === 'tasks' && (
          <div className="slide-in" style={{ display: 'grid', gap: '1rem' }}>

            {/* Overall progress bar */}
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '.06em' }}>Overall Journey</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', color: T.green }}>{pct}%</div>
              </div>
              {(() => {
                const visiblePhases = alreadyMoved ? [2, 3] : [0, 1, 2, 3]
                const visibleTasks = TASKS.filter(t => visiblePhases.includes(t.phase))
                const visibleDone = visibleTasks.filter(t => effectiveCompletedTasks.has(t.id)).length
                const visiblePct = visibleTasks.length ? Math.round((visibleDone / visibleTasks.length) * 100) : 0
                return (
                  <>
                    <div style={{ fontSize: 12, color: T.muted, marginBottom: 10 }}>
                      {alreadyMoved
                        ? `${visibleDone} of ${visibleTasks.length} post-move tasks complete`
                        : `${effectiveCompletedTasks.size} of ${TASKS.length} tasks complete`}
                    </div>
                    <div style={{ height: 8, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ height: '100%', background: T.green, width: (alreadyMoved ? visiblePct : pct) + '%', borderRadius: 100, transition: 'width .5s ease' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visiblePhases.length},1fr)`, gap: '8px 16px' }}>
                      {visiblePhases.map((i, idx) => {
                        const pt = TASKS.filter(t => t.phase === i)
                        const dn = pt.filter(t => effectiveCompletedTasks.has(t.id)).length
                        const pp = pt.length ? Math.round((dn / pt.length) * 100) : 0
                        return (
                          <div key={PHASES[i]} onClick={() => dispatch({ type: 'SET_PHASE', phase: i })} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: i === state.currentPhase ? T.ink : T.soft, marginBottom: 3, fontWeight: i === state.currentPhase ? 600 : 400 }}>
                              <span>{PHASES[i]}</span><span>{dn}/{pt.length}</span>
                            </div>
                            <div style={{ height: 4, background: '#EDE9E0', borderRadius: 100, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: i === state.currentPhase ? T.saffron : T.green, width: pp + '%', borderRadius: 100, transition: 'width .4s ease' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 12, color: T.muted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: T.saffron, display: 'inline-block' }} />
                Critical
              </span>
              {!alreadyMoved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: T.navy, display: 'inline-block' }} />
                  Affects score
                </span>
              )}
            </div>

            {/* Phase accordions — gated: each phase unlocks only after previous is complete */}
            {PHASES.map((phase, i) => {
              if (alreadyMoved && i < 2) return null
              const tasks = TASKS.filter(t => t.phase === i)
              const done = tasks.filter(t => effectiveCompletedTasks.has(t.id)).length
              const allDone = done === tasks.length && tasks.length > 0
              const isActive = i === state.currentPhase

              // Determine if this phase is unlocked
              const firstPhase = alreadyMoved ? 2 : 0
              const prevTasks = i > firstPhase ? TASKS.filter(t => t.phase === i - 1) : []
              const prevAllDone = i === firstPhase || prevTasks.every(t => effectiveCompletedTasks.has(t.id))
              const isLocked = !prevAllDone

              return (
                <div key={phase} style={{
                  border: `1px solid ${isLocked ? '#EDE9E0' : allDone ? 'rgba(19,136,8,.2)' : T.border}`,
                  borderRadius: 14, overflow: 'hidden',
                  opacity: isLocked ? 0.55 : 1,
                  transition: 'opacity .2s',
                }}>
                  {/* Phase header */}
                  <div
                    onClick={() => !isLocked && dispatch({ type: 'SET_PHASE', phase: i })}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '.875rem 1.25rem',
                      background: isActive ? '#1A1208' : allDone ? T.greenLight : T.bg,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {/* Phase number / completion indicator */}
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        background: isActive ? T.saffron : allDone ? T.green : isLocked ? '#EDE9E0' : T.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                        color: isActive ? '#1A1208' : allDone ? '#fff' : T.soft,
                      }}>
                        {allDone
                          ? <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : isLocked
                            ? <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><rect x="2" y="5" width="7" height="7" rx="1.5" stroke={T.soft} strokeWidth="1.4"/><path d="M3.5 5V3.5a2 2 0 014 0V5" stroke={T.soft} strokeWidth="1.4" strokeLinecap="round"/></svg>
                            : i + 1}
                      </div>
                      <div>
                        <span style={{ fontSize: 14, fontWeight: 500, color: isActive ? '#fff' : allDone ? '#27500A' : T.ink }}>{phase}</span>
                        {isLocked && <div style={{ fontSize: 10, color: T.soft, marginTop: 1 }}>Complete previous phase to unlock</div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,.4)' : allDone ? '#27500A' : T.soft }}>{done}/{tasks.length}</span>

                      {!isLocked && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                          <path d="M2 4l4 4 4-4" stroke={isActive ? 'rgba(255,255,255,.4)' : allDone ? '#27500A' : T.soft} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Task list — only shown when active and not locked */}
                  {isActive && !isLocked && (
                    <div style={{ background: T.white }}>
                      {tasks.map((t, ti) => {
                        const isDone = effectiveCompletedTasks.has(t.id)
                        const isAuto = autoCompletedTasks.has(t.id)
                        const showScoreBadge = i < 2 && !alreadyMoved
                        return (
                          <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 1.25rem', borderTop: ti === 0 ? 'none' : `1px solid ${T.border}`, background: isAuto ? '#FAFFF9' : T.white }}>
                            <div
                              onClick={() => !isAuto && dispatch({ type: 'TOGGLE_TASK', id: t.id })}
                              title={isAuto ? 'Auto-completed from your profile' : undefined}
                              style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${isDone ? (isAuto ? '#6DBD6D' : T.green) : t.priority === 'critical' ? T.saffron : T.border}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAuto ? 'default' : 'pointer', marginTop: 1, background: isDone ? (isAuto ? '#6DBD6D' : T.green) : 'transparent', transition: 'all .15s', opacity: isAuto ? 0.7 : 1 }}>
                              {isDone && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 500, color: isDone ? T.soft : T.ink, textDecoration: isDone ? 'line-through' : 'none' }}>{t.title}</span>
                                {isAuto && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: T.greenLight, color: T.green, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>Auto</span>}
                                {!isAuto && t.priority === 'critical' && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: T.saffronLight, color: '#CC7A00', textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>Critical</span>}
                                {showScoreBadge && t.isScoreImpact && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: T.navyLight, color: T.navy, textTransform: 'uppercase' as const, letterSpacing: '.05em' }}>Score</span>}
                              </div>
                              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{t.desc}</div>
                            </div>
                          </div>
                        )
                      })}
                      {/* Phase footer — always visible, toggles complete/incomplete */}
                      <div style={{ padding: '10px 1.25rem', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAF8' }}>
                        <span style={{ fontSize: 12, color: allDone ? T.green : T.muted, fontWeight: allDone ? 500 : 400 }}>
                          {allDone ? 'All tasks complete ✓' : `${tasks.length - done} task${tasks.length - done !== 1 ? 's' : ''} remaining`}
                        </span>
                        <button
                          onClick={() => dispatch({ type: allDone ? 'UNCOMPLETE_PHASE' : 'COMPLETE_PHASE', phase: i })}
                          style={{ fontSize: 12, fontWeight: 600, color: allDone ? T.muted : T.saffron, background: allDone ? T.bg : T.saffronLight, border: `1px solid ${allDone ? T.border : T.saffronBorder}`, borderRadius: 100, padding: '5px 14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .15s' }}>
                          {allDone ? '← Unmark all' : 'Mark all complete →'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            <button onClick={() => window.location.reload()}
              style={{ background: 'none', border: `1px solid ${T.border}`, color: T.muted, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', width: '100%', textAlign: 'center' as const, padding: '.875rem', borderRadius: 10 }}>
              ← Reset journey &amp; update profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function JourneyPage() {
  const { shouldBlock } = useProtectedRoute()

  const [state, dispatch] = useReducer(journeyReducer, initialState)
  if (shouldBlock) return null

  if (state.step === 'profile') return <ProfileSetup state={state} dispatch={dispatch} />
  return <JourneyDashboard state={state} dispatch={dispatch} />
}
