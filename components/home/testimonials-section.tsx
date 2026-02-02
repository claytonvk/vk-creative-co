"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "They captured our day perfectly. Every photo feels like a work of art that we'll treasure forever.",
    author: "Sarah & James",
    role: "Wedding Clients",
  },
  {
    id: 2,
    quote: "Working with Lumen transformed our brand visuals. The quality and creativity exceeded our expectations.",
    author: "Michael Chen",
    role: "Bloom Cafe Owner",
  },
  {
    id: 3,
    quote: "Professional, creative, and incredibly easy to work with. They truly understand how to tell a story.",
    author: "Emma Rodriguez",
    role: "Lifestyle Client",
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="h-12 w-12 text-accent mx-auto mb-8 opacity-50" />
          
          <div className="relative min-h-[200px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
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
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </cite>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              type="button"
              onClick={prev}
              className="p-2 border border-border rounded-full hover:bg-card transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  type="button"
                  key={`dot-${testimonials[index].id}`}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-border"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="p-2 border border-border rounded-full hover:bg-card transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
