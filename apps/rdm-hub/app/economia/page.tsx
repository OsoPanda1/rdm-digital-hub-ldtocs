"use client";

import { useState } from "react";

const sections = [
  { id: "negocios", label: "Negocios" },
  { id: "comercios", label: "Comercios" },
  { id: "membresias", label: "Membresías" },
  { id: "donar", label: "Apoyar" },
];

export default function EconomiaPage() {
  const [activeSection, setActiveSection] = useState("negocios");

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#2a2d35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-14 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  activeSection === s.id
                    ? "bg-[#c8a356]/10 text-[#c8a356]"
                    : "text-[#9ca3af] hover:text-[#e8e6e0]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-bold">Economía</h1>
        <p className="text-[#9ca3af]">Ecosistema económico federado de Real del Monte.</p>

        {activeSection === "negocios" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Portal de negocios locales. Registra tu comercio y forma parte del directorio digital.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Turismo", "Gastronomía", "Artesanías", "Servicios", "Hospedaje", "Transporte"].map(
                (cat) => (
                  <div key={cat} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                    <p className="font-medium">{cat}</p>
                    <p className="text-sm text-[#9ca3af] mt-1">Negocios registrados</p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {activeSection === "comercios" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Panel de comercios con herramientas de gestión y visibilidad.</p>
            <div className="border border-[#2a2d35] rounded-xl p-8 bg-[#121418] text-center">
              <p className="text-[#6b7280]">Panel de comercios — próximamente</p>
            </div>
          </div>
        )}

        {activeSection === "membresias" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Básico", price: "Gratis", features: ["Directorio", "Mapa", "Eventos"] },
              { name: "Comercio", price: "$199/mes", features: ["Perfil de negocio", "Promociones", "Estadísticas"] },
              { name: "Premium", price: "$499/mes", features: ["Prioridad", "API access", "Soporte prioritario"] },
            ].map((plan) => (
              <div key={plan.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                <h3 className="font-medium text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-[#c8a356] mt-2">{plan.price}</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm text-[#9ca3af]">✓ {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeSection === "donar" && (
          <div className="max-w-lg mx-auto text-center space-y-4">
            <p className="text-[#9ca3af]">Apoya el desarrollo de la plataforma territorial.</p>
            <div className="border border-[#2a2d35] rounded-xl p-8 bg-[#121418]">
              <p className="text-[#6b7280]">Métodos de donación — próximamente</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
