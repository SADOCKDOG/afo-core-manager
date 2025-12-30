import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Package, Download, FileCode } from '@phosphor-icons/react'
import jsPDF from 'jspdf'

interface ComponentInfo {
  name: string
  category: 'Business' | 'Manager' | 'Dialog' | 'Utility' | 'Workflow'
  description: string
  props?: string[]
  features?: string[]
  dependencies?: string[]
  relatedComponents?: string[]
  hooks?: string[]
  apis?: string[]
  complexity?: 'Low' | 'Medium' | 'High'
  status?: 'Stable' | 'Beta' | 'Experimental'
}

interface ModuleInfo {
  name: string
  description: string
  exports?: string[]
}

const COMPONENTS: ComponentInfo[] = [
  {
    name: 'Dashboard',
    category: 'Business',
    description: 'Main dashboard with key metrics, charts, and quick actions',
    features: [
      'Revenue tracking with monthly comparison',
      'Project distribution by status',
      'Quick navigation to key features',
      'Interactive charts with Recharts'
    ],
    relatedComponents: ['ProjectCard'],
    hooks: ['useState', 'useMemo'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCard',
    category: 'Business',
    description: 'Display card for individual project with status and phase information',
    features: [
      'Phase progress visualization',
      'Status badges',
      'Click to navigate to project detail'
    ],
    dependencies: ['Card', 'Badge', 'Progress'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectDetail',
    category: 'Business',
    description: 'Comprehensive project detail view with tabs for overview, documents, budget, and visa management',
    features: [
      'Phase management with status updates',
      'Document management integration',
      'Budget tracking',
      'Visa workflow integration',
      'Milestone tracking'
    ],
    dependencies: ['Tabs', 'Card', 'Button', 'Badge', 'Progress'],
    hooks: ['useState', 'useKV'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectDialog',
    category: 'Dialog',
    description: 'Multi-step wizard for creating and editing projects',
    props: ['open', 'onOpenChange', 'onSave', 'project'],
    features: [
      'Multi-step wizard (Details, Phases, Stakeholders, Folder Structure)',
      'Stakeholder assignment',
      'Form validation',
      'Phase percentage calculation'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Checkbox'],
    hooks: ['useState', 'useEffect'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentManager',
    category: 'Manager',
    description: 'Comprehensive document management system with upload, search, and template generation',
    props: ['projectId'],
    features: [
      'Document upload with metadata',
      'Multi-criteria search and filtering',
      'Bulk document upload',
      'Template library integration',
      'CSV export',
      'AI-powered document generation'
    ],
    dependencies: ['Dialog', 'Table', 'Input', 'Select', 'Button'],
    relatedComponents: ['DocumentTemplateLibrary', 'AIContentGenerator'],
    hooks: ['useKV', 'useState'],
    apis: ['spark.llm'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentTemplateLibrary',
    category: 'Manager',
    description: 'Library of ISO19650-2 compliant document templates',
    features: [
      'Form-based template configuration',
      'Auto-fill from project data',
      'Preview before generation',
      'ISO19650-2 naming compliance',
      'Template favorites'
    ],
    dependencies: ['Dialog', 'Card', 'Button', 'Input', 'Tabs'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'AIContentGenerator',
    category: 'Utility',
    description: 'AI-powered content generation for documents using GPT-4',
    features: [
      'Tone selection (Formal, Technical, Simple)',
      'Content regeneration',
      'Context-aware generation',
      'Multiple output formats'
    ],
    relatedComponents: ['DocumentTemplateLibrary', 'DocumentTemplateWithAI'],
    apis: ['spark.llm', 'spark.llmPrompt'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ComplianceChecker',
    category: 'Utility',
    description: 'Municipal compliance checklist manager with detailed tracking',
    features: [
      'Automated checklist generation',
      'Municipal requirement validation',
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Notes and evidence attachment',
      'Progress visualization',
      'AI-powered regulatory assistance'
    ],
    relatedComponents: ['MunicipalComplianceManager', 'AIRegulatoryAssistant'],
    hooks: ['useState', 'useEffect'],
    apis: ['spark.llm'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'MunicipalComplianceManager',
    category: 'Manager',
    description: 'Manager for municipal compliance regulations and ordinances',
    features: [
      'Municipality database management',
      'Pre-loaded examples (Madrid, Barcelona, Cartagena)',
      'Apply to new or existing checklists',
      'PGOU and ordinance citation support',
      'Custom regulation creation'
    ],
    relatedComponents: ['ComplianceChecker'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BudgetManager',
    category: 'Manager',
    description: 'Construction budget management with BC3 import/export',
    features: [
      'BC3 file import and export',
      'Price database integration',
      'Budget status tracking (Draft, Approved, Rejected)',
      'Budget approval workflow',
      'Budget item management'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Table', 'Select'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'InvoiceManager',
    category: 'Manager',
    description: 'Complete invoice management system with PDF export',
    props: [],
    features: [
      'Invoice creation and editing',
      'Line item management',
      'Tax calculation',
      'PDF export with professional formatting',
      'Payment tracking',
      'Auto-invoice on phase completion'
    ],
    relatedComponents: ['BillingManager', 'ClientManager'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ClientManager',
    category: 'Manager',
    description: 'Client database with contact information and payment terms',
    features: [
      'Legal and individual client types',
      'Contact information management',
      'Payment terms tracking',
      'Client status tracking',
      'NIF validation'
    ],
    relatedComponents: ['ClientDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BillingManager',
    category: 'Manager',
    description: 'Billing configuration and invoice numbering',
    features: [
      'Invoice numbering sequence',
      'Company billing information',
      'Tax configuration',
      'Payment term defaults'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Select', 'Switch'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'StakeholderDialog',
    category: 'Dialog',
    description: 'Dialog for creating and editing project stakeholders',
    props: ['open', 'onOpenChange', 'onSave', 'stakeholder'],
    features: [
      'Stakeholder type selection',
      'Contact information',
      'Professional credentials',
      'Form validation'
    ],
    relatedComponents: ['ProjectDialog', 'ProjectDetail'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'VisaManager',
    category: 'Manager',
    description: 'Professional college visa (visado colegial) application and tracking',
    features: [
      'College selection (COAM, COACM, COAMU, etc.)',
      'Document validation',
      'Fee calculation',
      'Application number generation',
      'Status tracking',
      'PDF export'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ApprovalFlowManager',
    category: 'Manager',
    description: 'Workflow approval system with multi-step flows and digital signatures',
    props: [],
    features: [
      'Flow template management',
      'Multi-step approval processes',
      'Assignee tracking',
      'Status management',
      'Progress visualization',
      'Digital signature integration'
    ],
    relatedComponents: ['QualifiedSignatureProviderManager', 'DigitalSignaturePad'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureProviderManager',
    category: 'Manager',
    description: 'Configuration manager for qualified electronic signature providers',
    features: [
      'Provider configuration (Cl@ve, ViafirmaPro)',
      'Authentication settings',
      'Test/Production mode toggle',
      'Configuration validation'
    ],
    relatedComponents: ['ApprovalFlowManager', 'QualifiedSignatureDialog'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureRequestViewer',
    category: 'Manager',
    description: 'Dashboard for viewing and managing signature requests',
    features: [
      'Status filtering',
      'Request history',
      'Signature validation',
      'Error log viewing'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DigitalSignaturePad',
    category: 'Utility',
    description: 'Canvas-based digital signature capture',
    props: ['onSign', 'onCancel'],
    features: [
      'Canvas-based signature drawing',
      'Clear and redo functionality',
      'Automatic metadata capture (timestamp, user)',
      'Base64 export'
    ],
    relatedComponents: ['ApprovalFlowManager'],
    hooks: ['useState', 'useRef'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureDialog',
    category: 'Dialog',
    description: 'Dialog for creating qualified electronic signatures with provider integration',
    features: [
      'Signature level selection (Advanced, Qualified)',
      'OTP verification',
      'SAML authentication',
      'Provider selection'
    ],
    dependencies: ['Dialog', 'Input', 'Select', 'Button'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectCalendar',
    category: 'Business',
    description: 'Calendar view with project milestones and events',
    features: [
      'Project milestone display',
      'Event filtering',
      'Project phase timeline',
      'Due date tracking'
    ],
    dependencies: ['Calendar', 'Button', 'Badge', 'Card'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'MilestoneDialog',
    category: 'Dialog',
    description: 'Dialog for creating and editing project milestones',
    props: ['open', 'onOpenChange', 'onSave', 'projectId', 'milestone'],
    features: [
      'Milestone title and description',
      'Date selection',
      'Status tracking',
      'Form validation'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Calendar'],
    hooks: ['useState'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'AIRegulatoryAssistant',
    category: 'Utility',
    description: 'AI-powered regulatory query assistant for Spanish building codes',
    props: [],
    features: [
      'Natural language queries',
      'Regulation search',
      'Citation references',
      'Spanish building code (CTE) integration',
      'Context-aware responses'
    ],
    dependencies: ['Dialog', 'Textarea', 'Button', 'ScrollArea'],
    apis: ['spark.llm', 'spark.llmPrompt'],
    hooks: ['useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BoardPermitWorkflow',
    category: 'Workflow',
    description: 'Workflow management for municipal board permits',
    features: [
      'Document checklist',
      'Status workflow',
      'Approval tracking',
      'Timeline tracking'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button'],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'EmailConfigDialog',
    category: 'Dialog',
    description: 'Email server configuration for notifications',
    props: ['open', 'onOpenChange'],
    features: [
      'SMTP server configuration',
      'Test email functionality',
      'Secure connection options'
    ],
    dependencies: ['Dialog', 'Input', 'Button', 'Switch'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'EmailLogsDialog',
    category: 'Dialog',
    description: 'Email sending history and delivery tracking',
    features: [
      'Delivery status tracking',
      'Search and filtering',
      'Error log viewing'
    ],
    dependencies: ['Dialog', 'Table', 'Badge', 'Button', 'ScrollArea'],
    hooks: ['useKV', 'useState'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'ProjectImportDialog',
    category: 'Dialog',
    description: 'Import projects from file system structure',
    props: ['open', 'onOpenChange', 'onImportComplete'],
    features: [
      'Folder structure analysis',
      'Metadata extraction',
      'Import validation'
    ],
    relatedComponents: ['BulkProjectImportDialog'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectImportDialog',
    category: 'Dialog',
    description: 'Bulk project import from multiple directories',
    features: [
      'Batch document detection',
      'Import queue management',
      'Progress tracking'
    ],
    relatedComponents: ['ProjectImportDialog'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectExportDialog',
    category: 'Dialog',
    description: 'Export multiple projects with documents',
    features: [
      'Multi-project selection',
      'Export format options',
      'Metadata export',
      'Progress tracking'
    ],
    relatedComponents: ['ProjectExportDialog'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'UserManual',
    category: 'Business',
    description: 'Comprehensive user manual with all modules, functions, and guides',
    features: [
      'Step-by-step guides',
      'Search functionality',
      'Markdown export',
      'PDF export',
      'Printable format',
      'Visual guides integration'
    ],
    dependencies: ['Dialog', 'Tabs', 'ScrollArea', 'Button'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DeveloperManual',
    category: 'Business',
    description: 'Complete developer documentation with architecture, APIs, and code examples',
    props: [],
    features: [
      'Architecture diagrams',
      'API reference',
      'Module structure documentation',
      'Component hierarchy',
      'Integration guides',
      'PDF export',
      'Markdown export'
    ],
    relatedComponents: ['UserManual', 'ArchitectureDiagrams'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ArchitectureDiagrams',
    category: 'Utility',
    description: 'Visual architecture diagrams and flowcharts',
    features: [
      'Data flow visualization',
      'Component relationships',
      'State management diagrams',
      'Interactive navigation'
    ],
    dependencies: ['Dialog', 'Button'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'VisualGuideViewer',
    category: 'Utility',
    description: 'Step-by-step visual guide viewer with screenshots',
    props: ['guideId'],
    features: [
      'Step-by-step navigation',
      'Annotations and highlights',
      'Guide completion tracking',
      'Export to PDF'
    ],
    dependencies: ['Dialog', 'Button', 'Card'],
    hooks: ['useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceReportGenerator',
    category: 'Utility',
    description: 'Generate compliance reports with regulatory citations',
    props: ['projectId', 'checklistId'],
    features: [
      'Professional PDF report generation',
      'Requirement details',
      'Regulatory reference citations',
      'Export formats (PDF, DOCX)'
    ],
    dependencies: ['Button'],
    hooks: ['useState'],
    apis: ['jsPDF'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentGeneratorHub',
    category: 'Utility',
    description: 'Central hub for document generation with templates',
    features: [
      'Template catalog',
      'Quick actions',
      'Template favorites',
      'Recent documents'
    ],
    dependencies: ['Dialog', 'Card', 'Button', 'Tabs'],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'OnlineDatabaseBrowser',
    category: 'Utility',
    description: 'Browse and search online construction price databases',
    props: [],
    features: [
      'Database source selection',
      'Code search',
      'Price comparison',
      'Historical price tracking'
    ],
    dependencies: ['Dialog', 'Input', 'Table', 'Button'],
    hooks: ['useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'PGOUImporter',
    category: 'Utility',
    description: 'Import PGOU (Plan General de Ordenación Urbana) regulations',
    props: [],
    features: [
      'File upload',
      'Text parsing',
      'Auto-categorization'
    ],
    relatedComponents: ['MunicipalComplianceManager'],
    hooks: ['useState'],
    complexity: 'Medium',
    status: 'Stable'
  }
]

const UTILITY_MODULES: ModuleInfo[] = [
  {
    name: 'types.ts',
    description: 'TypeScript type definitions for all entities',
    exports: ['Project', 'Stakeholder', 'Invoice', 'Client', 'Budget', 'Document']
  },
  {
    name: 'utils.ts',
    description: 'Common utility functions',
    exports: ['cn', 'formatDate', 'formatCurrency']
  },
  {
    name: 'email-service.ts',
    description: 'Email sending and configuration',
    exports: ['sendEmail', 'useEmailConfig']
  },
  {
    name: 'pdf-export.ts',
    description: 'PDF export utilities',
    exports: ['exportToPDF', 'generateInvoicePDF', 'generateReportPDF']
  },
  {
    name: 'project-utils.ts',
    description: 'Project-related utilities',
    exports: ['calculateProjectProgress', 'validatePhases']
  },
  {
    name: 'document-templates.ts',
    description: 'Document template definitions',
    exports: ['DOCUMENT_TEMPLATES', 'generateDocument']
  },
  {
    name: 'invoice-utils.ts',
    description: 'Invoice calculation and generation',
    exports: ['generatePhaseCompletionInvoice', 'calculateInvoiceTotal']
  },
  {
    name: 'budget-utils.ts',
    description: 'Budget calculation utilities',
    exports: ['calculateBudgetTotals']
  },
  {
    name: 'bc3-parser.ts',
    description: 'BC3 file parser and generator',
    exports: ['parseBC3', 'generateBC3', 'BC3Data']
  },
  {
    name: 'municipal-compliance.ts',
    description: 'Municipal compliance utilities',
    exports: ['MUNICIPALITIES', 'generateChecklist']
  },
  {
    name: 'visa-utils.ts',
    description: 'Spanish professional visa utilities',
    exports: ['calculateVisaFee', 'validateVisaDocuments', 'COLLEGES']
  },
  {
    name: 'visa-validation.ts',
    description: 'Visa document validation rules',
    exports: ['VALIDATION_RULES', 'validateDocument']
  },
  {
    name: 'document-catalog.ts',
    description: 'Document catalog and templates',
    exports: ['DOCUMENT_TEMPLATES', 'getTemplateByCode']
  },
  {
    name: 'approval-utils.ts',
    description: 'Approval flow type definitions',
    exports: ['validateFlowProgress', 'getNextStep']
  },
  {
    name: 'qualified-signature-service.ts',
    description: 'Qualified electronic signature integration',
    exports: ['createSignatureRequest', 'verifySignature', 'getProviderConfig']
  },
  {
    name: 'visual-guides.ts',
    description: 'Visual guide content and data',
    exports: ['VISUAL_GUIDES', 'getGuideById']
  },
  {
    name: 'construction-codes.ts',
    description: 'Construction code database',
    exports: ['searchCode', 'getCodeDetails']
  },
  {
    name: 'ai-regulatory.ts',
    description: 'AI regulatory assistant utilities',
    exports: ['queryRegulation', 'getCitations']
  }
]

export function ComponentRegistry() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COMPONENTS.map(c => c.category)))
    return ['All', ...cats]
  }, [])

  const filteredComponents = useMemo(() => {
    return COMPONENTS.filter(component => {
      const matchesSearch = 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const exportToMarkdown = () => {
    let markdown = '# AFO CORE MANAGER - Complete Component Documentation\n\n'
    markdown += `Generated: ${new Date().toLocaleString()}\n\n`
    markdown += `Total Components: ${COMPONENTS.length}\n\n`
    markdown += `Total Utility Modules: ${UTILITY_MODULES.length}\n\n`

    const categoryGroups = COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, components]) => {
      markdown += `## ${category} Components\n\n`
      components.forEach(component => {
        markdown += `### ${component.name}\n\n`
        markdown += `**Description:** ${component.description}\n\n`
        markdown += `**Status:** ${component.status} | **Complexity:** ${component.complexity}\n\n`
        if (component.props && component.props.length > 0) {
          markdown += `**Props:** ${component.props.join(', ')}\n\n`
        }
        if (component.features && component.features.length > 0) {
          markdown += '**Features:**\n'
          component.features.forEach(f => markdown += `- ${f}\n`)
          markdown += '\n'
        }
        if (component.dependencies && component.dependencies.length > 0) {
          markdown += `**Dependencies:** ${component.dependencies.join(', ')}\n\n`
        }
        if (component.relatedComponents && component.relatedComponents.length > 0) {
          markdown += `**Related Components:** ${component.relatedComponents.join(', ')}\n\n`
        }
        if (component.hooks && component.hooks.length > 0) {
          markdown += `**Hooks:** ${component.hooks.join(', ')}\n\n`
        }
        if (component.apis && component.apis.length > 0) {
          markdown += `**APIs Used:** ${component.apis.join(', ')}\n\n`
        }
        markdown += '---\n\n'
      })
    })

    markdown += '## Utility Modules\n\n'
    UTILITY_MODULES.forEach(module => {
      markdown += `### ${module.name}\n\n`
      markdown += `**Description:** ${module.description}\n\n`
      if (module.exports && module.exports.length > 0) {
        markdown += `**Exports:** ${module.exports.join(', ')}\n\n`
      }
      markdown += '---\n\n'
    })

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AFO-CORE-MANAGER-Components-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    const margin = 15
    let yPos = margin

    const addText = (text: string, fontSize: number, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      const lines = doc.splitTextToSize(text, 180)
      if (yPos + (lines.length * fontSize * 0.5) > pageHeight - margin) {
        doc.addPage()
        yPos = margin
      }
      doc.text(lines, margin, yPos)
      yPos += lines.length * fontSize * 0.5 + 3
    }

    addText('AFO CORE MANAGER', 20, true)
    addText('Complete Component Registry', 16, true)
    addText(`Generated: ${new Date().toLocaleString()}`, 10)
    yPos += 5
    addText(`Total Components: ${COMPONENTS.length}`, 12)
    addText(`Total Utility Modules: ${UTILITY_MODULES.length}`, 12)
    yPos += 10

    const categoryGroups = COMPONENTS.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(categoryGroups).forEach(([category, components]) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      addText(`${category} Components`, 16, true)
      yPos += 5
      components.forEach(component => {
        if (yPos > pageHeight - 60) {
          doc.addPage()
          yPos = margin
        }
        addText(component.name, 14, true)
        addText(component.description, 10)
        addText(`Status: ${component.status} | Complexity: ${component.complexity}`, 9)
        if (component.features && component.features.length > 0) {
          component.features.slice(0, 3).forEach(feature => {
            addText(`• ${feature}`, 9)
          })
        }
        yPos += 5
      })
    })

    yPos = margin
    doc.addPage()
    addText('Utility Modules', 16, true)
    yPos += 5
    UTILITY_MODULES.forEach(module => {
      if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = margin
      }
      addText(module.name, 12, true)
      addText(module.description, 10)
      yPos += 3
    })

    doc.save(`AFO-CORE-MANAGER-Components-${Date.now()}.pdf`)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Package size={18} weight="duotone" />
          Componentes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package size={24} weight="duotone" />
            Registro Completo de Componentes
          </DialogTitle>
          <DialogDescription>
            Documentación técnica completa de todos los componentes y módulos del sistema
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={exportToMarkdown} className="gap-2">
              <FileCode size={16} />
              Markdown
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-2">
              <Download size={16} />
              PDF
            </Button>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4 pr-4">
                  {filteredComponents.length > 0 ? (
                    filteredComponents.map(component => (
                      <Card 
                        key={component.name} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setSelectedComponent(component)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{component.name}</CardTitle>
                            <div className="flex gap-2">
                              <Badge>{component.status}</Badge>
                              <Badge variant="outline">{component.complexity}</Badge>
                            </div>
                          </div>
                          <CardDescription className="mt-2">
                            {component.description}
                          </CardDescription>
                        </CardHeader>
                        {component.features && component.features.length > 0 && (
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-2">Características principales:</p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                              {component.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              ))}
                            </ul>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No se encontraron componentes
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="grid grid-cols-3 gap-4 text-center py-4">
            <div>
              <p className="text-2xl font-bold text-primary">{COMPONENTS.length}</p>
              <p className="text-sm text-muted-foreground">Componentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{UTILITY_MODULES.length}</p>
              <p className="text-sm text-muted-foreground">Módulos Utilidad</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {COMPONENTS.filter(c => c.apis && c.apis.length > 0).length}
              </p>
              <p className="text-sm text-muted-foreground">Con Integración AI</p>
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedComponent?.name}</DialogTitle>
              <div className="flex gap-2">
                <Badge>{selectedComponent?.status}</Badge>
                <Badge variant="outline">{selectedComponent?.complexity}</Badge>
              </div>
            </div>
            <DialogDescription>{selectedComponent?.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {selectedComponent && (
              <div className="space-y-4">
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

                {selectedComponent.dependencies && selectedComponent.dependencies.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Dependencias UI</h4>
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
                        <Badge key={comp} variant="secondary">{comp}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.hooks && selectedComponent.hooks.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">React Hooks</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.hooks.map(hook => (
                        <Badge key={hook}>{hook}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedComponent.apis && selectedComponent.apis.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">APIs / Librerías</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.apis.map(api => (
                        <Badge key={api} variant="secondary">{api}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}
