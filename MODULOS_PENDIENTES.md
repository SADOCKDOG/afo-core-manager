# Módulos Pendientes de Implementación - AFO CORE MANAGER

## Resumen Ejecutivo

Basándose en el **Informe de Funcionalidades Estratégicas** original y el análisis del estado actual de la aplicación, se ha identificado qué funcionalidades están **implementadas** y cuáles quedan **pendientes** para alcanzar la visión completa de AFO CORE MANAGER como herramienta líder para arquitectos autónomos en España.

---

## Estado Actual: Módulos Implementados ✅

### Módulo 1: Gestión de Proyectos y Clientes (Panel de Control Principal)
**Estado: ✅ IMPLEMENTADO (80%)**

**Funcionalidades completadas:**
- ✅ Creación de proyectos con datos completos
- ✅ Gestión de intervinientes (Promotor, Arquitecto, Técnicos) con registro reutilizable
- ✅ Definición de fases contratadas con porcentajes de participación
- ✅ Dashboard con vista de tarjetas de proyectos
- ✅ Filtrado por estado (Todos, Activos, Archivados)
- ✅ Vista de detalle de proyecto
- ✅ Seguimiento de progreso por fases
- ✅ Persistencia de datos con useKV

**Funcionalidades pendientes:**
- ❌ Vistas múltiples (Cronograma/Gantt, Kanban, Calendario)
- ❌ Sistema de hitos con listas de control (checklists) de tareas
- ❌ Asignación de responsables y fechas límite a tareas
- ❌ Portal de cliente con compartición de documentos
- ❌ Control de permisos personalizado para clientes
- ❌ Sistema de comentarios y aprobaciones

---

### Módulo 2: Gestor Inteligente de Documentos y Archivos
**Estado: ✅ IMPLEMENTADO (75%)**

**Funcionalidades completadas:**
- ✅ Estructura de carpetas automatizada (Por Tipo / Screaming Architecture)
- ✅ Nomenclatura estandarizada ISO19650-2
- ✅ Control de versiones con estados (P01, P02, C01)
- ✅ Gestión de metadatos (disciplina, tipo, descripción)
- ✅ Búsqueda avanzada con múltiples criterios
- ✅ Filtrado por tipo, estado, disciplina, carpeta
- ✅ Subida masiva (bulk upload) con drag-and-drop
- ✅ Plantillas de documentos arquitectónicos (8+ tipos)
- ✅ Generación de contenido con IA para secciones personalizadas
- ✅ Gestión de revisiones (vistas y ediciones)

**Funcionalidades pendientes:**
- ❌ Utilidad de separación de PDFs grandes (>80MB)
- ❌ Advertencia de invalidación de firmas digitales
- ❌ Integración con software de modelado 3D (SketchUp, AutoCAD)
- ❌ Sincronización bidireccional de archivos DWG/RVT
- ❌ Previsualización de planos en navegador
- ❌ Comparación visual entre versiones de planos
- ❌ Sistema de firma digital integrado
- ❌ Trazabilidad completa de cambios documentales

---

### Módulo 3: Base de Conocimiento Normativo y Técnico
**Estado: ✅ IMPLEMENTADO (60%)**

**Funcionalidades completadas:**
- ✅ Asistente regulatorio con IA (AIRegulatoryAssistant)
- ✅ Consulta contextual de CTE, RITE, REBT
- ✅ Generador de checklist de cumplimiento automatizado (40+ requisitos)
- ✅ Búsqueda por parámetros técnicos
- ✅ Referencias exactas a artículos normativos
- ✅ Gestión de normativa municipal con aplicación a proyectos
- ✅ Importación de requisitos de PGOU desde PDF
- ✅ Categorización por disciplina normativa (12 categorías nacionales + municipales)
- ✅ Filtrado inteligente por tipo de edificio y uso
- ✅ Seguimiento de cumplimiento con estados y notas

**Funcionalidades pendientes:**
- ❌ Biblioteca normativa completa descargable (PDF de DB completos)
- ❌ Navegación estructurada por documento (CTE índice completo)
- ❌ Búsqueda semántica avanzada en texto completo de normativa
- ❌ Asistente de cumplimiento geográfico con coeficientes Ca por provincia
- ❌ Integración con tablas de valoración de honorarios por Colegio
- ❌ Sistema de alertas de cambios normativos
- ❌ Historial de versiones de CTE/RITE/REBT
- ❌ Legislación de costas y servidumbres sectoriales completa
- ❌ Comparador entre versiones de normativa (ej: CTE 2006 vs 2019)
- ❌ Marcadores personalizados en artículos frecuentes

---

## Módulos Completamente Pendientes ❌

### Módulo 4: Presupuestos, Facturación y Control Financiero
**Estado: ❌ NO IMPLEMENTADO (0%)**

Este es uno de los módulos más críticos para la viabilidad comercial del producto, ya que aborda directamente la gestión económica del estudio.

**Funcionalidades necesarias:**

#### 4.1 Generador de Presupuestos de Ejecución Material (PEM)
- ❌ Fichas de obra con desglose por capítulos
- ❌ Banco de precios personalizable
- ❌ Imputación de costes por partida
- ❌ Costes de materiales y mano de obra separados
- ❌ Cálculo automático de gastos generales y beneficio industrial
- ❌ Generación de presupuesto formato BC3/FIEBDC
- ❌ Análisis de desviaciones (Presupuestado vs Ejecutado)
- ❌ Comparador de presupuestos de contratistas
- ❌ Curvas de inversión previstas

#### 4.2 Módulo de Facturación Profesional
- ❌ Definición de tarifas de honorarios por fase
- ❌ Cálculo automático según baremos colegiales
- ❌ Generación de facturas profesionales
- ❌ Vinculación de facturas a hitos de proyecto
- ❌ Recordatorios automáticos de pago (Late Payments)
- ❌ Incentivos por pronto pago configurables
- ❌ Registro de anticipos y certificaciones
- ❌ Emisión de facturas rectificativas
- ❌ Integración con plataformas de facturación electrónica
- ❌ Serie de facturación anual con numeración consecutiva

#### 4.3 Control de Tiempo y Gastos
- ❌ Time tracking por proyecto y tarea
- ❌ Registro de gastos reembolsables (desplazamientos, materiales)
- ❌ Gestión de kilometraje con cálculo automático
- ❌ Captura de tickets y facturas con OCR
- ❌ Aprobación de gastos por cliente
- ❌ Repercusión automática en facturación

#### 4.4 Informes Financieros y Analítica
- ❌ Dashboard financiero por proyecto
- ❌ Dashboard consolidado del estudio
- ❌ Informe de rentabilidad por proyecto (margen real)
- ❌ Análisis de cobros pendientes (aging report)
- ❌ Proyección de flujo de caja (cash flow forecast)
- ❌ Comparativa de rentabilidad entre proyectos
- ❌ Métricas clave (KPIs): facturación mensual, tiempo medio de cobro, margen promedio
- ❌ Exportación a Excel/CSV para contabilidad externa
- ❌ Integración con software de contabilidad (Sage, A3)

**Prioridad:** 🔴 **ALTA** - Esencial para monetización y adopción profesional

---

### Módulo 5: Gestor de Trámites Administrativos y Colegiales
**Estado: ❌ NO IMPLEMENTADO (0%)**

Módulo diferenciador que simplifica la burocracia administrativa española, uno de los mayores puntos de dolor del sector.

**Funcionalidades necesarias:**

#### 5.1 Asistente de Tipo de Trámite
- ❌ Cuestionario guiado para determinar procedimiento aplicable
- ❌ Diferenciación clara: Licencia de Obras vs Declaración Responsable
- ❌ Explicación de requisitos según tipo de obra
- ❌ Clasificación por categorías (Obra Mayor, Obra Menor, etc.)
- ❌ Umbrales económicos y volumétricos por municipio
- ❌ Recomendación de documentación necesaria

#### 5.2 Plataforma de Visado Colegial (Simulación COAM/COACM)
- ❌ **Paso 1: Comunicación de Encargo**
  - Formulario digital con campos obligatorios del COAM
  - Selección de fases contratadas con porcentajes
  - Definición de intervinientes desde registro
  - Cálculo automático de honorarios según baremo
  
- ❌ **Paso 2: Preparación Documental**
  - Checklist de documentos requeridos por tipo de proyecto
  - Portal de subida con verificación automática
  - Validación de formato (PDF-A, tamaño <80MB)
  - Comprobación de metadatos obligatorios
  - Verificación de firmas digitales
  
- ❌ **Paso 3: Presentación Telemática**
  - Generación de expediente con numeración
  - Justificante de presentación
  - Cálculo de tasas colegiales
  - Pasarela de pago integrada
  
- ❌ **Paso 4: Seguimiento de Estado**
  - Panel con estados: Requerido / Pendiente Pago / Pendiente Retirar / Visado
  - Notificaciones de cambio de estado
  - Visualización de motivos de requerimiento
  - Plazo restante para subsanación
  - Descarga de expediente visado

#### 5.3 Gestor de Licencias Municipales
- ❌ Preparación de expediente de licencia urbanística
- ❌ Checklist de documentos según PGOU del municipio
- ❌ Cálculo de tasas municipales (ICIO, licencia)
- ❌ Generación de impresos municipales
- ❌ Seguimiento de expediente municipal
- ❌ Registro de requerimientos y subsanaciones
- ❌ Control de plazos (silencio administrativo)

#### 5.4 Integración con Organismos Públicos
- ❌ Conexión API con sedes electrónicas de Colegios
- ❌ Conexión API con sedes electrónicas municipales
- ❌ Presentación telemática automatizada
- ❌ Descarga automática de resoluciones
- ❌ Sincronización de estado de expedientes
- ❌ Certificados digitales integrados

#### 5.5 Archivo y Conservación Legal
- ❌ Sistema de archivado de proyectos finalizados
- ❌ Clasificación por periodo de conservación:
  - Documentación fiscal: 4 años
  - Documentación laboral: 5 años  
  - Responsabilidad civil: 10 años
  - Responsabilidad decenal: 10 años desde recepción obra
- ❌ Recordatorios de fin de periodo de conservación
- ❌ Eliminación segura con certificado de destrucción
- ❌ Cumplimiento RGPD en archivado

**Prioridad:** 🟠 **MEDIA-ALTA** - Diferenciador competitivo importante

---

## Funcionalidades Transversales Pendientes ⚙️

### Automatización de Flujos de Trabajo
**Estado: ❌ NO IMPLEMENTADO (0%)**

Motor de automatización tipo Zapier/Make integrado en la aplicación.

**Funcionalidades necesarias:**
- ❌ Constructor visual de automatizaciones "SI/CUANDO...ENTONCES"
- ❌ Biblioteca de triggers:
  - Finalización de tarea/hito
  - Cambio de estado de proyecto
  - Subida de documento
  - Fecha programada
  - Vencimiento de plazo
  
- ❌ Biblioteca de acciones:
  - Generar factura borrador
  - Enviar notificación por email
  - Crear tarea en calendario
  - Actualizar estado de fase
  - Generar informe automático
  - Enviar recordatorio a cliente
  
- ❌ Plantillas de automatización predefinidas:
  - "Facturar al completar fase"
  - "Recordar inspección RITE anual"
  - "Informe mensual a promotor"
  - "Alerta de próximo vencimiento de licencia"

**Prioridad:** 🟡 **MEDIA** - Aumenta eficiencia operativa significativamente

---

### Integraciones Nativas con Software Especializado
**Estado: ❌ NO IMPLEMENTADO (0%)**

Conexiones con el ecosistema de herramientas del arquitecto.

**Integraciones prioritarias:**

#### Software de Modelado 3D/CAD
- ❌ **AutoCAD / BricsCAD**
  - Sincronización de archivos DWG/DXF
  - Extracción automática de metadatos (layout, escala)
  - Generación de nomenclatura automática desde xrefs
  
- ❌ **SketchUp**
  - Importación de modelos SKP
  - Extracción de renders automática
  - Versionado de modelos 3D
  
- ❌ **Revit / ArchiCAD** (BIM)
  - Sincronización de archivos RVT/PLA
  - Extracción de tablas de planificación
  - Exportación de BCF para coordinación

#### Software de Maquetación
- ❌ **Adobe InDesign**
  - Exportación de planos organizados
  - Plantillas de paneles pre-configuradas
  
- ❌ **Microsoft Publisher**
  - Generación de memorias con formato corporativo

#### Software de Contabilidad
- ❌ **Sage 50 / ContaPlus**
  - Sincronización de facturas emitidas
  - Exportación de asientos contables
  
- ❌ **A3 / Navision**
  - Integración con ERP para estudios grandes

#### Almacenamiento en la nube
- ❌ **Dropbox / Google Drive / OneDrive**
  - Sincronización bidireccional de carpetas de proyecto
  - Respaldo automático en la nube

**Prioridad:** 🟡 **MEDIA** - Elimina silos entre herramientas

---

### Panel de Control Personalizable
**Estado: ❌ NO IMPLEMENTADO (0%)**

Dashboard modular y adaptable a las necesidades de cada usuario.

**Funcionalidades necesarias:**
- ❌ Widgets arrastrables y redimensionables
- ❌ Biblioteca de widgets disponibles:
  - Progreso de proyectos activos
  - Próximas fechas límite
  - Estado de facturas (cobradas/pendientes)
  - Alertas normativas
  - Gráfico de facturación mensual
  - Tareas del día
  - Últimos documentos modificados
  - Estado de trámites colegiales
  
- ❌ Configuración por usuario (layouts personalizados)
- ❌ Guardado de múltiples layouts (ej: "Vista Financiera", "Vista Técnica")
- ❌ Exportación de dashboard a PDF para reuniones

**Prioridad:** 🟢 **BAJA-MEDIA** - Mejora UX pero no crítico

---

### Sistema de Notificaciones y Alertas
**Estado: ⚠️ PARCIALMENTE IMPLEMENTADO (30%)**

**Implementado:**
- ✅ Toast notifications básicas (sonner)
- ✅ Confirmaciones de acciones (guardar, eliminar)

**Pendiente:**
- ❌ Centro de notificaciones persistente
- ❌ Notificaciones por email
- ❌ Alertas de cambios normativos (CTE/RITE actualizados)
- ❌ Recordatorios de plazos (licencias, inspecciones)
- ❌ Notificaciones de requerimientos colegiales
- ❌ Alertas de facturas vencidas
- ❌ Configuración de preferencias de notificación

**Prioridad:** 🟡 **MEDIA** - Importante para proactividad

---

### Gestión de Usuarios y Permisos (Multiusuario)
**Estado: ❌ NO IMPLEMENTADO (0%)**

Para estudios con varios arquitectos o colaboradores.

**Funcionalidades necesarias:**
- ❌ Roles y permisos (Admin, Arquitecto, Colaborador, Cliente)
- ❌ Invitación de usuarios por email
- ❌ Asignación de proyectos a usuarios
- ❌ Control de acceso por proyecto
- ❌ Registro de actividad (audit log)
- ❌ Gestión de licencias/suscripciones por estudio

**Prioridad:** 🟢 **BAJA** - Relevante para escalabilidad pero no MVP

---

## Priorización Estratégica para Próximas Iteraciones

### Fase 1: Viabilidad Comercial (Iteraciones 12-20)
**Objetivo:** Hacer la aplicación económicamente viable para arquitectos

1. **🔴 CRÍTICO: Módulo 4 - Facturación Básica**
   - Generador de facturas profesionales
   - Cálculo de honorarios según fases
   - Seguimiento de cobros
   - **Justificación:** Sin esto, los arquitectos no pueden gestionar su negocio completamente

2. **🔴 CRÍTICO: Módulo 4 - Presupuestos Básicos**
   - Generador de PEM con banco de precios
   - Exportación formato BC3
   - **Justificación:** Esencial para proyectos de ejecución

3. **🟠 IMPORTANTE: Módulo 5 - Visado COAM**
   - Comunicación de encargo
   - Preparación documental
   - Seguimiento de estado
   - **Justificación:** Trámite obligatorio que consume mucho tiempo

### Fase 2: Diferenciación Competitiva (Iteraciones 21-30)
**Objetivo:** Características únicas que no ofrece la competencia

4. **🟠 IMPORTANTE: Automatización de Flujos**
   - Motor de reglas básicas
   - 5-10 automatizaciones predefinidas
   - **Justificación:** Gran ahorro de tiempo, diferenciador clave

5. **🟠 IMPORTANTE: Módulo 5 - Licencias Municipales**
   - Asistente de tipo de trámite
   - Preparación de expedientes
   - Seguimiento
   - **Justificación:** Complementa visado colegial para ciclo completo

6. **🟡 DESEABLE: Integraciones CAD Básicas**
   - AutoCAD / SketchUp (solo importación)
   - **Justificación:** Mejora flujo de documentos

### Fase 3: Excelencia Operativa (Iteraciones 31-40)
**Objetivo:** Perfeccionar experiencia y eficiencia

7. **🟡 DESEABLE: Panel Personalizable**
   - Widgets básicos
   - Configuración de layout
   - **Justificación:** Mejora satisfacción usuario

8. **🟡 DESEABLE: Módulo 4 - Informes Financieros**
   - Dashboard de rentabilidad
   - Análisis de proyectos
   - **Justificación:** Toma de decisiones informada

9. **🟡 DESEABLE: Sistema de Notificaciones**
   - Centro de notificaciones
   - Emails automáticos
   - **Justificación:** Reduce olvidos y mejora seguimiento

10. **🟢 OPCIONAL: Multiusuario**
    - Roles básicos
    - Compartición de proyectos
    - **Justificación:** Escalabilidad para estudios grandes

---

## Resumen de Cobertura por Módulo

| Módulo | Implementación | Prioridad | Iteración Sugerida |
|--------|----------------|-----------|-------------------|
| **1. Gestión de Proyectos** | ✅ 80% | 🔴 Completar vistas múltiples | 12-14 |
| **2. Gestor de Documentos** | ✅ 75% | 🟡 Completar utilidades | 15-16 |
| **3. Base Normativa** | ✅ 60% | 🟠 Añadir biblioteca completa | 17-19 |
| **4. Presupuestos & Facturación** | ❌ 0% | 🔴 **CRÍTICO** | **12-18** |
| **5. Trámites Colegiales** | ❌ 0% | 🟠 **IMPORTANTE** | **19-25** |
| **Automatización** | ❌ 0% | 🟠 Diferenciador clave | 21-24 |
| **Integraciones** | ❌ 0% | 🟡 Complementario | 26-30 |
| **Dashboard Personalizable** | ❌ 0% | 🟡 UX mejorada | 31-33 |
| **Notificaciones** | ⚠️ 30% | 🟡 Proactividad | 34-35 |
| **Multiusuario** | ❌ 0% | 🟢 Escalabilidad | 36-40 |

---

## Conclusión

**AFO CORE MANAGER ha logrado implementar con éxito el núcleo central de gestión de proyectos y documentación (Módulos 1-3), con especial énfasis en cumplimiento normativo y requisitos municipales. Sin embargo, para alcanzar su visión de herramienta líder del mercado, es crítico completar el Módulo 4 (Facturación) y el Módulo 5 (Trámites), que son los diferenciadores clave y requisitos básicos para la adopción profesional.**

**El enfoque recomendado es:**
1. **Iteraciones 12-18:** Completar módulo financiero básico (facturación + PEM)
2. **Iteraciones 19-25:** Implementar visado colegial y licencias
3. **Iteraciones 26-30:** Añadir automatización e integraciones
4. **Iteraciones 31-40:** Pulir UX y añadir funcionalidades avanzadas

**Porcentaje de Implementación Total: ~35% del informe original completado**

---

*Documento generado: Diciembre 2024*  
*Basado en: Informe de Funcionalidades Estratégicas AFO CORE MANAGER + Análisis de codebase actual*
