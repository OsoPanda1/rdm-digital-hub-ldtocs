/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, ArrowLeft, ExternalLink, Tag } from 'lucide-react';
import type { Place } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  mina: 'Mina', monumento: 'Monumento', restaurante: 'Restaurante', mirador: 'Mirador',
  iglesia: 'Iglesia', museo: 'Museo', plaza: 'Plaza', calle: 'Calle',
};

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
}

export function PlaceDetail({ place, onBack }: PlaceDetailProps) {
  const mapsUrl = `https://www.google.com/maps?q=${place.lat},${place.lng}`;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-silver-400 hover:text-silver-200 mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" />Volver
      </button>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {place.images[0] ? (
          <div className="h-48 relative">
            <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night-900/80 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h1 className="text-xl font-serif font-bold text-white">{place.name}</h1>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-xl font-serif font-bold text-foreground">{place.name}</h1>
          </div>
        )}

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-gold-400/15 text-gold-400 text-xs font-medium border border-gold-400/20">{CATEGORY_LABELS[place.category] || place.category}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`h-4 w-4 ${s <= Math.round(place.rating) ? 'text-gold-400 fill-gold-400' : 'text-silver-600'}`} />)}
              <span className="ml-1 text-sm text-silver-400">{place.rating} ({place.reviewCount} resenas)</span>
            </div>
          </div>

          <p className="text-sm text-silver-300 leading-relaxed">{place.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {place.address && (
              <div className="flex items-center gap-2 text-silver-400"><MapPin className="h-4 w-4 text-gold-400/60" />{place.address}</div>
            )}
            {place.hours && (
              <div className="flex items-center gap-2 text-silver-400"><Clock className="h-4 w-4 text-gold-400/60" />{place.hours}</div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {place.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-silver-400">
                <Tag className="h-2.5 w-2.5" />{tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/15 text-gold-400 text-sm font-medium hover:bg-gold-400/25 transition-colors">
              <MapPin className="h-4 w-4" />Como llegar
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-silver-300 text-sm font-medium hover:bg-white/15 transition-colors">
              <ExternalLink className="h-4 w-4" />Abrir en Maps
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
