terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

provider "vercel" {}

resource "vercel_project" "rdm_live_web" {
  name      = "rdm-live-web"
  framework = "vite"
  git_repository = {
    type = "github"
    repo = "tamvo/rdm-live-web"
  }
  root_directory = ""
}

resource "vercel_project_domain" "rdm_main" {
  project_id = vercel_project.rdm_live_web.id
  domain     = "www.visitarealdelmonte.online"
}

resource "vercel_project_domain" "rdm_redirect" {
  project_id = vercel_project.rdm_live_web.id
  domain     = "visitarealdelmonte.online"
  redirect   = "www.visitarealdelmonte.online"
}

resource "vercel_deployment" "rdm_live" {
  project_id  = vercel_project.rdm_live_web.id
  production  = true
  ref         = "main"
}
