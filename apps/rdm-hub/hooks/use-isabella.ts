'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { IsabellaDecision } from '@nodo-cero/ai-sdk/contracts'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
}

const SESSION_KEY = 'isabella_session_id'

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export interface ChatResult {
  ok: boolean
  decision: IsabellaDecision
  sessionId: string | null
  response: string
}

export function useIsabellaChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (prompt: string): Promise<ChatResult> => {
      const res = await fetch('/api/v1/isabella', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: 'chat',
          payload: { input: prompt },
          timestamp: new Date().toISOString(),
          sessionId: getSessionId(),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || 'Isabella request failed')
      }
      const data = (await res.json()) as ChatResult
      if (data.sessionId && typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, data.sessionId)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isabella', 'history'] })
    },
  })
}

export function useIsabellaHistory() {
  const sessionId = typeof window !== 'undefined' ? getSessionId() : ''

  return useQuery({
    queryKey: ['isabella', 'history', sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await fetch(
        `/api/v1/isabella?action=history&sessionId=${encodeURIComponent(sessionId)}`,
      )
      if (!res.ok) throw new Error('Failed to fetch Isabella history')
      const data = await res.json()
      return data.messages as Message[]
    },
  })
}
