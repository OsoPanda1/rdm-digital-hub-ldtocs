# RDM Digital Hub — Quick Start

## Replit (Testing)
1. Open project in Replit
2. Set Secrets: DATABASE_URL, SUPABASE_JWT_SECRET, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
3. Run: `bash scripts/deploy-production.sh`
4. Visit your .replit.dev URL

## VPS (Production)
1. SSH into VPS
2. Run: `bash deploy/scripts/bootstrap-vps.sh`
3. Configure: `cp deploy/.env.example deploy/.env && nano deploy/.env`
4. Set DNS A records to VPS IP
5. Deploy: `sudo -u rdm-deploy bash deploy/scripts/deploy.sh --all`
