# copy-audio.ps1 — Copia las canciones (MP3) desde Descargas a apps/rdm-hub/public/audio
# con nombres normalizados para la sección de música.
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\copy-audio.ps1

$src = "C:\Users\tamvo\Downloads"
$dst = "C:\Users\tamvo\Downloads\nodo-cero-isabella\apps\rdm-hub\public\audio"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

$map = @(
  @("Huella en Silencio.mp3",                          "huella-en-silencio.mp3"),
  @("Legado (1).mp3",                                  "legado.mp3"),
  @("el_señalado.mp3",                                 "el-senalado.mp3"),
  @("puro_dolor.mp3",                                  "puro-dolor.mp3"),
  @("nueva_frecuencia.mp3",                            "nueva-frecuencia.mp3"),
  @("patio_detierra.mp3",                              "patio-de-tierra.mp3"),
  @("polvo.mp3",                                       "polvo.mp3"),
  @("shooting_star.mp3",                               "shooting-star.mp3"),
  @("stay_whitme.mp3",                                 "stay-whitme.mp3"),
  @("tumirada.mp3",                                    "tu-mirada.mp3"),
  @("cada_noche.mp3",                                  "cada-noche.mp3"),
  @("a_mimadre.mp3",                                   "a-mi-madre.mp3"),
  @("sed_deti.mp3",                                    "sed-de-ti.mp3"),
  @("reina_trejo.mp3",                                 "reina-trejo.mp3"),
  @("casa-bolio.mp3",                                  "casa-bolio.mp3"),
  @("Cantina y callejón x Cantina y Callejón (Mashup).mp3", "cantina-callejon-mashup.mp3"),
  @("san antonio x san antonio (Mashup).mp3",          "san-antonio-mashup.mp3"),
  @("adicted_toyou).mp3",                              "adicted-to-you.mp3"),
  @("yourtunes-inspiring-glitchy-cinematic-324018.mp3","glitchy-cinematic.mp3"),
  @("1254808_mind-explorer_preview.mp3",               "mind-explorer.mp3"),
  @("1543946_b0a1531a_d4788276.mp3",                   "melodia-1543946.mp3")
)

$ok = 0; $fail = 0
foreach ($pair in $map) {
  $s = Join-Path $src $pair[0]
  $d = Join-Path $dst $pair[1]
  if (Test-Path $s) {
    Copy-Item -Path $s -Destination $d -Force
    Write-Host "OK  $($pair[1])"
    $ok++
  } else {
    Write-Host "MISS $($pair[0])"
    $fail++
  }
}

Write-Host "`nCanciones copiadas: $ok, faltantes: $fail. Destino: $dst"
