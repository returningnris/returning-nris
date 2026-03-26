import { NextResponse } from 'next/server'

export async function GET() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || 'https://calendly.com/returningnris/30min'

  return NextResponse.json({
    calendlyUrl,
  })
}
