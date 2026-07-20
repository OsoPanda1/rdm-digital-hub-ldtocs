export VERCEL_API_TOKEN="TU_TOKEN_DE_VERCEL"

cat > infra/terraform/rdm-live-web.auto.tfvars <<EOF
supabase_url      = "https://xxxxx.supabase.co"
supabase_anon_key = "TU_ANON_KEY"
api_base_url      = "https://api.rdm-digital.com"
gamer_api_url     = "https://api.rdm-digital.com/gamification"
EOF
