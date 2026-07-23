- [Supabase null-safe client](supabase-null-safe.md) — export supabase as null when VITE_SUPABASE_URL/ANON_KEY are missing; guard all auth context usages with null checks. ✅ FIXED
  - `client.ts`: exports `null` when env vars missing, checks both `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `RDMAuthContext.tsx`: `guardSupabase()` helper throws if supabase is null, used in all methods; useEffect early-returns when `!isSupabaseConfigured`

- [node:crypto in browser](node-crypto-browser.md) — server-only files imported transitively by client code must not use node:crypto; shim createHmac or remove the import. ✅ FIXED
  - `middleware.ts`: `createHmac` browser shim in place; `process.env` replaced with `import.meta.env`; `Buffer` replaced with browser-safe `base64UrlDecode` using `atob`
