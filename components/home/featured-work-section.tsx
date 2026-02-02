import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const featuredWorks = [
  {
    id: 1,
    title: "Sarah & James",
    category: "Wedding",
    image: "/images/work-1.jpg",
  },
  {
    id: 2,
    title: "Bloom Cafe",
    category: "Brand",
    image: "/images/work-2.jpg",
  },
  {
    id: 3,
    title: "Golden Hour",
    category: "Lifestyle",
    image: "/images/work-3.jpg",
  },
  {
    id: 4,
    title: "Emma & Noah",
    category: "Wedding",
    image: "/images/work-4.jpg",
  },
]

export function FeaturedWorkSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Portfolio
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Featured Work
            </h2>
          </div>
          <Button asChild variant="ghost" className="group self-start md:self-auto">
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredWorks.map((work, index) => (
            <Link
              key={work.id}
              href="/portfolio"
              className={`group relative overflow-hidden bg-muted ${
                index === 0 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={work.image || "/placeholder.svg"}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-1">
                  {work.category}
                </p>
                <h3 className="font-serif text-2xl text-primary-foreground">{work.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
