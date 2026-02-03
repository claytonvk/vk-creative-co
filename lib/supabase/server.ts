import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./types"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  return !!data
}

export async function isClient() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .single()

  return !!data
}

export async function getClientProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return data
}
