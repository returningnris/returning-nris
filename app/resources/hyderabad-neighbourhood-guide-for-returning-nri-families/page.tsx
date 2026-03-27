import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hyderabad Neighbourhood Guide for Returning NRI Families (2026)',
  description:
    'Compare Hyderabad micro-markets for returning NRI families. Review prices, commute, schools, airport access, NRI community, and which zone best fits your family.',
  openGraph: {
    title: 'Hyderabad Neighbourhood Guide for Returning NRI Families (2026)',
    description:
      'A practical Hyderabad micro-market guide covering five key zones for returning NRI families.',
    url: 'https://www.returningnris.com/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
    type: 'article',
  },
  alternates: {
    canonical:
      'https://www.returningnris.com/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
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
    name: 'West Core',
    title: 'Hitech City / Financial District / Narsingi / Kokapet',
    accent: '#0E6BA8',
    bg: '#EEF7FD',
    quote: "Your kids will have friends before you've finished unpacking.",
    bestFor: 'Dual-income IT families who want the easiest landing and the strongest NRI support ecosystem.',
    shines: [
      'Largest NRI and expat community in Hyderabad, especially inside large gated communities.',
      'Best concentration of IB, Cambridge, and strong CBSE schools in a tight radius.',
      'Top hospitals, IT offices, dining, malls, and service providers are all close by.',
    ],
    watchouts: [
      'Peak-hour traffic is genuinely frustrating in the core western corridor.',
      'This is the most expensive zone in the guide, with premium pricing across good projects.',
      'Some older pockets feel dense, busy, and construction-heavy.',
    ],
  },
  {
    name: 'Tellapur',
    title: 'Tellapur / Osman Nagar',
    accent: '#2D6A4F',
    bg: '#ECF7F0',
    quote: "You finally feel like you have breathing room, and you didn't give up the city.",
    bestFor: 'Remote-first or hybrid families who want greenery, newer projects, and long-term upside.',
    shines: [
      'The Nallagandla-Tellapur flyover materially improved Gachibowli access.',
      'Cleaner air, lower density, and a quieter suburban feel than the western core.',
      'Strong IB and Cambridge options with better space value than Kokapet or Narsingi.',
    ],
    watchouts: [
      'Premium social infrastructure is still catching up and often requires a drive.',
      'Water reliability varies by pocket, especially in standalone villa clusters.',
      'Metro connectivity is still future-facing rather than available today.',
    ],
  },
  {
    name: 'Bachupally',
    title: 'Kukatpally / Miyapur / Bachupally',
    accent: '#7B3F00',
    bg: '#F9EFE7',
    quote: "Bachupally parents don't worry about school. That's solved on day one.",
    bestFor: 'School-first families and budget-conscious buyers who still want real urban convenience.',
    shines: [
      'Exceptional school density, especially around Bachupally, with respected international options.',
      'Red Line metro gives this zone a predictable commute advantage for many routes.',
      'Strong value for money compared to west Hyderabad premium zones.',
    ],
    watchouts: [
      'Road commutes to the IT belt can still get painful on NH65 during peak hours.',
      'Summer water shortages are real in parts of Bachupally.',
      'The NRI community is smaller, so the social transition may feel more local than expat-heavy.',
    ],
  },
  {
    name: 'Airport Side',
    title: 'Rajendranagar / Kismatpur / Tukkuguda',
    accent: '#6B3FA0',
    bg: '#F3ECFA',
    quote: 'Ten minutes to the airport stops feeling like a small thing very quickly.',
    bestFor: 'Frequent flyers, villa seekers, and families willing to make a contrarian long-term bet.',
    shines: [
      'Airport access is dramatically better than every other zone in this guide.',
      'Lower-density, greener surroundings create a calmer feel than the western corridor.',
      'Future upside may improve if the planned south-side IT expansion materializes.',
    ],
    watchouts: [
      'No metro, so daily life is car-dependent.',
      'School choice is noticeably thinner than West Core or Tellapur.',
      'The informal NRI support network is still limited here.',
    ],
  },
  {
    name: 'Kompally',
    title: 'Kompally / Gandimaisamma',
    accent: '#0E7C7B',
    bg: '#EAF7F6',
    quote: "The city exists. It just doesn't insist on itself all day.",
    bestFor: 'Families looking for a slower pace, more space, and a calmer long-haul lifestyle.',
    shines: [
      'Lower density, more greenery, and a semi-rural feel many families genuinely enjoy.',
      'Solid school fundamentals and good value in villas or plotted developments.',
      'One of the most peaceful zones in the city for a 10-year-plus horizon.',
    ],
    watchouts: [
      'Daily commute to the western IT corridor is real and accumulates over time.',
      'The NRI community presence is still small and less organic.',
      'Premium dining and cosmopolitan lifestyle amenities are farther away.',
    ],
  },
]

const compareRows = [
  ['Average price / sq ft', 'Rs.8,500-Rs.11,000+', 'Rs.7,500-Rs.9,000', 'Rs.6,000-Rs.8,000', 'Rs.4,500-Rs.7,700', 'Rs.5,500-Rs.7,000'],
  ['Typical 3BHK budget', 'Rs.2 Cr-Rs.5 Cr+', 'Rs.1.5 Cr-Rs.3.5 Cr', 'Rs.90L-Rs.2.5 Cr', 'Rs.70L-Rs.2 Cr', 'Rs.80L-Rs.2 Cr'],
  ['IT hub commute', 'On doorstep', '15-25 min via ORR', 'Metro plus 20 min drive', '25-40 min via ORR', '35-50 min via ORR or NH44'],
  ['Metro access', 'Raidurg and Hitech City nearby', 'MMTS today, metro later', 'Best current metro access', 'No metro', 'Future phase may help'],
  ['Airport access', '35-50 min', '35-45 min', '40-50 min', '5-15 min', '40-55 min'],
  ['International schools', 'Best density', 'Very strong and improving', 'Strong in Bachupally cluster', 'Limited choice', 'Solid but not broad'],
  ['CBSE ecosystem', 'Strong', 'Growing', 'Best density', 'Improving', 'Strong'],
  ['NRI community', 'Largest in Hyderabad', 'Fast-growing', 'Moderate', 'Small', 'Small'],
  ['Air quality and greenery', 'Urban', 'Best in guide', 'Mixed suburban', 'Semi-rural and greener', 'Low-density and cleaner'],
  ['Hospitals', 'Best access', 'Very good', 'Very good', 'Adequate', 'Good'],
  ['Lifestyle and malls', 'Best dining and mall access', 'Still catching up', 'Strong mid-market convenience', 'Limited', 'Moderate'],
  ['Appreciation outlook', '10-15%', '15-20%', '10-14%', '15-20%', '9-12%'],
  ['Rental yield', '4-6%', '3.5-4.5%', '3-4%', '3-4%', '3-4%'],
  ['Best for', 'Easy NRI landing', 'Hybrid life plus space', 'Schools plus value', 'Airport-heavy routines', 'Quiet long-term living'],
]

const honestTakeCards = [
  [
    'If both adults work in IT and your kids are under 12',
    'West Core is still the safest answer. It costs more, but the hidden social support in year one is hard to replicate elsewhere.',
  ],
  [
    'If one or both of you work from home',
    'Tellapur deserves a serious look because the newer road connectivity changed the trade-off meaningfully.',
  ],
  [
    'If budget is the first filter and schools matter above all',
    'Bachupally stays very compelling because the school ecosystem is unusually dense for the price.',
  ],
  [
    'If air travel is a constant part of life',
    'Airport Side makes more sense than most families assume, because airport proximity compounds into a major quality-of-life advantage.',
  ],
  [
    'If you want a slower chapter with space and calm',
    'Kompally offers something the western corridor rarely can anymore: quiet that actually feels durable.',
  ],
]

export default function HyderabadNeighbourhoodGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Hyderabad Neighbourhood Guide for Returning NRI Families (2026)',
            description:
              'A practical Hyderabad micro-market guide covering five key zones for returning NRI families.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-03-27',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/hyderabad-neighbourhood-guide-for-returning-nri-families',
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
            <span style={{ color: '#6B5E50' }}>Hyderabad Neighbourhood Guide</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#E8F5E8', color: '#138808', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Housing</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>11 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated March 2026</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>5 micro-markets</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,5vw,2.95rem)', color: '#1A1208', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Which Part of Hyderabad
            <br />
            Should You Call Home?
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#6B5E50', lineHeight: 1.76, marginBottom: 0, maxWidth: '700px' }}>
            A practical neighbourhood guide for returning NRI families comparing Hyderabad&apos;s five most relevant micro-markets across commute, schools, price, community, and day-to-day life.
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
                <strong>Choose West Core</strong>
                <span>if you want the easiest first year back, the biggest NRI support system, and the strongest all-round convenience.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Tellapur</strong>
                <span>if hybrid work, cleaner air, and long-term upside matter more than living inside the western core.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Bachupally</strong>
                <span>if school access and value matter most, and you are comfortable with a more local social ecosystem.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Airport Side or Kompally</strong>
                <span>only when airport access, space, or a slower lifestyle clearly outweigh the weaker support network.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            Most returning NRI families start with property portals, budget filters, and a long list of apartments. Then the city overwhelms them. After a few weekends of driving around, they either overpay in the first premium cluster they visit or fall back to whichever area a relative recommends.
          </p>
          <p style={pStyle}>
            The problem is that neighbourhood choice shapes your first year back more than almost any other housing decision. It affects your commute, your child&apos;s social landing, school access, hospital access, and how supported or isolated daily life feels.
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
                  <th>West Core</th>
                  <th>Tellapur</th>
                  <th>Bachupally</th>
                  <th>Airport Side</th>
                  <th>Kompally</th>
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
                <div className="stack-row"><strong>West Core</strong><span>{row[1]}</span></div>
                <div className="stack-row"><strong>Tellapur</strong><span>{row[2]}</span></div>
                <div className="stack-row"><strong>Bachupally</strong><span>{row[3]}</span></div>
                <div className="stack-row"><strong>Airport Side</strong><span>{row[4]}</span></div>
                <div className="stack-row"><strong>Kompally</strong><span>{row[5]}</span></div>
              </div>
            ))}
          </div>
          <div style={{ background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '14px', padding: '1rem 1.15rem', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B5E50', lineHeight: 1.65 }}>
              These comparisons are relative to one another within Hyderabad. Price ranges are indicative for 2025-26 and should always be cross-checked with current project-level data before you commit.
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
              Rent for at least six months before you buy. Every zone has micro-pockets that look similar on a portal but feel completely different once you live nearby, test the school run, and walk the area on a Sunday evening.
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
            The right Hyderabad zone is rarely just a real-estate decision. It is commute, school geography, social landing, and family rhythm all combined.
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
                ['/city', 'City Match', 'See how Hyderabad compares to other return cities'],
                ['/resources/gated-community-flat-vs-suburb-villa-for-returning-nris', 'Flat vs Villa Guide', 'Decide what kind of home fits your next chapter'],
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
            Price data and appreciation commentary are indicative for 2025-26 based on public market references. Appreciation is not guaranteed. Verify projects and approvals independently before any purchase decision.
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
