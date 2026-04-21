'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbx7YcphGDE9YJygeRypkPEtlVWue1_SS-TWt9gXZPYWDfGJefrfZEUyW8z6Z0WIPf0hDw/exec'

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    const form = e.currentTarget
    const fname = (form.querySelector('#fname') as HTMLInputElement).value.trim()
    const lname = (form.querySelector('#lname') as HTMLInputElement).value.trim()
    const email = (form.querySelector('#email') as HTMLInputElement).value.trim()
    const country = (form.querySelector('#country') as HTMLSelectElement).value
    const year = (form.querySelector('#year') as HTMLSelectElement).value
    const message = (form.querySelector('#message') as HTMLTextAreaElement).value.trim()
    const checks = form.querySelectorAll('input[type="checkbox"]:checked')
    const challenges = Array.from(checks).map(c => (c as HTMLInputElement).value).join(' | ')

    if (!fname) { setError('Please enter your first name.'); return }
    if (!email || !email.includes('@')) { setError('Please enter a valid email.'); return }
    if (!country) { setError('Please select your country.'); return }

    setSubmitting(true)

    const params = new URLSearchParams({
      fname, lname, email, country, year, challenges, message,
      timestamp: new Date().toISOString(),
    })

    const img = new Image()
    const timer = setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 4000)
    img.onload = img.onerror = () => { clearTimeout(timer); setSubmitting(false); setSubmitted(true) }
    img.src = GOOGLE_SHEET_URL + '?' + params.toString()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.72rem 1rem',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.9rem',
    color: 'var(--ink)',
    background: 'var(--india-white)',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.73rem',
    fontWeight: 600,
    color: 'var(--ink-muted)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: '0.35rem',
    display: 'block',
  }

  if (submitted) {
    return (
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '2rem', color: 'var(--ink)', marginBottom: '1rem' }}>
            You&apos;re in!
          </h1>
          <p style={{ color: 'var(--ink-muted)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Welcome to the ReturningNRIs founding community. We&apos;ll email you when we launch on 31st March 2026.
          </p>
          <Link href="/" className="btn-primary">Back to home →</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* HEADER */}
      <section style={{ background: 'var(--white)', padding: '4rem 2rem 3rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="section-label">Join the Waitlist</div>
          <h1 className="section-title">Secure your founding spot</h1>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            First 200 members get lifetime free access to all tools. 35 spots remaining. Launching 31st March 2026.
          </p>
        </div>
      </section>

      {/* FORM + PERKS */}
      <section style={{ padding: '4rem 2rem 5rem', background: 'var(--white)' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem',
          alignItems: 'start',
        }}>

          {/* LEFT — PERKS */}
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '1.5rem' }}>
              What founding members get
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { icon: '🎁', title: 'Free lifetime access', desc: 'RNOR calculator, city match, school finder, return planner — free forever. No subscription ever.' },
                { icon: '💬', title: 'Direct founder access', desc: 'Ask us anything. Your questions shape what gets built next. Not a support ticket — a direct line.' },
                { icon: '🚀', title: 'First access on launch day', desc: 'No waiting in a queue. Waitlist members get in first on 31st March 2026.' },
                { icon: '🤝', title: 'Founding community', desc: 'Connect with 165+ NRIs planning the same move. Share experiences, get honest answers.' },
              ].map((p) => (
                <div key={p.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: 'var(--saffron-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px' }}>{p.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', lineHeight: 1.55 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
              165 people already on the list. No spam, ever.
            </p>
          </div>

          {/* RIGHT — FORM */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle} htmlFor="fname">First Name</label>
                <input id="fname" type="text" placeholder="Rahul" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="lname">Last Name</label>
                <input id="lname" type="text" placeholder="Sharma" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor="email">Email Address</label>
              <input id="email" type="email" placeholder="rahul@company.com" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor="country">Country You Are Moving From</label>
              <select id="country" style={inputStyle}>
                <option value="">Select country…</option>
                {['United States', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'UAE', 'Germany', 'Netherlands', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor="year">Target Return Year</label>
              <select id="year" style={inputStyle}>
                <option value="">Select…</option>
                <option value="2025">2025 — Already moved / wrapping up</option>
                <option value="2026">2026 — This year</option>
                <option value="2027">2027</option>
                <option value="2028">2028+</option>
                <option value="exploring">Still exploring</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                Your Challenges Right Now{' '}
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                  (select all that apply)
                </span>
              </label>
              <div style={{
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--india-white)',
                padding: '0.75rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}>
                {[
                  'Tax planning — RNOR, RSUs, 401(k)',
                  'Choosing the right city to move to',
                  "Kids' school admissions & curriculum",
                  'Finding a job or keeping remote work',
                  "Don't know where to even start",
                  'Getting my spouse or family aligned',
                  'Understanding what to do with US assets',
                  'Healthcare & insurance in India',
                ].map((challenge) => (
                  <label key={challenge} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    color: 'var(--ink-muted)',
                    fontWeight: 400,
                  }}>
                    <input
                      type="checkbox"
                      value={challenge}
                      style={{ width: '15px', height: '15px', accentColor: 'var(--saffron)', flexShrink: 0 }}
                    />
                    {challenge}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle} htmlFor="message">Anything else? (Optional)</label>
              <textarea
                id="message"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Your specific situation or what you most need help with…"
              />
            </div>

            {error && (
              <p style={{ color: '#cc2200', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: submitting ? 'var(--ink-soft)' : 'var(--saffron)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Submitting…' : 'Join the Waitlist — Free →'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', textAlign: 'center', marginTop: '0.85rem' }}>
              🔒 No spam. No credit card. Your data is never sold or shared.
            </p>
          </form>
        </div>
      </section>

      {/* FEEDBACK STRIP */}
      <section style={{ background: 'var(--white)', padding: '3rem 2rem' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.2rem', color: 'var(--ink)', marginBottom: '0.4rem' }}>
              Have a suggestion or feedback?
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
              We read every message. If you have a specific situation, a tool idea, or just want to say hi — reach out directly.
              This is a founder-built product and your input shapes what gets built next.
            </p>
          </div>
          <a
            href="mailto:hello@returningnris.com?subject=Feedback for ReturningNRIs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--saffron-light)',
              border: '1px solid rgba(255,153,51,0.25)',
              color: 'var(--saffron-dark)',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.6rem 1.25rem',
              borderRadius: '100px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ✉ hello@returningnris.com
          </a>
        </div>
      </section>
    </>
  )
}
