import type { IsabellaPerception, IsabellaDecision } from '@nodo-cero/ai-sdk/contracts';
import { policyGate } from '../../infrastructure/policy-gate';
import { auditTrace } from '../../infrastructure/audit-tracer';

/**
 * processPerception - flujo canónico evolucionado:
 * 1. normalizar percepción (territorio, tenant, canal)
 * 2. auditar percepción entrante
 * 3. resolver políticas (policy-gate)
 * 4. decidir con reglas base (pre-LLM)
 * 5. preparar contexto para IA (toolCalls / nextActions)
 * 6. auditar decisión y devolverla
 */
export async function processPerception(perception: IsabellaPerception): Promise<IsabellaDecision> {
  const traceId =
    (perception.metadata as any)?.traceId ??
    `trace-${perception.territoryId ?? 'rdm'}-${Date.now()}`;

  const tenantId = (perception.payload as any)?.tenantId ?? 'rdm-nodo-cero';
  const channel = perception.inputType;
  const timestamp = perception.timestamp;

  // Normalización mínima de territorio
  if (!perception.territoryId) {
    perception.territoryId = 'rdm-real-del-monte-hidalgo-mx';
  }

  await auditTrace({
    tenantId,
    sessionId: perception.sessionId,
    actorId: perception.actorId,
    eventType: 'perception.received',
    data: perception,
    traceId,
    metadata: { channel, timestamp }
  });

  const policy = await policyGate(perception);

  // Branch 1: denegado por política
  if (policy.status === 'denied') {
    const decision: IsabellaDecision = {
      decisionId: `dec-${Date.now()}`,
      sessionId: perception.sessionId,
      summary: 'Acción denegada por política del nodo cero. Este evento queda registrado para análisis de riesgo.',
      confidence: 1,
      riskLevel: 'high',
      policyStatus: 'denied',
      toolCalls: [],
      details: {
        reason: policy.reason ?? 'policy_denied',
        channel,
        territoryId: perception.territoryId
      }
    };

    await auditTrace({
      tenantId,
      sessionId: perception.sessionId,
      actorId: perception.actorId,
      eventType: 'decision.denied',
      data: decision,
      traceId
    });

    return decision;
  }

  // Branch 2: requiere aprobación humana
  if (policy.status === 'requires_approval') {
    const decision: IsabellaDecision = {
      decisionId: `dec-${Date.now()}`,
      sessionId: perception.sessionId,
      summary:
        'La acción propuesta requiere revisión humana según las políticas del nodo cero. Un operador territorial debe validar esta decisión.',
      confidence: 0.85,
      riskLevel: 'high',
      policyStatus: 'requires_approval',
      toolCalls: [],
      details: {
        reason: policy.reason ?? 'requires_approval',
        channel,
        territoryId: perception.territoryId,
        nextActions: ['notify_human_operator']
      }
    };

    await auditTrace({
      tenantId,
      sessionId: perception.sessionId,
      actorId: perception.actorId,
      eventType: 'decision.requires_approval',
      data: decision,
      traceId
    });

    return decision;
  }

  // Branch 3: permitido - decisión base pre-LLM
  const rawInput = (perception.payload as any)?.input;
  const userInput =
    typeof rawInput === 'string'
      ? rawInput.trim().slice(0, 240)
      : '';

  const hasUserInput = userInput.length > 0;

  // Riesgo dinámico simple por tipo de input
  const riskLevel: IsabellaDecision['riskLevel'] =
    channel === 'api' || channel === 'event' ? 'medium' : 'low';

  const summaryBase = hasUserInput
    ? `Percepción recibida desde canal "${channel}" en territorio "${perception.territoryId}".`
    : 'Percepción recibida sin texto explícito; se mantiene registro para inteligencia territorial.';

  const decision: IsabellaDecision = {
    decisionId: `dec-${Date.now()}`,
    sessionId: perception.sessionId,
    summary: summaryBase,
    confidence: hasUserInput ? 0.7 : 0.5,
    riskLevel,
    policyStatus: 'allowed',
    toolCalls: [],
    details: {
      channel,
      territoryId: perception.territoryId,
      tenantId,
      echoInput: hasUserInput ? userInput : undefined,
      nextActions: hasUserInput ? ['invoke_llm_gateway'] : []
    }
  };

  await auditTrace({
    tenantId,
    sessionId: perception.sessionId,
    actorId: perception.actorId,
    eventType: 'decision.allowed',
    data: decision,
    traceId
  });

  return decision;
}
