import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export async function requireSupabaseAuth(request: Request): Promise<{ supabase: ReturnType<typeof createClient<Database>>; userId: string; claims: Record<string, unknown> }> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ]
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(', ')}`)
  }

  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No valid authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  if (!token) throw new Error('Unauthorized: No token provided')

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) throw new Error('Unauthorized: Invalid token')

  return { supabase, userId: data.user.id, claims: data.user.app_metadata ?? {} }
}
