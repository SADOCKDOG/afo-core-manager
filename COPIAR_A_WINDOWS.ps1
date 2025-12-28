# Script PowerShell para copiar web-app a carpeta local
# Ejecutar desde PowerShell en Windows

$SourceDir = ".\web-app"
$DestDir = "C:\Users\yo\PRO\AFOCORE"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  AFO Core Manager - Instalación Local" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar directorio origen
if (-not (Test-Path $SourceDir)) {
    Write-Host "❌ ERROR: No se encuentra el directorio origen: $SourceDir" -ForegroundColor Red
    exit 1
}

# Crear directorio destino
Write-Host "📁 Creando directorio destino..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $DestDir | Out-Null

# Copiar archivos
Write-Host "�� Copiando archivos..." -ForegroundColor Yellow
Copy-Item -Path "$SourceDir\*" -Destination $DestDir -Recurse -Force

if ($?) {
    Write-Host ""
    Write-Host "✅ Copia completada exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. cd C:\Users\yo\PRO\AFOCORE"
    Write-Host "2. npm install"
    Write-Host "3. npm run dev"
    Write-Host ""
    Write-Host "🌐 La aplicación estará en: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ ERROR durante la copia" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
