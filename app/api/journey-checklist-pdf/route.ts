import { Buffer } from 'node:buffer'
import { NextResponse } from 'next/server'
import { buildJourneyChecklistPdf } from '../../../lib/journeyChecklistPdf'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const checkedItemIds = Array.isArray(body?.checkedItemIds)
      ? body.checkedItemIds.filter((entry: unknown): entry is string => typeof entry === 'string')
      : []

    const pdfBytes = await buildJourneyChecklistPdf(checkedItemIds)
    const pdfBuffer = Buffer.from(pdfBytes)
    const fileName = `returningnris-back2india-checklist.pdf`

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Journey checklist PDF API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate checklist PDF' }, { status: 500 })
  }
}
