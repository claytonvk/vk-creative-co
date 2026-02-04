import { getContactSettings, getSocialSettings } from "@/lib/queries/settings"
import { ContactForm } from "./contact-form"

export default async function ContactPage() {
  const [contactSettings, socialSettings] = await Promise.all([
    getContactSettings().catch(() => ({})),
    getSocialSettings().catch(() => ({})),
  ])

  // Merge contact and social settings
  const settings = { ...contactSettings, ...socialSettings }

  return <ContactForm settings={settings} />
}
