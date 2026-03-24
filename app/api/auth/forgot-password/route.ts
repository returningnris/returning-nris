import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabase-admin'
import { getSiteUrl } from '../../../../lib/site-url'

function buildResetEmailHtml(name: string, actionLink: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your ReturningNRIs password</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
        <tr><td style="background:#1A1208;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
          <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">ReturningNRIs</div>
          <div style="font-family:Georgia,serif;font-size:28px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
            Reset your password and get back in
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            Use this secure link to choose a new password and continue your planning.
          </div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:28px 36px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="display:inline-block;background:#FFF8F2;color:#FF9933;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
            Password reset
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:12px;">
            Hi ${name},
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:12px;">
            We received a request to reset your ReturningNRIs password.
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:24px;">
            Click below to set a new password securely. If you did not request this, you can ignore this email.
          </div>
          <a href="${actionLink}" style="display:inline-block;background:#FF9933;color:#1A1208;font-size:15px;font-weight:700;padding:14px 24px;border-radius:100px;text-decoration:none;">
            Reset password
          </a>
        </td></tr>

        <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="background:#F8F5F0;border-radius:12px;padding:16px 18px;">
            <div style="font-size:12px;font-weight:700;color:#1A1208;margin-bottom:6px;">If the button doesn&apos;t work</div>
            <div style="font-size:12px;color:#6B5E50;line-height:1.7;word-break:break-all;">
              <a href="${actionLink}" style="color:#000080;">${actionLink}</a>
            </div>
          </div>
        </td></tr>

        <tr><td style="background:#1A1208;padding:28px 36px;border-radius:0 0 16px 16px;">
          <div style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin-bottom:6px;">ReturningNRIs</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            Built to help NRIs plan their move back to India with more clarity and fewer expensive mistakes.
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
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: false, error: 'Server is missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, error: 'Server is missing RESEND_API_KEY' }, { status: 500 })
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return NextResponse.json({ success: false, error: 'Server is missing RESEND_FROM_EMAIL' }, { status: 500 })
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const siteUrl = getSiteUrl(request)
    const supabaseAdmin = getSupabaseAdmin()
    const resend = new Resend(process.env.RESEND_API_KEY)

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${siteUrl}/auth/update-password`,
      },
    })

    if (error) {
      console.error('Forgot password generateLink error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const actionLink = data?.properties?.action_link || (data as { action_link?: string } | null)?.action_link
    const displayName =
      data?.user?.user_metadata?.first_name ||
      data?.user?.user_metadata?.full_name ||
      data?.user?.user_metadata?.name ||
      'there'

    if (!actionLink) {
      return NextResponse.json({ success: true })
    }

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your ReturningNRIs password',
      html: buildResetEmailHtml(displayName, actionLink),
    })

    if (emailError) {
      console.error('Forgot password email error:', emailError)
      return NextResponse.json({ success: false, error: 'Failed to send reset email. Check your Resend sender configuration.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password route error:', error)
    return NextResponse.json({ success: false, error: 'Unexpected server error while creating reset email' }, { status: 500 })
  }
}
