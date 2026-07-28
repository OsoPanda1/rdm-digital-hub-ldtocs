/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { Link2, Shield, Code2, Database } from "lucide-react";

const BlockchainMSR = () => (
  <WikiPage
    title="Blockchain MSR Antifraude"
      subtitle="Merkle State Root â€” Registro Inmutable con Pruebas CriptogrÃ¡ficas"
    >
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/landscape-fog.jpg" alt="Paisaje con neblina de Real del Monte" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <InfoBox type="info" title="Merkle State Root (MSR)">
      Sistema antifraude que ancla el estado del ecosistema en blockchain pÃºblico mediante pruebas de Merkle,
      garantizando inmutabilidad, trazabilidad y verificaciÃ³n criptogrÃ¡fica de todos los registros civilizatorios.
    </InfoBox>

    <Section title="Arquitectura MSR" icon={Link2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border/50 bg-card/30 p-5">
          <h3 className="font-semibold text-foreground mb-3">Smart Contract MSR</h3>
          <div className="rounded-md bg-muted/30 p-3 font-mono text-xs space-y-1 overflow-x-auto">
            <div className="text-muted-foreground">// TAMVMSRRegistry.sol</div>
            <div><span className="text-primary">struct</span> StateRoot {"{"}</div>
            <div className="pl-4">bytes32 merkleRoot;</div>
            <div className="pl-4">uint256 blockNumber;</div>
            <div className="pl-4">uint256 timestamp;</div>
            <div className="pl-4">address validator;</div>
            <div className="pl-4">bool verified;</div>
            <div>{"}"}</div>
            <div className="mt-2"><span className="text-primary">function</span> anchorStateRoot(</div>
            <div className="pl-4">bytes32 _merkleRoot,</div>
            <div className="pl-4">bytes32[] _proof</div>
            <div>) â†’ verifyMerkleProof â†’ emit StateRootAnchored</div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/30 p-5">
          <h3 className="font-semibold text-foreground mb-3">Cadenas Integradas</h3>
          <div className="space-y-3">
            {[
              { chain: "Ethereum", role: "Smart Contracts principales" },
              { chain: "Polygon", role: "Escalabilidad y bajo costo" },
              { chain: "Solana", role: "Alto rendimiento (TPS)" },
              { chain: "Custom MSR Chain", role: "Cadena propia federada" },
            ].map((c) => (
              <div key={c.chain} className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{c.chain}</span>
                <span className="text-sm text-muted-foreground">{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>

    <Section title="CaracterÃ­sticas Antifraude" icon={Shield}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Inmutabilidad", desc: "Registros no modificables una vez anclados en blockchain. Cualquier alteraciÃ³n rompe la cadena de pruebas." },
          { title: "Trazabilidad", desc: "Cadena de custodia completa para cada acciÃ³n, transacciÃ³n y decisiÃ³n en el ecosistema." },
          { title: "VerificaciÃ³n", desc: "Pruebas criptogrÃ¡ficas Merkle que cualquier nodo puede validar de forma independiente." },
          { title: "DistribuciÃ³n", desc: "MÃºltiples nodos validadores autorizados con consenso Proof of Stake." },
        ].map((item) => (
          <div key={item.title} className="rounded-md border border-border/50 bg-muted/20 p-4">
            <div className="font-semibold text-foreground text-sm mb-1">{item.title}</div>
            <div className="text-xs text-muted-foreground">{item.desc}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Eventos MSR Registrados" icon={Database}>
      <div className="space-y-2">
        {[
          "CreaciÃ³n / modificaciÃ³n de identidad soberana (ID-NVIDA)",
          "Transacciones econÃ³micas y splits FairSplit",
          "Decisiones de gobernanza y votaciones",
          "Certificaciones federadas de nodos",
          "Cambios en configuraciÃ³n de seguridad TENOCHTITLAN",
          "Registro de contenido con hash probatorio",
        ].map((item, idx) => (
          <div key={item} className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{String(idx + 1).padStart(2, "0")}</span>
            <span className="text-sm text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section title="API MSR" icon={Code2}>
      <div className="rounded-lg border border-border/50 bg-card/30 p-4 font-mono text-xs space-y-2">
        <div><span className="text-primary">POST</span> /api/v1/msr/log â€” Registrar evento inmutable</div>
        <div><span className="text-primary">GET</span>  /api/v1/msr/events â€” Listar eventos registrados</div>
        <div><span className="text-primary">GET</span>  /api/v1/msr/verify/:hash â€” Verificar prueba Merkle</div>
        <div><span className="text-primary">GET</span>  /api/v1/msr/anchor/:rootHash â€” Consultar anclaje en blockchain</div>
      </div>
    </Section>
  </WikiPage>
);

export default BlockchainMSR;
