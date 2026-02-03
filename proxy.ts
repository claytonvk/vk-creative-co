import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/types"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - use getUser() for server-side auth validation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: { user } } = await (supabase.auth as any).getUser()

  // Protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      // If already logged in, redirect to admin dashboard
      if (user) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single()

        if (adminUser) {
          return NextResponse.redirect(new URL("/admin", request.url))
        }
      }
      return supabaseResponse
    }

    // For all other admin routes, require authentication
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if user is an admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (!adminUser) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Protect client routes (except login and register)
  if (request.nextUrl.pathname.startsWith("/client")) {
    // Allow access to login and register pages
    if (
      request.nextUrl.pathname === "/client/login" ||
      request.nextUrl.pathname === "/client/register"
    ) {
      // If already logged in as client, redirect to dashboard
      if (user) {
        const { data: clientUser } = await supabase
          .from("clients")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (clientUser) {
          return NextResponse.redirect(new URL("/client", request.url))
        }
      }
      return supabaseResponse
    }

    // For all other client routes, require authentication
    if (!user) {
      return NextResponse.redirect(new URL("/client/login", request.url))
    }

    // Check if user is a client
    const { data: clientUser } = await supabase
      .from("clients")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (!clientUser) {
      return NextResponse.redirect(new URL("/client/login", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
