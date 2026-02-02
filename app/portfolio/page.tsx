"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const categories = ["All", "Weddings", "Brand", "Lifestyle"] as const
type Category = (typeof categories)[number]

const portfolioItems = [
  { id: 1, title: "Sarah & James", category: "Weddings", image: "/images/portfolio-1.jpg" },
  { id: 2, title: "Bloom Cafe", category: "Brand", image: "/images/portfolio-2.jpg" },
  { id: 3, title: "Golden Hour", category: "Lifestyle", image: "/images/portfolio-3.jpg" },
  { id: 4, title: "Emma & Noah", category: "Weddings", image: "/images/portfolio-4.jpg" },
  { id: 5, title: "Artisan Bakery", category: "Brand", image: "/images/portfolio-5.jpg" },
  { id: 6, title: "Summer Days", category: "Lifestyle", image: "/images/portfolio-6.jpg" },
  { id: 7, title: "Maya & David", category: "Weddings", image: "/images/portfolio-7.jpg" },
  { id: 8, title: "Wellness Studio", category: "Brand", image: "/images/portfolio-8.jpg" },
  { id: 9, title: "Family Portrait", category: "Lifestyle", image: "/images/portfolio-9.jpg" },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter((item) => item.category === activeCategory)

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
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Our Work
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Portfolio
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            A curated collection of our favorite projects across weddings, brand work, and lifestyle photography.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border sticky top-[73px] bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer text-left"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-serif text-xl text-primary-foreground">{item.title}</h3>
                </div>
              </button>
            ))}
          </div>
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
              src={filteredItems[lightboxIndex].image || "/placeholder.svg"}
              alt={filteredItems[lightboxIndex].title}
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
              {filteredItems[lightboxIndex].category}
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
