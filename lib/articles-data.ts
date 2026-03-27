// ─── ARTICLES DATA ────────────────────────────────────────────────────────────
// Single source of truth for all Resource Guide articles.
// Imported by:  app/NavBar.tsx        → nav dropdown
//               app/resources/page.tsx → index page
//
// To add a new article: add one entry here.
// It auto-appears in both places — nothing else to change.

export type Article = {
  href: string
  label: string
  icon: string
  sub: string
  category: string
  readMins: number
}

export const ARTICLES: Article[] = [
  {
    href: '/resources/should-i-return-to-india-from-usa',
    label: 'Should I return to India from the USA?',
    icon: '🤔',
    sub: '2026 decision guide for NRIs',
    category: 'Decision Making',
    readMins: 8,
  },
  {
    href: '/resources/nri-returning-to-india-checklist',
    label: 'NRI Returning to India Checklist',
    icon: '✅',
    sub: '14-step complete guide across 4 phases',
    category: 'Planning',
    readMins: 12,
  },
  {
    href: '/resources/rnor-status-nri-returning-to-india',
    label: 'RNOR Status Explained for Returning NRIs',
    icon: '📊',
    sub: 'How to save ₹18–60L on your return',
    category: 'Tax Planning',
    readMins: 10,
  },
  {
    href: '/resources/ib-cambridge-cbse-icse-guide-for-returning-nris',
    label: 'IB vs Cambridge vs CBSE vs ICSE for Returning NRIs',
    icon: '🎓',
    sub: 'Which school board fits your child and your move plan',
    category: 'Schools',
    readMins: 9,
  },
]
