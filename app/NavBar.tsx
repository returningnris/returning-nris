'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const pathname = usePathname()

 const links: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
    { href: '/benefits', label: 'Products' },
    { href: '/community', label: 'Community' },
    { href: '/our-story', label: 'Our Story' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '0.5px solid var(--border)',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <svg width="28" height="32" viewBox="0 0 52 56" fill="none">
          <rect x="0" y="0" width="52" height="18" rx="5" fill="#FF9933"/>
          <rect x="0" y="18" width="52" height="20" fill="#F4F0E8"/>
          <rect x="0" y="38" width="52" height="18" rx="5" fill="#138808"/>
          <circle cx="26" cy="28" r="8" fill="none" stroke="#000080" strokeWidth="1.5"/>
          <circle cx="26" cy="28" r="2" fill="#000080"/>
        </svg>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: 'var(--ink)' }}>
          Returning<span style={{ color: 'var(--saffron)' }}>NRIs</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: '0.875rem',
                color: isActive ? 'var(--ink)' : 'var(--ink-muted)',
                fontWeight: isActive ? 500 : 400,
                borderBottom: isActive ? '2px solid var(--saffron)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          )
        })}
        <Link href="/contact" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          Join Waitlist →
        </Link>
      </div>
    </nav>
  )
}