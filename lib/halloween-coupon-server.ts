import 'server-only'
import { halloweenCoupon, halloweenPrice } from './halloween'

export function halloweenCouponPrice(adults: number, children: number, value: unknown) {
  const code = halloweenCoupon(value)
  if (code && code !== 'QUANTIUM50') throw new Error('Coupon code not recognised. Check the code or leave it blank.')
  return halloweenPrice(adults, children, Boolean(code))
}
