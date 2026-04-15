'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { JOURNEY_FILTERS } from '../lib/moveBackContent'
import {
  getImportantTimelineSections,
  getJourneyChecklistItemId,
} from '../lib/journeyChecklistPresentation'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

type JourneyState = {
  checkedItemIds: string[]
}

const pageStyles = `
  .journey-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 1.25rem 4rem;
  }
  .journey-layout,
  .journey-link-grid,
  .journey-bucket-grid,
  .journey-stat-grid {
    display: grid;
    gap: 1rem;
  }
  .journey-layout {
    grid-template-columns: 300px minmax(0, 1fr);
    align-items: start;
  }
  .journey-link-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .journey-bucket-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .journey-stat-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .journey-timeline-rail {
    position: sticky;
    top: 1.25rem;
    display: grid;
    gap: 0.9rem;
  }
  @media (max-width: 1120px) {
    .journey-bucket-grid,
    .journey-link-grid,
    .journey-stat-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 960px) {
    .journey-layout {
      grid-template-columns: 1fr;
    }
    .journey-timeline-rail {
      position: static;
    }
  }
  @media (max-width: 767px) {
    .journey-shell {
      padding: 0 1rem 2.5rem;
    }
    .journey-cta-row {
      flex-direction: column;
      align-items: stretch !important;
    }
    .journey-cta-row a,
    .journey-cta-row button {
      width: 100%;
      justify-content: center;
    }
  }
`

const FILTER_LABELS = Object.fromEntries(JOURNEY_FILTERS.map((filter) => [filter.id, filter.label])) as Record<
  (typeof JOURNEY_FILTERS)[number]['id'],
  string
>

function readJourneyState(value: unknown): JourneyState {
  if (!value || typeof value !== 'object') {
    return { checkedItemIds: [] }
  }

  const checkedItemIds = Array.isArray((value as JourneyState).checkedItemIds)
    ? (value as JourneyState).checkedItemIds.filter((entry): entry is string => typeof entry === 'string')
    : []

  return { checkedItemIds }
}

function formatSaveLabel(saveStatus: 'idle' | 'saving' | 'saved' | 'error', isAuthenticated: boolean, loading: boolean) {
  if (loading) {
    return 'Checking your saved checklist progress.'
  }

  if (!isAuthenticated) {
    return 'You can check items now. Sign in to save your progress across visits.'
  }

  if (saveStatus === 'saving') {
    return 'Saving your checklist progress.'
  }

  if (saveStatus === 'saved') {
    return 'Checklist progress saved to your account.'
  }

  if (saveStatus === 'error') {
    return 'We could not save the latest change. Your checkmarks are still visible here.'
  }

  return 'Your checklist progress will save automatically while you are signed in.'
}

export default function JourneyChecklistExperience() {
  const { user, isAuthenticated, loading } = useAuth()
  const timelineSections = useMemo(() => getImportantTimelineSections(), [])
  const [activePhaseId, setActivePhaseId] = useState<string>(timelineSections[0]?.id ?? '')
  const [checkedItemIds, setCheckedItemIds] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'downloading' | 'error'>('idle')
  const [progressLoaded, setProgressLoaded] = useState(false)
  const lastSavedSignatureRef = useRef('[]')

  const activePhase = timelineSections.find((phase) => phase.id === activePhaseId) || timelineSections[0]

  const phasesWithProgress = useMemo(
    () =>
      timelineSections.map((phase) => {
        const completed = phase.buckets.reduce(
          (sum, bucket) =>
            sum +
            bucket.items.reduce((bucketSum, _item, itemIndex) => {
              const itemId = getJourneyChecklistItemId(phase.id, bucket.id, itemIndex)
              return bucketSum + (checkedItemIds.includes(itemId) ? 1 : 0)
            }, 0),
          0
        )

        return {
          ...phase,
          completed,
        }
      }),
    [checkedItemIds, timelineSections]
  )

  const activePhaseWithProgress =
    phasesWithProgress.find((phase) => phase.id === activePhase?.id) || phasesWithProgress[0]

  const totalImportantItems = phasesWithProgress.reduce((sum, phase) => sum + phase.total, 0)
  const totalCompletedItems = phasesWithProgress.reduce((sum, phase) => sum + phase.completed, 0)
  const checklistDisabled = loading || (isAuthenticated && !progressLoaded)

  useEffect(() => {
    if (!activePhase) return
    if (!timelineSections.some((phase) => phase.id === activePhaseId)) {
      setActivePhaseId(timelineSections[0]?.id ?? '')
    }
  }, [activePhase, activePhaseId, timelineSections])

  useEffect(() => {
    let active = true

    async function loadJourneyProgress() {
      if (loading) return

      if (!isAuthenticated || !user) {
        if (!active) return
        setCheckedItemIds([])
        lastSavedSignatureRef.current = '[]'
        setSaveStatus('idle')
        setProgressLoaded(true)
        return
      }

      setProgressLoaded(false)

      const { data, error } = await supabase
        .from('planner_submissions')
        .select('result_json')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) return

      if (error) {
        console.error('Failed to load journey checklist progress:', error)
        setCheckedItemIds([])
        lastSavedSignatureRef.current = '[]'
        setSaveStatus('error')
        setProgressLoaded(true)
        return
      }

      const resultJson =
        data?.result_json && typeof data.result_json === 'object'
          ? (data.result_json as Record<string, unknown>)
          : {}
      const nextState = readJourneyState(resultJson.journeyState)
      const nextSignature = JSON.stringify(nextState.checkedItemIds)

      setCheckedItemIds(nextState.checkedItemIds)
      lastSavedSignatureRef.current = nextSignature
      setSaveStatus('idle')
      setProgressLoaded(true)
    }

    void loadJourneyProgress()

    return () => {
      active = false
    }
  }, [isAuthenticated, loading, user])

  useEffect(() => {
    if (loading || !progressLoaded || !isAuthenticated || !user) {
      return
    }

    const signature = JSON.stringify(checkedItemIds)
    if (signature === lastSavedSignatureRef.current) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      setSaveStatus('saving')

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const accessToken = session?.access_token || ''
        if (!accessToken) {
          setSaveStatus('error')
          return
        }

        const response = await fetch('/api/save-journey-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            journeyState: {
              checkedItemIds,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        lastSavedSignatureRef.current = signature
        setSaveStatus('saved')
      } catch (error) {
        console.error('Failed to save journey checklist progress:', error)
        setSaveStatus('error')
      }
    }, 450)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [checkedItemIds, isAuthenticated, loading, progressLoaded, user])

  function toggleChecklistItem(itemId: string) {
    setCheckedItemIds((current) =>
      current.includes(itemId) ? current.filter((entry) => entry !== itemId) : [...current, itemId]
    )
  }

  async function handleDownloadPdf() {
    try {
      setPdfStatus('downloading')

      const response = await fetch('/api/journey-checklist-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkedItemIds }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = 'returningnris-back2india-checklist.pdf'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
      setPdfStatus('idle')
    } catch (error) {
      console.error('Failed to download journey checklist PDF:', error)
      setPdfStatus('error')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(240,138,36,0.16), transparent 34%), radial-gradient(circle at 82% 18%, rgba(23,117,58,0.14), transparent 26%), linear-gradient(180deg, #fffaf3 0%, #f5efe6 56%, #f2eadf 100%)',
      }}
    >
      <style>{pageStyles}</style>

      <section style={{ padding: '1rem 0 1rem' }}>
        <div className="journey-shell">
          <div
            style={{
              background: '#fffdf9',
              border: '1px solid rgba(29,22,15,0.10)',
              borderRadius: 20,
              boxShadow: '0 12px 28px rgba(29,22,15,0.05)',
              padding: '0.7rem 1rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.3rem 0.65rem',
                borderRadius: 999,
                background: '#fff1de',
                color: '#8d5c22',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.55rem',
              }}
            >
              Timeline checklist
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                lineHeight: 1.02,
                color: '#1d160f',
                marginBottom: '0.35rem',
                maxWidth: 520,
              }}
            >
              Back2India Journey
            </h1>

            <p
              style={{
                fontSize: 14,
                color: '#665848',
                lineHeight: 1.65,
                maxWidth: 580,
                marginBottom: '0.75rem',
              }}
            >
              A shorter timeline-first checklist with only the key items for each phase.
            </p>

            <div className="journey-cta-row" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" onClick={handleDownloadPdf} className="btn-ghost" disabled={pdfStatus === 'downloading'}>
                {pdfStatus === 'downloading' ? 'Preparing PDF...' : 'Download PDF Checklist'}
              </button>
            </div>
            {pdfStatus === 'error' ? (
              <div style={{ marginTop: '0.9rem', fontSize: 13, color: '#a24a2d' }}>
                We could not generate the PDF just now. Please try again.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 3rem' }}>
        <div className="journey-shell">
          <div className="journey-layout">
            <aside
              style={{
                background: '#ffffff',
                border: '1px solid rgba(29,22,15,0.10)',
                borderRadius: 24,
                padding: '1.1rem',
                boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
              }}
            >
              <div className="journey-timeline-rail">
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Timeline cards
                  </div>
                  <div style={{ fontSize: 14, color: '#665848', lineHeight: 1.7 }}>
                    Pick a phase on the left. Each card opens a shorter, cleaner checklist.
                  </div>
                </div>

                {phasesWithProgress.map((phase) => {
                  const isActive = phase.id === activePhaseWithProgress?.id
                  const progressWidth = phase.total ? `${(phase.completed / phase.total) * 100}%` : '0%'

                  return (
                    <button
                      key={phase.id}
                      type="button"
                      onClick={() => setActivePhaseId(phase.id)}
                      aria-pressed={isActive}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 20,
                        border: `1px solid ${isActive ? 'rgba(240,138,36,0.28)' : 'rgba(29,22,15,0.10)'}`,
                        background: isActive ? '#fff3e2' : '#fffdf9',
                        color: '#1d160f',
                        textAlign: 'left',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 12px 24px rgba(240,138,36,0.12)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#8d5c22' : '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                        Phase {phase.index + 1}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{phase.title}</div>
                      <div style={{ fontSize: 13, color: '#665848', lineHeight: 1.65, marginBottom: 10 }}>
                        {phase.completed}/{phase.total} checked
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 6,
                          borderRadius: 999,
                          background: 'rgba(29,22,15,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: progressWidth,
                            height: '100%',
                            borderRadius: 999,
                            background: isActive ? '#DA7716' : '#138808',
                          }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.10)',
                  borderRadius: 24,
                  padding: '1.35rem',
                  boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
                }}
              >
                <div className="journey-stat-grid">
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: 18,
                      background: '#fff7eb',
                      border: '1px solid rgba(240,138,36,0.18)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Current phase
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#1d160f', marginBottom: 4 }}>
                      {activePhaseWithProgress?.completed ?? 0}/{activePhaseWithProgress?.total ?? 0}
                    </div>
                    <div style={{ fontSize: 13, color: '#665848', lineHeight: 1.65 }}>
                      Important items checked in {activePhaseWithProgress?.title ?? 'this phase'}.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: 18,
                      background: '#f8f5f0',
                      border: '1px solid rgba(29,22,15,0.08)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Overall progress
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#1d160f', marginBottom: 4 }}>
                      {totalCompletedItems}/{totalImportantItems}
                    </div>
                    <div style={{ fontSize: 13, color: '#665848', lineHeight: 1.65 }}>
                      Across the shorter checklist shown on this page.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: 18,
                      background: '#f6faf6',
                      border: '1px solid rgba(19,136,8,0.12)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Save status
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1d160f', marginBottom: 6 }}>
                      {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving' : 'In sync'}
                    </div>
                    <div style={{ fontSize: 13, color: saveStatus === 'error' ? '#a24a2d' : '#665848', lineHeight: 1.65 }}>
                      {formatSaveLabel(saveStatus, isAuthenticated, loading || !progressLoaded)}
                    </div>
                    {!isAuthenticated && !loading ? (
                      <div style={{ marginTop: 10 }}>
                        <Link href="/auth?mode=signup&next=%2Fjourney" style={{ fontSize: 13, fontWeight: 700, color: '#1d160f', textDecoration: 'none' }}>
                          Sign in to save progress
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {activePhaseWithProgress ? (
                <article
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
                      padding: '1.15rem 1.25rem',
                      background: 'linear-gradient(135deg, #20160f 0%, #302117 46%, #173e2c 100%)',
                      color: '#fff',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Phase {activePhaseWithProgress.index + 1}
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
                      {activePhaseWithProgress.title}
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.76)', lineHeight: 1.75, maxWidth: 720 }}>
                      The most important checklist items for this phase, grouped into two focused buckets.
                    </div>
                  </div>
                  <div style={{ padding: '1.2rem', display: 'grid', gap: 12 }}>
                    <div className="journey-bucket-grid">
                      {activePhaseWithProgress.buckets.map((bucket) => {
                        const bucketCompleted = bucket.items.reduce((sum, _item, itemIndex) => {
                          const itemId = getJourneyChecklistItemId(activePhaseWithProgress.id, bucket.id, itemIndex)
                          return sum + (checkedItemIds.includes(itemId) ? 1 : 0)
                        }, 0)

                        return (
                          <section
                            key={bucket.id}
                            style={{
                              display: 'grid',
                              gap: 12,
                              alignContent: 'start',
                              background: '#fffdf9',
                              border: '1px solid rgba(29,22,15,0.08)',
                              borderRadius: 20,
                              padding: '1rem',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                                {bucket.eyebrow}
                              </div>
                              <div style={{ fontSize: 21, fontWeight: 800, color: '#1d160f', marginBottom: 8 }}>{bucket.label}</div>
                              <div style={{ fontSize: 13, color: '#665848', lineHeight: 1.65, marginBottom: 8 }}>
                                {bucket.description}
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#1d160f' }}>
                                {bucketCompleted}/{bucket.items.length} checked
                              </div>
                            </div>

                            <div style={{ display: 'grid', gap: 10 }}>
                              {bucket.items.map((item, itemIndex) => {
                                const itemId = getJourneyChecklistItemId(activePhaseWithProgress.id, bucket.id, itemIndex)
                                const checked = checkedItemIds.includes(itemId)

                                return (
                                  <label
                                    key={itemId}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: 12,
                                      padding: '0.95rem',
                                      borderRadius: 16,
                                      background: checked ? '#fff7eb' : '#ffffff',
                                      border: `1px solid ${checked ? 'rgba(240,138,36,0.22)' : 'rgba(29,22,15,0.08)'}`,
                                      cursor: checklistDisabled ? 'not-allowed' : 'pointer',
                                      opacity: checklistDisabled ? 0.72 : 1,
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={checklistDisabled}
                                      onChange={() => toggleChecklistItem(itemId)}
                                      style={{
                                        width: 18,
                                        height: 18,
                                        marginTop: 3,
                                        accentColor: '#DA7716',
                                        flexShrink: 0,
                                      }}
                                    />

                                    <div style={{ minWidth: 0 }}>
                                      <div
                                        style={{
                                          fontSize: 14,
                                          color: checked ? '#514336' : '#1d160f',
                                          lineHeight: 1.75,
                                          textDecoration: checked ? 'line-through' : 'none',
                                          marginBottom: item.filters?.length ? 8 : 0,
                                        }}
                                      >
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
                                  </label>
                                )
                              })}
                            </div>
                          </section>
                        )
                      })}
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
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
