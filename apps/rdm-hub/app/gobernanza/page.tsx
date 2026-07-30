"use client";

import { useState } from "react";

const sections = [
  { id: "federacion", label: "Federación" },
  { id: "politicas", label: "Políticas" },
  { id: "rfcs", label: "RFCs" },
  { id: "transparencia", label: "Transparencia" },
];

export default function GobernanzaPage() {
  const [activeSection, setActiveSection] = useState("federacion");

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
        <h1 className="font-serif text-3xl font-bold">Gobernanza</h1>
        <p className="text-[#9ca3af]">Modelo de gobierno federado para el Nodo Cero.</p>

        {activeSection === "federacion" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "F1 — Gobernanza", status: "Operational" },
              { name: "F2 — Identidad y Acceso", status: "Operational" },
              { name: "F3 — Datos Territoriales", status: "Degraded" },
              { name: "F4 — Comercio y Monetización", status: "Operational" },
              { name: "F5 — IA Cognitiva", status: "Operational" },
              { name: "F6 — Comunidad y Contenido", status: "Operational" },
              { name: "F7 — Observabilidad", status: "Operational" },
            ].map((fed) => (
              <div key={fed.name} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
                <p className="font-medium">{fed.name}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  fed.status === "Operational" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"
                }`}>
                  {fed.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeSection === "politicas" && (
          <div className="space-y-4">
            {[
              { name: "Política de Privacidad", desc: "Protección de datos personales" },
              { name: "Términos de Servicio", desc: "Uso de la plataforma territorial" },
              { name: "Código de Conducta", desc: "Normas de convivencia digital" },
              { name: "Política de Datos", desc: "Gestión y propiedad de la información" },
            ].map((pol) => (
              <div key={pol.name} className="border border-[#2a2d35] rounded-xl p-4 bg-[#121418]">
                <p className="font-medium">{pol.name}</p>
                <p className="text-sm text-[#9ca3af] mt-1">{pol.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === "rfcs" && (
          <div className="space-y-4">
            <p className="text-[#9ca3af]">Solicitudes de comentarios y propuestas de la comunidad.</p>
            <div className="border border-[#2a2d35] rounded-xl p-8 bg-[#121418] text-center">
              <p className="text-[#6b7280]">RFCs — próximamente</p>
            </div>
          </div>
        )}

        {activeSection === "transparencia" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Finanzas", desc: "Reportes de ingresos y gastos" },
              { name: "Decisiones", desc: "Bitácora de decisiones federadas" },
              { name: "Métricas", desc: "KPIs del ecosistema" },
              { name: "Auditoría", desc: "Registro de acciones del sistema" },
            ].map((item) => (
              <div key={item.name} className="border border-[#2a2d35] rounded-xl p-6 bg-[#121418]">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
