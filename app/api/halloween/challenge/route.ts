import { createBotChallenge, halloweenFailure, halloweenRateLimit, privateJson } from '@/lib/halloween-server'

export async function GET(request: Request) {
  try {
    await halloweenRateLimit(request, 'challenge', 30)
    return privateJson({ challenge: createBotChallenge(request) })
  } catch (error) { return halloweenFailure(error) }
}
