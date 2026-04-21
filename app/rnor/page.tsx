'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Inputs = {
  country: string
  yearsAbroad: string
  plannedMoveMonth: string
  plannedMoveYear: string
  annualSalary: string
  hasRSUs: string
  rsuVestingValue: string
  has401k: string
  k401Balance: string
  hasRentalIncome: string
  rentalIncome: string
  hasDividends: string
  dividendIncome: string
  hasNREAccount: string
  filedForm12A: string
  hasIndiaIncome: string
  indiaIncome: string
  employmentType: string
}

type TaxResult = {
  rnorStartDate: string
  rnorEndDate: string
  rnorWindowMonths: number
  isEligible: boolean
  eligibilityReason: string
  headline: string
  savingsOutlook: string
  primaryLever: string
  protectedCategoryCount: string
  protectedCategorySummary: string
  taxFreeIncome: number
  taxableInIndia: number
  estimatedTaxSaved: number
  rnorYear1Saving: number
  rnorYear2Saving: number
  rnorTotalSaving: number
  rsuStrategy: string
  k401Strategy: string
  nreStrategy: string
  formsToFile: { form: string; deadline: string; purpose: string; priority: 'urgent' | 'important' | 'normal' }[]
  yearByYear: { year: string; status: string; foreignIncomeTax: string; indiaIncomeTax: string; totalTax: string; saving: string; color: string }[]
  risks: { level: 'high' | 'medium' | 'low'; title: string; detail: string; action: string }[]
  insights: { icon: string; title: string; detail: string; type: 'positive' | 'warning' | 'info' }[]
  incomeBreakdown: { source: string; profile: string; note: string; benefitHint: string; logic: string }[]
}

const LEGACY_STEPS = [
  {
    key: 'country', section: 'Your Profile',
    q: 'Where are you currently based?',
    hint: 'Different countries have different RNOR exit rules and double-taxation treaties with India',
    opts: [
      { k: 'USA', label: 'United States', sub: 'DTAA treaty with India · 401k rules apply' },
      { k: 'UK', label: 'United Kingdom', sub: 'UK-India DTAA · ISA rules differ' },
      { k: 'UAE', label: 'UAE / Middle East', sub: 'No income tax · strong RNOR benefit' },
      { k: 'Canada', label: 'Canada', sub: 'RRSP rules · deemed disposition on exit' },
      { k: 'Singapore', label: 'Singapore', sub: 'CPF rules · low tax base' },
      { k: 'Other', label: 'Other country', sub: 'General RNOR rules apply' },
    ],
  },
  {
    key: 'yearsAbroad', section: 'Your Profile',
    q: 'How many years have you been a non-resident of India?',
    hint: 'This is the most critical input — determines your RNOR window length',
    opts: [
      { k: '15+', label: '15+ years', sub: 'Maximum RNOR window — 3 years' },
      { k: '10to15', label: '10–15 years', sub: 'Full 2–3 year RNOR window' },
      { k: '7to10', label: '7–10 years', sub: 'Full 2 year RNOR window' },
      { k: '5to7', label: '5–7 years', sub: 'Partial RNOR — 1–2 years' },
      { k: '3to5', label: '3–5 years', sub: 'Limited RNOR — verify eligibility' },
      { k: 'under3', label: 'Under 3 years', sub: 'May not qualify — needs CA review' },
    ],
  },
  {
    key: 'plannedMoveMonth', section: 'Your Profile',
    q: 'Which month are you planning to move to India?',
    hint: 'Moving before April 1st vs after affects which tax year your RNOR starts',
    opts: [
      { k: 'jan', label: 'January', sub: 'Q1 — starts mid tax year' },
      { k: 'feb', label: 'February', sub: 'Q4 US tax year ending' },
      { k: 'mar', label: 'March', sub: 'Last month before India FY end' },
      { k: 'apr', label: 'April', sub: 'India FY start — best timing' },
      { k: 'may', label: 'May–June', sub: 'Early India FY' },
      { k: 'jul', label: 'July–September', sub: 'Mid India FY' },
      { k: 'oct', label: 'October–December', sub: 'Q3 — 2nd half India FY' },
    ],
  },
  {
    key: 'plannedMoveYear', section: 'Your Profile',
    q: 'Which year are you planning to move?',
    hint: 'Determines the exact RNOR window and tax year calculations',
    opts: [
      { k: '2025', label: '2025', sub: 'Already moved / wrapping up' },
      { k: '2026', label: '2026', sub: 'This year' },
      { k: '2027', label: '2027', sub: 'Next year' },
      { k: '2028', label: '2028+', sub: '2 or more years away' },
    ],
  },
  {
    key: 'employmentType', section: 'Income Sources',
    q: 'What best describes your employment situation after moving?',
    hint: 'Determines which income streams are affected by RNOR',
    opts: [
      { k: 'remote_us', label: 'Remote — keeping US job', sub: 'US salary continues · biggest RNOR benefit' },
      { k: 'india_job', label: 'Switching to India job', sub: 'India salary only after move' },
      { k: 'business', label: 'Running own business', sub: 'Business income structure matters' },
      { k: 'sabbatical', label: 'Taking a break', sub: 'Living off savings / investments' },
      { k: 'freelance', label: 'Freelancing / consulting', sub: 'Mixed India + foreign income' },
    ],
  },
  {
    key: 'annualSalary', section: 'Income Sources',
    q: 'What is your current annual salary (USD)?',
    hint: 'Your foreign salary during RNOR period is 100% tax-free in India',
    opts: [
      { k: '300k+', label: '$300,000+', sub: 'Senior / Staff level' },
      { k: '200k', label: '$200,000–$300,000', sub: 'L6+ / Senior Manager' },
      { k: '150k', label: '$150,000–$200,000', sub: 'L5 / Manager level' },
      { k: '100k', label: '$100,000–$150,000', sub: 'Mid-senior level' },
      { k: '75k', label: '$75,000–$100,000', sub: 'Mid level' },
      { k: 'under75', label: 'Under $75,000', sub: 'Early / Mid career' },
    ],
  },
  {
    key: 'hasRSUs', section: 'Income Sources',
    q: 'Do you have unvested RSUs (Restricted Stock Units)?',
    hint: 'RSU vesting timing relative to your RNOR window can save enormous amounts',
    opts: [
      { k: 'yes_significant', label: 'Yes — $100,000+ unvested', sub: 'Critical to plan vesting carefully' },
      { k: 'yes_moderate', label: 'Yes — $25,000–$100,000', sub: 'Worth strategic planning' },
      { k: 'yes_small', label: 'Yes — under $25,000', sub: 'Moderate planning needed' },
      { k: 'no', label: 'No RSUs', sub: 'Skip this section' },
    ],
  },
  {
    key: 'has401k', section: 'Income Sources',
    q: 'Do you have a 401(k) or other US retirement account?',
    hint: 'Withdrawals from 401k in India have complex tax treatment — timing is everything',
    opts: [
      { k: 'yes_large', label: 'Yes — over $500,000', sub: 'High-priority planning needed' },
      { k: 'yes_medium', label: 'Yes — $100,000–$500,000', sub: 'Important to plan' },
      { k: 'yes_small', label: 'Yes — under $100,000', sub: 'Standard planning' },
      { k: 'no', label: 'No 401(k)', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasRentalIncome', section: 'Income Sources',
    q: 'Do you earn rental income from US property?',
    hint: 'Foreign rental income during RNOR is tax-free in India',
    opts: [
      { k: 'yes', label: 'Yes — I own US rental property', sub: 'Income is RNOR tax-free' },
      { k: 'no', label: 'No rental income', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasDividends', section: 'Income Sources',
    q: 'Do you have US investment accounts with dividends or capital gains?',
    hint: 'US-sourced dividends and gains during RNOR are not taxed in India',
    opts: [
      { k: 'yes_significant', label: 'Yes — significant portfolio', sub: '$200K+ in US investments' },
      { k: 'yes_moderate', label: 'Yes — moderate portfolio', sub: 'Under $200K' },
      { k: 'no', label: 'No significant US investments', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasNREAccount', section: 'Tax Planning',
    q: 'Do you have an NRE account in India?',
    hint: 'NRE accounts are the primary vehicle for tax-free money transfers during RNOR',
    opts: [
      { k: 'yes_active', label: 'Yes — actively using it', sub: 'Transfers in progress' },
      { k: 'yes_inactive', label: 'Yes — but not using it much', sub: 'Need to activate it' },
      { k: 'no', label: 'No NRE account yet', sub: 'Need to open one urgently' },
    ],
  },
  {
    key: 'filedForm12A', section: 'Tax Planning',
    q: 'Have you planned how RNOR will be reviewed and reported in your Indian tax return?',
    hint: 'RNOR is based on stay history under India tax residency rules, not a separate application.',
    opts: [
      { k: 'yes', label: 'Yes — already planned', sub: 'Stay history and return-year approach reviewed' },
      { k: 'not_yet_planning', label: 'Not yet — but planning to', sub: 'Need travel history and tax-return prep' },
      { k: 'didnt_know', label: 'Did not know this', sub: 'Review RNOR rules before you move' },
      { k: 'havent_moved', label: "Haven't moved yet", sub: 'Track move date and India days from day one' },
    ],
  },
]

void LEGACY_STEPS

type Step = {
  key: string
  section: string
  q: string
  hint: string
  opts?: { k: string; label: string; sub: string }[]
  questionType?: 'options' | 'timeline'
  showIf?: { key: keyof Inputs; value: string }
}

const MONTH_OPTIONS = [
  { key: 'jan', label: 'Jan' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Aug' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dec' },
] as const

function getRNORYearRange(): string[] {
  const year = new Date().getFullYear()
  return [year, year + 1, year + 2, year + 3].map(String)
}

function isStepVisible(step: Step, answers: Partial<Inputs>) {
  return !step.showIf || answers[step.showIf.key] === step.showIf.value
}

function isStepAnswered(step: Step, answers: Partial<Inputs>) {
  if (step.questionType === 'timeline') return !!answers.plannedMoveMonth && !!answers.plannedMoveYear
  return !!answers[step.key as keyof Inputs]
}

const DISPLAY_STEPS: Step[] = [
  {
    key: 'country', section: 'Your Profile',
    q: 'Where are you currently based?',
    hint: 'Different countries have different RNOR exit rules and double-taxation treaties with India',
    opts: [
      { k: 'USA', label: 'United States', sub: 'DTAA treaty with India · 401(k) rules apply' },
      { k: 'UK', label: 'United Kingdom', sub: 'UK-India DTAA · ISA rules differ' },
      { k: 'UAE', label: 'UAE / Middle East', sub: 'No income tax · strong RNOR benefit' },
      { k: 'Canada', label: 'Canada', sub: 'RRSP rules · deemed disposition on exit' },
      { k: 'Singapore', label: 'Singapore', sub: 'CPF rules · low tax base' },
      { k: 'Other', label: 'Other country', sub: 'General RNOR rules apply' },
    ],
  },
  {
    key: 'yearsAbroad', section: 'Your Profile',
    q: 'How many years have you been a non-resident of India?',
    hint: 'This is the most critical input - it shapes your likely RNOR window length',
    opts: [
      { k: '10plus', label: '10+ years', sub: 'Strongest RNOR position - often the longest window' },
      { k: '7to10', label: '7-10 years', sub: 'Full 2 year RNOR window' },
      { k: '5to7', label: '5-7 years', sub: 'Partial RNOR - 1-2 years' },
      { k: '3to5', label: '3-5 years', sub: 'Limited RNOR - verify eligibility' },
      { k: 'under3', label: 'Under 3 years', sub: 'May not qualify - needs CA review' },
    ],
  },
  {
    key: 'plannedMoveDate', section: 'Your Profile',
    q: 'When are you planning to move to India?',
    hint: 'Pick both year and month so we can model the RNOR start date more cleanly',
    questionType: 'timeline',
  },
  {
    key: 'employmentType', section: 'Income Sources',
    q: 'What best describes your employment situation after moving?',
    hint: 'Determines which income streams are affected by RNOR',
    opts: [
      { k: 'remote_us', label: 'Remote - keeping US job', sub: 'US salary continues · biggest RNOR benefit' },
      { k: 'india_job', label: 'Switching to India job', sub: 'India salary only after move' },
      { k: 'business', label: 'Running own business', sub: 'Business income structure matters' },
      { k: 'sabbatical', label: 'Taking a break', sub: 'Living off savings / investments' },
      { k: 'freelance', label: 'Freelancing / consulting', sub: 'Mixed India + foreign income' },
    ],
  },
  {
    key: 'annualSalary', section: 'Income Sources',
    q: 'What is your current annual salary (USD)?',
    hint: 'Shown only if you plan to continue a US-paid role after moving',
    showIf: { key: 'employmentType', value: 'remote_us' },
    opts: [
      { k: '300k+', label: '$300,000+', sub: 'Senior / Staff level' },
      { k: '200k', label: '$200,000-$300,000', sub: 'L6+ / Senior Manager' },
      { k: '150k', label: '$150,000-$200,000', sub: 'L5 / Manager level' },
      { k: '100k', label: '$100,000-$150,000', sub: 'Mid-senior level' },
      { k: '75k', label: '$75,000-$100,000', sub: 'Mid level' },
      { k: 'under75', label: 'Under $75,000', sub: 'Early / Mid career' },
    ],
  },
  {
    key: 'hasRSUs', section: 'Income Sources',
    q: 'Do you have unvested RSUs (Restricted Stock Units)?',
    hint: 'RSU vesting timing relative to your RNOR window can save enormous amounts',
    opts: [
      { k: 'yes_significant', label: 'Yes - $100,000+ unvested', sub: 'Critical to plan vesting carefully' },
      { k: 'yes_moderate', label: 'Yes - $25,000-$100,000', sub: 'Worth strategic planning' },
      { k: 'yes_small', label: 'Yes - under $25,000', sub: 'Moderate planning needed' },
      { k: 'no', label: 'No RSUs', sub: 'Skip this section' },
    ],
  },
  {
    key: 'has401k', section: 'Income Sources',
    q: 'Do you have a 401(k) or other US retirement account?',
    hint: 'Withdrawals from 401(k) after you move need treaty-aware planning',
    opts: [
      { k: 'yes_large', label: 'Yes - over $500,000', sub: 'High-priority planning needed' },
      { k: 'yes_medium', label: 'Yes - $100,000-$500,000', sub: 'Important to plan' },
      { k: 'yes_small', label: 'Yes - under $100,000', sub: 'Standard planning' },
      { k: 'no', label: 'No 401(k)', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasRentalIncome', section: 'Income Sources',
    q: 'Do you earn rental income from US property?',
    hint: 'Foreign rental income during RNOR is tax-free in India',
    opts: [
      { k: 'yes', label: 'Yes - I own US rental property', sub: 'Income is RNOR tax-free' },
      { k: 'no', label: 'No rental income', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasDividends', section: 'Income Sources',
    q: 'Do you have US investment accounts with dividends or capital gains?',
    hint: 'US-sourced dividends and gains during RNOR are not taxed in India',
    opts: [
      { k: 'yes_significant', label: 'Yes - significant portfolio', sub: '$200K+ in US investments' },
      { k: 'yes_moderate', label: 'Yes - moderate portfolio', sub: 'Under $200K' },
      { k: 'no', label: 'No significant US investments', sub: 'Not applicable' },
    ],
  },
  {
    key: 'hasNREAccount', section: 'Tax Planning',
    q: 'Do you have an NRE account in India?',
    hint: 'NRE accounts are the primary vehicle for tax-efficient money transfers during RNOR',
    opts: [
      { k: 'yes_active', label: 'Yes - actively using it', sub: 'Transfers in progress' },
      { k: 'yes_inactive', label: 'Yes - but not using it much', sub: 'Need to activate it' },
      { k: 'no', label: 'No NRE account yet', sub: 'Need to open one urgently' },
    ],
  },
  {
    key: 'filedForm12A', section: 'Tax Planning',
    q: 'Have you planned how RNOR will be reviewed and reported in your Indian tax return?',
    hint: 'RNOR is based on stay history under India tax residency rules, not a separate application.',
    opts: [
      { k: 'yes', label: 'Yes - already planned', sub: 'Stay history and return-year approach reviewed' },
      { k: 'not_yet_planning', label: 'Not yet - but planning to', sub: 'Need travel history and tax-return prep' },
      { k: 'didnt_know', label: 'Did not know this', sub: 'Review RNOR rules before you move' },
      { k: 'havent_moved', label: "Haven't moved yet", sub: 'Track move date and India days from day one' },
    ],
  },
]

function InfoTip({ text }: { text: string }) {
  return (
    <span className="rnor-tooltip-wrap" tabIndex={0}>
      <button type="button" className="rnor-tooltip-trigger" aria-label="How this works">i</button>
      <span className="rnor-tooltip-bubble">{text}</span>
    </span>
  )
}

// ─── COMPUTATION ENGINE ───────────────────────────────────────────────────────

function computeRNOR(I: Inputs): TaxResult {

  // ── RNOR Window ──────────────────────────────────────────────────────────────
  const windowMap: Record<string, number> = { '10plus': 36, '7to10': 24, '5to7': 18, '3to5': 12, 'under3': 0 }
  const rnorMonths = windowMap[I.yearsAbroad] || 0
  const isEligible = rnorMonths > 0

  const moveYear = parseInt(I.plannedMoveYear) || new Date().getFullYear()
  const moveMonthMap: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 }
  const moveMonth = moveMonthMap[I.plannedMoveMonth] || 4

  const startDate = new Date(moveYear, moveMonth - 1, 1)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + rnorMonths)

  const startStr = startDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  const endStr = endDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  const eligibilityReason = !isEligible
    ? 'Less than 3 years abroad — RNOR may not apply. Consult a CA immediately.'
    : I.yearsAbroad === '10plus'
    ? 'You qualify for the maximum 3-year RNOR window — highest possible tax benefit.'
    : I.yearsAbroad === '7to10'
    ? 'You qualify for a 2-year RNOR window — standard full RNOR benefit.'
    : 'You have partial RNOR eligibility — professional assessment recommended.'

  // ── Income Calculation ────────────────────────────────────────────────────────
  const salaryMap: Record<string, number> = { '300k+': 350000, '200k': 250000, '150k': 175000, '100k': 125000, '75k': 87500, 'under75': 60000 }
  const salaryRangeLabel: Record<string, string> = { '300k+': '$300,000+', '200k': '$200,000-$300,000', '150k': '$150,000-$200,000', '100k': '$100,000-$150,000', '75k': '$75,000-$100,000', 'under75': 'under $75,000' }
  const annualSalaryUSD = I.employmentType === 'remote_us' ? (salaryMap[I.annualSalary] || 0) : 0
  const annualSalaryINR = annualSalaryUSD * 83

  const rsuMap: Record<string, number> = { 'yes_significant': 150000, 'yes_moderate': 60000, 'yes_small': 15000, 'no': 0 }
  const rsuRangeLabel: Record<string, string> = { 'yes_significant': '$100,000+', 'yes_moderate': '$25,000-$100,000', 'yes_small': 'under $25,000', 'no': 'No RSUs' }
  const rsuValueUSD = rsuMap[I.hasRSUs] || 0
  const rsuValueINR = rsuValueUSD * 83

  const k401RangeLabel: Record<string, string> = { 'yes_large': 'over $500,000', 'yes_medium': '$100,000-$500,000', 'yes_small': 'under $100,000', 'no': 'No 401(k)' }
  const dividendProfileLabel: Record<string, string> = { 'yes_significant': 'Large US portfolio', 'yes_moderate': 'Moderate US portfolio', 'no': 'No major US investment income' }
  const rentalUSD = I.hasRentalIncome === 'yes' ? 24000 : 0
  const rentalINR = rentalUSD * 83

  const dividendUSD = I.hasDividends === 'yes_significant' ? 20000 : I.hasDividends === 'yes_moderate' ? 8000 : 0
  const dividendINR = dividendUSD * 83

  // ── Tax Calculations ──────────────────────────────────────────────────────────
  // India tax rate on foreign income (30% surcharge for high income)
  const annualRecurringForeignIncome = annualSalaryINR + rentalINR + dividendINR
  const indiaTaxRate = annualRecurringForeignIncome > 10000000 ? 0.42 : annualRecurringForeignIncome > 5000000 ? 0.30 : annualRecurringForeignIncome > 0 ? 0.20 : 0

  // Tax saved per year on salary during RNOR
  const yearlySalarySaving = annualRecurringForeignIncome * indiaTaxRate
  const rnorYears = rnorMonths / 12
  const totalSalarySaving = yearlySalarySaving * rnorYears
  const recurringProtectedIncomeTotal = annualRecurringForeignIncome * rnorYears

  // RSU saving — if vested during RNOR window
  const rsuSaving = rsuValueINR * indiaTaxRate

  // 401k — don't withdraw during RNOR (India would tax it)
  const totalSaving = Math.round(totalSalarySaving + rsuSaving)
  const year1Saving = Math.round(Math.min(totalSaving, yearlySalarySaving + rsuSaving))
  const year2Saving = Math.round(yearlySalarySaving)

  const taxFreeIncome = isEligible ? Math.round(recurringProtectedIncomeTotal + rsuValueINR) : 0
  const taxPer100kHint = indiaTaxRate >= 0.4
    ? 'Rule of thumb: each USD 100K of qualifying foreign income protected for a full RNOR year can avoid roughly Rs35L of India tax at the top slab.'
    : indiaTaxRate >= 0.3
    ? 'Rule of thumb: each USD 100K of qualifying foreign income protected for a full RNOR year can avoid roughly Rs25L of India tax at common higher slabs.'
    : 'Rule of thumb: each USD 100K of qualifying foreign income protected for a full RNOR year can avoid roughly Rs17L of India tax at lower slabs.'

  const protectedCategories: string[] = []
  if (annualSalaryINR > 0 && I.employmentType === 'remote_us') protectedCategories.push('US salary')
  if (I.hasRSUs !== 'no') protectedCategories.push('RSU vesting')
  if (I.hasRentalIncome === 'yes') protectedCategories.push('US rental income')
  if (I.hasDividends !== 'no') protectedCategories.push('US dividends and gains')

  const protectedCategoryCount = protectedCategories.length === 0 ? 'No categories flagged' : protectedCategories.length === 1 ? '1 category' : `${protectedCategories.length} categories`
  const protectedCategorySummary = protectedCategories.length === 0 ? 'The main value here is timing, treaty awareness, and compliance.' : protectedCategories.join(' | ')
  const savingsOutlook = !isEligible ? 'Needs review' : totalSaving >= 10000000 ? 'Very high' : totalSaving >= 3000000 ? 'High' : totalSaving >= 1000000 ? 'Moderate' : 'Focused'
  const primaryLever = I.employmentType === 'remote_us'
    ? 'US salary continuity'
    : I.hasRSUs !== 'no'
    ? 'RSU vesting timing'
    : I.hasDividends !== 'no'
    ? 'Investment income timing'
    : I.hasRentalIncome === 'yes'
    ? 'Rental income treatment'
    : 'Move timing and compliance'
  const headline = !isEligible
    ? 'RNOR eligibility needs verification'
    : I.employmentType === 'remote_us'
    ? 'Remote foreign income is your biggest RNOR opportunity'
    : protectedCategories.length > 0
    ? 'Your RNOR window can protect selected foreign income categories'
    : 'This RNOR window is most useful for planning, compliance, and timing'

  // ── RSU Strategy ─────────────────────────────────────────────────────────────
  let rsuStrategy = ''
  if (I.hasRSUs === 'no') {
    rsuStrategy = 'No RSUs — not applicable.'
  } else if (I.hasRSUs === 'yes_significant') {
    rsuStrategy = `You selected the ${rsuRangeLabel[I.hasRSUs]} RSU bucket. Time vesting to occur before you move or within your RNOR window (${startStr}-${endStr}) where possible. Use actual vest dates and actual vest values with your CA before acting.`
  } else {
    rsuStrategy = `Schedule RSU vesting events to fall within your RNOR window (${startStr}-${endStr}) where possible. Use actual vest dates and actual vest values with your CA for final tax math.`
  }

  // ── 401k Strategy ────────────────────────────────────────────────────────────
  let k401Strategy = ''
  if (I.has401k === 'no') {
    k401Strategy = 'No 401(k) — not applicable.'
  } else {
    const selectedRange = k401RangeLabel[I.has401k] || 'the selected range'
    k401Strategy = `Your selected 401(k) range (${selectedRange}) needs case-by-case planning. US withdrawals can trigger tax and, if taken early, penalties. The India position during RNOR depends on factors such as whether the payment is periodic or lump-sum, your treaty residence, and whether you remain a US citizen or green-card holder. If you do not need the money immediately, leaving it invested is often the lower-friction option. Review any withdrawal with a US-India cross-border tax specialist before acting.`
  }

  // ── NRE Strategy ─────────────────────────────────────────────────────────────
  let nreStrategy = ''
  if (I.hasNREAccount === 'no') {
    nreStrategy = 'Open an NRE account immediately — before you move. NRE accounts allow you to transfer foreign earnings to India completely tax-free. Interest earned in NRE accounts is also tax-free in India during RNOR. After your RNOR window ends, transfer the remaining NRE balance to an NRO account for domestic use.'
  } else if (I.hasNREAccount === 'yes_inactive') {
    nreStrategy = 'Activate your NRE account and begin systematic transfers NOW. Move your emergency fund and near-term expenses to NRE before you land. The interest on NRE balance is tax-free in India during RNOR. Set up a regular transfer schedule to maximise the tax-free window.'
  } else {
    nreStrategy = 'Your NRE account is active — keep maximising transfers. Remember: NRE accounts must be converted to resident accounts within 3 months of your RNOR window ending. Plan this conversion carefully to avoid penalties.'
  }

  // ── Forms to File ─────────────────────────────────────────────────────────────
  const forms: TaxResult['formsToFile'] = [
    { form: 'No separate RNOR form', deadline: 'Before filing your India return', purpose: 'For individuals, RNOR is determined from stay history and is typically reflected in the tax return if eligible', priority: 'urgent' },
    { form: 'ITR-2', deadline: 'July 31st of each assessment year', purpose: 'Annual India income tax return where RNOR status is generally reflected for the relevant year', priority: 'important' },
    { form: 'Schedule FSI', deadline: 'With ITR-2', purpose: 'Report foreign source income and review what falls outside India tax scope during RNOR', priority: 'important' },
    { form: 'Schedule TR', deadline: 'With ITR-2', purpose: 'Claim DTAA tax relief on income already taxed abroad', priority: 'important' },
    { form: 'FEMA Declaration', deadline: 'Within 180 days of arriving', purpose: 'Declare foreign assets to RBI under FEMA regulations', priority: 'important' },
  ]

  if (I.hasRentalIncome === 'yes') {
    forms.push({ form: 'Schedule OS (ITR-2)', deadline: 'With ITR-2', purpose: 'Declare US rental income as foreign source — tax-free during RNOR', priority: 'normal' })
  }

  // ── Year by Year ──────────────────────────────────────────────────────────────
  const yearByYear: TaxResult['yearByYear'] = []
  const fyStartYear = (d: Date) => (d.getMonth() + 1 >= 4 ? d.getFullYear() : d.getFullYear() - 1)
  const monthDiff = (start: Date, end: Date) => Math.max(0, ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth()))
  const startFY = fyStartYear(startDate)
  const endFY = fyStartYear(endDate)
  for (let fy = startFY; fy <= endFY; fy++) {
    const fyStart = new Date(fy, 3, 1)
    const fyEnd = new Date(fy + 1, 3, 1)
    const overlapStart = startDate > fyStart ? startDate : fyStart
    const overlapEnd = endDate < fyEnd ? endDate : fyEnd
    const monthsInRNOR = overlapEnd > overlapStart ? monthDiff(overlapStart, overlapEnd) : 0
    const status = monthsInRNOR === 12 ? 'RNOR' : monthsInRNOR > 0 ? `Partial RNOR (${monthsInRNOR} mo)` : 'Resident'
    const recurringSavingForFY = (yearlySalarySaving * monthsInRNOR) / 12
    const rsuSavingForFY = fy === startFY ? rsuSaving : 0
    const totalSavingForFY = recurringSavingForFY + rsuSavingForFY
    const residentMonths = 12 - monthsInRNOR
    const residentTaxForFY = (yearlySalarySaving * residentMonths) / 12
    yearByYear.push({
      year: `FY ${fy}-${(fy + 1).toString().slice(2)}`,
      status,
      foreignIncomeTax: monthsInRNOR === 12 ? 'Qualifying foreign income can stay outside India tax for the full FY, subject to source rules.' : monthsInRNOR > 0 ? `Only the ${monthsInRNOR} RNOR months get this treatment; activity outside them needs review.` : 'Resident year - global income usually returns to India tax scope.',
      indiaIncomeTax: 'India-source income stays taxable under the normal slab rules.',
      totalTax: monthsInRNOR > 0 ? 'Use the RNOR months carefully for salary, vesting, rent, dividends, and realized gains.' : 'Post-RNOR years need treaty review before withdrawals, gains, or retirement-account actions.',
      saving: monthsInRNOR > 0 ? 'Window open - use actual amounts with your CA for final tax math.' : 'No RNOR shelter in this FY.',
      color: monthsInRNOR > 0 ? '#138808' : '#FF9933',
    })
  }

  // ── Risks ─────────────────────────────────────────────────────────────────────
  const risks: TaxResult['risks'] = []

  if (!isEligible) risks.push({ level: 'high', title: 'RNOR eligibility uncertain', detail: 'Under 3 years abroad may not qualify for RNOR. You could be treated as a Resident from day 1, making ALL global income taxable in India.', action: 'Get a written opinion from a CA specialising in NRI taxation before moving.' })

  if (I.filedForm12A === 'didnt_know') risks.push({ level: 'high', title: 'RNOR reporting plan is missing', detail: 'RNOR is not claimed through a separate form. If you do not track stay history and plan the first India return properly, you can still create avoidable tax and reporting mistakes.', action: 'Review your travel history, count India days, and confirm the return-year reporting approach with an NRI-focused CA.' })

  if (I.hasRSUs !== 'no' && rsuValueINR > 5000000) risks.push({ level: 'high', title: `Large RSU exposure (${rsuRangeLabel[I.hasRSUs]}) — vesting timing critical`, detail: 'RSUs vesting after your RNOR window ends will be fully taxable in India at 30%+. Wrong timing could cost you crores.', action: 'Map every vesting date against your RNOR window. Accelerate vesting where possible through employer.' })

  if (I.has401k === 'yes_large') risks.push({ level: 'medium', title: 'Large 401(k) balance — complex tax treatment', detail: 'Large 401(k) balances need careful planning. Early withdrawals can trigger US tax and penalties, and the India position after your move depends on treaty and residency facts.', action: 'Engage a cross-border tax specialist (US-India) before making any withdrawal decisions.' })

  if (I.hasNREAccount === 'no') risks.push({ level: 'medium', title: 'No NRE account — transfers unoptimised', detail: 'Without an NRE account, you cannot transfer foreign earnings to India tax-free. Every transfer through a regular account may be suboptimal.', action: 'Open NRE account this week. Takes 2–3 weeks for Indian banks with NRI branches.' })

  if (I.plannedMoveMonth === 'mar') risks.push({ level: 'low', title: 'March move timing — tax year split', detail: 'Moving in March leaves very little time before the financial year closes on March 31. This creates a more complex partial-year filing situation.', action: 'Consider moving in April instead to start clean with a full Indian financial year.' })

  // ── Insights ─────────────────────────────────────────────────────────────────
  const insights: TaxResult['insights'] = []

  insights.push({
    icon: '💡',
    title: `April is the optimal month to move`,
    detail: `Moving in April (start of India's financial year) gives you the cleanest RNOR window calculation, full year benefit from day 1, and avoids messy partial-year tax filings.`,
    type: I.plannedMoveMonth === 'apr' ? 'positive' : 'info',
  })

  if (I.employmentType === 'remote_us') {
    insights.push({
      icon: '🚀',
      title: 'Remote work + RNOR = maximum tax benefit',
      detail: `Keeping your US job while on RNOR status is usually the biggest lever in this tool. ${taxPer100kHint}`,
      type: 'positive',
    })
  }

  if (I.hasRSUs !== 'no' && isEligible) {
    insights.push({
      icon: '📈',
      title: 'Accelerate RSU vesting before RNOR window closes',
      detail: `Your selected RSU range (${rsuRangeLabel[I.hasRSUs]}) can benefit if vesting lands inside your RNOR window (${startStr}-${endStr}). Use actual vest values and vest dates with your CA for the final tax estimate.`,
      type: 'positive',
    })
  }

  if (I.has401k !== 'no') {
    insights.push({
      icon: '🏦',
      title: '401(k) withdrawals need treaty-aware planning',
      detail: 'Do not assume a 401(k) withdrawal is automatically taxable in India during RNOR, or automatically exempt. Periodic vs lump-sum withdrawals, treaty residence, and US citizenship or green-card status can change the answer.',
      type: 'warning',
    })
  }

  insights.push({
    icon: '📋',
    title: 'Hire a cross-border CA in your first month',
    detail: 'A CA who specialises in NRI taxation (not just a general CA) will save you 10–20x their fee in the first year alone. Look for CAs with US-India DTAA expertise in your target city.',
    type: 'info',
  })

  // ── Income Breakdown ──────────────────────────────────────────────────────────
  const incomeBreakdown: TaxResult['incomeBreakdown'] = []
  if (annualSalaryINR > 0 && I.employmentType === 'remote_us') incomeBreakdown.push({ source: 'US Salary', profile: `Selected range: ${salaryRangeLabel[I.annualSalary]}/yr`, note: 'Best case when compensation remains foreign-sourced and sits inside RNOR.', benefitHint: taxPer100kHint, logic: 'We use your salary band, RNOR window length, and a broad India slab estimate. Exact savings still depend on your real salary and sourcing facts.' })
  if (rsuValueINR > 0) incomeBreakdown.push({ source: 'RSU Vesting', profile: `Selected range: ${rsuRangeLabel[I.hasRSUs]}`, note: 'The benefit comes from vesting that lands inside the RNOR window.', benefitHint: 'Use actual vest values, not grant count. The same per-USD-100K heuristic can be a starting point.', logic: 'We only know the bucket, not the actual vest amount or vest dates, so this section stays range-based.' })
  if (rentalINR > 0) incomeBreakdown.push({ source: 'US Rental Income', profile: 'Rental income present', note: 'Apply RNOR analysis to actual net taxable rent, not property value.', benefitHint: 'Use your real annual net rent to estimate savings. Property price alone is not enough.', logic: 'The questionnaire only captures whether rental income exists, not the actual rent or deductible expenses.' })
  if (dividendINR > 0) incomeBreakdown.push({ source: 'US Dividends & Capital Gains', profile: dividendProfileLabel[I.hasDividends], note: 'Savings depend on actual dividend yield and realized gains, not portfolio size alone.', benefitHint: 'Estimate using actual annual dividends and realized gains. Do not assume the whole portfolio becomes tax-free income.', logic: 'The questionnaire does not ask for dividend rate, turnover, cost basis, or realized gain at sale, so we avoid exact rupee outputs here.' })

  return {
    rnorStartDate: startStr,
    rnorEndDate: endStr,
    rnorWindowMonths: rnorMonths,
    isEligible,
    eligibilityReason,
    headline,
    savingsOutlook,
    primaryLever,
    protectedCategoryCount,
    protectedCategorySummary,
    taxFreeIncome,
    taxableInIndia: 0,
    estimatedTaxSaved: totalSaving,
    rnorYear1Saving: year1Saving,
    rnorYear2Saving: year2Saving,
    rnorTotalSaving: totalSaving,
    rsuStrategy,
    k401Strategy,
    nreStrategy,
    formsToFile: forms,
    yearByYear,
    risks,
    insights,
    incomeBreakdown,
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

function RNORTimelinePicker({
  month,
  year,
  onChange,
}: {
  month?: string
  year?: string
  onChange: (month: string, year: string) => void
}) {
  const now = new Date()
  const selectedYear = year || ''
  const currentMonthIndex = now.getMonth() + 1

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Move year
        </div>
        <div className="rnor-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {getRNORYearRange().map((optionYear) => {
            const selected = selectedYear === optionYear
            return (
              <button
                type="button"
                key={optionYear}
                onClick={() => {
                  const selectedMonthIndex = month ? MONTH_OPTIONS.findIndex((option) => option.key === month) + 1 : 0
                  const nextMonthIndex = selectedMonthIndex > 0 ? selectedMonthIndex : optionYear === String(now.getFullYear()) ? currentMonthIndex : 4
                  const safeMonthIndex = optionYear === String(now.getFullYear()) && nextMonthIndex < currentMonthIndex ? currentMonthIndex : nextMonthIndex
                  onChange(MONTH_OPTIONS[safeMonthIndex - 1].key, optionYear)
                }}
                style={{
                  padding: '0.9rem 0.75rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? '#FF9933' : '#E5E1DA'}`,
                  background: selected ? '#FFF3E6' : '#FFFFFF',
                  color: selected ? '#1A1208' : '#6B5E50',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {optionYear}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Move month
        </div>
        <div className="rnor-timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
          {MONTH_OPTIONS.map((option, index) => {
            const monthNumber = index + 1
            const selected = month === option.key
            const disabled = !selectedYear || (selectedYear === String(now.getFullYear()) && monthNumber < currentMonthIndex)

            return (
              <button
                type="button"
                key={option.key}
                disabled={disabled}
                onClick={() => {
                  if (!selectedYear || disabled) return
                  onChange(option.key, selectedYear)
                }}
                style={{
                  padding: '0.95rem 0.5rem',
                  borderRadius: 16,
                  border: `1.5px solid ${selected ? '#FF9933' : '#E5E1DA'}`,
                  background: selected ? '#FFF3E6' : selectedYear ? '#FFFFFF' : 'rgba(29,22,15,0.03)',
                  color: selected ? '#1A1208' : !selectedYear ? '#B5A898' : disabled ? '#B5A898' : '#6B5E50',
                  fontSize: 13,
                  fontWeight: 700,
                  opacity: disabled ? 0.55 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function RNOROptimizer() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TaxResult | null>(null)

  const visibleSteps = DISPLAY_STEPS.filter((step) => isStepVisible(step, answers))
  const totalSteps = visibleSteps.length
  const answered = visibleSteps.filter((step) => isStepAnswered(step, answers)).length
  const progress = Math.round((answered / totalSteps) * 100)

  useEffect(() => {
    if (!result) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [result])

  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers(prev => {
      const next = { ...prev, [key]: val }
      if (key === 'employmentType' && val !== 'remote_us') delete next.annualSalary
      return next
    })
  }

  function setPlannedMoveDate(month: string, year: string) {
    setAnswers(prev => ({ ...prev, plannedMoveMonth: month, plannedMoveYear: year }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => {
      setResult(computeRNOR(answers as Inputs))
      setLoading(false)
    }, 1600)
  }

  function restart() {
    setAnswers({}); setResult(null); setLoading(false)
  }

  // ── LOADING ──
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Calculating your RNOR window...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Applying DTAA rules, FEMA regulations, and Income Tax Act provisions</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  // ── RESULT ──
  if (result) {
    const r = result
    const riskColors = {
      high: { bg: '#FCEBEB', border: 'rgba(226,75,74,0.2)', icon: '#E24B4A', text: '#791F1F' },
      medium: { bg: '#FFF3E6', border: 'rgba(255,153,51,0.2)', icon: '#FF9933', text: '#633806' },
      low: { bg: '#E8E8FF', border: 'rgba(0,0,128,0.15)', icon: '#6B8CFF', text: '#0C447C' },
    }
    const priorityColors = { urgent: '#E24B4A', important: '#FF9933', normal: '#138808' }
    const officialSources = [
      { label: 'Income-tax Act, 1961 Section 5 and Section 6', href: 'https://incometaxindia.gov.in/documents/income-tax-act-1961-amended-by-finance-no.-2-act-2024.pdf' },
      { label: 'IRS India treaty documents', href: 'https://www.irs.gov/businesses/international-businesses/india-tax-treaty-documents' },
      { label: 'India-US tax treaty PDF', href: 'https://www.irs.gov/pub/irs-trty/india.pdf' },
      { label: 'India treaty technical explanation', href: 'https://www.irs.gov/pub/irs-trty/inditech.pdf' },
    ]

    return (
      <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
        <style>{`
          .rnor-result-shell { max-width: 960px; margin: 0 auto; padding: 2rem; }
          .rnor-result-header-grid { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start; margin-bottom: 2rem; }
          .rnor-result-summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
          .rnor-result-strategy-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem; }
          .rnor-result-cta-grid { display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; }
          .rnor-total-row { display: flex; align-items: center; justify-content: space-between; }
          .rnor-form-row { display: flex; gap: 1rem; align-items: flex-start; }
          .rnor-risk-row { display: flex; gap: 1rem; }
          .rnor-tooltip-wrap { position: relative; display: inline-flex; vertical-align: middle; margin-left: 6px; }
          .rnor-tooltip-trigger { width: 18px; height: 18px; border: none; border-radius: 999px; background: #1A1208; color: #fff; font-size: 11px; line-height: 1; cursor: pointer; padding: 0; }
          .rnor-tooltip-bubble { position: absolute; left: 0; top: calc(100% + 8px); width: min(260px, calc(100vw - 3rem)); padding: 0.7rem 0.8rem; border-radius: 10px; background: #1A1208; color: rgba(255,255,255,0.88); font-size: 11px; line-height: 1.55; opacity: 0; pointer-events: none; transform: translateY(4px); transition: opacity 0.15s ease, transform 0.15s ease; z-index: 20; box-shadow: 0 14px 40px rgba(0,0,0,0.18); }
          .rnor-tooltip-wrap:hover .rnor-tooltip-bubble, .rnor-tooltip-wrap:focus-within .rnor-tooltip-bubble { opacity: 1; pointer-events: auto; transform: translateY(0); }
          @media (max-width: 860px) {
            .rnor-result-shell { padding: 1rem; }
            .rnor-result-header-grid { grid-template-columns: 1fr; gap: 1rem; }
            .rnor-result-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .rnor-result-strategy-grid { grid-template-columns: 1fr; }
            .rnor-result-cta-grid { grid-template-columns: 1fr; gap: 1rem; }
          }
          @media (max-width: 640px) {
            .rnor-result-summary-grid { grid-template-columns: 1fr; }
            .rnor-total-row, .rnor-form-row, .rnor-risk-row { flex-direction: column; align-items: flex-start; }
          }
        `}</style>

        {/* HEADER */}
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>RNOR Tax Optimizer Report</div>
            <div className="rnor-result-header-grid">
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                  {r.headline}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '620px' }}>{r.eligibilityReason} We show ranges and rule-of-thumb guidance here because the questionnaire captures bands and yes/no answers, not exact money values.</p>
              </div>
              {r.isEligible && (
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '1.5rem 2rem', textAlign: 'center', minWidth: '180px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>RNOR Window</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: '#FF9933', lineHeight: 1.1, marginBottom: '4px' }}>{r.rnorWindowMonths} months</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{r.rnorStartDate} → {r.rnorEndDate}</div>
                  <div style={{ background: '#E8F5E8', color: '#138808', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '100px' }}>RNOR Eligible</div>
                </div>
              )}
            </div>

            {/* Tax saving summary cards */}
            {r.isEligible && (
              <div className="rnor-result-summary-grid">
                {[
                  { label: 'Savings outlook', val: r.savingsOutlook, sub: 'Range-based view from your selected profile', color: '#FF9933', tip: 'We use your RNOR window, salary band, and selected foreign-income categories. Exact rupee savings require real salary, vest values, rent, dividends, and realized gains.' },
                  { label: 'Primary lever', val: r.primaryLever, sub: 'Your biggest planning opportunity', color: '#138808', tip: 'This is the category most likely to shape the RNOR opportunity for your answers.' },
                  { label: 'Categories in play', val: r.protectedCategoryCount, sub: r.protectedCategorySummary, color: '#7C5CBF', tip: 'These are the categories the questionnaire flagged. Final treatment still depends on source, timing, and treaty facts.' },
                  { label: 'Window ends', val: r.rnorEndDate, sub: 'Act before this date', color: '#FF9933', tip: 'The RNOR benefit depends on whether income, vesting, or withdrawals happen before this window closes.' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>{s.label}<InfoTip text={s.tip} /></div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: s.color, marginBottom: '2px' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rnor-result-shell">

          {/* INCOME BREAKDOWN */}
          {r.incomeBreakdown.length > 0 && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Potential RNOR-Protected Categories<InfoTip text='These cards stay range-based on purpose. The questionnaire does not ask for exact salary, vest values, rent, dividend yield, realized gains, or withdrawal amounts.' /></div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.65, marginBottom: '1rem' }}>We show ranges and heuristics here because the questionnaire does not ask for exact salary, vest values, rent, dividends, or realized gains.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {r.incomeBreakdown.map((inc, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: '#F7FAF7', borderRadius: '12px', border: '0.5px solid rgba(19,136,8,0.12)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{inc.source}</div>
                      <InfoTip text={inc.logic} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#138808', marginBottom: '6px' }}>{inc.profile}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '8px' }}>{inc.note}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{inc.benefitHint}</div>
                  </div>
                ))}
                <div className="rnor-total-row" style={{ padding: '12px 16px', background: 'var(--india-white)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>Use actual salary, vest values, rent, dividends, and realized gains with a CA for final tax math.</div>
                </div>
              </div>
            </div>
          )}

          {/* YEAR BY YEAR TABLE */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Year-by-Year Planning View<InfoTip text='This section shows when the RNOR window is open in each Indian financial year. It explains treatment and timing, not final rupee tax numbers.' /></div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Year', 'Status', 'Foreign Income Treatment', 'India Income', 'Planning Focus'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.yearByYear.map((yr, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid var(--border)', background: i % 2 === 0 ? 'var(--india-white)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--ink)' }}>{yr.year}</td>
                      <td style={{ padding: '10px 12px' }}><span style={{ background: yr.color === '#138808' ? '#E8F5E8' : '#FFF3E6', color: yr.color, fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px' }}>{yr.status}</span></td>
                      <td style={{ padding: '10px 12px', color: yr.color, fontWeight: 500 }}>{yr.foreignIncomeTax}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{yr.indiaIncomeTax}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)', fontWeight: 500 }}>{yr.saving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STRATEGIES */}
          <div className="rnor-result-strategy-grid">
            {[
              { title: '📈 RSU Strategy', content: r.rsuStrategy, color: '#7C5CBF', bg: 'rgba(124,92,191,0.06)' },
              { title: '🏦 401(k) Strategy', content: r.k401Strategy, color: '#000080', bg: 'rgba(0,0,128,0.04)' },
              { title: '🏛️ NRE Account Strategy', content: r.nreStrategy, color: '#138808', bg: 'rgba(19,136,8,0.04)' },
            ].map(s => (
              <div key={s.title} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: s.color, marginBottom: '0.75rem' }}>{s.title}</div>
                <div style={{ background: s.bg, borderRadius: '10px', padding: '12px', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.65 }}>{s.content}</div>
              </div>
            ))}
          </div>

          {/* FORMS TO FILE */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Key Tax Forms and Reporting Tasks</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {r.formsToFile.map((f, i) => (
                <div key={i} className="rnor-form-row" style={{ padding: '12px 16px', background: 'var(--india-white)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
                  <div style={{ width: '80px', flexShrink: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '3px' }}>{f.form}</div>
                    <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px', background: priorityColors[f.priority], color: '#fff', textTransform: 'uppercase' }}>{f.priority}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>{f.purpose}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>⏰ {f.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RISKS */}
          {r.risks.length > 0 && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Tax Risks For Your Profile</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {r.risks.map((risk, i) => {
                  const c = riskColors[risk.level]
                  return (
                    <div key={i} className="rnor-risk-row" style={{ background: c.bg, border: `0.5px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: c.icon, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{risk.level === 'high' ? '!' : risk.level === 'medium' ? '⚠' : 'i'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: c.text }}>{risk.title}</div>
                          <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: c.icon, color: '#fff', textTransform: 'uppercase' }}>{risk.level}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: c.text, opacity: 0.85, lineHeight: 1.6, marginBottom: '8px' }}>{risk.detail}</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: c.text }}>→ {risk.action}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* INSIGHTS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Key Tax Planning Insights</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1rem' }}>
              {r.insights.map((ins, i) => (
                <div key={i} style={{ background: ins.type === 'positive' ? '#E8F5E8' : ins.type === 'warning' ? '#FFF3E6' : 'var(--india-white)', border: `0.5px solid ${ins.type === 'positive' ? 'rgba(19,136,8,0.15)' : ins.type === 'warning' ? 'rgba(255,153,51,0.2)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{ins.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>{ins.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{ins.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Official Sources To Verify Before Acting</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Use these official India and US sources to verify the rules that apply to your case. Treaty interpretation, RNOR status, and retirement-account treatment can vary based on your facts, so review these with a qualified CA who handles NRI and US-India cross-border tax matters.
            </div>
            <div style={{ display: 'grid', gap: '0.8rem', marginBottom: '1rem' }}>
              {officialSources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', padding: '0.95rem 1rem', borderRadius: '12px', border: '0.5px solid var(--border)', background: 'var(--india-white)', color: 'var(--ink)', textDecoration: 'none', fontSize: '13px', lineHeight: 1.5 }}
                >
                  <strong>{source.label}</strong>
                  <div style={{ marginTop: 4, color: 'var(--ink-soft)', wordBreak: 'break-word' }}>{source.href}</div>
                </a>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#633806', lineHeight: 1.65, background: '#FFF3E6', border: '0.5px solid rgba(255,153,51,0.2)', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              Contact a CA before changing your move date, filing position, or taking any 401(k), IRA, RSU, or foreign-asset action.
            </div>
          </div>

          {/* DISCLAIMER + CTA */}
          <div style={{ background: 'rgba(26,18,8,0.04)', border: '0.5px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              ⚠️ <strong>Disclaimer:</strong> This tool provides educational guidance based on general NRI tax rules under the Income Tax Act 1961, FEMA, and applicable DTAA treaties. It does not constitute professional tax advice. Tax laws change frequently. Always consult a qualified CA with NRI expertise before making financial decisions. Savings estimates are indicative and based on general tax slabs.
            </div>
          </div>

          {/* CTA */}
          <div className="rnor-result-cta-grid" style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Want help with your full return plan?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Free tools to plan your full return — city match, school finder, readiness check, and more.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/planner" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Readiness check →</Link>
              <button onClick={restart} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>Recalculate</button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  // ── QUESTIONS ──
  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .rnor-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .rnor-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        .rnor-sticky { position: sticky; top: 96px; }
        .rnor-stack { display: grid; gap: 1rem; }
        .rnor-option-grid { display: grid; gap: 0.7rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .rnor-timeline-grid { display: grid; gap: 0.7rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
        @media (max-width: 980px) {
          .rnor-grid { grid-template-columns: 1fr; }
          .rnor-sticky { position: static; }
        }
        @media (max-width: 767px) {
          .rnor-shell { padding: 1rem 0.9rem 2rem; }
          .rnor-option-grid { grid-template-columns: 1fr !important; }
          .rnor-timeline-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .rnor-question-label { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div className="rnor-shell">
        <div className="rnor-grid">
          <div className="rnor-sticky">
            <div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    RNOR Tax Optimizer
                  </span>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '0.9rem' }}>
                  Plan your tax move like a <em style={{ fontStyle: 'italic', color: '#FF9933' }}>real transition.</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>
                  Answer the same guided questions as the readiness form and we’ll shape your RNOR window, tax estimate, and next actions from them.
                </p>
              </div>

              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B5E50', marginBottom: 8 }}>
                    <span>Assessment progress</span>
                    <span style={{ fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12 }}>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>What you’ll get</div>
                    <div style={{ display: 'grid', gap: 8, fontSize: 14, color: '#6B5E50' }}>
                      <div>Your RNOR eligibility window and likely start and end dates</div>
                      <div>A tax-saving estimate shaped by salary, RSUs, rental income, and account choices</div>
                      <div>The forms, timing risks, and specialist actions that matter most</div>
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Your progress</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1208', marginBottom: 4 }}>{answered} of {totalSteps} questions answered</div>
                    <div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{answered === totalSteps ? 'Everything is filled in and ready for your report.' : `${totalSteps - answered} question${totalSteps - answered === 1 ? '' : 's'} left before your report generates.`}</div>
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>How to answer</div>
                    <div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.7 }}>Pick the option that best describes your current tax profile. You can update any answer before generating the report.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rnor-stack">
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>RNOR Tax Optimizer · Free · {totalSteps} questions</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>How much can you save with RNOR status?</h2>
              <p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we’ll turn your answers into a clear RNOR window, tax estimate, and recommendation.</p>
            </div>

            {visibleSteps.map((step, index) => (
              <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
                <div className="rnor-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3>
                    <p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p>
                  </div>
                  {isStepAnswered(step, answers) ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span>
                  ) : null}
                </div>

                {step.questionType === 'timeline' ? (
                  <RNORTimelinePicker month={answers.plannedMoveMonth} year={answers.plannedMoveYear} onChange={setPlannedMoveDate} />
                ) : (
                  <div className="rnor-option-grid">
                    {step.opts?.map((opt) => {
                      const sel = answers[step.key as keyof Inputs] === opt.k
                      return (
                        <button
                          key={opt.k}
                          type="button"
                          onClick={() => setAnswer(step.key, opt.k)}
                          style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div>
                              <div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div>
                            </div>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

              </div>
            ))}
            {answered === totalSteps ? (
              <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My RNOR Report →</button>
            ) : (
              <div className="rnor-progress-row" style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.25rem' }}>📋</div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {totalSteps} questions to generate your report</div>
                  <div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{totalSteps - answered} question{totalSteps - answered !== 1 ? 's' : ''} remaining</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

