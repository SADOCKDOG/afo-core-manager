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

export function DeveloperManual() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const exportToPDF = () => {
    const doc = new jsPDF()
    let yPos = 20

    doc.setFontSize(20)
    doc.text('AFO CORE MANAGER - Manual del Desarrollador', 20, yPos)
    yPos += 15

    doc.setFontSize(10)
    const sections = getDocContent()
    
    sections.forEach(section => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.setFontSize(14)
      doc.text(section.title, 20, yPos)
      yPos += 10
      doc.setFontSize(10)
      
      const lines = doc.splitTextToSize(section.content, 170)
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        doc.text(line, 20, yPos)
        yPos += 7
      })
      yPos += 5
    })

    doc.save('developer-manual.pdf')
    toast.success('Manual exportado a PDF')
  }

  const exportToMarkdown = () => {
    const sections = getDocContent()
    let markdown = '# AFO CORE MANAGER - Manual del Desarrollador\n\n'
    
    sections.forEach(section => {
      markdown += `## ${section.title}\n\n${section.content}\n\n`
    })

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'developer-manual.md'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Manual exportado a Markdown')
  }

  const getDocContent = () => {
    return [
      {
        title: 'Diagramas de Arquitectura',
        content: 'La aplicación incluye diagramas visuales interactivos: 1) Arquitectura de Componentes - muestra la jerarquía desde App.tsx hasta componentes UI. 2) Flujo de Datos - ilustra cómo los datos fluyen desde la interacción del usuario hasta la persistencia y renderizado. 3) Workflows - muestra flujos completos como creación de proyectos, facturación automática y aprobación de documentos con firmas digitales. Ver pestaña "Diagramas" en este manual.'
      },
      {
        title: 'Arquitectura del Sistema',
        content: 'AFO CORE MANAGER utiliza React 19 con TypeScript, Vite como build tool, y Tailwind CSS v4. La arquitectura sigue un patrón de componentes funcionales con hooks personalizados para lógica reutilizable. El estado global se gestiona mediante useKV (persistencia local). Componentes UI de shadcn v4 proporcionan la base visual.'
      },
      {
        title: 'Estructura de Directorios',
        content: '/src/components - Componentes React principales y específicos del dominio. /src/components/ui - Componentes shadcn v4 pre-instalados. /src/lib - Utilidades, tipos, servicios y lógica de negocio. /src/hooks - Custom hooks de React. /src/assets - Recursos estáticos (imágenes, fonts). index.html - Punto de entrada HTML. src/main.tsx - Bootstrap de React (no modificar). src/App.tsx - Componente raíz de la aplicación.'
      },
      {
        title: 'Módulos Principales',
        content: 'Gestión de Proyectos (ProjectDialog, ProjectDetail, ProjectCard). Gestión Documental (DocumentManager, DocumentTemplateLibrary). Sistema de Facturación (InvoiceManager, BillingManager, AutoInvoiceConfirmDialog). Gestión de Clientes (ClientManager, ClientDialog). Presupuestos (BudgetManager, BC3ImportDialog). Cumplimiento Normativo (ComplianceChecker, MunicipalComplianceManager). Flujos de Aprobación (ApprovalFlowManager, ApprovalFlowTemplateManager). Firma Digital Cualificada (QualifiedSignatureProviderManager). Asistente IA (AIRegulatoryAssistant, AIContentGenerator). Calendario (ProjectCalendar).'
      },
      {
        title: 'APIs y Herramientas',
        content: 'spark.kv - Persistencia de datos local. useKV hook para estado reactivo con persistencia. spark.llm - Llamadas a LLM (gpt-4o, gpt-4o-mini). spark.llmPrompt - Constructor de prompts seguro. spark.user - Información del usuario GitHub. jsPDF - Generación de PDFs. JSZip - Manejo de archivos ZIP. date-fns - Manipulación de fechas. framer-motion - Animaciones. sonner - Toast notifications. react-hook-form + zod - Formularios y validación.'
      },
      {
        title: 'Tipos de Datos Principales',
        content: 'Project: id, title, location, status, phases[], stakeholders[], clientId, folderStructure. Client: id, tipo, nif, nombre/razonSocial, direccion, email, telefono. Invoice: id, projectId, clientId, invoiceNumber, issueDate, dueDate, status, items[], subtotal, taxRate, total. Budget: id, projectId, status, items[], totalPEM. Stakeholder: id, type, nif, name, email, collegiateNumber. Document: id, projectId, name, type, folder, versions[], metadata.'
      },
      {
        title: 'Servicios Clave',
        content: 'email-service.ts - Envío de emails SMTP. pdf-export.ts - Exportación de documentos. project-import.ts / project-export.ts - Import/export de proyectos. bc3-parser.ts - Parser de archivos BC3. invoice-utils.ts - Lógica de facturación automática. qualified-signature-service.ts - Integración con servicios de firma. approval-utils.ts - Flujos de aprobación. document-utils.ts - Gestión documental. compliance-data.ts - Datos de cumplimiento normativo.'
      },
      {
        title: 'Componentes UI Shadcn Disponibles',
        content: 'Button, Dialog, Input, Select, Textarea, Card, Tabs, ScrollArea, Dropdown Menu, Popover, Table, Form, Calendar, Checkbox, Radio Group, Switch, Slider, Progress, Badge, Alert, Separator, Tooltip, Sheet, Drawer, Sidebar, Accordion, Collapsible, Command, Context Menu, Hover Card, Menubar, Navigation Menu, Pagination, Toggle, Carousel, Chart, Avatar, Aspect Ratio, Input OTP, Resizable, Skeleton, Sonner (toasts).'
      },
      {
        title: 'Convenciones de Código',
        content: 'Usar TypeScript estricto. Componentes funcionales con React hooks. Props tipadas con interfaces. Imports organizados: React, librerías externas, componentes internos, utils, tipos. Nombrar componentes en PascalCase. Nombrar funciones en camelCase. Constantes en UPPER_SNAKE_CASE. CSS con Tailwind utility classes. Evitar inline styles. Usar cn() helper para combinar clases. Evitar any, usar tipos específicos. Formularios con react-hook-form + zod schemas.'
      },
      {
        title: 'Gestión de Estado',
        content: 'Estado local: useState para UI temporal. Estado persistente: useKV para datos que deben sobrevivir recargas. Formato: const [value, setValue] = useKV<Type>("key", defaultValue). Siempre usar actualizaciones funcionales: setValue(current => newValue). No usar localStorage directamente. Para listas: setList(current => [...current, newItem]). Para actualizaciones: setList(current => current.map(item => item.id === id ? updated : item)).'
      },
      {
        title: 'Flujo de Desarrollo',
        content: '1. Crear tipos en /src/lib/types.ts. 2. Crear utilidades/servicios en /src/lib/. 3. Crear componente en /src/components/. 4. Importar componentes shadcn necesarios de /src/components/ui/. 5. Usar useKV para persistencia. 6. Integrar en App.tsx o componente padre. 7. Probar funcionalidad. 8. Validar tipos TypeScript. 9. Verificar responsive design. 10. Comprobar accesibilidad.'
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
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                    </CardContent>
                  </Card>
                ))}
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
