import Link from 'next/link'
import Image from 'next/image'
import { youtubeFeedConfig } from '../lib/youtube-feed-config'
import { getYouTubeFeed, type YouTubeFeedConfig } from '../lib/youtube-feed'

type YouTubeFeedProps = {
  config?: YouTubeFeedConfig
  heading?: string
  subheading?: string
}

export default async function YouTubeFeed({
  config = youtubeFeedConfig,
  heading = 'Watch Our Latest Videos',
  subheading = 'Practical videos on returning to India, RNOR, shipping, and everyday move-back decisions for NRI families.',
}: YouTubeFeedProps) {
  const feed = await getYouTubeFeed(config)

  if (!feed?.featuredEmbedUrl) {
    return null
  }

  return (
    <section
      aria-labelledby="youtube-feed-heading"
      className="bg-[#fffdf9] py-20"
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
        <div className="mx-auto mb-10 max-w-[760px] text-center">
          <div className="section-label">ReturningNRIs on YouTube</div>
          <h2 id="youtube-feed-heading" className="section-title">
            {heading}
          </h2>
          <p className="section-sub mx-auto">{subheading}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="overflow-hidden rounded-[28px] border border-[rgba(29,22,15,0.1)] bg-white shadow-[0_24px_54px_rgba(29,22,15,0.06)]">
            <div className="aspect-video min-h-[200px] w-full bg-[#f3eee6]">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={feed.featuredEmbedUrl}
                title={feed.featuredTitle ?? heading}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(29,22,15,0.1)] bg-white p-6 shadow-[0_24px_54px_rgba(29,22,15,0.06)] sm:p-7">
            <div className="mb-4 inline-flex rounded-full bg-[#fff1de] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8d5c22]">
              Practical video guidance
            </div>
            <h3 className="mb-3 text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.05] text-[var(--ink)]">
              Watch real move-back decisions, family tradeoffs, and planning tips
            </h3>
            <p className="mb-6 text-[15px] leading-8 text-[var(--ink-muted)]">
              Give visitors a fast way to learn from ReturningNRIs videos on RNOR, relocation logistics, and settling back into India without slowing down the homepage.
            </p>

            <div className="grid gap-3">
              {feed.channelUrl ? (
                <a
                  className="btn-primary justify-center"
                  href={feed.channelUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit our YouTube channel
                </a>
              ) : null}

              {feed.playlistUrl ? (
                <a
                  className="btn-ghost justify-center"
                  href={feed.playlistUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Browse the latest playlist
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

        {feed.videos.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {feed.videos.map((video) => (
              <li key={video.id} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[rgba(29,22,15,0.1)] bg-white shadow-[0_18px_40px_rgba(29,22,15,0.05)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(29,22,15,0.08)]">
                  <a
                    aria-label={`Watch ${video.title} on YouTube`}
                    className="flex h-full flex-col"
                    href={video.watchUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#f3eee6]">
                      <Image
                        alt={video.title}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        fill
                        loading="lazy"
                        sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
                        src={video.thumbnailUrl}
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-[rgba(20,16,12,0.8)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                        Recent video
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-3 text-xl leading-8 text-[var(--ink)] transition-colors duration-200 group-hover:text-[#8d5c22]">
                        {video.title}
                      </h3>
                      <span className="mt-auto inline-flex items-center text-sm font-semibold text-[var(--ink)]">
                        Watch on YouTube
                      </span>
                    </div>
                  </a>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-[24px] border border-[rgba(29,22,15,0.1)] bg-white p-6 text-center shadow-[0_18px_40px_rgba(29,22,15,0.05)]">
            <p className="mx-auto max-w-[640px] text-[15px] leading-8 text-[var(--ink-muted)]">
              Add recent video URLs in the local feed config if you want titled video cards here without using the YouTube Data API.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
