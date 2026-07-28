/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/logger';
import { federationBus } from './FederationBus';
import type { FederationEvent } from './FederationBus';
import type { FederationId, MDX5Intent } from '@/core/models';
import type { UserContribution, TerritorialStats, TerritorialHeatPoint } from '@/core/territorial/types';

export interface TerritorialFederationMap {
  contributionType: string;
  primaryFed: FederationId;
  secondaryFeds: FederationId[];
  eventType: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
}

const TERRITORIAL_FEDERATION_MAP: TerritorialFederationMap[] = [
  { contributionType: 'checkin',       primaryFed: 'CHRONOS',  secondaryFeds: ['DEKATEOTL', 'MDD_TAMV'], eventType: 'TERRITORIAL_CHECKIN', priority: 'normal' },
  { contributionType: 'review',        primaryFed: 'ANUBIS',   secondaryFeds: ['DEKATEOTL'],             eventType: 'TERRITORIAL_REVIEW', priority: 'normal' },
  { contributionType: 'photo',         primaryFed: 'KAOS_HYPERRENDER', secondaryFeds: ['DEKATEOTL'],     eventType: 'TERRITORIAL_PHOTO', priority: 'low' },
  { contributionType: 'rating',        primaryFed: 'MDD_TAMV',  secondaryFeds: ['DEKATEOTL'],            eventType: 'TERRITORIAL_RATING', priority: 'normal' },
  { contributionType: 'tip',           primaryFed: 'ANUBIS',   secondaryFeds: ['DEKATEOTL', 'CHRONOS'],  eventType: 'TERRITORIAL_TIP', priority: 'low' },
  { contributionType: 'event_report',  primaryFed: 'PHOENIX',  secondaryFeds: ['DEKATEOTL', 'CHRONOS'],  eventType: 'TERRITORIAL_EVENT', priority: 'high' },
  { contributionType: 'route_trace',   primaryFed: 'CHRONOS',  secondaryFeds: ['DEKATEOTL', 'KAOS_HYPERRENDER'], eventType: 'TERRITORIAL_ROUTE', priority: 'normal' },
  { contributionType: 'poi_suggestion', primaryFed: 'DEKATEOTL', secondaryFeds: ['PHOENIX', 'CHRONOS'],   eventType: 'TERRITORIAL_POI_SUGGESTION', priority: 'high' },
];

export class TerritorialFederationBridge {
  private maps: TerritorialFederationMap[];
  private subscribed = false;

  constructor() {
    this.maps = TERRITORIAL_FEDERATION_MAP;
  }

  subscribeToFederationEvents(): void {
    if (this.subscribed) return;
    this.subscribed = true;

    federationBus.on('TERRITORIAL_EVENT', (event: FederationEvent) => {
      logger.info('[TFB] Evento territorial recibido del bus', {
        source: event.source,
        type: event.type,
        traceId: event.traceId,
      });
    });

    logger.info('[TFB] Bridge conectado al Federation Bus');
  }

  /**
   * ValidaciÃ³n fuerte de contribuciÃ³n antes de enrutar.
   * No permite coords vacÃ­as, tipos no mapeados o territorios invÃ¡lidos.
   */
  private validateContribution(contribution: UserContribution): boolean {
    if (!contribution) {
      logger.error('[TFB] ContribuciÃ³n nula recibida');
      return false;
    }

    if (!contribution.id || !contribution.userId) {
      logger.warn('[TFB] ContribuciÃ³n sin id o userId', { contribution });
      return false;
    }

    if (!contribution.type) {
      logger.warn('[TFB] ContribuciÃ³n sin tipo declarado', { contributionId: contribution.id });
      return false;
    }

    if (!contribution.coords || typeof contribution.coords.lat !== 'number' || typeof contribution.coords.lng !== 'number') {
      logger.warn('[TFB] ContribuciÃ³n sin coordenadas vÃ¡lidas', { contributionId: contribution.id });
      return false;
    }

    if (!contribution.territorio) {
      logger.warn('[TFB] ContribuciÃ³n sin territorio asignado', { contributionId: contribution.id });
      return false;
    }

    return true;
  }

  /**
   * Determina severidad federada a partir de prioridad y tipo de contribuciÃ³n.
   */
  private getEventSeverity(priority: TerritorialFederationMap['priority']): 'INFO' | 'ALERTA' | 'CRITICO' {
    switch (priority) {
      case 'critical':
        return 'CRITICO';
      case 'high':
        return 'ALERTA';
      default:
        return 'INFO';
    }
  }

  /**
   * Enruta una contribuciÃ³n territorial hacia federaciones TAMV con hardening:
   * validaciÃ³n previa, trazas Ãºnicas y eventos secundarios controlados.
   */
  routeContribution(contribution: UserContribution): void {
    if (!this.validateContribution(contribution)) {
      return;
    }

    const map = this.maps.find(m => m.contributionType === contribution.type);
    if (!map) {
      logger.warn('[TFB] Sin mapeo federado para tipo', { type: contribution.type });
      return;
    }

    const traceId = uuidv4();
    const severity = this.getEventSeverity(map.priority);

    // Route to primary federation
    federationBus.emit({
      type: map.eventType,
      source: map.primaryFed,
      payload: {
        contributionId: contribution.id,
        userId: contribution.userId,
        type: contribution.type,
        coords: contribution.coords,
        territorio: contribution.territorio,
        timestamp: contribution.createdAt,
        traceId,
      },
      traceId,
      severity,
      correlationId: contribution.id,
    });

    // Route to secondary federations (sin userId para minimizar exposiciÃ³n de identidad)
    for (const fed of map.secondaryFeds) {
      federationBus.emit({
        type: `${map.eventType}_SYNC`,
        source: fed,
        payload: {
          contributionId: contribution.id,
          type: contribution.type,
          coords: contribution.coords,
          territorio: contribution.territorio,
          sourceFed: map.primaryFed,
          traceId,
        },
        traceId,
        severity,
        correlationId: contribution.id,
      });
    }

    logger.info('[TFB] ContribuciÃ³n enrutada', {
      type: contribution.type,
      primary: map.primaryFed,
      secondary: map.secondaryFeds,
      priority: map.priority,
      traceId,
    });
  }

  /**
   * ActualizaciÃ³n de estadÃ­sticas territoriales con validaciÃ³n bÃ¡sica.
   */
  routeTerritorialStats(stats: TerritorialStats): void {
    if (!stats || !stats.territorio) {
      logger.warn('[TFB] Stats territoriales invÃ¡lidas', { stats });
      return;
    }

    const traceId = uuidv4();
    federationBus.emit({
      type: 'TERRITORIAL_STATS_UPDATE',
      source: 'DEKATEOTL',
      payload: { stats, traceId },
      traceId,
      severity: 'INFO',
    });
  }

  /**
   * ActualizaciÃ³n de heatmap con lÃ­mite de puntos y validaciÃ³n de coordenadas.
   */
  routeHeatMapUpdate(points: TerritorialHeatPoint[]): void {
    if (!Array.isArray(points) || points.length === 0) {
      logger.warn('[TFB] Heatmap vacÃ­o, no se emite evento');
      return;
    }

    // LÃ­mite de protecciÃ³n: evitar floods en KAOS_HYPERRENDER.
    const MAX_POINTS = 500;
    const safePoints = points.slice(0, MAX_POINTS).filter(p =>
      p && typeof p.lat === 'number' && typeof p.lng === 'number',
    );

    if (safePoints.length === 0) {
      logger.warn('[TFB] Heatmap sin puntos vÃ¡lidos');
      return;
    }

    const traceId = uuidv4();
    federationBus.emit({
      type: 'HEATMAP_UPDATE',
      source: 'KAOS_HYPERRENDER',
      payload: { points: safePoints, traceId },
      traceId,
      severity: 'ALERTA',
    });
  }

  /**
   * Retorna federaciones relevantes para un territorio, con whitelist simple.
   */
  getFederationsForTerritory(territorio: string): FederationId[] {
    if (territorio === 'RDM') {
      return ['DEKATEOTL', 'ANUBIS', 'CHRONOS', 'KAOS_HYPERRENDER', 'MDD_TAMV'];
    }
    return ['DEKATEOTL', 'CHRONOS'];
  }
}

export const territorialFederationBridge = new TerritorialFederationBridge();
