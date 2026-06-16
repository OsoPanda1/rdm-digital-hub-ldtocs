# Real del Monte Digital Hub — Guía Turística Territorial

## 📖 Visión
Real del Monte Digital Hub es una plataforma territorial soberana que integra turismo, cultura, gastronomía, historia minera y economía digital en un solo ecosistema. Su propósito es inscribir la memoria viva del Pueblo Mágico de Real del Monte en una infraestructura tecnológica accesible, inmersiva y federada.

## 🌐 Alcances
- **Primer plano (Turismo y Cultura):**
  - Historia minera y patrimonio cultural
  - Gastronomía (pastes y cocina local)
  - Arte y artesanías en plata
  - Ecoturismo y naturaleza
  - Mitos, leyendas y dichos mineros
  - Comercios locales y mapa turístico interactivo
  - Eventos culturales y recomendaciones

- **Segundo plano (Interacción y Economía):**
  - Foros y muros turísticos
  - Tienda de artículos y gamificación
  - Música y panel multimedia
  - Perfiles de usuarios y comercios
  - Membresías de pago y reservas
  - Calificaciones y reseñas de negocios

- **Tercer plano (Institucional y Soporte):**
  - Ajustes y configuración
  - Preguntas frecuentes
  - Quiénes somos y contacto
  - Buzón de sugerencias

- **Último plano (Tecnología y Documentación):**
  - Arquitectura territorial
  - Gobernanza de datos
  - Seguridad y privacidad
  - Documentación técnica y académica

## 🛠️ Arquitectura
- **Frontend:** React + Vite + Framer Motion
- **Backend:** Supabase (auth, storage, SQL migrations)
- **Infraestructura IA:** servicios `ai-core` y `economy` para regulación territorial
- **Kernel:** `tamv-kernel` y `core-kernel` como bibliotecas independientes
- **Orquestador:** `experience.orchestrator.ts` motor de experiencias inmersivas
- **Mapa Interactivo:** SVG accesible con navegación por teclado y ARIA roles

## 🚀 Estado del Proyecto
- **Seguridad:** 78/100 — Supabase moderno, TS estricto. Pendiente WAF, SIEM, IDS.
- **DevOps:** 68/100 — CI básico, falta CD empresarial, blue-green deployment.
- **Testing:** 61/100 — Base inicial, requiere ampliar Unit, Integration, Contract, Load y Chaos tests.
- **Documentación:** 52/100 — Debilidad crítica. README.md vacío sustituido por este documento.

## 📋 Checklist Crítico
1. **README.md** — Documentación raíz (corregido aquí).
2. **package.json** — Añadir scripts enterprise y auditorías de seguridad.
3. **.github/workflows/ci.yml** — Integrar SAST, DAST, Dependabot, Coverage Gates.
4. **SECURITY.md** — Ampliar con CVE Policy y Responsible Disclosure.
5. **PRIVACY.md** — Alinear con GDPR, LGPD, LFPDPPP México.
6. **DATA-POLICY.md** — Convertir en marco de gobernanza territorial.
7. **src/App.tsx** — Modularizar responsabilidades.
8. **src/lib/tamv-kernel.ts** — Evolucionar a biblioteca independiente.
9. **src/orchestrator/experience.orchestrator.ts** — Pruebas masivas y telemetría.
10. **services/ai-core/** — Blindaje y observabilidad reforzada.

*(Ver auditoría completa para los 25 archivos críticos.)*

## 📈 Próximos Pasos
- Definir juegos prioritarios para visualización y HUD.
- Corregir imágenes faltantes en CinematicIntro.
- Consolidar módulos de `territory-heart` y `rdm-livos` sin romper la build.
- Expandir documentación académica y marketing institucional.

## 📜 Licencia
Este proyecto se inscribe como infraestructura cultural y territorial. Licencia abierta bajo términos de gobernanza comunitaria y académica (definir en LICENSE).

---
