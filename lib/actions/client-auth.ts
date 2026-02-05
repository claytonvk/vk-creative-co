"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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

  return { success: true }
}

export async function clientLogout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/client/login")
}

export async function clientRegister(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null
  const inviteToken = formData.get("invite_token") as string | null

  // Check if client record exists (from admin invite)
  const { data: existingClient } = await supabase
    .from("clients")
    .select("id")
    .eq("email", email)
    .single()

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create account" }
  }

  if (existingClient) {
    // Update existing client record with user_id
    const { error: updateError } = await supabase
      .from("clients")
      .update({
        user_id: authData.user.id,
        name,
        phone: phone || null,
      })
      .eq("id", existingClient.id)

    if (updateError) {
      return { error: updateError.message }
    }
  } else {
    // Create new client record
    const { error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: authData.user.id,
        email,
        name,
        phone: phone || null,
      })

    if (clientError) {
      return { error: clientError.message }
    }
  }

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

export async function checkInviteEmail(email: string) {
  const supabase = await createClient()

  const { data: client } = await supabase
    .from("clients")
    .select("id, user_id")
    .eq("email", email)
    .single()

  if (!client) {
    return { error: "not_found" as const }
  }

  if (client.user_id) {
    return { error: "already_registered" as const }
  }

  return { valid: true as const }
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
