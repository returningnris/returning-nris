import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'US Estate Tax for Returning NRIs: $60,000 Rule & Planning | ReturningNRIs',
  description:
    'US estate tax for returning NRIs: understand the $60,000 rule, US-situs assets, green card issues, foreign assets, retirement accounts, and planning steps.',
  alternates: {
    canonical: 'https://www.returningnris.com/resources/us-estate-tax-returning-nris',
  },
  openGraph: {
    title: 'US Estate Tax for Returning NRIs: $60,000 Rule & Planning',
    description:
      'A practical guide to the $60,000 rule, US-situs assets, green card considerations, and estate planning after returning to India.',
    url: 'https://www.returningnris.com/resources/us-estate-tax-returning-nris',
    type: 'article',
  },
}

const prose: React.CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1208',
  lineHeight: 1.8,
}

const h2Style: React.CSSProperties = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
  color: '#1A1208',
  margin: '2.5rem 0 0.75rem',
  lineHeight: 1.25,
}

const pStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#3D3229',
  lineHeight: 1.85,
  marginBottom: '1rem',
}

const liStyle: React.CSSProperties = {
  fontSize: '0.98rem',
  color: '#3D3229',
  lineHeight: 1.8,
  marginBottom: '0.5rem',
}

const assetRows = [
  ['US company shares', 'Apple, Microsoft, Nvidia and similar shares are generally US-situs.'],
  ['US-domiciled ETFs', 'VOO, VTI, SPY, QQQ and similar funds are generally US-situs.'],
  ['Vested shares and RSUs', 'Vested shares in a US corporation are generally US-situs.'],
  ['US real estate', 'A US house, apartment or land is US-situs.'],
  ['Certain US bank deposits', 'May fall outside US situs rules when statutory conditions are met.'],
  ['Non-US corporation shares and funds', 'Generally outside US situs rules for an NRNC, though structure still matters.'],
  ['401(k), IRA and other retirement accounts', 'Needs separate plan-specific, cross-border review.'],
]

const relatedLinks = [
  { href: '/resources/rnor-status-nri-returning-to-india', icon: '📊', label: 'RNOR status', sub: 'Understand the tax window after returning' },
  { href: '/resources/nri-returning-to-india-checklist', icon: '✅', label: 'Return-to-India checklist', sub: 'Plan your move in the right sequence' },
  { href: '/resources/should-i-return-to-india-from-usa', icon: '🤔', label: 'Should I return?', sub: 'A broader guide for the move-back decision' },
]

export default function UsEstateTaxForReturningNrisPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Returned to India but Still Own US Assets? The $60,000 Estate Tax Rule You Should Know',
    description: 'A practical guide to US estate tax for returning NRIs, including the $60,000 rule, US-situs assets, green card considerations and planning steps.',
    datePublished: '2026-08-29',
    dateModified: '2026-08-29',
    author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com/our-story' },
    publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
    mainEntityOfPage: 'https://www.returningnris.com/resources/us-estate-tax-returning-nris',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section style={{ background: '#fff', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '4rem 2rem 3rem' }}>
        <div style={prose}>
          <nav style={{ fontSize: '12px', color: '#B5A898', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>Home</Link><span>›</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>Resource Guide</Link><span>›</span>
            <span style={{ color: '#6B5E50' }}>US estate tax</span>
          </nav>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tax Planning</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>8 min read · Last updated August 29, 2026</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 5vw, 2.9rem)', color: '#1A1208', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.1rem' }}>
            Returned to India but Still Own US Assets? The $60,000 Estate Tax Rule You Should Know
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6B5E50', lineHeight: 1.75, marginBottom: 0 }}>
            A practical guide to US estate tax for returning NRIs - who is affected, which assets count, what green card holders need to know, and how to plan before or after moving back to India.
          </p>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={prose}>
          <div style={{ background: '#FFF3E6', border: '1.5px solid rgba(255,153,51,0.28)', borderRadius: '16px', padding: '1.5rem 1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Quick answer</div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
              <li style={liStyle}><strong>US citizen living in India:</strong> US estate tax can apply to worldwide assets; the 2026 basic exclusion is $15 million.</li>
              <li style={liStyle}><strong>Non-US citizen but US-domiciled:</strong> generally treated as a US resident for estate-tax purposes, with worldwide estate exposure.</li>
              <li style={liStyle}><strong>Non-US citizen and not US-domiciled:</strong> US estate tax generally focuses on US-situs assets; Form 706-NA is generally required once the applicable US-situated amount exceeds $60,000.</li>
              <li style={{ ...liStyle, marginBottom: 0 }}><strong>A green card alone does not decide estate-tax domicile.</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 3rem' }}>
        <div style={prose}>
          <p style={pStyle}>
            US estate tax for returning NRIs is easy to overlook. You may have moved back to India, but US stocks, US-domiciled ETFs, real estate and some retirement interests can still create US estate-tax exposure. For a non-US citizen who is not US-domiciled at death, the commonly discussed filing threshold is only $60,000 of US-situated assets.
          </p>

          <h2 style={h2Style}>US estate tax for returning NRIs: who is affected?</h2>
          <p style={pStyle}>The key concept is domicile, not simply visa status or income-tax residency. For US estate and gift tax, the IRS looks at whether the United States was your permanent home and whether you intended to remain there.</p>
          <p style={pStyle}>Moving back to India does not automatically put you under the $60,000 rule. But once a non-US citizen is genuinely non-US-domiciled, US estate tax generally applies only to US-situated assets rather than the person&apos;s worldwide estate. India does not have a US estate or gift tax treaty that provides the broader treaty relief available to residents of certain treaty countries.</p>

          <h2 style={h2Style}>Do green card holders pay estate tax after returning to India?</h2>
          <p style={pStyle}>Possibly - and the answer is not determined by the green card alone. A green card holder who has returned to India may still be US-domiciled based on the facts and intent; another may be non-US-domiciled. That distinction can change whether the United States looks at the worldwide estate or only US-situs assets.</p>
          <p style={pStyle}>Keep estate-tax domicile separate from income-tax residency. Green card termination, the substantial presence test, expatriation rules and long-term resident rules can create separate tax issues. Do not assume that one status automatically settles the other.</p>

          <h2 style={h2Style}>Which assets can create US estate-tax exposure?</h2>
          <p style={pStyle}>For a nonresident noncitizen, the asset itself matters more than where the brokerage account is located. Moving US shares from Fidelity to an international brokerage does not, by itself, remove their US-situs character.</p>
          <div className="estate-tax-table" style={{ border: '1px solid #E5E1DA', borderRadius: '16px', overflow: 'hidden', margin: '1rem 0 1.5rem' }}>
            <div className="estate-tax-row estate-tax-header" style={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 0.85fr) 1.5fr', background: '#F8F5F0', borderBottom: '1px solid #E5E1DA' }}>
              <div style={{ padding: '0.9rem 1rem', fontSize: '12px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Asset</div>
              <div style={{ padding: '0.9rem 1rem', fontSize: '12px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.06em' }}>General treatment for a non-US-domiciled noncitizen</div>
            </div>
            {assetRows.map(([asset, treatment], index) => (
              <div key={asset} className="estate-tax-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(170px, 0.85fr) 1.5fr', borderBottom: index === assetRows.length - 1 ? 'none' : '1px solid #E5E1DA' }}>
                <div style={{ padding: '0.95rem 1rem', fontSize: '14px', fontWeight: 600, color: '#1A1208' }}>{asset}</div>
                <div style={{ padding: '0.95rem 1rem', fontSize: '14px', color: '#3D3229', lineHeight: 1.6 }}>{treatment}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Does US estate tax apply to foreign assets for NRIs?</h2>
          <p style={pStyle}>If you are a non-US citizen and not US-domiciled, foreign assets are generally outside the US estate-tax base. The focus is generally on US-situated assets. But the answer changes for US citizens and people who are US-domiciled: US citizens are generally subject to US estate tax on worldwide assets even when living in India.</p>

          <h2 style={h2Style}>Where estate tax fits in your returning NRI asset transition</h2>
          <p style={pStyle}>Review US estate tax alongside <Link href="/resources/rnor-status-nri-returning-to-india" style={{ color: '#CC7A00' }}>RNOR status for returning NRIs</Link>, capital gains, retirement accounts, brokerage access and future US residency plans. Focusing on only one tax can create a bigger problem elsewhere.</p>
          <p style={pStyle}>Start by listing every US asset and placing it in one of three buckets:</p>
          <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
            <li style={liStyle}>US-situs</li><li style={liStyle}>Non-US-situs</li><li style={liStyle}>Needs professional review</li>
          </ul>

          <h2 style={h2Style}>Can Irish-domiciled ETFs reduce US estate-tax exposure?</h2>
          <p style={pStyle}>Potentially. A US-domiciled ETF and an Irish-domiciled UCITS ETF can track similar markets but have different estate-tax situs because the fund entities are organized in different countries. That does not mean every returning NRI should switch. Consider Indian taxation, dividend withholding, fund costs, brokerage access and the possibility of becoming a US tax resident again. Foreign funds can create serious US tax complications if you later return to US tax residency.</p>

          <h2 style={h2Style}>What about 401(k)s and IRAs?</h2>
          <p style={pStyle}>Do not withdraw a 401(k) or IRA simply because of estate-tax concerns. Retirement accounts need their own cross-border analysis. Keeping the account, rolling it over, gradual withdrawals or Roth conversions can produce very different outcomes depending on the plan, beneficiaries, income-tax rates, treaty treatment, early-withdrawal rules and estate-tax consequences.</p>

          <h2 style={h2Style}>Estate tax planning for Indian expats leaving the US</h2>
          <ol style={{ paddingLeft: '1.3rem' }}>
            <li style={liStyle}><strong>Map your US assets.</strong> List stocks, ETFs, RSUs, property, bank deposits, 401(k)s, IRAs and business interests.</li>
            <li style={liStyle}><strong>Confirm your estate-tax domicile.</strong> Do not assume immigration status or income-tax residency gives the answer.</li>
            <li style={liStyle}><strong>Review US-domiciled investments.</strong> Compare whether equivalent non-US-domiciled exposure makes sense after tax and investment costs.</li>
            <li style={liStyle}><strong>Update succession documents.</strong> Review wills, beneficiaries and account records. These make transfer easier, but do not automatically eliminate estate tax.</li>
            <li style={liStyle}><strong>Get cross-border advice before gifting or restructuring.</strong> US gift-tax rules for NRNCs can differ sharply from estate-tax rules, while India-side tax and family consequences also matter.</li>
          </ol>

          <h2 style={h2Style}>What if your spouse is not a US citizen?</h2>
          <p style={pStyle}>Do not assume that every asset can pass to a non-US-citizen spouse with the same unlimited marital deduction available between US-citizen spouses. Cross-border estates may need additional planning, including a qualified domestic trust (QDOT) in appropriate cases.</p>

          <h2 style={h2Style}>Bottom line</h2>
          <p style={pStyle}>Returning to India does not mean you need to sell all your US investments. It does mean you should review how those investments are held. Before leaving a large US portfolio untouched for decades, ask: What US assets do I still own? Which are US-situs assets? Can I restructure them without creating a larger tax or investment problem elsewhere?</p>
          <p style={pStyle}>A small amount of planning now can make the transfer of your assets much simpler for your family later. Use the <Link href="/resources/nri-returning-to-india-checklist" style={{ color: '#CC7A00' }}>NRI return-to-India checklist</Link> for the wider move, and read <Link href="/resources/should-i-return-to-india-from-usa" style={{ color: '#CC7A00' }}>Should I return to India from the USA?</Link> if you are still deciding.</p>

          <div style={{ marginTop: '2.5rem', padding: '1.35rem 1.5rem', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>Important disclaimer</div>
            <p style={{ ...pStyle, marginBottom: 0, fontSize: '0.9rem' }}>This article is for educational purposes only and is not US or Indian tax, legal, investment, FEMA or estate-planning advice. Treatment depends on citizenship, domicile, asset ownership, immigration history and individual circumstances. Consult a qualified US-India cross-border tax or estate professional before making changes.</p>
          </div>

          <div style={{ marginTop: '2.5rem', borderTop: '1px solid #E5E1DA', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B5E50', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Primary sources</div>
            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
              <li style={liStyle}><a href="https://www.irs.gov/individuals/international-taxpayers/some-nonresidents-with-us-assets-must-file-estate-tax-returns" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>IRS: Some nonresidents with US assets must file estate tax returns</a></li>
              <li style={liStyle}><a href="https://www.irs.gov/businesses/small-businesses-self-employed/frequently-asked-questions-on-estate-taxes-for-nonresidents-not-citizens-of-the-united-states" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>IRS: Estate-tax FAQs for nonresidents who are not citizens</a></li>
              <li style={liStyle}><a href="https://www.irs.gov/instructions/i706na" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>IRS: Instructions for Form 706-NA</a></li>
              <li style={{ ...liStyle, marginBottom: 0 }}><a href="https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax" target="_blank" rel="noreferrer" style={{ color: '#CC7A00' }}>IRS: Estate tax filing thresholds</a></li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem', marginTop: '1.75rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Related resources</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {relatedLinks.map((item) => <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8F5F0', border: '1px solid #E5E1DA', borderRadius: '12px', padding: '0.875rem 1rem', textDecoration: 'none' }}><span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span><span><span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>{item.label}</span><span style={{ display: 'block', fontSize: '11px', color: '#B5A898' }}>{item.sub}</span></span></Link>)}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.5rem', marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933, #CC7A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", color: '#fff', flexShrink: 0 }}>R</div>
            <div><div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1208' }}>ReturningNRIs</div><div style={{ fontSize: '12px', color: '#B5A898' }}>Practical guidance for NRIs planning their move back to India</div></div>
          </div>
        </div>
      </article>
      <style>{`@media (max-width: 560px) { .estate-tax-header { display: none !important; } .estate-tax-row { grid-template-columns: 1fr !important; gap: 0; padding: 0.25rem 0; } }`}</style>
    </>
  )
}
