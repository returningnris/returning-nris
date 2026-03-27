import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bangalore Neighbourhood Guide for Returning NRI Families (2026)',
  description:
    'Compare Bangalore micro-markets for returning NRI families. Review prices, commute, schools, airport access, metro, community, and which zone best fits your family.',
  openGraph: {
    title: 'Bangalore Neighbourhood Guide for Returning NRI Families (2026)',
    description:
      'A practical Bangalore micro-market guide covering five key zones for returning NRI families.',
    url: 'https://www.returningnris.com/resources/bangalore-neighbourhood-guide-for-returning-nri-families',
    type: 'article',
  },
  alternates: {
    canonical:
      'https://www.returningnris.com/resources/bangalore-neighbourhood-guide-for-returning-nri-families',
  },
}

const prose: React.CSSProperties = {
  maxWidth: '760px',
  margin: '0 auto',
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1208',
  lineHeight: 1.8,
}

const h2Style: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(1.4rem,3vw,1.8rem)',
  color: '#1A1208',
  marginTop: '2.5rem',
  marginBottom: '0.85rem',
  lineHeight: 1.2,
}

const pStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#3D3229',
  lineHeight: 1.82,
  marginBottom: '1rem',
}

const zoneCards = [
  {
    name: 'Whitefield',
    title: 'Whitefield / ORR East',
    accent: '#0E6BA8',
    bg: '#EEF7FD',
    quote:
      "Your child will have a cricket team, a Netflix-watching friend, and a tutor who speaks their language before the boxes are unpacked.",
    bestFor:
      'Dual-income IT families who want the easiest first-year landing and the deepest NRI community.',
    shines: [
      'The strongest returning-NRI and expat ecosystem in Bangalore, especially inside large gated communities.',
      'Excellent spread of CBSE, Cambridge, and international school options within a tight radius.',
      'Strong hospital access, mature retail, and the deepest rental demand in east Bangalore.',
    ],
    watchouts: [
      'ORR and Whitefield traffic remain genuinely punishing, especially for Bellandur-facing commutes.',
      'Premium projects are expensive and the pricing curve is already mature.',
      'Airport access is the weakest among the five zones for regular flyers.',
    ],
  },
  {
    name: 'Sarjapur',
    title: 'Sarjapur Road',
    accent: '#2D6A4F',
    bg: '#ECF7F0',
    quote:
      "Same schools. Same salary. Twenty percent more house. And Saturday mornings that don't feel like a commute.",
    bestFor:
      'School-first families, hybrid workers, and buyers who want more space without giving up access to the ORR.',
    shines: [
      'Best IB and Cambridge school density in the city, with several genuinely global-school options.',
      'Usually more value and more space than Whitefield at the same budget.',
      'Lower-density feel with meaningful appreciation upside if metro execution stays on track.',
    ],
    watchouts: [
      'Still highly car-dependent today, because the future metro is not the current metro.',
      'Airport access is the longest of any zone in this guide.',
      'Connector-road congestion remains a real daily-life issue in several pockets.',
    ],
  },
  {
    name: 'North Bangalore',
    title: 'North Bangalore - Hebbal / Yelahanka / Devanahalli',
    accent: '#7B3F00',
    bg: '#F9EFE7',
    quote:
      'The families who moved here in 2022 are now watching their decision look very smart.',
    bestFor:
      'Frequent flyers, long-horizon buyers, and families who care about cleaner air and future infrastructure.',
    shines: [
      'Airport-side connectivity and infrastructure spending create the strongest long-term upside story.',
      'Yelahanka offers a calmer pace, better air, and strong family liveability compared to the ORR core.',
      'Pricing can still undercut east Bangalore premium zones for comparable project quality.',
    ],
    watchouts: [
      'Daily commute to the ORR tech belt can still be a major tax on your week.',
      'Devanahalli social infrastructure is still catching up to the brochure story.',
      'Some Hebbal premium pockets are approaching Whitefield pricing without Whitefield-level social density.',
    ],
  },
  {
    name: 'South Bangalore',
    title: 'South Bangalore - Bannerghatta / Electronic City / Kanakapura',
    accent: '#6B3FA0',
    bg: '#F3ECFA',
    quote:
      'The families here got 30 percent more house for the same money, and two of them just got a direct metro to work.',
    bestFor:
      'Budget-sensitive families, Electronic City workers, and buyers who want metro-linked value plus more livable space.',
    shines: [
      'Yellow and Green Line connectivity changed the calculus for several south-side routines.',
      'The strongest affordability story in this guide while still offering real amenities.',
      'Greener stretches and better weekend breathing room than the ORR core.',
    ],
    watchouts: [
      'The NRI and expat support ecosystem is thinner than Whitefield or Sarjapur.',
      'Bannerghatta Road traffic is still sticky in the wrong stretches.',
      'Airport runs remain long, especially if international travel is frequent.',
    ],
  },
  {
    name: 'ORR Core',
    title: 'ORR Core - Koramangala / HSR / Bellandur',
    accent: '#0E7C7B',
    bg: '#EAF7F6',
    quote:
      "You know exactly who you are if you're choosing this zone, and you're probably right.",
    bestFor:
      'Urban professionals who want walkability, dense lifestyle options, and proximity to the city&apos;s professional core.',
    shines: [
      'Best urban lifestyle, dining, and startup-network density in Bangalore.',
      'Strong metro access and the easiest no-car or low-car lifestyle in this guide.',
      'Excellent resale liquidity and premium rental demand.',
    ],
    watchouts: [
      'Silk Board and surrounding congestion are every bit as bad as the city&apos;s reputation suggests.',
      'This is the most expensive square-footage trade-off in the guide.',
      'Green space and air quality are the weakest of the five zones.',
    ],
  },
]

const compareRows = [
  ['Average price / sq ft', 'Rs.9,000-Rs.15,000', 'Rs.8,000-Rs.12,000', 'Rs.7,000-Rs.13,000', 'Rs.5,500-Rs.10,500', 'Rs.11,000-Rs.18,000+'],
  ['Typical 3BHK budget', 'Rs.2 Cr-Rs.5 Cr+', 'Rs.1.5 Cr-Rs.4 Cr', 'Rs.1.2 Cr-Rs.4 Cr', 'Rs.90L-Rs.3 Cr', 'Rs.2.5 Cr-Rs.8 Cr+'],
  ['IT hub commute', 'On doorstep for east tech belt', '5-15 min to ORR in the right pockets', '20-50 min depending on job hub', 'Excellent for Electronic City, mixed elsewhere', 'Dead center of ORR for many firms'],
  ['Metro access', 'Purple Line already live', 'Future-facing, not current', 'Airport corridor story improving', 'Yellow and Green lines matter here', 'Best multi-line urban access'],
  ['Airport access', '45-60 min', '50-70 min', 'Best in guide', '45-60 min', '40-60 min'],
  ['International schools', 'Excellent density', 'Best density in guide', 'Strong but more spread out', 'Solid, not elite-heavy', 'Very strong urban mix'],
  ['CBSE ecosystem', 'Strong', 'Strong', 'Strong', 'Strong', 'Best concentration'],
  ['NRI community', 'Largest in Bangalore', 'Strong and growing', 'Moderate and growing', 'Moderate', 'Strong urban expat-professional mix'],
  ['Gated community quality', 'Top tier', 'Top tier', 'Very good', 'Good', 'Top tier but expensive'],
  ['Air quality and greenery', 'Mixed', 'Greener than core ORR', 'Best in guide', 'Strong in outer pockets', 'Weakest in guide'],
  ['Hospitals', 'Best east-side access', 'Very good', 'Very good', 'Very good', 'Best tertiary care access'],
  ['Lifestyle and retail', 'Excellent outside city core', 'Still catching up', 'Growing', 'Good south-side retail', 'Best in city'],
  ['Traffic stress', 'Severe', 'Manageable in pockets, still real', 'Moderate', 'Moderate', 'Worst in city'],
  ['Appreciation outlook', '12-13%', '13-18%', '15-20%', '8-12%', '10-14%'],
  ['Rental yield', '4.4-5%', '3-4.5%', '3-5%', '2.5-3.5%', '3.5-4.5%'],
  ['Best for', 'Easy NRI landing', 'School continuity and space', 'Airport-led long game', 'Affordable family living', 'Urban premium lifestyle'],
]

const honestTakeCards = [
  [
    'If both adults work in IT and your children are under 12',
    'Start in Whitefield. The community does a surprising amount of the emotional and practical work for you in year one.',
  ],
  [
    'If school continuity is the deciding factor',
    'Sarjapur is where Bangalore&apos;s strongest IB and Cambridge ecosystem lives, and that matters more than many families realize.',
  ],
  [
    'If you fly internationally often and want to think five years ahead',
    'North Bangalore deserves real weight because airport-side infrastructure is one of Bangalore&apos;s clearest structural shifts.',
  ],
  [
    'If budget is the honest constraint',
    'South Bangalore gives more home, better breathing room, and now real metro value without collapsing the family quality-of-life equation.',
  ],
  [
    'If you know you want dense urban energy',
    'ORR Core is the right answer only when you accept, upfront, that lifestyle gains are being purchased with congestion and price.',
  ],
]

export default function BangaloreNeighbourhoodGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Bangalore Neighbourhood Guide for Returning NRI Families (2026)',
            description:
              'A practical Bangalore micro-market guide covering five key zones for returning NRI families.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-03-27',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/bangalore-neighbourhood-guide-for-returning-nri-families',
          }),
        }}
      />

      <section
        style={{
          background: '#F8F5F0',
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)',
          padding: '4rem 2rem 3rem',
        }}
      >
        <div style={prose}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link>
            <span>&gt;</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link>
            <span>&gt;</span>
            <span style={{ color: '#6B5E50' }}>Bangalore Neighbourhood Guide</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#E8F5E8', color: '#138808', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Housing</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>12 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated March 2026</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>5 zones</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,5vw,2.95rem)', color: '#1A1208', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Which Part of Bangalore
            <br />
            Should You Call Home?
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#6B5E50', lineHeight: 1.76, marginBottom: 0, maxWidth: '700px' }}>
            A practical neighbourhood guide for returning NRI families comparing Bangalore&apos;s five most relevant micro-markets across commute, schools, price, community, and day-to-day life.
          </p>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={prose}>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.28)', borderRadius: '16px', padding: '1.5rem 1.6rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
              Quick Answer
            </div>
            <div className="guide-grid">
              <div className="quick-card">
                <strong>Choose Whitefield</strong>
                <span>if you want the easiest first year back, the densest NRI support system, and the broadest everyday convenience.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Sarjapur</strong>
                <span>if school continuity, more space, and long-term upside matter more than immediate metro access.</span>
              </div>
              <div className="quick-card">
                <strong>Choose North Bangalore</strong>
                <span>if airport access, cleaner air, and a five-year infrastructure bet matter more than ORR proximity.</span>
              </div>
              <div className="quick-card">
                <strong>Choose South Bangalore or ORR Core</strong>
                <span>only when budget or urban-lifestyle priorities clearly outweigh the social-density advantage of east Bangalore.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            Bangalore is the city many returning NRI families shortlist first, but the decision is often approached backwards. Families start with a cousin&apos;s recommendation, a branded gated community, or a school brochure, and only later realize that Bangalore neighbourhood choice is, above all else, a commute decision.
          </p>
          <p style={pStyle}>
            A five-kilometre mistake on the wrong side of Silk Board can easily reshape your mornings, your children&apos;s routines, and your sense of whether the city feels livable. That is why this guide treats neighbourhood selection as a family-rhythm decision, not just a real-estate search.
          </p>

          <h2 style={h2Style}>The Five Zones That Actually Matter</h2>
          <div className="zone-grid">
            {zoneCards.map((zone) => (
              <div key={zone.name} className="zone-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '5px 10px', background: zone.bg, color: zone.accent, fontSize: '11px', fontWeight: 700 }}>
                    {zone.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#B5A898' }}>{zone.title}</span>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#1A1208', lineHeight: 1.35, marginBottom: '0.55rem' }}>
                  {zone.quote}
                </div>
                <p style={{ ...pStyle, fontSize: '0.94rem' }}>
                  <strong>Best for:</strong> {zone.bestFor}
                </p>
                <div className="zone-columns">
                  <div>
                    <div className="zone-subhead">Where it shines</div>
                    <ul className="zone-list">
                      {zone.shines.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="zone-subhead">What to watch out for</div>
                    <ul className="zone-list zone-list-warn">
                      {zone.watchouts.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Side-by-Side Comparison</h2>
          <div className="table-shell">
            <table className="compare-table compare-table-wide">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Whitefield</th>
                  <th>Sarjapur</th>
                  <th>North Bangalore</th>
                  <th>South Bangalore</th>
                  <th>ORR Core</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                    <td>{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-stack">
            {compareRows.map((row) => (
              <div key={row[0]} className="stack-card">
                <div className="stack-title">{row[0]}</div>
                <div className="stack-row"><strong>Whitefield</strong><span>{row[1]}</span></div>
                <div className="stack-row"><strong>Sarjapur</strong><span>{row[2]}</span></div>
                <div className="stack-row"><strong>North Bangalore</strong><span>{row[3]}</span></div>
                <div className="stack-row"><strong>South Bangalore</strong><span>{row[4]}</span></div>
                <div className="stack-row"><strong>ORR Core</strong><span>{row[5]}</span></div>
              </div>
            ))}
          </div>
          <div style={{ background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '14px', padding: '1rem 1.15rem', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B5E50', lineHeight: 1.65 }}>
              These ratings are relative within Bangalore, not absolute. Price and infrastructure ranges are indicative for 2025-26 and should always be validated at the project and route level before you commit.
            </p>
          </div>

          <h2 style={h2Style}>The Honest Take</h2>
          <div className="guide-grid">
            {honestTakeCards.map((item) => (
              <div key={item[0]} className="honest-card">
                <div className="honest-title">{item[0]}</div>
                <div className="honest-copy">{item[1]}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#EEF7FD', border: '1px solid rgba(14,107,168,0.16)', borderRadius: '16px', padding: '1.2rem 1.3rem', marginTop: '2rem' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0E6BA8', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              One Universal Truth
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#2C4052', lineHeight: 1.7 }}>
              Bangalore traffic changes which side of the city makes sense more than budget, more than amenities, and often more than schools. Decide your commute geometry before you decide your neighbourhood.
            </p>
          </div>
        </div>
      </article>

      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Pair the neighbourhood with your school and housing shortlist
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.72, marginBottom: '1.75rem' }}>
            The right Bangalore zone is rarely just a real-estate decision. It is commute, school geography, social landing, and family rhythm all combined.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/housing" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,153,51,0.4)' }}>
              Explore housing
            </Link>
            <Link href="/schools" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}>
              Compare schools
            </Link>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2rem' }}>
        <div style={prose}>
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.8rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Related Resources
            </div>
            <div className="guide-grid">
              {[
                ['/housing', 'Housing Finder', 'Compare neighbourhoods and shortlist areas'],
                ['/schools', 'Schools Finder', 'Check school clusters before picking a zone'],
                ['/city', 'City Match', 'See how Bangalore compares to other return cities'],
                ['/resources/hyderabad-neighbourhood-guide-for-returning-nri-families', 'Hyderabad Guide', 'Compare Bangalore against Hyderabad&apos;s main micro-markets'],
              ].map((item) => (
                <Link key={item[0]} href={item[0]} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '0.9rem 1rem', textDecoration: 'none' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#FFF3E6', color: '#CC7A00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    GO
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>{item[1]}</div>
                    <div style={{ fontSize: '11px', color: '#B5A898' }}>{item[2]}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#8B7F71', lineHeight: 1.7, marginTop: '1.5rem', marginBottom: 0 }}>
            Price data is indicative for 2025-26 based on public market references. Appreciation is not guaranteed. Metro timelines can shift. Verify project approvals independently before any purchase decision.
          </p>
        </div>
      </article>

      <div style={{ height: '2rem', background: '#fff' }} />

      <style>{`
        .guide-grid, .zone-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:1rem;
        }
        .zone-grid {
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
        }
        .quick-card, .honest-card, .zone-card {
          background:#fff;
          border:1px solid #E5E1DA;
          border-radius:16px;
          padding:1rem 1.05rem;
        }
        .quick-card strong, .honest-title {
          display:block;
          font-size:13px;
          font-weight:700;
          color:#1A1208;
          line-height:1.45;
          margin-bottom:0.35rem;
        }
        .quick-card span, .honest-copy {
          font-size:13px;
          color:#6B5E50;
          line-height:1.65;
        }
        .zone-columns {
          display:grid;
          grid-template-columns:1fr;
          gap:0.9rem;
        }
        .zone-subhead {
          font-size:12px;
          font-weight:700;
          color:#1A1208;
          text-transform:uppercase;
          letter-spacing:0.06em;
          margin-bottom:0.5rem;
        }
        .zone-list {
          margin:0;
          padding-left:1rem;
          color:#3D3229;
        }
        .zone-list li {
          font-size:13px;
          line-height:1.65;
          margin-bottom:0.45rem;
        }
        .zone-list-warn li {
          color:#6B5E50;
        }
        .table-shell {
          overflow-x:auto;
          border:1px solid #E5E1DA;
          border-radius:16px;
          background:#fff;
        }
        .compare-table {
          width:100%;
          border-collapse:collapse;
        }
        .compare-table-wide {
          min-width:1040px;
        }
        .compare-table-slim {
          min-width:760px;
        }
        .compare-table th, .compare-table td {
          padding:0.95rem 0.9rem;
          border-bottom:1px solid #EDE8E1;
          text-align:left;
          vertical-align:top;
          font-size:13px;
          line-height:1.6;
          color:#3D3229;
        }
        .compare-table th {
          font-size:11px;
          font-weight:700;
          color:#6B5E50;
          text-transform:uppercase;
          letter-spacing:0.08em;
          background:#F8F5F0;
          white-space:nowrap;
        }
        .compare-table td:first-child {
          font-weight:600;
          color:#1A1208;
          width:22%;
        }
        .compare-table-wide th:first-child,
        .compare-table-wide td:first-child {
          position: sticky;
          left: 0;
          z-index: 1;
          background: #fff;
          box-shadow: 1px 0 0 #EDE8E1;
        }
        .compare-table-wide th:first-child {
          z-index: 2;
          background: #F8F5F0;
        }
        .mobile-stack {
          display:none;
        }
        .stack-card {
          border:1px solid #E5E1DA;
          border-radius:14px;
          padding:1rem;
          background:#fff;
        }
        .stack-title {
          font-size:13px;
          font-weight:700;
          color:#1A1208;
          margin-bottom:0.7rem;
        }
        .stack-row {
          display:flex;
          justify-content:space-between;
          gap:1rem;
          padding:0.45rem 0;
          border-top:1px solid #F0ECE6;
          font-size:12px;
          line-height:1.6;
          color:#6B5E50;
        }
        .stack-row:first-of-type {
          border-top:none;
          padding-top:0;
        }
        .stack-row strong {
          color:#1A1208;
          min-width:70px;
          flex-shrink:0;
        }
        @media (min-width: 768px) {
          .zone-columns {
            grid-template-columns:1fr 1fr;
          }
        }
        @media (max-width: 900px) {
          .table-shell {
            display:none;
          }
          .mobile-stack {
            display:flex;
            flex-direction:column;
            gap:0.85rem;
          }
        }
        @media (max-width: 640px) {
          .zone-grid {
            grid-template-columns:1fr;
          }
          .stack-row {
            flex-direction:column;
            gap:0.25rem;
          }
          .stack-row strong {
            min-width:0;
          }
        }
      `}</style>
    </>
  )
}
