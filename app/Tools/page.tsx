'use client'

import Link from 'next/link'
import { useProtectedRoute } from '../../components/useProtectedRoute'

const T = {
  bg: '#F8F5F0',
  white: '#FFFFFF',
  ink: '#1A1208',
  muted: '#6B5E50',
  soft: '#B5A898',
  border: '#E5E1DA',
  saffron: '#FF9933',
  saffronLight: '#FFF3E6',
  saffronBorder: 'rgba(255,153,51,0.25)',
  green: '#138808',
  greenLight: '#E8F5E8',
  navy: '#000080',
  navyLight: '#E8E8FF',
  rose: '#C0392B',
  roseLight: '#FCEBEB',
  heroGrad:
    'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

const TOOL_GROUPS = [
  {
    title: 'Decision Deep Dives',
    body: 'Use these when you are still narrowing the right city, financial posture, or career path before the move hardens.',
    tools: [
      {
        title: 'RNOR Calculator',
        href: '/rnor',
        eyebrow: 'Tax timing',
        tone: 'navy',
        description: 'Shows how RNOR timing can affect your first years back in India and where avoidable tax leakage can happen.',
        bestFor: 'Returnees with foreign income, RSUs, retirement accounts, or tax timing concerns',
        assists: ['Clarifies RNOR eligibility timing', 'Surfaces foreign-income planning questions', 'Helps you sequence tax-sensitive decisions before moving'],
      },
      {
        title: 'City Match',
        href: '/city',
        eyebrow: 'City shortlist',
        tone: 'saffron',
        description: 'Helps you compare Indian cities based on cost, lifestyle, schools, work setup, and overall fit.',
        bestFor: 'People still deciding where life in India will work best',
        assists: ['Shortlists cities against your priorities', 'Translates lifestyle trade-offs into practical choices', 'Reduces random city hopping during research'],
      },
      {
        title: 'Career Guide',
        href: '/jobs',
        eyebrow: 'Income continuity',
        tone: 'navy',
        description: 'Maps India job-market positioning, salary expectations, remote-work options, and company fit for returnees.',
        bestFor: 'Professionals weighing remote work, India offers, or a new search',
        assists: ['Frames the income continuity question early', 'Shows likely salary ranges and employer types', 'Helps decide between remote, India role, or transition period'],
      },
    ],
  },
  {
    title: 'Landing Deep Dives',
    body: 'Use these when the move is becoming real and you need sharper answers on family setup, neighborhood choices, care, and day-to-day life.',
    tools: [
      {
        title: 'Schools Finder',
        href: '/schools',
        eyebrow: 'School fit',
        tone: 'navy',
        description: 'Compares school options by city, curriculum, admissions timing, fees, and NRI transition friendliness.',
        bestFor: 'Families whose move window depends on children settling well',
        assists: ['Shortlists schools by grade and curriculum', 'Flags mid-year admission realities', 'Makes the school timeline less guessy for families'],
      },
      {
        title: 'Housing Finder',
        href: '/housing',
        eyebrow: 'Landing setup',
        tone: 'green',
        description: 'Matches neighborhoods and rental directions based on family setup, commute, budget, furnishing, and safety needs.',
        bestFor: 'People turning a city choice into a realistic first-90-day landing plan',
        assists: ['Turns city choice into neighborhood choice', 'Narrows rental strategy before landing', 'Helps de-risk the first 90 days in India'],
      },
      {
        title: 'Healthcare Guide',
        href: '/healthcare',
        eyebrow: 'Care planning',
        tone: 'rose',
        description: 'Helps you evaluate hospitals, insurance coverage, pre-existing condition implications, and coverage gaps after returning.',
        bestFor: 'Families, parents, or anyone who does not want care planning left to the end',
        assists: ['Highlights insurance and hospital decisions early', 'Supports family and elder-care planning', 'Reduces risk around care quality and coverage continuity'],
      },
      {
        title: 'City Life Guide',
        href: '/citylife',
        eyebrow: 'Local settling',
        tone: 'green',
        description: 'Gives a more practical feel for how life works on the ground once you have chosen your city.',
        bestFor: 'Returnees who want to picture daily life, not just big decisions',
        assists: ['Makes the city feel more concrete after you choose it', 'Helps with lifestyle and settling expectations', 'Supports the move from research into daily-life planning'],
      },
    ],
  },
]

const ALL_TOOLS = TOOL_GROUPS.flatMap((group) =>
  group.tools.map((tool) => ({
    ...tool,
    group: group.title,
  }))
)

function toneStyles(tone: string) {
  if (tone === 'green') return { color: T.green, bg: T.greenLight, border: 'rgba(19,136,8,0.18)' }
  if (tone === 'navy') return { color: T.navy, bg: T.navyLight, border: 'rgba(0,0,128,0.12)' }
  if (tone === 'rose') return { color: T.rose, bg: T.roseLight, border: 'rgba(192,57,43,0.18)' }
  return { color: '#8d5c22', bg: T.saffronLight, border: T.saffronBorder }
}

export default function ToolsPage() {
  const { shouldBlock } = useProtectedRoute()

  if (shouldBlock) return null

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        .tools-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
          gap: 1.25rem;
          align-items: start;
        }
        .tools-sticky {
          position: sticky;
          top: 96px;
        }
        .tools-proof-grid,
        .tools-card-meta-grid {
          display: grid;
          gap: 0.9rem;
        }
        .tools-proof-grid {
          grid-template-columns: 1fr;
        }
        .tools-stack {
          display: grid;
          gap: 1rem;
        }
        .tools-card-meta-grid {
          grid-template-columns: minmax(0,0.9fr) minmax(0,1.1fr);
        }
        .tools-link-card {
          display: block;
          text-decoration: none;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .tools-link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(29,22,15,0.08);
        }
        .tools-card-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .tools-grid,
          .tools-card-meta-grid {
            grid-template-columns: 1fr;
          }
          .tools-sticky {
            position: static;
          }
        }
        @media (max-width: 767px) {
          .tools-shell {
            padding: 1rem .9rem 2rem;
          }
        }
      `}</style>

      <div className="tools-shell">
        <div className="tools-grid">
          <div className="tools-sticky">
            <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 48px rgba(29,22,15,0.06)' }}>
              <div style={{ padding: '1.4rem 1.4rem 1rem', background: '#20160f' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 999,
                    padding: '0.45rem 0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.saffron }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Specialist tools
                  </span>
                </div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', lineHeight: 0.98, color: T.white, marginBottom: '.9rem' }}>
                  Open the right deep dive for the <em style={{ fontStyle: 'italic', color: T.saffron }}>real question.</em>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.75 }}>
                  This page is a specialist-tools catalog, not another assessment. Each tool goes deeper on one returning-NRI decision so you can move from generic planning to sharper answers.
                </p>
              </div>

              <div style={{ padding: '1.25rem 1.4rem 1.4rem' }}>
                <div className="tools-proof-grid">
                  {[
                    ['7 specialist tools', 'Direct access to the deep dives that matter most.'],
                    ['Built for returnees', 'Every tool is shaped around real NRI return decisions.'],
                  ].map(([title, body]) => (
                    <div key={title} style={{ padding: '1rem', borderRadius: 20, background: 'rgba(29,22,15,0.03)', border: `1px solid ${T.border}` }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{title}</div>
                      <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.65 }}>{body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="tools-stack">
            {ALL_TOOLS.map((tool) => {
              const tone = toneStyles(tool.tone)
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="tools-link-card"
                  style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 28, padding: '1.15rem', boxShadow: '0 18px 38px rgba(29,22,15,0.05)' }}
                >
                  <div style={{ display: 'grid', gap: 14 }}>
                    <div style={{ height: 6, borderRadius: 999, background: tone.color, opacity: 0.88 }} />

                    <div className="tools-card-header">
                      <div style={{ maxWidth: 760 }}>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
                          <div style={{ fontSize: 11, color: tone.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{tool.group}</div>
                          <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.soft }} />
                          <div style={{ fontSize: 11, color: tone.color, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{tool.eyebrow}</div>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', color: T.ink, marginBottom: 8, lineHeight: 1.25 }}>{tool.title}</h3>
                        <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, margin: 0 }}>{tool.description}</p>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 1.15rem', borderRadius: 999, background: tone.bg, color: tone.color, fontSize: 13, fontWeight: 700, border: `1px solid ${tone.border}`, alignSelf: 'start', whiteSpace: 'nowrap' }}>
                        Open tool
                      </div>
                    </div>

                    <div className="tools-card-meta-grid" style={{ display: 'grid', gap: 14 }}>
                      <div style={{ padding: '0.95rem', borderRadius: 20, background: tone.bg, border: `1px solid ${tone.border}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: tone.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                          Best for
                        </div>
                        <div style={{ fontSize: 14, color: T.ink, lineHeight: 1.7 }}>{tool.bestFor}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: tone.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                          How it assists
                        </div>
                        <div style={{ display: 'grid', gap: 8 }}>
                          {tool.assists.map((item) => (
                            <div key={item} style={{ padding: '0.8rem 0.9rem', borderRadius: 16, background: 'rgba(29,22,15,0.03)', border: `1px solid ${T.border}`, fontSize: 14, color: T.ink, lineHeight: 1.65 }}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
