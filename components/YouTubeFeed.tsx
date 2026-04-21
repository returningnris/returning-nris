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
    <section aria-labelledby="homepage-videos-heading" className="bg-[#fffaf4] py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] lg:gap-10">
          <div className="order-2 lg:order-1">
            <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
              ReturningNRIs on YouTube
            </div>
            <h2 id="homepage-videos-heading" className="mb-4 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.02] text-[var(--ink)]">
              Start Here: Watch Our Latest Guidance
            </h2>
            <p className="mb-6 max-w-[560px] text-[16px] leading-8 text-[var(--ink-muted)]">
              Begin with one practical video that helps returning NRIs think through real move-back decisions, family tradeoffs, and what usually matters first.
            </p>
            <div className="grid max-w-[520px] gap-4 rounded-[28px] border border-[rgba(29,22,15,0.08)] bg-white/80 p-6 shadow-[0_18px_40px_rgba(29,22,15,0.05)]">
              <div>
                <h3 className="mb-2 text-[24px] leading-8 text-[var(--ink)]">
                  {feed.featuredVideo?.title ?? 'Watch our latest featured guidance'}
                </h3>
                <p className="text-[15px] leading-7 text-[var(--ink-muted)]">
                  {feed.featuredVideo?.description ?? 'A calm starting point for understanding the move back to India with more clarity and fewer rushed decisions.'}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/videos" className="btn-primary justify-center">
                  Explore All Videos
                </Link>
                {feed.channelUrl ? (
                  <a
                    className="btn-ghost justify-center"
                    href={feed.channelUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Visit YouTube Channel
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[32px] border border-[rgba(29,22,15,0.1)] bg-white p-3 shadow-[0_28px_60px_rgba(29,22,15,0.08)] sm:p-4">
              <YouTubeEmbed
                className="aspect-video min-h-[200px] overflow-hidden rounded-[24px] bg-[#f3eee6]"
                src={embedSrc}
                title={embedTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
