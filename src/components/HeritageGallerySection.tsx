import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink, Heart } from "lucide-react";

interface HeritageImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year?: string;
  category: "historical" | "cultural" | "architectural";
  historicalContext: string;
}

const heritageImages: HeritageImage[] = [
  {
    id: "pedro-romero",
    title: "Pedro Romero Terreros - Conde de Regla",
    description: "Retrato del fundador de Real del Monte (1746-1795)",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pedroromero-9y1pCCebGA0PehYyAWnrE6UEgR1gSw.jpg",
    year: "1746-1795",
    category: "historical",
    historicalContext:
      "Pedro Romero Terreros fue un empresario minero español que transformó Real del Monte en un centro minero próspero durante el siglo XVIII. Su legado perdura en la arquitectura y la estructura económica del pueblo.",
  },
  {
    id: "calcografia",
    title: "Calcografía de 1782",
    description: "Grabado histórico de Pedro Romero Terreros de la Real Academia de México",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calcografia.jpg-kMmLpFtB0zePk6DSlErzTHN3kbMtmN.png",
    year: "1782",
    category: "historical",
    historicalContext:
      "Este grabado fue realizado por El Colegio Apostólico de N.S.P. Francisco de Pachuca, siendo guardián el R.P. Fr. Joseph Ruiz de Villa Franca y Cárdenas. Es un testimonio invaluable del reconocimiento que recibía Romero Terreros en su época.",
  },
  {
    id: "richard-bell",
    title: "Richard Bell - Tradición Teatral",
    description: "Representación de la tradición teatral y cultural de Real del Monte",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/richardbell-nv003bRyHGBB1mb9yUa2iPwyFZF9NS.jpg",
    year: "Siglo XIX-XX",
    category: "cultural",
    historicalContext:
      "La tradición teatral de Real del Monte refleja la riqueza cultural del pueblo. Los espectáculos públicos fueron parte importante de la vida social, permitiendo a la comunidad expresar sus valores y narrativas locales.",
  },
  {
    id: "performer-heritage",
    title: "Patrimonio de Actuadores Locales",
    description: "Imagen de doble exposición de un performer de Real del Monte",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/foto10-bgs9wyq7T4cmf0169BIOoPJoa5YJu0.jpg",
    year: "Contemporáneo",
    category: "cultural",
    historicalContext:
      "Los artistas locales mantienen viva la tradición performativa de Real del Monte, fusionando elementos históricos con expresiones contemporáneas. Esta imagen captura la esencia de cómo el pasado y presente convergen en la identidad cultural del pueblo.",
  },
];

const categoryColors = {
  historical: "from-amber-600 to-orange-600",
  cultural: "from-purple-600 to-pink-600",
  architectural: "from-blue-600 to-cyan-600",
};

const categoryLabels = {
  historical: "Histórico",
  cultural: "Cultural",
  architectural: "Arquitectónico",
};

export function HeritageGallerySection() {
  const [selectedImage, setSelectedImage] = useState<HeritageImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heritageImages.length);
    setSelectedImage(heritageImages[(currentIndex + 1) % heritageImages.length]);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heritageImages.length) % heritageImages.length);
    setSelectedImage(heritageImages[(currentIndex - 1 + heritageImages.length) % heritageImages.length]);
  };

  return (
    <div className="w-full">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {heritageImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedImage(image);
              setCurrentIndex(index);
            }}
          >
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
              {/* Image Container */}
              <div className="aspect-video overflow-hidden bg-slate-900">
                <motion.img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Overlay */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-t ${categoryColors[image.category]} opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-6`}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.7 }}
              >
                <h3 className="font-display text-xl text-white mb-2">{image.title}</h3>
                <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
              </motion.div>

              {/* Category Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${categoryColors[image.category]} text-white text-xs font-body font-bold`}>
                {categoryLabels[image.category]}
              </div>

              {/* Year Badge */}
              {image.year && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 text-amber-400 text-xs font-mono backdrop-blur-sm">
                  {image.year}
                </div>
              )}

              {/* Favorite Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(image.id);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    favorites.has(image.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Image */}
              <div className="relative aspect-video bg-slate-800 overflow-hidden">
                <motion.img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Navigation Arrows */}
                <motion.button
                  onClick={handlePrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>

                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedImage(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/40 text-white text-sm font-mono backdrop-blur-sm">
                  {currentIndex + 1} / {heritageImages.length}
                </div>
              </div>

              {/* Info Panel */}
              <motion.div
                className="p-8 space-y-6 max-h-[30vh] overflow-y-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl text-white">{selectedImage.title}</h2>
                    <motion.button
                      onClick={() => toggleFavorite(selectedImage.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart
                        className={`w-6 h-6 transition-colors ${
                          favorites.has(selectedImage.id) ? "fill-red-500 text-red-500" : "text-slate-400"
                        }`}
                      />
                    </motion.button>
                  </div>
                  <p className="text-amber-400/80 text-sm">{selectedImage.description}</p>
                </div>

                {/* Category & Year */}
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryColors[selectedImage.category]} text-white text-sm font-body font-bold`}>
                    {categoryLabels[selectedImage.category]}
                  </div>
                  {selectedImage.year && (
                    <div className="px-4 py-2 rounded-full bg-slate-800 text-amber-400 text-sm font-mono">
                      {selectedImage.year}
                    </div>
                  )}
                </div>

                {/* Historical Context */}
                <div className="space-y-3">
                  <h4 className="font-display text-amber-400">Contexto Histórico</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedImage.historicalContext}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-body text-sm font-medium transition-colors"
                  >
                    Compartir
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-body text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Leer Más
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
