import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"

export const getSetting = unstable_cache(
  async (key: string) => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data?.value || null
  },
  ["setting"],
  { revalidate: 60, tags: ["settings"] }
)

export const getSettingsByCategory = unstable_cache(
  async (category: string) => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", category)
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["settings-by-category"],
  { revalidate: 60, tags: ["settings"] }
)

export const getSettingsMap = unstable_cache(
  async (keys: string[]) => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", keys)

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["settings-map"],
  { revalidate: 60, tags: ["settings"] }
)

export const getHeroSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "hero")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["hero-settings"],
  { revalidate: 60, tags: ["settings", "hero"] }
)

export const getContactSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "contact")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["contact-settings"],
  { revalidate: 60, tags: ["settings", "contact"] }
)

export const getSocialSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "social")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["social-settings"],
  { revalidate: 60, tags: ["settings", "social"] }
)

export const getAboutSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "about")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["about-settings"],
  { revalidate: 60, tags: ["settings", "about"] }
)

export const getFooterSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "footer")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["footer-settings"],
  { revalidate: 60, tags: ["settings", "footer"] }
)

export const getCTASettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "cta")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["cta-settings"],
  { revalidate: 60, tags: ["settings", "cta"] }
)

export const getInvestmentSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "investment")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["investment-settings"],
  { revalidate: 60, tags: ["settings", "investment"] }
)

export const getPortfolioSettings = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("category", "portfolio")
      .order("key", { ascending: true })

    if (error) throw error

    const map: Record<string, string | null> = {}
    for (const setting of data || []) {
      map[setting.key] = setting.value
    }
    return map
  },
  ["portfolio-settings"],
  { revalidate: 60, tags: ["settings", "portfolio"] }
)
