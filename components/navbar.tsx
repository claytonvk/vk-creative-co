"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, User, Shield, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/investment", label: "Investment" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

type AuthState = { type: "loading" } | { type: "none" } | { type: "admin" } | { type: "client" }

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [auth, setAuth] = useState<AuthState>({ type: "loading" })
  const pathname = usePathname()

  const checkAuth = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setAuth({ type: "none" })
      return
    }

    // Check portal_type cookie to determine which portal they logged into
    const portalCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("portal_type="))
      ?.split("=")[1]

    if (portalCookie === "admin") {
      setAuth({ type: "admin" })
      return
    }

    if (portalCookie === "client") {
      setAuth({ type: "client" })
      return
    }

    // Fallback: check database if no cookie (shouldn't normally happen)
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (adminData) {
      setAuth({ type: "admin" })
      return
    }

    const { data: clientData } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (clientData) {
      setAuth({ type: "client" })
      return
    }

    setAuth({ type: "none" })
  }, [])

  // Re-check auth on every route change (catches server-side login redirects)
  useEffect(() => {
    checkAuth()
  }, [pathname, checkAuth])

  // Also listen for client-side auth changes (e.g. cross-tab sign out)
  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth()
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [checkAuth])

  const dashboardHref = auth.type === "admin" ? "/admin" : auth.type === "client" ? "/client" : null
  const isAuthed = auth.type === "admin" || auth.type === "client"

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-primary/10">
      <nav className="container px-6 py-4 max-w-none">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="VK Creative"
              width={80}
              height={28}
              className="h-6 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthed ? (
              <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10">
                <Link href={dashboardHref!} className="text-primary flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-primary border-primary/50 hover:bg-primary/10">
                    Sign In
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/client/login" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Client Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/login" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" />
                      Admin Login
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                {isAuthed ? (
                  <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10 w-full">
                    <Link href={dashboardHref!} className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10 w-full">
                      <Link href="/client/login" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4" />
                        Client Login
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-muted-foreground">
                      <Link href="/admin/login" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                        <Shield className="h-4 w-4" />
                        Admin Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
