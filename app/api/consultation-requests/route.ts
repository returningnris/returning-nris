import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase-admin'
import { createRouteHandlerSupabaseClient } from '../../../lib/supabase-server'

type JsonObject = Record<string, unknown>

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function getRecord(value: unknown): JsonObject | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : null
}

function getNestedString(value: unknown, path: string[]) {
  let current: unknown = value

  for (const segment of path) {
    const record = getRecord(current)
    if (!record) return ''
    current = record[segment]
  }

  return getString(current)
}

function splitName(name: string) {
  const trimmedName = name.trim()
  if (!trimmedName) {
    return { firstName: '', lastName: '' }
  }

  const [firstName, ...rest] = trimmedName.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' '),
  }
}

async function fetchCalendlyInviteeDetails(inviteeUri: string) {
  const accessToken = process.env.CALENDLY_PERSONAL_ACCESS_TOKEN?.trim() || ''

  if (!accessToken || !inviteeUri) {
    return null
  }

  try {
    const response = await fetch(inviteeUri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Failed to fetch Calendly invitee details:', response.status, response.statusText)
      return null
    }

    const data = (await response.json()) as { resource?: JsonObject }
    const resource = getRecord(data.resource) || getRecord(data)
    if (!resource) return null

    return {
      email: getString(resource.email),
      name: getString(resource.name),
      firstName: getString(resource.first_name),
      lastName: getString(resource.last_name),
      status: getString(resource.status),
      cancelUrl: getString(resource.cancel_url),
      rescheduleUrl: getString(resource.reschedule_url),
    }
  } catch (error) {
    console.error('Calendly invitee lookup failed:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const mode = body.mode === 'scheduled' ? 'scheduled' : 'initiated'
    const source = getString(body.source)
    const readinessStatus = getString(body.readinessStatus)
    const calendlyUrl = getString(body.calendlyUrl)
    const calendlyEvent = getString(body.calendlyEvent)
    const calendlyPayload = getRecord(body.payload) || {}
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

    if (!source) {
      return NextResponse.json({ success: false, error: 'Missing consultation request details' }, { status: 400 })
    }

    const payloadEmail =
      getNestedString(calendlyPayload, ['invitee', 'email']) ||
      getNestedString(calendlyPayload, ['email']) ||
      getNestedString(calendlyPayload, ['resource', 'email'])
    const payloadName =
      getNestedString(calendlyPayload, ['invitee', 'name']) ||
      getNestedString(calendlyPayload, ['name']) ||
      getNestedString(calendlyPayload, ['resource', 'name'])
    const payloadFirstName =
      getNestedString(calendlyPayload, ['invitee', 'first_name']) ||
      getNestedString(calendlyPayload, ['first_name']) ||
      getNestedString(calendlyPayload, ['resource', 'first_name'])
    const payloadLastName =
      getNestedString(calendlyPayload, ['invitee', 'last_name']) ||
      getNestedString(calendlyPayload, ['last_name']) ||
      getNestedString(calendlyPayload, ['resource', 'last_name'])
    const inviteeUri =
      getNestedString(calendlyPayload, ['invitee', 'uri']) ||
      getNestedString(calendlyPayload, ['invitee_uri']) ||
      getNestedString(calendlyPayload, ['uri'])
    const eventUri =
      getNestedString(calendlyPayload, ['event', 'uri']) ||
      getNestedString(calendlyPayload, ['event_uri']) ||
      getNestedString(calendlyPayload, ['scheduled_event', 'uri'])
    const scheduledAt =
      getNestedString(calendlyPayload, ['event', 'start_time']) ||
      getNestedString(calendlyPayload, ['scheduled_event', 'start_time']) ||
      getNestedString(calendlyPayload, ['start_time'])

    const inviteeDetails = mode === 'scheduled' ? await fetchCalendlyInviteeDetails(inviteeUri) : null
    const splitPayloadName = splitName(payloadName)
    const splitInviteeName = splitName(inviteeDetails?.name || '')

    const firstName =
      getString(body.firstName) ||
      inviteeDetails?.firstName ||
      payloadFirstName ||
      splitInviteeName.firstName ||
      splitPayloadName.firstName ||
      (typeof authUser?.user_metadata?.first_name === 'string' ? authUser.user_metadata.first_name : '')
    const lastName =
      getString(body.lastName) ||
      inviteeDetails?.lastName ||
      payloadLastName ||
      splitInviteeName.lastName ||
      splitPayloadName.lastName ||
      (typeof authUser?.user_metadata?.last_name === 'string' ? authUser.user_metadata.last_name : '')
    const email =
      getString(body.email) ||
      inviteeDetails?.email ||
      payloadEmail ||
      (typeof authUser?.email === 'string' ? authUser.email : '')

    if (mode === 'initiated' && !email) {
      return NextResponse.json({
        success: true,
        skipped: true,
      })
    }

    if (mode === 'scheduled' && !email) {
      return NextResponse.json({ success: false, error: 'Calendly did not provide invitee email details' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const metadataJson = {
      source,
      readinessStatus,
      calendlyEvent,
      calendlyUrl,
      calendlyInviteeUri: inviteeUri,
      calendlyEventUri: eventUri,
      scheduledAt,
      calendlyPayload,
      calendlyInviteeLookup: inviteeDetails,
    }

    if (mode === 'scheduled') {
      let existingRequestQuery = supabaseAdmin
        .from('consultation_requests')
        .select('id')
        .eq('consultation_type', 'founder_intro')
        .eq('source', source)
        .order('created_at', { ascending: false })
        .limit(1)

      if (authUser?.id) {
        existingRequestQuery = existingRequestQuery.eq('user_id', authUser.id)
      } else {
        existingRequestQuery = existingRequestQuery.eq('email', email)
      }

      const { data: latestRequest, error: latestRequestError } = await existingRequestQuery.maybeSingle()

      if (latestRequestError) {
        console.error('Failed to load existing consultation request:', latestRequestError)
        return NextResponse.json({ success: false, error: 'Failed to load consultation request' }, { status: 500 })
      }

      const scheduledPayload = {
        user_id: authUser?.id || null,
        email,
        first_name: firstName,
        last_name: lastName,
        source,
        readiness_status: readinessStatus,
        consultation_type: 'founder_intro',
        status: 'scheduled',
        calendly_url: calendlyUrl,
        metadata_json: metadataJson,
      }

      if (latestRequest?.id) {
        const { data, error } = await supabaseAdmin
          .from('consultation_requests')
          .update(scheduledPayload)
          .eq('id', latestRequest.id)
          .select('id')
          .single()

        if (error) {
          console.error('Failed to update scheduled consultation request:', error)
          return NextResponse.json({ success: false, error: 'Failed to update consultation request' }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          requestId: data?.id || null,
          mode,
        })
      }

      const { data, error } = await supabaseAdmin
        .from('consultation_requests')
        .insert(scheduledPayload)
        .select('id')
        .single()

      if (error) {
        console.error('Failed to save scheduled consultation request:', error)
        return NextResponse.json({ success: false, error: 'Failed to save consultation request' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        requestId: data?.id || null,
        mode,
      })
    }

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
        metadata_json: metadataJson,
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
      mode,
    })
  } catch (error) {
    console.error('Consultation request API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
