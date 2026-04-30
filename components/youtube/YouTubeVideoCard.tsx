import Image from 'next/image'
import { YouTubeIcon } from '../../lib/social-icons'
import type { YouTubeFeedItem } from '../../lib/youtube-feed'

type YouTubeVideoCardProps = {
  video: YouTubeFeedItem
}

export default function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-[rgba(29,22,15,0.1)] bg-white shadow-[0_18px_40px_rgba(29,22,15,0.05)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(29,22,15,0.08)]">
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
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 50vw, 100vw"
            src={video.thumbnailUrl}
          />
          <div className="absolute left-4 top-4 rounded-full bg-[rgba(20,16,12,0.82)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            Recent video
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-3 text-[20px] leading-7 text-[var(--ink)] transition-colors duration-200 group-hover:text-[#8d5c22]">
            {video.title}
          </h3>
          {video.description ? (
            <p className="mb-5 text-[14px] leading-7 text-[var(--ink-muted)]">
              {video.description}
            </p>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
            <YouTubeIcon size={16} />
            Watch on YouTube
          </span>
        </div>
      </a>
    </article>
  )
}
