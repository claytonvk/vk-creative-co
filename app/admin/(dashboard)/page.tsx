import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/admin/page-header"
import { createClient } from "@/lib/supabase/server"
import { Image, Package, MessageSquareQuote, HelpCircle } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  const [portfolioResult, packagesResult, testimonialsResult, faqsResult] =
    await Promise.all([
      supabase.from("portfolio_images").select("id", { count: "exact" }),
      supabase.from("investment_packages").select("id", { count: "exact" }),
      supabase.from("testimonials").select("id", { count: "exact" }),
      supabase.from("faqs").select("id", { count: "exact" }),
    ])

  return {
    portfolio: portfolioResult.count || 0,
    packages: packagesResult.count || 0,
    testimonials: testimonialsResult.count || 0,
    faqs: faqsResult.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: "Portfolio Images",
      value: stats.portfolio,
      icon: Image,
      href: "/admin/portfolio",
      description: "Manage your portfolio gallery",
    },
    {
      title: "Investment Packages",
      value: stats.packages,
      icon: Package,
      href: "/admin/packages",
      description: "Configure pricing packages",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      description: "Client testimonials and reviews",
    },
    {
      title: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      href: "/admin/faqs",
      description: "Frequently asked questions",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to the admin panel. Manage your site content here."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/portfolio"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Add new portfolio image
            </Link>
            <Link
              href="/admin/testimonials"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Add testimonial
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Update site settings
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>View your live site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/"
              target="_blank"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Homepage
            </Link>
            <Link
              href="/portfolio"
              target="_blank"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Portfolio
            </Link>
            <Link
              href="/investment"
              target="_blank"
              className="block rounded-md p-3 text-sm transition-colors hover:bg-muted"
            >
              Investment
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
