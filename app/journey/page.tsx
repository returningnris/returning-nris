'use client'

import { useEffect, useMemo, useReducer, useState } from 'react'
import FounderConsultationCard from '../../components/FounderConsultationCard'
import { useAuth } from '../../components/useAuth'
import { useProtectedRoute } from '../../components/useProtectedRoute'
import { REFINED_READINESS_QUESTIONS, type ReadinessAnswers } from '../../lib/readinessQuestions'
import { supabase } from '../../lib/supabase'

type Answers = ReadinessAnswers & {
  moveDate: string
  alreadyMoved: string
}

const CITY_BASE: Record<string, number> = {
  Hyderabad: 190000,
  Bangalore: 250000,
  Pune: 185000,
  Chennai: 180000,
  Mumbai: 300000,
  DelhiNCR: 240000,
  Tier2: 160000,
  undecided: 200000,
}

const SAVINGS_USD: Record<string, number> = {
  '200000+': 200000,
  '150000': 150000,
  '100000': 100000,
  '50000': 50000,
  'under50': 35000,
}

function calcRunwayMonths(savings: string, city: string): number {
  const monthly = CITY_BASE[city] || 185000
  return Math.round(((SAVINGS_USD[savings] || 75000) * 83) / monthly)
}

function getHasKidsAnswer(A: Partial<Answers>): string {
  if (A.childrenCount) {
    return A.childrenCount === 'none' ? 'no' : 'yes'
  }
  return A.hasKids || ''
}

function getKidsAgeAnswer(A: Partial<Answers>): string {
  if (A.teenageChildren) {
    if (A.teenageChildren === 'one' || A.teenageChildren === 'two_plus') return 'teen'
    if (A.childrenCount === 'one' || A.childrenCount === 'two_plus') return '5to12'
    return ''
  }
  return A.kidsAge || ''
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
  const commitmentsPenalty =
    A.commitments === 'very_high' ? 9 : A.commitments === 'high' ? 5 : A.commitments === 'moderate' ? 2 : 0
  const runway = calcRunwayMonths(A.savings, A.city)

  if (A.savings === '200000+') financial += 20
  else if (A.savings === '150000') financial += 16
  else if (A.savings === '100000') financial += 15
  else if (A.savings === '50000') financial += 10
  else financial += 5

  financial -= commitmentsPenalty
  if (A.netWorth === '1000000+') financial += 10
  else if (A.netWorth === '750000') financial += 8
  else if (A.netWorth === '500000') financial += 5
  else if (A.netWorth === '250000') financial += 3

  if (A.country === 'USA' || A.country === 'UK') financial += 5
  else if (A.country === 'UAE') financial += 4
  else financial += 3

  if (runway >= 18) financial += 5
  else if (runway >= 12) financial += 3
  else if (runway >= 9) financial += 1

  if (A.childrenCount === 'none') life += 12
  else if (A.childrenCount === 'one') life += 8
  else if (A.childrenCount === 'two_plus') life += 4

  if (A.teenageChildren === 'one') life -= 2
  else if (A.teenageChildren === 'two_plus') life -= 4

  if (A.housing === 'owned') life += 3
  else if (A.housing === 'arranged') life += 2

  if (A.hasJob === 'remote_us') career = 20
  else if (A.hasJob === 'india_job') career = 15
  else if (A.hasJob === 'own_business') career = 10
  else if (A.hasJob === 'searching') career = 0
  else career = -5

  if (A.timeline === 'within6') planning += 6
  else if (A.timeline === '6to12') planning += 5
  else if (A.timeline === '1to2') planning += 4
  else planning += 2

  if (A.city === 'Tier2') planning += 7
  else if (A.city === 'Hyderabad' || A.city === 'Pune' || A.city === 'Chennai') planning += 6
  else if (A.city === 'Bangalore' || A.city === 'DelhiNCR') planning += 4
  else if (A.city === 'Mumbai') planning += 3
  else planning += 2

  if (A.knowsRNOR === 'yes_filed') planning += 8
  else if (A.knowsRNOR === 'yes_aware') planning += 5
  else if (A.knowsRNOR === 'partial') planning += 3
  else planning += 0

  if (A.foreignAssets === 'planned') planning += 3
  else if (A.foreignAssets === 'minimal') planning += 2

  return {
    financial,
    lifeComplexity: life,
    career,
    planning,
    total: Math.max(0, Math.min(100, financial + life + career + planning)),
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
    completedWhen: (a) => ['200000+', '150000', '100000'].includes(a.savings),
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
    answerKey: 'childrenCount',
    completedWhen: (a) =>
      getHasKidsAnswer(a) === 'no' || (getHasKidsAnswer(a) === 'yes' && ['under5', '5to12', 'adult'].includes(getKidsAgeAnswer(a))),
  },
]

type Question = {
  key: keyof Answers
  section: string
  q: string
  hint: string
  tooltip?: string
  opts: { k: string; label: string; sub?: string }[]
  skipIf?: { key: keyof Answers; value: string }
}

const SETUP_QUESTIONS: Question[] = [
  {
    key: 'country',
    section: 'Where You Are',
    q: 'Where are you currently based?',
    hint: 'A small modifier tied to tax complexity and move structure.',
    tooltip: 'A minor factor. It slightly changes tax complexity and move setup.',
    opts: [
      { k: 'USA', label: 'United States' },
      { k: 'UK', label: 'United Kingdom' },
      { k: 'UAE', label: 'UAE / Middle East' },
      { k: 'Canada', label: 'Canada' },
      { k: 'Other', label: 'Other country' },
    ],
  },
  {
    key: 'savings',
    section: 'Finances',
    q: 'Total liquid savings?',
    hint: 'Your strongest financial readiness signal and primary runway input.',
    tooltip: 'Your main readiness driver. More liquid cash means more runway.',
    opts: [
      { k: '200000+', label: '$200K+' },
      { k: '150000', label: '$150K' },
      { k: '100000', label: '$100K' },
      { k: '50000', label: '$50K' },
    ],
  },
  {
    key: 'commitments',
    section: 'Finances',
    q: 'Do you have significant monthly financial commitments (EMIs, loans, etc.)?',
    hint: 'Fixed obligations reduce how long your savings can actually support the move.',
    tooltip: 'Higher fixed payments reduce usable runway.',
    opts: [
      { k: 'none', label: 'No significant commitments' },
      { k: 'moderate', label: 'Moderate commitments (< $500/month)' },
      { k: 'high', label: 'High commitments ($1000/month)' },
      { k: 'very_high', label: 'Very high commitments ($1500/month)' },
    ],
  },
  {
    key: 'netWorth',
    section: 'Finances',
    q: 'Total net worth / other assets?',
    hint: 'A secondary confidence modifier, not a replacement for liquidity.',
    tooltip: 'A confidence boost, but less important than liquid savings.',
    opts: [
      { k: '1000000+', label: '$1M+' },
      { k: '750000', label: '$750K' },
      { k: '500000', label: '$500K' },
      { k: '250000', label: '$250K' },
    ],
  },
  {
    key: 'hasJob',
    section: 'Career',
    q: 'Career situation after moving to India?',
    hint: 'Income continuity is the single biggest factor in readiness.',
    tooltip: 'The biggest readiness factor. Stable income lowers risk fast.',
    opts: [
      { k: 'remote_us', label: 'Keeping remote US / abroad job - same salary' },
      { k: 'india_job', label: 'India job confirmed - offer letter in hand' },
      { k: 'own_business', label: 'Running my own business - location independent' },
      { k: 'searching', label: 'Actively job hunting in India - no offer yet' },
      { k: 'no', label: 'No income plan yet - will figure it out after moving' },
    ],
  },
  {
    key: 'childrenCount',
    section: 'Family',
    q: 'How many children are you planning for?',
    hint: 'More children increase admissions, coordination, and planning complexity.',
    tooltip: 'More children usually means more planning complexity.',
    opts: [
      { k: 'none', label: 'None' },
      { k: 'one', label: '1' },
      { k: 'two_plus', label: '2+' },
    ],
  },
  {
    key: 'teenageChildren',
    section: 'Family',
    q: 'Do you have teenage children (13-17)?',
    hint: 'Teen transitions are the most likely to disrupt an otherwise solid move plan.',
    tooltip: 'Teen moves are usually the hardest school and social transition.',
    opts: [
      { k: 'none', label: 'None' },
      { k: 'one', label: '1' },
      { k: 'two_plus', label: '2+' },
    ],
  },
  {
    key: 'city',
    section: "Where You're Going",
    q: 'Target city in India?',
    hint: 'City changes cost and logistics, but should not overpower savings or income.',
    tooltip: 'City affects monthly burn and lifestyle trade-offs.',
    opts: [
      { k: 'Hyderabad', label: 'Hyderabad' },
      { k: 'Bangalore', label: 'Bangalore' },
      { k: 'Pune', label: 'Pune' },
      { k: 'Chennai', label: 'Chennai' },
      { k: 'Mumbai', label: 'Mumbai' },
      { k: 'DelhiNCR', label: 'Delhi NCR' },
      { k: 'Tier2', label: 'Tier 2 city (Kochi, Vizag, etc.)' },
      { k: 'undecided', label: 'Not decided yet' },
    ],
  },
  {
    key: 'housing',
    section: "Where You're Going",
    q: 'Housing situation in India?',
    hint: 'Housing readiness reduces both cost pressure and move stress.',
    tooltip: 'Arranged housing reduces stress and early uncertainty.',
    opts: [
      { k: 'owned', label: 'Own home - ready to move in' },
      { k: 'arranged', label: 'Rental finalized' },
      { k: 'searching', label: 'Actively searching' },
      { k: 'no', label: 'Not started yet' },
    ],
  },
  {
    key: 'knowsRNOR',
    section: 'Tax Planning',
    q: 'Aware of RNOR tax status?',
    hint: 'A planning-maturity signal that can materially affect post-move taxes.',
    tooltip: 'RNOR planning can reduce avoidable tax in the first years back.',
    opts: [
      { k: 'yes_filed', label: 'Yes - already planned with a CA specialist' },
      { k: 'yes_aware', label: 'Yes - aware but not planned yet' },
      { k: 'partial', label: 'Heard of it, not sure what it means' },
      { k: 'no', label: 'No - first time hearing this' },
    ],
  },
  {
    key: 'foreignAssets',
    section: 'Tax Planning',
    q: 'Do you have foreign financial assets (401k, RSUs, stocks, etc.) that need planning?',
    hint: 'Captures cross-border planning complexity without expanding the form too much.',
    tooltip: 'Foreign assets need tax and compliance planning before you move.',
    opts: [
      { k: 'planned', label: 'Yes - planned or being handled' },
      { k: 'unplanned', label: 'Yes - not yet planned' },
      { k: 'minimal', label: 'No / minimal' },
    ],
  },
]

void SETUP_QUESTIONS

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

type CustomTask = {
  id: string
  phase: number
  title: string
  desc: string
  createdAt: string
}

const PHASES = [
  'Foundation window',
  'Build and prepare window',
  'Final approach window',
  'Landing window',
  'Stabilize and optimize window',
]

const PHASE_WINDOWS = [
  '12+ months before move',
  '12 months to 3 months before move',
  'Final 3 months before move',
  'Move month to first 3 months in India',
  '3 months after move to first anniversary',
]

const TASKS: Task[] = [
  {
    id: 't01',
    phase: 0,
    title: 'Lock the move window and decision criteria',
    desc: 'Define the target move month, the non-negotiables for returning, and what must be true before you trigger the move. Best tackled 12 or more months before departure.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't02',
    phase: 0,
    title: 'Validate RNOR and cross-border tax strategy',
    desc: 'Work out RNOR timing, tax residency implications, retirement account questions, and the return date strategy with a specialist CA while the move window is still flexible.',
    priority: 'critical',
    milestoneId: 'rnor',
    isScoreImpact: true,
  },
  {
    id: 't03',
    phase: 0,
    title: 'Stress-test savings and first-year cash runway',
    desc: 'Model India living costs, setup costs, and a realistic no-income buffer so the move is not undercapitalized before decisions harden.',
    priority: 'critical',
    milestoneId: 'savings',
    isScoreImpact: true,
  },
  {
    id: 't04',
    phase: 0,
    title: 'Define income continuity after the move',
    desc: 'Secure the remote role, India offer, business continuity plan, or a clear bridge-income strategy before progressing into execution.',
    priority: 'critical',
    milestoneId: 'income',
    isScoreImpact: true,
  },
  {
    id: 't05',
    phase: 0,
    title: 'Choose city and neighborhood direction',
    desc: 'Narrow your destination so housing, schools, commute, and family logistics can all move from research to execution in the next window.',
    priority: 'critical',
    milestoneId: 'city',
    isScoreImpact: true,
  },
  {
    id: 't06',
    phase: 0,
    title: 'Set the family and school strategy',
    desc: 'Decide curriculum, shortlist schools, and align the family on timing early, especially if children are part of the move.',
    priority: 'essential',
    milestoneId: 'family',
    isScoreImpact: true,
  },
  {
    id: 't07',
    phase: 1,
    title: 'Set up banking and remittance rails',
    desc: 'Open or organize NRE/NRO banking, define transfer mechanics, and prepare where your operating cash will sit before and after the move. This belongs in the 12-to-3-month preparation window.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't08',
    phase: 1,
    title: 'Build the move documentation pack',
    desc: 'Gather passports, OCI or visa paperwork, school records, medical records, financial statements, and any documents that need apostille or notarization well before departure.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't09',
    phase: 1,
    title: 'Start school applications and record transfers',
    desc: 'Move from research into admissions, interviews, records collection, and calendar coordination if children are involved. This should start before the last quarter pre-move.',
    priority: 'critical',
    milestoneId: 'family',
    isScoreImpact: true,
  },
  {
    id: 't10',
    phase: 1,
    title: 'Buy India health insurance and care coverage',
    desc: 'Put health cover in force before the move and identify the core hospitals, doctors, and contingency plan for day-one care.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't11',
    phase: 1,
    title: 'Decide what to ship, sell, store, or carry',
    desc: 'Create the inventory plan, get shipping quotes, and avoid leaving logistics until the final month.',
    priority: 'essential',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't12',
    phase: 1,
    title: 'Arrange temporary or permanent housing',
    desc: 'Book the first 60-90 days or secure the permanent place so the arrival is stable rather than improvised.',
    priority: 'critical',
    milestoneId: 'housing',
    isScoreImpact: true,
  },
  {
    id: 't13',
    phase: 2,
    title: 'Finalize exit logistics in the current country',
    desc: 'Close or hand off leases, utilities, subscriptions, mail handling, storage, and any employer or school paperwork that must finish during the final 3 months before departure.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't14',
    phase: 2,
    title: 'Move operating cash and emergency reserves',
    desc: 'Transfer enough money for the first months in India while staying aligned with the remittance and tax plan before the travel date.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't15',
    phase: 2,
    title: 'Confirm the first 30-day arrival plan',
    desc: 'Lock flights, airport transfer, SIM or connectivity, temporary stay, first appointments, and the sequence for your first month in India.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't16',
    phase: 2,
    title: 'Pack critical carry-on documents and essentials',
    desc: 'Keep identity papers, financial access, prescriptions, school documents, and key onboarding items with you rather than in shipment.',
    priority: 'essential',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't17',
    phase: 2,
    title: 'Activate the move-week checklist',
    desc: 'Execute the last-week handoffs, vendor confirmations, final packing checks, and departure-day readiness list without gaps.',
    priority: 'essential',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't18',
    phase: 3,
    title: 'Complete arrival admin and local identity setup',
    desc: 'Update address and residency details across banking, PAN, Aadhaar, mobile, investments, and every system that now needs your India profile in the first 90 days.',
    priority: 'critical',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't19',
    phase: 3,
    title: 'Stabilize housing, school, and healthcare routines',
    desc: 'Move from temporary arrival mode into a durable weekly routine across home, commute, school, and medical care during your first 3 months in India.',
    priority: 'critical',
    milestoneId: 'housing',
    isScoreImpact: true,
  },
  {
    id: 't20',
    phase: 3,
    title: 'Execute the first India tax and residency cycle correctly',
    desc: 'Track residency days, validate RNOR treatment, and handle the first return-year decisions before mistakes become expensive.',
    priority: 'critical',
    milestoneId: 'rnor',
    isScoreImpact: true,
  },
  {
    id: 't21',
    phase: 4,
    title: 'Rebuild your local work and community base',
    desc: 'From month 3 onward, invest in professional network, family support systems, and the routines that make the move feel durable instead of transitional.',
    priority: 'essential',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't22',
    phase: 4,
    title: 'Run a 90-day and 12-month review',
    desc: 'Review finances, career fit, school stability, tax structure, and whether anything in the first-year plan needs correction before the one-year mark.',
    priority: 'essential',
    milestoneId: null,
    isScoreImpact: false,
  },
  {
    id: 't23',
    phase: 4,
    title: 'Restructure long-term financial and residency operations',
    desc: 'After the move has stabilized, clean up investment structure, account conversions, compliance cadence, and any first-year residency optimizations.',
    priority: 'critical',
    milestoneId: 'rnor',
    isScoreImpact: true,
  },
]

type JourneyState = {
  step: 'profile' | 'journey'
  editingProfile: boolean
  answers: Partial<Answers>
  completedTasks: Set<string>
  completedCustomTaskIds: Set<string>
  manualMilestones: Set<string>
  customTasks: CustomTask[]
  currentPhase: number
  lastMilestone: string | null
  firstName: string
}

type Action =
  | { type: 'SET_ANSWER'; key: keyof Answers; value: string }
  | { type: 'SET_MOVE_DATE'; value: string }
  | { type: 'START_JOURNEY' }
  | { type: 'EDIT_PROFILE' }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'TOGGLE_CUSTOM_TASK'; id: string }
  | { type: 'TOGGLE_MILESTONE'; id: string }
  | { type: 'SET_PHASE'; phase: number }
  | { type: 'SET_NAME'; name: string }
  | { type: 'ADD_CUSTOM_TASK'; phase: number; title: string; desc: string }
  | { type: 'LOAD_SAVED'; payload: Partial<JourneyState> }
  | { type: 'RESET' }

function journeyReducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, answers: { ...state.answers, [action.key]: action.value } }
    case 'SET_MOVE_DATE': {
      if (action.value === state.answers.moveDate) {
        return state
      }
      const timeline = moveDateToTimeline(action.value)
      const isPast = isMoveDatePast(action.value)
      const nextAnswers = {
        ...state.answers,
        moveDate: action.value,
        timeline,
        alreadyMoved: isPast ? state.answers.alreadyMoved || '' : '',
      }
      return {
        ...state,
        answers: nextAnswers,
        completedTasks: new Set(),
        currentPhase: getDefaultJourneyPhase(nextAnswers),
        lastMilestone: null,
      }
    }
    case 'SET_NAME':
      return { ...state, firstName: action.name }
    case 'ADD_CUSTOM_TASK':
      return {
        ...state,
        customTasks: [
          ...state.customTasks,
          {
            id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            phase: action.phase,
            title: action.title,
            desc: action.desc,
            createdAt: new Date().toISOString(),
          },
        ],
      }
    case 'LOAD_SAVED':
      return {
        ...state,
        ...action.payload,
        answers: action.payload.answers ?? state.answers,
        completedTasks: action.payload.completedTasks ?? state.completedTasks,
        completedCustomTaskIds: action.payload.completedCustomTaskIds ?? state.completedCustomTaskIds,
        manualMilestones: action.payload.manualMilestones ?? state.manualMilestones,
        customTasks: action.payload.customTasks ?? state.customTasks,
        currentPhase: action.payload.currentPhase ?? state.currentPhase,
        firstName: action.payload.firstName ?? state.firstName,
        editingProfile: action.payload.editingProfile ?? state.editingProfile,
      }
    case 'START_JOURNEY':
      return { ...state, step: 'journey', editingProfile: false, currentPhase: getDefaultJourneyPhase(state.answers) }
    case 'EDIT_PROFILE':
      return { ...state, step: 'profile', editingProfile: true }
    case 'SET_PHASE':
      return { ...state, currentPhase: action.phase }
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
    case 'TOGGLE_CUSTOM_TASK': {
      const newTasks = new Set(state.completedCustomTaskIds)
      if (newTasks.has(action.id)) newTasks.delete(action.id)
      else newTasks.add(action.id)
      return { ...state, completedCustomTaskIds: newTasks }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const initialState: JourneyState = {
  step: 'profile',
  editingProfile: false,
  answers: {},
  completedTasks: new Set(),
  completedCustomTaskIds: new Set(),
  manualMilestones: new Set(),
  customTasks: [],
  currentPhase: 0,
  lastMilestone: null,
  firstName: '',
}

function journeyPct(completedTaskCount: number, totalTaskCount: number) {
  if (!totalTaskCount) return 0
  return Math.round((completedTaskCount / totalTaskCount) * 100)
}

function getPostMoveRecommendation(A: Answers) {
  const noIncome = A.hasJob === 'no' || A.hasJob === 'searching'
  const lowSavings = A.savings === '50000'
  const rnorBlind = A.knowsRNOR === 'no' || A.knowsRNOR === 'partial'
  const noHousing = A.housing === 'no' || A.housing === 'searching'
  const hasTeens = getKidsAgeAnswer(A) === 'teen'

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

function phaseTaskStats(
  phase: number,
  completedTasks: Set<string>,
  customTasks: CustomTask[],
  completedCustomTaskIds: Set<string>
) {
  const phaseTasks = TASKS.filter((t) => t.phase === phase)
  const phaseCustomTasks = customTasks.filter((t) => t.phase === phase)
  const done =
    phaseTasks.filter((t) => completedTasks.has(t.id)).length +
    phaseCustomTasks.filter((t) => completedCustomTaskIds.has(t.id)).length
  const total = phaseTasks.length + phaseCustomTasks.length
  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, pct }
}

function getPastPhaseTaskIds(phases: number[]) {
  return new Set(TASKS.filter((task) => phases.includes(task.phase)).map((task) => task.id))
}

function formatMoveDate(moveDate?: string) {
  if (!moveDate || moveDate === 'exploring') return 'Exploring timeline'
  const [year, month] = moveDate.split('-')
  return `${MONTHS_FULL[Number(month) - 1]} ${year}`
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1)
}

function getActiveTimelinePhase(moveDate?: string) {
  if (!moveDate || moveDate === 'exploring') return 0
  const [year, month] = moveDate.split('-').map(Number)
  const move = new Date(year, month - 1, 1)
  const now = new Date()
  const current = new Date(now.getFullYear(), now.getMonth(), 1)
  const phase1Start = addMonths(move, -12)
  const phase2Start = addMonths(move, -3)
  const phase3Start = move
  const phase4Start = addMonths(move, 3)
  const phase5Start = addMonths(move, 12)

  if (current < phase1Start) return 0
  if (current < phase2Start) return 1
  if (current < phase3Start) return 2
  if (current < phase4Start) return 3
  if (current < phase5Start) return 4
  return 4
}

function getDefaultJourneyPhase(answers: Partial<Answers>) {
  const alreadyMoved = answers.alreadyMoved === 'yes'
  const visiblePhases = alreadyMoved ? [3, 4] : [0, 1, 2, 3, 4]
  const activePhase = getActiveTimelinePhase(answers.moveDate)
  return visiblePhases.includes(activePhase) ? activePhase : visiblePhases[0]
}

function getPhaseTimeStatus(phase: number, activePhase: number) {
  if (phase < activePhase) return 'past'
  if (phase === activePhase) return 'current'
  return 'future'
}

function SurfaceCard({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
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
  index,
  value,
  onChange,
}: {
  question: Question
  index: number
  value: string
  onChange: (value: string) => void
}) {
  return (
    <SurfaceCard style={{ padding: '1.2rem' }}>
      <div className="journey-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {question.section}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {question.q}</h3>
            {question.tooltip ? (
              <span
                title={question.tooltip}
                aria-label={question.tooltip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: `1px solid ${T.borderStrong}`,
                  color: T.soft,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'help',
                  userSelect: 'none',
                }}
              >
                i
              </span>
            ) : null}
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{question.hint}</p>
        </div>
        {value ? <Pill tone="green">Set</Pill> : null}
      </div>
      <div className="journey-option-grid" style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
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
  index,
  value,
  alreadyMoved,
  onMoveDate,
  onAlreadyMoved,
}: {
  index: number
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: T.ink }}>{index}. When are you planning to move?</h3>
            <span
              title="Shorter timelines need stronger finances, planning, and job certainty."
              aria-label="Shorter timelines need stronger finances, planning, and job certainty."
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `1px solid ${T.borderStrong}`,
                color: T.soft,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'help',
                userSelect: 'none',
              }}
            >
              i
            </span>
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>
            A shorter timeline demands stronger readiness before departure.
          </p>
        </div>
        {value ? <Pill tone="saffron">{formatMoveDate(value)}</Pill> : null}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Year
        </div>
        <div className="journey-year-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
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
        <div className="journey-month-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
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
  const visibleQuestions = REFINED_READINESS_QUESTIONS.filter((q) => q.key !== 'timeline')
  const beforeTimelineQuestions = visibleQuestions.slice(0, 1)
  const afterTimelineQuestions = visibleQuestions.slice(1)
  const answered = visibleQuestions.filter((q) => state.answers[q.key]).length
  const moveDateAnswered = !!state.answers.moveDate
  const alreadyMovedRequired = isMoveDatePast(state.answers.moveDate || '')
  const alreadyMovedAnswered = !alreadyMovedRequired || !!state.answers.alreadyMoved
  const totalRequired = visibleQuestions.length + 1 + (alreadyMovedRequired ? 1 : 0)
  const totalAnswered = answered + (moveDateAnswered ? 1 : 0) + (alreadyMovedAnswered && alreadyMovedRequired ? 1 : 0)
  const allDone = totalAnswered === totalRequired
  const progress = Math.round((totalAnswered / totalRequired) * 100)
  const projectedAnswers = state.answers as Answers

  const projectedScore = useMemo(() => {
    const requiredKeys: (keyof Answers)[] = [
      'country',
      'savings',
      'commitments',
      'netWorth',
      'hasJob',
      'city',
      'housing',
      'childrenCount',
      'teenageChildren',
      'knowsRNOR',
      'foreignAssets',
      'timeline',
      'moveDate',
      'alreadyMoved',
    ]
    const completeEnough = requiredKeys.every((key) => {
      if (key === 'alreadyMoved' && !alreadyMovedRequired) return true
      return !!state.answers[key]
    })
    return completeEnough ? computeScore(projectedAnswers).total : null
  }, [alreadyMovedRequired, projectedAnswers, state.answers])

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5F0', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)', padding: '2rem 1.25rem 4rem', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .journey-shell { max-width: 1240px; margin: 0 auto; }
        .journey-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        .sticky-panel { position: sticky; top: 96px; }
        .option-grid { display: grid; gap: 1rem; }
        @media (max-width: 980px) {
          .journey-grid { grid-template-columns: 1fr; }
          .sticky-panel { position: static; }
        }
        @media (max-width: 640px) {
          .journey-shell {
            padding-bottom: 2rem;
          }
          .journey-option-grid,
          .journey-year-grid,
          .journey-month-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .journey-question-label,
          .journey-progress-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .journey-metric {
            min-width: 0 !important;
          }
          .journey-primary-action {
            width: 100%;
            min-width: 0 !important;
          }
        }
      `}</style>

      <div className="journey-shell">
        <div className="journey-grid">
          <div className="sticky-panel">
            <SurfaceCard style={{ overflow: 'hidden' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: T.dark }}>
                <Pill tone="saffron">Journey setup</Pill>
                <h1 style={{ fontSize: 'clamp(2.35rem, 6vw, 4.5rem)', lineHeight: 0.96, color: T.white, marginTop: 16, marginBottom: 14 }}>
                  Plan the move like a real transition.
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>
                  Answer the same guided questions you see in the readiness check and we’ll shape the live relocation dashboard from them.
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
                      What you’ll get
                    </div>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14, color: T.muted }}>
                      <div>A premium move-back workflow built from your saved readiness answers</div>
                      <div>Phased guidance from planning through year one in India</div>
                      <div>Progress tracking, next-best action, and timeline tasks</div>
                    </div>
                  </SurfaceCard>

                  <SurfaceCard style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Your progress
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
                      {totalAnswered} of {totalRequired} questions answered
                    </div>
                    <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>
                      {allDone
                        ? 'Everything is filled in and ready for your personalised dashboard.'
                        : `${totalRequired - totalAnswered} question${totalRequired - totalAnswered === 1 ? '' : 's'} left before you can start the journey.`}
                    </div>
                  </SurfaceCard>

                  <SurfaceCard style={{ padding: '1rem 1rem 0.95rem', boxShadow: 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      How to answer
                    </div>
                    <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.65 }}>
                      {projectedScore !== null
                        ? 'Your saved readiness answers are already strong enough to initialize the journey immediately.'
                        : 'Pick the option that best fits your current move. You can update the setup anytime before entering the dashboard.'}
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
                  <Pill tone="navy">Journey profile</Pill>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: T.ink, marginTop: 14, marginBottom: 8 }}>
                    Build your journey profile
                  </h2>
                  <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.8, maxWidth: 760 }}>
                    Move through the questions below and we’ll turn your answers into your relocation dashboard, milestones, and next-step actions.
                  </p>
                </div>
              </div>
            </SurfaceCard>

            {beforeTimelineQuestions.map((question, index) => (
              <QuestionBlock
                key={question.key}
                index={index}
                question={question}
                value={state.answers[question.key] || ''}
                onChange={(value) => dispatch({ type: 'SET_ANSWER', key: question.key, value })}
              />
            ))}

            <TimelinePicker
              index={beforeTimelineQuestions.length + 1}
              value={state.answers.moveDate || ''}
              alreadyMoved={state.answers.alreadyMoved || ''}
              onMoveDate={(value) => dispatch({ type: 'SET_MOVE_DATE', value })}
              onAlreadyMoved={(value) => dispatch({ type: 'SET_ANSWER', key: 'alreadyMoved', value })}
            />

            {afterTimelineQuestions.map((question, index) => (
              <QuestionBlock
                key={question.key}
                index={beforeTimelineQuestions.length + 1 + index}
                question={question}
                value={state.answers[question.key] || ''}
                onChange={(value) => dispatch({ type: 'SET_ANSWER', key: question.key, value })}
              />
            ))}

            {allDone ? (
              <button
                type="button"
                className="journey-primary-action"
                onClick={() => dispatch({ type: 'START_JOURNEY' })}
                style={{ width: '100%', padding: '15px', background: T.saffron, color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}
              >
                {state.editingProfile ? 'Return to Dashboard →' : 'Open Journey Dashboard →'}
              </button>
            ) : (
              <SurfaceCard className="journey-progress-row" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.25rem' }}>📋</div>
                <div>
                  <div style={{ fontSize: '13px', color: T.muted }}>Answer all {totalRequired} questions to start your journey</div>
                  <div style={{ fontSize: '11px', color: T.soft, marginTop: '2px' }}>{totalRequired - totalAnswered} question{totalRequired - totalAnswered !== 1 ? 's' : ''} remaining</div>
                </div>
              </SurfaceCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function JourneyDashboard({
  state,
  dispatch,
  userEmail,
  userLastName,
}: {
  state: JourneyState
  dispatch: React.Dispatch<Action>
  userEmail?: string
  userLastName?: string
}) {
  const [tab, setTab] = useState<'tasks' | 'guidance'>('tasks')
  const [draftTaskTitle, setDraftTaskTitle] = useState('')
  const [draftTaskDesc, setDraftTaskDesc] = useState('')

  const A = state.answers as Answers
  const alreadyMoved = A.alreadyMoved === 'yes'
  const readinessScore = computeScore(A).total
  const readinessStatus =
    readinessScore >= 80 ? 'ready_to_return' : readinessScore >= 60 ? 'moderately_ready' : 'not_ready_yet'

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

  const customTasksByPhase = useMemo(() => {
    const map = new Map<number, CustomTask[]>()
    state.customTasks.forEach((task) => {
      const current = map.get(task.phase) || []
      current.push(task)
      map.set(task.phase, current)
    })
    return map
  }, [state.customTasks])

  const visiblePhases = useMemo(() => (alreadyMoved ? [3, 4] : [0, 1, 2, 3, 4]), [alreadyMoved])
  const activeTimelinePhase = getActiveTimelinePhase(A.moveDate)
  const journeyPhaseIndex = visiblePhases.includes(activeTimelinePhase) ? activeTimelinePhase : visiblePhases[0]
  const selectedPhaseIndex = visiblePhases.includes(state.currentPhase) ? state.currentPhase : journeyPhaseIndex
  const currentPhaseLabel = PHASES[journeyPhaseIndex]
  const currentPhaseTasks = TASKS.filter((task) => task.phase === journeyPhaseIndex)
  const journeyHealthPhases = visiblePhases.filter((phase) => phase <= journeyPhaseIndex)
  const autoCompletedPastTaskIds = useMemo(
    () => getPastPhaseTaskIds(visiblePhases.filter((phase) => phase < journeyPhaseIndex)),
    [journeyPhaseIndex, visiblePhases]
  )
  const effectiveCompletedTasks = useMemo(() => {
    const merged = new Set(state.completedTasks)
    autoCompletedPastTaskIds.forEach((id) => merged.add(id))
    return merged
  }, [autoCompletedPastTaskIds, state.completedTasks])
  const pct = journeyPct(effectiveCompletedTasks.size + state.completedCustomTaskIds.size, TASKS.length + state.customTasks.length)
  const completedMsCount = msCompleted.size
  const highImpact = MILESTONES.find((m) => !msCompleted.has(m.id))
  const postMove = getPostMoveRecommendation(A)
  const nextTask =
    currentPhaseTasks.find((task) => !effectiveCompletedTasks.has(task.id) && task.priority === 'critical') ||
    currentPhaseTasks.find((task) => !effectiveCompletedTasks.has(task.id)) ||
    TASKS.filter((task) => visiblePhases.includes(task.phase)).find((task) => !effectiveCompletedTasks.has(task.id)) ||
    null

  const guidanceItems = alreadyMoved
    ? postMove.actions
    : highImpact
      ? [
          `Close the "${highImpact.label}" milestone first because it unlocks the most leverage in your relocation plan.`,
          nextTask ? `Then complete "${nextTask.title}" to keep your phase moving without creating downstream friction.` : 'Stay consistent with the remaining phase tasks so the move keeps compounding smoothly.',
          A.moveDate && A.moveDate !== 'exploring'
            ? `Keep your move timing anchored to ${formatMoveDate(A.moveDate)} and avoid dragging critical decisions later than they need to go.`
            : 'Set a realistic move window once income, city, and housing direction are stable.',
        ]
      : ['You have already closed the major move-back levers. Focus on staying consistent through the remaining phases.']

  useEffect(() => {
    if (alreadyMoved && state.currentPhase < 3) {
      dispatch({ type: 'SET_PHASE', phase: 3 })
    }
  }, [alreadyMoved, dispatch, state.currentPhase])

  return (
    <div style={{ minHeight: '100vh', background: T.hero }}>
      <style>{`
        .dashboard-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .hero-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; align-items: stretch; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, minmax(240px, 320px)); gap: 0.9rem; justify-content: start; }
        .overview-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 1rem; }
        .milestone-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.9rem; }
        .phase-grid { display: grid; gap: 10px; }
        .journey-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
        .journey-toolbar-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
        @media (max-width: 980px) {
          .hero-grid, .overview-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, minmax(220px, 1fr)); }
        }
        @media (max-width: 640px) {
          .dashboard-shell { padding: 1rem 0.9rem 2rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .phase-grid { grid-template-columns: 1fr !important; }
          .journey-phase-panel { display: none; }
          .journey-metric { min-width: 0 !important; width: calc(50% - 8px); }
          .journey-top-actions,
          .journey-toolbar,
          .journey-toolbar-tabs { align-items: stretch !important; }
          .journey-edit-button { margin-left: 0 !important; width: 100%; }
          .journey-task-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>

      <div className="dashboard-shell">
        <div className="hero-grid" style={{ marginBottom: '1rem' }}>
          <SurfaceCard style={{ padding: '1.15rem 1.15rem 1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Next best action
                </div>
                <h2 style={{ fontSize: '1.15rem', color: T.ink, marginBottom: 6 }}>{nextTask ? nextTask.title : alreadyMoved ? postMove.title : 'Stay on the current path'}</h2>
              </div>
              {nextTask?.priority === 'critical' ? <Pill tone="saffron">Critical now</Pill> : <Pill tone="navy">Guided flow</Pill>}
            </div>

            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, marginBottom: 10 }}>
              {nextTask
                ? nextTask.desc
                : alreadyMoved
                  ? postMove.text
                  : highImpact
                    ? highImpact.description
                    : 'You have already closed the main risk areas and can keep working through the remaining phases.'}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: '-2px', marginBottom: 2 }}>
              <Pill tone="saffron">{currentPhaseLabel}</Pill>
              {!alreadyMoved && highImpact ? <Pill tone="navy">{highImpact.pillar}</Pill> : null}
              <Pill tone="green">{completedMsCount}/{MILESTONES.length} milestones</Pill>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 10,
              }}
            >
              {[
                { label: 'Journey', value: `${pct}%` },
                { label: 'Phase', value: `${journeyPhaseIndex + 1}` },
                { label: 'Move target', value: formatMoveDate(A.moveDate) },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    padding: '0.9rem',
                    borderRadius: 18,
                    background: 'rgba(29,22,15,0.03)',
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ fontSize: 11, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, lineHeight: 1.4 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: '0.95rem 1rem',
                borderRadius: 18,
                background: alreadyMoved ? postMove.bg : T.saffronSoft,
                border: `1px solid ${alreadyMoved ? postMove.border : T.border}`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: alreadyMoved ? postMove.color : T.bronze, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                {alreadyMoved ? 'Recommendation' : 'Why this matters'}
              </div>
              <div style={{ fontSize: 14, color: alreadyMoved ? postMove.color : T.bronze, lineHeight: 1.75 }}>
                {alreadyMoved
                  ? postMove.actions[0]
                  : nextTask
                    ? `This is the cleanest move to keep the relocation plan advancing without creating avoidable downstream stress.`
                    : 'Your journey is in a stable position right now.'}
              </div>
            </div>
          </SurfaceCard>

          <FounderConsultationCard
            variant="dashboard"
            source="journey_dashboard"
            email={userEmail}
            firstName={state.firstName}
            lastName={userLastName}
            readinessStatus={readinessStatus}
          />
        </div>

        <div className="journey-top-actions" style={{ marginBottom: '1rem' }}>
          <SurfaceCard style={{ padding: '0.8rem 0.9rem' }}>
            <div className="journey-toolbar">
              <div className="journey-toolbar-tabs">
                {[
                  ['guidance', 'Guidance'],
                  ['tasks', 'Task flow'],
                ].map(([value, label]) => {
                  const active = tab === value
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setTab(value as 'guidance' | 'tasks')}
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
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: 'EDIT_PROFILE' })}
                className="journey-edit-button"
                style={{
                  padding: '0.8rem 1.05rem',
                  borderRadius: 999,
                  border: `1px solid ${T.border}`,
                  background: T.paper,
                  color: T.muted,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Update profile answers
              </button>
            </div>
          </SurfaceCard>
        </div>

        {tab === 'guidance' ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="overview-grid">
              <SurfaceCard style={{ padding: '1.35rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Journey health
                    </div>
                    <h2 style={{ fontSize: '1.35rem', color: T.ink }}>Progress through the relocation timeline</h2>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  {journeyHealthPhases.map((phase) => {
                    const stats = phaseTaskStats(phase, effectiveCompletedTasks, state.customTasks, state.completedCustomTaskIds)
                    return (
                      <div key={phase}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: T.muted }}>{PHASES[phase]} • {PHASE_WINDOWS[phase]}</span>
                          <strong style={{ color: phase === journeyPhaseIndex ? T.saffron : T.green }}>{stats.done}/{stats.total}</strong>
                        </div>
                        <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${stats.pct}%`, height: '100%', background: phase === journeyPhaseIndex ? T.saffron : T.green }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </SurfaceCard>

              <SurfaceCard style={{ padding: '1.35rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Next steps
                </div>
                <h2 style={{ fontSize: '1.35rem', color: T.ink, marginBottom: 12 }}>
                  {alreadyMoved ? 'What to tighten this month' : 'What to focus on right now'}
                </h2>
                <div style={{ display: 'grid', gap: 10 }}>
                  {guidanceItems.map((item, index) => (
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

            <SurfaceCard className="journey-phase-panel" style={{ padding: '1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Relocation guidance
                  </div>
                  <h2 style={{ fontSize: '1.35rem', color: T.ink }}>Milestones shaping the rest of the move</h2>
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
                        <Pill tone="saffron">{milestone.pillar}</Pill>
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
                Select a phase above to focus on that part of the move.
              </p>

              <div className="phase-grid" style={{ gridTemplateColumns: `repeat(${alreadyMoved ? 2 : 5}, minmax(0, 1fr))` }}>
                {(alreadyMoved ? [3, 4] : [0, 1, 2, 3, 4]).map((phase) => {
                  const stats = phaseTaskStats(phase, effectiveCompletedTasks, state.customTasks, state.completedCustomTaskIds)
                  const active = selectedPhaseIndex === phase
                  const phaseStatus = getPhaseTimeStatus(phase, activeTimelinePhase)
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
                        background: active ? T.saffronSoft : phaseStatus === 'future' ? 'rgba(29,22,15,0.03)' : T.white,
                        opacity: phaseStatus === 'future' && !active ? 0.68 : 1,
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: active ? T.bronze : T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        {PHASE_WINDOWS[phase]}
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

            {(() => {
              const phase = selectedPhaseIndex
              const tasks = TASKS.filter((task) => task.phase === phase)
              const customTasks = customTasksByPhase.get(phase) || []
              const done =
                tasks.filter((task) => effectiveCompletedTasks.has(task.id)).length +
                customTasks.filter((task) => state.completedCustomTaskIds.has(task.id)).length
              const totalTasks = tasks.length + customTasks.length
              const allDone = done === totalTasks && totalTasks > 0

              return (
                <SurfaceCard
                  style={{
                    overflow: 'hidden',
                    borderColor: allDone ? 'rgba(23,117,58,0.18)' : T.border,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '1.2rem 1.25rem',
                      background: T.dark,
                      color: T.white,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 16,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        {PHASE_WINDOWS[phase]}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{PHASES[phase]}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 800 }}>{done}/{totalTasks}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                        {allDone ? 'Complete' : `${totalTasks - done} left`}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0.4rem 0' }}>
                    {tasks.map((task, index) => {
                      const isDone = effectiveCompletedTasks.has(task.id)
                      const isAutoPast = autoCompletedPastTaskIds.has(task.id) && !state.completedTasks.has(task.id)
                      return (
                        <div
                          key={task.id}
                          className="journey-task-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '28px minmax(0, 1fr)',
                            gap: 14,
                            padding: '1rem 1.25rem',
                            borderTop: index === 0 ? 'none' : `1px solid ${T.border}`,
                            background: T.paper,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (isAutoPast) return
                              dispatch({ type: 'TOGGLE_TASK', id: task.id })
                            }}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 8,
                              border: `1.5px solid ${isDone ? T.green : task.priority === 'critical' ? T.saffron : T.borderStrong}`,
                              background: isDone ? T.green : 'transparent',
                              marginTop: 2,
                              cursor: isAutoPast ? 'default' : 'pointer',
                              opacity: isAutoPast ? 0.85 : 1,
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
                              {isAutoPast ? <Pill tone="green">Past phase</Pill> : null}
                            </div>
                            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{task.desc}</div>
                          </div>
                        </div>
                      )
                    })}

                    {customTasks.map((task) => {
                      const isDone = state.completedCustomTaskIds.has(task.id)
                      return (
                        <div
                          key={task.id}
                          className="journey-task-row"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '28px minmax(0, 1fr)',
                            gap: 14,
                            padding: '1rem 1.25rem',
                            borderTop: `1px solid ${T.border}`,
                            background: 'rgba(23,62,143,0.03)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => dispatch({ type: 'TOGGLE_CUSTOM_TASK', id: task.id })}
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 8,
                              border: `1.5px solid ${isDone ? T.green : T.navy}`,
                              background: isDone ? T.green : 'transparent',
                              marginTop: 2,
                            }}
                          />
                          <div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
                              <div style={{ fontSize: 15, fontWeight: 800, color: isDone ? T.soft : T.ink, textDecoration: isDone ? 'line-through' : 'none' }}>
                                {task.title}
                              </div>
                              <Pill tone="navy">Custom task</Pill>
                            </div>
                            {task.desc ? <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.75 }}>{task.desc}</div> : null}
                          </div>
                        </div>
                      )
                    })}

                    <div style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${T.border}`, background: 'rgba(23,62,143,0.04)' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.navy, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                        Add your own task for this phase
                      </div>
                      <div style={{ display: 'grid', gap: 10 }}>
                        <input
                          type="text"
                          value={draftTaskTitle}
                          onChange={(e) => setDraftTaskTitle(e.target.value)}
                          placeholder="Custom task title"
                          style={{
                            width: '100%',
                            padding: '0.85rem 0.9rem',
                            borderRadius: 14,
                            border: `1px solid ${T.border}`,
                            background: T.white,
                            color: T.ink,
                            fontSize: 13,
                          }}
                        />
                        <textarea
                          value={draftTaskDesc}
                          onChange={(e) => setDraftTaskDesc(e.target.value)}
                          placeholder="Optional details, deadline, vendor, school name, banker, CA note, or reminder"
                          style={{
                            width: '100%',
                            minHeight: 72,
                            padding: '0.85rem 0.9rem',
                            borderRadius: 14,
                            border: `1px solid ${T.border}`,
                            background: T.white,
                            color: T.ink,
                            fontSize: 13,
                            resize: 'vertical',
                            fontFamily: 'DM Sans, sans-serif',
                          }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                          <div style={{ fontSize: 13, color: T.muted }}>Use this for personal tasks the default planner does not know about.</div>
                          <button
                            type="button"
                            onClick={() => {
                              const title = draftTaskTitle.trim()
                              const desc = draftTaskDesc.trim()
                              if (!title) return
                              dispatch({ type: 'ADD_CUSTOM_TASK', phase, title, desc })
                              setDraftTaskTitle('')
                              setDraftTaskDesc('')
                            }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: 999,
                              border: 'none',
                              background: T.navy,
                              color: T.white,
                              fontSize: 13,
                              fontWeight: 800,
                            }}
                          >
                            Add task
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '1rem 1.25rem 1.15rem',
                        borderTop: `1px solid ${T.border}`,
                        background: 'rgba(29,22,15,0.03)',
                      }}
                    >
                      <div style={{ fontSize: 14, color: allDone ? T.green : T.muted }}>
                        {allDone ? 'All tasks in this phase are complete.' : `${totalTasks - done} tasks remaining in this phase.`}
                      </div>
                    </div>
                  </div>
                </SurfaceCard>
              )
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

export default function JourneyPage() {
  const { shouldBlock } = useProtectedRoute()
  const { user, loading: authLoading } = useAuth()
  const [state, dispatch] = useReducer(journeyReducer, initialState)
  const [loadingSavedJourney, setLoadingSavedJourney] = useState(true)

  useEffect(() => {
    let active = true

    async function loadSavedJourney() {
      if (authLoading) return

      if (!user?.id) {
        if (!active) return
        dispatch({ type: 'LOAD_SAVED', payload: { firstName: '', step: 'profile' } })
        setLoadingSavedJourney(false)
        return
      }

      const { data, error } = await supabase
        .from('planner_submissions')
        .select('answers_json, result_json')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) return

      const savedAnswers = (data?.answers_json || {}) as Partial<Answers>
      const hasSavedReadiness =
        Boolean(data?.answers_json) &&
        Boolean(data?.result_json) &&
        Object.keys(savedAnswers).length > 0

      let persisted: Partial<JourneyState> = {}
      if (hasSavedReadiness && typeof window !== 'undefined') {
        try {
          const raw = window.localStorage.getItem(`journey:state:${user.id}`)
          if (raw) {
            const parsed = JSON.parse(raw) as {
              answers?: Partial<Answers>
              completedTaskIds?: string[]
              completedCustomTaskIds?: string[]
              manualMilestoneIds?: string[]
              customTasks?: CustomTask[]
              currentPhase?: number
            }
            persisted = {
              answers: parsed.answers || {},
              completedTasks: new Set(parsed.completedTaskIds || []),
              completedCustomTaskIds: new Set(parsed.completedCustomTaskIds || []),
              manualMilestones: new Set(parsed.manualMilestoneIds || []),
              customTasks: parsed.customTasks || [],
              currentPhase: typeof parsed.currentPhase === 'number' ? parsed.currentPhase : 0,
            }
          }
        } catch {
          persisted = {}
        }
      } else if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(`journey:state:${user.id}`)
        } catch {
          // Ignore storage cleanup errors and continue with server-only state.
        }
      }

      if (error) {
        console.error('Error loading journey initialization:', error)
      }

      const mergedAnswers = hasSavedReadiness ? { ...savedAnswers, ...(persisted.answers || {}) } : {}

      dispatch({
        type: 'LOAD_SAVED',
        payload: {
          firstName: user.firstName || '',
          answers: mergedAnswers,
          step: hasSavedReadiness ? 'journey' : 'profile',
          editingProfile: false,
          completedTasks: persisted.completedTasks,
          completedCustomTaskIds: persisted.completedCustomTaskIds,
          manualMilestones: persisted.manualMilestones,
          customTasks: persisted.customTasks,
          currentPhase: typeof persisted.currentPhase === 'number' ? persisted.currentPhase : getDefaultJourneyPhase(mergedAnswers),
        },
      })
      setLoadingSavedJourney(false)
    }

    void loadSavedJourney()

    return () => {
      active = false
    }
  }, [authLoading, user])

  useEffect(() => {
    if (loadingSavedJourney || !user?.id || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        `journey:state:${user.id}`,
        JSON.stringify({
            answers: state.answers,
            completedTaskIds: [...state.completedTasks],
            completedCustomTaskIds: [...state.completedCustomTaskIds],
            manualMilestoneIds: [...state.manualMilestones],
            customTasks: state.customTasks,
            currentPhase: state.currentPhase,
          })
        )
    } catch {
      return
    }
  }, [loadingSavedJourney, state.answers, state.completedCustomTaskIds, state.completedTasks, state.currentPhase, state.customTasks, state.editingProfile, state.manualMilestones, state.step, user?.id])

  useEffect(() => {
    if (loadingSavedJourney || typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [loadingSavedJourney, state.step])

  if (shouldBlock || loadingSavedJourney) return null
  if (state.step === 'profile') return <ProfileSetup state={state} dispatch={dispatch} />
  return <JourneyDashboard state={state} dispatch={dispatch} userEmail={user?.email} userLastName={user?.lastName} />
}
