import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { clientEnv } from "@/lib/env";

const FALLBACK_SUPABASE_URL = "https://supabase.invalid";
const FALLBACK_SUPABASE_KEY = "supabase-not-configured";

export function hasSupabaseConfig(env: {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}): boolean {
  return Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_PUBLISHABLE_KEY);
}

export const isSupabaseConfigured = hasSupabaseConfig(clientEnv);

function createSupabaseClient() {
  const supabaseUrl = clientEnv.VITE_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
  const supabasePublishableKey = clientEnv.VITE_SUPABASE_PUBLISHABLE_KEY ?? FALLBACK_SUPABASE_KEY;

  if (!isSupabaseConfigured) {
    console.warn(
      "[Supabase] Configuración pública ausente; la aplicación continúa en modo de solo lectura.",
    );
  }

  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let supabaseClient: ReturnType<typeof createSupabaseClient> | undefined;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!supabaseClient) supabaseClient = createSupabaseClient();
    return Reflect.get(supabaseClient, prop, receiver);
  },
});
