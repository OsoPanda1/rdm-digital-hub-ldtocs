'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Banner {
  id: string;
  businessName: string;
  businessCategory: string;
  title: string;
  description: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  image?: string;
  rating?: number;
  featured?: boolean;
}

interface RotatingBannerCarouselProps {
  banners: Banner[];
  rotationIntervalMs?: number;
  autoplay?: boolean;
}

export default function RotatingBannerCarousel({
  banners,
  rotationIntervalMs = 1800000, // 30 minutes default
  autoplay = true,
}: RotatingBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextRotationTime, setNextRotationTime] = useState<Date | null>(null);

  const currentBanner = useMemo(() => banners[currentIndex] || null, [banners, currentIndex]);

  useEffect(() => {
    if (!autoplay || banners.length <= 1) return;

    const nextRotation = new Date(Date.now() + rotationIntervalMs);
    setNextRotationTime(nextRotation);

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setNextRotationTime(new Date(Date.now() + rotationIntervalMs));
    }, rotationIntervalMs);

    return () => clearInterval(timer);
  }, [autoplay, banners.length, rotationIntervalMs]);

  if (!currentBanner) {
    return null;
  }

  const bgColor = currentBanner.backgroundColor || 'hsl(var(--rdm-amber)/0.1)';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBanner.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.2)] backdrop-blur-sm"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 md:p-8">
          {/* Content section */}
          <div className="flex-1 space-y-3">
            {/* Badge and category */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[hsl(var(--rdm-amber))] text-white">
                Promoción
              </span>
              {currentBanner.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border border-[hsl(var(--rdm-amber)/0.3)] text-[hsl(var(--rdm-amber))]">
                  {currentBanner.badge}
                </span>
              )}
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
                {currentBanner.businessCategory}
              </span>
            </div>

            {/* Business name */}
            <h3 className="text-lg md:text-2xl font-bold text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--font-display)' }}>
              {currentBanner.businessName}
            </h3>

            {/* Title/Headline */}
            <p className="text-sm md:text-base font-semibold text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--font-body)' }}>
              {currentBanner.title}
            </p>

            {/* Description */}
            <p className="text-xs md:text-sm text-[hsl(var(--muted-foreground))] leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
              {currentBanner.description}
            </p>

            {/* Rating if available */}
            {currentBanner.rating && (
              <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < Math.round(currentBanner.rating || 0)
                          ? 'text-[hsl(var(--rdm-amber))]'
                          : 'text-[hsl(var(--muted))]'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span>({currentBanner.rating.toFixed(1)})</span>
              </div>
            )}

            {/* CTA Button */}
            {currentBanner.ctaLink && currentBanner.ctaText && (
              <div className="pt-2">
                <a
                  href={currentBanner.ctaLink}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--rdm-amber))] text-white font-semibold text-sm hover:shadow-lg transition-all hover:scale-105"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {currentBanner.ctaText}
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>

          {/* Image section if available */}
          {currentBanner.image && (
            <motion.div
              className="flex-1 overflow-hidden rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <img
                src={currentBanner.image}
                alt={currentBanner.businessName}
                className="w-full h-48 md:h-full object-cover rounded-lg"
              />
            </motion.div>
          )}
        </div>

        {/* Progress indicator - shows when next rotation happens */}
        {nextRotationTime && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[hsl(var(--muted))]">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(var(--rdm-amber))] to-[hsl(var(--electric))]"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: rotationIntervalMs / 1000, linear: true }}
            />
          </div>
        )}

        {/* Carousel indicators */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[hsl(var(--rdm-amber))] w-6'
                  : 'bg-[hsl(var(--muted))] hover:bg-[hsl(var(--muted-foreground))]'
              }`}
              aria-label={`Go to banner ${idx + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
