/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";
import { Users, Code, Building, Globe } from "lucide-react";

const Introduccion = () => (
  <WikiPage
    title="IntroducciÃ³n"
        subtitle="Â¿QuÃ© es TAMV y por quÃ© existe?"
      >
        {/* Hero Banner */}
        <div className="relative h-48 w-full overflow-hidden">
          <img src="/images/heroprincipal.png" alt="Hero principal de TAMV" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        <Section title="Â¿QuÃ© es TAMV?">
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">TAMV MDâ€‘X4</strong> es un ecosistema civilizatorio digital nacido en MÃ©xico
        que integra identidad soberana, educaciÃ³n inmersiva, metaverso, economÃ­a Ã©tica y seguridad avanzada en una sola
        infraestructura auditable. Se plantea como el primer <strong className="text-primary">CITEMESH</strong>: un metaverso
        civilizatorio diseÃ±ado para servir a las personas y no a la publicidad ni a la vigilancia masiva.
      </p>
    </Section>

    <Section title="Â¿QuiÃ©n puede usar TAMV MDâ€‘X4?">
      <p className="text-muted-foreground leading-relaxed mb-4">
        TAMV estÃ¡ diseÃ±ado como plantilla replicable para mÃºltiples segmentos. Cada uno accede al ecosistema
        segÃºn su nivel de membresÃ­a (ver <strong className="text-primary">EconomÃ­a TAMV</strong> para detalles completos).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: Users, segment: "Ciudadanos y estudiantes", desc: "Acceso libre (Free) para explorar la wiki, usar Isabella AI y aprender sobre soberanÃ­a digital." },
          { icon: Code, segment: "Desarrolladores y labs", desc: "Nivel Devs con sandbox tÃ©cnico, Kit de APIs completo y documentaciÃ³n avanzada para construir sobre TAMV." },
          { icon: Building, segment: "Instituciones y universidades", desc: "Nivel Advance con monitoreo avanzado, configuraciÃ³n de nodos y soporte prioritario para pilotos institucionales." },
          { icon: Globe, segment: "Gobiernos y grandes empresas", desc: "Nivel Enterprise con despliegues federados llave en mano, SLA dedicado y gobernanza compartida." },
        ].map((s) => (
          <div key={s.segment} className="rounded-lg border border-border/50 bg-card/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground text-sm">{s.segment}</h4>
            </div>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Origen e historia">
      <p className="text-muted-foreground leading-relaxed">
        TAMV no nace en un laboratorio corporativo, sino desde la experiencia personal de su fundador
        (<strong className="text-foreground">Anubis VillaseÃ±or / Edwin Oswaldo Castillo Trejo</strong>) tras miles
        de horas de autoestudio, rechazo laboral y frustraciÃ³n con la educaciÃ³n tecnolÃ³gica superficial.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Entre 2020 y 2026 se documentan mÃ¡s de <strong className="text-primary">21,000 horas</strong> de trabajo
        dedicadas a conceptualizar, diseÃ±ar, programar y narrar el ecosistema, sosteniÃ©ndolo prÃ¡cticamente como
        "proyecto de un solo ser humano".
      </p>
    </Section>

    <Section title="PropÃ³sito civilizatorio">
      <p className="text-muted-foreground leading-relaxed">
        El objetivo de TAMV es encender una infraestructura digital que permita a personas, organizaciones y ciudades
        construir futuro con dignidad, transparencia y control ciudadano sobre los datos. MÃ¡s que ser "otra red social",
        busca operar como un <strong className="text-secondary">sistema operativo civilizatorio latinoamericano</strong>,
        documentado pÃºblicamente y diseÃ±ado como obra digital ligada a la evoluciÃ³n de la regiÃ³n.
      </p>
    </Section>

    <Section title="TecnologÃ­a y estÃ¡ndares">
      <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-2.5 text-foreground font-medium">Capa</th>
              <th className="text-left px-4 py-2.5 text-foreground font-medium">TecnologÃ­as</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="px-4 py-2.5 font-medium text-foreground">Frontend</td>
              <td className="px-4 py-2.5">React 18, TypeScript, Vite, Tailwind CSS, Framer Motion</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-4 py-2.5 font-medium text-foreground">3D/XR</td>
              <td className="px-4 py-2.5">Three.js, React Three Fiber, Drei</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="px-4 py-2.5 font-medium text-foreground">Backend</td>
              <td className="px-4 py-2.5">Supabase (PostgreSQL, Auth, Edge Functions, Storage)</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-foreground">AlineaciÃ³n</td>
              <td className="px-4 py-2.5">Web 4.0/5.0, AI Act, GDPR, ISO, NOM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  </WikiPage>
);

export default Introduccion;
