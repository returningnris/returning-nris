import { youtubeFeedConfig } from '../lib/youtube-feed-config'
import { getYouTubeFeed, type YouTubeFeedConfig } from '../lib/youtube-feed'
import YouTubeVideoCard from './youtube/YouTubeVideoCard'

type YouTubeVideoLibraryProps = {
  config?: YouTubeFeedConfig
}

export default async function YouTubeVideoLibrary({
  config = youtubeFeedConfig,
}: YouTubeVideoLibraryProps) {
  const feed = await getYouTubeFeed(config)

  if (!feed) {
    return null
  }

  const orderedVideosMap = new Map<string, NonNullable<typeof feed.featuredVideo>>()

  for (const video of [feed.featuredVideo, ...feed.videos]) {
    if (video) {
      orderedVideosMap.set(video.id, video)
    }
  }

  const orderedVideos = Array.from(orderedVideosMap.values())

  if (orderedVideos.length === 0) {
    return null
  }

  return (
    <section aria-label="All videos" className="space-y-8">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {feed.channelUrl ? (
            <a
              className="inline-flex items-center justify-center rounded-[999px] border border-[#c9302c] bg-[#e53935] px-7 py-[0.85rem] text-[0.95rem] font-medium text-white shadow-[0_14px_32px_rgba(229,57,53,0.22)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#a92421] hover:bg-[#c62828]"
              href={feed.channelUrl}
              rel="noreferrer"
              target="_blank"
            >
              Visit YouTube Channel
            </a>
          ) : null}
          {feed.playlistUrl ? (
            <a
              className="btn-primary justify-center"
              href={feed.playlistUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Playlist
            </a>
          ) : null}
      </div>

      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {orderedVideos.map((video) => (
          <li key={video.id} className="h-full">
            <YouTubeVideoCard video={video} />
          </li>
        ))}
      </ul>
    </section>
  )
}
