'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface HeritageImage {
  id: string;
  url: string;
  title: string;
  description: string;
  period: string;
  significance: string;
  category: string;
}

const heritageImages: HeritageImage[] = [
  {
    id: 'pedro-romero',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pedroromero-9y1pCCebGA0PehYyAWnrE6UEgR1gSw.jpg',
    title: 'Pedro Romero Terreros',
    description: 'El Conde de Regla, fundador de las minas de Real del Monte. Figura central en la historia minera del pueblo.',
    period: '1710-1782',
    significance: 'Fundador de la infraestructura minera que prosperó durante 3 siglos',
    category: 'Historical Figures',
  },
  {
    id: 'calcografia',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calcografia.jpg-kMmLpFtB0zePk6DSlErzTHN3kbMtmN.png',
    title: 'Grabado Histórico 1782',
    description: 'Documento histórico conmemorativo de Pedro Romero Terreros. Impreso en México por Felipe de Zúñiga.',
    period: '1782',
    significance: 'Testimonio de la importancia de Real del Monte en la época colonial',
    category: 'Documents',
  },
  {
    id: 'richard-bell',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/richardbell-nv003bRyHGBB1mb9yUa2iPwyFZF9NS.jpg',
    title: 'Richard Bell - Personaje Teatral',
    description: 'Representación de la tradición teatral y cultural de Real del Monte, reflejando la vida folclórica del pueblo.',
    period: 'Siglo XIX',
    significance: 'Documento de la vida cultural y entretenimiento del pueblo minero',
    category: 'Culture',
  },
  {
    id: 'teatro-historico',
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto10-bgs9wyq7T4cmf0169BIOoPJoa5YJu0.jpg',
    title: 'Tradición Teatral',
    description: 'Archivo fotográfico de las tradiciones teatrales de Real del Monte que perduran hasta hoy.',
    period: 'Siglo XIX-XX',
    significance: 'Continuidad de las tradiciones culturales del pueblo',
    category: 'Culture',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function HeritageGallery() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const selected = heritageImages[selectedIdx];

  const goNext = () => {
    setSelectedIdx((prev) => (prev + 1) % heritageImages.length);
  };

  const goPrev = () => {
    setSelectedIdx((prev) => (prev - 1 + heritageImages.length) % heritageImages.length);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold uppercase tracking-wider">
          Archivo Visual del Patrimonio
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Explora la memoria histórica de Real del Monte a través de documentos, 
          fotografías y testimonios que definen nuestra identidad.
        </p>
      </motion.div>

      {/* Main Gallery */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Large Image Display */}
        <div className="relative group overflow-hidden rounded-2xl aspect-video bg-slate-900 border-2 border-amber-500/30">
          <motion.img
            key={selected.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            src={selected.url}
            alt={selected.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-3 rounded-full bg-amber-500/80 hover:bg-amber-600"
            >
              <Info className="w-5 h-5 text-white" />
            </motion.button>
          </div>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-sm text-white">
            {selectedIdx + 1} / {heritageImages.length}
          </div>
        </div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: showInfo ? 1 : 0,
            height: showInfo ? 'auto' : 0,
          }}
          className="overflow-hidden"
        >
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-amber-400/70 uppercase tracking-widest mb-1">
                    Período
                  </p>
                  <h3 className="text-2xl font-display text-gradient-gold">{selected.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{selected.period}</p>
                </div>

                <div>
                  <p className="text-xs text-amber-400/70 uppercase tracking-widest mb-2">
                    Descripción
                  </p>
                  <p className="text-slate-300 leading-relaxed">{selected.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <p className="text-xs text-amber-400/70 uppercase tracking-widest mb-2">
                    Significancia Histórica
                  </p>
                  <p className="text-slate-200">{selected.significance}</p>
                </div>

                <div className="inline-block px-4 py-2 bg-amber-500/20 rounded-lg border border-amber-500/50">
                  <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold">
                    {selected.category}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Thumbnails */}
      <motion.div variants={itemVariants}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {heritageImages.map((img, idx) => (
            <motion.button
              key={img.id}
              onClick={() => setSelectedIdx(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIdx
                  ? 'border-amber-400 shadow-lg shadow-amber-500/50'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="mt-12">
        <h3 className="font-display text-2xl text-white mb-6 uppercase tracking-wider">
          Línea del Tiempo
        </h3>
        <div className="space-y-3">
          {heritageImages.map((img, idx) => (
            <motion.button
              key={img.id}
              onClick={() => setSelectedIdx(idx)}
              whileHover={{ translateX: 4 }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                idx === selectedIdx
                  ? 'border-amber-400 bg-amber-500/20'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-3 h-3 rounded-full ${
                  idx === selectedIdx ? 'bg-amber-400' : 'bg-slate-500'
                }`} />
                <div>
                  <p className="font-semibold text-white">{img.title}</p>
                  <p className="text-sm text-slate-400">{img.period}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Context Section */}
      <motion.div
        variants={itemVariants}
        className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-xl border border-amber-500/30"
      >
        <h3 className="font-display text-xl text-white mb-4">Sobre nuestro patrimonio</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          Real del Monte es un pueblo con más de 500 años de historia. Desde su época 
          como centro minero durante la Colonia, hasta su transformación en destino cultural, 
          cada imagen en esta galería cuenta una parte de nuestra identidad.
        </p>
        <p className="text-slate-400 text-sm">
          Estas imágenes son parte del esfuerzo por preservar y compartir la memoria colectiva 
          de nuestro pueblo con las nuevas generaciones y con visitantes de todo el mundo.
        </p>
      </motion.div>
    </motion.div>
  );
}
