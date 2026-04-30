'use client'

import type { CSSProperties, FormEvent } from 'react'
import { useState } from 'react'
import {
  COMMUNITY_HELP_TOPICS,
  COMMUNITY_RETURN_YEARS,
  hasValidWhatsAppNumber,
  type CommunityHelpTopic,
  type CommunityJoinPayload,
} from '../lib/community-join'

type CommunityJoinFormProps = {
  formId?: string
}

type FormState = CommunityJoinPayload

type FieldName =
  | 'fullName'
  | 'currentLocation'
  | 'returningCity'
  | 'returningYear'
  | 'mobileNumber'
  | 'consent'

type FieldErrors = Partial<Record<FieldName, string>>

const initialFormState: FormState = {
  fullName: '',
  currentLocation: '',
  returningCity: '',
  returningYear: '2026',
  mobileNumber: '',
  consent: false,
  helpTopics: [],
}

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: '0.45rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#5c5346',
}

const helperStyle: CSSProperties = {
  fontSize: '0.82rem',
  color: '#7b7062',
  lineHeight: 1.6,
}

function getInputStyle(hasError: boolean): CSSProperties {
  return {
    width: '100%',
    borderRadius: 16,
    border: hasError ? '1px solid #c84b31' : '1px solid rgba(26,18,8,0.12)',
    background: '#ffffff',
    color: '#1a1208',
    padding: '0.9rem 1rem',
    fontSize: '0.98rem',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }
}

function validateForm(formState: FormState) {
  const errors: FieldErrors = {}

  if (!formState.fullName.trim()) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!formState.currentLocation.trim()) {
    errors.currentLocation = 'Please share your current city and country.'
  }

  if (!formState.returningCity.trim()) {
    errors.returningCity = 'Please share the Indian city you are returning to.'
  }

  if (!formState.returningYear) {
    errors.returningYear = 'Please select your expected returning year.'
  }

  if (!hasValidWhatsAppNumber(formState.mobileNumber)) {
    errors.mobileNumber = 'Please include a valid WhatsApp number with country code.'
  }

  if (!formState.consent) {
    errors.consent = 'Please confirm that we can contact you on WhatsApp.'
  }

  return errors
}

export default function CommunityJoinForm({ formId = 'join-community' }: CommunityJoinFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))

    setFieldErrors((current) => {
      if (!current[field as FieldName]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[field as FieldName]
      return nextErrors
    })
  }

  function toggleHelpTopic(topic: CommunityHelpTopic) {
    setFormState((current) => {
      const alreadySelected = current.helpTopics.includes(topic)
      return {
        ...current,
        helpTopics: alreadySelected
          ? current.helpTopics.filter((item) => item !== topic)
          : [...current.helpTopics, topic],
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError('')

    const nextErrors = validateForm(formState)
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/community-join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error || 'We could not submit your request right now. Please try again.')
      }

      setIsSubmitted(true)
      setFormState(initialFormState)
      setFieldErrors({})
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not submit your request right now. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        id={formId}
        style={{
          background: 'linear-gradient(180deg, #f5fbf7 0%, #ffffff 100%)',
          border: '1px solid rgba(19,136,8,0.18)',
          borderRadius: 28,
          padding: '2rem',
          boxShadow: '0 18px 42px rgba(19,136,8,0.08)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(19,136,8,0.12)',
            color: '#0f6f07',
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          OK
        </div>
        <h3 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', color: '#1a1208', marginBottom: '0.75rem' }}>
          Thanks, you&apos;re on the list
        </h3>
        <p style={{ fontSize: '1rem', color: '#5c5346', lineHeight: 1.8, maxWidth: 560 }}>
          Thank you! We received your details. We will review and send the WhatsApp community invite link to your mobile number shortly.
        </p>
      </div>
    )
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      style={{
        background: '#ffffff',
        border: '1px solid rgba(26,18,8,0.1)',
        borderRadius: 28,
        padding: '1.5rem',
        boxShadow: '0 24px 48px rgba(29,22,15,0.06)',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="section-label">Join Form</div>
        <h3 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.5rem)', color: '#1a1208', marginBottom: '0.75rem' }}>
          Request WhatsApp Invite
        </h3>
        <p style={{ ...helperStyle, fontSize: '0.95rem' }}>
          Share a few basic details so we can invite you to the most relevant WhatsApp group, online session, or future meetup.
        </p>
      </div>

      <div className="community-form-grid" style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="community-full-name" style={labelStyle}>Full Name</label>
          <input
            id="community-full-name"
            type="text"
            autoComplete="name"
            value={formState.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder="Ananya Rao"
            style={getInputStyle(Boolean(fieldErrors.fullName))}
          />
          {fieldErrors.fullName ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.fullName}</p> : null}
        </div>

        <div>
          <label htmlFor="community-current-location" style={labelStyle}>Current City / Country</label>
          <input
            id="community-current-location"
            type="text"
            autoComplete="address-level2"
            value={formState.currentLocation}
            onChange={(event) => updateField('currentLocation', event.target.value)}
            placeholder="Dallas, USA"
            style={getInputStyle(Boolean(fieldErrors.currentLocation))}
          />
          {fieldErrors.currentLocation ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.currentLocation}</p> : null}
        </div>

        <div>
          <label htmlFor="community-returning-city" style={labelStyle}>Returning Indian City</label>
          <input
            id="community-returning-city"
            type="text"
            value={formState.returningCity}
            onChange={(event) => updateField('returningCity', event.target.value)}
            placeholder="Hyderabad, Bengaluru, Pune, Chennai, etc."
            style={getInputStyle(Boolean(fieldErrors.returningCity))}
          />
          {fieldErrors.returningCity ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.returningCity}</p> : null}
        </div>

        <div>
          <label htmlFor="community-returning-year" style={labelStyle}>Expected Returning Year</label>
          <select
            id="community-returning-year"
            value={formState.returningYear}
            onChange={(event) => updateField('returningYear', event.target.value as FormState['returningYear'])}
            style={getInputStyle(Boolean(fieldErrors.returningYear))}
          >
            {COMMUNITY_RETURN_YEARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.returningYear ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.returningYear}</p> : null}
        </div>

        <div className="community-form-span-2">
          <label htmlFor="community-mobile-number" style={labelStyle}>Mobile Number with WhatsApp</label>
          <input
            id="community-mobile-number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formState.mobileNumber}
            onChange={(event) => updateField('mobileNumber', event.target.value)}
            placeholder="Include country code, e.g. +1 214 XXX XXXX"
            style={getInputStyle(Boolean(fieldErrors.mobileNumber))}
          />
          {fieldErrors.mobileNumber ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.mobileNumber}</p> : null}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>
          What do you need help with? <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(Optional)</span>
        </label>
        <div
          className="community-topic-grid"
          style={{
            display: 'grid',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 20,
            border: '1px solid rgba(26,18,8,0.1)',
            background: '#fcfbf8',
          }}
        >
          {COMMUNITY_HELP_TOPICS.map((topic) => {
            const checked = formState.helpTopics.includes(topic)

            return (
              <label
                key={topic}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  fontSize: '0.94rem',
                  color: '#3f352a',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleHelpTopic(topic)}
                  style={{ width: 18, height: 18, accentColor: '#138808', flexShrink: 0 }}
                />
                <span>{topic}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.95rem',
            color: '#3f352a',
            lineHeight: 1.6,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={formState.consent}
            onChange={(event) => updateField('consent', event.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#138808', marginTop: 2, flexShrink: 0 }}
          />
          <span>
            I agree to be contacted on WhatsApp regarding the Returning NRI community and related resources.
          </span>
        </label>
        {fieldErrors.consent ? <p style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#c84b31' }}>{fieldErrors.consent}</p> : null}
      </div>

      {submitError ? (
        <p
          role="alert"
          style={{
            marginBottom: '1rem',
            borderRadius: 14,
            border: '1px solid rgba(200,75,49,0.24)',
            background: '#fff7f5',
            color: '#a63b24',
            padding: '0.9rem 1rem',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 999,
          background: isSubmitting ? '#75a66f' : 'linear-gradient(180deg, #1a9a42 0%, #138808 100%)',
          color: '#ffffff',
          padding: '0.95rem 1.2rem',
          fontSize: '1rem',
          fontWeight: 700,
          boxShadow: isSubmitting ? 'none' : '0 14px 30px rgba(19,136,8,0.22)',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Submitting...' : 'Request WhatsApp Invite'}
      </button>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.65rem' }}>
        <p style={helperStyle}>
          We respect your privacy. Your details are only used to verify and share the relevant Returning NRI WhatsApp community link. We do not publicly display your mobile number.
        </p>
        <p style={helperStyle}>
          We use the form details to understand where you are moving from, your expected return timeline, and the city you are returning to, so we can invite you to the most relevant WhatsApp group, online session, or future in-person meetup.
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .community-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .community-form-span-2 {
            grid-column: 1 / -1;
          }
          .community-topic-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </form>
  )
}
