'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const EMAIL_OTP_TYPES = ['email', 'signup', 'invite', 'magiclink', 'recovery', 'email_change'] as const
type EmailOtpType = (typeof EMAIL_OTP_TYPES)[number]

const T = {
  bg: '#F8F5F0',
  white: '#FFFFFF',
  ink: '#1A1208',
  muted: '#6B5E50',
  border: '#E5E1DA',
  saffron: '#FF9933',
  saffronBorder: 'rgba(255,153,51,0.25)',
  green: '#138808',
  red: '#C0392B',
  heroGrad:
    'radial-gradient(ellipse 70% 55% at 50% 10%, rgba(255,153,51,0.1) 0%, transparent 65%), radial-gradient(ellipse 45% 45% at 15% 80%, rgba(19,136,8,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 75%, rgba(0,0,128,0.05) 0%, transparent 60%)',
}

export default function ConfirmAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Confirming your email and signing you in...')

  useEffect(() => {
    let active = true

    async function confirmEmail() {
      const next = searchParams.get('next') || '/'
      const tokenHash = searchParams.get('token_hash')
      const code = searchParams.get('code')
      const type = searchParams.get('type')
      const hashParams = new URLSearchParams(window.location.hash.startsWith('#') ? window.location.hash.slice(1) : '')
      const hashError = hashParams.get('error_description') || hashParams.get('error')

      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession()

      if (existingSession) {
        if (!active) return
        setStatus('success')
        setMessage('Your email is confirmed. Redirecting you back signed in...')
        window.setTimeout(() => {
          router.replace(next)
          router.refresh()
        }, 600)
        return
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          if (!active) return
          setStatus('error')
          setMessage('We could not complete sign-in from this email link. Please request a fresh confirmation email.')
          return
        }

        if (!active) return
        setStatus('success')
        setMessage('Your email is confirmed. Redirecting you back signed in...')
        window.setTimeout(() => {
          router.replace(next)
          router.refresh()
        }, 600)
        return
      }

      if (tokenHash && type) {
        const emailOtpType = EMAIL_OTP_TYPES.find((otpType) => otpType === type)

        if (!emailOtpType) {
          if (!active) return
          setStatus('error')
          setMessage('This confirmation link is invalid or no longer supported. Please request a fresh email link.')
          return
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: emailOtpType as EmailOtpType,
        })

        if (error) {
          if (!active) return
          setStatus('error')
          setMessage('We could not verify this email link. It may have expired. Please request a fresh signup link.')
          return
        }

        if (!active) return

        setStatus('success')
        setMessage('Your email is confirmed. Redirecting you back signed in...')
        window.setTimeout(() => {
          router.replace(next)
          router.refresh()
        }, 600)
        return
      }

      if (hashError) {
        if (!active) return
        setStatus('error')
        setMessage(hashError)
        return
      }

      if (!active) return
      setStatus('error')
      setMessage('This confirmation link is invalid or incomplete.')
    }

    void confirmEmail()

    return () => {
      active = false
    }
  }, [router, searchParams])

  const color = status === 'error' ? T.red : status === 'success' ? T.green : T.saffron

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        backgroundImage: T.heroGrad,
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          width: '100%',
          background: T.white,
          border: `1px solid ${T.border}`,
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: status === 'error' ? '#FCEBEB' : '#FFF3E6',
            color,
            border: `1px solid ${status === 'error' ? 'rgba(192,57,43,0.2)' : T.saffronBorder}`,
            fontSize: '1.4rem',
            fontWeight: 700,
          }}
        >
          {status === 'success' ? '✓' : status === 'error' ? '!' : '...'}
        </div>

        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '2rem',
            color: T.ink,
            marginBottom: '.75rem',
          }}
        >
          {status === 'success' ? 'Email confirmed' : status === 'error' ? 'Link problem' : 'Confirming your account'}
        </h1>

        <p style={{ fontSize: '.95rem', color: T.muted, lineHeight: 1.7, marginBottom: '1.5rem' }}>{message}</p>

        {status === 'error' && (
          <Link
            href="/auth"
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              background: T.saffron,
              borderRadius: '10px',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to sign in
          </Link>
        )}
      </div>
    </div>
  )
}
