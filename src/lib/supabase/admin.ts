import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase admin client that bypasses Row Level Security.
 *
 * Uses the `SUPABASE_SERVICE_ROLE_KEY` — this must NEVER be imported
 * from a Client Component or exposed to the browser.
 *
 * Typical use-cases:
 *  - Public widget pages that fetch approved testimonials without a user session.
 *  - Server Actions that insert testimonials on behalf of unauthenticated visitors.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
