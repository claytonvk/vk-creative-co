import { HeroSection } from "@/components/home/hero-section"
import { ValuePropsSection } from "@/components/home/value-props-section"
import { FeaturedWorkSection } from "@/components/home/featured-work-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      <FeaturedWorkSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
