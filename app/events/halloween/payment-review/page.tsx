import type { Metadata } from 'next'
import HalloweenPaymentReview from '@/components/HalloweenPaymentReview'

export const metadata: Metadata = {
  title: 'Review Halloween payment | Returning NRIs',
  description: 'Private organiser review of submitted Halloween payment references.',
  robots: { index: false, follow: false }, referrer: 'no-referrer',
}

export default function PaymentReviewPage() { return <HalloweenPaymentReview /> }
