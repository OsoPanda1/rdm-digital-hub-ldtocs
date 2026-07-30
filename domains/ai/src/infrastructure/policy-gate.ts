import type { IsabellaPerception } from '@nodo-cero/ai-sdk/contracts';

/**
 * policyGate - decide si una percepción/decisión puede ejecutar herramientas o acciones.
 * NOTA: implementar lógica real consultando isabella_policies en la BD.
 */
export async function policyGate(perception: IsabellaPerception): Promise<{
  status: 'allowed' | 'denied' | 'requires_approval';
  reason?: string;
}> {
  // placeholder: reglas demo
  // - si payload.riskLevel === 'high' -> requires_approval
  try {
    const risk = (perception.payload as any)?.riskLevel;
    if (risk === 'high') {
      return { status: 'requires_approval', reason: 'Risk alto, requiere aprobación humana' };
    }
    // default allow
    return { status: 'allowed' };
  } catch (err) {
    return { status: 'denied', reason: 'error_evaluando_politica' };
  }
}
