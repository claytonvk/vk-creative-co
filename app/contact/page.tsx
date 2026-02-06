import { getContactSettings, getSocialSettings } from "@/lib/queries/settings"
import { getCategories } from "@/lib/queries/portfolio"
import { ContactForm } from "./contact-form"

export default async function ContactPage() {
  const [contactSettings, socialSettings, categories] = await Promise.all([
    getContactSettings().catch(() => ({})),
    getSocialSettings().catch(() => ({})),
    getCategories().catch(() => []),
  ])

  // Merge contact and social settings
  const settings = { ...contactSettings, ...socialSettings }

  return <ContactForm settings={settings} categories={categories} />
}
