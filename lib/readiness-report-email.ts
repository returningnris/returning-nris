type ReadinessEmailParams = {
  firstName: string
  result: Record<string, unknown>
}

type ReadinessEmailScore = {
  total?: number
  financial?: number
  planning?: number
  career?: number
  lifeComplexity?: number
}

type ReadinessEmailRisk = {
  level: string
  title: string
  detail: string
  action: string
}

type ReadinessEmailRecommendation = {
  bg?: string
  border?: string
  icon?: string
  color?: string
  verdict?: string
  actions?: string[]
}

type ReadinessEmailFinancial = {
  monthlyCost?: string
  runway?: string
  rnorSaving?: string
}

const READINESS_EMAIL_BREAKDOWN = [
  { label: 'Financial', scoreKey: 'financial', max: 35, color: '#FF9933' },
  { label: 'Planning', scoreKey: 'planning', max: 27, color: '#0E138C' },
  { label: 'Career', scoreKey: 'career', max: 20, color: '#138808' },
  { label: 'Life Complexity', scoreKey: 'lifeComplexity', max: 18, color: '#7C5CBF' },
] as const

export function buildReadinessReportEmailHtml({ firstName, result }: ReadinessEmailParams) {
  const scoreBreakdown = (result.score as ReadinessEmailScore | undefined) ?? {}
  const score = scoreBreakdown.total ?? 0
  const scoreColor = score >= 80 ? '#138808' : score >= 60 ? '#FF9933' : '#E24B4A'
  const statusBg = score >= 80 ? '#E8F5E8' : score >= 60 ? '#FFF3E6' : '#FCEBEB'
  const statusColor = scoreColor
  const status = typeof result.status === 'string' ? result.status : ''
  const headline = typeof result.headline === 'string' ? result.headline : ''
  const subheadline = typeof result.subheadline === 'string' ? result.subheadline : ''
  const risks = Array.isArray(result.risks) ? (result.risks as ReadinessEmailRisk[]) : []
  const recommendation = (result.recommendation as ReadinessEmailRecommendation | null | undefined) ?? null
  const financial = (result.financial as ReadinessEmailFinancial | undefined) ?? {}
  const riskBg: Record<string, string> = { high: '#FCEBEB', medium: '#FFF3E6', low: '#F0F8FF' }
  const riskBadge: Record<string, string> = { high: '#E24B4A', medium: '#FF9933', low: '#6B8CFF' }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Return Readiness Report - ReturningNRIs</title>
</head>
<body style="margin:0;padding:0;background:#F8F5F0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
        <tr><td style="background:#1A1208;border-radius:16px 16px 0 0;padding:32px 36px 28px;">
          <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;">Return Readiness Report</div>
          <div style="font-family:Georgia,serif;font-size:24px;color:#ffffff;line-height:1.3;margin-bottom:8px;">
            Hi ${firstName}, here's your personalised readiness report
          </div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">
            Based on your answers - your score, top risks, and a clear recommendation.
          </div>
        </td></tr>
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
                ${READINESS_EMAIL_BREAKDOWN
                  .map(
                    (item) => {
                      const scoreValue = scoreBreakdown[item.scoreKey] ?? 0
                      const scorePercent = Math.max(0, Math.min(100, Math.round((scoreValue / item.max) * 100)))
                      return `
                  <div style="margin-bottom:9px;">
                    <div style="overflow:hidden;margin-bottom:3px;">
                      <span style="font-size:11px;color:#888;float:left;">${item.label}</span>
                      <span style="font-size:11px;font-weight:600;color:${item.color};float:right;">${scoreValue}/${item.max}</span>
                    </div>
                    <div style="height:4px;background:#f0f0f0;border-radius:100px;">
                      <div style="width:${scorePercent}%;height:4px;background:${item.color};border-radius:100px;"></div>
                    </div>
                  </div>
                `
                    }
                  )
                  .join('')}
              </td>
            </tr>
          </table>
          <div style="background:#FFF8F2;border-left:3px solid #FF9933;border-radius:0 10px 10px 0;padding:12px 16px;margin-top:20px;">
            <div style="font-size:14px;font-weight:600;color:#1A1208;margin-bottom:3px;">${headline}</div>
            <div style="font-size:12px;color:#5C5346;line-height:1.6;">${subheadline}</div>
          </div>
        </td></tr>
        <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">Financial Snapshot</div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${[
                { label: 'Monthly Cost', value: financial.monthlyCost || '-' },
                { label: 'Runway', value: financial.runway || '-' },
                { label: 'RNOR Saving', value: financial.rnorSaving || '-' },
              ]
                .map(
                  (item) => `
                <td width="33%" style="padding:0 3px;">
                  <div style="background:#F8F5F0;border-radius:10px;padding:11px 12px;">
                    <div style="font-size:9px;color:#999;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:3px;">${item.label}</div>
                    <div style="font-size:15px;font-weight:600;color:#1A1208;">${item.value}</div>
                  </div>
                </td>
              `
                )
                .join('')}
            </tr>
          </table>
        </td></tr>
        ${
          risks.length > 0
            ? `
        <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">
            ${risks.some((risk: { level: string }) => risk.level === 'high') ? 'Critical Risks - Act Before Moving' : 'Risks For Your Profile'}
          </div>
          ${risks
            .map(
              (risk: { level: string; title: string; detail: string; action: string }) => `
            <div style="border-radius:10px;padding:12px 14px;margin-bottom:8px;background:${riskBg[risk.level] || '#F8F5F0'};">
              <div style="margin-bottom:5px;">
                <span style="font-size:9px;font-weight:700;color:#fff;background:${riskBadge[risk.level] || '#888'};padding:2px 7px;border-radius:100px;text-transform:uppercase;">${risk.level}</span>
                <span style="font-size:13px;font-weight:600;color:#1A1208;margin-left:6px;">${risk.title}</span>
              </div>
              <div style="font-size:12px;color:#5C5346;line-height:1.5;margin-bottom:5px;">${risk.detail}</div>
              <div style="font-size:12px;font-weight:500;color:#1A1208;">-> ${risk.action}</div>
            </div>
          `
            )
            .join('')}
        </td></tr>
        `
            : ''
        }
        ${
          recommendation
            ? `
        <tr><td style="background:#ffffff;padding:0 36px 28px;border-left:1px solid #EDE9E0;border-right:1px solid #EDE9E0;">
          <div style="font-size:10px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:0.09em;margin-bottom:12px;padding-top:8px;border-top:1px solid #f0f0f0;">Final Recommendation</div>
          <div style="background:${recommendation.bg || '#F8F5F0'};border:1px solid ${recommendation.border || '#EDE9E0'};border-radius:12px;padding:16px 18px;">
            <div style="font-size:18px;margin-bottom:8px;">${recommendation.icon || ''}</div>
            <div style="font-family:Georgia,serif;font-size:16px;color:${recommendation.color || '#1A1208'};line-height:1.4;margin-bottom:12px;">${recommendation.verdict || ''}</div>
            ${(recommendation.actions || [])
              .map(
                (action: string, index: number) => `
              <div style="display:flex;gap:8px;margin-bottom:7px;align-items:flex-start;">
                <div style="width:16px;height:16px;border-radius:50%;background:${recommendation.color || '#888'};color:#fff;font-size:9px;font-weight:700;text-align:center;line-height:16px;flex-shrink:0;">${index + 1}</div>
                <div style="font-size:12px;color:${recommendation.color || '#5C5346'};line-height:1.5;">${action}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </td></tr>
        `
            : ''
        }
        <tr><td style="background:#1A1208;padding:28px 36px;border-radius:0 0 16px 16px;">
          <div style="font-family:Georgia,serif;font-size:19px;color:#ffffff;margin-bottom:6px;">Ready to plan your return properly?</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:20px;line-height:1.6;">
            Use your saved report, compare cities, and plan your move with much more confidence.
          </div>
          <a href="https://www.returningnris.com/journey" style="display:inline-block;background:#FF9933;color:#1A1208;font-size:14px;font-weight:600;padding:12px 24px;border-radius:100px;text-decoration:none;">
            Start your Back2India Journey ->
          </a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
