import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getSiteUrl } from '../../../lib/site-url'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildJourneyReportEmailHtml(params: {
  firstName: string
  score: number
  status: string
  headline: string
  subheadline: string
  currentPhaseLabel: string
  moveDateLabel: string
  checklistItems: string[]
  siteUrl: string
}) {
  const checklistHtml = params.checklistItems.length
    ? params.checklistItems
        .map(
          (item) =>
            `<li style="margin-bottom:10px;color:#5C5346;line-height:1.7;">${escapeHtml(item)}</li>`
        )
        .join('')
    : '<li style="color:#5C5346;line-height:1.7;">Open your journey dashboard to review the latest checklist.</li>'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Back2India Journey</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">
        <tr><td style="background:#1A1208;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
          <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">ReturningNRIs</div>
          <div style="font-family:Georgia,serif;font-size:28px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
            Your Back2India Journey
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            Score, status, and the checklist to keep your move moving.
          </div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:28px 36px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:12px;">
            Hi ${escapeHtml(params.firstName || 'there')},
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:18px;">
            ${escapeHtml(params.subheadline)}
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
            <tr>
              <td style="padding:16px;border-radius:16px;background:#FFF8F2;border:1px solid rgba(240,138,36,0.2);">
                <div style="font-size:11px;font-weight:700;color:#CC7A00;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Journey result</div>
                <div style="font-family:Georgia,serif;font-size:26px;color:#1A1208;line-height:1.1;margin-bottom:8px;">${escapeHtml(params.headline)}</div>
                <div style="font-size:14px;color:#5C5346;line-height:1.7;">Status: <strong>${escapeHtml(params.status)}</strong> | Score: <strong>${params.score}/100</strong></div>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
            <tr>
              <td style="width:50%;padding-right:6px;vertical-align:top;">
                <div style="padding:16px;border-radius:16px;background:#F8F5F0;">
                  <div style="font-size:11px;font-weight:700;color:#6B5E50;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Current phase</div>
                  <div style="font-size:15px;font-weight:700;color:#1A1208;line-height:1.5;">${escapeHtml(params.currentPhaseLabel)}</div>
                </div>
              </td>
              <td style="width:50%;padding-left:6px;vertical-align:top;">
                <div style="padding:16px;border-radius:16px;background:#F8F5F0;">
                  <div style="font-size:11px;font-weight:700;color:#6B5E50;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">Move target</div>
                  <div style="font-size:15px;font-weight:700;color:#1A1208;line-height:1.5;">${escapeHtml(params.moveDateLabel)}</div>
                </div>
              </td>
            </tr>
          </table>

          <div style="font-size:11px;font-weight:700;color:#000080;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px;">Checklist to focus on now</div>
          <ul style="margin:0 0 24px 18px;padding:0;">
            ${checklistHtml}
          </ul>

          <a href="${params.siteUrl}/journey" style="display:inline-block;background:#138808;color:#ffffff;font-size:15px;font-weight:700;padding:14px 24px;border-radius:100px;text-decoration:none;margin-right:10px;">
            Open your journey
          </a>
          <a href="${params.siteUrl}/resources/nri-returning-to-india-checklist" style="display:inline-block;background:#ffffff;color:#000080;font-size:15px;font-weight:700;padding:14px 24px;border-radius:100px;text-decoration:none;border:1px solid #D9D3C8;">
            View full checklist
          </a>
        </td></tr>

        <tr><td style="background:#1A1208;padding:28px 36px;border-radius:0 0 16px 16px;">
          <div style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin-bottom:6px;">Keep the plan moving</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            Create a free account anytime to save this dashboard, reopen it later, and keep tracking the move across each phase.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userDetails = body.userDetails || {}
    const journey = body.journey || {}
    const result = journey.result || {}
    const firstName = typeof userDetails.firstName === 'string' ? userDetails.firstName.trim() : ''
    const email = typeof userDetails.email === 'string' ? userDetails.email.trim() : ''
    const siteUrl = getSiteUrl(request)

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const checklistItems = Array.isArray(journey.checklistItems)
      ? journey.checklistItems.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
      : []

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: `${firstName || 'Your'} Back2India Journey - ${result?.score?.total || 0}/100`,
      html: buildJourneyReportEmailHtml({
        firstName,
        score: typeof result?.score?.total === 'number' ? result.score.total : 0,
        status: typeof result?.status === 'string' ? result.status : 'Journey ready',
        headline: typeof result?.headline === 'string' ? result.headline : 'Your journey dashboard is ready',
        subheadline: typeof result?.subheadline === 'string' ? result.subheadline : 'Your journey dashboard is ready.',
        currentPhaseLabel:
          typeof journey.currentPhaseLabel === 'string' ? journey.currentPhaseLabel : 'Current phase',
        moveDateLabel: typeof journey.moveDateLabel === 'string' ? journey.moveDateLabel : 'Move target not set',
        checklistItems,
        siteUrl,
      }),
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ success: false, error: 'Failed to send journey report email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Journey email API error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
