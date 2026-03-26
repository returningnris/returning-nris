import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase-admin'
import { createRouteHandlerSupabaseClient } from '../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const source = typeof body.source === 'string' ? body.source : ''
    const readinessStatus = typeof body.readinessStatus === 'string' ? body.readinessStatus : ''
    const calendlyUrl = typeof body.calendlyUrl === 'string' ? body.calendlyUrl : ''
    const authHeader = request.headers.get('authorization') ?? ''
    let authUser:
      | {
          id: string
          email?: string
          user_metadata?: {
            first_name?: string
            last_name?: string
          }
        }
      | null = null

    if (authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.slice('Bearer '.length).trim()
      if (accessToken) {
        const supabase = createRouteHandlerSupabaseClient(accessToken)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        authUser = user
      }
    }

    const firstName =
      typeof body.firstName === 'string'
        ? body.firstName
        : typeof authUser?.user_metadata?.first_name === 'string'
          ? authUser.user_metadata.first_name
          : ''
    const lastName =
      typeof body.lastName === 'string'
        ? body.lastName
        : typeof authUser?.user_metadata?.last_name === 'string'
          ? authUser.user_metadata.last_name
          : ''
    const email =
      typeof body.email === 'string' && body.email
        ? body.email
        : typeof authUser?.email === 'string'
          ? authUser.email
          : ''

    if (!source) {
      return NextResponse.json({ success: false, error: 'Missing consultation request details' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { data, error } = await supabaseAdmin
      .from('consultation_requests')
      .insert({
        user_id: authUser?.id || null,
        email,
        first_name: firstName,
        last_name: lastName,
        source,
        readiness_status: readinessStatus,
        consultation_type: 'founder_intro',
        status: 'initiated',
        calendly_url: calendlyUrl,
        metadata_json: {
          source,
          readinessStatus,
        },
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to save consultation request:', error)
      return NextResponse.json({ success: false, error: 'Failed to save consultation request' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      requestId: data?.id || null,
    })
  } catch (error) {
    console.error('Consultation request API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
