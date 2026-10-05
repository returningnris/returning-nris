'use client'

import { useEffect, useState, type FormEvent } from 'react'
import QRCode from 'qrcode'
import { HALLOWEEN_PATH, HALLOWEEN_PAYMENT_CONTACT, isPrivateToken, paymentImageUrl, type HalloweenTicket, type PrivateBooking } from '@/lib/halloween'
import { copyEventText, halloweenRequest } from '@/lib/halloween-client'
import { BookingSteps, EventDetails, EventLinks, PriceBreakdown } from './HalloweenShared'

function FamilyTicket({ ticket, bookingReference, event, adults, childCount }: {
  ticket: HalloweenTicket; bookingReference: string; event: PrivateBooking['event']; adults: number; childCount: number
}) {
  const [qr, setQr] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    const url = `${window.location.origin}${HALLOWEEN_PATH}/ticket#${ticket.validation_token}`
    QRCode.toDataURL(url, { width: 640, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
      .then(data => { if (active) setQr(data) })
      .catch(() => { if (active) setError('QR image could not load. Use the ticket identifier at the entrance.') })
    return () => { active = false }
  }, [ticket.validation_token])
  return <article className="event-ticket">
    <div className="section-label" style={{ color: 'var(--green)' }}>Family entry</div>
    <h3>Your family ticket</h3><p>{adults} adult{adults === 1 ? '' : 's'} · {childCount} child{childCount === 1 ? '' : 'ren'}</p><small>{event.name}</small>
    {/* Locally generated PNG; next/image optimisation must not receive private QR payloads. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {qr ? <img src={qr} alt="QR ticket for your whole family booking" width={280} height={280} /> : <p className="event-muted">{error || 'Preparing QR ticket…'}</p>}
    <strong>{ticket.ticket_identifier}</strong><small>Booking {bookingReference}</small>
    <small>31 October 2026 · {event.timings || 'Timings to be announced'} (IST)</small><small>{event.venue || 'Venue to be announced'}</small>
    <p className="event-muted">{ticket.checked_in_at ? 'Already checked in' : 'Show this QR at the entrance'}</p>
    {qr && <a href={qr} download={`${ticket.ticket_identifier}.png`} className="btn-ghost" style={{ marginTop: '.8rem' }}>Download QR</a>}
  </article>
}

export default function HalloweenBooking() {
  const [token, setToken] = useState('')
  const [data, setData] = useState<PrivateBooking | null>(null)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    const currentToken = window.location.hash.slice(1)
    async function load(silent = false) {
      try {
        if (!isPrivateToken(currentToken)) throw new Error('Open the private booking link you saved after registering.')
        const result = await halloweenRequest<PrivateBooking>({ action: 'booking', token: currentToken })
        if (!active) return
        setToken(currentToken); setData(result); setError('')
      } catch (err) {
        if (active && !silent) setError(err instanceof Error ? err.message : 'Could not load your booking.')
      }
    }
    void load()
    const timer = setInterval(() => { if (document.visibilityState === 'visible') void load(true) }, 30000)
    return () => { active = false; clearInterval(timer) }
  }, [])

  async function copy(value: string, message: string) {
    try { await copyEventText(value); setNotice(message); setError('') }
    catch (err) { setError(err instanceof Error ? err.message : 'Please copy the text manually.') }
  }

  async function refresh() {
    setBusy(true); setError('')
    try { setData(await halloweenRequest<PrivateBooking>({ action: 'booking', token })); setNotice('Booking status updated.') }
    catch (err) { setError(err instanceof Error ? err.message : 'Please try again.') }
    finally { setBusy(false) }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try {
      setData(await halloweenRequest<PrivateBooking>({ action: 'payment', token, reference }))
      setNotice('Reference saved. Payment is pending verification by the organiser.')
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.') }
    finally { setBusy(false) }
  }

  if (!data) return <div className="event-shell"><div className="event-card event-stack"><h1>Your family booking</h1>
    <p role={error ? 'alert' : 'status'} className={error ? 'event-notice event-error' : 'event-muted'}>{error || 'Loading your private booking…'}</p><EventLinks /></div></div>

  const { booking, event, tickets } = data
  const qrImage = paymentImageUrl(event.payment_qr_image_url)
  const upiPhone = event.upi_id === HALLOWEEN_PAYMENT_CONTACT.upiId ? HALLOWEEN_PAYMENT_CONTACT.phone : null
  return <div className="event-shell event-stack">
    <header><div className="section-label">Your private family booking</div><h1 className="section-title">{booking.payment_verified ? 'Your family ticket is ready' : booking.transaction_reference ? 'Your payment is pending verification' : 'You’re booked. Next, pay by UPI.'}</h1>
      <p className="event-muted">{event.name} · Booking <strong>{booking.booking_reference}</strong></p><EventDetails event={event} /></header>
    <BookingSteps step={booking.payment_verified ? 3 : 2} />
    {error && <p role="alert" className="event-notice event-error">{error}</p>}
    {notice && <p role="status" className="event-notice">{notice}</p>}
    <div className="event-card event-actions event-private-actions">
      <div><strong>Save your private link</strong><p className="event-muted">Use this link to return to payment or your ticket. Share it only with your family.</p></div>
      <button type="button" className="btn-ghost" onClick={() => void copy(`${window.location.origin}${HALLOWEEN_PATH}/booking#${token}`, 'Private booking link copied.')}>Copy booking link</button>
      <button type="button" className="btn-ghost" disabled={busy} onClick={() => void refresh()}>Refresh status</button>
    </div>
    {booking.payment_verified ? <>
      <div className="event-notice event-success"><strong>Payment verified · ₹{booking.amount_inr.toLocaleString('en-IN')}</strong><p>One QR code covers all {booking.adult_count} adults and {booking.child_count} children in this registration.</p></div>
      {tickets.length !== 1 && <p className="event-notice">Your family ticket is temporarily unavailable. Refresh the status or contact the organiser with your booking reference.</p>}
      <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>{tickets.map(ticket => <FamilyTicket key={ticket.ticket_identifier} ticket={ticket} bookingReference={booking.booking_reference} event={event} adults={booking.adult_count} childCount={booking.child_count} />)}</div>
      <p className="event-muted">Please arrive together. The organiser checks in the whole booking once. Download this QR before travelling; the entrance also accepts the ticket identifier.</p>
    </> : <div className="event-grid">
      <section className="event-card event-stack"><h2>{booking.transaction_reference ? 'Pending verification' : 'Pay directly by UPI'}</h2>
        {booking.transaction_reference ? <>
          <p className="event-notice"><strong>Reference received: {booking.transaction_reference}</strong><br />Submitting a reference does not confirm payment. The organiser will check the bank receipt before confirming your booking.</p>
          <p className="event-muted">Please do not pay again. Your family ticket will appear here after approval. Keep this page saved and refresh the status later.</p>
        </> : <>
          <p className="event-muted">Pay <strong>₹{booking.amount_inr.toLocaleString('en-IN')}</strong> to the recipient below using your UPI app.</p>
          <div className="event-price event-private"><p>Recipient: <strong>{event.payment_recipient_name || 'Not configured — contact the organiser'}</strong></p><p>UPI ID: <strong>{event.upi_id || 'Not configured'}</strong></p>{upiPhone && <p>UPI phone number: <strong>{upiPhone}</strong></p>}</div>
          <div className="event-actions">
            <button type="button" className="btn-ghost" disabled={!event.upi_id} onClick={() => void copy(event.upi_id || '', 'UPI ID copied.')}>Copy UPI ID</button>
            {upiPhone && <button type="button" className="btn-ghost" onClick={() => void copy(upiPhone, 'UPI phone number copied.')}>Copy UPI phone number</button>}
            <button type="button" className="btn-ghost" onClick={() => void copy(String(booking.amount_inr), 'Amount copied.')}>Copy amount</button>
          </div>
          {/* Organiser-supplied payment image. Do not send its URL through an optimisation proxy. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {qrImage && <img className="event-payment-qr" src={qrImage} referrerPolicy="no-referrer" alt="Organiser’s UPI payment QR code" width={280} height={280} />}
          <p className="event-muted">On the same phone, copy the UPI ID or save the payment QR and open it in your UPI app. Check the recipient name and exact amount before paying.</p>
          {qrImage && <a href={qrImage} target="_blank" rel="noopener noreferrer" className="event-link">Open payment QR to save</a>}
          <form className="event-form" onSubmit={submit}>
            <label>UPI transaction reference<input required minLength={6} maxLength={64} pattern="[A-Za-z0-9]{6,64}" autoComplete="off" autoCapitalize="characters" value={reference} onChange={e => setReference(e.target.value)} placeholder="From your UPI payment receipt" /></label>
            <p className="event-muted">After you pay, enter the transaction reference / UTR shown in your app. No payment screenshot is needed.</p>
            <button type="submit" className="btn-secondary" disabled={busy}>{busy ? 'Saving reference…' : 'Submit payment reference'}</button>
          </form>
        </>}
      </section>
      <aside className="event-card event-stack"><h2>Your family</h2><p className="event-muted">Primary contact: {booking.contact_name}</p><PriceBreakdown adults={booking.adult_count} childCount={booking.child_count} />
        <p className="event-muted">Your booking is confirmed only when payment is verified. If you need to correct a saved reference or change attendee counts, contact the organiser with your booking reference.</p></aside>
    </div>}
    <EventLinks />
  </div>
}
