/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import type { Place } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  mina: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  monumento: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  restaurante: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  mirador: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  iglesia: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  museo: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
  plaza: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  calle: 'bg-teal-500/15 text-teal-400 border-teal-500/20',
};

interface PlaceCardProps {
  place: Place;
  onClick?: (place: Place) => void;
  compact?: boolean;
}

export function PlaceCard({ place, onClick, compact }: PlaceCardProps) {
  const colorClass = CATEGORY_COLORS[place.category] || 'bg-white/10 text-silver-400 border-white/10';

  if (compact) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={() => onClick?.(place)}
        className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/8 transition-colors"
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${place.rating >= 4.7 ? 'bg-emerald-400' : place.rating >= 4.3 ? 'bg-amber-400' : 'bg-silver-500'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{place.name}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${colorClass}`}>{place.category}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3 w-3 text-gold-400 fill-gold-400" />
            <span className="text-[10px] text-silver-400">{place.rating} ({place.reviewCount})</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick?.(place)}
      className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-pointer hover:border-white/20 hover:bg-white/8 transition-all duration-300"
    >
      <div className="relative h-32 bg-gradient-to-br from-white/5 to-white/0">
        {place.images[0] ? (
          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-silver-600">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}>{place.category}</span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-semibold text-foreground mb-1">{place.name}</h3>
        <p className="text-xs text-silver-400 line-clamp-2 mb-2">{place.description}</p>
        <div className="flex items-center gap-3 text-xs text-silver-500">
          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold-400 fill-gold-400" />{place.rating}</span>
          <span>({place.reviewCount} resenas)</span>
          {place.address && <span className="flex items-center gap-1 ml-auto"><MapPin className="h-3 w-3" />{place.address.split(',')[0]}</span>}
        </div>
      </div>
    </motion.div>
  );
}
