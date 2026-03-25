'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const T = {
  bg: '#F6F3EE',
  white: '#FFFFFF',
  ink: '#16110A',
  muted: '#6F6458',
  soft: '#A99C8D',
  border: 'rgba(26,18,8,0.08)',
  line: '#E7E0D8',
  saffron: '#FF8F2A',
  saffronDeep: '#F07A0A',
  saffronLight: '#FFF4E9',
  saffronBorder: 'rgba(255,143,42,0.24)',
  navy: '#0F2747',
  navyLight: '#EEF4FF',
  green: '#177245',
  greenLight: '#EBF8F0',
  red: '#C0392B',
  redLight: '#FCEBEB',
  heroGrad:
    'radial-gradient(ellipse 75% 60% at 8% 12%, rgba(255,143,42,0.14) 0%, transparent 55%), radial-gradient(ellipse 65% 55% at 92% 8%, rgba(15,39,71,0.08) 0%, transparent 58%), linear-gradient(180deg, #F8F5F0 0%, #F6F3EE 100%)',
}

function normalizeSignInError(message: string) {
  const lower = message.toLowerCase()

  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email first. Open the verification email, then sign in here.'
  }

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'That email or password does not match our records. Try again or reset your password.'
  }

  if (lower.includes('network') || lower.includes('fetch')) {
    return 'We could not reach the sign-in service. Please try again in a moment.'
  }

  return 'We could not sign you in right now. Please try again.'
}

function fieldStyle() {
  return {
    width: '100%',
    padding: '13px 14px',
    background: 'rgba(255,255,255,0.9)',
    border: `1px solid ${T.line}`,
    borderRadius: '14px',
    color: T.ink,
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }
}

function AuthPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const nextPath = searchParams.get('next') || '/'

  const [signInData, setSignInData] = useState({ email: '', password: '' })
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [signInError, setSignInError] = useState('')
  const [signUpError, setSignUpError] = useState('')
  const [signUpSuccess, setSignUpSuccess] = useState('')
  const [signInLoading, setSignInLoading] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)

  async function handleSignInSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSignInError('')

    if (!signInData.email || !signInData.email.includes('@')) {
      setSignInError('Please enter a valid email address.')
      return
    }

    if (!signInData.password || signInData.password.length < 8) {
      setSignInError('Password must be at least 8 characters.')
      return
    }

    setSignInLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInData.email.trim(),
        password: signInData.password,
      })

      if (error) {
        setSignInError(normalizeSignInError(error.message))
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setSignInError('We could not sign you in right now. Please try again.')
    } finally {
      setSignInLoading(false)
    }
  }

  async function handleSignUpSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSignUpError('')
    setSignUpSuccess('')

    if (!signUpData.name.trim()) {
      setSignUpError('Please enter your name.')
      return
    }

    if (!signUpData.email || !signUpData.email.includes('@')) {
      setSignUpError('Please enter a valid email address.')
      return
    }

    if (!signUpData.password || signUpData.password.length < 8) {
      setSignUpError('Password must be at least 8 characters.')
      return
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError('Passwords do not match.')
      return
    }

    setSignUpLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpData.name.trim(),
          email: signUpData.email.trim(),
          password: signUpData.password,
          next: nextPath,
        }),
      })

      let payload: { error?: string } | null = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        setSignUpError(payload?.error || 'We could not create your account right now.')
        return
      }

      setSignUpSuccess(
        'Check your inbox, confirm your email, and you will come back signed in with your planning data attached to your profile.'
      )
    } catch {
      setSignUpError('We could not create your account right now. Please try again.')
    } finally {
      setSignUpLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        backgroundImage: T.heroGrad,
        fontFamily: 'DM Sans, sans-serif',
        padding: 'clamp(20px, 3vw, 32px)',
      }}
    >
      <div
        className="auth-shell"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(540px, 1fr)',
          gap: '28px',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <section style={{ padding: '18px 6px 18px 6px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, rgba(255,143,42,0.16), rgba(15,39,71,0.12))',
                border: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: T.saffronDeep,
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              R
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: T.ink }}>
              ReturningNRIs
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)',
              border: `1px solid ${T.border}`,
              color: T.muted,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            Account access
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(2.9rem, 5vw, 5.1rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: T.ink,
              margin: '0 0 18px',
              maxWidth: '11ch',
            }}
          >
            Sign in or create your free account.
          </h1>



          <div
            style={{
              display: 'grid',
              gap: '14px',
              maxWidth: '560px',
            }}
          >
            {[
              'Your saved readiness report stays attached to your account.',
              'Returning users can pick up exactly where they left off.',
              'Verification, sign in, and password reset all happen in one flow.',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '999px',
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    color: T.saffronDeep,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  +
                </div>
                <div style={{ color: T.ink, fontSize: '15px', lineHeight: 1.7 }}>{item}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '34px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '14px',
              maxWidth: '620px',
            }}
            className="auth-stats"
          >
            {[
              { value: '30 sec', label: 'typical setup time' },
              { value: 'Private', label: 'profile-based access' },
              { value: 'Anytime', label: 'resume your planning' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.62)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '18px',
                  padding: '16px 18px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem', color: T.ink, marginBottom: '4px' }}>{item.value}</div>
                <div style={{ fontSize: '12px', lineHeight: 1.6, color: T.muted }}>{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: `1px solid ${T.border}`,
            borderRadius: '32px',
            padding: '18px',
            boxShadow: '0 20px 60px rgba(24,18,12,0.08)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <div
            className="auth-card-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <form
              onSubmit={handleSignInSubmit}
              style={{
                background: T.white,
                border: `1px solid ${requestedMode === 'signin' ? T.saffronBorder : T.border}`,
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: T.navy,
                  background: T.navyLight,
                  borderRadius: '999px',
                  padding: '6px 11px',
                  alignSelf: 'flex-start',
                  marginBottom: '18px',
                }}
              >
                Sign in
              </div>

              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', lineHeight: 1.02, color: T.ink, margin: '0 0 10px' }}>
                Welcome back
              </h2>
              <p style={{ color: T.muted, fontSize: '14px', lineHeight: 1.7, margin: '0 0 22px' }}>
                Access your saved report and continue your return planning.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={fieldStyle()}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  style={fieldStyle()}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                <Link href="/auth/forgot-password" style={{ color: T.saffronDeep, fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>

              {signInError && (
                <div style={{ padding: '12px 13px', background: T.redLight, border: `1px solid ${T.red}`, borderRadius: '14px', marginBottom: '14px' }}>
                  <p style={{ margin: 0, color: T.red, fontSize: '13px', lineHeight: 1.6 }}>{signInError}</p>
                </div>
              )}

              {!signInError && (
                <div style={{ minHeight: '66px', marginBottom: '14px' }} />
              )}

              <div style={{ marginTop: 'auto' }}>
                <button
                  type="submit"
                  disabled={signInLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: signInLoading ? 'rgba(15,39,71,0.42)' : T.navy,
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: signInLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: signInLoading ? 'none' : '0 12px 28px rgba(15,39,71,0.18)',
                  }}
                >
                  {signInLoading ? 'Signing you in...' : 'Sign in'}
                </button>

                <div style={{ margin: '14px 0 0', minHeight: '58px' }} />
              </div>
            </form>

            <form
              onSubmit={handleSignUpSubmit}
              style={{
                background: T.white,
                border: `1px solid ${requestedMode === 'signup' ? T.saffronBorder : T.border}`,
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: T.green,
                  background: T.greenLight,
                  borderRadius: '999px',
                  padding: '6px 11px',
                  alignSelf: 'flex-start',
                  marginBottom: '18px',
                }}
              >
                Create account
              </div>

              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', lineHeight: 1.02, color: T.ink, margin: '0 0 10px' }}>
                Start here
              </h2>
              <p style={{ color: T.muted, fontSize: '14px', lineHeight: 1.7, margin: '0 0 22px' }}>
                Set up your account once and keep your planning connected to your profile.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Rahul Sharma"
                  style={fieldStyle()}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={fieldStyle()}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Minimum 8 characters"
                  style={fieldStyle()}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: 700, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Re-enter your password"
                  style={fieldStyle()}
                />
              </div>

              {signUpError && (
                <div style={{ padding: '12px 13px', background: T.redLight, border: `1px solid ${T.red}`, borderRadius: '14px', marginBottom: '14px' }}>
                  <p style={{ margin: 0, color: T.red, fontSize: '13px', lineHeight: 1.6 }}>{signUpError}</p>
                </div>
              )}

              {signUpSuccess && (
                <div style={{ padding: '12px 13px', background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: '14px', marginBottom: '14px' }}>
                  <p style={{ margin: 0, color: T.green, fontSize: '13px', lineHeight: 1.6 }}>{signUpSuccess}</p>
                </div>
              )}

              <div style={{ marginTop: 'auto' }}>
                <button
                  type="submit"
                  disabled={signUpLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: signUpLoading ? 'rgba(255,143,42,0.45)' : T.saffron,
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: signUpLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: signUpLoading ? 'none' : '0 12px 28px rgba(255,143,42,0.2)',
                  }}
                >
                  {signUpLoading ? 'Creating your account...' : 'Create account'}
                </button>

                <p style={{ margin: '14px 0 0', color: T.soft, fontSize: '11px', lineHeight: 1.6, textAlign: 'center', minHeight: '58px' }}>
                  Your information stays private and is used only for your ReturningNRIs planning experience.
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .auth-shell {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
        }

        @media (max-width: 760px) {
          .auth-card-grid,
          .auth-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad }} />}>
      <AuthPageContent />
    </Suspense>
  )
}
