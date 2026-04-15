import type { Metadata } from 'next'
import PlannerPersonaExperience from '../../components/PlannerPersonaExperience'

export const metadata: Metadata = {
  title: 'Readiness for NRIs Returning to India | Persona Guide and Next Steps',
  description:
    'Start with the readiness persona closest to your situation. See what to watch, the liquid buffer many families need, and the next steps before moving back to India.',
  alternates: {
    canonical: 'https://www.returningnris.com/planner',
  },
  openGraph: {
    title: 'Readiness for NRIs Returning to India | Persona Guide and Next Steps',
    description:
      'Start with the readiness persona closest to your situation. See what to watch, the liquid buffer many families need, and the next steps before moving back to India.',
    url: 'https://www.returningnris.com/planner',
  },
}

export default function PlannerPage() {
  return <PlannerPersonaExperience />
}
