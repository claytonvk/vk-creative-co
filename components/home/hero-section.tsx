"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState } from "react"

interface HeroSectionProps {
  settings: Record<string, string | null>
}

export function HeroSection({ settings }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const tagline = settings.hero_tagline || "family + lifestyle photographer"
  const title = settings.hero_title || "Stories Worth Telling"
  const subtitle = settings.hero_subtitle || "Cinematic visuals for weddings, brands, and the moments in between."
  const ctaText = settings.hero_cta_text || "View Our Work"
  const ctaLink = settings.hero_cta_link || "/portfolio"
  const secondaryCtaText = settings.hero_secondary_cta_text || "Watch Showreel"
  const backgroundImage = settings.hero_background_image

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-foreground/90">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      </div>
      {/* Decorative accent shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/20  blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/30  blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <p className="text-sm uppercase tracking-[0.3em] mb-6 text-primary-foreground/70">
          {tagline}
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-6 text-balance leading-tight">
          {title.split(/\s+/).slice(0, 2).join(" ")}
          <br />
          {title.split(/\s+/).slice(2).join(" ")}
        </h1>
        <p className="max-w-xl mx-auto text-lg text-primary-foreground/80 mb-10 leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-8"
          >
            <Link href={ctaLink}>{ctaText}</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 bg-transparent"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Play className="h-4 w-4 mr-2" />
            {secondaryCtaText}
          </Button>
        </div>
      </div>

      {/* Video Modal Placeholder */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-6"
          onClick={() => setIsPlaying(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsPlaying(false)}
          role="button"
          tabIndex={0}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-foreground border border-border flex items-center justify-center">
            <p className="text-primary-foreground/50">Showreel video placeholder</p>
            <button
              type="button"
              className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground"
              onClick={() => setIsPlaying(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-16 bg-primary-foreground/30 relative">
          <div className="absolute top-0 w-px h-8 bg-primary-foreground animate-pulse" />
        </div>
      </div>
    </section>
  )
}
