'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import AuthButton from '../components/AuthButton'
import { WhatsAppIcon } from '../lib/social-icons'

const TOPMATE_URL = 'https://topmate.io/returningnris'

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
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e8e2d9',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            minHeight: '80px',
          }}
        >
          <Link
            href="/"
            className="nav-logo"
            aria-label="Returning NRIs home"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
          >
            <Image
              src="/logo-returning-nris.png"
              alt="Returning NRIs Logo"
              width={1312}
              height={936}
              priority
              className="nav-logo-image"
            />
            <Image
              src="/returning-nris-wordmark.png"
              alt=""
              width={1057}
              height={271}
              priority
              className="nav-logo-wordmark"
            />
          </Link>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1 }}>
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: active ? '#1A1208' : '#625b51',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: active ? '#f5f1eb' : 'transparent',
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
                gap: '0.45rem',
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
              <WhatsAppIcon size={16} />
              Join Community
            </Link>
            <a
              href={TOPMATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 38,
                padding: '0.65rem 1rem',
                borderRadius: 999,
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#9a4d06',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              Book 1:1 Planning
            </a>
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
              color: '#1A1208',
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              marginLeft: 'auto',
            }}
          >
            <div style={{ width: '20px', height: '1.5px', background: '#1A1208', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: '20px', height: '1.5px', background: '#1A1208', borderRadius: '2px', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: '20px', height: '1.5px', background: '#1A1208', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
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
                background: '#ffffff',
                borderTop: '1px solid #e8e2d9',
                padding: '1rem',
                boxShadow: '0 20px 50px rgba(26, 18, 8, 0.16)',
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
                    gap: '0.45rem',
                    minHeight: 46,
                    borderRadius: 16,
                    background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  <WhatsAppIcon size={18} />
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
                    border: '1px solid #d8d0c5',
                    color: '#1A1208',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Start Planner
                </Link>
                <a
                  href={TOPMATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 46,
                    borderRadius: 16,
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    color: '#9a4d06',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  Book 1:1 Planning
                </a>
              </div>

              {NAV_LINKS.map((link) => {
                const active = isActivePath(pathname, link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: active ? '#138808' : '#625b51',
                      textDecoration: 'none',
                      padding: '11px 0',
                      borderBottom: '1px solid #eee9e2',
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
          inset: 80px 0 0 0;
          background: rgba(26, 18, 8, 0.22);
          backdrop-filter: blur(6px);
        }
        .mobile-nav-panel {
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }
        @media (min-width: 1200px) {
          .nav-hamburger {
            display: none !important;
          }
          .mobile-nav-shell {
            display: none;
          }
        }
        @media (max-width: 1199px) {
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
        .nav-logo-image {
          display: block;
          width: clamp(69px, 9vw, 96px);
          height: auto;
          max-height: 69px;
          object-fit: contain;
        }
        .nav-logo-wordmark {
          display: block;
          width: clamp(150px, 18vw, 235px);
          height: auto;
          max-height: 60px;
          margin-left: -11px;
          object-fit: contain;
        }
        @media (max-width: 767px) {
          .nav-logo-image {
            width: 63px;
            max-height: 45px;
          }
          .nav-logo-wordmark {
            width: 148px;
            max-height: 40px;
            margin-left: -7px;
          }
          .nav-inner {
            padding: 0 1rem !important;
            min-height: 72px !important;
          }
          .nav-logo {
            min-width: 0;
          }
          .mobile-nav-backdrop {
            inset: 72px 0 0 0;
          }
          .mobile-nav-panel {
            max-height: calc(100vh - 72px);
          }
        }
      `}</style>
    </>
  )
}
