"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Instagram, Mail, MapPin, Calendar, CheckCircle2, XCircle } from "lucide-react"

type FormStatus = "idle" | "submitting" | "success" | "error"

interface ContactFormProps {
  settings: Record<string, string | null>
}

export function ContactForm({ settings }: ContactFormProps) {
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    message: "",
  })

  const tagline = settings.contact_tagline || "Contact"
  const title = settings.contact_title || "Get in Touch"
  const description = settings.contact_description || "Ready to discuss your project? Fill out the form below or reach out directly. We'd love to hear from you."

  const email = settings.contact_email || "hello@vkcreative.com"
  const phone = settings.contact_phone || "(555) 123-4567"
  const address = settings.contact_address || "Los Angeles, California"
  const instagram = settings.contact_instagram || "@vkcreative"
  const instagramUrl = settings.social_instagram || "https://instagram.com"

  const availabilityText = settings.contact_availability_text || "We're currently booking for 2026 weddings and events. Limited dates remain for 2025."
  const currentYear = settings.contact_current_year || "2025 Season"
  const currentYearStatus = settings.contact_current_year_status || "Limited"
  const currentYearPercent = parseInt(settings.contact_current_year_percent || "85", 10)
  const nextYear = settings.contact_next_year || "2026 Season"
  const nextYearStatus = settings.contact_next_year_status || "Available"
  const nextYearPercent = parseInt(settings.contact_next_year_percent || "35", 10)
  const responseText = settings.contact_response_text || 'We typically respond within 24-48 hours. For urgent inquiries, please email us directly with "URGENT" in the subject line.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate success (in production, this would be an actual API call)
    const isSuccess = Math.random() > 0.1 // 90% success rate for demo
    setFormStatus(isSuccess ? "success" : "error")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const resetForm = () => {
    setFormStatus("idle")
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      message: "",
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-primary/20 rounded-full" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-accent/30 rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

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

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              {formStatus === "success" ? (
                <div className="bg-gradient-to-br from-secondary to-accent/20 p-8 text-center rounded-2xl border border-primary/20">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-foreground mb-3">Message Sent</h3>
                  <p className="text-muted-foreground mb-6">
                    {"Thank you for reaching out. We'll get back to you within 24-48 hours."}
                  </p>
                  <Button onClick={resetForm} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              ) : formStatus === "error" ? (
                <div className="bg-destructive/10 p-8 text-center">
                  <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-foreground mb-3">Something Went Wrong</h3>
                  <p className="text-muted-foreground mb-6">
                    Please try again or email us directly at {email}
                  </p>
                  <Button onClick={() => setFormStatus("idle")} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="bg-card"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={phone}
                        className="bg-card"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <select
                        id="eventType"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select type...</option>
                        <option value="wedding">Wedding</option>
                        <option value="engagement">Engagement</option>
                        <option value="brand">Brand / Commercial</option>
                        <option value="lifestyle">Lifestyle / Portrait</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Preferred Date</Label>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="bg-card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us about your project *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Share the details of your vision..."
                      rows={5}
                      className="bg-card resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={formStatus === "submitting"}
                  >
                    {formStatus === "submitting" ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info & Availability */}
            <div className="space-y-12">
              {/* Contact Info */}
              <div>
                <h3 className="font-serif text-2xl text-foreground mb-6">Contact Details</h3>
                <ul className="space-y-4">
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-4 text-foreground hover:text-primary transition-colors"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent/30 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </span>
                      <span>{email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 text-foreground hover:text-primary transition-colors"
                    >
                      <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent/30 flex items-center justify-center">
                        <Instagram className="h-5 w-5 text-primary" />
                      </span>
                      <span>{instagram}</span>
                    </a>
                  </li>
                  <li className="flex items-center gap-4 text-foreground">
                    <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-accent/30 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </span>
                    <span>{address}</span>
                  </li>
                </ul>
              </div>

              {/* Availability */}
              <div className="bg-gradient-to-br from-secondary via-secondary/80 to-accent/20 p-8 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-serif text-xl text-foreground">Availability</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {availabilityText}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{currentYear}</span>
                    <span className="text-accent font-medium">{currentYearStatus}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full" style={{ width: `${currentYearPercent}%` }} />
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{nextYear}</span>
                    <span className="text-primary font-medium">{nextYearStatus}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${nextYearPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div>
                <p className="text-sm text-muted-foreground">
                  {responseText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
