import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

const resend = new Resend(process.env.RESEND_API_KEY)

function normalizeSignupError(message: string) {
  const lower = message.toLowerCase()

  if (lower.includes('already registered') || lower.includes('already been registered') || lower.includes('user already exists')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (lower.includes('password')) {
    return message
  }

  return 'We could not create your account right now. Please try again.'
}

function buildSignupEmailHtml(name: string, actionLink: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirm your ReturningNRIs account</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
        <tr><td style="background:#1A1208;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
          <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">ReturningNRIs</div>
          <div style="font-family:Georgia,serif;font-size:28px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
            Confirm your account and come back signed in
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            One secure click and we&apos;ll bring you back to ReturningNRIs ready to continue your planning.
          </div>
        </td></tr>

        <tr><td style="background:#ffffff;padding:28px 36px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="display:inline-block;background:#FFF8F2;color:#FF9933;font-size:11px;font-weight:700;padding:4px 12px;border-radius:100px;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">
            Secure sign in
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:12px;">
            Hi ${name},
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:12px;">
            Your ReturningNRIs account is ready. Click below to verify your email and sign in securely.
          </div>
          <div style="font-size:15px;color:#5C5346;line-height:1.8;margin-bottom:24px;">
            Once you&apos;re in, you can save your readiness check, reopen results anytime, and keep planning your move back to India.
          </div>
          <a href="${actionLink}" style="display:inline-block;background:#FF9933;color:#1A1208;font-size:15px;font-weight:700;padding:14px 24px;border-radius:100px;text-decoration:none;">
            Verify email and sign in
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
          <div style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin-bottom:6px;">Plan your return properly</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.7;">
            Tax, city choice, schools, and timing are all easier when your plan is saved and ready to revisit.
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
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const origin = new URL(request.url).origin
    const next = typeof body.next === 'string' && body.next.startsWith('/') ? body.next : '/'

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required signup fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        data: {
          first_name: name,
          last_name: '',
        },
      },
    })

    if (error) {
      return NextResponse.json({ success: false, error: normalizeSignupError(error.message) }, { status: 400 })
    }

    const actionLink = data?.properties?.action_link || (data as { action_link?: string } | null)?.action_link

    if (!actionLink) {
      return NextResponse.json({ success: false, error: 'Signup link could not be generated' }, { status: 500 })
    }

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your ReturningNRIs account and sign in',
      html: buildSignupEmailHtml(name, actionLink),
    })

    if (emailError) {
      return NextResponse.json({ success: false, error: 'Failed to send signup email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Signup route error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
