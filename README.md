# AFO Core Manager

Aplicación web de escritorio para arquitectos autónomos en España. Centraliza expedientes, normativa (CTE, RITE, REBT y PGOU), visado colegial, documentos ISO19650-2, presupuestos BC3 y facturación. Basada en React 19 + Vite + GitHub Spark para persistencia sin servidor.

## Visión y usuario objetivo

- Arquitecto autónomo o pequeños estudios en España que gestionan múltiples expedientes, fuerte carga normativa y control financiero.
- Enfoque vertical: flujos de COAM/COACM, checklists AFO, visado colegial, nomenclatura ISO19650-2 y cumplimiento CTE.

## Arquitectura

- React 19 + TypeScript + Vite + Tailwind CSS 4 + shadcn/ui + Radix UI + Framer Motion.
- Persistencia: `useKV` de GitHub Spark (no usar localStorage). Ejemplo: `useKV<Project[]>('projects', [])`.
- Alias de rutas: `@/` apuntando a `src/` (ver tsconfig y vite.config).
- UI en español y dominio regulatorio español (CTE, RITE, REBT, PGOU).

### Módulos principales (según informe funcional)

- Dashboard: tarjetas de proyectos; pendiente calendario/hitos y feed de notificaciones global.
- Clientes y Expedientes: alta de promotor y expediente; fases contratadas. Ver [src/components/ClientManager.tsx](src/components/ClientManager.tsx) y [src/components/ProjectDialog.tsx](src/components/ProjectDialog.tsx).
- Visado colegial: estados requeridos/pendiente de pago/retirar; reforzar en [src/components/VisaManager.tsx](src/components/VisaManager.tsx).
- Normativa y AFO: checklist nacional en [src/lib/compliance-data.ts](src/lib/compliance-data.ts); gestor municipal en [src/components/MunicipalComplianceManager.tsx](src/components/MunicipalComplianceManager.tsx); asistente IA en [src/components/AIRegulatoryAssistant.tsx](src/components/AIRegulatoryAssistant.tsx).
- Checklists AFO/licencias: plantillas dinámicas en [src/components/ComplianceGeneratorDialog.tsx](src/components/ComplianceGeneratorDialog.tsx) y [src/components/ComplianceChecklistView.tsx](src/components/ComplianceChecklistView.tsx); añadir plantilla específica AFO según informe.
- Documentos y versionado ISO19650-2: utilidades en [src/lib/document-utils.ts](src/lib/document-utils.ts); gestores en [src/components/DocumentManager.tsx](src/components/DocumentManager.tsx), [src/components/BulkDocumentUpload.tsx](src/components/BulkDocumentUpload.tsx) y [src/components/DocumentVersionDialog.tsx](src/components/DocumentVersionDialog.tsx).
- Plantillas y IA de contenido: [src/components/DocumentTemplateWithAI.tsx](src/components/DocumentTemplateWithAI.tsx) y [src/components/AIContentGenerator.tsx](src/components/AIContentGenerator.tsx).
- Presupuestos y BC3: [src/components/BudgetManager.tsx](src/components/BudgetManager.tsx), parser en [src/lib/bc3-parser.ts](src/lib/bc3-parser.ts) y precios en [src/lib/budget-prices.ts](src/lib/budget-prices.ts).
- Facturación y cobros: [src/components/InvoiceManager.tsx](src/components/InvoiceManager.tsx) y [src/components/BillingManager.tsx](src/components/BillingManager.tsx).
- Email y reportes: configuración y logs en [src/lib/email-service.ts](src/lib/email-service.ts) con diálogos en [src/components/EmailConfigDialog.tsx](src/components/EmailConfigDialog.tsx) y [src/components/EmailLogsDialog.tsx](src/components/EmailLogsDialog.tsx).
- Importador masivo y proyectos heredados: base en [src/components/BulkProjectImportDialog.tsx](src/components/BulkProjectImportDialog.tsx); falta enriquecimiento con lectura de metadatos PDF y clasificación automática descrita en el informe.
- Dirección de obra y CFO: Libro de órdenes/incidencias y asistente CFO aún pendientes; punto de partida en [src/components/VisaManager.tsx](src/components/VisaManager.tsx).

## Estado vs informe (gaps relevantes)

- Falta calendario global de hitos y feed de notificaciones en Dashboard.
- Checklist AFO específica y plantillas de licencias no están preconfiguradas.
- Importador inteligente de proyectos heredados requiere análisis de carpetas y metadatos PDF (solo existe subida masiva básica).
- Asistente guiado de memoria/CTE por apartado (wizard) no está implementado.
- Libro de Órdenes/Incidencias y asistente CFO → disparo de factura no existen aún.

## Estructura de carpetas

- `src/App.tsx`: navegación principal, tabs y diálogos globales.
- `src/components/`: módulos funcionales (proyectos, normativa, documentos, facturación, IA, visado, importaciones).
- `src/components/ui/`: primitives de shadcn/ui (no modificar estilos base).
- `src/lib/`: tipos, utilidades (documentos, compliance, presupuestos, email, IA normativa, BC3, importación), datos regulatorios.
- `src/styles/`: tema Tailwind.

## Datos y convenciones

- Tipos centralizados en [src/lib/types.ts](src/lib/types.ts). Fases: `estudio-previo | anteproyecto | basico | ejecucion | direccion-obra`. Estados: `pending | in-progress | completed` para fases; `active | archived | on-hold` para proyectos; documentos `draft | shared | approved`.
- Claves useKV recomendadas: `projects`, `stakeholders`, `clients`, `invoices`, `budgets`, `budget-prices`, `documents-${projectId}`, `compliance-checks-${projectId}`, `compliance-checklists`, `municipalities`, `regulatory-queries`, `email-logs`.
- Nomenclatura documentos ISO19650-2: uso de `generateVersionNumber`, `getNextVersion` y `generateStandardizedFileName` en [src/lib/document-utils.ts](src/lib/document-utils.ts). Versiones: `P##` (compartida), `P##.##` (borrador), `C##` (aprobada).
- IDs: `Date.now().toString()` o `crypto.randomUUID()`. Timestamps en milisegundos.
- Texto y etiquetas en español; citar referencias normativas exactas (ej. "CTE DB-SI 3.2").

## Instalación y ejecución

```bash
npm install
npm run dev       # puerto 5000
npm run build     # tsc -b --noCheck + vite build
npm run preview
npm run lint
npm run kill      # libera puerto 5000
```

## Próximos pasos sugeridos

1) Integrar plantilla AFOCORESP o importar su layout para el dashboard y vistas normativas.
2) Implementar calendario/hitos y feed de notificaciones en Dashboard.
3) Añadir checklist AFO y plantillas de licencias municipales reutilizables.
4) Desarrollar importador inteligente (análisis de carpetas + metadatos PDF) para proyectos heredados.
5) Crear wizard de memoria/CTE con checklists por apartado y libro de órdenes/incidencias + CFO → factura final.

## Licencia

MIT.
