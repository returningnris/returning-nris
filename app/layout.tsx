import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import NavBar from './NavBar'
import { INSTAGRAM_URL } from '../lib/social-links'

export const metadata: Metadata = {
  title: 'ReturningNRIs | Planner, Community, Guides and Videos for Moving Back to India',
  description:
    'Moving back to India? Use the Returning NRI Planner, join the community, and learn through practical guides and videos built by returned NRIs.',
  keywords:
    'NRI return to India, moving back to India from USA, Returning NRI planner, RNOR tax guide, returning NRI community',
  openGraph: {
    title: 'ReturningNRIs | Planner, Community, Guides and Videos for Moving Back to India',
    description:
      'Use a simple move-back planner, join a real Returning NRI community, and learn through practical guides and videos.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.returningnris.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReturningNRIs planner, community, guides and videos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@returningnris',
    creator: '@returningnris',
    title: 'ReturningNRIs | Planner, Community, Guides and Videos for Moving Back to India',
    description:
      'Use a simple move-back planner, join a real Returning NRI community, and learn through practical guides and videos.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

function Footer() {
  return (
    <footer
      className="site-footer"
      style={{
        borderTop: '0.5px solid var(--border)',
        background: '#fffdf9',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '2rem 1.25rem',
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        <div
          className="site-footer-grid"
          style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'minmax(0, 1.2fr) repeat(2, minmax(0, 0.9fr))',
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '1.05rem',
                color: 'var(--ink)',
                textDecoration: 'none',
              }}
            >
              <span style={{ color: 'var(--saffron)' }}>Returning</span>
              <span style={{ color: 'var(--green)' }}>NRIs</span>
            </Link>
            <p
              style={{
                marginTop: '0.8rem',
                maxWidth: 320,
                fontSize: '0.92rem',
                color: 'var(--ink-muted)',
                lineHeight: 1.7,
              }}
            >
              A practical move-back command center for planning clearly, learning quickly, and connecting with people who understand the journey.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '0.7rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Start Here
            </div>
            <Link href="/planner" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Planner
            </Link>
            <Link href="/community" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Join Community
            </Link>
            <Link href="/videos" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Videos & Short Tips
            </Link>
            <Link href="/resources" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Guides
            </Link>
          </div>

          <div style={{ display: 'grid', gap: '0.7rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              Contact
            </div>
            <a href="mailto:hello@returningnris.com" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              hello@returningnris.com
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Instagram Tips
            </a>
            <Link href="/community#join-community" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Request WhatsApp Invite
            </Link>
            <Link href="/our-story" style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>
              Our Story
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            paddingTop: '1rem',
            borderTop: '0.5px solid var(--border)',
          }}
        >
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>Built for families moving back to India with more clarity.</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>© 2026 ReturningNRIs</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .site-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
