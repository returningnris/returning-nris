import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userDetails, answers, result } = body

    // ── 1. Save to Supabase ───────────────────────────────────────────────────
    const { data: submission, error: dbError } = await supabase
      .from('planner_submissions')
      .insert({
        first_name: userDetails.firstName,
        last_name: userDetails.lastName || '',
        age: parseInt(userDetails.age) || null,
        gender: userDetails.gender || '',
        email: userDetails.email,
        country: answers.country || '',
        savings: answers.savings || '',
        years_abroad: answers.yearsAbroad || '',
        income: answers.income || '',
        has_kids: answers.hasKids || '',
        kids_age: answers.kidsAge || null,
        has_job: answers.hasJob || '',
        employment: answers.employment || '',
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
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
    }

    // ── 2. Send email via Resend ──────────────────────────────────────────────
    const score = result?.score?.total || 0
    const scoreColor = score >= 80 ? '#138808' : score >= 60 ? '#FF9933' : '#E24B4A'
    const statusBg = score >= 80 ? '#E8F5E8' : score >= 60 ? '#FFF3E6' : '#FCEBEB'
    const statusColor = scoreColor
    const status = result?.status || ''
    const headline = result?.headline || ''
    const subheadline = result?.subheadline || ''
    const risks = result?.risks || []
    const rec = result?.recommendation || null
    const fin = result?.financial || {}
    const riskBg: Record<string, string> = { high: '#FCEBEB', medium: '#FFF3E6', low: '#F0F8FF' }
    const riskBadge: Record<string, string> = { high: '#E24B4A', medium: '#FF9933', low: '#6B8CFF' }

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Return Readiness Report — ReturningNRIs</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:32px 16px;">
    <tr><td align="center">
    <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:#1A1208;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
        <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">Return Readiness Report</div>
        <div style="font-family:Georgia,serif;font-size:24px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
          Hi ${userDetails.firstName}, here&apos;s your personalised readiness report
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">
          Based on your answers — your score, top risks, and a clear recommendation.
        </div>
      </td></tr>

      <!-- SCORE -->
      <tr><td style="background:#ffffff;padding:28px 36px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;width:160px;">
              <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Readiness Score</div>
              <div style="font-family:Georgia,serif;font-size:52px;color:${scoreColor};line-height:1;">${score}</div>
              <div style="font-size:12px;color:#999;margin-bottom:10px;">out of 100</div>
              <div style="display:inline-block;background:${statusBg};color:${statusColor};font-size:11px;font-weight:600;padding:4px 12px;border-radius:100px;">${status}</div>
            </td>
            <td style="vertical-align:top;padding-left:28px;">
              ${[
                { label: 'Financial', s: result?.score?.financial || 0, max: 40, color: '#FF9933' },
                { label: 'Life Complexity', s: result?.score?.lifeComplexity || 0, max: 25, color: '#7C5CBF' },
                { label: 'Career', s: result?.score?.career || 0, max: 20, color: '#138808' },
                { label: 'Planning', s: result?.score?.planning || 0, max: 20, color: '#6B8CFF' },
              ].map(x => `
                <div style="margin-bottom:9px;">
                  <div style="overflow:hidden;margin-bottom:3px;">
                    <span style="font-size:11px;color:#888;float:left;">${x.label}</span>
                    <span style="font-size:11px;font-weight:600;color:${x.color};float:right;">${x.s}/${x.max}</span>
                  </div>
                  <div style="height:4px;background:#f0f0f0;border-radius:100px;">
                    <div style="width:${Math.round((x.s / x.max) * 100)}%;height:4px;background:${x.color};border-radius:100px;"></div>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>
        </table>
        <div style="background:#FFF8F2;border-left:3px solid #FF9933;border-radius:0 10px 10px 0;padding:12px 16px;margin-top:20px;">
          <div style="font-size:14px;font-weight:600;color:#1A1208;margin-bottom:3px;">${headline}</div>
          <div style="font-size:12px;color:#5C5346;line-height:1.6;">${subheadline}</div>
        </div>
      </td></tr>

      <!-- FINANCIAL SNAPSHOT -->
      <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
        <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">Financial Snapshot</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${[
              { label: 'Monthly Cost', val: fin.monthlyCost || '–' },
              { label: 'Runway', val: fin.runway || '–' },
              { label: 'RNOR Saving', val: fin.rnorSaving || '–' },
            ].map(s => `
              <td width="33%" style="padding:0 3px;">
                <div style="background:#F8F5F0;border-radius:10px;padding:11px 12px;">
                  <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:3px;">${s.label}</div>
                  <div style="font-size:15px;font-weight:600;color:#1A1208;">${s.val}</div>
                </div>
              </td>
            `).join('')}
          </tr>
        </table>
      </td></tr>

      <!-- RISKS -->
      ${risks.length > 0 ? `
      <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
        <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">
          ${risks.filter((r: { level: string }) => r.level === 'high').length > 0 ? 'Critical Risks — Act Before Moving' : 'Risks For Your Profile'}
        </div>
        ${risks.map((risk: { level: string; title: string; detail: string; action: string }) => `
          <div style="border-radius:10px;padding:12px 14px;margin-bottom:8px;background:${riskBg[risk.level] || '#F8F5F0'};">
            <div style="margin-bottom:5px;">
              <span style="font-size:9px;font-weight:700;color:#fff;background:${riskBadge[risk.level] || '#888'};padding:2px 7px;border-radius:100px;text-transform:uppercase;">${risk.level}</span>
              <span style="font-size:13px;font-weight:600;color:#1A1208;margin-left:6px;">${risk.title}</span>
            </div>
            <div style="font-size:12px;color:#5C5346;line-height:1.5;margin-bottom:5px;">${risk.detail}</div>
            <div style="font-size:12px;font-weight:500;color:#1A1208;">→ ${risk.action}</div>
          </div>
        `).join('')}
      </td></tr>
      ` : ''}

      <!-- RECOMMENDATION -->
      ${rec ? `
      <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
        <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">Final Recommendation</div>
        <div style="background:${rec.bg || '#F8F5F0'};border:1px solid ${rec.border || '#EDE9E0'};border-radius:12px;padding:16px 18px;">
          <div style="font-size:18px;margin-bottom:8px;">${rec.icon || ''}</div>
          <div style="font-family:Georgia,serif;font-size:16px;color:${rec.color || '#1A1208'};line-height:1.4;margin-bottom:4px;">${rec.verdict || ''}</div>
          <div style="font-size:12px;font-weight:600;color:${rec.color || '#1A1208'};opacity:0.7;margin-bottom:12px;">→ ${rec.timeframe || ''}</div>
          ${(rec.actions || []).map((action: string, i: number) => `
            <div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start;">
              <div style="width:16px;height:16px;border-radius:50%;background:${rec.color || '#888'};color:#fff;font-size:9px;font-weight:700;text-align:center;line-height:16px;flex-shrink:0;">${i + 1}</div>
              <div style="font-size:12px;color:${rec.color || '#5C5346'};line-height:1.5;">${action}</div>
            </div>
          `).join('')}
        </div>
      </td></tr>
      ` : ''}

      <!-- CTA -->
      <tr><td style="background:#1A1208;padding:28px 36px;border-radius:0 0 16px 16px;">
        <div style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin-bottom:6px;">Ready to plan your return properly?</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:20px;line-height:1.6;">
          Join NRIs already planning their return. Use all our free tools — RNOR calculator, city match, school finder, readiness check — to plan your move with confidence.
        </div>
        <a href="https://www.returningnris.com/journey" style="display:inline-block;background:#FF9933;color:#1A1208;font-size:14px;font-weight:600;padding:12px 24px;border-radius:100px;text-decoration:none;">
          Start your Back2India Journey →
        </a>
        <div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:20px;line-height:1.6;">
          © 2026 ReturningNRIs · Built with 🇮🇳 by Bharath &amp; Swathi<br/>
          <a href="mailto:hello@returningnris.com?subject=Unsubscribe" style="color:rgba(255,255,255,0.25);">Unsubscribe</a>
        </div>
      </td></tr>

    </table>
    </td></tr>
  </table>
</body>
</html>`

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: userDetails.email,
      subject: `${userDetails.firstName}, your Return Readiness Report — ${score}/100`,
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