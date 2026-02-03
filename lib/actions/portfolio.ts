"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { PortfolioImage } from "@/lib/supabase/types"

export async function getPortfolioImages(categoryId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from("portfolio_images")
    .select("*, categories(name, slug)")
    .order("display_order", { ascending: true })

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getPortfolioImage(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("portfolio_images")
    .select("*, categories(name, slug)")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getFeaturedImages() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("portfolio_images")
    .select("*, categories(name, slug)")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error) throw error
  return data
}

export async function createPortfolioImage(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string | null
  const image_url = formData.get("image_url") as string
  const category_id = formData.get("category_id") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") !== "false"
  const alt_text = formData.get("alt_text") as string | null

  const { data, error } = await supabase
    .from("portfolio_images")
    .insert({
      title,
      description,
      image_url,
      category_id: category_id || null,
      display_order,
      is_featured,
      is_published,
      alt_text,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/portfolio")
  revalidatePath("/portfolio")
  revalidatePath("/")
  return { data }
}

export async function updatePortfolioImage(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string | null
  const image_url = formData.get("image_url") as string
  const category_id = formData.get("category_id") as string | null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") === "true"
  const alt_text = formData.get("alt_text") as string | null

  const { data, error } = await supabase
    .from("portfolio_images")
    .update({
      title,
      description,
      image_url,
      category_id: category_id || null,
      display_order,
      is_featured,
      is_published,
      alt_text,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/portfolio")
  revalidatePath("/portfolio")
  revalidatePath("/")
  return { data }
}

export async function deletePortfolioImage(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  // First get the image to delete from storage
  const { data: image } = await supabase
    .from("portfolio_images")
    .select("image_url")
    .eq("id", id)
    .single()

  // Delete from database
  const { error } = await supabase
    .from("portfolio_images")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  // Try to delete from storage if it's a Supabase storage URL
  if (image?.image_url?.includes("supabase")) {
    const path = image.image_url.split("/portfolio/")[1]
    if (path) {
      await supabase.storage.from("portfolio").remove([path])
    }
  }

  revalidatePath("/admin/portfolio")
  revalidatePath("/portfolio")
  revalidatePath("/")
  return { success: true }
}

export async function uploadPortfolioImage(file: File) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file)

  if (error) {
    return { error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from("portfolio")
    .getPublicUrl(data.path)

  return { url: publicUrl }
}
