output "vercel_project_id" {
  description = "ID del proyecto rdm-live-web en Vercel"
  value       = vercel_project.rdm_live_web.id
}

output "vercel_project_inspector_url" {
  description = "URL de inspección del proyecto en Vercel"
  value       = "https://vercel.com/${vercel_project.rdm_live_web.id}"
}

output "primary_domain" {
  description = "Dominio principal del proyecto"
  value       = vercel_project_domain.rdm_main_www.domain
}
