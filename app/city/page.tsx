'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Inputs = {
  familySize: string
  income: string
  jobSector: string
  schoolPref: string
  lifestyle: string
  budget: string
  priorities: string
  currentCity: string
  remoteWork: string
}

type CityScore = {
  name: string
  code: string
  totalScore: number
  costScore: number
  jobScore: number
  schoolScore: number
  lifestyleScore: number
  airScore: number
  nriScore: number
  monthlyCost: number
  costRange: string
  airQ: string
  traffic: string
  nriCommunity: string
  jobMarket: string
  schools: string
  topNeighbourhoods: { name: string; rent: string; why: string }[]
  pros: string[]
  cons: string[]
  bestFor: string
  verdict: string
}

const CITY_DATA: Record<string, Omit<CityScore, 'totalScore' | 'costScore' | 'jobScore' | 'schoolScore' | 'lifestyleScore' | 'airScore' | 'nriScore'>> = {
  hyd: {
    name: 'Hyderabad', code: 'hyd',
    monthlyCost: 180000, costRange: '₹1.6–2.2L/mo',
    airQ: 'Moderate', traffic: 'Moderate', nriCommunity: 'Very High', jobMarket: 'Excellent', schools: 'IB / IGCSE / CBSE / ICSE',
    topNeighbourhoods: [
      { name: 'Gachibowli', rent: '₹35–65K/mo', why: 'Tech hub, HITECH City proximity, international schools nearby' },
      { name: 'Jubilee Hills', rent: '₹45–85K/mo', why: 'Premium residential, upscale lifestyle, good connectivity' },
      { name: 'Kondapur', rent: '₹28–50K/mo', why: 'Value-for-money near tech corridor, growing NRI community' },
      { name: 'Banjara Hills', rent: '₹50–90K/mo', why: 'Established premium area, restaurants, malls, hospitals' },
    ],
    pros: ['Largest NRI returnee community in India', 'Lower cost vs Bangalore with similar job market', 'Gachibowli tech corridor rivals any US suburb', 'Excellent IB & IGCSE school options', 'No state income tax in Telangana', 'Good connectivity — 45 mins max commute in Gachibowli'],
    cons: ['Summers are harsh (April–June, 42°C+)', 'Air quality moderate, not great', 'Traffic on ORR can be heavy', 'City infrastructure still developing in outer zones'],
    bestFor: 'Tech professionals, families with kids, FAANG returnees',
    verdict: 'Best all-round city for most NRI profiles — job market, community, schools, and cost all score highly.',
  },
  blr: {
    name: 'Bangalore', code: 'blr',
    monthlyCost: 240000, costRange: '₹2.2–3.2L/mo',
    airQ: 'Moderate', traffic: 'Heavy', nriCommunity: 'Very High', jobMarket: 'Excellent', schools: 'IB / IGCSE / CBSE',
    topNeighbourhoods: [
      { name: 'Whitefield', rent: '₹40–75K/mo', why: 'IT hub, international schools, expat community, cleaner air' },
      { name: 'Indiranagar', rent: '₹55–95K/mo', why: 'Vibrant social life, walkable, great restaurants and cafés' },
      { name: 'Koramangala', rent: '₹50–90K/mo', why: 'Startup ecosystem, young crowd, food scene, good hospitals' },
      { name: 'HSR Layout', rent: '₹40–70K/mo', why: 'Planned layout, tech crowd, family-friendly, Sarjapur Road access' },
    ],
    pros: ['Best startup ecosystem in India — best for founders', 'Pleasant climate year-round (22–28°C typically)', 'Cosmopolitan culture — easiest culture shock adjustment', 'World-class international schools', 'Vibrant social and food scene'],
    cons: ['Most expensive city on this list', 'Traffic is genuinely terrible — 2hr commutes common', 'Water scarcity is a real issue', 'Higher cost of living than other cities', 'Rain flooding issues in some areas'],
    bestFor: 'Startup founders, product managers, remote workers who want social life',
    verdict: 'Best city for lifestyle and startup culture but the traffic and cost are real downsides.',
  },
  pun: {
    name: 'Pune', code: 'pun',
    monthlyCost: 160000, costRange: '₹1.4–2.0L/mo',
    airQ: 'Good', traffic: 'Moderate', nriCommunity: 'High', jobMarket: 'Very Good', schools: 'IB / IGCSE / CBSE',
    topNeighbourhoods: [
      { name: 'Koregaon Park', rent: '₹45–80K/mo', why: 'Upscale, green, expat-friendly, great restaurants' },
      { name: 'Baner', rent: '₹30–55K/mo', why: 'Modern, tech proximity, family-friendly, new construction' },
      { name: 'Viman Nagar', rent: '₹35–60K/mo', why: 'Near airport, good schools, malls, quiet residential' },
      { name: 'Hinjewadi', rent: '₹25–45K/mo', why: 'IT park proximity, affordable, growing infrastructure' },
    ],
    pros: ['Best quality of life among all metros', 'Lower cost than Mumbai / Bangalore', 'Good air quality', 'Pleasant climate — no extreme heat or cold', 'Strong education ecosystem', 'Manageable traffic vs Bangalore/Mumbai'],
    cons: ['Smaller job market than Bangalore/Hyderabad', 'Smaller NRI community than Hyd/Blr', 'Some areas lack infrastructure', 'Limited metro connectivity'],
    bestFor: 'Families prioritising quality of life, remote workers, education-focused families',
    verdict: 'Underrated city for NRIs — best quality of life per rupee spent.',
  },
  che: {
    name: 'Chennai', code: 'che',
    monthlyCost: 170000, costRange: '₹1.4–2.2L/mo',
    airQ: 'Moderate', traffic: 'Moderate', nriCommunity: 'High', jobMarket: 'Good', schools: 'IB / ICSE / CBSE',
    topNeighbourhoods: [
      { name: 'Adyar', rent: '₹35–65K/mo', why: 'Premium residential, top schools nearby, beach access' },
      { name: 'Nungambakkam', rent: '₹45–80K/mo', why: 'Central, upscale, restaurants, good hospitals' },
      { name: 'OMR (Old Mahabalipuram Road)', rent: '₹25–45K/mo', why: 'IT corridor, modern apartments, good for tech professionals' },
      { name: 'Boat Club', rent: '₹55–100K/mo', why: 'Most premium area, affluent community, top schools' },
    ],
    pros: ['Strong Tamil NRI returnee community', 'Great for Tamil families — cultural fit', 'Good healthcare — Apollo, Fortis, CMC Vellore nearby', 'Strong automotive and manufacturing sector', 'Relatively affordable vs Bangalore'],
    cons: ['Hot and humid climate — takes adjustment', 'Language barrier for non-Tamil speakers', 'Smaller cosmopolitan expat scene', 'Traffic congestion in peak hours'],
    bestFor: 'Tamil NRIs, manufacturing/auto sector, healthcare professionals',
    verdict: 'Perfect for Tamil NRIs — strong cultural connection with good infrastructure.',
  },
  mum: {
    name: 'Mumbai', code: 'mum',
    monthlyCost: 280000, costRange: '₹2.5–4.0L/mo',
    airQ: 'Poor', traffic: 'Very Heavy', nriCommunity: 'High', jobMarket: 'Excellent', schools: 'IB / IGCSE / CBSE',
    topNeighbourhoods: [
      { name: 'Bandra West', rent: '₹80–150K/mo', why: 'Most cosmopolitan area, celebrities, restaurants, sea link access' },
      { name: 'Powai', rent: '₹55–95K/mo', why: 'Tech hub, IIT Bombay campus, lake view, Hiranandani township' },
      { name: 'Worli', rent: '₹75–140K/mo', why: 'Sea view, premium, Bandra-Worli sea link, new metro' },
      { name: 'Navi Mumbai', rent: '₹30–55K/mo', why: 'Planned city, affordable, improving connectivity, new airport' },
    ],
    pros: ['India\'s financial capital — best for finance, media, entertainment', 'Unmatched social and nightlife scene', 'Best international connectivity', 'Marine drive, sea views — unique lifestyle', 'DTAA treaty advantage for finance professionals'],
    cons: ['Most expensive city by far', 'Air quality is poor (especially Oct–Feb)', 'Traffic is brutal — 3hr commutes possible', 'Space is premium — smaller homes for same rent', 'Monsoon flooding every year'],
    bestFor: 'Finance professionals, media/entertainment, those who want maximum urban energy',
    verdict: 'Best city for finance careers and urban lifestyle but prepare for high costs and commutes.',
  },
}

const STEPS = [
  { key: 'familySize', section: 'Your Profile', q: 'Who is making the move?', hint: 'Affects neighbourhood recommendations and school requirements', opts: [{ k: 'solo', label: 'Just me', sub: 'Single move' }, { k: 'couple', label: 'Me & spouse', sub: 'No kids' }, { k: 'family_young', label: 'Family with young kids', sub: 'Under 12 years' }, { k: 'family_teen', label: 'Family with teenagers', sub: '13+ years' }, { k: 'with_parents', label: 'With elderly parents', sub: 'Healthcare priority' }] },
  { key: 'income', section: 'Your Profile', q: 'What is your monthly income after move?', hint: 'Used to calculate your cost comfort level in each city', opts: [{ k: 'h200', label: 'Over ₹8L/mo', sub: 'US remote or senior India role' }, { k: 'm150', label: '₹4–8L/mo', sub: 'Senior India role or mid-remote' }, { k: 'm75', label: '₹2–4L/mo', sub: 'Mid-level India role' }, { k: 'l50', label: 'Under ₹2L/mo', sub: 'Early career or sabbatical' }] },
  { key: 'jobSector', section: 'Your Profile', q: 'What is your job sector?', hint: 'Different cities have stronger job markets for different sectors', opts: [{ k: 'tech', label: 'Technology / Software', sub: 'FAANG, product, engineering' }, { k: 'finance', label: 'Finance / Banking', sub: 'Investment, fintech, banking' }, { k: 'startup', label: 'Startup / Founding', sub: 'Building a company' }, { k: 'remote', label: 'Remote — keeping US job', sub: 'Location independent' }, { k: 'consulting', label: 'Consulting / Freelance', sub: 'Independent work' }, { k: 'other', label: 'Other sector', sub: 'Healthcare, education, etc.' }] },
  { key: 'schoolPref', section: 'Family Needs', q: 'What school curriculum do you prefer?', hint: 'Curriculum availability varies significantly by city', opts: [{ k: 'ib', label: 'IB (International Baccalaureate)', sub: 'Best for future international mobility' }, { k: 'igcse', label: 'IGCSE / Cambridge', sub: 'UK-aligned, widely accepted' }, { k: 'cbse', label: 'CBSE', sub: 'National board, most options' }, { k: 'icse', label: 'ICSE', sub: 'Strong academics, widely respected' }, { k: 'no_kids', label: 'No school needed', sub: 'No children or adults only' }] },
  { key: 'lifestyle', section: 'Lifestyle Priorities', q: 'What matters most to your lifestyle?', hint: 'We\'ll weight cities accordingly', opts: [{ k: 'social', label: 'Vibrant social life', sub: 'Restaurants, bars, events, nightlife' }, { k: 'nature', label: 'Green spaces & outdoors', sub: 'Parks, clean air, weekend getaways' }, { k: 'family', label: 'Family-friendly & safe', sub: 'Parks, schools, community, safety' }, { k: 'culture', label: 'Arts, culture & food', sub: 'Concerts, museums, food scene' }, { k: 'professional', label: 'Professional networking', sub: 'Industry events, co-working, meetups' }] },
  { key: 'budget', section: 'Lifestyle Priorities', q: 'What is your monthly housing budget?', hint: 'Rent is typically 30–40% of total monthly spend', opts: [{ k: 'luxury', label: '₹80,000+/mo', sub: 'Premium / luxury apartments' }, { k: 'premium', label: '₹50,000–₹80,000/mo', sub: 'Good quality residential' }, { k: 'mid', label: '₹30,000–₹50,000/mo', sub: 'Comfortable mid-range' }, { k: 'budget', label: 'Under ₹30,000/mo', sub: 'Value-focused' }] },
  { key: 'priorities', section: 'Lifestyle Priorities', q: 'What is your biggest concern about moving?', hint: 'We\'ll flag cities that address this best', opts: [{ k: 'air', label: 'Air quality & pollution', sub: 'Health-conscious priority' }, { k: 'commute', label: 'Commute & traffic', sub: 'Time is more valuable than money' }, { k: 'cost', label: 'Cost of living', sub: 'Maximising financial runway' }, { k: 'community', label: 'NRI community & social fit', sub: 'Finding your tribe' }, { k: 'school_quality', label: 'School quality', sub: 'Children\'s education first' }] },
  { key: 'remoteWork', section: 'Work Setup', q: 'Are you working remotely from India?', hint: 'Remote workers have maximum city flexibility', opts: [{ k: 'yes', label: 'Yes — fully remote', sub: 'Can live anywhere' }, { k: 'hybrid', label: 'Hybrid — some office days', sub: 'Need to be near an office hub' }, { k: 'full_office', label: 'Full-time India office', sub: 'Need proximity to employer' }, { k: 'own_business', label: 'Running own business', sub: 'Need good infrastructure' }] },
]

function scoreCities(I: Inputs): CityScore[] {
  return Object.values(CITY_DATA).map(city => {
    let cost = 0, job = 0, school = 0, lifestyle = 0, air = 0, nri = 0

    // Cost score (higher = more affordable)
    const budgetMap: Record<string, number> = { luxury: 300000, premium: 180000, mid: 120000, budget: 80000 }
    const budgetINR = budgetMap[I.budget] || 180000
    const affordability = budgetINR / city.monthlyCost
    cost = Math.min(100, Math.round(affordability * 60))

    // Job score
    const jobScoreMap: Record<string, Record<string, number>> = {
      tech: { hyd: 95, blr: 98, pun: 82, che: 75, mum: 80 },
      finance: { hyd: 70, blr: 75, pun: 70, che: 72, mum: 98 },
      startup: { hyd: 75, blr: 98, pun: 80, che: 68, mum: 85 },
      remote: { hyd: 88, blr: 88, pun: 90, che: 85, mum: 82 },
      consulting: { hyd: 82, blr: 88, pun: 80, che: 78, mum: 92 },
      other: { hyd: 78, blr: 82, pun: 78, che: 75, mum: 85 },
    }
    job = jobScoreMap[I.jobSector]?.[city.code] || 80

    // School score
    const schoolScoreMap: Record<string, Record<string, number>> = {
      ib: { hyd: 90, blr: 92, pun: 85, che: 78, mum: 88 },
      igcse: { hyd: 88, blr: 90, pun: 82, che: 80, mum: 86 },
      cbse: { hyd: 95, blr: 95, pun: 95, che: 95, mum: 95 },
      icse: { hyd: 85, blr: 88, pun: 85, che: 90, mum: 88 },
      no_kids: { hyd: 85, blr: 85, pun: 85, che: 85, mum: 85 },
    }
    school = schoolScoreMap[I.schoolPref]?.[city.code] || 85

    // Lifestyle score
    const lifestyleScoreMap: Record<string, Record<string, number>> = {
      social: { hyd: 82, blr: 95, pun: 85, che: 75, mum: 98 },
      nature: { hyd: 78, blr: 82, pun: 90, che: 78, mum: 60 },
      family: { hyd: 90, blr: 82, pun: 92, che: 88, mum: 72 },
      culture: { hyd: 88, blr: 85, pun: 80, che: 90, mum: 95 },
      professional: { hyd: 85, blr: 95, pun: 82, che: 78, mum: 92 },
    }
    lifestyle = lifestyleScoreMap[I.lifestyle]?.[city.code] || 82

    // Air quality score
    const airMap: Record<string, number> = { Good: 95, Moderate: 70, Poor: 40 }
    air = airMap[city.airQ] || 70

    // NRI community score
    const nriMap: Record<string, number> = { 'Very High': 95, High: 80, Moderate: 60, Low: 40 }
    nri = nriMap[city.nriCommunity] || 70

    // Adjust for priority concern
    let priorityBoost = 0
    if (I.priorities === 'air' && city.airQ === 'Good') priorityBoost = 10
    if (I.priorities === 'commute' && city.traffic === 'Low') priorityBoost = 10
    if (I.priorities === 'cost' && city.monthlyCost < 200000) priorityBoost = 10
    if (I.priorities === 'community' && city.nriCommunity === 'Very High') priorityBoost = 10
    if (I.priorities === 'school_quality' && school >= 90) priorityBoost = 8

    const total = Math.min(100, Math.round(
      (cost * 0.2) + (job * 0.25) + (school * 0.2) + (lifestyle * 0.15) + (air * 0.1) + (nri * 0.1) + priorityBoost
    ))

    return { ...city, totalScore: total, costScore: cost, jobScore: job, schoolScore: school, lifestyleScore: lifestyle, airScore: air, nriScore: nri }
  }).sort((a, b) => b.totalScore - a.totalScore)
}

export default function CityMatch() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CityScore[] | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const step = STEPS[currentStep]
  const answered = STEPS.filter((s) => !!answers[s.key as keyof Inputs]).length
  const progress = Math.round((answered / STEPS.length) * 100)
  const sectionColors: Record<string, string> = { 'Your Profile': '#FF9933', 'Family Needs': '#7C5CBF', 'Lifestyle Priorities': '#138808', 'Work Setup': '#000080' }
  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => { setResult(scoreCities(answers as Inputs)); setLoading(false) }, 1400)
  }

  function pick(key: string, val: string) {
    setAnswer(key, val)
  }

  function restart() { setAnswers({}); setCurrentStep(0); setResult(null); setLoading(false); setSelectedCity(null) }

  const incomeLabel: Record<string, string> = { h200: '₹8L+/mo', m150: '₹4–8L/mo', m75: '₹2–4L/mo', l50: '<₹2L/mo' }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Matching you to cities...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Scoring 5 cities across 6 dimensions for your profile</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (result) {
    const top = result[0]
    const detail = selectedCity ? result.find(c => c.code === selectedCity) || top : top
    const incomeINR = { h200: 800000, m150: 600000, m75: 300000, l50: 150000 }[answers.income || 'h200'] || 600000

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>City Match Report</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              {top.name} is your best match
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>{top.verdict}</p>
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>

          {/* CITY RANKING */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Your City Rankings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.map((city, i) => (
                <div key={city.code} onClick={() => setSelectedCity(city.code)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '14px 16px', background: selectedCity === city.code || (!selectedCity && i === 0) ? 'rgba(255,153,51,0.06)' : 'var(--india-white)', border: `0.5px solid ${selectedCity === city.code || (!selectedCity && i === 0) ? 'rgba(255,153,51,0.3)' : 'var(--border)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i === 0 ? '#FF9933' : i === 1 ? '#138808' : 'var(--india-white)', color: i < 2 ? '#fff' : 'var(--ink-soft)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{city.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>{city.bestFor}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {[{ label: 'Cost', val: city.costRange }, { label: 'AQI', val: city.airQ }, { label: 'NRI', val: city.nriCommunity.replace('Very High', 'V.High') }].map(tag => (
                      <span key={tag.label} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '100px', background: 'var(--white)', border: '0.5px solid var(--border)', color: 'var(--ink-soft)' }}>{tag.label}: {tag.val}</span>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '60px' }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: i === 0 ? '#FF9933' : 'var(--ink)' }}>{city.totalScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>match</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '0.75rem' }}>👆 Click any city to see its detailed breakdown below</div>
          </div>

          {/* DETAILED CITY VIEW */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: 'var(--ink)', flex: 1 }}>{detail.name} — Detailed Breakdown</h2>
              <div style={{ background: '#FFF3E6', color: '#FF9933', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '100px' }}>{detail.totalScore}/100 match</div>
            </div>

            {/* Score bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Job Market', score: detail.jobScore, color: '#138808' },
                { label: 'Schools', score: detail.schoolScore, color: '#7C5CBF' },
                { label: 'Lifestyle', score: detail.lifestyleScore, color: '#FF9933' },
                { label: 'Air Quality', score: detail.airScore, color: '#000080' },
                { label: 'NRI Community', score: detail.nriScore, color: '#1D9E75' },
                { label: 'Affordability', score: detail.costScore, color: '#D4695A' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.score}</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: s.color, borderRadius: '100px', width: s.score + '%' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Cost snapshot */}
            <div style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
              <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Monthly Cost</div><div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: 'var(--ink)' }}>{detail.costRange}</div></div>
              <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Your Income</div><div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#138808' }}>{incomeLabel[answers.income || 'h200']}</div></div>
              <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Monthly Savings</div><div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem', color: '#FF9933' }}>₹{Math.max(0, Math.round((incomeINR - detail.monthlyCost) / 1000))}K/mo</div></div>
            </div>

            {/* Neighbourhoods */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.75rem' }}>Best Neighbourhoods for NRIs</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                {detail.topNeighbourhoods.map(n => (
                  <div key={n.name} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '12px 14px', border: '0.5px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{n.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933' }}>{n.rent}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>{n.why}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros / Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#138808', marginBottom: '8px' }}>✓ Why {detail.name} works</div>
                {detail.pros.map((p, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #E8F5E8' }}>{p}</div>)}
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#E24B4A', marginBottom: '8px' }}>✗ What to watch out for</div>
                {detail.cons.map((c, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '5px', paddingLeft: '12px', borderLeft: '2px solid #FCEBEB' }}>{c}</div>)}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Ready to find your school and neighbourhood in {top.name}?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Check the Schools Comparison Tool and Rental & Housing Finder next.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/schools" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Find schools →</Link>
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
        .city-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .city-grid { display:grid; grid-template-columns:minmax(280px,360px) minmax(0,1fr); gap:1.25rem; align-items:start; }
        .city-sticky { position:sticky; top:96px; }
        .city-stack { display:grid; gap:1rem; }
        .city-option-grid { display:grid; gap:.8rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
        @media (max-width:980px){ .city-grid{grid-template-columns:1fr;} .city-sticky{position:static;} }
        @media (max-width:767px){ .city-shell{padding:1rem .9rem 2rem;} .city-option-grid{grid-template-columns:1fr !important;} .city-question-label,.city-progress-row{flex-direction:column !important; align-items:flex-start !important;} }
      `}</style>
      <div className="city-shell">
        <div className="city-grid">
          <div className="city-sticky">
            <div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>City Match</span></div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '.9rem' }}>Find your best-fit <em style={{ fontStyle: 'italic', color: '#FF9933' }}>landing city.</em></h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions as the readiness check and we’ll score the major Indian cities for your profile.</p>
              </div>
              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B5E50', marginBottom: 8 }}><span>Assessment progress</span><span style={{ fontWeight: 700 }}>{progress}%</span></div><div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} /></div></div>
                {[{ title: 'What you’ll get', body: 'A ranked city list, neighbourhood signals, and cost-of-living fit.' }, { title: 'Your progress', body: answered === STEPS.length ? 'Everything is filled in and ready for your city match report.' : `${answered} of ${STEPS.length} questions answered. ${STEPS.length - answered} left before you can generate your report.` }, { title: 'How to answer', body: 'Pick the option that best reflects your move plan. You can change answers anytime before generating the report.' }].map((item) => <div key={item.title} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div></div>)}
              </div>
            </div>
          </div>
          <div className="city-stack">
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: 11, fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>City Match Tool · Free · {STEPS.length} questions</span></div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>Which Indian city is right for you?</h2>
              <p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we’ll turn your answers into a clear city ranking and recommendation.</p>
            </div>
            {STEPS.map((step, index) => (
              <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
                <div className="city-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3>
                    <p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p>
                  </div>
                  {answers[step.key as keyof Inputs] ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}
                </div>
                <div className="city-option-grid">
                  {step.opts.map(opt => {
                    const sel = answers[step.key as keyof Inputs] === opt.k
                    return (
                      <button key={opt.k} type="button" onClick={() => setAnswer(step.key, opt.k)} style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div><div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div><div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div></div>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {answered === STEPS.length ? (
              <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My City Match →</button>
            ) : (
              <div className="city-progress-row" style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}><div style={{ fontSize: '1.25rem' }}>📋</div><div><div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {STEPS.length} questions to generate your report</div><div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{STEPS.length - answered} question{STEPS.length - answered !== 1 ? 's' : ''} remaining</div></div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>City Match Tool · Free · {STEPS.length} questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>Which Indian city is right for you?</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Score 5 cities across jobs, schools, lifestyle, air quality, and NRI community — personalised to your profile.</p>
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
