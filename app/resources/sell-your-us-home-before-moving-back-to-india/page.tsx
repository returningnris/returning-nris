import Link from 'next/link'
import type { Metadata } from 'next'
import ResourceComments from '../../../components/ResourceComments'

const ARTICLE_SLUG = 'sell-your-us-home-before-moving-back-to-india'

export const metadata: Metadata = {
  title: 'How to Sell Your US Home Before Moving Back to India (2026 Guide)',
  description:
    "A practical guide for NRIs selling a US home before returning to India in a buyer's market. Learn how FSBO plus flat fee MLS can help you price below competing homes, use buyer incentives, and close faster.",
  openGraph: {
    title: 'How to Sell Your US Home Before Moving Back to India (2026 Guide)',
    description:
      'A practical guide for NRIs selling a US home before returning to India, based on a real FSBO plus flat fee MLS experience.',
    url: 'https://www.returningnris.com/resources/sell-your-us-home-before-moving-back-to-india',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.returningnris.com/resources/sell-your-us-home-before-moving-back-to-india',
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
  fontSize: 'clamp(1.4rem,3vw,1.85rem)',
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

const quickCards = [
  [
    'Useful in a buyer market',
    'When homes are sitting longer and buyers have more leverage, controlling pricing directly can help you create sharper value.',
  ],
  [
    'The goal is qualified buyer attention',
    'The reason to price lower is not panic. It is to stand out versus competing listings and create urgency while you still protect net proceeds.',
  ],
  [
    'Flat fee MLS gives reach, not execution',
    'It gets your home onto the MLS and major portals, but you still run pricing, showings, and negotiation.',
  ],
  [
    'Use saved commission intentionally',
    'If a buyer has no realtor, you may have room to offer an extra 2% to 3% reduction or help with a rate buydown to make the deal easier to say yes to.',
  ],
]

const processSteps = [
  ['01', 'Prepare the home', 'Deep clean, declutter, handle minor repairs, and get professional photos before the listing goes live.'],
  ['02', 'Price below competing listings', 'In a buyer market, a measured discount can help your home stand out quickly without losing sight of net proceeds.'],
  ['03', 'List through flat fee MLS', 'Get MLS exposure plus Zillow, Redfin, and Realtor.com distribution while keeping control of the sale.'],
  ['04', 'Respond fast to buyers', 'Prompt replies and flexible showing windows keep momentum high in the first days of listing.'],
  ['05', 'Compare offers on strength', 'Look beyond headline price to financing quality, contingencies, closing speed, and buyer-agent fee.'],
  ['06', 'Sign the contract package', 'Review the purchase agreement and state disclosures carefully before you commit.'],
  ['07', 'Let title open escrow', 'Once escrow is open, the title company usually coordinates the mechanics all the way to closing.'],
  ['08', 'Move through inspection and appraisal', 'This is where repair credits, concessions, and buyer financing pressure often show up.'],
  ['09', 'Close and record', 'Sign final documents, clear payoff, and let the deed get recorded with the county.'],
  ['10', 'Receive proceeds', 'Your sale funds arrive after deductions, so the right formula matters more than the vanity number on the listing.'],
]

const workstreams = [
  {
    title: 'Home prep',
    copy:
      'The practical basics matter more than clever marketing: clean hard, remove visual clutter, fix obvious defects, and make the photos feel bright and current.',
  },
  {
    title: 'Listing and outreach',
    copy:
      'The flat fee MLS provider is your distribution layer on the major portals. Beyond that, make the listing easy to share in NRI WhatsApp groups, Facebook groups, alumni circles, temple communities, and local Indian networks for extra reach.',
  },
  {
    title: 'Showings',
    copy:
      'Speed matters. When buyers inquire, you want fast replies and minimal scheduling friction so interest does not cool off.',
  },
  {
    title: 'Offer review',
    copy:
      'The strongest offer is often not the highest one. Financing quality, repair posture, timeline, and buyer-agent compensation all affect your final outcome. If the buyer has no realtor, you may be able to redirect some of that saved commission into a price cut or rate help instead.',
  },
]

const costRows = [
  ['Flat fee MLS listing', 'A fixed upfront listing fee for MLS access and portal syndication.'],
  ['Buyer-agent commission', 'Often 2% to 3% if the buyer is represented. Plan for it explicitly.'],
  ['Title and escrow fees', 'Closing coordination, title processing, and the transaction mechanics.'],
  ['Owner title insurance', 'State and market norms vary, but sellers often cover this item.'],
  ['Property tax prorations', 'Taxes are typically prorated to the day of closing.'],
  ['Transfer taxes or recording fees', 'Local county or state closing charges can apply.'],
  ['HOA transfer costs', 'Resale certificates, move-out rules, and ownership transfer fees.'],
  ['Repair credits or concessions', 'Common after inspection, especially when buyers want a fast, simple closing.'],
  ['Attorney review if needed', 'Worth using in states or situations where contract review adds clarity and protection.'],
]

const fitCards = [
  [
    'This works best if you are detail-oriented',
    'NRIs who like structure, spreadsheets, and quick follow-through often do well with this model because the process rewards responsiveness more than salesmanship.',
  ],
  [
    'This is harder if you are already overloaded',
    'If your return move, school search, and job transition are all peaking at the same time, full-service support may be worth the trade-off.',
  ],
  [
    'The sweet spot is thoughtful DIY',
    'The strongest middle path is often DIY control with selective expert help: photography, title, legal review where needed, and maybe staging if the market expects it.',
  ],
]

const buyerPullLevers = [
  [
    'No-agent buyer discount',
    'If the buyer is not represented by a realtor, you may be able to pass along an extra 2% to 3% reduction and still come out ahead versus a traditional agent-led sale.',
  ],
  [
    'Interest rate buydown help',
    'Instead of cutting only the headline price, consider offering seller help toward an interest rate buydown if that makes the monthly payment easier for the buyer.',
  ],
  [
    'NRI community distribution',
    'Share the listing in relevant NRI WhatsApp groups, Facebook groups, alumni circles, and local Indian community networks to widen reach beyond the portals and surface warm leads.',
  ],
]

const relatedLinks = [
  ['/housing', 'Housing Finder', 'Compare India neighbourhood trade-offs before you land'],
  ['/planner', 'Return Planner', 'See what your move timing looks like across finances and family'],
  ['/journey', 'Journey Checklist', 'Track the move-back tasks that sit around the home sale'],
  ['/resources/nri-returning-to-india-checklist', 'NRI Return Checklist', 'Use a 14-step guide for the full relocation flow'],
]

export default function SellUsHomeGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Sell Your US Home Before Moving Back to India (2026 Guide)',
            description:
              'A practical guide for NRIs selling a US home before returning to India, based on a real FSBO plus flat fee MLS experience.',
            author: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            publisher: { '@type': 'Organization', name: 'ReturningNRIs', url: 'https://www.returningnris.com' },
            datePublished: '2026-07-28',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.returningnris.com/resources/sell-your-us-home-before-moving-back-to-india',
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
          <nav
            style={{
              fontSize: '12px',
              color: '#B5A898',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/" style={{ color: '#B5A898', textDecoration: 'none' }}>
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>
              Resource Guide
            </Link>
            <span>&gt;</span>
            <span style={{ color: '#6B5E50' }}>Sell Your US Home</span>
          </nav>

          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '100px',
                background: '#E8F5E8',
                color: '#138808',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Housing
            </span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>9 min read</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>Updated July 28, 2026</span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>US seller focused</span>
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.9rem,5vw,2.95rem)',
              color: '#1A1208',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: '1.2rem',
            }}
          >
            How to Sell Your US Home
            <br />
            Before Moving Back to India
          </h1>

          <p
            style={{
              fontSize: '1.08rem',
              color: '#6B5E50',
              lineHeight: 1.76,
              marginBottom: 0,
              maxWidth: '700px',
            }}
          >
            I wrote this for returning NRIs who are trying to sell in a slow market and feeling that quiet pressure of
            wanting the house sold before the move home.
          </p>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '2rem', borderBottom: '1px solid #E5E1DA' }}>
        <div style={prose}>
          <div
            style={{
              background: '#FFF3E6',
              border: '1.5px solid rgba(255,153,51,0.28)',
              borderRadius: '16px',
              padding: '1.5rem 1.6rem',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#CC7A00',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.8rem',
              }}
            >
              Quick Take
            </div>
            <div className="guide-grid">
              {quickCards.map((card) => (
                <div key={card[0]} className="quick-card">
                  <strong>{card[0]}</strong>
                  <span>{card[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 0' }}>
        <div style={prose}>
          <p style={pStyle}>
            Many returning NRIs are dealing with a home-sale market that feels much tougher than expected. In a buyer
            market, listings sit longer, buyers negotiate harder, and the usual hope that the home will just sell in a
            week or two starts to fade. That is not just a market problem. It becomes a personal one when your return to
            India already has dates, deadlines, and family decisions attached to it.
          </p>
          <p style={pStyle}>
            That is exactly why I wanted to share this. I ran into the same issue when I sold my own home. I did not want
            to sit around hoping the market would suddenly turn in my favor, and I also did not want to hand over a big
            chunk of the sale in commission if I could help it. The FSBO plus flat fee MLS route gave me a way to price a
            little more sharply than the competition, get attention faster, and still stay in control of the process.
          </p>

          <h2 style={h2Style}>The Core Idea: Full Control, Full Exposure</h2>
          <div className="guide-grid">
            <div className="feature-card">
              <div className="feature-pill">FSBO side</div>
              <div className="feature-title">You own the decision-making</div>
              <p className="feature-copy">
                You stay responsible for pricing, showing coordination, offer review, negotiation, and deciding exactly
                how aggressively you want to position the home against nearby competition.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-pill feature-pill-alt">Flat fee MLS side</div>
              <div className="feature-title">You still get market reach</div>
              <p className="feature-copy">
                The provider lists your home on the MLS and pushes it to major portals like Zillow, Redfin, and
                Realtor.com, so you are not sacrificing visibility.
              </p>
            </div>
          </div>

          <div className="callout-box">
            <div className="callout-label">The biggest lesson</div>
            <p className="callout-copy">
              What helped most was not some clever trick. It was simply being able to price more competitively than nearby
              homes while still getting the same broad MLS exposure buyers were already watching.
            </p>
          </div>

          <h2 style={h2Style}>The Step-by-Step Sale Flow</h2>
          <p style={pStyle}>
            This is the part most people want to see clearly. The diagram below is the full path from prep to proceeds,
            simplified for a returning NRI timeline.
          </p>

          <div className="process-shell">
            <div className="process-line" />
            {processSteps.map((step) => (
              <div key={step[0]} className="process-step">
                <div className="process-dot">{step[0]}</div>
                <div className="process-card">
                  <div className="process-title">{step[1]}</div>
                  <div className="process-copy">{step[2]}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Price for Net Proceeds, Not Ego</h2>
          <p style={pStyle}>
            This was probably the most important mindset shift for me. I priced relatively lower than competing homes, not
            because I thought the house was worth less, but because I knew buyers had options and I wanted mine to feel
            like the obvious one to look at first. That helped bring in more serious attention faster. Planning for
            buyer-agent commission ahead of time is what made that decision feel calm and intentional instead of emotional.
          </p>

          <div className="formula-box">
            <div className="formula-title">Net proceeds formula</div>
            <div className="formula-line">Sale price - mortgage payoff - buyer-agent commission - closing costs - seller concessions</div>
          </div>

          <p style={pStyle}>
            For NRIs, that formula matters even more because those proceeds often feed the India side of the move: rent
            buffers, down payment decisions, school deposits, and general relocation liquidity.
          </p>

          <h2 style={h2Style}>Extra Ways to Attract Buyers</h2>
          <p style={pStyle}>
            In a slower market, pricing is not the only thing that helps. Sometimes buyers are interested but still uneasy,
            and a small adjustment in structure can make the deal feel much easier for them to move forward on.
          </p>
          <p style={pStyle}>
            You do not need to throw every incentive at the listing. The better approach is to choose the one that reduces
            buyer hesitation the most while still protecting your net proceeds.
          </p>
          <div className="guide-grid">
            {buyerPullLevers.map((item) => (
              <div key={item[0]} className="feature-card">
                <div className="feature-title">{item[0]}</div>
                <p className="feature-copy">{item[1]}</p>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>What the Day-to-Day Work Actually Looks Like</h2>
          <div className="guide-grid">
            {workstreams.map((item) => (
              <div key={item.title} className="feature-card">
                <div className="feature-title">{item.title}</div>
                <p className="feature-copy">{item.copy}</p>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Seller Costs to Plan For Upfront</h2>
          <div className="table-shell">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Cost area</th>
                  <th>What to expect</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-stack">
            {costRows.map((row) => (
              <div key={row[0]} className="stack-card">
                <div className="stack-title">{row[0]}</div>
                <div className="stack-copy">{row[1]}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Where the Title Company Becomes the Hero</h2>
          <p style={pStyle}>
            Once the purchase contract is signed, the title company or escrow company usually carries more of the process
            than sellers expect. They hold earnest money, coordinate payoff, work with the buyer lender and appraiser,
            prepare settlement statements, and manage the recording flow. For me, this was the point where the whole thing
            started to feel less chaotic and more like a transaction that was actually moving toward the finish line.
          </p>

          <h2 style={h2Style}>Is This the Right Route for Returning NRIs?</h2>
          <div className="guide-grid">
            {fitCards.map((card) => (
              <div key={card[0]} className="decision-card">
                <div className="decision-title">{card[0]}</div>
                <div className="decision-copy">{card[1]}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Final Take</h2>
          <p style={pStyle}>
            If you are comfortable staying organized and handling the process carefully, FSBO plus flat fee MLS can be a
            very sensible way to sell quickly before moving back to India. In a buyer market, it gives you more freedom to
            price below competing homes, attract buyers faster, and use saved commission in smarter ways instead of just
            watching the listing sit.
          </p>
          <p style={pStyle}>
            If your bandwidth is already stretched thin, take the principle rather than the whole playbook: keep your eyes
            on net proceeds, but buy help where it genuinely reduces stress, risk, or complexity. The goal is not to prove
            that you can do everything yourself. The goal is to sell well and move on with one less thing hanging over your
            family.
          </p>
          <p style={pStyle}>
            And do not rely only on the portals. In this kind of market, community distribution can matter more than you
            think. A listing shared thoughtfully through NRI and Indian community groups can sometimes create the kind of
            warm buyer interest that a cold portal listing simply does not.
          </p>
          <p style={{ ...pStyle, fontSize: '0.94rem', color: '#6B5E50' }}>
            This guide is based on a real sale experience and adapted for returning NRI planning. Real estate forms,
            disclosure rules, attorney involvement, and closing customs vary by US state and local market.
          </p>
        </div>
      </article>

      <section
        style={{
          background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)',
          padding: '3rem 2rem',
          marginTop: '2rem',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.5rem,3vw,2rem)',
              color: '#fff',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}
          >
            Pair the home sale with the rest of the move plan
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: '1rem',
              lineHeight: 1.72,
              marginBottom: '1.75rem',
            }}
          >
            Selling well is only one part of the transition. The stronger move is to line it up with your India housing,
            tax timing, and family readiness.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/planner"
              style={{
                display: 'inline-block',
                background: '#FF9933',
                color: '#1A1208',
                borderRadius: '100px',
                padding: '12px 26px',
                fontSize: '14px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(255,153,51,0.4)',
              }}
            >
              Open the planner
            </Link>
            <Link
              href="/housing"
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                borderRadius: '100px',
                padding: '12px 26px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              Explore housing
            </Link>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2rem' }}>
        <div style={prose}>
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.8rem' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#B5A898',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1rem',
              }}
            >
              Related Resources
            </div>
            <div className="guide-grid">
              {relatedLinks.map((item) => (
                <Link
                  key={item[0]}
                  href={item[0]}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#F8F5F0',
                    border: '1px solid #E5E1DA',
                    borderRadius: '12px',
                    padding: '0.9rem 1rem',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      background: '#FFF3E6',
                      color: '#CC7A00',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    GO
                  </span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>
                      {item[1]}
                    </div>
                    <div style={{ fontSize: '11px', color: '#B5A898' }}>{item[2]}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      <ResourceComments articleSlug={ARTICLE_SLUG} />

      <div style={{ height: '2rem', background: '#fff' }} />

      <style>{`
        .guide-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .quick-card,
        .feature-card,
        .decision-card {
          background: #fff;
          border: 1px solid #E5E1DA;
          border-radius: 16px;
          padding: 1rem 1.05rem;
        }
        .quick-card strong,
        .feature-title,
        .decision-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #1A1208;
          line-height: 1.45;
          margin-bottom: 0.35rem;
        }
        .quick-card span,
        .feature-copy,
        .decision-copy {
          font-size: 13px;
          color: #6B5E50;
          line-height: 1.65;
        }
        .feature-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 0.8rem;
          background: #E8F5E8;
          color: #138808;
        }
        .feature-pill-alt {
          background: #EEF2FF;
          color: #1C4587;
        }
        .callout-box {
          margin-top: 1.25rem;
          background: linear-gradient(135deg, #FFF7EC 0%, #FCECDD 100%);
          border: 1px solid rgba(255,153,51,0.24);
          border-radius: 18px;
          padding: 1.1rem 1.2rem;
        }
        .callout-label {
          font-size: 11px;
          font-weight: 700;
          color: #CC7A00;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.45rem;
        }
        .callout-copy {
          margin: 0;
          font-size: 14px;
          line-height: 1.7;
          color: #7A5520;
        }
        .process-shell {
          position: relative;
          display: grid;
          gap: 1rem;
          margin-top: 1.25rem;
        }
        .process-line {
          position: absolute;
          left: 23px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, rgba(255,153,51,0.65) 0%, rgba(19,136,8,0.45) 100%);
        }
        .process-step {
          position: relative;
          display: grid;
          grid-template-columns: 46px 1fr;
          gap: 1rem;
          align-items: start;
        }
        .process-dot {
          position: relative;
          z-index: 1;
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF9933 0%, #CC7A00 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 22px rgba(255,153,51,0.25);
        }
        .process-card {
          background: #fff;
          border: 1px solid #E5E1DA;
          border-radius: 16px;
          padding: 1rem 1.05rem;
        }
        .process-title {
          font-size: 14px;
          font-weight: 700;
          color: #1A1208;
          line-height: 1.4;
          margin-bottom: 0.35rem;
        }
        .process-copy {
          font-size: 13px;
          color: #6B5E50;
          line-height: 1.7;
        }
        .formula-box {
          background: #1A1208;
          border-radius: 18px;
          padding: 1.2rem 1.25rem;
          margin: 1.2rem 0 1rem;
        }
        .formula-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.6rem;
        }
        .formula-line {
          color: #fff;
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.1rem, 2.8vw, 1.45rem);
          line-height: 1.45;
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
          padding: 0.95rem 0.9rem;
          border-bottom: 1px solid #EDE8E1;
          text-align: left;
          vertical-align: top;
          font-size: 13px;
          line-height: 1.6;
          color: #3D3229;
        }
        .compare-table th {
          font-size: 11px;
          font-weight: 700;
          color: #6B5E50;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: #F8F5F0;
          white-space: nowrap;
        }
        .compare-table td:first-child {
          font-weight: 600;
          color: #1A1208;
          width: 32%;
        }
        .mobile-stack {
          display: none;
        }
        .stack-card {
          border: 1px solid #E5E1DA;
          border-radius: 14px;
          padding: 1rem;
          background: #fff;
        }
        .stack-title {
          font-size: 13px;
          font-weight: 700;
          color: #1A1208;
          margin-bottom: 0.45rem;
        }
        .stack-copy {
          font-size: 13px;
          line-height: 1.65;
          color: #6B5E50;
        }
        @media (max-width: 820px) {
          .table-shell {
            display: none;
          }
          .mobile-stack {
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
          }
        }
      `}</style>
    </>
  )
}
