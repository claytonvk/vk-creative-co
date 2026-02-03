import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { FAQ } from "@/lib/supabase/types"

export const getFAQs = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (error) throw error
    return data as FAQ[]
  },
  ["faqs"],
  { revalidate: 60, tags: ["faqs"] }
)

export const getFAQsByCategory = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("category", { ascending: true })
      .order("display_order", { ascending: true })

    if (error) throw error

    const grouped: Record<string, FAQ[]> = {}
    for (const faq of data || []) {
      const category = faq.category || "General"
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(faq)
    }

    return grouped
  },
  ["faqs-by-category"],
  { revalidate: 60, tags: ["faqs"] }
)
