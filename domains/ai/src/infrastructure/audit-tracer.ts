/**
 * auditTracer - registra eventos de Isabella para trazabilidad.
 * Implementar almacenamiento en isabella_audit_logs (Supabase/Postgres).
 * Aquí solo se muestra un stub que può ser reemplazado por Supabase client calls.
 */

export async function auditTrace(payload: {
  tenantId?: string;
  sessionId?: string;
  actorId?: string;
  eventType: string;
  data: Record<string, unknown>;
  traceId?: string;
  metadata?: Record<string, unknown>;
}) {
  // TODO: sustituir por insert a isabella_audit_logs
  console.log('[isabella.audit]', {
    tenantId: payload.tenantId,
    sessionId: payload.sessionId,
    eventType: payload.eventType,
    traceId: payload.traceId ?? 'not-provided',
    data: payload.data,
    metadata: payload.metadata
  });
  // Return a fake id for chaining
  return { auditId: 'audit_stub_' + Date.now() };
}
