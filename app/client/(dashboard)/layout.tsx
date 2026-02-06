import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, Images } from "lucide-react"
import { getClientProfile } from "@/lib/actions/client-auth"
import { clientLogout } from "@/lib/actions/client-auth"

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check portal cookie first - must be logged in as client
  const cookieStore = await cookies()
  const portalType = cookieStore.get("portal_type")?.value

  if (portalType !== "client") {
    redirect("/client/switch")
  }

  const client = await getClientProfile()

  if (!client) {
    redirect("/client/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/client" className="flex items-center gap-2 font-semibold">
              <Images className="h-5 w-5" />
              My Galleries
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {client.name}
            </span>
            <form action={clientLogout}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
