import 'server-only'
import { halloweenCoupon, halloweenPrice } from './halloween'

const offers: Record<string, { discountPerTicket: number; bookingLimit: number | null; label: string }> = {
  SPOOKYVIP2026: { discountPerTicket: 500, bookingLimit: 20, label: 'Special guest invitation' },
  QUANTIUM250: { discountPerTicket: 250, bookingLimit: 30, label: 'The Quantium School family discount' },
  AIRADENTAL250: { discountPerTicket: 250, bookingLimit: 10, label: 'Aira Dental sponsor discount' },
  DRIPBAR250: { discountPerTicket: 250, bookingLimit: 10, label: 'Drip Bar sponsor discount' },
}

export function halloweenCouponOffer(value: unknown) {
  const code = halloweenCoupon(value)
  if (!code) return null
  if (!Object.hasOwn(offers, code)) throw new Error('Coupon code not recognised. Check the code or leave it blank.')
  return { code, ...offers[code] }
}

export function halloweenCouponPrice(adults: number, children: number, value: unknown) {
  const offer = halloweenCouponOffer(value)
  return halloweenPrice(adults, children, offer?.discountPerTicket ?? 0)
}

export function halloweenCouponLimitMessage(value: unknown) {
  const offer = halloweenCouponOffer(value)
  return `Coupon limit exceeded. This code is limited to ${offer?.bookingLimit ?? 0} bookings.`
}
