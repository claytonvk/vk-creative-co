import { HeroSection } from "@/components/home/hero-section"
import { ValuePropsSection } from "@/components/home/value-props-section"
import { FeaturedWorkSection } from "@/components/home/featured-work-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import { getHeroSettings } from "@/lib/queries/settings"
import { getValueProps } from "@/lib/queries/value-props"
import { getFeaturedImages } from "@/lib/queries/portfolio"
import { getFeaturedTestimonials } from "@/lib/queries/testimonials"

export default async function HomePage() {
  const [heroSettings, valueProps, featuredImages, testimonials] = await Promise.all([
    getHeroSettings(),
    getValueProps(),
    getFeaturedImages(4),
    getFeaturedTestimonials(5),
  ])

  return (
    <>
      <HeroSection settings={heroSettings} />
      <ValuePropsSection valueProps={valueProps} />
      <FeaturedWorkSection images={featuredImages} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  )
}
