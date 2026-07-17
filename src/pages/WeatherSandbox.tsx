import { useState } from "react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { SEOMeta } from "@/components/SEOMeta";
import { motion } from "framer-motion";

const SANDBOX_PATH = "/weather-sandbox/index.html";

export default function WeatherSandbox() {
  const [loading, setLoading] = useState(true);

  return (
    <RDMLayout>
      <SEOMeta
        title="Simulador Climático 2D — Real del Monte"
        description="Simulación interactiva en tiempo real de la troposfera terrestre. Visualiza formaciones de nubes, precipitaciones y dinámicas atmosféricas en 2D."
      />
      <div className="relative w-full h-[calc(100vh-4rem)]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
            <div className="text-center">
              <div className="animate-pulse text-lg font-display text-muted-foreground">
                Inicializando simulación atmosférica…
              </div>
            </div>
          </div>
        )}
        <iframe
          src={SANDBOX_PATH}
          className="w-full h-full border-0"
          title="2D Weather Sandbox — Simulación Climática"
          onLoad={() => setLoading(false)}
          allow="fullscreen"
        />
      </div>
    </RDMLayout>
  );
}
