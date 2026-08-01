"use client";

import { useState } from "react";
import { Network, FileText, MessageSquareText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { LANDSCAPE_ALT } from "@/lib/images";

const tabs = [
  { id: "federacion", label: "Federación", icon: Network },
  { id: "politicas", label: "Políticas", icon: FileText },
  { id: "rfcs", label: "RFCs", icon: MessageSquareText },
  { id: "transparencia", label: "Transparencia", icon: ShieldCheck },
];

const federations = [
  { name: "F1 — Gobernanza", status: "Operational" },
  { name: "F2 — Identidad y Acceso", status: "Operational" },
  { name: "F3 — Datos Territoriales", status: "Degraded" },
  { name: "F4 — Comercio y Monetización", status: "Operational" },
  { name: "F5 — IA Cognitiva", status: "Operational" },
  { name: "F6 — Comunidad y Contenido", status: "Operational" },
  { name: "F7 — Observabilidad", status: "Operational" },
];

const politicas = [
  { name: "Política de Privacidad", desc: "Protección de datos personales" },
  { name: "Términos de Servicio", desc: "Uso de la plataforma territorial" },
  { name: "Código de Conducta", desc: "Normas de convivencia digital" },
  { name: "Política de Datos", desc: "Gestión y propiedad de la información" },
];

const transparencia = [
  { name: "Finanzas", desc: "Reportes de ingresos y gastos" },
  { name: "Decisiones", desc: "Bitácora de decisiones federadas" },
  { name: "Métricas", desc: "KPIs del ecosistema" },
  { name: "Auditoría", desc: "Registro de acciones del sistema" },
];

export default function GobernanzaPage() {
  const [activeTab, setActiveTab] = useState("federacion");

  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Modelo federado"
        title="Gobernanza del Nodo Cero"
        subtitle="Cómo se gobierna y decide el ecosistema digital del territorio."
        image={LANDSCAPE_ALT}
      />

      <div className="sticky top-14 z-40 border-b border-[#2a2d35] bg-[#0a0b0e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-14 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                activeTab === t.id ? "bg-[#c8a356]/10 text-[#c8a356]" : "text-[#9ca3af] hover:text-[#e8e6e0]"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {activeTab === "federacion" && (
          <>
            <SectionHeader
              eyebrow="Sistema"
              title="Federaciones del ecosistema"
              description="Estado de los módulos que conforman el Nodo Cero."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {federations.map((fed) => (
                <div key={fed.name} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{fed.name}</p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        fed.status === "Operational"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-yellow-900/50 text-yellow-400"
                      }`}
                    >
                      {fed.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "politicas" && (
          <>
            <SectionHeader eyebrow="Reglas claras" title="Políticas del hub" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {politicas.map((pol) => (
                <div key={pol.name} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6 hover:border-[#c8a356]/60 transition-colors">
                  <FileText className="h-5 w-5 text-[#c8a356] mb-2" />
                  <p className="font-medium">{pol.name}</p>
                  <p className="text-sm text-[#9ca3af] mt-1">{pol.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "rfcs" && (
          <>
            <SectionHeader
              eyebrow="Propuestas"
              title="Solicitudes de comentarios"
              description="La comunidad propone y decide las evoluciones del ecosistema."
            />
            <div className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-14 text-center space-y-2">
              <MessageSquareText className="h-8 w-8 mx-auto text-[#c8a356]" />
              <p className="font-serif text-xl font-bold">RFCs</p>
              <p className="text-sm text-[#9ca3af]">Próximamente — espacio de propuestas abierto a la comunidad.</p>
            </div>
          </>
        )}

        {activeTab === "transparencia" && (
          <>
            <SectionHeader eyebrow="Cuentas claras" title="Transparencia" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {transparencia.map((item) => (
                <div key={item.name} className="border border-[#2a2d35] rounded-2xl bg-[#121418] p-6">
                  <ShieldCheck className="h-5 w-5 text-[#c8a356] mb-2" />
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-[#9ca3af] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
