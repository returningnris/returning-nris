'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
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

type CalendlyMessageData = {
  event?: string
  payload?: unknown
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

export default function CalendlyPopupButton({
  buttonLabel,
  source,
  email,
  firstName,
  lastName,
  readinessStatus,
  style,
}: CalendlyPopupButtonProps) {
  const [runtimeCalendlyUrl, setRuntimeCalendlyUrl] = useState<string>(() => process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || FALLBACK_CALENDLY_URL)
  const scheduledEventKeysRef = useRef<Set<string>>(new Set())

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

  useEffect(() => {
    if (typeof window === 'undefined') return

    function isCalendlyEvent(event: MessageEvent<CalendlyMessageData>) {
      return event.origin === 'https://calendly.com' && typeof event.data?.event === 'string' && event.data.event.startsWith('calendly.')
    }

    async function handleCalendlyMessage(event: MessageEvent<CalendlyMessageData>) {
      if (!isCalendlyEvent(event) || event.data.event !== 'calendly.event_scheduled') return

      const payload =
        event.data.payload && typeof event.data.payload === 'object'
          ? (event.data.payload as Record<string, unknown>)
          : {}

      const inviteeUri =
        getNestedPayloadUri(payload, 'invitee')
      const eventUri =
        getNestedPayloadUri(payload, 'event') ||
        (typeof payload.scheduled_event === 'object' && payload.scheduled_event && typeof (payload.scheduled_event as Record<string, unknown>).uri === 'string'
          ? (payload.scheduled_event as Record<string, unknown>).uri
          : '')
      const dedupeKey = [source, inviteeUri, eventUri, readinessStatus || ''].join('|')

      if (dedupeKey && scheduledEventKeysRef.current.has(dedupeKey)) {
        return
      }

      if (dedupeKey) {
        scheduledEventKeysRef.current.add(dedupeKey)
      }

      let accessToken = ''

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        accessToken = session?.access_token || ''
      } catch (error) {
        console.error('Failed to read consultation session:', error)
      }

      try {
        await fetch('/api/consultation-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            mode: 'scheduled',
            source,
            email,
            firstName,
            lastName,
            readinessStatus,
            calendlyUrl: runtimeCalendlyUrl,
            calendlyEvent: event.data.event,
            payload,
          }),
        })
      } catch (error) {
        console.error('Failed to capture scheduled consultation:', error)
      }
    }

    window.addEventListener('message', handleCalendlyMessage)

    return () => {
      window.removeEventListener('message', handleCalendlyMessage)
    }
  }, [email, firstName, lastName, readinessStatus, runtimeCalendlyUrl, source])

  const calendlyUrl = buildCalendlyUrl(runtimeCalendlyUrl, source, readinessStatus)
  const prefill = buildPrefill(firstName, lastName, email)
  const isConfigured = Boolean(calendlyUrl)

  return (
    <button
      type="button"
      onClick={async () => {
        if (!calendlyUrl) return

        let accessToken = ''

        try {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          accessToken = session?.access_token || ''
        } catch (error) {
          console.error('Failed to read consultation session:', error)
        }

        const hasKnownContact = Boolean(email?.trim() || firstName?.trim() || lastName?.trim() || accessToken)

        if (hasKnownContact) {
          try {
            await fetch('/api/consultation-requests', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
              },
              body: JSON.stringify({
                mode: 'initiated',
                source,
                email,
                firstName,
                lastName,
                readinessStatus,
                calendlyUrl,
              }),
            })
          } catch (error) {
            console.error('Failed to log consultation request:', error)
          }
        }

        if (window.Calendly?.initPopupWidget) {
          window.Calendly.initPopupWidget({
            url: calendlyUrl,
            prefill: Object.keys(prefill).length ? prefill : undefined,
          })
          return
        }

        window.open(calendlyUrl, '_blank', 'noopener,noreferrer')
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
      <span style={{ fontSize: 15, lineHeight: 1 }}>{'->'}</span>
    </button>
  )
}

function getNestedPayloadUri(payload: Record<string, unknown>, key: string) {
  if (typeof payload[`${key}_uri`] === 'string') {
    return payload[`${key}_uri`] as string
  }

  const nestedValue = payload[key]
  if (nestedValue && typeof nestedValue === 'object' && typeof (nestedValue as Record<string, unknown>).uri === 'string') {
    return (nestedValue as Record<string, unknown>).uri as string
  }

  return ''
}
