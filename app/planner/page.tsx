import type { Metadata } from 'next'
import ReturningNriPlannerExperience from '../../components/ReturningNriPlannerExperience'

export const metadata: Metadata = {
  title: 'Returning NRI Planner | Move Back to India Checklist',
  description:
    'A simple planner for NRIs moving back to India. See where you stand, follow the key move-back timeline, and join a trusted Returning NRI community.',
  alternates: {
    canonical: 'https://www.returningnris.com/planner',
  },
  openGraph: {
    title: 'Returning NRI Planner | Move Back to India Checklist',
    description:
      'A simple planner for NRIs moving back to India. See where you stand, follow the key move-back timeline, and join a trusted Returning NRI community.',
    url: 'https://www.returningnris.com/planner',
    siteName: 'ReturningNRIs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning NRI Planner | Move Back to India Checklist',
    description:
      'A simple planner for NRIs moving back to India. See where you stand, follow the key move-back timeline, and join a trusted Returning NRI community.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

export default function PlannerPage() {
  return <ReturningNriPlannerExperience />
}
