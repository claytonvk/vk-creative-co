import { getPortfolioImages, getCategories } from "@/lib/queries/portfolio"
import { PortfolioGallery } from "./portfolio-gallery"

export default async function PortfolioPage() {
  const [images, categories] = await Promise.all([
    getPortfolioImages(),
    getCategories(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-accent/30 rounded-full" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 text-center relative">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
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

      <PortfolioGallery images={images} categories={categories} />
    </>
  )
}
