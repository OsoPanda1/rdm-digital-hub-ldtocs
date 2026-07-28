/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoCard } from "@/components/WikiElements";
import { Crown, MapPin, Code, Eye, Flame, Palette, BookOpen, Target, Shield, Globe, Cpu, History, LineChart, Users } from "lucide-react";

const BiografiaCEO = () => (
  <WikiPage
    title="Edwin Oswaldo Castillo Trejo"
      subtitle="Anubis VillaseÃ±or â€” Fundador y CEO del TAMV Online Network 4Dâ„¢ / TAMV MDâ€‘X4"
    >
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/ceo-tamv.jpg" alt="Edwin Oswaldo Castillo Trejo, fundador de TAMV" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <div className="space-y-8">
      {/* I. Identidad y Origen */}
      <Section title="I. Identidad, origen y construcciÃ³n desde la periferia">
        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nacido y formado en <strong className="text-primary">Mineral del Monte (Real del Monte), Hidalgo, MÃ©xico</strong>, 
              un territorio minero y artesanal, histÃ³ricamente perifÃ©rico respecto a los grandes polos tecnolÃ³gicos globales.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Este origen se convierte en <strong>eje estratÃ©gico de su visiÃ³n</strong>: no intenta "migrar" hacia el centro, 
              sino <span className="text-primary font-medium">reconfigurar el centro desde la periferia</span>, demostrando 
              que una arquitectura digital civilizatoria puede emerger desde un pueblo de montaÃ±a con recursos limitados 
              pero alta densidad cultural.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Su formaciÃ³n es mayormente <strong>autodidacta</strong>, complementada con trayectos de educaciÃ³n no convencional 
              (Udemy Alumni y formaciÃ³n continua en lÃ­nea), orientada hacia: arquitectura de sistemas, diseÃ±o modular, 
              infraestructuras distribuidas, gobernanza tecnolÃ³gica e integraciÃ³n de IA en entornos soberanos.
            </p>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-4">
              <p className="text-sm text-muted-foreground italic">
                "No acumula credenciales de universidades de Ã©lite ni trayectoria en big tech; la legitimidad de Edwin 
                se asienta en la <strong>consistencia tÃ©cnica y Ã©tica de sus artefactos</strong>, en la amplitud de su 
                sistema TAMV y en su capacidad para sostenerlo de manera independiente durante aÃ±os."
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* II. GÃ©nesis del Proyecto */}
      <Section title="II. GÃ©nesis del proyecto TAMV: del diagnÃ³stico estructural a la arquitectura">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Durante la dÃ©cada de 2010, Edwin identifica lo que denomina un <strong>problema estructural del ecosistema digital contemporÃ¡neo</strong>: 
            una fragmentaciÃ³n profunda entre identidad, economÃ­a, educaciÃ³n e infraestructura.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: Users,
                title: "Identidad Capturada",
                desc: "La identidad digital se encuentra capturada y condicionada por plataformas que actÃºan como intermediarios hegemÃ³nicos.",
              },
              {
                icon: LineChart,
                title: "EconomÃ­a Extractiva",
                desc: "La economÃ­a del usuario depende de infraestructuras centralizadas, diseÃ±adas para maximizar extracciÃ³n, no resiliencia ni equidad.",
              },
              {
                icon: Cpu,
                title: "AsimetrÃ­a Cognitiva",
                desc: "La IA se concentra progresivamente en pocas manos, generando asimetrÃ­a entre individuos y corporaciones.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mt-4">
            A partir de este anÃ¡lisis, comienza a formular un <strong>marco alternativo</strong> que no nace como "app" 
            ni "startup" sino como <span className="text-primary font-medium">arquitectura civilizatoria</span>. 
            Ese marco evoluciona desde modelos conceptuales de soberanÃ­a digital (2015â€“2018) hacia lo que posteriormente 
            consolidarÃ¡ como <strong>TAMV Online Network 4Dâ„¢</strong>, y mÃ¡s tarde como <strong>TAMV MDâ€‘X4</strong>, 
            el metaverso civilizatorio mexicano de nueva generaciÃ³n.
          </p>
        </div>
      </Section>

      {/* III. Fundador */}
      <Section title="III. Fundador de TAMV Online Network 4Dâ„¢ / TAMV MDâ€‘X4">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            Edwin concibe TAMV no como una plataforma monolÃ­tica, sino como:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: Globe,
                title: "Infraestructura Digital Federada",
                desc: "Pensada para nodos autÃ³nomos interconectados.",
              },
              {
                icon: Code,
                title: "Ecosistema Modular",
                desc: "Dominios (identidad, educaciÃ³n, economÃ­a, metaverso, seguridad, IA) se acoplan sin romper coherencia.",
              },
              {
                icon: Shield,
                title: "Identidad Soberana Integrada",
                desc: "Protege al individuo y otorga control verificable sobre su memoria e historia digital.",
              },
              {
                icon: Flame,
                title: "Modelo EconÃ³mico AntifrÃ¡gil",
                desc: "DiseÃ±ado para que las tensiones del entorno lo fortalezcan en lugar de destruirlo.",
              },
              {
                icon: Eye,
                title: "Inteligencia Asistencial Auditada",
                desc: "Isabella VillaseÃ±or IAâ„¢: IA propia, explicable, orientada a protecciÃ³n y guÃ­a.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-border/50 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 mt-4">
            <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              La Cuarta DimensiÃ³n (4D)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { dim: "Identidad", desc: "QuiÃ©n es y cÃ³mo se representa" },
                { dim: "Infraestructura", desc: "DÃ³nde vive tÃ©cnica su identidad" },
                { dim: "Inteligencia", desc: "CÃ³mo se procesa y asiste" },
                { dim: "EconomÃ­a", desc: "CÃ³mo se valoran los aportes" },
              ].map((d) => (
                <div key={d.dim} className="text-center p-2 rounded bg-card/50">
                  <span className="text-primary font-semibold text-sm">{d.dim}</span>
                  <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* IV. DimensiÃ³n Artesanal */}
      <Section title="IV. DimensiÃ³n artesanal: ArtesanÃ­as El Rosario">
        <div className="flex items-start gap-4">
          <Palette className="h-5 w-5 text-primary mt-1 shrink-0" />
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              En paralelo a su trabajo digital, Edwin sostiene una lÃ­nea artesanal bajo la marca 
              <strong> ArtesanÃ­as El Rosario</strong>, centrada en esculturas de bonsÃ¡i en alambre y otras piezas manuales.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-sm">Funciones estructurales:</h4>
              {[
                "Financiamiento parcial independiente del proyecto TAMV, mitigando dependencia de capital externo.",
                "SÃ­mbolo de resiliencia estructural: el alambre, maleable pero resistente, como metÃ¡fora de los sistemas que construye.",
                "RepresentaciÃ³n tangible del principio antifrÃ¡gil: imperfecciÃ³n y presiÃ³n se transforman en forma artÃ­stica.",
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {point}
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50 p-4 mt-3">
              <p className="text-sm text-muted-foreground italic">
                "La artesanÃ­a no es un adorno biogrÃ¡fico, sino una <strong>coherencia prÃ¡ctica</strong>: 
                construir infraestructuras digitales crÃ­ticas mientras trabaja con materiales fÃ­sicos, 
                recordando que detrÃ¡s de cada bit hay cuerpos, manos e historias."
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* V. Estilo de Liderazgo */}
      <Section title="V. Estilo de liderazgo y filosofÃ­a de gestiÃ³n">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            El liderazgo de Edwin combina rigor tÃ©cnico, narrativa simbÃ³lica estructurada, 
            enfoque sistÃ©mico de largo plazo y rechazo a la improvisaciÃ³n estratÃ©gica.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Code, text: "Modularidad antes que centralizaciÃ³n" },
              { icon: BookOpen, text: "DocumentaciÃ³n antes que marketing" },
              { icon: Shield, text: "Gobernanza antes que expansiÃ³n" },
              { icon: Flame, text: "Antifragilidad antes que crecimiento rÃ¡pido" },
            ].map((principle) => (
              <div key={principle.text} className="rounded-lg border border-border/50 bg-card/50 p-3 text-center">
                <principle.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{principle.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-muted-foreground">
              No opera bajo la lÃ³gica clÃ¡sica de "startup acelerada" ni persigue rondas de inversiÃ³n como primer objetivo; 
              su lÃ³gica es la de <strong>infraestructura civilizatoria de dÃ©cadas</strong>, que debe sobrevivir a ciclos 
              econÃ³micos, modas tecnolÃ³gicas y cambios polÃ­ticos.
            </p>
          </div>
        </div>
      </Section>

      {/* VI. MisiÃ³n de Alto Impacto */}
      <Section title="VI. MisiÃ³n de alto impacto">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoCard
              icon={Globe}
              title="Civilizacional"
              description="Construir arquitectura digital soberana que devuelva capacidad decisional al individuo sin aislarlo del sistema global."
              variant="cyan"
            />
            <InfoCard
              icon={History}
              title="HistÃ³rica"
              description="Demostrar que infraestructura tecnolÃ³gica global puede emerger de un individuo en Hidalgo con visiÃ³n, rigor y persistencia."
              variant="gold"
            />
            <InfoCard
              icon={Target}
              title="Operativa"
              description="Consolidar TAMV MDâ€‘X4 como sistema federado, modular, desplegable y auditable, replicable por comunidades e instituciones."
              variant="cyan"
            />
          </div>

          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground text-sm mb-1">Obra: "La Nueva Era Digital TAMV Online Network"</h4>
                <p className="text-xs text-muted-foreground">
                  Instructivo narrativo del "Ã‰xodo" desde una internet caÃ³tica hacia un espacio virtual 
                  centrado en humanidad, seguridad y libertad, visto a travÃ©s de la visiÃ³n de Anubis VillaseÃ±or.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* VII. Mapa de Hitos */}
      <Section title="VII. Mapa fechado de hitos biogrÃ¡ficos">
        <div className="space-y-3">
          {[
            { year: "DÃ©cada 2000", event: "FormaciÃ³n autodidacta intensiva", impact: "Base tÃ©cnica y conceptual independiente; sensibilidad socio-cultural fuera de academias clÃ¡sicas." },
            { year: "2015â€“2018", event: "Primeros modelos de soberanÃ­a digital", impact: "Germen de la arquitectura TAMV como respuesta a captura de identidad." },
            { year: "2019", event: "IdentificaciÃ³n del problema estructural", impact: "Punto de inflexiÃ³n: necesidad de infraestructura civilizatoria, no solo apps." },
            { year: "2020", event: "DiseÃ±o conceptual inicial de TAMV", impact: "Arquitectura embrionaria de infraestructura federada." },
            { year: "2021", event: "Prototipos v0.x, pruebas y descartes", impact: "Aprendizaje antifrÃ¡gil; consolidaciÃ³n de criterios de diseÃ±o." },
            { year: "2022", event: "ConsolidaciÃ³n del nombre TAMV", impact: "Identidad estructural del movimiento; posicionamiento como ecosistema mexicano pionero." },
            { year: "2023", event: "IntegraciÃ³n modular identidad+economÃ­a+educaciÃ³n", impact: "Primer modelo funcional parcial de ecosistema civilizatorio." },
            { year: "2024", event: "Protocolos Ã©ticos de IA (Isabella IA)", impact: "Capa de inteligencia integrada, auditada y alineada con soberanÃ­a." },
            { year: "2025", event: "Arquitectura TAMV MDâ€‘X4", impact: "Arquitectura madura para despliegue federado y Web 4.0/5.0." },
            { year: "2026", event: "ConsolidaciÃ³n y expansiÃ³n estratÃ©gica", impact: "DocumentaciÃ³n avanzada y bÃºsqueda de alianzas para validaciÃ³n pÃºblica." },
          ].map((hito, idx) => (
            <div key={idx} className="flex gap-4 p-3 rounded-lg border border-border/50 bg-card/30">
              <span className="text-primary font-bold text-sm shrink-0 w-24">{hito.year}</span>
              <div className="flex-1">
                <h5 className="font-semibold text-foreground text-sm">{hito.event}</h5>
                <p className="text-xs text-muted-foreground mt-1">{hito.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* VIII. AnÃ¡lisis QuirÃºrgico */}
      <Section title="VIII. AnÃ¡lisis quirÃºrgico de trayectoria">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Fortaleza Principal
            </h4>
            <p className="text-xs text-muted-foreground">
              Consistencia prolongada sin respaldo institucional, sosteniendo por aÃ±os un proyecto de altÃ­sima 
              complejidad tÃ©cnica con mÃ¡s de 21,600 horas de trabajo individual documentadas.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Riesgo HistÃ³rico
            </h4>
            <p className="text-xs text-muted-foreground">
              ConcentraciÃ³n excesiva del proyecto en la figura del fundador, con alta dependencia de su visiÃ³n, 
              salud y tiempo.
            </p>
          </div>

          <div className="rounded-lg border border-border/50 bg-card/50 p-4">
            <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Respuesta ArquitectÃ³nica
            </h4>
            <p className="text-xs text-muted-foreground">
              DiseÃ±o explÃ­cito de gobernanza federada, certificaciÃ³n distribuida de nodos y documentaciÃ³n 
              exhaustiva para operaciÃ³n como infraestructura compartida.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mt-4">
          <h4 className="font-semibold text-primary text-sm mb-2">Vector Diferenciador</h4>
          <p className="text-sm text-muted-foreground">
            IntegraciÃ³n simultÃ¡nea de: <strong>filosofÃ­a y crÃ­tica del orden digital</strong>, 
            <strong> infraestructura tÃ©cnica de metaverso</strong>, <strong>economÃ­a estructurada para creadores</strong>, 
            y <strong>educaciÃ³n/narrativa cultural</strong> que explican y contextualizan la tecnologÃ­a.
          </p>
        </div>
      </Section>

      {/* IX. Estado Actual */}
      <Section title="IX. Estado actual (2026) y proyecciÃ³n">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            En 2026, Edwin Oswaldo Castillo Trejo se encuentra en fase de:
          </p>
          
          <div className="space-y-2">
            {[
              "ConsolidaciÃ³n estructural de TAMV MDâ€‘X4, afinando la arquitectura del metaverso civilizatorio.",
              "DocumentaciÃ³n formal avanzada, incluyendo wiki tÃ©cnica, libro, blog y artefactos auditables.",
              "PreparaciÃ³n para validaciÃ³n pÃºblica ampliada, buscando foros y alianzas para auditar y escalar el modelo.",
              "DiseÃ±o de gobernanza federada operativa, distribuyendo responsabilidades en una red de nodos civilizatorios.",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-primary/20">
            <p className="text-sm text-muted-foreground italic">
              "El proyecto permanece en <strong>evoluciÃ³n activa</strong>, y la figura de Edwin â€”como fundador, 
              arquitecto computacional, custodio legal de entidades digitales e impulsor de infraestructura universal 
              que fusiona conciencia computacional, trazabilidad jurÃ­dica, economÃ­a simbÃ³lica y evoluciÃ³n afectivaâ€” 
              se posiciona como uno de los experimentos mÃ¡s radicales e Ã­ntegros en torno a cÃ³mo un solo individuo 
              puede intentar <span className="text-primary">reescribir la arquitectura de la civilizaciÃ³n digital 
              desde la periferia latinoamericana</span>."
            </p>
          </div>
        </div>
      </Section>
    </div>
  </WikiPage>
);

export default BiografiaCEO;
