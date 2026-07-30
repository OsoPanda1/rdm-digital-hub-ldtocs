import type { IsabellaPerception, IsabellaDecision } from '@nodo-cero/ai-sdk/contracts';
import { policyGate } from '../../infrastructure/policy-gate';
import { auditTrace } from '../../infrastructure/audit-tracer';

/**
 * processPerception - flujo canónico:
 * 1. auditar percepción entrante
 * 2. resolver políticas (policy-gate)
 * 3. decidir (stub)
 * 4. auditar decisión y devolverla
 */
export async function processPerception(perception: IsabellaPerception): Promise<IsabellaDecision> {
  const traceId = (perception.metadata as any)?.traceId ?? `trace-${Date.now()}`;
  await auditTrace({
    tenantId: (perception.payload as any)?.tenantId,
    sessionId: perception.sessionId,
    actorId: perception.actorId,
    eventType: 'perception.received',
    data: perception,
    traceId
  });

  const policy = await policyGate(perception);

  if (policy.status === 'denied') {
    const decision: IsabellaDecision = {
      decisionId: `dec-${Date.now()}`,
      sessionId: perception.sessionId,
      summary: 'Acción denegada por política',
      confidence: 1,
      riskLevel: 'high',
      policyStatus: 'denied',
      toolCalls: []
    };
    await auditTrace({ eventType: 'decision.created', data: decision, traceId });
    return decision;
  }

  if (policy.status === 'requires_approval') {
    const decision: IsabellaDecision = {
      decisionId: `dec-${Date.now()}`,
      sessionId: perception.sessionId,
      summary: 'Requiere aprobación humana',
      confidence: 0.8,
      riskLevel: 'high',
      policyStatus: 'requires_approval',
      toolCalls: []
    };
    await auditTrace({ eventType: 'decision.created', data: decision, traceId });
    return decision;
  }

  // Placeholder: simple rule-based decision
  const decision: IsabellaDecision = {
    decisionId: `dec-${Date.now()}`,
    sessionId: perception.sessionId,
    summary: 'Decision generada automáticamente (stub)',
    confidence: 0.6,
    riskLevel: 'low',
    policyStatus: 'allowed',
    toolCalls: []
  };

  await auditTrace({ eventType: 'decision.created', data: decision, traceId });

  return decision;
}
