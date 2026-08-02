'use client';
import React from 'react';
import { Shield, Cpu, MapPin, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onOpenDonation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDonation }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Canonical Statement Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-inner space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              Declaración Institucional Canónica — RDM Digital
            </div>
            {onOpenDonation && (
              <button
                onClick={onOpenDonation}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform hover:scale-105"
              >
                <Heart className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                Donar al Fondo de Conservación
              </button>
            )}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            RDM Digital es la infraestructura digital soberana de Real del Monte, Hidalgo, diseñada como Nodo Cero de un ecosistema territorial inteligente que integra información, turismo y comercio local bajo una arquitectura federada, event-driven y self-hosted. Su operación se soporta en el TAMV Civilizational Core, el TAMV OS Kernel, ISABELLA AI y Cattleya Pay, garantizando soberanía de datos, trazabilidad, resiliencia operativa y reactivación económica comunitaria en una sola plataforma escalable.
          </p>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-serif text-lg">
              <span className="text-amber-400">RDM</span> Digital
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nodo Cero territorial de la comarca minera de Hidalgo, México. Preservación del patrimonio inmaterial, soberanía tecnológica y desarrollo económico ético.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Coord: 20.1395° N, 98.6742° W • Alt. 2,760 msnm
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Pilares Desacoplados</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">
                • RDM Información (InfoMesh)
              </li>
              <li className="hover:text-emerald-300 transition-colors cursor-pointer">
                • RDM Turismo (GeoExplorer & Rutas)
              </li>
              <li className="hover:text-sky-300 transition-colors cursor-pointer">
                • RDM Comercio (TradeNode & Artesanos)
              </li>
              <li className="hover:text-purple-300 transition-colors cursor-pointer">
                • ISABELLA AI Civilizational Core
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Cultura & Legado Minero</h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>• Compañía de Aventureros de Cornwall (1824)</li>
              <li>• Museo de la Mina de Acosta & La Dificultad</li>
              <li>• Panteón Inglés del Cerro del Judío</li>
              <li>• Paste Tradicional Hidalguense & Denominación</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Soberanía de Datos & Stack</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">TypeScript</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Node.js Kernel</span>
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">Vercel Ready ▲</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Cattleya Pay</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Google Workspace API</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 RDM Digital • Pueblo Mágico de Real del Monte, Hidalgo. Todos los derechos soberanos reservados.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Operado con el Civilizational Core de</span>
            <span className="text-amber-400 font-bold">TAMV Online</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
