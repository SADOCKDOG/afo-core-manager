import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/comp
import { Tabs, T
import { Button } from '@/compo
import { Badge } from '@/components/ui/badge'
import { Package, Download, FileCode } from '@phosphor-icons/react'
import { toast } from 'sonner'
interface ComponentInfo {
  description: string
  features?: string[]
  hooks?: string[]
  relatedComponents?: string[]
  complexity?: 'Low' | 'M
}

  exports: string[]
}
const components: Com
    name: 'Dashboa
    category: 'Busine
      'Project dis
      'Recent acti
    ],
    hooks: ['useMemo'],
    relatedCompon
    status: 'Stable'
  {
 

      'Phase progress vis
      'Click t
    props: ['projec
    dependencies: ['C
 

    description: 'Detailed project vi
   
      'Document organi
      'Budget tracking'
    props: ['project', 's
    dependencie
    complexity: 'High',
  },
    name: 'ProjectDialog',
    category: 'Dialog',
    fe
      'Form validation',
      'Phase percentage
    hooks: ['useState', 'useEffect'],
    complexity: 'High',
  },
    name: 'DocumentM
    
   
      'AI-powered conten
      'Version control',
    ],
    dependencie
    apis: ['spark.llm'],
    status: 'Stable'
  {
    description: 'Template ma
    fe
      'Custom template creation',
      'ISO19650-2 namin
    hooks: ['useKV', 'useState'],
    relatedComponents: ['
    complexity: 'Med
  },
   
    category: 'Utility',
      'Context-aware content generation',
      'Multiple content t
    props: ['on
    relatedComponents: ['DocumentTemplateLib
    status: 'Stable'
  {
    description: 'Munic
    fe
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Notes and observations'
    hooks: ['useState', 'useEffect'],
    complexity: 'Medium',
  },
    name: 'Municipal
    
   
      'Custom requirement 
    ],
    relatedComponents: 
    status: 'Stable'
  {
    description: 'Comprehensive budget management with BC3
    features: [
      'Budget status tracking (Draft, P
      'Total calculations'
    pr
    dependencies: ['Dialog', 'Table',
    complexity: 'High',
  },
    name: 'InvoiceMa
    
   
      'Tax calculations',
      'Auto-invoice on phase completion',
    ],
    hooks: ['useKV', 'useState'],
    relatedComp
    complexity: 'High',
  },
    name: 'ClientManager',
    category: 'Manager',
      'Client informati
      
    ],
    dependencies: ['Dialog', 'Table', 'Button'],
    complexity: 'Medium',
  },
    name: 'BillingManag
    category: 'Manag
    
   
    hooks: ['useKV', 'useState'],
    complexity: 'Low',
  },
    name: 'Stak
    category: 'Dialog',
    features: [
      'Professional credential
    ],
    de
    status: 'Stable'
  {
    description: 'Professional visa managem
    features: [
      'Fee calculation',
      'Document requ
    
   
    status: 'Stable'
  {
    description: 'Docume
    props: [],
      'Flow template management',
      'Progress visualization
    ],
    de
    complexity: 'High',
  },
    name: 'QualifiedSignatureProviderManager',
    category: 'Manager'
      'Provider conf
    
   
    relatedComponents: ['Appro
    status: 'Stable'
  {
    description
    features: [
      'Status filtering',
    ],
    hooks: ['useKV', 'useState
    co
  },
    name: 'DigitalSignaturePad',
    category: 'Utility',
    features: [
    
   
    dependencies: ['Button'],
    status: 'Stable'
  {
    description
    features: [
      'Provider selection',
    ],
    dependencies: ['Dialog
    st
  {
    description: 'Calendar view of project mi
    features: [
      'Month/week/da
    
   
    dependencies: ['Calend
    status: 'Stable'
  {
    description
    props: ['open', 'onOpenChange',
      'Milestone title and description',
      'Status tracking'
    hooks: ['useState'],
    co
  },
    name: 'AIRegulatoryAssistant'
    category: 'Utility',
    features: [
      'Regulatory guida
    ],
    
   
  },
    name: 'BoardPermitWorkflow',
    category: 'Utility',
      'Permit a
      'Timeline tracking'
    dependencies: ['Dialog', 
    status: 'Stable'
  {
    description: 'Email server configurat
    features: [
      
    ],
    hooks: ['useKV', 'useState'],
    complexity: 'Low',
  },
    name: 'EmailLogsDialog',
    category: 'Dialog',
      'Email history
    
   
    dependencies: ['Dialog
    status: 'Stable'
  {
    description
    props: ['open', 'onOpenChange', 'o
      'Folder structure analysi
      'Document detecti
    hooks: ['useState']
    co
  },
    name: 'BulkProjectImportDialog',
    category: 'Dialog',
      'Multi-folder scann
      'Progress trac
    
   
  },
    name: 'BulkProjectExportDialog',
    category: 'Dialog',
      'Multi-pr
      'Metadata export'
    props: ['open', 'onOpe
    apis: ['JSZip'],
    st
  {
    description: 'Comprehensive user d
    features: [
      'Search functi
    
   
    status: 'Stable'
  {
    description: 'Compl
    features: [
      'API refe
      'Code examples',
    ],
    apis: ['jsPDF'],
    st
  {
    description: 'Interactive component document
    features: [
      'Component rel
    
   
    status: 'Stable'
  {
    description: 'Step-b
    features: [
      'Annotations and highlights'
    ],
    complexity: 'Medium'
  },
    na
    category: 
      'Comprehensive status repor
      'Export formats'
    dependencies: ['Butto
    complexity: 'Med
  },
   
    category: 'Utility',
      'Bulk operations',
      'Quick actions'
    dependenci
    status: 'St
  {
    description: 'Browse constructio
    features: [
      'Historical price
    ],
    complexity: 'Medium',
  },
    name: 'PGOUImporter',
    category: 'Utility'
      'PDF parsing',
    
   
    complexity: 'High',
  }

  {
    exports: ['Project', 'Stakeholder', 'Invoice', '
  },
    name: 'email-service.ts',
    de
  {
    exports: ['calculateProjectProgress', 'getPr
  },
    name: 'invoice-utils.
    description: 'In
  {
   
  },
    name: 'bc3-parser.ts',
    description: 'BC3 fi
  {
    exports: ['getMunicipalityRe
  },
    name: 'visa-utils.ts',
    de
  {
    exports: ['DOCUMENT_TEMPLATES
  },
    name: 'approval-flow-
    description: 'Ap
  {
   
  },
    name: 'visual-guides.ts',
    description: 'Visual
  {
    exports: ['
  },
    name: 'ai-prompts.t
    description: 'AI pr
]
export function ComponentRegistry(
  const [selectedCategory, se

    const cats = Arr
  },
  c
      const matchesSearch = 
        component.description.toLowerCase().includes(searchTerm.toLowerCa
      return matchesSea
  }, [searchTer
  const exportToMarkdown 
    markdown += `Generated:
    markdown += `Total U

    
      if (!acc[component.category]) {
      }
      return acc

   
        markdown += `#### ${
        if (component.props && component.props.length > 0) {
        }
          markd
            markdown += `- ${featur
          markdown += '\n'
        if (component.compl
        }
      

    utilityModules.forEach(module
      markdown += `${module.description}\n\n`
        markdown += `**
    })
    
   
    a.download = `AFO-CORE-M
    URL.revokeObjectURL(url)
  }
  const exportToPDF = () => {
    const margi
    const pageHeight = doc.internal.page

      doc.setFontSize(f
      
        doc.addPage()
      }
      yPos += lines.le

    
   

      if (!acc[component.category]) {
      }
      return a

      if (yPos > pageHeight - 40)
        yPos = margin
      addText(`${catego

        if (yPos > pageHeight - 60) {
          yPos = margin
        addText(componen
        if (component.fea
            addText(
    
   

    yPos = margin
    yPos += 3
    utilityModu
        doc.addPage()
      }
      addText(module.desc
    })
    doc.save(`AFO-CORE-MANAGER-Components-${Date.now()}.p
  }
  return (
    
   
        </Button>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-
          <DialogTitle 
            Exp
        </div>
        <div className="flex
            placeh
      
          />
            <FileCode size={16} /
          </Button>
            <Download 
          </Button>

   
              <TabsTrigger k
              </TabsTrigger>
          </TabsList>
          <Tabs
              <div cla
                  <Card 
                    cla
      
                      <div className
                        {componen
                            {component.status}
                      
                    
    
   
                        </Badge>
                    </CardContent>
                ))}
            </ScrollArea>
        </Tabs>
        <Separator />
        <div className="gr
            <p className="
      
            <p className
          </div>
            <p classNam
          </div>

   
              <div className="space-
                  <div className="flex items-center justify-b
                    <Ba
               
                  <DialogDescr
                  </DialogDescrip

      
                    <ul className="list-disc list-inside
                        <li key={idx}>{feature}
                    </u
                )}
    
   
                      {selectedCompo
                      ))}
                  </div

                  <div>
                    <div clas
                       
      
                )}
                {selecte
                    
                      {
                    
    

                  <div>
                    <div className="flex flex-wrap g
                        
               
                          onClic
                            i
                   
                        </Badge>
      
                )}
                {select
                    
    
   
                  </div>
              </div>
          </DialogConten
      </DialogC
  )
































































































































































































































































































































































































































































































































