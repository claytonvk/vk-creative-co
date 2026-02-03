"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Image,
  Images,
  FolderOpen,
  Package,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/galleries", label: "Client Galleries", icon: Images },
  { href: "/admin/portfolio", label: "Portfolio", icon: Image },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </form>
      </div>
    </aside>
  )
}
