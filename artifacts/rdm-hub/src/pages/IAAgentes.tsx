/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Brain, Cpu, MessageSquare, Shield } from "lucide-react";

const IAAgentes = () => (
  <WikiPage
    title="IA & Agentes"
    subtitle="Isabella VillaseÃ±or AI y el ecosistema de agentes inteligentes"
  >
    <Section title="Isabella AIâ„¢">
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-secondary">Isabella VillaseÃ±or AI</strong> es la IA contextual y colaborativa del ecosistema TAMV.
        ActÃºa como orquestadora neural con propÃ³sito Ã©tico, integrando modelos avanzados para asistencia,
        tutorizaciÃ³n, detecciÃ³n de amenazas y anÃ¡lisis civilizatorio.
      </p>
    </Section>

    <Section title="Capacidades">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Brain} title="IA Contextual" description="ComprensiÃ³n del contexto civilizatorio y personal del usuario." variant="cyan" />
        <InfoCard icon={MessageSquare} title="Canal IAâ€“IA" description="ComunicaciÃ³n entre agentes para coordinaciÃ³n de tareas complejas." variant="gold" />
        <InfoCard icon={Cpu} title="Onboarding Sensorial" description="Proceso de integraciÃ³n que adapta la experiencia al perfil del usuario." variant="cyan" />
        <InfoCard icon={Shield} title="Compliance Integrado" description="AlineaciÃ³n con AI Act, GDPR, ISO y NOM como parte del cÃ³digo." variant="gold" />
      </div>
    </Section>

    <Section title="Arquitectura de agentes">
      <p className="text-muted-foreground leading-relaxed">
        El ecosistema de agentes opera bajo un modelo jerÃ¡rquico donde Isabella coordina agentes auxiliares
        especializados en dominios especÃ­ficos: educaciÃ³n (UTAMV), seguridad (ANUBIS), economÃ­a (TAU) y
        experiencias inmersivas (DreamSpaces).
      </p>
    </Section>
  </WikiPage>
);

export default IAAgentes;
