// @ts-nocheck
// ============================================================================
// Unified Map System - RDM Digital LTOS
// Leaflet-based map with federation-aware layers, real-time data, and performance optimization
// ============================================================================

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useIsabellaSSE } from '@/hooks/useIsabellaSSE';
import { REAL_DEL_MONTE_SITES } from '@/lib/kernel';
import { fastDistance } from '@/core/geo/haversine.fast';
import { federationColor, FEDERATION_COLORS, TAMV_TO_YUN_FEDERATION } from '@/lib/federation';
import type { PointOfInterest, FederationId, IsabellaDecision, Coordenadas } from '@/core/models';

// Fix Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const RDM_BOUNDS = {
  minLat: 20.125,
  maxLat: 20.165,
  minLon: -98.69,
  maxLon: -98.64,
  center: { lat: 20.143, lon: -98.668 },
  zoom: 14,
  maxZoom: 19,
  minZoom: 12,
} as const;

export interface MapLayerConfig {
  id: string;
  name: string;
  type: 'base' | 'overlay' | 'heatmap' | 'federation' | 'realtime';
  visible: boolean;
  opacity?: number;
  zIndex?: number;
}

export interface MapPOI extends PointOfInterest {
  isHighlighted?: boolean;
  isUserLocation?: boolean;
  distanceFromUser?: number;
}

export interface MapState {
  center: Coordenadas;
  zoom: number;
  bounds: L.LatLngBounds | null;
  selectedPOI: MapPOI | null;
  userLocation: Coordenadas | null;
  activeLayers: MapLayerConfig[];
  hoveredPOI: MapPOI | null;
}

export interface UseMapOptions {
  containerId: string;
  initialCenter?: Coordenadas;
  initialZoom?: number;
  enableFogOfWar?: boolean;
  enableRealtime?: boolean;
  enableUserLocation?: boolean;
  onPOIClick?: (poi: MapPOI) => void;
  onMapClick?: (latlng: L.LatLng) => void;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
  onZoomChange?: (zoom: number) => void;
}

const DEFAULT_LAYERS: MapLayerConfig[] = [
  { id: 'osm', name: 'OpenStreetMap', type: 'base', visible: true, zIndex: 100 },
  { id: 'satellite', name: 'Satélite', type: 'base', visible: false, zIndex: 101 },
  { id: 'federation-heat', name: 'Calor Federado', type: 'federation', visible: true, opacity: 0.4, zIndex: 200 },
  { id: 'poi-markers', name: 'Puntos de Interés', type: 'overlay', visible: true, zIndex: 300 },
  { id: 'realtime-events', name: 'Eventos en Vivo', type: 'realtime', visible: true, zIndex: 400 },
  { id: 'user-path', name: 'Tu Recorrido', type: 'overlay', visible: false, zIndex: 350 },
];

export function useUnifiedMap(options: UseMapOptions) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Map<string, L.Marker>> = useRef(new Map());
  const layersRef = useRef<Map<string, L.Layer>> = useRef(new Map());
  const fogCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fogCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const revealPointsRef = useRef<Array<{ x: number; y: number; r: number; timestamp: number }>>([]);
  const isInitializedRef = useRef(false);

  const [state, setState] = useState<MapState>({
    center: options.initialCenter ?? RDM_BOUNDS.center,
    zoom: options.initialZoom ?? RDM_BOUNDS.zoom,
    bounds: null,
    selectedPOI: null,
    userLocation: null,
    activeLayers: DEFAULT_LAYERS,
    hoveredPOI: null,
  });

  const { decision, connectionState } = useIsabellaSSE({
    url: `${import.meta.env.VITE_API_GATEWAY}/isabella/stream`,
    maxRetries: 3,
  });

  const baseLayers = useMemo(() => ({
    osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      crossOrigin: true,
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri',
      maxZoom: 19,
      crossOrigin: true,
    }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors',
      maxZoom: 17,
      crossOrigin: true,
    }),
  }), []);

  const createFederationMarker = useCallback((poi: MapPOI, isHighlighted = false) => {
    const fedKey = poi.federacion || 'FED_TURISMO';
    const color = federationColor(fedKey) || '#D4AF37';
    const yunFed = TAMV_TO_YUN_FEDERATION[fedKey as keyof typeof TAMV_TO_YUN_FEDERATION];

    const iconHtml = `
      <div class="poi-marker ${isHighlighted ? 'highlighted' : ''}" 
           style="
             --marker-color: ${color};
             --yun-fed: '${yunFed || ''}';
           ">
        <div class="marker-core"></div>
        <div class="marker-pulse"></div>
        <div class="marker-glyph">${poi.category.charAt(0).toUpperCase()}</div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-poi-marker',
      iconSize: isHighlighted ? [36, 36] : [28, 28],
      iconAnchor: [isHighlighted ? 18 : 14, isHighlighted ? 18 : 14],
      popupAnchor: [0, -14],
    });
  }, []);

  const renderPOIMarkers = useCallback((map: L.Map) => {
    markersRef.current.forEach((marker, id) => {
      if (!state.activeLayers.find(l => l.id === 'poi-markers' && l.visible)) {
        map.removeLayer(marker);
        markersRef.current.delete(id);
      }
    });

    if (!state.activeLayers.find(l => l.id === 'poi-markers' && l.visible)) return;

    REAL_DEL_MONTE_SITES.forEach(site => {
      if (markersRef.current.has(site.id)) return;

      const poi: MapPOI = {
        ...site,
        isHighlighted: state.selectedPOI?.id === site.id,
        distanceFromUser: state.userLocation ? fastDistance(state.userLocation, { lat: site.coords.lat, lng: site.coords.lng }) : undefined,
      };

      const marker = L.marker([site.coords.lat, site.coords.lng], {
        icon: createFederationMarker(poi, poi.isHighlighted),
        zIndexOffset: 1000,
      });

      const popupContent = `
        <div class="poi-popup" style="--fed-color: ${federationColor(site.federacion || 'FED_TURISMO')}">
          <div class="popup-header">
            <span class="popup-glyph">${site.category.charAt(0).toUpperCase()}</span>
            <h4>${site.name}</h4>
            <span class="popup-fed">${TAMV_TO_YUN_FEDERATION[site.federacion as keyof typeof TAMV_TO_YUN_FEDERATION] || site.federacion}</span>
          </div>
          <p class="popup-desc">${site.description}</p>
          <div class="popup-meta">
            <span>⭐ ${site.rating}</span>
            ${site.precioEstimado ? `<span>💰 ${site.precioEstimado.min}-${site.precioEstimado.max} ${site.precioEstimado.moneda}</span>` : ''}
            ${poi.distanceFromUser ? `<span>📍 ${(poi.distanceFromUser / 1000).toFixed(1)} km</span>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 280,
        minWidth: 220,
      });

      marker.on('click', () => {
        setState(prev => ({ ...prev, selectedPOI: poi }));
        options.onPOIClick?.(poi);
      });

      marker.on('mouseover', () => {
        setState(prev => ({ ...prev, hoveredPOI: poi }));
        marker.setIcon(createFederationMarker({ ...poi, isHighlighted: true }, true));
      });

      marker.on('mouseout', () => {
        setState(prev => ({ ...prev, hoveredPOI: null }));
        if (!poi.isHighlighted) {
          marker.setIcon(createFederationMarker(poi, false));
        }
      });

      marker.addTo(map);
      markersRef.current.set(site.id, marker);
    });
  }, [state.selectedPOI, state.userLocation, state.activeLayers, createFederationMarker, options]);

  const renderFederationHeatmap = useCallback((map: L.Map) => {
    const layerId = 'federation-heat';
    const layerConfig = state.activeLayers.find(l => l.id === layerId);
    if (!layerConfig?.visible) {
      if (layersRef.current.has(layerId)) {
        map.removeLayer(layersRef.current.get(layerId)!);
        layersRef.current.delete(layerId);
      }
      return;
    }

    if (layersRef.current.has(layerId)) return;

    const federationGroups = REAL_DEL_MONTE_SITES.reduce((acc, site) => {
      const fed = site.federacion || 'FED_TURISMO';
      if (!acc[fed]) acc[fed] = [];
      acc[fed].push([site.coords.lat, site.coords.lng, 1] as [number, number, number]);
      return acc;
    }, {} as Record<string, [number, number, number][]>);

    const heatLayers = Object.entries(federationGroups).map(([fed, points]) => {
      const color = federationColor(fed);
      return L.heatLayer(points, {
        radius: 35,
        blur: 20,
        maxZoom: 17,
        max: 1,
        gradient: {
          0.2: `rgba(${hexToRgb(color)}, 0.15)`,
          0.5: `rgba(${hexToRgb(color)}, 0.35)`,
          0.8: `rgba(${hexToRgb(color)}, 0.55)`,
          1.0: `rgba(${hexToRgb(color)}, 0.75)`,
        },
      });
    });

    const group = L.layerGroup(heatLayers);
    group.addTo(map);
    layersRef.current.set(layerId, group);
  }, [state.activeLayers]);

  const renderRealtimeEvents = useCallback((map: L.Map) => {
    const layerId = 'realtime-events';
    const layerConfig = state.activeLayers.find(l => l.id === layerId);
    if (!layerConfig?.visible || !decision) {
      if (layersRef.current.has(layerId)) {
        map.removeLayer(layersRef.current.get(layerId)!);
        layersRef.current.delete(layerId);
      }
      return;
    }

    if (layersRef.current.has(layerId)) return;

    const eventMarker = L.circleMarker([decision.coords.lat, decision.coords.lng], {
      radius: 12,
      fillColor: '#FFD700',
      color: '#FFD700',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.3,
      className: 'realtime-pulse',
    });

    eventMarker.bindPopup(`
      <div class="realtime-popup">
        <h5>⚡ Decisión GEN-7 Activa</h5>
        <p><strong>Nivel:</strong> ${decision.level}</p>
        <p><strong>Intención:</strong> ${decision.retentionIntent}</p>
        <p><strong>Patrón:</strong> ${decision.pattern}</p>
        <p><strong>Distancia a salida:</strong> ${decision.distanceToExit.toFixed(0)}m</p>
        <p class="text-xs text-muted-foreground">Actualizado: ${new Date(decision.timestamp).toLocaleTimeString()}</p>
      </div>
    `);

    eventMarker.addTo(map);
    layersRef.current.set(layerId, eventMarker);
  }, [state.activeLayers, decision]);

  const renderUserLocation = useCallback((map: L.Map) => {
    if (!state.userLocation) {
      if (layersRef.current.has('user-location')) {
        map.removeLayer(layersRef.current.get('user-location')!);
        layersRef.current.delete('user-location');
      }
      return;
    }

    if (layersRef.current.has('user-location')) {
      const existing = layersRef.current.get('user-location') as L.CircleMarker;
      existing.setLatLng([state.userLocation.lat, state.userLocation.lng]);
      return;
    }

    const userMarker = L.circleMarker([state.userLocation.lat, state.userLocation.lng], {
      radius: 8,
      fillColor: '#00FF88',
      color: '#00FF88',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.4,
      className: 'user-location-pulse',
    });

    userMarker.bindPopup('<div class="user-popup">📍 Tu ubicación actual</div>');
    userMarker.addTo(map);
    layersRef.current.set('user-location', userMarker);
  }, [state.userLocation]);

  const initFogOfWar = useCallback((container: HTMLDivElement) => {
    if (!options.enableFogOfWar) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'fog-canvas absolute inset-0 pointer-events-none z-10';
    canvas.style.mixBlendMode = 'multiply';
    container.appendChild(canvas);
    fogCanvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    fogCtxRef.current = ctx;

    const resize = () => {
      canvas.width = container.offsetWidth * 2;
      canvas.height = container.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const drawFog = () => {
      if (!fogCtxRef.current || !fogCanvasRef.current) return;
      const ctx = fogCtxRef.current;
      const canvas = fogCanvasRef.current;

      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);

      ctx.globalCompositeOperation = 'destination-out';

      const now = Date.now();
      revealPointsRef.current = revealPointsRef.current.filter(p => now - p.timestamp < 8000);

      for (const p of revealPointsRef.current) {
        const age = (now - p.timestamp) / 8000;
        const radius = p.r * (1 + age * 0.5);
        const opacity = 1 - age * 0.8;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        gradient.addColorStop(0, `rgba(0,0,0,${opacity})`);
        gradient.addColorStop(0.7, `rgba(0,0,0,${opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameRef.current = requestAnimationFrame(drawFog);
    };

    drawFog();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [options.enableFogOfWar]);

  const revealFogAt = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    revealPointsRef.current.push({
      x: clientX - rect.left,
      y: clientY - rect.top,
      r: 180,
      timestamp: Date.now(),
    });
    if (revealPointsRef.current.length > 20) revealPointsRef.current.shift();
  }, []);

  const clearFog = useCallback(() => {
    revealPointsRef.current = [];
    if (fogCanvasRef.current) {
      fogCanvasRef.current.style.opacity = '0';
      setTimeout(() => fogCanvasRef.current?.remove(), 1000);
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (isInitializedRef.current || !containerRef.current) return;
    if (typeof window === 'undefined') return;

    isInitializedRef.current = true;

    const map = L.map(containerRef.current, {
      center: [state.center.lat, state.center.lng],
      zoom: state.zoom,
      minZoom: RDM_BOUNDS.minZoom,
      maxZoom: RDM_BOUNDS.maxZoom,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      renderer: L.canvas({ padding: 0.5 }),
    });

    mapRef.current = map;

    baseLayers.osm.addTo(map);

    map.on('moveend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      setState(prev => ({
        ...prev,
        center: { lat: center.lat, lng: center.lng },
        zoom,
        bounds,
      }));
      options.onBoundsChange?.(bounds);
      options.onZoomChange?.(zoom);
    });

    map.on('click', (e) => {
      options.onMapClick?.(e.latlng);
      setState(prev => ({ ...prev, selectedPOI: null }));
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

    const cleanupFog = initFogOfWar(containerRef.current);
    (map as any)._cleanupFog = cleanupFog;

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', (e) => revealFogAt(e.clientX, e.clientY));
      containerRef.current.addEventListener('touchmove', (e) => {
        if (e.touches[0]) revealFogAt(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
    }

    setTimeout(() => {
      renderPOIMarkers(map);
      renderFederationHeatmap(map);
      renderRealtimeEvents(map);
      renderUserLocation(map);
    }, 100);

    return () => {
      if (cleanupFog) cleanupFog();
      containerRef.current?.removeEventListener('mousemove', revealFogAt as any);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      map.remove();
      isInitializedRef.current = false;
    };
  }, [
    state.center,
    state.zoom,
    baseLayers,
    renderPOIMarkers,
    renderFederationHeatmap,
    renderRealtimeEvents,
    renderUserLocation,
    initFogOfWar,
    revealFogAt,
    options,
  ]);

  useEffect(() => {
    const cleanup = initializeMap();
    return () => cleanup?.();
  }, [initializeMap]);

  useEffect(() => {
    if (!mapRef.current) return;
    Object.values(baseLayers).forEach(l => mapRef.current!.removeLayer(l));
    const layerId = state.activeLayers.find(l => l.type === 'base' && l.visible)?.id || 'osm';
    baseLayers[layerId as keyof typeof baseLayers].addTo(mapRef.current);
  }, [state.activeLayers, baseLayers]);

  useEffect(() => {
    if (!mapRef.current) return;
    renderPOIMarkers(mapRef.current);
    renderFederationHeatmap(mapRef.current);
    renderRealtimeEvents(mapRef.current);
    renderUserLocation(mapRef.current);
  }, [state.activeLayers, state.selectedPOI, state.userLocation, decision, renderPOIMarkers, renderFederationHeatmap, renderRealtimeEvents, renderUserLocation]);

  const setActiveLayer = useCallback((layerId: string, visible: boolean) => {
    setState(prev => ({
      ...prev,
      activeLayers: prev.activeLayers.map(l =>
        l.id === layerId ? { ...l, visible } : l
      ),
    }));
  }, []);

  const setCenter = useCallback((center: Coordenadas, zoom?: number) => {
    if (!mapRef.current) return;
    mapRef.current.setView([center.lat, center.lng], zoom ?? state.zoom, { animate: true });
  }, [state.zoom]);

  const fitBounds = useCallback((bounds: L.LatLngBounds, padding = [20, 20]) => {
    if (!mapRef.current) return;
    mapRef.current.fitBounds(bounds, { padding, maxZoom: RDM_BOUNDS.maxZoom - 1 });
  }, []);

  const setUserLocation = useCallback((coords: Coordenadas | null) => {
    setState(prev => ({ ...prev, userLocation: coords }));
  }, []);

  return {
    mapRef: containerRef,
    mapInstance: mapRef,
    state,
    setActiveLayer,
    setCenter,
    fitBounds,
    setUserLocation,
    clearFog,
    connectionState,
    isReady: isInitializedRef.current,
  };
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

// ============================================================================
// CSS Styles (inject via component or global CSS)
// ============================================================================

export const MAP_STYLES = `
.custom-poi-marker {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.custom-poi-marker .poi-marker {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-poi-marker .marker-core {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--marker-color);
  box-shadow: 0 0 0 3px rgba(0,0,0,0.3), 0 0 12px var(--marker-color);
  transition: transform 0.2s ease;
}

.custom-poi-marker .marker-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--marker-color);
  opacity: 0.4;
  animation: marker-pulse 2s ease-out infinite;
}

.custom-poi-marker .marker-glyph {
  position: absolute;
  color: #0f172a;
  font-size: 10px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  z-index: 1;
  text-shadow: 0 0 2px rgba(255,255,255,0.8);
}

.custom-poi-marker.highlighted .marker-core {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(0,0,0,0.4), 0 0 20px var(--marker-color), 0 0 40px var(--marker-color);
}

.custom-poi-marker.highlighted .marker-pulse {
  animation: marker-pulse-highlighted 1.5s ease-out infinite;
}

@keyframes marker-pulse {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes marker-pulse-highlighted {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.8); opacity: 0; }
}

.custom-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 0;
  overflow: hidden;
}

.custom-popup .leaflet-popup-content {
  margin: 0;
  color: #f1f5f9;
  font-family: 'DM Sans', sans-serif;
}

.custom-popup .leaflet-popup-tip {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-left: 1px solid rgba(212, 175, 55, 0.3);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.poi-popup {
  padding: 12px;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.popup-glyph {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--fed-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  font-family: 'JetBrains Mono', monospace;
}

.popup-header h4 {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #f1f5f9;
}

.popup-fed {
  font-size: 9px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--fed-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(212, 175, 55, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}

.popup-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  margin: 8px 0;
}

.popup-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
}

.realtime-popup h5 {
  margin: 0 0 8px;
  color: #FFD700;
  font-size: 13px;
}

.realtime-popup p {
  margin: 4px 0;
  font-size: 11px;
  color: #cbd5e1;
}

.user-popup {
  color: #00FF88;
  font-weight: 500;
  font-size: 12px;
}

.realtime-pulse {
  animation: realtime-pulse 1.5s ease-out infinite;
}

@keyframes realtime-pulse {
  0% { stroke-width: 2; fill-opacity: 0.3; }
  50% { stroke-width: 4; fill-opacity: 0.6; }
  100% { stroke-width: 2; fill-opacity: 0.3; }
}

.user-location-pulse {
  animation: user-pulse 2s ease-out infinite;
}

@keyframes user-pulse {
  0% { stroke-width: 3; fill-opacity: 0.4; }
  50% { stroke-width: 5; fill-opacity: 0.7; }
  100% { stroke-width: 3; fill-opacity: 0.4; }
}

.fog-canvas {
  transition: opacity 1s ease-out;
}

.leaflet-container {
  font-family: 'DM Sans', sans-serif;
}

.leaflet-control-zoom a {
  background: rgba(15, 23, 42, 0.9);
  color: #f1f5f9;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  margin: 2px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 18px;
  transition: all 0.2s;
}

.leaflet-control-zoom a:hover {
  background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%);
  color: #0f172a;
  border-color: #D4AF37;
}

.leaflet-control-scale {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  padding: 4px 10px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
`;

// Inject styles on first load
if (typeof document !== 'undefined' && !document.getElementById('rdm-map-styles')) {
  const style = document.createElement('style');
  style.id = 'rdm-map-styles';
  style.textContent = MAP_STYLES;
  document.head.appendChild(style);
}