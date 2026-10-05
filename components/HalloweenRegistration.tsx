'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { HALLOWEEN_PATH, isPrivateToken, validateHalloweenRegistration, type HalloweenEvent } from '@/lib/halloween'
import { halloweenRequest } from '@/lib/halloween-client'
import { PriceBreakdown } from './HalloweenShared'

type Draft = { contactName: string; email: string; whatsapp: string; adults: number; children: number; idempotencyKey: string }
const draftKey = 'halloween-2026-attempt'
const resumeKey = 'halloween-2026-booking'

export default function HalloweenRegistration({ event, available }: { event: HalloweenEvent; available: boolean }) {
  const [contactName, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(1)
  const [challenge, setChallenge] = useState('')
  const [website, setWebsite] = useState('')
  const [attempt, setAttempt] = useState<Draft | null>(null)
  const [resume, setResume] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function initialise() {
      try {
        const response = await fetch('/api/halloween/challenge', { cache: 'no-store' })
        const data = await response.json()
        if (!active) return
        if (!response.ok) throw new Error(data.error || 'Please reload to try again.')
        setChallenge(data.challenge)
        const stored = localStorage.getItem(resumeKey)
        if (isPrivateToken(stored)) setResume(stored)
        const raw = sessionStorage.getItem(draftKey)
        if (raw) {
          const draft: Draft = JSON.parse(raw)
          setAttempt(draft); setName(draft.contactName); setEmail(draft.email)
          setWhatsapp(draft.whatsapp); setAdults(draft.adults); setChildren(draft.children)
        }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : 'Please reload to try again.') }
    }
    void initialise()
    return () => { active = false }
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    const draft = attempt || { contactName, email, whatsapp, adults, children, idempotencyKey: crypto.randomUUID() }
    try { validateHalloweenRegistration(draft) }
    catch (err) { setError(err instanceof Error ? err.message : 'Please check your details.'); setBusy(false); return }
    setAttempt(draft)
    // Save before calling the server: refreshes and uncertain network failures reuse the same key.
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)) } catch { /* Booking still uses the same in-memory key. */ }
    try {
      const { token } = await halloweenRequest<{ token: string }>({ action: 'register', ...draft, challenge, website })
      try { localStorage.setItem(resumeKey, token); sessionStorage.removeItem(draftKey) } catch { /* The private URL is the durable fallback. */ }
      window.location.assign(`${HALLOWEEN_PATH}/booking#${token}`)
    } catch (err) { setError(err instanceof Error ? err.message : 'Please retry the same booking.'); setBusy(false) }
  }

  if (!event.registration_open) return <div className="event-card event-stack">
    <h2>Registration opens soon</h2>
    <p className="event-muted">{available ? 'We are finalising the venue, timings and payment details. Please check back here.' : 'Event details are temporarily unavailable. Please check back shortly.'}</p>
    <PriceBreakdown adults={1} childCount={1} />
    <p className="event-muted">₹500 per child. One adult per child enters free; each additional adult is ₹500.</p>
    {resume && <Link href={`${HALLOWEEN_PATH}/booking#${resume}`} className="btn-secondary" prefetch={false}>Resume my booking</Link>}
  </div>

  return <div className="event-card event-stack">
    <div><h2>Book for your family</h2><p className="event-muted">One form for everyone. No guest accounts or extra attendee names.</p></div>
    {resume && <Link href={`${HALLOWEEN_PATH}/booking#${resume}`} className="event-link" prefetch={false}>Already booked? Resume your booking</Link>}
    {attempt && <p className="event-notice">Your booking attempt is saved. Retry with these details to avoid creating a duplicate booking. Contact the organiser if the details need changing.</p>}
    <form className="event-form" onSubmit={submit}>
      <label>Primary contact name<input required minLength={2} maxLength={100} autoComplete="name" value={contactName} disabled={!!attempt} onChange={e => setName(e.target.value)} /></label>
      <label>Email<input required type="email" maxLength={254} autoComplete="email" value={email} disabled={!!attempt} onChange={e => setEmail(e.target.value)} /><span className="event-muted">For your payment-status emails and private ticket link after confirmation.</span></label>
      <label>WhatsApp number<input required type="tel" maxLength={24} autoComplete="tel" placeholder="+91 98765 43210" value={whatsapp} disabled={!!attempt} onChange={e => setWhatsapp(e.target.value)} /><span className="event-muted">Include the country code.</span></label>
      <div className="event-counts"><label>Adults<input required type="number" min={1} max={50} step={1} value={adults} disabled={!!attempt} onChange={e => setAdults(Number(e.target.value))} /></label>
        <label>Children<input required type="number" min={1} max={50} step={1} value={children} disabled={!!attempt} onChange={e => setChildren(Number(e.target.value))} /></label></div>
      <p className="event-muted">At least one adult and one child per booking.</p>
      <PriceBreakdown adults={adults} childCount={children} />
      <div className="event-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div>
      {error && <p role="alert" className="event-notice event-error">{error}</p>}
      <button className="btn-secondary" disabled={busy || !challenge} type="submit">{busy ? 'Saving your booking…' : attempt ? 'Retry this booking' : 'Continue to payment'}</button>
      <p className="event-muted">Your booking is confirmed after the organiser verifies the bank payment. We do not add you to marketing lists.</p>
    </form>
  </div>
}
