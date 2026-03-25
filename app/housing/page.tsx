'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

type Inputs = {
  city: string
  familySize: string
  budget: string
  timeline: string
  proximity: string
  furnished: string
  priorities: string
  duration: string
}

type Neighbourhood = {
  name: string
  city: string
  rentRange: string
  rentMin: number
  rentMax: number
  furnished: boolean
  unfurnished: boolean
  serviced: boolean
  nriRating: number
  safetyRating: number
  connectivityRating: number
  greenRating: number
  schoolsNearby: string[]
  hospitals: string[]
  commute: string
  supermarkets: string[]
  description: string
  pros: string[]
  cons: string[]
  bestFor: string
  agentTip: string
  matchScore?: number
}

const NEIGHBOURHOODS: Neighbourhood[] = [
  // HYDERABAD
  { name: 'Gachibowli', city: 'hyd', rentRange: '₹35,000–₹80,000/mo', rentMin: 35000, rentMax: 80000, furnished: true, unfurnished: true, serviced: true, nriRating: 95, safetyRating: 90, connectivityRating: 88, greenRating: 72, schoolsNearby: ['Oakridge International', 'Indus International', 'Silver Oaks'], hospitals: ['KIMS Hospital', 'Medicover Hospital'], commute: '10–20 min to HITECH City, 25 min to Banjara Hills', supermarkets: ['Nature\'s Basket', 'More Supermarket', 'Ratnadeep'], description: 'The #1 neighbourhood for tech returnees. Close to Google, Microsoft, Amazon campuses. Large NRI community, international schools within 5km, clean development.', pros: ['Largest NRI tech community in Hyderabad', 'Best international schools nearby', 'Modern apartments with amenities', 'Proximity to HITECH City tech corridor', 'Improving infrastructure'], cons: ['Premium pricing', 'Traffic on ORR during peak hours', 'Still developing in outer zones'], bestFor: 'FAANG returnees, tech professionals, families with school-age kids', agentTip: 'Negotiate 11-month rent agreements to avoid 12-month stamp duty. Ask for free parking — most premium towers include it.' },
  { name: 'Jubilee Hills', city: 'hyd', rentRange: '₹45,000–₹90,000/mo', rentMin: 45000, rentMax: 90000, furnished: true, unfurnished: true, serviced: false, nriRating: 88, safetyRating: 92, connectivityRating: 85, greenRating: 80, schoolsNearby: ['Chirec International', 'Rockwell International'], hospitals: ['Continental Hospital', 'Care Hospitals'], commute: '20 min to HITECH City, 10 min to Banjara Hills', supermarkets: ['Star Market', 'Heritage Fresh', 'Ratnadeep'], description: 'Established premium residential area with a quieter, more exclusive feel. Preferred by senior professionals and families who want upscale but not hyper-modern. Good green cover.', pros: ['Prestigious address', 'Tree-lined roads, green cover', 'Excellent safety', 'Top restaurants and cafés', 'Near Banjara Hills social scene'], cons: ['Older housing stock in some areas', 'Less modern amenities vs Gachibowli', 'Traffic on Road No. 36 peak hours'], bestFor: 'Senior professionals, families wanting established premium area', agentTip: 'Look for bungalow portions — better value than apartments for families. Road No. 45 has best value.' },
  { name: 'Kondapur / Madhapur', city: 'hyd', rentRange: '₹28,000–₹55,000/mo', rentMin: 28000, rentMax: 55000, furnished: true, unfurnished: true, serviced: false, nriRating: 85, safetyRating: 85, connectivityRating: 90, greenRating: 65, schoolsNearby: ['Silver Oaks', 'Chirec'], hospitals: ['Yashoda Hospital', 'Rainbow Hospital'], commute: '5–15 min to HITECH City', supermarkets: ['Big Bazaar', 'Ratnadeep', 'More'], description: 'Best value near the tech corridor. Dense, urban, young population. Closest to HITECH City without the Gachibowli premium. Metro connectivity coming soon.', pros: ['Closest to HITECH City', 'Lower cost than Gachibowli', 'Young, social neighbourhood', 'Good food and café scene', 'Metro coming soon'], cons: ['Dense and congested', 'Older apartment stock', 'Narrow roads'], bestFor: 'Budget-conscious tech professionals, first-year returnees', agentTip: 'Phase 2 and Phase 3 areas have newer construction at lower prices. Avoid Phase 1 — older stock.' },
  // BANGALORE
  { name: 'Whitefield', city: 'blr', rentRange: '₹40,000–₹80,000/mo', rentMin: 40000, rentMax: 80000, furnished: true, unfurnished: true, serviced: true, nriRating: 92, safetyRating: 88, connectivityRating: 82, greenRating: 78, schoolsNearby: ['Inventure Academy', 'Stonehill International', 'Ryan International'], hospitals: ['Columbia Asia', 'Manipal Hospital'], commute: '30–60 min to MG Road / CBD (traffic dependent)', supermarkets: ['Nature\'s Basket', 'More', 'Godrej Nature\'s Basket'], description: 'Bangalore\'s NRI family hub. Large expat and NRI community, excellent international schools, modern township developments. Traffic is the trade-off.', pros: ['Best NRI / expat community in Bangalore', 'Top international schools nearby', 'Modern gated townships (Prestige, Brigade)', 'Cleaner air than Central Bangalore', 'ITPL tech hub proximity'], cons: ['Traffic to central Bangalore is notorious', 'Far from social hubs (Koramangala, Indiranagar)', 'Metro not yet extended here fully'], bestFor: 'Families with kids, expat community seekers', agentTip: 'Townships like Prestige Shantiniketan and Brigade Gateway offer better facilities and security for NRI families.' },
  { name: 'Koramangala', city: 'blr', rentRange: '₹50,000–₹95,000/mo', rentMin: 50000, rentMax: 95000, furnished: true, unfurnished: true, serviced: false, nriRating: 85, safetyRating: 86, connectivityRating: 90, greenRating: 60, schoolsNearby: ['Ryan International', 'DPS East'], hospitals: ['Fortis Hospital', 'Apollo Hospital'], commute: '15 min to MG Road, 30 min to Electronic City', supermarkets: ['Nature\'s Basket', 'Foodhall', 'Spencer\'s'], description: 'Best social scene in Bangalore. Young, vibrant, startup culture. Perfect for those who want walkability, restaurants, and an active social life. Less family-oriented.', pros: ['Best food and social scene', 'Walkable area', 'Startup ecosystem', 'Strong connectivity', 'Vibrant nightlife'], cons: ['Very expensive', 'Loud and crowded', 'Less family-friendly', 'Parking is a nightmare'], bestFor: 'Young professionals, startup founders, social butterflies', agentTip: '5th and 6th Block are best value. Avoid 1st Block — tourist area with premium pricing.' },
  { name: 'Indiranagar', city: 'blr', rentRange: '₹55,000–₹100,000/mo', rentMin: 55000, rentMax: 100000, furnished: true, unfurnished: true, serviced: false, nriRating: 80, safetyRating: 88, connectivityRating: 92, greenRating: 68, schoolsNearby: ['Gear Innovative', 'DPS Bangalore East'], hospitals: ['Manipal Hospital', 'Sakra World Hospital'], commute: '20 min to MG Road, Metro connectivity excellent', supermarkets: ['Nature\'s Basket', 'Foodhall', 'Lulu Mall nearby'], description: 'Most cosmopolitan neighbourhood in Bangalore. Metro connected, café culture, great restaurants. Premium but walkable lifestyle. Strong for solo returnees and couples.', pros: ['Metro connectivity (Indiranagar station)', 'Best café culture', 'Walkable', 'Cosmopolitan feel', 'Great restaurants and bars'], cons: ['Most expensive', 'Limited large apartments', 'Noise from 100 Feet Road'], bestFor: 'Solo returnees, couples without kids, remote workers wanting social life', agentTip: '12th Main and CMH Road have the best walkable value. Double Road area is quieter with bigger apartments.' },
  // PUNE
  { name: 'Koregaon Park', city: 'pun', rentRange: '₹45,000–₹85,000/mo', rentMin: 45000, rentMax: 85000, furnished: true, unfurnished: true, serviced: false, nriRating: 90, safetyRating: 90, connectivityRating: 82, greenRating: 85, schoolsNearby: ['Mercedes-Benz IS', 'Symbiosis International School'], hospitals: ['Ruby Hall Clinic', 'Jehangir Hospital'], commute: '20 min to Hinjewadi IT park, 15 min to Camp area', supermarkets: ['Nature\'s Basket', 'D-Mart', 'Star Bazaar'], description: 'Pune\'s most premium and cosmopolitan neighbourhood. Tree-lined roads, Osho Ashram nearby, huge expat community. Quieter than Mumbai or Bangalore equivalents with better green cover.', pros: ['Best green cover in Pune', 'Large expat/NRI community', 'Top premium restaurants', 'Quiet and upscale', 'Near best hospitals'], cons: ['Most expensive in Pune', 'Far from IT parks', 'Older housing stock in some lanes'], bestFor: 'Premium seekers, families wanting green and quiet, remote workers', agentTip: 'North Main Road and Lane 6 have the best restaurants and daily convenience. Avoid the far end — away from amenities.' },
  { name: 'Baner / Balewadi', city: 'pun', rentRange: '₹30,000–₹55,000/mo', rentMin: 30000, rentMax: 55000, furnished: true, unfurnished: true, serviced: false, nriRating: 82, safetyRating: 88, connectivityRating: 85, greenRating: 78, schoolsNearby: ['DY Patil International', 'Orchid School'], hospitals: ['Aditya Birla Hospital', 'Sahyadri Hospital'], commute: '10 min to Hinjewadi, 25 min to Magarpatta', supermarkets: ['Big Bazaar', 'D-Mart', 'Reliance Fresh'], description: 'Best value family neighbourhood in Pune. Modern construction, good connectivity to Hinjewadi IT park, affordable. Growing NRI community and social scene.', pros: ['Affordable family-friendly area', 'Modern construction', 'Good proximity to IT parks', 'Improving infrastructure', 'Good schools nearby'], cons: ['Traffic on Baner Road peak hours', 'Less premium vs Koregaon Park', 'Less social scene'], bestFor: 'Families on a budget, IT professionals, first-year returnees', agentTip: 'Balewadi High Street has best food options. New projects near Balewadi Stadium offer best value.' },
  // CHENNAI
  { name: 'Adyar', city: 'che', rentRange: '₹35,000–₹70,000/mo', rentMin: 35000, rentMax: 70000, furnished: true, unfurnished: true, serviced: false, nriRating: 82, safetyRating: 92, connectivityRating: 80, greenRating: 82, schoolsNearby: ['Chettinad Vidyashram', 'Gateway School'], hospitals: ['Apollo Hospital', 'Vijaya Hospital'], commute: '20 min to Anna Salai, 35 min to OMR IT corridor', supermarkets: ['Heritage Fresh', 'More', 'Nilgiris'], description: 'Most established premium area in Chennai. Close to the beach, good schools, top hospitals. Popular with Tamil NRI families for its cultural familiarity.', pros: ['Beach proximity', 'Excellent hospitals', 'Top schools nearby', 'Safe and established', 'Cultural fit for Tamil NRIs'], cons: ['Far from OMR IT corridor', 'Traffic during peak hours', 'Older housing stock'], bestFor: 'Tamil NRI families, premium seekers, those with family connections in Chennai', agentTip: 'RA Puram and Besant Nagar are alternatives if Adyar is too expensive — similar character.' },
  { name: 'OMR (Sholinganallur / Perungudi)', city: 'che', rentRange: '₹25,000–₹50,000/mo', rentMin: 25000, rentMax: 50000, furnished: true, unfurnished: true, serviced: false, nriRating: 75, safetyRating: 85, connectivityRating: 88, greenRating: 68, schoolsNearby: ['Gateway International', 'PSBB Millennium School'], hospitals: ['Chettinad Health City', 'Apollo Spectra'], commute: '5–15 min to major IT companies on OMR', supermarkets: ['D-Mart', 'Big Bazaar', 'Spar'], description: 'Best value for IT professionals. Modern apartments, close to tech companies, improving infrastructure. Less premium than Adyar but more affordable and practical for IT workers.', pros: ['Best IT corridor proximity', 'Modern apartments', 'Affordable', 'Multiple IT company campuses nearby'], cons: ['Heavy IT corridor traffic', 'Flooding during monsoon on some stretches', 'Less established social scene'], bestFor: 'IT professionals, budget-conscious families, first-year returnees', agentTip: 'Perungudi is better than Sholinganallur for flooding. Check 5th-floor+ apartments during monsoon visits.' },
  // MUMBAI
  { name: 'Powai', city: 'mum', rentRange: '₹55,000–₹95,000/mo', rentMin: 55000, rentMax: 95000, furnished: true, unfurnished: true, serviced: false, nriRating: 88, safetyRating: 90, connectivityRating: 80, greenRating: 85, schoolsNearby: ['Podar International', 'Ryan International'], hospitals: ['Hiranandani Hospital', 'Nanavati Hospital'], commute: '30 min to Bandra, 20 min to Vikhroli', supermarkets: ['Nature\'s Basket', 'D-Mart', 'Haiko Mall'], description: 'Best NRI neighbourhood in Mumbai. Hiranandani township, lake view, IIT Bombay campus next door. Feels like a planned mini-city within Mumbai\'s chaos. Best quality of life in Mumbai for NRIs.', pros: ['Planned township — orderly and clean', 'Lake view and green cover', 'Strong NRI community', 'Good schools', 'Mall and conveniences within walking distance'], cons: ['Far from South Mumbai and Bandra social scene', 'Premium pricing', 'Limited metro connectivity'], bestFor: 'Families wanting structured environment in Mumbai, NRI community seekers', agentTip: 'Hiranandani Gardens (Phase 1–5) is premium but worth it. Avoid the area beyond the highway — not township quality.' },
  { name: 'Bandra West', city: 'mum', rentRange: '₹80,000–₹160,000/mo', rentMin: 80000, rentMax: 160000, furnished: true, unfurnished: false, serviced: false, nriRating: 85, safetyRating: 88, connectivityRating: 95, greenRating: 60, schoolsNearby: ['Jamnabai Narsee School', 'St. Stanislaus High School'], hospitals: ['Lilavati Hospital', 'Holy Family Hospital'], commute: '25 min to Lower Parel, 30 min to BKC via sea link', supermarkets: ['Foodhall', 'Nature\'s Basket', 'Linking Road markets'], description: 'Mumbai\'s most cosmopolitan and premium neighbourhood. Sea link access, celebrity neighbours, best restaurants. Very expensive but unmatched lifestyle. Best for high-earners who want maximum urban living.', pros: ['Most cosmopolitan in Mumbai', 'Sea link to BKC', 'Best restaurants and social scene', 'Bandstand promenade', 'Celebrity neighbourhood'], cons: ['Extremely expensive', 'Intense traffic', 'Very crowded', 'Monsoon flooding on some streets'], bestFor: 'High-earners, finance professionals, those wanting maximum Mumbai lifestyle', agentTip: 'Hill Road and Carter Road are the best pockets. Pali Hill is premium and quieter. Negotiate hard — agents quote 15–20% over market.' },
]

const STEPS = [
  { key: 'city', section: 'Search', q: 'Which city are you moving to?', hint: 'We\'ll show the best neighbourhoods for NRI returnees', opts: [{ k: 'hyd', label: 'Hyderabad', sub: 'Gachibowli, Jubilee Hills, Kondapur' }, { k: 'blr', label: 'Bangalore', sub: 'Whitefield, Koramangala, Indiranagar' }, { k: 'pun', label: 'Pune', sub: 'Koregaon Park, Baner, Viman Nagar' }, { k: 'che', label: 'Chennai', sub: 'Adyar, OMR, RA Puram' }, { k: 'mum', label: 'Mumbai', sub: 'Powai, Bandra, Navi Mumbai' }] },
  { key: 'familySize', section: 'Search', q: 'What is your family setup?', hint: 'Affects apartment size and neighbourhood type', opts: [{ k: 'solo', label: 'Just me', sub: '1–2 BHK sufficient' }, { k: 'couple', label: 'Me & spouse', sub: '2 BHK ideal' }, { k: 'family_small', label: 'Family — 1–2 kids', sub: '3 BHK recommended' }, { k: 'family_large', label: 'Family — 3+ kids / parents', sub: '3–4 BHK needed' }] },
  { key: 'budget', section: 'Search', q: 'What is your monthly rent budget?', hint: 'Includes rent only — add 30–40% for maintenance, electricity, and amenities', opts: [{ k: 'luxury', label: '₹80,000+/mo', sub: 'Premium / luxury apartments' }, { k: 'premium', label: '₹50,000–₹80,000/mo', sub: 'Good quality with amenities' }, { k: 'mid', label: '₹30,000–₹50,000/mo', sub: 'Comfortable mid-range' }, { k: 'budget', label: 'Under ₹30,000/mo', sub: 'Value-focused' }] },
  { key: 'timeline', section: 'Search', q: 'When do you need to move in?', hint: 'Affects whether to use a serviced apartment first', opts: [{ k: 'immediate', label: 'Immediately (under 1 month)', sub: 'Serviced apartment bridge recommended' }, { k: 'soon', label: '1–3 months', sub: 'Enough time to search properly' }, { k: 'planned', label: '3–6 months', sub: 'Good runway to negotiate' }, { k: 'flexible', label: '6+ months away', sub: 'No rush — can be selective' }] },
  { key: 'proximity', section: 'Your Needs', q: 'What do you need to be close to?', hint: 'This will be the primary ranking factor', opts: [{ k: 'school', label: 'Children\'s school', sub: 'Within 15 min commute to school' }, { k: 'office', label: 'My office / tech park', sub: 'Minimize commute to work' }, { k: 'parents', label: 'In-laws / parents\' home', sub: 'Proximity to extended family' }, { k: 'hospital', label: 'Hospital / healthcare', sub: 'For elderly parents or health needs' }, { k: 'social', label: 'Restaurants & social life', sub: 'Walkable lifestyle' }] },
  { key: 'furnished', section: 'Your Needs', q: 'Do you need a furnished apartment?', hint: 'Furnished adds 20–30% to rent but saves 3–4 months of setup', opts: [{ k: 'fully', label: 'Fully furnished', sub: 'Move-in ready — bed, sofa, appliances, kitchen' }, { k: 'semi', label: 'Semi-furnished', sub: 'White goods only — fridge, washing machine, AC' }, { k: 'unfurnished', label: 'Unfurnished', sub: 'Bare shell — want to set up my own way' }, { k: 'serviced', label: 'Serviced apartment (short-term)', sub: 'For first 2–3 months while searching' }] },
  { key: 'priorities', section: 'Your Needs', q: 'What is your biggest concern about housing?', hint: 'We\'ll flag neighbourhoods that address this', opts: [{ k: 'safety', label: 'Safety & security', sub: 'Gated community, CCTV, security guard' }, { k: 'green', label: 'Green spaces & air quality', sub: 'Parks, trees, clean air nearby' }, { k: 'nri', label: 'NRI / expat community', sub: 'Neighbours who understand the transition' }, { k: 'commute', label: 'Low commute time', sub: 'Close to office or school' }, { k: 'value', label: 'Value for money', sub: 'Best space and amenities for the budget' }] },
  { key: 'duration', section: 'Your Needs', q: 'How long are you planning to rent?', hint: 'Affects negotiation strategy and deposit structure', opts: [{ k: 'short', label: '3–6 months (trial period)', sub: 'Serviced apartment recommended' }, { k: 'year', label: '11 months (standard lease)', sub: 'Standard Indian rental agreement' }, { k: 'two', label: '2 years (long term)', sub: 'Better rates for longer commitment' }, { k: 'buy_later', label: 'Rent now, buy in 1–2 years', sub: 'Will look for property to buy later' }] },
]

function matchNeighbourhoods(I: Inputs): Neighbourhood[] {
  const cityNhoods = NEIGHBOURHOODS.filter(n => n.city === I.city)

  return cityNhoods.map(n => {
    let score = 50

    // Budget
    const budgetMap: Record<string, { min: number; max: number }> = { luxury: { min: 70000, max: 999999 }, premium: { min: 45000, max: 85000 }, mid: { min: 25000, max: 55000 }, budget: { min: 0, max: 35000 } }
    const b = budgetMap[I.budget]
    if (b && n.rentMin <= b.max && n.rentMax >= b.min) score += 20

    // Furnished
    if (I.furnished === 'fully' && n.furnished) score += 10
    if (I.furnished === 'serviced' && n.serviced) score += 15
    if (I.furnished === 'unfurnished' && n.unfurnished) score += 8

    // Priority
    if (I.priorities === 'safety') score += Math.round(n.safetyRating / 10)
    if (I.priorities === 'green') score += Math.round(n.greenRating / 10)
    if (I.priorities === 'nri') score += Math.round(n.nriRating / 10)
    if (I.priorities === 'commute') score += Math.round(n.connectivityRating / 10)

    // Timeline urgency
    if (I.timeline === 'immediate' && n.serviced) score += 15
    if (I.timeline === 'immediate' && !n.serviced) score -= 5

    // Family
    if (I.familySize === 'family_small' || I.familySize === 'family_large') {
      if (n.schoolsNearby.length > 0) score += 10
      if (n.greenRating >= 80) score += 5
    }

    return { ...n, matchScore: Math.min(100, Math.max(10, score)) }
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
}

export default function HousingFinder() {
  const { shouldBlock } = useProtectedRoute()

  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Neighbourhood[] | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const answered = STEPS.filter((step) => Boolean(answers[step.key as keyof Inputs])).length
  const progress = Math.round((answered / STEPS.length) * 100)
  if (shouldBlock) return null

  function setAnswer(key: string, val: string) {
    setAnswers((prev) => ({ ...prev, [key]: val }))
  }

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => {
      setResult(matchNeighbourhoods(answers as Inputs))
      setLoading(false)
    }, 1400)
  }

  function restart() { setAnswers({}); setResult(null); setLoading(false); setExpanded(null) }

  const ratingBar = (val: number, color: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: color, borderRadius: '100px', width: val + '%' }} />
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color, minWidth: '24px' }}>{val}</span>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Finding your ideal neighbourhood...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Matching on budget, safety, schools, and NRI community</p>
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
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Rental & Housing Guide — {cityName}</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>
              {top.name} is your best neighbourhood match
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>{top.description.split('.')[0]}.</p>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>

          {/* IMMEDIATE TIMELINE NOTE */}
          {answers.timeline === 'immediate' && (
            <div style={{ background: '#FFF3E6', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.25rem', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#854F0B', marginBottom: '3px' }}>Moving in under 1 month — use a serviced apartment first</div>
                <div style={{ fontSize: '13px', color: '#633806', lineHeight: 1.6 }}>Finding and setting up a permanent rental takes 4–8 weeks. Book a serviced apartment for your first 2 months while you search at your own pace. Staybridge Suites, Marriott Residences, and Lemon Tree Residences are good options in all 5 cities.</div>
              </div>
            </div>
          )}

          {/* NEIGHBOURHOOD LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
            {result.map((n, i) => (
              <div key={n.name} style={{ background: 'var(--white)', border: `0.5px solid ${expanded === n.name ? 'rgba(255,153,51,0.3)' : 'var(--border)'}`, borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setExpanded(expanded === n.name ? null : n.name)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: i === 0 ? '#FF9933' : i === 1 ? '#138808' : 'var(--india-white)', color: i < 2 ? '#fff' : 'var(--ink-soft)', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--ink)', marginBottom: '3px' }}>{n.name}</div>
                          <div style={{ fontSize: '12px', color: '#FF9933', fontWeight: 500, marginBottom: '6px' }}>{n.rentRange}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '6px' }}>
                            {n.furnished && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: '#E8F5E8', color: '#27500A', fontWeight: 600 }}>Furnished available</span>}
                            {n.serviced && <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C', fontWeight: 600 }}>Serviced available</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>🚗 {n.commute}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.8rem', color: i === 0 ? '#FF9933' : 'var(--ink)' }}>{n.matchScore}</div>
                          <div style={{ fontSize: '10px', color: 'var(--ink-soft)' }}>match</div>
                          <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>{expanded === n.name ? '▲ Less' : '▼ Details'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginTop: '10px' }}>
                        {[{ label: 'NRI community', val: n.nriRating, color: '#FF9933' }, { label: 'Safety', val: n.safetyRating, color: '#138808' }, { label: 'Connectivity', val: n.connectivityRating, color: '#000080' }, { label: 'Green spaces', val: n.greenRating, color: '#1D9E75' }].map(r => (
                          <div key={r.label} style={{ background: 'var(--india-white)', borderRadius: '8px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '9px', color: 'var(--ink-soft)', marginBottom: '4px' }}>{r.label}</div>
                            {ratingBar(r.val, r.color)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {expanded === n.name && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '0.5px solid var(--border)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.7, marginTop: '1.25rem', marginBottom: '1.25rem' }}>{n.description}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#138808', marginBottom: '6px' }}>✓ Why it works</div>
                        {n.pros.map((p, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '4px', paddingLeft: '10px', borderLeft: '2px solid #E8F5E8' }}>{p}</div>)}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#E24B4A', marginBottom: '6px' }}>✗ Watch out for</div>
                        {n.cons.map((c, i) => <div key={i} style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '4px', paddingLeft: '10px', borderLeft: '2px solid #FCEBEB' }}>{c}</div>)}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '10px', marginBottom: '1rem' }}>
                      <div style={{ background: 'var(--india-white)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>🏫 Schools nearby</div>
                        {n.schoolsNearby.map(s => <div key={s} style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>• {s}</div>)}
                      </div>
                      <div style={{ background: 'var(--india-white)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>🏥 Hospitals nearby</div>
                        {n.hospitals.map(h => <div key={h} style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>• {h}</div>)}
                      </div>
                      <div style={{ background: 'var(--india-white)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: '5px' }}>🛒 Supermarkets</div>
                        {n.supermarkets.map(s => <div key={s} style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '2px' }}>• {s}</div>)}
                      </div>
                    </div>

                    <div style={{ background: '#FFF3E6', borderRadius: '10px', padding: '10px 14px', border: '0.5px solid rgba(255,153,51,0.2)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#854F0B', marginBottom: '3px' }}>💡 Agent tip</div>
                      <div style={{ fontSize: '12px', color: '#633806', lineHeight: 1.6 }}>{n.agentTip}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RENTAL TIPS */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>NRI Rental Guide — What to Know</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
              {[
                { icon: '📝', title: '11-month lease is standard', detail: 'Indian rental agreements are typically 11 months to avoid stamp duty registration. Ask your CA if you should register a longer lease for protection.' },
                { icon: '💰', title: 'Security deposit is 2–10 months rent', detail: 'Major cities demand higher deposits. Hyderabad: 2–3 months. Bangalore/Mumbai: 8–10 months. This is negotiable — aim for 3–5 months max.' },
                { icon: '🔍', title: 'Visit before committing', detail: 'Never rent a flat you haven\'t visited in person. Video tours miss water pressure, noise levels, neighbour quality, and building maintenance.' },
                { icon: '📋', title: 'Documents you\'ll need', detail: 'Passport copy, visa/OCI copy, employment proof or NRI bank statement, 2 reference letters. Some landlords also want a local guarantor.' },
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
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Need to check healthcare options in {cityName}?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>See the Healthcare & Insurance Guide for top hospitals, insurance options, and coverage gap management.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/healthcare" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Healthcare guide →</Link>
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
        .housing-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .housing-grid { display: grid; grid-template-columns: minmax(280px, 360px) minmax(0, 1fr); gap: 1.25rem; align-items: start; }
        .housing-sticky { position: sticky; top: 96px; }
        .housing-stack { display: grid; gap: 1rem; }
        .housing-option-grid { display: grid; gap: 0.7rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        @media (max-width: 980px) {
          .housing-grid { grid-template-columns: 1fr; }
          .housing-sticky { position: static; }
        }
        @media (max-width: 767px) {
          .housing-shell { padding: 1rem 0.9rem 2rem; }
          .housing-option-grid { grid-template-columns: 1fr !important; }
          .housing-question-label { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      <div className="housing-shell">
        <div className="housing-grid">
          <div className="housing-sticky">
            <div style={{ overflow: 'hidden', borderRadius: 24, boxShadow: '0 22px 48px rgba(29,22,15,0.06)', background: '#FFFFFF', border: '1px solid #E5E1DA' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.45rem 0.85rem', marginBottom: '1rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rental & Housing Finder</span>
                </div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: '#fff', marginBottom: '.9rem' }}>Find your India home with <em style={{ fontStyle: 'italic', color: '#FF9933' }}>more confidence.</em></h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>Answer the same guided questions as the readiness check and we&apos;ll shortlist the right neighbourhoods in one pass.</p>
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
                {[{ title: 'What you?ll get', body: 'Neighbourhood matches, rent context, school and hospital signals, plus practical rental tips.' }, { title: 'Your progress', body: answered === STEPS.length ? 'Everything is filled in and ready for your housing report.' : `${answered} of ${STEPS.length} questions answered. ${STEPS.length - answered} left before you can generate your report.` }, { title: 'How to answer', body: 'Pick the options that best match your move timing, budget, and family setup. You can change answers anytime before generating.' }].map((item) => <div key={item.title} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 18, padding: '1rem 1rem 0.95rem', marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{item.title}</div><div style={{ fontSize: 14, color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div></div>)}
              </div>
            </div>
          </div>

          <div className="housing-stack">
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.25rem 1.3rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFFFF', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 100, padding: '5px 14px', marginBottom: '1rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9933' }} /><span style={{ fontSize: 11, fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>Rental & Housing Finder ? Free ? {STEPS.length} questions</span></div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', color: '#1A1208', marginBottom: '0.6rem' }}>Find the right neighbourhood for your move</h2>
              <p style={{ fontSize: 15, color: '#6B5E50', lineHeight: 1.8 }}>Move through the questions below and we?ll turn your answers into a clear neighbourhood shortlist and housing strategy.</p>
            </div>

            {STEPS.map((step, index) => <div key={step.key} style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: 24, padding: '1.2rem', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}><div className="housing-question-label" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}><div><div style={{ fontSize: 12, fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{step.section}</div><h3 style={{ fontSize: '1.15rem', marginBottom: 6, color: '#1A1208', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, lineHeight: 1.4 }}>{index + 1}. {step.q}</h3><p style={{ fontSize: 13, color: '#6B5E50', lineHeight: 1.65 }}>{step.hint}</p></div>{answers[step.key as keyof Inputs] ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.42rem 0.8rem', borderRadius: 999, background: '#E8F5E8', color: '#138808', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Set</span> : null}</div><div className="housing-option-grid">{step.opts.map((opt) => { const sel = answers[step.key as keyof Inputs] === opt.k; return <button key={opt.k} type="button" onClick={() => setAnswer(step.key, opt.k)} style={{ textAlign: 'left', padding: '1rem 1rem 0.95rem', borderRadius: 18, border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FFF3E6' : '#FFFFFF', boxShadow: sel ? '0 10px 24px rgba(255,153,51,0.14)' : 'none', transition: 'all .18s ease', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: '#1A1208', lineHeight: 1.45 }}>{opt.label}</div><div style={{ marginTop: 6, fontSize: 12, color: '#6B5E50', lineHeight: 1.5 }}>{opt.sub}</div></div><div style={{ width: 18, height: 18, borderRadius: '50%', border: `1.5px solid ${sel ? '#FF9933' : '#E5E1DA'}`, background: sel ? '#FF9933' : 'transparent', flexShrink: 0, marginTop: 2 }} /></div></button> })}</div></div>)}
            {answered === STEPS.length ? <button onClick={handleGenerate} style={{ width: '100%', padding: '15px', background: '#FF9933', color: '#fff', border: 'none', borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>Generate My Housing Report ?</button> : <div style={{ background: '#FFFFFF', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}><div style={{ fontSize: '1.25rem' }}>??</div><div><div style={{ fontSize: '13px', color: '#6B5E50' }}>Answer all {STEPS.length} questions to generate your report</div><div style={{ fontSize: '11px', color: '#B5A898', marginTop: '2px' }}>{STEPS.length - answered} question{STEPS.length - answered !== 1 ? 's' : ''} remaining</div></div></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
