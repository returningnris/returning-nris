import type { Metadata } from 'next'
import HalloweenBooking from '@/components/HalloweenBooking'

export const metadata: Metadata = {
  title: 'Your family booking | Returning NRIs', description: 'Resume your private Halloween booking, submit your UPI transaction reference and view your single family QR ticket.',
  robots: { index: false, follow: false }, referrer: 'no-referrer',
}

export default function BookingPage() { return <HalloweenBooking /> }
