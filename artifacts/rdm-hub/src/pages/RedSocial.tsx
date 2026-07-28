/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { Users, Video, MessageCircle, Gift, Radio, Shield, Globe, Gamepad2 } from "lucide-react";

const servicios = [
  {
    icon: Video,
    title: "Videos HD/4K/8K",
    items: ["EdiciÃ³n avanzada integrada", "Reels interactivos con elementos 3D/4D", "Historias persistentes con lÃ­nea temporal", "Streaming 4K/8K nativo"],
  },
  {
    icon: MessageCircle,
    title: "ComunicaciÃ³n Cifrada",
    items: ["Chats privados con cifrado cuÃ¡ntico", "Grupos temÃ¡ticos hasta 100K miembros", "Canales de difusiÃ³n premium", "Muro global con algoritmo Ã©tico"],
  },
  {
    icon: Gift,
    title: "Sistema CGIFTS",
    items: ["30+ regalos virtuales ($1â€“$300)", "Mini Anubis Ultra (subasta blockchain)", "NFT minting para regalos especiales", "Isabella AI recomienda regalos"],
  },
  {
    icon: Gamepad2,
    title: "Entretenimiento",
    items: ["Conciertos sensoriales XR", "Gaming integral (Casual, MMO, Esports)", "Mascotas digitales con IA genÃ©tica", "LoterÃ­a TAMV blockchain transparente"],
  },
  {
    icon: Globe,
    title: "Dream Spaces",
    items: ["Espacios privados customizables", "Mundos temÃ¡ticos comunitarios", "Arquitectura imposible (fÃ­sica cuÃ¡ntica)", "ColaboraciÃ³n en tiempo real"],
  },
  {
    icon: Shield,
    title: "ID-NVIDA Verificada",
    items: ["Avatares con biometrÃ­a avanzada", "Certificaciones profesionales blockchain", "Sistema de reputaciÃ³n verificable", "Privacidad selectiva y revelaciÃ³n controlada"],
  },
];

const metricas = [
  { label: "Usuarios Registrados", value: "8.5M" },
  { label: "Usuarios Activos Mensuales", value: "6.2M" },
  { label: "Tiempo Promedio SesiÃ³n", value: "45 min" },
  { label: "RetenciÃ³n 30 dÃ­as", value: "78%" },
  { label: "NPS Score", value: "72" },
  { label: "Regalos Virtuales / mes", value: "$15M" },
];

const RedSocial = () => (
  <WikiPage
    title="Red Social Avanzada"
    subtitle="Plataforma social federada superior â€” Videos, Chats, CGIFTS, Dream Spaces y mÃ¡s"
  >
    <InfoBox type="info" title="Ecosistema Social Completo">
      La red social TAMV integra comunicaciÃ³n cifrada, contenido inmersivo XR, economÃ­a de regalos CGIFTS, 
      espacios virtuales Dream Spaces e identidad soberana ID-NVIDA en una Ãºnica plataforma Ã©tica y federada.
    </InfoBox>

    <Section title="Servicios del Ecosistema Social" icon={Users}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicios.map((s) => (
          <div key={s.title} className="rounded-lg border border-border/50 bg-card/30 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-md bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{s.title}</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {s.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Publicidad Ã‰tica" icon={Radio}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Experiencias XR nativas", desc: "InmersiÃ³n publicitaria no intrusiva" },
          { label: "Consentimiento transparente", desc: "Control total del usuario" },
          { label: "Revenue Sharing", desc: "60% para creadores" },
          { label: "Valor educativo", desc: "Publicidad que enseÃ±a y aporta" },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-border/50 bg-muted/20 p-4">
            <div className="font-medium text-foreground text-sm">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Programa de Referidos 500">
      <InfoBox type="success">
        <ul className="space-y-1.5">
          <li><strong>$1,000 USD</strong> por alcanzar 500 seguidores con membresÃ­a</li>
          <li><strong>Bonos escalonados</strong> hasta $500,000 USD</li>
          <li><strong>Beneficios exclusivos:</strong> Equity, partnerships, embajadas</li>
          <li><strong>Crecimiento exponencial</strong> con sistema de incentivos masivo</li>
        </ul>
      </InfoBox>
    </Section>

    <Section title="MÃ©tricas de Rendimiento">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metricas.map((m) => (
          <div key={m.label} className="rounded-lg border border-border/50 bg-card/30 p-4 text-center">
            <div className="text-2xl font-bold text-primary">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Gremio TAMVDevs & HubDevs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "SDK completo XR/VR para desarrollo",
          "DocumentaciÃ³n y tutoriales avanzados",
          "ColaboraciÃ³n Open Source comunitaria",
          "Hackathons mensuales con premios",
          "Bolsa de trabajo exclusiva global",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
            <span className="text-primary">â—†</span>
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </Section>
  </WikiPage>
);

export default RedSocial;
