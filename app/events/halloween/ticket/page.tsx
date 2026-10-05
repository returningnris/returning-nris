import type { Metadata } from 'next'
import HalloweenOrganiser from '@/components/HalloweenOrganiser'

export const metadata: Metadata = { title: 'Family ticket | Returning NRIs',
  description: 'One Halloween QR ticket for your entire family booking. Show it to an authorised organiser at the entrance.',
  robots: { index: false, follow: false }, referrer: 'no-referrer' }

export default function TicketPage() { return <HalloweenOrganiser ticketPage /> }
