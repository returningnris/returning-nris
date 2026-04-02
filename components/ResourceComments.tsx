'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabase'

type ResourceComment = {
  id: string
  displayName: string
  comment: string
  createdAt: string
}

function formatCommentDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export default function ResourceComments({ articleSlug }: { articleSlug: string }) {
  const { user, isAuthenticated, loading } = useAuth()
  const [comments, setComments] = useState<ResourceComment[]>([])
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true

    async function loadComments() {
      setLoadingComments(true)

      try {
        const response = await fetch(`/api/resource-comments?slug=${encodeURIComponent(articleSlug)}`)
        const payload = (await response.json()) as { comments?: ResourceComment[]; error?: string }

        if (!active) return

        if (!response.ok) {
          setError(payload.error || 'We could not load comments right now.')
          setLoadingComments(false)
          return
        }

        setComments(payload.comments || [])
        setLoadingComments(false)
      } catch (fetchError) {
        console.error('Resource comments load failed:', fetchError)
        if (!active) return
        setError('We could not load comments right now.')
        setLoadingComments(false)
      }
    }

    void loadComments()

    return () => {
      active = false
    }
  }, [articleSlug])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedComment = comment.trim()
    const trimmedName = name.trim()

    if (trimmedComment.length < 3) {
      setError('Please add a little more detail before posting.')
      return
    }

    setSubmitting(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const response = await fetch('/api/resource-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          articleSlug,
          name: isAuthenticated ? '' : trimmedName,
          comment: trimmedComment,
        }),
      })

      const payload = (await response.json()) as {
        comment?: ResourceComment
        error?: string
      }

      if (!response.ok || !payload.comment) {
        setError(payload.error || 'We could not save your comment right now.')
        setSubmitting(false)
        return
      }

      setComments((prev) => [payload.comment as ResourceComment, ...prev])
      setComment('')
      if (!isAuthenticated) {
        setName('')
      }
      setSuccess('Thanks. Your feedback is now visible below.')
      setSubmitting(false)
    } catch (submitError) {
      console.error('Resource comment submit failed:', submitError)
      setError('We could not save your comment right now.')
      setSubmitting(false)
    }
  }

  const signedInName = [user?.firstName || '', user?.lastName || ''].join(' ').trim() || user?.email || 'Signed-in user'

  return (
    <section style={{ background: '#fff', padding: '0 2rem 3rem' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ borderTop: '1px solid #E5E1DA', paddingTop: '2rem' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#B5A898', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Comments
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.45rem,3vw,1.9rem)', color: '#1A1208', marginBottom: '0.65rem', lineHeight: 1.2 }}>
            Add your perspective
          </h2>
          <p style={{ fontSize: '0.98rem', color: '#6B5E50', lineHeight: 1.72, marginBottom: '1.25rem' }}>
            Share what helped, what felt off, or what you want covered next. Signed-in users post with their profile name. If you are not signed in, you can still comment and leave the name blank to post as Anonymous.
          </p>

          <form onSubmit={handleSubmit} style={{ border: '1px solid #E5E1DA', borderRadius: '18px', padding: '1rem', background: '#F8F5F0', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '0.85rem' }}>
              {!loading && !isAuthenticated ? (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name (optional)"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    borderRadius: '14px',
                    border: '1px solid #E5E1DA',
                    background: '#fff',
                    fontSize: '14px',
                    color: '#1A1208',
                  }}
                />
              ) : (
                <div style={{ fontSize: '13px', color: '#6B5E50' }}>
                  Posting as <strong style={{ color: '#1A1208' }}>{signedInName}</strong>
                </div>
              )}

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="What did you find useful? What should we add or improve?"
                style={{
                  width: '100%',
                  minHeight: '110px',
                  padding: '0.95rem 1rem',
                  borderRadius: '14px',
                  border: '1px solid #E5E1DA',
                  background: '#fff',
                  fontSize: '14px',
                  color: '#1A1208',
                  resize: 'vertical',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />

              {error ? <div style={{ fontSize: '13px', color: '#A64935', lineHeight: 1.6 }}>{error}</div> : null}
              {success ? <div style={{ fontSize: '13px', color: '#138808', lineHeight: 1.6 }}>{success}</div> : null}

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '12px', color: '#8B7F71' }}>
                  Keep it practical and respectful. Short, specific feedback is the most useful.
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    border: 'none',
                    borderRadius: '999px',
                    background: '#FF9933',
                    color: '#1A1208',
                    padding: '0.82rem 1.25rem',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </div>
          </form>

          {loadingComments ? (
            <div style={{ fontSize: '14px', color: '#6B5E50' }}>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div style={{ border: '1px dashed #E5E1DA', borderRadius: '16px', padding: '1rem 1.1rem', color: '#6B5E50', fontSize: '14px', lineHeight: 1.7 }}>
              No comments yet. Be the first to share what was useful or what other returning NRIs should know.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.9rem' }}>
              {comments.map((item) => (
                <div key={item.id} style={{ border: '1px solid #E5E1DA', borderRadius: '16px', padding: '1rem 1.05rem', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1A1208' }}>{item.displayName || 'Anonymous'}</div>
                    <div style={{ fontSize: '12px', color: '#B5A898' }}>{formatCommentDate(item.createdAt)}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#3D3229', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{item.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
