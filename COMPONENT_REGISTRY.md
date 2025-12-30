# AFO CORE MANAGER - Registro Completo de Componentes

## Documentación del Sistema

**Versión:** 1.0.0  
**Fecha de Generación:** Diciembre 2024  
**Total de Componentes:** 45+  
**Total de Módulos Utilidad:** 25+

---

## Índice

1. [Componentes de Negocio (Business)](#componentes-de-negocio)
2. [Componentes de Gestión (Manager)](#componentes-de-gestión)
3. [Componentes de Diálogo (Dialog)](#componentes-de-diálogo)
4. [Componentes de Utilidad (Utility)](#componentes-de-utilidad)
5. [Componentes de Formulario (Form)](#componentes-de-formulario)
6. [Componentes UI Base](#componentes-ui-base)
7. [Módulos Utilitarios](#módulos-utilitarios)
8. [Arquitectura del Sistema](#arquitectura-del-sistema)

---

## Componentes de Negocio

### Dashboard
**Estado:** Estable | **Complejidad:** Alta

Vista principal del sistema que muestra métricas clave, actividad reciente y navegación a módulos.

**Características:**
- Tarjetas de métricas con conteos totales y tendencias
- Seguimiento de ingresos con comparación mensual
- Lista de proyectos recientes con barras de progreso
- Distribución de proyectos por estado (gráfico circular)
- Resumen de facturas pendientes
- Navegación rápida a vistas detalladas
- Estados vacíos con guías para nuevos usuarios

**Props:**
- `projects`: Array de proyectos
- `clients`: Array de clientes
- `invoices`: Array de facturas
- `budgets`: Array de presupuestos
- `milestones`: Array de hitos
- `onNavigate`: Función de navegación

**Dependencias:** Card, Button, ScrollArea, Badge

**Componentes Relacionados:** ProjectCard, InvoiceManager

---

### ProjectCard
**Estado:** Estable | **Complejidad:** Media

Tarjeta de visualización para proyectos individuales con información resumida.

**Características:**
- Barra de progreso visual mostrando completitud de fases
- Badge de estado (Activo/Archivado)
- Indicadores de fases
- Visualización de ubicación
- Animaciones de hover con elevación
- Click para navegar al detalle del proyecto

**Props:**
- `project`: Datos del proyecto
- `onClick`: Función callback al hacer click
- `index`: Índice para animaciones escalonadas

**Dependencias:** Card, Badge, motion (framer-motion)

**Componentes Relacionados:** ProjectDetail, ProjectDialog

---

### ProjectDetail
**Estado:** Estable | **Complejidad:** Alta

Vista completa de detalles del proyecto con pestañas para diferentes aspectos.

**Características:**
- Interfaz multi-pestaña (Resumen, Documentos, Cumplimiento, Presupuesto, Hitos, Visados)
- Gestión de fases con actualización de estados
- Visualización de intervinientes
- Integración de gestión documental
- Integración de checklist de cumplimiento
- Seguimiento de presupuesto
- Línea temporal de hitos
- Integración de workflow de visados

**Props:**
- `project`: Datos del proyecto
- `stakeholders`: Array de intervinientes
- `onBack`: Función para volver atrás
- `onEdit`: Función para editar proyecto
- `onUpdatePhaseStatus`: Función para actualizar estado de fase
- `onProjectUpdate`: Función para actualizar datos del proyecto

**Dependencias:** Tabs, Card, Button, Badge, DocumentManager, ComplianceChecker, BudgetManager

**Componentes Relacionados:** ProjectCard, DocumentManager, ComplianceChecker, VisaManager, BudgetManager, MilestoneDialog

**Hooks:** useState, useKV

---

### ComplianceChecker
**Estado:** Estable | **Complejidad:** Alta

Sistema completo de checklist de cumplimiento normativo con generación automática.

**Características:**
- Generación automática de checklist basada en parámetros del edificio
- 40+ requisitos regulatorios nacionales
- Integración de requisitos municipales
- Categorización de requisitos (12+ categorías)
- Seguimiento de estado (Cumple, No Cumple, Pendiente, N/A)
- Niveles de prioridad (Alta, Media, Baja)
- Adjuntar notas y evidencias
- Búsqueda y filtrado en tiempo real
- Cálculo de progreso
- Exportación a CSV

**Props:**
- `projectId`: ID del proyecto

**Dependencias:** Card, Button, Badge, Textarea, Input, Tabs, Select

**Componentes Relacionados:** MunicipalComplianceManager, ComplianceGeneratorDialog, ComplianceChecklistView

**Hooks:** useKV, useState, useMemo

---

### ProjectCalendar
**Estado:** Estable | **Complejidad:** Alta

Vista de calendario de proyectos con seguimiento de hitos y visualización de línea temporal.

**Características:**
- Vista de calendario mensual
- Visualización de hitos de proyecto
- Navegación por fechas
- Filtrado de eventos
- Vistas Día/Semana/Mes
- Línea temporal de fases de proyecto
- Creación de hitos
- Seguimiento de fechas de vencimiento

**Props:**
- `projects`: Array de proyectos

**Dependencias:** Calendar, Button, Badge, Card

**Componentes Relacionados:** MilestoneDialog, ProjectDetail

**Hooks:** useKV, useState

---

### QualifiedSignatureRequestViewer
**Estado:** Estable | **Complejidad:** Media

Dashboard para ver y gestionar solicitudes de firma electrónica cualificada.

**Características:**
- Lista de solicitudes de firma
- Filtrado por estado
- Vista de detalles de solicitud
- Visualización de metadatos de firma
- Información de certificados
- Visualización de trazabilidad de auditoría
- Seguimiento de expiración de solicitudes
- Visualización de log de errores

**Props:** Ninguno

**Dependencias:** Dialog, Table, Badge, Button, ScrollArea

**Componentes Relacionados:** QualifiedSignatureDialog, ApprovalFlowManager

**Hooks:** useKV, useState

---

### UserManual
**Estado:** Estable | **Complejidad:** Alta

Manual de usuario completo con todos los módulos, funciones e instrucciones de uso.

**Características:**
- Documentación completa de módulos
- Guías paso a paso
- Funcionalidad de búsqueda
- Navegación por tabla de contenidos
- Ejemplos visuales
- Exportación a PDF
- Exportación a Markdown
- Formato imprimible
- Contenido buscable
- Integración de guías visuales

**Props:** Ninguno

**Dependencias:** Dialog, ScrollArea, Button, Input, Tabs, Card

**Componentes Relacionados:** DeveloperManual, VisualGuideViewer

**Hooks:** useState

---

### DeveloperManual
**Estado:** Estable | **Complejidad:** Alta

Documentación técnica para desarrolladores incluyendo arquitectura, APIs y estructura de código.

**Características:**
- Diagramas de arquitectura
- Documentación de componentes
- Referencia de API
- Ejemplos de código
- Estructura de módulos
- Diagramas de flujo de datos
- Guías de integración
- Exportación a PDF
- Exportación a Markdown
- Snippets de código descargables

**Props:** Ninguno

**Dependencias:** Dialog, ScrollArea, Button, Tabs, Card, Code

**Componentes Relacionados:** UserManual, ArchitectureDiagrams

**Hooks:** useState

---

### ComponentRegistry
**Estado:** Estable | **Complejidad:** Alta

Registro completo de todos los componentes del sistema con documentación detallada.

**Características:**
- Lista completa de componentes con categorización
- Búsqueda y filtrado por categoría
- Detalles completos de cada componente (props, features, dependencies)
- Navegación entre componentes relacionados
- Visualización de hooks y APIs utilizados
- Estadísticas del sistema
- Exportación a Markdown
- Exportación a PDF
- Vista detallada modal para cada componente

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Tabs, Card, Badge, ScrollArea

**Componentes Relacionados:** UserManual, DeveloperManual

**Hooks:** useState, useMemo

---

### DocumentGeneratorHub
**Estado:** Estable | **Complejidad:** Media

Hub central para todas las características de generación de documentos y plantillas.

**Características:**
- Acceso a biblioteca de plantillas
- Documentos recientes
- Herramientas de generación con IA
- Acciones rápidas
- Estadísticas de documentos
- Plantillas favoritas

**Props:** Ninguno

**Dependencias:** Dialog, Card, Button, Tabs

**Componentes Relacionados:** DocumentTemplateLibrary, AIContentGenerator

**Hooks:** useKV, useState

---

## Componentes de Gestión

### DocumentManager
**Estado:** Estable | **Complejidad:** Alta

Sistema completo de gestión documental con carga, control de versiones, búsqueda y operaciones masivas.

**Características:**
- Carga de documentos con metadatos
- Sistema de control de versiones
- Búsqueda y filtrado multi-criterio
- Navegación por estructura de carpetas
- Carga masiva de documentos
- Vista previa de documentos
- Integración de biblioteca de plantillas
- Generación de documentos con IA
- Exportación a CSV
- Validación de documentos

**Props:**
- `projectId`: ID del proyecto
- `folderStructure`: Estructura de carpetas
- `onStructureChange`: Función callback al cambiar estructura

**Dependencias:** Dialog, Input, Select, Button, Table, Badge, ScrollArea

**Componentes Relacionados:** DocumentUploadDialog, BulkDocumentUpload, DocumentTemplateLibrary, DocumentPreview, DocumentSearch

**Hooks:** useKV, useState, useMemo

**APIs:** spark.llm

---

### DocumentTemplateLibrary
**Estado:** Estable | **Complejidad:** Alta

Biblioteca de plantillas de documentos profesionales con generación de contenido con IA y auto-completado.

**Características:**
- Categorías de plantillas (Memorias, Planos, Administrativo, Presupuestos, Cálculos)
- Búsqueda y filtrado de plantillas
- Personalización de plantillas basada en formularios
- Generación de contenido con IA para secciones
- Auto-completado desde datos del proyecto
- Sugerencias inteligentes de campos
- Vista previa antes de generar
- Descarga automática
- Cumplimiento de nomenclatura ISO19650-2

**Props:**
- `projectId`: ID del proyecto

**Dependencias:** Dialog, Tabs, Card, Input, Textarea, Button, Select, Badge

**Componentes Relacionados:** AIContentGenerator, DocumentManager, DocumentTemplateWithAI

**Hooks:** useKV, useState

**APIs:** spark.llm, spark.llmPrompt

---

### BudgetManager
**Estado:** Estable | **Complejidad:** Alta

Gestión de presupuestos de construcción con integración BC3 y estructura jerárquica.

**Características:**
- Estructura jerárquica de presupuesto (Capítulos, Unidades, Recursos)
- Importación y exportación de archivos BC3
- Base de datos de precios integrada
- Búsqueda en base de datos de precios
- Cálculos de GG, BI, IVA
- Seguimiento de estado de presupuesto (Borrador, Aprobado, Rechazado)
- Cálculos totales (PEM, PEC, PEM + GG + BI)
- Workflow de aprobación de presupuestos

**Props:**
- `projectId`: ID del proyecto

**Dependencias:** Dialog, Input, Button, Table, Select, Card

**Componentes Relacionados:** BC3ImportDialog, PriceDatabaseDialog, BudgetItemDialog

**Hooks:** useKV, useState

---

### InvoiceManager
**Estado:** Estable | **Complejidad:** Alta

Sistema completo de facturación con generación automática y exportación a PDF.

**Características:**
- Creación y edición de facturas
- Integración con clientes
- Gestión de líneas de factura
- Cálculos de impuestos (IVA)
- Estados de factura (Borrador, Emitida, Pagada, Vencida, Cancelada)
- Generación automática al completar fases
- Exportación a PDF con formato profesional
- Generación de número de factura
- Seguimiento de pagos
- Búsqueda y filtrado de facturas

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Table, Select, Badge, DatePicker

**Componentes Relacionados:** InvoiceDialog, AutoInvoiceConfirmDialog, ClientManager

**Hooks:** useKV, useState

---

### ClientManager
**Estado:** Estable | **Complejidad:** Media

Gestión de base de datos de clientes con perfiles detallados y asociación a proyectos.

**Características:**
- Creación y edición de clientes
- Soporte para clientes legales e individuales
- Validación de NIF/CIF
- Gestión de información de contacto
- Gestión de direcciones
- Seguimiento de términos de pago
- Asociación a proyectos
- Búsqueda y filtrado de clientes
- Estadísticas de clientes

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Table, Select, RadioGroup

**Componentes Relacionados:** ClientDialog, InvoiceManager, BillingManager

**Hooks:** useKV, useState

---

### BillingManager
**Estado:** Estable | **Complejidad:** Media

Gestor de configuración de facturación y ajustes de generación de facturas.

**Características:**
- Configuración de tasas de impuestos por defecto
- Series de numeración de facturas
- Valores por defecto de términos de pago
- Información de facturación de empresa
- Personalización de plantilla de factura
- Ajustes de auto-facturación

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Select, Switch

**Componentes Relacionados:** InvoiceManager

**Hooks:** useKV, useState

---

### VisaManager
**Estado:** Estable | **Complejidad:** Alta

Sistema de solicitud y seguimiento de visado colegial profesional.

**Características:**
- Creación de solicitudes de visado
- Selección de colegio (COAM, COACM, COAG, Otros)
- Requisitos de documentos específicos por fase
- Validación de documentos (tamaño, formato, tipo)
- Checklist de requisitos
- Cálculo de tasas por colegio
- Workflow de estado (Borrador → Enviado → En Revisión → Aprobado/Rechazado)
- Generación de número de solicitud
- Seguimiento de motivos de rechazo
- Reenvío de documentos

**Props:** Ninguno

**Dependencias:** Dialog, Input, Select, Button, Table, Badge, Checkbox

**Componentes Relacionados:** VisaApplicationDialog, ProjectDetail

**Hooks:** useKV, useState

---

### ApprovalFlowManager
**Estado:** Estable | **Complejidad:** Alta

Sistema de workflow de aprobación de documentos con firmas digitales y plantillas.

**Características:**
- Creación de flujos de aprobación
- Tipos de flujo (Secuencial, Paralelo, Unánime)
- Workflows multi-paso
- Asignación de aprobadores desde registro de intervinientes
- Gestión de plantillas
- Seguimiento de estado de flujo
- Visualización de progreso
- Trazabilidad de auditoría
- Integración de firma digital
- Soporte de firma cualificada

**Props:** Ninguno

**Dependencias:** Dialog, Input, Select, Button, Table, Badge, Tabs

**Componentes Relacionados:** CreateApprovalFlowDialog, ApprovalFlowList, ApprovalFlowTemplateManager, DigitalSignaturePad, QualifiedSignatureDialog

**Hooks:** useKV, useState

---

### MunicipalComplianceManager
**Estado:** Estable | **Complejidad:** Alta

Gestor para crear y aplicar requisitos de cumplimiento específicos municipales a proyectos.

**Características:**
- Base de datos de municipios con provincias españolas
- Creación de requisitos personalizados
- Categorización de requisitos
- Ejemplos pre-cargados (Madrid, Barcelona, Cartagena)
- Búsqueda y filtrado de municipios
- Aplicar a checklists nuevos o existentes
- Detección de duplicados
- Soporte de citas de PGOU y ordenanzas
- Badges visuales de municipio

**Props:** Ninguno

**Dependencias:** Dialog, Input, Select, Button, Table, Badge, Tabs

**Componentes Relacionados:** ComplianceChecker, ComplianceGeneratorDialog

**Hooks:** useKV, useState

---

### QualifiedSignatureProviderManager
**Estado:** Estable | **Complejidad:** Alta

Gestor de configuración para proveedores de firma electrónica cualificada.

**Características:**
- Configuración de proveedores (Cl@ve, ViafirmaPro)
- Ajustes de autenticación
- Gestión de credenciales API
- Toggle modo Test/Producción
- Monitoreo de estado de proveedores
- Validación de configuración
- Ajustes de seguridad

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Select, Switch, Tabs

**Componentes Relacionados:** QualifiedSignatureDialog, ApprovalFlowManager

**Hooks:** useKV, useState

---

### BoardPermitWorkflow
**Estado:** Estable | **Complejidad:** Alta

Gestor de workflow para solicitudes y seguimiento de permisos de construcción municipales.

**Características:**
- Creación de solicitudes de permiso
- Checklist de requisitos municipales
- Seguimiento de envío de documentos
- Workflow de estado
- Comentarios de revisión
- Seguimiento de aprobación
- Cálculo de tasas
- Seguimiento de línea temporal

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Table, Badge, Checkbox

**Componentes Relacionados:** MunicipalComplianceManager, DocumentManager

**Hooks:** useKV, useState

---

## Componentes de Diálogo

### ProjectDialog
**Estado:** Estable | **Complejidad:** Alta

Diálogo para crear y editar proyectos con flujo wizard multi-paso.

**Características:**
- Wizard multi-paso (Info Básica, Fases, Intervinientes, Estructura de Carpetas)
- Selección de fases con validación de porcentajes
- Asignación de intervinientes
- Selección de plantilla de estructura de carpetas
- Validación de formularios
- Guardado de borradores
- Soporte de modo edición

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onSave`: Callback de guardado
- `project`: Datos del proyecto (opcional, para edición)

**Dependencias:** Dialog, Form, Input, Select, Checkbox, Button, Tabs

**Componentes Relacionados:** Project, StakeholderDialog, FolderStructureDialog

**Hooks:** useState, useForm (react-hook-form)

---

### StakeholderDialog
**Estado:** Estable | **Complejidad:** Baja

Diálogo para crear y editar intervinientes del proyecto.

**Características:**
- Selección de tipo de interviniente
- Validación de NIF/CIF
- Campos de información de contacto
- Credenciales profesionales (número colegiado, titulación)
- Validación de formularios
- Soporte de modo edición

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onSave`: Callback de guardado
- `stakeholder`: Datos del interviniente (opcional, para edición)

**Dependencias:** Dialog, Input, Select, Button, Form

**Componentes Relacionados:** ProjectDialog, ProjectDetail

**Hooks:** useState, useForm

---

### MilestoneDialog
**Estado:** Estable | **Complejidad:** Baja

Diálogo para crear y editar hitos del proyecto con fechas y descripciones.

**Características:**
- Título y descripción del hito
- Selección de fecha
- Seguimiento de estado
- Asociación a proyecto
- Validación de formularios

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onSave`: Callback de guardado
- `projectId`: ID del proyecto
- `milestone`: Datos del hito (opcional, para edición)

**Dependencias:** Dialog, Input, Textarea, DatePicker, Button, Select

**Componentes Relacionados:** ProjectCalendar, ProjectDetail

**Hooks:** useState, useForm

---

### EmailConfigDialog
**Estado:** Estable | **Complejidad:** Media

Diálogo de configuración de servicio de email para ajustes SMTP.

**Características:**
- Configuración de servidor SMTP
- Ajustes de autenticación
- Envío de email de prueba
- Validación de configuración
- Almacenamiento seguro de credenciales

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado

**Dependencias:** Dialog, Input, Button, Switch

**Componentes Relacionados:** EmailLogsDialog

**Hooks:** useKV, useState

**APIs:** email-service

---

### EmailLogsDialog
**Estado:** Estable | **Complejidad:** Media

Visor de historial de envío de emails y estado de entrega.

**Características:**
- Lista de historial de emails
- Seguimiento de estado de entrega
- Visualización de log de errores
- Búsqueda y filtrado
- Vista previa de contenido de email
- Funcionalidad de reenvío

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado

**Dependencias:** Dialog, Table, Badge, Button, ScrollArea

**Componentes Relacionados:** EmailConfigDialog

**Hooks:** useKV, useState

---

### QualifiedSignatureDialog
**Estado:** Estable | **Complejidad:** Alta

Diálogo para crear firmas electrónicas cualificadas con integración de proveedores.

**Características:**
- Selección de proveedor (Cl@ve, ViafirmaPro)
- Selección de nivel de firma (Simple, Avanzada, Cualificada)
- Métodos de autenticación Cl@ve (PIN, Permanente, DNI-e, Certificado)
- Verificación OTP
- Selección de certificado
- Flujo de autenticación SAML
- Captura de metadatos de firma
- Badges de validez legal

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onSign`: Callback de firma
- `documentId`: ID del documento
- `documentTitle`: Título del documento

**Dependencias:** Dialog, Select, RadioGroup, Button, Input, Badge

**Componentes Relacionados:** QualifiedSignatureProviderManager, ApprovalFlowManager, DigitalSignaturePad

**Hooks:** useState

**APIs:** qualified-signature-service

---

### ProjectImportDialog
**Estado:** Estable | **Complejidad:** Alta

Importación de proyecto único desde estructura de carpetas con escaneo de documentos.

**Características:**
- Escaneo de estructura de carpetas
- Detección y categorización de documentos
- Extracción de metadatos
- Vista previa antes de importar
- Validación de importación
- Seguimiento de progreso

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onImportComplete`: Callback al completar importación

**Dependencias:** Dialog, Input, Button, Progress, ScrollArea

**Componentes Relacionados:** BulkProjectImportDialog, DocumentManager

**Hooks:** useState

---

### BulkProjectImportDialog
**Estado:** Estable | **Complejidad:** Alta

Importación masiva de proyectos desde múltiples carpetas con procesamiento batch.

**Características:**
- Escaneo de múltiples carpetas
- Detección de documentos en batch
- Procesamiento paralelo
- Gestión de cola de importación
- Manejo de errores por proyecto
- Visualización de progreso
- Reporte de resumen de importación

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onImportComplete`: Callback al completar importación

**Dependencias:** Dialog, Button, Progress, Table, ScrollArea

**Componentes Relacionados:** ProjectImportDialog, BulkProjectExportDialog

**Hooks:** useState

---

### BulkProjectExportDialog
**Estado:** Estable | **Complejidad:** Alta

Exportación masiva de proyectos a estructura de carpetas con empaquetado de documentos.

**Características:**
- Selección multi-proyecto
- Opciones de formato de exportación
- Empaquetado de documentos
- Exportación de metadatos
- Creación de archivo ZIP
- Seguimiento de progreso
- Resumen de exportación

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado

**Dependencias:** Dialog, Checkbox, Button, Progress, Select

**Componentes Relacionados:** BulkProjectImportDialog, ProjectExportDialog

**Hooks:** useKV, useState

---

## Componentes de Utilidad

### AIContentGenerator
**Estado:** Estable | **Complejidad:** Media

Diálogo de generación de contenido con IA para crear secciones de documentos personalizadas.

**Características:**
- Generación con IA consciente del contexto
- Selección de tono (Formal, Descriptivo, Conciso, Normativo)
- Control de longitud (Breve, Media, Detallada)
- Regeneración de contenido
- Copiar al portapapeles
- Estados de carga
- Manejo de errores con reintento

**Props:**
- `open`: Estado de apertura
- `onOpenChange`: Callback de cambio de estado
- `onGenerate`: Callback de generación
- `projectContext`: Contexto del proyecto
- `sectionTitle`: Título de la sección

**Dependencias:** Dialog, Textarea, Select, Button, RadioGroup

**Componentes Relacionados:** DocumentTemplateLibrary, DocumentTemplateWithAI

**Hooks:** useState

**APIs:** spark.llm, spark.llmPrompt

---

### AIRegulatoryAssistant
**Estado:** Estable | **Complejidad:** Media

Asistente con IA para consultas regulatorias e interpretación de códigos.

**Características:**
- Consultas regulatorias en lenguaje natural
- Interpretación de códigos
- Búsqueda de regulaciones
- Respuestas conscientes del contexto
- Referencias de citas
- Historial de consultas
- Experiencia en código de edificación español

**Props:** Ninguno

**Dependencias:** Dialog, Textarea, Button, ScrollArea, Card

**Componentes Relacionados:** ComplianceChecker, MunicipalComplianceManager

**Hooks:** useState

**APIs:** spark.llm, spark.llmPrompt

---

### DigitalSignaturePad
**Estado:** Estable | **Complejidad:** Media

Interfaz simple de captura de firma digital con opciones de dibujo y escritura.

**Características:**
- Dibujo de firma basado en canvas
- Opción de firma escrita
- Funcionalidad de limpiar y rehacer
- Vista previa de firma
- Captura automática de metadatos (timestamp, IP, user agent)
- Aceptación de términos legales

**Props:**
- `onSign`: Callback de firma
- `onCancel`: Callback de cancelación

**Dependencias:** Dialog, Button, Input, Checkbox

**Componentes Relacionados:** ApprovalFlowManager, QualifiedSignatureDialog

**Hooks:** useState, useRef

---

### VisualGuideViewer
**Estado:** Estable | **Complejidad:** Media

Visor de guías visuales paso a paso con capturas de pantalla y anotaciones.

**Características:**
- Navegación paso a paso
- Visualización de capturas de pantalla
- Anotaciones y resaltados
- Seguimiento de progreso
- Categorías de guías
- Búsqueda de guías
- Exportación a PDF

**Props:**
- `guideId`: ID de la guía

**Dependencias:** Dialog, Button, Card, Badge, Progress

**Componentes Relacionados:** UserManual

**Hooks:** useState

---

### ArchitectureDiagrams
**Estado:** Estable | **Complejidad:** Alta

Diagramas visuales de arquitectura y flujo para componentes del sistema y flujo de datos.

**Características:**
- Diagramas de relaciones entre componentes
- Visualizaciones de flujo de datos
- Arquitectura de módulos
- Puntos de integración
- Diagramas de flujo de API
- Diagramas de gestión de estado
- Exportar como SVG/PNG
- Navegación interactiva

**Props:** Ninguno

**Dependencias:** Dialog, Button, Tabs

**Componentes Relacionados:** DeveloperManual

**Hooks:** useState

---

### ComplianceReportGenerator
**Estado:** Estable | **Complejidad:** Alta

Genera reportes completos de cumplimiento desde datos de checklist.

**Características:**
- Generación de reporte PDF profesional
- Resumen de estado de cumplimiento
- Detalles de requisitos con estado
- Resaltados de no cumplimiento
- Citas de referencias regulatorias
- Branding personalizado
- Formatos de exportación (PDF, DOCX)

**Props:**
- `projectId`: ID del proyecto
- `checklistData`: Datos del checklist

**Dependencias:** Button, Select

**Componentes Relacionados:** ComplianceChecker, ComplianceReportEmailDialog

**Hooks:** useState

**APIs:** pdf-export

---

### OnlineDatabaseBrowser
**Estado:** Estable | **Complejidad:** Alta

Navegador de bases de datos de precios de construcción y referencias de códigos online.

**Características:**
- Selección de fuente de base de datos
- Búsqueda de precios
- Búsqueda de códigos
- Filtrado de resultados
- Comparación de precios
- Agregar a presupuesto
- Seguimiento de precios históricos

**Props:** Ninguno

**Dependencias:** Dialog, Input, Table, Button, Select

**Componentes Relacionados:** BudgetManager, PriceDatabaseDialog

**Hooks:** useState

---

### PGOUImporter
**Estado:** Estable | **Complejidad:** Alta

Importar y parsear documentos municipales PGOU (Plan General de Ordenación Urbana).

**Características:**
- Carga y parseo de PDF
- Extracción de regulaciones
- Clasificación de zonas
- Extracción de parámetros
- Auto-categorización
- Asociación a municipio

**Props:** Ninguno

**Dependencias:** Dialog, Input, Button, Progress

**Componentes Relacionados:** MunicipalComplianceManager

**Hooks:** useState

---

## Componentes UI Base

El sistema utiliza 40+ componentes shadcn v4 pre-instalados:

- **accordion**: Contenido expandible/colapsable
- **alert-dialog**: Diálogos de confirmación
- **alert**: Mensajes de alerta
- **avatar**: Imágenes de avatar de usuario
- **badge**: Indicadores de estado pequeños
- **button**: Botones con múltiples variantes
- **calendar**: Selector de fecha
- **card**: Contenedores con elevación
- **checkbox**: Inputs de selección
- **dialog**: Ventanas modales
- **dropdown-menu**: Menús desplegables
- **form**: Componentes de formulario
- **input**: Campos de entrada de texto
- **label**: Etiquetas de formulario
- **popover**: Overlays posicionados
- **progress**: Barras de progreso
- **radio-group**: Grupos de radio buttons
- **scroll-area**: Áreas scrollables
- **select**: Dropdowns de selección
- **separator**: Líneas divisorias
- **sheet**: Paneles laterales
- **skeleton**: Estados de carga
- **slider**: Inputs de rango
- **switch**: Toggle switches
- **table**: Tablas de datos
- **tabs**: Contenido con pestañas
- **textarea**: Inputs de texto multilínea
- **toast/sonner**: Notificaciones
- **tooltip**: Tooltips informativos
- Y más...

---

## Módulos Utilitarios

### types.ts
Definiciones TypeScript para todos los modelos de datos.

**Exporta:** Project, Stakeholder, Invoice, Client, Budget, Document, ComplianceCheck, VisaApplication, ApprovalFlow, Milestone, y más.

---

### utils.ts
Funciones y helpers de utilidad general.

**Exporta:** cn (class names), formatDate, formatCurrency, generateId

---

### email-service.ts
Servicio de envío de email con configuración SMTP.

**Exporta:** sendEmail, useEmailConfig, EmailConfig

---

### pdf-export.ts
Utilidades de generación y exportación de documentos PDF.

**Exporta:** exportToPDF, generateInvoicePDF, generateReportPDF

---

### project-export.ts
Funcionalidad de exportación de proyectos con empaquetado ZIP.

**Exporta:** exportProject, exportProjects, packageDocuments

---

### project-import.ts
Importación de proyectos desde estructuras de carpetas.

**Exporta:** importProject, scanFolder, detectDocuments

---

### document-utils.ts
Utilidades de manejo de documentos.

**Exporta:** generateDocumentName, extractMetadata, validateDocument

---

### invoice-utils.ts
Utilidades de cálculo y generación de facturas.

**Exporta:** calculateInvoiceTotal, generatePhaseCompletionInvoice, formatInvoiceNumber

---

### budget-utils.ts
Utilidades de cálculo de presupuestos.

**Exporta:** calculateBudgetTotal, calculateGG, calculateBI, calculateIVA

---

### bc3-parser.ts
Parser y generador de formato de archivo BC3.

**Exporta:** parseBC3, generateBC3, BC3Data

---

### compliance-data.ts
Base de datos de requisitos de cumplimiento y reglas.

**Exporta:** COMPLIANCE_REQUIREMENTS, generateChecklist, filterRequirements

---

### municipal-compliance.ts
Datos y utilidades de cumplimiento municipal.

**Exporta:** MUNICIPALITIES, getMunicipalRequirements, applyMunicipalRequirements

---

### regulatory-data.ts
Base de datos de referencia de código de edificación español.

**Exporta:** CTE_REFERENCES, RITE_REFERENCES, REBT_REFERENCES, searchRegulation

---

### visa-utils.ts
Utilidades y cálculos de visado profesional.

**Exporta:** calculateVisaFee, validateVisaDocuments, VISA_REQUIREMENTS

---

### visa-validation.ts
Reglas de validación de documentos de visado.

**Exporta:** validateDocumentSize, validateDocumentFormat, checkRequirements

---

### document-templates.ts
Definiciones y contenido de plantillas de documentos.

**Exporta:** DOCUMENT_TEMPLATES, getTemplate, fillTemplate

---

### approval-types.ts
Definiciones de tipos de flujo de aprobación.

**Exporta:** ApprovalFlow, ApprovalStep, FlowType, ApprovalStatus

---

### approval-utils.ts
Utilidades de workflow de aprobación.

**Exporta:** validateFlowProgress, canApprove, isFlowComplete

---

### qualified-signature-types.ts
Definiciones de tipos de firma cualificada.

**Exporta:** SignatureProvider, SignatureLevel, SignatureRequest, SignatureMetadata

---

### qualified-signature-service.ts
Integración de servicio de firma electrónica cualificada.

**Exporta:** createSignatureRequest, verifySignature, getProviderConfig

---

### visual-guides-data.ts
Contenido y estructura de guías visuales.

**Exporta:** VISUAL_GUIDES, getGuide, searchGuides

---

### visual-guide-export.ts
Utilidades de exportación de guías visuales.

**Exporta:** exportGuideToPDF, exportGuideToMarkdown

---

### budget-prices.ts
Base de datos de precios de construcción.

**Exporta:** PRICE_DATABASE, searchPrices, getPriceByCode

---

### ai-regulatory.ts
Integración de asistente regulatorio con IA.

**Exporta:** queryRegulation, interpretCode, generateResponse

---

## Arquitectura del Sistema

### Estructura de Datos
El sistema utiliza `useKV` de Spark para persistencia de datos:
- Proyectos (projects)
- Clientes (clients)
- Intervinientes (stakeholders)
- Facturas (invoices)
- Presupuestos (budgets)
- Documentos (documents)
- Checklists de Cumplimiento (compliance-checklists)
- Municipios (municipalities)
- Solicitudes de Visado (visa-applications)
- Flujos de Aprobación (approval-flows)
- Hitos (project-milestones)

### Flujo de Datos
1. **Usuario interactúa** → Componente UI
2. **Componente** → useKV hook para persistencia
3. **useKV** → Spark KV API
4. **Actualizaciones** → Reactivas vía React state

### Integraciones API
- **Spark LLM**: Generación de contenido con IA
- **Spark KV**: Almacenamiento persistente
- **Spark User**: Información de usuario
- **Servicios externos**: Cl@ve, ViafirmaPro (firma cualificada)

### Stack Tecnológico
- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui v4
- **Formularios**: react-hook-form + zod
- **Animaciones**: Framer Motion
- **Iconos**: Phosphor Icons
- **PDFs**: jsPDF
- **Fechas**: date-fns
- **Tipografía**: Space Grotesk + IBM Plex Sans

---

## Estadísticas del Sistema

- **Total de Componentes**: 45+
- **Componentes de Negocio**: 12
- **Componentes de Gestión**: 10
- **Componentes de Diálogo**: 10
- **Componentes de Utilidad**: 9
- **Componentes UI Base**: 40+
- **Módulos Utilitarios**: 25+
- **Componentes Estables**: 100%
- **Complejidad Alta**: 28 componentes
- **Complejidad Media**: 12 componentes
- **Complejidad Baja**: 5 componentes

---

## Conclusión

AFO CORE MANAGER es un sistema completo de gestión arquitectónica con más de 45 componentes personalizados, 40+ componentes UI base, y 25+ módulos utilitarios. El sistema cubre todo el ciclo de vida del proyecto arquitectónico desde la creación hasta la facturación, cumplimiento normativo, gestión documental, visados colegiales, y firma electrónica cualificada.

Todos los componentes están diseñados siguiendo los principios de React, TypeScript, y las mejores prácticas de desarrollo moderno, con persistencia de datos robusta, validación completa, y experiencia de usuario pulida.

---

**Documentación generada automáticamente por ComponentRegistry**  
**© 2024 AFO CORE MANAGER - Sistema de Gestión Integral Arquitectónica**
