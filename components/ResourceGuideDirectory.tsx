'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Article } from '../lib/articles-data'

const categories = ['All', 'Tax Planning', 'Housing', 'Financial Planning', 'Decision Making', 'Planning', 'Schools']

export default function ResourceGuideDirectory({ guides }: { guides: Article[] }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const filteredGuides = useMemo(
    () => (activeCategory === 'All' ? guides : guides.filter((guide) => guide.category === activeCategory)),
    [activeCategory, guides],
  )

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: '13px', color: '#6B5E50' }} aria-live="polite">
          <strong style={{ color: '#1A1208' }}>{filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''}</strong> {activeCategory === 'All' ? 'for returning NRIs' : `in ${activeCategory}`}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} aria-label="Filter guides by category">
          {categories.map((category) => {
            const isActive = category === activeCategory
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                style={{ fontSize: '12px', padding: '5px 12px', borderRadius: '100px', background: isActive ? '#1A1208' : '#fff', color: isActive ? '#fff' : '#6B5E50', border: '1px solid #E5E1DA', fontWeight: isActive ? 600 : 400, cursor: 'pointer' }}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredGuides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="guide-card" style={{ textDecoration: 'none', display: 'block', background: '#fff', border: '1px solid #E5E1DA', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            {guide.thumbnail && (
              <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#F8F5F0' }}>
                <Image src={guide.thumbnail.src} alt={guide.thumbnail.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 320px" quality={70} loading="lazy" decoding="async" style={{ objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              {!guide.thumbnail && <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFF3E6', border: '1px solid rgba(255,153,51,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1rem' }}>{guide.icon}</div>}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: '#FFF3E6', color: '#CC7A00', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{guide.category}</span>
                <span style={{ fontSize: '10px', color: '#B5A898', padding: '2px 8px', background: '#F8F5F0', borderRadius: '100px' }}>{guide.readMins} min read</span>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem', color: '#1A1208', lineHeight: 1.35, marginBottom: '0.5rem' }}>{guide.label}</h2>
              <p style={{ fontSize: '13px', color: '#6B5E50', lineHeight: 1.6, marginBottom: '1rem' }}>{guide.sub}</p>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#FF9933' }}>Read guide</div>
            </div>
          </Link>
        ))}
        <div style={{ background: 'rgba(255,153,51,0.04)', border: '1.5px dashed rgba(255,153,51,0.3)', borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '220px' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>More soon</div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#6B5E50', marginBottom: '4px' }}>More guides coming</div>
          <div style={{ fontSize: '12px', color: '#B5A898', lineHeight: 1.5 }}>More on RNOR, city comparisons, school transitions, housing, and financial planning</div>
        </div>
      </div>
      <style>{`.guide-card { transition: transform 0.2s, box-shadow 0.2s; } .guide-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important; }`}</style>
    </div>
  )
}
