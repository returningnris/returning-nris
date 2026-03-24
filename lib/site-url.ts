export function getSiteUrl(request?: Request) {
  const configuredSiteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (configuredSiteUrl) {
    const normalizedUrl = configuredSiteUrl.startsWith('http')
      ? configuredSiteUrl
      : `https://${configuredSiteUrl}`

    return normalizedUrl.replace(/\/$/, '')
  }

  if (request) {
    return new URL(request.url).origin
  }

  return 'http://localhost:3000'
}
