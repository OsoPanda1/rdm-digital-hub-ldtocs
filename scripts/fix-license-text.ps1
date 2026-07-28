# Fix license text in frontend files
$ErrorActionPreference = "Stop"
$baseDir = "C:\Users\tamvo\rdm-digital-hub-ldtocs"

# Fix Manuales.tsx - correct the license FAQ answer
$manualesPath = "$baseDir\artifacts\rdm-hub\src\pages\Manuales.tsx"
$content = [System.IO.File]::ReadAllText($manualesPath, [System.Text.Encoding]::UTF8)

$oldFaq = 'El core del ecosistema es open source bajo licencia MIT. Módulos de seguridad críticos tienen licencia propietaria.'
$newFaq = 'Opera bajo licenciamiento híbrido por capas: TAMV-PRCL (núcleo YUN/C.R.O.W.N.), TAMV-EOL (Isabella AI), TAMV-KÓRIMA (skills abiertos), MIT (frontend, docs, tools). Ver LICENSE-HYBRID.md.'

if ($content.Contains($oldFaq)) {
    $content = $content.Replace($oldFaq, $newFaq)
    [System.IO.File]::WriteAllText($manualesPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed Manuales.tsx"
} else {
    Write-Host "Manuales.tsx: old text not found (may already be fixed)"
}

# Fix ImpactoCivilizatorio.tsx - correct the licensing section
$impactoPath = "$baseDir\artifacts\rdm-hub\src\pages\ImpactoCivilizatorio.tsx"
$content = [System.IO.File]::ReadAllText($impactoPath, [System.Text.Encoding]::UTF8)

$oldCC = 'Creative Commons BY-NC-SA 4.0'
$newCC = 'TAMV-PRCL v1.0 (Propietario)'

$oldApache = 'Open Specification License + Apache 2.0'
$newApache = 'TAMV-KÓRIMA v1.0 (Reciprocidad abierta)'

$changed = $false
if ($content.Contains($oldCC)) {
    $content = $content.Replace($oldCC, $newCC)
    $changed = $true
}
if ($content.Contains($oldApache)) {
    $content = $content.Replace($oldApache, $newApache)
    $changed = $true
}

if ($changed) {
    [System.IO.File]::WriteAllText($impactoPath, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed ImpactoCivilizatorio.tsx"
} else {
    Write-Host "ImpactoCivilizatorio.tsx: old text not found (may already be fixed)"
}
