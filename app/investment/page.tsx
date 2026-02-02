import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const packages = [
  {
    name: "Essential",
    startingAt: "$2,500",
    description: "Perfect for intimate gatherings and smaller projects.",
    features: [
      "4 hours of coverage",
      "One photographer",
      "Online gallery",
      "150+ edited images",
      "Print release",
    ],
  },
  {
    name: "Signature",
    startingAt: "$4,500",
    description: "Our most popular package for full-day events.",
    features: [
      "8 hours of coverage",
      "Two photographers",
      "Engagement session",
      "Online gallery",
      "400+ edited images",
      "Print release",
      "Custom USB delivery",
    ],
    featured: true,
  },
  {
    name: "Cinematic",
    startingAt: "$7,500",
    description: "Complete photo and video for the full experience.",
    features: [
      "10 hours of coverage",
      "Two photographers + videographer",
      "Engagement session",
      "4-6 minute highlight film",
      "Full ceremony edit",
      "Online gallery",
      "600+ edited images",
      "Print release",
      "Premium album credit",
    ],
  },
]

const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking 8-12 months in advance for weddings, especially during peak season. For brand and lifestyle sessions, 4-6 weeks notice is typically sufficient.",
  },
  {
    question: "Do you travel for destination events?",
    answer: "We love destination work. Travel fees vary depending on location and typically include transportation and accommodation. Contact us for a custom quote.",
  },
  {
    question: "What is your editing style?",
    answer: "Our signature style is cinematic and timeless with warm, natural tones. We focus on authentic moments and clean, elegant compositions that will look beautiful for years to come.",
  },
  {
    question: "When will I receive my photos?",
    answer: "Wedding galleries are typically delivered within 6-8 weeks. Portrait and brand sessions are delivered within 2-3 weeks. Sneak peeks are shared within 48-72 hours.",
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes, we offer flexible payment plans. A retainer is due at booking to secure your date, with the remaining balance split into manageable installments.",
  },
  {
    question: "What happens if you get sick or have an emergency?",
    answer: "We have a trusted network of equally talented photographers who can step in. In our years of business, we have never missed an event, but your day is always protected.",
  },
]

export default function InvestmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Pricing
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Investment
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Transparent pricing for exceptional work. Every package is customizable to fit your unique needs.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative p-8 border ${
                  pkg.featured 
                    ? "border-primary bg-secondary" 
                    : "border-border bg-card"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-4 py-1">
                    Most Popular
                  </span>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                  <p className="text-sm uppercase tracking-wider text-muted-foreground">Starting at</p>
                  <p className="font-serif text-4xl text-foreground">{pkg.startingAt}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-foreground">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  className={`w-full ${
                    pkg.featured 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  <Link href="/contact">Inquire Now</Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-12">
            Looking for something different? <Link href="/contact" className="text-foreground underline hover:no-underline">Contact us</Link> for custom packages.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Questions
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                Frequently Asked
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={`faq-${index}`} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Ready to book your session?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            {"Let's discuss your vision and create something beautiful together."}
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 px-8"
          >
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
