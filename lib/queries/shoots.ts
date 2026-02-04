import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"

export const getShoots = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("portfolio_shoots")
      .select("*, shoot_media(count), shoot_gallery_links(count), shoot_tags(*, categories(name, slug))")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (error) {
      // Table may not exist yet if migration hasn't run
      if (error.code === "PGRST205" || error.message?.includes("Could not find")) {
        return []
      }
      throw error
    }
    return data
  },
  ["portfolio-shoots"],
  { revalidate: 60, tags: ["shoots"] }
)

export const getShootBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("portfolio_shoots")
      .select("*, shoot_media(*), shoot_gallery_links(*, gallery_media(*)), shoot_tags(*, categories(name, slug))")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) throw error

    // Sort all media by display_order
    if (data.shoot_media) {
      data.shoot_media.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
    }
    if (data.shoot_gallery_links) {
      data.shoot_gallery_links.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
    }

    return data
  },
  ["shoot-by-slug"],
  { revalidate: 60, tags: ["shoots"] }
)

export const getFeaturedShoots = unstable_cache(
  async (limit?: number) => {
    const supabase = createPublicClient()

    let query = supabase
      .from("portfolio_shoots")
      .select("*, shoot_media(count), shoot_gallery_links(count), shoot_tags(*, categories(name, slug))")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      // Table may not exist yet if migration hasn't run
      if (error.code === "PGRST205" || error.message?.includes("Could not find")) {
        return []
      }
      throw error
    }
    return data
  },
  ["featured-shoots"],
  { revalidate: 60, tags: ["shoots", "featured"] }
)
