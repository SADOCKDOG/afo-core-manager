# Instalación en Carpeta Local Windows

## 📍 Ubicación de Destino

**C:\Users\yo\PRO\AFOCORE**

## ✅ Verificación de Independencia

Este proyecto **NO tiene dependencias de Spark**:

- ❌ No usa `@github/spark`
- ❌ No usa `useKV` hooks
- ❌ No mapea módulos de Spark
- ✅ Solo usa React 19 + React Router 7 + Vite
- ✅ Completamente independiente

## 📋 Pasos para Instalación Local

### Opción 1: Copiar desde VSCode (Recomendado)

1. **Abrir la terminal de Windows** (PowerShell o CMD)

2. **Crear la carpeta destino si no existe:**

```powershell
mkdir C:\Users\yo\PRO\AFOCORE
```

1. **Copiar todo el contenido del proyecto:**

Si estás usando **WSL** (Windows Subsystem for Linux):

```bash
cp -r /workspaces/spark-template/web-app/* /mnt/c/Users/yo/PRO/AFOCORE/
```

Si estás en **Windows PowerShell**:

```powershell
# Desde la carpeta donde clonaste el repositorio
Copy-Item -Path "web-app\*" -Destination "C:\Users\yo\PRO\AFOCORE\" -Recurse -Force
```

### Opción 2: Descargar ZIP desde GitHub

1. Ve al repositorio en GitHub
2. Click en "Code" → "Download ZIP"
3. Descomprime el archivo
4. Copia la carpeta `web-app` completa a `C:\Users\yo\PRO\AFOCORE`

### Opción 3: Git Clone Directo

```powershell
cd C:\Users\yo\PRO\
git clone https://github.com/SADOCKDOG/afo-core-manager.git AFOCORE-temp
Move-Item AFOCORE-temp\web-app\* AFOCORE\
Remove-Item AFOCORE-temp -Recurse -Force
```

## 🚀 Configuración Post-Instalación

1. **Abrir la carpeta en tu terminal:**

```powershell
cd C:\Users\yo\PRO\AFOCORE
```

1. **Instalar dependencias:**

```powershell
npm install
```

1. **Iniciar servidor de desarrollo:**

```powershell
npm run dev
```

1. **Abrir en navegador:**

```
http://localhost:5173
```

## 📦 Estructura Copiada

```
C:\Users\yo\PRO\AFOCORE\
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Card.tsx
│   │   │   └── Section.tsx
│   │   ├── dashboard/
│   │   │   ├── MilestoneCalendar.tsx
│   │   │   ├── NotificationFeed.tsx
│   │   │   └── TaskList.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   └── projects/
│   │       └── ProjectCard.tsx
│   ├── lib/
│   │   ├── data/
│   │   │   ├── mockProjects.ts
│   │   │   ├── mockCompliance.ts
│   │   │   ├── mockDocuments.ts
│   │   │   ├── mockFinance.ts
│   │   │   └── mockExtended.ts
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
└── README.md
```

## 🔧 Scripts Disponibles

```json
{
  "dev": "vite",                    // Servidor desarrollo
  "build": "tsc --noEmit && vite build", // Compilar producción
  "preview": "vite preview",        // Vista previa de build
  "lint": "eslint ."                // Verificar código
}
```

## 📝 Dependencias (sin Spark)

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^7.0.2",
  "clsx": "^2.1.1"
}
```

## ⚠️ Requisitos Previos

- Node.js 18+ instalado
- npm 9+ instalado
- Editor de código (VSCode recomendado)

## 🎯 Verificar Instalación

Después de `npm install`, verifica que todo funcione:

```powershell
# Compilar TypeScript
npm run build

# Si no hay errores, la instalación es exitosa
```

## 🆘 Troubleshooting

### Error: "node no reconocido"

Instala Node.js desde: <https://nodejs.org/>

### Error de permisos

Ejecuta PowerShell como Administrador

### Puerto 5173 ocupado

Edita `vite.config.ts` y cambia el puerto:

```typescript
server: {
  port: 3000  // Cambia aquí
}
```

## 📚 Documentación Adicional

- [README.md](README.md) - Visión general del proyecto
- [DASHBOARD_SUMMARY.md](DASHBOARD_SUMMARY.md) - Componentes implementados
- [Informe Funcional](../Informe%20de%20Especificaciones%20Funcionales...) - Requisitos completos

---

## ✅ Checklist de Verificación

- [ ] Carpeta `C:\Users\yo\PRO\AFOCORE` creada
- [ ] Archivos copiados correctamente
- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` inicia servidor en puerto 5173
- [ ] Navegador muestra la aplicación correctamente
- [ ] No hay errores en consola de navegador
- [ ] Sidebar de navegación funciona
- [ ] Dashboard muestra proyectos, hitos, notificaciones y tareas

---

**🎉 ¡Listo! Tu aplicación AFO Core Manager está instalada y funcionando de forma completamente independiente.**
