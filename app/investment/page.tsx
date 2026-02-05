import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getPackages, formatPrice } from "@/lib/queries/packages"
import { getFAQs } from "@/lib/queries/faqs"
import { getInvestmentSettings } from "@/lib/queries/settings"

export default async function InvestmentPage() {
  const [packages, faqs, settings] = await Promise.all([
    getPackages(),
    getFAQs(),
    getInvestmentSettings().catch(() => ({})),
  ])

  const tagline = settings.investment_tagline || "Pricing"
  const title = settings.investment_title || "Investment"
  const description = settings.investment_description || "Transparent pricing for exceptional work. Every package is customizable to fit your unique needs."

  const ctaTitle = settings.investment_cta_title || "Ready to book your session?"
  const ctaDescription = settings.investment_cta_description || "Let's discuss your vision and create something beautiful together."
  const customText = settings.investment_custom_text || "Looking for something different?"

  return (
    <>
      {/* Hero */}
      <section className="pt-24 md:pt-32  relative overflow-hidden">

        <div className="container mx-auto px-6 text-center relative">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
            {tagline}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            {title}
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {packages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Packages coming soon. Contact us for pricing.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                const features = Array.isArray(pkg.features) ? (pkg.features as string[]) : []
                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col justify-between p-8  border-2 transition-all duration-300 hover:scale-[1.02] hover:-rotate-1 ${
                      pkg.is_featured
                        ? "border-primary bg-gradient-to-br from-secondary via-secondary/80 to-accent/20"
                        : "border-border/50 bg-card hover:border-primary/30"
                    }`}
                  >
                    {pkg.badge_text && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs uppercase tracking-wider px-4 py-1 ">
                        {pkg.badge_text}
                      </span>
                    )}
                    <div className="text-center mb-8">
                      <h3 className="font-serif text-2xl text-foreground mb-2">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                      <p className="text-sm uppercase tracking-wider text-muted-foreground">Starting at</p>
                      <p className="font-serif text-4xl text-foreground">
                        {pkg.price_display || formatPrice(pkg.price)}
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-foreground">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full ${
                        pkg.is_featured
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      <Link href="/contact">Inquire Now</Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          <p className="text-center text-muted-foreground mt-12">
            {customText}{" "}
            <Link href="/contact" className="text-foreground underline hover:no-underline">
              Contact us
            </Link>{" "}
            for custom packages.
          </p>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-card to-secondary/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
                  Questions
                </p>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                  Frequently Asked
                </h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={faq.id} value={`item-${index}`}>
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
      )}

      {/* CTA */}
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20  blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10  blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 text-center relative">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            {ctaTitle}
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            {ctaDescription}
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
