'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Route {
  id: string
  name: string
  description: string
  category: string
  duration: string
  distance: number
  image_url?: string
}

function getClient() {
  return createClient()
}

export function useRutas() {
  return useQuery({
    queryKey: ['rutas'],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('routes').select('*').order('name')
      if (error) throw error
      return data as Route[]
    },
  })
}
