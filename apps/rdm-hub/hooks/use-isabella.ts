'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

export function useIsabellaChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch('/api/v1/isabella', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'perceive',
          payload: { input: prompt },
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || 'Isabella request failed')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isabella', 'history'] })
    },
  })
}

export function useIsabellaHistory() {
  return useQuery({
    queryKey: ['isabella', 'history'],
    queryFn: async () => {
      const res = await fetch('/api/v1/isabella?action=history')
      if (!res.ok) throw new Error('Failed to fetch Isabella history')
      return res.json() as Promise<Message[]>
    },
  })
}
