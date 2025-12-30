import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Download, FileCode, MagnifyingGlass } from '@phosphor-icons/react'
import { ArchitectureDiagrams } from '@/components/ArchitectureDiagrams'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface DocSection {
  title: string
  content: string
  code?: string
}

export function DeveloperManual() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const exportToPDF = () => {
    const doc = new jsPDF()
    let yPos = 20
    const pageHeight = 270
    const margin = 20
    const contentWidth = 170

    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('AFO CORE MANAGER', margin, yPos)
    yPos += 10
    doc.setFontSize(16)
    doc.text('Manual del Desarrollador', margin, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Documentación técnica completa', margin, yPos)
    yPos += 15

    const sections = getDocContent()
    
    sections.forEach((section, idx) => {
      if (idx > 0 && yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, margin, yPos)
      yPos += 8
      
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const contentLines = doc.splitTextToSize(section.content, contentWidth)
      contentLines.forEach((line: string) => {
        if (yPos > pageHeight) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, margin, yPos)
        yPos += 5
      })
      yPos += 5
      
      if (section.code) {
        if (yPos > pageHeight - 30) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFont('courier', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(60, 60, 60)
        
        const codeLines = section.code.split('\n')
        codeLines.forEach((line: string) => {
          if (yPos > pageHeight) {
            doc.addPage()
            yPos = 20
          }
          const codeLine = line.substring(0, 100)
          doc.text(codeLine, margin + 5, yPos)
          yPos += 4
        })
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        yPos += 8
      }
      
      yPos += 5
    })

    doc.save('afo-developer-manual.pdf')
    toast.success('Manual exportado a PDF', {
      description: `${sections.length} secciones incluidas`
    })
  }

  const exportToMarkdown = () => {
    const sections = getDocContent()
    let markdown = '# AFO CORE MANAGER - Manual del Desarrollador\n\n'
    markdown += '> Documentación técnica completa y detallada\n\n'
    markdown += `**Generado:** ${new Date().toLocaleDateString('es-ES')}\n\n`
    markdown += '---\n\n'
    
    markdown += '## Tabla de Contenidos\n\n'
    sections.forEach((section, idx) => {
      const anchor = section.title.toLowerCase().replace(/[^\w]+/g, '-')
      markdown += `${idx + 1}. [${section.title}](#${anchor})\n`
    })
    markdown += '\n---\n\n'
    
    sections.forEach(section => {
      markdown += `## ${section.title}\n\n`
      markdown += `${section.content}\n\n`
      
      if (section.code) {
        markdown += '```typescript\n'
        markdown += section.code
        markdown += '\n```\n\n'
      }
      
      markdown += '---\n\n'
    })
    
    markdown += '## Pie de Página\n\n'
    markdown += 'Este manual ha sido generado automáticamente por AFO CORE MANAGER.\n'
    markdown += 'Para más información, consulta la documentación en línea.\n'

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'afo-developer-manual.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Manual exportado a Markdown', {
      description: `${sections.length} secciones con ejemplos de código`
    })
  }

  const getDocContent = () => {
    return [
      {
        title: '1. Resumen Ejecutivo',
        content: `AFO CORE MANAGER es una aplicación web completa para gestión arquitectónica desarrollada con:
- React 19 + TypeScript
- Vite 7.2 (build tool)
- Tailwind CSS v4
- shadcn/ui v4 (componentes)
- Spark Runtime SDK (persistencia y LLM)

Arquitectura: Single Page Application (SPA) con componentes funcionales, hooks personalizados y gestión de estado local persistente.`,
        code: `// Stack tecnológico principal
{
  "frontend": "React 19 + TypeScript",
  "build": "Vite 7.2.6",
  "styling": "Tailwind CSS 4.1.17",
  "ui": "shadcn v4 + Radix UI",
  "state": "React Hooks + useKV",
  "forms": "react-hook-form + zod",
  "animations": "framer-motion"
}`
      },
      {
        title: '2. Arquitectura del Sistema',
        content: `Estructura de capas:

CAPA DE PRESENTACIÓN (Components)
├─ App.tsx (Root Component)
├─ Feature Components (Dashboard, ProjectDetail, etc.)
└─ UI Components (shadcn/ui)

CAPA DE LÓGICA (Lib)
├─ Types (TypeScript interfaces)
├─ Services (API integrations)
├─ Utils (Helper functions)
└─ Business Logic

CAPA DE DATOS (Spark KV)
└─ Persistent Local Storage

Patrón de diseño: Component-based architecture con separación de responsabilidades.`,
        code: `// Ejemplo de arquitectura de componente
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { ProjectService } from '@/lib/project-service'

export function ProjectManager() {
  const [projects, setProjects] = useKV<Project[]>('projects', [])
  
  const handleCreate = (data: Partial<Project>) => {
    const newProject = ProjectService.create(data)
    setProjects(current => [...current, newProject])
  }
  
  return <ProjectList projects={projects} onCreate={handleCreate} />
}`
      },
      {
        title: '3. Estructura de Directorios',
        content: `Organización del proyecto:

/workspaces/spark-template/
├── index.html                    # Punto de entrada HTML
├── package.json                  # Dependencias npm
├── vite.config.ts               # Configuración Vite
├── tailwind.config.js           # Configuración Tailwind
└── src/
    ├── App.tsx                  # Componente raíz
    ├── main.tsx                 # Bootstrap React (NO MODIFICAR)
    ├── main.css                 # CSS estructural (NO MODIFICAR)
    ├── index.css                # CSS customizado y tema
    ├── components/              # Componentes React
    │   ├── ui/                  # shadcn components (45+ componentes)
    │   ├── Dashboard.tsx
    │   ├── ProjectDetail.tsx
    │   └── ...
    ├── lib/                     # Lógica de negocio
    │   ├── types.ts             # TypeScript types/interfaces
    │   ├── utils.ts             # Helpers generales
    │   ├── *-service.ts         # Servicios
    │   └── *-utils.ts           # Utilidades específicas
    ├── hooks/                   # Custom React hooks
    │   └── use-mobile.ts
    └── assets/                  # Recursos estáticos
        ├── images/
        ├── video/
        └── audio/`,
        code: `// Convención de imports
import { useState, useEffect } from 'react'              // React primero
import { useKV } from '@github/spark/hooks'              // Hooks externos
import { Button } from '@/components/ui/button'          // UI components
import { ProjectCard } from '@/components/ProjectCard'   // Feature components
import { cn } from '@/lib/utils'                         // Utils
import { Project } from '@/lib/types'                    // Types al final`
      },
      {
        title: '4. Tipos de Datos Principales',
        content: `Interfaces TypeScript definidas en /src/lib/types.ts:

PROJECT - Entidad principal de proyecto
CLIENT - Datos de cliente (personas/empresas)
INVOICE - Facturas y facturación
BUDGET - Presupuestos con partidas BC3
STAKEHOLDER - Intervinientes del proyecto
DOCUMENT - Documentos con versionado
APPROVAL_FLOW - Flujos de aprobación
SIGNATURE_REQUEST - Solicitudes de firma digital`,
        code: `// Definiciones principales (types.ts)
export interface Project {
  id: string
  title: string
  description?: string
  location: string
  status: 'active' | 'archived' | 'on-hold'
  phases: ProjectPhaseData[]
  stakeholders: string[]
  clientId?: string
  folderStructure?: FolderStructureType
  createdAt: number
  updatedAt: number
}

export interface Client {
  id: string
  tipo: 'persona' | 'empresa'
  nif: string
  nombre?: string
  apellido1?: string
  apellido2?: string
  razonSocial?: string
  direccion?: string
  ciudad?: string
  codigoPostal?: string
  provincia?: string
  pais?: string
  email?: string
  telefono?: string
  contactoPrincipal?: string
}

export interface Invoice {
  id: string
  projectId: string
  clientId: string
  invoiceNumber: string
  issueDate: number
  dueDate: number
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  subtotal: number
  taxRate: number
  total: number
  notes?: string
}`
      },
      {
        title: '5. Spark Runtime SDK',
        content: `API global 'spark' para funcionalidades específicas de la plataforma:

PERSISTENCIA (spark.kv)
- Almacenamiento local key-value
- API asíncrona
- useKV hook para React

LLM (spark.llm)
- Llamadas a modelos GPT
- Modos: texto y JSON
- Construcción segura de prompts

USER (spark.user)
- Información del usuario
- Avatar, email, login
- isOwner flag`,
        code: `// Uso de Spark SDK

// 1. Persistencia con useKV (RECOMENDADO)
import { useKV } from '@github/spark/hooks'

const [todos, setTodos] = useKV<Todo[]>('todos', [])

// ❌ INCORRECTO - referencia stale
setTodos([...todos, newTodo])

// ✅ CORRECTO - update funcional
setTodos(current => [...current, newTodo])

// 2. API directa spark.kv
await spark.kv.set('config', { theme: 'dark' })
const config = await spark.kv.get<Config>('config')
const keys = await spark.kv.keys()
await spark.kv.delete('config')

// 3. LLM calls
const prompt = spark.llmPrompt\`Analizar: \${text}\`
const result = await spark.llm(prompt, 'gpt-4o')

// JSON mode
const prompt = spark.llmPrompt\`Generar JSON...\`
const json = await spark.llm(prompt, 'gpt-4o', true)
const data = JSON.parse(json)

// 4. Usuario actual
const user = await spark.user()
if (user.isOwner) {
  // Funcionalidad de admin
}`
      },
      {
        title: '6. Módulos y Componentes',
        content: `Componentes principales organizados por dominio:

GESTIÓN DE PROYECTOS
- ProjectDialog: Crear/editar proyectos
- ProjectDetail: Vista detallada con fases
- ProjectCard: Card de proyecto
- ProjectCalendar: Vista de calendario

GESTIÓN DOCUMENTAL
- DocumentManager: Gestor principal
- DocumentTemplateLibrary: Plantillas
- DocumentPreview: Vista previa
- BulkDocumentUpload: Carga múltiple

FACTURACIÓN
- InvoiceManager: Gestor de facturas
- InvoiceDialog: Crear/editar facturas
- AutoInvoiceConfirmDialog: Facturación automática
- BillingManager: Configuración de facturación

CLIENTES Y PRESUPUESTOS
- ClientManager: Gestor de clientes
- ClientDialog: Formulario de cliente
- BudgetManager: Gestor de presupuestos
- BC3ImportDialog: Importar BC3

CUMPLIMIENTO NORMATIVO
- ComplianceChecker: Verificador normativo
- MunicipalComplianceManager: Normativa municipal
- AIRegulatoryAssistant: Asistente IA
- BoardPermitWorkflow: Workflow de visados

APROBACIONES Y FIRMAS
- ApprovalFlowManager: Gestor de flujos
- ApprovalFlowTemplateManager: Plantillas
- QualifiedSignatureProviderManager: Proveedores
- QualifiedSignatureRequestViewer: Solicitudes
- DigitalSignaturePad: Firma digital`,
        code: `// Ejemplo: Crear un nuevo componente feature

import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus } from '@phosphor-icons/react'
import { MyEntity } from '@/lib/types'
import { toast } from 'sonner'

export function MyFeatureManager() {
  const [entities, setEntities] = useKV<MyEntity[]>('my-entities', [])
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleCreate = (data: Partial<MyEntity>) => {
    const newEntity: MyEntity = {
      id: Date.now().toString(),
      ...data,
      createdAt: Date.now()
    } as MyEntity
    
    setEntities(current => [...current, newEntity])
    toast.success('Entidad creada')
    setDialogOpen(false)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mi Feature</h2>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus size={18} />
          Nuevo
        </Button>
      </div>
      
      <div className="grid gap-4">
        {entities.map(entity => (
          <Card key={entity.id}>
            <CardHeader>
              <CardTitle>{entity.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Contenido */}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* Dialog content */}
      </Dialog>
    </div>
  )
}`
      },
      {
        title: '7. Servicios y Utilidades',
        content: `Módulos de lógica de negocio en /src/lib/:

SERVICIOS DE EMAIL
- email-service.ts: Configuración SMTP, envío de emails

SERVICIOS DE DOCUMENTOS
- pdf-export.ts: Exportación a PDF con jsPDF
- document-utils.ts: Gestión documental
- document-templates.ts: Plantillas predefinidas
- visual-guide-export.ts: Exportación de guías

IMPORT/EXPORT
- project-import.ts: Importar proyectos desde ZIP
- project-export.ts: Exportar proyectos completos
- bc3-parser.ts: Parser de archivos BC3 (presupuestos)

FIRMA DIGITAL
- qualified-signature-service.ts: Integración Cl@ve/Viafirma
- qualified-signature-types.ts: Tipos de firma

FACTURACIÓN
- invoice-utils.ts: Generación automática de facturas
- budget-utils.ts: Cálculos de presupuesto
- budget-prices.ts: Base de datos de precios

CUMPLIMIENTO
- compliance-data.ts: Datos normativos
- municipal-compliance.ts: Normativa municipal
- regulatory-data.ts: Datos regulatorios
- ai-regulatory.ts: Prompts IA

APROBACIONES
- approval-utils.ts: Lógica de flujos
- approval-types.ts: Tipos de aprobación

VISADOS
- visa-utils.ts: Utilidades de visado
- visa-validation.ts: Validación de visados`,
        code: `// Ejemplo: Servicio de email (email-service.ts)
import { useKV } from '@github/spark/hooks'

export interface EmailConfig {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
}

export function useEmailConfig() {
  const [config, setConfig] = useKV<EmailConfig | null>('email-config', null)
  
  const isConfigured = config !== null && 
    config.smtpHost && 
    config.smtpUser && 
    config.fromEmail
  
  return { config, setConfig, isConfigured }
}

export async function sendEmail(to: string, subject: string, body: string) {
  // Implementación de envío
  const config = await spark.kv.get<EmailConfig>('email-config')
  
  if (!config) {
    throw new Error('Email no configurado')
  }
  
  // Lógica de envío SMTP
  return { success: true, messageId: Date.now().toString() }
}

// Ejemplo: Utilidad de facturación (invoice-utils.ts)
export function generateInvoiceNumber(lastNumber?: string): string {
  const year = new Date().getFullYear()
  const lastNum = lastNumber ? parseInt(lastNumber.split('-')[1]) : 0
  return \`\${year}-\${String(lastNum + 1).padStart(4, '0')}\`
}

export function calculateInvoiceTotal(items: InvoiceItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice), 0
  )
  const tax = subtotal * (taxRate / 100)
  return {
    subtotal,
    tax,
    total: subtotal + tax
  }
}`
      },
      {
        title: '8. Componentes UI shadcn',
        content: `45+ componentes pre-instalados en /src/components/ui/:

FORMULARIOS: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Slider, Calendar, Form, Label, Input OTP

CONTENEDORES: Card, Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card, Accordion, Collapsible, Tabs

NAVEGACIÓN: Dropdown Menu, Context Menu, Menubar, Navigation Menu, Sidebar, Breadcrumb

FEEDBACK: Alert, Alert Dialog, Toast (Sonner), Progress, Badge, Skeleton

DATOS: Table, Pagination, Scroll Area, Separator

VISUALIZACIÓN: Chart, Avatar, Aspect Ratio, Carousel

INTERACCIÓN: Command, Toggle, Toggle Group, Resizable

Todos importables desde @/components/ui/[component-name]`,
        code: `// Uso de componentes shadcn

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// Ejemplo de uso
export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
        <CardDescription>Descripción</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Ingrese nombre" />
          </div>
          
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Opción 1</SelectItem>
              <SelectItem value="2">Opción 2</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => toast.success('Guardado')}>
            Guardar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}`
      },
      {
        title: '9. Gestión de Estado y Persistencia',
        content: `Estrategias de estado en la aplicación:

ESTADO LOCAL (useState)
- UI temporal (modals open/close)
- Inputs de formularios
- Estados de carga
- Tabs activos
- Filtros temporales

ESTADO PERSISTENTE (useKV)
- Datos de entidades (Projects, Clients, Invoices)
- Configuración de usuario
- Preferencias
- Datos que deben sobrevivir reloads

REGLA DE ORO:
¿Debe persistir después de recargar? → useKV
¿Solo durante la sesión? → useState`,
        code: `// Gestión de estado: Patrones

// 1. Estado temporal UI
const [isOpen, setIsOpen] = useState(false)
const [activeTab, setActiveTab] = useState('general')
const [searchQuery, setSearchQuery] = useState('')

// 2. Estado persistente
const [projects, setProjects] = useKV<Project[]>('projects', [])
const [config, setConfig] = useKV<Config>('app-config', defaultConfig)

// 3. Operaciones CRUD con useKV

// CREATE
const handleCreate = (data: Partial<Project>) => {
  const newProject: Project = {
    id: Date.now().toString(),
    ...data,
    createdAt: Date.now()
  } as Project
  
  setProjects(current => [...current, newProject])
}

// READ (se lee directamente)
const project = projects.find(p => p.id === projectId)

// UPDATE
const handleUpdate = (id: string, updates: Partial<Project>) => {
  setProjects(current =>
    current.map(p =>
      p.id === id
        ? { ...p, ...updates, updatedAt: Date.now() }
        : p
    )
  )
}

// DELETE
const handleDelete = (id: string) => {
  setProjects(current => current.filter(p => p.id !== id))
}

// 4. Actualizaciones anidadas
const handleUpdatePhase = (projectId: string, phaseIndex: number, status: PhaseStatus) => {
  setProjects(current =>
    current.map(project =>
      project.id === projectId
        ? {
            ...project,
            phases: project.phases.map((phase, idx) =>
              idx === phaseIndex ? { ...phase, status } : phase
            ),
            updatedAt: Date.now()
          }
        : project
    )
  )
}

// 5. Limpiar todo
const handleClearAll = () => {
  setProjects([])
}`
      },
      {
        title: '10. Formularios y Validación',
        content: `Sistema de formularios con react-hook-form + zod:

STACK:
- react-hook-form: Gestión de formularios
- zod: Validación de esquemas
- @hookform/resolvers: Integración

PATRÓN:
1. Definir schema zod
2. useForm con zodResolver
3. Campos con register o Controller
4. onSubmit con datos validados`,
        code: `// Ejemplo completo de formulario

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 1. Schema de validación
const projectSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  location: z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  status: z.enum(['active', 'archived']),
  clientId: z.string().optional()
})

type ProjectFormData = z.infer<typeof projectSchema>

// 2. Componente de formulario
export function ProjectForm({ 
  initialData, 
  onSubmit 
}: { 
  initialData?: Project
  onSubmit: (data: ProjectFormData) => void 
}) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: '',
      location: '',
      description: '',
      status: 'active'
    }
  })
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nombre del proyecto" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}`
      },
      {
        title: '11. Styling con Tailwind CSS',
        content: `Sistema de estilos basado en utility classes:

CONFIGURACIÓN:
- Tailwind CSS v4
- Variables CSS en index.css
- Tema personalizado con oklch
- Helper cn() para combinar clases

CONVENCIONES:
- Utility-first approach
- Responsive con prefijos (md:, lg:)
- Estados con prefijos (hover:, focus:)
- Combinar con cn() helper`,
        code: `// Tema y variables (index.css)
:root {
  --background: oklch(0.13 0.015 250);
  --foreground: oklch(0.96 0.008 70);
  --primary: oklch(0.52 0.18 250);
  --primary-foreground: oklch(0.99 0.003 70);
  --accent: oklch(0.68 0.19 40);
  --border: oklch(0.27 0.02 250);
  --radius: 0.625rem;
}

// Uso de utilities
<div className="flex items-center justify-between gap-4">
  <h2 className="text-2xl font-bold tracking-tight">Título</h2>
  <Button className="gap-2 bg-accent hover:bg-accent/90">
    Acción
  </Button>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>

// Helper cn() para combinar clases condicionales
import { cn } from '@/lib/utils'

<Button
  className={cn(
    "gap-2 transition-all",
    isActive && "bg-primary text-primary-foreground shadow-lg",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  {label}
</Button>

// Custom classes en index.css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
}`
      },
      {
        title: '12. Animaciones con Framer Motion',
        content: `Animaciones fluidas y transiciones:

LIBRERÍA: framer-motion 12.23
CASOS DE USO:
- Transiciones de vistas
- Entrada/salida de elementos
- Animaciones de lista
- Gestos y arrastrar`,
        code: `// Ejemplos de animaciones

import { motion, AnimatePresence } from 'framer-motion'

// 1. Transición de vista
<AnimatePresence mode="wait">
  {viewMode === 'dashboard' && (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Dashboard />
    </motion.div>
  )}
</AnimatePresence>

// 2. Lista animada
{projects.map((project, index) => (
  <motion.div
    key={project.id}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
  >
    <ProjectCard project={project} />
  </motion.div>
))}

// 3. Hover effect
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  <Card />
</motion.div>

// 4. Layout animations
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</motion.div>`
      },
      {
        title: '13. Integración con LLM (IA)',
        content: `Uso de modelos de lenguaje para features IA:

MODELOS DISPONIBLES:
- gpt-4o (default)
- gpt-4o-mini

CASOS DE USO:
- Generación de contenido
- Asistente normativo
- Análisis de documentos
- Sugerencias inteligentes`,
        code: `// Patrones de uso de LLM

// 1. Generación de texto simple
async function generateDescription(projectTitle: string) {
  const prompt = spark.llmPrompt\`
    Genera una descripción profesional para un proyecto arquitectónico llamado "\${projectTitle}".
    Máximo 200 palabras, tono formal.
  \`
  
  const description = await spark.llm(prompt, 'gpt-4o')
  return description
}

// 2. JSON mode para datos estructurados
async function analyzeCompliance(projectData: string) {
  const prompt = spark.llmPrompt\`
    Analiza el siguiente proyecto y devuelve un objeto JSON con:
    {
      "issues": [{id, severity, description, recommendation}],
      "score": number,
      "summary": string
    }
    
    Proyecto: \${projectData}
  \`
  
  const resultJson = await spark.llm(prompt, 'gpt-4o', true)
  const result = JSON.parse(resultJson)
  return result
}

// 3. Generación de lista (array)
async function generateTasks(phase: string) {
  const prompt = spark.llmPrompt\`
    Genera 10 tareas para la fase "\${phase}" de un proyecto arquitectónico.
    Devuelve JSON con formato:
    {
      "tasks": [
        {"id": "1", "title": "...", "priority": "high|medium|low"}
      ]
    }
  \`
  
  const json = await spark.llm(prompt, 'gpt-4o-mini', true)
  const { tasks } = JSON.parse(json)
  return tasks
}

// 4. Componente con IA
export function AIAssistant() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  
  const handleAnalyze = async (input: string) => {
    setLoading(true)
    try {
      const prompt = spark.llmPrompt\`Analizar: \${input}\`
      const response = await spark.llm(prompt)
      setResult(response)
      toast.success('Análisis completado')
    } catch (error) {
      toast.error('Error en análisis IA')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <Button onClick={() => handleAnalyze('...')} disabled={loading}>
        {loading ? 'Analizando...' : 'Analizar con IA'}
      </Button>
      {result && <div className="mt-4">{result}</div>}
    </div>
  )
}`
      },
      {
        title: '14. Convenciones de Código',
        content: `Estándares y mejores prácticas:

NOMENCLATURA:
- Componentes: PascalCase (ProjectCard)
- Funciones: camelCase (handleSubmit)
- Constantes: UPPER_SNAKE_CASE (MAX_FILE_SIZE)
- Archivos: kebab-case (project-utils.ts)
- Tipos: PascalCase (ProjectStatus)

TYPESCRIPT:
- Evitar 'any', usar tipos específicos
- Interfaces para objetos
- Types para unions/primitivos
- Props siempre tipadas

ESTRUCTURA:
- 1 componente por archivo
- Exports named por defecto
- Agrupar imports por categoría
- Orden: React, externos, internos, utils, types`,
        code: `// Estructura de archivo de componente

// 1. Imports
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Trash } from '@phosphor-icons/react'
import { ProjectService } from '@/lib/project-service'
import { cn } from '@/lib/utils'
import { Project, ProjectStatus } from '@/lib/types'
import { toast } from 'sonner'

// 2. Types/Interfaces
interface ProjectListProps {
  projects: Project[]
  onSelect: (project: Project) => void
  onDelete: (id: string) => void
  className?: string
}

// 3. Constantes
const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'Activo',
  archived: 'Archivado',
  'on-hold': 'En Pausa'
}

// 4. Componente
export function ProjectList({ 
  projects, 
  onSelect, 
  onDelete,
  className 
}: ProjectListProps) {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter)
  
  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar proyecto?')) {
      onDelete(id)
      toast.success('Proyecto eliminado')
    }
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Contenido */}
    </div>
  )
}

// 5. Exports adicionales
export { STATUS_LABELS }`
      },
      {
        title: '15. Testing y Debugging',
        content: `Herramientas y técnicas:

DEBUGGING:
- React DevTools (extensión browser)
- Console.log estratégico
- TypeScript error checking
- Vite error overlay

VALIDACIÓN:
- TypeScript compiler
- ESLint (configurado)
- Runtime error boundaries

TESTING:
- Vitest (configurado)
- @testing-library/react
- Testing manual en navegador`,
        code: `// Patterns de debugging

// 1. Logging estructurado
console.group('Project Update')
console.log('Before:', prevProject)
console.log('Updates:', updates)
console.log('After:', nextProject)
console.groupEnd()

// 2. Conditional logging
const DEBUG = import.meta.env.DEV

if (DEBUG) {
  console.log('State change:', { old: prev, new: next })
}

// 3. Error boundaries (ya implementado)
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onError={(error) => console.error('Error caught:', error)}
>
  <App />
</ErrorBoundary>

// 4. Type guards
function isProject(obj: any): obj is Project {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string'
}

const data = await fetchData()
if (isProject(data)) {
  // TypeScript sabe que data es Project
  console.log(data.title)
}

// 5. Async error handling
async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    console.error('Fetch failed:', error)
    toast.error('Error al cargar datos')
    return null
  }
}

const projects = await safeFetch(() => 
  spark.kv.get<Project[]>('projects')
)`
      },
      {
        title: '16. Flujo de Desarrollo',
        content: `Proceso paso a paso para nuevas features:

1. PLANIFICACIÓN
   - Definir requisitos
   - Identificar tipos necesarios
   - Diseñar interfaz UI

2. TIPOS Y DATOS
   - Agregar interfaces en types.ts
   - Crear schemas de validación
   - Definir valores por defecto

3. SERVICIOS/UTILS
   - Crear funciones helper
   - Implementar lógica de negocio
   - Agregar funciones en /lib/

4. COMPONENTES
   - Crear componente base
   - Integrar shadcn components
   - Implementar formularios

5. ESTADO
   - Configurar useKV si persiste
   - useState para UI temporal
   - Implementar CRUD

6. INTEGRACIÓN
   - Importar en App.tsx
   - Agregar a navegación
   - Conectar con otros módulos

7. TESTING
   - Probar casos de uso
   - Verificar responsive
   - Validar tipos TypeScript

8. REFINAMIENTO
   - Mejorar UX
   - Agregar animaciones
   - Optimizar rendimiento`,
        code: `// Ejemplo: Agregar módulo de Tareas

// PASO 1: types.ts
export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  dueDate?: number
  createdAt: number
  updatedAt: number
}

// PASO 2: task-utils.ts
import { Task } from './types'

export function createTask(data: Partial<Task>): Task {
  return {
    id: Date.now().toString(),
    status: 'pending',
    priority: 'medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data
  } as Task
}

export function filterTasksByStatus(
  tasks: Task[], 
  status: Task['status']
) {
  return tasks.filter(t => t.status === status)
}

// PASO 3: TaskManager.tsx
import { useKV } from '@github/spark/hooks'
import { Task } from '@/lib/types'
import { createTask } from '@/lib/task-utils'

export function TaskManager() {
  const [tasks, setTasks] = useKV<Task[]>('tasks', [])
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const handleCreate = (data: Partial<Task>) => {
    const newTask = createTask(data)
    setTasks(current => [...current, newTask])
    toast.success('Tarea creada')
  }
  
  return (
    <div>
      {/* UI implementation */}
    </div>
  )
}

// PASO 4: Integrar en App.tsx
import { TaskManager } from '@/components/TaskManager'

// Agregar a menú o vista`
      },
      {
        title: '17. Dependencias Principales',
        content: `Librerías y versiones instaladas:

CORE:
- react: 19.2.0
- react-dom: 19.2.0
- typescript: 5.7.3
- vite: 7.2.6

UI:
- @radix-ui/*: Componentes primitivos
- tailwindcss: 4.1.17
- framer-motion: 12.23.25
- lucide-react / @phosphor-icons/react: Iconos

FORMULARIOS:
- react-hook-form: 7.67.0
- zod: 3.25.76
- @hookform/resolvers: 4.1.3

UTILIDADES:
- date-fns: 3.6.0
- clsx + tailwind-merge: 2.1.1 + 3.4.0
- sonner: 2.0.7 (toasts)

DOCUMENTOS:
- jspdf: 3.0.4
- jszip: 3.10.1

GRÁFICOS:
- recharts: 2.15.4
- d3: 7.9.0

OTROS:
- @tanstack/react-query: 5.90.11
- marked: 15.0.12 (markdown)
- uuid: 11.1.0`,
        code: `// package.json (extracto)
{
  "name": "afo-core-manager",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@github/spark": "file:./packages/spark-tools",
    "framer-motion": "^12.23.25",
    "react-hook-form": "^7.67.0",
    "zod": "^3.25.76",
    "jspdf": "^3.0.4",
    "sonner": "^2.0.7",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^4.2.2",
    "typescript": "^5.7.3",
    "vite": "^7.2.6",
    "eslint": "^9.39.1"
  }
}`
      },
      {
        title: '18. API Reference - Spark SDK',
        content: `Documentación completa de la API Spark:

spark.kv.get<T>(key: string): Promise<T | undefined>
spark.kv.set<T>(key: string, value: T): Promise<void>
spark.kv.delete(key: string): Promise<void>
spark.kv.keys(): Promise<string[]>

spark.llm(prompt: string, model?: string, jsonMode?: boolean): Promise<string>
spark.llmPrompt: Template tag function

spark.user(): Promise<UserInfo>

useKV<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>, () => void]`,
        code: `// API Reference con ejemplos

// ========== PERSISTENCIA ==========

// Get value
const config = await spark.kv.get<Config>('config')
if (config) {
  console.log(config.theme)
}

// Set value
await spark.kv.set('config', { 
  theme: 'dark', 
  language: 'es' 
})

// Delete value
await spark.kv.delete('config')

// List all keys
const keys = await spark.kv.keys()
console.log('Stored keys:', keys)

// useKV hook (React)
const [value, setValue, deleteValue] = useKV<string>('myKey', 'default')

// Set
setValue('new value')

// Update functional
setValue(current => current.toUpperCase())

// Delete
deleteValue()

// ========== LLM ==========

// Construct prompt (REQUIRED)
const prompt = spark.llmPrompt\`
  You are an expert. Analyze: \${input}
\`

// Call LLM (text mode)
const response = await spark.llm(prompt)
const response2 = await spark.llm(prompt, 'gpt-4o-mini')

// Call LLM (JSON mode)
const jsonStr = await spark.llm(prompt, 'gpt-4o', true)
const data = JSON.parse(jsonStr)

// ========== USER ==========

const user = await spark.user()
console.log(user.login)      // GitHub username
console.log(user.email)      // User email
console.log(user.avatarUrl)  // Avatar URL
console.log(user.isOwner)    // Is app owner?

if (user.isOwner) {
  // Show admin features
}`
      },
      {
        title: '19. Troubleshooting Common Issues',
        content: `Problemas comunes y soluciones:

ESTADO NO SE ACTUALIZA:
- Usar update funcional con useKV
- No referenciar valor stale

TIPOS TYPESCRIPT:
- Verificar imports
- Usar as para type assertions
- Revisar null/undefined

COMPONENTES NO RENDERIZAN:
- Verificar keys en listas
- Comprobar props
- Revisar conditional rendering

ESTILOS NO SE APLICAN:
- Verificar orden de imports CSS
- Usar cn() para combinar clases
- Revisar Tailwind config`,
        code: `// Soluciones a problemas comunes

// ❌ PROBLEMA: Estado stale
const [items, setItems] = useKV<Item[]>('items', [])
const addItem = (item: Item) => {
  setItems([...items, item]) // ¡items puede ser stale!
}

// ✅ SOLUCIÓN: Update funcional
const addItem = (item: Item) => {
  setItems(current => [...current, item])
}

// ❌ PROBLEMA: Type error
const project = projects.find(p => p.id === id)
console.log(project.title) // Error: puede ser undefined

// ✅ SOLUCIÓN: Null check
const project = projects.find(p => p.id === id)
if (project) {
  console.log(project.title)
}

// O con optional chaining
console.log(project?.title)

// ❌ PROBLEMA: Keys dinámicas incorrectas
{items.map((item, index) => (
  <div key={index}>{item.name}</div> // ¡No usar index!
))}

// ✅ SOLUCIÓN: Keys únicas estables
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ PROBLEMA: Async sin await
const loadData = () => {
  const data = spark.kv.get('data') // Promise, no datos
  setData(data) // Error
}

// ✅ SOLUCIÓN: Async/await
const loadData = async () => {
  const data = await spark.kv.get('data')
  if (data) setData(data)
}

// useEffect para carga inicial
useEffect(() => {
  loadData()
}, [])

// ❌ PROBLEMA: Import incorrecto
import Button from '@/components/ui/button'

// ✅ SOLUCIÓN: Named import
import { Button } from '@/components/ui/button'`
      },
      {
        title: '20. Recursos y Referencias',
        content: `Enlaces útiles para desarrollo:

DOCUMENTACIÓN:
- React: react.dev
- TypeScript: typescriptlang.org
- Tailwind CSS: tailwindcss.com
- shadcn/ui: ui.shadcn.com
- Radix UI: radix-ui.com
- Framer Motion: framer.com/motion

HERRAMIENTAS:
- Vite: vitejs.dev
- Zod: zod.dev
- React Hook Form: react-hook-form.com
- date-fns: date-fns.org
- jsPDF: github.com/parallax/jsPDF

ICONOS:
- Phosphor Icons: phosphoricons.com
- Lucide Icons: lucide.dev

COMUNIDAD:
- GitHub Discussions
- Stack Overflow
- Discord communities`,
        code: `// Quick reference card

// Crear proyecto
npm create vite@latest

// Instalar dependencias
npm install

// Desarrollo
npm run dev

// Build producción
npm run build

// Preview build
npm run preview

// Agregar componente shadcn (manual)
// Copiar de /src/components/ui/

// Imports comunes
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Patrón componente básico
export function MyComponent() {
  const [data, setData] = useKV('key', [])
  
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  )
}`
      }
    ]
  }

  const filteredSections = getDocContent().filter(section =>
    searchQuery === '' || 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Code size={18} weight="duotone" />
          Manual Desarrollador
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <FileCode size={28} weight="duotone" className="text-primary" />
            Manual del Desarrollador
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar en el manual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={exportToPDF} className="gap-2" variant="outline">
            <Download size={18} />
            PDF
          </Button>
          <Button onClick={exportToMarkdown} className="gap-2" variant="outline">
            <Download size={18} />
            Markdown
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="diagrams">Diagramas</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredSections.map((section, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-primary text-lg">{section.title.split('.')[0]}.</span>
                        <span>{section.title.split('.').slice(1).join('.')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                        {section.content}
                      </p>
                      {section.code && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Code size={16} className="text-accent" weight="bold" />
                            <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                              Ejemplo de Código
                            </span>
                          </div>
                          <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
                            <code className="text-xs font-mono text-foreground leading-relaxed">
                              {section.code}
                            </code>
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {filteredSections.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No se encontraron resultados para "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="diagrams">
            <ArchitectureDiagrams />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
