/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { WikiPage } from "@/components/WikiPage";
import { Section, InfoBox } from "@/components/WikiElements";
import { Atom, Cpu, Shield, FlaskConical } from "lucide-react";

const QuantumComputing = () => (
  <WikiPage
    title="TecnologÃ­a Quantum-ClÃ¡sica"
      subtitle="ComputaciÃ³n HÃ­brida â€” IBM Qiskit, Google Cirq, Microsoft Q#"
    >
      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src="/images/misty-mountains.jpg" alt="MontaÃ±as neblinosas de Real del Monte" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      <InfoBox type="info" title="Arquitectura CuÃ¡ntica HÃ­brida">
      TAMV implementa un procesador hybrid quantum-classical que combina optimizaciÃ³n cuÃ¡ntica 
      (QAOA, VQE) con procesamiento clÃ¡sico para mÃ¡ximo rendimiento con 1000+ qubits simulados.
    </InfoBox>

    <Section title="Stack CuÃ¡ntico" icon={Atom}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["IBM Qiskit", "Google Cirq", "Microsoft Q#", "TensorFlow Quantum"].map((tech) => (
          <div key={tech} className="rounded-md border border-border/50 bg-primary/5 px-3 py-3 text-sm text-center font-medium text-foreground">
            {tech}
          </div>
        ))}
      </div>
    </Section>

    <Section title="Pipeline HÃ­brido" icon={Cpu}>
      <div className="rounded-lg border border-border/50 bg-card/30 p-4 font-mono text-xs space-y-2">
        <div className="text-muted-foreground"># QuantumClassicalHybrid Pipeline</div>
        <div>1. <span className="text-primary">quantum_optimize</span>(problem.quantum_part)</div>
        <div className="pl-4 text-muted-foreground">â†’ QuantumCircuit(qubits) â†’ H gates â†’ superposiciÃ³n</div>
        <div className="pl-4 text-muted-foreground">â†’ execute(backend, shots=1024) â†’ counts</div>
        <div>2. <span className="text-primary">classical_process</span>(problem.classical_part)</div>
        <div>3. <span className="text-primary">combine_results</span>(quantum, classical)</div>
      </div>
    </Section>

    <Section title="Aplicaciones" icon={FlaskConical}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "CriptografÃ­a Post-CuÃ¡ntica", desc: "Seguridad a prueba de computadoras cuÃ¡nticas con Kyber/Dilithium" },
          { title: "OptimizaciÃ³n de Consenso", desc: "Algoritmos cuÃ¡nticos QAOA para gobernanza federada" },
          { title: "SimulaciÃ³n Molecular", desc: "Modelado de materiales avanzados con VQE" },
          { title: "Machine Learning CuÃ¡ntico", desc: "IA con ventaja cuÃ¡ntica para predicciÃ³n y clasificaciÃ³n" },
        ].map((app) => (
          <div key={app.title} className="rounded-md border border-border/50 bg-muted/20 p-4">
            <div className="font-semibold text-foreground text-sm mb-1">{app.title}</div>
            <div className="text-xs text-muted-foreground">{app.desc}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="MÃ©tricas CuÃ¡nticas">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Qubits Simulados", value: "1000+" },
          { label: "Backend", value: "Hybrid" },
          { label: "Throughput", value: "Alto" },
          { label: "Latencia", value: "< 100ms" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border/50 bg-card/30 p-4 text-center">
            <div className="text-xl font-bold text-primary">{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
          </div>
        ))}
      </div>
    </Section>

    <Section title="Seguridad CuÃ¡ntica" icon={Shield}>
      <InfoBox type="warning">
        Todos los sistemas criptogrÃ¡ficos de TAMV estÃ¡n diseÃ±ados para resistir ataques de computadoras 
        cuÃ¡nticas. Los algoritmos post-cuÃ¡nticos (Kyber-1024, Dilithium-5) protegen la infraestructura 
        ante la amenaza Q-Day.
      </InfoBox>
    </Section>
  </WikiPage>
);

export default QuantumComputing;
