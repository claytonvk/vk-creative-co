import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { Testimonial } from "@/lib/supabase/types"

export const getTestimonials = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (error) throw error
    return data as Testimonial[]
  },
  ["testimonials"],
  { revalidate: 60, tags: ["testimonials"] }
)

export const getFeaturedTestimonials = unstable_cache(
  async (limit?: number) => {
    const supabase = createPublicClient()

    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("display_order", { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Testimonial[]
  },
  ["featured-testimonials"],
  { revalidate: 60, tags: ["testimonials"] }
)
