"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

const PORTAL_COOKIE = "portal_type"

export async function clientLogin(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if user is a client
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", data.user.id)
    .single()

  if (!client) {
    await supabase.auth.signOut()
    return { error: "Invalid client credentials" }
  }

  // Set portal cookie to client
  const cookieStore = await cookies()
  cookieStore.set(PORTAL_COOKIE, "client", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  revalidatePath("/client", "layout")
  return { success: true }
}

export async function clientLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear portal cookie
  const cookieStore = await cookies()
  cookieStore.delete(PORTAL_COOKIE)

  redirect("/client/login")
}

export async function switchToClientPortal() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Clear portal cookie
  const cookieStore = await cookies()
  cookieStore.delete(PORTAL_COOKIE)
}

export async function clientRegister(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null

  // Try to create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  // Check if user already exists (Supabase returns fake user with empty identities)
  if (!authData.user || authData.user.identities?.length === 0) {
    // User already exists - try to sign them in instead
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return { error: "An account with this email already exists. Please sign in." }
    }

    if (!signInData.user) {
      return { error: "Failed to sign in" }
    }

    // Link client record with existing user
    const { data: linkResult, error: linkError } = await supabase.rpc("link_client_to_user", {
      client_email: email,
      auth_user_id: signInData.user.id,
      client_name: name,
      client_phone: phone || null,
    })

    if (linkError) {
      return { error: linkError.message }
    }

    // Set portal cookie to client
    const cookieStore = await cookies()
    cookieStore.set(PORTAL_COOKIE, "client", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    revalidatePath("/client", "layout")
    return { success: true }
  }

  // New user - link client record
  const { data: linkResult, error: linkError } = await supabase.rpc("link_client_to_user", {
    client_email: email,
    auth_user_id: authData.user.id,
    client_name: name,
    client_phone: phone || null,
  })

  if (linkError) {
    return { error: linkError.message }
  }

  const result = linkResult as { success: boolean; error?: string }
  if (!result.success) {
    return { error: result.error || "Failed to create client profile" }
  }

  // Set portal cookie to client
  const cookieStore = await cookies()
  cookieStore.set(PORTAL_COOKIE, "client", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })

  revalidatePath("/client", "layout")
  return { success: true }
}

export async function getClientProfile() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return client
}

export async function checkClientEmail(email: string) {
  const supabase = await createClient()

  // Use RPC function to bypass RLS for unauthenticated email check
  const { data, error } = await supabase.rpc("check_client_email_status", {
    check_email: email,
  })

  if (error || !data) {
    return { status: "not_found" as const }
  }

  const result = data as { status: string; clientName?: string }

  if (result.status === "sign_in") {
    return { status: "sign_in" as const }
  }

  if (result.status === "set_password") {
    return { status: "set_password" as const, clientName: result.clientName || "" }
  }

  return { status: "not_found" as const }
}

export async function isClient() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .single()

  return !!client
}

export async function isClientPortal() {
  const cookieStore = await cookies()
  const portalType = cookieStore.get(PORTAL_COOKIE)?.value
  return portalType === "client"
}
