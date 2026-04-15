'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import ReadinessPersonaCard from './ReadinessPersonaCard'
import { READINESS_NOTE, READINESS_PERSONAS } from '../lib/moveBackContent'

type QuickAnswers = {
  family: string
  income: string
  timeline: string
  housing: string
}

const initialAnswers: QuickAnswers = {
  family: '',
  income: '',
  timeline: '',
  housing: '',
}

const pageStyles = `
  .planner-shell {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 1.25rem 4rem;
  }
  .planner-grid,
  .planner-links {
    display: grid;
    gap: 1rem;
  }
  .planner-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .planner-links {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 960px) {
    .planner-grid,
    .planner-links {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 767px) {
    .planner-shell {
      padding: 0 1rem 2.5rem;
    }
    .planner-cta-row {
      flex-direction: column;
      align-items: stretch !important;
    }
    .planner-cta-row a,
    .planner-cta-row button {
      width: 100%;
      justify-content: center;
    }
  }
`

function getSuggestedPersona(answers: QuickAnswers) {
  if (answers.income === 'investments') {
    return READINESS_PERSONAS.find((persona) => persona.id === 'fire-returner') || READINESS_PERSONAS[3]
  }

  if (answers.income === 'no-plan') {
    return READINESS_PERSONAS.find((persona) => persona.id === 'not-ready-yet') || READINESS_PERSONAS[4]
  }

  if (answers.family === 'no-kids') {
    return READINESS_PERSONAS.find((persona) => persona.id === 'independent-couple') || READINESS_PERSONAS[2]
  }

  if (answers.income === 'secure') {
    return READINESS_PERSONAS.find((persona) => persona.id === 'secure-family') || READINESS_PERSONAS[0]
  }

  return READINESS_PERSONAS.find((persona) => persona.id === 'one-income-family') || READINESS_PERSONAS[1]
}

function refinementNotes(answers: QuickAnswers) {
  const notes: string[] = []

  if (answers.timeline === 'within6') {
    notes.push('A shorter move window means schools, housing, and tax decisions need to tighten quickly.')
  } else if (answers.timeline === '1to2') {
    notes.push('A longer timeline gives you room to improve the plan before you commit.')
  }

  if (answers.housing === 'rent-first') {
    notes.push('Renting first usually lowers regret when your city, commute, or school fit is still evolving.')
  }

  if (answers.housing === 'buy-now') {
    notes.push('Buying immediately works better when city, neighborhood, and school choices are already stable.')
  }

  if (answers.income === 'investments') {
    notes.push('Treat monthly drawdown, healthcare reserve, and taxes as first-order planning work.')
  }

  if (answers.income === 'one-income') {
    notes.push('Build a backup path before the move so one income is not carrying all the uncertainty.')
  }

  if (answers.family === 'with-kids') {
    notes.push('School timing and the first 90 days often shape whether the move feels smooth or stressful.')
  }

  return notes.slice(0, 3)
}

export default function PlannerPersonaExperience() {
  const [showPersonalization, setShowPersonalization] = useState(false)
  const [answers, setAnswers] = useState<QuickAnswers>(initialAnswers)

  const allAnswered = Object.values(answers).every(Boolean)
  const matchedPersona = useMemo(
    () => (allAnswered ? getSuggestedPersona(answers) : null),
    [allAnswered, answers]
  )
  const notes = useMemo(() => refinementNotes(answers), [answers])

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), linear-gradient(180deg, #fffaf3 0%, #f8f5f0 56%, #f5efe6 100%)',
      }}
    >
      <style>{pageStyles}</style>

      <section style={{ padding: '3rem 0 2rem' }}>
        <div className="planner-shell">
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
              Readiness by persona
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 4.5rem)',
                lineHeight: 0.98,
                color: '#1d160f',
                marginBottom: '1rem',
                maxWidth: 880,
              }}
            >
              See how families like yours usually stand before moving to India
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
              Start with the situation closest to yours. See what readiness usually looks like, what to watch, and what to do next.
            </p>

            <div className="planner-cta-row" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/journey" className="btn-primary">
                View Move-Back Checklist
              </Link>
              <Link href="/resources/rnor-status-nri-returning-to-india" className="btn-ghost">
                Read the RNOR Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 2rem' }}>
        <div className="planner-shell">
          <div className="planner-grid">
            {READINESS_PERSONAS.map((persona) => (
              <ReadinessPersonaCard key={persona.id} persona={persona} />
            ))}
          </div>

          <div
            style={{
              marginTop: '1rem',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid rgba(29,22,15,0.08)',
              borderRadius: 20,
              padding: '1rem 1.1rem',
              fontSize: 14,
              lineHeight: 1.75,
              color: '#665848',
              boxShadow: '0 14px 30px rgba(29,22,15,0.04)',
            }}
          >
            {READINESS_NOTE}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 2rem' }}>
        <div className="planner-shell">
          <div
            style={{
              background: '#1f1610',
              borderRadius: 28,
              padding: '1.6rem',
              color: '#fff',
              boxShadow: '0 22px 48px rgba(29,22,15,0.08)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)', marginBottom: 10 }}>
              Optional personalization
            </div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.6rem)', marginBottom: 10, color: '#fff' }}>
              Want a more tailored view?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.74)', lineHeight: 1.8, maxWidth: 720, marginBottom: '1.1rem' }}>
              Answer a few quick questions to refine this for your timeline, family, and city.
            </p>
            <button
              type="button"
              onClick={() => setShowPersonalization((current) => !current)}
              className="btn-primary"
              aria-expanded={showPersonalization}
              aria-controls="planner-personalization"
            >
              Personalize My Plan
            </button>
          </div>
        </div>
      </section>

      {showPersonalization ? (
        <section id="planner-personalization" style={{ padding: '0 0 2rem' }}>
          <div className="planner-shell">
            <div className="planner-grid" style={{ alignItems: 'start' }}>
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
                  Quick refinement
                </div>
                <h2 style={{ fontSize: 26, color: '#1d160f', marginBottom: 10 }}>A few quick signals</h2>
                <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75, marginBottom: 18 }}>
                  This is optional. It simply helps point you toward the persona and next steps that usually fit best.
                </p>

                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    {
                      key: 'family',
                      label: 'Who is moving?',
                      options: [
                        { value: 'with-kids', label: 'Family with kids' },
                        { value: 'no-kids', label: 'Couple without kids' },
                      ],
                    },
                    {
                      key: 'income',
                      label: 'What is the income picture after the move?',
                      options: [
                        { value: 'secure', label: 'Income is already secure' },
                        { value: 'one-income', label: 'One income is secure, one is open' },
                        { value: 'investments', label: 'We will live from investments' },
                        { value: 'no-plan', label: 'No clear income plan yet' },
                      ],
                    },
                    {
                      key: 'timeline',
                      label: 'What is your move timeline?',
                      options: [
                        { value: 'within6', label: 'Within 6 months' },
                        { value: '6to12', label: '6-12 months' },
                        { value: '1to2', label: '1-2 years or flexible' },
                      ],
                    },
                    {
                      key: 'housing',
                      label: 'How do you expect to land?',
                      options: [
                        { value: 'rent-first', label: 'Rent first' },
                        { value: 'buy-now', label: 'Buy immediately' },
                        { value: 'not-sure', label: 'Still deciding' },
                      ],
                    },
                  ].map((field) => (
                    <label key={field.key} style={{ display: 'grid', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1d160f' }}>{field.label}</span>
                      <select
                        value={answers[field.key as keyof QuickAnswers]}
                        onChange={(event) =>
                          setAnswers((current) => ({
                            ...current,
                            [field.key]: event.target.value,
                          }))
                        }
                        style={{
                          width: '100%',
                          padding: '0.9rem 1rem',
                          borderRadius: 16,
                          border: '1px solid rgba(29,22,15,0.12)',
                          background: '#fff',
                          color: '#1d160f',
                          fontSize: 14,
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                      >
                        <option value="">Choose one</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

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
                  Suggested fit
                </div>
                {matchedPersona ? (
                  <div style={{ display: 'grid', gap: 14 }}>
                    <ReadinessPersonaCard persona={matchedPersona} compact />
                    <div
                      style={{
                        background: '#f8f5f0',
                        border: '1px solid rgba(29,22,15,0.08)',
                        borderRadius: 20,
                        padding: '1rem',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#9d907f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                        What this changes
                      </div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        {notes.map((note) => (
                          <div key={note} style={{ fontSize: 14, color: '#665848', lineHeight: 1.7 }}>
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="planner-cta-row" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Link href="/journey" className="btn-primary">
                        View Move-Back Checklist
                      </Link>
                      <Link href="/resources" className="btn-ghost">
                        Browse Practical Guides
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#f8f5f0',
                      border: '1px solid rgba(29,22,15,0.08)',
                      borderRadius: 20,
                      padding: '1rem',
                      fontSize: 14,
                      color: '#665848',
                      lineHeight: 1.75,
                    }}
                  >
                    Choose the four quick answers on the left and we will point you to the readiness persona that usually fits best.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section style={{ padding: '0 0 3rem' }}>
        <div className="planner-shell">
          <div className="planner-links">
            {[
              {
                title: 'View the full move-back checklist',
                body: 'See what usually needs attention from decision stage to the first year back in India.',
                href: '/journey',
                cta: 'Open checklist',
              },
              {
                title: 'Understand RNOR before you lock timing',
                body: 'RNOR usually matters most before your move date is fixed and foreign income decisions are made.',
                href: '/resources/rnor-status-nri-returning-to-india',
                cta: 'Read RNOR guide',
              },
              {
                title: 'Browse practical guides',
                body: 'Go deeper on cities, schools, housing, checklists, and returning from the USA.',
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
                  Planning help
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
