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
  featuredVideo: {
    title: 'Our Second Move from America to India',
    description:
      'A practical starting point for families planning the move back.',
    // Replace with the featured YouTube URL or video ID.
    url: 'https://youtu.be/GarsO5OCNBY?si=ZnwvjrW3VOyMJHo8',
  },
  videos: [
    {
      title: 'ReturningNRIs video guide',
      description: 'A practical video for families preparing their move back to India.',
      url: 'https://youtu.be/5ACraFTDoxo?si=Mrr6MYDwC7sZpbbd',
    },
    {
      title: 'ReturningNRIs video guide',
      description: 'A practical video for families preparing their move back to India.',
      url: 'https://youtu.be/X_5zWHpkPXU?si=SwNqIBJBwxlBUuGA',
    },
    {
      title: 'ReturningNRIs video guide',
      description: 'A practical video for families preparing their move back to India.',
      url: 'https://youtu.be/gclP8VEqD8Y?si=3lRmYeifWU0orhg1',
    },
    {
      title: 'ReturningNRIs video guide',
      description: 'A practical video for families preparing their move back to India.',
      url: 'https://youtu.be/I05Zg_gLuV8?si=-MJTUx-Y1tYcWGY0',
    },
    {
      title: "Returning NRIs: Don't Miss RNOR Status",
      description:
        'Why RNOR timing matters for returning NRIs.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/6nBtBzF8-eQ?si=Gs6UQ2GSCXYiS4WJ',
    },
    {
      title: 'Carrying Gold Jewellery from the USA to India',
      description:
        'A quick guide to the key rules and limits.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/uWFbdNnG4wY?si=gNDiPwAcDC5nOc7W',
    },
    {
      title: 'USA to India Luggage Shipping Guide',
      description:
        'A quick overview of luggage and shipping decisions.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/ThlXCgeQ1Ws?si=YfJkbs3hjJCD1y1D',
    },
    {
      title: 'Returning NRIs: Practical Move-Back Planning',
      description:
        'Another practical video for families planning their move back to India.',
      url: 'https://www.youtube.com/watch?v=rQh9hJStwO8&t=39s',
    },
  ],
  api: {
    // Switch `mode` to `api` and add YOUTUBE_API_KEY in `.env.local` to auto-load latest uploads.
    maxResults: 4,
  },
}
