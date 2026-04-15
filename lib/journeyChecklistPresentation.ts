import { JOURNEY_CHECKLIST, type JourneyChecklistSection } from './moveBackContent'

export type JourneyBucketId = 'mustDo' | 'ifRelevant' | 'niceToDo'

export const JOURNEY_BUCKETS: Array<{
  id: JourneyBucketId
  label: string
  eyebrow: string
  description: string
}> = [
  {
    id: 'mustDo',
    label: 'Must do',
    eyebrow: 'Core actions',
    description: 'The essentials that usually deserve attention first.',
  },
  {
    id: 'ifRelevant',
    label: 'If relevant',
    eyebrow: 'Situation-specific',
    description: 'Only the extra items that clearly fit your setup.',
  },
  {
    id: 'niceToDo',
    label: 'Nice to do',
    eyebrow: 'Helpful extras',
    description: 'Lightweight tasks that make the move smoother.',
  },
]

const WEBSITE_BUCKET_LIMITS: Record<JourneyBucketId, number> = {
  mustDo: 3,
  ifRelevant: 2,
  niceToDo: 1,
}

export function getJourneyChecklistItemId(sectionId: string, bucketId: JourneyBucketId, itemIndex: number) {
  return `${sectionId}:${bucketId}:${itemIndex}`
}

export function getBucketItems(section: JourneyChecklistSection, bucketId: JourneyBucketId) {
  if (bucketId === 'mustDo') return section.mustDo
  if (bucketId === 'ifRelevant') return section.ifRelevant
  return section.niceToDo
}

export function getImportantBucketItems(section: JourneyChecklistSection, bucketId: JourneyBucketId) {
  return getBucketItems(section, bucketId).slice(0, WEBSITE_BUCKET_LIMITS[bucketId])
}

export function getImportantTimelineSections() {
  return JOURNEY_CHECKLIST.map((section, index) => {
    const buckets = JOURNEY_BUCKETS.map((bucket) => ({
      ...bucket,
      items: getImportantBucketItems(section, bucket.id),
    })).filter((bucket) => bucket.items.length > 0)

    return {
      ...section,
      index,
      buckets,
      total: buckets.reduce((sum, bucket) => sum + bucket.items.length, 0),
    }
  })
}
