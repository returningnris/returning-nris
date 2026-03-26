import { NextResponse } from 'next/server'
import { requireAuthenticatedUser } from '../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request)

    if ('errorResponse' in auth) {
      return auth.errorResponse
    }

    const body = await request.json()
    const source = typeof body.source === 'string' ? body.source : ''
    const readinessStatus = typeof body.readinessStatus === 'string' ? body.readinessStatus : ''
    const calendlyUrl = typeof body.calendlyUrl === 'string' ? body.calendlyUrl : ''
    const firstName =
      typeof body.firstName === 'string'
        ? body.firstName
        : typeof auth.user.user_metadata?.first_name === 'string'
          ? auth.user.user_metadata.first_name
          : ''
    const lastName =
      typeof body.lastName === 'string'
        ? body.lastName
        : typeof auth.user.user_metadata?.last_name === 'string'
          ? auth.user.user_metadata.last_name
          : ''
    const email = typeof body.email === 'string' && body.email ? body.email : auth.user.email || ''

    if (!email || !source) {
      return NextResponse.json({ success: false, error: 'Missing consultation request details' }, { status: 400 })
    }

    const { data, error } = await auth.supabase
      .from('consultation_requests')
      .insert({
        user_id: auth.user.id,
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
