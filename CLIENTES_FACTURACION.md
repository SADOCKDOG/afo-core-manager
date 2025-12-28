# Gestión de Clientes y Facturación

## Descripción General

Se ha implementado un sistema completo de gestión de clientes y facturación que permite centralizar la información de promotores y generar facturas profesionales asociadas a proyectos.

## Módulo de Gestión de Clientes

### Características Principales

1. **Registro de Clientes**
   - Soporte para Personas Físicas y Personas Jurídicas
   - Campos adaptados según el tipo de cliente
   - Almacenamiento persistente con `useKV`

2. **Información de Personas Físicas**
   - NIF/NIE
   - Nombre
   - Apellido 1
   - Apellido 2
   - Dirección
   - Email
   - Teléfono
   - Notas

3. **Información de Personas Jurídicas**
   - CIF
   - Razón Social
   - Representante Legal
   - Dirección
   - Email
   - Teléfono
   - Notas

4. **Funcionalidades**
   - Búsqueda por NIF, nombre, razón social o email
   - Edición de clientes existentes
   - Eliminación de clientes
   - Vista en tabla con toda la información relevante

### Integración con Proyectos

Los proyectos ahora pueden asociarse con un cliente específico:
- Campo `clientId` en la entidad Project
- Selector de cliente en el diálogo de creación/edición de proyectos
- Los datos del cliente se pre-rellenan automáticamente en las facturas

## Módulo de Facturación

### Características Principales

1. **Tipos de Factura**
   - Tasa de Visado Colegial
   - Honorarios Profesionales
   - Pago por Fase de Proyecto
   - Gasto Reembolsable
   - Otros

2. **Estados de Factura**
   - Borrador
   - Emitida
   - Pagada
   - Vencida
   - Anulada

3. **Información de Factura**
   - Número de factura (generado automáticamente)
   - Cliente asociado (obligatorio)
   - Proyecto asociado (opcional)
   - Líneas de factura con descripción, cantidad, precio unitario
   - Cálculo automático de IVA y totales
   - Fechas de emisión, vencimiento y pago
   - Método de pago (transferencia, efectivo, tarjeta, cheque, otros)
   - Notas adicionales

4. **Dashboard Financiero**
   - Total facturado
   - Total cobrado
   - Total pendiente
   - Total vencido
   - Visualización con código de colores según estado

5. **Filtros y Búsqueda**
   - Búsqueda por número de factura, cliente o NIF
   - Filtros por estado: Todas, Borradores, Emitidas, Pagadas, Vencidas
   - Indicadores visuales para facturas vencidas

6. **Recordatorios de Pago**
   - Botón para enviar recordatorio por email
   - Solo disponible para facturas emitidas y vencidas
   - Integración con el servicio de email configurado
   - Genera automáticamente el contenido del recordatorio

### Gestión de Líneas de Factura

Cada factura puede tener múltiples líneas con:
- Descripción del servicio o producto
- Cantidad
- Precio unitario
- Porcentaje de IVA individual
- Cálculo automático del total

### Cálculos Automáticos

El sistema calcula automáticamente:
- Subtotal (suma de todas las líneas)
- Impuesto total (IVA sobre el subtotal)
- Total a pagar (subtotal + IVA)

### Métodos de Pago

Soporte para múltiples métodos:
- Transferencia Bancaria
- Efectivo
- Tarjeta
- Cheque
- Otros

## Flujo de Trabajo Recomendado

### 1. Crear un Cliente

```
Dashboard → Clientes → Añadir Cliente
- Seleccionar tipo (Física/Jurídica)
- Completar datos obligatorios (NIF/CIF, Nombre/Razón Social)
- Añadir información de contacto
- Guardar
```

### 2. Asociar Cliente a Proyecto

```
Dashboard → Nuevo Proyecto
- Completar información del proyecto
- Seleccionar cliente del desplegable
- Definir fases contratadas
- Guardar
```

### 3. Crear Factura

```
Dashboard → Facturación → Nueva Factura
- Seleccionar cliente (obligatorio)
- Seleccionar proyecto (opcional)
- Definir tipo de factura
- Añadir líneas de factura
- Establecer fechas y método de pago
- Guardar
```

### 4. Gestionar Cobros

```
Dashboard → Facturación
- Ver dashboard con resumen financiero
- Filtrar por estado
- Editar facturas para marcar como pagadas
- Enviar recordatorios para facturas vencidas
```

## Tipos de Datos

### Client

```typescript
interface Client {
  id: string
  type: 'persona-fisica' | 'persona-juridica'
  nif: string
  nombre?: string
  apellido1?: string
  apellido2?: string
  razonSocial?: string
  direccion?: string
  email?: string
  telefono?: string
  representante?: string
  notas?: string
  createdAt: number
  updatedAt: number
}
```

### Invoice

```typescript
interface Invoice {
  id: string
  invoiceNumber: string
  type: InvoiceType
  projectId?: string
  clientId?: string
  clientName: string
  clientNIF: string
  clientAddress?: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxAmount: number
  taxRate: number
  total: number
  issuedDate?: number
  dueDate?: number
  paidDate?: number
  paymentMethod?: PaymentMethod
  notes?: string
  createdAt: number
  updatedAt: number
}
```

### InvoiceLineItem

```typescript
interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  taxRate: number
  phaseId?: string
}
```

## Componentes Creados

1. **ClientManager** - Gestión completa de clientes
2. **ClientDialog** - Formulario para crear/editar clientes
3. **BillingManager** - Dashboard y listado de facturas
4. **InvoiceDialog** - Formulario completo para crear/editar facturas

## Almacenamiento de Datos

Todos los datos se almacenan utilizando el hook `useKV` del SDK de Spark:
- Clientes: `'clients'`
- Facturas: `'invoices'`

Los datos persisten entre sesiones y están disponibles para todos los módulos de la aplicación.

## Integración con Email

El módulo de facturación se integra con el servicio de email para:
- Enviar recordatorios de pago automáticos
- Notificar a los clientes sobre facturas vencidas
- Requiere configuración previa del servicio de email (SendGrid o AWS SES)

## Próximas Mejoras Sugeridas

1. Exportación de facturas a PDF
2. Generación automática de facturas al completar fases de proyecto
3. Informes financieros avanzados
4. Integración con plataformas de contabilidad
5. Recordatorios automáticos programados
6. Facturas recurrentes
7. Descuentos por pronto pago configurables
8. Historial de comunicaciones con el cliente
