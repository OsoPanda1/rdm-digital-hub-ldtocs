/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      refetchOnWindowFocus: false,
    },
  },
});

export { QueryClientProvider };

// API Client with base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Request timeout
const TIMEOUT_MS = 30000;

const MAX_RETRIES = 2;

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Offline detection
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { isOnline = true; });
  window.addEventListener('offline', () => { isOnline = false; });
}
export function getOnlineStatus(): boolean { return isOnline; }

// Helper function to get auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('rdm_token') || localStorage.getItem('rdm_token');
  }
  return null;
};

// Helper for API requests with retry + offline fallback
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> {
  if (!isOnline) {
    throw { code: 'OFFLINE', message: 'No internet connection' } as ApiError;
  }

  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Request failed', code: 'UNKNOWN_ERROR' } 
      }));
      
      const apiError: ApiError = {
        code: error.error?.code || 'HTTP_ERROR',
        message: error.error?.message || `HTTP ${response.status}`,
        details: error.error?.details
      };
      
      throw apiError;
    }

    return response.json();
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw { code: 'TIMEOUT', message: 'Request timed out' } as ApiError;
    }

    const apiErr = error as ApiError;
    // Retry on server errors or network failures (not 4xx)
    if (retries > 0 && (!apiErr.code || apiErr.code === 'TIMEOUT' || apiErr.code === 'UNKNOWN_ERROR')) {
      await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** (MAX_RETRIES - retries + 1), 10000)));
      return apiRequest<T>(endpoint, options, retries - 1);
    }

    throw error;
  }
}

// Typed API methods
export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string>) => {
    const searchParams = params 
      ? '?' + new URLSearchParams(params).toString() 
      : '';
    return apiRequest<T>(`${endpoint}${searchParams}`);
  },
  
  post: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  
  put: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  
  patch: <T>(endpoint: string, data?: unknown) => 
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  
  delete: <T>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

// Query keys factory
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  places: {
    all: ['places'] as const,
    lists: () => [...places.all, 'list'] as const,
    list: (filters: Record<string, string>) => [...places.lists(), filters] as const,
    details: () => [...places.all, 'detail'] as const,
    detail: (id: string) => [...places.details(), id] as const,
  },
  businesses: {
    all: ['businesses'] as const,
    lists: () => [...businesses.all, 'list'] as const,
    list: (filters: Record<string, string>) => [...businesses.lists(), filters] as const,
    detail: (id: string) => [...businesses.all, 'detail', id] as const,
    categories: () => [...businesses.all, 'categories'] as const,
    featured: () => [...businesses.all, 'featured'] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...events.all, 'list'] as const,
    list: (filters: Record<string, string>) => [...events.lists(), filters] as const,
    detail: (id: string) => [...events.all, 'detail', id] as const,
    featured: () => [...events.all, 'featured'] as const,
    upcoming: () => [...events.all, 'upcoming'] as const,
  },
  routes: {
    all: ['routes'] as const,
    lists: () => [...routes.all, 'list'] as const,
    detail: (id: string) => [...routes.all, 'detail', id] as const,
  },
  posts: {
    all: ['posts'] as const,
    lists: () => [...posts.all, 'list'] as const,
    list: (filters: Record<string, string>) => [...posts.lists(), filters] as const,
    detail: (id: string) => [...posts.all, 'detail', id] as const,
    featured: () => [...posts.all, 'featured'] as const,
  },
  dichos: {
    all: ['dichos'] as const,
    lists: () => [...dichos.all, 'list'] as const,
    list: (filters: Record<string, string>) => [...dichos.lists(), filters] as const,
    detail: (id: string) => [...dichos.all, 'detail', id] as const,
  },
  newsletter: {
    subscribers: () => ['newsletter', 'subscribers'] as const,
  },
  payments: {
    config: () => ['payments', 'config'] as const,
    donations: () => ['payments', 'donations'] as const,
    checkout: (type: string) => ['payments', 'checkout', type] as const,
  },
  admin: {
    stats: () => ['admin', 'stats'] as const,
    businesses: () => ['admin', 'businesses'] as const,
    business: (id: string) => ['admin', 'businesses', id] as const,
    posts: () => ['admin', 'posts'] as const,
    users: () => ['admin', 'users'] as const,
  },
  ai: {
    sessions: () => ['ai', 'sessions'] as const,
    session: (id: string) => ['ai', 'sessions', id] as const,
    info: () => ['ai', 'info'] as const,
  },
  seo: {
    meta: (type: string, id?: string) => ['seo', 'meta', type, id] as const,
    schema: (type: string, id?: string) => ['seo', 'schema', type, id] as const,
  },
} as const;

// Re-export for convenience
const places = queryKeys.places;
const businesses = queryKeys.businesses;
const events = queryKeys.events;
const routes = queryKeys.routes;
const posts = queryKeys.posts;
const dichos = queryKeys.dichos;
const newsletter = queryKeys.newsletter;
const payments = queryKeys.payments;
const admin = queryKeys.admin;

export { places, businesses, events, routes, posts, dichos, newsletter, payments, admin };
