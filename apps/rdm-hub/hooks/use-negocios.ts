'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Business {
  id: string
  name: string
  cat: string
  description: string
  address: string
  phone?: string
  website?: string
  lat?: number
  lng?: number
  image_url?: string
  created_at: string
}

function getClient() {
  return createClient()
}

export function useNegocios() {
  return useQuery({
    queryKey: ['negocios'],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('businesses').select('*').order('name')
      if (error) throw error
      return data as Business[]
    },
  })
}

export function useNegocio(id: string) {
  return useQuery({
    queryKey: ['negocios', id],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single()
      if (error) throw error
      return data as Business
    },
    enabled: !!id,
  })
}

export function useNegociosByCategory(cat: string) {
  return useQuery({
    queryKey: ['negocios', 'category', cat],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('businesses').select('*').eq('cat', cat).order('name')
      if (error) throw error
      return data as Business[]
    },
    enabled: !!cat,
  })
}
