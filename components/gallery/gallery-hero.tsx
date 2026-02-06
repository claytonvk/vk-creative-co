"use client"

interface GalleryHeroProps {
  coverUrl: string
  name: string
  eventDate?: string | null
  themeColor: string
}

export function GalleryHero({ coverUrl, name, eventDate, themeColor }: GalleryHeroProps) {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <>
      {/* Desktop: Split layout */}
      <div className="hidden md:flex min-h-[600px] lg:min-h-[700px]">
        {/* Left: Cover Image */}
        <div className="w-1/2 lg:w-[55%]">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
        </div>

        {/* Right: Text Content */}
        <div className="w-1/2 lg:w-[45%] flex items-center justify-center bg-white px-8 lg:px-16">
          <div className="text-center">
            {/* Small top text */}
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: themeColor }}
            >
              VK Creative
            </p>

            {/* Gallery Name */}
            <h1
              className="font-serif text-4xl lg:text-5xl xl:text-6xl font-light tracking-wide"
              style={{ color: themeColor }}
            >
              {name}
            </h1>

            {/* Divider line */}
            <div
              className="mx-auto mt-8 mb-6 w-12 h-px"
              style={{ backgroundColor: themeColor }}
            />

            {/* Date or subtitle */}
            <p className="text-sm text-gray-500 tracking-wide">
              {formattedDate ? formattedDate : "Photos by VK Creative"}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked layout */}
      <div className="md:hidden">
        {/* Image */}
        <div
          className="h-[50vh] min-h-[300px] w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />

        {/* Text Content */}
        <div className="bg-white py-10 px-6 text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: themeColor }}
          >
            VK Creative
          </p>

          <h1
            className="font-serif text-3xl font-light tracking-wide"
            style={{ color: themeColor }}
          >
            {name}
          </h1>

          <div
            className="mx-auto mt-6 mb-4 w-10 h-px"
            style={{ backgroundColor: themeColor }}
          />

          <p className="text-sm text-gray-500 tracking-wide">
            {formattedDate ? formattedDate : "Photos by VK Creative"}
          </p>
        </div>
      </div>
    </>
  )
}
