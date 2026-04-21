'use client'

import { useState } from 'react'
import Link from 'next/link'

const T = {
  bg: '#FFFFFF',
  white: '#FFFFFF',
  ink: '#1A1208',
  muted: '#6B5E50',
  soft: '#B5A898',
  border: '#E5E1DA',
  saffron: '#FF9933',
  green: '#138808',
  greenLight: '#E8F5E8',
  red: '#C0392B',
  redLight: '#FCEBEB',
  heroGrad:
    'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    let payload: { error?: string } | null = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    if (!response.ok) {
      setError(payload?.error || 'We could not send the reset email right now. Please try again.')
    } else {
      setSuccess('Password reset email sent. Check your inbox and follow the link to set a new password.')
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.ink, marginBottom: '.5rem' }}>Reset your password</h1>
          <p style={{ fontSize: '.95rem', color: T.muted, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Enter your email and we&apos;ll send you a secure link to choose a new password.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>

          {error && <div style={{ padding: '.875rem', background: T.redLight, border: `1px solid ${T.red}`, borderRadius: '8px', marginBottom: '1rem', fontSize: '13px', color: T.red }}>{error}</div>}
          {success && <div style={{ padding: '.875rem', background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: '8px', marginBottom: '1rem', fontSize: '13px', color: T.green }}>{success}</div>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'rgba(255,153,51,0.5)' : T.saffron, border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>

          <div style={{ textAlign: 'center' as const, marginTop: '1rem' }}>
            <Link href="/auth" style={{ fontSize: '13px', color: T.muted, textDecoration: 'none' }}>
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
