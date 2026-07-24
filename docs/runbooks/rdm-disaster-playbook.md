# Playbook de desastre — RDM Digital Hub

## Prioridad 0: proteger a la comunidad

Si el Hub, la radio o la conectividad fallan, prioriza comunicación clara, registro manual de incidentes y continuidad de información turística básica.

## Señales rápidas

- `/api/healthz` responde `degraded`: revisar `degradedReasons`.
- `/api/telemetry/status` muestra eventos críticos: operador con rol `operator` debe revisar logs.
- Radio no responde: usar canal social alterno y publicar mensaje de contingencia.

## Primeros 15 minutos

1. Confirmar si falla API, Supabase, radio o frontend.
2. Registrar hora UTC, persona responsable, síntomas y rutas afectadas.
3. Activar mensaje público simple: “Servicio en revisión; la información crítica se publicará por canales alternos”.
4. No rotar secretos durante un incidente activo salvo evidencia de compromiso.

## Recuperación

- API degradada: reiniciar servicio y revisar logs estructurados.
- Supabase caído: pausar escrituras no esenciales y mantener capturas manuales.
- Radio caída: activar playlist o transmisión alternativa documentada por operadores.
- Seguridad comprometida: revocar claves, forzar cierre de sesiones y publicar informe posterior.
