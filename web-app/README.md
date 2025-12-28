# AFO Core Web (independiente, sin Spark)

Estructura base para la aplicación web independiente solicitada (sin hooks ni persistencia Spark). Incluye enrutado, layout con sidebar/topbar y páginas por dominio.

## Stack

- React 19
- Vite
- React Router 7
- TypeScript
- CSS plano (global.css)

## Estructura

- `src/main.tsx`: arranque con `BrowserRouter`.
- `src/App.tsx`: definición de rutas y layout.
- `src/components/layout/`: `AppLayout`, `Sidebar`, `Topbar`.
- `src/components/common/`: `Card`, `Section`.
- `src/pages/`: `Dashboard`, `Expedientes`, `Normativa`, `Documentos`, `Finanzas`.
- `src/lib/types.ts`: tipos de dominio mínimos (proyectos, fases, requisitos, documentos, finanzas).
- `src/lib/data/`: mocks para proyectos, normativa, documentos y finanzas.
- `src/lib/navigation.ts`: items de navegación.
- `src/styles/global.css`: layout, tipografía y componentes base.

## Pendientes para alinearse al informe

- Calendario de hitos y feed de notificaciones en Dashboard.
- Checklist AFO y plantillas de licencias municipales configurables.
- Importador inteligente de proyectos heredados (carpetas + metadatos PDF).
- Wizard de memoria/CTE por apartado con checklists guiadas.
- Gestión de visado colegial (estados y motivos requeridos) y libro de órdenes/incidencias.
- Flujo CFO → factura final y controles de cobro avanzados.

## Uso

```bash
cd web-app
npm install
npm run dev
```

Servidor en <http://localhost:5173>.
