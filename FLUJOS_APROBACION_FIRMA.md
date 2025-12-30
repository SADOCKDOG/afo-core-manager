# Sistema de Flujos de Aprobación y Firma Digital

## 📋 Descripción General

AFO CORE MANAGER ahora incluye un sistema completo de **flujos de aprobación y firma digital** que permite:

- ✅ Crear flujos de aprobación personalizados para documentos
- ✅ Firmas digitales con validez legal
- ✅ Seguimiento completo del estado de aprobaciones
- ✅ Plantillas reutilizables de flujos
- ✅ Registro de auditoría completo
- ✅ Múltiples tipos de flujos (secuencial, paralelo, unánime)

---

## 🎯 Características Principales

### 1. Flujos de Aprobación

El sistema permite tres tipos de flujos:

#### **Flujo Secuencial**
Los aprobadores deben firmar en orden. El documento pasa de un paso al siguiente solo cuando se completan las aprobaciones requeridas.

**Ejemplo de uso:**
- Paso 1: Arquitecto técnico revisa y aprueba
- Paso 2: Arquitecto jefe aprueba
- Paso 3: Cliente final firma

#### **Flujo Paralelo**
Todos los aprobadores pueden revisar y firmar simultáneamente. El flujo avanza cuando cada paso individual cumple sus requisitos.

**Ejemplo de uso:**
- Varios técnicos revisan diferentes aspectos del mismo documento a la vez
- Ideal para documentos que requieren múltiples validaciones independientes

#### **Flujo Unánime**
Similar al paralelo, pero requiere aprobación de todos los participantes.

---

### 2. Firma Digital

El sistema ofrece dos métodos de firma:

#### **Firma Dibujada**
- Canvas interactivo para dibujar tu firma con el ratón
- Captura la firma como imagen PNG
- Se adjunta al documento con timestamp y hash

#### **Firma Escrita (Tipográfica)**
- Escribe tu nombre y elige entre 5 estilos de fuentes caligráficas
- Genera una firma profesional automáticamente
- Ideal para firmas consistentes y legibles

**Ambos métodos incluyen:**
- ✅ Timestamp de firma
- ✅ IP y User Agent del firmante
- ✅ Hash criptográfico del documento
- ✅ Aceptación de términos legales

---

### 3. Plantillas de Flujo

Crea plantillas reutilizables para tipos de documentos comunes:

**Ventajas:**
- Ahorra tiempo en la configuración de flujos repetitivos
- Mantén consistencia en procesos de aprobación
- Duplica y modifica plantillas existentes
- Asigna roles específicos (Arquitecto, Promotor, Técnico)

**Ejemplo de plantilla:**
```
Nombre: "Aprobación de Planos de Ejecución"
Tipo: Secuencial
Pasos:
  1. Arquitecto Técnico (1 aprobación requerida)
  2. Arquitecto Jefe (1 aprobación requerida)
  3. Promotor (1 aprobación requerida)
```

---

## 🚀 Cómo Usar

### Paso 1: Crear un Flujo de Aprobación

1. Ve al menú **Herramientas** → **Aprobaciones y Firmas**
2. Haz clic en **Nuevo Flujo**
3. Selecciona:
   - Proyecto asociado
   - Documento a aprobar
   - Tipo de flujo (secuencial/paralelo/unánime)
   - Fecha límite (opcional)
4. Configura los pasos:
   - Añade aprobadores para cada paso
   - Define cuántas aprobaciones se requieren por paso
   - Puedes añadir múltiples pasos
5. Haz clic en **Crear Flujo**

### Paso 2: Aprobar y Firmar Documentos

1. Accede al flujo desde el gestor de aprobaciones
2. Revisa los detalles del documento
3. Haz clic en **Aprobar y Firmar**
4. Elige método de firma:
   - **Dibujar**: Usa el ratón para dibujar tu firma
   - **Escribir**: Escribe tu nombre y elige estilo
5. Acepta los términos legales
6. Confirma la firma

**O rechazar:**
1. Haz clic en **Rechazar**
2. Proporciona un motivo detallado
3. Confirma el rechazo

### Paso 3: Seguimiento del Estado

El dashboard de aprobaciones muestra:

- **Activos**: Flujos pendientes o en revisión
- **Completados**: Flujos totalmente aprobados
- **Rechazados**: Flujos rechazados o cancelados
- **Plantillas**: Plantillas configuradas

Para cada flujo puedes ver:
- ✅ Progreso general (porcentaje)
- ✅ Pasos completados vs totales
- ✅ Firmas completadas vs totales
- ✅ Estado de cada firmante
- ✅ Comentarios y motivos de rechazo
- ✅ Duración del proceso

---

## 📊 Dashboard de Aprobaciones

### Métricas Principales

El dashboard muestra:

1. **Flujos Activos**: Número de flujos en proceso
2. **Flujos Aprobados**: Total de flujos completados exitosamente
3. **Flujos Rechazados**: Total de flujos rechazados o cancelados
4. **Plantillas Creadas**: Número de plantillas disponibles

### Información por Flujo

Cada tarjeta de flujo muestra:

- 📄 Nombre del documento
- 🏢 Proyecto asociado
- 🏷️ Estado (badge de color)
- 📊 Barra de progreso visual
- ⏱️ Fecha de inicio o duración
- ✍️ Conteo de firmas completadas
- 📅 Fecha límite (si aplica)
- ⚠️ Indicador de vencimiento

---

## 🔍 Vista Detallada de Flujo

Al hacer clic en un flujo, verás tres pestañas:

### **1. Pasos**
- Lista todos los pasos del flujo
- Muestra el paso actual resaltado
- Indica aprobadores y su estado (pendiente/firmado/rechazado)
- Muestra comentarios de cada aprobador

### **2. Firmas**
- Lista todas las firmas del flujo
- Agrupa por paso
- Muestra detalles de cada firma:
  - Nombre y email del firmante
  - Fecha y hora de firma
  - Estado visual con iconos
  - Motivo de rechazo (si aplica)

### **3. Información**
- Tipo de flujo
- Iniciado por (usuario y fecha)
- Fecha límite
- Duración del proceso
- Notas del flujo
- Motivo de cancelación (si aplica)

---

## 🔐 Seguridad y Auditoría

### Registro de Auditoría

Cada acción en el sistema genera un registro que incluye:

- ✅ Tipo de acción (aprobar, rechazar, cancelar, etc.)
- ✅ Usuario que realizó la acción
- ✅ Timestamp exacto
- ✅ IP y User Agent
- ✅ Detalles específicos de la acción
- ✅ Comentarios asociados

### Firma Digital Segura

Cada firma incluye:

- **Hash del documento**: Garantiza que el documento no fue modificado
- **Timestamp**: Fecha y hora exactas de la firma
- **Datos del firmante**: ID, nombre, email, rol
- **Metadata técnica**: IP, navegador utilizado
- **Firma visual**: Imagen PNG de la firma (dibujada o generada)

**Validez Legal:**
- ✅ Aceptación explícita de términos por el firmante
- ✅ Trazabilidad completa del proceso
- ✅ Firma no repudiable (el firmante no puede negar haberla realizado)
- ✅ Inmutabilidad del registro

---

## 🎨 Estados Visuales

El sistema usa códigos de color consistentes:

| Estado | Color | Significado |
|--------|-------|-------------|
| 🟡 Pendiente | Amarillo | Esperando acción |
| 🔵 En Revisión | Azul | Alguien está revisando |
| 🟢 Aprobado | Verde | Completado exitosamente |
| 🔴 Rechazado | Rojo | Rechazado por un aprobador |
| ⚫ Cancelado | Gris | Flujo cancelado |

---

## 💡 Casos de Uso

### Caso 1: Aprobación de Planos de Ejecución

**Configuración:**
- Tipo: Secuencial
- Pasos:
  1. Técnico de Estructuras → 1 aprobación
  2. Técnico de Instalaciones → 1 aprobación
  3. Arquitecto Jefe → 1 aprobación
  4. Cliente → 1 aprobación

**Flujo:**
1. Técnico de Estructuras revisa y firma
2. Técnico de Instalaciones recibe notificación y firma
3. Arquitecto Jefe revisa conjunto y firma
4. Cliente recibe para aprobación final

---

### Caso 2: Revisión Paralela de Memoria Técnica

**Configuración:**
- Tipo: Paralelo
- Pasos:
  1. Especialistas (3 requeridos de 5) → Varios técnicos revisan diferentes secciones
  2. Arquitecto Coordinador (1 aprobación)

**Flujo:**
1. 5 técnicos especializados reciben el documento simultáneamente
2. Cada uno revisa su especialidad
3. Cuando 3 han firmado, se pasa al coordinador
4. Coordinador hace revisión final

---

### Caso 3: Aprobación Unánime de Presupuesto

**Configuración:**
- Tipo: Unánime
- Pasos:
  1. Todos los socios (3 de 3 requeridos)

**Flujo:**
1. Los 3 socios reciben el presupuesto
2. Cada uno revisa y firma
3. Solo se aprueba cuando los 3 han firmado
4. Si uno rechaza, todo el flujo se rechaza

---

## 🛠️ Gestión de Plantillas

### Crear Plantilla

1. Ve a la pestaña **Plantillas**
2. Haz clic en **Nueva Plantilla**
3. Configura:
   - Nombre descriptivo
   - Tipo de documento
   - Descripción (opcional)
   - Tipo de flujo
   - Pasos con roles asignados

### Usar Plantilla

Cuando creas un nuevo flujo:
1. Selecciona una plantilla del dropdown
2. Los pasos se cargan automáticamente
3. Puedes modificar antes de crear el flujo

### Gestionar Plantillas

- **Editar**: Modifica plantillas existentes
- **Duplicar**: Crea copias de plantillas para variaciones
- **Eliminar**: Borra plantillas que ya no necesitas

---

## 📈 Mejores Prácticas

### 1. Nomenclatura Clara
- Usa nombres descriptivos para flujos
- Incluye el tipo de documento en el nombre
- Ejemplo: "Aprobación Planos Arquitectónicos - Fase Ejecución"

### 2. Pasos Lógicos
- Define pasos que reflejen el proceso real
- Evita demasiados pasos (máximo 5-6)
- Agrupa revisiones similares en un solo paso

### 3. Comentarios Útiles
- Pide a los aprobadores que dejen comentarios detallados
- En rechazos, especifica qué debe corregirse
- Usa comentarios para comunicación asíncrona

### 4. Plantillas Estratégicas
- Crea plantillas para procesos recurrentes
- Mantén actualizadas las plantillas
- Documenta el propósito de cada plantilla

### 5. Fechas Límite
- Establece fechas límite realistas
- Considera vacaciones y carga de trabajo
- Usa recordatorios automáticos (futura mejora)

---

## 🔄 Integración con Otros Módulos

El sistema de aprobaciones se integra con:

- **📁 Gestor de Documentos**: Vincula flujos a documentos específicos
- **🏢 Proyectos**: Asocia flujos al contexto del proyecto
- **👥 Intervinientes**: Usa stakeholders como aprobadores
- **📧 Sistema de Email**: Notificaciones automáticas (futura mejora)
- **📊 Dashboard**: Métricas de flujos activos y completados

---

## 🚧 Próximas Mejoras

- [ ] Notificaciones por email automáticas
- [ ] Recordatorios programados para firmantes
- [ ] Exportación de certificados de firma
- [ ] Integración con servicios de firma electrónica cualificada
- [ ] Firma biométrica en dispositivos táctiles
- [ ] Vista de firma múltiple (firmar varios documentos a la vez)
- [ ] Plantillas inteligentes basadas en AI
- [ ] Dashboard de métricas avanzadas
- [ ] API para integraciones externas

---

## 📞 Soporte

Para dudas o problemas con el sistema de aprobaciones y firmas:

1. Revisa esta documentación
2. Consulta los ejemplos de casos de uso
3. Verifica el registro de auditoría para troubleshooting

---

## 📝 Notas Legales

**Importante:** Este sistema proporciona firmas digitales básicas adecuadas para flujos de trabajo internos. Para documentos con requisitos legales estrictos (contratos oficiales, documentos notariales, etc.), consulta con tu asesor legal sobre la necesidad de usar sistemas de firma electrónica cualificada certificados por organismos oficiales.

La firma digital generada por este sistema incluye:
- ✅ Evidencia de consentimiento explícito
- ✅ Trazabilidad completa del proceso
- ✅ Registro inmutable de la firma
- ✅ Hash del documento firmado

Estas características proporcionan un alto nivel de seguridad y trazabilidad para procesos de negocio estándar.

---

**¡El sistema de aprobaciones y firmas está listo para mejorar tus procesos de revisión y validación de documentos!** 🎉
