"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState } from "react"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-foreground/90">
        {/* Video placeholder - in production, replace with actual video */}
        <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
        <p className="text-sm uppercase tracking-[0.3em] mb-6 text-primary-foreground/70">
          Photo & Video Studio
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium mb-6 text-balance leading-tight">
          Stories Worth
          <br />
          Telling
        </h1>
        <p className="max-w-xl mx-auto text-lg text-primary-foreground/80 mb-10 leading-relaxed">
          Cinematic visuals for weddings, brands, and the moments in between.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-8"
          >
            <Link href="/portfolio">View Our Work</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 bg-transparent"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <Play className="h-4 w-4 mr-2" />
            Watch Showreel
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
          <div className="relative w-full max-w-4xl aspect-video bg-foreground border border-border rounded-lg flex items-center justify-center">
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
