import type { Metadata } from 'next'
import Link from 'next/link'
import YouTubeEmbed from '../../components/youtube/YouTubeEmbed'
import YouTubeVideoCard from '../../components/youtube/YouTubeVideoCard'
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

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.9" r="0.9" fill="currentColor" />
    </svg>
  )
}

export default async function VideosPage() {
  const feed = await getYouTubeFeed(youtubeFeedConfig)
  const featuredVideo = feed?.featuredVideo
  const deepDiveVideos: YouTubeFeedItem[] = feed
    ? [featuredVideo, ...feed.videos].filter((video, index, array): video is YouTubeFeedItem => {
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
        .videos-grid-2,
        .videos-grid-4 {
          display: grid;
          gap: 1rem;
        }
        .videos-grid-2 {
          grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
        }
        .videos-grid-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        @media (max-width: 1024px) {
          .videos-grid-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 900px) {
          .videos-grid-2 {
            grid-template-columns: 1fr;
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

      <section className="border-b border-[rgba(29,22,15,0.08)] bg-[linear-gradient(180deg,#fffaf4_0%,#fffdf9_100%)] py-12 lg:py-16">
        <div className="videos-shell">
          <div className="videos-grid-2">
            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(29,22,15,0.08)',
                borderRadius: 30,
                padding: '1.4rem',
                boxShadow: '0 22px 48px rgba(29,22,15,0.06)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.45rem 0.8rem',
                  borderRadius: 999,
                  background: '#fff1de',
                  color: '#8d5c22',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.95rem',
                }}
              >
                Videos & Short Tips
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.25rem, 6vw, 4.3rem)',
                  lineHeight: 0.98,
                  color: '#1a1208',
                  marginBottom: '0.85rem',
                  maxWidth: 640,
                }}
              >
                Watch, learn, and plan your move back to India.
              </h1>

              <p
                style={{
                  fontSize: 16,
                  color: '#5c5346',
                  lineHeight: 1.75,
                  maxWidth: 620,
                  marginBottom: '1rem',
                }}
              >
                Deep-dive YouTube guides and short Instagram tips for NRIs preparing their return.
              </p>

              <div className="videos-action-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#youtube-guides" className="btn-primary">
                  Watch YouTube Guides
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Follow Instagram Reels
                </a>
                <Link href="/community#join-community" className="btn-secondary">
                  Join WhatsApp Community
                </Link>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(180deg, rgba(30,22,15,0.98) 0%, rgba(35,25,18,0.97) 58%, rgba(24,52,37,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 30,
                padding: '1.25rem',
                boxShadow: '0 26px 56px rgba(18,13,8,0.16)',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.62)', marginBottom: 8 }}>
                Learn Faster
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', marginBottom: '0.9rem' }}>
                Pick the format that fits your moment
              </h2>

              {channelCards.map((card, index) => (
                <div
                  key={card.title}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.9rem',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: index === channelCards.length - 1 ? 0 : '0.75rem',
                  }}
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 14,
                      background: card.title === 'WhatsApp' ? 'rgba(19,136,8,0.2)' : 'rgba(255,153,51,0.16)',
                      color: card.title === 'WhatsApp' ? '#6ad182' : '#f3b163',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{card.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>{card.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featuredVideo ? (
        <section className="py-12 lg:py-16">
          <div className="videos-shell">
            <div style={{ marginBottom: '1rem' }}>
              <div className="section-label">Featured Guide</div>
              <h2 className="section-title" style={{ marginBottom: '0.45rem' }}>
                Start with one deep-dive guide
              </h2>
              <p className="section-sub">
                If you only watch one long-form video first, make it this one.
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid rgba(29,22,15,0.08)',
                borderRadius: 32,
                padding: '1rem',
                boxShadow: '0 24px 52px rgba(29,22,15,0.06)',
              }}
            >
              <div className="overflow-hidden rounded-[26px] border border-[rgba(29,22,15,0.08)] bg-[#f3eee6]">
                <YouTubeEmbed
                  className="aspect-video w-full min-h-[220px] bg-[#f3eee6]"
                  src={featuredVideo.embedUrl}
                  title={featuredVideo.title}
                />
              </div>

              <div
                className="videos-action-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginTop: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ maxWidth: 640 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1208', marginBottom: 6 }}>{featuredVideo.title}</div>
                  <p style={{ fontSize: 15, color: '#5c5346', lineHeight: 1.7 }}>
                    {featuredVideo.description ?? 'A practical starting point for families planning the move back to India.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                  <a href={featuredVideo.watchUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Watch on YouTube
                  </a>
                  {feed?.channelUrl ? (
                    <a href={feed.channelUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                      Visit YouTube Channel
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
                <InstagramIcon />
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
