import Link from 'next/link'
import { youtubeFeedConfig } from '../lib/youtube-feed-config'
import { getYouTubeFeed, type YouTubeFeedConfig } from '../lib/youtube-feed'
import YouTubeEmbed from './youtube/YouTubeEmbed'
import YouTubeVideoCard from './youtube/YouTubeVideoCard'

type YouTubeVideoLibraryProps = {
  config?: YouTubeFeedConfig
}

export default async function YouTubeVideoLibrary({
  config = youtubeFeedConfig,
}: YouTubeVideoLibraryProps) {
  const feed = await getYouTubeFeed(config)

  if (!feed?.featuredVideo && !feed?.playlistEmbedUrl) {
    return null
  }

  const embedSrc = feed.featuredVideo?.embedUrl ?? feed.playlistEmbedUrl
  const embedTitle = feed.featuredVideo?.title ?? 'ReturningNRIs videos'

  if (!feed || !embedSrc) {
    return null
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <section aria-labelledby="videos-featured-heading">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <div className="overflow-hidden rounded-[32px] border border-[rgba(29,22,15,0.1)] bg-white p-3 shadow-[0_28px_60px_rgba(29,22,15,0.08)] sm:p-4">
            <YouTubeEmbed
              className="aspect-video min-h-[200px] overflow-hidden rounded-[24px] bg-[#f3eee6]"
              src={embedSrc}
              title={embedTitle}
            />
          </div>

          <div className="rounded-[28px] border border-[rgba(29,22,15,0.1)] bg-white p-6 shadow-[0_20px_44px_rgba(29,22,15,0.06)] sm:p-7">
            <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
              Featured video
            </div>
            <h2 id="videos-featured-heading" className="mb-3 text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.04] text-[var(--ink)]">
              {feed.featuredVideo?.title ?? 'Latest guidance from ReturningNRIs'}
            </h2>
            <p className="mb-6 text-[15px] leading-8 text-[var(--ink-muted)]">
              {feed.featuredVideo?.description ?? 'Start with the newest featured guidance, then browse the rest of the video library below.'}
            </p>

            <div className="grid gap-3">
              {feed.featuredVideo ? (
                <a
                  className="btn-primary justify-center"
                  href={feed.featuredVideo.watchUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Watch on YouTube
                </a>
              ) : null}
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
              <Link
                className="inline-flex justify-center text-sm font-semibold text-[var(--ink)] underline decoration-[rgba(29,22,15,0.22)] underline-offset-4 transition-colors duration-200 hover:text-[#8d5c22]"
                href="/resources"
              >
                Prefer reading first? Explore our move-back guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {feed.videos.length > 0 ? (
        <section aria-labelledby="all-videos-heading">
          <div className="mb-6 max-w-[760px]">
            <div className="section-label">Recent videos</div>
            <h2 id="all-videos-heading" className="section-title">
              More guidance for returning NRIs
            </h2>
            <p className="section-sub max-w-[640px]">
              Browse recent videos on RNOR, relocation logistics, family planning, and the everyday decisions that shape a smoother move back to India.
            </p>
          </div>

          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {feed.videos.map((video) => (
              <li key={video.id} className="h-full">
                <YouTubeVideoCard video={video} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
