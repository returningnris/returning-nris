'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const T = {
  bg: '#F8F5F0',
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

function UpdatePasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    async function prepareResetSession() {
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        if (!active) return
        setReady(true)
        setLoading(false)
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          if (!active) return
          setError('We could not validate this reset link. Please request a new one.')
          setLoading(false)
          return
        }

        if (!active) return
        setReady(true)
        setLoading(false)
        return
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as 'recovery' | 'email',
        })

        if (error) {
          if (!active) return
          setError('We could not validate this reset link. Please request a new one.')
          setLoading(false)
          return
        }

        if (!active) return
        setReady(true)
        setLoading(false)
        return
      }

      if (!active) return
      setError('This password reset link is invalid or incomplete.')
      setLoading(false)
    }

    void prepareResetSession()

    return () => {
      active = false
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess('Password updated. Redirecting you home...')
    window.setTimeout(() => {
      router.replace('/')
      router.refresh()
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', color: T.ink, marginBottom: '.5rem' }}>Choose a new password</h1>
          <p style={{ fontSize: '.95rem', color: T.muted, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Set a new password for your ReturningNRIs account.
          </p>

          {loading && <div style={{ fontSize: '14px', color: T.muted }}>Validating your reset link...</div>}
          {!loading && error && <div style={{ padding: '.875rem', background: T.redLight, border: `1px solid ${T.red}`, borderRadius: '8px', marginBottom: '1rem', fontSize: '13px', color: T.red }}>{error}</div>}
          {!loading && success && <div style={{ padding: '.875rem', background: T.greenLight, border: `1px solid ${T.green}`, borderRadius: '8px', marginBottom: '1rem', fontSize: '13px', color: T.green }}>{success}</div>}

          {!loading && ready && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{ width: '100%', padding: '11px 12px', background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: '10px', color: T.ink, fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }}
                />
              </div>

              <button type="submit" disabled={saving} style={{ width: '100%', padding: '13px', background: saving ? 'rgba(255,153,51,0.5)' : T.saffron, border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {saving ? 'Updating password...' : 'Update password'}
              </button>
            </>
          )}

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

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: T.bg, backgroundImage: T.heroGrad }} />}>
      <UpdatePasswordPageContent />
    </Suspense>
  )
}
