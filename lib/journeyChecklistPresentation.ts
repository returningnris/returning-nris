import { JOURNEY_CHECKLIST, type JourneyChecklistItem, type JourneyChecklistSection } from './moveBackContent'

export type JourneyBucketId = 'mustDo' | 'ifRelevant'

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
]

const WEBSITE_BUCKET_LIMITS: Record<JourneyBucketId, number> = {
  mustDo: 2,
  ifRelevant: 1,
}

const MERGED_TIMELINES: Array<{
  id: string
  title: string
  sourceIds: string[]
}> = [
  {
    id: '6-12-months',
    title: '6-12 Months Before Move',
    sourceIds: ['12-6-months', '6-3-months'],
  },
  {
    id: '90-30-days',
    title: '90-30 Days Before Move',
    sourceIds: ['90-days', '30-days'],
  },
  {
    id: 'landing-week',
    title: 'Landing Week',
    sourceIds: ['landing-week'],
  },
  {
    id: 'first-90-days',
    title: 'First 90 Days',
    sourceIds: ['first-30-days', 'first-90-days'],
  },
  {
    id: 'first-year',
    title: 'First Year',
    sourceIds: ['first-year'],
  },
]

export function getJourneyChecklistItemId(sectionId: string, bucketId: JourneyBucketId, itemIndex: number) {
  return `${sectionId}:${bucketId}:${itemIndex}`
}

export function getBucketItems(section: JourneyChecklistSection, bucketId: JourneyBucketId) {
  if (bucketId === 'mustDo') return section.mustDo
  return section.ifRelevant
}

function mergeItems(sections: JourneyChecklistSection[], bucketId: JourneyBucketId) {
  const seen = new Set<string>()
  const items: JourneyChecklistItem[] = []

  sections.forEach((section) => {
    getBucketItems(section, bucketId).forEach((item) => {
      const key = `${item.text}|${(item.filters || []).join(',')}`
      if (seen.has(key)) return
      seen.add(key)
      items.push(item)
    })
  })

  return items
}

export function getImportantBucketItems(items: JourneyChecklistItem[], bucketId: JourneyBucketId) {
  return items.slice(0, WEBSITE_BUCKET_LIMITS[bucketId])
}

export function getImportantTimelineSections() {
  const sectionById = new Map(JOURNEY_CHECKLIST.map((section) => [section.id, section]))

  return MERGED_TIMELINES.map((timeline, index) => {
    const sourceSections = timeline.sourceIds
      .map((sourceId) => sectionById.get(sourceId))
      .filter((section): section is JourneyChecklistSection => Boolean(section))

    const buckets = JOURNEY_BUCKETS.map((bucket) => ({
      ...bucket,
      items: getImportantBucketItems(mergeItems(sourceSections, bucket.id), bucket.id),
    })).filter((bucket) => bucket.items.length > 0)

    return {
      id: timeline.id,
      title: timeline.title,
      index,
      buckets,
      total: buckets.reduce((sum, bucket) => sum + bucket.items.length, 0),
    }
  })
}
