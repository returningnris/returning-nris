import Link from 'next/link'
import { youtubeFeedConfig } from '../lib/youtube-feed-config'
import { getYouTubeFeed, type YouTubeFeedConfig } from '../lib/youtube-feed'
import YouTubeEmbed from './youtube/YouTubeEmbed'

type YouTubeFeedProps = {
  config?: YouTubeFeedConfig
}

export default async function YouTubeFeed({ config = youtubeFeedConfig }: YouTubeFeedProps) {
  const feed = await getYouTubeFeed(config)

  if (!feed?.featuredVideo && !feed?.playlistEmbedUrl) {
    return null
  }

  const embedSrc = feed.featuredVideo?.embedUrl ?? feed.playlistEmbedUrl
  const embedTitle = feed.featuredVideo?.title ?? 'ReturningNRIs videos'

  if (!embedSrc) {
    return null
  }

  return (
    <section
      aria-labelledby="homepage-videos-heading"
      style={{
        background: '#fffaf4',
        padding: '2.5rem 0 6rem',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
            ReturningNRIs on YouTube
          </div>
          <h2
            id="homepage-videos-heading"
            className="mb-4 text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.02] text-[var(--ink)]"
          >
            Start Here: Watch Our Latest Guidance
          </h2>
          <p className="mx-auto mb-8 max-w-[600px] text-[16px] leading-8 text-[var(--ink-muted)] lg:mb-10">
            One practical video to help you think through the move back to India with more clarity.
          </p>

          <div
            style={{
              width: '100%',
              maxWidth: 1240,
              margin: '0 auto',
            }}
          >
            <div className="overflow-hidden rounded-[32px] border border-[rgba(29,22,15,0.1)] bg-white p-3 shadow-[0_28px_60px_rgba(29,22,15,0.08)] sm:p-4">
              <YouTubeEmbed
                className="aspect-video w-full min-h-[200px] overflow-hidden rounded-[24px] bg-[#f3eee6]"
                src={embedSrc}
                title={embedTitle}
              />
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/videos" className="btn-primary justify-center">
                Explore All Videos
              </Link>
              {feed.channelUrl ? (
                <a className="btn-ghost justify-center" href={feed.channelUrl} rel="noreferrer" target="_blank">
                  Visit YouTube Channel
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
