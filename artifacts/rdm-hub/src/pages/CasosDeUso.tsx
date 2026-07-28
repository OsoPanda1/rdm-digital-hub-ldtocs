/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";
import { GraduationCap, Building2, Landmark, Globe, Shield, Coins } from "lucide-react";

const casos = [
  {
    icon: GraduationCap,
    title: "Universidades: Campus Inmersivo",
    sector: "EducaciÃ³n",
    desc: "Una universidad pÃºblica implementa TAMV como plataforma de educaciÃ³n inmersiva con identidad digital para estudiantes.",
    modules: ["UTAMV (plataforma educativa)", "ID-NVIDA (identidad estudiantil)", "Metaverso MD-X4 (aulas virtuales)", "Isabella AI (tutora personalizada)"],
    result: "ReducciÃ³n del 40% en deserciÃ³n. Acceso desde comunidades rurales sin infraestructura fÃ­sica.",
  },
  {
    icon: Landmark,
    title: "Gobiernos: SoberanÃ­a Digital Municipal",
    sector: "Gobierno",
    desc: "Un municipio despliega TAMV para crear identidad digital ciudadana y servicios pÃºblicos descentralizados.",
    modules: ["ID-NVIDA (credencial ciudadana)", "Seguridad (zero-trust municipal)", "EOCT (auditorÃ­a de servicios)", "EconomÃ­a TAMV (pagos de servicios)"],
    result: "EliminaciÃ³n del 70% de trÃ¡mites presenciales. Transparencia total con ledger EOCT.",
  },
  {
    icon: Building2,
    title: "Empresas: Ecosistema Ã‰tico Corporativo",
    sector: "Empresarial",
    desc: "Una corporaciÃ³n implementa TAMV para crear un ecosistema interno con gobernanza Ã©tica y trazabilidad.",
    modules: ["Gobernanza (roles y compliance)", "Seguridad (cifrado end-to-end)", "Dashboard (monitoreo en tiempo real)", "Isabella AI (asistente corporativo)"],
    result: "CertificaciÃ³n ISO 27001 acelerada. ReducciÃ³n del 60% en incidentes de seguridad.",
  },
  {
    icon: Globe,
    title: "Comunidades: Metaverso Cultural Soberano",
    sector: "Comunidad",
    desc: "Una comunidad indÃ­gena crea un espacio digital soberano para preservar cultura, lengua y conocimiento ancestral.",
    modules: ["Metaverso MD-X4 (espacios culturales)", "ID-NVIDA (identidad comunitaria)", "UTAMV (formaciÃ³n bilingÃ¼e)", "EconomÃ­a TAMV (comercio justo)"],
    result: "PreservaciÃ³n digital de 3 lenguas originarias. Red de comercio justo con trazabilidad blockchain.",
  },
  {
    icon: Shield,
    title: "Defensa: Infraestructura AntifrÃ¡gil",
    sector: "Seguridad Nacional",
    desc: "Una agencia gubernamental despliega TAMV como infraestructura de comunicaciones resiliente y cuÃ¡ntico-segura.",
    modules: ["Seguridad (Kyber/Dilithium)", "CITE-MESH (red federada)", "Pipelines hexagonales (procesamiento dual)", "FiltraciÃ³n inteligente (clasificaciÃ³n ML)"],
    result: "Red de comunicaciones con failover < 200ms. Resistente a ataques cuÃ¡nticos proyectados a 2030.",
  },
  {
    icon: Coins,
    title: "Fintech Ã‰tico: EconomÃ­a con PropÃ³sito",
    sector: "Finanzas",
    desc: "Una fintech social implementa la economÃ­a TAMV para crear un sistema de intercambio Ã©tico con trazabilidad completa.",
    modules: ["EconomÃ­a TAMV (token TAU)", "EOCT (auditorÃ­a financiera)", "ID-NVIDA (KYC soberano)", "Seguridad (cifrado financiero)"],
    result: "100% de trazabilidad en transacciones. Cumplimiento GDPR y AI Act desde el diseÃ±o.",
  },
];

const CasosDeUso = () => (
  <WikiPage
    title="Casos de Uso Documentados"
      subtitle="Ejemplos prÃ¡cticos de implementaciÃ³n del ecosistema TAMV por sector"
    >
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/paste-rdm.jpg" alt="Pastes coloniales de Real del Monte" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <div className="space-y-6">
      {casos.map((caso) => (
        <Section key={caso.title} title="">
          <div className="rounded-lg border border-border/50 bg-card/50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <caso.icon className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-foreground">{caso.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                  {caso.sector}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{caso.desc}</p>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">MÃ³dulos utilizados</h4>
              <div className="flex flex-wrap gap-1.5">
                {caso.modules.map((m) => (
                  <span key={m} className="text-xs px-2 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Resultado esperado</h4>
              <p className="text-sm text-muted-foreground">{caso.result}</p>
            </div>
          </div>
        </Section>
      ))}
    </div>
  </WikiPage>
);

export default CasosDeUso;
