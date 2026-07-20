import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface PrometheusMetric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  help: string;
  values: Array<{
    labels: Record<string, string>;
    value: number;
  }>;
  buckets?: Array<{ le: number; count: number }>;
  count?: number;
  sum?: number;
  p50?: number;
  p95?: number;
  p99?: number;
}

interface TelemetryData {
  timestamp: number;
  metrics: Record<string, PrometheusMetric>;
}

const METRICS_ENDPOINT = '/api/metrics';
const DEFAULT_POLL_INTERVAL = 5000;

export function useTelemetry(pollInterval = DEFAULT_POLL_INTERVAL) {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const parseMetrics = useCallback((text: string): Record<string, PrometheusMetric> => {
    const lines = text.split('\n');
    const metrics: Record<string, PrometheusMetric> = {};
    let currentMetric: Partial<PrometheusMetric> | null = null;

    for (const line of lines) {
      if (line.startsWith('# HELP ')) {
        const rest = line.slice(7);
        const spaceIdx = rest.indexOf(' ');
        const name = rest.slice(0, spaceIdx);
        const help = rest.slice(spaceIdx + 1);
        currentMetric = { name, help, type: 'gauge', values: [] };
        metrics[name] = currentMetric as PrometheusMetric;
      } else if (line.startsWith('# TYPE ')) {
        const [name, type] = line.slice(7).split(' ');
        if (metrics[name]) {
          metrics[name].type = type as 'counter' | 'gauge' | 'histogram';
        }
      } else if (line && !line.startsWith('#')) {
        const match = line.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)(?:{([^}]*)})?\s+(.+)$/);
        if (match) {
          const [, name, labelsStr, valueStr] = match;
          const value = parseFloat(valueStr);
          const labels: Record<string, string> = {};
          
          if (labelsStr) {
            const labelMatches = labelsStr.matchAll(/([a-zA-Z_][a-zA-Z0-9_]*)="([^"]*)"/g);
            for (const m of labelMatches) {
              labels[m[1]] = m[2];
            }
          }

          if (metrics[name]) {
            metrics[name].values.push({ labels, value });
          }
        }
      }
    }

    // Calculate histogram stats
    for (const metric of Object.values(metrics)) {
      if (metric.type === 'histogram') {
        const buckets = metric.values
          .filter(v => v.labels.le)
          .map(v => ({ le: parseFloat(v.labels.le), count: v.value }))
          .sort((a, b) => a.le - b.le);
        
        metric.buckets = buckets;
        metric.count = buckets[buckets.length - 1]?.count ?? 0;
        metric.sum = metric.values.find(v => !v.labels.le)?.value ?? 0;
        
        // Calculate percentiles
        const allValues: number[] = [];
        for (const bucket of buckets) {
          const prevCount = allValues.length;
          const count = bucket.count - prevCount;
          for (let i = 0; i < count; i++) {
            allValues.push(bucket.le);
          }
        }
        
        if (allValues.length > 0) {
          allValues.sort((a, b) => a - b);
          metric.p50 = allValues[Math.floor(allValues.length * 0.5)];
          metric.p95 = allValues[Math.floor(allValues.length * 0.95)];
          metric.p99 = allValues[Math.floor(allValues.length * 0.99)];
        }
      }
    }

    return metrics;
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const response = await fetch(METRICS_ENDPOINT, {
        signal: abortRef.current.signal,
        headers: { 'Accept': 'text/plain' },
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const text = await response.text();
      const metrics = parseMetrics(text);
      
      setData({ timestamp: Date.now(), metrics });
      setError(null);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
        setLoading(false);
      }
    }
  }, [parseMetrics]);

  const refetch = useCallback(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchMetrics();
    
    intervalRef.current = setInterval(fetchMetrics, pollInterval);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchMetrics, pollInterval]);

  return { data, loading, error, refetch };
}

// Hook to subscribe to a specific metric
export function useMetric(
  metricName: string,
  selector: (metric: PrometheusMetric) => number,
  defaultValue: number
) {
  const { data } = useTelemetry();
  
  return useMemo(() => {
    if (!data?.metrics[metricName]) return defaultValue;
    try {
      return selector(data.metrics[metricName]);
    } catch {
      return defaultValue;
    }
  }, [data, metricName, selector, defaultValue]);
}