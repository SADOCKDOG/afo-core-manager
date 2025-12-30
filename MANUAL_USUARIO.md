# 📖 MANUAL DE USUARIO - AFO CORE MANAGER

**Versión:** 1.0  
**Fecha:** Diciembre 2024

---

## 🎯 ÍNDICE RÁPIDO

1. [Introducción](#introducción)
2. [Dashboard](#dashboard)
3. [Gestión de Proyectos](#gestión-de-proyectos)
4. [Gestión Documental](#gestión-documental)
5. [Cumplimiento Normativo](#cumplimiento-normativo)
6. [Clientes y Facturación](#clientes-y-facturación)
7. [Presupuestos](#presupuestos)
8. [Visados](#visados)
9. [Flujos de Aprobación](#flujos-de-aprobación)
10. [Firma Digital](#firma-digital)
11. [Calendario](#calendario)
12. [Herramientas](#herramientas)

---

## 📘 INTRODUCCIÓN

**AFO CORE MANAGER** es una plataforma integral para arquitectos autónomos que centraliza:
- ✅ Gestión de proyectos
- ✅ Control documental ISO 19650-2
- ✅ Cumplimiento normativo con IA
- ✅ Facturación automática
- ✅ Flujos de aprobación y firma digital
- ✅ Gestión de clientes y presupuestos

### Acceso Rápido
- **Menú principal:** Navegación por módulos (Dashboard, Proyectos, Calendario, Clientes, Facturas)
- **Herramientas:** Menú desplegable con funciones avanzadas
- **Ayuda:** Botón "Ayuda" con manual interactivo completo

---

## 🏠 DASHBOARD

**Ubicación:** Pantalla principal al iniciar

### Qué muestra
- Total de proyectos activos/archivados
- Número de clientes
- Ingresos totales y facturas pendientes
- Próximos hitos
- Presupuestos aprobados/pendientes

### Cómo usar
1. Revisa las métricas en las tarjetas superiores
2. Haz clic en cualquier tarjeta para navegar al módulo
3. Verifica facturas vencidas y hitos próximos

---

## 🏗️ GESTIÓN DE PROYECTOS

**Ubicación:** Menú > Proyectos

### Crear Proyecto
1. Clic en **"Nuevo Proyecto"**
2. Completa: título, ubicación, descripción
3. Define **fases contratadas** con porcentajes
4. Asigna **intervinientes** (arquitectos, ingenieros)
5. Vincula **cliente** y crea **presupuesto**

### Gestionar Fases
- Marca fases como: Pendiente → En progreso → Completada
- **Al completar una fase:** Se genera automáticamente una factura

### Vista Detallada
Pestañas disponibles:
- **General:** Info del proyecto
- **Documentos:** Gestión documental
- **Cumplimiento:** Checklist normativo
- **Presupuestos:** Gestión de presupuestos
- **Facturas:** Facturas asociadas
- **Visados:** Trámites colegiales

### Filtros
- Todos / Activos / Archivados

### Importar/Exportar
- **Importar:** Herramientas > Importar Proyecto
- **Exportar:** Herramientas > Exportar Proyectos

---

## 📄 GESTIÓN DOCUMENTAL

**Ubicación:** Dentro de cada proyecto > Pestaña Documentos

### Características
- **Versionado ISO 19650-2:** P01, P02 (trabajo) / C01, C02 (compartido)
- **Nomenclatura automática:** Proyecto-Disciplina-Descripción
- **10 disciplinas:** ARQ, EST, INS, ELE, CLI, PCI, URB, MED, CAL, SEG
- **Búsqueda en tiempo real**
- **Subida individual y masiva**

### Subir Documentos
**Individual:**
1. Clic en "Subir Documento"
2. Completa metadatos
3. Selecciona archivo

**Masiva:**
1. Arrastra múltiples archivos a la zona drop
2. Se suben automáticamente

### Buscar Documentos
- Usa la barra de búsqueda
- Filtra por: disciplina, tipo, estado, carpeta

### Generar Documentos con IA
1. Herramientas > Plantillas de Documentos
2. Selecciona plantilla (Memoria, Pliego, etc.)
3. La IA genera contenido contextual
4. Edita y guarda

### Utilidades PDF
**Vista previa mejorada:**
- Fuente legible (14px)
- Scroll optimizado

**Exportar a PDF:**
- Optimización para impresión
- Compresión inteligente
- Fusión de múltiples PDFs

---

## 📚 CUMPLIMIENTO NORMATIVO

**Ubicación:** Proyecto > Pestaña Cumplimiento

### Asistente IA Regulatorio
**Ubicación:** Herramientas > Asistente IA Regulatorio

**Cómo usar:**
1. Escribe tu consulta en lenguaje natural
2. Ej: "¿Qué dice el CTE sobre ventilación en dormitorios?"
3. Recibe respuesta con referencias exactas
4. Base de conocimiento: CTE, RITE, REBT

### Checklist Automático
- **40+ requisitos** filtrados por tipo de edificio
- Cubre: CTE (DB-SE, DB-SI, DB-SUA, DB-HS, DB-HR, DB-HE), RITE, REBT
- Marca cada requisito como cumplido/no cumplido
- Estado general del proyecto

### Generar Informes
1. Clic en "Generar Informe"
2. Selecciona requisitos
3. Exporta a PDF
4. Envía por email

---

## 💼 CLIENTES Y FACTURACIÓN

### Gestión de Clientes
**Ubicación:** Herramientas > Clientes

**Crear Cliente:**
1. Clic en "Nuevo Cliente"
2. Completa: nombre/razón social, NIF, dirección
3. Añade datos de facturación
4. Guarda

**Vincular a Proyecto:**
- Al crear proyecto, selecciona cliente de la lista

### Facturación
**Ubicación:** Menú > Facturas o Herramientas > Gestión de Facturas

**Facturación Automática:**
- Al completar una fase del proyecto
- Sistema calcula importe según presupuesto
- Puedes editar antes de confirmar

**Factura Manual:**
1. Clic en "Nueva Factura"
2. Selecciona cliente y proyecto
3. Añade conceptos
4. Sistema calcula IVA/retenciones
5. Guarda como borrador o emite

**Estados:**
- Borrador → Emitida → Pagada
- Vencida (si pasa fecha de vencimiento)

**Enviar Factura:**
1. Selecciona factura
2. Clic en "Enviar por Email"
3. Revisa plantilla
4. Envía

---

## 💰 PRESUPUESTOS

**Ubicación:** Proyecto > Pestaña Presupuestos

### Crear Presupuesto
1. Clic en "Nuevo Presupuesto"
2. Añade partidas manualmente o importa BC3
3. Sistema calcula PEM automáticamente
4. Define honorarios

### Importar BC3
1. Herramientas > Importar BC3
2. Selecciona archivo Presto
3. Sistema extrae partidas automáticamente

### Aprobar Presupuesto
- Marca como "Aprobado"
- **Activa facturación automática por fases**

---

## 🎓 VISADOS

**Ubicación:** Herramientas > Visados

### Crear Solicitud
1. Clic en "Nueva Solicitud"
2. Vincula proyecto
3. Selecciona tipo de visado
4. Completa checklist de documentación
5. Actualiza estado según tramitación

### Estados
- Preparación → Solicitado → En revisión → Aprobado/Denegado

---

## ✅ FLUJOS DE APROBACIÓN

**Ubicación:** Herramientas > Flujos de Aprobación

### Crear Plantilla de Flujo
1. Clic en "Nueva Plantilla"
2. Define nombre (ej: "Revisión Proyecto Básico")
3. Añade pasos:
   - **Secuencial:** Uno tras otro
   - **Paralelo:** Simultáneos
4. Asigna aprobadores a cada paso
5. Guarda plantilla

### Aplicar Flujo a Documento
1. Selecciona documento
2. Clic en "Iniciar Flujo"
3. Elige plantilla
4. Sistema notifica a aprobadores

### Seguimiento
- Ver estado de cada aprobación
- Notificaciones por email
- Historial completo

---

## 🔐 FIRMA DIGITAL CUALIFICADA

**Ubicación:** Herramientas > Firma Cualificada

### Configurar Proveedor
1. Herramientas > Proveedores de Firma
2. Añade credenciales de Cl@ve o ViafirmaPro
3. Prueba conexión

### Solicitar Firma
1. Selecciona documento
2. Clic en "Solicitar Firma"
3. Especifica firmantes con emails
4. Envía notificaciones

### Seguimiento
- Ver estado de cada firma
- Descargar documento firmado
- Validez legal según eIDAS

**⚠️ Advertencia:** Las firmas cualificadas tienen validez legal. Úsalas solo en documentos oficiales.

---

## 📅 CALENDARIO

**Ubicación:** Menú > Calendario

### Funcionalidades
- Vista mensual de todos los proyectos
- Hitos destacados
- Fechas de vencimiento de facturas
- Código de colores por tipo de evento

### Navegación
- Flechas para cambiar de mes
- Clic en evento para ver detalles

---

## 🛠️ HERRAMIENTAS

### Configuración de Email
**Ubicación:** Herramientas > Configurar Email

**Configurar SMTP:**
1. Introduce servidor SMTP
2. Usuario y contraseña
3. Puerto y seguridad
4. Prueba conexión

**💡 Consejo:** Usa contraseña de aplicación, no tu contraseña principal.

### Importación/Exportación

**Importar Proyecto:**
1. Herramientas > Importar Proyecto
2. Sigue wizard de 3 pasos
3. Selecciona carpeta
4. Sistema escanea documentos

**Importación Múltiple:**
- Para migrar varios proyectos a la vez

**Exportar Proyectos:**
- Descarga en formato ZIP
- Incluye toda la documentación
- Útil para backups

### Registro de Emails
**Ubicación:** Herramientas > Registro de Emails

- Historial de todos los emails enviados
- Estados de entrega
- Auditoría completa

---

## 💡 CONSEJOS Y BUENAS PRÁCTICAS

### Seguridad
- 🔐 Usa contraseñas de aplicación para email
- 💾 Exporta proyectos semanalmente (backup)
- 🔒 No compartas credenciales de firma

### Organización
- 🏷️ Usa nombres descriptivos en documentos
- 📋 Completa checklist en cada fase
- 🗂️ Organiza por disciplina desde el inicio

### Eficiencia
- ⚡ Vincula presupuesto aprobado para automatización
- ✅ Marca fases completadas inmediatamente
- 🔄 Usa plantillas de flujo para procesos recurrentes

### Calidad
- 📊 Revisa Dashboard diariamente
- 📄 Genera informes de cumplimiento periódicamente
- 🔖 Mantén control de versiones estricto (P01, P02)

---

## ❓ AYUDA ADICIONAL

### Manual Interactivo
- Clic en botón **"Ayuda"** en la barra superior
- Búsqueda integrada
- Organizado por categorías
- Ejemplos paso a paso

### Asistente IA
- Consulta normativas en tiempo real
- Genera contenido de documentos
- Asistencia contextual

---

## 📞 SOPORTE

Para dudas técnicas o sugerencias:
- Consulta el manual interactivo (botón "Ayuda")
- Usa el Asistente IA Regulatorio
- Revisa los documentos MD en la raíz del proyecto

**Versión del manual:** 1.0  
**Última actualización:** Diciembre 2024
