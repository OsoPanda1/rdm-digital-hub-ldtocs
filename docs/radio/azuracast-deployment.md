# Guía de Despliegue: AzuraCast para TAMV 92.5 FM

## Por qué AzuraCast reemplaza a Caster.fm

| Aspecto | Caster.fm (actual) | AzuraCast (nuevo) |
|---------|-------------------|-------------------|
| **Costo** | Laptop encendida 24/7 + electricidad | $0 (Oracle Free Tier) o $5/mes VPS |
| **Laptop** | Requerida — se degrada con el tiempo | No requerida — todo en la nube |
| **AutoDJ** | No incluido en plan gratuito | Incluido — Liquidsoap integrado |
| **Telefono** | Oracle pide numero telefonico | No requiere registro — auto-hospedado |
| **Listeners** | 400 max (gratis) | Ilimitados |
| **Bitrate** | 96 Kbps max | 320 Kbps+ |
| **API** | Limitada | 250+ endpoints REST |
| **Control** | Depende de su servidor | 100% soberano — tus datos, tu servidor |

---

## Opción 1: Oracle Cloud Always Free Tier (RECOMENDADO — $0)

### Paso 1: Crear cuenta Oracle Cloud

1. Ve a https://cloud.oracle.com
2. Registra una cuenta (email + contraseña)
3. **NO necesitas numero telefonico** — usa la app Oracle Authenticator para verificacion
4. Selecciona "Always Free" al crear la instancia

### Paso 2: Crear instancia ARM

1. Dashboard → Create Instance
2. **Image:** Ubuntu 22.04 (or latest LTS)
3. **Shape:** VM.Standard.A1.Flex (ARM Ampere)
   - 1 OCPU, 6 GB RAM (suficiente para AzuraCast)
4. **Storage:** 50 GB boot volume
5. **Networking:** Create new VCN with internet access

### Paso 3: Abrir puertos (CRITICO)

Oracle bloquea todo el trafico entrante por defecto. En VCN → Security Lists → Add Ingress Rules:

| Puerto | Protocolo | Proposito |
|--------|-----------|-----------|
| 80 | TCP | HTTP (web UI) |
| 443 | TCP | HTTPS |
| 8000 | TCP | Streaming (Icecast) |
| 8005 | TCP | HLS |
| 2022 | TCP | SFTP (upload de musica) |

### Paso 4: Instalar AzuraCast

```bash
# SSH into tu instancia
ssh ubuntu@TU_IP_PUBLICA

# Instalar AzuraCast
sudo mkdir -p /var/azuracast
cd /var/azuracast
curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh > docker.sh
chmod a+x docker.sh
./docker.sh install
```

El instalador:
- Instala Docker y Docker Compose
- Descarga la imagen AzuraCast
- Configura Nginx, MariaDB, Redis, Liquidsoap, Icecast
- Te da la URL de acceso al panel web

### Paso 5: Configurar la estacion

1. Abre `http://TU_IP_PUBLICA` en el navegador
2. Crea tu cuenta admin (email + password — NO telefono)
3. Create Station → "TAMV 92.5 FM Radio Digital"
4. Configura:
   - **Shortcode:** `tamv925`
   - **Port:** 8000
   - **Stream Type:** Icecast
   - **Genre:** Radio Comunitaria / Folk / Local
   - **Description:** "La voz de Real del Monte"

### Paso 6: Subir musica

1. Ve a Media → Upload
2. Sube los archivos MP3 de musica regional
3. Crea playlists:
   - "Musica Regional" — canciones de la sierra
   - "Jingles TAMV" — identificadores de estacion
   - "Programas" — segmentos grabados
4. Configura AutoDJ con las playlists

### Paso 7: Obtener API Key

1. Settings → API Keys → Create New Key
2. Guarda la key — la necesitas para integrar con RDM Digital Hub
3. La URL de tu estacion sera: `http://TU_IP_PUBLICA`

---

## Opción 2: VPS de pago ($5-12/mes)

### Recomendaciones por proveedor

| Proveedor | Plan | RAM | Precio | Notas |
|-----------|------|-----|--------|-------|
| **Hetzner** | CX22 | 4 GB | ~$5/mes | Mejor relacion precio/calidad |
| **Contabo** | VPS S | 4 GB | ~$6/mes | Buena opcion economy |
| **DigitalOcean** | Basic | 2 GB | $12/mes | Facil de escalar |
| **Vultr** | Regular | 2 GB | $6/mes | Buenos DCs en LATAM |

### Instalacion

```bash
# SSH into tu VPS
ssh root@TU_IP

# Instalar AzuraCast (igual que Oracle)
sudo mkdir -p /var/azuracast
cd /var/azuracast
curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh > docker.sh
chmod a+x docker.sh
./docker.sh install
```

---

## Script Liquidsoap para TAMV 92.5

AzuraCast usa Liquidsoap internamente para AutoDJ. Puedes personalizar el script en:

**Panel de AzuraCast → Station → AutoDJ → Advanced Liquidsoap Configuration**

Ver el script completo en: `artifacts/api-server/src/config/tamv-radio.liq`

---

## Integracion con RDM Digital Hub

### URL del stream
```
http://TU_AZURACAST:8000/tamv925
```

### API de now-playing
```
GET http://TU_AZURACAST/api/nowplaying/tamv925
```

### Player embebido (React)
Ver: `artifacts/rdm-hub/src/components/rdm/RadioPlayer.tsx`

### API del backend
Ver: `artifacts/api-server/src/routes/radio.ts`

---

## Mantenimiento

### Actualizar AzuraCast
```bash
cd /var/azuracast
./docker.sh update
```

### Backup
```bash
# AzuraCast tiene backup integrado en el panel
# Settings → Backups → Create Backup
```

### Monitoreo
```bash
# Verificar estado
docker ps
docker logs azuracast

# Metricas de oyentes
curl http://TU_IP:8000/api/nowplaying/tamv925
```

---

## Licenciamiento musical en Mexico

Para radio comunitaria en Mexico, necesitas registrarte con:

| Organizacion | Que cobra | Sitio web |
|-------------|-----------|-----------|
| **SACM** | Derechos de autores/compositores | sacm.org.mx |
| **SOMEXFON** | Derechos de fonogramas | somexfon.com |
| **ANDI** | Derechos de interpretes | andi.org.mx |

**Alternativa sin costo:** Usar musica con licencia Creative Commons o royalty-free.
- Free Music Archive (freemusicarchive.org)
- Incompetech (incompetech.com)
- Pixabay Music (pixabay.com/music)

AzuraCast genera reportes automaticos de reproduccion para cumplir con SACM/SOMEXFON.
