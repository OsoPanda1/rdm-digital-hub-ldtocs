# TAMV‑PRCL v1.0 — Contrato de Licencia Privada y Secreto Industrial

**Parte integrante del RFC-0001 / Ecosistema TAMV Online Network™**

---

## 1. Partes

**Licenciante:** RDM Digital Hub / TAMV Online Network, con domicilio en Mineral del Monte, Hidalgo, México.  
**Licenciatario:** [Nombre completo / Razón social], con domicilio en [_____].

## 2. Objeto

El Licenciante otorga al Licenciatario una licencia limitada, no exclusiva, intransferible, revocable y condicionada a confidencialidad para el uso interno de los Materiales identificados en el Anexo A, exclusivamente en los términos de este contrato.

## 3. Permisos

El Licenciatario podrá:
- Instalar y ejecutar los Materiales en entornos internos expresamente autorizados.
- Realizar pruebas, auditorías técnicas y evaluaciones de seguridad únicamente con autorización previa y bajo NDA.
- Usar la documentación asociada en la medida permitida por las licencias específicas aplicables.

## 4. Prohibiciones expresas

Salvo autorización escrita y firmada por el Licenciante, el Licenciatario no podrá:
- Reproducir, distribuir, sublicenciar, ceder, arrendar, transferir o publicar los Materiales.
- Realizar ingeniería inversa, descompilar, desensamblar o reconstruir arquitecturas.
- Extraer pesos, checkpoints, embeddings, prompts internos, memoria estructurada o cualquier elemento susceptible de reidentificación del modelo.
- Utilizar Información Confidencial para entrenar modelos externos, crear productos competidores, patentar invenciones bloqueantes o desarrollar clones funcionales.
- Exponer, vender, minar, perfilar o transferir datos territoriales o personales sin consentimiento atómico, informado y verificable.
- Desplegar los componentes en contextos de pornografía, erotización, manipulación política, guerra psicológica o vigilancia masiva opresiva.

## 5. Confidencialidad y secreto industrial

El Licenciatario reconoce que los Materiales e Información Confidencial constituyen un activo estratégico y, cuando proceda, secreto industrial. Se obliga a mantenerlos bajo custodia reforzada, con acceso restringido por necesidad de conocimiento, y con medidas no inferiores a:
- HSM o KMS para claves maestras.
- Cifrado en tránsito y en reposo.
- Autenticación multifactor.
- Registro de accesos.
- Segregación de entornos.
- Control de copia y exportación.

## 6. Excepciones limitadas

No se considerará Información Confidencial la que:
- Sea de dominio público sin violación de este contrato.
- Haya sido conocida legítimamente por el Licenciatario antes de su revelación y pueda demostrarse.
- Sea recibida de un tercero sin deber de confidencialidad.
- Deba divulgarse por mandato legal.

## 7. Medidas técnicas obligatorias

El Licenciatario deberá implementar y mantener, como mínimo:
- HSM/KMS local o equivalente para claves maestras.
- BYOK/HYOK para datos sensibles y telemetría territorial.
- Cifrado post‑cuántico en rutas críticas cuando sea técnicamente viable y verificable.
- Firmado de artefactos: binarios, contenedores y modelos deben verificarse mediante firma digital antes de ejecución.
- RLS en bases de datos geoespaciales y partición por territorio.
- Watermarking y fingerprinting de modelos y outputs para detección forense.
- Registro inmutable de integridad mediante hashes firmados.

## 8. Auditoría

El Licenciante tendrá derecho a auditorías técnicas y de cumplimiento, anuales o por causa justificada, con previo aviso razonable y bajo condiciones de confidencialidad reforzada.

## 9. Revocación técnica

El Licenciante podrá revocar credenciales, certificados, tokens y permisos de sincronización ante violación grave o evidencia razonable de uso indebido, mediante mecanismos como push revocation, CRL/OCSP y bloqueo de FederationBus.

## 10. Remedios e indemnización

En caso de incumplimiento doloso comprobado, el Licenciatario deberá:
- Cesar el uso.
- Destruir o devolver copias conforme a instrucción escrita.
- Pagar una indemnización convencional mínima de USD $1,000,000.00 o el 100% de las utilidades brutas derivadas del uso ilícito, lo que resulte mayor.
- Cubrir costas, honorarios y demás daños demostrables.
- Someterse a medidas cautelares y acciones civiles o penales cuando proceda.

## 11. Ley aplicable y jurisdicción

Este contrato se regirá por las leyes de los Estados Unidos Mexicanos. La jurisdicción primaria corresponderá a los tribunales competentes del Estado de Hidalgo.

## 12. Integridad, cesión y nulidad parcial

Este contrato constituye el acuerdo íntegro entre las partes sobre su objeto. Toda cesión requerirá consentimiento escrito del Licenciante. La nulidad parcial de una cláusula no afectará la vigencia de las demás.

---

*Para el texto completo con contexto y definiciones, ver [RFC-0001-MANIFEST.md](./RFC-0001-MANIFEST.md#5-tamvprcl-v10--contrato-de-licencia-privada-y-secreto-industrial)*
