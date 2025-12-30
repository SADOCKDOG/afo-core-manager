import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Package, Download, FileCode, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface ComponentInfo {
  name: string
  category: string
  description: string
  features?: string[]
  props?: string[]
  hooks?: string[]
  dependencies?: string[]
  relatedComponents?: string[]
  complexity?: 'Low' | 'Medium' | 'High'
  status?: string
  apis?: string[]
}

interface UtilityModule {
  name: string
  description: string
  exports: string[]
}

const components: ComponentInfo[] = [
  {
    name: 'Dashboard',
    category: 'Business Logic',
    description: 'Main analytics and project overview dashboard',
    features: [
      'Project distribution by status',
      'Recent activity timeline',
      'Quick action buttons',
      'Key metrics display'
    ],
    props: ['projects', 'clients', 'invoices', 'budgets', 'milestones', 'onNavigate'],
    hooks: ['useMemo'],
    relatedComponents: ['ProjectCard'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectCard',
    category: 'Business Logic',
    description: 'Interactive project card with status and progress',
    features: [
      'Phase progress visualization',
      'Status badge',
      'Click to view details',
      'Stakeholder count'
    ],
    props: ['project', 'onClick', 'index'],
    dependencies: ['Card', 'Badge', 'Progress'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'ProjectDetail',
    category: 'Business Logic',
    description: 'Detailed project view with tabs for phases, documents, and budget',
    features: [
      'Phase management',
      'Document organization',
      'Budget tracking',
      'Milestone tracking',
      'Stakeholder management'
    ],
    props: ['project', 'stakeholders', 'onBack', 'onEdit', 'onUpdatePhaseStatus', 'onProjectUpdate'],
    dependencies: ['Card', 'Tabs', 'Button', 'Badge'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ProjectDialog',
    category: 'Dialog',
    description: 'Project creation and editing dialog',
    features: [
      'Form validation',
      'Phase percentage configuration',
      'Stakeholder assignment',
      'Client linking'
    ],
    hooks: ['useState', 'useEffect'],
    dependencies: ['Dialog', 'Form', 'Select'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentManager',
    category: 'Business Logic',
    description: 'Complete document management with AI generation',
    features: [
      'Document upload and organization',
      'AI-powered content generation',
      'Version control',
      'Template management',
      'Search and filter'
    ],
    props: ['projectId', 'documents', 'onUpdate'],
    dependencies: ['DocumentTemplateLibrary', 'AIContentGenerator'],
    hooks: ['useKV', 'useState'],
    apis: ['spark.llm'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DocumentTemplateLibrary',
    category: 'Utility',
    description: 'Template management system for construction documents',
    features: [
      'Pre-built templates',
      'Custom template creation',
      'ISO19650-2 naming convention support',
      'Template categories'
    ],
    hooks: ['useKV', 'useState'],
    relatedComponents: ['DocumentManager'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'AIContentGenerator',
    category: 'Utility',
    description: 'AI-powered document content generation',
    features: [
      'Context-aware content generation',
      'Multiple content types',
      'Project-specific customization'
    ],
    props: ['onGenerate', 'projectContext'],
    apis: ['spark.llm'],
    relatedComponents: ['DocumentTemplateLibrary'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceChecker',
    category: 'Utility',
    description: 'Municipal compliance requirement checker',
    features: [
      'Requirement list by municipality',
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Notes and observations'
    ],
    hooks: ['useState', 'useEffect'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'MunicipalComplianceManager',
    category: 'Manager',
    description: 'Comprehensive municipal requirements management',
    features: [
      'Requirement templates',
      'Custom requirement creation',
      'Compliance reports'
    ],
    hooks: ['useKV', 'useState'],
    relatedComponents: ['ComplianceChecker'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BudgetManager',
    category: 'Business Logic',
    description: 'Comprehensive budget management with BC3 import',
    features: [
      'BC3 file import',
      'Budget status tracking (Draft, Pending, Approved, Rejected)',
      'Budget items with quantities and prices',
      'Total calculations'
    ],
    props: ['projectId'],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'InvoiceManager',
    category: 'Manager',
    description: 'Complete invoicing system',
    features: [
      'Invoice creation and editing',
      'Multiple payment phases',
      'Tax calculations',
      'Auto-invoice on phase completion',
      'PDF export'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table'],
    relatedComponents: ['BillingManager'],
    apis: ['jsPDF'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ClientManager',
    category: 'Manager',
    description: 'Client information management',
    features: [
      'Client information storage',
      'CRUD operations',
      'Client search'
    ],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table', 'Button'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BillingManager',
    category: 'Manager',
    description: 'Billing configuration and management',
    features: [
      'Default tax rates',
      'Billing preferences'
    ],
    hooks: ['useKV', 'useState'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'StakeholderDialog',
    category: 'Dialog',
    description: 'Stakeholder creation and editing',
    features: [
      'Professional credentials',
      'Contact information',
      'Role assignment'
    ],
    dependencies: ['Dialog', 'Form'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'VisaManager',
    category: 'Manager',
    description: 'Professional visa management system',
    features: [
      'Visa application tracking',
      'Fee calculation',
      'Document requirements',
      'Status monitoring'
    ],
    hooks: ['useKV', 'useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ApprovalFlowManager',
    category: 'Manager',
    description: 'Document approval workflow system',
    features: [
      'Multi-step approval flows',
      'Flow template management',
      'Progress visualization',
      'Assignee management'
    ],
    props: [],
    hooks: ['useKV', 'useState'],
    dependencies: ['Dialog', 'Table'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureProviderManager',
    category: 'Manager',
    description: 'Qualified electronic signature provider configuration',
    features: [
      'Provider configuration',
      'Cl@ve integration support',
      'ViafirmaPro support'
    ],
    hooks: ['useKV'],
    relatedComponents: ['ApprovalFlowManager'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureRequestViewer',
    category: 'Utility',
    description: 'View and manage signature requests',
    features: [
      'Request listing',
      'Status filtering',
      'Request details'
    ],
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DigitalSignaturePad',
    category: 'Utility',
    description: 'Canvas-based signature capture',
    features: [
      'Draw signature',
      'Clear and save',
      'Export as image'
    ],
    props: ['onSave'],
    dependencies: ['Button'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'QualifiedSignatureDialog',
    category: 'Dialog',
    description: 'Initiate qualified signature requests',
    features: [
      'Provider selection',
      'Document upload',
      'Signer information'
    ],
    dependencies: ['Dialog', 'Form'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ProjectCalendar',
    category: 'Business Logic',
    description: 'Calendar view of project milestones',
    features: [
      'Month/week/day views',
      'Milestone visualization',
      'Date navigation'
    ],
    props: ['projects'],
    dependencies: ['Calendar'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'MilestoneDialog',
    category: 'Dialog',
    description: 'Create and edit project milestones',
    features: [
      'Date selection',
      'Milestone title and description',
      'Status tracking'
    ],
    props: ['open', 'onOpenChange', 'onSave'],
    hooks: ['useState'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'AIRegulatoryAssistant',
    category: 'Utility',
    description: 'AI-powered regulatory guidance',
    features: [
      'Natural language queries',
      'Regulatory guidance',
      'Context-aware responses'
    ],
    apis: ['spark.llm'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'BoardPermitWorkflow',
    category: 'Utility',
    description: 'Professional board permit application workflow',
    features: [
      'Permit application forms',
      'Status tracking',
      'Timeline tracking'
    ],
    dependencies: ['Dialog', 'Form'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'EmailConfigDialog',
    category: 'Dialog',
    description: 'Email server configuration',
    features: [
      'SMTP settings',
      'Test email functionality'
    ],
    hooks: ['useKV', 'useState'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'EmailLogsDialog',
    category: 'Dialog',
    description: 'View email sending history',
    features: [
      'Email history',
      'Status tracking',
      'Error logs'
    ],
    hooks: ['useKV'],
    dependencies: ['Dialog', 'Table'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'ProjectImportDialog',
    category: 'Dialog',
    description: 'Import projects from folder structures',
    features: [
      'Folder structure analysis',
      'Document detection',
      'Metadata extraction'
    ],
    props: ['open', 'onOpenChange', 'onImportComplete'],
    hooks: ['useState'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectImportDialog',
    category: 'Dialog',
    description: 'Import multiple projects simultaneously',
    features: [
      'Multi-folder scanning',
      'Batch processing',
      'Progress tracking'
    ],
    props: ['open', 'onOpenChange', 'onImportComplete'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'BulkProjectExportDialog',
    category: 'Dialog',
    description: 'Export multiple projects',
    features: [
      'Multi-project selection',
      'ZIP packaging',
      'Metadata export'
    ],
    props: ['open', 'onOpenChange'],
    apis: ['JSZip'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'UserManual',
    category: 'Documentation',
    description: 'Comprehensive user documentation',
    features: [
      'Module descriptions',
      'Step-by-step guides',
      'Search functionality',
      'PDF/Markdown export'
    ],
    apis: ['jsPDF', 'marked'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'DeveloperManual',
    category: 'Documentation',
    description: 'Complete developer documentation',
    features: [
      'Architecture overview',
      'API reference',
      'Code examples',
      'Component diagrams'
    ],
    apis: ['jsPDF'],
    complexity: 'High',
    status: 'Stable'
  },
  {
    name: 'ComponentRegistry',
    category: 'Documentation',
    description: 'Interactive component documentation browser',
    features: [
      'Component catalog',
      'Dependency visualization',
      'Component relationships',
      'Export functionality'
    ],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'VisualGuideViewer',
    category: 'Documentation',
    description: 'Step-by-step visual guides',
    features: [
      'Screenshot galleries',
      'Annotations and highlights',
      'Navigation controls'
    ],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'ComplianceReportGenerator',
    category: 'Utility',
    description: 'Generate compliance status reports',
    features: [
      'Comprehensive status reports',
      'Export formats',
      'Checklist generation'
    ],
    dependencies: ['Button'],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'DocumentUtilities',
    category: 'Utility',
    description: 'Document management utilities',
    features: [
      'Bulk operations',
      'Quick actions',
      'Document validation'
    ],
    dependencies: ['Button', 'Dialog'],
    complexity: 'Low',
    status: 'Stable'
  },
  {
    name: 'OnlineDatabaseBrowser',
    category: 'Utility',
    description: 'Browse construction price databases',
    features: [
      'Search construction items',
      'Historical price data',
      'Export to BC3'
    ],
    complexity: 'Medium',
    status: 'Stable'
  },
  {
    name: 'PGOUImporter',
    category: 'Utility',
    description: 'Import urban planning regulations',
    features: [
      'PDF parsing',
      'Regulation extraction',
      'Auto-linking to projects'
    ],
    complexity: 'High',
    status: 'Stable'
  }
]

const utilityModules: UtilityModule[] = [
  {
    name: 'types.ts',
    description: 'Core TypeScript type definitions',
    exports: ['Project', 'Stakeholder', 'Invoice', 'Client', 'Budget', 'Document', 'ComplianceRequirement']
  },
  {
    name: 'email-service.ts',
    description: 'Email sending service with SMTP configuration',
    exports: ['useEmailConfig', 'sendEmail']
  },
  {
    name: 'project-utils.ts',
    description: 'Project calculation utilities',
    exports: ['calculateProjectProgress', 'getProjectPhaseStatus']
  },
  {
    name: 'invoice-utils.ts',
    description: 'Invoice generation helpers',
    exports: ['generatePhaseCompletionInvoice', 'calculateInvoiceTotal']
  },
  {
    name: 'bc3-parser.ts',
    description: 'BC3 file format parser',
    exports: ['parseBC3File']
  },
  {
    name: 'compliance-data.ts',
    description: 'Municipal compliance requirement database',
    exports: ['getMunicipalityRequirements']
  },
  {
    name: 'visa-utils.ts',
    description: 'Professional visa calculations',
    exports: ['calculateVisaFee']
  },
  {
    name: 'document-templates.ts',
    description: 'Document template definitions',
    exports: ['DOCUMENT_TEMPLATES']
  },
  {
    name: 'approval-flow-utils.ts',
    description: 'Approval workflow utilities',
    exports: ['createApprovalFlow', 'updateFlowStatus']
  },
  {
    name: 'visual-guides.ts',
    description: 'Visual guide content and images',
    exports: ['VISUAL_GUIDES']
  },
  {
    name: 'ai-prompts.ts',
    description: 'AI prompt templates for content generation',
    exports: ['AI_PROMPTS']
  }
]

export function ComponentRegistry() {
  const [open, setOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(components.map(c => c.category)))
    return ['all', ...cats]
  }, [])

  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory
      const matchesSearch = searchTerm === '' ||
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchTerm])

  const exportToMarkdown = () => {
    let markdown = `# AFO CORE MANAGER - Component Registry\n\n`
    markdown += `Generated: ${new Date().toLocaleDateString()}\n\n`
    markdown += `Total Components: ${components.length}\n`
    markdown += `Total Utility Modules: ${utilityModules.length}\n\n`

    markdown += `## Components by Category\n\n`
    
    const byCategory = components.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(byCategory).forEach(([category, comps]) => {
      markdown += `### ${category}\n\n`
      comps.forEach(component => {
        markdown += `#### ${component.name}\n\n`
        markdown += `${component.description}\n\n`
        if (component.props && component.props.length > 0) {
          markdown += `**Props:** ${component.props.join(', ')}\n\n`
        }
        if (component.features) {
          markdown += `**Features:**\n`
          component.features.forEach(feature => {
            markdown += `- ${feature}\n`
          })
          markdown += '\n'
        }
        if (component.complexity) {
          markdown += `**Complexity:** ${component.complexity}\n\n`
        }
      })
    })

    markdown += `## Utility Modules\n\n`
    utilityModules.forEach(module => {
      markdown += `### ${module.name}\n\n`
      markdown += `${module.description}\n\n`
      markdown += `**Exports:** ${module.exports.join(', ')}\n\n`
    })
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AFO-CORE-MANAGER-Components-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Component registry exported to Markdown')
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const margin = 20
    let yPos = margin
    const pageHeight = doc.internal.pageSize.height

    const addText = (text: string, fontSize = 10) => {
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, 170)
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = margin
        }
        doc.text(line, margin, yPos)
        yPos += fontSize * 0.5
      })
      yPos += lines.length * 2
    }

    addText('AFO CORE MANAGER - Component Registry', 18)
    yPos += 5
    addText(`Generated: ${new Date().toLocaleDateString()}`, 10)
    addText(`Total Components: ${components.length}`, 10)
    yPos += 5

    const byCategory = components.reduce((acc, component) => {
      if (!acc[component.category]) {
        acc[component.category] = []
      }
      acc[component.category].push(component)
      return acc
    }, {} as Record<string, ComponentInfo[]>)

    Object.entries(byCategory).forEach(([category, comps]) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      addText(`${category}`, 14)
      
      comps.forEach(component => {
        if (yPos > pageHeight - 60) {
          doc.addPage()
          yPos = margin
        }
        addText(component.name, 12)
        addText(component.description, 10)
        if (component.features) {
          component.features.forEach(feature => {
            addText(`• ${feature}`, 9)
          })
        }
        yPos += 5
      })
    })

    yPos = margin
    doc.addPage()
    yPos += 3
    addText('Utility Modules', 14)
    utilityModules.forEach(module => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      addText(module.name, 12)
      addText(module.description, 10)
    })

    doc.save(`AFO-CORE-MANAGER-Components-${Date.now()}.pdf`)
    toast.success('Component registry exported to PDF')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Package size={18} weight="duotone" />
          Componentes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-2xl">Component Registry</DialogTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToMarkdown}>
              <FileCode size={16} className="mr-2" />
              Export MD
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 my-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={selectedCategory} className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-[calc(90vh-250px)]">
              <div className="grid gap-4 pr-4">
                {filteredComponents.map((component) => (
                  <Card 
                    key={component.name}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedComponent(component)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{component.name}</CardTitle>
                          <CardDescription className="mt-1">{component.description}</CardDescription>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-end ml-4">
                          {component.status && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                              {component.status}
                            </Badge>
                          )}
                          {component.complexity && (
                            <Badge variant="secondary">{component.complexity}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{component.category}</Badge>
                        {component.apis?.map((api) => (
                          <Badge key={api} variant="outline" className="bg-purple-500/10 text-purple-600">
                            {api}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        
        <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground py-2">
          <div>
            <p className="font-semibold text-foreground">{components.length}</p>
            <p>Total Components</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{categories.length - 1}</p>
            <p>Categories</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">{utilityModules.length}</p>
            <p>Utility Modules</p>
          </div>
        </div>

        {selectedComponent && (
          <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogTitle className="text-2xl">{selectedComponent.name}</DialogTitle>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6 pr-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-base px-3 py-1">{selectedComponent.category}</Badge>
                    {selectedComponent.status && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        {selectedComponent.status}
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <DialogDescription className="text-base">{selectedComponent.description}</DialogDescription>
                  </div>

                  {selectedComponent.features && selectedComponent.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1">
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
                        {selectedComponent.props.map((prop) => (
                          <Badge key={prop} variant="secondary">{prop}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.hooks && selectedComponent.hooks.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Hooks Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.hooks.map((hook) => (
                          <Badge key={hook} variant="outline">{hook}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.dependencies && selectedComponent.dependencies.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Dependencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.dependencies.map((dep) => (
                          <Badge key={dep} variant="outline">{dep}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.relatedComponents && selectedComponent.relatedComponents.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Related Components</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.relatedComponents.map((comp) => (
                          <Badge
                            key={comp}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => {
                              const related = components.find(c => c.name === comp)
                              if (related) setSelectedComponent(related)
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
                      <h4 className="font-semibold mb-2">APIs Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.apis.map((api) => (
                          <Badge key={api} variant="outline" className="bg-purple-500/10 text-purple-600">
                            {api}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComponent.complexity && (
                    <div>
                      <h4 className="font-semibold mb-2">Complexity</h4>
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        {selectedComponent.complexity}
                      </Badge>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
