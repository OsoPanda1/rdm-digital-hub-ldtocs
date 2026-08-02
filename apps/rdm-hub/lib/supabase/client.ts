import { createBrowserClient } from "@supabase/ssr";
import { env } from "../env";

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
  );
}
