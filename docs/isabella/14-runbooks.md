# Runbooks Críticos

**Versión:** 1.0.0

---

## Runbook 1: Ethical Firewall Block

**Señal:** Triple Bloqueo Sexual activado, POL-SEX-xxx triggered
**Severidad:** Alta
**Responsable:** FED-7 Auditoría

### Pasos
1. Identificar el DecisionRecord associado al bloqueo.
2. Revisar el input del usuario: `GET /v1/decisions/{decisionId}`
3. Verificar si fue un falso positivo (confianza del clasificador).
4. Si es falso positivo:
   - Crear ADR para ajustar la política
   - Agregar patrón de exclusión al regex/config
   - Desplegar fix
5. Si es positivo válido:
   - Registrar incidente en ITDR
   - Notificar a FED-7
   - Apelación humana si el usuario la inicia (`POST /v1/appeals`)
6. Verificar que el bloqueo se registró en BookPI.

### Métricas
- Bloqueos totales por día
- Tasa de falsos positivos
- Tiempo medio de resolución

---

## Runbook 2: Provider Failover Cascade

**Señal:** Todos los providers LLM fallando
**Severidad:** Alta
**Responsable:** FED-1 Preservación

### Pasos
1. Verificar status de cada provider:
   - Anthropic: status.anthropic.com
   - OpenAI: status.openai.com
   - DeepSeek: status.deepseek.com
2. Revisar Provider Failover stats: `GET /v1/crown/stats`
3. Si es un provider específico → deshabilitar temporalmente:
   ```typescript
   crown.failover.setEnabled("anthropic", false);
   ```
4. Si es un problema de red → activar Modo Isla (regex + templates).
5. Monitorear hasta que el provider se recupere.
6. Re-habilitar providers cuando estén disponibles.
7. Post-mortem si duración >30min.

### Modo Isla
- Respuestas con templates predefinidos
- Sin acceso a LLM externo
- Memory Fabric sigue operando
- BookPI sigue anclando

---

## Runbook 3: BookPI Anchoring Failure

**Señal:** `bookpi.anchor` event falla
**Severidad:** Media
**Responsable:** FED-5 Integridad

### Pasos
1. Verificar conectividad con IPFS node (si aplica).
2. Revisar logs del BookPI middleware.
3. Si es temporal → re-queue el AuditBundle.
4. Si es persistente → verificar integridad del ledger local.
5. Verificar firma SHA-256 de los nodos recientes.
6. Re-sincronizar desde el último nodo válido.
7. Si hay corrupción → restaurar desde backup.

---

## Runbook 4: Knowledge DB Corruption

**Señal:** Query returns inconsistent results, confidence drops
**Severidad:** Alta
**Responsable:** FED-3 Tecnología

### Pasos
1. Aislar la base de conocimiento (modo read-only).
2. Verificar integridad de tablas: `isabella_knowledge`, `isabella_memory`.
3. Hacer backup del estado actual.
4. Restaurar desde snapshot más reciente válido.
5. Re-indexar vector DB si aplica.
6. Verificar con queries de ground-truth.
7. Re-habilitar modo write.
8. Investigar causa raíz.

---

## Runbook 5: AzuraCast Down

**Señal:** `GET /api/radio/status` returns 502
**Severidad:** Baja
**Responsable:** Operaciones

### Pasos
1. Verificar contenedor Docker:
   ```bash
   wsl -d Ubuntu -e docker ps
   ```
2. Si no está corriendo → reiniciar:
   ```bash
   wsl -d Ubuntu -e sudo service docker start
   wsl -d Ubuntu -e docker compose -f /var/azuracast/docker-compose.yml up -d
   ```
3. Si está corriendo pero no responde → revisar logs:
   ```bash
   wsl -d Ubuntu -e docker logs azuracast --tail 50
   ```
4. Si MariaDB falló → limpiar volumen y recrear:
   ```bash
   docker rm -f azuracast
   docker volume rm azuracast_azuracast_data
   docker compose up -d --pull always
   ```
5. Verificar que el stream funciona en `http://localhost:8000`.

---

## Runbook 6: Capability Gateway Degraded

**Señal:** `successRate` < 0.9, `errorCount` increasing
**Severidad:** Media
**Responsable:** FED-3 Tecnología

### Pasos
1. Revisar stats del gateway: `GET /v1/crown/stats`
2. Identificar skill con mayor tasa de error.
3. Revisar logs del skill específico.
4. Si es un skill个体 → deshabilitar temporalmente:
   ```typescript
   gateway.getSkill("memory").status = "error";
   ```
5. Si es systemic → revisar BookPI telemetry para patrones.
6. Aplicar fix y re-habilitar.
7. Verificar que successRate sube por encima de 0.95.

---

## Runbook 7: Security Incident (ITDR Alert)

**Señal:** ITDR Monitor detecta actividad sospechosa
**Severidad:** Crítica
**Responsable:** FED-1 Preservación + FED-7 Auditoría

### Pasos
1. Revisar alerta ITDR: tipo, severidad, actor.
2. Si es brute force → bloquear IP temporalmente.
3. Si es privilege escalation → suspender cuenta.
4. Si es session hijack → invalidar todas las sesiones del usuario.
5. Revisar Audit Log para determinar alcance.
6. Generar incidente en BookPI.
7. Notificar a las federaciones afectadas.
8. Post-mortem obligatorio para incidents critical.

---

## Daily Operations Checklist

```bash
# Health
curl http://localhost:3000/api/health

# Federation
curl http://localhost:3000/api/federation/status

# C.R.O.W.N Stats
curl http://localhost:3000/api/crown/stats

# Radio
curl http://localhost:3000/api/radio/status

# BookPI (should have new anchors)
# Check in Grafana dashboard
```

---

## Emergency Contacts

| Rol | Contacto |
|-----|---------|
| SRE | Edwin Castillo Trejo |
| Security | FED-7 Guardian |
| Database | FED-3 Tecnología |
| Radio | Admin AzuraCast |
