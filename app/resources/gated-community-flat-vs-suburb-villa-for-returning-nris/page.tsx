import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gated Community Flat vs Suburb Villa for Returning NRIs (2026 Guide)',
  description:
    'Should returning NRI families choose a city flat or suburb villa in India? Compare commute, kids, privacy, domestic help, resale, and lifestyle at the Rs3-4 Cr budget range.',
  openGraph: {
    title: 'Gated Community Flat vs Suburb Villa for Returning NRIs (2026 Guide)',
    description:
      'A practical housing guide for returning NRIs comparing gated flats and suburb villas in metro India.',
    url: 'https://www.returningnris.com/resources/gated-community-flat-vs-suburb-villa-for-returning-nris',
    type: 'article',
  },
  alternates: {
    canonical:
      'https://www.returningnris.com/resources/gated-community-flat-vs-suburb-villa-for-returning-nris',
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

const compareRows = [
  ['Location', 'Inside city or inner ring road', 'Usually 8-15 km outside the city core'],
  ['Daily life', 'Managed, dense, social, convenient', 'Private, spacious, slower, quieter'],
  ['Kids under 12', 'Usually much easier socially', 'Needs more active planning'],
  ['Teenagers and WFH', 'Can feel crowded', 'Often a stronger fit'],
  ['Commute', 'Usually 10-30 minutes', 'Often 30-60+ minutes'],
  ['Domestic help and tutors', 'Easier to find and cheaper', 'Harder to find and often pricier'],
  ['Privacy and space', 'Limited private outdoor space', 'Much better privacy and usable space'],
  ['Resale and rental liquidity', 'Usually easier to resell or rent', 'Slower, more niche buyer pool'],
]

const decisionCards = [
  ['Kids under 10 and both parents working', 'Gated flat', 'The built-in social circle, shorter commute, and easier domestic setup matter more than extra space.'],
  ['Teenage kids or mostly work-from-home family', 'Suburb villa', 'Older children and remote-working adults usually benefit more from space and privacy.'],
  ['You want the smoothest first year back', 'Gated flat', 'It is the easier landing pad when everything else in life is changing at once.'],
  ['You feel drained by noise, crowds, and building politics', 'Suburb villa', 'The villa commute may still be worth it if mental calm is a top priority.'],
  ['You are not sure yet', 'Rent first', 'Many NRI families start in a flat for 1-2 years and only then buy a villa with more confidence.'],
]

const cityCards = [
  ['Bengaluru', 'Whitefield, Sarjapur, Bellandur work well for gated flats.', 'Villa options improve further out, but peak-hour traffic can be brutal.'],
  ['Mumbai', 'A gated flat is usually the cleaner answer at this budget.', 'Villas exist much farther out, which only works for WFH or semi-retired setups.'],
  ['Hyderabad', 'One of the best-value cities for both formats.', 'Suburban commutes are more manageable here than in many metros.'],
  ['Delhi NCR', 'Large societies in Gurgaon or Noida are usually the practical choice.', 'Villa budgets go further, but expressway commute fatigue is real.'],
  ['Chennai', 'Good city flat options in OMR and core family zones.', 'ECR-side villas can be attractive if commute patterns are controlled.'],
  ['Pune', 'Great gated communities for first-year returnees.', 'Spacious villas are possible if your office and school geography fits.'],
]

const kidsRows = [
  ['Under 6', 'Near-ideal. The society acts like a built-in playgroup.', 'Works best only if a parent is home and school is close.'],
  ['6 to 12', 'Usually the strongest flat age band.', 'Still possible, but parents must actively build the social calendar.'],
  ['13 to 17', 'Good, but peer environment varies a lot by society.', 'Often a better fit because teens value privacy and space.'],
  ['Parents only or empty nest', 'Convenient and easy to maintain.', 'Excellent if you want peace, a garden, and a slower pace.'],
]

export default function HousingGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Gated Community Flat vs Suburb Villa for Returning NRIs (2026 Guide)',
            description:
              'A practical housing guide for returning NRIs comparing gated flats and suburb villas in metro India.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-03-27',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/gated-community-flat-vs-suburb-villa-for-returning-nris',
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
            <span style={{ color: '#6B5E50' }}>Housing Guide</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#E8F5E8', color: '#138808', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Housing</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>8 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated March 2026</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Rs3-4 Cr metro budget</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,5vw,2.95rem)', color: '#1A1208', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            Gated Community Flat
            <br />
            vs Suburb Villa
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#6B5E50', lineHeight: 1.76, marginBottom: 0, maxWidth: '680px' }}>
            Same budget. Very different lives. This guide is really about what kind of first chapter back in India you want to create for your family.
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
                <strong>Start with a gated flat</strong>
                <span>if you have younger kids, daily office commutes, or want the easiest first year back in India.</span>
              </div>
              <div className="quick-card">
                <strong>Choose a suburb villa</strong>
                <span>if privacy, work-from-home comfort, quiet evenings, and usable space matter more than convenience.</span>
              </div>
              <div className="quick-card">
                <strong>Teenagers tilt the answer</strong>
                <span>toward villas more than young children do. Younger kids usually settle faster in large societies.</span>
              </div>
              <div className="quick-card">
                <strong>Unsure? Rent first.</strong>
                <span>Many returning NRI families use a flat as their transition home before deciding whether a villa really fits.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            At roughly Rs3-4 Cr, this is the housing budget where the fork in the road becomes real. Below that range in most metros, the villa conversation is often premature. Far above it, the villa starts to feel more obvious. But here, both options are truly viable, and that is exactly why the decision feels hard.
          </p>
          <p style={pStyle}>
            For returning NRIs, the choice carries extra weight. Your home is not just real estate. It becomes the place where your kids either settle quickly or feel isolated, where your commute either stays survivable or becomes exhausting, and where your first year back either feels manageable or constantly overstimulating.
          </p>

          <h2 style={h2Style}>What Life Are You Actually Buying?</h2>
          <div className="guide-grid">
            <div className="feature-card">
              <div className="feature-pill feature-pill-flat">Gated community flat</div>
              <h3 className="feature-title">Convenience, density, and social scaffolding</h3>
              <p className="feature-copy">
                The flat is the self-contained village option. Things work. Children find playmates fast. Tutors, domestic help, backup power, and everyday logistics are much easier to solve.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-pill feature-pill-villa">Suburb villa</div>
              <h3 className="feature-title">Space, privacy, and a calmer pace</h3>
              <p className="feature-copy">
                The villa is the lifestyle-upgrade option. You get quiet, distance from neighbours, better outdoor space, and a home that feels far less compressed, but you pay for that with commute and convenience.
              </p>
            </div>
          </div>

          <h2 style={h2Style}>Flat vs Villa, Side by Side</h2>
          <div className="table-shell">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Gated community flat</th>
                  <th>Suburb villa</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-stack">
            {compareRows.map((row) => (
              <div key={row[0]} className="stack-card">
                <div className="stack-title">{row[0]}</div>
                <div className="stack-row"><strong>Flat</strong><span>{row[1]}</span></div>
                <div className="stack-row"><strong>Villa</strong><span>{row[2]}</span></div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Where Flats Usually Win</h2>
          <p style={pStyle}>
            The biggest underappreciated advantage of a large gated society is social infrastructure. Kids find friends faster. Coaching teachers and activity providers often operate inside or around big communities. Domestic help is easier to source. Backup power and water are usually already solved. For a family adjusting to India again, that friction reduction matters.
          </p>
          <p style={pStyle}>
            Flats also tend to be the better transition home. They are easier to live in before you understand city geography fully, before you know which school zone truly fits, and before you discover how much commute you can actually tolerate.
          </p>

          <h2 style={h2Style}>Where Villas Usually Win</h2>
          <p style={pStyle}>
            Villas win on the things people feel every single day but rarely quantify in spreadsheets: privacy, quiet, air, and usable space. If you work from home, have older children, or simply know that noise and crowding drain you, the quality-of-life gain can be very real.
          </p>
          <p style={pStyle}>
            The trade-off is that villa life usually requires more active management. You handle more maintenance yourself, domestic help is less plug-and-play, and the social circle for younger kids does not build itself in the same way it does inside a dense apartment community.
          </p>

          <h2 style={h2Style}>The Kids Factor Changes the Answer</h2>
          <div className="table-shell">
            <table className="compare-table compare-table-small">
              <thead>
                <tr>
                  <th>Child age</th>
                  <th>Gated flat</th>
                  <th>Suburb villa</th>
                </tr>
              </thead>
              <tbody>
                {kidsRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-stack">
            {kidsRows.map((row) => (
              <div key={row[0]} className="stack-card">
                <div className="stack-title">{row[0]}</div>
                <div className="stack-row"><strong>Flat</strong><span>{row[1]}</span></div>
                <div className="stack-row"><strong>Villa</strong><span>{row[2]}</span></div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Quick Decision Check</h2>
          <div className="guide-grid">
            {decisionCards.map((item) => (
              <div key={item[0]} className="decision-card">
                <div className="decision-title">{item[0]}</div>
                <div className="decision-winner">{item[1]}</div>
                <div className="decision-copy">{item[2]}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>How the Picture Changes by City</h2>
          <div className="guide-grid">
            {cityCards.map((item) => (
              <div key={item[0]} className="feature-card">
                <div className="feature-title">{item[0]}</div>
                <p className="feature-copy" style={{ marginBottom: '0.55rem' }}>{item[1]}</p>
                <p className="feature-copy" style={{ marginBottom: 0 }}>{item[2]}</p>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>The Honest Take</h2>
          <p style={pStyle}>
            If you are returning with children under 12 and both parents are heading back into office-based routines, the gated flat is usually the better first move. It gives your family structure, a faster social landing, and fewer daily housing headaches.
          </p>
          <p style={pStyle}>
            If you work from home, have teenage children, or know that crowded apartment living will wear you down quickly, the villa deserves serious consideration, especially in cities like Hyderabad and Pune where the suburb trade-off is often more reasonable.
          </p>
          <p style={pStyle}>
            One practical middle path is the one many NRI families quietly take: start in a gated flat for the first one to two years, then move into a villa after your social network, commute realities, and school geography are clearer.
          </p>
        </div>
      </article>

      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Compare neighbourhoods before you commit to the format
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.72, marginBottom: '1.75rem' }}>
            The right answer is rarely just flat versus villa. It is city, school zone, commute pattern, and family stage all combined.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/housing" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,153,51,0.4)' }}>
              Explore housing
            </Link>
            <Link href="/city" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}>
              Compare cities
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
                ['/housing', 'Housing Finder', 'Compare neighbourhoods by city and lifestyle'],
                ['/city', 'City Match', 'Find the best city for your family profile'],
                ['/schools', 'Schools Finder', 'Check school geography before choosing a suburb'],
                ['/resources/nri-returning-to-india-checklist', 'NRI Return Checklist', '14-step planning guide'],
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
        </div>
      </article>

      <div style={{ height: '2rem', background: '#fff' }} />

      <style>{`
        .guide-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
        .quick-card, .feature-card, .decision-card {
          background:#fff;
          border:1px solid #E5E1DA;
          border-radius:16px;
          padding:1rem 1.05rem;
        }
        .quick-card strong, .feature-title, .decision-title {
          display:block;
          font-size:13px;
          font-weight:700;
          color:#1A1208;
          line-height:1.45;
          margin-bottom:0.35rem;
        }
        .quick-card span, .feature-copy, .decision-copy {
          font-size:13px;
          color:#6B5E50;
          line-height:1.65;
        }
        .feature-pill {
          display:inline-flex;
          align-items:center;
          border-radius:999px;
          padding:5px 10px;
          font-size:11px;
          font-weight:700;
          margin-bottom:0.8rem;
        }
        .feature-pill-flat { background:#E8F5E8; color:#138808; }
        .feature-pill-villa { background:#EEF2FF; color:#000080; }
        .decision-winner {
          display:inline-flex;
          align-items:center;
          border-radius:999px;
          padding:0.35rem 0.7rem;
          background:#FFF3E6;
          color:#CC7A00;
          font-size:11px;
          font-weight:700;
          margin-bottom:0.55rem;
        }
        .table-shell { overflow-x:auto; border:1px solid #E5E1DA; border-radius:16px; background:#fff; }
        .compare-table { width:100%; min-width:720px; border-collapse:collapse; }
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
        .mobile-stack { display:none; }
        .stack-card { border:1px solid #E5E1DA; border-radius:14px; padding:1rem; background:#fff; }
        .stack-title { font-size:13px; font-weight:700; color:#1A1208; margin-bottom:0.7rem; }
        .stack-row { display:flex; justify-content:space-between; gap:1rem; padding:0.45rem 0; border-top:1px solid #F0ECE6; font-size:12px; line-height:1.6; color:#6B5E50; }
        .stack-row:first-of-type { border-top:none; padding-top:0; }
        .stack-row strong { color:#1A1208; min-width:70px; flex-shrink:0; }
        @media (max-width: 900px) {
          .table-shell { display:none; }
          .mobile-stack { display:flex; flex-direction:column; gap:0.85rem; }
        }
        @media (max-width: 640px) {
          .stack-row { flex-direction:column; gap:0.25rem; }
          .stack-row strong { min-width:0; }
        }
      `}</style>
    </>
  )
}
