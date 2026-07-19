import { useEffect, useState, useCallback } from 'react';
import type { Banner } from '@/components/RotatingBannerCarousel';

interface BannerRotationConfig {
  banners: Banner[];
  rotationIntervalMs?: number;
  onBannerChange?: (banner: Banner) => void;
}

/**
 * Custom hook to manage banner rotation state and lifecycle.
 * Handles automatic rotation, impression tracking, and provides control methods.
 */
export function useBannerRotation({
  banners,
  rotationIntervalMs = 1800000, // 30 minutes
  onBannerChange,
}: BannerRotationConfig) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [impressions, setImpressions] = useState<Map<string, number>>(new Map());
  const [nextRotationTime, setNextRotationTime] = useState<Date | null>(null);

  const currentBanner = banners[currentIndex] || null;

  // Track impressions when banner changes
  useEffect(() => {
    if (!currentBanner) return;

    setImpressions((prev) => {
      const updated = new Map(prev);
      updated.set(currentBanner.id, (updated.get(currentBanner.id) || 0) + 1);
      return updated;
    });

    onBannerChange?.(currentBanner);
  }, [currentBanner, onBannerChange]);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length <= 1) return;

    const nextRotation = new Date(Date.now() + rotationIntervalMs);
    setNextRotationTime(nextRotation);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setNextRotationTime(new Date(Date.now() + rotationIntervalMs));
    }, rotationIntervalMs);

    return () => clearInterval(timer);
  }, [banners.length, rotationIntervalMs]);

  // Manual controls
  const goToBanner = useCallback((index: number) => {
    if (index >= 0 && index < banners.length) {
      setCurrentIndex(index);
    }
  }, [banners.length]);

  const nextBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const previousBanner = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  return {
    currentBanner,
    currentIndex,
    impressions,
    nextRotationTime,
    goToBanner,
    nextBanner,
    previousBanner,
    totalBanners: banners.length,
    getBannerImpressions: (bannerId: string) => impressions.get(bannerId) || 0,
  };
}
