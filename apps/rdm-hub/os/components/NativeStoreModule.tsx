'use client';
import React, { useState } from 'react';
import { STORE_PRODUCTS, SAMPLE_SHIPMENT } from '../data/modulesData';
import { StoreProduct, Product } from '../types';
import { ShoppingBag, Truck, ExternalLink, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight, PackageCheck, Search } from 'lucide-react';

interface NativeStoreModuleProps {
  onAddToCart?: (product: Product) => void;
}

export const NativeStoreModule: React.FC<NativeStoreModuleProps> = ({ onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeTab, setActiveTab] = useState<'catalogo' | 'seguimiento'>('catalogo');

  const categories = ['Todas', 'Paste Embalado al Vacío', 'Joyería Plata .925', 'Textiles & Lana', 'Artesanías en Madera'];

  const filteredProducts = STORE_PRODUCTS.filter(p => {
    return selectedCategory === 'Todas' || p.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 p-6 sm:p-8 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            Tienda Nativa RDM Online & Envíos Nacionales
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Artesanías, Joyería de Plata & Pastes al Vacío
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Compra directamente a artesanos y pastequerías tradicionales con garantía de origen y retención del 5% para el Fondo de Conservación de Real del Monte.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'catalogo'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Catálogo de Productos ({STORE_PRODUCTS.length})
          </button>
          <button
            onClick={() => setActiveTab('seguimiento')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'seguimiento'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Rastreo de Envíos
          </button>
        </div>
      </div>

      {activeTab === 'catalogo' ? (
        <div className="space-y-6">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    {product.heritagePercent}% Fondo Patrimonio
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Taller: <span className="text-amber-300 font-bold">{product.artisan}</span>
                    </span>

                    <h3 className="text-sm font-bold text-white font-serif">{product.name}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold font-mono text-amber-400">
                        ${product.priceMXN} MXN
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Stock: {product.stock} unidades
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.mercadoLibreUrl && (
                        <a
                          href={product.mercadoLibreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-1/2 py-2 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-[11px] font-bold border border-yellow-400/30 flex items-center justify-center gap-1 transition-all"
                        >
                          Mercado Libre
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          if (onAddToCart) {
                            onAddToCart({
                              id: product.id,
                              shopId: 'shop-rdm',
                              shopName: product.artisan,
                              name: product.name,
                              category: 'Artesanías & Textiles',
                              price: product.priceMXN,
                              unit: 'pieza',
                              description: product.description,
                              image: product.image,
                              inStock: true,
                              heritageFundPercent: product.heritagePercent
                            });
                          }
                        }}
                        className="w-1/2 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Shipment Tracker Panel */
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Guía de Rastreo RDM Ledger</span>
              <h3 className="text-xl font-bold text-white font-serif">{SAMPLE_SHIPMENT.trackingId}</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
              {SAMPLE_SHIPMENT.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 block">Transportista:</span>
              <span className="text-white font-bold">{SAMPLE_SHIPMENT.carrier}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Entrega Estimada:</span>
              <span className="text-amber-400 font-bold">{SAMPLE_SHIPMENT.estimatedDelivery}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Historial de Ruta</h4>
            <div className="space-y-3 relative border-l-2 border-slate-800 ml-3 pl-4">
              {SAMPLE_SHIPMENT.updates.map((update, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-slate-900" />
                  <span className="text-[10px] text-slate-500 font-mono block">{update.date}</span>
                  <p className="text-xs text-slate-200">{update.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
