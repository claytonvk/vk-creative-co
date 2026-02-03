import { redirect } from "next/navigation"
import { getUser, isAdmin } from "@/lib/supabase/server"
import { Sidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const admin = await isAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-6xl p-8">{children}</div>
      </main>
    </div>
  )
}
