variable "vercel_team_id" {
  description = "Team ID de Vercel (opcional, si usas equipos)"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Nombre del proyecto en Vercel"
  type        = string
  default     = "rdm-live-web"
}

variable "github_repo" {
  description = "Repositorio GitHub (org/repo)"
  type        = string
  default     = "tamvo/rdm-live-web"
}

variable "root_directory" {
  description = "Directorio raíz del proyecto dentro del repo"
  type        = string
  default     = "" # Cambia a 'apps/rdm-live-web' si luego usas monorepo
}

variable "primary_domain" {
  description = "Dominio principal con www"
  type        = string
  default     = "www.visitarealdelmonte.online"
}

variable "root_domain" {
  description = "Dominio raíz sin www (se redirige al principal)"
  type        = string
  default     = "visitarealdelmonte.online"
}

variable "api_base_url" {
  description = "Base URL del API principal de RDM"
  type        = string
  default     = "https://api.rdm-digital.com"
}

variable "gamer_api_url" {
  description = "Base URL del Kernel GAMER"
  type        = string
  default     = "https://api.rdm-digital.com/gamification"
}

variable "supabase_url" {
  description = "URL del proyecto Supabase"
  type        = string
}

variable "supabase_anon_key" {
  description = "Anon key de Supabase para el frontend"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Nombre del entorno (ej. production, staging)"
  type        = string
  default     = "production"
}
