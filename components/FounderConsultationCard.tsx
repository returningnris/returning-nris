'use client'

import CalendlyPopupButton from './CalendlyPopupButton'

type FounderConsultationCardProps = {
  variant: 'results' | 'dashboard'
  source: 'readiness_results' | 'journey_dashboard'
  email?: string
  firstName?: string
  lastName?: string
  readinessStatus?: string
}

export default function FounderConsultationCard({
  variant,
  source,
  email,
  firstName,
  lastName,
  readinessStatus,
}: FounderConsultationCardProps) {
  const isResults = variant === 'results'

  return (
    <div
      style={{
        background: isResults
          ? 'linear-gradient(180deg, rgba(255,248,240,0.98) 0%, rgba(255,243,230,0.94) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,248,240,0.96) 100%)',
        border: isResults ? '1px solid rgba(240,138,36,0.18)' : '1px solid rgba(29,22,15,0.10)',
        borderRadius: isResults ? 24 : 22,
        padding: isResults ? '1.25rem' : '1.1rem',
        boxShadow: isResults ? '0 18px 38px rgba(29,22,15,0.05)' : '0 14px 28px rgba(29,22,15,0.04)',
        height: isResults ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '0.42rem 0.78rem',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(240,138,36,0.16)',
          color: '#8D5C22',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#F08A24',
          }}
        />
        Founder consultation
      </div>

      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: isResults ? '1.35rem' : '1.2rem',
          color: '#1D160F',
          lineHeight: 1.2,
          marginBottom: 10,
        }}
      >
        {isResults ? 'Need personalized guidance?' : 'Need help with your next step?'}
      </h3>

      <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.7, marginBottom: 14 }}>
        {isResults
          ? 'Talk to the founder for a free intro call and get calm, practical clarity on your move, housing, finances, tax planning, and next steps.'
          : 'Talk to the founder for a free intro call if you want a human second opinion on what to do next in your move.'}
      </p>

      <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
        <div
          style={{
            padding: '0.9rem 0.95rem',
            borderRadius: 18,
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(29,22,15,0.08)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#B08B67', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            What to expect
          </div>
          <div style={{ fontSize: 13, color: '#665848', lineHeight: 1.65 }}>
            Free intro consultation. If useful, you can continue with a paid consultation afterward.
          </div>
        </div>
      </div>

      <div style={{ marginTop: isResults ? 'auto' : 0 }}>
        <CalendlyPopupButton
          buttonLabel={isResults ? 'Book free intro call' : 'Talk to the founder'}
          source={source}
          email={email}
          firstName={firstName}
          lastName={lastName}
          readinessStatus={readinessStatus}
        />
      </div>
    </div>
  )
}
