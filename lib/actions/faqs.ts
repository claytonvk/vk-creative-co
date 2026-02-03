"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { FAQ } from "@/lib/supabase/types"

export async function getFAQs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as FAQ[]
}

export async function getPublishedFAQs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as FAQ[]
}

export async function getFAQ(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as FAQ
}

export async function createFAQ(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const question = formData.get("question") as string
  const answer = formData.get("answer") as string
  const category = formData.get("category") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_published = formData.get("is_published") !== "false"

  const { data, error } = await supabase
    .from("faqs")
    .insert({
      question,
      answer,
      category,
      display_order,
      is_published,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/investment")
  return { data }
}

export async function updateFAQ(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const question = formData.get("question") as string
  const answer = formData.get("answer") as string
  const category = formData.get("category") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_published = formData.get("is_published") === "true"

  const { data, error } = await supabase
    .from("faqs")
    .update({
      question,
      answer,
      category,
      display_order,
      is_published,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/investment")
  return { data }
}

export async function deleteFAQ(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("faqs")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/faqs")
  revalidatePath("/investment")
  return { success: true }
}
