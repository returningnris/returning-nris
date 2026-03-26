export type ReadinessAnswers = {
  country: string
  timeline: string
  savings: string
  commitments: string
  netWorth: string
  hasJob: string
  city: string
  housing: string
  childrenCount: string
  teenageChildren: string
  knowsRNOR: string
  foreignAssets: string
  yearsAbroad: string
  hasKids: string
  kidsAge: string
}

export type ReadinessQuestion = {
  key: keyof ReadinessAnswers
  section: string
  q: string
  hint: string
  tooltip: string
  opts: { k: string; label: string }[]
}

export const REFINED_READINESS_QUESTIONS: ReadinessQuestion[] = [
  { key: 'country', section: 'Where You Are', q: 'Where are you currently based?', hint: 'A small modifier tied to tax complexity and move structure.', tooltip: 'A minor factor. It slightly changes tax complexity and move setup.', opts: [{ k: 'USA', label: 'United States' }, { k: 'UK', label: 'United Kingdom' }, { k: 'UAE', label: 'UAE / Middle East' }, { k: 'Canada', label: 'Canada' }, { k: 'Other', label: 'Other country' }] },
  { key: 'timeline', section: 'Timeline', q: 'When are you planning to move?', hint: 'A shorter timeline demands stronger readiness before departure.', tooltip: 'Shorter timelines need stronger finances, planning, and job certainty.', opts: [{ k: 'within6', label: 'Within 6 months' }, { k: '6to12', label: '6-12 months' }, { k: '1to2', label: '1-2 years' }] },
  { key: 'savings', section: 'Finances', q: 'Total liquid savings?', hint: 'Your strongest financial readiness signal and primary runway input.', tooltip: 'Your main readiness driver. More liquid cash means more runway.', opts: [{ k: '200000+', label: '$200K+' }, { k: '150000', label: '$150K' }, { k: '100000', label: '$100K' }, { k: '50000', label: '$50K' }] },
  { key: 'commitments', section: 'Finances', q: 'Do you have significant monthly financial commitments (EMIs, loans, etc.)?', hint: 'Fixed obligations reduce how long your savings can actually support the move.', tooltip: 'Higher fixed payments reduce usable runway.', opts: [{ k: 'none', label: 'No significant commitments' }, { k: 'moderate', label: 'Moderate commitments (< $500/month)' }, { k: 'high', label: 'High commitments ($1000/month)' }, { k: 'very_high', label: 'Very high commitments ($1500/month)' }] },
  { key: 'netWorth', section: 'Finances', q: 'Total net worth / other assets?', hint: 'A secondary confidence modifier, not a replacement for liquidity.', tooltip: 'A confidence boost, but less important than liquid savings.', opts: [{ k: '1000000+', label: '$1M+' }, { k: '750000', label: '$750K' }, { k: '500000', label: '$500K' }, { k: '250000', label: '$250K' }] },
  { key: 'hasJob', section: 'Career', q: 'Career situation after moving to India?', hint: 'Income continuity is the single biggest factor in readiness.', tooltip: 'The biggest readiness factor. Stable income lowers risk fast.', opts: [{ k: 'remote_us', label: 'Keeping remote US / abroad job - same salary' }, { k: 'india_job', label: 'India job confirmed - offer letter in hand' }, { k: 'own_business', label: 'Running my own business - location independent' }, { k: 'searching', label: 'Actively job hunting in India - no offer yet' }, { k: 'no', label: 'No income plan yet - will figure it out after moving' }] },
  { key: 'city', section: "Where You're Going", q: 'Target city in India?', hint: 'City changes cost and logistics, but should not overpower savings or income.', tooltip: 'City affects monthly burn and lifestyle trade-offs.', opts: [{ k: 'Hyderabad', label: 'Hyderabad' }, { k: 'Bangalore', label: 'Bangalore' }, { k: 'Pune', label: 'Pune' }, { k: 'Chennai', label: 'Chennai' }, { k: 'Mumbai', label: 'Mumbai' }, { k: 'DelhiNCR', label: 'Delhi NCR' }, { k: 'Tier2', label: 'Tier 2 city (Kochi, Vizag, etc.)' }, { k: 'undecided', label: 'Not decided yet' }] },
  { key: 'housing', section: "Where You're Going", q: 'Housing situation in India?', hint: 'Housing readiness reduces both cost pressure and move stress.', tooltip: 'Arranged housing reduces stress and early uncertainty.', opts: [{ k: 'owned', label: 'Own home - ready to move in' }, { k: 'arranged', label: 'Rental finalized' }, { k: 'searching', label: 'Actively searching' }, { k: 'no', label: 'Not started yet' }] },
  { key: 'childrenCount', section: 'Family', q: 'How many children are you planning for?', hint: 'More children increase admissions, coordination, and planning complexity.', tooltip: 'More children usually means more planning complexity.', opts: [{ k: 'none', label: 'None' }, { k: 'one', label: '1' }, { k: 'two_plus', label: '2+' }] },
  { key: 'teenageChildren', section: 'Family', q: 'Do you have teenage children (13-17)?', hint: 'Teen transitions are the most likely to disrupt an otherwise solid move plan.', tooltip: 'Teen moves are usually the hardest school and social transition.', opts: [{ k: 'none', label: 'None' }, { k: 'one', label: '1' }, { k: 'two_plus', label: '2+' }] },
  { key: 'knowsRNOR', section: 'Tax Planning', q: 'Aware of RNOR tax status?', hint: 'A planning-maturity signal that can materially affect post-move taxes.', tooltip: 'RNOR planning can reduce avoidable tax in the first years back.', opts: [{ k: 'yes_filed', label: 'Yes - already planned with a CA specialist' }, { k: 'yes_aware', label: 'Yes - aware but not planned yet' }, { k: 'partial', label: 'Heard of it, not sure what it means' }, { k: 'no', label: 'No - first time hearing this' }] },
  { key: 'foreignAssets', section: 'Tax Planning', q: 'Do you have foreign financial assets (401k, RSUs, stocks, etc.) that need planning?', hint: 'Captures cross-border planning complexity without expanding the form too much.', tooltip: 'Foreign assets need tax and compliance planning before you move.', opts: [{ k: 'planned', label: 'Yes - planned or being handled' }, { k: 'unplanned', label: 'Yes - not yet planned' }, { k: 'minimal', label: 'No / minimal' }] },
]
