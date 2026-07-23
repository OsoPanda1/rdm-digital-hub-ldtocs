// Runtime-agnostic Supabase bearer verifier for Express/serverless handlers.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export interface VerifiedSupabaseContext {
  supabase: ReturnType<typeof createClient<Database>>
  userId: string
  claims: Record<string, unknown>
}

export async function verifySupabaseBearerToken(headers: Headers): Promise<VerifiedSupabaseContext> {
  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [!SUPABASE_URL && 'SUPABASE_URL', !SUPABASE_PUBLISHABLE_KEY && 'SUPABASE_PUBLISHABLE_KEY'].filter(Boolean)
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(', ')}`)
  }

  const authHeader = headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized: Bearer token required')

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) throw new Error('Unauthorized: empty token')

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase.auth.getClaims(token)
  if (error || !data?.claims?.sub) throw new Error('Unauthorized: invalid token')

  return { supabase, userId: data.claims.sub, claims: data.claims as Record<string, unknown> }
}
