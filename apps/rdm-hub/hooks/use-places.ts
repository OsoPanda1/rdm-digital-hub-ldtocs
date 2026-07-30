'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Place {
  id: string
  name: string
  cat: string
  description: string
  lat: number
  lng: number
  address: string
  image_url?: string
  created_at: string
}

function getClient() {
  return createClient()
}

export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('places').select('*').order('name')
      if (error) throw error
      return data as Place[]
    },
  })
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ['places', id],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('places').select('*').eq('id', id).single()
      if (error) throw error
      return data as Place
    },
    enabled: !!id,
  })
}

export function usePlacesByCategory(cat: string) {
  return useQuery({
    queryKey: ['places', 'category', cat],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('places').select('*').eq('cat', cat).order('name')
      if (error) throw error
      return data as Place[]
    },
    enabled: !!cat,
  })
}
