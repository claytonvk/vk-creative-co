import { Camera, Film, Sparkles, Heart, Star, Zap, Award, Users, type LucideIcon } from "lucide-react"
import type { ValueProp } from "@/lib/supabase/types"

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  film: Film,
  sparkles: Sparkles,
  heart: Heart,
  star: Star,
  zap: Zap,
  award: Award,
  users: Users,
}

interface ValuePropsSectionProps {
  valueProps: ValueProp[]
}

export function ValuePropsSection({ valueProps }: ValuePropsSectionProps) {
  // Fallback data if no props from database
  const items = valueProps.length > 0 ? valueProps : [
    { id: "1", title: "Authentic Moments", description: "We capture the real, unscripted moments that tell your unique story.", icon: "camera" },
    { id: "2", title: "Cinematic Quality", description: "Professional-grade equipment and artistry for stunning visual results.", icon: "film" },
    { id: "3", title: "Personal Touch", description: "Tailored approach to match your vision, style, and personality.", icon: "sparkles" },
  ]

  return (
    <section className="py-24 md:py-32 bg-card relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-secondary/30 to-transparent" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
            Why Choose Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Crafted with Care
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {items.map((prop, index) => {
            const IconComponent = iconMap[prop.icon || "camera"] || Camera
            const colors = [
              "bg-primary/10 group-hover:bg-primary/20 border-primary/30",
              "bg-secondary group-hover:bg-secondary/80 border-accent/30",
              "bg-accent/20 group-hover:bg-accent/30 border-accent/40"
            ]
            return (
              <div key={prop.id} className="text-center group">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${colors[index % 3]} border-2 mb-6 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3`}>
                  <IconComponent className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="font-serif text-2xl mb-4 text-foreground">{prop.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {prop.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
