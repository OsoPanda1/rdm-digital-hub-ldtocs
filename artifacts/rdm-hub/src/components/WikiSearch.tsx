/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const searchIndex = [
  { title: "Inicio", url: "/", keywords: "home principal tamv md-x4 citemesh" },
  { title: "IntroducciÃ³n", url: "/introduccion", keywords: "quÃ© es tamv origen historia ecosistema civilizatorio membresÃ­as segmentos" },
  { title: "FilosofÃ­a y CÃ³dice", url: "/filosofia", keywords: "cÃ³dice kÃ³rima principios Ã©tica gobernanza valores" },
  { title: "Arquitectura TAMV MDâ€‘X4", url: "/arquitectura", keywords: "capas mÃ³dulos citemesh stack isabella eoct anubis" },
  { title: "IDâ€‘NVIDA", url: "/dominios/id-nvida", keywords: "identidad soberana digital huella did verificable" },
  { title: "UTAMV", url: "/dominios/utamv", keywords: "universidad educaciÃ³n inmersiva formaciÃ³n escuela" },
  { title: "Metaverso MDâ€‘X4", url: "/dominios/metaverso", keywords: "xr gemelos digitales dreamspaces realidad virtual" },
  { title: "EconomÃ­a TAMV", url: "/dominios/economia", keywords: "tau token intercambio valor Ã©tico trazabilidad blockchain membresÃ­as niveles accesos precios free premium devs advance enterprise" },
  { title: "Seguridad", url: "/dominios/seguridad", keywords: "anubis horus tenochtitlan honeypots zero-trust guardianÃ­as" },
  { title: "IA & Agentes", url: "/ia-agentes", keywords: "isabella ai agentes ia neural compliance gdpr" },
  { title: "LÃ­nea de Tiempo", url: "/timeline", keywords: "historia hitos cronologÃ­a 2020 2024 2025 2026" },
  { title: "DocumentaciÃ³n", url: "/documentacion", keywords: "api docs tÃ©cnica guÃ­as tutoriales" },
  { title: "Gobernanza y PolÃ­ticas", url: "/gobernanza", keywords: "roles contribuciÃ³n plantillas revisiÃ³n compliance estÃ¡ndares membresÃ­as participaciÃ³n certificaciÃ³n federada nodo guardiÃ¡n observador" },
  { title: "Dashboard de Monitoreo", url: "/dashboard", keywords: "nodos estado grafana mÃ©tricas latencia cpu alertas monitoreo visibilidad membresÃ­a" },
  { title: "Sistemas Avanzados", url: "/sistemas-avanzados", keywords: "hexagonal pipeline eoct quantum filtraciÃ³n caliente frÃ­o social core comunidad reputaciÃ³n votaciÃ³n" },
  { title: "Manuales de Usuario", url: "/manuales", keywords: "guÃ­a manual inicio rÃ¡pido faq redundancia desarrollo seguridad membresÃ­a instituciones piloto" },
  { title: "Despliegue Universal", url: "/despliegue", keywords: "deploy cloud on-premise federada certificaciÃ³n docker terraform prerequisitos checklist local kubernetes nodo observador colaborador operador guardiÃ¡n" },
  { title: "BiografÃ­a CEO", url: "/biografia-ceo", keywords: "edwin anubis villaseÃ±or fundador ceo castillo trejo real del monte" },
  { title: "Casos de Uso", url: "/casos-de-uso", keywords: "universidad gobierno empresa comunidad fintech ejemplos implementaciÃ³n" },
  { title: "Kit de APIs", url: "/kit-apis", keywords: "api rest endpoints sdk integraciÃ³n conectores external rate limit acceso membresÃ­a sandbox" },
  { title: "Estrategia Comercial", url: "/estrategia", keywords: "marketing venta posicionamiento segmentos negocio plantilla replicable rutas adopciÃ³n membresÃ­a free premium devs advance enterprise" },
  // NextGen Ecosystem pages
  { title: "Red Social Avanzada", url: "/red-social", keywords: "red social videos 4k 8k reels chats cifrado cgifts regalos dream spaces referidos tiktok instagram muro global publicidad Ã©tica" },
  { title: "Seguridad TENOCHTITLAN", url: "/seguridad-tenochtitlan", keywords: "tenochtitlan anubis centinel horus dekateotl aztek gods quetzalcoatl ojo de ra mos gemelos guardianÃ­a seguridad capas encriptaciÃ³n" },
  { title: "Blockchain MSR", url: "/blockchain-msr", keywords: "blockchain merkle state root antifraude ethereum polygon solana smart contract inmutable trazabilidad" },
  { title: "TecnologÃ­a XR/VR/3D/4D", url: "/xr-tecnologia", keywords: "xr vr ar 3d 4d render ray tracing three.js unity unreal webxr openxr haptic motor hiperrealista" },
  { title: "EconomÃ­a Federada", url: "/economia-federada", keywords: "economia federada 30 monetizaciÃ³n fairsplit creadores banco digital trading remesas nft marketplace" },
  { title: "Quantum Computing", url: "/quantum-computing", keywords: "quantum cuÃ¡ntico qiskit cirq q# hÃ­brido post-cuÃ¡ntico kyber dilithium qaoa vqe" },
  { title: "Enciclopedia Universal", url: "/enciclopedia", keywords: "enciclopedia github sourcegraph wikipedia neowiki kiro conocimiento grafo bÃºsqueda semÃ¡ntica" },
  { title: "Isabella AI Universal", url: "/isabella-ai", keywords: "isabella ai Ã©tica xai explicable supervisiÃ³n humana aprendizaje continuo tutorÃ­a moderaciÃ³n" },
  { title: "Impacto Civilizatorio", url: "/impacto-civilizatorio", keywords: "impacto civilizatorio expansiÃ³n global 25 paÃ­ses premios hitos licencia creative commons apache" },
];

export function WikiSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      setOpen(false);
      navigate(url);
    },
    [navigate]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/50 bg-muted/30 text-muted-foreground text-sm hover:bg-muted/50 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Buscarâ€¦</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border/50 bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
          âŒ˜K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar en la wiki TAMVâ€¦" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup heading="PÃ¡ginas">
            {searchIndex.map((page) => (
              <CommandItem
                key={page.url}
                value={`${page.title} ${page.keywords}`}
                onSelect={() => handleSelect(page.url)}
              >
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
