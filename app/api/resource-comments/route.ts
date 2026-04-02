import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase-admin'
import { createRouteHandlerSupabaseClient } from '../../../lib/supabase-server'

function normalizeSlug(value: string) {
  return value.trim().toLowerCase()
}

function normalizeName(value: string) {
  return value.trim().replace(/\s+/g, ' ').slice(0, 60)
}

function normalizeComment(value: string) {
  return value.trim().replace(/\r\n/g, '\n').slice(0, 1500)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const articleSlug = normalizeSlug(searchParams.get('slug') || '')

    if (!articleSlug) {
      return NextResponse.json({ success: false, error: 'Missing article slug' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('resource_comments')
      .select('id, display_name, comment, created_at')
      .eq('article_slug', articleSlug)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Resource comments fetch error:', error)
      return NextResponse.json({ success: false, error: 'Failed to load comments' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      comments: (data || []).map((item) => ({
        id: item.id,
        displayName: item.display_name,
        comment: item.comment,
        createdAt: item.created_at,
      })),
    })
  } catch (error) {
    console.error('Resource comments GET error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const articleSlug = normalizeSlug(typeof body.articleSlug === 'string' ? body.articleSlug : '')
    const providedName = normalizeName(typeof body.name === 'string' ? body.name : '')
    const comment = normalizeComment(typeof body.comment === 'string' ? body.comment : '')

    if (!articleSlug) {
      return NextResponse.json({ success: false, error: 'Missing article slug' }, { status: 400 })
    }

    if (comment.length < 3) {
      return NextResponse.json({ success: false, error: 'Comment is too short' }, { status: 400 })
    }

    const authHeader = request.headers.get('authorization') ?? ''
    let userId: string | null = null
    let displayName = providedName || 'Anonymous'

    if (authHeader.startsWith('Bearer ')) {
      const accessToken = authHeader.slice('Bearer '.length).trim()
      const supabase = createRouteHandlerSupabaseClient(accessToken)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        userId = user.id

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle()

        const profileName = [profile?.first_name || '', profile?.last_name || ''].join(' ').trim()
        const metadataName =
          typeof user.user_metadata?.first_name === 'string'
            ? user.user_metadata.first_name
            : typeof user.user_metadata?.full_name === 'string'
              ? user.user_metadata.full_name
              : typeof user.user_metadata?.name === 'string'
                ? user.user_metadata.name
                : ''

        displayName = normalizeName(profileName || metadataName) || providedName || 'Anonymous'
      }
    }

    const { data, error } = await supabaseAdmin
      .from('resource_comments')
      .insert({
        article_slug: articleSlug,
        user_id: userId,
        display_name: displayName,
        comment,
        status: 'published',
      })
      .select('id, display_name, comment, created_at')
      .single()

    if (error) {
      console.error('Resource comments insert error:', error)
      return NextResponse.json({ success: false, error: 'Failed to save comment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      comment: {
        id: data.id,
        displayName: data.display_name,
        comment: data.comment,
        createdAt: data.created_at,
      },
    })
  } catch (error) {
    console.error('Resource comments POST error:', error)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
