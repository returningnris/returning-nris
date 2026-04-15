import type { Metadata } from 'next'
import JourneyChecklistExperience from '../../components/JourneyChecklistExperience'

export const metadata: Metadata = {
  title: 'Back2India Journey | Move-Back Checklist for NRIs',
  description:
    'A practical move-back checklist for NRIs returning to India, from decision stage to the first year back. Filter by kids, USA move, renting first, investments, and more.',
  alternates: {
    canonical: 'https://www.returningnris.com/journey',
  },
  openGraph: {
    title: 'Back2India Journey | Move-Back Checklist for NRIs',
    description:
      'A practical move-back checklist for NRIs returning to India, from decision stage to the first year back. Filter by kids, USA move, renting first, investments, and more.',
    url: 'https://www.returningnris.com/journey',
  },
}

export default function JourneyPage() {
  return <JourneyChecklistExperience />
}
