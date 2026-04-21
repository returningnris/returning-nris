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
        <div className="mx-auto mb-10 max-w-[760px] text-center lg:mb-12">
          <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
            ReturningNRIs on YouTube
          </div>
          <h2 id="homepage-videos-heading" className="mb-4 text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.02] text-[var(--ink)]">
            Start Here: Watch Our Latest Guidance
          </h2>
          <p className="mx-auto max-w-[620px] text-[16px] leading-8 text-[var(--ink-muted)]">
            One practical video to help you think through the move back to India with more clarity.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px] lg:gap-8">
          <div className="order-1">
            <div className="overflow-hidden rounded-[32px] border border-[rgba(29,22,15,0.1)] bg-white p-3 shadow-[0_28px_60px_rgba(29,22,15,0.08)] sm:p-4">
              <YouTubeEmbed
                className="aspect-video min-h-[200px] overflow-hidden rounded-[24px] bg-[#f3eee6]"
                src={embedSrc}
                title={embedTitle}
              />
            </div>
          </div>

          <aside className="order-2 flex h-full flex-col rounded-[28px] border border-[rgba(29,22,15,0.08)] bg-white p-6 shadow-[0_20px_44px_rgba(29,22,15,0.06)] sm:p-7">
            <div className="mb-4 inline-flex rounded-full bg-[#f8f5f0] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              Featured video
            </div>
            <h3 className="mb-3 text-[28px] leading-[1.12] text-[var(--ink)]">
              {feed.featuredVideo?.title ?? 'Watch our latest featured guidance'}
            </h3>
            <p className="mb-6 text-[15px] leading-7 text-[var(--ink-muted)]">
              {feed.featuredVideo?.description ?? 'A calm starting point for understanding the move back to India with more clarity.'}
            </p>

            <div className="mt-auto flex flex-col gap-3">
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
          </aside>
        </div>
      </div>
    </section>
  )
}
