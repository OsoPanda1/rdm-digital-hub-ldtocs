/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// ConfiguraciÃ³n de telemetrÃ­a (monitoreo) para RDM Digital
// Recopila mÃ©tricas operativas, de error y de rendimiento del front-end.
// Se ejecuta en el lado del cliente utilizando Performance API, error reporting, canvas para huellas, y reporting.

export const TELEMETRIA_CONFIG = {
  // MÃ©tricas de rendimiento centradas en el usuario
  performance: {
    // Contentful Paint y Layout Shift especÃ­ficos del Core Web Vitals
    // maxLargestContentfulPaint: umbral en ms para LCP (ideal < 2.5s)
    // maxCumulativeLayoutShift: umbral mÃ¡ximo aceptable para CLS (< 0.1)
    // maxFirstContentfulPaint: umbral en ms para FCP (ideal < 1.8s)
  },

  // Seguimiento de errores/reportando estabilidad en la UI
  errors: {
    // Captura errores no controlados del DOM, promesas rechazos
    // y fallos de red; normaliza antes de reportar.
  },

  // MÃ©trica de actividad centrada en el usuario (engagement)
  engagement: {
    // Seguimiento de eventos interactivos del usuario:
    // clics del ratÃ³n, teclas presionadas, entradas en formularios
  },

  // Seguimiento de estado de conexiÃ³n en el lado del cliente
  offline: {
    // Periodos sin conexiÃ³n, reintentos de red, capacidad de recuperaciÃ³n de Service Worker
  },

  // SesiÃ³n de depuraciÃ³n en producciÃ³n (agresivo en desarrollo, rudo en producciÃ³n)
  debug: {
    // Solo activo en entorno de desarrollo para permitir captura detallada
    enabled: import.meta.env.DEV,
    // Intervalo de bloqueo de captura (ms) para aislar perfiles, evitar muchos off-tick
    captureIntervalMs: 1000,
  },
};

// Payload rÃ­gido de mÃ©tricas de telemetrÃ­a con tipos TypeScript estrictos
export type TelemObject = {
  // id_mÃ©trica (hash Ãºnico, tÃ­pico SHAâ€‘256 o estructura bloque)
  id: string;
  // timestamp ISO `2024â€‘06â€‘27T...`
  ts: string;
  // nombre breve amigable para la UI
  nombre: string;
  // categorÃ­a para filtrar: `performance`, `error`, `engagement`, `offline`
  categorÃ­a: 'performance' | 'error' | 'engagement' | 'offline';
  // regiÃ³n del usuario cuando estÃ¡ disponible
  region: string;
  // datos ocultos para cada mÃ©trica
  data: unknown;
};

// Modelos de fÃ¡brica de mÃ©tricas para mantener DRY
const build = <T extends object>(id: string, categorÃ­a: TelemObject['categorÃ­a'], data: T): TelemObject => (
  {
    id,
    ts: new Date().toISOString(),
    nombre: id,
    categorÃ­a,
    region: 'MX',
    data,
  } as const
);

// Helpers especializados para mÃ©tricas habituales
export const telemetryExamples = {
  // Ejemplo de mÃ©trica de rendimiento (FPS)
  fps: () => build('fps', 'performance', { fps: typeof window !== 'undefined' ? Math.round((window.performance as any)?.now?.() ?? 60) : 60 }),

  // Ejemplo de error (falso, para pruebas)
  errorPage: () => build('error_page_view', 'error', { page: window.location.pathname, error: 'sin_conexion' }),

  // Ejemplo de actividad de usuario (click rÃ¡pido)
  quickClick: () => build('link_click', 'engagement', { url: window.location.href, time: Date.now() }),

  // MÃ©trica de memoria de visualizaciÃ³n en el cliente para budgets de RAM
  memory: () => build('client_memory_mb', 'performance', {
    used: (typeof window !== 'undefined' && (window.performance as any)?.memory?.usedJSHeapSize) ?? 0 / 1048576,
    total: (typeof window !== 'undefined' && (window.performance as any)?.memory?.jsHeapSizeLimit) ?? 0 / 1048576,
  }),
};

// Registro de mÃ©tricas a una funciÃ³n reportadora central (puede ser fuente de datos, beacon, o logger)

// === CARDINALITY & SAMPLING CONTROLS ===
// MÃ¡ximo de entradas de telemetrÃ­a Ãºnicas por sesiÃ³n antes de aplicar muestreo
const MAX_ENTRIES_PER_SESSION = 10_000;
// Tasa de muestreo (0.0 - 1.0) al acercarse al lÃ­mite de cardinalidad
const SAMPLING_RATE = 0.1;

let telemetryCounter = 0;

/**
 * Reporta una mÃ©trica de telemetrÃ­a con guardas de cardinalidad y rate-limit.
 * Descarta eventos silenciosamente cuando se excede el lÃ­mite por sesiÃ³n
 * o cuando el muestreo reduce el volumen bajo backpressure.
 */
export const reportMetric = (metric: TelemObject): void => {
  telemetryCounter++;

  // Guarda de cardinalidad: descarte duro a las 10k por sesiÃ³n
  if (telemetryCounter > MAX_ENTRIES_PER_SESSION) {
    if (telemetryCounter === MAX_ENTRIES_PER_SESSION + 1) {
      // console.warn would go here; cardinality guard active
    }
    return;
  }

  // Muestreo: solo reporta ~10% de eventos cuando estÃ¡ al 80% del lÃ­mite
  if (telemetryCounter > MAX_ENTRIES_PER_SESSION * 0.8) {
    if (Math.random() > SAMPLING_RATE) return;
  }

  // Enviado a Supabase usando `telemeta` (productos de Supabase pga datos pÃºblicos)
  if (import.meta.env.VITE_SUPABASE_URL) {
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/telemeta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? ''}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(metric),
    }).catch(() => {});
  }
};

/** Reinicia el contador de telemetrÃ­a por sesiÃ³n (llamar en navegaciÃ³n) */
export const resetTelemetryCounter = (): void => {
  telemetryCounter = 0;
};