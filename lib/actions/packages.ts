"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { InvestmentPackage } from "@/lib/supabase/types"

export async function getPackages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("investment_packages")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as InvestmentPackage[]
}

export async function getPublishedPackages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("investment_packages")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as InvestmentPackage[]
}

export async function getPackage(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("investment_packages")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as InvestmentPackage
}

export async function createPackage(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const name = formData.get("name") as string
  const price = parseInt(formData.get("price") as string) || 0
  const price_display = formData.get("price_display") as string | null
  const description = formData.get("description") as string | null
  const featuresRaw = formData.get("features") as string
  const features = featuresRaw ? JSON.parse(featuresRaw) : []
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") !== "false"
  const badge_text = formData.get("badge_text") as string | null

  const { data, error } = await supabase
    .from("investment_packages")
    .insert({
      name,
      price,
      price_display,
      description,
      features,
      display_order,
      is_featured,
      is_published,
      badge_text,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/packages")
  revalidatePath("/investment")
  return { data }
}

export async function updatePackage(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const name = formData.get("name") as string
  const price = parseInt(formData.get("price") as string) || 0
  const price_display = formData.get("price_display") as string | null
  const description = formData.get("description") as string | null
  const featuresRaw = formData.get("features") as string
  const features = featuresRaw ? JSON.parse(featuresRaw) : []
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") === "true"
  const badge_text = formData.get("badge_text") as string | null

  const { data, error } = await supabase
    .from("investment_packages")
    .update({
      name,
      price,
      price_display,
      description,
      features,
      display_order,
      is_featured,
      is_published,
      badge_text,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/packages")
  revalidatePath("/investment")
  return { data }
}

export async function deletePackage(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("investment_packages")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/packages")
  revalidatePath("/investment")
  return { success: true }
}
