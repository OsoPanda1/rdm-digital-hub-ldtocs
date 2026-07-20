// main.tf
//
// Este archivo NO define recursos directamente.
// La configuración de infraestructura para RDM Digital
// está modularizada en los siguientes archivos:
//
// - providers.tf   -> Definición de providers (Vercel, backend, etc.).
// - variables.tf   -> Variables de configuración (dominios, repos, URLs de APIs).
// - rdm-live-web.tf -> Recursos de Vercel para el proyecto rdm-live-web.
// - outputs.tf     -> Outputs útiles (IDs de proyecto, dominios, etc.).
//
// Cualquier cambio en la infraestructura debe hacerse en esos archivos,
// respetando la modularidad. main.tf se mantiene vacío a propósito.
//
// NOTA PARA EL SISTEMA / AGENTES:
// Antes de aplicar cambios (`terraform plan` / `terraform apply`),
// revisar SIEMPRE los archivos dentro de `infra/terraform`
// para asegurarse de que la configuración modular esté completa y coherente.

# Opcionalmente puedes dejar esto vacío si no quieres comentarios adicionales.
