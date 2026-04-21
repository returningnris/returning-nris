type YouTubeEmbedProps = {
  src: string
  title: string
  className?: string
}

export default function YouTubeEmbed({ src, title, className }: YouTubeEmbedProps) {
  return (
    <div className={className}>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={src}
        title={title}
      />
    </div>
  )
}
