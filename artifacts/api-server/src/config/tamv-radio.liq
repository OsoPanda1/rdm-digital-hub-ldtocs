#!/usr/bin/liquidsoap
# ============================================================
# TAMV 92.5 FM — Radio Digital Automatizada
# RDM Digital Hub — Liquidsoap Configuration
# ============================================================
# Este script se configura en AzuraCast:
#   Station → AutoDJ → Advanced Liquidsoap Configuration
#
# Requiere:
#   - Directorio de musica: ~/radio/music/
#   - Directorio de jingles: ~/radio/jingles/
#   - Directorio de programas: ~/radio/programs/
#   - Icecast corriendo en puerto 8000
# ============================================================

# ── Configuracion del servidor ──────────────────────────────
log.file.path := "/var/azuracast/logs/liquidsoap.log"
log.stdout := true
settings.server.telnet := true
settings.server.telnet.port := 1234

# ── Fuentes de audio ────────────────────────────────────────

# Musica general — rotacion principal
music = playlist(
  mode="randomize",
  reload=300,
  "/var/azuracast/stations/tamv925/media/music.m3u"
)

# Jingles — identificadores de estacion
jingles = playlist(
  mode="randomize",
  reload=600,
  "/var/azuracast/stations/tamv925/media/jingles.m3u"
)

# Programas grabados — segmentos de horas pico
programs = playlist(
  mode="randomize",
  reload=300,
  "/var/azuracast/stations/tamv925/media/programs.m3u"
)

# Noticias locales — boletines informativos
news = playlist(
  mode="sequential",
  reload=60,
  "/var/azuracast/stations/tamv925/media/news.m3u"
)

# Publicidad local — comercios de Real del Monte
ads = playlist(
  mode="randomize",
  reload=300,
  "/var/azuracast/stations/tamv925/media/ads.m3u"
)

# Seguridad — audio por defecto si todo falla
security = single("/var/azuracast/stations/tamv925/media/security.ogg")

# ── Programacion por horario (Dayparts) ─────────────────────

# Mañana (6am - 12pm): Programas + Musica
morning = rotate(weights=[1, 3], [programs, music])

# Tarde (12pm - 6pm): Musica + Publicidad
afternoon = rotate(weights=[1, 4], [ads, music])

# Noche (6pm - 10pm): Musica regional + Jingles
evening = rotate(weights=[1, 5], [jingles, music])

# Madrugada (10pm - 6am): Musica continua
night = music

# ── Switch de horarios ──────────────────────────────────────

daypart_radio = switch([
  ({6h-12h}, morning),
  ({12h-18h}, afternoon),
  ({18h-22h}, evening),
  ({22h-6h}, night)
])

# ── Insercion de jingles ────────────────────────────────────

# Jingle cada ~5 canciones
radio = random(weights=[1, 5], [jingles, daypart_radio])

# Jingle de hora en punto
clock = single("/var/azuracast/stations/tamv925/media/clock.ogg")
radio = add([radio, switch([({0m-3m}, clock)])])

# Noticias cada 30 minutos
radio = add([radio, switch([
  ({0m-2m}, news),
  ({30m-32m}, news)
])])

# ── Seguridad y fallback ────────────────────────────────────

radio = fallback(track_sensitive=false, [radio, security])
radio = mksafe(radio)

# ── Entrada de DJ en vivo (override) ────────────────────────

# DJ se conecta via: http://TU_SERVER:8080/live
# Password: hackme (cambiar en AzuraCast)
settings.harbor.bind_addrs := ["0.0.0.0"]
live = input.harbor("live", port=8080, password="hackme")

# Cuando el DJ se conecta, toma prioridad automaticamente
full = fallback(track_sensitive=false, [live, radio])

# ── Salida a Icecast ────────────────────────────────────────

# MP3 128kbps (compatibilidad maxima)
output.icecast(
  %mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost",
  port=8000,
  password="hackme",
  mount="tamv925",
  name="TAMV 92.5 FM — Radio Digital",
  description="La voz de Real del Monte, Hidalgo",
  genre="Radio Comunitaria",
  url="http://radio.tamv.com.mx",
  full
)

# OGG Vorbis (calidad superior)
output.icecast(
  %vorbis(quality=0.5),
  host="localhost",
  port=8000,
  password="hackme",
  mount="tamv925.ogg",
  name="TAMV 92.5 FM — Radio Digital",
  description="La voz de Real del Monte, Hidalgo",
  genre="Radio Comunitaria",
  url="http://radio.tamv.com.mx",
  radio
)
