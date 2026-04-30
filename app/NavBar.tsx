'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthButton from '../components/AuthButton'

const NAV_LINKS = [
  { href: '/', label: 'Start Here' },
  { href: '/planner', label: 'Planner' },
  { href: '/resources', label: 'Guides' },
  { href: '/videos', label: 'Videos' },
  { href: '/our-story', label: 'Our Story' },
]

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(26,18,8,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minHeight: '64px',
          }}
        >
          <Link
            href="/"
            className="nav-logo"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}
          >
            <svg width="26" height="30" viewBox="0 0 52 56" fill="none" aria-hidden="true">
              <rect x="0" y="0" width="52" height="18" rx="5" fill="#FF9933" />
              <rect x="0" y="18" width="52" height="20" fill="#F4F0E8" />
              <rect x="0" y="38" width="52" height="18" rx="5" fill="#138808" />
              <circle cx="26" cy="28" r="8" fill="none" stroke="#000080" strokeWidth="1.5" />
              <circle cx="26" cy="28" r="2" fill="#000080" />
            </svg>
            <span className="nav-logo-text" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.08rem', color: '#fff' }}>
              <span style={{ color: '#FF9933' }}>Returning</span>
              <span style={{ color: '#138808' }}>NRIs</span>
            </span>
          </Link>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1 }}>
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <Link
              href="/community#join-community"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 38,
                padding: '0.65rem 1rem',
                borderRadius: 999,
                background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 10px 24px rgba(19,136,8,0.2)',
              }}
            >
              Join Community
            </Link>
            <AuthButton />
          </div>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="nav-hamburger"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginLeft: 'auto',
            }}
          >
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>

        {mobileOpen ? (
          <div className="mobile-nav-shell">
            <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
            <div
              id="mobile-navigation"
              className="mobile-nav-panel"
              style={{
                position: 'relative',
                background: '#1A1208',
                borderTop: '0.5px solid rgba(255,255,255,0.06)',
                padding: '1rem',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.32)',
              }}
            >
              <div style={{ display: 'grid', gap: '0.7rem', marginBottom: '0.9rem' }}>
                <Link
                  href="/community#join-community"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 46,
                    borderRadius: 16,
                    background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  Join Community
                </Link>
                <Link
                  href="/planner"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 46,
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Start Planner
                </Link>
              </div>

              {NAV_LINKS.map((link) => {
                const active = isActivePath(pathname, link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: active ? '#FF9933' : 'rgba(255,255,255,0.78)',
                      textDecoration: 'none',
                      padding: '11px 0',
                      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div style={{ paddingTop: '12px', paddingBottom: '4px' }}>
                <AuthButton onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          </div>
        ) : null}
      </nav>

      <style>{`
        .mobile-nav-shell {
          position: absolute;
          inset: 100% 0 auto 0;
        }
        .mobile-nav-backdrop {
          position: fixed;
          inset: 64px 0 0 0;
          background: rgba(10, 7, 3, 0.45);
          backdrop-filter: blur(6px);
        }
        .mobile-nav-panel {
          max-height: calc(100vh - 64px);
          overflow-y: auto;
        }
        @media (min-width: 960px) {
          .nav-hamburger {
            display: none !important;
          }
          .mobile-nav-shell {
            display: none;
          }
        }
        @media (max-width: 959px) {
          .desktop-nav,
          .desktop-cta {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            min-height: 44px;
            border-radius: 12px;
          }
        }
        @media (max-width: 767px) {
          .nav-inner {
            padding: 0 1rem !important;
          }
          .nav-logo {
            min-width: 0;
          }
          .nav-logo-text {
            font-size: 1rem !important;
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  )
}
