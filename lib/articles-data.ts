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
]