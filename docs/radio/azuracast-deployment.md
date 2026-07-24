# Guía de Despliegue: AzuraCast en Oracle Cloud (Always Free — $0)

## Resumen

| Detalle | Valor |
|---------|-------|
| **Costo** | $0/mes — Always Free Tier |
| **Instance** | VM.Standard.A1.Flex (ARM Ampere) |
| **Recursos** | 1 OCPU, 24 GB RAM (overkill para radio) |
| **Storage** | 200 GB boot volume (gratis) |
| **Telefono** | Si — necesitas número para verificar cuenta |
| **Alternativa** | App Oracle Authenticator para 2FA sin SMS |

---

## Paso 1: Crear Cuenta Oracle Cloud

1. Ve a https://cloud.oracle.com
2. Click **Sign Up** or **Create a Free Account**
3. Completa:
   - País: **Mexico**
   - Nombre
   - Email
   - Password
4. **Verificación:** Oracle necesita un número de teléfono para enviarte un código SMS
   - Si no tienes número propio, pide prestado el de un familiar/amigo
   - O usa Google Voice / TextNow (números virtuales)
5. **2FA:** Descarga la app **Oracle Authenticator** en tu celular
   - Escanea el QR code que te muestra
   - Ingresa el código de 6 dígitos
6. Click **Verify Email** → abre tu email → click en el link de verificación
7. **Select a Cloud Free Tier** → selecciona **Always Free**
8. **Payment:** Oracle pide una tarjeta de crédito/débito para verificación, pero **NUNCA te cobran** en el tier gratuito
   - Es solo para confirmar que no eres un bot
   - Si no tienes tarjeta, pide prestada una
9. Click **Start Free**

---

## Paso 2: Crear Instancia Always Free

Una vez dentro del Dashboard:

1. Click **Create a VM Instance**
2. **Name:** `tamv-radio`
3. **Image:** Ubuntu 22.04 (o la más reciente LTS)
4. **Shape:** Click **Change Shape**
   - **Category:** ARM
   - **Shape:** VM.Standard.A1.Flex
   - **OCPU:** 1
   - **RAM:** 6 GB (mínimo para AzuraCast)
   - Las demás configuraciones déjalas por defecto
5. **SSH Keys:** Sube tu SSH public key
   - Si no tienes una, genera una:
     ```bash
     ssh-keygen -t ed25519 -C "tamv-radio"
     cat ~/.ssh/id_ed25519.pub
     ```
   - Copia el contenido y pégalo en Oracle
6. **Boot Volume:** 50 GB (gratis, el mínimo es 47 GB)
7. Click **Create**

Oracle te asigna una **IP pública**. Anótala.

---

## Paso 3: Configurar Firewall (VCN)

Oracle bloquea todo el tráfico entrante por defecto. Necesitas abrir puertos:

1. En el Dashboard → **Networking** → **Virtual Cloud Networks**
2. Click en la VCN que se creó con tu instancia
3. Click en **Security Lists** (a la derecha)
4. Click en la security list por defecto
5. Click **Add Ingress Rules**

Agrega estas reglas **una por una**:

| Puerto | Protocolo | Source CIDR | Descripción |
|--------|-----------|-------------|-------------|
| 80 | TCP | 0.0.0.0/0 | HTTP (panel web) |
| 443 | TCP | 0.0.0.0/0 | HTTPS |
| 8000 | TCP | 0.0.0.0/0 | Icecast streaming |
| 8005 | TCP | 0.0.0.0/0 | HLS streaming |
| 2022 | TCP | 0.0.0.0/0 | SFTP (upload música) |
| 22 | TCP | 0.0.0.0/0 | SSH (ya debería estar abierto) |

Click **Add Ingress Rule** después de cada una.

---

## Paso 4: Conectarte al Servidor

```bash
# Desde Git Bash o terminal
ssh -i ~/.ssh/id_ed25519 ubuntu@TU_IP_PUBLICA
```

Si usaste password:
```bash
ssh ubuntu@TU_IP_PUBLICA
# Ingresa tu password
```

---

## Paso 5: Instalar AzuraCast (Un Comando)

Copia y pega este bloque completo:

```bash
sudo apt update && sudo apt upgrade -y && \
sudo mkdir -p /var/azuracast && \
cd /var/azuracast && \
curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh > docker.sh && \
chmod a+x docker.sh && \
./docker.sh install
```

El instalador te preguntará:
- **HTTP o HTTPS:** Selecciona **HTTP** (para empezar)
- **Puerto web:** Dejar en **80**
- **Nombre de la estacion:** TAMV 92.5 FM Radio Digital

Tarda ~5-10 minutos. Al terminar, te muestra:
```
AzuraCast is now running at: http://TU_IP_PUBLICA
```

---

## Paso 6: Configurar la Estación

1. Abre `http://TU_IP_PUBLICA` en el navegador
2. **Crea tu cuenta admin:**
   - Email: tu email
   - Password: la que quieras
   - **No necesitas teléfono aquí**
3. Click **Create Account**
4. Ve a **System Settings** → **Edit Station**
5. Configura:
   - **Station Name:** `TAMV 92.5 FM Radio Digital`
   - **Name:** `TAMV 92.5`
   - **Shortcode:** `tamv925`
   - **Genre:** `Radio Comunitaria / Folk / Regional`
   - **Description:** `La voz de Real del Monte, Hidalgo`
   - **URL:** `http://TU_IP_PUBLICA`
   - **Listen URL:** `http://TU_IP_PUBLICA`
6. Click **Save Changes**

---

## Paso 7: Subir Música

1. Ve a **Media** → **Music Files**
2. Click **Upload** → selecciona tus archivos MP3
3. Organiza en carpetas:
   - `/Musica Regional/` — canciones de la sierra
   - `/Jingles/` — identificadores de estación
   - `/Programas/` — segmentos grabados
   - `/Publicidad/` — comercios locales

---

## Paso 8: Crear Playlists

Ve a **Music** → **Playlists** → **Create Playlist**:

| Playlist | Mode | Contenido |
|----------|------|-----------|
| `Musica Regional` | Random | Canciones principales |
| `Jingles TAMV` | Sequential | Identificadores |
| `Programas` | Sequential | Segmentos de radio |
| `Publicidad` | Random | Anuncios de comercios |
| `Mix Mañana` | Weighted | 70% musica, 15% jingles, 15% programas |
| `Mix Tarde` | Weighted | 80% musica, 20% publicidad |
| `Mix Noche` | Weighted | 90% musica regional, 10% jingles |

Para weighted: en **Advanced**, pon los pesos manualmente.

---

## Paso 9: Configurar AutoDJ

1. Ve a **Music** → **Audio Player**
2. **Enable AutoDJ:** ON
3. **Source:** Playlists
4. En **Advanced Liquidsoap Configuration**, pega el contenido de:
   `artifacts/api-server/src/config/tamv-radio.liq`
5. Click **Save** → **Restart AutoDJ**

---

## Paso 10: Obtener API Key

1. Ve a **System Settings** → **API Keys**
2. Click **Add API Key**
3. **Name:** `RDM Digital Hub`
4. **Permissions:** Read
5. Click **Create**
6. **Guarda la API key** — la necesitas en Replit

---

## Paso 11: Verificar

Desde tu terminal local:
```bash
# Ver now-playing
curl http://TU_IP_PUBLICA/api/nowplaying/tamv925

# Escuchar stream (abre en navegador o VLC)
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

El `RadioPlayer` en App.tsx se conecta automáticamente.

---

## Mantenimiento

### Actualizar
```bash
ssh ubuntu@TU_IP_PUBLICA
cd /var/azuracast
./docker.sh update
```

### Reiniciar
```bash
cd /var/azuracast
docker compose restart
```

### Logs
```bash
docker logs -f azuracast-web
docker logs -f azuracast-liquidsoap
```

### Backup
Panel → **System Settings** → **Backups** → **Create Backup**

### Monitoreo
```bash
curl http://TU_IP_PUBLICA/api/nowplaying/tamv925 | python3 -m json.tool
```

---

## Licenciamiento Musical en Mexico

| Organización | Qué cobra | Sitio |
|-------------|-----------|-------|
| **SACM** | Derechos de autores/compositores | sacm.org.mx |
| **SOMEXFON** | Derechos de fonogramas | somexfon.com |

**Alternativa sin costo:** Creative Commons o royalty-free:
- Free Music Archive (freemusicarchive.org)
- Incompetech (incompetech.com)
- Pixabay Music (pixabay.com/music)

---

## Troubleshooting

### No puedo conectarme por SSH
- Verifica que la IP sea correcta
- Verifica que el security list tenga la regla SSH (puerto 22)
- Prueba con `ssh -v ubuntu@IP` para ver el error

### No puedo acceder al panel web
- Verifica que el security list tenga la regla HTTP (puerto 80)
- Oracle bloquea puertos por defecto — revisa VCN → Security Lists

### El stream no suena
- Verifica que Icecast esté corriendo: `docker ps`
- Prueba el stream en VLC: `http://IP:8000/tamv925`
- Verifica logs: `docker logs azuracast-liquidsoap`

### El servidor se queda sin memoria
- AzuraCast en ARM con 6GB es más que suficiente
- Si tienes problemas, sube la RAM a 8GB (sigue siendo gratis en Always Free)
