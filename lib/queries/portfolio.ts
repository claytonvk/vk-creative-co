import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { PortfolioImage, Category } from "@/lib/supabase/types"

export const getCategories = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) throw error
    return data as Category[]
  },
  ["categories"],
  { revalidate: 60, tags: ["categories"] }
)

export const getPortfolioImages = unstable_cache(
  async (categorySlug?: string) => {
    const supabase = createPublicClient()

    let query = supabase
      .from("portfolio_images")
      .select("*, categories(name, slug)")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (categorySlug) {
      query = query.eq("categories.slug", categorySlug)
    }

    const { data, error } = await query

    if (error) throw error
    return data as (PortfolioImage & { categories: { name: string; slug: string } | null })[]
  },
  ["portfolio-images"],
  { revalidate: 60, tags: ["portfolio"] }
)

export const getFeaturedImages = unstable_cache(
  async (limit?: number) => {
    const supabase = createPublicClient()

    let query = supabase
      .from("portfolio_images")
      .select("*, categories(name, slug)")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as (PortfolioImage & { categories: { name: string; slug: string } | null })[]
  },
  ["featured-images"],
  { revalidate: 60, tags: ["portfolio", "featured"] }
)

export const getPortfolioByCategory = unstable_cache(
  async () => {
    const supabase = createPublicClient()

    const { data: categories } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })

    const { data: images } = await supabase
      .from("portfolio_images")
      .select("*, categories(name, slug)")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    const grouped: Record<string, {
      category: Category
      images: (PortfolioImage & { categories: { name: string; slug: string } | null })[]
    }> = {}

    for (const cat of categories || []) {
      grouped[cat.slug] = {
        category: cat,
        images: (images || []).filter((img) => img.category_id === cat.id),
      }
    }

    return grouped
  },
  ["portfolio-by-category"],
  { revalidate: 60, tags: ["portfolio", "categories"] }
)
