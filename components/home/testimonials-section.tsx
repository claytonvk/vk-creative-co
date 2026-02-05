"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import type { Testimonial } from "@/lib/supabase/types"

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0)

  // Fallback data if no testimonials from database
  const items = testimonials.length > 0 ? testimonials : [
    { id: "1", quote: "They captured our day perfectly. Every photo feels like a work of art that we'll treasure forever.", author_name: "Sarah & James", author_role: "Wedding Clients" },
    { id: "2", quote: "Working with VK Creative transformed our brand visuals. The quality and creativity exceeded our expectations.", author_name: "Michael Chen", author_role: "Bloom Cafe Owner" },
    { id: "3", quote: "Professional, creative, and incredibly easy to work with. They truly understand how to tell a story.", author_name: "Emma Rodriguez", author_role: "Lifestyle Client" },
  ]

  const next = () => setCurrent((prev) => (prev + 1) % items.length)
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length)

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">

      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="h-12 w-12 text-primary mx-auto mb-8" />

          <div className="relative min-h-[200px] flex items-center justify-center">
            {items.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center ${
                  index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <blockquote className="font-serif text-2xl md:text-4xl text-foreground leading-relaxed mb-8 text-balance">
                  {`"${testimonial.quote}"`}
                </blockquote>
                <cite className="not-italic">
                  <p className="font-medium text-foreground">{testimonial.author_name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.author_role}</p>
                </cite>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              type="button"
              onClick={prev}
              className="p-3 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-primary hover:text-primary/80" />
            </button>
            <div className="flex gap-3">
              {items.map((_, index) => (
                <button
                  type="button"
                  key={`dot-${index}`}
                  onClick={() => setCurrent(index)}
                  className={`w-3 h-3  transition-all duration-300 ${
                    index === current ? "bg-primary scale-125" : "bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="p-3 hover:text-primary/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-primary hover:text-primary/80" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
