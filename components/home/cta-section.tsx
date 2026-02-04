import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  settings: Record<string, string | null>
}

export function CTASection({ settings }: CTASectionProps) {
  const tagline = settings.cta_tagline || "Ready to Begin?"
  const title = settings.cta_title || "Let's Create Something Beautiful"
  const description = settings.cta_description || "Whether it's your wedding day, a brand campaign, or a personal project, we're here to bring your vision to life."
  const primaryText = settings.cta_primary_text || "Get in Touch"
  const primaryLink = settings.cta_primary_link || "/contact"
  const secondaryText = settings.cta_secondary_text || "View Packages"
  const secondaryLink = settings.cta_secondary_link || "/investment"

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-foreground via-foreground to-primary/50 text-primary-foreground relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 text-center relative">
        <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/60 mb-6">
          {tagline}
        </p>
        <h2 className="font-serif text-4xl md:text-6xl mb-6 text-balance">
          {title}
        </h2>
        <p className="max-w-xl mx-auto text-primary-foreground/70 mb-10 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-8"
          >
            <Link href={primaryLink}>{primaryText}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 bg-transparent"
          >
            <Link href={secondaryLink}>{secondaryText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
