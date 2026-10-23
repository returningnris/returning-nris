
'use client'

import { useEffect, useState } from 'react'
import { halloweenRequest } from '@/lib/halloween-client'
import { isPrivateToken } from '@/lib/halloween'

type Review = { booking: { booking_reference: string; contact_name: string; email: string; whatsapp_number: string;
  coupon_code: string; adult_count: number; child_count: number; amount_inr: number; transaction_reference: string; payment_verified: boolean }; reference_reused: boolean }

export default function HalloweenPaymentReview() {
  const [review, setReview] = useState<Review | null>(null)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [checked, setChecked] = useState(false)
  useEffect(() => {
    let active = true
    const value = window.location.hash.slice(1)
    if (!isPrivateToken(value)) { setError('Open the private review link from your organiser email.'); return }
    setToken(value)
    halloweenRequest<Review>({ action: 'payment-review', token: value })
      .then(data => { if (active) setReview(data) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load payment details.') })
    return () => { active = false }
  }, [])
  async function approve() {
    if (!review || busy || !checked || review.reference_reused) return
    setBusy(true); setError('')
    try {
      setReview(await halloweenRequest<Review>({ action: 'approve-payment', token, confirmReceived: true,
        reference: review.booking.transaction_reference, amount: review.booking.amount_inr }))
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not approve payment. Please retry.') }
    finally { setBusy(false) }
  }
  const booking = review?.booking
  return <div className="event-shell event-stack"><h1 className="section-title">Review Halloween payment</h1>
    <p className="event-muted">Private organiser review. Check your bank receipt before approving.</p>
    {error && <p role="alert" className="event-notice event-error">{error}</p>}
    {!review && !error && <p>Loading payment details…</p>}
    {booking && <section className="event-card event-stack"><h2>{booking.booking_reference}</h2>
      <p><strong>{booking.contact_name}</strong><br />{booking.email}<br />WhatsApp: {booking.whatsapp_number}</p>
      <p>Coupon: <strong>{booking.coupon_code || 'None'}</strong></p>
      <p>{booking.adult_count} adults · {booking.child_count} children</p>
      <p>Amount to verify: <strong>₹{booking.amount_inr.toLocaleString('en-IN')}</strong><br />UPI reference: <strong>{booking.transaction_reference}</strong></p>
      {booking.payment_verified ? <p role="status" className="event-notice event-success">Payment verified. The family confirmation email is handled by the existing scheduled email flow. Repeated approval does not create another ticket or email.</p> : <>
        {review.reference_reused && <p role="alert" className="event-notice event-error">This reference is used on another booking. Approval is blocked. Review the bookings in Supabase.</p>}
        <label><input type="checkbox" checked={checked} disabled={busy} onChange={e => setChecked(e.target.checked)} /> I checked the bank account and received the exact amount against this transaction reference.</label>
        <button type="button" className="btn-secondary" disabled={!checked || busy || review.reference_reused} onClick={() => void approve()}>{busy ? 'Confirming…' : 'Confirm payment received'}</button>
      </>}
    </section>}
  </div>
}
