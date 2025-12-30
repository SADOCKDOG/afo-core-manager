# Actualización: Cliente Obligatorio en Proyectos

## Resumen de Cambios

Se ha modificado la aplicación para que **todos los proyectos requieran un cliente asociado obligatoriamente**. Esta actualización refuerza la relación entre proyectos y clientes, asegurando que cada proyecto tenga un promotor definido desde su creación.

## Cambios Implementados

### 1. Modelo de Datos

**Archivo**: `src/lib/types.ts`

- El campo `clientId` en la interfaz `Project` ha cambiado de opcional (`clientId?: string`) a obligatorio (`clientId: string`)
- Esto asegura que TypeScript valide en tiempo de compilación que todos los proyectos tienen un cliente

```typescript
export interface Project {
  id: string
  title: string
  description?: string
  location: string
  status: ProjectStatus
  phases: ProjectPhaseData[]
  stakeholders: string[]
  clientId: string  // ✅ Ahora obligatorio (antes era clientId?: string)
  folderStructure?: FolderStructureType
  createdAt: number
  updatedAt: number
}
```

### 2. Creación de Proyectos

**Archivo**: `src/components/ProjectDialog.tsx`

- El campo de selección de cliente ahora muestra un asterisco (*) indicando que es obligatorio
- El botón "Crear Proyecto" / "Guardar Cambios" se deshabilita si no se ha seleccionado un cliente
- Si no existen clientes en el sistema, se muestra un mensaje de error indicando que debe crear un cliente primero
- Se eliminó la opción "Sin cliente asociado" del dropdown

**Validación del formulario**:
```typescript
disabled={!title || !location || !clientId || selectedPhases.size === 0}
```

### 3. Importación de Proyectos

**Archivo**: `src/components/ProjectImportDialog.tsx`

- Se agregó un campo obligatorio de selección de cliente en la pestaña "Configuración"
- El botón "Importar" se deshabilita si falta el cliente
- Validación actualizada para incluir `clientId`:
```typescript
if (!analysis || !projectTitle || !projectLocation || !clientId) {
  toast.error('Por favor, complete todos los campos requeridos')
  return
}
```

### 4. Importación Múltiple de Proyectos

**Archivo**: `src/components/BulkProjectImportDialog.tsx`

- Cada proyecto en la importación múltiple ahora requiere su propio cliente seleccionado
- Se agregó un campo de selección de cliente para cada proyecto individualmente
- Validación actualizada:
```typescript
const hasInvalidProjects = selectedProjects.some(p => !p.title || !p.location || !p.clientId)
if (hasInvalidProjects) {
  toast.error('Complete todos los campos requeridos (nombre, ubicación y cliente)')
  return
}
```

### 5. Aplicación Principal

**Archivo**: `src/App.tsx`

- Actualizada la función `handleSaveProject` para incluir el `clientId` obligatorio al crear nuevos proyectos
- Actualizada la función `handleImportComplete` para aceptar el `clientId` en los datos de importación
- Actualizada la función `handleBulkImportComplete` para incluir el `clientId` en cada proyecto importado

## Impacto en el Usuario

### Al Crear un Nuevo Proyecto

1. El usuario **debe** seleccionar un cliente del dropdown antes de poder crear el proyecto
2. Si no existen clientes en el sistema:
   - Se muestra un mensaje claro: "Debe crear un cliente antes de crear un proyecto"
   - El dropdown indica "No hay clientes disponibles"
   - El usuario debe crear un cliente primero desde el menú "Herramientas" → "Gestión de Clientes"

### Al Importar Proyectos

1. **Importación Individual**: 
   - El usuario debe seleccionar un cliente en la pestaña "Configuración"
   - El cliente es obligatorio junto con el nombre y ubicación del proyecto

2. **Importación Múltiple**:
   - Cada proyecto detectado requiere su propia selección de cliente
   - Los proyectos sin cliente no se pueden importar
   - Se puede asignar el mismo cliente a múltiples proyectos o diferentes clientes según corresponda

## Mensajes de Usuario

- **Creación de proyecto**: "Complete todos los campos requeridos" (si falta cliente)
- **Sin clientes**: "Debe crear un cliente antes de crear un proyecto"
- **Importación**: "Complete todos los campos requeridos (nombre, ubicación y cliente)"

## Flujo Recomendado para Nuevos Usuarios

1. Completar el perfil profesional en la pantalla de bienvenida
2. Crear al menos un cliente desde "Herramientas" → "Gestión de Clientes"
3. Crear proyectos asociados a ese cliente
4. Importar proyectos existentes asignando clientes según corresponda

## Beneficios de Este Cambio

### 1. Integridad de Datos
- Garantiza que cada proyecto tiene un cliente/promotor definido
- Previene proyectos huérfanos sin información del cliente
- Mejora la trazabilidad y la relación proyecto-cliente

### 2. Facturación Automática
- Las facturas generadas automáticamente al completar fases siempre tendrán datos del cliente
- Se eliminan errores por falta de información del promotor en facturas

### 3. Documentos Oficiales
- Los documentos generados automáticamente (memorias, certificados, etc.) siempre incluirán datos del cliente
- Cumplimiento con requisitos administrativos que exigen datos del promotor

### 4. Mejor Organización
- Permite filtrar proyectos por cliente
- Facilita la gestión de múltiples proyectos para el mismo cliente
- Mejora los reportes y estadísticas por cliente

## Compatibilidad con Datos Existentes

### ⚠️ Datos Previos

Los proyectos creados antes de esta actualización que no tengan un `clientId` asignado causarán errores de TypeScript. Para migrar datos existentes:

1. **Opción 1 - Eliminar Todos los Datos**: 
   - Usar el botón "Eliminar Todos los Datos" del menú de herramientas
   - Reiniciar la aplicación desde cero con la nueva lógica

2. **Opción 2 - Migración Manual**:
   - Crear clientes para los proyectos existentes
   - Editar cada proyecto antiguo para asignarle un cliente
   - Los proyectos sin cliente no se podrán guardar

## Archivos Modificados

1. `src/lib/types.ts` - Interfaz Project actualizada
2. `src/components/ProjectDialog.tsx` - Campo cliente obligatorio
3. `src/components/ProjectImportDialog.tsx` - Selección de cliente en importación
4. `src/components/BulkProjectImportDialog.tsx` - Cliente por proyecto en importación múltiple
5. `src/App.tsx` - Funciones de manejo de proyectos actualizadas
6. `PRD.md` - Documentación actualizada para reflejar el requisito obligatorio

## Documentación Actualizada

Se han actualizado las siguientes secciones del PRD:

- **Project Creation & Management**: Indica que el cliente es obligatorio
- **Project Import Missing Metadata**: Documenta que el cliente es obligatorio en importación
- **Bulk Import Configuration**: Indica validación de cliente en cada proyecto

## Próximos Pasos Sugeridos

1. Implementar filtros de proyecto por cliente en el dashboard
2. Agregar estadísticas de proyectos agrupados por cliente
3. Crear reportes de facturación por cliente
4. Implementar vista de "Proyectos del Cliente" desde el gestor de clientes
5. Agregar validación para evitar eliminar clientes con proyectos asociados

## Testing Recomendado

- [ ] Crear proyecto nuevo sin seleccionar cliente → debe estar deshabilitado
- [ ] Crear proyecto con cliente seleccionado → debe funcionar correctamente
- [ ] Intentar importar proyecto sin cliente → debe mostrar error
- [ ] Importar proyecto con cliente seleccionado → debe funcionar correctamente
- [ ] Importar múltiples proyectos, algunos sin cliente → debe mostrar error
- [ ] Verificar que todos los proyectos existentes tienen clientId asignado
- [ ] Editar proyecto existente sin cambiar cliente → debe funcionar
- [ ] Generar factura automática → debe incluir datos del cliente correctamente
