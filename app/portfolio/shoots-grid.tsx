"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera } from "lucide-react"
import type { Category } from "@/lib/supabase/types"

type ShootTag = {
  id: string
  categories: { name: string; slug: string } | null
}

type ShootItem = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_image_url: string | null
  shoot_media: { count: number }[]
  shoot_gallery_links: { count: number }[]
  shoot_tags: ShootTag[]
}

interface ShootsGridProps {
  shoots: ShootItem[]
  categories: Category[]
}

export function ShootsGrid({ shoots, categories }: ShootsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const categoryOptions = [
    { slug: "all", name: "All" },
    ...categories,
  ]

  const filteredShoots = activeCategory === "all"
    ? shoots
    : shoots.filter((shoot) =>
        shoot.shoot_tags?.some((tag) => tag.categories?.slug === activeCategory)
      )

  function getMediaCount(shoot: ShootItem): number {
    const uploaded = shoot.shoot_media?.[0]?.count ?? 0
    const linked = shoot.shoot_gallery_links?.[0]?.count ?? 0
    return uploaded + linked
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
                    : "border-1 border-primary text-secondary-foreground hover:bg-primary/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Shoots Grid */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute top-1/4 left-0 w-1/4 h-96 bg-gradient-to-r from-secondary/20 to-transparent" />
        <div className="absolute bottom-1/4 right-0 w-1/4 h-96 bg-gradient-to-l from-accent/10 to-transparent" />

        <div className="container mx-auto px-6 relative">
          {filteredShoots.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No shoots found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShoots.map((shoot, index) => {
                const rotations = ["rotate-1", "-rotate-1", "rotate-0", "-rotate-2", "rotate-2"]
                const mediaCount = getMediaCount(shoot)
                const tags = shoot.shoot_tags
                  ?.map((t) => t.categories?.name)
                  .filter(Boolean) || []

                return (
                  <Link
                    key={shoot.id}
                    href={`/portfolio/${shoot.slug}`}
                    className={`group relative aspect-[4/5] overflow-hidden bg-muted cursor-pointer  ${rotations[index % 5]} hover:rotate-0 transition-all duration-500 hover:scale-[1.02] block`}
                  >
                    {shoot.cover_image_url ? (
                      <Image
                        src={shoot.cover_image_url}
                        alt={shoot.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Camera className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-block px-3 py-1 text-xs uppercase tracking-[0.2em] bg-accent/90 text-accent-foreground "
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h3 className="font-serif text-xl text-primary-foreground">{shoot.title}</h3>
                      {mediaCount > 0 && (
                        <p className="text-sm text-primary-foreground/60 mt-1">
                          {mediaCount} image{mediaCount !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
