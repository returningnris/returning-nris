export const COMMUNITY_RETURN_YEARS = [
  '2025',
  '2026',
  '2027',
  '2028',
  'Not sure yet',
  'Already moved',
] as const

export const COMMUNITY_HELP_TOPICS = [
  'Schools',
  'Housing / Rentals',
  'RNOR / Tax Planning',
  'Financial Planning',
  'Money Transfer / Banking',
  'Insurance',
  'Moving Logistics',
  'First 90 Days in India',
  'Other',
] as const

export type CommunityReturnYear = (typeof COMMUNITY_RETURN_YEARS)[number]
export type CommunityHelpTopic = (typeof COMMUNITY_HELP_TOPICS)[number]

export type CommunityJoinPayload = {
  fullName: string
  currentLocation: string
  returningCity: string
  returningYear: CommunityReturnYear
  mobileNumber: string
  consent: boolean
  helpTopics: CommunityHelpTopic[]
}

export function isCommunityReturnYear(value: string): value is CommunityReturnYear {
  return (COMMUNITY_RETURN_YEARS as readonly string[]).includes(value)
}

export function isCommunityHelpTopic(value: string): value is CommunityHelpTopic {
  return (COMMUNITY_HELP_TOPICS as readonly string[]).includes(value)
}

export function hasValidWhatsAppNumber(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue.startsWith('+')) {
    return false
  }

  const digitsOnly = trimmedValue.replace(/\D/g, '')
  return digitsOnly.length >= 8 && digitsOnly.length <= 15
}
