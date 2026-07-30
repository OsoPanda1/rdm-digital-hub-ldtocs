'use client'

import { useQuery } from '@tanstack/react-query'

export interface HealthStatus {
  status: string
  db: { connected: boolean; latency_ms: number; tables: string[] }
  memory: { items: number }
  last_cleanup: string | null
  policies: { total: number; active: number }
  tools: { total: number; active: number }
  supabase_region: string
  timestamp: string
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error('Health check failed')
      return res.json() as Promise<HealthStatus>
    },
    refetchInterval: 30000,
  })
}

export function useIsabellaStatus() {
  return useQuery({
    queryKey: ['isabella', 'status'],
    queryFn: async () => {
      const res = await fetch('/api/v1/isabella')
      if (!res.ok) throw new Error('Isabella status check failed')
      return res.json()
    },
    refetchInterval: 60000,
  })
}
