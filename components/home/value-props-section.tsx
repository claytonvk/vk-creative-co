import {
  Camera,
  Film,
  Sparkles,
  Heart,
  Star,
  Zap,
  Award,
  Users,
  BookOpenText,
  type LucideIcon,
} from "lucide-react"
import type { ValueProp } from "@/lib/supabase/types"

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  book: BookOpenText,
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
  const items =
    valueProps.length > 0
      ? valueProps
      : [
          {
            id: "1",
            title: "Authentic Moments",
            description:
              "We capture the real, unscripted moments that tell your unique story.",
            icon: "camera",
          },
          {
            id: "2",
            title: "Cinematic Quality",
            description:
              "Professional-grade equipment and artistry for stunning visual results.",
            icon: "film",
          },
          {
            id: "3",
            title: "Personal Touch",
            description:
              "Tailored approach to match your vision, style, and personality.",
            icon: "sparkles",
          },
        ]

  return (
    <section className="pt-24 md:pt-32  relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-secondary/30 to-transparent" />

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.2em] text-primary mb-4">
            I'm so glad you're here.
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {items.map((prop, index) => {
            const IconComponent = iconMap[prop.icon || "camera"] || Camera

            const iconColors = [
              "text-secondary group-hover:text-secondary/80",
              "text-primary group-hover:text-primary/80",
              "text-accent group-hover:text-accent/80",
            ]

            return (
              <div key={prop.id} className="text-center group">
                <IconComponent
                  className={`mx-auto mb-6 h-12 w-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconColors[index % 3]}`}
                />

                <h3 className="font-serif text-2xl mb-4 text-foreground">
                  {prop.title}
                </h3>
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
