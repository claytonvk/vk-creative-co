import { getShoots } from "@/lib/queries/shoots"
import { getCategories } from "@/lib/queries/portfolio"
import { getPortfolioSettings } from "@/lib/queries/settings"
import { ShootsGrid } from "./shoots-grid"

export default async function PortfolioPage() {
  const [shoots, categories, settings] = await Promise.all([
    getShoots(),
    getCategories(),
    getPortfolioSettings().catch(() => ({})),
  ])

  const tagline = settings.portfolio_tagline || "Our Work"
  const title = settings.portfolio_title || "Portfolio"
  const description = settings.portfolio_description || "A curated collection of our favorite projects across weddings, brand work, and lifestyle photography."

  return (
    <>
      {/* Hero */}
      <section className="pt-24 md:pt-32  relative overflow-hidden">

        <div className="container mx-auto px-6 text-center relative">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {tagline}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            {title}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      <ShootsGrid shoots={shoots} categories={categories} />
    </>
  )
}
