'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Answers = {
  country: string
  savings: string
  yearsAbroad: string
  hasKids: string
  kidsAge: string
  hasJob: string
  city: string
  timeline: string
  knowsRNOR: string
  housing: string
  moveDate: string
  alreadyMoved: string
}

const CITY_BASE: Record<string, number> = {
  Hyderabad: 180000,
  Bangalore: 240000,
  Pune: 160000,
  Chennai: 170000,
  Mumbai: 280000,
  Other: 185000,
  undecided: 185000,
}

const SAVINGS_USD: Record<string, number> = {
  '200000+': 200000,
  '100000': 150000,
  '50000': 75000,
  'under50': 35000,
}

function calcRunwayMonths(savings: string, city: string): number {
  const monthly = CITY_BASE[city] || 185000
  return Math.round(((SAVINGS_USD[savings] || 75000) * 83) / monthly)
}

type ScoreBreakdown = {
  financial: number
  lifeComplexity: number
  career: number
  planning: number
  total: number
}

function computeScore(A: Answers): ScoreBreakdown {
  let financial = 0
  let life = 0
  let career = 0
  let planning = 0

  if (A.savings === '200000+') financial += 20
  else if (A.savings === '100000') financial += 15
  else if (A.savings === '50000') financial += 10
  else financial += 5

  if (A.yearsAbroad === '10+' || A.yearsAbroad === '7') financial += 10
  else if (A.yearsAbroad === '5') financial += 7
  else if (A.yearsAbroad === '3') financial += 5
  else financial += 2

  if (A.country === 'USA' || A.country === 'UK') financial += 5
  else if (A.country === 'UAE') financial += 4
  else financial += 3

  const runway = calcRunwayMonths(A.savings, A.city)
  if (runway >= 30) financial += 5
  else if (runway >= 24) financial += 4
  else if (runway >= 18) financial += 3
  else if (runway >= 12) financial += 2
  else financial += 1

  if (A.hasKids === 'no') life += 15
  else life += 8

  if (A.hasKids === 'no') life += 7
  else if (A.kidsAge === 'under5') life += 6
  else if (A.kidsAge === '5to12') life += 4
  else if (A.kidsAge === 'adult') life += 6
  else life += 2

  if (A.housing === 'owned') life += 3
  else if (A.housing === 'arranged') life += 2

  if (A.hasJob === 'remote_us') career = 20
  else if (A.hasJob === 'own_business') career = 17
  else if (A.hasJob === 'india_job') career = 15
  else if (A.hasJob === 'searching') career = 8
  else career = 4

  if (A.city && A.city !== 'undecided') planning += 6
  else planning += 2

  if (A.timeline === 'within6') planning += 6
  else if (A.timeline === '6to12') planning += 5
  else if (A.timeline === '1to2') planning += 4
  else planning += 2

  if (A.knowsRNOR === 'yes_filed') planning += 8
  else if (A.knowsRNOR === 'yes_aware') planning += 5
  else if (A.knowsRNOR === 'partial') planning += 3
  else planning += 1

  return {
    financial,
    lifeComplexity: life,
    career,
    planning,
    total: Math.min(100, financial + life + career + planning),
  }
}

const T = {
  paper: '#fffdf9',
  white: '#ffffff',
  ink: '#1d160f',
  muted: '#665848',
  soft: '#9d907f',
  border: 'rgba(29,22,15,0.10)',
  borderStrong: 'rgba(29,22,15,0.16)',
  saffron: '#f08a24',
  saffronSoft: '#fff1de',
  green: '#17753a',
  greenSoft: '#e8f4eb',
  navy: '#173e8f',
  navySoft: '#eaf0ff',
  rose: '#a64935',
  roseSoft: '#f7e8e4',
  bronze: '#8d5c22',
  hero:
    'radial-gradient(circle at top left, rgba(240,138,36,0.16), transparent 34%), radial-gradient(circle at 85% 18%, rgba(23,117,58,0.14), transparent 25%), linear-gradient(180deg, #fffaf3 0%, #f5efe6 54%, #f2eadf 100%)',
  dark: 'linear-gradient(135deg, #20160f 0%, #302117 46%, #173e2c 100%)',
}

type Milestone = {
  id: string
  label: string
  icon: string
  scoreImpact: number
  pillar: string
  description: string
  answerKey: keyof Answers
  completedWhen: (a: Answers) => boolean
}

const MILESTONES: Milestone[] = [
  {
    id: 'income',
    label: 'Income secured',
    icon: 'Income',
    scoreImpact: 20,
    pillar: 'Career',
    description: 'Job offer, remote contract, or business income confirmed in writing before moving.',
    answerKey: 'hasJob',
    completedWhen: (a) => ['remote_us', 'own_business', 'india_job'].includes(a.hasJob),
  },
  {
    id: 'savings',
    label: 'Financial runway',
    icon: 'Cash',
    scoreImpact: 15,
    pillar: 'Financial',
    description: '$100K or more in liquid savings, with at least 18 months of runway.',
    answerKey: 'savings',
    completedWhen: (a) => ['200000+', '100000'].includes(a.savings),
  },
  {
    id: 'rnor',
    label: 'Tax strategy ready',
    icon: 'Tax',
    scoreImpact: 8,
    pillar: 'Planning',
    description: 'RNOR timing is understood and a specialist CA conversation is booked or done.',
    answerKey: 'knowsRNOR',
    completedWhen: (a) => ['yes_filed', 'yes_aware'].includes(a.knowsRNOR),
  },
  {
    id: 'housing',
    label: 'Housing planned',
    icon: 'Home',
    scoreImpact: 3,
    pillar: 'Life',
    description: 'A home is owned or temporary housing has already been arranged.',
    answerKey: 'housing',
    completedWhen: (a) => ['owned', 'arranged'].includes(a.housing),
  },
  {
    id: 'city',
    label: 'City decided',
    icon: 'City',
    scoreImpact: 6,
    pillar: 'Planning',
    description: 'A target city is locked, which makes everything else easier to sequence.',
    answerKey: 'city',
    completedWhen: (a) => !!a.city && a.city !== 'undecided',
  },
  {
    id: 'family',
    label: 'Family ready',
    icon: 'Family',
    scoreImpact: 6,
    pillar: 'Life',
    description: 'Schooling or family timing has been discussed and the move window is realistic.',
    answerKey: 'hasKids',
    completedWhen: (a) =>
      a.hasKids === 'no' || (a.hasKids === 'yes' && ['under5', '5to12', 'adult'].includes(a.kidsAge)),
  },
]

type Question = {
  key: keyof Answers
  section: string
  q: string
  hint: string
  opts: { k: string; label: string; sub?: string }[]
  skipIf?: { key: keyof Answers; value: string }
}

const SETUP_QUESTIONS: Question[] = [
  {
    key: 'country',
    section: 'Where you are',
    q: 'Where are you currently based?',
    hint: 'Country influences RNOR context and return planning assumptions.',
    opts: [
      { k: 'USA', label: 'United States' },
      { k: 'UK', label: 'United Kingdom' },
      { k: 'UAE', label: 'UAE / Middle East' },
      { k: 'Canada', label: 'Canada' },
      { k: 'Other', label: 'Other' },
    ],
  },
  {
    key: 'yearsAbroad',
    section: 'Where you are',
    q: 'How long have you lived abroad?',
    hint: 'More time abroad often means a stronger RNOR window.',
    opts: [
      { k: '10+', label: '10+ years' },
      { k: '7', label: '7-10 years' },
      { k: '5', label: '5-7 years' },
      { k: '3', label: '3-5 years' },
      { k: 'under3', label: 'Under 3 years' },
    ],
  },
  {
    key: 'savings',
    section: 'Finances',
    q: 'How much liquid savings do you have?',
    hint: 'Savings are the biggest shock absorber during the move.',
    opts: [
      { k: '200000+', label: '$200,000+' },
      { k: '100000', label: '$100K-$200K' },
      { k: '50000', label: '$50K-$100K' },
      { k: 'under50', label: 'Under $50K' },
    ],
  },
  {
    key: 'hasJob',
    section: 'Career',
    q: 'What does income look like after the move?',
    hint: 'Income continuity is the single biggest readiness lever.',
    opts: [
      { k: 'remote_us', label: 'Remote job retained', sub: 'Same employer or same salary band' },
      { k: 'own_business', label: 'Location independent business' },
      { k: 'india_job', label: 'India job already confirmed' },
      { k: 'searching', label: 'Actively searching' },
      { k: 'no', label: 'No plan yet' },
    ],
  },
  {
    key: 'hasKids',
    section: 'Family',
    q: 'Are children part of this move?',
    hint: 'School timing can reshape the entire return plan.',
    opts: [
      { k: 'no', label: 'No children involved' },
      { k: 'yes', label: 'Yes, children are involved' },
    ],
  },
  {
    key: 'kidsAge',
    section: 'Family',
    q: 'What is the age range?',
    hint: 'Teen transitions usually need the most lead time.',
    opts: [
      { k: 'under5', label: 'Under 5' },
      { k: '5to12', label: '5-12 years' },
      { k: 'teen', label: '13-17 years' },
      { k: 'adult', label: '18+ adults' },
    ],
    skipIf: { key: 'hasKids', value: 'no' },
  },
  {
    key: 'city',
    section: 'Where you are going',
    q: 'Which city are you targeting?',
    hint: 'City choice changes cost, schools, housing, and hiring rhythm.',
    opts: [
      { k: 'Hyderabad', label: 'Hyderabad' },
      { k: 'Bangalore', label: 'Bangalore' },
      { k: 'Pune', label: 'Pune' },
      { k: 'Chennai', label: 'Chennai' },
      { k: 'Mumbai', label: 'Mumbai' },
      { k: 'Other', label: 'Another city' },
      { k: 'undecided', label: 'Still undecided' },
    ],
  },
  {
    key: 'housing',
    section: 'Where you are going',
    q: 'How far along is housing?',
    hint: 'The first 60-90 days feel very different with housing sorted.',
    opts: [
      { k: 'owned', label: 'Home already owned' },
      { k: 'arranged', label: 'Rental or temporary stay arranged' },
      { k: 'searching', label: 'Actively searching' },
      { k: 'no', label: 'Not started yet' },
    ],
  },
  {
    key: 'knowsRNOR',
    section: 'Tax planning',
    q: 'How ready are you on RNOR planning?',
    hint: 'RNOR timing can materially change tax outcomes after the move.',
    opts: [
      { k: 'yes_filed', label: 'Planned with a specialist CA' },
      { k: 'yes_aware', label: 'Aware and researching' },
      { k: 'partial', label: 'Heard of it, not confident yet' },
      { k: 'no', label: 'New topic for me' },
    ],
  },
]

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
  if (diffMonths <= 0) return 'within6'
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
  id: string
  phase: number
  title: string
  desc: string
  priority: 'critical' | 'essential'
  milestoneId: string | null
  isScoreImpact: boolean
}

const PHASES = ['Decide and plan', 'Prepare and execute', 'Move and settle', 'First year in India']

const TASKS: Task[] = [
  { id: 't01', phase: 0, title: 'Calculate financial runway', desc: 'Estimate monthly India costs and confirm 12-18 months of runway.', priority: 'critical', milestoneId: 'savings', isScoreImpact: true },
  { id: 't02', phase: 0, title: 'Research target cities', desc: 'Compare cost, schools, and job fit across likely cities.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't03', phase: 0, title: 'Book NRI CA consultation', desc: 'Validate RNOR timing and key tax deadlines before committing dates.', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't04', phase: 0, title: 'Assess career situation', desc: 'Lock remote work, business continuity, or the India job search plan.', priority: 'critical', milestoneId: 'income', isScoreImpact: true },
  { id: 't06', phase: 0, title: 'Commit to a target city', desc: 'A city decision unlocks housing, schooling, and hiring decisions.', priority: 'critical', milestoneId: 'city', isScoreImpact: true },
  { id: 't07', phase: 0, title: 'Run what-if scenarios', desc: 'See how changing savings, city, or job status changes readiness.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't08', phase: 1, title: 'Confirm income in writing', desc: 'Collect an offer letter, contract, or business proof before moving.', priority: 'critical', milestoneId: 'income', isScoreImpact: true },
  { id: 't09', phase: 1, title: 'Apply to schools', desc: 'High-demand schools often fill well ahead of the academic year.', priority: 'critical', milestoneId: 'family', isScoreImpact: true },
  { id: 't10', phase: 1, title: 'Open NRE and NRO accounts', desc: 'It is usually easier while you still have your foreign address.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't11', phase: 1, title: 'Start NRE fund transfers', desc: 'Move funds gradually before residency status changes.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't12', phase: 1, title: 'Arrange temporary housing', desc: 'Book a 60-90 day bridge stay before landing in India.', priority: 'critical', milestoneId: 'housing', isScoreImpact: true },
  { id: 't13', phase: 1, title: 'Optimize RNOR return date', desc: 'Coordinate your move timing with tax advice.', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't14', phase: 1, title: 'Purchase India health insurance', desc: 'Buy cover before arrival instead of waiting.', priority: 'critical', milestoneId: null, isScoreImpact: false },
  { id: 't15', phase: 1, title: 'Apostille key documents', desc: 'Prepare education, marriage, property, and identity paperwork.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't16', phase: 1, title: 'Shortlist schools', desc: 'Research curriculum, commute, and intake windows in your city.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't17', phase: 2, title: 'File Form 12A', desc: 'Do this promptly after arrival if your CA confirms it applies.', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't18', phase: 2, title: 'Update KYC everywhere', desc: 'Refresh address and residency details across banks and investments.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't19', phase: 2, title: 'Confirm school start dates', desc: 'Lock uniforms, books, transport, and the first-week plan.', priority: 'critical', milestoneId: 'family', isScoreImpact: true },
  { id: 't20', phase: 2, title: 'Find permanent housing', desc: 'Move from temporary stay into a stable long-term setup.', priority: 'critical', milestoneId: 'housing', isScoreImpact: true },
  { id: 't21', phase: 2, title: 'Set up local healthcare', desc: 'Choose your hospital, GP, and specialist network early.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't22', phase: 2, title: 'Cancel legacy overseas costs', desc: 'Remove subscriptions, utilities, and storage you no longer need.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't23', phase: 2, title: 'Review NRE conversion timing', desc: 'Check account conversion timing with your CA.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't24', phase: 3, title: 'File first India tax return', desc: 'Make sure foreign income classification matches your RNOR status.', priority: 'critical', milestoneId: 'rnor', isScoreImpact: true },
  { id: 't25', phase: 3, title: 'Track residency days', desc: 'Keep a precise count each financial year.', priority: 'critical', milestoneId: null, isScoreImpact: false },
  { id: 't26', phase: 3, title: 'Restructure investment portfolio', desc: 'Rebalance around Indian tax residency and cash needs.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't27', phase: 3, title: 'Build a local network', desc: 'Activate alumni, hiring, founder, and city community groups.', priority: 'essential', milestoneId: null, isScoreImpact: false },
  { id: 't28', phase: 3, title: 'Run an annual financial review', desc: 'Review taxes, transfers, and investment positioning with a CA.', priority: 'essential', milestoneId: null, isScoreImpact: false },
]

type JourneyState = {
  step: 'profile' | 'journey'
  answers: Partial<Answers>
  completedTasks: Set<string>
  manualMilestones: Set<string>
  currentPhase: number
  lastMilestone: string | null
  firstName: string
}

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
  | { type: 'RESET' }

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
      TASKS.filter((t) => t.phase === action.phase).forEach((t) => {
        newTasks.add(t.id)
        if (t.milestoneId && t.isScoreImpact) lastMilestone = t.milestoneId
      })
      const nextPhase = action.phase + 1
      const hasNext = nextPhase < PHASES.length
      return { ...state, completedTasks: newTasks, lastMilestone, currentPhase: hasNext ? nextPhase : -1 }
    }
    case 'UNCOMPLETE_PHASE': {
      const newTasks = new Set(state.completedTasks)
      TASKS.filter((t) => t.phase === action.phase).forEach((t) => newTasks.delete(t.id))
      return { ...state, completedTasks: newTasks, currentPhase: action.phase }
    }
    case 'TOGGLE_MILESTONE': {
      const manualMs = new Set(state.manualMilestones)
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
        const t = TASKS.find((x) => x.id === action.id)
        if (t?.milestoneId && t.isScoreImpact) lastMilestone = t.milestoneId
      }
      return { ...state, completedTasks: newTasks, lastMilestone }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const initialState: JourneyState = {
  step: 'profile',
  answers: {},
  completedTasks: new Set(),
  manualMilestones: new Set(),
  currentPhase: 0,
  lastMilestone: null,
  firstName: '',
}

function journeyPct(completedTasks: Set<string>) {
  return Math.round((completedTasks.size / TASKS.length) * 100)
}

function getStatusMeta(total: number) {
  if (total >= 80) return { label: 'Ready to return', color: T.green, bg: T.greenSoft }
  if (total >= 55) return { label: 'Moderately ready', color: T.bronze, bg: T.saffronSoft }
  return { label: 'Not ready yet', color: T.rose, bg: T.roseSoft }
}

function getVerdict(answers: Partial<Answers>, score: number) {
  const a = answers as Answers
  if (score >= 80 && !['no', 'searching'].includes(a.hasJob || '') && a.savings !== 'under50') {
    return {
      tone: 'Green light',
      text: 'You are in a strong position to move as planned, with the major financial and logistics risks already under control.',
      color: T.green,
      bg: T.greenSoft,
    }
  }
  if (a.hasJob === 'no' && a.savings === 'under50') {
    return {
      tone: 'Pause and rebuild',
      text: 'Income and savings are both weak right now. That combination makes the first months after moving much more stressful than they need to be.',
      color: T.rose,
      bg: T.roseSoft,
    }
  }
  if (a.hasJob === 'no' || a.hasJob === 'searching') {
    return {
      tone: 'Income first',
      text: 'The move can work, but confirming income before fixing a departure date will remove the biggest source of pressure.',
      color: T.bronze,
      bg: T.saffronSoft,
    }
  }
  if (a.savings === 'under50') {
    return {
      tone: 'Buffer matters',
      text: 'Your plan will be much safer with a larger runway. Build more cash cushion before locking the move date.',
      color: T.bronze,
      bg: T.saffronSoft,
    }
  }
  return {
    tone: 'Close the remaining gaps',
    text: 'You have momentum. A few missing pieces still stand between curiosity and a confident move plan.',
    color: T.bronze,
    bg: T.saffronSoft,
  }
}

function getPostMoveRecommendation(A: Answers) {
  const noIncome = A.hasJob === 'no' || A.hasJob === 'searching'
  const lowSavings = A.savings === 'under50'
  const rnorBlind = A.knowsRNOR === 'no' || A.knowsRNOR === 'partial'
  const noHousing = A.housing === 'no' || A.housing === 'searching'
  const hasTeens = A.hasKids === 'yes' && A.kidsAge === 'teen'

  if (noIncome && lowSavings) {
    return {
      title: 'Income and cash runway need immediate focus',
      text: 'You have already moved, so the pressure is real now. Protect cash and prioritize the fastest path to stable income.',
      actions: [
        'Activate referrals and warm introductions first.',
        'Freeze non-essential spending and build a 90-day budget.',
        'Explore bridge consulting work with your prior employer or network.',
      ],
      color: T.rose,
      bg: T.roseSoft,
      border: 'rgba(166,73,53,0.18)',
    }
  }

  if (noIncome) {
    return {
      title: 'Make income the only headline priority',
      text: 'Everything feels easier once earnings are stable again. Focus the next few weeks around high-conviction job or consulting channels.',
      actions: [
        'Prioritize referrals above cold applications.',
        'Track runway weekly so decisions stay grounded.',
        'Package your overseas experience into India-ready narratives and salary targets.',
      ],
      color: T.bronze,
      bg: T.saffronSoft,
      border: 'rgba(141,92,34,0.18)',
    }
  }

  if (rnorBlind) {
    return {
      title: 'RNOR and tax setup should happen now',
      text: 'Post-move tax mistakes are expensive and hard to reverse. Get clarity before making major transfers or account changes.',
      actions: [
        'Book a specialist CA conversation immediately.',
        'Collect entry dates, travel history, and foreign income records.',
        'Hold off on large account changes until the tax plan is confirmed.',
      ],
      color: T.navy,
      bg: T.navySoft,
      border: 'rgba(23,62,143,0.18)',
    }
  }

  if (noHousing) {
    return {
      title: 'Permanent housing is the next anchor',
      text: 'A stable home reduces stress across commute, school, routines, and the overall feeling of being settled.',
      actions: [
        'Set a hard deadline for signing a longer-term place.',
        'Choose commute quality over minor amenity differences.',
        'Use a broker who understands NRI tenants and documentation.',
      ],
      color: T.bronze,
      bg: T.saffronSoft,
      border: 'rgba(141,92,34,0.18)',
    }
  }

  if (hasTeens) {
    return {
      title: 'School transition deserves disproportionate attention',
      text: 'For families with teens, the school fit often shapes how the whole move is remembered.',
      actions: [
        'Have direct conversations about adjustment, not just logistics.',
        'Confirm transfer timing and curriculum fit early.',
        'Give the first term time before making big judgments.',
      ],
      color: T.navy,
      bg: T.navySoft,
      border: 'rgba(23,62,143,0.18)',
    }
  }

  return {
    title: 'You are through the highest-risk part',
    text: 'The focus now is on depth: routines, financial structure, community, and feeling established rather than provisional.',
    actions: [
      'Plan the first India tax return carefully.',
      'Build local professional and social networks deliberately.',
      'Do a six-month financial review after the move stabilizes.',
    ],
    color: T.green,
    bg: T.greenSoft,
    border: 'rgba(23,117,58,0.18)',
  }
}

function phaseTaskStats(phase: number, completedTasks: Set<string>) {
  const phaseTasks = TASKS.filter((t) => t.phase === phase)
  const done = phaseTasks.filter((t) => completedTasks.has(t.id)).length
  const total = phaseTasks.length
  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, pct }
}

function formatMoveDate(moveDate?: string) {
  if (!moveDate || moveDate === 'exploring') return 'Exploring timeline'
  const [year, month] = moveDate.split('-')
  return `${MONTHS_FULL[Number(month) - 1]} ${year}`
}

function SurfaceCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: T.paper,
        border: `1px solid ${T.border}`,
        borderRadius: 24,
        boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Pill({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'saffron' | 'green' | 'navy'
}) {
  const palette =
    tone === 'saffron'
      ? { bg: T.saffronSoft, color: T.bronze }
      : tone === 'green'
        ? { bg: T.greenSoft, color: T.green }
        : tone === 'navy'
          ? { bg: T.navySoft, color: T.navy }
          : { bg: 'rgba(29,22,15,0.06)', color: T.muted }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '0.42rem 0.8rem',
        borderRadius: 999,
        background: palette.bg,
        color: palette.color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  )
}

function LabeledMetric({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string
  tone?: 'neutral' | 'green' | 'saffron' | 'navy'
}) {
  const color = tone === 'green' ? T.green : tone === 'saffron' ? T.saffron : tone === 'navy' ? T.navy : T.white
  return (
    <div style={{ minWidth: 116 }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color, lineHeight: 1 }}>{value}</div>
    </div>
  )
}

function OptionButton({
  selected,
  label,
  sub,
  onClick,
}: {
  selected: boolean
  label: string
  sub?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        textAlign: 'left',
        padding: '1rem 1rem 0.95rem',
        borderRadius: 18,
        border: `1.5px solid ${selected ? T.saffron : T.border}`,
        background: selected ? T.saffronSoft : T.white,
        boxShadow: selected ? '0 10px 24px rgba(240,138,36,0.14)' : 'none',
        transition: 'all .18s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.4 }}>{label}</div>
          {sub ? <div style={{ marginTop: 6, fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{sub}</div> : null}
        </div>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `1.5px solid ${selected ? T.saffron : T.borderStrong}`,
            background: selected ? T.saffron : 'transparent',
            flexShrink: 0,
            marginTop: 2,
          }}
        />
      </div>
    </button>
  )
}

function QuestionBlock({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string
  onChange: (value: string) => void
}) {
  return (
    <SurfaceCard style={{ padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {question.section}
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink }}>{question.q}</h3>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{question.hint}</p>
        </div>
        {value ? <Pill tone="green">Set</Pill> : null}
      </div>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {question.opts.map((opt) => (
          <OptionButton
            key={opt.k}
            selected={value === opt.k}
            label={opt.label}
            sub={opt.sub}
            onClick={() => onChange(opt.k)}
          />
        ))}
      </div>
    </SurfaceCard>
  )
}

function TimelinePicker({
  value,
  alreadyMoved,
  onMoveDate,
  onAlreadyMoved,
}: {
  value: string
  alreadyMoved: string
  onMoveDate: (value: string) => void
  onAlreadyMoved: (value: string) => void
}) {
  const selectedYear = value && value !== 'exploring' ? Number(value.split('-')[0]) : null
  const selectedMonth = value && value !== 'exploring' ? Number(value.split('-')[1]) : null

  return (
    <SurfaceCard style={{ padding: '1.3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Timeline
          </div>
          <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink }}>When are you planning to move?</h3>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>
            Choose a likely date if you have one. A rough estimate is enough to shape the journey.
          </p>
        </div>
        {value ? <Pill tone="saffron">{formatMoveDate(value)}</Pill> : null}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Year
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {getYearRange().map((year) => {
            const selected = selectedYear === year
            return (
              <button
                type="button"
                key={year}
                onClick={() => {
                  const month = selectedMonth || new Date().getMonth() + 1
                  onMoveDate(`${year}-${String(month).padStart(2, '0')}`)
                }}
                style={{
                  padding: '0.9rem 0.75rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? T.saffron : T.border}`,
                  background: selected ? T.saffronSoft : T.white,
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

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Month
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {MONTHS_SHORT.map((month, idx) => {
            const monthNumber = idx + 1
            const selected = selectedMonth === monthNumber
            const now = new Date()
            const past = selectedYear !== null && new Date(selectedYear, idx, 1) < new Date(now.getFullYear(), now.getMonth(), 1)
            return (
              <button
                type="button"
                key={month}
                disabled={!selectedYear}
                onClick={() => selectedYear && onMoveDate(`${selectedYear}-${String(monthNumber).padStart(2, '0')}`)}
                style={{
                  padding: '0.95rem 0.5rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? T.saffron : T.border}`,
                  background: selected ? T.saffronSoft : selectedYear ? T.white : 'rgba(29,22,15,0.03)',
                  color: selected ? T.ink : !selectedYear ? T.soft : past ? T.soft : T.muted,
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: selectedYear ? 1 : 0.55,
                }}
              >
                {month}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onMoveDate('exploring')}
        style={{
          width: '100%',
          padding: '0.9rem 1rem',
          borderRadius: 16,
          border: `1.5px dashed ${value === 'exploring' ? T.saffron : T.borderStrong}`,
          background: value === 'exploring' ? T.saffronSoft : 'transparent',
          color: value === 'exploring' ? T.ink : T.muted,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        I am still exploring the timing
      </button>

      {isMoveDatePast(value) ? (
        <div
          style={{
            marginTop: 16,
            padding: '1rem',
            borderRadius: 18,
            background: 'rgba(240,138,36,0.08)',
            border: `1px solid rgba(240,138,36,0.18)`,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: T.bronze, marginBottom: 10 }}>That date has already passed. Have you moved already?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {[
              { key: 'yes', label: 'Yes, I am already in India' },
              { key: 'no', label: 'No, still planning' },
            ].map((opt) => (
              <OptionButton
                key={opt.key}
                selected={alreadyMoved === opt.key}
                label={opt.label}
                onClick={() => onAlreadyMoved(opt.key)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  )
}

function ProfileSetup({ state, dispatch }: { state: JourneyState; dispatch: React.Dispatch<Action> }) {
  const visibleQuestions = SETUP_QUESTIONS.filter((q) => !q.skipIf || state.answers[q.skipIf.key] !== q.skipIf.value)
  const answered = visibleQuestions.filter((q) => state.answers[q.key]).length
  const moveDateAnswered = !!state.answers.moveDate
  const alreadyMovedRequired = isMoveDatePast(state.answers.moveDate || '')
  const alreadyMovedAnswered = !alreadyMovedRequired || !!state.answers.alreadyMoved
  const totalRequired = visibleQuestions.length + 1 + (alreadyMovedRequired ? 1 : 0)
  const totalAnswered = answered + (moveDateAnswered ? 1 : 0) + (alreadyMovedAnswered && alreadyMovedRequired ? 1 : 0)
  const allDone = totalAnswered === totalRequired && !!state.firstName.trim()
  const progress = Math.round((totalAnswered / totalRequired) * 100)
  const projectedAnswers = state.answers as Answers

  const projectedScore = useMemo(() => {
    const requiredKeys: (keyof Answers)[] = ['country', 'savings', 'yearsAbroad', 'hasKids', 'hasJob', 'city', 'timeline', 'knowsRNOR', 'housing', 'moveDate', 'alreadyMoved', 'kidsAge']
    const completeEnough = requiredKeys.every((key) => {
      if (key === 'kidsAge' && state.answers.hasKids === 'no') return true
      if (key === 'alreadyMoved' && !alreadyMovedRequired) return true
      return !!state.answers[key]
    })
    return completeEnough ? computeScore(projectedAnswers).total : null
  }, [alreadyMovedRequired, projectedAnswers, state.answers])

  return (
    <div style={{ minHeight: '100vh', background: T.hero, padding: '2rem 1.25rem 4rem' }}>
      <style>{`
        .journey-shell { max-width: 1240px; margin: 0 auto; }
        .journey-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        .sticky-panel { position: sticky; top: 96px; }
        .option-grid { display: grid; gap: 1rem; }
        @media (max-width: 980px) {
          .journey-grid { grid-template-columns: 1fr; }
          .sticky-panel { position: static; }
        }
      `}</style>

      <div className="journey-shell">
        <div className="journey-grid">
          <div className="sticky-panel">
            <SurfaceCard style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: T.dark }}>
                <Pill tone="saffron">Back2India journey</Pill>
                <h1 style={{ fontSize: 'clamp(2.35rem, 6vw, 4.5rem)', lineHeight: 0.96, color: T.white, marginTop: 16, marginBottom: 14 }}>
                  Plan the move like a real transition.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>
                  This setup turns your answers into a living relocation dashboard: readiness, risks, milestones, and the exact next moves.
                </p>
              </div>

              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.muted, marginBottom: 8 }}>
                    <span>Setup progress</span>
                    <span style={{ fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <SurfaceCard style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      Profile
                    </div>
                    <div style={{ fontSize: 14, color: T.ink, lineHeight: 1.65 }}>
                      {state.firstName ? `Planning for ${state.firstName}.` : 'Add your first name so the dashboard feels personal.'}
                    </div>
                  </SurfaceCard>

                  <SurfaceCard style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      What this unlocks
                    </div>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14, color: T.muted }}>
                      <div>Readiness score tied to your move context</div>
                      <div>Milestones that surface the biggest levers</div>
                      <div>Task phases from planning through first year</div>
                    </div>
                  </SurfaceCard>

                  <SurfaceCard style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Early signal
                    </div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: projectedScore !== null ? T.green : T.ink, lineHeight: 1, marginBottom: 4 }}>
                      {projectedScore !== null ? `${projectedScore}/100` : '--'}
                    </div>
                    <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>
                      {projectedScore !== null
                        ? 'Enough information is in place to estimate readiness.'
                        : 'Complete the setup to generate the personalized dashboard.'}
                    </div>
                  </SurfaceCard>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <div className="option-grid">
            <SurfaceCard style={{ padding: '1.25rem 1.3rem' }}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <Pill tone="navy">Setup</Pill>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: T.ink, marginTop: 14, marginBottom: 8 }}>
                    Build your journey profile
                  </h2>
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8, maxWidth: 760 }}>
                    The goal is not to collect everything. It is to gather enough signal to show you where the move is strong, where it is fragile, and what to do next.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Your first name
                  </label>
                  <input
                    type="text"
                    placeholder="What should we call you?"
                    value={state.firstName}
                    onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '1rem 1rem',
                      borderRadius: 18,
                      border: `1.5px solid ${state.firstName ? T.saffron : T.border}`,
                      background: state.firstName ? T.saffronSoft : T.white,
                      color: T.ink,
                      fontSize: 15,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </SurfaceCard>

            {visibleQuestions.map((question) => (
              <QuestionBlock
                key={question.key}
                question={question}
                value={state.answers[question.key] || ''}
                onChange={(value) => dispatch({ type: 'SET_ANSWER', key: question.key, value })}
              />
            ))}

            <TimelinePicker
              value={state.answers.moveDate || ''}
              alreadyMoved={state.answers.alreadyMoved || ''}
              onMoveDate={(value) => dispatch({ type: 'SET_MOVE_DATE', value })}
              onAlreadyMoved={(value) => dispatch({ type: 'SET_ANSWER', key: 'alreadyMoved', value })}
            />

            <SurfaceCard style={{ padding: '1.2rem', background: allDone ? T.dark : T.paper }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: allDone ? 'rgba(255,255,255,0.65)' : T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Next step
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: allDone ? T.white : T.ink, marginBottom: 4 }}>
                    {allDone ? 'Your dashboard is ready.' : `${totalRequired - totalAnswered + (state.firstName.trim() ? 0 : 1)} inputs still missing.`}
                  </div>
                  <div style={{ fontSize: 14, color: allDone ? 'rgba(255,255,255,0.7)' : T.muted, lineHeight: 1.7 }}>
                    {allDone
                      ? 'Start the journey dashboard to see readiness, milestones, and phased tasks.'
                      : 'Finish the setup so we can calculate the score and personalize the journey.'}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!allDone}
                  onClick={() => dispatch({ type: 'START_JOURNEY' })}
                  style={{
                    padding: '1rem 1.4rem',
                    borderRadius: 999,
                    border: 'none',
                    background: allDone ? T.saffron : 'rgba(29,22,15,0.08)',
                    color: allDone ? T.white : T.soft,
                    fontSize: 14,
                    fontWeight: 800,
                    minWidth: 220,
                  }}
                >
                  Open journey dashboard
                </button>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  )
}

function JourneyDashboard({ state, dispatch }: { state: JourneyState; dispatch: React.Dispatch<Action> }) {
  const [tab, setTab] = useState<'overview' | 'tasks'>('overview')
  const [changedBanner, setChangedBanner] = useState<{ ms: Milestone; prevScore: number; newScore: number } | null>(null)
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevScoreRef = useRef<number | null>(null)

  const A = state.answers as Answers
  const alreadyMoved = A.alreadyMoved === 'yes'

  const msCompleted = useMemo(
    () =>
      new Set(
        MILESTONES.filter(
          (m) =>
            m.completedWhen(A) ||
            TASKS.filter((t) => t.milestoneId === m.id && t.isScoreImpact).some((t) => state.completedTasks.has(t.id)) ||
            state.manualMilestones.has(m.id)
        ).map((m) => m.id)
      ),
    [A, state.completedTasks, state.manualMilestones]
  )

  const autoCompletedTasks = useMemo(() => {
    const auto = new Set<string>()
    TASKS.forEach((t) => {
      if (!t.milestoneId) return
      const milestone = MILESTONES.find((m) => m.id === t.milestoneId)
      if (milestone && milestone.completedWhen(A)) auto.add(t.id)
    })
    if (['owned', 'arranged'].includes(A.housing)) auto.add('t12')
    if (['yes_filed', 'yes_aware'].includes(A.knowsRNOR)) auto.add('t03')
    if (A.city && A.city !== 'undecided') {
      auto.add('t06')
      auto.add('t02')
    }
    if (['remote_us', 'own_business', 'india_job'].includes(A.hasJob)) {
      auto.add('t04')
      auto.add('t08')
    }
    if (A.hasKids === 'no') {
      auto.add('t07')
      auto.add('t09')
    }
    return auto
  }, [A])

  const effectiveCompletedTasks = useMemo(() => {
    const merged = new Set(state.completedTasks)
    autoCompletedTasks.forEach((id) => merged.add(id))
    return merged
  }, [autoCompletedTasks, state.completedTasks])

  const scoreBreakdown = useMemo(() => {
    const base = computeScore(A)
    let bonus = 0
    MILESTONES.forEach((m) => {
      const inScore = m.completedWhen(A)
      const manualOrTask =
        state.manualMilestones.has(m.id) ||
        TASKS.filter((t) => t.milestoneId === m.id && t.isScoreImpact).some((t) => state.completedTasks.has(t.id))
      if (!inScore && manualOrTask) bonus += m.scoreImpact
    })
    return { ...base, total: Math.min(100, base.total + bonus) }
  }, [A, state.completedTasks, state.manualMilestones])

  const score = scoreBreakdown.total
  const statusMeta = getStatusMeta(score)
  const verdict = getVerdict(state.answers, score)
  const pct = journeyPct(effectiveCompletedTasks)
  const completedMsCount = msCompleted.size
  const highImpact = MILESTONES.find((m) => !msCompleted.has(m.id))
  const postMove = getPostMoveRecommendation(A)

  useEffect(() => {
    if (alreadyMoved && state.currentPhase < 2) {
      dispatch({ type: 'SET_PHASE', phase: 2 })
    }
  }, [alreadyMoved, dispatch, state.currentPhase])

  useEffect(() => {
    if (state.lastMilestone) {
      const milestone = MILESTONES.find((m) => m.id === state.lastMilestone)
      if (milestone && prevScoreRef.current !== null) {
        setChangedBanner({ ms: milestone, prevScore: prevScoreRef.current, newScore: score })
        if (bannerTimer.current) clearTimeout(bannerTimer.current)
        bannerTimer.current = setTimeout(() => setChangedBanner(null), 4000)
      }
    }
    prevScoreRef.current = score
  }, [score, state.lastMilestone])

  return (
    <div style={{ minHeight: '100vh', background: T.hero }}>
      <style>{`
        .dashboard-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .hero-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.95fr); gap: 1rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.9rem; }
        .overview-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 1rem; }
        .milestone-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.9rem; }
        @media (max-width: 980px) {
          .hero-grid, .overview-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dashboard-shell">
        <div className="hero-grid" style={{ marginBottom: '1rem' }}>
          <SurfaceCard style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', background: T.dark }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <Pill tone="saffron">Back2India dashboard</Pill>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', lineHeight: 0.98, color: T.white, marginTop: 16, marginBottom: 10 }}>
                    {state.firstName ? `${state.firstName}'s journey` : 'Your journey'}
                  </h1>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, maxWidth: 700 }}>
                    {alreadyMoved
                      ? 'The move has happened. This dashboard now shifts from planning to settling in and protecting the first year.'
                      : 'A personal control panel for moving back: readiness, biggest gaps, and what to do in each phase.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {!alreadyMoved ? <LabeledMetric label="Readiness" value={`${score}/100`} tone="green" /> : null}
                  <LabeledMetric label="Journey" value={`${pct}%`} tone="saffron" />
                  <LabeledMetric label="Milestones" value={`${completedMsCount}/${MILESTONES.length}`} tone="navy" />
                </div>
              </div>

              <div className="stats-grid">
                {[
                  { label: 'Target move', value: formatMoveDate(A.moveDate) },
                  { label: 'Country', value: A.country || 'Not set' },
                  { label: 'City', value: A.city || 'Not set' },
                  { label: 'Runway', value: `${calcRunwayMonths(A.savings, A.city)} months` },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: '1rem',
                      borderRadius: 18,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard style={{ padding: '1.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Current focus
                </div>
                <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 6 }}>
                  {alreadyMoved ? postMove.title : highImpact ? highImpact.label : 'Strong overall plan'}
                </h2>
              </div>
              {alreadyMoved ? <Pill tone="navy">Post-move</Pill> : highImpact ? <Pill tone="saffron">Highest leverage</Pill> : <Pill tone="green">Stable</Pill>}
            </div>

            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
              {alreadyMoved ? postMove.text : highImpact ? highImpact.description : 'You have already closed the main risk areas.'}
            </p>

            {!alreadyMoved && highImpact ? (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <Pill tone="green">+{highImpact.scoreImpact} points</Pill>
                <Pill tone="navy">{highImpact.pillar}</Pill>
              </div>
            ) : null}

            <div
              style={{
                padding: '1rem',
                borderRadius: 18,
                background: alreadyMoved ? postMove.bg : verdict.bg,
                border: `1px solid ${alreadyMoved ? postMove.border : T.border}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: alreadyMoved ? postMove.color : verdict.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {alreadyMoved ? 'Recommendation' : verdict.tone}
              </div>
              <div style={{ fontSize: 14, color: alreadyMoved ? postMove.color : verdict.color, lineHeight: 1.75 }}>
                {alreadyMoved ? postMove.actions[0] : verdict.text}
              </div>
            </div>

            {!alreadyMoved ? (
              <Link
                href="/planner"
                style={{
                  display: 'inline-flex',
                  marginTop: 16,
                  padding: '0.82rem 1.1rem',
                  borderRadius: 999,
                  background: T.ink,
                  color: T.white,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Open full readiness analysis
              </Link>
            ) : null}
          </SurfaceCard>
        </div>

        {changedBanner ? (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.95rem 1.15rem',
              borderRadius: 18,
              background: T.greenSoft,
              border: `1px solid rgba(23,117,58,0.18)`,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ fontSize: 14, color: T.green, lineHeight: 1.65 }}>
              <strong>{changedBanner.ms.label}</strong> completed. Score moved from {changedBanner.prevScore} to {changedBanner.newScore}.
            </div>
            <button type="button" onClick={() => setChangedBanner(null)} style={{ border: 'none', background: 'transparent', color: T.green, fontWeight: 800, fontSize: 14 }}>
              Dismiss
            </button>
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            ['overview', 'Overview'],
            ['tasks', 'Task flow'],
          ].map(([value, label]) => {
            const active = tab === value
            return (
              <button
                type="button"
                key={value}
                onClick={() => setTab(value as 'overview' | 'tasks')}
                style={{
                  padding: '0.8rem 1.05rem',
                  borderRadius: 999,
                  border: `1px solid ${active ? T.ink : T.border}`,
                  background: active ? T.ink : T.paper,
                  color: active ? T.white : T.muted,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {label}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => dispatch({ type: 'RESET' })}
            style={{
              marginLeft: 'auto',
              padding: '0.8rem 1.05rem',
              borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: T.paper,
              color: T.muted,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Reset and update profile
          </button>
        </div>

        {tab === 'overview' ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="overview-grid">
              <SurfaceCard style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Score anatomy
                    </div>
                    <h2 style={{ fontSize: '1.35rem', color: T.ink }}>
                      {alreadyMoved ? 'Journey progress by phase' : 'Readiness, broken into real levers'}
                    </h2>
                  </div>
                  <Pill tone={alreadyMoved ? 'green' : 'saffron'}>
                    {alreadyMoved ? `${pct}% complete` : statusMeta.label}
                  </Pill>
                </div>

                {!alreadyMoved ? (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      { label: 'Financial', value: scoreBreakdown.financial, max: 40, color: T.saffron },
                      { label: 'Life complexity', value: scoreBreakdown.lifeComplexity, max: 25, color: '#7f4fa0' },
                      { label: 'Career', value: scoreBreakdown.career, max: 20, color: T.green },
                      { label: 'Planning', value: scoreBreakdown.planning, max: 20, color: T.navy },
                    ].map((item) => {
                      const bar = Math.round((item.value / item.max) * 100)
                      return (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span style={{ color: T.muted }}>{item.label}</span>
                            <strong style={{ color: item.color }}>{item.value}/{item.max}</strong>
                          </div>
                          <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                            <div style={{ width: `${bar}%`, height: '100%', background: item.color }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[2, 3].map((phase) => {
                      const stats = phaseTaskStats(phase, effectiveCompletedTasks)
                      return (
                        <div key={phase}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span style={{ color: T.muted }}>{PHASES[phase]}</span>
                            <strong style={{ color: T.green }}>{stats.done}/{stats.total}</strong>
                          </div>
                          <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.pct}%`, height: '100%', background: T.green }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </SurfaceCard>

              <SurfaceCard style={{ padding: '1.35rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Next steps
                </div>
                <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 12 }}>
                  {alreadyMoved ? 'What to tighten this month' : 'What most improves this plan'}
                </h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {(alreadyMoved ? postMove.actions : highImpact ? [`Complete the "${highImpact.label}" milestone.`, 'Use the task flow tab to batch the next phase instead of doing everything at once.', 'Keep the move date realistic; forcing the timeline creates avoidable stress.'] : ['Maintain momentum across the remaining task phases.']).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '26px minmax(0, 1fr)',
                        gap: 12,
                        alignItems: 'start',
                        padding: '0.95rem',
                        borderRadius: 18,
                        background: 'rgba(29,22,15,0.03)',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: alreadyMoved ? postMove.color : T.ink,
                          color: T.white,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7 }}>{item}</div>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>

            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Milestones
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: T.ink }}>The levers that matter most</h2>
                </div>
                <Pill tone="green">{completedMsCount}/{MILESTONES.length} complete</Pill>
              </div>

              <div className="milestone-grid">
                {MILESTONES.map((milestone) => {
                  const done = msCompleted.has(milestone.id)
                  const autoDetected = milestone.completedWhen(A)
                  return (
                    <button
                      type="button"
                      key={milestone.id}
                      onClick={() => !autoDetected && dispatch({ type: 'TOGGLE_MILESTONE', id: milestone.id })}
                      style={{
                        textAlign: 'left',
                        padding: '1rem',
                        borderRadius: 20,
                        border: `1.5px solid ${done ? 'rgba(23,117,58,0.22)' : T.border}`,
                        background: done ? T.greenSoft : T.white,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: done ? T.green : T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                            {milestone.icon}
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{milestone.label}</div>
                        </div>
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: `1.5px solid ${done ? T.green : T.borderStrong}`,
                            background: done ? T.green : 'transparent',
                            flexShrink: 0,
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>{milestone.description}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <Pill tone={done ? 'green' : 'navy'}>{done ? 'Complete' : 'Open'}</Pill>
                        {!alreadyMoved ? <Pill tone="saffron">+{milestone.scoreImpact} pts</Pill> : null}
                        {autoDetected ? <Pill tone="navy">Auto-detected</Pill> : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </SurfaceCard>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                Task flow
              </div>
              <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 10 }}>Move through the journey in phases</h2>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
                Each phase opens after the prior one is complete, so the list stays focused instead of overwhelming.
              </p>

              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: `repeat(${alreadyMoved ? 2 : 4}, minmax(0, 1fr))` }}>
                {(alreadyMoved ? [2, 3] : [0, 1, 2, 3]).map((phase) => {
                  const stats = phaseTaskStats(phase, effectiveCompletedTasks)
                  const active = state.currentPhase === phase
                  return (
                    <button
                      type="button"
                      key={phase}
                      onClick={() => dispatch({ type: 'SET_PHASE', phase })}
                      style={{
                        textAlign: 'left',
                        padding: '0.95rem',
                        borderRadius: 18,
                        border: `1.5px solid ${active ? T.saffron : T.border}`,
                        background: active ? T.saffronSoft : T.white,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: active ? T.bronze : T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        Phase {phase + 1}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, marginBottom: 10 }}>{PHASES[phase]}</div>
                      <div style={{ height: 8, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{ width: `${stats.pct}%`, height: '100%', background: active ? T.saffron : T.green }} />
                      </div>
                      <div style={{ fontSize: 13, color: T.muted }}>{stats.done} of {stats.total} complete</div>
                    </button>
                  )
                })}
              </div>
            </SurfaceCard>

            {PHASES.map((phase, i) => {
              if (alreadyMoved && i < 2) return null
              const tasks = TASKS.filter((task) => task.phase === i)
              const done = tasks.filter((task) => effectiveCompletedTasks.has(task.id)).length
              const allDone = done === tasks.length && tasks.length > 0
              const isActive = i === state.currentPhase
              const firstPhase = alreadyMoved ? 2 : 0
              const prevTasks = i > firstPhase ? TASKS.filter((task) => task.phase === i - 1) : []
              const isLocked = !(i === firstPhase || prevTasks.every((task) => effectiveCompletedTasks.has(task.id)))

              return (
                <SurfaceCard
                  key={phase}
                  style={{
                    overflow: 'hidden',
                    opacity: isLocked ? 0.58 : 1,
                    borderColor: allDone ? 'rgba(23,117,58,0.18)' : T.border,
                  }}
                >
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => dispatch({ type: 'SET_PHASE', phase: i })}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '1.2rem 1.25rem',
                      background: isActive ? T.dark : allDone ? T.greenSoft : 'rgba(29,22,15,0.03)',
                      color: isActive ? T.white : T.ink,
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? 'rgba(255,255,255,0.55)' : allDone ? T.green : T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        Phase {i + 1}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{phase}</div>
                      {isLocked ? <div style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.65)' : T.soft, marginTop: 6 }}>Complete the previous phase to unlock this one.</div> : null}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{done}/{tasks.length}</div>
                      <div style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.55)' : T.soft }}>
                        {allDone ? 'Complete' : `${tasks.length - done} left`}
                      </div>
                    </div>
                  </button>

                  {isActive && !isLocked ? (
                    <div style={{ padding: '0.4rem 0' }}>
                      {tasks.map((task, index) => {
                        const isDone = effectiveCompletedTasks.has(task.id)
                        const isAuto = autoCompletedTasks.has(task.id)
                        return (
                          <div
                            key={task.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '28px minmax(0, 1fr)',
                              gap: 14,
                              padding: '1rem 1.25rem',
                              borderTop: index === 0 ? 'none' : `1px solid ${T.border}`,
                              background: isAuto ? 'rgba(23,117,58,0.03)' : T.paper,
                            }}
                          >
                            <button
                              type="button"
                              disabled={isAuto}
                              onClick={() => dispatch({ type: 'TOGGLE_TASK', id: task.id })}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 8,
                                border: `1.5px solid ${isDone ? (isAuto ? '#6cab7e' : T.green) : task.priority === 'critical' ? T.saffron : T.borderStrong}`,
                                background: isDone ? (isAuto ? '#6cab7e' : T.green) : 'transparent',
                                marginTop: 2,
                              }}
                            />
                            <div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
                                <div
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: isDone ? T.soft : T.ink,
                                    textDecoration: isDone ? 'line-through' : 'none',
                                  }}
                                >
                                  {task.title}
                                </div>
                                {task.priority === 'critical' ? <Pill tone="saffron">Critical</Pill> : null}
                                {!alreadyMoved && task.isScoreImpact ? <Pill tone="navy">Score impact</Pill> : null}
                                {isAuto ? <Pill tone="green">Auto</Pill> : null}
                              </div>
                              <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{task.desc}</div>
                            </div>
                          </div>
                        )
                      })}

                      <div
                        style={{
                          padding: '1rem 1.25rem 1.15rem',
                          borderTop: `1px solid ${T.border}`,
                          background: 'rgba(29,22,15,0.03)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 12,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ fontSize: 14, color: allDone ? T.green : T.muted }}>
                          {allDone ? 'All tasks in this phase are complete.' : `${tasks.length - done} tasks remaining in this phase.`}
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: allDone ? 'UNCOMPLETE_PHASE' : 'COMPLETE_PHASE', phase: i })}
                          style={{
                            padding: '0.8rem 1rem',
                            borderRadius: 999,
                            border: `1px solid ${allDone ? T.border : 'rgba(240,138,36,0.22)'}`,
                            background: allDone ? T.white : T.saffronSoft,
                            color: allDone ? T.muted : T.bronze,
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          {allDone ? 'Unmark phase' : 'Mark phase complete'}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </SurfaceCard>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function JourneyPage() {
  const { shouldBlock } = useProtectedRoute()
  const [state, dispatch] = useReducer(journeyReducer, initialState)

  if (shouldBlock) return null
  if (state.step === 'profile') return <ProfileSetup state={state} dispatch={dispatch} />
  return <JourneyDashboard state={state} dispatch={dispatch} />
}
