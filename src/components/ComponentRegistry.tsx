import { useState, useMemo } from 'react'
  Dialog
  DialogD
  DialogTitle,
} from '@/components
import { Input 
import { Tabs,
import { ScrollA
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
interfa
  category: 'Busin
  props?: 
  features?: 
  hooks?: s
  complexit
}
const COMPONENTS: ComponentIn

    description: 'Main da
    features: 
      'Revenue tracking with monthly comparison',
      'Project distri
      'Quick navig
    ],
    relatedComponents
    complexity: 'High',
  },
    name: 'Projec
    description: 'Display card for indi
    features: [
 

      'Click to navigate to project d
   
    complexity: 'Mediu
  },
    name: 'ProjectDetail',
    description: 'Comprehensive project detail view with tabs for overview, documents,
    features: [
      'Phase management with status updates',
      'Document management integration',
      'Budget tracking',
      'Visa workflow integration'
    dependencies: ['Tabs', 'Card',
    hooks: ['useState', 'useKV'],
    status: 'Stable'
  {
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onSave', 'project'],
      'Multi-step wizar
      'Stakeholder assi
      'Form validati
    
   
    hooks: ['useState', 
    status: 'Stable'
  {
    category: 'Manager',
    props: ['pr
      'Document upload with metadata',
      'Multi-criteria search and filter
      'Bulk document uplo
      'Template library i
      'CSV export',
    ],
    re
    apis: ['spark.llm'],
    status: 'Stable'
  {
    category: 'Manag
    
   
      'Form-based template
      'Auto-fill from pro
      'Preview before generation',
      'ISO19650-2 naming compliance'
    dependencie
    hooks: ['useKV', 'useState'],
    complexity: 'High',
  },
    name: 'AIContentGenerator',
    description: 'AI-powered content gene
    features: [
      'Tone selection (Form
      'Content regeneration',
      
    ],
    relatedComponents: ['DocumentTemplateLibrary', 'DocumentTemplateWithAI'],
    apis: ['spark.llm', 'spark.ll
    status: 'Stable'
  {
    
   
      'Automated checklist
      'Municipal requir
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Notes and evidence attachment',
      'Progress
    ],
    relatedComponents: ['MunicipalComplianceManager
    complexity: 'High',
  },
    name: 'MunicipalComp
    description: 'Man
    features: [
      
      'Pre-loaded examples (Madrid, Barcelona, Cartagena)',
      'Apply to new or existing checklists',
      'PGOU and ordinance citation support',
    ],
    relatedComponent
    
  }
    name: 'BudgetManager',
    description: 'Constr
    features: [
      'BC3 file import and export',
      'Price da
      'Budget status tracking (Draft, 
      'Budget approval workflow
    dependencies: ['Dialog', 'Input', 'Butto
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Manager',
    props: [],
      'Invoice crea
      'Line item management
      
      'PDF export with professional formatting',
      'Payment tracking',
    ],
    relatedComponents: [
    complexity: 'High',
  },
    
   
    features: [
      'Legal and individ
      'Contact information management',
      'Payment terms trac
      'Client s
    ],
    relatedComponents: ['ClientDialog'
    complexity: 'Medium',
  },
    name: 'BillingManager',
    description: 'Billing config
    features: [
      'Invoice numbering se
      'Company billing information',
      
    dependencies: ['Dialog', 'Input', 'Button', 'Select', 'Switch'],
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Dialog',
    props: ['open', 
    
   
      'Form validation',
    ],
    relatedComponents: ['ProjectDialog', 'ProjectDetail'],
    complexity: 'Low',
  },
    name: 'VisaManager',
    description: 'Professional college visa (visado colegial) app
    features: [
      'College selection (COA
      'Document validation
      'Fee calculation 
      'Application number generat
      
    dependencies: ['Dialog', 'Input', 'Select', 'Button', 'Table', 'Badge',
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Manager',
    props: [],
    
   
      'Template management',
      'Progress visualiza
      'Digital signature integration',
    ],
    relatedComp
    complexity: 'High',
  },
    name: 'QualifiedSignatureProviderManage
    description: 'Configuration manager for qualifie
    features: [
      'Authentication settings',
      'Test/Production mode toggle',
      'Configuration validation',
    ],
    relatedCompone
    co
  },
    name: 'QualifiedSignatureRequestViewer',
    description: 'Dashboard for viewing and 
    features: [
      'Status filter
    
   
      'Error log viewing'
    dependencies: ['Dial
    hooks: ['useKV', 'useState'],
    status: 'S
  {
    category: 'Utility',
    props: ['onSign', 'onCancel'],
      'Canvas-based signature drawi
      'Clear and redo functionality',
      'Automatic metadata capture (timest
    ],
    relatedComponents: ['App
    complexity: 'Medium',
  },
    na
    description: 'Dialog for creating qualified electronic signatures with provider 
    features: [
      'Signature level selection 
      'OTP verification
      'SAML authenti
    
   
    hooks: ['useState'],
    complexity: 'High',
  },
    name: 'ProjectCalenda
    description
    features: [
      'Project milestone display',
      'Event filtering',
      'Project phase timeline'
      'Due date tracking'
    dependencies: ['Calendar', 'Button', 'Badge', 'Card'],
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Dialog',
    props: ['open', 'onOpenChange', 'onSave', 'projectId', 'milestone'],
      'Milestone title and descri
      'Status tracking'
      'Form validati
    
   
    status: 'Stable'
  {
    category: 'Utility',
    props: [],
      'Natural 
      'Regulation search',
      'Citation references'
      'Spanish building code 
    dependencies: ['Dialog', 'T
    hooks: ['useState'],
    complexity: 'Medium',
  },
    name: 'BoardPermitWorkflow',
    description: 'Workflo
    features: [
      
      'Status workflow',
      'Approval tracking',
      'Timeline tracking'
    dependencies: ['Dia
    hooks: ['useKV',
    
  {
    category: 'Dialog',
    props: ['open', 'onO
      'SMTP server configuration',
      'Test em
      'Secure c
    dependencies: ['Dialog', 'Input'
    hooks: ['useKV', 'useState'],
    complexity: 'Medium',
  },
    name: 'EmailLogsDialog'
    description: 'Email sending
    features: [
      'Delivery status tracking',
      'Search and filter'
      
    dependencies: ['Dialog', 'Table', 'Badge', 'Button', 'ScrollArea'],
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Dialo
    
   
      'Metadata extraction'
      'Import validation
    ],
    relatedCom
    complexity:
  },
    name: 'BulkProjectImportDialo
    description: 'Bulk project 
    features: [
      'Batch document detection',
      'Import queue managemen
      
    ],
    relatedComponents: ['ProjectImportDial
    complexity: 'High',
  },
    name: 'BulkProje
    
   
      'Export format options',
      'Metadata export'
      'Progress tracking',
    ],
    relatedComp
    complexity: 'High',
  },
    name: 'UserManual',
    description: 'Comprehensive user manual with all modules, functi
    features: [
      'Step-by-step guide
      
      'PDF export',
      'Printable format',
      'Visual guides integration'
    dependencies: ['Di
    hooks: ['useStat
    
  {
    category: 'Business'
    props: [],
      'Architecture diagrams',
      'API ref
      'Module s
      'Integration guides',
      'Markdown export',
    ],
    relatedComponents: ['UserManual', 'Architectu
    complexity: 'High',
  },
    name: 'ArchitectureDiagrams',
    description: 'Visual architecture 
    features: [
      'Data flow visualizatio
      
      'State management diagrams',
      'Interactive navigation'
    dependencies: ['Dialog', 'But
    hooks: ['useState']
    status: 'Stable'
  {
   
    props: ['guideId'],
      'Step-by-step navi
      'Annotations and highlights',
      'Guide c
      'Export t
    dependencies: ['Dialog', 'B
    hooks: ['useState'],
    status: 'Stable'
  {
    category: 'Utility',
    props: ['projectId', 'che
      'Professional PDF report 
      'Requirement d
      'Regulatory reference citations'
      'Export formats (PDF, DOCX)'
    de
    hooks: ['useState'],
    complexity: 'High',
  },
    name: 'DocumentGene
    description: 'Ce
    
   
      'Quick actions',
      'Template favorite
    dependencies: ['Dialog', 'Card', 'Button', 'Tabs'],
    hooks: ['u
    status: 'St
  {
    category: 'Utility',
    props: [],
      'Database source selection',
      'Code search',
      'Price comparison',
      'Historical price t
    de
    hooks: ['useState'],
    status: 'Stable'
  {
    category: 'Utility'
    props: [],
    
   
      'Auto-categorization',
    ],
    relatedComponents: ['MunicipalComplianceManager'],
    complexity
  }

  {
    description: 'TypeScript 
  },
    name: 'utils.ts',
    exports: ['cn', 'formatD
  {
    description: 'Email s
  },
    name: 'pdf-export.ts',
    exports: ['exportToPDF', 'generateInvoicePDF', 'generateReportPDF']
  {
    description: 'Project
  },
    
   
  {
    description: 'Docume
  },
    name: 'invoice-utils.ts',
    exports: ['
  {
    description: 'Budget calcul
  },
    name: 'bc3-parser.ts',
    exports: ['parseBC3', 'generateBC3', 'BC3Data']
  {
    de
  },
    name: 'municipal-compliance.ts',
    exports: ['MUNICIPALITIES', 'g
  {
    description: 'Sp
  },
   
    exports: ['calculateVisaFee', 'va
  {
    description: 'Visa document validation rules',
  },
    name: 'docu
    exports: ['DOCUMENT_TEMPLATES', 'getTemplate
  {
    description: 'Approval flow type definitions',
  },
    name: 'approval-utils.ts',
    exports: ['validateFlowProgre
  {
    description: 'Qualified s
  },
    name: 'qualified-signature-service.ts',
    exports: ['createSignatureRequest', 'verifySignature', 'getProviderConfig']
  {
    description: 'Visual guide content and
  },
    name: 'visual-gu
    
  {
    description: 'Constructi
  },
    name: 'ai-regulatory.ts',
    exports: ['queryRegu
]
export function ComponentRegis
  const [searchTerm, setSearchTerm
  const [selectedCompone
  const filteredComponen
      const matchesSearch = 
        component.description.t
      return matchesSearch 
  }, [searchTerm, selecte
  cons
  const exportToMarkdown = () => {
    markdown += '## Complete Component Documentation\n\n'
    markdown += `Generated: ${new

      if (!acc[compo
    

      markdown += `## ${cate
        markdown += `##
        markdown += `**Status:** ${component.status} | **Complexity:** ${component.complexity}\n\n`
        if (component.props && component.props.length > 0) {
          compo
        }
        if (component.f
          component.feat
        }
        if (component.d
      
        if (component.relatedComponents && component.relatedComponents.length > 0) {
        }
        if (component.hooks && comp
        }
        if (componen
    
   
    })
    markdown += '## Util
      markdown += `### ${module.name}\n\n`
      markdown
    })
    const blob = new Blob([markdown], { type
    const a = document.creat
    a.download = `AFO-CORE
    URL.revokeObjectURL(url)

    const doc = new js
    const pageHeight = doc.internal.pag
    le
    const addText = (text: string, fontSize: number, isBold: boolean = fa
        doc.addPage()
      }
      doc.setFont('helvetica', isBold ? 'bo
      doc.text(lines, mar
    }
    
   
    addText(`Total Components: $
    yPos += 10
    const categoryGroups = COMPONENTS.reduce((acc, component) => {
      acc[comp
    }, {} as Re
    Object.entries(categoryGroups).f
        doc.addPage()
      }
      yPos += 5
      components.forEach
          doc.addPage()
        }
        yPos += 2
      
        if (component.features && component.features.length > 0) {
        }
      })

    yPos = margin
    
   
        doc.addPage()
      }
      yPos += 2
      yPos += 5

  }
  return (
      <DialogTrigger asChil
          <Package size={18} weig
        </Button>
      
          <DialogTitle className="flex items-center gap-3 
            Registro Completo de Componente
          <DialogDescription>
          </DialogDescriptio

          <div class
    
   
              className="pl-
          </div>
            <Button variant="outline" size="sm" onClick={exportToMark
              Markdown
            <Bu
              PDF
          </div>

          <TabsList classN
              <TabsTrigger key
              </TabsTrigger>
      
          <TabsContent value={selectedCategory} className="mt-4">
              <div className="space-y-4 pr-4"
                  filteredCompone
                      key
                    
    
   
                              {c
                       
                              <Badge variant="outline">{component.complexity}</Badge>
                            <CardDescription className="
               
                          <Badge>{
                      </CardHeader>
                        {com
                            <p
                          
                         
      
                            </ul>
                        )}
                    </Ca
                ) : (
                    
    
   
          </TabsContent>

          <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponen
              <DialogHeader>
               
                    {selectedC
                  <Badge variant=
                <DialogDescr
              <ScrollArea classN
                  {selectedComponen
                      <h4 class
                        {sele
      
                    </div>

                    <div
                      <
                    
    
   
                    </div>

                    <div>
                      <div className
               
                      </div>
                  )}
                  {selected
                      <h
                        {sele
                          
                      
      
                          </Badge>
                      </div>
                  )}
                  {sele
                    
    
   
                    </d

                    <div>
              
               
                      </div>
                  )}
              </ScrollArea>
          </Dialog>


          <h4 className=
            Resumen del S
          <div className="g
              <p className="text-
      
              <p className="text-muted-foreground">Módulos Utilidad</p>
            </div>
              <p classNa
                {COMPON
            </div>
    
   
            </div>
        </div>
    </Dialog>
}






















































































































































































































































































































































































































































































































































































































































































