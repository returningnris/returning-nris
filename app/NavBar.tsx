'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ARTICLES as GUIDES } from '../lib/articles-data'
import AuthButton from '../components/AuthButton'
import { useAuth } from '../components/useAuth'

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
  { href: '/planner', label: 'Planner' },
  { href: '/videos', label: 'Videos' },
  { href: '/community', label: 'Community' },
]

const PUBLIC_NAV_PATHS = new Set([
  '/planner',
  '/journey',
  '/videos',
  '/community',
  '/Tools',
  '/rnor',
  '/city',
  '/schools',
  '/housing',
  '/healthcare',
  '/citylife',
  '/jobs',
])

export default function NavBar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)

  const isToolActive = TOOLS.some(t => pathname === t.href) || pathname === '/Tools'
  const isResourcesActive = GUIDES.some(g => pathname === g.href) || pathname === '/resources' || pathname.startsWith('/resources/')
  const isPublicNavHref = (href: string) => PUBLIC_NAV_PATHS.has(href)
  const protectedHref = (href: string) => (isAuthenticated || isPublicNavHref(href) ? href : `/auth?mode=signup&next=${encodeURIComponent(href)}`)

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(26,18,8,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <div className="nav-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: '60px', gap: '2rem' }}>

          {/* LOGO */}
          <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <svg width="26" height="30" viewBox="0 0 52 56" fill="none">
              <rect x="0" y="0" width="52" height="18" rx="5" fill="#FF9933"/>
              <rect x="0" y="18" width="52" height="20" fill="#F4F0E8"/>
              <rect x="0" y="38" width="52" height="18" rx="5" fill="#138808"/>
              <circle cx="26" cy="28" r="8" fill="none" stroke="#000080" strokeWidth="1.5"/>
              <circle cx="26" cy="28" r="2" fill="#000080"/>
            </svg>
            <span className="nav-logo-text" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#fff' }}>
              <span style={{ color: '#FF9933' }}>Returning</span><span style={{ color: '#138808' }}>NRIs</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }}>

            <Link href="/" style={{ fontSize: '13px', fontWeight: 500, color: pathname === '/' ? '#fff' : 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', background: pathname === '/' ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'all 0.15s' }}>
              Home
            </Link>

            {/* TOP LINKS */}
            {TOP_LINKS.map(link => (
              <Link key={link.href} href={protectedHref(link.href)} style={{ fontSize: '13px', fontWeight: 500, color: pathname === link.href ? '#fff' : 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', background: pathname === link.href ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'all 0.15s' }}>
                {link.label}
              </Link>
            ))}

            {/* TOOLS DROPDOWN */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
              <Link href={protectedHref('/Tools')} style={{ fontSize: '13px', fontWeight: 500, color: isToolActive ? '#fff' : 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '8px', background: isToolActive ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'all 0.15s' }}>
                Tools
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.5 }}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {toolsOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '0', background: '#1A1208', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '8px', minWidth: '260px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 200 }}>
                  <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '12px' }} />
                  {TOOLS.map((tool, i) => {
                    const isActive = pathname === tool.href
                    return (
                      <Link key={tool.href} href={protectedHref(tool.href)} onClick={() => setToolsOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', background: isActive ? 'rgba(255,153,51,0.12)' : 'transparent', transition: 'background 0.15s', marginBottom: i < TOOLS.length - 1 ? '2px' : '0' }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{tool.icon}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: isActive ? '#FF9933' : '#fff', marginBottom: '1px' }}>{tool.label}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{tool.sub}</div>
                        </div>
                        {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933', flexShrink: 0 }} />}
                      </Link>
                    )
                  })}
                  <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', margin: '8px 0 0', padding: '8px 12px 4px' }}>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>7 free tools for returning NRIs</div>
                  </div>
                </div>
              )}
            </div>

            {/* RESOURCE GUIDE DROPDOWN */}
            <div style={{ position: 'relative' }} onMouseEnter={() => setResourcesOpen(true)} onMouseLeave={() => setResourcesOpen(false)}>
              <Link href="/resources" style={{ fontSize: '13px', fontWeight: 500, color: isResourcesActive ? '#fff' : 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '8px', background: isResourcesActive ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'all 0.15s' }}>
                Resource Guide
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: resourcesOpen ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.5 }}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {resourcesOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '0', background: '#1A1208', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '8px', minWidth: '300px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', zIndex: 200 }}>
                  <div style={{ position: 'absolute', top: '-12px', left: 0, right: 0, height: '12px' }} />
                  {GUIDES.map((guide, i) => {
                    const isActive = pathname === guide.href
                    return (
                      <Link key={guide.href} href={guide.href} onClick={() => setResourcesOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', textDecoration: 'none', background: isActive ? 'rgba(255,153,51,0.12)' : 'transparent', transition: 'background 0.15s', marginBottom: i < GUIDES.length - 1 ? '2px' : '0' }}
                        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isActive ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{guide.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: isActive ? '#FF9933' : '#fff', marginBottom: '1px', lineHeight: 1.35 }}>{guide.label}</div>
                          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{guide.readMins} min read · {guide.category}</div>
                        </div>
                        {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9933', flexShrink: 0 }} />}
                      </Link>
                    )
                  })}
                  <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', margin: '8px 0 0', padding: '8px 12px 4px' }}>
                    <Link href="/resources" onClick={() => setResourcesOpen(false)} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.04em' }}>
                      View all articles →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* OUR STORY — last nav item */}
            <Link href="/our-story" style={{ fontSize: '13px', fontWeight: 500, color: pathname === '/our-story' ? '#fff' : 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', background: pathname === '/our-story' ? 'rgba(255,255,255,0.06)' : 'transparent', transition: 'all 0.15s' }}>
              Our Story
            </Link>

            {/* AUTH BUTTON */}
            <div style={{ marginLeft: '1rem' }}>
              <AuthButton />
            </div>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="nav-hamburger"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'auto' }}
          >
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: '20px', height: '1.5px', background: '#fff', borderRadius: '2px', transition: 'all 0.2s', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="mobile-nav-shell">
            <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
            <div id="mobile-navigation" className="mobile-nav-panel" style={{ background: '#1A1208', borderTop: '0.5px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem 1.5rem' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: pathname === '/' ? '#FF9933' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>Home</Link>

            {TOP_LINKS.map(link => (
              <Link key={link.href} href={protectedHref(link.href)} onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: pathname === link.href ? '#FF9933' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                {link.label}
              </Link>
            ))}

            <button onClick={() => setMobileToolsOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: isToolActive ? '#FF9933' : 'rgba(255,255,255,0.7)' }}>Tools</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{mobileToolsOpen ? '▲' : '▼'}</span>
            </button>
            {mobileToolsOpen && (
              <div style={{ paddingLeft: '12px', marginBottom: '4px' }}>
                {TOOLS.map(tool => (
                  <Link key={tool.href} href={protectedHref(tool.href)} onClick={() => { setMobileOpen(false); setMobileToolsOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', textDecoration: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '14px' }}>{tool.icon}</span>
                    <span style={{ fontSize: '13px', color: pathname === tool.href ? '#FF9933' : 'rgba(255,255,255,0.65)' }}>{tool.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <button onClick={() => setMobileResourcesOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: isResourcesActive ? '#FF9933' : 'rgba(255,255,255,0.7)' }}>Resource Guide</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{mobileResourcesOpen ? '▲' : '▼'}</span>
            </button>
            {mobileResourcesOpen && (
              <div style={{ paddingLeft: '12px', marginBottom: '4px' }}>
                {GUIDES.map(guide => (
                  <Link key={guide.href} href={guide.href} onClick={() => { setMobileOpen(false); setMobileResourcesOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', textDecoration: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '14px' }}>{guide.icon}</span>
                    <span style={{ fontSize: '13px', color: pathname === guide.href ? '#FF9933' : 'rgba(255,255,255,0.65)' }}>{guide.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <Link href="/our-story" onClick={() => setMobileOpen(false)} style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: pathname === '/our-story' ? '#FF9933' : 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              Our Story
            </Link>

            {/* AUTH BUTTON IN MOBILE */}
            <div style={{ paddingTop: '12px', paddingBottom: '4px' }}>
              <AuthButton onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
          </div>
        )}
      </nav>

      <style>{`
        .mobile-nav-shell {
          position: absolute;
          inset: 100% 0 auto 0;
        }
        .mobile-nav-backdrop {
          position: fixed;
          inset: 60px 0 0 0;
          background: rgba(10, 7, 3, 0.45);
          backdrop-filter: blur(6px);
        }
        .mobile-nav-panel {
          position: relative;
          max-height: calc(100vh - 60px);
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.32);
        }
        @media (min-width: 768px) {
          .nav-hamburger { display: none !important; }
          .mobile-nav-shell { display: none; }
        }
        @media (max-width: 767px) {
          .nav-inner {
            padding: 0 1rem !important;
            gap: 0.75rem !important;
            height: 64px !important;
          }
          .nav-logo {
            min-width: 0;
          }
          .nav-logo-text {
            font-size: 1rem !important;
            white-space: nowrap;
          }
          .desktop-nav { display: none !important; }
          .nav-hamburger {
            display: flex !important;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            min-height: 44px;
            border-radius: 12px;
          }
          .mobile-nav-backdrop {
            top: 64px;
          }
          .mobile-nav-panel {
            max-height: calc(100vh - 64px);
            padding: 0.75rem 1rem 1.25rem !important;
          }
          .mobile-nav-panel a,
          .mobile-nav-panel button {
            min-height: 44px;
          }
        }
      `}</style>
    </>
  )
}
