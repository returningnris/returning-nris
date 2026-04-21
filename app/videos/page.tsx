import type { Metadata } from 'next'
import YouTubeVideoLibrary from '../../components/YouTubeVideoLibrary'

export const metadata: Metadata = {
  title: 'Videos for Returning NRIs | Move-Back Guidance, RNOR, Shipping and Family Planning',
  description:
    'Watch practical ReturningNRIs videos on moving back to India, RNOR, shipping, and family decisions for NRIs planning a smoother return.',
  alternates: {
    canonical: 'https://www.returningnris.com/videos',
  },
  openGraph: {
    title: 'Videos for Returning NRIs | Move-Back Guidance, RNOR, Shipping and Family Planning',
    description:
      'Watch practical ReturningNRIs videos on moving back to India, RNOR, shipping, and family decisions for NRIs planning a smoother return.',
    url: 'https://www.returningnris.com/videos',
    siteName: 'ReturningNRIs',
    type: 'website',
  },
}

export default function VideosPage() {
  return (
    <main className="bg-[#fffdf9]">
      <section className="border-b border-[rgba(29,22,15,0.08)] bg-[linear-gradient(180deg,#fffaf4_0%,#fffdf9_100%)] py-16 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <div className="max-w-[760px]">
            <div className="section-label">Videos</div>
            <h1 className="section-title mb-4">
              Practical video guidance for returning NRIs
            </h1>
            <p className="section-sub max-w-[680px]">
              Start with the latest featured video, then explore practical guidance on RNOR, shipping, family planning, and the real decisions that shape a smoother move back to India.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">
          <YouTubeVideoLibrary />
        </div>
      </section>
    </main>
  )
}
