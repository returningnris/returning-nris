'use client'

import { usePathname } from 'next/navigation'
import PlanningCall from './PlanningCall'

const DESCRIPTIONS: Record<string, string> = {
  '/planner': 'Have your first plan? Talk through your priorities, timing, and unanswered questions with Swathi and Bharath before taking the next step.',
  '/journey': 'Turn your checklist into a plan for your family. Talk through what to tackle first and the practical details that are easy to miss.',
  '/schools': 'Working through schools and the move? Discuss school choices, neighbourhoods, timelines, and helping your children settle in.',
  '/housing': 'Unsure where to settle? Talk through neighbourhoods, renting first, and how housing fits your family’s schools and day-to-day life.',
  '/rnor': 'Bring your return timeline and money questions. Discuss practical planning considerations and the questions to take to a qualified tax adviser.',
  '/resources': 'Make these guides work for your family. Discuss your priorities and questions about finances, schools, housing, and settling in.',
  '/our-story': 'Planning a similar move? Talk with Swathi and Bharath about your family’s questions and learn from their experience of returning to India.',
}

export default function ContextualPlanningCall() {
  const pathname = usePathname()
  const route = Object.keys(DESCRIPTIONS).find((path) => pathname === path || pathname.startsWith(`${path}/`))
  return route ? <PlanningCall description={DESCRIPTIONS[route]} /> : null
}
