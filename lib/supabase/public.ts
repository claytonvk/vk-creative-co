import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Public client for read-only queries (no auth, no cookies)
// Use this for cached queries that don't need user context
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
