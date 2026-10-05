'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HALLOWEEN_PATH, HALLOWEEN_TIMINGS, HALLOWEEN_VENUE } from '@/lib/halloween'
import styles from './HalloweenPopup.module.css'
import HalloweenArtwork from './HalloweenArtwork'

const dismissalKey = 'halloween-2026-popup-dismissed'

export default function HalloweenPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // End the promotion when the event finishes at 9 PM in Hyderabad.
    if (Date.now() >= Date.parse('2026-10-31T21:00:00+05:30')) return
    let dismissed = false
    try { dismissed = sessionStorage.getItem(dismissalKey) === 'yes' } catch { /* Storage is optional. */ }
    const timer = window.setTimeout(() => { if (!dismissed) setVisible(true) }, 800)
    return () => window.clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    try { sessionStorage.setItem(dismissalKey, 'yes') } catch { /* Closing still works without storage. */ }
  }

  if (!visible) return null

  return <aside className={styles.popup} aria-label="Halloween party invitation"
    onKeyDown={event => { if (event.key === 'Escape') dismiss() }}>
    <button type="button" className={styles.close} aria-label="Close Halloween invitation" onClick={dismiss}>×</button>
    <Link href={HALLOWEEN_PATH} className={styles.invitation} onClick={dismiss}>
      <HalloweenArtwork className={styles.artwork} />
      <span className={styles.label}>A family community event</span>
      <h2>Halloween Party</h2>
      <p className={styles.date}>31 October 2026 · {HALLOWEEN_TIMINGS} IST</p>
      <p>{HALLOWEEN_VENUE}</p>
      <p className={styles.activities}>Music to keep the evening lively · Trick or treat · Exciting games for kids</p>
      <p className={styles.food}>Food available for purchase</p>
      <span className={styles.cta}>View party details <span aria-hidden="true">→</span></span>
    </Link>
  </aside>
}
