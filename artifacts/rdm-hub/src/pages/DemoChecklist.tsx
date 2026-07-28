/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Printer, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

type Step = { route: string; title: string; screen: string; success: string };
const STEPS: Step[] = [
  { route: "/", title: "Apertura cinematogrÃ¡fica", screen: "Intro + Home con KPIs en vivo y banda dedicatoria platino.", success: "El video de intro corre y los KPIs cargan en <2s." },
  { route: "/ltos", title: "Manifiesto LTOS", screen: "7 ejes TAMV y fÃ³rmula I_TAMV visible.", success: "La fÃ³rmula se renderiza y la secciÃ³n dorada brilla." },
  { route: "/historia", title: "Historia de Real del Monte", screen: "Editorial con parallax y Ken Burns.", success: "ImÃ¡genes y lÃ­nea de tiempo cargan." },
  { route: "/ruta-del-paste", title: "Ruta del Paste interactiva", screen: "SVG con pan/zoom, 6 POIs con rating dinÃ¡mico.", success: "Se puede arrastrar, hacer zoom y abrir el modal de valoraciÃ³n." },
  { route: "/mitos", title: "Mitos y Leyendas", screen: "GalerÃ­a editorial cornish-mexicana.", success: "Cada tarjeta tiene narrativa y CTA." },
  { route: "/mapa", title: "Mapa Leaflet CartoDB Dark", screen: "Capas vivas (POIs, comercios, mining).", success: "Marcadores renderizan y se hace clic." },
  { route: "/comercios", title: "FederaciÃ³n B2B", screen: "Directorio con planes y CTA de registro.", success: "Lista visible y el botÃ³n a /registrar-comercio funciona." },
  { route: "/registrar-comercio", title: "Pago de membresÃ­a", screen: "Stripe Checkout MXN.", success: "Se abre Stripe (modo test) sin errores." },
  { route: "/music", title: "RDM Radio & Music", screen: "Hero player + playlist + Donar (mÃ­n. 25 MXN).", success: "Reproduce audio (o demo silencioso) y abre checkout de donaciÃ³n." },
  { route: "/juegos", title: "Mini-juegos territoriales", screen: "Trivia + Memorama cornish.", success: "Se juega una ronda completa." },
  { route: "/realito", title: "Realito AI Oracle", screen: "Chat con Gemini en streaming.", success: "Responde una pregunta sobre Real del Monte." },
  { route: "/perfil", title: "Perfil de usuario", screen: "Auth + KPIs + comercios + recompensas.", success: "SesiÃ³n activa, KPIs cargan, ediciÃ³n de nombre OK." },
  { route: "/control", title: "Control Center Â· TelemetrÃ­a real", screen: "Sparklines I_TAMV, salud de 7 federaciones, alertas.", success: "Latencia visible, alertas se generan si umbral se cruza." },
  { route: "/admin", title: "Panel Admin de Federaciones", screen: "Umbrales editables, roles, auditorÃ­a, subida de mÃºsica.", success: "Guardar umbral genera entrada en audit_log." },
  { route: "/wiki", title: "Enciclopedia RDM", screen: "ArtÃ­culos curados de cultura local.", success: "Al menos un artÃ­culo abre y se lee completo." },
];

export default function DemoChecklist() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setDone((d) => ({ ...d, [i]: !d[i] }));
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 lg:px-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gold/80">Lista de verificaciÃ³n</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Demo Municipal <span className="text-gradient-gold">Real del Monte</span></h1>
            <p className="mt-2 text-sm text-muted-foreground">{completed}/{STEPS.length} pasos verificados.</p>
          </div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-gold/40 text-gold px-3 py-2 text-xs">
            <Printer className="h-3.5 w-3.5" /> Imprimir
          </button>
        </motion.div>

        <ol className="space-y-3">
          {STEPS.map((s, i) => {
            const Icon = done[i] ? CheckCircle2 : Circle;
            return (
              <li key={i} className={`glass-card rounded-2xl border p-4 transition ${done[i] ? "border-emerald-500/40 bg-emerald-500/5" : "border-border/20"}`}>
                <div className="flex items-start gap-3">
                  <button onClick={() => toggle(i)} className="mt-1 shrink-0"><Icon className={`h-5 w-5 ${done[i] ? "text-emerald-400" : "text-muted-foreground"}`} /></button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-gold/80">#{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="font-display font-semibold">{s.title}</h3>
                      <Link to={s.route} className="text-[10px] font-mono text-electric hover:underline">{s.route} â†—</Link>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground"><span className="text-platinum">Pantalla:</span> {s.screen}</p>
                    <p className="text-xs text-emerald-400/90 mt-0.5"><ClipboardCheck className="inline h-3 w-3 mr-1" />Ã‰xito: {s.success}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
