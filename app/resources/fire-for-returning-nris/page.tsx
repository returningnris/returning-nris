import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FIRE for Returning NRIs (2026 Guide)',
  description:
    'A practical 2026 FIRE guide for returning NRI families. Understand how much corpus you may need in India across living expenses, children, healthcare, and housing.',
  keywords: [
    'FIRE for returning NRIs',
    'retire in India corpus',
    'NRI FIRE India family',
    'how much money to retire in India with family',
    'India FIRE corpus metro city',
  ],
  openGraph: {
    title: 'FIRE for Returning NRIs (2026 Guide)',
    description:
      'How much money a returning NRI family may need to retire comfortably in India, with realistic metro assumptions.',
    url: 'https://www.returningnris.com/resources/fire-for-returning-nris',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.returningnris.com/resources/fire-for-returning-nris',
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
  fontSize: 'clamp(1.4rem,3vw,1.75rem)',
  color: '#1A1208',
  marginBottom: '0.75rem',
  marginTop: '2.5rem',
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
  marginBottom: '0.45rem',
}

const assumptionRows = [
  { parentAge: '35', kidsAge: '5 & 2', annualExpenses: 'Rs 36L' },
  { parentAge: '40', kidsAge: '10 & 7', annualExpenses: 'Rs 40L' },
  { parentAge: '45', kidsAge: '15 & 12', annualExpenses: 'Rs 45L' },
  { parentAge: '50', kidsAge: '20 & 17', annualExpenses: 'Rs 42L' },
]

const fireTargets = [
  {
    age: '35',
    total: 'Rs 12.8 Cr',
    core: 'Rs 10.8 Cr',
    education: 'Rs 1.5 Cr',
    buffer: 'Rs 50L',
    note: 'The youngest family needs the biggest education runway and the longest retirement horizon.',
  },
  {
    age: '40',
    total: 'Rs 14.4 Cr',
    core: 'Rs 12 Cr',
    education: 'Rs 1.8 Cr',
    buffer: 'Rs 60L',
    note: 'This is often the most stretched decade: spending rises, school costs peak, and retirement may still be long.',
  },
  {
    age: '45',
    total: 'Rs 16.25 Cr',
    core: 'Rs 13.5 Cr',
    education: 'Rs 2 Cr',
    buffer: 'Rs 75L',
    note: 'Late-school and college years make this one of the heaviest funding phases for many families.',
  },
  {
    age: '50',
    total: 'Rs 14.1 Cr',
    core: 'Rs 12.6 Cr',
    education: 'Rs 50L',
    buffer: 'Rs 1 Cr',
    note: 'Education pressure eases, but healthcare risk climbs, so the mix changes even if the total comes down.',
  },
]

const corpusRanges = [
  {
    label: 'Lean FIRE',
    range: 'Rs 9-11 Cr',
    color: '#138808',
    bg: '#E8F5E8',
    border: 'rgba(19,136,8,0.2)',
    body: 'Works for a disciplined family with modest housing expectations, limited travel, and very little room for lifestyle creep.',
  },
  {
    label: 'Comfortable FIRE',
    range: 'Rs 13-17 Cr',
    color: '#CC7A00',
    bg: '#FFF3E6',
    border: 'rgba(255,153,51,0.22)',
    body: 'This is the most realistic target for returning NRIs who want private schooling, regular travel, and a little breathing room.',
  },
  {
    label: 'Fat FIRE',
    range: 'Rs 20 Cr+',
    color: '#7B241C',
    bg: '#FCEBEB',
    border: 'rgba(192,57,43,0.18)',
    body: 'Designed for premium housing, frequent international travel, higher discretionary spend, and stronger protection from uncertainty.',
  },
]

const relatedLinks = [
  {
    href: '/planner',
    icon: '📋',
    label: 'Readiness Planner',
    sub: 'See if your move timing is financially strong',
  },
  {
    href: '/rnor',
    icon: '📊',
    label: 'RNOR Calculator',
    sub: 'Estimate the tax window you may be able to use',
  },
  {
    href: '/resources/nri-returning-to-india-checklist',
    icon: '✅',
    label: 'Move Checklist',
    sub: 'Plan the return in the right sequence',
  },
  {
    href: '/resources/should-i-return-to-india-from-usa',
    icon: '🤔',
    label: 'Should I Return?',
    sub: 'A broader decision guide before you commit',
  },
]

export default function FireForReturningNRIsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'FIRE for Returning NRIs (2026 Guide)',
    description:
      'A practical guide to estimating how much a returning NRI family may need to retire comfortably in India.',
    author: {
      '@type': 'Organization',
      name: 'ReturningNRIs',
      url: 'https://www.returningnris.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ReturningNRIs',
      url: 'https://www.returningnris.com',
    },
    datePublished: '2026-03-28',
    dateModified: new Date().toISOString().split('T')[0],
    url: 'https://www.returningnris.com/resources/fire-for-returning-nris',
    mainEntityOfPage: 'https://www.returningnris.com/resources/fire-for-returning-nris',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
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
            <span>›</span>
            <Link href="/resources" style={{ color: '#B5A898', textDecoration: 'none' }}>
              Resource Guide
            </Link>
            <span>›</span>
            <span style={{ color: '#6B5E50' }}>FIRE for Returning NRIs</span>
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
                background: '#FFF3E6',
                color: '#CC7A00',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Financial Planning
            </span>
            <span style={{ fontSize: '12px', color: '#B5A898' }}>10 min read · Updated March 2026</span>
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.9rem,5vw,2.9rem)',
              color: '#1A1208',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '1.1rem',
            }}
          >
            FIRE for Returning NRIs
            <br />
            How Much Money You Need to Retire Comfortably in India with a Family
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#6B5E50',
              lineHeight: 1.75,
              marginBottom: 0,
            }}
          >
            Most FIRE advice for India breaks down for returning NRI families at the exact point where real life
            begins: children, metro-city costs, education inflation, and the need for a margin of safety. This guide
            is a more realistic starting point.
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
              padding: '1.5rem 1.75rem',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#CC7A00',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              The Short Answer
            </div>
            <p style={{ ...pStyle, marginBottom: '0.75rem' }}>
              For a returning NRI family with two children, a comfortable FIRE target in an Indian metro usually lands
              closer to <strong>Rs 13-17 crore, excluding your home</strong>. Lower numbers can work, but they leave
              less room for private schooling, healthcare surprises, and the kind of lifestyle drift that often shows
              up after the move.
            </p>
            <p style={{ ...pStyle, marginBottom: 0 }}>
              If you are aiming for a simpler life, you may get by on less. If you want premium housing, international
              travel, or expensive schooling, you will need materially more.
            </p>
          </div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2.5rem 2rem 3rem' }}>
        <div style={prose}>
          <p style={pStyle}>
            The reason FIRE feels confusing for returning NRIs is that most online calculators flatten India into one
            neat number. They assume moderate inflation, smooth expenses, and a retirement path without too many sharp
            edges. That is not how metro family life usually works.
          </p>
          <p style={pStyle}>
            In practice, urban lifestyle inflation can sit around 5% in real terms, while education and healthcare
            often climb much faster. School fees do not care what CPI is doing. Good medical care does not wait for
            your spreadsheet to catch up. And once you add two children to the mix, the difference between an adequate
            corpus and a comfortable one gets wider than many people expect.
          </p>

          <h2 style={h2Style}>Why India FIRE Math Often Feels Too Optimistic</h2>
          <p style={pStyle}>
            If you spend time in Indian FIRE communities on Reddit, a pattern emerges pretty quickly. Leaner plans are
            often discussed in the Rs 8-10 crore range. But when the conversation shifts to families in Bangalore,
            Hyderabad, Mumbai, or Gurgaon, the numbers move up. The tone changes too. People stop talking only about
            hitting a number and start talking about resilience.
          </p>
          <p style={pStyle}>
            One recurring lesson from those discussions is that matching annual expenses on paper is not enough. A
            family can look technically covered and still feel financially fragile, because inflation, children, and
            uncertainty rarely arrive one at a time. They tend to show up together.
          </p>

          <h2 style={h2Style}>A Better Way to Think About FIRE for a Returning NRI Family</h2>
          <p style={pStyle}>Instead of chasing one giant number, it helps to break FIRE into three buckets:</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.85rem',
              margin: '1.25rem 0 1.5rem',
            }}
          >
            {[
              {
                title: 'Living corpus',
                body: 'The long-term pool that funds your family lifestyle year after year.',
              },
              {
                title: "Children's education corpus",
                body: 'A separate bucket for school and higher-education costs, which tend to inflate faster than everything else.',
              },
              {
                title: 'Safety buffer',
                body: 'Your shock absorber for medical events, emergencies, and the many expenses that never make it into idealized FIRE math.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#F8F5F0',
                  border: '1px solid #E5E1DA',
                  borderRadius: '14px',
                  padding: '1rem 1.1rem',
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '1rem',
                    color: '#1A1208',
                    marginBottom: '0.45rem',
                  }}
                >
                  {item.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6B5E50', lineHeight: 1.65 }}>{item.body}</div>
              </div>
            ))}
          </div>

          <p style={pStyle}>
            As a conservative rule of thumb, this guide uses <strong>annual expenses x 30</strong> for the living
            corpus. That implies a withdrawal rate of roughly 3.3%, which is more cautious than the classic 4% rule
            and better suited to a long retirement in an inflationary environment.
          </p>

          <h2 style={h2Style}>Assumptions Used in This Guide</h2>
          <p style={pStyle}>
            These numbers assume a family of four living in a metro city, using private schooling, maintaining health
            insurance, traveling occasionally, and spending comfortably but not extravagantly.
          </p>

          <div
            className="fire-assumptions-table"
            style={{
              border: '1px solid #E5E1DA',
              borderRadius: '16px',
              overflow: 'hidden',
              margin: '1rem 0 1.5rem',
            }}
          >
            <div
              className="fire-assumptions-header"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                background: '#F8F5F0',
                borderBottom: '1px solid #E5E1DA',
              }}
            >
              {['Parent age', 'Kids age', 'Annual expenses'].map((heading) => (
                <div
                  key={heading}
                  style={{
                    padding: '0.9rem 1rem',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#6B5E50',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {heading}
                </div>
              ))}
            </div>
            {assumptionRows.map((row, index) => (
              <div
                key={row.parentAge}
                className="fire-assumptions-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  borderBottom: index === assumptionRows.length - 1 ? 'none' : '1px solid #E5E1DA',
                }}
              >
                <div className="fire-assumptions-cell" style={{ padding: '0.95rem 1rem', fontSize: '14px', color: '#1A1208' }}>
                  <span className="fire-assumptions-label">Parent age</span>
                  <span>{row.parentAge}</span>
                </div>
                <div className="fire-assumptions-cell" style={{ padding: '0.95rem 1rem', fontSize: '14px', color: '#3D3229' }}>
                  <span className="fire-assumptions-label">Kids age</span>
                  <span>{row.kidsAge}</span>
                </div>
                <div className="fire-assumptions-cell" style={{ padding: '0.95rem 1rem', fontSize: '14px', color: '#3D3229' }}>
                  <span className="fire-assumptions-label">Annual expenses</span>
                  <span>{row.annualExpenses}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={pStyle}>
            You will notice that spending rises through the middle years and then dips slightly by age 50. That is not
            because life gets cheaper in every way. It is because school-related costs begin to ease even as healthcare
            risk starts to matter more.
          </p>

          <h2 style={h2Style}>Estimated FIRE Corpus by Age</h2>
          <p style={pStyle}>
            Here is one practical way to translate those assumptions into a total corpus, excluding the value of your
            home:
          </p>

          <div style={{ display: 'grid', gap: '0.9rem', margin: '1.25rem 0 1.5rem' }}>
            {fireTargets.map((target) => (
              <div
                key={target.age}
                style={{
                  background: '#fff',
                  border: '1px solid #E5E1DA',
                  borderRadius: '16px',
                  padding: '1.15rem 1.2rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem', color: '#1A1208' }}>
                    Age {target.age}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#CC7A00' }}>Total: {target.total}</div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ background: '#F8F5F0', borderRadius: '10px', padding: '0.8rem 0.9rem' }}>
                    <div style={{ fontSize: '11px', color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Core living corpus
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1208' }}>{target.core}</div>
                  </div>
                  <div style={{ background: '#F8F5F0', borderRadius: '10px', padding: '0.8rem 0.9rem' }}>
                    <div style={{ fontSize: '11px', color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Education corpus
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1208' }}>{target.education}</div>
                  </div>
                  <div style={{ background: '#F8F5F0', borderRadius: '10px', padding: '0.8rem 0.9rem' }}>
                    <div style={{ fontSize: '11px', color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Buffer
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1208' }}>{target.buffer}</div>
                  </div>
                </div>
                <p style={{ ...pStyle, marginBottom: 0 }}>{target.note}</p>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>The Important Insight Most People Miss</h2>
          <p style={pStyle}>
            FIRE corpus does not rise in a straight line with age. Younger families need to fund more years of
            children-related spending and a longer retirement. Older families may need a slightly smaller total number,
            but they also need a sturdier healthcare buffer.
          </p>
          <p style={pStyle}>
            That is why the target for a 50-year-old family can look lower than the target at 45, even though risk has
            not disappeared. It has simply changed shape.
          </p>

          <h2 style={h2Style}>Do Not Mix Your Home Into the FIRE Corpus</h2>
          <p style={pStyle}>
            If you do not already own a home in India, treat housing as a separate requirement. A primary residence is
            not an income-producing asset, and counting it inside your retirement corpus usually creates a false sense
            of comfort.
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem' }}>
            <li style={liStyle}>Rs 1.5-2 crore is a reasonable placeholder for moderate metro housing.</li>
            <li style={liStyle}>Rs 2-3.5 crore or more is more realistic for a premium metro lifestyle.</li>
          </ul>

          <h2 style={h2Style}>Lean, Comfortable, and Fat FIRE</h2>
          <p style={pStyle}>
            If you want a simpler rule of thumb, these ranges are a useful shorthand across families in the age 35-50
            band:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.9rem',
              margin: '1.2rem 0 1.5rem',
            }}
          >
            {corpusRanges.map((range) => (
              <div
                key={range.label}
                style={{
                  background: range.bg,
                  border: `1.5px solid ${range.border}`,
                  borderRadius: '14px',
                  padding: '1rem 1.1rem',
                }}
              >
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: range.color, marginBottom: '0.35rem' }}>
                  {range.label}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: range.color, marginBottom: '0.55rem' }}>
                  {range.range}
                </div>
                <div style={{ fontSize: '13px', color: range.color, lineHeight: 1.65 }}>{range.body}</div>
              </div>
            ))}
          </div>

          <h2 style={h2Style}>Mistakes Returning NRIs Commonly Make</h2>
          <ul style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem' }}>
            <li style={liStyle}>Using the 4% rule mechanically, without adjusting for long retirement horizons and Indian inflation risk.</li>
            <li style={liStyle}>Treating children&apos;s education as a side expense instead of a dedicated corpus.</li>
            <li style={liStyle}>Counting the family home as part of the retirement pool.</li>
            <li style={liStyle}>Assuming current spending will remain flat after the move, even though lifestyle creep often shows up within the first year or two.</li>
            <li style={liStyle}>Planning the corpus carefully but ignoring tax structure, especially the RNOR window during the return.</li>
          </ul>

          <h2 style={h2Style}>Final Thought</h2>
          <p style={pStyle}>
            FIRE is not really about hitting a number that looks good in a spreadsheet. For most returning NRI families,
            it is about reaching a point where money stops being the hidden source of tension behind every decision.
          </p>
          <p style={pStyle}>
            If you want to move back once and stay back with confidence, it is worth building a corpus that can absorb
            real life, not just average life.
          </p>
        </div>
      </article>

      <section style={{ background: 'linear-gradient(135deg, #1A1208 0%, #2A1E08 100%)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📌</div>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.5rem,3vw,2rem)',
              color: '#fff',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}
          >
            Plan the move, not just the corpus
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.58)',
              fontSize: '1rem',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
            }}
          >
            A strong FIRE number helps, but timing, tax structure, and relocation sequencing matter just as much.
            Use the tools below to pressure-test the move from more than one angle.
          </p>
          <Link
            href="/planner"
            style={{
              display: 'inline-block',
              background: '#FF9933',
              color: '#1A1208',
              borderRadius: '100px',
              padding: '13px 30px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(255,153,51,0.45)',
              marginBottom: '0.75rem',
            }}
          >
            Check my readiness score →
          </Link>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.32)' }}>Free · no account needed · 2 minutes</div>
        </div>
      </section>

      <article style={{ background: '#fff', padding: '2rem' }}>
        <div style={prose}>
          <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '1.75rem' }}>
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {relatedLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#F8F5F0',
                    border: '1px solid #E5E1DA',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem',
                    textDecoration: 'none',
                  }}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1208', marginBottom: '2px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#B5A898' }}>{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #E5E1DA',
              paddingTop: '1.75rem',
              marginTop: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9933, #CC7A00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1rem',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              B
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1208' }}>Bharath Mandava &amp; Swathi Bandla</div>
              <div style={{ fontSize: '12px', color: '#B5A898' }}>
                Co-founders, ReturningNRIs · 16 years in the USA · Moving back April 2026
              </div>
            </div>
          </div>
        </div>
      </article>

      <div style={{ height: '2rem', background: '#fff' }} />
      <style>{`
        .fire-assumptions-label {
          display: none;
          font-size: 11px;
          font-weight: 700;
          color: #B5A898;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        @media (max-width: 640px) {
          .fire-assumptions-table {
            border-radius: 14px !important;
          }

          .fire-assumptions-header {
            display: none !important;
          }

          .fire-assumptions-row {
            grid-template-columns: 1fr !important;
            gap: 0.75rem;
            padding: 1rem;
          }

          .fire-assumptions-cell {
            padding: 0 !important;
            display: flex;
            flex-direction: column;
          }

          .fire-assumptions-label {
            display: block;
          }
        }
      `}</style>
    </>
  )
}
