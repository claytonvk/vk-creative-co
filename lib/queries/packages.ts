import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { InvestmentPackage } from "@/lib/supabase/types"

export const getPackages = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("investment_packages")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (error) throw error
    return data as InvestmentPackage[]
  },
  ["packages"],
  { revalidate: 60, tags: ["packages"] }
)

export const getFeaturedPackage = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("investment_packages")
      .select("*")
      .eq("is_published", true)
      .eq("is_featured", true)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data as InvestmentPackage | null
  },
  ["featured-package"],
  { revalidate: 60, tags: ["packages"] }
)

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}
