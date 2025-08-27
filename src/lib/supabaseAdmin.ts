// Server-side Supabase client with service role to bypass RLS for controlled ops.
// DO NOT import this file in client components.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  // We intentionally don't throw here to allow environments without the key to boot.
  // Functions that require admin access should throw if key missing.
  console.warn(
    "[supabaseAdmin] SUPABASE_SERVICE_ROLE_KEY not set; admin DB operations will fail."
  );
}

export const supabaseAdmin = serviceKey
  ? createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : undefined;
