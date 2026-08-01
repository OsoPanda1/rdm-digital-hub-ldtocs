# copy-audio.ps1 — Copia las canciones (MP3) a apps/rdm-hub/public/audio
# con nombres normalizados para la sección de música.
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\copy-audio.ps1

$src = "C:\Users\tamvo\Downloads"
$srcOld = "C:\Users\tamvo\Downloads\rdm-digital-hub-ldtocs-main\src\assets\musica"
$dst = "C:\Users\tamvo\Downloads\nodo-cero-isabella\apps\rdm-hub\public\audio"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

# [patrón, destino, fuente alternativa (opcional)]
$map = @(
  @("Huella en Silencio.mp3",      "huella-en-silencio.mp3",       ""),
  @("Legado (1).mp3",              "legado.mp3",                   ""),
  @("el_s*.mp3",                   "el-senalado.mp3",             ""),
  @("puro_dolor.mp3",              "puro-dolor.mp3",              ""),
  @("nueva_frecuencia.mp3",        "nueva-frecuencia.mp3",        ""),
  @("patio_detierra.mp3",          "patio-de-tierra.mp3",         ""),
  @("polvo.mp3",                   "polvo.mp3",                   ""),
  @("shooting_star.mp3",           "shooting-star.mp3",           ""),
  @("stay_whitme.mp3",             "stay-whitme.mp3",             ""),
  @("tumirada.mp3",                "tu-mirada.mp3",               ""),
  @("cada_noche.mp3",              "cada-noche.mp3",              ""),
  @("a_mimadre.mp3",               "a-mi-madre.mp3",              ""),
  @("sed_deti.mp3",                "sed-de-ti.mp3",               ""),
  @("reina_trejo.mp3",             "reina-trejo.mp3",             ""),
  @("casa-bolio.mp3",              "casa-bolio.mp3",              ""),
  @("rdm_yoteadoro.mp3",           "rdm-yoteadoro.mp3",           "rdm_yoteadoro.mp3"),
  @("rdmintro (2).mp3",            "rdm-intro.mp3",               "rdmintro (2).mp3"),
  @("Cantina*Callej*mp3",          "cantina-callejon-mashup.mp3", ""),
  @("san antonio*Mashup*.mp3",     "san-antonio-mashup.mp3",      ""),
  @("adicted_toyou*.mp3",          "adicted-to-you.mp3",          ""),
  @("yourtunes*mp3",               "glitchy-cinematic.mp3",       ""),
  @("1254808_*preview.mp3",        "mind-explorer.mp3",           ""),
  @("1543946_*.mp3",               "melodia-1543946.mp3",         "")
)

$ok = 0; $fail = 0
foreach ($pair in $map) {
  $d = Join-Path $dst $pair[1]
  if (Test-Path $d) {
    Write-Host "OK  $($pair[1]) (ya existia)"
    $ok++
    continue
  }
  $found = $null
  if ($pair[2]) {
    $alt = Join-Path $srcOld $pair[2]
    if (Test-Path $alt) { $found = $alt }
  }
  if (-not $found) {
    $hit = Get-ChildItem -Path $src -Filter $pair[0] -File -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($hit) { $found = $hit.FullName }
  }
  if ($found) {
    Copy-Item -Path $found -Destination $d -Force
    Write-Host "OK  $($pair[1])"
    $ok++
  } else {
    Write-Host "MISS $($pair[0])"
    $fail++
  }
}

Write-Host "`nCanciones copiadas: $ok, faltantes: $fail. Destino: $dst"
