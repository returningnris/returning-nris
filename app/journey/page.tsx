import type { Metadata } from 'next'
import JourneyChecklistExperience from '../../components/JourneyChecklistExperience'

export const metadata: Metadata = {
  title: 'Back2India Journey | Move-Back Checklist for NRIs',
  description:
    'A practical move-back checklist for NRIs returning to India, from decision stage to the first year back, with trackable progress for signed-in users.',
  alternates: {
    canonical: 'https://www.returningnris.com/journey',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Back2India Journey | Move-Back Checklist for NRIs',
    description:
      'A practical move-back checklist for NRIs returning to India, from decision stage to the first year back, with trackable progress for signed-in users.',
    url: 'https://www.returningnris.com/journey',
    type: 'website',
  },
}

export default function JourneyPage() {
  return <JourneyChecklistExperience />
}
