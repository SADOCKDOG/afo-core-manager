# 📦 Guía de Instalación - AFO Core Manager

## ✅ Confirmación de Independencia

El proyecto **web-app** es **100% independiente de Spark**:

- ❌ **NO usa** `@github/spark`
- ❌ **NO usa** hooks de Spark (`useKV`, `useChat`, `useAI`)
- ❌ **NO mapea** módulos desde Spark
- ✅ **Solo dependencias estándar**: React 19, React Router 7, Vite, TypeScript
- ✅ **Completamente portable** y ejecutable en cualquier entorno Node.js

---

## 🚀 Opción 1: Copiar Manualmente (Recomendado)

### Desde el Codespace/Contenedor

1. **En VSCode, click derecho sobre la carpeta `web-app`**
2. **Seleccionar "Download"**
3. **Guardar en tu equipo**
4. **Descomprimir en `C:\Users\yo\PRO\AFOCORE`**

---

## 🚀 Opción 2: Script Automatizado para Windows

### Si tienes WSL instalado

```bash
# 1. Ejecutar desde la terminal de WSL
cd /workspaces/spark-template
./COPIAR_A_WINDOWS.sh
```

### Si usas PowerShell en Windows

```powershell
# 1. Clonar el repositorio en Windows
cd C:\Users\yo\PRO
git clone https://github.com/SADOCKDOG/afo-core-manager.git temp-afocore

# 2. Ejecutar el script de copia
cd temp-afocore
.\COPIAR_A_WINDOWS.ps1

# 3. Eliminar carpeta temporal
cd ..
Remove-Item temp-afocore -Recurse -Force
```

---

## 🚀 Opción 3: Usar Archivo Comprimido

### Archivo generado: `AFOCORE-web-app.tar.gz`

**Ubicación:** `/workspaces/spark-template/AFOCORE-web-app.tar.gz`

### Pasos

1. **Descargar el archivo `.tar.gz` desde el codespace**
2. **Extraer con 7-Zip o WinRAR** en Windows
3. **Copiar contenido a `C:\Users\yo\PRO\AFOCORE`**

---

## 📋 Post-Instalación

Una vez que tengas los archivos en `C:\Users\yo\PRO\AFOCORE`:

```powershell
# 1. Abrir PowerShell en la carpeta
cd C:\Users\yo\PRO\AFOCORE

# 2. Instalar dependencias (esto descargará ~100MB de node_modules)
npm install

# 3. Verificar que compila correctamente
npm run build

# 4. Iniciar servidor de desarrollo
npm run dev
```

**La aplicación estará en:** <http://localhost:5173>

---

## 📁 Estructura Final Esperada

```
C:\Users\yo\PRO\AFOCORE\
├── node_modules/          (se crea con npm install)
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── projects/
│   ├── lib/
│   │   ├── data/
│   │   ├── types.ts
│   │   ├── types-extended.ts
│   │   └── navigation.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Expedientes.tsx
│   │   ├── Normativa.tsx
│   │   ├── Documentos.tsx
│   │   └── Finanzas.tsx
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── DASHBOARD_SUMMARY.md
├── INSTALACION_LOCAL.md
└── README.md
```

---

## ✅ Checklist de Verificación

Después de instalar, verifica:

- [ ] Carpeta `C:\Users\yo\PRO\AFOCORE` existe
- [ ] `package.json` está presente
- [ ] `npm install` completado sin errores
- [ ] `npm run dev` inicia en puerto 5173
- [ ] Navegador muestra el dashboard
- [ ] Sidebar funciona (Dashboard, Expedientes, Normativa, etc.)
- [ ] No hay errores en consola del navegador
- [ ] No hay referencias a Spark en ningún archivo

---

## 🔍 Verificar Independencia de Spark

Puedes buscar referencias a Spark con:

```powershell
# Desde PowerShell en C:\Users\yo\PRO\AFOCORE
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.json | Select-String "spark|useKV|@github"
```

**Resultado esperado:** No debe haber coincidencias (excepto este README explicando la independencia).

---

## 📚 Documentación Incluida

- **README.md** - Visión general y stack tecnológico
- **DASHBOARD_SUMMARY.md** - Detalle de componentes implementados
- **INSTALACION_LOCAL.md** - Esta guía de instalación

---

## 🆘 Problemas Comunes

### "npm no reconocido"

**Solución:** Instala Node.js desde <https://nodejs.org/> (versión 18+)

### "Puerto 5173 ocupado"

**Solución:** Edita `vite.config.ts` y cambia el puerto:

```typescript
server: { port: 3000 }
```

### "Errores de TypeScript"

**Solución:** Verifica que tienes TypeScript 5.7+

```powershell
npm install typescript@latest --save-dev
```

---

## 🎯 Siguiente Paso: Desarrollo

Una vez instalado y funcionando, puedes:

1. **Revisar el código** en `src/`
2. **Modificar componentes** según necesites
3. **Agregar nuevas páginas** en `src/pages/`
4. **Personalizar estilos** en `src/styles/global.css`
5. **Ver features pendientes** en `DASHBOARD_SUMMARY.md`

---

## 📞 Soporte

Si tienes problemas:

1. Verifica los requisitos previos (Node.js 18+, npm 9+)
2. Elimina `node_modules` y ejecuta `npm install` de nuevo
3. Revisa errores en consola del navegador (F12)
4. Verifica que no hay procesos ocupando el puerto 5173

---

**✅ El proyecto está listo para ejecutarse de forma completamente independiente en tu máquina Windows.**
