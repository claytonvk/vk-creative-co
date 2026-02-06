import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type FeaturedShoot = {
  id: string
  title: string
  slug: string
  cover_image_url: string | null
  shoot_tags: {
    id: string
    categories: { name: string; slug: string } | null
  }[]
}

interface FeaturedWorkSectionProps {
  images: FeaturedShoot[]
}

export function FeaturedWorkSection({ images }: FeaturedWorkSectionProps) {
  // Fallback data if no shoots from database
  const featuredWorks =
    images?.map((shoot) => ({
      id: shoot.id,
      title: shoot.title,
      slug: shoot.slug,
      image_url: shoot.cover_image_url || "/placeholder.svg",
      categoryName: shoot.shoot_tags?.[0]?.categories?.name || "Portfolio",
    }))

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
          <Button
            asChild
            variant="ghost"
            className="group self-start md:self-auto text-primary hover:text-primary/80 hover:bg-primary/10"
          >
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWorks.slice(0, 4).map((work, index) => {
            const rotations = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-2", "rotate-2"]

            return (
              <Link
                key={work.id}
                href={`/portfolio/${work.slug}`}
                className={`group relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer text-left ${rotations[index % 5]} hover:rotate-0 transition-all duration-500 hover:scale-[1.02]`}
              >
                <Image
                  src={work.image_url || "/placeholder.svg"}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] bg-accent/90 text-accent-foreground mb-2">
                    {work.categoryName}
                  </span>
                  <h3 className="font-serif text-xl text-primary-foreground">{work.title}</h3>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
