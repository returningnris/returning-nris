import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: [
      '/events/halloween/booking', '/events/halloween/ticket', '/events/halloween/check-in', '/api/halloween',
    ] },
    sitemap: 'https://www.returningnris.com/sitemap.xml',
  }
}
