import { supabase } from './client'

export async function attachSupabaseAuth(request: Request): Promise<Request> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return request
  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${token}`)
  return new Request(request, { headers })
}
