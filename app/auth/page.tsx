'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Debug: log when loading changes
  useEffect(() => {
    console.log('[AuthPage] Loading state changed to:', loading)
  }, [loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[AuthPage] Form submitted, mode:', mode)
    setError('')

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
      if (!formData.firstName.trim()) {
        setError('Please enter your first name')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    // Only set loading AFTER validation passes
    setLoading(true)

    setLoading(true)

    try {
      if (mode === 'signup') {
        // Sign up - add new user to users array
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password, // Hash in production!
          createdAt: new Date().toISOString(),
        }

        if (typeof window !== 'undefined') {
          // Get existing users or create empty array
          const existingUsersStr = localStorage.getItem('back2india_users')
          const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : []
          
          // Check if email already exists
          const emailExists = existingUsers.some((u: any) => u.email === formData.email)
          if (emailExists) {
            setError('An account with this email already exists')
            setLoading(false)
            return
          }
          
          // Add new user to array
          existingUsers.push(userData)
          localStorage.setItem('back2india_users', JSON.stringify(existingUsers))
          
          // Set current user
          localStorage.setItem('back2india_user', JSON.stringify(userData))
          localStorage.setItem('back2india_auth', 'true')
        }

        // Force page reload to update navbar
        window.location.href = '/'
      } else {
        // Sign in - find user in users array
        console.log('[AuthPage] Attempting sign-in for:', formData.email)
        if (typeof window !== 'undefined') {
          let existingUsersStr = localStorage.getItem('back2india_users')
          let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : []
          
          console.log('[AuthPage] Found users array:', existingUsers.length, 'users')
          
          // Backwards compatibility: if no users array, check old single user location
          if (existingUsers.length === 0) {
            const oldUser = localStorage.getItem('back2india_user')
            console.log('[AuthPage] No users array, checking old location:', oldUser ? 'found' : 'not found')
            if (oldUser) {
              existingUsers = [JSON.parse(oldUser)]
              // Migrate to new system
              localStorage.setItem('back2india_users', JSON.stringify(existingUsers))
              console.log('[AuthPage] Migrated old user to new system')
            }
          }
          
          // Find user by email
          const user = existingUsers.find((u: any) => u.email === formData.email)
          
          console.log('[AuthPage] User found:', user ? 'YES' : 'NO')
          
          if (!user) {
            console.log('[AuthPage] Available emails:', existingUsers.map((u: any) => u.email))
            setError('No account found with this email. Please sign up first.')
            setLoading(false)
            return
          }
          
          console.log('[AuthPage] Checking password...')
          if (user.password !== formData.password) {
            setError('Invalid email or password')
            setLoading(false)
            return
          }
          
          console.log('[AuthPage] Login successful! Redirecting...')
          // Login successful
          localStorage.setItem('back2india_user', JSON.stringify(user))
          localStorage.setItem('back2india_auth', 'true')
          
          // Force page reload to update navbar
          window.location.href = '/'
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
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
              : 'Get started with your personalized Back2India journey'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          
          {/* Sign Up Fields */}
          {mode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Rahul"
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
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: T.soft, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '6px' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Sharma"
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
              setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
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