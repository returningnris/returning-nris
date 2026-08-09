import type { Metadata } from 'next'
import Link from 'next/link'
import YouTubeVideoCard from '../../components/youtube/YouTubeVideoCard'
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from '../../lib/social-icons'
import { INSTAGRAM_URL } from '../../lib/social-links'
import { getYouTubeFeed, type YouTubeFeedItem } from '../../lib/youtube-feed'
import { youtubeFeedConfig } from '../../lib/youtube-feed-config'

export const metadata: Metadata = {
  title: 'Returning NRI Videos & Short Tips | YouTube and Instagram',
  description:
    'Watch Returning NRI YouTube guides and follow short Instagram tips on RNOR, schools, housing, money, Hyderabad living, and settling back in India.',
  alternates: {
    canonical: 'https://www.returningnris.com/videos',
  },
  openGraph: {
    title: 'Returning NRI Videos & Short Tips | YouTube and Instagram',
    description:
      'Watch Returning NRI YouTube guides and follow short Instagram tips on RNOR, schools, housing, money, Hyderabad living, and settling back in India.',
    url: 'https://www.returningnris.com/videos',
    siteName: 'ReturningNRIs',
    type: 'website',
    images: ['https://www.returningnris.com/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Returning NRI Videos & Short Tips | YouTube and Instagram',
    description:
      'Watch Returning NRI YouTube guides and follow short Instagram tips on RNOR, schools, housing, money, Hyderabad living, and settling back in India.',
    images: ['https://www.returningnris.com/og-image.png'],
  },
}

const instagramTopics = [
  'RNOR & Tax',
  'Schools',
  'Hyderabad Living',
  'Housing',
  'Money & Banking',
  'First 90 Days',
]

const channelCards = [
  {
    title: 'Website Planner',
    body: 'Structured move-back plan',
  },
  {
    title: 'YouTube',
    body: 'Deep-dive explainers',
  },
  {
    title: 'Instagram',
    body: 'Quick reels and reminders',
  },
  {
    title: 'WhatsApp',
    body: 'Real community and discussions',
  },
]

export default async function VideosPage() {
  const feed = await getYouTubeFeed(youtubeFeedConfig)
  const deepDiveVideos: YouTubeFeedItem[] = feed
    ? [feed.featuredVideo, ...feed.videos].filter((video, index, array): video is YouTubeFeedItem => {
        if (!video) {
          return false
        }

        return array.findIndex((entry) => entry?.id === video.id) === index
      })
    : []

  return (
    <main className="bg-[#fffdf9]">
      <style>{`
        .videos-shell {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .videos-grid-4 {
          display: grid;
          gap: 1rem;
        }
        .videos-grid-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        @media (max-width: 1024px) {
          .videos-grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 767px) {
          .videos-shell {
            padding: 0 0.95rem;
          }
          .videos-grid-4 {
            grid-template-columns: 1fr;
          }
          .videos-action-row {
            flex-direction: column;
            align-items: stretch !important;
          }
          .videos-action-row a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <section className="pb-12 lg:pb-16">
        <div className="videos-shell">
          <div
            style={{
              borderRadius: 32,
              border: '1px solid rgba(29,22,15,0.08)',
              background: 'linear-gradient(135deg, #fff5ea 0%, #ffffff 65%, #f7fbf8 100%)',
              padding: '1.25rem',
              boxShadow: '0 18px 40px rgba(29,22,15,0.05)',
            }}
          >
            <div className="section-label">Instagram</div>
            <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
              Short move-back tips on Instagram
            </h2>
            <p className="section-sub" style={{ maxWidth: 650, marginBottom: '1rem' }}>
              Follow quick reels on RNOR, schools, Hyderabad living, housing, money, and the first 90 days after returning to India.
            </p>

            <div
              className="videos-action-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', maxWidth: 700 }}>
                {instagramTopics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.45rem 0.75rem',
                      borderRadius: 999,
                      background: '#ffffff',
                      border: '1px solid rgba(29,22,15,0.08)',
                      color: '#4f4336',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  minHeight: 46,
                  padding: '0.85rem 1.1rem',
                  borderRadius: 999,
                  background: '#1a1208',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                <InstagramIcon size={18} />
                Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="youtube-guides" className="pb-12 lg:pb-16">
        <div className="videos-shell">
          <div
            className="videos-action-row"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            <div>
              <div className="section-label">YouTube</div>
              <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
                Deep-dive YouTube guides
              </h2>
              <p className="section-sub">
                Longer explainers for the questions that need more than a 30-second answer.
              </p>
            </div>

            {feed?.playlistUrl ? (
              <a href={feed.playlistUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <YouTubeIcon size={18} />
                Open Playlist
              </a>
            ) : null}
          </div>

          {deepDiveVideos.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {deepDiveVideos.map((video) => (
                <li key={video.id} className="h-full">
                  <YouTubeVideoCard video={video} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              style={{
                borderRadius: 28,
                border: '1px solid rgba(29,22,15,0.08)',
                background: '#ffffff',
                padding: '1.2rem',
                color: '#5c5346',
              }}
            >
              Videos will appear here as guides are added.
            </div>
          )}
        </div>
      </section>

      <section className="pb-16 lg:pb-20">
        <div className="videos-shell">
          <div
            style={{
              borderRadius: 32,
              border: '1px solid rgba(19,136,8,0.14)',
              background: 'linear-gradient(135deg, #f3fbf4 0%, #ffffff 70%)',
              padding: '1.35rem',
              boxShadow: '0 22px 46px rgba(19,136,8,0.06)',
            }}
          >
            <div className="section-label" style={{ color: '#138808' }}>
              Community
            </div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>
              Want to discuss your move with other returnees?
            </h2>
            <p style={{ maxWidth: 620, fontSize: 15, color: '#4f4336', lineHeight: 1.7, marginBottom: '1rem' }}>
              Join our Returning NRI WhatsApp Community with 250+ active Hyderabad members.
            </p>

            <div className="videos-grid-4">
              {channelCards.map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(19,136,8,0.12)',
                    borderRadius: 22,
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1208', marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 14, color: '#5c5346', lineHeight: 1.6 }}>{card.body}</div>
                </div>
              ))}
            </div>

            <div className="videos-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Link href="/community#join-community" className="btn-secondary">
                <WhatsAppIcon size={18} />
                Join WhatsApp Community
              </Link>
              <Link href="/planner" className="btn-ghost">
                Start Planner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
