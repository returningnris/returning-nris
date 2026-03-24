import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function createRouteHandlerSupabaseClient(accessToken?: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  })
}

export async function requireAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('authorization') ?? ''

  if (!authHeader.startsWith('Bearer ')) {
    return {
      errorResponse: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const accessToken = authHeader.slice('Bearer '.length).trim()
  const supabase = createRouteHandlerSupabaseClient(accessToken)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      errorResponse: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { accessToken, supabase, user }
}
