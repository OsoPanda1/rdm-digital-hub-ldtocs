'use client';
import React, { useState } from 'react';
import { ARTISAN_SHOPS } from '../data/realDelMonteData';
import { HERITAGE_DISTRIBUTION_DATA, VISITOR_FLOW_DATA } from '../data/chartData';
import { Product, ArtisanShop } from '../types';
import { ShoppingBag, ShieldCheck, Check, Plus, Store, Sparkles, HeartHandshake, Info, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface TradeNodePillarProps {
  onAddToCart: (product: Product) => void;
  onOpenCart: () => void;
}

export const TradeNodePillar: React.FC<TradeNodePillarProps> = ({ onAddToCart, onOpenCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const allProducts: Product[] = ARTISAN_SHOPS.flatMap(s => s.products);

  const categories = ['Todos', 'Pastes Tradicionales', 'Joyería & Plata', 'Tours & Experiencias'];

  const filteredProducts = selectedCategory === 'Todos'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 p-6 sm:p-8 border border-sky-500/20 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            Pilar 2.3 — RDM Comercio (TradeNode & Pasarela Cattleya Pay)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
            Directorio Comercial, Marketplace & Activación Económica Local
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Conecta directamente con pastequerías familiares, orfebres de plata .925, cabañas y guías locales. Todas las transacciones fortalecen el Fondo de Conservación Patrimonial de Real del Monte.
          </p>
        </div>
      </div>

      {/* Cattleya Pay Ethical Ledger Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/60 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mt-0.5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif">
              Pasarela Cívica Cattleya Pay — Transacción Ética
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              Trazabilidad transparente e idempotente. Del 3% al 5% de tu compra se destina directamente al remozamiento del Panteón Inglés y la restauración de chimeneas mineras.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCart}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          Ver Carrito & Resumen
        </button>
      </div>

      {/* Recharts Analytics: Heritage Fund Pool & Sales Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heritage Pool Donut Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white font-serif">
                Distribución del Fondo de Conservación
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
              $14,820 MXN Acumulados
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Aporte acumulado por categoría de producto para el Fondo de Conservación de Real del Monte.
          </p>

          <div className="h-48 w-full flex items-center justify-center pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={HERITAGE_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="monto"
                >
                  {HERITAGE_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  formatter={(value: any) => [`$${value} MXN`, 'Monto Recaudado']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {HERITAGE_DISTRIBUTION_DATA.map(item => (
              <div key={item.category} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.category}:</span>
                <span className="font-mono font-bold text-white ml-auto">{item.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Paste Sales Analytics Chart */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white font-serif">
                Venta de Pastes & Fondos Generados
              </h3>
            </div>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-500/30">
              Cattleya Ledger
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Volumen mensual de pastes vendidos por establecimientos verificados y retención patrimonial.
          </p>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VISITOR_FLOW_DATA}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="pastesVendidos" name="Pastes Vendidos" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Verified Shops Directory Showcase */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">
              Comercios & Talleres Tradicionales Verificados
            </h3>
            <p className="text-xs text-slate-400">
              Establecimientos inscritos en el padrón cívico soberano RDM TradeNode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTISAN_SHOPS.map((shop) => (
            <div
              key={shop.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-36 rounded-xl overflow-hidden bg-slate-950 relative">
                  <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  {shop.verifiedBadge && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                      <ShieldCheck className="w-3 h-3" /> Verificado RDM
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                    ★ {shop.rating}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white font-serif leading-snug">{shop.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">Titular: {shop.ownerName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">📍 {shop.address}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {shop.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-sky-400 font-bold flex items-center justify-between">
                <span>{shop.products.length} productos / servicios</span>
                <span>📞 {shop.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog & Filter Chips */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif">Catálogo Local Verificado</h3>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 p-5 space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-950 relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <span className="absolute top-2 right-2 bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
                      +{product.heritageFundPercent}% Fondo Patrimonial
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider block">
                      {product.shopName}
                    </span>
                    <h4 className="text-base font-bold text-white font-serif leading-snug">{product.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">{product.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-amber-400 font-mono">${product.price}</span>
                      <span className="text-xs text-slate-400 font-normal"> MXN</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{product.unit}</span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-slate-950 shadow-lg'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        ¡Añadido al Carrito!
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Agregar mediante Cattleya Pay
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
