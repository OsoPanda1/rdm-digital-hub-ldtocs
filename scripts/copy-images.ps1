# copy-images.ps1 — Copia las fotos reales de Real del Monte desde Descargas
# a apps/rdm-hub/public/images con nombres normalizados.
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\copy-images.ps1

$src = "C:\Users\tamvo\Downloads"
$dst = "C:\Users\tamvo\Downloads\nodo-cero-isabella\apps\rdm-hub\public\images"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

$map = @(
  @("heroprincipal.png",       "hero.png"),
  @("mina-acosta.jpg",         "mina-acosta.jpg"),
  @("museo_medicina.jpg",      "museo-medicina.jpg"),
  @("monumento_minero.jpg",    "monumento-minero.jpg"),
  @("mirador_purisima.jpg",    "mirador-purisima.jpg"),
  @("hiloche.jpg",             "hiloche.jpg"),
  @("plaza_principal.jpg",     "plaza-principal.jpg"),
  @("plaza_dos.jpg",           "plaza-dos.jpg"),
  @("plaza.jpg",               "plaza.jpg"),
  @("calles.jpg",              "calles.jpg"),
  @("callejon.jpg",            "callejon.jpg"),
  @("centro2.jpg",             "centro.jpg"),
  @("pueblo.jpg",              "pueblo.jpg"),
  @("ecoturismo.jpg",          "ecoturismo.jpg"),
  @("rosario.jpg",             "rosario.jpg"),
  @("zelotla.jpg",             "zelotla.jpg"),
  @("pedroromero.jpg",         "pedro-romero.jpg"),
  @("gatronomia1.jpg",         "gastronomia-1.jpg"),
  @("gastronomia2.jpg",        "gastronomia-2.jpg"),
  @("gastronomia3.jpg",        "gastronomia-3.jpg"),
  @("gastronomia4.jpg",        "gastronomia-4.jpg"),
  @("gastronomia5.jpg",        "gastronomia-5.jpg"),
  @("realito-historia.png",    "realito-historia.png"),
  @("realito-cultura.png",     "realito-cultura.png"),
  @("realito-gastronomia.png", "realito-gastronomia.png"),
  @("realito-arte.png",        "realito-arte.png"),
  @("realito-bares.png",       "realito-bares.png"),
  @("realito-ecoturismo.png",  "realito-ecoturismo.png"),
  @("realito-minas.png",       "realito-minas.png"),
  @("realito-platerias.png",   "realito-platerias.png"),
  @("real1.jpg",               "real-1.jpg"),
  @("real2.jpg",               "real-2.jpg"),
  @("real3.jpg",               "real-3.jpg"),
  @("real4.jpg",               "real-4.jpg"),
  @("ladificultad.jpg",        "ladificultad.jpg"),
  @("penas-cargadas.jpg",      "penas-cargadas.jpg"),
  @("hospital.jpg",            "hospital.jpg")
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

Write-Host "`nImagenes copiadas: $ok, faltantes: $fail. Destino: $dst"
