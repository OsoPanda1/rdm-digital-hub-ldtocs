/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
/**
 * Knowledge Cell Types - Specialized Microservice Containers
 * Cada cÃ©lula es una unidad desplegable, versionada y observable.
 *
 * Este modelo asume:
 * - Contrato de entrada/salida tipado.
 * - Ciclo de vida explÃ­cito (draft, active, deprecated, archived).
 * - IntegraciÃ³n con federaciones TAMV y planos RDM.
 * - OperaciÃ³n como grafo (cells que se componen entre sÃ­).
 */

import {
  FederationDomain,
  KernelLayer,
  RdmExperiencePlane,
} from "./federation.types";

// ============================================================================
// ENUMS BÃSICOS
// ============================================================================

/**
 * Tipos canÃ³nicos de Knowledge Cell.
 * Puedes extender esta lista segÃºn crezca el ecosistema.
 */
export type CellType =
  | "Render3D"
  | "Render4D"
  | "IA-ImmersiveFX"
  | "QuantumChannel"
  | "SensorMultiFX"
  | "APIIntegration"
  | "Analytics"
  | "UIControl"
  | "SpatialLogic"
  | "NarrativeEngine"
  | "TelemetryIngest"
  | "EconomyEngine"
  | "IdentityBridge";

/**
 * Estado de ciclo de vida de la cÃ©lula.
 */
export type CellLifecycle = "draft" | "active" | "deprecated" | "archived";

/**
 * Nivel de criticidad operacional.
 */
export type CellCriticality =
  | "low"
  | "medium"
  | "high"
  | "mission_critical";

/**
 * Nivel de estabilidad de la API de la cÃ©lula.
 */
export type CellStability = "experimental" | "beta" | "stable" | "legacy";

// ============================================================================
// CONTRATOS DE ENTRADA / SALIDA
// ============================================================================

/**
 * Representa el contrato de IO de una cÃ©lula.
 * En implementaciÃ³n real esto podrÃ­a mapear a Zod schemas o OpenAPI.
 */
export interface CellIOContract {
  /**
   * DescripciÃ³n concisa del propÃ³sito de la cÃ©lula.
   */
  summary: string;
  /**
   * DescripciÃ³n del formato de entrada (ej: JSON schema, tipo lÃ³gico).
   */
  inputFormat: string;
  /**
   * DescripciÃ³n del formato de salida.
   */
  outputFormat: string;
  /**
   * Ejemplos de payloads de entrada (para docs, pruebas, sandbox).
   */
  inputExamples?: unknown[];
  /**
   * Ejemplos de salida.
   */
  outputExamples?: unknown[];
}

// ============================================================================
// SLAs, OBSERVABILITY, SECURITY
// ============================================================================

/**
 * Atributos de confiabilidad esperados de la cÃ©lula.
 */
export interface CellSLA {
  /**
   * Latencia esperada (p50/p95) en milisegundos.
   */
  expectedLatencyMs?: {
    p50?: number;
    p95?: number;
  };
  /**
   * Tasa mÃ¡xima de error aceptable (0â€“1).
   */
  maxErrorRate?: number;
  /**
   * Ventana de evaluaciÃ³n de mÃ©tricas (en segundos).
   */
  evaluationWindowSeconds?: number;
}

/**
 * ConfiguraciÃ³n para observabilidad de la cÃ©lula.
 */
export interface CellObservabilityConfig {
  /**
   * Si true, emite eventos de tracing al Event Bus / Guardian Console.
   */
  emitTracingEvents: boolean;
  /**
   * Si true, registra mÃ©tricas agregadas (latencia, errores).
   */
  collectMetrics: boolean;
  /**
   * Si true, incluye muestras de payload en logs (cuidar privacidad).
   */
  samplePayloads: boolean;
}

/**
 * ConfiguraciÃ³n de seguridad / privacidad.
 */
export interface CellSecurityConfig {
  /**
   * Si la cÃ©lula puede recibir datos sensibles.
   */
  acceptsSensitiveData: boolean;
  /**
   * Si la cÃ©lula debe aplicar anonimizaciÃ³n (IP, IDs, etc.) antes de salir.
   */
  enforcesAnonymization: boolean;
  /**
   * Scopes / roles mÃ­nimos requeridos para invocarla.
   * Ejemplo: ["guardian", "admin", "commerce_owner"].
   */
  requiredScopes?: string[];
}

// ============================================================================
// KNOWLEDGE CELL CANÃ“NICA
// ============================================================================

export interface KnowledgeCell {
  /**
   * ID Ãºnico y estable de la cÃ©lula (ej: "rdm.render3d.atlas.v1").
   */
  id: string;

  /**
   * Tipo canÃ³nico de la cÃ©lula (Render, Engine, Bridge, etc.).
   */
  type: CellType;

  /**
   * DescripciÃ³n humana de alto nivel.
   */
  description: string;

  /**
   * VersiÃ³n semÃ¡ntica (ej: "1.0.3").
   */
  version: string;

  /**
   * Compatibilidad hacia atrÃ¡s (ej: ">=1.0.0 <2.0.0").
   * Ãštil para orquestadores de grafo.
   */
  compatibleWith?: string;

  /**
   * Dominio federado al que pertenece (tecnologÃ­a, cultura, economÃ­a, etc.).
   */
  domain: FederationDomain;

  /**
   * Capa del kernel donde principalmente opera esta cÃ©lula.
   */
  layer: KernelLayer;

  /**
   * Plano de experiencia con el que se relaciona
   * (turismo, institucional, tÃ©cnico).
   */
  plane: RdmExperiencePlane;

  /**
   * Estado de ciclo de vida de la cÃ©lula.
   */
  lifecycle: CellLifecycle;

  /**
   * Criticidad operacional (para priorizar despliegue/observabilidad).
   */
  criticality: CellCriticality;

  /**
   * Nivel de estabilidad de la API.
   */
  stability: CellStability;

  /**
   * Contrato de IO de la cÃ©lula.
   */
  io: CellIOContract;

  /**
   * Lista de IDs de otras cÃ©lulas de las que depende.
   */
  dependencies?: string[];

  /**
   * Prompt base que especializa la IA que habita esta cÃ©lula,
   * en caso de que sea una cÃ©lula cognitiva.
   */
  iaSpecializationPrompt?: string;

  /**
   * Endpoint API (path lÃ³gico) y URL de microservicio de esta cÃ©lula.
   * - apiEndpoint: ruta interna (ej: "/cells/render3d/atlas").
   * - microserviceUrl: host/URL de despliegue (edge, lambda, etc.).
   */
  apiEndpoint: string;
  microserviceUrl: string;

  /**
   * Casos de prueba en formato libre (pueden referenciar scripts, IDs, etc.).
   */
  testCases: string[];

  /**
   * Muestra de visualizaciÃ³n (ej: URL a un PNG, vÃ­deo, XR, etc.).
   */
  visualizationSample?: string;

  /**
   * InformaciÃ³n de autorÃ­a / procedencia.
   */
  author: string;
  created: Date;
  updated: Date;

  /**
   * Etiquetas libres para clasificaciÃ³n, bÃºsqueda y navegaciÃ³n.
   */
  tags: string[];

  /**
   * Si la cÃ©lula es visible/usable por el pÃºblico general.
   */
  isPublic: boolean;

  /**
   * Domain-specific metadata para extender sin romper el contrato.
   */
  metadata?: Record<string, unknown>;

  /**
   * SLAs y configuraciÃ³n de observabilidad y seguridad.
   */
  sla?: CellSLA;
  observability?: CellObservabilityConfig;
  security?: CellSecurityConfig;
}

// ============================================================================
// KNOWLEDGE REPOSITORY (GRAFO DE CÃ‰LULAS)
// ============================================================================

export type CellRelationType =
  | "requires"
  | "extends"
  | "composes"
  | "consumes";

/**
 * RelaciÃ³n entre cÃ©lulas (grafos de conocimiento / pipelines).
 */
export interface CellRelation {
  from: string; // cellId
  to: string; // cellId
  relation: CellRelationType;
  /**
   * Peso/fortaleza de la relaciÃ³n (0â€“1).
   * Ãštil para orden de composiciÃ³n, recomendadores, etc.
   */
  weight?: number;
}

export interface KnowledgeRepository {
  /**
   * CÃ©lulas indexadas por ID.
   */
  cells: Record<string, KnowledgeCell>;

  /**
   * Relaciones entre cÃ©lulas (grafo dirigido).
   */
  relations: CellRelation[];

  /**
   * Perfil de expertise de IA asociado a este repositorio
   * (ej: "Turismo territorial RDM + Gemelos 4D").
   */
  aiExpertiseProfile: string;

  /**
   * VersiÃ³n del repositorio (no de las cÃ©lulas individuales).
   */
  version: string;

  /**
   * Metadatos adicionales (ej: DOIs, enlaces a Zenodo, etc.).
   */
  metadata: Record<string, unknown>;
}

// ============================================================================
// CONTEXTO Y RESULTADOS DE EJECUCIÃ“N
// ============================================================================

/**
 * Contexto de ejecuciÃ³n de una cÃ©lula.
 */
export interface CellExecutionContext<TInput = unknown> {
  cellId: string;
  input: TInput;

  /**
   * Tiempo mÃ¡ximo de ejecuciÃ³n permitido (ms).
   */
  timeout?: number;

  /**
   * NÃºmero mÃ¡ximo de reintentos ante fallos transitorios.
   */
  retries?: number;

  /**
   * ID de trazas (para correlaciÃ³n con el Event Bus / Guardian).
   */
  traceId?: string;

  /**
   * Contexto territorial opcional (ej: POI, ruta, plano).
   */
  plane?: RdmExperiencePlane;
  domain?: FederationDomain;
  layer?: KernelLayer;

  /**
   * Metadata contextual (usuario, sesiÃ³n, idioma, etc.).
   */
  contextMeta?: Record<string, unknown>;
}

/**
 * Resultado de ejecuciÃ³n de una cÃ©lula.
 */
export interface CellExecutionResult<TOutput = unknown> {
  cellId: string;
  success: boolean;
  output?: TOutput;
  error?: string;
  executionTimeMs: number;
  retryCount: number;

  /**
   * Registro de warnings no fatales
   * (ej: degradaciÃ³n de calidad visual, fallback de modelo).
   */
  warnings?: string[];

  /**
   * ID de trace para asociar a otros sistemas
   * (MSR, BookPi, Event Bus).
   */
  traceId?: string;
}
