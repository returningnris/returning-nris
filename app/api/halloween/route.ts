import { halloweenCouponPrice } from '@/lib/halloween-coupon-server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { HALLOWEEN_EVENT_ID, HALLOWEEN_PATH, confirmationText, isPrivateToken, validateHalloweenRegistration } from '@/lib/halloween'
import { canonicalHalloweenOrigin, getHalloweenEvent, getPrivateHalloweenBooking, HalloweenError,
  halloweenFailure, halloweenRateLimit, privateJson, readHalloweenBody, requireHalloweenOrganiser, verifyBotChallenge } from '@/lib/halloween-server'

export async function POST(request: Request) {
  try {
    const body = await readHalloweenBody(request)
    const db = getSupabaseAdmin()
    if (body.action === 'payment-review' || body.action === 'approve-payment') {
      await halloweenRateLimit(request, 'payment-review', 30, 900)
      if (!isPrivateToken(body.token)) throw new HalloweenError('Invalid review link.', 404)
      if (body.action === 'approve-payment') {
        if (body.confirmReceived !== true || typeof body.reference !== 'string' || !Number.isInteger(body.amount)) {
          throw new HalloweenError('Confirm the bank receipt before approving payment.')
        }
        const { error } = await db.rpc('halloween_approve_payment', {
          p_review_token: body.token, p_reference: body.reference, p_amount: body.amount,
        })
        if (error) {
          if (error.message.includes('reused')) throw new HalloweenError('This reference is used on another booking. Review it in Supabase before approving.', 409)
          if (error.message.includes('expired')) throw new HalloweenError('This review link has expired or was already used. Review the booking in Supabase.', 410)
          if (error.message.includes('changed')) throw new HalloweenError('Payment details changed. Reload and review them again.', 409)
          throw new HalloweenError('Could not approve payment. Check the link and try again.', 400)
        }
      }
      const { data: booking, error } = await db.from('halloween_bookings')
        .select('id,booking_reference,contact_name,email,whatsapp_number,adult_count,child_count,amount_inr,transaction_reference,payment_verified,payment_submitted_at,payment_review_used_at')
        .eq('event_id', HALLOWEEN_EVENT_ID).eq('payment_review_token', body.token).maybeSingle()
      if (error) throw new HalloweenError('Review is temporarily unavailable.', 503)
      if (!booking?.transaction_reference) throw new HalloweenError('Invalid review link.', 404)
      if (!booking.payment_verified && (booking.payment_review_used_at || Date.now() - new Date(booking.payment_submitted_at).getTime() > 7 * 86400000)) {
        throw new HalloweenError('Review link expired. Review this booking in Supabase.', 410)
      }
      const { count, error: referenceError } = await db.from('halloween_bookings').select('id', { count: 'exact', head: true })
        .eq('event_id', HALLOWEEN_EVENT_ID).eq('transaction_reference', booking.transaction_reference)
      if (referenceError) throw new HalloweenError('Reference review is temporarily unavailable.', 503)
      const { id, payment_review_used_at, ...details } = booking
      void id; void payment_review_used_at
      return privateJson({ booking: details, reference_reused: (count || 0) > 1 })
    }
    if (body.action === 'coupon') {
      await halloweenRateLimit(request, 'coupon', 15, 900)
      try {
        const price = halloweenCouponPrice(1, 1, body.couponCode)
        return privateJson({ applied: price.discount > 0 })
      } catch (error) {
        return privateJson({ error: error instanceof Error ? error.message : 'Check your coupon code.', code: 'INVALID_COUPON' }, 400)
      }
    }
    if (body.action === 'register') {
      await halloweenRateLimit(request, 'register', 10, 900)
      verifyBotChallenge(request, body.challenge, body.website)
      let input
      try { input = validateHalloweenRegistration(body) }
      catch (error) { throw new HalloweenError(error instanceof Error ? error.message : 'Check your booking details.') }
      try { input.price = halloweenCouponPrice(input.adults, input.children, input.couponCode) }
      catch (error) { return privateJson({ error: error instanceof Error ? error.message : 'Check your coupon code.', code: 'INVALID_COUPON' }, 400) }
      const event = await getHalloweenEvent()
      if (!event.registration_open) throw new HalloweenError('Registration is not open yet.', 409)
      const { data, error } = await db.rpc('halloween_register', {
        p_idempotency_key: input.key, p_contact_name: input.contactName, p_email: input.email,
        p_whatsapp_number: input.whatsapp, p_adult_count: input.adults, p_child_count: input.children, p_coupon_code: input.couponCode,
      })
      if (error) {
        if (error.message.includes('Registration is not open')) throw new HalloweenError('Registration is not open yet.', 409)
        if (error.message.includes('Idempotency key')) throw new HalloweenError('This booking attempt already exists with different details. Resume it or start a new booking.', 409)
        throw new HalloweenError('We could not save your booking. Please retry using the same form.', 503)
      }
      const booking = Array.isArray(data) ? data[0] : data
      if (!booking || booking.amount_inr !== input.price.total || !isPrivateToken(booking.private_access_token)) {
        throw new HalloweenError('We could not verify your booking. Please contact the organiser.', 503)
      }
      return privateJson({ token: booking.private_access_token }, 201)
    }
    if (body.action === 'booking') {
      await halloweenRateLimit(request, 'booking')
      return privateJson(await getPrivateHalloweenBooking(body.token))
    }
    if (body.action === 'payment') {
      await halloweenRateLimit(request, 'payment', 15, 900)
      if (!isPrivateToken(body.token)) throw new HalloweenError('Invalid private booking link.', 404)
      const reference = typeof body.reference === 'string' ? body.reference.trim().toUpperCase() : ''
      if (!/^[A-Z0-9]{6,64}$/.test(reference)) throw new HalloweenError('Enter the transaction reference from your UPI app (6–64 letters or digits).')
      const { error } = await db.rpc('halloween_submit_payment', { p_private_token: body.token, p_reference: reference })
      if (error) {
        if (error.message.includes('Invalid private')) throw new HalloweenError('Invalid private booking link.', 404)
        if (error.message.includes('already')) throw new HalloweenError('A payment reference is already saved. Contact the organiser if it needs correcting.', 409)
        throw new HalloweenError('Could not save the payment reference. Please retry.', 503)
      }
      return privateJson(await getPrivateHalloweenBooking(body.token))
    }
    if (body.action === 'organiser' || body.action === 'checkin' || body.action === 'confirmation') {
      const user = await requireHalloweenOrganiser(request)
      await halloweenRateLimit(request, 'organiser', 120)
      if (body.action === 'organiser') return privateJson({ organiser: true })
      if (body.action === 'checkin') {
        if (typeof body.ticket !== 'string' || (!isPrivateToken(body.ticket) && !/^HW26-T-\d{8}$/i.test(body.ticket))) {
          return privateJson({ status: 'Invalid ticket' })
        }
        if (typeof body.admit !== 'boolean') throw new HalloweenError('Choose lookup or admission.')
        const { data, error } = await db.rpc('halloween_check_ticket', {
          p_organiser_id: user.id, p_ticket: body.ticket, p_admit: body.admit,
        })
        if (error) throw new HalloweenError('Check-in could not be completed. Please look up the ticket again.', 503)
        return privateJson(data)
      }
      const reference = typeof body.reference === 'string' ? body.reference.trim().toUpperCase() : ''
      if (!/^HW26-\d{8}$/.test(reference)) throw new HalloweenError('Enter a booking reference such as HW26-00000001.')
      const { data: booking, error } = await db.from('halloween_bookings')
        .select('id,booking_reference,contact_name,adult_count,child_count,amount_inr,payment_verified,transaction_reference,private_access_token,whatsapp_number')
        .eq('event_id', HALLOWEEN_EVENT_ID).eq('booking_reference', reference).maybeSingle()
      if (error) throw new HalloweenError('Booking lookup is temporarily unavailable.', 503)
      if (!booking) throw new HalloweenError('Booking not found.', 404)
      const { data: notification, error: notificationError } = await db.from('halloween_notification_outbox')
        .select('status,attempts,last_error').eq('booking_id', booking.id).eq('kind', 'booking_confirmation').maybeSingle()
      if (notificationError) throw new HalloweenError('Notification status is temporarily unavailable.', 503)
      let reused = false
      if (booking.transaction_reference) {
        const { count, error: countError } = await db.from('halloween_bookings').select('id', { count: 'exact', head: true })
          .eq('event_id', HALLOWEEN_EVENT_ID).eq('transaction_reference', booking.transaction_reference)
        if (countError) throw new HalloweenError('Payment reference review is temporarily unavailable.', 503)
        reused = (count || 0) > 1
      }
      let whatsappUrl: string | null = null
      if (booking.payment_verified) {
        const event = await getHalloweenEvent()
        const link = `${canonicalHalloweenOrigin(request)}${HALLOWEEN_PATH}/booking#${booking.private_access_token}`
        const text = confirmationText(booking, event, link)
        whatsappUrl = `https://wa.me/${booking.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
      }
      return privateJson({ booking: { booking_reference: booking.booking_reference, contact_name: booking.contact_name,
        adult_count: booking.adult_count, child_count: booking.child_count, amount_inr: booking.amount_inr,
        payment_verified: booking.payment_verified }, notification, reference_reused: reused, whatsapp_url: whatsappUrl })
    }
    throw new HalloweenError('Unknown request.')
  } catch (error) { return halloweenFailure(error) }
}
