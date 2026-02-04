"use client"

interface GalleryHeroProps {
  coverUrl: string
  name: string
  themeColor: string
}

export function GalleryHero({ coverUrl, name, themeColor }: GalleryHeroProps) {
  return (
    <div className="relative h-[50vh] min-h-[400px] max-h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            transparent 0%,
            transparent 40%,
            ${themeColor}15 60%,
            ${themeColor}40 80%,
            ${themeColor}90 100%
          )`,
        }}
      />

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: themeColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-center pb-12">
        <div className="text-center text-white drop-shadow-lg">
          <h1 className="gallery-title text-4xl md:text-5xl lg:text-6xl font-light tracking-wide">
            {name}
          </h1>
        </div>
      </div>
    </div>
  )
}
