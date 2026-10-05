import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: '/events/halloween/:path*', headers: [
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ] },
      ...['booking', 'ticket', 'check-in'].map(path => ({ source: `/events/halloween/${path}`, headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ] })),
    ]
  },
  images: {
    deviceSizes: [480, 768, 1024, 1400],
    formats: ['image/avif', 'image/webp'],
    qualities: [72, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
}

export default nextConfig
