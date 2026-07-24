# Guía de Despliegue: AzuraCast en DigitalOcean

## Por qué AzuraCast reemplaza a Caster.fm

| Caster.fm (antes) | AzuraCast (ahora) |
|-------------------|-------------------|
| Laptop encendida 24/7 | DigitalOcean droplet 24/7 |
| $0 pero quema electricidad | ~$12/mes (Basic 2GB) |
| Sin AutoDJ | Liquidsoap AutoDJ incluido |
| 400 listeners max | Ilimitados |
| 96 Kbps max | 320 Kbps+ |
| API limitada | 250+ endpoints REST |
| Sin control total | 100% soberano |

---

## Paso 1: Crear el Droplet

1. Entra a https://cloud.digitalocean.com → **Create** → **Droplets**
2. **Image:** Ubuntu 24.04 LTS
3. **Plan:** Basic → **Regular Intel** → **$12/mes** (2 GB RAM, 1 vCPU, 50 GB SSD)
   - AzuraCast necesita minimo 2 GB RAM
   - 2GB es suficiente para ~200 listeners simultaneos
4. **Region:**选择 la mas cercana a Mexico (NYC3 o SFO3)
5. **Authentication:** SSH Keys (recomendado) o Password
6. **Hostname:** `tamv-radio`
7. Click **Create Droplet**

Anota la **IP publica** que DigitalOcean te asigna.

---

## Paso 2: Abrir Puertos (Firewall)

En DigitalOcean → **Networking** → **Firewalls** → Create Firewall:

1. **Name:** `azuracast`
2. **Inbound Rules** — agregar:

| Tipo | Protocolo | Puerto | Rango | Fuente |
|------|-----------|--------|-------|--------|
| Custom | TCP | 80 | 0.0.0.0/0, ::/0 | Anywhere |
| Custom | TCP | 443 | 0.0.0.0/0, ::/0 | Anywhere |
| Custom | TCP | 8000 | 0.0.0.0/0, ::/0 | Anywhere |
| Custom | TCP | 8005 | 0.0.0.0/0, ::/0 | Anywhere |
| Custom | TCP | 2022 | 0.0.0.0/0, ::/0 | Anywhere |
| SSH | TCP | 22 | 0.0.0.0/0, ::/0 | Anywhere |

3. En **Droplets**, selecciona tu droplet `tamv-radio`
4. Click **Save Firewall**

---

## Paso 3: Conectar al Droplet

```bash
# Desde tu terminal (Git Bash, PowerShell, o terminal de Mac/Linux)
ssh root@TU_IP_PUBLICA
```

Si usaste SSH keys, asegurate de que la private key esta en `~/.ssh/`.

---

## Paso 4: Actualizar el sistema

```bash
apt update && apt upgrade -y
```

---

## Paso 5: Instalar AzuraCast

```bash
# Crear directorio
mkdir -p /var/azuracast
cd /var/azuracast

# Descargar e instalar
curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh > docker.sh
chmod a+x docker.sh
./docker.sh install
```

El instalador te preguntara:
- **HTTP o HTTPS:** Elige **HTTP** (para empezar, luego puedes agregar SSL con Let's Encrypt)
- **Puerto web:** Dejar en **80**
- **Nombre de la estacion:** `TAMV 92.5 FM Radio Digital`

El instalador descarga Docker, docker-compose, y levanta todos los contenedores. Toma ~5 minutos.

Al terminar, te muestra la URL de acceso al panel:
```
http://TU_IP_PUBLICA
```

---

## Paso 6: Configurar AzuraCast

1. Abre `http://TU_IP_PUBLICA` en el navegador
2. Crea tu cuenta admin:
   - **Email:** tu email
   - **Password:** la que quieras
   - **NO necesitas telefono**
3. Ve a **System Settings** → **Edit Station**
4. Configura:
   - **Station Name:** `TAMV 92.5 FM Radio Digital`
   - **Name:** `TAMV 92.5`
   - **Shortcode:** `tamv925`
   - **Genre:** `Radio Comunitaria / Folk / Regional`
   - **Description:** `La voz de Real del Monte, Hidalgo`
   - **URL:** `https://tusitio.com` (o la IP por ahora)
   - **Listen URL:** `http://TU_IP_PUBLICA`
5. Click **Save Changes**

---

## Paso 7: Subir Musica

1. Ve a **Media** → **Music Files**
2. Click **Upload** y sube tus archivos MP3
3. Organiza en carpetas:
   - `/Musica Regional/` — canciones de la sierra
   - `/Jingles/` — identificadores de estacion
   - `/Programas/` — segmentos grabados
   - `/Publicidad/` — comercios locales

---

## Paso 8: Crear Playlists

1. Ve a **Music** → **Playlists**
2. Crea estas playlists:

| Playlist | Modo | Contenido |
|----------|------|-----------|
| **Musica Regional** | Random | Canciones principales |
| **Jingles TAMV** | Sequential | Identificadores |
| **Programas** | Sequential | Segmentos de radio |
| **Publicidad** | Random | Anuncios de comercios |
| **Mix Mañana** | Weighted | 70% musica, 15% jingles, 15% programas |
| **Mix Tarde** | Weighted | 80% musica, 20% publicidad |
| **Mix Noche** | Weighted | 90% musica regional, 10% jingles |

---

## Paso 9: Configurar AutoDJ

1. Ve a **Music** → **Audio Player** (o **AutoDJ**)
2. **Enable AutoDJ:** ON
3. **Source:** Playlists
4. En **Advanced Liquidsoap Configuration**, pega el script de:
   `artifacts/api-server/src/config/tamv-radio.liq`
5. Click **Save** y **Restart AutoDJ**

---

## Paso 10: Obtener API Key

1. Ve a **System Settings** → **API Keys**
2. Click **Add API Key**
3. **Name:** `RDM Digital Hub`
4. **Permissions:** Read (now-playing, listeners, playlists)
5. Click **Create**
6. **Guarda la API key** — la necesitas en Replit

---

## Paso 11: Verificar que funciona

```bash
# Desde tu terminal local:
curl http://TU_IP_PUBLICA/api/nowplaying/tamv925
```

Deberias ver JSON con la cancion actual, oyentes, etc.

Tambien puedes escuchar el stream en:
```
http://TU_IP_PUBLICA/listen/tamv925
```

---

## Paso 12: Conectar con RDM Digital Hub

En Replit → Secrets, agrega:

```
AZURACAST_URL=http://TU_IP_PUBLICA
AZURACAST_API_KEY=tu-api-key-del-paso-10
AZURACAST_STATION=tamv925
```

El `RadioPlayer` en App.tsx ya esta configurado para conectarse automaticamente.

---

## Mantenimiento

### Actualizar AzuraCast
```bash
ssh root@TU_IP_PUBLICA
cd /var/azuracast
./docker.sh update
```

### Reiniciar
```bash
cd /var/azuracast
docker compose restart
```

### Ver logs
```bash
docker logs -f azuracast-web
docker logs -f azuracast-liquidsoap
```

### Backup
En el panel: **System Settings** → **Backups** → **Create Backup**
Se descarga un .zip con toda la config y musica.

### Monitoreo de oyentes
```bash
curl http://TU_IP_PUBLICA/api/nowplaying/tamv925 | python3 -m json.tool
```

---

## Licenciamiento musical en Mexico

Para radio comunitaria, registra tu estacion con:

| Organizacion | Que cobra | Sitio web |
|-------------|-----------|-----------|
| **SACM** | Derechos de autores/compositores | sacm.org.mx |
| **SOMEXFON** | Derechos de fonogramas | somexfon.com |

**Alternativa sin costo:** Musica con licencia Creative Commons o royalty-free:
- Free Music Archive (freemusicarchive.org)
- Incompetech (incompetech.com)
- Pixabay Music (pixabay.com/music)

AzuraCast genera reportes automaticos de reproduccion para cumplir con SACM/SOMEXFON.
