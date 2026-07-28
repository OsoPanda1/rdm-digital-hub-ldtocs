/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { RDMPageShell } from "@/components/rdm/RDMPageShell";
import { OperationalReadinessBoard } from "@/components/operations/OperationalReadinessBoard";

export default function Guardian() {
  return (
    <RDMPageShell
      eyebrow="Gobernanza HITL"
      title="Guardian Console"
      description="Panel de supervisiÃ³n humana sobre decisiones de IA territorial. ModeraciÃ³n, auditorÃ­a y diagnÃ³stico via Gateway TAMV DM-X7."
      bullets={[
        "RevisiÃ³n HITL (Human-In-The-Loop) de acciones sensibles generadas por Isabella AI.",
        "Pipeline de diagnÃ³stico: kernel.isabella.test y security.sentinel.status vÃ­a Gateway unificado.",
        "Centro de PreparaciÃ³n Operativa con mÃ©tricas de progreso hacia stage y producciÃ³n.",
      ]}
    >
      <OperationalReadinessBoard />
    </RDMPageShell>
  );
}
