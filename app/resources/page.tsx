import type { Metadata } from 'next'
import Link from 'next/link'
import { ARTICLES as GUIDES } from '../../lib/articles-data'
import ResourceGuideDirectory from '../../components/ResourceGuideDirectory'

export const metadata: Metadata = {
  title: 'Returning to India Guides for NRIs | RNOR, Checklist, Cities, Schools',
  description:
    'Explore practical guides for NRIs moving back to India, including RNOR tax planning, city comparisons, school decisions, housing, and financial readiness.',
  alternates: {
    canonical: 'https://www.returningnris.com/resources',
  },
  openGraph: {
    title: 'Returning to India Guides for NRIs | RNOR, Checklist, Cities, Schools',
    description:
      'Explore practical guides for NRIs moving back to India, including RNOR tax planning, city comparisons, school decisions, housing, and financial readiness.',
    url: 'https://www.returningnris.com/resources',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning to India Guides for NRIs | RNOR, Checklist, Cities, Schools',
    description:
      'Explore practical guides for NRIs moving back to India, including RNOR tax planning, city comparisons, school decisions, housing, and financial readiness.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

export default function ResourceGuideIndex() {
  return (
    <>
      <section
        style={{
          background: '#FFFFFF',
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%)',
          padding: '5rem 2rem 4rem',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: '#fff',
              border: '1px solid rgba(255,153,51,0.25)',
              borderRadius: '100px',
              padding: '5px 14px',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 8px rgba(255,153,51,0.1)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#6B5E50', letterSpacing: '0.06em' }}>
              Free guides for NRIs moving back to India
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2rem,5vw,3rem)',
              color: '#1A1208',
              marginBottom: '1rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Returning to India Guides for NRIs
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#6B5E50',
              lineHeight: 1.75,
              maxWidth: '620px',
              margin: '0 auto 1rem',
            }}
          >
            Practical guides on RNOR, moving checklists, city choice, schools, housing, and financial planning for
            NRIs moving back to India.
          </p>

          <p
            style={{
              fontSize: '0.98rem',
              color: '#6B5E50',
              lineHeight: 1.75,
              maxWidth: '680px',
              margin: '0 auto 2rem',
            }}
          >
            Browse practical guides for NRIs returning to India from the USA, UK, Canada, UAE, and other countries.
            Learn about RNOR tax status, move planning, choosing the right city, school boards, housing decisions, and
            first-year setup.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/planner"
              style={{
                background: '#FF9933',
                color: '#fff',
                borderRadius: '100px',
                padding: '10px 22px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(255,153,51,0.35)',
              }}
            >
              See readiness by persona
            </Link>
            <Link
              href="/planner#timeline"
              style={{
                background: '#fff',
                color: '#1A1208',
                borderRadius: '100px',
                padding: '10px 22px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid #E5E1DA',
              }}
            >
              View move timeline
            </Link>
            <span style={{ fontSize: '13px', color: '#B5A898' }}>
              {GUIDES.length} guide{GUIDES.length !== 1 ? 's' : ''} and counting
            </span>
          </div>
        </div>
      </section>

      <section style={{ background: '#FFFFFF', padding: '3rem 2rem 5rem' }}>
        <ResourceGuideDirectory guides={GUIDES} />
      </section>

      <section style={{ background: '#1A1208', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(1.6rem,3vw,2.2rem)',
              color: '#fff',
              marginBottom: '0.75rem',
            }}
          >
            Reading guides is a good place to start.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
            Start with readiness by persona, then use these guides to go deeper on RNOR, city choice, schools, housing,
            and first-year planning.
          </p>
          <Link
            href="/planner"
            style={{
              display: 'inline-block',
              background: '#FF9933',
              color: '#1A1208',
              borderRadius: '100px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(255,153,51,0.4)',
            }}
          >
            See readiness by persona
          </Link>
        </div>
      </section>

    </>
  )
}
