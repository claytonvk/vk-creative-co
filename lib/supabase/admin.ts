import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Service role client for admin operations
// Only use in server-side code (Server Actions, API routes)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env.local file."
    )
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
