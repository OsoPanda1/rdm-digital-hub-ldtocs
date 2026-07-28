/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// @ts-nocheck
/**
 * Hook para interactuar con Isabella AI - Optimizado con caching y deduplicaciÃ³n
 * Triple Federado: Conceptual | Legal | TÃ©cnico
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateFederationHash } from '@/lib/federation';

export interface IsabellaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  federationHash?: string;
  emotionalContext?: {
    sentiment: string;
    intensity: number;
  };
}

export interface IsabellaState {
  messages: IsabellaMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  activeProtocol: string | null;
  emotionalState: {
    sentiment: string;
    intensity: number;
  };
}

const ISABELLA_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-ai`;

// Request deduplication cache
const requestCache = new Map<string, Promise<any>>();
const CACHE_TTL = 5000; // 5 seconds

export const useIsabella = () => {
  const [state, setState] = useState<IsabellaState>({
    messages: [],
    isLoading: false,
    error: null,
    sessionId: generateFederationHash(),
    activeProtocol: null,
    emotionalState: { sentiment: 'neutral', intensity: 0.5 }
  });

  const messagesRef = useRef(state.messages);
  const sessionIdRef = useRef(state.sessionId);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestsRef = useRef<Map<string, AbortController>>(new Map());

  // Mantener refs sincronizados
  messagesRef.current = state.messages;
  sessionIdRef.current = state.sessionId;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pendingRequestsRef.current.forEach(controller => controller.abort());
      pendingRequestsRef.current.clear();
    };
  }, []);

  // Enviar mensaje a Isabella con streaming y deduplicaciÃ³n
  const sendMessage = useCallback(async (
    content: string,
    options?: {
      protocol?: 'fenix_rex' | 'iniciacion' | 'hoyo_negro';
      challengeResponse?: string;
    }
  ) => {
    if (!content.trim()) return;

    // Create cache key for deduplication
    const cacheKey = `${content}:${options?.protocol || 'default'}:${sessionIdRef.current}`;
    const cached = requestCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Crear mensaje del usuario
    const userMessage: IsabellaMessage = {
      id: generateFederationHash(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      federationHash: generateFederationHash()
    };

    // Agregar mensaje del usuario al estado
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
      activeProtocol: options?.protocol || null
    }));

    // Cancelar peticiÃ³n anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const executeRequest = async () => {
      try {
        // Obtener sesiÃ³n actual
        const { data: { session } } = await supabase.auth.getSession();

        // Preparar mensajes para la API (usar ref para evitar stale closure)
        const currentMessages = messagesRef.current;
        const currentSessionId = sessionIdRef.current;
        const apiMessages = currentMessages.map(m => ({
          role: m.role,
          content: m.content
        }));
        apiMessages.push({ role: 'user', content });

        const response = await fetch(ISABELLA_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: apiMessages,
            userId: session?.user?.id,
            sessionId: currentSessionId,
            protocol: options?.protocol,
            challengeResponse: options?.challengeResponse,
            stream: true
          }),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al comunicarse con Isabella');
        }

        // Procesar stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let textBuffer = '';

        // Crear mensaje vacÃ­o de Isabella
        const assistantMessageId = generateFederationHash();

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            federationHash: generateFederationHash()
          }]
        }));

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          // Procesar lÃ­neas del stream SSE
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith('\r')) line = line.slice(0, -1);
            if (line.startsWith(':') || line.trim() === '') continue;
            if (!line.startsWith('data: ')) continue;

            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(jsonStr);
              const deltaContent = parsed.choices?.[0]?.delta?.content;

              if (deltaContent) {
                assistantContent += deltaContent;

                // Actualizar el Ãºltimo mensaje
                setState(prev => ({
                  ...prev,
                  messages: prev.messages.map((m, i) =>
                    i === prev.messages.length - 1
                      ? { ...m, content: assistantContent }
                      : m
                  )
                }));
              }
            } catch {
              // JSON incompleto, esperar mÃ¡s datos
            }
          }
        }

        setState(prev => ({ ...prev, isLoading: false }));

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignorar errores de cancelaciÃ³n
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error desconocido'
        }));
      }
    };

    const promise = executeRequest();
    requestCache.set(cacheKey, promise);
    
    // Clear cache after TTL
    setTimeout(() => requestCache.delete(cacheKey), CACHE_TTL);
    
    return promise;
  }, []); // Sin dependencias externas - usamos refs

  // Activar protocolo de seguridad
  const activateProtocol = useCallback((protocol: 'fenix_rex' | 'iniciacion' | 'hoyo_negro') => {
    setState(prev => ({ ...prev, activeProtocol: protocol }));
    
    // Enviar mensaje de activaciÃ³n
    sendMessage(`[ACTIVACIÃ“N DE PROTOCOLO: ${protocol.toUpperCase()}]`, { protocol });
  }, [sendMessage]);

  // Limpiar conversaciÃ³n
  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      sessionId: generateFederationHash(),
      activeProtocol: null,
      emotionalState: { sentiment: 'neutral', intensity: 0.5 }
    });
    requestCache.clear();
  }, []);

  // Cancelar peticiÃ³n actual
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  return {
    ...state,
    sendMessage,
    activateProtocol,
    clearConversation,
    cancelRequest
  };
};
