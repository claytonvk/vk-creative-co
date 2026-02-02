import Link from "next/link"
import { Instagram, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-3xl tracking-wide">
              Lumen
            </Link>
            <p className="mt-4 text-primary-foreground/70 max-w-md leading-relaxed">
              Cinematic photo and video for the moments that matter. 
              Serving engaged couples and local businesses.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-lg mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/portfolio" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/investment" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Investment
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  @lumenstudio
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@lumenstudio.com"
                  className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  hello@lumenstudio.com
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-primary-foreground/70">
                  <MapPin className="h-4 w-4" />
                  Los Angeles, CA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Lumen Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
