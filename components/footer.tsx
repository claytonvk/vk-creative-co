import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Mail, MapPin } from "lucide-react"
import { getContactSettings, getSocialSettings, getFooterSettings } from "@/lib/queries/settings"

export async function Footer() {
  const [contact, social, footer] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getFooterSettings(),
  ])

  const email = contact.contact_email || "hello@vkcreative.com"
  const location = contact.contact_address || "Los Angeles, CA"
  const tagline = footer.footer_tagline || "Cinematic photo and video for the moments that matter."
  const copyright = footer.footer_copyright || `© ${new Date().getFullYear()} VK Creative. All rights reserved.`

  const instagramUrl = social.social_instagram || "https://instagram.com"
  const facebookUrl = social.social_facebook
  const instagramHandle = instagramUrl.split("/").pop() || "vkcreative"

  return (
    <footer className="text-primary">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/moon-logo.png"
                alt="VK Creative"
                width={150}
                height={60}
                className="h-12 w-auto brightness-110"
              />
            </Link>
            <p className="mt-4 text-primary max-w-md leading-relaxed">
              {tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/portfolio" className="text-primary hover:text-primary/70 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/investment" className="text-primary hover:text-primary/70 transition-colors">
                  Investment
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary hover:text-primary/70 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary hover:text-primary/70 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Connect</h4>
            <ul className="space-y-3">
              {instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                    @{instagramHandle}
                  </a>
                </li>
              )}
              {facebookUrl && (
                <li>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-primary hover:text-primary/70 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {email}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-primary">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary/50">
            {copyright}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-primary/50 hover:text-primary/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-primary/50 hover:text-primary/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
