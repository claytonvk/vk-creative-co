import { unstable_cache } from "next/cache"
import { createPublicClient } from "@/lib/supabase/public"
import type { ValueProp } from "@/lib/supabase/types"

export const getValueProps = unstable_cache(
  async () => {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from("value_props")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (error) throw error
    return data as ValueProp[]
  },
  ["value-props"],
  { revalidate: 60, tags: ["value-props"] }
)
