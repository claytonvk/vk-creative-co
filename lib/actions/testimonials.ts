"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { Testimonial } from "@/lib/supabase/types"

export async function getTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as Testimonial[]
}

export async function getPublishedTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as Testimonial[]
}

export async function getFeaturedTestimonials() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order", { ascending: true })

  if (error) throw error
  return data as Testimonial[]
}

export async function getTestimonial(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as Testimonial
}

export async function createTestimonial(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const quote = formData.get("quote") as string
  const author_name = formData.get("author_name") as string
  const author_role = formData.get("author_role") as string | null
  const author_image_url = formData.get("author_image_url") as string | null
  const rating = formData.get("rating") ? parseInt(formData.get("rating") as string) : null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") !== "false"

  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      quote,
      author_name,
      author_role,
      author_image_url,
      rating,
      display_order,
      is_featured,
      is_published,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/")
  return { data }
}

export async function updateTestimonial(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const quote = formData.get("quote") as string
  const author_name = formData.get("author_name") as string
  const author_role = formData.get("author_role") as string | null
  const author_image_url = formData.get("author_image_url") as string | null
  const rating = formData.get("rating") ? parseInt(formData.get("rating") as string) : null
  const display_order = parseInt(formData.get("display_order") as string) || 0
  const is_featured = formData.get("is_featured") === "true"
  const is_published = formData.get("is_published") === "true"

  const { data, error } = await supabase
    .from("testimonials")
    .update({
      quote,
      author_name,
      author_role,
      author_image_url,
      rating,
      display_order,
      is_featured,
      is_published,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/")
  return { data }
}

export async function deleteTestimonial(id: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/testimonials")
  revalidatePath("/")
  return { success: true }
}
