'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HALLOWEEN_PATH, HALLOWEEN_TIMINGS, HALLOWEEN_VENUE } from '@/lib/halloween'
import styles from './HalloweenPopup.module.css'
import HalloweenArtwork from './HalloweenArtwork'

const collapsedKey = 'halloween-2026-popup-collapsed'

export default function HalloweenPopup() {
  const [visible, setVisible] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    // End the promotion when the event finishes at 9 PM in Hyderabad.
    if (Date.now() >= Date.parse('2026-10-31T21:00:00+05:30')) return
    let savedCollapsed = false
    try { savedCollapsed = localStorage.getItem(collapsedKey) === 'yes' } catch { /* Storage is optional. */ }
    const timer = window.setTimeout(() => { setCollapsed(savedCollapsed); setVisible(true) }, 800)
    return () => window.clearTimeout(timer)
  }, [])

  function toggleCollapsed(next: boolean) {
    setCollapsed(next)
    try { localStorage.setItem(collapsedKey, next ? 'yes' : 'no') } catch { /* The shared layout preserves state without storage. */ }
  }

  if (!visible) return null

  return <aside className={`${styles.popup} ${collapsed ? styles.collapsed : ''}`} aria-label="Halloween party invitation"
    onKeyDown={event => { if (event.key === 'Escape') { toggleCollapsed(true); event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus() } }}>
    <button type="button" className={collapsed ? styles.reopen : styles.close} aria-expanded={!collapsed}
      aria-controls="halloween-invitation" aria-label={collapsed ? 'Open Halloween invitation' : 'Collapse Halloween invitation'}
      onClick={() => toggleCollapsed(!collapsed)}>
      {collapsed ? <><span aria-hidden="true">🎃</span> Halloween Party <span aria-hidden="true">＋</span></> : <span aria-hidden="true">−</span>}
    </button>
    <div id="halloween-invitation" hidden={collapsed}>
    <Link href={HALLOWEEN_PATH} className={styles.invitation}>
      {!collapsed && <HalloweenArtwork animated className={styles.artwork} />}
      <span className={styles.label}>A family community event</span>
      <h2>Halloween Party</h2>
      <p className={styles.date}>31 October 2026 · {HALLOWEEN_TIMINGS} IST</p>
      <p>{HALLOWEEN_VENUE}</p>
      <p className={styles.activities}>Music to keep the evening lively · Trick or treat · Exciting games for kids</p>
      <p className={styles.food}>Food available for purchase</p>
      <span className={styles.cta}>View party details <span aria-hidden="true">→</span></span>
    </Link>
    </div>
  </aside>
}
