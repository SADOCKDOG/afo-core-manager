# Sistema de Gestión de Visado Colegial con Validación de Documentos

## Descripción General

El sistema de **Gestión de Visado Colegial** es un módulo profesional que permite a los arquitectos gestionar el proceso completo de obtención del visado del colegio profesional, incluyendo:

- ✅ Creación de solicitudes de visado por proyecto
- 📄 Validación automática de documentos
- 🔍 Verificación de requisitos normativos
- 📊 Seguimiento del estado del trámite
- ✓ Checklist de presentación

## Características Principales

### 1. Gestión de Solicitudes de Visado

#### Crear Nueva Solicitud
- Selección del proyecto a visar
- Selección del colegio profesional (COAM, COACM, COAG, etc.)
- Elección de fases del proyecto a incluir:
  - Estudio Previo
  - Anteproyecto
  - Proyecto Básico
  - Proyecto de Ejecución
  - Dirección de Obra
- Notas adicionales sobre la solicitud

#### Estados del Visado
El sistema gestiona los siguientes estados del proceso:

| Estado | Descripción |
|--------|-------------|
| **Borrador** | Solicitud en preparación |
| **Pendiente de Presentación** | Documentos completos, listo para presentar |
| **Presentado** | Solicitud presentada al Colegio |
| **En Revisión** | El Colegio está revisando la documentación |
| **Requerido** | El Colegio solicita subsanaciones |
| **Pendiente de Pago** | Documentación aprobada, pendiente de pago de tasas |
| **Pendiente de Retirar** | Visado aprobado, pendiente de recoger |
| **Visado Concedido** | Proceso completado exitosamente |
| **Rechazado** | Solicitud rechazada |

### 2. Validación Automática de Documentos

#### Documentos Requeridos por Fase

**Proyecto Básico / Proyecto de Ejecución:**
- Memoria Descriptiva
- Memoria Constructiva con cumplimiento del CTE
- Planos de Situación y Emplazamiento
- Planos Arquitectónicos (plantas, alzados, secciones)

**Solo Proyecto de Ejecución (adicionales):**
- Pliego de Condiciones Técnicas Particulares
- Presupuesto de Ejecución Material con mediciones
- Planos de Estructuras
- Planos de Instalaciones
- Anexo de Cálculo (estructural y de instalaciones)
- Estudio de Seguridad y Salud
- Estudio de Gestión de Residuos
- Certificado de Eficiencia Energética

#### Validaciones Automáticas

El sistema realiza las siguientes validaciones en cada documento:

1. **Validación de Tamaño de Archivo**
   - Verifica que el archivo no esté vacío
   - Comprueba tamaños mínimos y máximos
   - Advierte sobre archivos sospechosamente pequeños

2. **Validación de Formato**
   - Acepta PDF, DWG, XML, BC3 según el tipo de documento
   - Rechaza formatos no permitidos

3. **Validación de Nomenclatura**
   - Detecta nombres que indican borradores
   - Advierte sobre versiones preliminares
   - Identifica archivos con nomenclatura no estándar

4. **Análisis de Completitud**
   - Verifica que todos los documentos obligatorios estén presentes
   - Calcula el porcentaje de completitud
   - Identifica documentos faltantes

#### Tipos de Mensajes de Validación

- **✅ Errores (bloquean la presentación):**
  - Archivo vacío
  - Tamaño excede el máximo permitido
  - Formato de archivo no válido
  - Falta documento requerido

- **⚠️ Advertencias (no bloquean, pero requieren revisión):**
  - Archivo muy pequeño para el tipo de documento
  - Nombre sugiere que es un borrador
  - Nomenclatura no estándar

### 3. Requisitos Administrativos

El sistema incluye un checklist de requisitos administrativos específicos del colegio:

#### Requisitos Generales
- [ ] Todos los documentos firmados digitalmente por el arquitecto autor
- [ ] Cumplimiento de normativa urbanística municipal
- [ ] Arquitecto colegiado y al corriente de pago

#### Requisitos Específicos para Proyecto de Ejecución
- [ ] Declaración responsable de cumplimiento del CTE
- [ ] Justificación de cumplimiento de normativa de accesibilidad
- [ ] Datos del coordinador de seguridad y salud

#### Requisitos por Colegio
- **COAM:** Cumplimentar formulario online previo a la presentación
- *(Se pueden agregar requisitos específicos de otros colegios)*

### 4. Panel de Validación de Documentos

El panel de validación proporciona:

#### Indicadores Visuales
- **Barra de progreso** que muestra el porcentaje de documentación completada
- **Iconos de estado** para cada documento:
  - ✅ Verde: Documento validado correctamente
  - ⚠️ Amarillo: Documento con advertencias
  - ❌ Rojo: Documento con errores

#### Funcionalidades
- **Subir documentos** con selección de tipo
- **Ver errores y advertencias** de validación en tiempo real
- **Eliminar documentos** incorrectos
- **Lista de documentos faltantes** obligatorios

#### Información por Documento
- Nombre del archivo
- Tipo de documento
- Tamaño del archivo
- Estado de validación
- Lista de errores/advertencias
- Indicador de documento requerido

### 5. Checklist de Presentación

Antes de permitir la presentación de la solicitud, el sistema genera un checklist automático:

```
✓ Todos los documentos requeridos están cargados
✓ Los documentos han pasado la validación automática
✓ Los planos están en formato PDF/A o DWG según corresponda
✓ Las memorias incluyen firma digital del arquitecto
✓ El presupuesto coincide con el PEM declarado
✓ Los documentos siguen la nomenclatura estándar ISO19650
✓ Se ha incluido el estudio de seguridad y salud (PE)
✓ Se ha incluido el estudio de gestión de residuos (PE)
✓ Se ha incluido el certificado de eficiencia energética (PE)
✓ Se han completado todos los requisitos administrativos
✓ Se ha verificado el colegiado responsable del visado
```

### 6. Seguimiento de Estado

El panel de seguimiento proporciona:

#### Vista de Estado Actual
- Estado actual del visado con icono y color distintivo
- Número de expediente (si ya ha sido asignado)
- Fecha de presentación
- Tiempo transcurrido desde la presentación

#### Acciones Rápidas
Botones para actualizar rápidamente el estado según el flujo del proceso:
- **Presentado** → En Revisión / Requerido
- **En Revisión** → Pendiente de Pago / Aprobado
- **Pendiente de Pago** → Pendiente de Retirar
- **Pendiente de Retirar** → Marcar como Recogido

#### Gestión de Requerimientos
- Visualización de motivos de requerimiento del Colegio
- Botón para marcar como subsanado
- Historial de subsanaciones

#### Información Económica
- Tasa de visado estimada
- Referencia de pago del Colegio
- Estado del pago

## Flujo de Trabajo Completo

### 1. Preparación de la Solicitud

```
Arquitecto → Crear Nueva Solicitud → Seleccionar Proyecto → Elegir Fases
```

El sistema genera automáticamente:
- Lista de documentos requeridos según las fases seleccionadas
- Requisitos administrativos del colegio
- Checklist de presentación

### 2. Carga y Validación de Documentos

```
Arquitecto → Subir Documento → Sistema valida automáticamente → Muestra resultado
```

Para cada documento:
1. Selecciona el tipo de documento del menú desplegable
2. Selecciona el archivo del ordenador
3. Hace clic en "Subir y Validar"
4. El sistema valida instantáneamente y muestra:
   - ✅ Si el documento es válido
   - ⚠️ Advertencias que requieren revisión
   - ❌ Errores que deben corregirse

### 3. Revisión de Completitud

```
Sistema → Calcula % completitud → Identifica documentos faltantes → Muestra alertas
```

El arquitecto puede verificar en tiempo real:
- Porcentaje de documentación completada
- Documentos obligatorios que faltan
- Documentos con errores que deben corregirse

### 4. Presentación de la Solicitud

```
Arquitecto → Verifica checklist → Clic en "Presentar Solicitud" → Sistema valida todo
```

El sistema realiza una validación final:
- Verifica que todos los documentos obligatorios estén presentes
- Confirma que todos los documentos hayan pasado la validación
- Comprueba que los requisitos administrativos estén marcados

Si todo es correcto:
- Genera número de expediente
- Marca fecha de presentación
- Cambia estado a "Presentado"
- Envía notificación de confirmación

### 5. Seguimiento del Trámite

```
Arquitecto → Panel de Estado → Actualiza según comunicaciones del Colegio
```

El arquitecto actualiza el estado según las comunicaciones recibidas del Colegio:
- Marca como "En Revisión" cuando el Colegio lo confirma
- Registra "Requerido" si hay subsanaciones
- Actualiza a "Pendiente de Pago" al recibir notificación de aprobación
- Marca como "Aprobado" tras recoger el visado

## Acceso al Sistema

### Desde el Dashboard Principal
En la barra superior, junto a otros gestores, aparece el botón:
```
🏛️ Visado Colegial
```

### Desde la Vista de Proyecto
Dentro de cada proyecto, en la barra de herramientas aparece:
```
🏛️ Visado Colegial
```
Esta opción abre el sistema ya filtrado para ese proyecto específico.

## Integración con Otros Módulos

### Integración con Gestor de Documentos
- Los documentos del proyecto pueden ser referenciados
- Los documentos validados se vinculan al proyecto
- Nomenclatura consistente entre módulos

### Integración con Gestor de Proyectos
- Acceso directo desde la vista detallada del proyecto
- Filtrado automático de solicitudes por proyecto
- Sincronización de fases del proyecto

### Integración con Gestor de Clientes
- Información del promotor disponible para la solicitud
- Datos del cliente incluidos en la documentación

### Futura Integración con Facturación
- Generación automática de factura por tasas de visado
- Registro de pagos de tasas colegiales
- Control de honorarios asociados al visado

## Datos Persistentes

Toda la información se guarda automáticamente usando el sistema de persistencia de la aplicación:

```typescript
useKV('visa-applications', [])
```

Esto garantiza que:
- Las solicitudes se mantienen entre sesiones
- No se pierde información al cerrar el navegador
- Los datos están disponibles inmediatamente al reabrir la aplicación

## Ventajas del Sistema

### Para el Arquitecto
- ✅ **Reduce errores**: Validación automática antes de presentar
- ⏱️ **Ahorra tiempo**: No hay que revisar manualmente cada documento
- 📊 **Visión clara**: Dashboard con estado de todas las solicitudes
- 🎯 **Completitud**: Nunca olvida documentos obligatorios
- 📝 **Trazabilidad**: Historial completo del proceso

### Para el Estudio
- 📈 **Estandarización**: Proceso consistente para todos los proyectos
- 🔍 **Control de calidad**: Validaciones uniformes
- 💼 **Profesionalismo**: Presentaciones completas y bien organizadas
- 🕐 **Eficiencia**: Reduce requerimientos del Colegio
- 📚 **Conocimiento**: Base de requisitos por colegio y fase

## Próximas Mejoras Planificadas

1. **Firma digital integrada**: Firmar documentos directamente desde la aplicación
2. **Presentación online**: API con colegios para presentación telemática
3. **Notificaciones automáticas**: Alertas por email/SMS sobre cambios de estado
4. **Plantillas de documentos**: Generación automática de memorias tipo
5. **Histórico de visados**: Estadísticas y análisis de tiempos de tramitación
6. **IA para revisión**: Análisis automático del contenido de las memorias
7. **Integración con BIM**: Validación de modelos y extracción automática de planos

## Soporte y Ayuda

### Problemas Comunes

**P: ¿Por qué no puedo presentar la solicitud?**
R: Verifica que:
- Todos los documentos obligatorios estén cargados (indicados con "Requerido")
- No haya documentos con errores de validación (icono rojo ❌)
- Todos los requisitos administrativos estén marcados

**P: ¿Qué significa "Archivo muy pequeño"?**
R: Es una advertencia que sugiere revisar el documento. Puede que:
- El documento esté corrupto o incompleto
- Se haya exportado a PDF con baja calidad
- Falte contenido en el documento

**P: ¿Puedo cambiar el colegio después de crear la solicitud?**
R: No, una vez creada la solicitud, el colegio queda fijo. Crea una nueva solicitud si necesitas cambiar el colegio.

**P: ¿Se pierden los datos si cierro el navegador?**
R: No, todos los datos se guardan automáticamente y estarán disponibles cuando vuelvas a abrir la aplicación.

## Conclusión

El Sistema de Gestión de Visado Colegial con Validación de Documentos representa un avance significativo en la digitalización del proceso administrativo del arquitecto, proporcionando:

- **Automatización** de validaciones tediosas
- **Estandarización** de procesos
- **Reducción** de errores y requerimientos
- **Mejora** en la calidad de las presentaciones
- **Ahorro** de tiempo valioso del profesional

Este módulo se integra perfectamente con el ecosistema AFO CORE MANAGER, formando parte de la visión de gestión integral del estudio de arquitectura.
