terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }

  # Backend remoto opcional (Terraform Cloud); ajusta si no lo usas
  backend "remote" {
    organization = "tamvo"

    workspaces {
      name = "rdm-live-web"
    }
  }
}

provider "vercel" {
  # Si trabajas con equipos en Vercel, puedes fijar el team_id
  # team_id = var.vercel_team_id
}
