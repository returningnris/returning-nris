import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { buildReadinessReportEmailHtml } from '../../../lib/readiness-report-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = body.result || {}
    const userDetails = body.userDetails || {}
    const firstName = typeof userDetails.firstName === 'string' ? userDetails.firstName.trim() : ''
    const email = typeof userDetails.email === 'string' ? userDetails.email.trim() : ''

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: `${firstName || 'Your'} Return Readiness Report - ${result?.score?.total || 0}/100`,
      html: buildReadinessReportEmailHtml({ firstName: firstName || 'there', result }),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ success: false, error: 'Failed to send readiness report email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
