# Facturación Automática por Finalización de Fases

## Descripción General

AFO CORE MANAGER implementa un sistema de facturación automática que genera facturas inteligentemente cuando se completan las fases de un proyecto. Esta funcionalidad automatiza uno de los procesos más críticos y repetitivos del flujo de trabajo del arquitecto: la generación de facturas de honorarios profesionales vinculadas al progreso del proyecto.

## Flujo de Trabajo

### 1. Completar una Fase del Proyecto

Cuando un arquitecto marca una fase del proyecto como "completada" (por ejemplo, "Proyecto Básico" o "Dirección de Obra"):

1. El sistema detecta el cambio de estado de la fase
2. Recupera la información del cliente asociado al proyecto
3. Busca el presupuesto aprobado del proyecto (si existe)
4. Calcula automáticamente el importe de la factura basándose en:
   - El porcentaje de la fase definido en el proyecto
   - El PEM (Presupuesto de Ejecución Material) si está disponible
   - Un valor base predeterminado si no hay presupuesto

### 2. Diálogo de Confirmación

El sistema muestra un diálogo modal de confirmación con:

- **Información de la fase completada**: Nombre y tipo de fase
- **Datos del cliente**: Nombre/Razón Social y NIF/CIF
- **Cálculo automático del importe**: 
  - Base imponible calculada según el porcentaje de fase
  - IVA aplicado (21% por defecto)
  - Total de la factura
- **Campos editables**:
  - Importe base (puede ajustarse manualmente)
  - Notas adicionales
  - Estado inicial (Borrador o Emitida)

### 3. Opciones del Usuario

El arquitecto puede:

- **Generar la factura**: Confirmar y crear la factura con los datos mostrados
  - Como **Borrador**: Para revisar antes de enviar al cliente
  - Como **Emitida**: Lista para enviar inmediatamente
- **No generar factura**: Cancelar el proceso (puede crear la factura manualmente más tarde)

### 4. Generación de la Factura

Si se confirma, el sistema:

1. Genera un número de factura único con el formato: `PF-YYYY-XXX-XXXX`
2. Crea la factura con:
   - Tipo: "Pago por Fase de Proyecto"
   - Línea de factura con descripción de la fase completada
   - Cálculos de IVA y totales
   - Fecha de emisión y vencimiento (30 días por defecto)
   - Nota automática indicando que fue generada al completar la fase
3. Almacena la factura en el sistema
4. Muestra una notificación de éxito con el número de factura

## Cálculo de Importes

### Con Presupuesto Aprobado

Si el proyecto tiene un presupuesto con estado "approved":

```
Importe Base = (PEM del Presupuesto × Porcentaje de la Fase) / 100
```

**Ejemplo:**
- PEM del Presupuesto: 150.000 €
- Fase: Proyecto Básico (15%)
- Importe Base: 150.000 € × 15% = 22.500 €
- IVA (21%): 4.725 €
- **Total Factura: 27.225 €**

### Sin Presupuesto

Si no hay presupuesto aprobado:

```
Importe Base = (10.000 € × Porcentaje de la Fase) / 100
```

**Ejemplo:**
- Fase: Anteproyecto (10%)
- Importe Base: 10.000 € × 10% = 1.000 €
- IVA (21%): 210 €
- **Total Factura: 1.210 €**

## Integración con Clientes

El sistema vincula automáticamente:

- **Cliente del proyecto**: Si el proyecto tiene un `clientId` definido
- **Datos del cliente**:
  - Nombre o Razón Social
  - NIF/CIF
  - Dirección (opcional)

Estos datos se precargan en la factura automáticamente.

## Características de las Facturas Auto-generadas

### Identificación Visual

Las facturas generadas automáticamente tienen:

- Badge distintivo: **"Auto-generada"** con color de acento
- Tipo de factura: **"Pago por Fase de Proyecto"**
- Nota en el campo `notes` explicando el origen

### Información Completa

Cada factura incluye:

```typescript
{
  invoiceNumber: "PF-2024-123-4567",      // Único y secuencial
  type: "phase-payment",                   // Tipo específico
  projectId: "...",                        // Vinculado al proyecto
  clientId: "...",                         // Vinculado al cliente
  lineItems: [{
    description: "Proyecto Básico - Vivienda Unifamiliar en Seseña",
    quantity: 1,
    unitPrice: 22500.00,
    totalPrice: 22500.00,
    taxRate: 21,
    phaseId: "basico"                      // Vinculado a la fase
  }],
  subtotal: 22500.00,
  taxAmount: 4725.00,
  taxRate: 21,
  total: 27225.00,
  status: "draft" | "issued",
  issuedDate: 1234567890,
  dueDate: 1237246290,                     // +30 días
  notes: "Factura generada automáticamente al completar la fase: Proyecto Básico (15% del proyecto)"
}
```

## Gestión Post-generación

Una vez generada, la factura puede:

1. **Editarse**: Modificar importes, notas, fechas
2. **Emitirse**: Cambiar de borrador a emitida
3. **Pagarse**: Marcar como pagada con fecha de pago
4. **Exportarse**: Generar PDF o enviar por email (futuro)

## Casos de Uso

### Caso 1: Proyecto con Cliente y Presupuesto

**Situación:**
- Proyecto: "Reforma Integral - Calle Mayor 45"
- Cliente registrado: "Constructora ABC S.L."
- Presupuesto aprobado: 250.000 €
- Fase completada: Proyecto de Ejecución (40%)

**Resultado:**
- Factura automática generada
- Importe: 100.000 € + IVA = 121.000 €
- Lista para emitir al cliente

### Caso 2: Proyecto Nuevo sin Presupuesto

**Situación:**
- Proyecto: "Estudio de Viabilidad"
- Cliente: Particular sin registrar
- Sin presupuesto definido
- Fase completada: Estudio Previo (5%)

**Resultado:**
- Diálogo de confirmación con importe base de 500 €
- Usuario ajusta a 1.200 € según presupuesto verbal
- Factura generada con 1.200 € + IVA = 1.452 €

### Caso 3: Múltiples Fases Secuenciales

**Situación:**
- El arquitecto completa 3 fases en secuencia:
  1. Anteproyecto (10%) → Factura 1
  2. Proyecto Básico (15%) → Factura 2
  3. Proyecto de Ejecución (40%) → Factura 3

**Resultado:**
- 3 facturas independientes generadas
- Cada una vinculada a su fase específica
- Fácil seguimiento del flujo de facturación del proyecto

## Ventajas del Sistema

### 1. Automatización
- Elimina la necesidad de crear facturas manualmente
- Reduce errores de cálculo
- Asegura que no se olvide facturar una fase completada

### 2. Coherencia
- Nomenclatura estandarizada de facturas
- Cálculos consistentes basados en porcentajes de fase
- Vinculación automática con proyectos y clientes

### 3. Flexibilidad
- Permite ajustar importes antes de generar
- Opción de borrador para revisión
- Posibilidad de cancelar y facturar manualmente después

### 4. Trazabilidad
- Cada factura vinculada a la fase específica del proyecto
- Notas automáticas explican el origen
- Fácil auditoría del flujo financiero del proyecto

### 5. Cumplimiento
- Cálculo correcto de IVA
- Fechas de emisión y vencimiento automáticas
- Numeración única y secuencial

## Configuración

### Porcentajes de Fase

Los porcentajes se definen al crear el proyecto en el campo `phases`:

```typescript
phases: [
  { phase: 'estudio-previo', percentage: 5, status: 'completed' },
  { phase: 'anteproyecto', percentage: 10, status: 'in-progress' },
  { phase: 'basico', percentage: 15, status: 'pending' },
  { phase: 'ejecucion', percentage: 40, status: 'pending' },
  { phase: 'direccion-obra', percentage: 30, status: 'pending' }
]
```

### Tasa de IVA

Por defecto: **21%** (estándar para servicios profesionales en España)

Puede ajustarse editando la constante `STANDARD_TAX_RATE` en `invoice-utils.ts`.

### Plazo de Pago

Por defecto: **30 días** desde la fecha de emisión

Puede modificarse en la función `generatePhaseCompletionInvoice()`.

## Integración con Otros Módulos

### Con Gestión de Proyectos
- Detecta automáticamente cambios de estado de fase
- Lee porcentajes y datos del proyecto

### Con Gestión de Clientes
- Recupera datos del cliente asociado
- Precarga nombre, NIF y dirección

### Con Gestor de Presupuestos
- Usa el PEM del presupuesto aprobado
- Calcula honorarios basados en el valor real del proyecto

### Con Gestor de Facturas
- Almacena facturas generadas
- Permite gestión completa post-generación
- Muestra badge distintivo para auto-generadas

## Próximas Mejoras

- [ ] Plantillas personalizables de factura
- [ ] Envío automático por email al cliente
- [ ] Exportación a PDF con diseño profesional
- [ ] Recordatorios automáticos de pago
- [ ] Integración con software de contabilidad
- [ ] Configuración de tasas de IVA personalizadas
- [ ] Descuentos por pronto pago
- [ ] Facturación recurrente para dirección de obra
