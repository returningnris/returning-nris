import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs (2026 Guide)',
  description:
    'Compare IB, Cambridge, CBSE, and ICSE for children of returning NRI families. Understand fees, fit, portability, and what makes sense for your child.',
  openGraph: {
    title: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs (2026 Guide)',
    description: 'A side-by-side school curriculum guide for families moving back to India.',
    url: 'https://www.returningnris.com/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
    type: 'article',
  },
  alternates: {
    canonical:
      'https://www.returningnris.com/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
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

const boards = [
  {
    name: 'CBSE',
    sub: 'National standard',
    accent: '#138808',
    bg: '#E8F5E8',
    body:
      'The most natural fit for families staying in India and for students who may pursue JEE, NEET, or other national entrance exams.',
  },
  {
    name: 'ICSE',
    sub: 'Rigorous Indian alternative',
    accent: '#CC7A00',
    bg: '#FFF3E6',
    body:
      'Known for stronger English and broader academic depth than CBSE, while still staying within Indian-board pricing and pathways.',
  },
  {
    name: 'Cambridge',
    sub: 'Flexible international path',
    accent: '#000080',
    bg: '#EEF2FF',
    body:
      'Usually the easiest bridge for children coming from British or American curriculum and for families likely to relocate again.',
  },
  {
    name: 'IB',
    sub: 'Holistic global programme',
    accent: '#8B1E3F',
    bg: '#FBEAF0',
    body:
      'The most research-heavy and globally recognized option, but also the highest cost and workload among the four boards.',
  },
]

const comparisons = [
  ['Teaching style', 'Structured, textbook-driven', 'Detailed, application-focused', 'Conceptual, subject-focused', 'Inquiry-based, research-heavy'],
  ['Subject flexibility', 'Fixed streams', 'Fixed streams with deeper content', 'Mix subjects freely', '6 groups across disciplines'],
  ['JEE / NEET alignment', 'Perfect fit', 'Good with some gap-fill', 'Needs coaching support', 'Large preparation gap'],
  ['Global portability', 'Low', 'Low', 'Very high', 'Very high'],
  ['Indian university entry', 'Seamless', 'Seamless', 'Accepted, may need equivalency', 'Accepted, check institution rules'],
  ['Typical annual fees', 'Rs80K to Rs2.5L', 'Rs80K to Rs2.5L', 'Rs3.5L to Rs10L', 'Rs5L to Rs22L'],
]

const feeCards = [
  ['CBSE', 'Rs80K to Rs2.5L', 'Best value for permanent-return families in Indian metros.'],
  ['ICSE', 'Rs80K to Rs2.5L', 'Similar fee band to CBSE, usually with stronger English-led positioning.'],
  ['Cambridge', 'Rs3.5L to Rs10L', 'More expensive, but often the smoothest transition from overseas curricula.'],
  ['IB', 'Rs5L to Rs22L', 'Highest-cost option, especially at Diploma level in top metro schools.'],
]

const profileCards = [
  [
    'Child was already in IB abroad',
    'Continue with IB if the budget is comfortable. Cambridge is the next best international bridge if not.',
  ],
  [
    'Child was in Cambridge or British curriculum abroad',
    'IGCSE and later A-Levels are usually the smoothest continuation available in India.',
  ],
  [
    'Child was in American curriculum abroad',
    'Cambridge or IB are the closest bridges. Avoid direct CBSE or ICSE entry at Grade 9 and above unless there is time to transition.',
  ],
  [
    'Family is staying in India permanently',
    'CBSE or ICSE usually make the most sense. Pick CBSE for engineering or medicine and ICSE for stronger English and broad academics.',
  ],
]

const mistakes = [
  'Choosing IB or Cambridge because they sound more international, not because they fit the child, budget, or likely college destination.',
  "Dismissing CBSE or ICSE as inferior because they're cheaper, when both remain strong options with the right school.",
  'Selecting the board before deciding whether the family is staying in India long term or may relocate again.',
]

export default function SchoolCurriculumGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs (2026 Guide)',
            description: 'A side-by-side school curriculum guide for families moving back to India.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-03-27',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
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
            <span style={{ color: '#6B5E50' }}>School Curriculum Guide</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#EEF2FF', color: '#000080', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Schools</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>9 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated March 2026</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem,5vw,2.95rem)', color: '#1A1208', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '1.2rem' }}>
            IB vs Cambridge vs CBSE vs ICSE
            <br />
            for Returning NRI Families
          </h1>
          <p style={{ fontSize: '1.08rem', color: '#6B5E50', lineHeight: 1.76, marginBottom: 0, maxWidth: '680px' }}>
            A side-by-side school board guide for parents moving back to India and trying to balance transition ease, fees, university goals, and long-term fit.
          </p>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={prose}>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.28)', borderRadius: '16px', padding: '1.5rem 1.6rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>
              Quick Answer
            </div>
            <div className="grid-two">
              <div className="quick-card"><strong>Choose CBSE</strong><span>if India is the long-term plan and JEE or NEET is even a possibility.</span></div>
              <div className="quick-card"><strong>Choose ICSE</strong><span>if you want stronger English and broad academics without international-school pricing.</span></div>
              <div className="quick-card"><strong>Choose Cambridge</strong><span>if your child is coming from an overseas curriculum or your family may move countries again.</span></div>
              <div className="quick-card"><strong>Choose IB</strong><span>if your child is already in IB and the workload plus fees are clearly acceptable.</span></div>
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            School choice is one of the highest-stakes decisions for returning NRI parents because it affects academic continuity, university pathways, and how disruptive the move feels for the child.
          </p>
          <p style={pStyle}>
            The right board is not the one that sounds most premium. It is the one that matches your child&apos;s current curriculum, your likely university destination, and your family&apos;s budget and mobility plans.
          </p>

          <h2 style={h2Style}>What Each Board Actually Is</h2>
          <div className="card-grid">
            {boards.map((board) => (
              <div key={board.name} style={{ background: '#fff', border: '1px solid #E5E1DA', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: board.bg, color: board.accent, borderRadius: '999px', padding: '5px 10px', fontSize: '11px', fontWeight: 700, marginBottom: '0.9rem' }}>
                  {board.name}
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.08rem', color: '#1A1208', marginBottom: '0.45rem' }}>{board.sub}</div>
                <p style={{ ...pStyle, fontSize: '0.95rem', marginBottom: 0 }}>{board.body}</p>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Side-by-Side Comparison</h2>
          <div className="table-shell">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>CBSE</th>
                  <th>ICSE</th>
                  <th>Cambridge</th>
                  <th>IB</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mobile-stack">
            {comparisons.map((row) => (
              <div key={row[0]} className="stack-card">
                <div className="stack-title">{row[0]}</div>
                <div className="stack-row"><strong>CBSE</strong><span>{row[1]}</span></div>
                <div className="stack-row"><strong>ICSE</strong><span>{row[2]}</span></div>
                <div className="stack-row"><strong>Cambridge</strong><span>{row[3]}</span></div>
                <div className="stack-row"><strong>IB</strong><span>{row[4]}</span></div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>What You&apos;ll Actually Pay in Metro India</h2>
          <div className="card-grid">
            {feeCards.map((item) => (
              <div key={item[0]} style={{ background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '16px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.7rem' }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.08rem', color: '#1A1208' }}>{item[0]}</div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#CC7A00', background: '#FFF3E6', borderRadius: '999px', padding: '0.35rem 0.7rem', whiteSpace: 'nowrap' }}>{item[1]}</span>
                </div>
                <p style={{ ...pStyle, fontSize: '0.93rem', marginBottom: 0 }}>{item[2]}</p>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFF3E6', border: '1px solid rgba(255,153,51,0.22)', borderRadius: '14px', padding: '1rem 1.15rem', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#7D5300', lineHeight: 1.65 }}>
              Ask every school for total cost of attendance, not just tuition. Registration, transport, activities, and IB exam-related fees can materially change the real number.
            </p>
          </div>

          <h2 style={h2Style}>Which Board Makes Sense for Returning NRIs?</h2>
          <div className="card-grid">
            {profileCards.map((item) => (
              <div key={item[0]} style={{ background: '#fff', border: '1px solid #E5E1DA', borderRadius: '16px', padding: '1.1rem 1.15rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1A1208', marginBottom: '0.45rem', lineHeight: 1.45 }}>{item[0]}</div>
                <div style={{ fontSize: '13px', color: '#6B5E50', lineHeight: 1.65 }}>{item[1]}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Three Mistakes Families Commonly Make</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mistakes.map((mistake, index) => (
              <div key={mistake} style={{ background: '#FCEBEB', border: '1px solid rgba(192,57,43,0.18)', borderRadius: '12px', padding: '0.95rem 1.05rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#7B241C', marginBottom: '4px' }}>Mistake {index + 1}</div>
                <div style={{ fontSize: '13px', color: '#7B241C', lineHeight: 1.65 }}>{mistake}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Bottom Line</h2>
          <p style={pStyle}>
            Choose CBSE for the clearest Indian entrance-exam path, ICSE for stronger English and broad academics, Cambridge for portability and smoother overseas transitions, and IB when continuity plus top-end global preparation justify the cost and workload.
          </p>
        </div>
      </article>

      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem', marginTop: '2rem' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            Pair the right board with the right city and school shortlist
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.72, marginBottom: '1.75rem' }}>
            Use the schools finder and readiness planner to narrow your shortlist based on city, budget, and your family&apos;s likely timeline.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/schools" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,153,51,0.4)' }}>
              Explore schools
            </Link>
            <Link href="/planner" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: '100px', padding: '12px 26px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.18)' }}>
              Check readiness
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
            <div className="card-grid">
              {[
                ['/schools', 'Schools Finder', 'Compare schools by city'],
                ['/planner', 'Readiness Check', 'Get your personalised score'],
                ['/city', 'City Match', 'Find the right city for your family'],
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
        .grid-two, .card-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; }
        .quick-card { background:#fff; border:1px solid rgba(255,153,51,0.2); border-radius:12px; padding:0.95rem 1rem; display:flex; flex-direction:column; gap:0.35rem; }
        .quick-card strong { font-size:13px; color:#1A1208; }
        .quick-card span { font-size:12px; color:#6B5E50; line-height:1.6; }
        .table-shell { overflow-x:auto; border:1px solid #E5E1DA; border-radius:16px; background:#fff; }
        .compare-table { width:100%; min-width:760px; border-collapse:collapse; }
        .compare-table th, .compare-table td { padding:0.95rem 0.9rem; border-bottom:1px solid #EDE8E1; text-align:left; vertical-align:top; font-size:13px; line-height:1.6; color:#3D3229; }
        .compare-table th { font-size:11px; font-weight:700; color:#6B5E50; text-transform:uppercase; letter-spacing:0.08em; background:#F8F5F0; white-space:nowrap; }
        .compare-table td:first-child { font-weight:600; color:#1A1208; width:20%; }
        .mobile-stack { display:none; }
        .stack-card { border:1px solid #E5E1DA; border-radius:14px; padding:1rem; background:#fff; }
        .stack-title { font-size:13px; font-weight:700; color:#1A1208; margin-bottom:0.7rem; }
        .stack-row { display:flex; justify-content:space-between; gap:1rem; padding:0.45rem 0; border-top:1px solid #F0ECE6; font-size:12px; line-height:1.6; color:#6B5E50; }
        .stack-row:first-of-type { border-top:none; padding-top:0; }
        .stack-row strong { color:#1A1208; min-width:86px; flex-shrink:0; }
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
