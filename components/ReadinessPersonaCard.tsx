import type { CSSProperties } from 'react'
import type { ReadinessPersona } from '../lib/moveBackContent'

type Props = {
  persona: ReadinessPersona
  compact?: boolean
}

const verdictTone: Record<string, { bg: string; color: string; border: string }> = {
  'Ready to Move': {
    bg: '#E8F5E8',
    color: '#138808',
    border: 'rgba(19,136,8,0.18)',
  },
  'Nearly Ready': {
    bg: '#FFF3E6',
    color: '#CC7A00',
    border: 'rgba(255,153,51,0.24)',
  },
  'Plan More First': {
    bg: '#FCEBEB',
    color: '#C0392B',
    border: 'rgba(192,57,43,0.18)',
  },
}

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#9d907f',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 6,
}

export default function ReadinessPersonaCard({ persona, compact = false }: Props) {
  const tone = verdictTone[persona.verdict] || verdictTone['Nearly Ready']

  return (
    <article
      style={{
        background: '#ffffff',
        border: '1px solid rgba(29,22,15,0.10)',
        borderRadius: 24,
        padding: compact ? '1.1rem' : '1.3rem',
        boxShadow: '0 18px 38px rgba(29,22,15,0.05)',
        display: 'grid',
        gap: compact ? 12 : 14,
      }}
    >
      <div>
        <h3 style={{ fontSize: compact ? 22 : 26, color: '#1d160f', marginBottom: 6 }}>{persona.name}</h3>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#665848', lineHeight: 1.6, marginBottom: 8 }}>
          {persona.shortDescription}
        </p>
        {!compact ? (
          <p style={{ fontSize: 14, color: '#665848', lineHeight: 1.75 }}>{persona.description}</p>
        ) : null}
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          width: 'fit-content',
          borderRadius: 999,
          padding: '0.45rem 0.8rem',
          background: tone.bg,
          color: tone.color,
          border: `1px solid ${tone.border}`,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {persona.verdict}
      </div>

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: compact ? '1fr' : 'repeat(3, minmax(0, 1fr))',
        }}
      >
        <div>
          <div style={labelStyle}>Liquid buffer</div>
          <div style={{ fontSize: 15, color: '#1d160f', lineHeight: 1.65 }}>{persona.liquidBuffer}</div>
        </div>
        <div>
          <div style={labelStyle}>Watch</div>
          <div style={{ fontSize: 15, color: '#1d160f', lineHeight: 1.65 }}>{persona.watch}</div>
        </div>
        <div>
          <div style={labelStyle}>Next</div>
          <div style={{ fontSize: 15, color: '#1d160f', lineHeight: 1.65 }}>{persona.next}</div>
        </div>
      </div>
    </article>
  )
}
