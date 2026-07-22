// Supabase client — returns null when credentials are missing so the app
// can still run without auth (e.g. in the Replit environment without secrets set).
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

type SupabaseClient = ReturnType<typeof createClient<Database>>;

let _supabase: SupabaseClient | null = null;
let _initialized = false;

function initSupabaseClient(): SupabaseClient | null {
  if (_initialized) return _supabase;
  _initialized = true;

  // Support both naming conventions used across this codebase
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn(
      '[Supabase] Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — ' +
        'authentication is disabled. Set these secrets to enable auth.',
    );
    return null;
  }

  _supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'rdm-digital-hub',
      },
    },
  });

  return _supabase;
}

// Export may be null when credentials are not configured.
export const supabase = initSupabaseClient();
