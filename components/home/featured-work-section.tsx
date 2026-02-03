import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { PortfolioImage } from "@/lib/supabase/types"

interface FeaturedWorkSectionProps {
  images: (PortfolioImage & { categories: { name: string; slug: string } | null })[]
}

export function FeaturedWorkSection({ images }: FeaturedWorkSectionProps) {
  // Fallback data if no images from database
  const featuredWorks = images.length > 0 ? images : [
    { id: "1", title: "Sarah & James", categories: { name: "Wedding", slug: "weddings" }, image_url: "/images/work-1.jpg" },
    { id: "2", title: "Bloom Cafe", categories: { name: "Brand", slug: "brand" }, image_url: "/images/work-2.jpg" },
    { id: "3", title: "Golden Hour", categories: { name: "Lifestyle", slug: "lifestyle" }, image_url: "/images/work-3.jpg" },
    { id: "4", title: "Emma & Noah", categories: { name: "Wedding", slug: "weddings" }, image_url: "/images/work-4.jpg" },
  ]

  return (
    <section className="py-24 md:py-32 relative">
      {/* Artistic background accent */}
      <div className="absolute top-1/2 left-0 w-1/3 h-96 bg-gradient-to-r from-secondary/40 to-transparent -translate-y-1/2" />

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Featured Work
            </h2>
          </div>
          <Button asChild variant="ghost" className="group self-start md:self-auto text-primary hover:text-primary/80 hover:bg-primary/10">
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {featuredWorks.slice(0, 4).map((work, index) => {
            const layouts = [
              "md:col-span-7 md:row-span-2 aspect-[3/4] md:aspect-auto",
              "md:col-span-5 aspect-[4/3]",
              "md:col-span-5 aspect-[4/3]",
              "md:col-span-12 aspect-[21/9]"
            ]
            const rotations = ["-rotate-1", "rotate-1", "-rotate-1", "rotate-0"]
            return (
              <Link
                key={work.id}
                href="/portfolio"
                className={`group relative overflow-hidden bg-muted rounded-2xl ${layouts[index]} ${rotations[index]} hover:rotate-0 transition-transform duration-500`}
              >
                <Image
                  src={work.image_url || "/placeholder.svg"}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] bg-accent/90 text-accent-foreground rounded-full mb-2">
                    {work.categories?.name || "Uncategorized"}
                  </span>
                  <h3 className="font-serif text-2xl text-primary-foreground">{work.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
