/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { motion } from "framer-motion";
import { BookOpen, Pickaxe, Church, Crown } from "lucide-react";

const HERITAGE_ITEMS = [
  {
    era: "Siglo XVI",
    title: "FundaciÃ³n Minera",
    description: "Los primeros yacimientos de plata son descubiertos en la Sierra de Pachuca. Real del Monte nace como real de minas bajo la Corona EspaÃ±ola.",
    icon: Pickaxe,
  },
  {
    era: "Siglo XVIII",
    title: "Apogeo de la Plata",
    description: "La Mina de Acosta y la Veta VizcaÃ­na producen toneladas de plata. El pueblo se convierte en uno de los centros mineros mÃ¡s ricos de la Nueva EspaÃ±a.",
    icon: Crown,
  },
  {
    era: "1824",
    title: "Llegada de los Cornish",
    description: "Mineros britÃ¡nicos de Cornwall llegan con tecnologÃ­a de vapor y traen consigo el paste, el fÃºtbol y el cementerio inglÃ©s. Una fusiÃ³n cultural irrepetible.",
    icon: BookOpen,
  },
  {
    era: "Siglo XX",
    title: "Patrimonio Cultural",
    description: "Real del Monte es declarado Pueblo MÃ¡gico. Sus minas, arquitectura y tradiciones son reconocidas como patrimonio cultural de MÃ©xico.",
    icon: Church,
  },
];

export function HeritageView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">Patrimonio Digital</h1>
        <p className="text-sm text-muted-foreground mt-1">
          LÃ­nea temporal del valor cultural de Real del Monte
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-8">
          {HERITAGE_ITEMS.map((item, i) => (
            <motion.div
              key={item.era}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-16"
            >
              <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                <item.icon className="w-3 h-3 text-accent-foreground" />
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <span className="text-[10px] font-mono text-accent uppercase tracking-wider">{item.era}</span>
                <h3 className="font-display font-semibold text-base mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-primary text-primary-foreground rounded-xl p-6 text-center"
      >
        <p className="font-display text-lg italic leading-relaxed">
          "Real del Monte no compite contra apps. Compite contra el abandono tecnolÃ³gico de territorios completos."
        </p>
        <p className="text-xs mt-3 opacity-60">â€” FilosofÃ­a RDM Digital OS</p>
      </motion.div>
    </div>
  );
}
