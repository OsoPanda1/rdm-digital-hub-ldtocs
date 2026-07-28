/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section } from "@/components/WikiElements";
import { Target, Users, Rocket, Shield, Award, TrendingUp, ArrowRight } from "lucide-react";

const Estrategia = () => (
  <WikiPage
    title="Estrategia Comercial"
    subtitle="Posicionamiento, segmentos y narrativa para TAMV MDâ€‘X4 como plantilla replicable"
  >
    <div className="space-y-8">
      <Section title="Posicionamiento">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Target className="h-6 w-6 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-foreground font-semibold text-lg leading-snug mb-2">
                "TAMV MDâ€‘X4 es la infraestructura modular para crear metaversos soberanos con identidad cultural y seguridad avanzada."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No es un metaverso. Es <strong className="text-primary">la infraestructura para crearlos</strong>.
                Una plantilla certificada, federada y antifrÃ¡gil que cualquier organizaciÃ³n puede desplegar
                para construir su propio ecosistema digital soberano.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Segmentos de pÃºblico">
        <div className="space-y-4">
          {[
            { icon: Shield, segment: "Gobiernos y comunidades", need: "SoberanÃ­a digital", offer: "Identidad ciudadana, servicios descentralizados, transparencia con EOCT.", hook: "Â¿Tu gobierno depende de infraestructura extranjera para servicios digitales crÃ­ticos?" },
            { icon: Users, segment: "Universidades y centros educativos", need: "Experiencias inmersivas", offer: "Campus virtual con UTAMV, certificaciones blockchain, tutora IA personalizada.", hook: "Â¿Tus estudiantes merecen mÃ¡s que un PDF y un Zoom?" },
            { icon: Rocket, segment: "Empresas Ã©ticas y B-Corps", need: "Ecosistemas antifrÃ¡giles", offer: "Gobernanza Ã©tica, compliance integrado, seguridad cuÃ¡ntico-resiliente.", hook: "Â¿Tu empresa habla de Ã©tica digital o la implementa desde la arquitectura?" },
          ].map((s) => (
            <div key={s.segment} className="rounded-lg border border-border/50 bg-card/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className="h-5 w-5 text-primary" />
                <h4 className="font-bold text-foreground">{s.segment}</h4>
              </div>
              <div className="space-y-2 pl-7">
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Necesidad:</strong> {s.need}</p>
                <p className="text-sm text-muted-foreground"><strong className="text-foreground">Oferta:</strong> {s.offer}</p>
                <p className="text-sm italic text-primary">"{s.hook}"</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="SegmentaciÃ³n de clientes y rutas de adopciÃ³n">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          El ecosistema TAMV contempla rutas progresivas de adopciÃ³n alineadas con los niveles de membresÃ­a.
          Cada ruta estÃ¡ diseÃ±ada para acompaÃ±ar al usuario desde la exploraciÃ³n hasta la operaciÃ³n autÃ³noma.
        </p>
        <div className="space-y-3">
          {[
            { route: "Ruta Individual", path: "Free â†’ Premium â†’ Devs", desc: "Ciudadanos y profesionales que exploran, consumen contenido avanzado y eventualmente construyen sobre la plataforma." },
            { route: "Ruta Institucional", path: "Premium â†’ Advance â†’ Enterprise", desc: "Universidades y organizaciones que inician con evaluaciÃ³n, lanzan pilotos y escalan a despliegues federados." },
            { route: "Ruta Soberana", path: "Advance â†’ Enterprise (contrato directo)", desc: "Gobiernos y grandes empresas que requieren infraestructura dedicada, SLA y nodos federados propios desde el inicio." },
          ].map((r) => (
            <div key={r.route} className="rounded-lg border border-border/50 bg-card/50 p-4">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                <h4 className="font-semibold text-foreground text-sm">{r.route}</h4>
                <span className="text-xs text-primary font-mono ml-auto">{r.path}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-primary">Nota estratÃ©gica:</strong> TAMV no compite con el Estado ni con empresas,
            sino que <strong className="text-foreground">complementa infraestructura existente</strong>. La propuesta es
            ofrecer la capa civilizatoria que falta: identidad soberana, gobernanza Ã©tica y resiliencia antifrÃ¡gil.
          </p>
        </div>
      </Section>

      <Section title="Propuesta de valor">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Rocket, title: "Plantilla modular", points: ["DocumentaciÃ³n tÃ©cnica completa", "Narrativa cultural integrada", "Despliegue en < 72 horas", "PersonalizaciÃ³n por dominio"] },
            { icon: Award, title: "CertificaciÃ³n federada", points: ["ValidaciÃ³n oficial de rÃ©plica", "AuditorÃ­a de seguridad incluida", "Compliance GDPR + AI Act", "RenovaciÃ³n anual automatizada"] },
            { icon: TrendingUp, title: "Ecosistema integrado", points: ["Isabella AI como asistente", "EconomÃ­a Ã©tica con token TAU", "Identidad soberana ID-NVIDA", "Monitoreo Grafana/Terraform"] },
          ].map((prop) => (
            <div key={prop.title} className="rounded-lg border border-border/50 bg-card/50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <prop.icon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">{prop.title}</h4>
              </div>
              <ul className="space-y-1.5">
                {prop.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Modelo de negocio por membresÃ­a">
        <div className="space-y-3">
          {[
            { tier: "Free (0 MXN/mes)", desc: "Puerta de entrada educativa. Lectura de wiki, Isabella bÃ¡sica, casos de uso pÃºblicos. Ideal para exploradores y estudiantes." },
            { tier: "Premium (~7â€“15 USD/mes)", desc: "Dashboards bÃ¡sicos, contenidos ampliados, mÃ³dulos introductorios de UTAMV. Para profesionales individuales y microempresas." },
            { tier: "Devs (~25â€“50 USD/mes)", desc: "Kit APIs con sandbox, documentaciÃ³n avanzada, acceso a NOAâ€‘TAMV en lectura, Social Core. Para desarrolladores y equipos tÃ©cnicos." },
            { tier: "Advance (~250â€“500 USD/mes)", desc: "Monitoreo avanzado, integraciÃ³n con NOA y Social Core, configuraciÃ³n de nodos, soporte prioritario. Para instituciones medianas." },
            { tier: "Enterprise (contrato anual)", desc: "Ecosistemas multi-nodo, despliegues federados llave en mano, gobernanza compartida, SLA dedicado. Para gobiernos y grandes empresas." },
          ].map((t) => (
            <div key={t.tier} className="rounded-lg border border-border/50 bg-card/50 p-4 flex items-start gap-3">
              <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm">{t.tier}</h4>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Narrativa de marca">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            TAMV MDâ€‘X4 nace de la convicciÃ³n de que la <strong className="text-primary">soberanÃ­a digital es un derecho</strong>,
            no un privilegio. Desde Real del Monte, Hidalgo, un autodidacta demuestra que la tecnologÃ­a puede ser
            culturalmente enraizada, Ã©ticamente rigurosa y tÃ©cnicamente avanzada al mismo tiempo.
            Cada lÃ­nea de cÃ³digo, cada documento, cada artesanÃ­a de alambre es un acto de inscripciÃ³n histÃ³rica
            que construye el legado de una civilizaciÃ³n digital latinoamericana.
          </p>
        </div>
      </Section>
    </div>
  </WikiPage>
);

export default Estrategia;
