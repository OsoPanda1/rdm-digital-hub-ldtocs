import { useEffect, useRef, useState } from "react";

export interface ResizeObserverEntry {
  width: number;
  height: number;
}

export function useResizeObserver(ref: React.RefObject<HTMLElement>): ResizeObserverEntry {
  const [dimensions, setDimensions] = useState<ResizeObserverEntry>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    observerRef.current = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || entries.length === 0) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setDimensions({ width: Math.round(width), height: Math.round(height) });
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [ref]);

  return dimensions;
}