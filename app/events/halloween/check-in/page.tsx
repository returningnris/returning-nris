import type { Metadata } from 'next'
import HalloweenOrganiser from '@/components/HalloweenOrganiser'

export const metadata: Metadata = { title: 'Organiser check-in | Returning NRIs',
  description: 'Organiser-only family ticket validation, group admission and manual WhatsApp confirmations.',
  robots: { index: false, follow: false }, referrer: 'no-referrer' }

export default function CheckinPage() { return <HalloweenOrganiser /> }
