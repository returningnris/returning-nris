const YOUTUBE_URL_OR_ID_PLACEHOLDER = /^REPLACE_WITH_/i

export type YouTubeFeedMode = 'manual' | 'api'

export type YouTubeVideoInput = {
  title: string
  url?: string
  videoId?: string
}

export type YouTubeFeedConfig = {
  enabled?: boolean
  mode?: YouTubeFeedMode
  channelId?: string
  channelUrl?: string
  playlistId?: string
  videos?: YouTubeVideoInput[]
  api?: {
    maxResults?: number
  }
}

export type YouTubeFeedItem = {
  id: string
  title: string
  watchUrl: string
  embedUrl: string
  thumbnailUrl: string
}

export type ResolvedYouTubeFeed = {
  channelUrl?: string
  featuredEmbedUrl?: string
  featuredTitle?: string
  playlistUrl?: string
  playlistEmbedUrl?: string
  source: 'manual' | 'api' | 'playlist'
  videos: YouTubeFeedItem[]
}

type YouTubeChannelListResponse = {
  items?: Array<{
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string
      }
    }
  }>
}

type YouTubePlaylistItemsResponse = {
  items?: Array<{
    snippet?: {
      title?: string
      resourceId?: {
        videoId?: string
      }
    }
  }>
}

export async function getYouTubeFeed(config: YouTubeFeedConfig): Promise<ResolvedYouTubeFeed | null> {
  if (config.enabled !== true) {
    return null
  }

  if (config.mode === 'api') {
    const apiFeed = await getYouTubeFeedFromApi(config)

    if (apiFeed) {
      return apiFeed
    }
  }

  return getYouTubeFeedFromManualConfig(config)
}

function getYouTubeFeedFromManualConfig(config: YouTubeFeedConfig): ResolvedYouTubeFeed | null {
  const videos = normalizeManualVideos(config.videos)
  const firstVideo = videos[0]

  if (firstVideo) {
    return {
      channelUrl: getChannelUrl(config),
      featuredEmbedUrl: firstVideo.embedUrl,
      featuredTitle: firstVideo.title,
      playlistEmbedUrl: getPlaylistEmbedUrl(config.playlistId),
      playlistUrl: getPlaylistUrl(config.playlistId),
      source: 'manual',
      videos,
    }
  }

  if (!isConfiguredValue(config.playlistId)) {
    return null
  }

  return {
    channelUrl: getChannelUrl(config),
    featuredEmbedUrl: getPlaylistEmbedUrl(config.playlistId),
    featuredTitle: 'Latest uploads playlist',
    playlistEmbedUrl: getPlaylistEmbedUrl(config.playlistId),
    playlistUrl: getPlaylistUrl(config.playlistId),
    source: 'playlist',
    videos: [],
  }
}

async function getYouTubeFeedFromApi(config: YouTubeFeedConfig): Promise<ResolvedYouTubeFeed | null> {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = config.channelId

  if (!apiKey || !isConfiguredValue(channelId)) {
    return null
  }

  const uploadsPlaylistId = await getUploadsPlaylistId(channelId, apiKey)

  if (!uploadsPlaylistId) {
    return null
  }

  const maxResults = Math.max(1, Math.min(config.api?.maxResults ?? 4, 12))
  const videos = await getPlaylistVideos(uploadsPlaylistId, apiKey, maxResults)
  const firstVideo = videos[0]

  if (!firstVideo) {
    return null
  }

  return {
    channelUrl: getChannelUrl(config),
    featuredEmbedUrl: firstVideo.embedUrl,
    featuredTitle: firstVideo.title,
    playlistEmbedUrl: getPlaylistEmbedUrl(uploadsPlaylistId),
    playlistUrl: getPlaylistUrl(uploadsPlaylistId),
    source: 'api',
    videos,
  }
}

async function getUploadsPlaylistId(channelId: string, apiKey: string): Promise<string | null> {
  const params = new URLSearchParams({
    part: 'contentDetails',
    id: channelId,
    key: apiKey,
  })

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params.toString()}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as YouTubeChannelListResponse
  const uploadsPlaylistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads

  return isConfiguredValue(uploadsPlaylistId) ? uploadsPlaylistId : null
}

async function getPlaylistVideos(playlistId: string, apiKey: string, maxResults: number): Promise<YouTubeFeedItem[]> {
  const params = new URLSearchParams({
    part: 'snippet',
    playlistId,
    maxResults: String(maxResults),
    key: apiKey,
  })

  const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params.toString()}`, {
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as YouTubePlaylistItemsResponse

  return (data.items ?? [])
    .map((item) => {
      const videoId = item.snippet?.resourceId?.videoId
      const title = item.snippet?.title?.trim()

      if (!isConfiguredValue(videoId) || !title || title === 'Private video' || title === 'Deleted video') {
        return null
      }

      return createVideoItem({
        title,
        videoId,
      })
    })
    .filter((item): item is YouTubeFeedItem => item !== null)
}

function normalizeManualVideos(videos: YouTubeVideoInput[] | undefined): YouTubeFeedItem[] {
  return (videos ?? [])
    .map((video) => createVideoItem(video))
    .filter((item): item is YouTubeFeedItem => item !== null)
}

function createVideoItem(video: YouTubeVideoInput): YouTubeFeedItem | null {
  const title = video.title.trim()
  const videoId = video.videoId ?? extractYouTubeVideoId(video.url)

  if (!title || !isConfiguredValue(videoId)) {
    return null
  }

  return {
    id: videoId,
    title,
    watchUrl: buildWatchUrl(videoId),
    embedUrl: buildVideoEmbedUrl(videoId),
    thumbnailUrl: buildThumbnailUrl(videoId),
  }
}

function extractYouTubeVideoId(value: string | undefined): string | null {
  if (!value || !isConfiguredValue(value)) {
    return null
  }

  if (/^[A-Za-z0-9_-]{11}$/.test(value)) {
    return value
  }

  try {
    const url = new URL(value)
    const watchId = url.searchParams.get('v')

    if (watchId && /^[A-Za-z0-9_-]{11}$/.test(watchId)) {
      return watchId
    }

    const parts = url.pathname.split('/').filter(Boolean)
    const candidate = parts.at(-1)

    if (candidate && /^[A-Za-z0-9_-]{11}$/.test(candidate)) {
      return candidate
    }
  } catch {
    return null
  }

  return null
}

function buildVideoEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    controls: '1',
    playsinline: '1',
    rel: '0',
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function getPlaylistEmbedUrl(playlistId: string | undefined): string | undefined {
  if (!isConfiguredValue(playlistId)) {
    return undefined
  }

  const params = new URLSearchParams({
    listType: 'playlist',
    list: playlistId,
    playsinline: '1',
    rel: '0',
  })

  return `https://www.youtube.com/embed?${params.toString()}`
}

function buildThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

function buildWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

function getPlaylistUrl(playlistId: string | undefined): string | undefined {
  if (!isConfiguredValue(playlistId)) {
    return undefined
  }

  return `https://www.youtube.com/playlist?list=${playlistId}`
}

function getChannelUrl(config: YouTubeFeedConfig): string | undefined {
  if (isConfiguredValue(config.channelUrl)) {
    return config.channelUrl
  }

  if (isConfiguredValue(config.channelId)) {
    return `https://www.youtube.com/channel/${config.channelId}`
  }

  return undefined
}

function isConfiguredValue(value: string | undefined | null): value is string {
  return Boolean(value && !value.includes('REPLACE_WITH_') && !YOUTUBE_URL_OR_ID_PLACEHOLDER.test(value))
}
