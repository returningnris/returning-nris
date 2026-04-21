import type { YouTubeFeedConfig } from './youtube-feed'

export const youtubeFeedConfig: YouTubeFeedConfig = {
  enabled: true,
  mode: 'manual',
  // Replace with your YouTube channel ID.
  channelId: 'REPLACE_WITH_YOUR_CHANNEL_ID',
  // Replace with your public channel URL or handle URL.
  channelUrl: 'https://www.youtube.com/@ReturningNRIs',
  // Replace with your uploads playlist ID or a curated playlist ID.
  playlistId: 'REPLACE_WITH_YOUR_UPLOADS_OR_CURATED_PLAYLIST_ID',
  videos: [
    {
      title: 'Our Second Move from America to India',
      url: 'https://youtu.be/GarsO5OCNBY?si=ZnwvjrW3VOyMJHo8',
    },
    {
      title: 'Returning NRIs: Don’t Miss RNOR Status',
      url: 'https://youtu.be/6nBtBzF8-eQ?si=Gs6UQ2GSCXYiS4WJ',
    },
    {
      title: 'Carrying Gold Jewellery from the USA to India',
      url: 'https://youtu.be/uWFbdNnG4wY?si=gNDiPwAcDC5nOc7W',
    },
    {
      title: 'USA to India Luggage Shipping Guide',
      url: 'https://youtu.be/ThlXCgeQ1Ws?si=YfJkbs3hjJCD1y1D',
    },
  ],
  api: {
    // Switch `mode` to `api` and add YOUTUBE_API_KEY in `.env.local` to auto-load latest uploads.
    maxResults: 4,
  },
}
