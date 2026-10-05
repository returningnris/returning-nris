import { timingSafeEqual } from 'node:crypto'
import { processHalloweenNotifications } from '@/lib/halloween-notifications'
import { privateJson } from '@/lib/halloween-server'

export const maxDuration = 60

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return privateJson({ error: 'Notification worker is not configured.' }, 503)
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(request.headers.get('authorization') || '')
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return privateJson({ error: 'Unauthorized' }, 401)
  }
  try { return privateJson(await processHalloweenNotifications()) }
  catch { return privateJson({ error: 'Notification worker could not finish. Please inspect the outbox.' }, 503) }
}
