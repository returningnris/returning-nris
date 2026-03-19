'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const TOOLS = [
  { href: '/rnor', label: 'RNOR Calculator', icon: '📊', sub: 'Optimise your tax window' },
  { href: '/city', label: 'City Match', icon: '🏙️', sub: 'Find your ideal city' },
  { href: '/schools', label: 'Schools Finder', icon: '🎓', sub: 'Compare international schools' },
  { href: '/housing', label: 'Housing Finder', icon: '🏠', sub: 'Find your neighbourhood' },
  { href: '/healthcare', label: 'Healthcare Guide', icon: '🏥', sub: 'Hospitals & insurance' },
  { href: '/citylife', label: 'City Life Guide', icon: '☕', sub: 'Where to eat, work & live' },
  { href: '/jobs', label: 'Career Guide', icon: '💼', sub: 'Jobs & salary benchmarks' },
]

const TOP_LINKS = [
  { href: '/planner', label: 'Readiness Check' },
  { href: '/community', label: 'Community' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)

  const isToolActive = TOOLS.some(t => pathname === t.href)

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(26,18,8,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: '60px', gap: '2rem' }}>

          {/* LOGO */}
          <Link href="/" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#fff', textDecoration: 'none', flexShrink: 0, letterSpacing: '-0.02em' }}>
            Returning<span style={{ color: '#FF9933' }}>NRIs</span>
          </Link>

          {/* DESKTOP NAV */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>

            {/* HOME */}
            <Link href="/" style={{ fontSize: '13px', fontWeight: 500, color: pathname === '/' ? '#fff' : 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', background: pathname === '/' ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'all 0.15s' }}>
              Home
            </Link>

            {/* PRODUCTS DROPDOWN */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {/* Products trigger — not a link */}
              <div style={{
                fontSize: '13px', fontWeight: 500,
                color: isToolActive ? '#fff' : 'rgba(255,255,255,0.5)',
                padding: '6px 12px', borderRadius: '8px',
                background: isToolActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                cursor: 'default', display: 'flex', alignItems: 'center', gap: '5px',
                userSelect: 'none',
              }}>
                Products
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.5 }}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* DROPDOWN */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: '0',
                  background: '#1A1208',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '260px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  zIndex: 200,
                }}>
                  {/* Invisible bridge to prevent gap between trigger and dropdown */}
                  <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '12px' }} />

                  {TOOLS.map((tool, i) => {
                    const isActive = pathname === tool.href
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px 12px', borderRadius: '10px',
                          textDecoration: 'none',
                          background: isActive ? 'rgba(255,153,51,0.12)' : 'transparent',
                          transition: 'background 0.15s',
                          marginBottom: i < TOOLS.length - 1 ? '2px' : '0',
                        }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                          {tool.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: isActive ? '#FF9933' : '#fff', marginBottom: '1px' }}>{tool.label}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{tool.sub}</div>
                        </div>
                        {isActive && (
                          <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933', flexShrink: 0 }} />
                        )}
                      </Link>
                    )
                  })}

                  {/* Footer */}
                  <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', margin: '8px 0 0', padding: '8px 12px 4px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>7 free tools for returning NRIs</div>
                  </div>
                </div>
              )}
            </div>

            {/* OTHER LINKS */}
            {TOP_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '13px', fontWeight: 500,
                  color: pathname === link.href ? '#fff' : 'rgba(255,255,255,0.5)',
                  textDecoration: 'none', padding: '6px 12px', borderRadius: '8px',
                  background: pathname === link.href ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/contact" style={{ background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '7px 18px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', flexShrink: 0, display: 'none' }} className="nav-cta">
            Join Waitlist →
          </Link>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'auto' }}
            className="nav-hamburger"
          >
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div style={{ background: '#1A1208', borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem 1.5rem' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: pathname === '/' ? '#FF9933' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>Home</Link>

            {/* Mobile Products toggle */}
            <button
              onClick={() => setMobileProductsOpen(o => !o)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontSize: '14px', fontWeight: 500, color: isToolActive ? '#FF9933' : 'rgba(255,255,255,0.7)' }}>Products</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{mobileProductsOpen ? '▲' : '▼'}</span>
            </button>
            {mobileProductsOpen && (
              <div style={{ paddingLeft: '12px', marginBottom: '4px' }}>
                {TOOLS.map(tool => (
                  <Link key={tool.href} href={tool.href} onClick={() => { setMobileOpen(false); setMobileProductsOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', textDecoration: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '14px' }}>{tool.icon}</span>
                    <span style={{ fontSize: '13px', color: pathname === tool.href ? '#FF9933' : 'rgba(255,255,255,0.65)' }}>{tool.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {TOP_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: pathname === link.href ? '#FF9933' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                {link.label}
              </Link>
            ))}

            <Link href="/contact" onClick={() => setMobileOpen(false)} style={{ display: 'block', marginTop: '1rem', background: '#FF9933', color: '#1A1208', borderRadius: '100px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
              Join Waitlist →
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .nav-cta { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}