"use server"

import { revalidatePath } from "next/cache"
import { createClient, isAdmin } from "@/lib/supabase/server"
import type { SiteSetting } from "@/lib/supabase/types"

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

export async function updateSettings(settings: Array<{ key: string; value: string | null }>) {
  if (!(await isAdmin())) {
    return { error: "Unauthorized" }
  }

  const supabase = await createClient()

  const results = []
  for (const setting of settings) {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", setting.key)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from("site_settings")
        .update({ value: setting.value })
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
        .insert({ key: setting.key, value: setting.value })
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
