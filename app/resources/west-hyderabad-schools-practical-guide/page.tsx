import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'West Hyderabad Schools Practical Guide for Returning NRI Families (2026)',
  description:
    'Compare 13 West Hyderabad schools for returning NRI families by curriculum, estimated fees, campus context, commute trade-offs, and practical family fit.',
  alternates: { canonical: 'https://www.returningnris.com/resources/west-hyderabad-schools-practical-guide' },
  openGraph: {
    title: 'West Hyderabad Schools: A Practical Guide for Returning NRI Families',
    description: 'A practical comparison of 13 West Hyderabad schools across curriculum, cost, commute, and family fit.',
    url: 'https://www.returningnris.com/resources/west-hyderabad-schools-practical-guide',
    type: 'article',
    images: [{ url: '/resources/west-hyderabad-schools-practical-guide.webp', width: 1600, height: 900, alt: 'West Hyderabad Schools Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'West Hyderabad Schools: A Practical Guide for Returning NRI Families',
    description: '13 schools compared by curriculum, estimated fee, commute, and practical fit.',
    images: ['/resources/west-hyderabad-schools-practical-guide.webp'],
  },
}

const schools = [
  { name: 'International School of Hyderabad', place: 'Patancheru', fee: '₹7.5–12L+', path: 'U.S. & AERO → IGCSE → IBDP', fit: 'Closest continuity for a child arriving from a U.S. or highly international school.', watch: 'Test the long commute from the Financial District and ask about admission eligibility.', segment: 'Expat benchmark' },
  { name: 'The Shri Ram Academy', place: 'Gowlidoddy', fee: '₹5–7.5L+', path: 'IB PYP & MYP; DP/CP candidate', fit: 'Small cohorts and inquiry-led learning close to the Financial District.', watch: 'A young campus: verify the Grade 11/12 authorization timing and cohort size.', segment: 'Boutique IB' },
  { name: 'Indus International School', place: 'Shankarpally', fee: '₹5.5–9.5L+', path: 'IB PYP, MYP, DP & CP', fit: 'A full IB journey, leadership programme, and day-cum-boarding flexibility.', watch: 'A destination campus: run the school-bus journey at actual morning traffic.', segment: 'Full IB & boarding' },
  { name: 'CHIREC International School', place: 'Kondapur', fee: '₹3.5–7.5L+', path: 'CBSE or Cambridge → IBDP', fit: 'Families valuing a mature local brand, track record, and central access.', watch: 'Large cohorts can feel less personal; confirm the exact campus and stream offered.', segment: 'Legacy multi-curriculum' },
  { name: 'Oakridge International School, Gachibowli', place: 'Gachibowli', fee: '₹4.5–9L+', path: 'IB PYP, MYP & DP; CBSE from Grade 7', fit: 'A broad international-school experience with structured activities and university preparation.', watch: 'Ask about section size and counselling access for your child’s specific grade.', segment: 'Full IB at scale' },
  { name: 'Sreenidhi International School', place: 'Moinabad / Aziznagar', fee: '₹5.5–9.5L', path: 'IB PYP, MYP, DP & CP', fit: 'A mature, full-IB destination school with day and boarding options.', watch: 'Commute matters here; compare day, weekly boarding, and full boarding realistically.', segment: 'Full IB & boarding' },
  { name: 'Meru International School, Tellapur', place: 'Tellapur', fee: '₹2.8–4.2L', path: 'CBSE; Cambridge through IGCSE', fit: 'A convenient neighbourhood choice for Tellapur and Nallagandla families.', watch: 'The Tellapur campus is newer; confirm the senior-school route for your child’s entry year.', segment: 'Practical value' },
  { name: 'Manthan International School', place: 'Tellapur', fee: '₹3–5L', path: 'Cambridge or CBSE from Grade 8', fit: 'A close-learning environment for families prioritising classroom interaction and inclusion.', watch: 'Sports infrastructure is more modest than at destination campuses.', segment: 'Practical value' },
  { name: 'Sancta Maria International School', place: 'Serilingampally', fee: '₹3.5–5.5L', path: 'Cambridge through IGCSE & A Levels', fit: 'A clear choice for families committed to Cambridge through Grade 12.', watch: 'It does not offer CBSE or IB, so the Cambridge commitment needs to be deliberate.', segment: 'Full Cambridge' },
  { name: 'Phoenix Greens School of Learning', place: 'Kokapet', fee: '₹3.1–3.8L', path: 'CBSE; Cambridge through IGCSE', fit: 'A value-focused, accessible option for Kokapet and Financial District families.', watch: 'Confirm the Grade 11/12 Cambridge route directly; public school pages differ.', segment: 'Practical value' },
  { name: 'Rockwell International School', place: 'Kokapet', fee: '₹2.8–3.8L', path: 'CBSE, Cambridge through IGCSE, then IBDP', fit: 'A compact multi-curriculum option with short access from Kokapet and the Financial District.', watch: 'It has less open green space than the large destination campuses.', segment: 'Urban multi-curriculum' },
  { name: 'The Gaudium School', place: 'Kollur', fee: '₹3.5–5.5L', path: 'IB, Cambridge & CBSE (by grade)', fit: 'The widest curriculum range, substantial sports infrastructure, and boarding.', watch: 'Fast growth makes teacher stability, section size, and travel time important questions.', segment: 'Infrastructure & choice' },
  { name: 'Birla Open Minds International School', place: 'Kollur', fee: '₹3–4.5L', path: 'CBSE; Cambridge to IGCSE; IBCP', fit: 'A broad, well-equipped option with a practical international senior route.', watch: 'The international senior route is IBCP, not traditional IBDP—understand the career-related component.', segment: 'Infrastructure & choice' },
]

const priorities = [
  ['Closest continuity from a U.S. school', 'International School of Hyderabad', 'U.S. and AERO pathway before IGCSE and IBDP.'],
  ['Full IB continuum', 'Indus, Oakridge, Sreenidhi, The Gaudium', 'PYP, MYP, and DP are available; Indus and Sreenidhi also list CP.'],
  ['Full Cambridge through A Levels', 'Sancta Maria, Manthan, The Gaudium', 'The clearest senior-school continuity for a Cambridge family.'],
  ['CBSE plus an international route', 'CHIREC, Oakridge, Meru, Manthan, Phoenix Greens, Rockwell, The Gaudium, Birla', 'Useful flexibility, but the entry grade varies significantly.'],
  ['Central West Hyderabad access', 'CHIREC, Oakridge, The Shri Ram Academy, Phoenix Greens, Rockwell', 'More practical for many Kondapur, Gachibowli, Kokapet, and Financial District homes.'],
  ['Tellapur / Nallagandla convenience', 'Meru, Manthan', 'Neighbourhood access with CBSE and Cambridge options.'],
]

const curriculum = [
  { name: 'IB', line: 'Best for global continuity', text: 'A full IB continuum can reduce curriculum switches from primary school through Grade 12. A DP-only school can still be an excellent senior-school choice; inspect the transition into DP.', picks: 'Start with Indus, Oakridge, Sreenidhi, and The Gaudium.' },
  { name: 'Cambridge', line: 'Best for a structured international exam pathway', text: 'Cambridge can provide continuity from Primary through AS and A Levels. Some schools stop at IGCSE and move students into DP, CP, or CBSE, so the Grade 11 destination matters.', picks: 'For a complete path, examine Sancta Maria, Manthan, and The Gaudium.' },
  { name: 'CBSE', line: 'Best for India-aligned continuity', text: 'Often the direct fit for families considering Indian entrance exams or later moves within India. The key question is the grade at which your child can enter the CBSE track.', picks: 'Primary-through-Grade-12 options include CHIREC, Meru, Phoenix Greens, Rockwell, and Birla.' },
]

const prose: React.CSSProperties = { maxWidth: 900, margin: '0 auto', color: '#3D3229', fontFamily: 'DM Sans, sans-serif' }
const sectionTitle: React.CSSProperties = { fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.65rem, 3.5vw, 2.3rem)', lineHeight: 1.14, letterSpacing: '-0.02em', color: '#1A1208', margin: 0 }

export default function WestHyderabadSchoolsPracticalGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'West Hyderabad Schools: A Practical Guide for Returning NRI Families', description: metadata.description, author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' }, publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' }, datePublished: '2026-09-13', dateModified: '2026-09-13', image: 'https://www.returningnris.com/resources/west-hyderabad-schools-practical-guide.webp', url: 'https://www.returningnris.com/resources/west-hyderabad-schools-practical-guide' }) }} />

      <section className="school-hero">
        <div style={prose}>
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/resources">Guides</Link><span>›</span><span>West Hyderabad Schools</span></nav>
          <div className="eyebrow"><span /> Schools <b>•</b> Updated September 2026 <b>•</b> 12 min read</div>
          <h1>West Hyderabad Schools:<br className="desktop-break" /> a practical guide for returning NRI families</h1>
          <p className="hero-copy">13 established and growing schools compared on curriculum pathways, estimated fees, campus context, commute trade-offs, and day-to-day fit.</p>
        </div>
      </section>

      <section className="hero-image-wrap" aria-label="West Hyderabad Schools guide illustration">
        <div className="hero-image"><Image src="/resources/west-hyderabad-schools-practical-guide.webp" alt="Returning NRI students at a modern West Hyderabad school campus" width={1600} height={900} priority quality={72} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 92vw, 960px" style={{ width: '100%', height: 'auto', display: 'block' }} /></div>
      </section>

      <article>
        <section className="intro-section"><div style={prose}>
          <div className="answer"><p className="answer-label">The short answer</p><h2>No single school wins every factor.</h2><p>Start with the curriculum that protects continuity for your child. Then test the actual school-bus route, classroom fit, and all-in cost. In West Hyderabad, a manageable daily commute often matters more than a small difference in facilities.</p></div>
          <div className="action-grid"><Link href="#shortlist"><strong>Build your shortlist</strong><span>Start with your family priority</span></Link><Link href="#visit-checklist"><strong>Prepare campus visits</strong><span>Ask the questions that reveal daily reality</span></Link><Link href="/resources/ib-cambridge-cbse-icse-guide-for-returning-nris"><strong>Compare school boards</strong><span>Understand IB, Cambridge, CBSE, and ICSE</span></Link></div>
        </div></section>

        <section className="content-section"><div style={prose}><p className="kicker">Choose the pathway first</p><h2 style={sectionTitle}>Which curriculum protects continuity?</h2><div className="curriculum-grid">{curriculum.map((item) => <div className="curriculum-card" key={item.name}><span className="curriculum-name">{item.name}</span><h3>{item.line}</h3><p>{item.text}</p><strong>{item.picks}</strong></div>)}</div><p className="inline-note">Want a board-by-board explanation? Read our <Link href="/resources/ib-cambridge-cbse-icse-guide-for-returning-nris">IB vs Cambridge vs CBSE vs ICSE guide</Link>.</p></div></section>

        <section id="shortlist" className="shortlist-section"><div style={prose}><p className="kicker">Shortlist by family priority</p><h2 style={sectionTitle}>Start with the problem you need to solve</h2><div className="priority-list">{priorities.map(([priority, names, why]) => <div className="priority-row" key={priority}><h3>{priority}</h3><div><strong>{names}</strong><p>{why}</p></div></div>)}</div></div></section>

        <section className="content-section"><div style={prose}><p className="kicker">13-school practical benchmark</p><h2 style={sectionTitle}>Compare the schools in plain English</h2><p className="section-intro">Fee ranges are benchmark estimates for tuition and recurring annual charges. They can differ by grade and may exclude admissions fees, transport, meals, uniforms, devices, deposits, and boarding. Always confirm the current all-in cost directly with the school.</p><div className="school-grid">{schools.map((school) => <section className="school-card" key={school.name}><div className="school-card-top"><span>{school.segment}</span><span>{school.fee} / yr</span></div><h3>{school.name}</h3><p className="school-place">{school.place}</p><dl><div><dt>Pathway</dt><dd>{school.path}</dd></div><div><dt>Best fit</dt><dd>{school.fit}</dd></div><div><dt>Watch for</dt><dd>{school.watch}</dd></div></dl></section>)}</div></div></section>

        <section className="decision-section"><div style={prose}><p className="kicker">A realistic decision order</p><h2 style={sectionTitle}>The order that prevents expensive mistakes</h2><ol className="decision-list"><li><b>Curriculum continuity</b><span>for your child’s current grade and likely university destination.</span></li><li><b>Actual school-day commute</b><span>at morning drop-off and return time, not a map estimate.</span></li><li><b>Classroom fit</b><span>including teacher quality, learning support, languages, and section size.</span></li><li><b>All-in annual cost</b><span>plus likely fee escalation and non-tuition charges.</span></li><li><b>Senior-school details</b><span>subjects, board results, university counselling, and the path from your entry grade.</span></li></ol></div></section>

        <section id="visit-checklist" className="content-section"><div style={prose}><p className="kicker">Before you pay an admission fee</p><h2 style={sectionTitle}>Your campus visit checklist</h2><div className="check-grid"><div><b>Ask the admissions team</b><ul><li>Which curriculum and subjects are available in my child’s specific grade?</li><li>What is included in the fee quoted to us? What is not?</li><li>What is the average class size and teacher turnover in this grade?</li><li>How is learning support delivered and charged?</li></ul></div><div><b>Test the everyday reality</b><ul><li>Drive or take the bus route at school-start time.</li><li>Look at student work, not only facilities and displays.</li><li>Ask to meet the grade lead or a relevant subject teacher.</li><li>Check the outdoor space and activities your child will actually use.</li></ul></div></div><p className="disclaimer"><strong>Independent planning guide.</strong> This is not a ranking, endorsement, or admission guarantee. Fees, curricula, affiliations, facilities, policies, results, and seat availability can change. Verify all current information directly with the school and relevant board or programme directory.</p><div className="related"><Link href="/resources/hyderabad-neighbourhood-guide-for-returning-nri-families">Explore Hyderabad neighbourhoods <span>→</span></Link><Link href="/planner">Plan your return timeline <span>→</span></Link></div></div></section>
      </article>

      <style>{`
        .school-hero { background: radial-gradient(ellipse 70% 70% at 15% 5%, rgba(255,153,51,.16), transparent 65%), radial-gradient(ellipse 55% 65% at 95% 45%, rgba(19,136,8,.10), transparent 70%), #fffdf9; padding: 4.25rem 1.25rem 2.5rem; }
        .breadcrumbs { display:flex; flex-wrap:wrap; gap:.45rem; color:#A49789; font-size:.75rem; margin-bottom:1.45rem; } .breadcrumbs a { color:#88796B; text-decoration:none; }
        .eyebrow, .kicker { color:#B06000; text-transform:uppercase; letter-spacing:.09em; font-weight:700; font-size:.7rem; } .eyebrow { display:flex; align-items:center; gap:.55rem; } .eyebrow span { width:7px; height:7px; border-radius:50%; background:#FF9933; } .eyebrow b { color:#D8D0C5; }
        .school-hero h1 { max-width:850px; margin:1.1rem 0 .95rem; font:400 clamp(2.15rem,5.2vw,4.2rem)/1.04 'DM Serif Display', serif; letter-spacing:-.035em; color:#1A1208; } .hero-copy { max-width:690px; font-size:clamp(1rem,2vw,1.15rem); line-height:1.75; color:#6B5E50; margin:0; }
        .hero-image-wrap { background:#fffdf9; padding:0 1.25rem 2.75rem; } .hero-image { max-width:960px; margin:0 auto; border-radius:20px; overflow:hidden; box-shadow:0 18px 45px rgba(47,31,12,.13); background:#F8F5F0; }
        .intro-section, .content-section, .shortlist-section, .decision-section { padding:4rem 1.25rem; } .intro-section { border-top:1px solid #EEE7DC; background:#fff; } .shortlist-section { background:#FBF7F1; } .decision-section { background:#1A1208; } .decision-section .kicker { color:#F6B86A; } .decision-section h2 { color:#fff; }
        .answer { border-left:4px solid #FF9933; padding:1.25rem 1.35rem; background:#FFF8F0; border-radius:0 16px 16px 0; } .answer-label { color:#B06000; text-transform:uppercase; font-size:.68rem; font-weight:700; letter-spacing:.09em; margin:0 0 .5rem; } .answer h2 { color:#1A1208; font:400 clamp(1.45rem,3vw,2rem)/1.15 'DM Serif Display', serif; margin:0 0 .65rem; } .answer p:last-child { margin:0; line-height:1.75; font-size:1rem; }
        .action-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-top:1.4rem; } .action-grid a { text-decoration:none; color:#1A1208; border:1px solid #E9E1D6; border-radius:14px; padding:1rem; background:#fff; } .action-grid strong, .action-grid span { display:block; } .action-grid strong { font-size:.82rem; margin-bottom:.32rem; } .action-grid span { color:#7A6D60; font-size:.76rem; line-height:1.45; }
        .kicker { margin:0 0 .65rem; } .section-intro { max-width:760px; line-height:1.75; margin:1rem 0 1.6rem; color:#6B5E50; }
        .curriculum-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin-top:1.5rem; } .curriculum-card { border:1px solid #E8E1D7; border-radius:16px; padding:1.25rem; } .curriculum-name { font-weight:700; font-size:.75rem; color:#C06B00; text-transform:uppercase; letter-spacing:.08em; } .curriculum-card h3 { color:#1A1208; font:400 1.35rem/1.18 'DM Serif Display', serif; margin:.6rem 0; } .curriculum-card p { color:#6B5E50; font-size:.88rem; line-height:1.65; margin:0 0 .8rem; } .curriculum-card strong { font-size:.8rem; line-height:1.5; color:#285C47; } .inline-note { margin:1.25rem 0 0; color:#6B5E50; font-size:.9rem; } .inline-note a { color:#B06000; font-weight:600; }
        .priority-list { margin-top:1.5rem; border-top:1px solid #E6DDD0; } .priority-row { display:grid; grid-template-columns:minmax(170px,.8fr) minmax(0,1.2fr); gap:1.2rem; padding:1.2rem 0; border-bottom:1px solid #E6DDD0; } .priority-row h3 { margin:0; color:#1A1208; font-size:.9rem; line-height:1.45; } .priority-row strong { color:#B06000; font-size:.87rem; } .priority-row p { color:#6B5E50; font-size:.86rem; line-height:1.6; margin:.3rem 0 0; }
        .school-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; } .school-card { border:1px solid #E8E1D7; border-radius:17px; padding:1.15rem; background:#fff; } .school-card-top { display:flex; justify-content:space-between; gap:.75rem; color:#8A7968; font-size:.67rem; text-transform:uppercase; letter-spacing:.06em; font-weight:700; } .school-card-top span:last-child { color:#B06000; white-space:nowrap; } .school-card h3 { font:400 1.28rem/1.16 'DM Serif Display', serif; color:#1A1208; margin:.7rem 0 .2rem; } .school-place { color:#938475; margin:0 0 .9rem; font-size:.78rem; } .school-card dl { margin:0; } .school-card dl div { border-top:1px solid #F0EAE2; padding:.65rem 0; } .school-card dl div:last-child { padding-bottom:0; } .school-card dt { color:#9A8B7C; font-size:.65rem; text-transform:uppercase; font-weight:700; letter-spacing:.07em; margin-bottom:.2rem; } .school-card dd { margin:0; color:#4A3C30; font-size:.83rem; line-height:1.55; }
        .decision-list { list-style:none; padding:0; margin:1.5rem 0 0; display:grid; grid-template-columns:1fr 1fr; gap:.75rem 1.5rem; counter-reset:decision; } .decision-list li { counter-increment:decision; border-top:1px solid rgba(255,255,255,.16); padding:.85rem 0 0 2.4rem; position:relative; color:rgba(255,255,255,.66); font-size:.9rem; line-height:1.55; } .decision-list li::before { content:counter(decision); position:absolute; left:0; top:.75rem; width:1.55rem; height:1.55rem; display:grid; place-items:center; border-radius:50%; background:#FF9933; color:#1A1208; font-size:.7rem; font-weight:800; } .decision-list b { display:block; color:#fff; font-size:.88rem; }
        .check-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.45rem; } .check-grid > div { background:#F8F5F0; padding:1.15rem; border-radius:15px; } .check-grid b { color:#1A1208; font-size:.9rem; } .check-grid ul { margin:.7rem 0 0; padding-left:1.15rem; color:#5F5144; font-size:.87rem; line-height:1.65; } .check-grid li + li { margin-top:.3rem; } .disclaimer { margin:2rem 0 0; padding-top:1.3rem; border-top:1px solid #E9E1D6; color:#77695B; font-size:.78rem; line-height:1.65; } .related { display:flex; flex-wrap:wrap; gap:.75rem; margin-top:1.5rem; } .related a { text-decoration:none; color:#1A1208; border:1px solid #E3D9CC; border-radius:99px; padding:.65rem 1rem; font-size:.82rem; font-weight:600; } .related span { color:#B06000; margin-left:.25rem; }
        @media (max-width:700px) { .school-hero { padding-top:2.75rem; } .desktop-break { display:none; } .hero-image-wrap { padding-bottom:2rem; } .hero-image { border-radius:14px; } .intro-section, .content-section, .shortlist-section, .decision-section { padding:2.8rem 1.1rem; } .action-grid, .curriculum-grid, .school-grid, .check-grid, .decision-list { grid-template-columns:1fr; } .priority-row { grid-template-columns:1fr; gap:.45rem; } .school-card { padding:1rem; } .decision-list { gap:0; } .decision-list li { padding-bottom:.85rem; } }
      `}</style>
    </>
  )
}
