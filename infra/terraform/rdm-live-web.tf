locals {
  project_name = var.project_name
  repo_name    = var.github_repo
}

resource "vercel_project" "rdm_live_web" {
  name      = local.project_name
  framework = "vite"

  git_repository = {
    type = "github"
    repo = local.repo_name
  }

  root_directory = var.root_directory

  # Variables de entorno para producción y preview
  env = [
    {
      key    = "VITE_API_BASE_URL"
      value  = var.api_base_url
      target = ["production", "preview"]
    },
    {
      key    = "VITE_GAMER_API_URL"
      value  = var.gamer_api_url
      target = ["production", "preview"]
    },
    {
      key    = "VITE_SUPABASE_URL"
      value  = var.supabase_url
      target = ["production", "preview"]
    },
    {
      key    = "VITE_SUPABASE_ANON_KEY"
      value  = var.supabase_anon_key
      target = ["production", "preview"]
    },
    {
      key    = "VITE_ENV"
      value  = var.environment
      target = ["production", "preview"]
    }
  ]

  # Si quieres variables sólo para preview o development, puedes añadir:
  # preview_environment_variables = [...]
}

resource "vercel_project_domain" "rdm_main_www" {
  project_id = vercel_project.rdm_live_web.id
  domain     = var.primary_domain
}

resource "vercel_project_domain" "rdm_main_root_redirect" {
  project_id = vercel_project.rdm_live_web.id
  domain     = var.root_domain
  redirect   = var.primary_domain
}

resource "vercel_deployment" "rdm_live_prod" {
  project_id = vercel_project.rdm_live_web.id
  production = true
  ref        = "main"

  depends_on = [
    vercel_project_domain.rdm_main_www,
    vercel_project_domain.rdm_main_root_redirect
  ]
}
