export type ReadinessPersona = {
  id: string
  name: string
  shortDescription: string
  description: string
  verdict: string
  liquidBuffer: string
  watch: string
  next: string
}

export const READINESS_PERSONAS: ReadinessPersona[] = [
  {
    id: 'secure-family',
    name: 'Secure Family',
    shortDescription: '2 kids, income continuity after the move',
    description:
      'One or both spouses already have a job in India, or can continue their US role remotely.',
    verdict: 'Ready to Move',
    liquidBuffer: '₹35L-₹50L',
    watch: 'schools, tax, housing',
    next: 'Lock schools, confirm tax/payroll, plan first 90 days',
  },
  {
    id: 'one-income-family',
    name: 'One-Income Family',
    shortDescription: 'One stable income, one open',
    description:
      'Family with kids, but only one stable income is clearly lined up after the move.',
    verdict: 'Nearly Ready',
    liquidBuffer: '₹35L-₹50L',
    watch: 'cash flow, school fees, backup plan',
    next: 'Stress-test budget, reduce fixed costs, build runway',
  },
  {
    id: 'independent-couple',
    name: 'Independent Couple',
    shortDescription: 'No kids, fewer moving parts',
    description:
      'Couple without kids, strong savings, and a flexible move timeline.',
    verdict: 'Ready to Move',
    liquidBuffer: 'Based on city and lifestyle',
    watch: 'city, career, health cover',
    next: 'Choose city, set budget, arrange temporary housing',
  },
  {
    id: 'fire-returner',
    name: 'FIRE Returner',
    shortDescription: 'Living from investments',
    description:
      'Planning to live in India from investments or corpus rather than salary income.',
    verdict: 'Nearly Ready',
    liquidBuffer: '₹35L-₹50L, outside core corpus',
    watch: 'cash flow, taxes, healthcare',
    next: 'Build withdrawal plan, separate corpus and emergency reserve',
  },
  {
    id: 'not-ready-yet',
    name: 'Not Ready Yet',
    shortDescription: 'No clear income plan or runway',
    description:
      'Want to move, but income visibility and liquid cushion are still weak.',
    verdict: 'Plan More First',
    liquidBuffer: 'Build toward ₹35L-₹50L',
    watch: 'income gap, hidden costs',
    next: 'Build cash cushion, map real monthly costs, secure one income path',
  },
]

export const READINESS_NOTE =
  'For a Tier 1 city, family of 4, and a good to great lifestyle, a 1-year liquid buffer is often around ₹35L-₹50L. Actual needs vary by city, school fees, housing, and income continuity.'

export type JourneyFilterId =
  | 'with-kids'
  | 'moving-from-usa'
  | 'renting-first'
  | 'buying-immediately'
  | 'living-from-investments'
  | 'keeping-us-investments'
  | 'bringing-pets'

export type JourneyFilter = {
  id: JourneyFilterId
  label: string
}

export type JourneyChecklistItem = {
  text: string
  filters?: JourneyFilterId[]
}

export type JourneyChecklistSection = {
  id: string
  title: string
  mustDo: JourneyChecklistItem[]
  ifRelevant: JourneyChecklistItem[]
  niceToDo: JourneyChecklistItem[]
}

export const JOURNEY_FILTERS: JourneyFilter[] = [
  { id: 'with-kids', label: 'With kids' },
  { id: 'moving-from-usa', label: 'Moving from USA' },
  { id: 'renting-first', label: 'Renting first' },
  { id: 'buying-immediately', label: 'Buying immediately' },
  { id: 'living-from-investments', label: 'Living from investments' },
  { id: 'keeping-us-investments', label: 'Keeping US investments' },
  { id: 'bringing-pets', label: 'Bringing pets' },
]

export const JOURNEY_CHECKLIST: JourneyChecklistSection[] = [
  {
    id: '12-6-months',
    title: '12-6 Months Before Move',
    mustDo: [
      { text: 'Choose a realistic move window and decide what must be true before you relocate.' },
      { text: 'Review RNOR timing, tax residency, and cross-border planning before your move date hardens.' },
      { text: 'Model monthly costs, one-year liquid runway, and setup costs for your likely city.' },
      { text: 'Shortlist cities based on work, family support, commute, weather, and lifestyle fit.' },
    ],
    ifRelevant: [
      { text: 'Start school board research and shortlist likely schools.', filters: ['with-kids'] },
      { text: 'Map how you will fund life from corpus, including withdrawals and emergency reserve.', filters: ['living-from-investments'] },
      { text: 'Review how existing US accounts, brokerage access, and tax reporting change after you move.', filters: ['keeping-us-investments', 'moving-from-usa'] },
    ],
    niceToDo: [
      { text: 'Create one shared move-back document for timelines, vendors, school notes, and financial decisions.' },
      { text: 'Talk to a few families already living in your target city to pressure-test expectations.' },
    ],
  },
  {
    id: '6-3-months',
    title: '6-3 Months Before Move',
    mustDo: [
      { text: 'Lock income continuity, resignation timing, or job start date.' },
      { text: 'Open or clean up banking, remittance, and operating cash plans for the move.' },
      { text: 'Organize passports, OCI or visa paperwork, tax records, medical records, and core IDs.' },
      { text: 'Decide what to ship, store, sell, or carry yourself.' },
    ],
    ifRelevant: [
      { text: 'Submit school applications, collect transcripts, and align admissions timing.', filters: ['with-kids'] },
      { text: 'Start rental search and plan a 60-90 day landing setup.', filters: ['renting-first'] },
      { text: 'Line up builder, resale, or financing diligence before you commit.', filters: ['buying-immediately'] },
      { text: 'Confirm airline, vaccination, and import rules for pets.', filters: ['bringing-pets'] },
    ],
    niceToDo: [
      { text: 'Create a first-year budget that includes rent deposit, school fees, car setup, and home furnishing.' },
      { text: 'Book exploratory visits for neighborhoods, schools, or healthcare if you still have open questions.' },
    ],
  },
  {
    id: '90-days',
    title: '90 Days Before Move',
    mustDo: [
      { text: 'Finalize housing direction, at least for the first 60-90 days.' },
      { text: 'Confirm tax, payroll, and account actions tied to the exact move date.' },
      { text: 'Book travel, shipping, and first-week essentials so arrival is not improvised.' },
    ],
    ifRelevant: [
      { text: 'Confirm school seat, fee schedule, and document handover.', filters: ['with-kids'] },
      { text: 'Review healthcare plan, premium payments, and nearby hospitals.', filters: ['living-from-investments'] },
      { text: 'Check how RSUs, retirement accounts, and brokerage statements will be handled after you leave the US.', filters: ['moving-from-usa', 'keeping-us-investments'] },
    ],
    niceToDo: [
      { text: 'Set up a first-month contact list for CA, banker, broker, school admin, and relatives.' },
    ],
  },
  {
    id: '30-days',
    title: '30 Days Before Move',
    mustDo: [
      { text: 'Close or hand off leases, utilities, subscriptions, and address changes in your current country.' },
      { text: 'Move enough cash for the first months in India while staying aligned with your tax plan.' },
      { text: 'Keep critical documents, medicines, cards, and backups in your carry-on.' },
    ],
    ifRelevant: [
      { text: 'Finalize school handoff, uniforms, transport, and first-day logistics.', filters: ['with-kids'] },
      { text: 'Confirm lease signing, broker paperwork, and move-in date.', filters: ['renting-first'] },
      { text: 'Confirm possession date, temporary stay, or handover plan if purchase will not be ready immediately.', filters: ['buying-immediately'] },
      { text: 'Collect final vet certificates and travel-compliance documents.', filters: ['bringing-pets'] },
    ],
    niceToDo: [
      { text: 'Make a first-two-weeks shopping and setup list so you are not deciding everything after landing.' },
    ],
  },
  {
    id: 'landing-week',
    title: 'Landing Week',
    mustDo: [
      { text: 'Set up local SIM, payments, transport, and daily essentials immediately.' },
      { text: 'Stabilize where you are staying and confirm the next 30 days of routine.' },
      { text: 'Start tracking days in India and save travel records from day one.' },
    ],
    ifRelevant: [
      { text: 'Meet school admin, confirm start dates, and settle the first-week child routine.', filters: ['with-kids'] },
      { text: 'Inspect rental fit, commute, and neighborhood basics before committing long term.', filters: ['renting-first'] },
      { text: 'Visit hospitals, specialists, or pharmacies you expect to use often.', filters: ['living-from-investments'] },
      { text: 'Confirm pet settling plan, vet access, and society rules.', filters: ['bringing-pets'] },
    ],
    niceToDo: [
      { text: 'Keep the first week light; do not rush every major decision while jet-lagged and disoriented.' },
    ],
  },
  {
    id: 'first-30-days',
    title: 'First 30 Days',
    mustDo: [
      { text: 'Update address, residency status, and local profile details across banking, PAN, Aadhaar, and investments where needed.' },
      { text: 'Stabilize daily routine around work, commute, healthcare, and home setup.' },
      { text: 'Review the budget against what life actually costs after landing.' },
    ],
    ifRelevant: [
      { text: 'Watch how children are adjusting before making more school or tuition commitments.', filters: ['with-kids'] },
      { text: 'Decide whether to extend your temporary rental or start a broader neighborhood search.', filters: ['renting-first'] },
      { text: 'Review first withdrawals, cash flow, and tax withholding if you are living from investments.', filters: ['living-from-investments'] },
      { text: 'Check access, statements, and compliance cadence for US accounts after the move.', filters: ['keeping-us-investments', 'moving-from-usa'] },
    ],
    niceToDo: [
      { text: 'Write down what feels off in housing, schooling, and city fit before small frictions become expensive mistakes.' },
    ],
  },
  {
    id: 'first-90-days',
    title: 'First 90 Days',
    mustDo: [
      { text: 'Confirm that the move still works financially, emotionally, and logistically after real life starts.' },
      { text: 'Tighten healthcare, schooling, commute, and domestic help routines.' },
      { text: 'Make sure tax and residency planning still matches your actual travel pattern.' },
    ],
    ifRelevant: [
      { text: 'Review child adjustment, curriculum fit, and whether tutoring or support is needed.', filters: ['with-kids'] },
      { text: 'Decide whether to keep renting, upgrade, or begin purchase decisions after living in the city.', filters: ['renting-first', 'buying-immediately'] },
      { text: 'Do a formal cash-flow review if corpus withdrawals are funding life.', filters: ['living-from-investments'] },
    ],
    niceToDo: [
      { text: 'Start rebuilding local professional, family, and community support instead of staying in arrival mode.' },
    ],
  },
  {
    id: 'first-year',
    title: 'First Year',
    mustDo: [
      { text: 'Handle the first India tax cycle carefully, including RNOR if you are eligible.' },
      { text: 'Review long-term housing, school, and financial decisions once the move stops feeling provisional.' },
      { text: 'Do a full one-year review of income, spending, family fit, and whether the city still feels right.' },
    ],
    ifRelevant: [
      { text: 'Restructure international investments, account status, and compliance if you are keeping assets abroad.', filters: ['keeping-us-investments', 'moving-from-usa'] },
      { text: 'Revisit corpus draw rate, healthcare reserve, and long-term withdrawal strategy.', filters: ['living-from-investments'] },
      { text: 'Review whether your child is now settled enough for longer-term decisions on neighborhood and school.', filters: ['with-kids'] },
    ],
    niceToDo: [
      { text: 'Capture what worked and what did not so future decisions come from experience, not just hope.' },
    ],
  },
]
