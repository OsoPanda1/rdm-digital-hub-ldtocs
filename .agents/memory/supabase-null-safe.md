---
name: Supabase null-safe client
description: How to export a null-safe Supabase client when credentials are missing, preventing app crashes.
---

## Rule
Export `supabase` as `null` (not throw) when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing. Every caller must null-check before accessing `.auth` or `.from()`.

**Why:** The original Lovable-generated client threw inside a lazy getter, causing `supabase.auth.onAuthStateChange` → `Cannot read properties of undefined` crash on any environment without credentials set. The app must degrade gracefully.

**How to apply:**
- `artifacts/rdm-hub/src/integrations/supabase/client.ts` — exports `supabase: SupabaseClient | null`
- `artifacts/rdm-hub/src/contexts/RDMAuthContext.tsx` — checks `if (!supabase)` at top of useEffect and in `loadProfileAndRoles`; all `supabase.X` calls use `supabase!.X` after the guard
- This app also uses `VITE_SUPABASE_PUBLISHABLE_KEY` as the anon key alias — check both env var names
