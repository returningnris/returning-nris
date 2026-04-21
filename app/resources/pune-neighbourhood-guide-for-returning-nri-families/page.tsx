import Link from 'next/link'
import type { Metadata } from 'next'
import ResourceComments from '../../../components/ResourceComments'

const ARTICLE_SLUG = 'pune-neighbourhood-guide-for-returning-nri-families'

export const metadata: Metadata = {
  title: 'Pune Neighbourhood Guide for Returning NRI Families (2026)',
  description:
    'Compare Pune micro-markets for returning NRI families. Review Baner, Kharadi, Koregaon Park, Hinjewadi, Undri, schools, commute, airport access, and what each zone fits best.',
  openGraph: {
    title: 'Pune Neighbourhood Guide for Returning NRI Families (2026)',
    description:
      'A practical Pune neighbourhood guide covering five high-relevance zones for returning NRI families.',
    url: 'https://www.returningnris.com/resources/pune-neighbourhood-guide-for-returning-nri-families',
    type: 'article',
  },
  alternates: {
    canonical:
      'https://www.returningnris.com/resources/pune-neighbourhood-guide-for-returning-nri-families',
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
    name: 'Baner / Balewadi / Wakad',
    accent: '#0E6BA8',
    bg: '#EEF7FD',
    quote: "Friday evening at Balewadi High Street feels like the Pune you dreamed of moving back to.",
    bestFor:
      'IT families who want the easiest first year back, the strongest NRI community, and west Pune convenience.',
    shines: [
      'Balewadi High Street gives this zone Pune’s strongest dining and social strip.',
      'The Pink Line should materially improve Baner-Balewadi to Hinjewadi commuting once it opens.',
      'The returning-NRI peer group is deeper here than anywhere else in Pune.',
    ],
    watchouts: [
      'Until the metro is fully working, Hinjewadi junction stress is still very real.',
      'Pricing has already moved up sharply, especially in Balewadi premium projects.',
      'Airport access is workable, but not painless for frequent flyers.',
    ],
  },
  {
    name: 'Kharadi / Viman Nagar / Kalyani Nagar',
    accent: '#2D6A4F',
    bg: '#ECF7F0',
    quote: 'Your airport ride is short, your office can be close, and your weekend retail is already solved.',
    bestFor:
      'Families anchored to east Pune, frequent flyers, and those who want polished urban convenience near the airport.',
    shines: [
      'No other zone in this guide matches its airport proximity.',
      'Hospitals, Phoenix Marketcity, and east Pune office access all stack up well here.',
      'The school ecosystem is strong, especially around Kalyani Nagar and Viman Nagar.',
    ],
    watchouts: [
      'The best pockets can get almost as expensive as old Pune premium zones.',
      'Infrastructure quality varies inside Kharadi more than first-time buyers expect.',
      'If both adults work in west Pune, the commute tax compounds quickly.',
    ],
  },
  {
    name: 'Koregaon Park / Aundh / Kothrud',
    accent: '#7B3F00',
    bg: '#F9EFE7',
    quote: "Your children grow up with tree-lined roads, old Pune institutions, and a city that feels lived in, not assembled.",
    bestFor:
      'Families who want old Pune culture, elite hospital density, and a premium but rooted city lifestyle.',
    shines: [
      'This is the strongest answer for people who want Pune the city, not just Pune the IT corridor.',
      'Hospital access is unmatched for families with elders or medical sensitivity.',
      'Metro access is stronger here than almost anywhere else in Pune.',
    ],
    watchouts: [
      'This is the most expensive lifestyle in the guide, often by a wide margin.',
      'Roads and lanes were not built for present-day traffic volumes.',
      'The NRI peer group exists, but it is not as automatically networked as Baner-Balewadi.',
    ],
  },
  {
    name: 'Hinjewadi / Punawale / Ravet',
    accent: '#6B3FA0',
    bg: '#F3ECFA',
    quote: 'You paid much less than Baner, the air is cleaner, and your office is still ten minutes away.',
    bestFor:
      'Budget-aware IT families, long-horizon buyers, and households that care about affordability plus future upside.',
    shines: [
      'This is the most yield-efficient and upside-heavy zone in the guide.',
      'Commute friction for Hinjewadi workers is much lower than in central-west Pune.',
      'Open land, lower density, and cleaner air make daily life feel easier.',
    ],
    watchouts: [
      'Social and lifestyle infrastructure still lags Baner, Kharadi, and Koregaon Park.',
      'The NRI support network is thinner and takes more effort to build.',
      'Specific micro-pockets can still feel isolated outside office hours.',
    ],
  },
  {
    name: 'Undri / Kondhwa / Hadapsar',
    accent: '#0E7C7B',
    bg: '#EAF7F6',
    quote: 'It is calmer, greener, cheaper, and much less in a hurry than the rest of the city.',
    bestFor:
      'Families who prioritize space, quiet, and affordability over direct west Pune access.',
    shines: [
      'The pace of life is slower and the budget-to-space ratio is dramatically better.',
      'Hadapsar and Magarpatta access gives south Pune workers a credible convenience story.',
      'It is one of the easiest zones for suburban-minded families to emotionally settle into.',
    ],
    watchouts: [
      'For Hinjewadi workers, this is the longest and most tiring commute in the guide.',
      'The NRI peer ecosystem is still thin compared with Baner or east Pune.',
      'Metro connectivity is still more future promise than present-day reality.',
    ],
  },
]

const compareRows = [
  ['Average price / sq ft (2026)', 'Rs.10,500-Rs.15,800', 'Rs.11,000-Rs.16,000', 'Rs.14,000-Rs.25,000+', 'Rs.7,000-Rs.9,500', 'Rs.5,500-Rs.8,000'],
  ['Typical 3BHK budget', 'Rs.1.8 Cr-Rs.4.5 Cr', 'Rs.2 Cr-Rs.5 Cr', 'Rs.3 Cr-Rs.10 Cr+', 'Rs.1.2 Cr-Rs.2.8 Cr', 'Rs.90L-Rs.2 Cr'],
  ['IT commute story', 'Best for west Pune and Hinjewadi-adjacent routines', 'Best for east Pune and EON IT Park', 'Mixed, depending on office location', 'Best for Hinjewadi workers', 'Best for Hadapsar-Magarpatta, weak for Hinjewadi'],
  ['Metro access', 'Pink Line should matter here the most', 'Aqua Line helps and Kharadi extension is approved', 'Strongest all-round metro access in Pune', 'Partial Pink Line upside', 'Weak for now; later upside only'],
  ['Airport access', '30-45 min', 'Strongest in guide', '25-35 min', '35-50 min', '30-40 min'],
  ['International schools', 'Excellent', 'Excellent', 'Excellent', 'Developing', 'Decent but thinner'],
  ['CBSE ecosystem', 'Strong', 'Strong', 'Strong legacy cluster', 'Developing', 'Decent coverage'],
  ['NRI / expat community', 'Largest in Pune', 'Strong', 'Strong but less self-contained', 'Growing', 'Thin'],
  ['Gated community quality', 'Best branded gated inventory', 'Very strong and improving', 'Luxury-led and premium', 'Solid mid-premium townships', 'Functional but fewer standout names'],
  ['Air quality and greenery', 'Good', 'Good', 'Mixed but tree cover helps', 'Best in guide', 'Quiet and greener'],
  ['Hospitals', 'Very good', 'Excellent', 'Best in guide', 'Adequate inside zone', 'Adequate to good'],
  ['Lifestyle and retail', 'Best west-Pune lifestyle strip', 'Strong east retail and mall access', 'Best cafe and cultural life', 'Improving but still thinner', 'Adequate, not destination-led'],
  ['Traffic stress', 'Still painful until metro fully settles in', 'Reasonable by Pune standards', 'Old-city peak congestion is real', 'Better than Baner overall', 'Calmer than most of Pune'],
  ['Appreciation outlook', '10-14%', '8-12%', '7-10%', '18-25%', '8-12%'],
  ['Rental yield', '3.8-4.5%', '3.5-4.5%', '3-4%', 'Around 4.3% in stronger pockets', '3-3.5%'],
  ['Best for', 'Easy NRI landing', 'Airport-heavy east-Pune life', 'Premium old Pune living', 'Value plus IT access', 'Quiet affordable family life'],
]

const honestTakeCards = [
  [
    'If both of you work in Hinjewadi and the kids are under 12',
    'Baner or Balewadi is still the easiest first home because the commute, schools, and NRI support system align unusually well.',
  ],
  [
    'If one parent flies often or both roles are east-Pune heavy',
    'Viman Nagar or Kalyani Nagar is the rational answer because airport drag becomes exhausting very quickly over a year.',
  ],
  [
    'If your emotional picture of moving back is old Pune, not just a gated tower',
    'Koregaon Park or Aundh is worth serious weight even if the price hurts, because the city experience is genuinely different.',
  ],
  [
    'If budget is the honest constraint and one or both of you work in Hinjewadi',
    'Punawale or Ravet probably gives the cleanest trade: lower entry cost, cleaner air, and strong upside if the infrastructure story continues.',
  ],
  [
    'If calm matters more than social density',
    'Undri or Kondhwa can be the right choice, but only when your work geography supports it. A wrong commute turns a calm zone into a daily burden.',
  ],
]

const relatedLinks = [
  { href: '/housing', label: 'Housing Finder', sub: 'Compare areas and shortlist the right setup' },
  { href: '/schools', label: 'Schools Finder', sub: 'Check school clusters before locking the zone' },
  { href: '/planner', label: 'Return Planner', sub: 'Pressure-test whether the move timing is realistic' },
  {
    href: '/resources/gated-community-flat-vs-suburb-villa-for-returning-nris',
    label: 'Flat vs Villa Guide',
    sub: 'Decide what kind of home fits your first year back',
  },
]

export default function PuneNeighbourhoodGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Pune Neighbourhood Guide for Returning NRI Families (2026)',
            description:
              'A practical Pune neighbourhood guide covering five high-relevance zones for returning NRI families.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-04-02',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/pune-neighbourhood-guide-for-returning-nri-families',
          }),
        }}
      />

      <section
        style={{
          background: '#FFFFFF',
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
            <span style={{ color: '#6B5E50' }}>Pune Neighbourhood Guide</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#E8F5E8', color: '#138808', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Housing</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>12 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated April 2026</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>5 zones</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>17 parameters</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,5vw,2.95rem)', color: '#1A1208', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Which Part of Pune
            <br />
            Should You Call Home?
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#6B5E50', lineHeight: 1.76, marginBottom: 0, maxWidth: '720px' }}>
            Old Pune charm or new IT corridor? Metro-connected or airport-adjacent? Quiet suburb or Balewadi High Street on a Friday night? This guide compares the five Pune zones that matter most for returning NRI families.
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
                <strong>Choose Baner or Balewadi</strong>
                <span>if you want the easiest year-one landing, the strongest NRI peer group, and west-Pune convenience.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Viman Nagar or Kalyani Nagar</strong>
                <span>if airport access and east-Pune work geography matter enough to shape daily life.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Koregaon Park or Aundh</strong>
                <span>if you want Pune the city, not just Pune the IT corridor, and you can absorb the premium.</span>
              </div>
              <div className="quick-card">
                <strong>Choose Punawale or Ravet</strong>
                <span>if budget, cleaner air, and Hinjewadi access matter more than immediate social density.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            Pune is the easiest city in this housing-guide series to fall in love with. The weather is better than most Indian metros, the scale is more manageable than Bangalore or Mumbai, and even a &quot;long&quot; commute in Pune usually still feels human by metro standards.
          </p>
          <p style={pStyle}>
            But returning NRI families need to understand one structural truth before they shortlist anything: Pune has two personalities. There is new Pune, built around IT parks, expressways, and large gated communities. And there is old Pune, built around culture, colleges, legacy institutions, and neighbourhoods that feel rooted rather than assembled.
          </p>
          <p style={pStyle}>
            Those two versions of the city are not just aesthetic differences. They change your school geography, commute, hospital access, social landing, and how emotionally easy the first year back feels. That is why zone choice should come before detailed apartment filtering, not after it.
          </p>

          <h2 style={h2Style}>The Five Pune Zones That Actually Matter</h2>
          <div className="zone-grid">
            {zoneCards.map((zone) => (
              <div key={zone.name} className="zone-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', padding: '5px 10px', background: zone.bg, color: zone.accent, fontSize: '11px', fontWeight: 700 }}>
                    {zone.name}
                  </span>
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

          <h2 style={h2Style}>Side-by-Side: Every Parameter That Matters</h2>
          <p style={pStyle}>
            Families usually over-focus on listing price and under-focus on what the zone will do to their week. The comparison below is meant to rebalance that. If you are also evaluating schools or city fit, it helps to cross-check this with the <Link href="/schools" style={{ color: '#CC7A00', textDecoration: 'none' }}>Schools Finder</Link> and the <Link href="/planner" style={{ color: '#CC7A00', textDecoration: 'none' }}>Return Planner</Link>.
          </p>
          <div className="table-shell">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Baner / Balewadi / Wakad</th>
                  <th>Kharadi / Viman Nagar / Kalyani Nagar</th>
                  <th>Koregaon Park / Aundh / Kothrud</th>
                  <th>Hinjewadi / Punawale / Ravet</th>
                  <th>Undri / Kondhwa / Hadapsar</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 style={h2Style}>The Honest Take We Would Give a Friend</h2>
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
              Rent first if you can. Pune zones look coherent on a portal, but the lived reality changes sharply by micro-pocket, school route, and weekend rhythm. Six months of real life usually teaches more than forty listing visits.
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
            The right Pune zone is rarely just a real-estate decision. It is commute, school geography, support network, and family rhythm combined.
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
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              Related Resources
            </div>
            <div className="guide-grid">
              {relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '0.9rem 1rem', textDecoration: 'none' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#FFF3E6', color: '#CC7A00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                    GO
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#B5A898' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#8B7F71', lineHeight: 1.7, marginTop: '1.5rem', marginBottom: 0 }}>
            Price data is indicative for 2025-26 based on public property portals and market reports. Metro timelines can move. Verify project approvals independently before any purchase decision.
          </p>
        </div>
      </article>

      <ResourceComments articleSlug={ARTICLE_SLUG} />

      <div style={{ height: '2rem', background: '#fff' }} />

      <style>{`
        .guide-grid, .zone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .zone-grid {
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }
        .quick-card, .honest-card, .zone-card {
          background: #fff;
          border: 1px solid #E5E1DA;
          border-radius: 16px;
          padding: 1rem 1.05rem;
        }
        .quick-card strong, .honest-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #1A1208;
          line-height: 1.45;
          margin-bottom: 0.35rem;
        }
        .quick-card span, .honest-copy {
          font-size: 13px;
          color: #6B5E50;
          line-height: 1.65;
        }
        .zone-columns {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.9rem;
        }
        .zone-subhead {
          font-size: 12px;
          font-weight: 700;
          color: #1A1208;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }
        .zone-list {
          margin: 0;
          padding-left: 1rem;
          color: #3D3229;
        }
        .zone-list li {
          font-size: 13px;
          line-height: 1.65;
          margin-bottom: 0.45rem;
        }
        .zone-list-warn li {
          color: #6B5E50;
        }
        .table-shell {
          overflow-x: auto;
          border: 1px solid #E5E1DA;
          border-radius: 16px;
          background: #fff;
        }
        .compare-table {
          width: 100%;
          border-collapse: collapse;
        }
        .compare-table th,
        .compare-table td {
          font-size: 13px;
          line-height: 1.55;
          color: #3D3229;
          padding: 0.85rem 0.9rem;
          border-bottom: 1px solid #EDE8DF;
          vertical-align: top;
          min-width: 160px;
        }
        .compare-table th {
          background: #F8F5F0;
          color: #1A1208;
          font-weight: 700;
          text-align: left;
          position: sticky;
          top: 0;
        }
        .compare-table th:first-child,
        .compare-table td:first-child {
          min-width: 170px;
          font-weight: 700;
          color: #1A1208;
          background: #FFFCF8;
        }
        @media (max-width: 640px) {
          .zone-grid {
            grid-template-columns: 1fr;
          }
          .compare-table th,
          .compare-table td {
            min-width: 220px;
          }
        }
      `}</style>
    </>
  )
}
