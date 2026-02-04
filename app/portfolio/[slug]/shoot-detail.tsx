"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react"

interface ShootDetailProps {
  title: string
  description: string | null
  location: string | null
  shootDate: string | null
  tags: string[]
  images: { url: string; alt: string }[]
}

export function ShootDetail({
  title,
  description,
  location,
  shootDate,
  tags,
  images,
}: ShootDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrevious = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : (prev ?? 0) - 1))
  }

  const goToNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % images.length)
  }

  const formattedDate = shootDate
    ? new Date(shootDate + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>

          <div className="text-center max-w-2xl mx-auto">
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
              {title}
            </h1>

            {(location || formattedDate) && (
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {location}
                  </span>
                )}
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </span>
                )}
              </div>
            )}

            {description && (
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {images.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No images in this shoot yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer rounded-lg"
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 md:right-8 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm text-primary-foreground/50 mt-2">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
