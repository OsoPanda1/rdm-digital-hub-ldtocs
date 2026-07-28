/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { Globe, Award, MapPin, TrendingUp } from "lucide-react";

const regiones = [
  { region: "AmÃ©rica del Norte", paises: "USA, CanadÃ¡, MÃ©xico" },
  { region: "Europa", paises: "Alemania, Francia, EspaÃ±a, Italia, Reino Unido" },
  { region: "Asia-PacÃ­fico", paises: "JapÃ³n, Corea del Sur, Australia, Singapur" },
  { region: "AmÃ©rica Latina", paises: "Brasil, Argentina, Chile, Colombia, PerÃº" },
];

const expansion = [
  { region: "India y Sudeste AsiÃ¡tico", emoji: "ðŸ‡®ðŸ‡³" },
  { region: "Ãfrica (SudÃ¡frica, Nigeria, Kenia)", emoji: "ðŸ‡¿ðŸ‡¦" },
  { region: "Medio Oriente (UAE, Arabia SaudÃ­)", emoji: "ðŸ‡¦ðŸ‡ª" },
  { region: "Europa NÃ³rdica (Noruega, Suecia, Dinamarca)", emoji: "ðŸ‡³ðŸ‡´" },
];

const premios = [
  "Most Innovative Platform 2026 â€” Tech Innovation Awards",
  "Best AI Ethics Implementation â€” AI Ethics Council",
  "Blockchain Excellence Award â€” Crypto Innovation Summit",
  "XR Platform of the Year â€” Virtual Reality Awards",
];

const ImpactoCivilizatorio = () => (
  <WikiPage
    title="Impacto Civilizatorio & ExpansiÃ³n"
    subtitle="25 PaÃ­ses Activos â€” MÃ©tricas Globales â€” Reconocimientos Internacionales"
  >
    <InfoBox type="success" title="Primer Sistema AntifrÃ¡gil Federado Transgeneracional">
      TAMV busca inscripciÃ³n histÃ³rica, elevaciÃ³n de dignidad, redistribuciÃ³n de riqueza 
      y construir el primer legado digital antifrÃ¡gil que trascienda generaciones.
    </InfoBox>

    <Section title="Objetivos Civilizatorios" icon={Globe}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "InscripciÃ³n HistÃ³rica", desc: "Registro vivo de comunidades olvidadas con memoria defensiva" },
          { title: "ElevaciÃ³n de Dignidad", desc: "Transformar vulnerabilidad en liderazgo tecnolÃ³gico" },
          { title: "RedistribuciÃ³n de Riqueza", desc: "Elevar millonarios del 0.75% al 10% mundial" },
          { title: "Legado Transgeneracional", desc: "Primer sistema antifrÃ¡gil federado que hereden las generaciones futuras" },
        ].map((obj) => (
          <div key={obj.title} className="rounded-md border border-border/50 bg-primary/5 p-4">
            <div className="font-semibold text-foreground text-sm mb-1">{obj.title}</div>
            <div className="text-xs text-muted-foreground">{obj.desc}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Presencia Global (25 paÃ­ses)" icon={MapPin}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {regiones.map((r) => (
          <div key={r.region} className="rounded-md border border-border/50 bg-muted/20 p-3">
            <div className="font-semibold text-foreground text-sm">{r.region}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.paises}</div>
          </div>
        ))}
      </div>
      <h4 className="font-semibold text-foreground mt-4">PrÃ³xima ExpansiÃ³n (Q1 2026)</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
        {expansion.map((e) => (
          <div key={e.region} className="rounded-md border border-border/50 bg-card/30 p-3 text-center">
            <div className="text-2xl mb-1">{e.emoji}</div>
            <div className="text-xs text-muted-foreground">{e.region}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Reconocimientos" icon={Award}>
      <div className="space-y-2">
        {premios.map((p) => (
          <div key={p} className="flex items-center gap-3 rounded-md border border-border/50 bg-muted/20 px-3 py-2">
            <span className="text-primary">ðŸ†</span>
            <span className="text-sm text-muted-foreground">{p}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Hitos Alcanzados" icon={TrendingUp}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          "Primer millÃ³n de usuarios (Enero 2026)",
          "$50M en volumen de transacciones",
          "25 paÃ­ses con operaciones activas",
          "500+ proveedores de salud integrados",
          "150+ cursos UTAMV disponibles",
        ].map((h) => (
          <div key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">âœ“</span>
            {h}
          </div>
        ))}
      </div>
    </Section>

    <Section title="Licenciamiento">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-md border border-border/50 bg-muted/20 p-4">
          <div className="font-semibold text-foreground text-sm">NÃºcleo FilosÃ³fico-PolÃ­tico</div>
          <div className="text-xs text-muted-foreground mt-1">TAMV-PRCL v1.0 (Propietario)</div>
        </div>
        <div className="rounded-md border border-border/50 bg-muted/20 p-4">
          <div className="font-semibold text-foreground text-sm">Especificaciones TÃ©cnicas</div>
          <div className="text-xs text-muted-foreground mt-1">TAMV-KÃ“RIMA v1.0 (Reciprocidad abierta)</div>
        </div>
      </div>
    </Section>
  </WikiPage>
);

export default ImpactoCivilizatorio;
