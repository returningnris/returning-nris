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
        last_name: userDetails.lastName,
        age: parseInt(userDetails.age),
        gender: userDetails.gender,
        email: userDetails.email,
        country: answers.country,
        savings: answers.savings,
        years_abroad: answers.yearsAbroad,
        income: answers.income,
        has_kids: answers.hasKids,
        kids_age: answers.kidsAge || null,
        has_job: answers.hasJob,
        employment: answers.employment,
        city: answers.city,
        timeline: answers.timeline,
        knows_rnor: answers.knowsRNOR,
        housing: answers.housing,
        total_score: result.score.total,
        financial_score: result.score.financial,
        life_score: result.score.lifeComplexity,
        career_score: result.score.career,
        planning_score: result.score.planning,
        readiness_status: result.status,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      // Don't fail the whole request if DB save fails — still send email
    }

    // ── 2. Send email via Resend ──────────────────────────────────────────────
    const scoreColor = result.score.total >= 80 ? '#138808' : result.score.total >= 60 ? '#FF9933' : '#E24B4A'
    const riskBadgeColors: Record<string, string> = { high: '#E24B4A', medium: '#FF9933', low: '#000080' }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Return Readiness Report — ReturningNRIs</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:40px 20px;">
    <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:#1A1208;border-radius:20px 20px 0 0;padding:36px 40px;">
        <div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px;">Return Readiness Report</div>
        <div style="font-family:Georgia,serif;font-size:26px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
          Hi ${userDetails.firstName}, here's your<br/>personalised readiness report
        </div>
        <div style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">
          Based on your answers, here is a full breakdown of your return readiness score, top risks, and action plan.
        </div>
      </td></tr>

      <!-- SCORE CARD -->
      <tr><td style="background:#ffffff;padding:32px 40px;border-left:1px solid #eee;border-right:1px solid #eee;">

        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="vertical-align:top;">
              <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Readiness Score</div>
              <div style="font-family:Georgia,serif;font-size:56px;color:${scoreColor};line-height:1;margin-bottom:4px;">${result.score.total}</div>
              <div style="font-size:13px;color:#888;margin-bottom:12px;">out of 100</div>
              <div style="display:inline-block;background:${result.statusBg};color:${result.statusColor};font-size:12px;font-weight:600;padding:5px 14px;border-radius:100px;">${result.status}</div>
            </td>
            <td width="200" style="vertical-align:top;padding-left:32px;">
              ${[
                { label: 'Financial', score: result.score.financial, max: 35, color: '#FF9933' },
                { label: 'Life Complexity', score: result.score.lifeComplexity, max: 28, color: '#7C5CBF' },
                { label: 'Career', score: result.score.career, max: 20, color: '#138808' },
                { label: 'Planning', score: result.score.planning, max: 20, color: '#6B8CFF' },
              ].map(s => `
                <div style="margin-bottom:10px;">
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-size:11px;color:#888;">${s.label}</span>
                    <span style="font-size:11px;font-weight:600;color:${s.color};">${s.score}/${s.max}</span>
                  </div>
                  <div style="height:5px;background:#f0f0f0;border-radius:100px;overflow:hidden;">
                    <div style="width:${Math.round((s.score / s.max) * 100)}%;height:100%;background:${s.color};border-radius:100px;"></div>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>
        </table>

        <div style="background:#FFF8F2;border-left:3px solid #FF9933;border-radius:0 10px 10px 0;padding:14px 18px;margin-top:24px;">
          <div style="font-size:14px;font-weight:600;color:#1A1208;margin-bottom:4px;">${result.headline}</div>
          <div style="font-size:13px;color:#5C5346;line-height:1.6;">${result.subheadline}</div>
        </div>
      </td></tr>

      <!-- FINANCIAL SNAPSHOT -->
      <tr><td style="background:#ffffff;padding:0 40px 32px;border-left:1px solid #eee;border-right:1px solid #eee;">
        <div style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:14px;padding-top:8px;border-top:1px solid #f0f0f0;">Financial Snapshot</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${[
              { label: 'Savings', val: result.financial.savingsLabel },
              { label: 'India Monthly Cost', val: result.financial.monthlyCost },
              { label: 'Financial Runway', val: result.financial.runway },
              { label: 'RNOR Tax Saving', val: result.financial.rnorSaving },
            ].map(s => `
              <td width="25%" style="padding:0 4px;">
                <div style="background:#F8F5F0;border-radius:10px;padding:12px;">
                  <div style="font-size:9px;color:#888;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;">${s.label}</div>
                  <div style="font-size:15px;font-weight:600;color:#1A1208;">${s.val}</div>
                </div>
              </td>
            `).join('')}
          </tr>
        </table>
      </td></tr>

      <!-- TOP RISKS -->
      <tr><td style="background:#ffffff;padding:0 40px 32px;border-left:1px solid #eee;border-right:1px solid #eee;">
        <div style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:14px;padding-top:8px;border-top:1px solid #f0f0f0;">Top ${result.risks.length} Risks For Your Profile</div>
        ${result.risks.map((risk: { level: string; title: string; detail: string; action: string }) => `
          <div style="border-radius:12px;padding:14px 16px;margin-bottom:10px;background:${risk.level === 'high' ? '#FCEBEB' : risk.level === 'medium' ? '#FFF3E6' : '#E8E8FF'};">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="font-size:9px;font-weight:700;color:#fff;background:${riskBadgeColors[risk.level]};padding:2px 8px;border-radius:100px;text-transform:uppercase;">${risk.level}</span>
              <span style="font-size:13px;font-weight:600;color:#1A1208;">${risk.title}</span>
            </div>
            <div style="font-size:12px;color:#5C5346;line-height:1.6;margin-bottom:6px;">${risk.detail}</div>
            <div style="font-size:12px;font-weight:500;color:#1A1208;">→ ${risk.action}</div>
          </div>
        `).join('')}
      </td></tr>

      <!-- KEY INSIGHTS -->
      <tr><td style="background:#ffffff;padding:0 40px 32px;border-left:1px solid #eee;border-right:1px solid #eee;">
        <div style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:14px;padding-top:8px;border-top:1px solid #f0f0f0;">Key Personalised Insights</div>
        ${result.insights.map((ins: { icon: string; title: string; detail: string; type: string }) => `
          <div style="background:${ins.type === 'positive' ? '#E8F5E8' : ins.type === 'warning' ? '#FFF3E6' : '#F8F5F0'};border-radius:12px;padding:14px 16px;margin-bottom:10px;">
            <div style="font-size:20px;margin-bottom:6px;">${ins.icon}</div>
            <div style="font-size:13px;font-weight:600;color:#1A1208;margin-bottom:4px;">${ins.title}</div>
            <div style="font-size:12px;color:#5C5346;line-height:1.6;">${ins.detail}</div>
          </div>
        `).join('')}
      </td></tr>

      <!-- ACTION PLAN -->
      <tr><td style="background:#ffffff;padding:0 40px 32px;border-left:1px solid #eee;border-right:1px solid #eee;">
        <div style="font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:14px;padding-top:8px;border-top:1px solid #f0f0f0;">Your Action Timeline</div>
        ${result.actionPlan.map((phase: { phase: string; timing: string; color: string; tasks: string[] }, i: number) => `
          <div style="margin-bottom:20px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <div style="width:28px;height:28px;border-radius:50%;background:${phase.color};color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;line-height:28px;">${i + 1}</div>
              <span style="font-size:14px;font-weight:600;color:#1A1208;">${phase.phase}</span>
              <span style="font-size:11px;color:#888;background:#F8F5F0;padding:2px 10px;border-radius:100px;">${phase.timing}</span>
            </div>
            ${phase.tasks.map((task: string) => `
              <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;padding-left:38px;">
                <span style="color:${phase.color};font-size:14px;line-height:1.4;">○</span>
                <span style="font-size:13px;color:#5C5346;line-height:1.6;">${task}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </td></tr>

      <!-- CTA -->
      <tr><td style="background:#1A1208;padding:32px 40px;border-radius:0 0 20px 20px;">
        <div style="font-family:Georgia,serif;font-size:20px;color:#ffffff;margin-bottom:8px;">Ready to plan your return properly?</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:24px;line-height:1.6;">
          Join 165 NRIs already on the ReturningNRIs waitlist. First 200 members get lifetime free access to all tools.
        </div>
        <a href="https://www.returningnris.com/contact" style="display:inline-block;background:#FF9933;color:#1A1208;font-size:14px;font-weight:600;padding:14px 28px;border-radius:100px;text-decoration:none;">
          Claim your founding spot — free →
        </a>
        <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:24px;">
  © 2026 ReturningNRIs <br/>
  You received this because you completed the Return Readiness Assessment at returningnris.com<br/><br/>
  <a href="mailto:hello@returningnris.com?subject=Unsubscribe&body=Please unsubscribe me from ReturningNRIs emails. Email: ${userDetails.email}" style="color:rgba(255,255,255,0.3);text-decoration:underline;">
    Unsubscribe
  </a>
</div>
      </td></tr>

    </table>
    </td></tr>
  </table>
</body>
</html>
    `

    const { error: emailError } = await resend.emails.send({
      from: `ReturningNRIs <${process.env.RESEND_FROM_EMAIL}>`,
      to: userDetails.email,
      subject: `${userDetails.firstName}, your Return Readiness Report — ${result.score.total}/100`,
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