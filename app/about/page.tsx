import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description: "We start with a conversation to understand your vision, style, and the story you want to tell.",
  },
  {
    number: "02",
    title: "Planning",
    description: "Together we create a timeline and shot list that captures every moment that matters to you.",
  },
  {
    number: "03",
    title: "Capture",
    description: "On the day, we blend into the background while documenting authentic, cinematic moments.",
  },
  {
    number: "04",
    title: "Delivery",
    description: "Your carefully curated gallery is delivered, ready to share and print for a lifetime.",
  },
]

const gear = [
  "Sony Alpha Series",
  "Zeiss & Sony G Master Lenses",
  "Profoto Lighting",
  "DJI Drone (Licensed)",
  "Atomos Monitors",
  "Professional Audio",
]

const credentials = [
  "10+ Years Experience",
  "500+ Events Captured",
  "Featured in Junebug Weddings",
  "PPA Certified",
  "Fully Insured",
  "Award Winning",
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
                About
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                The Story Behind the Lens
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                VK Creative was born from a simple belief: every moment deserves to be captured beautifully. 
                What started as a passion project has grown into a dedicated team of visual storytellers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We specialize in weddings, brand content, and lifestyle photography that feels authentic and timeless. 
                Our approach combines technical expertise with an artistic eye, ensuring your images are both 
                stunning and genuine.
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/about-portrait.jpg"
                alt="VK Creative team"
                fill
                className="object-cover"
              />
              {/* Colorful border accent */}
              <div className="absolute inset-0 border-4 border-primary/20 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 md:py-24 relative">
        {/* Background accent */}
        <div className="absolute top-1/2 left-0 w-full h-32 bg-gradient-to-r from-secondary/30 via-accent/10 to-secondary/30 -translate-y-1/2" />

        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              How We Work
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Our Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line for desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                )}
                <div className="text-center bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-colors">
                  <span className="inline-block font-serif text-5xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mb-4">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-2xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gear & Credentials */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary via-secondary/80 to-accent/20 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-primary/20 rounded-full" />
        <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-accent/30 rounded-full" />

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Gear */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Equipment
              </p>
              <h2 className="font-serif text-3xl text-foreground mb-8">
                Professional Gear
              </h2>
              <ul className="space-y-4">
                {gear.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Credentials */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Credentials
              </p>
              <h2 className="font-serif text-3xl text-foreground mb-8">
                Why Trust Us
              </h2>
              <ul className="space-y-4">
                {credentials.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-foreground via-foreground to-primary/40 text-primary-foreground relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 text-center relative">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            {"Let's work together"}
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            {"We'd love to hear about your project and how we can help bring your vision to life."}
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
