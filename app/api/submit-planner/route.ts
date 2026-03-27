import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { requireAuthenticatedUser } from '../../../lib/supabase-server'
import { buildReadinessReportEmailHtml } from '../../../lib/readiness-report-email'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    const { data: submission, error: dbError } = await auth.supabase
      .from('planner_submissions')
      .insert({
        user_id: auth.user.id,
        first_name: firstName,
        last_name: lastName,
        age: Number.parseInt(userDetails.age, 10) || null,
        gender: userDetails.gender || '',
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
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ success: false, error: 'Failed to save assessment' }, { status: 500 })
    }

    const score = result?.score?.total || 0
    const emailHtml = buildReadinessReportEmailHtml({
      firstName: firstName || 'there',
      result,
    })

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: `${firstName}, your Return Readiness Report - ${score}/100`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
    }

    return NextResponse.json({
      success: true,
      submissionId: submission?.id || null,
      emailSent: !emailError,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
