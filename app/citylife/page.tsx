'use client'

import { useState } from 'react'
import Link from 'next/link'

type Inputs = {
  city: string
  neighbourhood: string
  lifestyle: string
  foodPref: string
  hasKids: string
  fitness: string
  social: string
}

type Place = {
  name: string
  city: string
  category: string
  subcategory: string
  area: string
  description: string
  nriRating: number
  priceRange: string
  mustTry?: string
  tip: string
  tags: string[]
}

const PLACES: Place[] = [
  // RESTAURANTS - HYD
  { name: 'Novotel Hyderabad Convention Centre', city: 'hyd', category: 'dining', subcategory: 'International', area: 'HITECH City', description: 'Best international buffet in Hyderabad. Huge spread, Sunday brunch is famous among NRI community.', nriRating: 90, priceRange: '₹₹₹', mustTry: 'Sunday brunch buffet', tip: 'Book in advance — fills up fast on weekends', tags: ['NRI favourite', 'Family', 'International'] },
  { name: 'Farzi Cafe', city: 'hyd', category: 'dining', subcategory: 'Modern Indian', area: 'Inorbit Mall, HITECH City', description: 'Modern Indian cuisine with molecular gastronomy. Menu feels familiar but elevated — great for US returnees adjusting to India food.', nriRating: 92, priceRange: '₹₹₹', mustTry: 'Dal makhani slider, Butter chicken pao', tip: 'Go on weekday evenings — shorter wait', tags: ['NRI favourite', 'Date night', 'Modern Indian'] },
  { name: 'Eat Street / Necklace Road', city: 'hyd', category: 'dining', subcategory: 'Street Food', area: 'Tank Bund', description: 'Waterfront food zone with 20+ food stalls. Great for families — open air, safe, wide variety. Kids love it.', nriRating: 85, priceRange: '₹', mustTry: 'Biryani, kebabs, fresh juice', tip: 'Visit after 6pm when the evening crowd and lights make it atmospheric', tags: ['Family', 'Street food', 'Budget'] },
  { name: 'Ohri\'s Banjara', city: 'hyd', category: 'dining', subcategory: 'Multi-cuisine', area: 'Banjara Hills', description: 'Long-established premium restaurant group. Multiple cuisines under one roof — Chinese, Indian, Continental. Great for family dinners.', nriRating: 82, priceRange: '₹₹', mustTry: 'Chicken Angara, Hyderabadi Biryani', tip: 'Make reservation for dinner — always busy on weekends', tags: ['Family', 'Special occasion'] },
  // GROCERIES - HYD
  { name: 'Nature\'s Basket (Gachibowli)', city: 'hyd', category: 'grocery', subcategory: 'Premium International', area: 'Gachibowli', description: 'Best international grocery in Hyderabad. Imported cheese, pasta, cereals, international snacks. US returnees feel at home here.', nriRating: 95, priceRange: '₹₹₹', tip: 'Tuesday deliveries — new international stock arrives. App has better deals than in-store.', tags: ['International', 'NRI essential', 'Imported goods'] },
  { name: 'Ratnadeep Supermarket', city: 'hyd', category: 'grocery', subcategory: 'Full Range', area: 'Multiple locations', description: 'Best local supermarket chain. Good produce, local brands, competitive pricing. Has section with organic and health foods.', nriRating: 88, priceRange: '₹₹', tip: 'The Kondapur and Gachibowli branches have the widest international product range', tags: ['Everyday grocery', 'Good value', 'Multiple locations'] },
  { name: 'Decathlon Hyderabad', city: 'hyd', category: 'shopping', subcategory: 'Sports & Fitness', area: 'Gachibowli', description: 'Large format sports and outdoor store. Best for fitness equipment, running gear, sports for kids. Very affordable vs US prices.', nriRating: 92, priceRange: '₹₹', tip: 'Kids section excellent for sports. Same global brand quality at 1/3 the US price.', tags: ['Sports', 'Kids activities', 'Value'] },
  // FITNESS - HYD
  { name: 'Snap Fitness', city: 'hyd', category: 'fitness', subcategory: 'Gym', area: 'Gachibowli / Kondapur', description: 'US-origin gym chain — familiar equipment, clean, 24/7 access. Monthly membership at a fraction of US cost.', nriRating: 88, priceRange: '₹₹', tip: 'Annual membership ₹12,000–18,000 vs $500+ in US. Same brand, same equipment.', tags: ['24/7', 'US brand', 'Clean facilities'] },
  { name: 'Cult.fit (multiple)', city: 'hyd', category: 'fitness', subcategory: 'Fitness Classes', area: 'HITECH City, Jubilee Hills', description: 'India\'s largest fitness chain — HIIT, yoga, boxing, zumba, cycling. App-based booking. Very popular with NRI crowd.', nriRating: 90, priceRange: '₹₹', tip: 'Monthly membership ~₹2,500 for unlimited classes. App is excellent — similar to ClassPass.', tags: ['Classes', 'App-based', 'NRI favourite'] },
  // CO-WORKING - HYD
  { name: 'WeWork Hyderabad', city: 'hyd', category: 'coworking', subcategory: 'Premium Co-working', area: 'HITECH City', description: 'Global brand co-working — same quality as US WeWork. Hot desks and private offices. Good for remote workers missing an office environment.', nriRating: 92, priceRange: '₹₹₹', tip: 'Hot desk pass ₹15,000–20,000/mo. Good community events — easy to network with other NRIs.', tags: ['Remote work', 'Premium', 'Global brand'] },
  { name: 'IndiQube', city: 'hyd', category: 'coworking', subcategory: 'Value Co-working', area: 'Gachibowli / Madhapur', description: 'India-origin co-working. Good facilities, lower cost than WeWork. Popular with startup founders and freelancers.', nriRating: 85, priceRange: '₹₹', tip: 'Hot desk ₹8,000–12,000/mo — good value. Multiple locations across tech corridor.', tags: ['Remote work', 'Value', 'Startup community'] },
  // BANGALORE
  { name: 'Toit Brewpub', city: 'blr', category: 'dining', subcategory: 'Casual Dining', area: 'Indiranagar', description: 'Bangalore institution. Craft beer, pub food, lively atmosphere. NRI returnees love it for the familiar pub-style experience.', nriRating: 94, priceRange: '₹₹₹', mustTry: 'Weizen, fish and chips', tip: 'Extremely popular — go early (6pm) or very late (after 10pm) to avoid long waits', tags: ['Nightlife', 'Craft beer', 'NRI favourite'] },
  { name: 'Social (multiple)', city: 'blr', category: 'dining', subcategory: 'Café Bar', area: 'Koramangala, Indiranagar, Whitefield', description: 'Coolest café-bar chain in India. WiFi, good food, cocktails, great atmosphere. Works as café by day and bar by night.', nriRating: 92, priceRange: '₹₹', mustTry: 'House cocktails, loaded fries', tip: 'Great for remote work during the day. Koramangala branch is the flagship.', tags: ['Café', 'Remote work', 'Social'] },
  { name: 'Foodhall (Koramangala)', city: 'blr', category: 'grocery', subcategory: 'Premium International', area: 'Koramangala', description: 'Best premium international grocery in Bangalore. Deli counter, imported cheese, international wines, artisan breads. Feels like Whole Foods.', nriRating: 96, priceRange: '₹₹₹', tip: 'Deli counter has fresh-made items. Import section has US brands you\'ll miss.', tags: ['International', 'NRI essential', 'Premium'] },
  { name: 'Cult.fit (multiple)', city: 'blr', category: 'fitness', subcategory: 'Fitness Classes', area: 'Koramangala, Whitefield, Indiranagar', description: 'Largest and best Cult.fit presence in India — Bangalore is their home city. More locations, more classes.', nriRating: 92, priceRange: '₹₹', tip: 'Koramangala branch has the most class variety. Book 2 days ahead for popular HIIT classes.', tags: ['Classes', 'App-based', 'NRI favourite'] },
  { name: 'Cubbon Park', city: 'blr', category: 'outdoors', subcategory: 'Park', area: 'Central Bangalore', description: '300-acre green lung of Bangalore. Morning runs, cycling, yoga in the park. Very popular with health-conscious crowd. Free, family-friendly.', nriRating: 90, priceRange: '₹', tip: 'Go before 8am on weekdays — peaceful and uncrowded. Weekends are social and lively.', tags: ['Free', 'Family', 'Running', 'Outdoors'] },
  // PUNE
  { name: 'Koregaon Park Café hopping', city: 'pun', category: 'dining', subcategory: 'Café', area: 'Koregaon Park', description: 'Multiple excellent cafés within walking distance — German Bakery, Café 1730, Elephant & Co. Best café culture in Pune for NRI returnees.', nriRating: 92, priceRange: '₹₹', mustTry: 'German Bakery brunch', tip: 'The lanes around Osho Ashram (North Main Road) have the highest café density.', tags: ['Café', 'Walkable', 'NRI favourite'] },
  { name: 'Nature\'s Basket (Koregaon Park)', city: 'pun', category: 'grocery', subcategory: 'Premium International', area: 'Koregaon Park', description: 'Best international grocery in Pune. Good imported section, fresh produce, deli counter. Essential for NRI returnees first month.', nriRating: 93, priceRange: '₹₹₹', tip: 'Smaller than Bangalore/Mumbai branches but well-stocked for international staples.', tags: ['International', 'NRI essential'] },
  { name: 'Osho International Meditation Resort', city: 'pun', category: 'wellness', subcategory: 'Wellness', area: 'Koregaon Park', description: 'World-famous meditation and wellness resort in Pune. Programs ranging from 1-day to multi-week. Popular with returnees navigating lifestyle transition.', nriRating: 88, priceRange: '₹₹₹', tip: 'Visitor registration required. Evening events open to public. Very peaceful campus.', tags: ['Wellness', 'Meditation', 'Unique'] },
  // CHENNAI
  { name: 'Annalakshmi Restaurant', city: 'che', category: 'dining', subcategory: 'Traditional South Indian', area: 'Anna Salai', description: 'Pay-as-you-wish concept for traditional South Indian food. Authentic, cultural experience. Great for Tamil NRIs reconnecting with food memories.', nriRating: 88, priceRange: '₹', mustTry: 'Full Brahmin meals', tip: 'Cultural experience as much as food. Visit once for the nostalgia.', tags: ['Authentic', 'Cultural', 'Budget'] },
  { name: 'Chamiers Café', city: 'che', category: 'dining', subcategory: 'International Café', area: 'R.A. Puram', description: 'Chennai\'s most loved international café. Great food, wine, relaxed atmosphere. Popular with returning NRIs and expats.', nriRating: 94, priceRange: '₹₹₹', mustTry: 'Weekend brunch', tip: 'Book in advance for dinner. One of very few places in Chennai with good wine selection.', tags: ['NRI favourite', 'International', 'Wine'] },
  { name: 'Spencer\'s / Nature\'s Basket (Chennai)', city: 'che', category: 'grocery', subcategory: 'International', area: 'Anna Nagar / Nungambakkam', description: 'Spencer\'s has the best international section in Chennai. Good for Western imports, organic produce, health foods.', nriRating: 85, priceRange: '₹₹₹', tip: 'Anna Nagar Spencer\'s has widest international selection. Stock up on imported items here.', tags: ['International', 'NRI essential'] },
  // MUMBAI
  { name: 'Salt Water Café', city: 'mum', category: 'dining', subcategory: 'All Day Café', area: 'Bandra West', description: 'Most popular all-day café in Bandra. NRI returnees love it for the international café feel in the heart of Bandra.', nriRating: 93, priceRange: '₹₹₹', mustTry: 'Eggs Benedict, French toast', tip: 'Weekday mornings best — quiet and great for remote work too.', tags: ['NRI favourite', 'Café', 'Bandra'] },
  { name: 'Bastian Seafood', city: 'mum', category: 'dining', subcategory: 'Seafood', area: 'Bandra West', description: 'Best seafood restaurant in Mumbai. Celebrity frequented, Instagram famous. Book weeks in advance for weekend.', nriRating: 95, priceRange: '₹₹₹₹', mustTry: 'Prawn tempura, Lobster bisque', tip: 'Book 2 weeks ahead for weekends. Weekday lunch has shorter wait.', tags: ['Special occasion', 'Seafood', 'Premium'] },
  { name: 'Foodhall (Palladium, Lower Parel)', city: 'mum', category: 'grocery', subcategory: 'Premium International', area: 'Lower Parel', description: 'Best international grocery in Mumbai. Widest selection of imported goods, fresh deli, artisan breads, cheeses. Feels like a premium US grocery store.', nriRating: 96, priceRange: '₹₹₹', tip: 'Their cheese counter has over 80 varieties. Good for imported snacks kids will recognize.', tags: ['International', 'NRI essential', 'Premium'] },
  { name: 'Marine Drive / Nariman Point walk', city: 'mum', category: 'outdoors', subcategory: 'Waterfront', area: 'South Mumbai', description: 'The Queen\'s Necklace. Evening walk along the sea is uniquely Mumbai — nothing else like it. Take visiting family here first.', nriRating: 98, priceRange: '₹', tip: 'Sunsets are spectacular. Go on a weekday evening for peaceful experience.', tags: ['Free', 'Unique', 'Family', 'Iconic'] },
  { name: 'Gold\'s Gym (Bandra / Powai)', city: 'mum', category: 'fitness', subcategory: 'Gym', area: 'Multiple', description: 'US-origin gym brand. Familiar equipment, good facilities. Monthly membership much cheaper than US.', nriRating: 88, priceRange: '₹₹', tip: 'Annual membership ₹15,000–22,000. Multiple Mumbai locations. Same brand as your US gym likely.', tags: ['US brand', 'Gym', 'Convenient'] },
]

const STEPS = [
  { key: 'city', section: 'Your City', q: 'Which city are you in?', hint: 'We\'ll show the best places for NRI returnees', opts: [{ k: 'hyd', label: 'Hyderabad', sub: '' }, { k: 'blr', label: 'Bangalore', sub: '' }, { k: 'pun', label: 'Pune', sub: '' }, { k: 'che', label: 'Chennai', sub: '' }, { k: 'mum', label: 'Mumbai', sub: '' }] },
  { key: 'lifestyle', section: 'Your Life', q: 'Which best describes your lifestyle?', hint: 'We\'ll personalise recommendations', opts: [{ k: 'family', label: 'Family-focused', sub: 'Parks, kid activities, family restaurants' }, { k: 'social', label: 'Social & outgoing', sub: 'Restaurants, bars, events, meetups' }, { k: 'health', label: 'Health & fitness', sub: 'Gyms, outdoor, organic food, wellness' }, { k: 'work', label: 'Work-focused', sub: 'Co-working, networking, productivity' }, { k: 'culture', label: 'Arts & culture', sub: 'Museums, events, local experiences' }] },
  { key: 'foodPref', section: 'Your Life', q: 'What kind of food do you miss from the US?', hint: 'We\'ll show where to find international comfort food', opts: [{ k: 'american', label: 'Burgers, sandwiches, café food', sub: 'American comfort food' }, { k: 'international', label: 'International cuisine', sub: 'Italian, Mexican, Asian fusion' }, { k: 'healthy', label: 'Healthy / organic / vegan', sub: 'Clean eating, salads, smoothies' }, { k: 'indian_fine', label: 'Fine dining Indian', sub: 'Premium Indian restaurants' }, { k: 'all', label: 'Everything — show me all', sub: 'No preference' }] },
  { key: 'hasKids', section: 'Your Life', q: 'Do you have children?', hint: 'We\'ll include kid-friendly options', opts: [{ k: 'yes_young', label: 'Yes — young kids (under 10)', sub: 'Need kid-friendly venues' }, { k: 'yes_teen', label: 'Yes — teenagers', sub: 'Teen-friendly activities' }, { k: 'no', label: 'No kids', sub: 'Adult-focused recommendations' }] },
  { key: 'fitness', section: 'Your Life', q: 'What is your fitness routine?', hint: 'We\'ll match gym and outdoor recommendations', opts: [{ k: 'gym', label: 'Gym / weight training', sub: 'Traditional gym workout' }, { k: 'classes', label: 'Group fitness classes', sub: 'Yoga, HIIT, cycling, dance' }, { k: 'running', label: 'Running / cycling outdoors', sub: 'Parks, trails, open spaces' }, { k: 'sport', label: 'Team sports / racquet sports', sub: 'Cricket, tennis, badminton, football' }, { k: 'none', label: 'Not fitness-focused', sub: 'Skip fitness recommendations' }] },
  { key: 'social', section: 'Your Life', q: 'How do you want to meet people?', hint: 'Finding your community is the hardest part of returning', opts: [{ k: 'nri_groups', label: 'NRI returnee groups / meetups', sub: 'People who understand the transition' }, { k: 'professional', label: 'Professional networking', sub: 'Industry events, co-working spaces' }, { k: 'kids_parents', label: 'Through kids\' school / activities', sub: 'Parent community' }, { k: 'neighbourhood', label: 'Neighbourhood community', sub: 'Apartment complex events' }, { k: 'online', label: 'Online first — WhatsApp groups', sub: 'Start digitally before in-person' }] },
]

const CATEGORY_ICONS: Record<string, string> = { dining: '🍽️', grocery: '🛒', fitness: '💪', coworking: '💻', outdoors: '🌿', shopping: '🛍️', wellness: '🧘' }

export default function CityLifeGuide() {
  const [answers, setAnswers] = useState<Partial<Inputs>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ places: Place[]; communities: { name: string; platform: string; description: string; joinTip: string }[] } | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const step = STEPS[currentStep]
  const progress = Math.round((currentStep / STEPS.length) * 100)

  function pick(key: string, val: string) {
    const next = { ...answers, [key]: val }
    setAnswers(next)
    if (currentStep < STEPS.length - 1) setTimeout(() => setCurrentStep(s => s + 1), 280)
    else { setLoading(true); setTimeout(() => { setResult(compute(next as Inputs)); setLoading(false) }, 1200) }
  }

  function compute(I: Inputs) {
    let places = PLACES.filter(p => p.city === I.city)

    // Boost based on lifestyle
    places = places.map(p => {
      let score = p.nriRating
      if (I.lifestyle === 'family' && p.tags.includes('Family')) score += 10
      if (I.lifestyle === 'social' && (p.tags.includes('NRI favourite') || p.tags.includes('Nightlife'))) score += 10
      if (I.lifestyle === 'health' && (p.category === 'fitness' || p.tags.includes('Healthy'))) score += 10
      if (I.lifestyle === 'work' && p.category === 'coworking') score += 15
      if (I.fitness !== 'none' && p.category === 'fitness') score += 5
      if (I.hasKids !== 'no' && p.tags.includes('Family')) score += 8
      return { ...p, nriRating: Math.min(100, score) }
    }).sort((a, b) => b.nriRating - a.nriRating)

    const cityName = ({ hyd: 'Hyderabad', blr: 'Bangalore', pun: 'Pune', che: 'Chennai', mum: 'Mumbai' } as Record<string, string>)[I.city]

    const communities = [
      { name: `Returning NRIs ${cityName}`, platform: 'WhatsApp', description: 'The most active group for NRI returnees in your city — job leads, house hunting tips, school advice, social meetups.', joinTip: 'Search on LinkedIn or ask in ReturningNRIs community to get added' },
      { name: `${cityName} Expats & NRIs`, platform: 'Facebook Group', description: 'Longer-running group with a mix of expats and returnees. Good for recommendations and weekly events.', joinTip: `Search "Hyderabad Expats NRI" on Facebook — multiple groups exist` },
      { name: 'Internations', platform: 'App & Events', description: 'Global expat community with monthly events in all 5 cities. Good for meeting international crowd and professionals.', joinTip: 'internations.org — monthly official expat events in each city' },
      { name: `${cityName} Tech Returnees`, platform: 'LinkedIn Group', description: 'Tech professional returnees community. Job board, networking events, startup connections.', joinTip: 'Search LinkedIn Groups for your city + "returnee" or "NRI"' },
    ]

    return { places, communities }
  }

  function restart() { setAnswers({}); setCurrentStep(0); setResult(null); setLoading(false); setActiveCategory('all') }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '3px solid rgba(255,153,51,0.2)', borderTopColor: '#FF9933', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Curating your city guide...</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Personalising NRI-approved places for your lifestyle</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )

  if (result) {
    const cityNames: Record<string, string> = { hyd: 'Hyderabad', blr: 'Bangalore', pun: 'Pune', che: 'Chennai', mum: 'Mumbai' }
    const cityName = cityNames[answers.city || 'hyd']
    const categories = ['all', ...Array.from(new Set(result.places.map(p => p.category)))]
    const filtered = activeCategory === 'all' ? result.places : result.places.filter(p => p.category === activeCategory)

    return (
      <div style={{ background: 'var(--india-white)', minHeight: '100vh' }}>
        <div style={{ background: '#1A1208', padding: '4rem 2rem 3rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>City Life Guide — {cityName}</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.75rem)', color: '#fff', marginBottom: '0.75rem' }}>Your NRI life guide to {cityName}</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.75 }}>Where to eat, shop, work out, co-work, and meet your community — curated for returned NRIs, not tourists.</p>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem' }}>

          {/* CATEGORY FILTERS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontSize: '12px', fontWeight: 500, padding: '6px 14px', borderRadius: '100px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', background: activeCategory === cat ? 'var(--ink)' : 'var(--white)', color: activeCategory === cat ? '#fff' : 'var(--ink-muted)', border: activeCategory === cat ? 'none' : '0.5px solid var(--border)' }}>
                {cat === 'all' ? 'All' : `${CATEGORY_ICONS[cat] || '📍'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
              </button>
            ))}
          </div>

          {/* PLACES GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {filtered.map(place => (
              <div key={place.name} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '18px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{CATEGORY_ICONS[place.category] || '📍'}</div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>{place.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>📍 {place.area} · {place.priceRange}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem', color: '#FF9933' }}>{place.nriRating}</div>
                    <div style={{ fontSize: '9px', color: 'var(--ink-soft)' }}>NRI rating</div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6, flex: 1 }}>{place.description}</div>
                {place.mustTry && <div style={{ fontSize: '11px', background: '#FFF3E6', color: '#854F0B', padding: '4px 10px', borderRadius: '8px' }}>🌟 Must try: {place.mustTry}</div>}
                <div style={{ fontSize: '11px', background: 'var(--india-white)', color: 'var(--ink-muted)', padding: '6px 10px', borderRadius: '8px', lineHeight: 1.5 }}>💡 {place.tip}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {place.tags.map(tag => <span key={tag} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: 'var(--white)', border: '0.5px solid var(--border)', color: 'var(--ink-soft)' }}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* COMMUNITY SECTION */}
          <div style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Find Your Community in {cityName}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1rem' }}>
              {result.communities.map((c, i) => (
                <div key={i} style={{ background: 'var(--india-white)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{c.name}</div>
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: '#E8E8FF', color: '#0C447C', fontWeight: 600 }}>{c.platform}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '8px' }}>{c.description}</div>
                  <div style={{ fontSize: '11px', color: '#FF9933', fontWeight: 500 }}>→ {c.joinTip}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1A1208', borderRadius: '20px', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>Looking for career opportunities in {cityName}?</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Check the Job & Career Transition guide — salary benchmarks, top companies, and remote work strategy.</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/jobs" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>Career guide →</Link>
              <button onClick={restart} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.75rem 1.5rem', fontSize: '13px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}>New search</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1A1208', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,153,51,0.15)', border: '0.5px solid rgba(255,153,51,0.3)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
          <span style={{ fontSize: '11px', fontWeight: 500, color: '#FF9933', letterSpacing: '0.08em' }}>City Life Guide · Free · {STEPS.length} questions</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '0.5rem' }}>Feel at home from day one</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem' }}>Where to eat, work out, buy international groceries, co-work, and find your NRI community — curated by returnees, for returnees.</p>
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