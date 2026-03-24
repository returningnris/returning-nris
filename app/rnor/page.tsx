'use client'

import { useState } from 'react'
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
  incomeBreakdown: { source: string; amount: number; taxable: boolean; note: string }[]
}

const STEPS = [
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
    q: 'Have you filed Form 12A (RNOR status application)?',
    hint: 'Form 12A must be filed within 30 days of arriving in India to lock RNOR status',
    opts: [
      { k: 'yes', label: 'Yes — already filed', sub: 'RNOR status confirmed' },
      { k: 'not_yet_planning', label: 'Not yet — but planning to', sub: 'Must file within 30 days of arrival' },
      { k: 'didnt_know', label: 'Did not know about this', sub: 'Critical — must act immediately' },
      { k: 'havent_moved', label: "Haven't moved yet", sub: 'File on arrival day' },
    ],
  },
]

// ─── COMPUTATION ENGINE ───────────────────────────────────────────────────────

function computeRNOR(I: Inputs): TaxResult {

  // ── RNOR Window ──────────────────────────────────────────────────────────────
  const windowMap: Record<string, number> = { '15+': 36, '10to15': 30, '7to10': 24, '5to7': 18, '3to5': 12, 'under3': 0 }
  const rnorMonths = windowMap[I.yearsAbroad] || 0
  const isEligible = rnorMonths > 0

  const moveYear = parseInt(I.plannedMoveYear) || 2026
  const moveMonthMap: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jul: 7, oct: 10 }
  const moveMonth = moveMonthMap[I.plannedMoveMonth] || 4

  const startDate = new Date(moveYear, moveMonth - 1, 1)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + rnorMonths)

  const startStr = startDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  const endStr = endDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  const eligibilityReason = !isEligible
    ? 'Less than 3 years abroad — RNOR may not apply. Consult a CA immediately.'
    : I.yearsAbroad === '15+'
    ? 'You qualify for the maximum 3-year RNOR window — highest possible tax benefit.'
    : I.yearsAbroad === '10to15'
    ? 'You qualify for a 2.5-year RNOR window — very strong position.'
    : I.yearsAbroad === '7to10'
    ? 'You qualify for a 2-year RNOR window — standard full RNOR benefit.'
    : 'You have partial RNOR eligibility — professional assessment recommended.'

  // ── Income Calculation ────────────────────────────────────────────────────────
  const salaryMap: Record<string, number> = { '300k+': 350000, '200k': 250000, '150k': 175000, '100k': 125000, '75k': 87500, 'under75': 60000 }
  const annualSalaryUSD = salaryMap[I.annualSalary] || 125000
  const annualSalaryINR = annualSalaryUSD * 83

  const rsuMap: Record<string, number> = { 'yes_significant': 150000, 'yes_moderate': 60000, 'yes_small': 15000, 'no': 0 }
  const rsuValueUSD = rsuMap[I.hasRSUs] || 0
  const rsuValueINR = rsuValueUSD * 83

  const k401Map: Record<string, number> = { 'yes_large': 750000, 'yes_medium': 250000, 'yes_small': 50000, 'no': 0 }
  const k401USD = k401Map[I.has401k] || 0

  const rentalUSD = I.hasRentalIncome === 'yes' ? 24000 : 0
  const rentalINR = rentalUSD * 83

  const dividendUSD = I.hasDividends === 'yes_significant' ? 20000 : I.hasDividends === 'yes_moderate' ? 8000 : 0
  const dividendINR = dividendUSD * 83

  // ── Tax Calculations ──────────────────────────────────────────────────────────
  const inrToLakh = (n: number) => (n / 100000)
  const fmtLakh = (n: number) => '₹' + inrToLakh(n).toFixed(1) + 'L'
  const fmtUSD = (n: number) => '$' + (n / 1000).toFixed(0) + 'K'

  // India tax rate on foreign income (30% surcharge for high income)
  const indiaTaxRate = annualSalaryINR > 10000000 ? 0.42 : annualSalaryINR > 5000000 ? 0.30 : 0.20

  // Tax saved per year on salary during RNOR
  const yearlySalarySaving = annualSalaryINR * indiaTaxRate
  const rnorYears = rnorMonths / 12
  const totalSalarySaving = yearlySalarySaving * rnorYears

  // RSU saving — if vested during RNOR window
  const rsuSaving = rsuValueINR * indiaTaxRate

  // 401k — don't withdraw during RNOR (India would tax it)
  // Rental + dividend savings
  const rentalSaving = rentalINR * rnorYears * indiaTaxRate
  const dividendSaving = dividendINR * rnorYears * indiaTaxRate

  const totalSaving = Math.round(totalSalarySaving + rsuSaving + rentalSaving + dividendSaving)
  const year1Saving = Math.round(yearlySalarySaving + (rsuSaving * 0.5) + rentalSaving / rnorYears + dividendSaving / rnorYears)
  const year2Saving = Math.round(yearlySalarySaving + (rsuSaving * 0.3) + rentalSaving / rnorYears + dividendSaving / rnorYears)

  const taxFreeIncome = Math.round((annualSalaryINR + rsuValueINR + rentalINR + dividendINR) * rnorYears)

  // ── RSU Strategy ─────────────────────────────────────────────────────────────
  let rsuStrategy = ''
  if (I.hasRSUs === 'no') {
    rsuStrategy = 'No RSUs — not applicable.'
  } else if (I.hasRSUs === 'yes_significant') {
    rsuStrategy = `You have $${rsuMap['yes_significant'].toLocaleString()}+ in unvested RSUs. Time all vesting events to occur BEFORE you move OR within your RNOR window. Each vesting event during your RNOR window (${startStr}–${endStr}) is completely tax-free in India. If RSUs vest after your RNOR window ends, you'll pay India's 30%+ surcharge on the full value. Contact your employer's stock admin team to understand your vesting schedule immediately.`
  } else {
    rsuStrategy = `Schedule RSU vesting events to fall within your RNOR window (${startStr}–${endStr}) where possible. Foreign-sourced RSU income during RNOR is not taxable in India. Check your grant agreement for vesting acceleration options.`
  }

  // ── 401k Strategy ────────────────────────────────────────────────────────────
  let k401Strategy = ''
  if (I.has401k === 'no') {
    k401Strategy = 'No 401(k) — not applicable.'
  } else {
    const balance = k401Map[I.has401k]
    k401Strategy = `Your 401(k) balance of ~${fmtUSD(balance)} should NOT be withdrawn during your RNOR period. Under DTAA (India-US Double Taxation Avoidance Agreement), 401(k) withdrawals are taxed as ordinary income in both countries during RNOR. Instead: (1) Leave it invested and let it grow tax-deferred. (2) Begin Required Minimum Distributions (RMDs) only when legally required. (3) Consider Roth conversion strategy BEFORE you move. (4) Withdrawal is most tax-efficient as a Resident Indian (post-RNOR) using the DTAA credit mechanism.`
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
    { form: 'Form 12A', deadline: 'Within 30 days of arriving in India', purpose: 'Register your RNOR status with Income Tax Dept — the single most important form', priority: 'urgent' },
    { form: 'ITR-2', deadline: 'July 31st of each assessment year', purpose: 'Annual income tax return for individuals with foreign income', priority: 'important' },
    { form: 'Schedule FSI', deadline: 'With ITR-2', purpose: 'Declare all foreign source income during RNOR period', priority: 'important' },
    { form: 'Schedule TR', deadline: 'With ITR-2', purpose: 'Claim DTAA tax relief on income already taxed abroad', priority: 'important' },
    { form: 'FEMA Declaration', deadline: 'Within 180 days of arriving', purpose: 'Declare foreign assets to RBI under FEMA regulations', priority: 'important' },
  ]

  if (I.has401k !== 'no') {
    forms.push({ form: 'Form 67', deadline: 'Before filing ITR', purpose: 'Claim foreign tax credit on 401(k) / IRA income taxed in USA', priority: 'normal' })
  }
  if (I.hasRentalIncome === 'yes') {
    forms.push({ form: 'Schedule OS (ITR-2)', deadline: 'With ITR-2', purpose: 'Declare US rental income as foreign source — tax-free during RNOR', priority: 'normal' })
  }

  // ── Year by Year ──────────────────────────────────────────────────────────────
  const yearByYear: TaxResult['yearByYear'] = []
  for (let y = 0; y < Math.ceil(rnorYears) + 1; y++) {
    const yr = moveYear + y
    const isRNOR = y < rnorYears
    const isLastRNOR = y === Math.floor(rnorYears) && rnorYears % 1 !== 0
    yearByYear.push({
      year: `FY ${yr}–${(yr + 1).toString().slice(2)}`,
      status: isRNOR ? (isLastRNOR ? 'Partial RNOR' : 'RNOR') : 'Resident',
      foreignIncomeTax: isRNOR ? '₹0 (tax-free)' : fmtLakh(annualSalaryINR * indiaTaxRate) + '/yr',
      indiaIncomeTax: 'As per India slab',
      totalTax: isRNOR ? 'Only India income taxed' : 'Global income taxed',
      saving: isRNOR ? fmtLakh(annualSalaryINR * indiaTaxRate) : '–',
      color: isRNOR ? '#138808' : '#FF9933',
    })
  }

  // ── Risks ─────────────────────────────────────────────────────────────────────
  const risks: TaxResult['risks'] = []

  if (!isEligible) risks.push({ level: 'high', title: 'RNOR eligibility uncertain', detail: 'Under 3 years abroad may not qualify for RNOR. You could be treated as a Resident from day 1, making ALL global income taxable in India.', action: 'Get a written opinion from a CA specialising in NRI taxation before moving.' })

  if (I.filedForm12A === 'didnt_know') risks.push({ level: 'high', title: 'Form 12A not filed — RNOR at risk', detail: 'Without Form 12A filed within 30 days of arrival, your RNOR status may not be recognised by the Income Tax department.', action: 'File Form 12A on your first day in India. Carry it to your CA appointment.' })

  if (I.hasRSUs !== 'no' && rsuValueINR > 5000000) risks.push({ level: 'high', title: `₹${inrToLakh(rsuValueINR).toFixed(0)}L in RSUs — vesting timing critical`, detail: 'RSUs vesting after your RNOR window ends will be fully taxable in India at 30%+. Wrong timing could cost you crores.', action: 'Map every vesting date against your RNOR window. Accelerate vesting where possible through employer.' })

  if (I.has401k === 'yes_large') risks.push({ level: 'medium', title: '$500K+ 401(k) — complex tax treatment', detail: 'Large 401k balances need careful planning. Premature withdrawals during RNOR attract both US penalty AND India tax.', action: 'Engage a cross-border tax specialist (US-India) before making any withdrawal decisions.' })

  if (I.hasNREAccount === 'no') risks.push({ level: 'medium', title: 'No NRE account — transfers unoptimised', detail: 'Without an NRE account, you cannot transfer foreign earnings to India tax-free. Every transfer through a regular account may be suboptimal.', action: 'Open NRE account this week. Takes 2–3 weeks for Indian banks with NRI branches.' })

  if (I.plannedMoveMonth === 'mar') risks.push({ level: 'low', title: 'March move timing — tax year split', detail: 'Moving in March means you\'ll have less than 30 days in India before the tax year ends on March 31. This creates a complex partial-year filing situation.', action: 'Consider moving in April instead to start clean with a full Indian financial year.' })

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
      detail: `Keeping your US job while on RNOR status means your entire salary (${fmtLakh(annualSalaryINR)}/yr) is tax-free in India for ${Math.round(rnorYears * 10) / 10} years. This is the single most powerful financial position for a returning NRI.`,
      type: 'positive',
    })
  }

  if (I.hasRSUs !== 'no' && isEligible) {
    insights.push({
      icon: '📈',
      title: 'Accelerate RSU vesting before RNOR window closes',
      detail: `Your ~${fmtUSD(rsuMap[I.hasRSUs])} in RSUs could vest completely tax-free in India if timed within your RNOR window (${startStr}–${endStr}). This is worth up to ${fmtLakh(rsuSaving)} in India tax savings alone.`,
      type: 'positive',
    })
  }

  if (I.has401k !== 'no') {
    insights.push({
      icon: '🏦',
      title: 'Keep 401(k) invested — do not withdraw during RNOR',
      detail: `Withdrawing your 401(k) during RNOR triggers both US withholding tax AND Indian income tax. Leave it invested. Post-RNOR, use DTAA Article 20/21 to get credit for US taxes paid — effectively avoiding double taxation.`,
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
  if (annualSalaryINR > 0 && I.employmentType === 'remote_us') incomeBreakdown.push({ source: 'US Salary', amount: annualSalaryINR, taxable: false, note: 'Foreign source — RNOR tax-free in India' })
  if (rsuValueINR > 0) incomeBreakdown.push({ source: 'RSU Vesting', amount: rsuValueINR, taxable: false, note: 'Foreign equity — RNOR tax-free if vested during window' })
  if (rentalINR > 0) incomeBreakdown.push({ source: 'US Rental Income', amount: rentalINR * rnorYears, taxable: false, note: 'Foreign property income — RNOR tax-free' })
  if (dividendINR > 0) incomeBreakdown.push({ source: 'US Dividends & Capital Gains', amount: dividendINR * rnorYears, taxable: false, note: 'Foreign investment income — RNOR tax-free' })

  return {
    rnorStartDate: startStr,
    rnorEndDate: endStr,
    rnorWindowMonths: rnorMonths,
    isEligible,
    eligibilityReason,
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

export default function RNOROptimizer() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TaxResult | null>(null)

  const totalSteps = STEPS.length
  const step = STEPS[currentStep]
  const progress = Math.round((currentStep / totalSteps) * 100)
  if (shouldBlock) return null

  const sectionColors: Record<string, string> = {
    'Your Profile': '#FF9933',
    'Income Sources': '#138808',
    'Tax Planning': '#7C5CBF',
  }

  function pick(key: string, val: string) {
    const next = { ...answers, [key]: val }
    setAnswers(next)
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep(s => s + 1), 280)
    } else {
      setLoading(true)
      setTimeout(() => {
        setResult(computeRNOR(next as Inputs))
        setLoading(false)
      }, 1600)
    }
  }

  function restart() {
    setAnswers({}); setCurrentStep(0); setResult(null); setLoading(false)
  }

  const fmtLakh = (n: number) => {
    if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + ' Cr'
    if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L'
    return '₹' + Math.round(n / 1000) + 'K'
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

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>

        {/* HEADER */}
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>RNOR Tax Optimizer Report</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                  {r.isEligible ? `You can save ${fmtLakh(r.rnorTotalSaving)} in India taxes` : 'RNOR eligibility needs verification'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '560px' }}>{r.eligibilityReason}</p>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                {[
                  { label: 'Total tax saved', val: fmtLakh(r.rnorTotalSaving), sub: 'Over RNOR window', color: '#FF9933' },
                  { label: 'Year 1 saving', val: fmtLakh(r.rnorYear1Saving), sub: 'First year benefit', color: '#138808' },
                  { label: 'Tax-free income', val: fmtLakh(r.taxFreeIncome), sub: 'Total foreign income', color: '#7C5CBF' },
                  { label: 'Window ends', val: r.rnorEndDate, sub: 'Act before this date', color: '#FF9933' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{s.label}</div>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: s.color, marginBottom: '2px' }}>{s.val}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>

          {/* INCOME BREAKDOWN */}
          {r.incomeBreakdown.length > 0 && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Income Tax-Free During Your RNOR Window</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {r.incomeBreakdown.map((inc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '12px 16px', background: '#E8F5E8', borderRadius: '12px', border: '0.5px solid rgba(19,136,8,0.15)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{inc.source}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>{inc.note}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: '#138808' }}>{fmtLakh(inc.amount)}</div>
                      <div style={{ fontSize: '11px', color: '#138808', fontWeight: 600 }}>TAX FREE ✓</div>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--india-white)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>Total India tax saved</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: '#FF9933' }}>{fmtLakh(r.rnorTotalSaving)}</div>
                </div>
              </div>
            </div>
          )}

          {/* YEAR BY YEAR TABLE */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Year-by-Year Tax Status</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Year', 'Status', 'Foreign Income Tax', 'India Income', 'Annual Saving'].map(h => (
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
                      <td style={{ padding: '10px 12px', color: '#138808', fontWeight: 600 }}>{yr.saving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STRATEGIES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
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
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Forms You Must File — In Order of Priority</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {r.formsToFile.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--india-white)', borderRadius: '12px', border: '0.5px solid var(--border)' }}>
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
                    <div key={i} style={{ background: c.bg, border: `0.5px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
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

          {/* DISCLAIMER + CTA */}
          <div style={{ background: 'rgba(26,18,8,0.04)', border: '0.5px solid var(--border)', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
              ⚠️ <strong>Disclaimer:</strong> This tool provides educational guidance based on general NRI tax rules under the Income Tax Act 1961, FEMA, and applicable DTAA treaties. It does not constitute professional tax advice. Tax laws change frequently. Always consult a qualified CA with NRI expertise before making financial decisions. Savings estimates are indicative and based on general tax slabs.
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
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
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>

      {/* HERO */}
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>RNOR Tax Optimizer · Free · {totalSteps} questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>
          How much can you save<br />with RNOR status?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto' }}>
          Answer {totalSteps} questions — get your exact RNOR window, personalised RSU and 401k strategy, forms to file, and total India tax saved.
        </p>
      </div>

      {/* PROGRESS */}
      <div style={{ padding: '0 2rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Question {currentStep + 1} of {totalSteps}</span>
          <span style={{ fontSize: '12px', color: '#FF9933', fontWeight: 500 }}>{progress}% complete</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ height: '100%', background: '#FF9933', borderRadius: '100px', width: progress + '%', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* QUESTION */}
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
                const sel = answers[step.key as keyof Inputs] === opt.k
                return (
                  <button key={opt.k} onClick={() => pick(step.key, opt.k)} style={{ padding: '14px 18px', borderRadius: '14px', border: sel ? '2px solid #FF9933' : '1px solid rgba(255,255,255,0.1)', background: sel ? 'rgba(255,153,51,0.12)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textAlign: 'left', transition: 'all 0.18s' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '3px' }}>{opt.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{opt.sub}</div>
                  </button>
                )
              })}
            </div>
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(s => s - 1)} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>← Back</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
