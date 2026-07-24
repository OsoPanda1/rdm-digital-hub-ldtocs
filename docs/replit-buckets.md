# Replit Buckets — Estructura de Almacenamiento

## Buckets Públicos

Buckets con acceso público para assets estáticos del proyecto.

### `rdm-public`
Contenido: imágenes, videos, logos, audio, documentos públicos.

```
rdm-public/
├── images/
│   ├── logos/
│   │   ├── logotamv.jpg              # Logo TAMV Online Network
│   │   ├── logo-rdm-digital.png      # Logo RDM Digital Hub
│   │   └── isabella-ai-logo.png      # Logo Isabella Villaseñor AI
│   ├── heroes/
│   │   ├── hero-realmont.jpg
│   │   ├── hero-aerial.jpg
│   │   └── hero-real-del-monte.webp
│   ├── places/
│   │   ├── calles-colonial.webp
│   │   ├── panteon-ingles.webp
│   │   ├── mina-acosta.webp
│   │   └── penas-cargadas.webp
│   ├── food/
│   │   ├── pastes-food.jpg
│   │   ├── gastronomia-pastes.jpg
│   │   └── paste.webp
│   └── realitos/
│       ├── realito-gastro.png
│       ├── realito-arte.png
│       └── realito-historia.png
├── videos/
│   ├── hero-real-del-monte.mp4       # Video hero homepage
│   ├── cultura-tradiciones.mp4        # Video cultura
│   ├── historia-minera.mp4            # Video historia
│   ├── gastronomia-pastes.mp4         # Video gastronomía
│   ├── musica-sonidos.mp4             # Video música
│   ├── ecoturismo-sierra.mp4          # Video ecoturismo
│   └── radio-tamv-925.mp4             # Video radio
├── audio/
│   ├── isabella-intro.mp3             # Intro de Isabella
│   └── tamv-jingle.mp3               # Jingle de la estación
└── docs/
    └── tamv-radio-liq.md              # Config Liquidsoap
```

### `rdm-thumbs`
Contenido: thumbnails de YouTube para lazy-loading de videos.

```
rdm-thumbs/
├── video-placeholder.jpg              # Placeholder antes de cargar video
└── tamv-radio-placeholder.png         # Placeholder para RadioPlayer
```

## Buckets Privados

Buckets con acceso solo autenticado (admin/API).

### `rdm-admin`
Contenido: datos de administración, backups, configuraciones sensibles.

```
rdm-admin/
├── backups/
│   └── azuracast-config-backup.zip    # Backup de configuración AzuraCast
├── exports/
│   └── listener-stats.csv             # Estadísticas de oyentes
└── configs/
    └── liquidsoap-custom.liq          # Config Liquidsoap personalizada
```

### `rdm-uploads`
Contenido: archivos subidos por usuarios y comercios.

```
rdm-uploads/
├── businesses/
│   └── {business-id}/
│       ├── logo.png
│       ├── photos/
│       └── menu.pdf
├── users/
│   └── {user-id}/
│       └── avatar.jpg
└── episodes/
    └── {episode-id}/
        └── audio.mp3
```

## URLs de Acceso

| Bucket | URL pública | Uso |
|--------|-------------|-----|
| `rdm-public` | `https://TU-REPLIX.replit.dev/images/...` | Imágenes del sitio |
| `rdm-thumbs` | `https://TU-REPLIX.replit.dev/thumbs/...` | Thumbnails |
| `rdm-admin` | Solo via API `/api/admin/...` | Datos admin |
| `rdm-uploads` | Solo via API con auth `/api/uploads/...` | User uploads |

## Configuración en Replit

1. Ve a Replit → Storage (en el panel lateral)
2. Crea los 4 buckets: `rdm-public`, `rdm-thumbs`, `rdm-admin`, `rdm-uploads`
3. Configura permisos:
   - `rdm-public`: **Public read**
   - `rdm-thumbs`: **Public read**
   - `rdm-admin`: **Private** (solo service role)
   - `rdm-uploads`: **Private** (lectura con auth)
4. Agrega las URLs a los env vars de Replit:
   ```
   VITE_PUBLIC_BUCKET_URL=https://TU-REPLIX.replit.dev/rdm-public
   VITE_UPLOADS_BUCKET_URL=https://TU-REPLIX.replit.dev/rdm-uploads
   ```
