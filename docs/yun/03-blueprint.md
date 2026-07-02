# YUN Blueprint – Arquitectura lógica, física, despliegue, seguridad y datos

Versión: v1.0
Ámbito: TAMV Online, Nodo Cero, RDM Digital, Isabella, 7 Federaciones

---

## 1. Arquitectura lógica

### 1.1 Componentes principales

- **Gateway YUN**
  - Punto único de entrada para tráfico externo.
  - Termina TLS, valida JWT, aplica rate limiting y filtros de seguridad.
  - Encaminiza solicitudes según federación y dominio.

- **Data Fabric / Orchestrator**
  - Coordina llamadas a dominios.
  - Ejecuta sagas distribuidas.
  - Aplica timeouts, reintentos, circuit breakers.
  - Publica y consume eventos.

- **Dominios**
  - Identity Domain.
  - Commerce Domain.
  - Knowledge Domain.
  - Telemetry Domain.
  - Gameplay Domain.

- **Bus de eventos**
  - Canal para eventos de negocio, salud, seguridad y federación.

- **Coordinadores de federación**
  - Servicios que gestionan el estado y las políticas de cada federación (Fed1–Fed7).

- **Servicios de Isabella**
  - Conjunto de microservicios que interpretan datos, ontologías y estados federados.

- **Sistema de gestión de secretos**
  - Servicio centralizado para manejar credenciales, claves y tokens.

### 1.2 Relaciones lógicas

- El Gateway se comunica solo con el Fabric y el sistema de identidad.
- El Fabric se comunica con:
  - Dominios (por contratos),
  - Bus de eventos,
  - Coordinadores de federación,
  - Servicios de Isabella.
- Los Dominios:
  - Se comunican con sus bases,
  - Publican eventos,
  - Responden a solicitudes del Fabric.
- El Bus de eventos:
  - Entrega mensajes a consumidores suscritos (dominios, federaciones, telemetría, Isabella).
- Telemetry:
  - Recibe eventos, logs y métricas desde todos los componentes.
- El sistema de secretos:
  - Provee credenciales a Gateway, Fabric, dominios y servicios internos.

---

## 2. Arquitectura física

### 2.1 Persistencia por dominio

- **Identity Domain**
  - Base: Supabase Postgres.
  - Uso: autenticación, perfiles, roles, badges, estado base.

- **Commerce Domain**
  - Base: Neon Postgres.
  - Uso: pagos, suscripciones, facturas, negocios, eventos de Stripe.

- **Knowledge Domain**
  - Base: Turso / libSQL.
  - Uso: foro, contribuciones territoriales, ontologías, IA.

- **Telemetry Domain**
  - Base: Cloudflare D1.
  - Uso: logs, métricas, auditoría, salud federada, seguridad.

- **Gameplay Domain**
  - Base: Upstash Redis.
  - Uso: puntos, XP, rachas, sesiones, caché.

### 2.2 Infraestructura de servicios

- **Gateway YUN**
  - Desplegado como servicio altamente disponible (mínimo dos instancias).
  - Ubicado en la frontera de red (frente a los clientes externos).

- **Data Fabric**
  - Desplegado como conjunto de servicios coordinados.
  - Capaz de escalar horizontalmente según carga de orquestación.

- **Dominios**
  - Cada dominio se despliega como uno o más servicios backend, con acceso controlado a su base.

- **Bus de eventos**
  - Cluster de mensajería confiable (ej. Kafka), con topics por dominio y federación.

- **Servicios de Isabella**
  - Desplegados como microservicios detrás del Fabric.

- **Telemetría y observabilidad**
  - Stack independiente para logs, métricas y trazas.

---

## 3. Arquitectura de despliegue

### 3.1 Estrategias de despliegue

- **Servicios críticos (Gateway, Fabric, Identity, Commerce)**
  - Rolling updates controlados.
  - Posibilidad de blue/green para cambios mayores.
  - Validación automática de salud post-deploy.

- **Servicios no críticos (Gameplay, partes de Knowledge, ciertas partes de Isabella)**
  - Rolling updates con mayor frecuencia.
  - Tiempos de degradación aceptables breves.

### 3.2 Pipelines de entrega

- Cada servicio tiene:
  - Pipeline CI/CD que:
    - Ejecuta pruebas unitarias y de integración mínimas.
    - Ejecuta checks de cumplimiento de estándares YUN (seguridad, datos, eventos).
    - Despliega sólo si los checks se cumplen.

### 3.3 Versionado de servicios

- Los servicios relevantes se versionan por contrato:
  - `/v1/*`, `/v2/*`, etc.
- Las migraciones deben:
  - Mantener compatibilidad durante ventanas definidas.
  - Documentarse en ADR.

---

## 4. Arquitectura de seguridad

### 4.1 Capa perimetral

- Gateway YUN:
  - TLS obligatorio.
  - Validación de identidad (JWT, OAuth2 donde aplique).
  - WAF básico:
    - Filtros anti-inyección.
    - Bloqueo de patrones conocidos de ataque.
  - Rate limiting por usuario, federación y origen.

### 4.2 Capa de aplicación

- Data Fabric:
  - Autorización por rol y dominio.
  - Timeouts para llamadas descendentes.
  - Circuit breakers para dominios problemáticos.

- Dominios:
  - Validan entrada en cada endpoint.
  - Usan consultas parametrizadas a sus bases.
  - Registran auditoría de operaciones sensibles.

### 4.3 Capa de datos

- Bases:
  - Principio de mínimo privilegio.
  - Cifrado en reposo donde sea necesario.
  - Auditoría de accesos y operaciones críticas.

### 4.4 Capa de secretos

- Sistema centralizado de secretos:
  - Distribuye credenciales de forma segura.
  - Rotación periódica de claves.
  - Auditoría de acceso a secretos.

### 4.5 Capa de observabilidad

- Telemetry:
  - Registra:
    - logs de seguridad,
    - métricas de errores,
    - trazas de incidentes.
  - Tiene panel de seguridad visible para el equipo responsable.

---

## 5. Arquitectura de datos

### 5.1 Dominios y sus responsabilidades

- Identity:
  - Datos de usuario, roles, reputación base, actividad.
- Commerce:
  - Datos financieros, suscripciones, facturas, pagos.
- Knowledge:
  - Contenido generado, contribuciones, ontologías.
- Telemetry:
  - Información de operación, auditoría, seguridad, salud.
- Gameplay:
  - Estado efímero de juego, puntos, rachas, sesiones.

### 5.2 Data Catalog

- Tabla `data_catalog` en Telemetry:
  - Campos:
    - `entity`
    - `domain`
    - `federation_scope`
    - `database`
    - `table_or_key`
    - `owner`
    - `purpose`
    - `retention_policy`
    - `sensitivity`
    - `encryption`

### 5.3 Replicación y cachés

- Replicación lógica:
  - Se hace mediante eventos (CDC event-driven).
- Cachés:
  - Redis y Turso se usan como caché para lecturas frecuentes.
- Regla:
  - Ningún caché puede considerarse fuente de verdad.

---

## 6. Vínculo con otros documentos YUN

- La Constitución YUN define los principios que este Blueprint debe respetar.
- El Security & Data Standard detalla los controles de seguridad para implementar esta arquitectura.
- El Data Standard define reglas adicionales sobre clasificación y tratamiento de datos.
- El Event Standard define el modelo de eventos que este Blueprint utiliza.
- El Operations Manual describe cómo operar y recuperar este diseño en producción.
