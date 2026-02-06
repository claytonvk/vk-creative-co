"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { PortfolioImage, Category } from "@/lib/supabase/types"

type PortfolioWithCategory = PortfolioImage & {
  categories: { name: string; slug: string } | null
}

interface PortfolioGalleryProps {
  images: PortfolioWithCategory[]
  categories: Category[]
}

export function PortfolioGallery({ images, categories }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const categoryOptions = [
    { slug: "all", name: "All" },
    ...categories,
  ]

  const filteredItems = activeCategory === "all"
    ? images
    : images.filter((item) => item.categories?.slug === activeCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrevious = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : (prev ?? 0) - 1))
  }

  const goToNext = () => {
    if (lightboxIndex === null) return
    setLightboxIndex((prev) => ((prev ?? 0) + 1) % filteredItems.length)
  }

  return (
    <>
      {/* Filter Tabs */}
      <section className="py-8 border-b border-border sticky top-[73px] bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`px-6 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.slug
                    ? "bg-primary text-primary-foreground"
                    : "border-secondary text-secondary-foreground hover:border-accent"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24 relative">
        {/* Subtle background accent */}
        <div className="absolute top-1/4 left-0 w-1/4 h-96 bg-gradient-to-r from-secondary/20 to-transparent" />
        <div className="absolute bottom-1/4 right-0 w-1/4 h-96 bg-gradient-to-l from-accent/10 to-transparent" />

        <div className="container mx-auto px-6 relative">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No images found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const rotations = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-2", "rotate-2"]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openLightbox(index)}
                    className={`group relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer text-left ${rotations[index % 5]} hover:rotate-0 transition-all duration-500 hover:scale-[1.02]`}
                  >
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.alt_text || item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] bg-accent/90 text-accent-foreground mb-2">
                        {item.categories?.name || "Uncategorized"}
                      </span>
                      <h3 className="font-serif text-xl text-primary-foreground">{item.title}</h3>
                    </div>
                  </button>
                )
              })}
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
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16">
            <Image
              src={filteredItems[lightboxIndex].image_url || "/placeholder.svg"}
              alt={filteredItems[lightboxIndex].alt_text || filteredItems[lightboxIndex].title}
              fill
              className="object-contain"
            />
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 md:right-8 p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          {/* Caption */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-1">
              {filteredItems[lightboxIndex].categories?.name || "Uncategorized"}
            </p>
            <h3 className="font-serif text-2xl text-primary-foreground">
              {filteredItems[lightboxIndex].title}
            </h3>
            <p className="text-sm text-primary-foreground/50 mt-2">
              {lightboxIndex + 1} / {filteredItems.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
