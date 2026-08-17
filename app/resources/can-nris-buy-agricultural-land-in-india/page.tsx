import Link from 'next/link'
import type { Metadata } from 'next'

const pageUrl = 'https://www.returningnris.com/resources/can-nris-buy-agricultural-land-in-india'

export const metadata: Metadata = {
  title: 'Can NRIs Buy Agricultural Land in India? (2026 Guide)',
  description:
    'Can NRIs or OCI cardholders buy farm plots, agricultural land, plantations, or farmhouses in India? Understand the FEMA position, inheritance, gifts, and due diligence.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Can NRIs Buy Agricultural Land in India? (2026 Guide)',
    description:
      'A practical guide for NRIs considering a farm plot, weekend farm, or agricultural land purchase in India.',
    url: pageUrl,
    type: 'article',
  },
}

const checklist = [
  'Official land classification in current revenue records',
  'Survey number, boundaries, and access road',
  'Mother deed and the complete title chain',
  'Encumbrance certificate and mutation records',
  'Land-conversion approval, if conversion is claimed',
  'Seller identity, authority, and title',
  'State-specific restrictions, including ceiling, assigned, and tribal-land rules',
  'Your FEMA eligibility based on your present residential status',
]

const scenarios = [
  ['Buying agricultural land as an NRI or OCI', 'Generally not permitted under the general FEMA permission for property purchases.'],
  ['Buying a residential or commercial property', 'Generally permitted, subject to the applicable conditions and payment rules.'],
  ['Receiving agricultural land as a gift', 'Not covered by the general FEMA permission for gifts to an NRI or OCI.'],
  ['Inheriting agricultural land', 'Generally permitted, subject to FEMA conditions and applicable state law.'],
  ['Land bought before becoming an NRI', 'It can generally continue to be held if it was lawfully acquired while you were resident in India.'],
]

export default function AgriculturalLandGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Can NRIs Buy Agricultural Land in India?',
            description:
              'A practical guide for NRIs considering farm plots, weekend farms, and agricultural land in India.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-08-17',
            dateModified: '2026-08-17',
            url: pageUrl,
          }),
        }}
      />

      <section className="hero">
        <div className="wrap">
          <nav className="crumbs">
            <Link href="/">Home</Link><span>&gt;</span><Link href="/resources">Resource Guides</Link><span>&gt;</span><span>Housing</span>
          </nav>
          <div className="meta"><span className="pill">Housing</span><span>7 min read</span><span>Updated August 2026</span></div>
          <h1>Can NRIs Buy<br />Agricultural Land in India?</h1>
          <p className="lead">A beautiful weekend farm can be tempting. But for NRIs and OCI cardholders, the land classification matters more than the brochure.</p>
        </div>
      </section>

      <article className="article wrap">
        <aside className="answer">
          <div className="eyebrow">The short answer</div>
          <h2>Generally, no - not by purchase.</h2>
          <p>NRIs and OCI cardholders can generally buy residential and commercial property in India, but not agricultural land, plantation property, or farmhouses under the general FEMA permission. The key is your FEMA residential status, not only your citizenship or Indian passport.</p>
        </aside>

        <p>A listing may call itself a <strong>weekend farm</strong>, <strong>managed farmland</strong>, <strong>farm plot</strong>, or <strong>nature plot</strong>. Those marketing terms do not decide whether an NRI can buy it. The official government land records do.</p>
        <p>Before you pay a token advance, ask a property lawyer one direct question: <strong>What does the current government record classify this land as?</strong> Do not rely only on the developer’s brochure or a verbal assurance from a broker.</p>

        <h2>What the usual situations look like</h2>
        <div className="scenario-list">
          {scenarios.map(([title, detail]) => (
            <div className="scenario" key={title}>
              <h3>{title}</h3><p>{detail}</p>
            </div>
          ))}
        </div>

        <h2>Inheritance and earlier ownership are different</h2>
        <p>An NRI or OCI can generally inherit agricultural land, subject to FEMA conditions and the land law of the state where the property sits. This can include land that a parent legally purchased and later leaves through inheritance; it is not limited only to traditional ancestral property.</p>
        <p>Similarly, if you legally bought agricultural land while you were resident in India and later became an NRI, that change does not automatically require a sale. Continuing to hold lawfully acquired property is different from making a new purchase after becoming non-resident.</p>

        <h2>Returning to India does not remove every hurdle</h2>
        <p>Once you genuinely become a person resident in India under FEMA, the NRI-specific restriction may no longer apply in the same way. But agricultural land is also governed by state law. Rules can vary on agriculturist status, land ceilings, conversion, assigned land, and tribal land. Check both the FEMA position and the relevant state rules before committing.</p>

        <h2>Due diligence before paying an advance</h2>
        <div className="checklist">
          {checklist.map((item) => <div key={item}><span>✓</span>{item}</div>)}
        </div>

        <div className="warning">
          <div className="eyebrow">A useful rule</div>
          <p>“Other NRIs have bought here” and “the registration office will register it” are not legal due diligence. Registration, title, FEMA compliance, and state land-law compliance are separate questions.</p>
        </div>

        <h2>Before you sign</h2>
        <p>Share the survey number, current revenue records, title chain, and the claimed land-use status with a qualified property lawyer. If the seller says the land has been converted, ask for the approval and verify it independently. Keep your passport, PAN, overseas-residency proof, address proof, and banking trail ready for the transaction review.</p>

        <div className="disclaimer">
          <strong>Important:</strong> This guide is for general awareness, not legal, tax, or FEMA advice. Rules and outcomes depend on the transaction, state, land records, and your individual status. Confirm your case with a qualified property lawyer before paying an advance or signing documents. For the regulatory baseline, see the <a href="https://systemhealth.rbi.org.in/Scripts/FS_FAQs.aspx_Id%3D117%26fn%3D5.html" target="_blank" rel="noreferrer">RBI&apos;s property-acquisition FAQ</a>.
        </div>
      </article>

      <section className="cta"><div className="wrap cta-inner"><h2>Plan the rest of your return with the same care.</h2><p>Use the housing finder and return checklist to make the bigger move decisions easier.</p><div><Link href="/housing">Explore housing</Link><Link href="/resources/nri-returning-to-india-checklist">View return checklist</Link></div></div></section>

      <section className="related wrap"><div className="eyebrow">Related resources</div><div className="related-grid">
        <Link href="/housing"><strong>Housing Finder</strong><span>Compare locations and housing needs</span></Link>
        <Link href="/resources/gated-community-flat-vs-suburb-villa-for-returning-nris"><strong>Flat vs Villa</strong><span>What your housing choice changes in year one</span></Link>
        <Link href="/resources/nri-returning-to-india-checklist"><strong>NRI Return Checklist</strong><span>Organize your move in 14 practical steps</span></Link>
      </div></section>

      <style>{`
        .wrap { max-width:760px; margin:0 auto; }
        .hero { padding:4.25rem 2rem 3.25rem; background:#fff; background-image:radial-gradient(ellipse 70% 55% at 50% 8%,rgba(255,153,51,.12),transparent 65%),radial-gradient(ellipse 45% 45% at 15% 80%,rgba(19,136,8,.07),transparent 60%); }
        .crumbs,.meta { display:flex; gap:7px; flex-wrap:wrap; align-items:center; font-size:12px; color:#B5A898; }
        .crumbs { margin-bottom:1.4rem; }.crumbs a { color:#B5A898; text-decoration:none; }.meta { margin-bottom:1.25rem; }.pill { color:#138808; background:#E8F5E8; border-radius:999px; padding:3px 10px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; }
        h1,h2,h3,p { margin-top:0; }h1,h2 { font-family:'DM Serif Display',serif; color:#1A1208; letter-spacing:-.02em; }h1 { font-size:clamp(2rem,5vw,3rem); line-height:1.1; margin-bottom:1.1rem; }.lead { max-width:650px; font-size:1.08rem; line-height:1.75; color:#6B5E50; margin-bottom:0; }
        .article { padding:2.75rem 2rem 3.25rem; color:#3D3229; font-family:'DM Sans',sans-serif; line-height:1.82; }.article > p { margin-bottom:1.05rem; font-size:1rem; }.article h2 { font-size:clamp(1.45rem,3vw,1.85rem); line-height:1.2; margin:2.5rem 0 .8rem; }.article h3 { color:#1A1208; font-size:14px; line-height:1.4; margin-bottom:.35rem; }
        .answer,.warning { border-radius:16px; padding:1.45rem 1.55rem; margin-bottom:2rem; }.answer { background:#FFF3E6; border:1px solid rgba(255,153,51,.35); }.answer h2 { margin:.25rem 0 .6rem; }.answer p,.warning p { margin:0; }.eyebrow { color:#CC7A00; font-size:11px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; margin-bottom:.65rem; }
        .scenario-list { display:grid; gap:.75rem; }.scenario { border:1px solid #E5E1DA; border-radius:14px; padding:1rem 1.1rem; }.scenario p { color:#6B5E50; font-size:14px; line-height:1.65; margin-bottom:0; }
        .checklist { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.75rem; }.checklist div { display:flex; gap:.65rem; align-items:flex-start; background:#F8F5F0; border-radius:12px; padding:.85rem .9rem; font-size:13px; line-height:1.55; }.checklist span { color:#138808; font-weight:800; }.warning { margin-top:2rem; border:1px solid #E5E1DA; background:#fff; }.warning .eyebrow { color:#6B5E50; }.disclaimer { margin-top:2.5rem; padding:1rem 1.1rem; border-left:3px solid #FF9933; background:#F8F5F0; color:#6B5E50; font-size:13px; line-height:1.7; }.disclaimer a { color:#9A5900; }
        .cta { background:linear-gradient(135deg,#1A1208,#2A1E08); padding:3.25rem 2rem; text-align:center; }.cta h2 { color:#fff; font-size:clamp(1.55rem,3vw,2rem); margin-bottom:.65rem; }.cta p { color:rgba(255,255,255,.58); margin:0 auto 1.5rem; line-height:1.7; }.cta a { display:inline-block; text-decoration:none; border-radius:999px; padding:11px 20px; margin:0 .3rem .55rem; font-size:14px; font-weight:700; }.cta a:first-child { background:#FF9933; color:#1A1208; }.cta a:last-child { border:1px solid rgba(255,255,255,.2); color:#fff; }
        .related { padding:2.5rem 2rem 3.5rem; }.related-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:.85rem; }.related-grid a { border:1px solid #E5E1DA; border-radius:12px; padding:1rem; text-decoration:none; background:#fff; }.related-grid strong { display:block; color:#1A1208; font-size:13px; margin-bottom:.25rem; }.related-grid span { color:#6B5E50; font-size:12px; line-height:1.5; }
        @media(max-width:640px) { .hero,.article,.related { padding-left:1.25rem; padding-right:1.25rem; }.checklist,.related-grid { grid-template-columns:1fr; }.cta { padding-left:1.25rem; padding-right:1.25rem; } }
      `}</style>
    </>
  )
}
