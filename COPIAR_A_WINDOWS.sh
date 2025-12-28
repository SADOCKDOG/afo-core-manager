#!/bin/bash

# Script para copiar web-app a carpeta local de Windows
# Ejecutar desde WSL o Git Bash

SOURCE_DIR="/workspaces/spark-template/web-app"
DEST_DIR="/mnt/c/Users/yo/PRO/AFOCORE"

echo "================================================"
echo "  AFO Core Manager - Instalación Local"
echo "================================================"
echo ""
echo "Origen:  $SOURCE_DIR"
echo "Destino: $DEST_DIR"
echo ""

# Verificar que existe el directorio origen
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ ERROR: No se encuentra el directorio origen"
    exit 1
fi

# Crear directorio destino si no existe
echo "📁 Creando directorio destino..."
mkdir -p "$DEST_DIR"

# Copiar archivos
echo "📦 Copiando archivos..."
cp -rv "$SOURCE_DIR"/* "$DEST_DIR/"

# Verificar copia
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Copia completada exitosamente"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. cd C:\\Users\\yo\\PRO\\AFOCORE"
    echo "2. npm install"
    echo "3. npm run dev"
    echo ""
    echo "🌐 La aplicación estará en: http://localhost:5173"
else
    echo ""
    echo "❌ ERROR durante la copia"
    exit 1
fi

echo ""
echo "================================================"
