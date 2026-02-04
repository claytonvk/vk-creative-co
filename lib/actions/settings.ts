"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { SiteSetting } from "@/lib/supabase/types"

export async function uploadSiteImage(formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { error: "Unauthorized - please log in as admin" }
    }

    const file = formData.get("file") as File
    const settingKey = formData.get("settingKey") as string

    if (!file || !settingKey) {
      return { error: "File and setting key are required" }
    }

    // Check file size server-side too (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "File size must be less than 10MB" }
    }

    const supabase = await createClient()

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${settingKey}-${Date.now()}.${fileExt}`

    console.log("Uploading to site-assets bucket:", fileName)

    // Upload to site-assets bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      // Check if bucket doesn't exist
      if (uploadError.message.includes("bucket") || uploadError.message.includes("not found")) {
        return { error: "Storage bucket not configured. Please run database migrations." }
      }
      return { error: `Upload failed: ${uploadError.message}` }
    }

    if (!uploadData?.path) {
      return { error: "Upload succeeded but no path returned" }
    }

    console.log("Upload successful, path:", uploadData.path)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("site-assets")
      .getPublicUrl(uploadData.path)

    console.log("Public URL:", publicUrl)

    // Update the setting with the new URL
    const result = await updateSetting(settingKey, publicUrl)

    if (result.error) {
      return { error: result.error }
    }

    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/contact")
    revalidatePath("/investment")
    revalidatePath("/portfolio")
    revalidatePath("/admin/settings")

    return { url: publicUrl }
  } catch (err) {
    console.error("uploadSiteImage error:", err)
    return { error: "An unexpected error occurred during upload" }
  }
}

export async function getAllSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("category", { ascending: true })
    .order("key", { ascending: true })

  if (error) throw error
  return data as SiteSetting[]
}

export async function getSettingsByCategory(category: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("category", category)
    .order("key", { ascending: true })

  if (error) throw error
  return data as SiteSetting[]
}

export async function getSetting(key: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", key)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data as SiteSetting | null
}

export async function getSettingsMap(keys: string[]) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, value_json")
    .in("key", keys)

  if (error) throw error

  const map: Record<string, string | null> = {}
  for (const setting of data || []) {
    map[setting.key] = setting.value
  }
  return map
}

export async function updateSetting(key: string, value: string | null, valueJson?: unknown) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", key)
    .single()

  let result
  if (existing) {
    result = await supabase
      .from("site_settings")
      .update({
        value,
        value_json: valueJson || null,
      })
      .eq("key", key)
      .select()
      .single()
  } else {
    result = await supabase
      .from("site_settings")
      .insert({
        key,
        value,
        value_json: valueJson || null,
      })
      .select()
      .single()
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  return { data: result.data }
}

function getCategoryFromKey(key: string): string {
  // Derive category from key prefix
  if (key.startsWith("hero_")) return "hero"
  if (key.startsWith("cta_")) return "cta"
  if (key.startsWith("about_")) return "about"
  if (key.startsWith("contact_")) return "contact"
  if (key.startsWith("investment_")) return "investment"
  if (key.startsWith("portfolio_")) return "portfolio"
  if (key.startsWith("social_")) return "social"
  if (key.startsWith("footer_")) return "footer"
  return "general"
}

export async function updateSettings(settings: Array<{ key: string; value: string | null }>) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const results = []
  for (const setting of settings) {
    const category = getCategoryFromKey(setting.key)

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", setting.key)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ value: setting.value, category })
        .eq("key", setting.key)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }
      results.push(data)
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert({ key: setting.key, value: setting.value, category })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }
      results.push(data)
    }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/contact")
  revalidatePath("/investment")
  revalidatePath("/portfolio")
  return { data: results }
}

export async function deleteSetting(key: string) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("site_settings")
    .delete()
    .eq("key", key)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/")
  return { success: true }
}
