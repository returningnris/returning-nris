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
      'A practical starting point for families thinking through what a second move back to India really feels like on the ground.',
    // Replace with the featured YouTube URL or video ID.
    url: 'https://youtu.be/GarsO5OCNBY?si=ZnwvjrW3VOyMJHo8',
  },
  videos: [
    {
      title: "Returning NRIs: Don't Miss RNOR Status",
      description:
        'A short reminder on why RNOR timing matters and how missing it can create expensive avoidable mistakes.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/6nBtBzF8-eQ?si=Gs6UQ2GSCXYiS4WJ',
    },
    {
      title: 'Carrying Gold Jewellery from the USA to India',
      description:
        'A simple walkthrough of the rules and practical considerations for carrying gold jewellery when moving back.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/uWFbdNnG4wY?si=gNDiPwAcDC5nOc7W',
    },
    {
      title: 'USA to India Luggage Shipping Guide',
      description:
        'A practical look at luggage and shipping decisions for NRIs preparing for a smoother relocation.',
      // Replace with your next YouTube URL or video ID.
      url: 'https://youtu.be/ThlXCgeQ1Ws?si=YfJkbs3hjJCD1y1D',
    },
  ],
  api: {
    // Switch `mode` to `api` and add YOUTUBE_API_KEY in `.env.local` to auto-load latest uploads.
    maxResults: 4,
  },
}
