'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Inputs = {
  city: string
  familySize: string
  ages: string
  preExisting: string
  budget: string
  priorities: string
  usCoverage: string
  employer: string
}

type Hospital = {
  name: string
  city: string
  type: string
  jciAccredited: boolean
  specialties: string[]
  usStandards: boolean
  emergencyRating: number
  rating: number
  area: string
  contact: string
  note: string
}

type InsurancePlan = {
  provider: string
  plan: string
  coverageINR: string
  annualPremiumFamily: string
  premiumINR: number
  nriSpecific: boolean
  preExistingWaiting: string
  usCoordination: boolean
  cashless: string
  highlights: string[]
  bestFor: string
}

const HOSPITALS: Hospital[] = [
  { name: 'Apollo Hospitals', city: 'hyd', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Oncology', 'Neurology', 'Orthopedics', 'Transplant'], usStandards: true, emergencyRating: 95, rating: 92, area: 'Jubilee Hills', contact: '+91 40 2360 7777', note: 'Flagship Hyderabad — international patient desk, medical records transfer from US facilitated' },
  { name: 'KIMS Hospital', city: 'hyd', type: 'Multi-specialty', jciAccredited: false, specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'], usStandards: true, emergencyRating: 90, rating: 88, area: 'Secunderabad', contact: '+91 40 4488 5000', note: 'Best emergency care in Hyderabad — 24/7 Level 1 trauma center' },
  { name: 'Yashoda Hospitals', city: 'hyd', type: 'Multi-specialty', jciAccredited: false, specialties: ['Cardiology', 'Gastroenterology', 'Orthopedics'], usStandards: true, emergencyRating: 88, rating: 85, area: 'Secunderabad / Malakpet', contact: '+91 40 4567 4567', note: 'Strong cardiac program, affordable vs Apollo' },
  { name: 'Manipal Hospital', city: 'blr', type: 'Multi-specialty', jciAccredited: true, specialties: ['Oncology', 'Transplant', 'Cardiology', 'Neurosciences'], usStandards: true, emergencyRating: 92, rating: 90, area: 'HAL Old Airport Road', contact: '+91 80 2502 4444', note: 'JCI accredited — closest to US hospital standards in Bangalore. International patient services.' },
  { name: 'Fortis Hospital', city: 'blr', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Orthopedics', 'Oncology', 'Neurology'], usStandards: true, emergencyRating: 90, rating: 88, area: 'Cunningham Road / Bannerghatta', contact: '+91 80 6621 4444', note: 'Good for chronic condition management. US health records accepted.' },
  { name: 'Ruby Hall Clinic', city: 'pun', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology'], usStandards: true, emergencyRating: 88, rating: 87, area: 'Sassoon Road', contact: '+91 20 6645 5000', note: 'Best hospital in Pune — JCI accredited, international patient desk' },
  { name: 'Jehangir Hospital', city: 'pun', type: 'Multi-specialty', jciAccredited: false, specialties: ['General medicine', 'Orthopedics', 'Cardiology'], usStandards: true, emergencyRating: 82, rating: 83, area: 'Sassoon Road', contact: '+91 20 6681 5000', note: 'Oldest and most trusted hospital in Pune — good for general care' },
  { name: 'Apollo Hospitals', city: 'che', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Oncology', 'Transplant', 'Neurology'], usStandards: true, emergencyRating: 96, rating: 94, area: 'Greams Road', contact: '+91 44 2829 3333', note: 'Top hospital in South India — globally ranked. Medical tourism hub. Excellent for complex cases.' },
  { name: 'Fortis Malar Hospital', city: 'che', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Neurology', 'Orthopedics'], usStandards: true, emergencyRating: 88, rating: 87, area: 'Adyar', contact: '+91 44 4289 2222', note: 'JCI accredited — good for NRI families in Adyar area' },
  { name: 'Lilavati Hospital', city: 'mum', type: 'Multi-specialty', jciAccredited: true, specialties: ['Cardiology', 'Oncology', 'Transplant', 'Neurology'], usStandards: true, emergencyRating: 93, rating: 91, area: 'Bandra West', contact: '+91 22 2675 1000', note: 'Celebrity hospital — best for Bandra residents. International patient services excellent.' },
  { name: 'Kokilaben Dhirubhai Ambani', city: 'mum', type: 'Multi-specialty', jciAccredited: true, specialties: ['Oncology', 'Cardiology', 'Transplant', 'Neurology'], usStandards: true, emergencyRating: 94, rating: 93, area: 'Andheri West', contact: '+91 22 3066 0000', note: 'Best overall Mumbai hospital — JCI accredited, world-class facilities, international patient desk' },
]

const INSURANCE_PLANS: InsurancePlan[] = [
  { provider: 'Niva Bupa (formerly Max Bupa)', plan: 'ReAssure 2.0 Platinum', coverageINR: '₹1 Crore', annualPremiumFamily: '₹35,000–₹65,000/yr', premiumINR: 50000, nriSpecific: false, preExistingWaiting: '2 years', usCoordination: false, cashless: '8,500+ hospitals', highlights: ['Unlimited restoration of sum insured', 'No room rent capping', 'Global cover add-on available', 'Pre-existing covered after 2 years'], bestFor: 'Families needing comprehensive domestic coverage — best value' },
  { provider: 'Star Health Insurance', plan: 'Comprehensive', coverageINR: '₹50L–₹1 Crore', annualPremiumFamily: '₹28,000–₹55,000/yr', premiumINR: 40000, nriSpecific: false, preExistingWaiting: '3 years', usCoordination: false, cashless: '14,000+ hospitals', highlights: ['Widest cashless network in India', 'Maternity benefit', 'OPD coverage', 'Mental health coverage'], bestFor: 'Families wanting widest hospital network coverage' },
  { provider: 'Care Health (formerly Religare)', plan: 'Care Supreme', coverageINR: '₹75L–₹2 Crore', annualPremiumFamily: '₹40,000–₹75,000/yr', premiumINR: 57000, nriSpecific: false, preExistingWaiting: '2 years', usCoordination: true, cashless: '9,400+ hospitals', highlights: ['Unlimited recharge of cover', 'International cover option', 'Annual health check included', 'No copay'], bestFor: 'Families wanting high coverage with international travel cover' },
  { provider: 'Cigna TTK / Cigna Global', plan: 'Global Health Select', coverageINR: '$1M–$5M USD globally', annualPremiumFamily: '$2,000–$5,000/yr', premiumINR: 330000, nriSpecific: true, preExistingWaiting: '0–6 months', usCoordination: true, cashless: 'Global network incl. USA', highlights: ['Covers in USA and India both', 'No India residency required', 'Medical evacuation included', 'Works as US insurance bridge', 'OCI / NRI specific plans'], bestFor: 'NRIs who travel to US frequently or need US coverage continuity' },
  { provider: 'AXA Global Healthcare', plan: 'Essential Plan', coverageINR: '$1M USD globally', annualPremiumFamily: '$1,800–$3,500/yr', premiumINR: 245000, nriSpecific: true, preExistingWaiting: '3–6 months', usCoordination: true, cashless: 'Global network', highlights: ['Global coverage including USA', 'NRI/expat specialist', '24/7 medical helpline', 'Medical records management'], bestFor: 'First year returnees still visiting USA regularly' },
  { provider: 'HDFC Ergo', plan: 'Optima Secure', coverageINR: '₹1 Crore', annualPremiumFamily: '₹32,000–₹60,000/yr', premiumINR: 46000, nriSpecific: false, preExistingWaiting: '3 years', usCoordination: false, cashless: '10,000+ hospitals', highlights: ['Multiplier benefit (doubles cover after 2 years)', 'Restore benefit', 'Safe discount 10%', 'Good value large network'], bestFor: 'Budget-conscious families wanting strong domestic coverage' },
]

const STEPS = [
  { key: 'city', section: 'Your Profile', q: 'Which city are you moving to?', hint: 'We\'ll show hospitals and networks in that city', opts: [{ k: 'hyd', label: 'Hyderabad', sub: '' }, { k: 'blr', label: 'Bangalore', sub: '' }, { k: 'pun', label: 'Pune', sub: '' }, { k: 'che', label: 'Chennai', sub: '' }, { k: 'mum', label: 'Mumbai', sub: '' }] },
  { key: 'familySize', section: 'Your Profile', q: 'Who needs to be covered?', hint: 'Affects premium calculation significantly', opts: [{ k: 'self', label: 'Just me', sub: 'Individual plan' }, { k: 'couple', label: 'Me & spouse', sub: 'Couple plan' }, { k: 'family', label: 'Family (spouse + kids)', sub: 'Family floater' }, { k: 'family_parents', label: 'Family + elderly parents', sub: 'Separate senior plan needed' }] },
  { key: 'ages', section: 'Your Profile', q: 'What is the age range of the oldest insured person?', hint: 'Age is the biggest factor in health insurance premiums', opts: [{ k: 'under35', label: 'Under 35 years', sub: 'Low premium bracket' }, { k: '35to45', label: '35–45 years', sub: 'Standard premium' }, { k: '45to55', label: '45–55 years', sub: 'Higher premium — earlier the better' }, { k: '55plus', label: '55+ years', sub: 'Senior plan recommended' }] },
  { key: 'preExisting', section: 'Your Profile', q: 'Do you have any pre-existing conditions?', hint: 'Pre-existing conditions affect waiting periods and plan eligibility', opts: [{ k: 'none', label: 'No pre-existing conditions', sub: 'All plans available' }, { k: 'controlled', label: 'Yes — controlled (diabetes, BP)', sub: '2–3 year waiting period typically' }, { k: 'serious', label: 'Yes — serious (heart, cancer history)', sub: 'Limited plans — need specialist advice' }, { k: 'unsure', label: 'Unsure — need guidance', sub: 'Will assess during application' }] },
  { key: 'usCoverage', section: 'US Coverage Gap', q: 'When does your US health insurance end?', hint: 'The gap between US coverage ending and India coverage starting is your highest risk period', opts: [{ k: 'active', label: 'Still active — I\'m covered in US', sub: 'Plan India coverage to overlap' }, { k: 'ending_soon', label: 'Ending within 3 months', sub: 'Urgent — get India plan immediately' }, { k: 'cobra', label: 'On COBRA — extending US coverage', sub: 'COBRA can last 18 months post-employment' }, { k: 'already_ended', label: 'Already ended', sub: 'Get India plan today — no gap allowed' }] },
  { key: 'employer', section: 'US Coverage Gap', q: 'Will you have employer health insurance in India?', hint: 'Indian employer group plans are basic — you\'ll likely need top-up coverage', opts: [{ k: 'yes_good', label: 'Yes — India employer covers me', sub: 'Check the policy limits — usually ₹3–5L only' }, { k: 'yes_remote', label: 'Keeping US remote job', sub: 'US employer may cover globally — verify' }, { k: 'no', label: 'No employer coverage', sub: 'Need individual/family plan' }, { k: 'self_employed', label: 'Self-employed / founder', sub: 'Need complete individual coverage' }] },
  { key: 'budget', section: 'Insurance', q: 'What is your annual health insurance budget?', hint: 'Recommended: 3–5% of annual income for family health insurance', opts: [{ k: 'premium', label: '₹60,000+/yr', sub: 'Global coverage possible' }, { k: 'mid', label: '₹30,000–₹60,000/yr', sub: 'Strong domestic coverage' }, { k: 'value', label: 'Under ₹30,000/yr', sub: 'Essential coverage' }, { k: 'open', label: 'Budget is open — best coverage', sub: 'Prioritise coverage over cost' }] },
  { key: 'priorities', section: 'Insurance', q: 'What matters most in a health plan?', hint: 'We\'ll rank plans that score highest on your priority', opts: [{ k: 'global', label: 'Global coverage including USA', sub: 'Still travel to US or have US family' }, { k: 'network', label: 'Widest hospital network', sub: 'Cashless in most hospitals' }, { k: 'high_cover', label: 'Highest coverage amount', sub: 'Worried about serious illness cost' }, { k: 'pre_existing', label: 'Pre-existing condition coverage', sub: 'Needs covered despite conditions' }, { k: 'value', label: 'Best value for premium paid', sub: 'Maximum coverage per rupee' }] },
]

export default function HealthcareGuide() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ hospitals: Hospital[]; plans: InsurancePlan[]; coverageGap: string; urgency: string } | null>(null)

  const step = STEPS[currentStep]
  const answered = STEPS.filter((s) => !!answers[s.key as keyof Inputs]).length
  const progress = Math.round((answered / STEPS.length) * 100)
  const sectionColors: Record<string, string> = { 'Your Profile': '#FF9933', 'US Coverage Gap': '#E24B4A', 'Insurance': '#138808' }
  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => { setResult(compute(answers as Inputs)); setLoading(false) }, 1400)
  }

  function pick(key: string, val: string) {
    setAnswer(key, val)
  }

  function compute(I: Inputs) {
    const hospitals = HOSPITALS.filter(h => h.city === I.city).sort((a, b) => b.rating - a.rating)

    const plans = INSURANCE_PLANS.filter(p => {
      if (I.priorities === 'global' && !p.usCoordination) return false
      if (I.budget === 'value' && p.premiumINR > 60000) return false
      if (I.budget === 'mid' && p.premiumINR > 80000) return false
      return true
    }).sort((a, b) => {
      let scoreA = 50, scoreB = 50
      if (I.priorities === 'global') { if (a.nriSpecific) scoreA += 30; if (b.nriSpecific) scoreB += 30 }
      if (I.priorities === 'network') { if (a.cashless.includes('14,000')) scoreA += 20; if (b.cashless.includes('14,000')) scoreB += 20 }
      if (I.priorities === 'value') { scoreA -= a.premiumINR / 5000; scoreB -= b.premiumINR / 5000 }
      return scoreB - scoreA
    })

    const coverageGap = I.usCoverage === 'already_ended'
      ? 'CRITICAL: You have no coverage right now. Get a plan today.'
      : I.usCoverage === 'ending_soon'
      ? 'URGENT: Your US coverage ends in 3 months. Buy India plan this week to ensure overlap.'
      : I.usCoverage === 'cobra'
      ? 'You have COBRA — but it\'s expensive. Get India plan before COBRA ends (max 18 months).'
      : 'You\'re covered now — but buy India plan at least 30 days before US coverage ends to ensure no gap.'

    const urgency = I.usCoverage === 'already_ended' ? 'critical' : I.usCoverage === 'ending_soon' ? 'high' : 'normal'

    return { hospitals, plans: plans.slice(0, 4), coverageGap, urgency }
  }

  function restart() { setAnswers({}); setCurrentStep(0); setResult(null); setLoading(false) }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Building your healthcare guide...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Matching hospitals and insurance plans to your profile</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (result) {
    const cityNames: Record<string, string> = { hyd: 'Hyderabad', blr: 'Bangalore', pun: 'Pune', che: 'Chennai', mum: 'Mumbai' }
    const cityName = cityNames[answers.city || 'hyd']
    const urgencyColors = { critical: { bg: '#FCEBEB', border: 'rgba(226,75,74,0.3)', text: '#791F1F', icon: '#E24B4A' }, high: { bg: '#FFF3E6', border: 'rgba(255,153,51,0.3)', text: '#633806', icon: '#FF9933' }, normal: { bg: '#E8F5E8', border: 'rgba(19,136,8,0.2)', text: '#27500A', icon: '#138808' } }
    const uc = urgencyColors[result.urgency as keyof typeof urgencyColors]

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <style>{`
          .health-report-shell {
            max-width: 960px;
            margin: 0 auto;
            padding: 2rem;
          }
          @media (max-width: 767px) {
            .health-report-shell {
              padding: 1rem .9rem 2rem;
            }
            .health-alert {
              flex-direction: column;
            }
            .health-hospital-head {
              flex-wrap: wrap;
            }
            .health-report-cta {
              grid-template-columns: 1fr !important;
              padding: 1.5rem !important;
            }
            .health-report-actions {
              width: 100%;
            }
            .health-report-actions > * {
              flex: 1 1 100%;
              justify-content: center;
            }
          }
        `}</style>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Healthcare & Insurance Guide — {cityName}</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>Your healthcare setup in {cityName}</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>Top hospitals, recommended insurance plans, and how to manage the gap between your US and India coverage.</p>
          </div>
        </div>

        <div className="health-report-shell">

          {/* COVERAGE GAP ALERT */}
          <div className="health-alert" style={{ background: uc.bg, border: `0.5px solid ${uc.border}`, borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: uc.icon, color: '#fff', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>!</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: uc.text, marginBottom: '3px' }}>US–India Coverage Gap</div>
              <div style={{ fontSize: '13px', color: uc.text, lineHeight: 1.6 }}>{result.coverageGap}</div>
            </div>
          </div>

          {/* TOP HOSPITALS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Top Hospitals in {cityName}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {result.hospitals.map((h, i) => (
                <div key={h.name} style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem', border: '0.5px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div className="health-hospital-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{h.name}</div>
                        {h.jciAccredited && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C' }}>JCI Accredited</span>}
                        {h.usStandards && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8F5E8', color: '#27500A' }}>US Standards</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '6px' }}>📍 {h.area} · {h.contact}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
                        {h.specialties.slice(0, 4).map(s => <span key={s} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: 'var(--white)', border: '0.5px solid var(--border)', color: 'var(--ink-muted)' }}>{s}</span>)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{h.note}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: i === 0 ? '#FF9933' : 'var(--ink)' }}>{h.rating}</div>
                      <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>/ 100</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INSURANCE PLANS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Recommended Insurance Plans</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.plans.map((plan, i) => (
                <div key={plan.plan} style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem', border: `0.5px solid ${i === 0 ? 'rgba(255,153,51,0.3)' : 'var(--border)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{plan.provider}</div>
                        <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>— {plan.plan}</div>
                        {plan.nriSpecific && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#FFF3E6', color: '#854F0B' }}>NRI Specific</span>}
                        {plan.usCoordination && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C' }}>US Coordination</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', marginBottom: '2px' }}>Coverage</div><div style={{ fontSize: '13px', fontWeight: 500, color: '#138808' }}>{plan.coverageINR}</div></div>
                        <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', marginBottom: '2px' }}>Annual Premium</div><div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{plan.annualPremiumFamily}</div></div>
                        <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', marginBottom: '2px' }}>Cashless Network</div><div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{plan.cashless}</div></div>
                        <div><div style={{ fontSize: '10px', color: 'var(--ink-soft)', marginBottom: '2px' }}>Pre-existing wait</div><div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{plan.preExistingWaiting}</div></div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
                        {plan.highlights.map(h => <span key={h} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: 'var(--white)', border: '0.5px solid var(--border)', color: 'var(--ink-muted)' }}>✓ {h}</span>)}
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#FF9933' }}>Best for: {plan.bestFor}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIPS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>NRI Healthcare Setup — What to Do First</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
              {[
                { icon: '📋', title: 'Transfer medical records from US', detail: 'Request your last 5 years of records from your US doctor. Ask for a medical summary in PDF. Bring original prescription bottles for ongoing medications. Indian hospitals accept US records.' },
                { icon: '💊', title: 'Bring 3-month medication supply', detail: 'Carry 90-day supply of all prescription medications from the US. Some medications (especially specialty drugs) take weeks to source in India. Get a letter from your US doctor for customs.' },
                { icon: '🦷', title: 'Dental — plan separately', detail: 'Most Indian health insurance excludes dental. Get a dental cleaning and any pending work done in the US before leaving — it\'s far cheaper on US insurance. India dental is good and affordable but plan it.' },
                { icon: '📞', title: 'Register with your hospital before emergency', detail: 'Register as a patient at your preferred hospital before you need emergency care. Get a patient ID card. This speeds up emergency admission and insurance cashless processing.' },
              ].map(tip => (
                <div key={tip.title} style={{ background: 'var(--india-white)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '6px' }}>{tip.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', marginBottom: '4px' }}>{tip.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>{tip.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="health-report-cta" style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Ready to explore life in your city?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Check the City Life Guide — where to eat, shop, and find your community in {cityName}.</div>
            </div>
            <div className="health-report-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/citylife" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>City life guide →</Link>
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
        .health-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .health-grid { display:grid; grid-template-columns:minmax(280px,360px) minmax(0,1fr); gap:1.25rem; align-items:start; }
        .health-sticky { position:sticky; top:96px; }
        .health-stack { display:grid; gap:1rem; }
        .health-option-grid { display:grid; gap:.8rem; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); }
        @media (max-width:980px){ .health-grid{grid-template-columns:1fr;} .health-sticky{position:static;} }
        @media (max-width:767px){ .health-shell{padding:1rem .9rem 2rem;} .health-option-grid{grid-template-columns:1fr !important;} .health-question-label,.health-progress-row{flex-direction:column !important; align-items:flex-start !important;} }
      `}</style>
      <div className="health-shell"><div className="health-grid"><div className="health-sticky"><div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}><div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Healthcare Guide</span></div><h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '.9rem' }}>Set up healthcare the <em style={{ fontStyle: 'italic', color: '#FF9933' }}>right way.</em></h1><p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions as the readiness check and we’ll build your hospital and insurance shortlist in one pass.</p></div><div style={{ padding: '1.25rem 1.4rem 1.4rem' }}><div style={{ marginBottom: 14 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B5E50', marginBottom: 8 }}><span>Assessment progress</span><span style={{ fontWeight: 700 }}>{progress}%</span></div><div style={{ height: 10, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}><div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)' }} /></div></div>{[{ title: 'What you’ll get', body: 'Hospital picks, insurance plan recommendations, and coverage-gap guidance.' }, { title: 'Your progress', body: answered === STEPS.length ? 'Everything is filled in and ready for your healthcare guide.' : `${answered} of ${STEPS.length} questions answered. ${STEPS.length - answered} left before you can generate your guide.` }, { title: 'How to answer', body: 'Choose the options that best match your family and coverage situation right now.' }].map((item) => <div key={item.title} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div></div>)}</div></div></div><div className="health-stack"><div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: 11, fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>Healthcare & Insurance Guide · Free · {STEPS.length} questions</span></div><h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>Set up healthcare in India the right way</h2><p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we’ll turn your answers into a clear healthcare and insurance plan.</p></div>{STEPS.map((step, index) => <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div className="health-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}><div><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div><h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3><p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p></div>{answers[step.key as keyof Inputs] ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}</div><div className="health-option-grid">{step.opts.map(opt => { const sel = answers[step.key as keyof Inputs] === opt.k; return <button key={opt.k} type="button" onClick={() => setAnswer(step.key, opt.k)} style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div>{opt.sub ? <div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div> : null}</div><div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} /></div></button> })}</div></div>)}{answered === STEPS.length ? <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My Healthcare Guide →</button> : <div className="health-progress-row" style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}><div style={{ fontSize: '1.25rem' }}>📋</div><div><div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {STEPS.length} questions to generate your guide</div><div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{STEPS.length - answered} question{STEPS.length - answered !== 1 ? 's' : ''} remaining</div></div></div>}</div></div></div>
    </div>
  )
  return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>Healthcare & Insurance Guide · Free · {STEPS.length} questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>Set up healthcare in India — the right way</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Top hospitals, right insurance plan, and how to manage the gap between US and India coverage without a single day uninsured.</p>
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
                    {opt.sub && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{opt.sub}</div>}
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
