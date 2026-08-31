import { MetadataRoute } from 'next'
import { ARTICLES } from '../lib/articles-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const guides = ARTICLES.map((article) => ({
    url: `https://www.returningnris.com${article.href}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://www.returningnris.com', lastModified },
    { url: 'https://www.returningnris.com/planner', lastModified },
    { url: 'https://www.returningnris.com/journey', lastModified },
    { url: 'https://www.returningnris.com/community', lastModified },
    { url: 'https://www.returningnris.com/videos', lastModified },
    { url: 'https://www.returningnris.com/resources', lastModified },
    ...guides,
    { url: 'https://www.returningnris.com/rnor', lastModified },
    { url: 'https://www.returningnris.com/city', lastModified },
    { url: 'https://www.returningnris.com/schools', lastModified },
    { url: 'https://www.returningnris.com/housing', lastModified },
    { url: 'https://www.returningnris.com/healthcare', lastModified },
    { url: 'https://www.returningnris.com/citylife', lastModified },
    { url: 'https://www.returningnris.com/jobs', lastModified },
    { url: 'https://www.returningnris.com/our-story', lastModified },
  ]
}
