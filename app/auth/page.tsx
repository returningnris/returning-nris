'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// ─── THEME ────────────────────────────────────────────────────────────────────

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
  navyLight: '#EEF2FF',
  red: '#C0392B',
  redLight: '#FCEBEB',
  heroGrad: 'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const nextPath = searchParams.get('next') || '/'
  const [mode, setMode] = useState<'signin' | 'signup'>(requestedMode)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        setError('Please enter your name')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    // Only set loading AFTER validation passes
    setLoading(true)

    try {
      if (mode === 'signup') {
        const signUpResponse = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            next: nextPath,
          }),
        })

        const signUpPayload = await signUpResponse.json()

        if (!signUpResponse.ok) {
          setError(signUpPayload.error || 'We could not create your account right now.')
          setLoading(false)
          return
        }

        setSuccess('Account created. Check your email and click the verification link. It takes about 30 seconds, and your answers and results will be saved to your profile so you can access them anytime.')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        })

        if (signInError) {
          if (signInError.message.toLowerCase().includes('email not confirmed')) {
            setError('Please confirm your email first. Check your inbox, click the verification link, then sign in.')
          } else {
            setError(signInError.message)
          }
          setLoading(false)
          return
        }

        router.push(nextPath)
        router.refresh()
        return
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflowY: 'auto' }}>
      <div style={{ maxWidth: '480px', width: '100%', marginTop: 'auto', marginBottom: 'auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '1.5rem', textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: T.ink }}>
              <span style={{ color: T.saffron }}>🇮🇳</span> Back2India
            </div>
          </Link>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.ink, marginBottom: '.5rem' }}>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: '.95rem', color: T.muted, lineHeight: 1.6 }}>
            {mode === 'signin' 
              ? 'Sign in to access your readiness assessment and journey progress' 
              : 'It takes about 30 seconds to get started. Create your account once, save your answers and results to your profile, and access them anytime.'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          {/* Sign Up Fields */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  background: T.bg,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: '10px',
                  color: T.ink,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = T.saffron}
                onBlur={(e) => e.currentTarget.style.borderColor = T.border}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '11px 12px',
                background: T.bg,
                border: `1.5px solid ${T.border}`,
                borderRadius: '10px',
                color: T.ink,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = T.saffron}
              onBlur={(e) => e.currentTarget.style.borderColor = T.border}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: mode === 'signup' ? '1rem' : '1.5rem' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 8 characters"
              style={{
                width: '100%',
                padding: '11px 12px',
                background: T.bg,
                border: `1.5px solid ${T.border}`,
                borderRadius: '10px',
                color: T.ink,
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = T.saffron}
              onBlur={(e) => e.currentTarget.style.borderColor = T.border}
            />
          </div>

          {mode === 'signin' && (
            <div style={{ textAlign: 'right' as const, marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
              <Link href="/auth/forgot-password" style={{ fontSize: '12px', color: T.saffron, textDecoration: 'none', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter your password"
                style={{
                  width: '100%',
                  padding: '11px 12px',
                  background: T.bg,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: '10px',
                  color: T.ink,
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = T.saffron}
                onBlur={(e) => e.currentTarget.style.borderColor = T.border}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{ padding: '.875rem', background: T.redLight, border: `1px solid ${T.red}`, borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '13px', color: T.red, margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ padding: '.875rem', background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ fontSize: '13px', color: T.green, margin: 0 }}>{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? 'rgba(255,153,51,0.5)' : T.saffron,
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all .15s',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(255,153,51,0.4)',
            }}
          >
            {loading ? (mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
          </button>

          {/* Privacy Note */}
          {mode === 'signup' && (
            <p style={{ fontSize: '11px', color: T.soft, textAlign: 'center' as const, marginTop: '1rem', marginBottom: 0 }}>
              🔒 We never sell or share your information.
            </p>
          )}
        </form>

        {/* Switch Mode */}
        <div style={{ textAlign: 'center' as const }}>
          <p style={{ fontSize: '14px', color: T.muted, marginBottom: '.5rem' }}>
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
              setSuccess('')
              setFormData({ name: '', email: '', password: '', confirmPassword: '' })
            }}
            style={{
              background: 'none',
              border: 'none',
              color: T.saffron,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              textDecoration: 'underline',
            }}
          >
            {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
          </button>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center' as const, marginTop: '2rem' }}>
          <Link href="/" style={{ fontSize: '13px', color: T.muted, textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
