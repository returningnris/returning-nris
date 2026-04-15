'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  JOURNEY_CHECKLIST,
  JOURNEY_FILTERS,
  type JourneyChecklistItem,
  type JourneyFilterId,
} from '../lib/moveBackContent'

const pageStyles = `
  .journey-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 1.25rem 4rem;
  }
  .journey-filter-grid,
  .journey-section-grid,
  .journey-link-grid {
    display: grid;
    gap: 1rem;
  }
  .journey-filter-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .journey-section-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .journey-link-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 1100px) {
    .journey-filter-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .journey-section-grid,
    .journey-link-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 767px) {
    .journey-shell {
      padding: 0 1rem 2.5rem;
    }
    .journey-filter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .journey-cta-row {
      flex-direction: column;
      align-items: stretch !important;
    }
    .journey-cta-row a {
      width: 100%;
      justify-content: center;
    }
  }
`

const FILTER_LABELS = Object.fromEntries(JOURNEY_FILTERS.map((filter) => [filter.id, filter.label])) as Record<
  JourneyFilterId,
  string
>

function itemMatchesFilters(item: JourneyChecklistItem, selectedFilters: JourneyFilterId[]) {
  if (!selectedFilters.length) return true
  if (!item.filters?.length) return true
  return item.filters.some((filter) => selectedFilters.includes(filter))
}

function filterItems(items: JourneyChecklistItem[], selectedFilters: JourneyFilterId[]) {
  return items.filter((item) => itemMatchesFilters(item, selectedFilters))
}

export default function JourneyChecklistExperience() {
  const [selectedFilters, setSelectedFilters] = useState<JourneyFilterId[]>([])

  const filteredSections = useMemo(
    () =>
      JOURNEY_CHECKLIST.map((section) => ({
        ...section,
        mustDo: filterItems(section.mustDo, selectedFilters),
        ifRelevant: filterItems(section.ifRelevant, selectedFilters),
        niceToDo: filterItems(section.niceToDo, selectedFilters),
      })),
    [selectedFilters]
  )

  const activeFilterLabels = selectedFilters.map((filter) => FILTER_LABELS[filter])

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(240,138,36,0.16), transparent 34%), radial-gradient(circle at 82% 18%, rgba(23,117,58,0.14), transparent 26%), linear-gradient(180deg, #fffaf3 0%, #f5efe6 56%, #f2eadf 100%)',
      }}
    >
      <style>{pageStyles}</style>

      <section style={{ padding: '3rem 0 2rem' }}>
        <div className="journey-shell">
          <div
            style={{
              background: '#fffdf9',
              border: '1px solid rgba(29,22,15,0.10)',
              borderRadius: 28,
              boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
              padding: '2rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.45rem 0.85rem',
                borderRadius: 999,
                background: '#fff1de',
                color: '#8d5c22',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Checklist first
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 4.5rem)',
                lineHeight: 0.98,
                color: '#1d160f',
                marginBottom: '1rem',
                maxWidth: 780,
              }}
            >
              Back2India Journey
            </h1>

            <p
              style={{
                fontSize: 17,
                color: '#665848',
                lineHeight: 1.8,
                maxWidth: 760,
                marginBottom: '1.5rem',
              }}
            >
              A practical move-back checklist from decision to year one in India.
            </p>

            <div className="journey-cta-row" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/planner" className="btn-primary">
                See Readiness by Persona
              </Link>
              <Link href="/resources" className="btn-ghost">
                Browse Practical Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 2rem' }}>
        <div className="journey-shell">
          <div
            style={{
              background: '#ffffff',
              border: '1px solid rgba(29,22,15,0.10)',
              borderRadius: 24,
              padding: '1.35rem',
              boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Optional filters
            </div>
            <h2 style={{ fontSize: 26, color: '#1d160f', marginBottom: 10 }}>Refine the generic checklist if you want</h2>
            <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75, marginBottom: 16 }}>
              Start with the full checklist below. Turn on any filters that match your situation to surface more relevant items.
            </p>

            <div className="journey-filter-grid">
              {JOURNEY_FILTERS.map((filter) => {
                const active = selectedFilters.includes(filter.id)
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() =>
                      setSelectedFilters((current) =>
                        current.includes(filter.id)
                          ? current.filter((value) => value !== filter.id)
                          : [...current, filter.id]
                      )
                    }
                    aria-pressed={active}
                    style={{
                      padding: '0.95rem 1rem',
                      borderRadius: 18,
                      border: `1px solid ${active ? 'rgba(255,153,51,0.32)' : 'rgba(29,22,15,0.10)'}`,
                      background: active ? '#fff1de' : '#fffdf9',
                      color: active ? '#8d5c22' : '#1d160f',
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <div
              style={{
                marginTop: '1rem',
                padding: '0.95rem 1rem',
                borderRadius: 18,
                background: '#f8f5f0',
                border: '1px solid rgba(29,22,15,0.08)',
                fontSize: 14,
                color: '#665848',
                lineHeight: 1.75,
              }}
            >
              {activeFilterLabels.length
                ? `Showing the general checklist plus items related to: ${activeFilterLabels.join(', ')}.`
                : 'Showing the full generic checklist for returning NRIs. You can leave filters off and still get the complete timeline.'}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 3rem' }}>
        <div className="journey-shell">
          <div className="journey-section-grid">
            {filteredSections.map((section) => (
              <article
                key={section.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '1.1rem 1.2rem',
                    background: 'linear-gradient(135deg, #20160f 0%, #302117 46%, #173e2c 100%)',
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{section.title}</div>
                </div>

                <div style={{ padding: '1.2rem', display: 'grid', gap: 16 }}>
                  {[
                    { label: 'Must do', items: section.mustDo },
                    { label: 'If relevant', items: section.ifRelevant },
                    { label: 'Nice to do', items: section.niceToDo },
                  ].map(({ label, items }) => {
                    const typedItems = items as JourneyChecklistItem[]
                    if (!typedItems.length) return null

                    return (
                      <section key={label}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                          {label}
                        </div>
                        <div style={{ display: 'grid', gap: 10 }}>
                          {typedItems.map((item) => (
                            <div
                              key={`${section.id}-${label}-${item.text}`}
                              style={{
                                padding: '0.95rem 1rem',
                                borderRadius: 18,
                                background: '#fffdf9',
                                border: '1px solid rgba(29,22,15,0.08)',
                              }}
                            >
                              <div style={{ fontSize: 14, color: '#1d160f', lineHeight: 1.75, marginBottom: item.filters?.length ? 8 : 0 }}>
                                {item.text}
                              </div>
                              {item.filters?.length ? (
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                  {item.filters.map((filter) => (
                                    <span
                                      key={filter}
                                      style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: '#8d5c22',
                                        background: '#fff1de',
                                        border: '1px solid rgba(255,153,51,0.2)',
                                        borderRadius: 999,
                                        padding: '0.3rem 0.55rem',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {FILTER_LABELS[filter]}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </section>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 3rem' }}>
        <div className="journey-shell">
          <div className="journey-link-grid">
            {[
              {
                title: 'See readiness by persona',
                body: 'Start with the situation closest to yours before you refine timing, city, and family decisions.',
                href: '/planner',
                cta: 'Open readiness',
              },
              {
                title: 'Plan RNOR and move timing',
                body: 'RNOR, foreign income, and travel timing usually matter before you finalize your move date.',
                href: '/resources/rnor-status-nri-returning-to-india',
                cta: 'Read RNOR guide',
              },
              {
                title: 'Use practical guides alongside the checklist',
                body: 'Go deeper on checklists, city decisions, schools, rent vs buy, and returning from the USA.',
                href: '/resources',
                cta: 'Browse guides',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.3rem',
                  textDecoration: 'none',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Next step
                </div>
                <h2 style={{ fontSize: 22, color: '#1d160f', marginBottom: 10 }}>{item.title}</h2>
                <p style={{ fontSize: 15, color: '#665848', lineHeight: 1.8, marginBottom: 14 }}>{item.body}</p>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>{item.cta}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
