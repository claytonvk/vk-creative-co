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
      <section className="py-24 md:py-32 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
                About
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                The Story Behind the Lens
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lumen Studio was born from a simple belief: every moment deserves to be captured beautifully. 
                What started as a passion project has grown into a dedicated team of visual storytellers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We specialize in weddings, brand content, and lifestyle photography that feels authentic and timeless. 
                Our approach combines technical expertise with an artistic eye, ensuring your images are both 
                stunning and genuine.
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-muted">
              <Image
                src="/images/about-portrait.jpg"
                alt="Lumen Studio team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
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
                <div className="text-center">
                  <span className="inline-block font-serif text-5xl text-accent mb-4">
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
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6">
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
      <section className="py-16 md:py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
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
