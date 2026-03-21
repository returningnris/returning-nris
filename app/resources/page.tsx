import Link from 'next/link'
import { Metadata } from 'next'
import { GUIDES } from '../NavBar'

export const metadata: Metadata = {
  title: 'NRI Return Articles — ReturningNRIs',
  description: 'Practical, in-depth guides for NRIs planning to return to India. Covers tax planning, city comparisons, school transitions, career moves, and financial readiness.',
  openGraph: {
    title: 'NRI Return Articles — ReturningNRIs',
    description: 'Practical, in-depth guides for NRIs planning to return to India.',
    url: 'https://www.returningnris.com/resources',
  },
}

// When you add a new guide to NavBar.tsx GUIDES array, it auto-appears here
// No other changes needed

const CATEGORIES = ['All', ...Array.from(new Set(GUIDES.map(g => g.category)))]

export default function ResourceGuideIndex() {
  return (
    <>
      {/* HEADER */}
      <section style={{ background: '#F8F5F0', backgroundImage: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)', padding: '5rem 2rem 4rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#fff', border: '1px solid rgba(255,153,51,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(255,153,51,0.1)' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>NRI Return Articles</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#1A1208', marginBottom: '1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Everything you need to know<br />about <em style={{ color: '#FF9933', fontStyle: 'italic' }}>returning to India</em>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#6B5E50', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto 2rem' }}>
            In-depth guides written by NRIs, for NRIs. No generic advice — just the specific information that matters for your move.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/planner" style={{ background: '#FF9933', color: '#fff', borderRadius: '100px', padding: '10px 22px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 16px rgba(255,153,51,0.35)' }}>
              Check your readiness score →
            </Link>
            <span style={{ fontSize: '13px', color: '#B5A898' }}>{GUIDES.length} guide{GUIDES.length !== 1 ? 's' : ''} · more added weekly</span>
          </div>
        </div>
      </section>

      {/* GUIDES GRID */}
      <section style={{ background: '#F8F5F0', padding: '3rem 2rem 5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          {/* Stats bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '13px', color: '#6B5E50' }}>
              <strong style={{ color: '#1A1208' }}>{GUIDES.length} guide{GUIDES.length !== 1 ? 's' : ''}</strong> · updated for 2026
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <span key={cat} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: cat === 'All' ? '#1A1208' : '#fff', color: cat === 'All' ? '#fff' : '#6B5E50', border: '1px solid #E5E1DA', fontWeight: cat === 'All' ? 600 : 400 }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Guide cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {GUIDES.map(guide => (
              <Link key={guide.href} href={guide.href} style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid #E5E1DA', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFF3E6', border: '1px solid rgba(255,153,51,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>
                  {guide.icon}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {guide.category}
                  </span>
                  <span style={{ fontSize: '10px', color: '#B5A898', padding: '2px 8px', background: '#F8F5F0', borderRadius: '100px' }}>
                    {guide.readMins} min read
                  </span>
                </div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#1A1208', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                  {guide.label}
                </h2>
                <p style={{ fontSize: '13px', color: '#6B5E50', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {guide.sub}
                </p>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#FF9933', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Read guide <span>→</span>
                </div>
              </Link>
            ))}

            {/* Coming soon card */}
            <div style={{ background: 'rgba(255,153,51,0.04)', border: '1.5px dashed rgba(255,153,51,0.3)', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '220px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>✍️</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#6B5E50', marginBottom: '4px' }}>More guides coming</div>
              <div style={{ fontSize: '12px', color: '#B5A898', lineHeight: 1.5 }}>RNOR tax deep-dive, city comparisons, school transition guide, and more</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{ background: '#1A1208', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#fff', marginBottom: '0.75rem' }}>
            Reading guides is step one.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
            Take the 2-minute readiness assessment and get a personalised score, your top risks, and a clear move-or-delay recommendation.
          </p>
          <Link href="/planner" style={{ display: 'inline-block', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '12px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,153,51,0.4)' }}>
            Check my readiness score →
          </Link>
        </div>
      </section>
    </>
  )
}