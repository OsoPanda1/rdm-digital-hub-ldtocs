---
name: Supabase null-safe client
description: Export a null-safe Supabase client when credentials are missing, preventing app crashes.
status: FIXED
---

## Implementation
- `artifacts/rdm-hub/src/integrations/supabase/client.ts` — exports `supabase: SupabaseClient | null` (null when env vars missing)
- `artifacts/rdm-hub/src/contexts/RDMAuthContext.tsx` — `guardSupabase()` helper throws if supabase is null; all `sb.auth.X` and `sb.from()` calls use guarded reference
- Checks both `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY` as anon key alias
