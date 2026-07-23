// React Router/Vite replacement for the removed TanStack React Start auth attacher.
import { supabase } from './client'

export async function getSupabaseAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {}
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}
