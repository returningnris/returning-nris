import { NextResponse } from 'next/server'
import { requireAuthenticatedUser } from '../../../lib/supabase-server'

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request)

    if ('errorResponse' in auth) {
      return auth.errorResponse
    }

    const body = await request.json()
    const answers = body.answers || {}
    const result = body.result || {}
    const userDetails = body.userDetails || {}

    const firstName =
      userDetails.firstName ||
      (typeof auth.user.user_metadata?.first_name === 'string' ? auth.user.user_metadata.first_name : '')
    const lastName =
      userDetails.lastName ||
      (typeof auth.user.user_metadata?.last_name === 'string' ? auth.user.user_metadata.last_name : '')
    const email = userDetails.email || auth.user.email || ''

    if (!email) {
      return NextResponse.json({ success: false, error: 'Authenticated user is missing an email' }, { status: 400 })
    }

    const submissionPayload = {
      user_id: auth.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      country: answers.country || '',
      savings: answers.savings || '',
      years_abroad: answers.yearsAbroad || '',
      has_kids: answers.hasKids || (answers.childrenCount && answers.childrenCount !== 'none' ? 'yes' : 'no'),
      kids_age: answers.kidsAge || (answers.teenageChildren && answers.teenageChildren !== 'none' ? 'teen' : null),
      has_job: answers.hasJob || '',
      city: answers.city || '',
      timeline: answers.timeline || '',
      knows_rnor: answers.knowsRNOR || '',
      housing: answers.housing || '',
      total_score: result?.score?.total || 0,
      financial_score: result?.score?.financial || 0,
      life_score: result?.score?.lifeComplexity || 0,
      career_score: result?.score?.career || 0,
      planning_score: result?.score?.planning || 0,
      readiness_status: result?.status || '',
      answers_json: answers,
      result_json: result,
    }

    const { data: latestSubmission, error: selectError } = await auth.supabase
      .from('planner_submissions')
      .select('id')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (selectError) {
      console.error('Supabase select error:', selectError)
      return NextResponse.json({ success: false, error: 'Failed to load prior submission' }, { status: 500 })
    }

    if (latestSubmission?.id) {
      const { data: updatedSubmission, error: updateError } = await auth.supabase
        .from('planner_submissions')
        .update(submissionPayload)
        .eq('id', latestSubmission.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('Supabase update error:', updateError)
        return NextResponse.json({ success: false, error: 'Failed to update journey profile' }, { status: 500 })
      }

      return NextResponse.json({ success: true, submissionId: updatedSubmission.id, mode: 'updated' })
    }

    const { data: insertedSubmission, error: insertError } = await auth.supabase
      .from('planner_submissions')
      .insert(submissionPayload)
      .select('id')
      .single()

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json({ success: false, error: 'Failed to save journey profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true, submissionId: insertedSubmission.id, mode: 'inserted' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
