'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type CalendlyPrefill = {
  email?: string
  firstName?: string
  lastName?: string
  name?: string
}

type CalendlyPopupOptions = {
  url: string
  prefill?: CalendlyPrefill
}

type ConsultationContact = {
  firstName: string
  lastName: string
  email: string
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: CalendlyPopupOptions) => void
    }
  }
}

type CalendlyPopupButtonProps = {
  buttonLabel: string
  source: 'readiness_results' | 'journey_dashboard'
  email?: string
  firstName?: string
  lastName?: string
  readinessStatus?: string
  style?: CSSProperties
}

const CALENDLY_SCRIPT_ID = 'calendly-widget-script'
const CALENDLY_STYLESHEET_ID = 'calendly-widget-stylesheet'
const FALLBACK_CALENDLY_URL = 'https://calendly.com/returningnris/30min'
const CONSULTATION_CONTACT_STORAGE_KEY = 'consultation:guest-contact'

function buildCalendlyUrl(baseUrl: string, source: CalendlyPopupButtonProps['source'], readinessStatus?: string) {
  if (!baseUrl) return ''

  try {
    const url = new URL(baseUrl)
    url.searchParams.set('hide_gdpr_banner', '1')
    url.searchParams.set('hide_event_type_details', '1')
    url.searchParams.set('source', source)

    if (readinessStatus) {
      url.searchParams.set('readiness_status', readinessStatus)
    }

    return url.toString()
  } catch {
    return ''
  }
}

function buildPrefill(firstName?: string, lastName?: string, email?: string) {
  const safeFirst = firstName?.trim() || ''
  const safeLast = lastName?.trim() || ''
  const safeEmail = email?.trim() || ''
  const name = [safeFirst, safeLast].filter(Boolean).join(' ').trim()

  return {
    ...(safeEmail ? { email: safeEmail } : {}),
    ...(safeFirst ? { firstName: safeFirst } : {}),
    ...(safeLast ? { lastName: safeLast } : {}),
    ...(name ? { name } : {}),
  }
}

function splitFullName(fullName: string) {
  const trimmedName = fullName.trim()
  if (!trimmedName) {
    return { firstName: '', lastName: '' }
  }

  const [firstName, ...rest] = trimmedName.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

function loadStoredConsultationContact(): ConsultationContact | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(CONSULTATION_CONTACT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<ConsultationContact>
    return {
      firstName: typeof parsed.firstName === 'string' ? parsed.firstName : '',
      lastName: typeof parsed.lastName === 'string' ? parsed.lastName : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
    }
  } catch {
    return null
  }
}

function saveStoredConsultationContact(contact: ConsultationContact) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(CONSULTATION_CONTACT_STORAGE_KEY, JSON.stringify(contact))
  } catch {
    return
  }
}

export default function CalendlyPopupButton({
  buttonLabel,
  source,
  email,
  firstName,
  lastName,
  readinessStatus,
  style,
}: CalendlyPopupButtonProps) {
  const initialStoredContact = loadStoredConsultationContact()
  const initialContactName = [firstName?.trim() || initialStoredContact?.firstName || '', lastName?.trim() || initialStoredContact?.lastName || '']
    .filter(Boolean)
    .join(' ')
    .trim()
  const initialContactEmail = email?.trim() || initialStoredContact?.email || ''

  const [runtimeCalendlyUrl, setRuntimeCalendlyUrl] = useState<string>(() => process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || FALLBACK_CALENDLY_URL)
  const [guestContactOpen, setGuestContactOpen] = useState(false)
  const [guestContactName, setGuestContactName] = useState(initialContactName)
  const [guestContactEmail, setGuestContactEmail] = useState(initialContactEmail)
  const [guestContactError, setGuestContactError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const existingStylesheet = document.getElementById(CALENDLY_STYLESHEET_ID) as HTMLLinkElement | null
    if (!existingStylesheet) {
      const link = document.createElement('link')
      link.id = CALENDLY_STYLESHEET_ID
      link.rel = 'stylesheet'
      link.href = 'https://calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }

    const existingScript = document.getElementById(CALENDLY_SCRIPT_ID) as HTMLScriptElement | null
    if (window.Calendly?.initPopupWidget) return

    if (existingScript) {
      const handleLoad = () => undefined
      existingScript.addEventListener('load', handleLoad)
      return () => existingScript.removeEventListener('load', handleLoad)
    }

    const script = document.createElement('script')
    script.id = CALENDLY_SCRIPT_ID
    script.src = 'https://calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    let active = true

    async function loadCalendlyUrl() {
      try {
        const response = await fetch('/api/calendly', { cache: 'no-store' })
        if (!response.ok) return

        const data = (await response.json()) as { calendlyUrl?: string }
        if (!active) return

        const nextUrl = data.calendlyUrl?.trim() || ''
        if (nextUrl) {
          setRuntimeCalendlyUrl(nextUrl)
        }
      } catch {
        return
      }
    }

    if (!runtimeCalendlyUrl || runtimeCalendlyUrl === FALLBACK_CALENDLY_URL) {
      void loadCalendlyUrl()
    }

    return () => {
      active = false
    }
  }, [runtimeCalendlyUrl])

  function resolveContact(overrides?: Partial<ConsultationContact>): ConsultationContact {
    const storedContact = loadStoredConsultationContact()

    return {
      firstName: overrides?.firstName?.trim() || firstName?.trim() || storedContact?.firstName?.trim() || '',
      lastName: overrides?.lastName?.trim() || lastName?.trim() || storedContact?.lastName?.trim() || '',
      email: overrides?.email?.trim() || email?.trim() || storedContact?.email?.trim() || '',
    }
  }

  const calendlyUrl = buildCalendlyUrl(runtimeCalendlyUrl, source, readinessStatus)
  const isConfigured = Boolean(calendlyUrl)

  async function openCalendly(contact: ConsultationContact) {
    let accessToken = ''

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      accessToken = session?.access_token || ''
    } catch (error) {
      console.error('Failed to read consultation session:', error)
    }

    saveStoredConsultationContact(contact)

    try {
      await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          source,
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          readinessStatus,
          calendlyUrl,
        }),
      })
    } catch (error) {
      console.error('Failed to log consultation request:', error)
    }

    const prefill = buildPrefill(contact.firstName, contact.lastName, contact.email)

    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({
        url: calendlyUrl,
        prefill: Object.keys(prefill).length ? prefill : undefined,
      })
      return
    }

    window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          if (!calendlyUrl) return

          const resolvedContact = resolveContact()
          if (!resolvedContact.firstName || !resolvedContact.email) {
            setGuestContactName((current) => current || [resolvedContact.firstName, resolvedContact.lastName].filter(Boolean).join(' ').trim())
            setGuestContactEmail((current) => current || resolvedContact.email)
            setGuestContactError('')
            setGuestContactOpen(true)
            return
          }

          await openCalendly(resolvedContact)
        }}
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '0.95rem 1.15rem',
          borderRadius: 999,
          border: 'none',
          background: 'linear-gradient(180deg, #F08A24 0%, #DA7716 100%)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
          cursor: isConfigured ? 'pointer' : 'default',
          opacity: 1,
          boxShadow: '0 10px 24px rgba(240,138,36,0.24)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          ...style,
        }}
        aria-label={buttonLabel}
      >
        <span>{buttonLabel}</span>
        <span style={{ fontSize: 15, lineHeight: 1 }}>â†’</span>
      </button>

      {guestContactOpen ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26,18,8,0.48)',
            backdropFilter: 'blur(6px)',
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => {
            setGuestContactOpen(false)
            setGuestContactError('')
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1px solid rgba(29,22,15,0.10)',
              boxShadow: '0 30px 80px rgba(29,22,15,0.18)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.2rem 1.3rem', background: '#20160f', color: '#FFFFFF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', marginBottom: 10 }}>
                Book founder call
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.7rem', lineHeight: 1.1, marginBottom: 8 }}>
                Add your contact details first
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: 0 }}>
                We&apos;ll use this to prefill Calendly and save your consultation request correctly.
              </p>
            </div>

            <div style={{ padding: '1.3rem', display: 'grid', gap: 12 }}>
              <input
                value={guestContactName}
                onChange={(event) => setGuestContactName(event.target.value)}
                placeholder="Full name"
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  borderRadius: 14,
                  border: '1px solid rgba(29,22,15,0.10)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                }}
              />
              <input
                value={guestContactEmail}
                onChange={(event) => setGuestContactEmail(event.target.value)}
                placeholder="Email address"
                type="email"
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  borderRadius: 14,
                  border: '1px solid rgba(29,22,15,0.10)',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 14,
                }}
              />
              {guestContactError ? (
                <div style={{ fontSize: 13, color: '#C0392B', lineHeight: 1.6 }}>{guestContactError}</div>
              ) : null}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => {
                    setGuestContactOpen(false)
                    setGuestContactError('')
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: 14,
                    border: '1px solid rgba(29,22,15,0.10)',
                    background: '#FFFFFF',
                    color: '#1D160F',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const trimmedName = guestContactName.trim()
                    const trimmedEmail = guestContactEmail.trim()

                    if (!trimmedName) {
                      setGuestContactError('Please enter your name.')
                      return
                    }

                    if (!trimmedEmail.includes('@')) {
                      setGuestContactError('Please enter a valid email address.')
                      return
                    }

                    const parsedName = splitFullName(trimmedName)
                    const resolvedContact = resolveContact({
                      firstName: parsedName.firstName,
                      lastName: parsedName.lastName,
                      email: trimmedEmail,
                    })

                    setGuestContactError('')
                    setGuestContactOpen(false)
                    await openCalendly(resolvedContact)
                  }}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(180deg, #F08A24 0%, #DA7716 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue to booking
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
