import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase-admin'
import {
  hasValidWhatsAppNumber,
  isCommunityHelpTopic,
  isCommunityReturnYear,
} from '../../../lib/community-join'

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function getBoolean(value: unknown) {
  return value === true
}

function getStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const fullName = getString(body.fullName)
    const currentLocation = getString(body.currentLocation)
    const returningCity = getString(body.returningCity)
    const returningYear = getString(body.returningYear)
    const mobileNumber = getString(body.mobileNumber)
    const consent = getBoolean(body.consent)
    const submittedTopics = getStringArray(body.helpTopics)
    const helpTopics = submittedTopics
      .map((topic) => topic.trim())
      .filter((topic): topic is (typeof submittedTopics)[number] => Boolean(topic))
      .filter(isCommunityHelpTopic)

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 })
    }

    if (!currentLocation) {
      return NextResponse.json({ success: false, error: 'Current city and country are required.' }, { status: 400 })
    }

    if (!returningCity) {
      return NextResponse.json({ success: false, error: 'Returning Indian city is required.' }, { status: 400 })
    }

    if (!isCommunityReturnYear(returningYear)) {
      return NextResponse.json({ success: false, error: 'Please select a valid returning year.' }, { status: 400 })
    }

    if (!hasValidWhatsAppNumber(mobileNumber)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid WhatsApp number with country code.' }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ success: false, error: 'Consent is required before submitting.' }, { status: 400 })
    }

    if (helpTopics.length !== submittedTopics.length) {
      return NextResponse.json({ success: false, error: 'One or more selected help topics are invalid.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    const { data, error } = await supabaseAdmin
      .from('community_join_requests')
      .insert({
        full_name: fullName,
        current_city_country: currentLocation,
        returning_city: returningCity,
        returning_year: returningYear,
        mobile_number: mobileNumber,
        consent,
        help_topics_json: helpTopics,
        status: 'pending_review',
        metadata_json: {
          source: 'community_page',
          referer,
          userAgent,
        },
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to save community join request:', error)
      return NextResponse.json({ success: false, error: 'Failed to save your request right now.' }, { status: 500 })
    }

    // TODO: Trigger invite delivery, online session routing, or CRM sync after review workflow is finalized.
    return NextResponse.json({ success: true, requestId: data?.id || null })
  } catch (error) {
    console.error('Community join API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
