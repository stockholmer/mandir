import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only operations.
 * Bypasses RLS — use only in Server Actions and API routes.
 * NEVER expose this to the client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
