'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { halloweenRequest } from '@/lib/halloween-client'
import { parseHalloweenTicket, type HalloweenBooking } from '@/lib/halloween'
import { EventLinks } from './HalloweenShared'

type Checkin = { status: string; category?: string; label?: string; booking_reference?: string; adult_count?: number; child_count?: number; checked_in_at?: string; ticket_identifier?: string }
type Confirmation = { booking: Pick<HalloweenBooking, 'booking_reference' | 'contact_name' | 'adult_count' | 'child_count' | 'amount_inr' | 'payment_verified'>;
  notification: { status: string; attempts: number; last_error: string | null } | null; reference_reused: boolean; whatsapp_url: string | null }
type Detector = { detect(source: HTMLVideoElement): Promise<{ rawValue: string }[]> }
type DetectorConstructor = new (options: { formats: string[] }) => Detector

async function organiserRequest<T>(body: Record<string, unknown>) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Sign in with your organiser account.')
  return halloweenRequest<T>(body, session.access_token)
}

export default function HalloweenOrganiser({ ticketPage = false }: { ticketPage?: boolean }) {
  const { isAuthenticated, loading, user } = useAuth()
  const [allowedUserId, setAllowedUserId] = useState('')
  const allowed = Boolean(user?.id && allowedUserId === user.id)
  const [tab, setTab] = useState<'checkin' | 'confirmation'>('checkin')
  const [ticket, setTicket] = useState('')
  const [result, setResult] = useState<Checkin | null>(null)
  const [reference, setReference] = useState('')
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const video = useRef<HTMLVideoElement | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const running = useRef(false)
  const scanTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let active = true
    if (loading || !isAuthenticated) return
    async function verifyAccess() {
      try {
        await organiserRequest({ action: 'organiser' })
        if (!active) return
        setAllowedUserId(user?.id || ''); setError(''); setResult(null); setConfirmation(null)
        let token = window.location.hash.slice(1)
        if (!token) { try { token = sessionStorage.getItem('halloween-organiser-scan') || '' } catch { /* Manual lookup remains available. */ } }
        if (token) {
          const parsed = parseHalloweenTicket(token, window.location.origin)
          setTicket(parsed)
          const preview = await organiserRequest<Checkin>({ action: 'checkin', ticket: parsed, admit: false })
          if (active) {
            setResult(preview)
            try { sessionStorage.removeItem('halloween-organiser-scan') } catch { /* Optional resume storage. */ }
          }
        }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : 'Organiser access unavailable.') }
    }
    void verifyAccess()
    return () => { active = false }
  }, [loading, isAuthenticated, user?.id])

  useEffect(() => {
    function cleanup() {
      running.current = false
      if (scanTimer.current) clearTimeout(scanTimer.current)
      stream.current?.getTracks().forEach(track => track.stop())
    }
    function visibility() { if (document.hidden) cleanup() }
    document.addEventListener('visibilitychange', visibility)
    return () => { cleanup(); document.removeEventListener('visibilitychange', visibility) }
  }, [isAuthenticated])

  function stopCamera() {
    running.current = false
    if (scanTimer.current) clearTimeout(scanTimer.current)
    stream.current?.getTracks().forEach(track => track.stop())
    stream.current = null
    setScanning(false)
  }

  async function lookup(raw: string, admit = false) {
    setBusy(true); setError('')
    try {
      const parsed = parseHalloweenTicket(raw, window.location.origin)
      setTicket(parsed)
      const data = await organiserRequest<Checkin>({ action: 'checkin', ticket: parsed, admit })
      setResult(data)
    } catch (err) { setResult(null); setError(err instanceof Error ? err.message : 'Could not check this ticket.') }
    finally { setBusy(false) }
  }

  async function startCamera() {
    setError(''); setResult(null)
    const API = (window as unknown as { BarcodeDetector?: DetectorConstructor }).BarcodeDetector
    if (!API || !navigator.mediaDevices?.getUserMedia) {
      setError('Camera scanning is unavailable in this browser. Enter the ticket identifier below, or use your phone camera to open the QR link.')
      return
    }
    try {
      const detector = new API({ formats: ['qr_code'] })
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      stream.current = media
      if (!video.current) { media.getTracks().forEach(track => track.stop()); return }
      video.current.srcObject = media
      running.current = true; setScanning(true)
      await video.current.play()
      async function scan() {
        if (!running.current || !video.current) return
        try {
          const codes = await detector.detect(video.current)
          if (!running.current) return
          if (codes[0]) { stopCamera(); await lookup(codes[0].rawValue); return }
          scanTimer.current = setTimeout(() => void scan(), 500)
        } catch { stopCamera(); setError('Camera scan failed. Enter the ticket identifier below.') }
      }
      void scan()
    } catch { stopCamera(); setError('Camera permission was unavailable. Enter the ticket identifier below.') }
  }

  async function findConfirmation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError(''); setConfirmation(null)
    try { setConfirmation(await organiserRequest<Confirmation>({ action: 'confirmation', reference })) }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not find the booking.') }
    finally { setBusy(false) }
  }

  if (loading) return <div className="event-shell"><p role="status">Checking your sign-in…</p></div>
  if (!isAuthenticated) return <div className="event-shell"><div className="event-card event-stack">
    <div className="section-label">{ticketPage ? 'Family QR ticket' : 'Organiser access'}</div>
    <h1 className="section-title">{ticketPage ? 'Show your family ticket at the entrance' : 'Event check-in'}</h1>
    <p className="event-muted">{ticketPage ? 'Only an organiser can validate or admit this ticket. Opening this page does not check anyone in.' : 'Sign in with your existing Returning NRIs organiser account to check tickets or prepare a WhatsApp confirmation.'}</p>
    <Link href="/auth?next=%2Fevents%2Fhalloween%2Fcheck-in" className="btn-secondary" onClick={() => {
      try { const token = window.location.hash.slice(1); if (token) sessionStorage.setItem('halloween-organiser-scan', token) } catch { /* The ticket can be reopened manually. */ }
    }}>Organiser sign in</Link>
    <p className="event-muted">After signing in, you’ll return to event check-in. Keep the ticket link handy.</p><EventLinks />
  </div></div>
  if (!allowed) return <div className="event-shell"><div className="event-card event-stack"><h1 className="section-title">Organiser access</h1>
    <p role={error ? 'alert' : 'status'} className={error ? 'event-notice event-error' : 'event-muted'}>{error || 'Checking organiser permissions…'}</p><EventLinks /></div></div>

  return <div className="event-shell event-stack">
    <header><div className="section-label">Organiser only · Halloween 2026</div><h1 className="section-title">Welcome families at the door</h1>
      <p className="event-muted">Look up the family ticket first. One “Admit family” action checks in the whole registered group.</p></header>
    <div className="event-actions"><button className="event-tab" aria-pressed={tab === 'checkin'} onClick={() => { setTab('checkin'); setError('') }}>Check in</button>
      <button className="event-tab" aria-pressed={tab === 'confirmation'} onClick={() => { stopCamera(); setTab('confirmation'); setError('') }}>Send confirmation</button></div>
    {error && <p role="alert" className="event-notice event-error">{error}</p>}
    {tab === 'checkin' ? <div className="event-grid">
      <section className="event-card event-stack"><h2>Scan or enter a ticket</h2>
        <div className="event-actions"><button className="btn-secondary" disabled={busy || scanning} onClick={() => void startCamera()}>Scan QR with camera</button>
          {scanning && <button className="btn-ghost" onClick={stopCamera}>Stop camera</button>}</div>
        <video ref={video} hidden={!scanning} playsInline muted className="event-camera" aria-label="QR camera preview" />
        <form className="event-form" onSubmit={e => { e.preventDefault(); void lookup(ticket) }}>
          <label>Ticket identifier or QR link<input required maxLength={500} autoComplete="off" placeholder="HW26-T-00000001" value={ticket} onChange={e => { setTicket(e.target.value); setResult(null) }} /></label>
          <button className="btn-ghost" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Look up ticket'}</button>
        </form><p className="event-muted">No camera? Enter the identifier printed under the QR. You can also scan with your phone camera and open the ticket link while signed in.</p>
      </section>
      <section className="event-card event-stack" aria-live="polite"><h2>{result?.status || 'Ready for the next guest'}</h2>
        {result ? <>
          {result.label && <p><strong>{result.label}</strong></p>}
          {result.adult_count !== undefined && <p>{result.adult_count} adults · {result.child_count} children</p>}
          {result.booking_reference && <p>Booking: <strong>{result.booking_reference}</strong></p>}
          {result.ticket_identifier && <p className="event-muted">{result.ticket_identifier}</p>}
          {result.checked_in_at && <p className="event-muted">Checked in: {new Date(result.checked_in_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>}
          {result.status === 'Ready for admission' && <button className="btn-secondary" disabled={busy} onClick={() => void lookup(ticket, true)}>Admit family</button>}
          {result.status === 'Payment not verified' && <p className="event-notice">Do not admit. Reconcile the bank payment in Supabase before approving the booking.</p>}
          {result.status === 'Already checked in' && <p className="event-notice">This family booking has already been admitted.</p>}
          {result.status === 'Checked in' && <p className="event-notice event-success">Family admission recorded.</p>}
          <button className="btn-ghost" onClick={() => { setTicket(''); setResult(null); setError('') }}>Next family</button>
        </> : <p className="event-muted">A lookup never admits anyone. Payment and prior check-in are checked again when you admit.</p>}
      </section>
    </div> : <section className="event-card event-stack" style={{ maxWidth: 700 }}>
      <h2>Send a family confirmation</h2><p className="event-muted">Find a booking by its reference. Bank payment approval stays in Supabase Table Editor.</p>
      <form className="event-form" onSubmit={findConfirmation}><label>Booking reference<input required maxLength={13} placeholder="HW26-00000001" value={reference} onChange={e => { setReference(e.target.value); setConfirmation(null) }} /></label>
        <button className="btn-ghost" disabled={busy}>{busy ? 'Finding booking…' : 'Find booking'}</button></form>
      {confirmation && <div className="event-stack">
        <p><strong>{confirmation.booking.contact_name}</strong> · {confirmation.booking.booking_reference}<br />{confirmation.booking.adult_count} adults · {confirmation.booking.child_count} children · ₹{confirmation.booking.amount_inr.toLocaleString('en-IN')}</p>
        <p className={confirmation.booking.payment_verified ? 'event-notice event-success' : 'event-notice'}>{confirmation.booking.payment_verified ? 'Payment verified' : 'Payment not verified — approve only after bank reconciliation'}</p>
        {confirmation.reference_reused && <p className="event-notice event-error">This payment reference is used on another booking. Review it in Supabase.</p>}
        <p className="event-muted">Email: {confirmation.notification?.status === 'sent' ? 'Accepted by the email provider' : confirmation.notification?.status?.replaceAll('_', ' ') || 'Not queued'}{confirmation.notification ? ` · ${confirmation.notification.attempts} attempt(s)` : ''}</p>
        {confirmation.whatsapp_url && <a href={confirmation.whatsapp_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">Send via WhatsApp</a>}
        <p className="event-muted">This opens a prefilled WhatsApp message. Review it and press Send yourself; WhatsApp delivery is not automated.</p>
      </div>}
    </section>}
    <EventLinks />
  </div>
}
