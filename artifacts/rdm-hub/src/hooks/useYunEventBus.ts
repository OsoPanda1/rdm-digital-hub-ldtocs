// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  subscribe,
  publish,
  createEvent,
  YunEventType,
  YunDomain,
  YunFederation,
  YunEvent,
  getEventLog,
} from '@/core/yun/event-bus';
import type { YunEventEnvelope } from '@/core/yun/types';

// ============================================================================
// YUN Event Bus React Hook - Wire YUN constitutional event bus to React UI
// ============================================================================

export interface UseYunEventBusOptions {
  eventType?: string; // Exact type or pattern (e.g., 'yun.commerce.*')
  domain?: YunDomain;
  federation?: YunFederation;
  autoSubscribe?: boolean;
}

export interface YunEventMessage<T = unknown> {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  data: T;
  metadata: {
    version: string;
    correlationId?: string;
    causationId?: string;
    federation?: YunFederation;
    domain?: YunDomain;
    classification?: string;
  };
}

export function useYunEventBus<T = unknown>(options: UseYunEventBusOptions = {}) {
  const { eventType, domain, federation, autoSubscribe = true } = options;
  const [events, setEvents] = useState<YunEventMessage<T>[]>([]);
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const bufferRef = useRef<YunEventMessage<T>[]>([]);
  const flushTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flush buffer to state (batched updates for performance)
  const flushBuffer = useCallback(() => {
    if (bufferRef.current.length > 0) {
      setEvents(prev => [...bufferRef.current, ...prev].slice(0, 500));
      bufferRef.current = [];
    }
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
      flushTimeoutRef.current = null;
    }
  }, []);

  // Subscribe to events
  const subscribeToEvents = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    const pattern = eventType || (domain ? `yun.${domain}.*` : '*');
    
    try {
      unsubscribeRef.current = subscribe(pattern, (envelope: YunEventEnvelope<T>) => {
        const message: YunEventMessage<T> = {
          id: envelope.id,
          type: envelope.type,
          source: envelope.source,
          timestamp: envelope.timestamp,
          data: envelope.data,
          metadata: envelope.metadata,
        };

        // Filter by federation if specified
        if (federation && envelope.metadata.federation !== federation) {
          return;
        }

        // Batch updates for performance
        bufferRef.current.push(message);
        if (bufferRef.current.length >= 20) {
          flushBuffer();
        } else if (!flushTimeoutRef.current) {
          flushTimeoutRef.current = setTimeout(flushBuffer, 100);
        }
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed');
    }
  }, [eventType, domain, federation, flushBuffer]);

  // Publish event
  const emit = useCallback(async (
    type: YunEventType,
    source: string,
    data: T,
    metadata?: {
      correlationId?: string;
      causationId?: string;
      federation?: YunFederation;
      domain?: YunDomain;
      classification?: string;
    }
  ) => {
    try {
      const event = createEvent(type, source, data, metadata);
      await publish(event);
      return { success: true, eventId: event.id };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  // Get recent events from log
  const getHistory = useCallback((limit = 100) => {
    return getEventLog(limit);
  }, []);

  // Clear local event history
  const clearHistory = useCallback(() => {
    setEvents([]);
  }, []);

  // Manual resubscribe
  const resubscribe = useCallback(() => {
    subscribeToEvents();
  }, [subscribeToEvents]);

  useEffect(() => {
    if (autoSubscribe) {
      subscribeToEvents();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, [subscribeToEvents, autoSubscribe]);

  // Periodic health check
  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we're receiving events
      const recentEvents = getEventLog(10);
      const hasRecent = recentEvents.some(e => 
        Date.now() - new Date(e.timestamp).getTime() < 30000
      );
      setConnected(hasRecent);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    events,
    connected,
    error,
    emit,
    getHistory,
    clearHistory,
    resubscribe,
    subscribe: subscribeToEvents,
    unsubscribe: () => unsubscribeRef.current?.(),
  };
}

// ============================================================================
// Specialized hooks for common event patterns
// ============================================================================

// Domain-specific event hooks
export function useCommerceEvents() {
  return useYunEventBus({ domain: 'commerce' });
}

export function useIdentityEvents() {
  return useYunEventBus({ domain: 'identity' });
}

export function useKnowledgeEvents() {
  return useYunEventBus({ domain: 'knowledge' });
}

export function useTelemetryEvents() {
  return useYunEventBus({ domain: 'telemetry' });
}

export function useGameplayEvents() {
  return useYunEventBus({ domain: 'gameplay' });
}

// Federation-specific event hooks
export function useFederationEvents(federation: YunFederation) {
  return useYunEventBus({ federation });
}

// System event hooks
export function useSystemHealthEvents() {
  return useYunEventBus({ eventType: 'yun.system.health' });
}

export function useFederationDegradedEvents() {
  return useYunEventBus({ eventType: 'yun.federation.degraded' });
}

export function useFederationRecoveredEvents() {
  return useYunEventBus({ eventType: 'yun.federation.recovered' });
}

// Isabella-specific events
export function useIsabellaEvents() {
  return useYunEventBus({ eventType: 'yun.isabella.*' });
}

// ============================================================================
// Event Publisher Hook - For components that need to emit events
// ============================================================================

export function useYunPublisher() {
  const publishEvent = useCallback(async <T>(
    type: YunEventType,
    source: string,
    data: T,
    metadata?: {
      correlationId?: string;
      causationId?: string;
      federation?: YunFederation;
      domain?: YunDomain;
      classification?: string;
    }
  ) => {
    const event = createEvent(type, source, data, metadata);
    await publish(event);
    return event;
  }, []);

  // Convenience methods for common event types
  const publishEntityCreated = useCallback(<T>(
    domain: YunDomain,
    entity: string,
    data: T,
    source: string,
    metadata?: { federation?: YunFederation }
  ) => {
    return publishEvent(`yun.${domain}.${entity}.created`, source, data, { ...metadata, domain });
  }, [publishEvent]);

  const publishEntityUpdated = useCallback(<T>(
    domain: YunDomain,
    entity: string,
    data: T,
    source: string,
    metadata?: { federation?: YunFederation }
  ) => {
    return publishEvent(`yun.${domain}.${entity}.updated`, source, data, { ...metadata, domain });
  }, [publishEvent]);

  const publishEntityDeleted = useCallback(<T>(
    domain: YunDomain,
    entity: string,
    data: T,
    source: string,
    metadata?: { federation?: YunFederation }
  ) => {
    return publishEvent(`yun.${domain}.${entity}.deleted`, source, data, { ...metadata, domain });
  }, [publishEvent]);

  const publishSystemHealth = useCallback((
    status: string,
    score: number,
    source: string,
    details?: string
  ) => {
    return publishEvent('yun.system.health', source, { status, score, details });
  }, [publishEvent]);

  const publishFederationDegraded = useCallback((
    federation: YunFederation,
    source: string,
    data: unknown
  ) => {
    return publishEvent('yun.federation.degraded', source, data, { federation });
  }, [publishEvent]);

  const publishFederationRecovered = useCallback((
    federation: YunFederation,
    source: string,
    data: unknown
  ) => {
    return publishEvent('yun.federation.recovered', source, data, { federation });
  }, [publishEvent]);

  return {
    publishEvent,
    publishEntityCreated,
    publishEntityUpdated,
    publishEntityDeleted,
    publishSystemHealth,
    publishFederationDegraded,
    publishFederationRecovered,
  };
}

// ============================================================================
// Connection Pool for Isabella SSE/WebSocket - Reduces latency
// ============================================================================

interface ConnectionPoolConfig {
  maxConnections: number;
  endpoint: string;
  reconnectInterval: number;
  maxRetries: number;
}

interface PooledConnection {
  id: string;
  eventSource: EventSource | null;
  state: 'connecting' | 'connected' | 'reconnecting' | 'closed';
  lastUsed: number;
  messageCount: number;
  retryCount: 0;
}

class IsabellaConnectionPool {
  private static instance: IsabellaConnectionPool;
  private connections: Map<string, PooledConnection> = new Map();
  private config: ConnectionPoolConfig;
  private listenerMap: Map<string, Set<(data: any) => void>> = new Map();

  private constructor(config: ConnectionPoolConfig) {
    this.config = config;
  }

  static getInstance(config?: ConnectionPoolConfig): IsabellaConnectionPool {
    if (!IsabellaConnectionPool.instance && config) {
      IsabellaConnectionPool.instance = new IsabellaConnectionPool(config);
    }
    return IsabellaConnectionPool.instance;
  }

  getConnection(key: string = 'default'): PooledConnection {
    let conn = this.connections.get(key);
    
    if (!conn) {
      conn = this.createConnection(key);
      this.connections.set(key, conn);
    }
    
    conn.lastUsed = Date.now();
    conn.messageCount++;
    return conn;
  }

  private createConnection(key: string): PooledConnection {
    const conn: PooledConnection = {
      id: `${key}-${Date.now()}`,
      eventSource: null,
      state: 'connecting',
      lastUsed: Date.now(),
      messageCount: 0,
      retryCount: 0,
    };

    this.connect(conn);
    return conn;
  }

  private connect(conn: PooledConnection) {
    if (conn.state === 'connected' && conn.eventSource?.readyState === EventSource.OPEN) {
      return;
    }

    conn.state = conn.retryCount > 0 ? 'reconnecting' : 'connecting';
    
    try {
      const es = new EventSource(this.config.endpoint);
      conn.eventSource = es;

      es.onopen = () => {
        conn.state = 'connected';
        conn.retryCount = 0;
        this.notifyListeners('connected', { connectionId: conn.id });
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.notifyListeners('message', { connectionId: conn.id, data });
          this.notifyListeners(`message:${data.type}`, { connectionId: conn.id, data });
        } catch {
          // Ignore parse errors
        }
      };

      es.onerror = () => {
        es.close();
        conn.state = 'reconnecting';
        conn.retryCount++;
        
        if (conn.retryCount >= this.config.maxRetries) {
          conn.state = 'closed';
          this.notifyListeners('error', { connectionId: conn.id, error: 'Max retries exceeded' });
          return;
        }

        const delay = Math.min(
          this.config.reconnectInterval * Math.pow(2, conn.retryCount - 1),
          30000
        );
        
        setTimeout(() => this.connect(conn), delay);
      };
    } catch (err) {
      conn.state = 'closed';
      this.notifyListeners('error', { connectionId: conn.id, error: err });
    }
  }

  subscribe(connectionId: string, eventType: string, callback: (data: any) => void): () => void {
    const key = `${connectionId}:${eventType}`;
    if (!this.listenerMap.has(key)) {
      this.listenerMap.set(key, new Set());
    }
    this.listenerMap.get(key)!.add(callback);

    return () => {
      const listeners = this.listenerMap.get(key);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listenerMap.delete(key);
        }
      }
    };
  }

  private notifyListeners(event: string, payload: any) {
    const listeners = this.listenerMap.get(event);
    if (listeners) {
      listeners.forEach(cb => {
        try { cb(payload); } catch {}
      });
    }
  }

  closeConnection(key: string) {
    const conn = this.connections.get(key);
    if (conn) {
      conn.eventSource?.close();
      conn.state = 'closed';
      this.connections.delete(key);
    }
  }

  closeAll() {
    for (const [key] of this.connections) {
      this.closeConnection(key);
    }
  }

  getStats() {
    return {
      totalConnections: this.connections.size,
      connections: Array.from(this.connections.values()).map(c => ({
        id: c.id,
        state: c.state,
        messageCount: c.messageCount,
        retryCount: c.retryCount,
      })),
    };
  }
}

// React hook for connection pool
export function useIsabellaConnectionPool(config?: Partial<ConnectionPoolConfig>) {
  const poolRef = useRef<IsabellaConnectionPool | null>(null);
  const [stats, setStats] = useState<{ totalConnections: number; connections: any[] }>({
    totalConnections: 0,
    connections: [],
  });

  useEffect(() => {
    const fullConfig: ConnectionPoolConfig = {
      maxConnections: config?.maxConnections ?? 3,
      endpoint: config?.endpoint ?? `${import.meta.env.VITE_API_GATEWAY}/isabella/stream`,
      reconnectInterval: config?.reconnectInterval ?? 3000,
      maxRetries: config?.maxRetries ?? 5,
    };

    poolRef.current = IsabellaConnectionPool.getInstance(fullConfig);

    const interval = setInterval(() => {
      if (poolRef.current) {
        setStats(poolRef.current.getStats());
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [config?.endpoint, config?.maxConnections, config?.reconnectInterval, config?.maxRetries]);

  const getConnection = useCallback((key?: string) => {
    return poolRef.current?.getConnection(key);
  }, []);

  const subscribe = useCallback((
    connectionId: string,
    eventType: string,
    callback: (data: any) => void
  ) => {
    return poolRef.current?.subscribe(connectionId, eventType, callback) ?? (() => {});
  }, []);

  return { getConnection, subscribe, stats };
}

// Export the class for direct use
export { IsabellaConnectionPool };