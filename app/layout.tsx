import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import NavBar from './NavBar'

export const metadata: Metadata = {
  title: 'ReturningNRIs — Free NRI Return Plan | Tax, City & School Guide',
  description: 'Moving back to India? Get a free personalised plan — RNOR tax savings, city comparison, school finder, and step-by-step checklist. Built by NRIs for NRIs.',
  keywords: 'NRI return to India, moving back to India from USA, RNOR tax benefit, NRI returning India guide, best city to move back India',
  openGraph: {
    title: 'Free NRI Return Plan — Tax, City & School Guide for Indians Moving Back',
    description: 'Stop losing ₹20–40L to mistakes NRIs make before they move back. Get your personalised return plan in 10 minutes — free.',
    url: 'https://www.returningnris.com',
    siteName: 'ReturningNRIs',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.returningnris.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ReturningNRIs — Free tools for NRIs moving back to India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@returningnris',
    creator: '@returningnris',
    title: 'Free NRI Return Plan — Tax, City & School Guide',
    description: 'Stop losing ₹20–40L to mistakes NRIs make before they move back. Personalised plan in 10 minutes — free.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

function Footer() {
  return (
    <footer style={{
      borderTop: '0.5px solid var(--border)',
      padding: '2rem 2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      background: 'var(--white)',
    }}>
      <Link href="/" style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: '1rem',
        color: 'var(--ink)',
        textDecoration: 'none',
      }}>
        <span style={{ color: 'var(--saffron)' }}>Returning</span><span style={{ color: 'var(--green)' }}>NRIs</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link href="/benefits" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>Benefits</Link>
        <Link href="/our-story" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>Our Story</Link>
        <a href="mailto:hello@returningnris.com" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>
          hello@returningnris.com
        </a>
        <a href="https://instagram.com/returningnris" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>
          Instagram
        </a>
        <a href="https://x.com/returningnris" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', textDecoration: 'none' }}>
          X / Twitter
        </a>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
        © 2026 ReturningNRIs
      </p>
    </footer>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}