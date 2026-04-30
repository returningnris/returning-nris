import { permanentRedirect } from 'next/navigation'

export default function JourneyPage() {
  permanentRedirect('/planner#timeline')
}
