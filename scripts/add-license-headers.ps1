# Adds SPDX copyright headers to all .ts/.tsx source files
# Usage: powershell -ExecutionPolicy Bypass -File scripts/add-license-headers.ps1

$ErrorActionPreference = "Stop"

$copyright = "Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network"

$licenseMap = @{
    # TAMV-PRCL (Proprietary)
    "artifacts\api-server\src\lib\yun"        = "TAMV-PRCL"
    "artifacts\api-server\src\lib\crown"      = "TAMV-PRCL"
    "artifacts\rdm-hub\src\kernel"            = "TAMV-PRCL"
    # TAMV-EOL (Ethical)
    "artifacts\api-server\src\lib\isabella"   = "TAMV-EOL"
    # TAMV-KORIMA (Reciprocity) — must check BEFORE the EOL parent
    "artifacts\api-server\src\lib\isabella\skills" = "TAMV-KORIMA"
    # MIT
    "artifacts\api-server\src\routes"         = "MIT"
    "artifacts\api-server\src\middlewares"    = "MIT"
    "artifacts\api-server\src\lib\admin"      = "MIT"
    "artifacts\api-server\src\lib\iam"        = "MIT"
    "artifacts\api-server\src\lib"            = "MIT"
    "artifacts\api-server\src"                = "MIT"
    "artifacts\rdm-hub\src"                   = "MIT"
    "lib"                                     = "MIT"
    "scripts\src"                             = "MIT"
}

function Get-LicenseForFile {
    param([string]$RelativePath)
    
    # Check most specific paths first (longer prefix = more specific)
    $bestMatch = ""
    $bestLicense = "MIT"
    
    foreach ($key in $licenseMap.Keys) {
        if ($RelativePath.StartsWith($key) -and $key.Length -gt $bestMatch.Length) {
            $bestMatch = $key
            $bestLicense = $licenseMap[$key]
        }
    }
    
    return $bestLicense
}

function Add-SPDXHeader {
    param([string]$FilePath, [string]$RelativePath)
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    if ($null -eq $content) { return }
    
    # Skip if header already present
    if ($content -match "SPDX-License-Identifier") { return }
    
    $license = Get-LicenseForFile $RelativePath
    
    $header = "/*
 * $copyright
 * SPDX-License-Identifier: $license
 */
"
    
    $newContent = $header + $content
    Set-Content -Path $FilePath -Value $newContent -NoNewline -Encoding UTF8
    Write-Host "  + $RelativePath [$license]"
}

$baseDir = "C:\Users\tamvo\rdm-digital-hub-ldtocs"

Write-Host "Adding SPDX license headers..."
Write-Host ""

# Process all .ts and .tsx files (exclude node_modules, dist, .d.ts)
$files = Get-ChildItem -Recurse -Include "*.ts","*.tsx" -Path "$baseDir\artifacts","$baseDir\lib","$baseDir\scripts" |
    Where-Object { $_.FullName -notmatch "node_modules|dist|\.d\.ts$" -and $_.FullName -notmatch "build\.mjs" }

$count = 0
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($baseDir.Length + 1)
    Add-SPDXHeader -FilePath $file.FullName -RelativePath $relativePath
    $count++
}

Write-Host ""
Write-Host "Done. Processed $count files."
