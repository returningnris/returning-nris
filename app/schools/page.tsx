'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Inputs = {
  city: string
  grade: string
  curriculum: string
  budget: string
  midYear: string
  priorities: string
  language: string
}

type School = {
  name: string
  city: string
  area: string
  board: string
  annualFee: string
  feeINR: number
  admissionTimeline: string
  midYearEntry: boolean
  midYearNote: string
  grades: string
  established: string
  strengths: string[]
  sports: string
  arts: string
  contact: string
  website: string
  nriKidsPercent: string
  usCurriculumBridge: string
  waitlistStatus: string
  matchScore?: number
}

const SCHOOLS: School[] = [
  // HYDERABAD
  { name: 'Oakridge International School', city: 'hyd', area: 'Bachupally / Gachibowli', board: 'IB / IGCSE', annualFee: '₹4.5–7L/yr', feeINR: 600000, admissionTimeline: '12–18 months in advance', midYearEntry: true, midYearNote: 'Accepts mid-year with assessment test', grades: 'PYP to Diploma (Age 3–18)', established: '2003', strengths: ['Strong IB Diploma results', 'Experienced with NRI/expat children', 'US curriculum bridge program', 'Global university placements'], sports: 'Excellent — swimming, basketball, cricket', arts: 'Strong — music, theatre, visual arts', contact: '+91 40 4849 7000', website: 'oakridge.in', nriKidsPercent: '35%', usCurriculumBridge: 'Yes — dedicated transition program', waitlistStatus: 'Long waitlist — apply 18 months early' },
  { name: 'Indus International School', city: 'hyd', area: 'Nallagandla', board: 'IB / IGCSE', annualFee: '₹5–8L/yr', feeINR: 650000, admissionTimeline: '12–15 months in advance', midYearEntry: true, midYearNote: 'Mid-year accepted with portfolio review', grades: 'Nursery to Grade 12', established: '2008', strengths: ['Highest IB scores in Hyderabad', 'Stanford/MIT alumni network', 'Large NRI community', 'Leadership programs'], sports: 'Very strong — equestrian, tennis, swimming', arts: 'Excellent — film making, music', contact: '+91 40 2304 5678', website: 'indusedu.org', nriKidsPercent: '42%', usCurriculumBridge: 'Yes — full transition support', waitlistStatus: 'Apply immediately — fills fast' },
  { name: 'Silver Oaks International School', city: 'hyd', area: 'Shamshabad / HITECH City', board: 'IGCSE / CBSE', annualFee: '₹2.5–4.5L/yr', feeINR: 350000, admissionTimeline: '6–9 months in advance', midYearEntry: true, midYearNote: 'Flexible mid-year admission policy', grades: 'LKG to Grade 12', established: '2002', strengths: ['Affordable international curriculum', 'Strong CBSE + IGCSE dual track', 'Good campus facilities', 'Active parent community'], sports: 'Good — football, swimming', arts: 'Moderate', contact: '+91 40 2304 9900', website: 'silveroaks.in', nriKidsPercent: '20%', usCurriculumBridge: 'Partial', waitlistStatus: 'Moderate waitlist — apply 9 months early' },
  { name: 'Chirec International School', city: 'hyd', area: 'Banjara Hills / Kondapur', board: 'CBSE / IGCSE', annualFee: '₹1.8–3.5L/yr', feeINR: 250000, admissionTimeline: '6 months in advance', midYearEntry: true, midYearNote: 'Accepts mid-year subject to seat availability', grades: 'Grade 1–12', established: '1997', strengths: ['Strong CBSE academics', 'Affordable fees', 'Multiple locations in Hyderabad', 'Good IGCSE track'], sports: 'Good', arts: 'Moderate', contact: '+91 40 2335 8800', website: 'chirec.ac.in', nriKidsPercent: '15%', usCurriculumBridge: 'Limited', waitlistStatus: 'Generally available — apply 6 months early' },
  { name: 'The Hyderabad Public School', city: 'hyd', area: 'Begumpet', board: 'CBSE', annualFee: '₹1.2–2L/yr', feeINR: 160000, admissionTimeline: '12 months — very competitive', midYearEntry: false, midYearNote: 'Only annual intake — June admission only', grades: 'Grade 1–12', established: '1923', strengths: ['Prestigious legacy school', 'Strong CBSE academics', 'Famous alumni', 'Residential option available'], sports: 'Excellent — polo, cricket, athletics', arts: 'Good', contact: '+91 40 2779 7200', website: 'hps.edu.in', nriKidsPercent: '8%', usCurriculumBridge: 'No', waitlistStatus: 'Very competitive — entrance exam required' },
  // BANGALORE
  { name: 'The International School Bangalore (TISB)', city: 'blr', area: 'Hennur', board: 'IB / IGCSE', annualFee: '₹5.5–9L/yr', feeINR: 720000, admissionTimeline: '12–18 months in advance', midYearEntry: true, midYearNote: 'Accepts mid-year with assessment', grades: 'Grade 1–12', established: '1994', strengths: ['Top IB school in South India', 'Residential campus', 'Strong US college placements', 'Large NRI community'], sports: 'Excellent — full Olympic facilities', arts: 'Strong — dedicated arts centre', contact: '+91 80 6726 7000', website: 'tisb.org', nriKidsPercent: '45%', usCurriculumBridge: 'Yes — comprehensive', waitlistStatus: 'Long waitlist — apply 18 months early' },
  { name: 'Canadian International School Bangalore', city: 'blr', area: 'Yelahanka', board: 'IB / CBSE', annualFee: '₹4–6.5L/yr', feeINR: 525000, admissionTimeline: '9–12 months in advance', midYearEntry: true, midYearNote: 'Mid-year accepted — Canadian/US curriculum alignment', grades: 'PYP to Grade 12', established: '1996', strengths: ['Canadian curriculum background', 'Strong US/Canada university placements', 'Experienced with NRI transitions', 'Good teacher-student ratio'], sports: 'Good', arts: 'Strong — music program excellent', contact: '+91 80 2846 5060', website: 'cis-india.com', nriKidsPercent: '38%', usCurriculumBridge: 'Yes — Canadian curriculum aligned', waitlistStatus: 'Moderate — apply 12 months early' },
  { name: 'Gear Innovative International School', city: 'blr', area: 'Indiranagar / Yelahanka', board: 'IGCSE / CBSE', annualFee: '₹2.5–4.5L/yr', feeINR: 350000, admissionTimeline: '6 months in advance', midYearEntry: true, midYearNote: 'Flexible admission with placement test', grades: 'LKG to Grade 12', established: '1993', strengths: ['Long track record', 'Good IGCSE results', 'Multiple Bangalore campuses', 'Affordable international curriculum'], sports: 'Good', arts: 'Moderate', contact: '+91 80 2527 6789', website: 'gearinnovative.com', nriKidsPercent: '18%', usCurriculumBridge: 'Partial', waitlistStatus: 'Generally available' },
  { name: 'Inventure Academy', city: 'blr', area: 'Whitefield / Sarjapur', board: 'IB / IGCSE', annualFee: '₹4.5–7.5L/yr', feeINR: 600000, admissionTimeline: '12 months in advance', midYearEntry: true, midYearNote: 'Assessment-based mid-year entry', grades: 'Grade 1–12', established: '2005', strengths: ['Strong design thinking focus', 'Project-based learning', 'Google for Education school', 'Entrepreneurship program'], sports: 'Good', arts: 'Excellent — design and innovation focus', contact: '+91 80 4965 5000', website: 'inventureacademy.org', nriKidsPercent: '28%', usCurriculumBridge: 'Yes', waitlistStatus: 'Apply 12 months early' },
  // PUNE
  { name: 'Mercedes-Benz International School Pune', city: 'pun', area: 'Hadapsar', board: 'IB', annualFee: '₹6–9L/yr', feeINR: 750000, admissionTimeline: '12–18 months in advance', midYearEntry: true, midYearNote: 'Accepts mid-year for expat families', grades: 'PYP to Diploma', established: '2003', strengths: ['Only IB World School in Pune with full continuum', 'Strong expat community', 'Top university placements globally', 'Small class sizes'], sports: 'Good', arts: 'Excellent', contact: '+91 20 6602 0200', website: 'mbis.org', nriKidsPercent: '50%', usCurriculumBridge: 'Yes', waitlistStatus: 'Apply immediately' },
  { name: 'The Orchid School Pune', city: 'pun', area: 'Baner', board: 'CBSE', annualFee: '₹1.2–2.5L/yr', feeINR: 175000, admissionTimeline: '6 months in advance', midYearEntry: true, midYearNote: 'Flexible mid-year policy', grades: 'Nursery to Grade 12', established: '1994', strengths: ['Affordable CBSE', 'Good academics', 'Large campus', 'Active sports and arts'], sports: 'Good', arts: 'Good', contact: '+91 20 2729 3399', website: 'theorchidschool.com', nriKidsPercent: '10%', usCurriculumBridge: 'Limited', waitlistStatus: 'Generally available' },
  { name: 'Symbiosis International School', city: 'pun', area: 'Viman Nagar', board: 'CBSE / IGCSE', annualFee: '₹2–3.5L/yr', feeINR: 275000, admissionTimeline: '6–9 months', midYearEntry: true, midYearNote: 'Mid-year accepted with assessment', grades: 'Grade 1–12', established: '2000', strengths: ['University group backing', 'Good CBSE + IGCSE dual track', 'Modern campus', 'Sports focus'], sports: 'Excellent', arts: 'Good', contact: '+91 20 6616 3999', website: 'symbiosisinternationalschool.com', nriKidsPercent: '15%', usCurriculumBridge: 'Partial', waitlistStatus: 'Moderate waitlist' },
  // CHENNAI
  { name: 'Gateway International School Chennai', city: 'che', area: 'OMR / Sholinganallur', board: 'IGCSE / CBSE', annualFee: '₹2.5–4L/yr', feeINR: 325000, admissionTimeline: '6–9 months', midYearEntry: true, midYearNote: 'Mid-year accepted — placement test required', grades: 'LKG to Grade 12', established: '2005', strengths: ['Good IGCSE track', 'OMR IT corridor location', 'NRI-friendly admission process', 'Strong Tamil medium option'], sports: 'Good', arts: 'Moderate', contact: '+91 44 4393 8888', website: 'gatewayschool.in', nriKidsPercent: '22%', usCurriculumBridge: 'Partial', waitlistStatus: 'Apply 9 months early' },
  { name: 'Chettinad Vidyashram', city: 'che', area: 'RA Puram', board: 'CBSE', annualFee: '₹1.5–2.5L/yr', feeINR: 200000, admissionTimeline: '9–12 months — competitive', midYearEntry: false, midYearNote: 'Annual intake only', grades: 'Grade 1–12', established: '1985', strengths: ['Prestigious Chennai school', 'Strong CBSE academics', 'Famous alumni', 'Cultural connection to Chennai heritage'], sports: 'Good', arts: 'Good — classical arts focus', contact: '+91 44 2461 4222', website: 'chettinadvidyashram.org', nriKidsPercent: '12%', usCurriculumBridge: 'No', waitlistStatus: 'Competitive entrance — apply early' },
  // MUMBAI
  { name: 'Dhirubhai Ambani International School', city: 'mum', area: 'BKC / Bandra', board: 'IB / IGCSE', annualFee: '₹6–10L/yr', feeINR: 800000, admissionTimeline: '12–18 months', midYearEntry: true, midYearNote: 'Mid-year for expat/NRI — interview required', grades: 'Grade 1–12', established: '2003', strengths: ['Top ranked school in India', 'Outstanding IB results', 'Celebrity alumni', 'Best facilities in Mumbai', 'Strong US university placements'], sports: 'Excellent', arts: 'Excellent', contact: '+91 22 4066 5000', website: 'da-is.org', nriKidsPercent: '35%', usCurriculumBridge: 'Yes', waitlistStatus: 'Very long — apply 18 months early' },
  { name: 'Oberoi International School', city: 'mum', area: 'Goregaon', board: 'IB / IGCSE', annualFee: '₹5.5–8.5L/yr', feeINR: 700000, admissionTimeline: '12 months', midYearEntry: true, midYearNote: 'Accepts NRI mid-year transfers', grades: 'PYP to Diploma', established: '2009', strengths: ['IB World School', 'Strong NRI community', 'Modern campus', 'Excellent university guidance'], sports: 'Good', arts: 'Strong', contact: '+91 22 4262 5800', website: 'oberoi-is.org', nriKidsPercent: '40%', usCurriculumBridge: 'Yes', waitlistStatus: 'Apply 12–15 months early' },
  { name: 'Podar International School', city: 'mum', area: 'Santacruz / Multiple', board: 'CBSE / IGCSE', annualFee: '₹1.8–3.5L/yr', feeINR: 275000, admissionTimeline: '6 months', midYearEntry: true, midYearNote: 'Flexible mid-year across campuses', grades: 'Nursery to Grade 12', established: '1927', strengths: ['Multiple Mumbai campuses', 'Affordable', 'Good CBSE academics', 'Strong parent network'], sports: 'Good', arts: 'Good', contact: '+91 22 2649 9898', website: 'podar.org', nriKidsPercent: '12%', usCurriculumBridge: 'Limited', waitlistStatus: 'Generally available' },
]

const STEPS = [
  { key: 'city', section: 'Your Search', q: 'Which city are you moving to?', hint: 'We\'ll show schools in that city', opts: [{ k: 'hyd', label: 'Hyderabad', sub: 'Gachibowli, Jubilee Hills, Kondapur' }, { k: 'blr', label: 'Bangalore', sub: 'Whitefield, Indiranagar, Koramangala' }, { k: 'pun', label: 'Pune', sub: 'Baner, Koregaon Park, Viman Nagar' }, { k: 'che', label: 'Chennai', sub: 'OMR, Adyar, RA Puram' }, { k: 'mum', label: 'Mumbai', sub: 'Bandra, Powai, BKC' }] },
  { key: 'grade', section: 'Your Child', q: 'What grade will your child be entering?', hint: 'Affects which schools can accommodate mid-year entry', opts: [{ k: 'pre', label: 'Pre-school / Nursery / LKG', sub: 'Age 2–5' }, { k: 'primary', label: 'Grades 1–5 (Primary)', sub: 'Age 6–10' }, { k: 'middle', label: 'Grades 6–8 (Middle)', sub: 'Age 11–13' }, { k: 'high', label: 'Grades 9–10 (High school)', sub: 'Age 14–15 — board year starts' }, { k: 'diploma', label: 'Grades 11–12 (Diploma / A-levels)', sub: 'Age 16–17 — most critical' }] },
  { key: 'curriculum', section: 'Your Child', q: 'What curriculum is your child currently on?', hint: 'Matching curriculum reduces transition difficulty', opts: [{ k: 'us_common', label: 'US Common Core', sub: 'American school curriculum' }, { k: 'ib', label: 'IB (International Baccalaureate)', sub: 'Already on IB' }, { k: 'igcse', label: 'IGCSE / Cambridge', sub: 'Already on Cambridge' }, { k: 'cbse', label: 'CBSE', sub: 'Indian national board' }, { k: 'other', label: 'Other international', sub: 'French, German, Montessori etc.' }] },
  { key: 'midYear', section: 'Your Search', q: 'Do you need mid-year admission?', hint: 'Most schools have April intake — mid-year is harder but possible', opts: [{ k: 'yes_urgent', label: 'Yes — moving in 3 months', sub: 'Urgent mid-year required' }, { k: 'yes_planned', label: 'Yes — moving in 6 months', sub: 'Mid-year with some runway' }, { k: 'no_april', label: 'No — can wait for April intake', sub: 'Planning ahead for academic year start' }, { k: 'flexible', label: 'Flexible on timing', sub: 'Can adjust move date' }] },
  { key: 'budget', section: 'Your Search', q: 'What is your annual school fee budget?', hint: 'Fees vary from ₹1.5L to ₹10L per year per child', opts: [{ k: 'premium', label: '₹5L+ per year', sub: 'Top IB schools' }, { k: 'mid', label: '₹2.5–5L per year', sub: 'Good international schools' }, { k: 'value', label: '₹1.5–2.5L per year', sub: 'Affordable quality schools' }, { k: 'open', label: 'Budget is open', sub: 'Best match regardless of cost' }] },
  { key: 'priorities', section: 'Your Search', q: 'What matters most in a school?', hint: 'We\'ll rank schools that score highest on your priority', opts: [{ k: 'academics', label: 'Academic results & university placements', sub: 'IB scores, college admissions' }, { k: 'nri_community', label: 'NRI / international child community', sub: 'Child fits in socially' }, { k: 'sports', label: 'Sports & extracurricular facilities', sub: 'All-round development' }, { k: 'transition', label: 'Smooth transition from US curriculum', sub: 'Bridge programs, familiar teaching' }, { k: 'affordable', label: 'Best value for money', sub: 'Quality at reasonable fees' }] },
  { key: 'language', section: 'Your Child', q: 'Does your child speak Hindi or the local language?', hint: 'Affects social adjustment and some school requirements', opts: [{ k: 'both', label: 'Yes — fluent in Hindi/regional', sub: 'Easy social adjustment' }, { k: 'some', label: 'Some Hindi / basic', sub: 'Will catch up quickly' }, { k: 'none', label: 'No Indian language', sub: 'International/English-medium school essential' }] },
]

function matchSchools(I: Inputs): School[] {
  const citySchools = SCHOOLS.filter(s => s.city === I.city)

  return citySchools.map(school => {
    let score = 50

    // Budget filter
    if (I.budget === 'premium' && school.feeINR >= 500000) score += 15
    if (I.budget === 'mid' && school.feeINR >= 250000 && school.feeINR < 500000) score += 15
    if (I.budget === 'value' && school.feeINR < 250000) score += 15
    if (I.budget === 'open') score += 10

    // Mid-year
    if (I.midYear === 'yes_urgent' && school.midYearEntry) score += 20
    if (I.midYear === 'yes_urgent' && !school.midYearEntry) score -= 30
    if (I.midYear === 'yes_planned' && school.midYearEntry) score += 15
    if (I.midYear === 'no_april') score += 5

    // Curriculum match
    if (I.curriculum === 'us_common' && (school.board.includes('IB') || school.board.includes('IGCSE'))) score += 20
    if (I.curriculum === 'ib' && school.board.includes('IB')) score += 20
    if (I.curriculum === 'igcse' && school.board.includes('IGCSE')) score += 20
    if (I.curriculum === 'cbse' && school.board.includes('CBSE')) score += 15

    // Priorities
    if (I.priorities === 'nri_community') {
      const pct = parseInt(school.nriKidsPercent) || 0
      score += Math.round(pct / 5)
    }
    if (I.priorities === 'sports' && school.sports.includes('Excellent')) score += 15
    if (I.priorities === 'transition' && school.usCurriculumBridge === 'Yes') score += 20
    if (I.priorities === 'affordable' && school.feeINR < 300000) score += 15

    // Language — no Indian language → international school essential
    if (I.language === 'none' && (school.board.includes('IB') || school.board.includes('IGCSE'))) score += 10

    // Grade
    if (I.grade === 'diploma' && school.board.includes('IB') && !school.midYearEntry) score -= 10

    return { ...school, matchScore: Math.min(100, Math.max(10, score)) }
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

const boardColors: Record<string, { bg: string; color: string }> = {
  'IB': { bg: '#E8E8FF', color: '#000080' },
  'IGCSE': { bg: '#E8F5E8', color: '#27500A' },
  'CBSE': { bg: '#FFF3E6', color: '#854F0B' },
  'ICSE': { bg: '#FCEBEB', color: '#791F1F' },
}

function getBoardBadge(board: string) {
  const boards = board.split(' / ')
  return boards
}

export default function SchoolsFinder() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<School[] | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const step = STEPS[currentStep]
  const answered = STEPS.filter((s) => !!answers[s.key as keyof Inputs]).length
  const progress = Math.round((answered / STEPS.length) * 100)
  const sectionColors: Record<string, string> = { 'Your Search': '#FF9933', 'Your Child': '#7C5CBF' }
  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => { setResult(matchSchools(answers as Inputs)); setLoading(false) }, 1400)
  }

  function pick(key: string, val: string) {
    setAnswer(key, val)
  }

  function restart() { setAnswers({}); setCurrentStep(0); setResult(null); setLoading(false); setExpanded(null) }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Matching schools for your child...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Scoring schools on curriculum, fees, mid-year policy, and NRI fit</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (result) {
    const cityNames: Record<string, string> = { hyd: 'Hyderabad', blr: 'Bangalore', pun: 'Pune', che: 'Chennai', mum: 'Mumbai' }
    const cityName = cityNames[answers.city || 'hyd']
    const top = result[0]

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Schools Comparison — {cityName}</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              {result.length} schools matched in {cityName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>
              Ranked by fit for your child&apos;s grade, curriculum background, and admission timeline. Top match: <strong style={{ color: '#FF9933' }}>{top.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>

          {/* IMPORTANT NOTE */}
          {answers.midYear === 'yes_urgent' && (
            <div style={{ background: '#FFF3E6', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#854F0B', marginBottom: '3px' }}>Urgent mid-year admission — act immediately</div>
                <div style={{ fontSize: '13px', color: '#633806', lineHeight: 1.6 }}>For a 3-month timeline, contact all schools below simultaneously today. Don&apos;t apply sequentially — apply to all at once and take the first confirmed seat.</div>
              </div>
            </div>
          )}

          {/* SCHOOLS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {result.map((school, i) => (
              <div key={school.name} style={{ background: 'var(--white)', border: `0.5px solid ${expanded === school.name ? 'rgba(255,153,51,0.3)' : 'var(--border)'}`, borderRadius: '20px', overflow: 'hidden', transition: 'all 0.2s' }}>

                {/* SCHOOL HEADER */}
                <div style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setExpanded(expanded === school.name ? null : school.name)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: i === 0 ? '#FF9933' : i === 1 ? '#138808' : 'var(--india-white)', color: i < 2 ? '#fff' : 'var(--ink-soft)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', marginBottom: '3px' }}>{school.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '8px' }}>📍 {school.area} · Est. {school.established}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                            {getBoardBadge(school.board).map(b => {
                              const style = boardColors[b] || { bg: 'var(--india-white)', color: 'var(--ink-soft)' }
                              return <span key={b} style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: style.bg, color: style.color }}>{b}</span>
                            })}
                            {school.midYearEntry && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8F5E8', color: '#27500A' }}>✓ Mid-year</span>}
                            {!school.midYearEntry && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#FCEBEB', color: '#791F1F' }}>✗ Annual only</span>}
                            {school.usCurriculumBridge === 'Yes' && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C' }}>🇺🇸 US bridge</span>}
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>💰 {school.annualFee}</span>
                            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>📅 Apply: {school.admissionTimeline}</span>
                            <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>👨‍👩‍👧 NRI kids: {school.nriKidsPercent}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: i === 0 ? '#FF9933' : 'var(--ink)' }}>{school.matchScore}</div>
                          <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>match score</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>{expanded === school.name ? '▲ Less' : '▼ Details'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED DETAIL */}
                {expanded === school.name && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '0.5px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1rem', marginTop: '1.25rem' }}>

                      <div style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>School Details</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {[
                            { label: 'Grades', val: school.grades },
                            { label: 'Annual Fees', val: school.annualFee },
                            { label: 'Admission', val: school.admissionTimeline },
                            { label: 'Waitlist', val: school.waitlistStatus },
                            { label: 'Sports', val: school.sports },
                            { label: 'Arts', val: school.arts },
                          ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--ink-soft)' }}>{item.label}</span>
                              <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right', maxWidth: '200px' }}>{item.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ background: school.midYearEntry ? '#E8F5E8' : '#FCEBEB', borderRadius: '12px', padding: '1rem', marginBottom: '10px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: school.midYearEntry ? '#27500A' : '#791F1F', marginBottom: '5px' }}>
                            {school.midYearEntry ? '✓ Mid-year admission available' : '✗ Annual intake only'}
                          </div>
                          <div style={{ fontSize: '12px', color: school.midYearEntry ? '#27500A' : '#791F1F', lineHeight: 1.55 }}>{school.midYearNote}</div>
                        </div>
                        {school.usCurriculumBridge !== 'No' && (
                          <div style={{ background: '#E8E8FF', borderRadius: '12px', padding: '1rem', marginBottom: '10px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0C447C', marginBottom: '5px' }}>US Curriculum Bridge</div>
                            <div style={{ fontSize: '12px', color: '#0C447C', lineHeight: 1.55 }}>{school.usCurriculumBridge}</div>
                          </div>
                        )}
                        <div style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>Strengths</div>
                          {school.strengths.map((s, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '4px', paddingLeft: '10px', borderLeft: '2px solid var(--saffron-light)' }}>{s}</div>)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                      <a href={`tel:${school.contact}`} style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '8px 16px', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>📞 {school.contact}</a>
                      <a href={`https://${school.website}`} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--india-white)', color: 'var(--ink)', border: '0.5px solid var(--border)', borderRadius: '100px', padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}>🌐 Visit website</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* PRO TIPS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>NRI School Admission Tips</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
              {[
                { icon: '⏰', title: 'Apply to all shortlisted schools simultaneously', detail: 'Don\'t wait for one rejection before applying to the next. Apply to 3–4 schools at the same time.' },
                { icon: '📁', title: 'Documents to keep ready', detail: 'US school transcripts, latest report card, immunisation records, birth certificate, passport copy, previous school\'s principal recommendation letter.' },
                { icon: '🧪', title: 'Expect placement tests', detail: 'Most IB/IGCSE schools will assess your child\'s current level, especially for Grades 6+. Prepare with 2–3 mock tests.' },
                { icon: '💰', title: 'Factor in hidden costs', detail: 'Annual fees listed don\'t include uniforms (₹10–20K), books (₹15–30K), school bus (₹60–80K/yr), activity fees, and one-time admission deposit (₹50K–2L).' },
              ].map(tip => (
                <div key={tip.title} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{tip.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{tip.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{tip.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Need to find housing near your shortlisted school?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Check the Rental & Housing Finder — neighbourhoods ranked by proximity to your school and NRI community.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/housing" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Find housing →</Link>
              <button onClick={restart} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>New search</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F5F0', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .schools-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .schools-grid { display:grid; grid-template-columns:minmax(280px,360px) minmax(0,1fr); gap:1.25rem; align-items:start; }
        .schools-sticky { position:sticky; top:96px; }
        .schools-stack { display:grid; gap:1rem; }
        .schools-option-grid { display:grid; gap:.8rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
        @media (max-width:980px){ .schools-grid{grid-template-columns:1fr;} .schools-sticky{position:static;} }
        @media (max-width:767px){ .schools-shell{padding:1rem .9rem 2rem;} .schools-option-grid{grid-template-columns:1fr !important;} .schools-question-label,.schools-progress-row{flex-direction:column !important; align-items:flex-start !important;} }
      `}</style>
      <div className="schools-shell"><div className="schools-grid"><div className="schools-sticky"><div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}><div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Schools Finder</span></div><h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '.9rem' }}>Find the right school <em style={{ fontStyle: 'italic', color: '#FF9933' }}>with confidence.</em></h1><p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions as the readiness check and we’ll build your school shortlist in one pass.</p></div><div style={{ padding: '1.25rem 1.4rem 1.4rem' }}><div style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B5E50', marginBottom: 8 }}><span>Assessment progress</span><span style={{ fontWeight: 700 }}>{progress}%</span></div><div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} /></div></div>{[{ title: 'What you’ll get', body: 'A ranked school shortlist with timing, fee, and transition-fit signals.' }, { title: 'Your progress', body: answered === STEPS.length ? 'Everything is filled in and ready for your schools report.' : `${answered} of ${STEPS.length} questions answered. ${STEPS.length - answered} left before you can generate your report.` }, { title: 'How to answer', body: 'Pick the options that best match your child and move timing. You can revise answers anytime before generating.' }].map((item) => <div key={item.title} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div></div>)}</div></div></div><div className="schools-stack"><div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: 11, fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>Schools Finder · Free · {STEPS.length} questions</span></div><h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>Find the right school for your child</h2><p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we’ll turn your answers into a clear schools shortlist and recommendation.</p></div>{STEPS.map((step, index) => <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div className="schools-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}><div><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div><h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3><p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p></div>{answers[step.key as keyof Inputs] ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}</div><div className="schools-option-grid">{step.opts.map(opt => { const sel = answers[step.key as keyof Inputs] === opt.k; return <button key={opt.k} type="button" onClick={() => setAnswer(step.key, opt.k)} style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div><div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div></div><div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} /></div></button> })}</div></div>)}{answered === STEPS.length ? <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My Schools Report →</button> : <div className="schools-progress-row" style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}><div style={{ fontSize: '1.25rem' }}>📋</div><div><div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {STEPS.length} questions to generate your report</div><div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{STEPS.length - answered} question{STEPS.length - answered !== 1 ? 's' : ''} remaining</div></div></div>}</div></div></div>
    </div>
  )
  return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>Schools Finder · Free · {STEPS.length} questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>Find the right school for your child</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Real schools with real fees, admissions timelines, and mid-year entry policies — matched to your child&apos;s grade and curriculum.</p>
      </div>
      <div style={{ padding: '0 2rem', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Question {currentStep + 1} of {STEPS.length}</span>
          <span style={{ fontSize: '12px', color: '#FF9933', fontWeight: 500 }}>{progress}% complete</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden', marginBottom: '2rem' }}>
          <div style={{ height: '100%', background: '#FF9933', borderRadius: '100px', width: progress + '%', transition: 'width 0.4s ease' }} />
        </div>
      </div>
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
            {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>← Back</button>}
          </div>
        </div>
      )}
    </div>
  )
}
