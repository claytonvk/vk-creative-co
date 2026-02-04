import { HeroSection } from "@/components/home/hero-section"
import { ValuePropsSection } from "@/components/home/value-props-section"
import { FeaturedWorkSection } from "@/components/home/featured-work-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { getHeroSettings, getCTASettings } from "@/lib/queries/settings"
import { getValueProps } from "@/lib/queries/value-props"
import { getFeaturedShoots } from "@/lib/queries/shoots"
import { getFeaturedTestimonials } from "@/lib/queries/testimonials"

export default async function HomePage() {
  let heroSettings = {}
  let ctaSettings = {}
  let valueProps: any[] = []
  let featuredImages: any[] = []
  let testimonials: any[] = []

  try {
    const results = await Promise.all([
      getHeroSettings().catch(() => ({})),
      getCTASettings().catch(() => ({})),
      getValueProps().catch(() => []),
      getFeaturedShoots(4).catch(() => []),
      getFeaturedTestimonials(5).catch(() => []),
    ])
    heroSettings = results[0]
    ctaSettings = results[1]
    valueProps = results[2]
    featuredImages = results[3]
    testimonials = results[4]
  } catch (error) {
    console.error("Failed to fetch homepage data:", error)
  }

  return (
    <>
      <HeroSection settings={heroSettings} />
      <ValuePropsSection valueProps={valueProps} />
      <FeaturedWorkSection images={featuredImages} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection settings={ctaSettings} />
    </>
  )
}
