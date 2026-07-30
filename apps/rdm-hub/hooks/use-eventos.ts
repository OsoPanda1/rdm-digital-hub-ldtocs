'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  category: string
  created_at: string
}

function getClient() {
  return createClient()
}

export function useEventos() {
  return useQuery({
    queryKey: ['eventos'],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('events').select('*').order('date')
      if (error) throw error
      return data as Event[]
    },
  })
}

export function useEvento(id: string) {
  return useQuery({
    queryKey: ['eventos', id],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (error) throw error
      return data as Event
    },
    enabled: !!id,
  })
}

export function useEventosByCategory(cat: string) {
  return useQuery({
    queryKey: ['eventos', 'category', cat],
    queryFn: async () => {
      const supabase = getClient()
      const { data, error } = await supabase.from('events').select('*').eq('category', cat).order('date')
      if (error) throw error
      return data as Event[]
    },
    enabled: !!cat,
  })
}
