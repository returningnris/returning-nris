'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Inputs = {
  sector: string
  role: string
  experience: string
  techStack: string
  city: string
  salaryExpectation: string
  workMode: string
  keepUSJob: string
  visaStatus: string
  timeline: string
}

type Company = {
  name: string
  sector: string
  cities: string[]
  nriHiring: boolean
  remotePolicy: string
  salaryRange: string
  indiaPresence: string
  note: string
  roles: string[]
}

type SalaryBenchmark = {
  role: string
  sector: string
  experience: string
  indiaSalary: string
  usSalary: string
  purchasingPowerParity: string
  delta: string
  note: string
}

type CareerResult = {
  salaryBenchmarks: SalaryBenchmark[]
  topCompanies: Company[]
  remoteStrategy: string
  resumeTips: string[]
  linkedinTips: string[]
  interviewTips: string[]
  salaryNegotiationScript: string
  timeline: { phase: string; timing: string; tasks: string[]; color: string }[]
  risks: { level: 'high' | 'medium' | 'low'; title: string; detail: string; action: string }[]
  insights: { icon: string; title: string; detail: string; type: 'positive' | 'warning' | 'info' }[]
  marketSnapshot: { label: string; value: string; note: string; color: string }[]
}

const COMPANIES: Company[] = [
  // TECH
  { name: 'Google India', sector: 'tech', cities: ['hyd', 'blr', 'mum'], nriHiring: true, remotePolicy: 'Hybrid 3 days/week', salaryRange: '₹60–180L/yr', indiaPresence: 'Large R&D centre — 10,000+ employees', note: 'Heavily recruits US-returned engineers. Internal transfer program available for current Googlers.', roles: ['SWE L4–L7', 'Product Manager', 'Data Scientist', 'Engineering Manager'] },
  { name: 'Microsoft India', sector: 'tech', cities: ['hyd', 'blr'], nriHiring: true, remotePolicy: 'Hybrid — flexible', salaryRange: '₹55–160L/yr', indiaPresence: 'Hyderabad is Microsoft\'s 2nd largest campus globally', note: 'IDC Hyderabad is massive — internal transfers very common for current Microsoft employees.', roles: ['SWE', 'Principal Engineer', 'PM', 'Program Manager'] },
  { name: 'Amazon India', sector: 'tech', cities: ['hyd', 'blr', 'che', 'mum'], nriHiring: true, remotePolicy: 'Hybrid — RTO push', salaryRange: '₹50–150L/yr', indiaPresence: 'AWS, Alexa, Prime Video, devices all have India R&D', note: 'Amazon India actively hires US-returned SDEs at L5/L6. Transferring internally is easiest path.', roles: ['SDE', 'Senior SDE', 'Principal SDE', 'TPM', 'PM'] },
  { name: 'Meta India', sector: 'tech', cities: ['hyd', 'blr'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹70–200L/yr', indiaPresence: 'Growing engineering presence — AR/VR, infra, integrity', note: 'Smaller India presence than Google/Amazon but growing fast. US returnees valued.', roles: ['SWE E4–E6', 'Product Manager', 'Data Engineer'] },
  { name: 'Flipkart', sector: 'tech', cities: ['blr', 'hyd'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹40–120L/yr', indiaPresence: 'India\'s leading e-commerce company — Walmart owned', note: 'Pays US-comparable for senior roles. US experience highly valued for PM and tech lead roles.', roles: ['SDE', 'Senior SDE', 'Principal Engineer', 'PM', 'Data Scientist'] },
  { name: 'Swiggy', sector: 'tech', cities: ['blr', 'hyd', 'mum'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹35–100L/yr', indiaPresence: 'Pre-IPO / recent IPO — exciting stock upside', note: 'Strong for US returnees wanting startup + scale. Compensation includes meaningful stock.', roles: ['SDE', 'PM', 'Data Scientist', 'ML Engineer'] },
  { name: 'Zepto', sector: 'tech', cities: ['mum', 'blr'], nriHiring: true, remotePolicy: 'In-office', salaryRange: '₹40–130L/yr', indiaPresence: 'Hypergrowth startup — quick commerce unicorn', note: 'Fastest growing startup in India — high risk, high reward. US returnees get strong offers.', roles: ['SDE', 'Engineering Manager', 'PM', 'Operations'] },
  { name: 'Razorpay', sector: 'fintech', cities: ['blr'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹40–120L/yr', indiaPresence: 'Leading payments and fintech infrastructure company', note: 'Best fintech employer in India. Looking for PM and engineering leaders with US experience.', roles: ['SDE', 'Product Manager', 'Engineering Manager', 'Growth'] },
  { name: 'CRED', sector: 'fintech', cities: ['blr'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹45–130L/yr', indiaPresence: 'Premium fintech brand — strong design and engineering culture', note: 'Known for premium culture and good compensation. Strong hiring of US returnees.', roles: ['SDE', 'Design', 'Product Manager', 'Data Science'] },
  // FINANCE
  { name: 'Goldman Sachs India', sector: 'finance', cities: ['blr', 'hyd', 'mum'], nriHiring: true, remotePolicy: 'In-office / hybrid', salaryRange: '₹50–200L/yr', indiaPresence: 'Large tech + finance hub — 10,000+ employees', note: 'Goldman Bangalore and Hyderabad are major global operations hubs. US finance returnees highly valued.', roles: ['VP Engineering', 'Quant', 'Technology Analyst', 'Risk Manager'] },
  { name: 'JP Morgan India', sector: 'finance', cities: ['mum', 'hyd', 'blr'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹45–180L/yr', indiaPresence: 'One of the largest financial services employers in India', note: 'Strong wealth management and tech roles. Internal transfer program for existing JP Morgan employees.', roles: ['Investment Banking', 'Technology VP', 'Risk', 'Data Analytics'] },
  { name: 'Morgan Stanley India', sector: 'finance', cities: ['mum', 'blr'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹50–190L/yr', indiaPresence: 'Mumbai and Bangalore — wealth management and technology', note: 'Wealth management India is booming. US experience in WM highly valued.', roles: ['Wealth Management', 'Technology', 'Quant Research'] },
  // CONSULTING
  { name: 'McKinsey India', sector: 'consulting', cities: ['mum', 'blr', 'hyd', 'che'], nriHiring: true, remotePolicy: 'Hybrid — heavy travel', salaryRange: '₹60–200L/yr', indiaPresence: 'Growing consulting presence across all major cities', note: 'Best for MBAs from top programs. US returnees with MBAs get fast tracked. Travel heavy.', roles: ['Associate', 'Engagement Manager', 'Principal', 'Analytics'] },
  { name: 'BCG India', sector: 'consulting', cities: ['mum', 'blr', 'hyd'], nriHiring: true, remotePolicy: 'Hybrid', salaryRange: '₹55–190L/yr', indiaPresence: 'Strong India strategy and digital practice', note: 'Known for better work-life balance than McKinsey. Strong digital transformation practice.', roles: ['Consultant', 'Senior Consultant', 'Principal', 'Digital Ventures'] },
  // HEALTHCARE
  { name: 'Apollo Hospitals Corporate', sector: 'healthcare', cities: ['hyd', 'che', 'blr'], nriHiring: true, remotePolicy: 'In-person', salaryRange: '₹35–80L/yr', indiaPresence: 'India\'s largest healthcare group', note: 'US-trained doctors and hospital administrators highly valued. Good career progression.', roles: ['Senior Consultant', 'Department Head', 'Healthcare Administrator', 'Medical Director'] },
]

const SALARY_DATA: SalaryBenchmark[] = [
  { role: 'Software Engineer (3–5 yrs exp)', sector: 'tech', experience: 'mid', indiaSalary: '₹25–45L/yr', usSalary: '$130–180K/yr', purchasingPowerParity: '₹25–45L buys similar lifestyle to $130–180K in US', delta: '30–40% lower nominal, similar real', note: 'US remote work keeps US salary — the optimal financial setup' },
  { role: 'Senior Software Engineer (5–10 yrs)', sector: 'tech', experience: 'senior', indiaSalary: '₹45–90L/yr', usSalary: '$180–280K/yr', purchasingPowerParity: '₹45–90L gives comparable lifestyle in India', delta: '40–50% lower nominal, similar real', note: 'Significant jump post-4 yrs at top companies' },
  { role: 'Staff / Principal Engineer (10+ yrs)', sector: 'tech', experience: 'staff', indiaSalary: '₹80–200L/yr', usSalary: '$280–500K+ /yr', purchasingPowerParity: 'Narrowing gap at this level', delta: 'Significant gap — remote work critical at this level', note: 'Top 5% India tech salaries match US mid-level' },
  { role: 'Product Manager (5–8 yrs)', sector: 'tech', experience: 'senior', indiaSalary: '₹40–90L/yr', usSalary: '$160–250K/yr', purchasingPowerParity: 'Good lifestyle parity in India', delta: '35–45% lower nominal', note: 'PM salaries in India have risen sharply 2021–2025' },
  { role: 'Data Scientist / ML Engineer', sector: 'tech', experience: 'mid', indiaSalary: '₹30–80L/yr', usSalary: '$150–240K/yr', purchasingPowerParity: 'Reasonable parity at senior levels', delta: '30–45% nominal gap', note: 'AI/ML talent is in highest demand in India right now' },
  { role: 'Investment Banking VP', sector: 'finance', experience: 'senior', indiaSalary: '₹80–200L/yr', usSalary: '$300–600K/yr', purchasingPowerParity: 'Lifestyle similar at VP+ in India', delta: 'Large gap — but lower cost base offsets', note: 'Mumbai IB pays best in India — close to London levels' },
  { role: 'Management Consultant (MBA)', sector: 'consulting', experience: 'mid', indiaSalary: '₹45–90L/yr', usSalary: '$180–300K/yr', purchasingPowerParity: 'Good lifestyle parity', delta: '35–40% lower nominal', note: 'India consulting pays well for McKinsey/BCG/Bain' },
  { role: 'Hospital Specialist (US Board Certified)', sector: 'healthcare', experience: 'senior', indiaSalary: '₹40–120L/yr', usSalary: '$250–600K/yr', purchasingPowerParity: 'Lifestyle gap is real — but non-monetary quality of life compensates for many', delta: 'Large nominal gap', note: 'US board certification commands significant premium in India' },
]

const STEPS = [
  { key: 'sector', section: 'Your Profile', q: 'What is your primary job sector?', hint: 'We\'ll show companies, salary benchmarks and strategies for your field', opts: [{ k: 'tech', label: 'Technology / Software', sub: 'Engineering, product, data, AI/ML' }, { k: 'finance', label: 'Finance / Banking', sub: 'IB, wealth management, fintech' }, { k: 'consulting', label: 'Strategy Consulting', sub: 'McKinsey, BCG, Bain, Big 4' }, { k: 'healthcare', label: 'Healthcare / Medicine', sub: 'Doctor, hospital admin, pharma' }, { k: 'startup', label: 'Startup / Entrepreneur', sub: 'Building something new' }, { k: 'other', label: 'Other sector', sub: 'Education, media, operations, etc.' }] },
  { key: 'role', section: 'Your Profile', q: 'What is your current role type?', hint: 'Determines India market positioning and salary bracket', opts: [{ k: 'ic_junior', label: 'Individual Contributor — Early', sub: '0–4 years experience' }, { k: 'ic_senior', label: 'Individual Contributor — Senior', sub: '5–10 years experience' }, { k: 'ic_staff', label: 'Individual Contributor — Staff/Principal', sub: '10+ years, senior IC' }, { k: 'manager', label: 'Engineering / Team Manager', sub: 'Managing 3–10 people' }, { k: 'director', label: 'Director / VP / Senior Manager', sub: 'Managing managers, org leader' }, { k: 'founder', label: 'Founder / CxO', sub: 'Building a company' }] },
  { key: 'experience', section: 'Your Profile', q: 'How many total years of work experience do you have?', hint: 'India companies heavily weight total years + company brand', opts: [{ k: 'under5', label: 'Under 5 years', sub: 'Early career' }, { k: '5to10', label: '5–10 years', sub: 'Mid-career professional' }, { k: '10to15', label: '10–15 years', sub: 'Senior professional' }, { k: '15plus', label: '15+ years', sub: 'Executive / senior leader' }] },
  { key: 'techStack', section: 'Your Profile', q: 'If tech, what is your primary stack / domain?', hint: 'AI/ML and cloud are the highest demand areas in India right now', opts: [{ k: 'ai_ml', label: 'AI / ML / Data Science', sub: 'Highest demand in India 2024–2026' }, { k: 'backend', label: 'Backend / Distributed Systems', sub: 'Java, Go, Python, Node' }, { k: 'fullstack', label: 'Full Stack / Frontend', sub: 'React, Next.js, web' }, { k: 'mobile', label: 'Mobile (iOS / Android)', sub: 'App development' }, { k: 'cloud_devops', label: 'Cloud / DevOps / SRE', sub: 'AWS, GCP, Azure, Kubernetes' }, { k: 'product_pm', label: 'Product / Not technical', sub: 'PM, strategy, growth, design' }, { k: 'na', label: 'Not in tech', sub: 'Finance, consulting, healthcare' }] },
  { key: 'city', section: 'Your Preferences', q: 'Which city are you targeting?', hint: 'City affects company options and salary ranges significantly', opts: [{ k: 'hyd', label: 'Hyderabad', sub: 'Google, Microsoft, Amazon HQ' }, { k: 'blr', label: 'Bangalore', sub: 'Startup ecosystem, Flipkart, Swiggy' }, { k: 'pun',  label: 'Pune', sub: 'Infosys, TCS, international companies' }, { k: 'che', label: 'Chennai', sub: 'Automotive, IT services' }, { k: 'mum', label: 'Mumbai', sub: 'Finance, media, enterprise tech' }, { k: 'any', label: 'Open to any city', sub: 'Will go where opportunity is best' }] },
  { key: 'keepUSJob', section: 'Your Strategy', q: 'Are you considering keeping your current US job remotely?', hint: 'This is the single biggest career decision affecting your finances', opts: [{ k: 'yes_already', label: 'Yes — already arranged with employer', sub: 'Best financial outcome' }, { k: 'yes_negotiating', label: 'Yes — currently negotiating remote', sub: 'Need to close this before moving' }, { k: 'maybe', label: 'Possibly — haven\'t asked yet', sub: 'Need the negotiation script' }, { k: 'no_switching', label: 'No — switching to India role', sub: 'Targeting India companies only' }, { k: 'no_break', label: 'Taking a career break first', sub: 'Will job search after settling in' }] },
  { key: 'workMode', section: 'Your Preferences', q: 'What work mode do you want in India?', hint: 'Remote work has permanently changed the India job market', opts: [{ k: 'remote_us', label: 'Fully remote — US employer', sub: 'Work India hours / US hours from India' }, { k: 'remote_india', label: 'Fully remote — India employer', sub: 'Increasing at senior levels' }, { k: 'hybrid', label: 'Hybrid — 2–3 days office', sub: 'Best of both worlds' }, { k: 'full_office', label: 'Full time in-office', sub: 'Prefer structure and in-person team' }] },
  { key: 'salaryExpectation', section: 'Your Preferences', q: 'What is your India salary expectation?', hint: 'Helps us calibrate benchmark and negotiation strategy', opts: [{ k: 'h200', label: '₹1.5 Crore+ / year', sub: 'Senior director / VP level' }, { k: 'h100', label: '₹80L–1.5 Crore / year', sub: 'Senior / Staff level' }, { k: 'm50', label: '₹40–80L / year', sub: 'Mid-senior professional' }, { k: 'm25', label: '₹20–40L / year', sub: 'Mid-level professional' }, { k: 'remote', label: 'Keeping US salary — not switching', sub: 'Remote work goal' }] },
  { key: 'visaStatus', section: 'Your Profile', q: 'What is your current visa / citizenship status?', hint: 'Affects job search approach and urgency', opts: [{ k: 'oci', label: 'OCI card holder', sub: 'Works in India like a citizen — no restrictions' }, { k: 'indian_passport', label: 'Indian passport', sub: 'Full freedom to work anywhere' }, { k: 'us_citizen', label: 'US citizen (no OCI yet)', sub: 'Need employment visa for India' }, { k: 'green_card', label: 'Green card holder', sub: 'Can give up if returning permanently' }] },
  { key: 'timeline', section: 'Your Profile', q: 'When are you planning to start job searching in India?', hint: 'India job offers cannot be held for more than 2–3 months', opts: [{ k: 'already', label: 'Already started', sub: 'Active search in progress' }, { k: '3months', label: 'In 3–6 months', sub: 'Start soon' }, { k: '6months', label: 'In 6–12 months', sub: 'Building pipeline now' }, { k: 'after_move', label: 'After I move', sub: 'Will search on ground in India' }] },
]

function compute(I: Inputs): CareerResult {

  // Salary benchmarks — filter to sector
  const salaryBenchmarks = SALARY_DATA.filter(s =>
    s.sector === I.sector || (I.sector === 'startup' && s.sector === 'tech')
  ).slice(0, 4)

  // Company matching
  const companies = COMPANIES.filter(c => {
    const sectorMatch = c.sector === I.sector || (I.sector === 'startup' && ['tech', 'fintech'].includes(c.sector))
    const cityMatch = I.city === 'any' || c.cities.includes(I.city)
    return sectorMatch && cityMatch
  }).sort((a, b) => (b.nriHiring ? 1 : 0) - (a.nriHiring ? 1 : 0)).slice(0, 6)

  // Remote strategy
  let remoteStrategy = ''
  if (I.keepUSJob === 'yes_already') {
    remoteStrategy = 'You\'ve already arranged remote work — this is the optimal financial position. Ensure your employment agreement explicitly covers working from India, check if your employer requires you to be available US time zones (IST is +11:30 to EST), and confirm health insurance / benefits continuation. Most US employers are fine with this informally — just get it in writing.'
  } else if (I.keepUSJob === 'yes_negotiating' || I.keepUSJob === 'maybe') {
    remoteStrategy = 'The remote negotiation is the most important conversation you\'ll have before moving. Frame it around business continuity — not personal convenience. Key arguments: (1) You\'ve been high-performing in this role, (2) Remote work is proven — your output won\'t change, (3) Time zone overlap is manageable for async work, (4) The alternative is losing you entirely. Ask for a 3-month trial. Most managers prefer keeping a good employee remote over hiring someone new.'
  } else if (I.keepUSJob === 'no_switching') {
    remoteStrategy = 'Switching to an India role is a major salary step down in nominal terms but manageable with cost-of-living adjustment. Target companies with US/global presence — they pay closest to US market rates. GCCs (Global Capability Centres) of US companies pay 30–40% of US salaries but this still lands you in top 5% of India earners. Negotiate hard — India employers expect it.'
  } else {
    remoteStrategy = 'Taking a break is a valid strategy. Use the first 3 months to settle, get kids into school, sort housing, and decompress. Then start the search refreshed. India employers understand sabbaticals. A 3–6 month gap is easily explained. Use the time to update your LinkedIn, reconnect with the India network, and attend industry events.'
  }

  // Resume tips
  const resumeTips = [
    'Lead with your US company brand — Google, Amazon, Microsoft, Meta carry significant weight in India job applications. Put it front and centre.',
    'Quantify India-relevant impact — "scaled system to 100M users" or "led team of 15 engineers" resonates more than US-centric metrics.',
    'Add an "India context" line to your summary — "Returning to India after 12 years at Google US, seeking senior leadership role in Hyderabad" removes ambiguity.',
    'Do NOT list a US address — use your India mobile number and a brief mention of relocation in the summary. Recruiters filter by location.',
    'Include OCI / citizenship status if you have it — it removes concerns about work authorization that many Indian HR teams have with returning NRIs.',
    `Tailor for ${I.city === 'any' ? 'your target city' : I.city} — mention specifically that you\'re based in / relocating to ${I.city === 'any' ? 'the city' : I.city}.`,
  ]

  // LinkedIn tips
  const linkedinTips = [
    'Update location to India immediately — LinkedIn shows your profile to India-based recruiters based on location. This is the single highest-ROI change.',
    'Add "Open to Work" badge but set it to "Recruiters Only" — keeps it professional and triggers India recruiter searches.',
    'Connect with 10–20 ex-colleagues who are already back in India — ask them for warm introductions to their companies.',
    'Post a "returning to India" post — something like "Excited to be returning to Bangalore after 12 years at Google US — looking for senior engineering roles." This will generate warm inbound.',
    'Join LinkedIn groups: "Returning NRIs", "India Tech Leaders", your city\'s tech community group.',
    'Follow HR leaders at your target companies — engage with their posts. India recruiters actively scout LinkedIn comments.',
  ]

  // Interview tips
  const interviewTips = [
    'India interviews ask "Why are you returning?" directly — prepare a positive, clear answer. "Family, quality of life, and India\'s growth opportunity" is better than "better life-work balance" (sounds like burnout).',
    'Salary negotiation is expected — never accept the first offer. Counter by 20–30%. India employers build negotiation room into first offers.',
    'Demonstrate India market knowledge — read ET, Mint, and your sector\'s news for 2 weeks before interviews. India-aware candidates stand out.',
    'Reference Indian context in your achievements — "Similar to what Swiggy/Zepto solved in India, I built..." shows you understand the local market.',
    'Be prepared for longer hiring processes — India tech interviews are 4–6 rounds including coding + system design + behavioural + leadership. US experience speeds things up but doesn\'t skip rounds.',
  ]

  // Salary negotiation script
  const salaryNeg = I.keepUSJob === 'remote' || I.keepUSJob === 'yes_already'
    ? 'Not applicable — you\'re keeping your US salary. Focus on getting the remote arrangement in writing and protecting your total comp.'
    : `When they ask your expectation, say: "Based on my ${I.experience} years of experience and the scope of this role, I\'m looking at ₹X–Y [target range]. But I\'m more interested in the right role and company than squeezing the last rupee. What is the band for this position?" 

Then: when they come back with a number, wait 3 seconds before responding. Say: "I appreciate that — I\'m very interested in this role. Is there flexibility to get to ₹[10–20% above their number]? Given my [specific US experience], I think I can bring significant value quickly." 

Always negotiate base + stock + bonus separately. India CTCs bundle these — ask for the breakup.`

  // Action timeline
  const timeline = [
    {
      phase: 'Phase 1 — Prepare your presence',
      timing: '3–6 months before move',
      color: '#FF9933',
      tasks: [
        'Update LinkedIn location to India and turn on Open to Work (Recruiters Only)',
        'Reconnect with 20+ ex-colleagues now in India — ask for 30-min catch-up calls',
        I.keepUSJob === 'maybe' || I.keepUSJob === 'yes_negotiating' ? 'Have the remote work conversation with your manager — frame as business continuity, not favour' : 'Confirm your employment arrangement in writing before you move',
        'Research top 10 companies hiring your profile in your target city — note their interview process',
      ],
    },
    {
      phase: 'Phase 2 — Build your pipeline',
      timing: '1–3 months before move',
      color: '#138808',
      tasks: [
        'Apply to 15–20 companies simultaneously — never wait for one rejection before applying to the next',
        'Post a "returning to India" LinkedIn post — generates warm inbound from your network',
        'Attend 2–3 India industry events virtually — many are on Zoom. Get on the radar.',
        'Reach out to 5 India-based recruiters in your sector via LinkedIn DM',
      ],
    },
    {
      phase: 'Phase 3 — Land and close',
      timing: 'First 90 days in India',
      color: '#000080',
      tasks: [
        'Attend in-person networking events in your city the first month — India hiring is heavily relationship-driven',
        'Take meetings at target companies even if no open role — India companies create roles for the right candidate',
        I.keepUSJob === 'no_break' ? 'Use the break wisely — attend industry conferences, build your India network, consult for free initially to re-enter the ecosystem' : 'Use your US offer letters as leverage — even expired ones establish your market value',
        'Set a 90-day target: offer in hand within 90 days of landing. Hold yourself accountable.',
      ],
    },
  ]

  // Risks
  const risks: CareerResult['risks'] = []

  if (I.keepUSJob === 'no_switching' && (I.role === 'ic_staff' || I.role === 'director')) {
    risks.push({ level: 'high', title: 'Significant salary step-down at senior levels', detail: 'Staff+ / Director level roles in India pay 40–60% less in nominal terms than equivalent US roles. The lifestyle adjustment is real.', action: 'Target GCC (Global Capability Centre) roles of US companies — they pay closest to global rates. Or negotiate a remote arrangement before you switch.' })
  }
  if (I.timeline === 'after_move') {
    risks.push({ level: 'medium', title: 'Job searching after landing is harder', detail: 'India hiring takes 3–6 months. Searching without income pressure is very different from searching while burning savings. Start your pipeline before you move.', action: 'Begin applying 3 months before your move date. Many India companies will wait 60–90 days for the right candidate.' })
  }
  if (I.visaStatus === 'us_citizen') {
    risks.push({ level: 'medium', title: 'US citizen needs employment visa — apply for OCI', detail: 'Working in India on a US passport requires an employment visa or OCI card. OCI is the permanent solution — apply 3–4 months before moving.', action: 'Apply for OCI card immediately — processing takes 3–4 months. Costs ~$275 and gives you permanent right to live and work in India.' })
  }
  if (I.sector === 'healthcare') {
    risks.push({ level: 'medium', title: 'Medical license transfer takes 6–12 months', detail: 'US medical board certification needs to be validated by National Medical Commission (NMC) India. This takes 6–12 months and you cannot practice until complete.', action: 'Start NMC registration process 12 months before your planned start date in India. Gather all US board certifications and hospital credentials.' })
  }

  // Insights
  const insights: CareerResult['insights'] = []

  if (I.techStack === 'ai_ml') {
    insights.push({ icon: '🤖', title: 'AI/ML is the #1 demand skill in India right now', detail: 'Every major India company is building AI teams urgently. Your ML/data background puts you in the highest demand category. Expect multiple competing offers if you have 5+ years experience.', type: 'positive' })
  }
  if (I.keepUSJob === 'yes_already' || I.keepUSJob === 'yes_negotiating') {
    insights.push({ icon: '💰', title: 'Remote work gives 3–4x purchasing power', detail: `A $${I.salaryExpectation === 'h200' ? '300K' : '150K'} US salary in India gives you extraordinary purchasing power. You can pay off loans, invest aggressively, and live a top-tier lifestyle simultaneously.`, type: 'positive' })
  }
  insights.push({ icon: '🤝', title: 'Warm introductions close 80% of India senior roles', detail: 'India hiring at senior levels is heavily network-driven. A warm introduction from a mutual connection converts at 5–10x the rate of a cold application. Invest in reactivating your India network before and after the move.', type: 'info' })
  if (I.experience === '10to15' || I.experience === '15plus') {
    insights.push({ icon: '🏆', title: 'Your US experience is rare and valued in India', detail: `Only ~3% of India tech workforce has worked at top US companies. At ${I.experience === '15plus' ? '15+' : '10–15'} years of experience at a top US company, you are genuinely rare. Don\'t undersell this.`, type: 'positive' })
  }
  insights.push({ icon: '📅', title: 'India offer validity is short — don\'t over-engineer timing', detail: 'India job offers typically have 30–60 day acceptance windows and 2–3 month joining timelines. Don\'t start the serious search more than 6 months before you plan to join — you cannot hold offers that long.', type: 'warning' })

  // Market snapshot
  const marketSnapshot = [
    { label: 'India tech job market', value: 'Growing', note: '18% YoY increase in senior tech roles', color: '#138808' },
    { label: 'GCC expansion', value: '1,700+ centres', note: 'US companies building India R&D fast', color: '#FF9933' },
    { label: 'AI/ML demand', value: 'Very High', note: '3x YoY increase in ML roles', color: '#7C5CBF' },
    { label: 'Remote work adoption', value: 'Hybrid norm', note: '60%+ India tech cos now hybrid', color: '#000080' },
  ]

  return { salaryBenchmarks, topCompanies: companies, remoteStrategy, resumeTips, linkedinTips, interviewTips, salaryNegotiationScript: salaryNeg, timeline, risks, insights, marketSnapshot }
}

export default function JobCareerGuide() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CareerResult | null>(null)

  const answered = STEPS.filter((step) => Boolean(answers[step.key as keyof Inputs])).length
  const progress = Math.round((answered / STEPS.length) * 100)
  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers((prev) => ({ ...prev, [key]: val }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => {
      setResult(compute(answers as Inputs))
      setLoading(false)
    }, 1600)
  }

  function restart() { setAnswers({}); setResult(null); setLoading(false) }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Building your career transition plan...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Matching salary benchmarks, companies, and strategy for your profile</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (result) {
    const r = result
    const riskColors = { high: { bg: '#FCEBEB', border: 'rgba(226,75,74,0.2)', icon: '#E24B4A', text: '#791F1F' }, medium: { bg: '#FFF3E6', border: 'rgba(255,153,51,0.2)', icon: '#FF9933', text: '#633806' }, low: { bg: '#E8E8FF', border: 'rgba(0,0,128,0.15)', icon: '#6B8CFF', text: '#0C447C' } }
    const cityName = ({ hyd: 'Hyderabad', blr: 'Bangalore', pun: 'Pune', che: 'Chennai', mum: 'Mumbai', any: 'your target city' } as Record<string, string>)[answers.city || 'any']
    const sectorName = ({ tech: 'Technology', finance: 'Finance', consulting: 'Consulting', healthcare: 'Healthcare', startup: 'Startups', other: 'your sector' } as Record<string, string>)[answers.sector || 'tech']

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <style>{`
          .jobs-report-shell {
            max-width: 960px;
            margin: 0 auto;
            padding: 2rem;
          }
          @media (max-width: 767px) {
            .jobs-report-shell {
              padding: 1rem .9rem 2rem;
            }
            .jobs-market-grid,
            .jobs-advice-grid,
            .jobs-report-cta {
              grid-template-columns: 1fr !important;
            }
            .jobs-risk-row {
              flex-direction: column;
            }
            .jobs-report-cta {
              padding: 1.5rem !important;
            }
            .jobs-report-actions {
              width: 100%;
            }
            .jobs-report-actions > * {
              flex: 1 1 100%;
              justify-content: center;
            }
          }
        `}</style>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Job & Career Transition Guide</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              Your {sectorName} career strategy in {cityName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>
              Salary benchmarks, top companies hiring NRI returnees, remote work strategy, and a 90-day job search plan.
            </p>
            <div className="jobs-market-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginTop: '2rem' }}>
              {r.marketSnapshot.map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>{s.label}</div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: s.color, marginBottom: '2px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{s.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="jobs-report-shell">

          {/* SALARY BENCHMARKS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>India Salary Benchmarks for Your Profile</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Role', 'India CTC', 'US Equivalent', 'Purchasing Power Parity', 'Note'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.salaryBenchmarks.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid var(--border)', background: i % 2 === 0 ? 'var(--india-white)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--ink)' }}>{s.role}</td>
                      <td style={{ padding: '10px 12px', color: '#138808', fontWeight: 600 }}>{s.indiaSalary}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{s.usSalary}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{s.purchasingPowerParity}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-soft)', fontSize: '11px' }}>{s.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-soft)', marginTop: '8px' }}>* CTC = Cost to Company (total comp incl. base + bonus + stock). Ranges are for top-quartile candidates with US experience.</div>
          </div>

          {/* TOP COMPANIES */}
          {r.topCompanies.length > 0 && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Top Companies Actively Hiring NRI Returnees</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {r.topCompanies.map(c => (
                  <div key={c.name} style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem', border: '0.5px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{c.name}</div>
                          {c.nriHiring && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8F5E8', color: '#27500A' }}>NRI Hiring</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '5px' }}>🏢 {c.indiaPresence} · 🏡 {c.remotePolicy}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
                          {c.roles.map(r => <span key={r} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: 'var(--white)', border: '0.5px solid var(--border)', color: 'var(--ink-muted)' }}>{r}</span>)}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{c.note}</div>
                      </div>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#FF9933' }}>{c.salaryRange}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>CTC range</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REMOTE STRATEGY */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🖥️ Your Remote Work Strategy</div>
            <div style={{ background: 'rgba(255,153,51,0.06)', borderRadius: '14px', padding: '1.25rem', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.75 }}>{r.remoteStrategy}</div>
          </div>

          {/* RESUME + LINKEDIN + INTERVIEW TIPS */}
          <div className="jobs-advice-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>📄 Resume for India Market</div>
              {r.resumeTips.map((tip, i) => (
                <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid rgba(255,153,51,0.3)' }}>{tip}</div>
              ))}
            </div>
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.5rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '1rem' }}>💼 LinkedIn Strategy</div>
              {r.linkedinTips.map((tip, i) => (
                <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid rgba(19,136,8,0.3)' }}>{tip}</div>
              ))}
            </div>
          </div>

          {/* SALARY NEGOTIATION */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>💬 Salary Negotiation Script</div>
            <div style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem', fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.8, fontStyle: 'italic', whiteSpace: 'pre-line' }}>{r.salaryNegotiationScript}</div>
          </div>

          {/* ACTION TIMELINE */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Your 90-Day Career Plan</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {r.timeline.map((phase, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: phase.color, color: '#fff', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                    {i < r.timeline.length - 1 && <div style={{ width: '2px', height: '100%', minHeight: '40px', background: 'var(--border)', margin: '6px 0' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
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

          {/* RISKS */}
          {r.risks.length > 0 && (
            <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Career Risks For Your Profile</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {r.risks.map((risk, i) => {
                  const c = riskColors[risk.level]
                  return (
                    <div key={i} className="jobs-risk-row" style={{ background: c.bg, border: `0.5px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: c.icon, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{risk.level === 'high' ? '!' : '⚠'}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
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
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Key Career Insights</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
              {r.insights.map((ins, i) => (
                <div key={i} style={{ background: ins.type === 'positive' ? '#E8F5E8' : ins.type === 'warning' ? '#FFF3E6' : 'var(--india-white)', border: `0.5px solid ${ins.type === 'positive' ? 'rgba(19,136,8,0.15)' : ins.type === 'warning' ? 'rgba(255,153,51,0.2)' : 'var(--border)'}`, borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{ins.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '6px' }}>{ins.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{ins.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="jobs-report-cta" style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>See your complete return readiness score</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Get your personalised readiness report — financial, career, schools, housing all in one place.</div>
            </div>
            <div className="jobs-report-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/planner" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Readiness check →</Link>
              <button onClick={restart} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>Recalculate</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5F0', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .jobs-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .jobs-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        .jobs-sticky { position: sticky; top: 96px; }
        .jobs-stack { display: grid; gap: 1rem; }
        .jobs-option-grid { display: grid; gap: 0.7rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        @media (max-width: 980px) {
          .jobs-grid { grid-template-columns: 1fr; }
          .jobs-sticky { position: static; }
        }
        @media (max-width: 767px) {
          .jobs-shell { padding: 1rem 0.9rem 2rem; }
          .jobs-option-grid { grid-template-columns: 1fr !important; }
          .jobs-question-label { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div className="jobs-shell">
        <div className="jobs-grid">
          <div className="jobs-sticky">
            <div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Job & Career Guide</span>
                </div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '.9rem' }}>Navigate your career move with <em style={{ fontStyle: 'italic', color: '#FF9933' }}>more clarity.</em></h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions as the readiness check and we&apos;ll build your India career strategy in one pass.</p>
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
                {[{ title: 'What you?ll get', body: 'Salary benchmarks, top companies, remote-work strategy, and a 90-day India job search plan.' }, { title: 'Your progress', body: answered === STEPS.length ? 'Everything is filled in and ready for your career report.' : `${answered} of ${STEPS.length} questions answered. ${STEPS.length - answered} left before you can generate your report.` }, { title: 'How to answer', body: 'Choose the options that best match your role, target market, and return strategy. You can revise anything before generating.' }].map((item) => <div key={item.title} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div></div>)}
              </div>
            </div>
          </div>

          <div className="jobs-stack">
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: 11, fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>Job & Career Guide ? Free ? {STEPS.length} questions</span></div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>Plan your return-to-India career strategy</h2>
              <p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we?ll turn your answers into salary benchmarks, company picks, and a clear transition plan.</p>
            </div>

            {STEPS.map((step, index) => <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div className="jobs-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}><div><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div><h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3><p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p></div>{answers[step.key as keyof Inputs] ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}</div><div className="jobs-option-grid">{step.opts.map((opt) => { const sel = answers[step.key as keyof Inputs] === opt.k; return <button key={opt.k} type="button" onClick={() => setAnswer(step.key, opt.k)} style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div>{opt.sub ? <div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div> : null}</div><div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} /></div></button> })}</div></div>)}
            {answered === STEPS.length ? <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My Career Report ?</button> : <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}><div style={{ fontSize: '1.25rem' }}>??</div><div><div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {STEPS.length} questions to generate your report</div><div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{STEPS.length - answered} question{STEPS.length - answered !== 1 ? 's' : ''} remaining</div></div></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
