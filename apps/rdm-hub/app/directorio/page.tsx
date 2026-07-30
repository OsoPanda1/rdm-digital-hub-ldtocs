"use client";

import { useState } from "react";

const categories = [
  "Todos", "Turismo", "Gastronomía", "Artesanías", "Hospedaje", "Servicios", "Transporte",
];

const businesses = [
  { name: "Pasteuría La Mina", cat: "Gastronomía", desc: "Los mejores pastes tradicionales" },
  { name: "Hotel Real del Monte", cat: "Hospedaje", desc: "Hospedaje en el centro histórico" },
  { name: "Artesanías El Sopón", cat: "Artesanías", desc: "Artesanía local en cantera" },
  { name: "Restaurante El Edén", cat: "Gastronomía", desc: "Cocina tradicional hidalguense" },
  { name: "Guía Turística RDM", cat: "Turismo", desc: "Recorridos guiados por el pueblo" },
  { name: "Transportes RDM", cat: "Transporte", desc: "Transporte local y shuttle CDMX" },
  { name: "Cabañas del Bosque", cat: "Hospedaje", desc: "Ecoturismo y cabañas" },
  { name: "Museo del Paste", cat: "Gastronomía", desc: "Historia y degustación del paste" },
];

export default function DirectorioPage() {
  const [activeCat, setActiveCat] = useState("Todos");
  const filtered = activeCat === "Todos" ? businesses : businesses.filter((b) => b.cat === activeCat);

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#2a2d35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-14 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  activeCat === cat
                    ? "bg-[#c8a356]/10 text-[#c8a356]"
                    : "text-[#9ca3af] hover:text-[#e8e6e0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Directorio</h1>
            <p className="text-[#9ca3af] mt-1">Negocios y servicios de Real del Monte.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((biz) => (
            <div key={biz.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418] hover:border-[#c8a356] transition-colors">
              <span className="text-xs text-[#c8a356] font-medium">{biz.cat}</span>
              <h3 className="font-medium mt-1">{biz.name}</h3>
              <p className="text-sm text-[#9ca3af] mt-1">{biz.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
