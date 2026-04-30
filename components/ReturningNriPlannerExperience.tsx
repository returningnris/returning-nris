'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../lib/social-icons'
import { INSTAGRAM_URL } from '../lib/social-links'

type ReadinessId = 'almost-ready' | 'planning-seriously' | 'still-exploring'
type TimelineStageId = 'clarity' | 'lock-decisions' | 'landing-week' | 'first-90-days' | 'first-year'

type ReadinessOption = {
  id: ReadinessId
  title: string
  line: string
  verdict: string
  next: string
  focus: string
  chips: string[]
}

type TimelineTask = {
  id: string
  text: string
}

type TimelineStage = {
  id: TimelineStageId
  label: string
  title: string
  tasks: TimelineTask[]
}

const READINESS_STORAGE_KEY = 'returningnris-planner-readiness-v1'
const TIMELINE_STORAGE_KEY = 'returningnris-planner-progress-v1'

const READINESS_OPTIONS: ReadinessOption[] = [
  {
    id: 'almost-ready',
    title: 'Almost Ready',
    line: 'Income, school, and housing are mostly clear.',
    verdict: 'Focus on execution',
    next: 'Confirm tax timing, school logistics, and first 90 days.',
    focus:
      'You are close. Focus on tax timing, school start dates, housing setup, and first 90-day execution.',
    chips: ['RNOR', 'Schools', 'Housing', 'First 90 Days'],
  },
  {
    id: 'planning-seriously',
    title: 'Planning Seriously',
    line: 'You know you want to return, but key pieces are still open.',
    verdict: 'Build clarity',
    next: 'Lock income path, city, school, and 12-month cash buffer.',
    focus:
      'You need clarity before committing. Lock income, city, school direction, and a 12-month liquid buffer.',
    chips: ['Income', 'City', 'School', 'Cash Buffer'],
  },
  {
    id: 'still-exploring',
    title: 'Still Exploring',
    line: 'You are thinking about returning but not ready to commit yet.',
    verdict: 'Explore safely',
    next: 'Compare lifestyle, finances, career, and family readiness.',
    focus:
      "Do not rush. Start with cost of living, career options, children's adjustment, and India lifestyle fit.",
    chips: ['Lifestyle', 'Career', 'Family', 'Budget'],
  },
]

const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 'clarity',
    label: '6-12 months',
    title: 'Get clarity',
    tasks: [
      { id: 'clarity-income', text: 'Income path' },
      { id: 'clarity-rnor', text: 'RNOR/tax timing' },
      { id: 'clarity-city-school', text: 'City + school shortlist' },
    ],
  },
  {
    id: 'lock-decisions',
    label: '3 months',
    title: 'Lock decisions',
    tasks: [
      { id: 'lock-housing', text: 'Housing plan' },
      { id: 'lock-school', text: 'School admission steps' },
      { id: 'lock-docs', text: 'US accounts + documents' },
    ],
  },
  {
    id: 'landing-week',
    label: 'Landing week',
    title: 'Stabilize',
    tasks: [
      { id: 'landing-sim-banking', text: 'SIM + banking' },
      { id: 'landing-setup', text: 'Temporary setup' },
      { id: 'landing-school-visits', text: 'School visits' },
    ],
  },
  {
    id: 'first-90-days',
    label: 'First 90 days',
    title: 'Settle in',
    tasks: [
      { id: 'settle-home', text: 'Long-term home' },
      { id: 'settle-healthcare', text: 'Healthcare' },
      { id: 'settle-budget', text: 'Real monthly budget' },
    ],
  },
  {
    id: 'first-year',
    label: 'First year',
    title: 'Optimize',
    tasks: [
      { id: 'year-tax', text: 'Tax filing' },
      { id: 'year-investments', text: 'Investments' },
      { id: 'year-network', text: 'Local network' },
    ],
  },
]

const SHORTCUTS = [
  {
    title: 'RNOR & Tax',
    line: 'Avoid costly timing mistakes',
    href: '/resources/rnor-status-nri-returning-to-india',
  },
  {
    title: 'Schools',
    line: 'Plan before the admission rush',
    href: '/schools',
  },
  {
    title: 'Housing',
    line: 'Rent-first or buy-first clarity',
    href: '/housing',
  },
  {
    title: 'Money',
    line: 'US assets, banking, insurance',
    href: '/resources',
  },
]

const CHANNEL_LINKS = [
  {
    title: 'WhatsApp Community',
    label: 'Ask, discuss, connect',
    href: '/community#join-community',
    external: false,
  },
  {
    title: 'YouTube Guides',
    label: 'Deep-dive videos',
    href: '/videos',
    external: false,
  },
  {
    title: 'Instagram Reels',
    label: 'Quick move-back tips',
    href: INSTAGRAM_URL,
    external: true,
  },
]

const INSTAGRAM_TOPICS = ['RNOR & Tax', 'Schools & Kids', 'Hyderabad Living', 'Money & Banking', 'First 90 Days']

const plannerStyles = `
  .planner-page {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(255,153,51,0.12), transparent 28%),
      radial-gradient(circle at 84% 10%, rgba(19,136,8,0.08), transparent 24%),
      linear-gradient(180deg, #fffdf9 0%, #f8f4ec 100%);
  }
  .planner-shell {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  .planner-section {
    padding: 1rem 0 0;
    scroll-margin-top: 84px;
  }
  .planner-hero-grid,
  .planner-readiness-grid,
  .planner-shortcuts-grid,
  .planner-channel-grid {
    display: grid;
    gap: 1rem;
  }
  .planner-hero-grid {
    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
    align-items: stretch;
  }
  .planner-readiness-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .planner-shortcuts-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .planner-channel-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .planner-stage-rail {
    display: flex;
    gap: 0.85rem;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
  }
  .planner-stage-rail::-webkit-scrollbar {
    display: none;
  }
  .planner-stage-card {
    min-width: min(265px, 80vw);
    scroll-snap-align: start;
  }
  .planner-mobile-bar {
    display: none;
  }
  @media (max-width: 1080px) {
    .planner-readiness-grid,
    .planner-shortcuts-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 900px) {
    .planner-hero-grid,
    .planner-channel-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (min-width: 768px) {
    .planner-stage-rail {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      overflow: visible;
    }
    .planner-stage-card {
      min-width: 0;
    }
  }
  @media (max-width: 767px) {
    .planner-shell {
      padding: 0 0.95rem;
    }
    .planner-section {
      padding-top: 0.9rem;
      scroll-margin-top: 76px;
    }
    .planner-readiness-grid,
    .planner-shortcuts-grid {
      grid-template-columns: 1fr;
    }
    .planner-action-row {
      flex-direction: column;
      align-items: stretch !important;
    }
    .planner-action-row a,
    .planner-action-row button {
      width: 100%;
      justify-content: center;
    }
    .planner-mobile-bar {
      position: fixed;
      left: 0.85rem;
      right: 0.85rem;
      bottom: calc(0.85rem + env(safe-area-inset-bottom));
      z-index: 70;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.7rem;
      padding: 0.7rem;
      border-radius: 22px;
      background: rgba(255,253,249,0.97);
      border: 1px solid rgba(29,22,15,0.1);
      box-shadow: 0 18px 40px rgba(29,22,15,0.12);
      backdrop-filter: blur(14px);
    }
    .planner-mobile-spacer {
      height: 6rem;
    }
  }
`

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.6 12.2L10.8 14.4L15.6 9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.8V7M16 3.8V7M4 9.5H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.9 9.1L13.3 13.3L9.1 14.9L10.7 10.7L14.9 9.1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function TimelineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6H18M6 12H14M6 18H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="18" cy="6" r="1.8" fill="currentColor" />
      <circle cx="14" cy="12" r="1.8" fill="currentColor" />
      <circle cx="10" cy="18" r="1.8" fill="currentColor" />
    </svg>
  )
}

function CommunityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7.5 12.5C9.15685 12.5 10.5 11.1569 10.5 9.5C10.5 7.84315 9.15685 6.5 7.5 6.5C5.84315 6.5 4.5 7.84315 4.5 9.5C4.5 11.1569 5.84315 12.5 7.5 12.5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 11.5C17.8807 11.5 19 10.3807 19 9C19 7.61929 17.8807 6.5 16.5 6.5C15.1193 6.5 14 7.61929 14 9C14 10.3807 15.1193 11.5 16.5 11.5Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.8 18.4C4.8 15.9 7 14.7 9.4 14.7C11.8 14.7 14 15.9 15 18.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 15.7C16.6 15.8 18.1 16.6 18.9 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function persistPlannerState(selectedReadiness: ReadinessId | null, checkedTaskIds: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  if (selectedReadiness) {
    window.localStorage.setItem(READINESS_STORAGE_KEY, selectedReadiness)
  } else {
    window.localStorage.removeItem(READINESS_STORAGE_KEY)
  }

  window.localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(checkedTaskIds))
}

function renderReadinessIcon(id: ReadinessId) {
  if (id === 'almost-ready') {
    return <CheckCircleIcon />
  }

  if (id === 'planning-seriously') {
    return <CalendarIcon />
  }

  return <CompassIcon />
}

export default function ReturningNriPlannerExperience() {
  const [selectedReadiness, setSelectedReadiness] = useState<ReadinessId | null>(null)
  const [selectedStageId, setSelectedStageId] = useState<TimelineStageId>('clarity')
  const [checkedTaskIds, setCheckedTaskIds] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [saveNote, setSaveNote] = useState('Auto-saves on this device.')
  const saveTimeoutRef = useRef<number | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedReadiness = window.localStorage.getItem(READINESS_STORAGE_KEY)
    if (
      storedReadiness === 'almost-ready' ||
      storedReadiness === 'planning-seriously' ||
      storedReadiness === 'still-exploring'
    ) {
      setSelectedReadiness(storedReadiness)
    }

    const storedTasks = window.localStorage.getItem(TIMELINE_STORAGE_KEY)
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks)
        if (Array.isArray(parsed)) {
          setCheckedTaskIds(parsed.filter((item): item is string => typeof item === 'string'))
        }
      } catch (error) {
        console.error('Failed to read planner progress:', error)
      }
    }

    setIsHydrated(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    persistPlannerState(selectedReadiness, checkedTaskIds)
  }, [checkedTaskIds, isHydrated, selectedReadiness])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const selectedReadinessCard = READINESS_OPTIONS.find((option) => option.id === selectedReadiness) ?? null
  const selectedStage = TIMELINE_STAGES.find((stage) => stage.id === selectedStageId) ?? TIMELINE_STAGES[0]
  const totalTasks = TIMELINE_STAGES.reduce((sum, stage) => sum + stage.tasks.length, 0)
  const completedTasks = checkedTaskIds.length

  function showSavedState() {
    setSaveNote('Saved on this device.')

    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      setSaveNote('Auto-saves on this device.')
    }, 1800)
  }

  function toggleTask(taskId: string) {
    setCheckedTaskIds((current) =>
      current.includes(taskId) ? current.filter((entry) => entry !== taskId) : [...current, taskId]
    )
    showSavedState()
  }

  function selectReadiness(optionId: ReadinessId) {
    setSelectedReadiness(optionId)
    showSavedState()
  }

  function getStageCompleted(stage: TimelineStage) {
    return stage.tasks.filter((task) => checkedTaskIds.includes(task.id)).length
  }

  return (
    <div className="planner-page">
      <style>{plannerStyles}</style>

      <section className="planner-section" style={{ paddingTop: '1.25rem' }}>
        <div className="planner-shell">
          <div className="planner-hero-grid">
            <div
              style={{
                background: 'rgba(255,255,255,0.86)',
                border: '1px solid rgba(29,22,15,0.08)',
                borderRadius: 32,
                padding: '1.35rem',
                boxShadow: '0 26px 56px rgba(29,22,15,0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.45rem 0.8rem',
                  borderRadius: 999,
                  background: '#fff1de',
                  color: '#8d5c22',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.9rem',
                }}
              >
                Returning NRI Planner
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.35rem, 6vw, 4.6rem)',
                  lineHeight: 0.97,
                  color: '#1a1208',
                  marginBottom: '0.8rem',
                  maxWidth: 620,
                }}
              >
                Your move back to India, finally made clear.
              </h1>

              <p
                style={{
                  maxWidth: 620,
                  fontSize: 16,
                  color: '#5c5346',
                  lineHeight: 1.7,
                  marginBottom: '0.95rem',
                }}
              >
                One simple place to understand where you stand, what to plan next, and what not to miss before moving back.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.7rem 0.9rem',
                  borderRadius: 18,
                  background: '#fcfaf5',
                  border: '1px solid rgba(29,22,15,0.08)',
                  color: '#4f4336',
                  fontSize: 14,
                  lineHeight: 1.5,
                  marginBottom: '1rem',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#138808', flexShrink: 0 }} />
                Built from real return experience - not generic advice.
              </div>

              <div className="planner-action-row" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#readiness" className="btn-primary">
                  Start My Plan
                </a>
                <a href="#timeline" className="btn-ghost">
                  View Move Timeline
                </a>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(30,22,15,0.98) 0%, rgba(35,25,18,0.97) 58%, rgba(24,52,37,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 32,
                padding: '1.25rem',
                boxShadow: '0 26px 56px rgba(18,13,8,0.16)',
                color: '#fff',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', marginBottom: 8 }}>
                Move Clarity Snapshot
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#fff', marginBottom: '0.9rem' }}>
                The move-back command center
              </h2>

              {[
                {
                  title: 'Readiness',
                  body: 'Choose your situation',
                  icon: <CheckCircleIcon />,
                  accent: '#FF9933',
                },
                {
                  title: 'Timeline',
                  body: 'Know what to do next',
                  icon: <TimelineIcon />,
                  accent: '#f3b163',
                },
                {
                  title: 'Community',
                  body: 'Ask people already on the journey',
                  icon: <CommunityIcon />,
                  accent: '#47af5e',
                },
              ].map((row) => (
                <div
                  key={row.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.95rem',
                    borderRadius: 22,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '0.8rem',
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.08)',
                      color: row.accent,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {row.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{row.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.55 }}>{row.body}</div>
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: '0.3rem',
                  padding: '0.8rem 0.9rem',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.64)',
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                Short on time? Choose your readiness state, track the essentials, and pick up later from the same device.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div className="planner-channel-grid">
              {CHANNEL_LINKS.map((channel) =>
                channel.external ? (
                  <a
                    key={channel.title}
                    href={channel.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      background: '#ffffff',
                      border: '1px solid rgba(29,22,15,0.08)',
                      borderRadius: 24,
                      padding: '1rem',
                      boxShadow: '0 16px 34px rgba(29,22,15,0.05)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1208', marginBottom: 4 }}>{channel.title}</div>
                      <div style={{ fontSize: 13, color: '#5c5346', lineHeight: 1.55 }}>{channel.label}</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: '#fcf1e4',
                        color: '#8d5c22',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <InstagramIcon size={22} />
                    </div>
                  </a>
                ) : (
                  <Link
                    key={channel.title}
                    href={channel.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      background: '#ffffff',
                      border: '1px solid rgba(29,22,15,0.08)',
                      borderRadius: 24,
                      padding: '1rem',
                      boxShadow: '0 16px 34px rgba(29,22,15,0.05)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1208', marginBottom: 4 }}>{channel.title}</div>
                      <div style={{ fontSize: 13, color: '#5c5346', lineHeight: 1.55 }}>{channel.label}</div>
                    </div>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: channel.title === 'WhatsApp Community' ? '#edf9f0' : '#fcf1e4',
                        color: channel.title === 'WhatsApp Community' ? '#138808' : '#8d5c22',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {channel.title === 'WhatsApp Community' ? <WhatsAppIcon size={22} /> : <YouTubeIcon size={22} />}
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="readiness" className="planner-section">
        <div className="planner-shell">
          <div style={{ marginBottom: '1rem' }}>
            <div className="section-label">Readiness</div>
            <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
              Where are you right now?
            </h2>
            <p className="section-sub">Pick the closest match. No long quiz.</p>
          </div>

          <div className="planner-readiness-grid">
            {READINESS_OPTIONS.map((option) => {
              const isSelected = selectedReadiness === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectReadiness(option.id)}
                  aria-pressed={isSelected}
                  style={{
                    textAlign: 'left',
                    background: isSelected ? '#fff8ef' : '#ffffff',
                    border: `1px solid ${isSelected ? 'rgba(240,138,36,0.24)' : 'rgba(29,22,15,0.1)'}`,
                    borderRadius: 28,
                    padding: '1.15rem',
                    boxShadow: isSelected ? '0 18px 40px rgba(240,138,36,0.12)' : '0 18px 40px rgba(29,22,15,0.05)',
                    transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: isSelected ? 'rgba(255,153,51,0.14)' : '#f7f2ea',
                      color: isSelected ? '#8d5c22' : '#6b5e50',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.9rem',
                    }}
                  >
                    {renderReadinessIcon(option.id)}
                  </div>

                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1208', marginBottom: 8 }}>{option.title}</div>
                  <div style={{ fontSize: 14, color: '#5c5346', lineHeight: 1.65, marginBottom: 10 }}>{option.line}</div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.4rem 0.72rem',
                      borderRadius: 999,
                      background: isSelected ? 'rgba(255,153,51,0.14)' : '#f7f2ea',
                      color: isSelected ? '#8d5c22' : '#6b5e50',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '0.9rem',
                    }}
                  >
                    {option.verdict}
                  </div>

                  <div style={{ fontSize: 13, color: '#3f352a', lineHeight: 1.6 }}>
                    <strong style={{ color: '#1a1208' }}>Next:</strong> {option.next}
                  </div>
                </button>
              )
            })}
          </div>

          <div
            style={{
              marginTop: '1rem',
              background: '#ffffff',
              border: '1px solid rgba(29,22,15,0.08)',
              borderRadius: 28,
              padding: '1.2rem',
              boxShadow: '0 18px 40px rgba(29,22,15,0.05)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              {selectedReadinessCard ? 'Your next focus' : 'Next step'}
            </div>
            <div style={{ fontSize: 15, color: '#4f4336', lineHeight: 1.7, marginBottom: '0.95rem', maxWidth: 780 }}>
              {selectedReadinessCard
                ? selectedReadinessCard.focus
                : 'Tap the card that feels closest to you. We will save your selection on this device so you can come back to it later.'}
            </div>

            {selectedReadinessCard ? (
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                {selectedReadinessCard.chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 999,
                      background: '#fcf6ed',
                      border: '1px solid rgba(255,153,51,0.16)',
                      color: '#8d5c22',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <Link href="/resources/should-i-return-to-india-from-usa" style={{ fontSize: 14, color: '#6b5e50', textDecoration: 'underline' }}>
              Want detailed personas? View deeper readiness guide.
            </Link>
          </div>
        </div>
      </section>

      <section id="timeline" className="planner-section">
        <div className="planner-shell">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div className="section-label">Timeline</div>
              <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
                Your move-back timeline
              </h2>
              <p className="section-sub">The big things, in the right order.</p>
            </div>

            <div
              style={{
                minWidth: 250,
                background: '#ffffff',
                border: '1px solid rgba(29,22,15,0.08)',
                borderRadius: 22,
                padding: '0.95rem 1rem',
                boxShadow: '0 16px 34px rgba(29,22,15,0.05)',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Progress
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1208', marginBottom: 8 }}>
                {completedTasks} of {totalTasks} essentials done
              </div>
              <div style={{ height: 8, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden', marginBottom: 8 }}>
                <div
                  style={{
                    width: `${(completedTasks / totalTasks) * 100}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #f08a24 0%, #f3a44f 100%)',
                  }}
                />
              </div>
              <div style={{ fontSize: 13, color: '#6b5e50', lineHeight: 1.55 }}>{saveNote}</div>
            </div>
          </div>

          <div className="planner-stage-rail">
            {TIMELINE_STAGES.map((stage) => {
              const completed = getStageCompleted(stage)
              const isActive = stage.id === selectedStage.id

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStageId(stage.id)}
                  aria-pressed={isActive}
                  className="planner-stage-card"
                  style={{
                    textAlign: 'left',
                    background: isActive ? '#fff8ef' : '#ffffff',
                    border: `1px solid ${isActive ? 'rgba(240,138,36,0.24)' : 'rgba(29,22,15,0.1)'}`,
                    borderRadius: 28,
                    padding: '1.1rem',
                    boxShadow: isActive ? '0 18px 40px rgba(240,138,36,0.12)' : '0 18px 40px rgba(29,22,15,0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.35rem 0.68rem',
                      borderRadius: 999,
                      background: isActive ? 'rgba(255,153,51,0.14)' : '#f7f2ea',
                      color: isActive ? '#8d5c22' : '#6b5e50',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1208', marginBottom: 8 }}>{stage.title}</div>
                  <div style={{ display: 'grid', gap: 6, marginBottom: '0.85rem' }}>
                    {stage.tasks.map((task) => (
                      <div key={task.id} style={{ fontSize: 13, color: '#5c5346', lineHeight: 1.5 }}>
                        {task.text}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: '#3f352a', fontWeight: 700, marginBottom: 8 }}>
                    {completed}/{stage.tasks.length} done
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: 'rgba(29,22,15,0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(completed / stage.tasks.length) * 100}%`,
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

          <div
            style={{
              marginTop: '1rem',
              background: '#ffffff',
              border: '1px solid rgba(29,22,15,0.08)',
              borderRadius: 30,
              overflow: 'hidden',
              boxShadow: '0 18px 40px rgba(29,22,15,0.05)',
            }}
          >
            <div
              style={{
                padding: '1.05rem 1.15rem',
                background: 'linear-gradient(135deg, #20160f 0%, #312116 58%, #19422d 100%)',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                Selected stage
              </div>
              <div style={{ fontSize: 'clamp(1.45rem, 4vw, 1.95rem)', fontWeight: 700, marginBottom: 6 }}>
                {selectedStage.label} / {selectedStage.title}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>
                Keep it simple. Focus only on what matters at this stage.
              </div>
            </div>

            <div style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
              {selectedStage.tasks.map((task) => {
                const checked = checkedTaskIds.includes(task.id)

                return (
                  <label
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.95rem 1rem',
                      borderRadius: 20,
                      background: checked ? '#fff7eb' : '#fcfbf8',
                      border: `1px solid ${checked ? 'rgba(240,138,36,0.22)' : 'rgba(29,22,15,0.08)'}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTask(task.id)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: '#DA7716',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 15,
                        color: checked ? '#6b5e50' : '#1a1208',
                        lineHeight: 1.55,
                        textDecoration: checked ? 'line-through' : 'none',
                      }}
                    >
                      {task.text}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="planner-section">
        <div className="planner-shell">
          <div
            style={{
              borderRadius: 32,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f3fbf4 0%, #ffffff 70%)',
              padding: '1.35rem',
              boxShadow: '0 22px 46px rgba(19,136,8,0.06)',
            }}
          >
            <div className="section-label" style={{ color: '#138808' }}>
              Community
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Need help from people actually doing this?
            </h2>
            <p style={{ maxWidth: 640, fontSize: 15, color: '#4f4336', lineHeight: 1.7, marginBottom: '1rem' }}>
              The hardest part is not finding information. It is knowing what applies to your family.
            </p>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(19,136,8,0.14)',
                borderRadius: 28,
                padding: '1.15rem',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1208', marginBottom: 8 }}>
                Join the Returning NRI Community
              </div>
              <div style={{ fontSize: 15, color: '#4f4336', lineHeight: 1.7, marginBottom: '0.95rem', maxWidth: 720 }}>
                250+ active Hyderabad members, a successful online group meeting already completed, more regular sessions being planned, and an in-person Hyderabad get-together in the works for 2026 returnees.
              </div>
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {[
                  '250+ active Hyderabad members',
                  'Regular online sessions',
                  'Hyderabad 2026 meetup planning',
                ].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 999,
                      background: '#edf9f0',
                      border: '1px solid rgba(19,136,8,0.12)',
                      color: '#1f6e30',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="planner-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/community#join-community"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    minHeight: 48,
                    padding: '0.9rem 1.2rem',
                    borderRadius: 999,
                    background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 700,
                    boxShadow: '0 16px 30px rgba(19,136,8,0.2)',
                  }}
                >
                  <WhatsAppIcon size={18} />
                  Join WhatsApp Community
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="btn-ghost"
                >
                  <InstagramIcon size={18} />
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="planner-section">
        <div className="planner-shell">
          <div
            style={{
              borderRadius: 32,
              border: '1px solid rgba(29,22,15,0.08)',
              background: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 18px 40px rgba(29,22,15,0.05)',
            }}
          >
            <div className="section-label">Instagram</div>
            <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
              Short tips for your move-back journey
            </h2>
            <p className="section-sub" style={{ maxWidth: 620, marginBottom: '1rem' }}>
              Prefer quick videos? Follow our Instagram page for short, practical reels on returning to India.
            </p>

            <div
              style={{
                borderRadius: 28,
                background: 'linear-gradient(135deg, #fff5ea 0%, #ffffff 68%, #f7fbf8 100%)',
                border: '1px solid rgba(29,22,15,0.08)',
                padding: '1.1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: 560 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1208', marginBottom: 8 }}>
                    Quick move-back reels, without the page speed hit
                  </div>
                  <div style={{ fontSize: 14, color: '#5c5346', lineHeight: 1.7 }}>
                    Use Instagram for short reminders on RNOR, schools, Hyderabad living, money, and the first 90 days after landing.
                  </div>
                </div>
                <a
                  href={INSTAGRAM_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    minHeight: 46,
                    padding: '0.85rem 1.1rem',
                    borderRadius: 999,
                    background: '#1a1208',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <InstagramIcon size={18} />
                  Follow on Instagram
                </a>
              </div>

              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {INSTAGRAM_TOPICS.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.45rem 0.72rem',
                      borderRadius: 999,
                      background: '#ffffff',
                      border: '1px solid rgba(29,22,15,0.08)',
                      color: '#4f4336',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="planner-section">
        <div className="planner-shell">
          <div style={{ marginBottom: '1rem' }}>
            <div className="section-label">Go Deeper</div>
            <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
              Go deeper only where you need
            </h2>
          </div>

          <div className="planner-shortcuts-grid">
            {SHORTCUTS.map((shortcut) => (
              <Link
                key={shortcut.title}
                href={shortcut.href}
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid rgba(29,22,15,0.08)',
                  borderRadius: 24,
                  padding: '1.05rem',
                  boxShadow: '0 16px 34px rgba(29,22,15,0.05)',
                }}
              >
                <div style={{ fontSize: 21, fontWeight: 700, color: '#1a1208', marginBottom: 6 }}>{shortcut.title}</div>
                <div style={{ fontSize: 14, color: '#5c5346', lineHeight: 1.6, marginBottom: 10 }}>{shortcut.line}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1a1208' }}>
                  Open
                  <ArrowIcon />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-section" style={{ paddingBottom: '1.55rem' }}>
        <div className="planner-shell">
          <div
            style={{
              borderRadius: 32,
              background: '#1f1610',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '1.35rem',
              boxShadow: '0 22px 46px rgba(29,22,15,0.12)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.64)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Final step
            </div>
            <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.7rem)', color: '#ffffff', marginBottom: '0.55rem' }}>
              Moving in 2026?
            </h2>
            <p style={{ maxWidth: 620, fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Start with your plan, join the community, and follow short video tips as you prepare.
            </p>
            <div className="planner-action-row" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/community#join-community"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 48,
                  padding: '0.9rem 1.2rem',
                  borderRadius: 999,
                  background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: '0 16px 30px rgba(19,136,8,0.2)',
                }}
                >
                  <WhatsAppIcon size={18} />
                  Join WhatsApp Community
                </Link>
              <a
                href={INSTAGRAM_URL}
                rel="noopener noreferrer"
                target="_blank"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 48,
                  padding: '0.9rem 1.2rem',
                  borderRadius: 999,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#ffffff',
                  fontSize: 15,
                  fontWeight: 700,
                }}
                >
                <InstagramIcon size={18} />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="planner-mobile-spacer" />

      <div className="planner-mobile-bar">
        <Link
          href="/community#join-community"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 46,
            borderRadius: 16,
            background: 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <WhatsAppIcon size={18} />
          Join Community
        </Link>
        <a
          href={INSTAGRAM_URL}
          rel="noopener noreferrer"
          target="_blank"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 46,
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid rgba(29,22,15,0.08)',
            color: '#1a1208',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <InstagramIcon size={18} />
          Instagram Tips
        </a>
      </div>
    </div>
  )
}
