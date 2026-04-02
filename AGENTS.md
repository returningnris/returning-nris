<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project Overview

This is a Next.js website for Returning NRIs. The site provides tools and content to help NRIs plan their move back to India (readiness, RNOR tax planning, checklist, etc.).

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Deployed on Vercel

## Key Goals

* Keep UI clean, simple, and trustworthy
* Prioritize SEO + readability
* Focus on conversion (users should take action quickly)
* Highlight tools (planner, RNOR, checklist)

## Design Guidelines

* Follow existing spacing, typography, and layout patterns
* Keep sections scannable (short paragraphs, headings)
* Avoid large blocks of text
* Use cards, sections, and CTA buttons consistently

## Content Style

* Human, simple, and practical (not corporate)
* Focus on clarity over jargon
* Write for returning NRIs (US-focused but global-friendly)

## Commands

* npm run dev
* npm run build
* npm run lint

## Conventions

* Reuse existing components whenever possible
* Do not create duplicate UI patterns
* Add internal links between related pages
* Always include SEO metadata (title + description)

## Do NOT

* Do not introduce new dependencies unless necessary
* Do not redesign existing pages unless explicitly asked
* Do not break routing or layout structure

## Definition of Done

* Page renders correctly
* Mobile responsive
* Matches existing UI
* SEO metadata added
* Internal links added
* Build and lint pass without errors
