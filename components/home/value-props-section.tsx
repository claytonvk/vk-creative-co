import { Camera, Film, Sparkles } from "lucide-react"

const valueProps = [
  {
    icon: Camera,
    title: "Authentic Moments",
    description: "We capture the real, unscripted moments that tell your unique story.",
  },
  {
    icon: Film,
    title: "Cinematic Quality",
    description: "Professional-grade equipment and artistry for stunning visual results.",
  },
  {
    icon: Sparkles,
    title: "Personal Touch",
    description: "Tailored approach to match your vision, style, and personality.",
  },
]

export function ValuePropsSection() {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Why Choose Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Crafted with Care
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {valueProps.map((prop) => (
            <div key={prop.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6 group-hover:bg-accent transition-colors">
                <prop.icon className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-foreground">{prop.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
