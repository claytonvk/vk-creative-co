"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

const PORTAL_COOKIE = "portal_type"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  // Check if user is an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single()

    if (!adminUser) {
      await supabase.auth.signOut()
      return { error: "You do not have admin access" }
    }
  }

  // Set portal cookie to admin (not httpOnly so navbar can read it)
  const cookieStore = await cookies()
  cookieStore.set(PORTAL_COOKIE, "admin", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  revalidatePath("/admin", "layout")
  redirect("/admin")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear portal cookie
  const cookieStore = await cookies()
  cookieStore.delete(PORTAL_COOKIE)

  revalidatePath("/", "layout")
  redirect("/admin/login")
}

export async function switchToAdminPortal() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear portal cookie
  const cookieStore = await cookies()
  cookieStore.delete(PORTAL_COOKIE)
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function checkAdminAuth() {
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

export async function isAdminPortal() {
  const cookieStore = await cookies()
  const portalType = cookieStore.get(PORTAL_COOKIE)?.value
  return portalType === "admin"
}
