// ============================================================================
// Isabella Connection Pool - Shared SSE/WebSocket connection manager
// Reduces latency by reusing connections across components
// ============================================================================

import { useEffect, useRef, useState, useCallback } from 'react';

type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'closed' | 'error';

interface ConnectionPoolConfig {
  url: string;
  maxRetries?: number;
  retryDelay?: number;
  maxRetryDelay?: number;
  heartbeatInterval?: number;
}

interface Subscriber<T> {
  id: string;
  filter?: (data: T) => boolean;
  callback: (data: T) => void;
}

class IsabellaConnectionPool {
  private static instance: IsabellaConnectionPool | null = null;
  private eventSource: EventSource | null = null;
  private subscribers = new Map<string, Subscriber<any>>();
  private config: Required<ConnectionPoolConfig>;
  private state: ConnectionState = 'closed';
  private retryCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private stateListeners = new Set<(state: ConnectionState) => void>();

  private constructor(config: ConnectionPoolConfig) {
    this.config = {
      maxRetries: config.maxRetries ?? 5,
      retryDelay: config.retryDelay ?? 1000,
      maxRetryDelay: config.maxRetryDelay ?? 30000,
      heartbeatInterval: config.heartbeatInterval ?? 25000,
      url: config.url,
    };
  }

  static getInstance(config?: ConnectionPoolConfig): IsabellaConnectionPool {
    if (!IsabellaConnectionPool.instance) {
      if (!config) throw new Error('ConnectionPool requires config on first initialization');
      IsabellaConnectionPool.instance = new IsabellaConnectionPool(config);
    }
    return IsabellaConnectionPool.instance;
  }

  static resetInstance(): void {
    if (IsabellaConnectionPool.instance) {
      IsabellaConnectionPool.instance.destroy();
      IsabellaConnectionPool.instance = null;
    }
  }

  getState(): ConnectionState {
    return this.state;
  }

  onStateChange(listener: (state: ConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    this.stateListeners.forEach(l => l(state));
  }

  subscribe<T>(
    filter: ((data: T) => boolean) | undefined,
    callback: (data: T) => void
  ): () => void {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.subscribers.set(id, { id, filter, callback });

    // Ensure connection is active
    this.ensureConnected();

    return () => {
      this.subscribers.delete(id);
      // Close connection if no subscribers
      if (this.subscribers.size === 0) {
        this.disconnect();
      }
    };
  }

  private ensureConnected(): void {
    if (this.state === 'connected' || this.state === 'connecting') return;
    this.connect();
  }

  private connect(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.setState('connecting');
    this.eventSource = new EventSource(this.config.url);

    this.eventSource.onopen = () => {
      this.retryCount = 0;
      this.setState('connected');
      this.startHeartbeat();
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.dispatch(data);
      } catch (err) {
        console.error('[ConnectionPool] Parse error:', err);
      }
    };

    this.eventSource.onerror = () => {
      this.handleError();
    };
  }

  private handleError(): void {
    this.eventSource?.close();
    this.stopHeartbeat();

    if (this.retryCount >= this.config.maxRetries) {
      this.setState('error');
      return;
    }

    this.setState('reconnecting');
    const delay = Math.min(
      this.config.retryDelay * Math.pow(2, this.retryCount),
      this.config.maxRetryDelay
    );
    this.retryCount++;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.eventSource?.readyState === EventSource.OPEN) {
        // Heartbeat is implicit in SSE - browser handles keep-alive
        // This is just for monitoring
      } else {
        this.handleError();
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private dispatch<T>(data: T): void {
    this.subscribers.forEach(sub => {
      try {
        if (!sub.filter || sub.filter(data)) {
          sub.callback(data);
        }
      } catch (err) {
        console.error('[ConnectionPool] Subscriber error:', err);
      }
    });
  }

  private disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setState('closed');
  }

  destroy(): void {
    this.disconnect();
    this.subscribers.clear();
    this.stateListeners.clear();
  }
}

// React hook for using the connection pool
export function useIsabellaConnectionPool<T = any>(
  filter?: (data: T) => boolean
) {
  const [state, setState] = useState<ConnectionState>('closed');
  const [lastData, setLastData] = useState<T | null>(null);
  const [dataHistory, setDataHistory] = useState<T[]>([]);
  const poolRef = useRef<IsabellaConnectionPool | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const initialize = useCallback((url: string) => {
    if (!poolRef.current) {
      poolRef.current = IsabellaConnectionPool.getInstance({ url });
    }
    
    poolRef.current.onStateChange(setState);
    
    unsubscribeRef.current = poolRef.current.subscribe<T>(
      filter,
      (data) => {
        setLastData(data);
        setDataHistory(prev => [data, ...prev.slice(0, 99)]);
      }
    );
  }, [filter]);

  const disconnect = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    if (poolRef.current) {
      // Force reconnect by creating new instance
      IsabellaConnectionPool.resetInstance();
      poolRef.current = null;
    }
  }, [disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    state,
    lastData,
    dataHistory,
    initialize,
    disconnect,
    reconnect,
    isConnected: state === 'connected',
    isConnecting: state === 'connecting' || state === 'reconnecting',
  };
}

// Specialized hooks for different data types
export function useIsabellaDecisions() {
  return useIsabellaConnectionPool<any>((data) => 
    data && typeof data === 'object' && 'retentionIntent' in data
  );
}

export function useIsabellaTerritorialEvents() {
  return useIsabellaConnectionPool<any>((data) => 
    data && typeof data === 'object' && ('zoneId' in data || 'territorial' in data)
  );
}

export function useIsabellaSystemHealth() {
  return useIsabellaConnectionPool<any>((data) => 
    data && typeof data === 'object' && ('health' in data || 'system' in data)
  );
}

// Initialize the pool globally (call once at app startup)
export function initIsabellaConnectionPool(url?: string): IsabellaConnectionPool {
  const poolUrl = url || `${import.meta.env.VITE_API_GATEWAY}/isabella/stream`;
  return IsabellaConnectionPool.getInstance({ url: poolUrl });
}

export { IsabellaConnectionPool, type ConnectionState };