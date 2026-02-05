import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAboutSettings } from "@/lib/queries/settings"

export default async function AboutPage() {
  const settings = await getAboutSettings().catch(() => ({}))

  const tagline = settings.about_tagline || "About"
  const title = settings.about_title || "The Story Behind the Lens"
  const intro = settings.about_intro || "VK Creative was born from a simple belief: every moment deserves to be captured beautifully. What started as a passion project has grown into a dedicated team of visual storytellers."
  const content = settings.about_content || "We specialize in weddings, brand content, and lifestyle photography that feels authentic and timeless. Our approach combines technical expertise with an artistic eye, ensuring your images are both stunning and genuine."
  const portraitImage = settings.about_portrait_image || "/images/about-portrait.jpg"

  const processTagline = settings.about_process_tagline || "How We Work"
  const processTitle = settings.about_process_title || "Our Process"

  const step1Title = settings.about_step1_title || "Discovery"
  const step1Desc = settings.about_step1_desc || "We start with a conversation to understand your vision, style, and the story you want to tell."
  const step2Title = settings.about_step2_title || "Planning"
  const step2Desc = settings.about_step2_desc || "Together we create a timeline and shot list that captures every moment that matters to you."
  const step3Title = settings.about_step3_title || "Capture"
  const step3Desc = settings.about_step3_desc || "On the day, we blend into the background while documenting authentic, cinematic moments."
  const step4Title = settings.about_step4_title || "Delivery"
  const step4Desc = settings.about_step4_desc || "Your carefully curated gallery is delivered, ready to share and print for a lifetime."

  const processSteps = [
    { number: "01", title: step1Title, description: step1Desc },
    { number: "02", title: step2Title, description: step2Desc },
    { number: "03", title: step3Title, description: step3Desc },
    { number: "04", title: step4Title, description: step4Desc },
  ]

  const gearList = settings.about_gear_list || "Sony Alpha Series,Zeiss & Sony G Master Lenses,Profoto Lighting,DJI Drone (Licensed),Atomos Monitors,Professional Audio"
  const credentialsList = settings.about_credentials_list || "10+ Years Experience,500+ Events Captured,Featured in Junebug Weddings,PPA Certified,Fully Insured,Award Winning"

  const gear = gearList.split(",").map((item: string) => item.trim()).filter(Boolean)
  const credentials = credentialsList.split(",").map((item: string) => item.trim()).filter(Boolean)

  const ctaTitle = settings.about_cta_title || "Let's work together"
  const ctaDescription = settings.about_cta_description || "We'd love to hear about your project and how we can help bring your vision to life."

  return (
    <>
      {/* Hero */}
      <section className="pt-24 md:pt-32  relative">

        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
                {tagline}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
                {title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {intro}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {content}
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-muted overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src={portraitImage}
                alt="VK Creative team"
                fill
                className="object-cover"
              />
              {/* Colorful border accent */}
              <div className="absolute inset-0 border-4 border-primary/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 md:py-24 relative">
        {/* Background accent */}
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
              {processTagline}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              {processTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line for desktop */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
                )}
                <div className="text-center bg-card p-6 min-h-full border border-border/50 hover:border-primary/30 transition-colors">
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
    </>
  )
}
