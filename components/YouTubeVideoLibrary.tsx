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
    <div className="space-y-12 lg:space-y-16">
      <section aria-labelledby="videos-featured-heading">
        <div className="overflow-hidden rounded-[36px] border border-[rgba(29,22,15,0.1)] bg-white p-4 shadow-[0_28px_60px_rgba(29,22,15,0.08)] sm:p-5">
          <div className="mb-8 max-w-[760px]">
            <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
              Featured video
            </div>
            <h2 id="videos-featured-heading" className="mb-3 text-[clamp(2rem,3vw,3rem)] leading-[1.04] text-[var(--ink)]">
              {feed.featuredVideo?.title ?? 'Latest guidance from ReturningNRIs'}
            </h2>
            <p className="max-w-[620px] text-[15px] leading-7 text-[var(--ink-muted)]">
              {feed.featuredVideo?.description ?? 'Start with the newest featured guidance, then browse the rest of the library below.'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.28fr)_340px] lg:items-stretch">
            <YouTubeEmbed
              className="aspect-video min-h-[200px] overflow-hidden rounded-[28px] bg-[#f3eee6]"
              src={embedSrc}
              title={embedTitle}
            />

            <aside className="flex h-full flex-col rounded-[28px] border border-[rgba(29,22,15,0.08)] bg-[#fffaf4] p-6 sm:p-7">
              <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#8d5c22]">
                Watch next
              </div>
              <p className="mb-6 text-[15px] leading-7 text-[var(--ink-muted)]">
                Short, practical videos on RNOR, logistics, and family planning for a smoother move back.
              </p>

              <div className="mt-auto grid gap-3">
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
              </div>
            </aside>
          </div>
        </div>
      </section>

      {feed.videos.length > 0 ? (
        <section aria-labelledby="all-videos-heading">
          <div className="mb-8 max-w-[760px]">
            <div className="section-label">Recent videos</div>
            <h2 id="all-videos-heading" className="section-title">
              More guidance for returning NRIs
            </h2>
            <p className="section-sub max-w-[640px]">
              Browse recent videos on RNOR, moving logistics, and everyday planning decisions.
            </p>
          </div>

          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
