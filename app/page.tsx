import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../lib/social-icons'
import { INSTAGRAM_URL } from '../lib/social-links'
import { COMMUNITY_METRICS, JOURNEY_STEPS, WHY_RETURNING_NRIS } from '../lib/homepage-content'

export const metadata: Metadata = {
  title: 'ReturningNRIs | Telugu Returning NRI Community',
  description:
    'ReturningNRIs is a Telugu NRI community built by returned NRIs, helping Telugu families plan, move and settle back in India with practical guidance and real community support.',
  keywords: ['Telugu Returning NRIs', 'Telugu NRI community', 'Telugu NRI returning to India', 'Returning NRI Hyderabad', 'Telugu families moving back to India'],
  alternates: { canonical: 'https://www.returningnris.com' },
  openGraph: {
    title: 'ReturningNRIs | Telugu Returning NRI Community',
    description: 'Built by Telugu NRIs who returned home. Practical guidance and a community for Telugu families coming home.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-returningnris-logo-2026.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReturningNRIs | Telugu Returning NRI Community',
    description: 'Practical guidance and a real community for Telugu families coming home.',
    images: ['https://www.returningnris.com/og-returningnris-logo-2026.png'],
  },
}

export default function Home() {
  return (
    <main>
      <style>{`
        .home-shell { max-width: 1240px; margin: 0 auto; padding: 0 1.25rem; }
        .home-hero { display: grid; gap: clamp(2rem, 4vw, 3rem); justify-items: center; padding: clamp(3.25rem, 7vw, 6.5rem) 0; }
        .home-hero-copy { max-width: 790px; text-align: center; }
        .home-hero-image { position: relative; width: min(100%, 1040px); overflow: hidden; border-radius: 28px; aspect-ratio: 16 / 9; background: #e9eef5; box-shadow: 0 28px 72px rgba(12, 43, 79, .18); }
        .home-actions { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
        .home-actions > a { min-height: 48px; justify-content: center; }
        .home-social-links { display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-top: 1.15rem; }
        .home-proof { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid rgba(12, 43, 79, .12); border-bottom: 1px solid rgba(12, 43, 79, .12); }
        .home-proof-item { padding: 1.35rem 1.5rem; border-right: 1px solid rgba(12, 43, 79, .12); }
        .home-proof-item:last-child { border-right: 0; }
        .home-section { padding: clamp(4.5rem, 9vw, 7.5rem) 0; }
        .home-intro { max-width: 620px; margin: 0 auto clamp(1.75rem, 4vw, 2.8rem); text-align: center; }
        .home-card-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
        .home-card { background: #fff; border: 1px solid rgba(12, 43, 79, .11); border-radius: 22px; padding: 1.45rem; box-shadow: 0 14px 38px rgba(12, 43, 79, .05); }
        .home-founder { display: grid; grid-template-columns: minmax(220px, .75fr) minmax(0, 1.25fr); align-items: center; gap: clamp(1.5rem, 5vw, 4.5rem); background: #f4f7fb; border-radius: 30px; overflow: hidden; }
        .home-founder-image { position: relative; min-height: 100%; align-self: stretch; }
        .home-journey { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .8rem; }
        .home-journey a { min-height: 185px; }
        .home-cta { border-radius: 30px; background: #062c59; color: #fff; padding: clamp(2rem, 6vw, 4.75rem); text-align: center; }
        @media (max-width: 900px) {
          .home-hero { gap: 2rem; padding: 3.5rem 0 4rem; }
          .home-hero-copy { max-width: 680px; }
          .home-founder { grid-template-columns: 1fr; }
          .home-founder-image { aspect-ratio: 16 / 8; min-height: auto; }
          .home-card-grid { grid-template-columns: 1fr; }
          .home-journey { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .home-shell { padding: 0 1rem; }
          .home-hero { padding: 2.6rem 0 3rem; gap: 1.5rem; }
          .home-hero-image { border-radius: 20px; }
          .home-actions { display: grid; grid-template-columns: 1fr; }
          .home-actions > a { width: 100%; }
          .home-social-links { display: grid; gap: .75rem; }
          .home-proof { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .home-proof-item { padding: 1rem; }
          .home-proof-item:nth-child(2) { border-right: 0; }
          .home-proof-item:nth-child(-n+2) { border-bottom: 1px solid rgba(12, 43, 79, .12); }
          .home-section { padding: 4rem 0; }
          .home-founder { border-radius: 22px; }
          .home-journey { grid-template-columns: 1fr; }
          .home-journey a { min-height: auto; }
        }
      `}</style>

      <section style={{ background: 'linear-gradient(180deg, #f8fbff 0%, #ffffff 100%)' }}>
        <div className="home-shell">
          <div className="home-hero">
            <div className="home-hero-copy">
              <p style={{ color: '#e87817', fontSize: '.75rem', fontWeight: 800, letterSpacing: '.13em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Telugu Returning NRI Community
              </p>
              <h1 style={{ fontSize: 'clamp(2.45rem, 4.6vw, 4.4rem)', lineHeight: 1.02, color: '#062c59', margin: '0 auto 1.25rem', maxWidth: '780px' }}>
                Returning back to India? Come Join your Biggest Returning NRI Telugu community.
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', lineHeight: 1.75, color: '#526476', maxWidth: '640px', margin: '0 auto .75rem' }}>
                Built by Telugu NRIs who made the move back—sharing practical guidance and real experiences for families coming home.
              </p>
              <p style={{ color: '#062c59', fontSize: '.92rem', fontWeight: 700, marginBottom: '1.65rem' }}>Based in Hyderabad. Here for Telugu NRIs everywhere.</p>
              <div className="home-actions" style={{ justifyContent: 'center' }}>
                <Link href="/community#join-community" className="btn-secondary"><WhatsAppIcon size={18} />Join our WhatsApp community</Link>
                <Link href="/planner" className="btn-ghost" style={{ borderColor: 'rgba(6, 44, 89, .25)', color: '#062c59' }}>Plan my return</Link>
              </div>
              <div className="home-social-links">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', color: '#062c59', fontSize: '.88rem', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}><InstagramIcon size={18} />Follow Instagram for Practical Tips</a>
                <Link href="/videos" style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', color: '#062c59', fontSize: '.88rem', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}><YouTubeIcon size={18} />Returned NRIs Stories</Link>
              </div>
            </div>

            <div className="home-hero-image">
              <Image
                src="/home-hero-1400.webp"
                alt="Journey from the United States to Hyderabad, India for returning NRIs"
                fill
                preload
                quality={72}
                sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1100px) calc(100vw - 2.5rem), 1040px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </div>

          <div className="home-proof" aria-label="Community highlights">
            {COMMUNITY_METRICS.map((metric) => (
              <div className="home-proof-item" key={metric.label}>
                <div style={{ color: '#062c59', fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem', lineHeight: 1.1, marginBottom: '.25rem' }}>{metric.value}</div>
                <div style={{ color: '#637386', fontSize: '.8rem', fontWeight: 700 }}>{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <div className="home-intro">
            <p className="section-label">Why ReturningNRIs</p>
            <h2 className="section-title" style={{ color: '#062c59' }}>Built by people who made the move.</h2>
          </div>
          <div className="home-card-grid">
            {WHY_RETURNING_NRIS.map((card) => (
              <article className="home-card" key={card.title}>
                <div style={{ width: 34, height: 4, borderRadius: 999, background: '#f18b2b', marginBottom: '1.3rem' }} />
                <h3 style={{ color: '#062c59', fontSize: '1.18rem', marginBottom: '.55rem' }}>{card.title}</h3>
                <p style={{ color: '#637386', lineHeight: 1.65, fontSize: '.94rem' }}>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-shell">
          <div className="home-founder">
            <div className="home-founder-image">
              <Image src="/founders.jpg" alt="The founders of ReturningNRIs" fill sizes="(max-width: 900px) 100vw, 34vw" style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ padding: 'clamp(1.6rem, 5vw, 4rem)' }}>
              <p className="section-label">Our story</p>
              <h2 className="section-title" style={{ color: '#062c59', maxWidth: '590px' }}>From abroad to Hyderabad—we made the move too.</h2>
              <p style={{ color: '#526476', lineHeight: 1.75, maxWidth: '620px', marginBottom: '1rem' }}>
                We spent years abroad, faced the same questions around kids, careers, finances, and settling back, and eventually returned to Hyderabad. ReturningNRIs was created to make that journey easier for other Telugu families.
              </p>
              <p style={{ color: '#062c59', fontWeight: 700, fontSize: '.9rem', marginBottom: '1.4rem' }}>Our experience started it. The community makes it stronger.</p>
              <Link href="/our-story" style={{ color: '#062c59', fontWeight: 800, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Read our story</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ background: '#f7f9fc' }}>
        <div className="home-shell">
          <div className="home-intro">
            <p className="section-label">Hyderabad is home</p>
            <h2 className="section-title" style={{ color: '#062c59' }}>Local experience. A wider welcome.</h2>
            <p className="section-sub" style={{ margin: '.75rem auto 0', maxWidth: '600px' }}>Our founders live here, and this is where our community knowledge is strongest.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.7rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {['Schools', 'Neighborhoods', 'Careers', 'Life after return'].map((topic) => <span key={topic} style={{ padding: '.65rem .95rem', borderRadius: 999, background: '#fff', border: '1px solid rgba(6, 44, 89, .12)', color: '#062c59', fontSize: '.88rem', fontWeight: 700 }}>{topic}</span>)}
          </div>
          <div style={{ textAlign: 'center' }}><Link href="/resources/hyderabad-neighbourhood-guide-for-returning-nri-families" className="btn-ghost" style={{ color: '#062c59', borderColor: 'rgba(6, 44, 89, .25)' }}>Explore Hyderabad resources</Link></div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-shell">
          <div className="home-intro">
            <p className="section-label">Your return journey</p>
            <h2 className="section-title" style={{ color: '#062c59' }}>Where are you in your journey?</h2>
          </div>
          <div className="home-journey">
            {JOURNEY_STEPS.map((step, index) => (
              <Link key={step.title} href={step.href} style={{ display: 'block', borderRadius: 20, padding: '1.25rem', background: index % 2 === 0 ? '#062c59' : '#f5f7fa', border: index % 2 === 0 ? '1px solid #062c59' : '1px solid rgba(6, 44, 89, .12)' }}>
                <div style={{ color: index % 2 === 0 ? '#f4b268' : '#e87817', fontSize: '.75rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>0{index + 1}</div>
                <h3 style={{ color: index % 2 === 0 ? '#fff' : '#062c59', fontSize: '1.08rem', marginBottom: '.5rem' }}>{step.title}</h3>
                <p style={{ color: index % 2 === 0 ? 'rgba(255,255,255,.72)' : '#637386', fontSize: '.88rem', lineHeight: 1.55 }}>{step.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" style={{ paddingTop: 0 }}>
        <div className="home-shell">
          <div className="home-cta">
            <p style={{ color: '#f4b268', fontSize: '.75rem', fontWeight: 800, letterSpacing: '.13em', textTransform: 'uppercase', marginBottom: '.9rem' }}>For every Telugu NRI coming home</p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginBottom: '.85rem' }}>Coming home is easier with your people.</h2>
            <p style={{ color: 'rgba(255,255,255,.75)', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 1.6rem' }}>Join Telugu families who are planning, moving, and settling back in India.</p>
            <div className="home-actions" style={{ justifyContent: 'center' }}>
              <Link href="/community#join-community" className="btn-secondary"><WhatsAppIcon size={18} />Join the WhatsApp community</Link>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}><InstagramIcon size={18} />Follow on Instagram</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
