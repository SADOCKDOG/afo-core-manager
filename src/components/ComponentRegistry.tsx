import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Package, Download, FileCode } from '@phosphor-icons/react'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

interface ComponentInfo {
  name: string
  description: string
  category: string
  features?: string[]
  props?: string[]
  hooks?: string[]
  dependencies?: string[]
  relatedComponents?: string[]
  apis?: string[]
  complexity?: 'Low' | 'Medium' | 'High'
  status?: 'Stable' | 'Beta' | 'Experimental'
}

interface UtilityModule {
  name: string
  exports: string[]
  description: string
}

const components: ComponentInfo[] = [
  {
    name: 'Dashboard',
    description: 'Main overview screen with project statistics and quick insights',
    category: 'Business',
    features: [
      'Project distribution by status',
      'Interactive charts and metrics',
      'Recent activity feed',
      'Quick navigation to key sections'
    ],
    props: ['projects', 'clients', 'invoices', 'budgets', 'milestones', 'onNavigate'],
    hooks: ['useMemo'],
    dependencies: ['Card', 'Button', 'recharts'],
    relatedComponents: ['ProjectCard', 'InvoiceManager'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCard',
    description: 'Display card for individual projects with status and progress',
    category: 'Business',
    features: [
      'Project metadata display',
      'Phase progress visualization',
      'Status indicators',
      'Click to view details'
    ],
    props: ['project', 'onClick', 'index'],
    hooks: ['useMemo'],
    dependencies: ['Card', 'Badge', 'framer-motion'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectDetail',
    description: 'Detailed project view with phases, documents, and stakeholders',
    category: 'Business',
    features: [
      'Phase management and status updates',
      'Document organization',
      'Stakeholder assignment',
      'Budget tracking'
    ],
    props: ['project', 'stakeholders', 'onBack', 'onEdit', 'onUpdatePhaseStatus', 'onProjectUpdate'],
    hooks: ['useState', 'useKV'],
    dependencies: ['Tabs', 'Button', 'Card'],
    relatedComponents: ['DocumentManager', 'BudgetManager'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectDialog',
    description: 'Multi-step wizard for creating and editing projects',
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onSave', 'project'],
    features: [
      'Multi-step wizard (Details, Phases, Stakeholders)',
      'Form validation',
      'Folder structure configuration',
      'Phase percentage distribution'
    ],
    hooks: ['useState', 'useEffect'],
    dependencies: ['Dialog', 'Input', 'Tabs', 'Button'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentManager',
    description: 'Complete document lifecycle management for projects',
    category: 'Manager',
    props: ['projectId', 'projectTitle', 'folderStructure'],
    features: [
      'Document upload and organization',
      'AI-powered content generation',
      'Template-based creation',
      'Version control',
      'Bulk operations'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    relatedComponents: ['DocumentTemplateLibrary', 'AIContentGenerator'],
    apis: ['spark.llm'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentTemplateLibrary',
    description: 'Template management with AI-powered generation',
    category: 'Manager',
    features: [
      'Pre-built technical templates',
      'Custom template creation',
      'AI content generation',
      'ISO19650-2 naming compliance'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Card', 'Button'],
    relatedComponents: ['DocumentManager'],
    apis: ['spark.llm'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'AIContentGenerator',
    description: 'Generate document content using AI',
    category: 'Utility',
    features: [
      'Context-aware content generation',
      'Content regeneration',
      'Multiple content types (reports, memos, descriptions)'
    ],
    props: ['onContentGenerated', 'projectTitle', 'documentType'],
    apis: ['spark.llm'],
    relatedComponents: ['DocumentTemplateLibrary'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ComplianceChecker',
    description: 'Municipal compliance checklist manager',
    category: 'Utility',
    features: [
      'Requirement tracking by category',
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Progress visualization',
      'Notes and observations'
    ],
    hooks: ['useState', 'useEffect'],
    dependencies: ['Card', 'Button', 'Badge'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'MunicipalComplianceManager',
    description: 'Manage municipal regulations database',
    category: 'Manager',
    features: [
      'Municipality database management',
      'Apply to new or existing checklists',
      'Custom requirement editor',
      'Bulk import/export'
    ],
    hooks: ['useKV', 'useState'],
    relatedComponents: ['ComplianceChecker'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BudgetManager',
    description: 'Comprehensive budget management with BC3 support',
    category: 'Manager',
    features: [
      'BC3 file import and export',
      'Budget status tracking (Draft, Pending, Approved)',
      'Budget item management',
      'Total calculations'
    ],
    props: ['projectId'],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    apis: ['bc3-parser'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'InvoiceManager',
    description: 'Complete invoicing system with PDF export',
    category: 'Manager',
    features: [
      'Invoice creation and editing',
      'Line item management',
      'Tax calculations',
      'PDF export',
      'Auto-invoice on phase completion',
      'Status tracking (Draft, Issued, Paid)'
    ],
    props: [],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    relatedComponents: ['BillingManager', 'ClientManager'],
    apis: ['jsPDF', 'spark.kv'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ClientManager',
    description: 'Client database with CRM features',
    category: 'Manager',
    features: [
      'Client information management',
      'Payment terms tracking',
      'NIF validation',
      'Contact history'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    relatedComponents: ['ClientDialog', 'InvoiceManager'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BillingManager',
    description: 'Billing configuration and settings',
    category: 'Manager',
    features: [
      'Company information setup',
      'Tax configuration',
      'Invoice numbering'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Input'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'StakeholderDialog',
    description: 'Form for adding project stakeholders',
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onSave', 'stakeholder'],
    features: [
      'Stakeholder type selection',
      'Professional credentials',
      'Contact information'
    ],
    hooks: ['useState'],
    dependencies: ['Dialog', 'Input', 'Select'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'VisaManager',
    description: 'Professional visa management system',
    category: 'Manager',
    features: [
      'Visa application tracking',
      'Fee calculation',
      'Status tracking',
      'Document requirements'
    ],
    props: [],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ApprovalFlowManager',
    description: 'Document approval workflow system',
    category: 'Manager',
    props: [],
    features: [
      'Flow template management',
      'Approval step configuration',
      'Progress visualization',
      'Status tracking'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    relatedComponents: ['QualifiedSignatureProviderManager'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureProviderManager',
    description: 'Manage qualified signature service providers',
    category: 'Manager',
    features: [
      'Provider configuration (Cl@ve, ViafirmaPro)',
      'Authentication setup',
      'Configuration validation'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Input', 'Select'],
    relatedComponents: ['ApprovalFlowManager'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureRequestViewer',
    description: 'Dashboard for viewing and managing signature requests',
    category: 'Manager',
    features: [
      'Active requests display',
      'Status filtering',
      'Signature validation'
    ],
    props: [],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Badge'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DigitalSignaturePad',
    description: 'Canvas-based signature capture component',
    category: 'Utility',
    props: ['onSign'],
    features: [
      'Touch and mouse support',
      'Clear and undo',
      'Export as image'
    ],
    hooks: ['useState', 'useRef'],
    dependencies: ['Button'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureDialog',
    description: 'Dialog for requesting qualified electronic signatures',
    category: 'Dialog',
    features: [
      'OTP verification',
      'Provider selection',
      'Document signing'
    ],
    props: ['open', 'onOpenChange', 'onSign'],
    dependencies: ['Dialog', 'Input', 'Button'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCalendar',
    description: 'Calendar view of project milestones and deadlines',
    category: 'Manager',
    features: [
      'Project milestones display',
      'Month/week/day views',
      'Milestone creation',
      'Color-coded events'
    ],
    props: ['projects'],
    hooks: ['useKV', 'useState'],
    dependencies: ['Calendar', 'Dialog', 'Badge'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'MilestoneDialog',
    description: 'Form for creating and editing milestones',
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onSave', 'milestone'],
    features: [
      'Milestone title and description',
      'Date selection',
      'Status tracking'
    ],
    hooks: ['useState'],
    dependencies: ['Dialog', 'Input', 'Calendar'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'AIRegulatoryAssistant',
    description: 'AI-powered regulatory guidance tool',
    category: 'Utility',
    props: [],
    features: [
      'Natural language queries',
      'Regulatory guidance',
      'Code references'
    ],
    dependencies: ['Dialog', 'Button', 'ScrollArea'],
    hooks: ['useState'],
    apis: ['spark.llm'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BoardPermitWorkflow',
    description: 'Municipal permit application workflow',
    category: 'Utility',
    features: [
      'Permit application forms',
      'Status workflow',
      'Timeline tracking'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'EmailConfigDialog',
    description: 'Email server configuration for notifications',
    category: 'Dialog',
    features: [
      'SMTP configuration',
      'Test email function',
      'Validation'
    ],
    props: ['open', 'onOpenChange'],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Input', 'Button'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'EmailLogsDialog',
    description: 'View email send history and logs',
    category: 'Dialog',
    features: [
      'Email history',
      'Search and filter',
      'Status tracking'
    ],
    props: ['open', 'onOpenChange'],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Badge'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'ProjectImportDialog',
    description: 'Import single project from folder structure',
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onImportComplete'],
    features: [
      'Folder structure analysis',
      'Import validation',
      'Document detection'
    ],
    hooks: ['useState'],
    relatedComponents: ['BulkProjectImportDialog'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectImportDialog',
    description: 'Bulk project import from multiple folders',
    category: 'Dialog',
    features: [
      'Multi-folder scanning',
      'Batch document detection',
      'Progress tracking'
    ],
    props: ['open', 'onOpenChange', 'onImportComplete'],
    relatedComponents: ['ProjectImportDialog'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectExportDialog',
    description: 'Export multiple projects with documents',
    category: 'Dialog',
    features: [
      'Multi-project selection',
      'ZIP archive creation',
      'Metadata export'
    ],
    props: ['open', 'onOpenChange'],
    hooks: ['useState'],
    apis: ['JSZip'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'UserManual',
    description: 'Comprehensive user documentation',
    category: 'Utility',
    features: [
      'Module-by-module guides',
      'Search functionality',
      'PDF export',
      'Visual guides integration'
    ],
    dependencies: ['Dialog', 'Tabs', 'ScrollArea'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DeveloperManual',
    description: 'Complete developer documentation',
    category: 'Utility',
    features: [
      'Architecture overview',
      'API reference',
      'Component hierarchy',
      'Code examples',
      'PDF export'
    ],
    dependencies: ['Dialog', 'Tabs', 'ScrollArea'],
    apis: ['jsPDF'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ComponentRegistry',
    description: 'Interactive component documentation browser',
    category: 'Utility',
    features: [
      'Component catalog',
      'Component relationships',
      'Interactive navigation',
      'Export capabilities'
    ],
    dependencies: ['Dialog', 'Tabs', 'Card'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'VisualGuideViewer',
    description: 'Step-by-step visual tutorials with screenshots',
    category: 'Utility',
    features: [
      'Interactive step navigation',
      'Annotations and highlights',
      'Export to PDF'
    ],
    dependencies: ['Dialog', 'Button'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceReportGenerator',
    description: 'Generate compliance reports with PDF export',
    category: 'Utility',
    features: [
      'Comprehensive status reports',
      'Requirement summaries',
      'Export formats'
    ],
    dependencies: ['Button'],
    apis: ['jsPDF'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DocumentUtilities',
    description: 'Document operations hub',
    category: 'Utility',
    features: [
      'Bulk operations',
      'Recent documents',
      'Quick actions'
    ],
    dependencies: ['Dialog', 'Card', 'Button'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'OnlineDatabaseBrowser',
    description: 'Browse construction code databases',
    category: 'Utility',
    features: [
      'Code search',
      'Historical price tracking',
      'Integration with budgets'
    ],
    dependencies: ['Dialog', 'Table', 'Input'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'PGOUImporter',
    description: 'Import PGOU (Plan General de Ordenación Urbana) documents',
    category: 'Utility',
    features: [
      'PDF parsing',
      'Text parsing',
      'Compliance extraction'
    ],
    hooks: ['useState'],
    dependencies: ['Dialog', 'Button'],
    complexity: 'High',
    status: 'Stable'
  }
]

const utilityModules: UtilityModule[] = [
  {
    name: 'types.ts',
    exports: ['Project', 'Stakeholder', 'Invoice', 'Client', 'Budget', 'Document', 'ProjectMilestone'],
    description: 'Core type definitions for the application'
  },
  {
    name: 'email-service.ts',
    exports: ['sendEmail', 'useEmailConfig', 'validateEmailConfig'],
    description: 'Email service integration with SMTP configuration'
  },
  {
    name: 'project-utils.ts',
    exports: ['calculateProjectProgress', 'getProjectStatus', 'generateProjectSummary'],
    description: 'Project calculation and utility functions'
  },
  {
    name: 'invoice-utils.ts',
    exports: ['generatePhaseCompletionInvoice', 'calculateInvoiceTotals', 'formatInvoiceNumber'],
    description: 'Invoice generation and calculation utilities'
  },
  {
    name: 'budget-utils.ts',
    exports: ['calculateBudgetTotals', 'formatBudgetItem'],
    description: 'Budget calculation utilities'
  },
  {
    name: 'bc3-parser.ts',
    exports: ['parseBC3', 'generateBC3', 'validateBC3Format'],
    description: 'BC3 file format parser and generator'
  },
  {
    name: 'municipal-regulations.ts',
    exports: ['getMunicipalityRegulations', 'saveMunicipalityRegulations'],
    description: 'Municipal compliance regulations database'
  },
  {
    name: 'visa-utils.ts',
    exports: ['calculateVisaFee', 'getVisaRequirements'],
    description: 'Visa fee calculation and requirements'
  },
  {
    name: 'document-templates.ts',
    exports: ['DOCUMENT_TEMPLATES', 'generateDocumentFromTemplate'],
    description: 'Document template definitions and generators'
  },
  {
    name: 'approval-flow-types.ts',
    exports: ['ApprovalFlow', 'ApprovalStep', 'ApprovalStatus'],
    description: 'Approval flow type definitions'
  },
  {
    name: 'qualified-signature-service.ts',
    exports: ['createSignatureRequest', 'validateSignature', 'getProviderConfig'],
    description: 'Qualified electronic signature service integration'
  },
  {
    name: 'visual-guides.ts',
    exports: ['VISUAL_GUIDES', 'getGuideSteps'],
    description: 'Visual guide definitions and step data'
  },
  {
    name: 'construction-codes.ts',
    exports: ['searchCode', 'getCodeDetails', 'getPriceHistory'],
    description: 'Construction code database utilities'
  },
  {
    name: 'ai-prompts.ts',
    exports: ['generateDocumentPrompt', 'generateSummaryPrompt'],
    description: 'AI prompt templates and generators'
  }
]

export function ComponentRegistry() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(components.map(c => c.category)))
    return ['All', ...cats.sort()]
  }, [])

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const exportToMarkdown = () => {
    let markdown = '# AFO CORE MANAGER - Component Registry\n\n'
    markdown += `Generated: ${new Date().toLocaleDateString()}\n\n`
    markdown += `Total Components: ${components.length}\n`
    markdown += `Total Utility Modules: ${utilityModules.length}\n\n`
    markdown += '---\n\n'

    markdown += '## Components\n\n'
    
    const categoryGroups = components.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, components]) => {
      markdown += `### ${category}\n\n`
      components.forEach(component => {
        markdown += `#### ${component.name}\n\n`
        markdown += `${component.description}\n\n`
        if (component.props && component.props.length > 0) {
          markdown += `**Props:** ${component.props.join(', ')}\n\n`
        }
        if (component.features && component.features.length > 0) {
          markdown += '**Features:**\n'
          component.features.forEach(feature => {
            markdown += `- ${feature}\n`
          })
          markdown += '\n'
        }
        if (component.complexity) {
          markdown += `**Complexity:** ${component.complexity}\n\n`
        }
        markdown += '---\n\n'
      })
    })

    markdown += '## Utility Modules\n\n'
    utilityModules.forEach(module => {
      markdown += `### ${module.name}\n\n`
      markdown += `${module.description}\n\n`
      if (module.exports.length > 0) {
        markdown += `**Exports:** ${module.exports.join(', ')}\n\n`
      }
    })

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AFO-CORE-MANAGER-Components-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Registro exportado a Markdown')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const margin = 15
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = margin

    const addText = (text: string, fontSize: number = 10, bold: boolean = false) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      if (yPos + lines.length * fontSize * 0.35 > pageHeight - margin) {
        doc.addPage()
        yPos = margin
      }
      doc.text(lines, margin, yPos)
      yPos += lines.length * fontSize * 0.35 + 2
    }

    addText('Complete Component Registry', 16, true)
    yPos += 5
    addText(`Total Components: ${components.length}`, 10)
    addText(`Total Utility Modules: ${utilityModules.length}`, 10)
    yPos += 5

    const categoryGroups = components.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, comps]) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      addText(`${category} Components`, 14, true)
      yPos += 2

      comps.forEach(component => {
        if (yPos > pageHeight - 60) {
          doc.addPage()
          yPos = margin
        }
        addText(component.name, 12, true)
        addText(component.description, 10)
        if (component.features && component.features.length > 0) {
          component.features.forEach(feature => {
            addText(`• ${feature}`, 9)
          })
        }
        yPos += 3
      })
    })

    doc.addPage()
    yPos = margin
    addText('Utility Modules', 14, true)
    yPos += 3

    utilityModules.forEach(module => {
      if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = margin
      }
      addText(module.name, 12, true)
      addText(module.description, 10)
      yPos += 3
    })

    doc.save(`AFO-CORE-MANAGER-Components-${Date.now()}.pdf`)
    toast.success('Registro exportado a PDF')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Package size={18} weight="duotone" />
          Componentes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div>
          <DialogTitle className="text-2xl">Registro Completo de Componentes</DialogTitle>
          <DialogDescription>
            Explorar {components.length} componentes y {utilityModules.length} módulos de utilidad
          </DialogDescription>
        </div>

        <div className="flex gap-3 items-center">
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={exportToMarkdown} variant="outline" size="sm" className="gap-2">
            <FileCode size={16} />
            Markdown
          </Button>
          <Button onClick={exportToPDF} variant="outline" size="sm" className="gap-2">
            <Download size={16} />
            PDF
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[calc(90vh-280px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredComponents.map(component => (
                  <Card 
                    key={component.name} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedComponent(component)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base">{component.name}</CardTitle>
                        {component.status && (
                          <Badge variant={component.status === 'Stable' ? 'default' : 'secondary'}>
                            {component.status}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">{component.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {component.complexity && (
                        <Badge variant="outline" className="text-xs">
                          {component.complexity}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Componentes</p>
            <p className="text-2xl font-bold">{components.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Módulos Utilidad</p>
            <p className="text-2xl font-bold">{utilityModules.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Filtrados</p>
            <p className="text-2xl font-bold">{filteredComponents.length}</p>
          </div>
        </div>

        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            {selectedComponent && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <DialogTitle className="text-2xl">{selectedComponent.name}</DialogTitle>
                    <Badge variant={selectedComponent.complexity === 'High' ? 'destructive' : 'default'}>
                      {selectedComponent.complexity}
                    </Badge>
                  </div>
                  <DialogDescription className="text-base">
                    {selectedComponent.description}
                  </DialogDescription>
                </div>

                {selectedComponent.features && selectedComponent.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Características</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedComponent.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedComponent.props && selectedComponent.props.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Props</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.props.map(prop => (
                        <Badge key={prop} variant="secondary">{prop}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.hooks && selectedComponent.hooks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Hooks</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.hooks.map(hook => (
                        <Badge key={hook} variant="outline">{hook}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.dependencies && selectedComponent.dependencies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Dependencias</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.dependencies.map(dep => (
                        <Badge key={dep} variant="outline">{dep}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.relatedComponents && selectedComponent.relatedComponents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Componentes Relacionados</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.relatedComponents.map(comp => (
                        <Badge 
                          key={comp} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            const found = components.find(c => c.name === comp)
                            if (found) setSelectedComponent(found)
                          }}
                        >
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.apis && selectedComponent.apis.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">APIs Utilizadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.apis.map(api => (
                        <Badge key={api} variant="outline">{api}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
