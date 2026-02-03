"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { Category } from "@/lib/supabase/types"

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function getCategory(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Category
}

export async function createCategory(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string || name.toLowerCase().replace(/\s+/g, "-")
  const description = formData.get("description") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, description, display_order })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/portfolio")
  return { data }
}

export async function updateCategory(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0

  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug, description, display_order })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/portfolio")
  return { data }
}

export async function deleteCategory(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/portfolio")
  return { success: true }
}
