import { useState, useMemo } from 'react'
  Dialog
  DialogD
  DialogTitle,
} from '@/components
import { Input 
import { Tabs,
import { ScrollA
import { Package, Download, Fil

  name: string
  description: string
  features?: string[]
  relatedComponents?: string[]
  apis?: string[]
  status?: 'Stable' | 'Beta' | 'Experimental'

  name: string


  {
    category: 'Business',
    features: [
      'Project dis
      'Interactive ch
    relatedComponents: ['
    complexity: 'High',
  },
    name: 'Projec
    description: 'Display card for indiv
      'Phase progress visualization',
 

    status: 'Stable'
  {
    category: 'Busine
    features: [
 

    ],
   
    status: 'Stable'
  {
    category: 'Dialog',
    props: ['op
      'Multi-step wizard (Details, Phases, Stakeh
      'Form validation',
    ],
    hooks: ['useState', 'useEffect'],
    st
  {
    category: 'Manager',
    props: ['projectId'
      'Document uplo
    
   
    ],
    relatedComponents: ['
    apis: ['spark.llm'],
    status: 'St
  {
    category: 'Manager
    features: [
      
      'ISO19650-2 naming compliance',
    ],
    hooks: ['useKV',
    
  {
    category: 'Utility',
    features: [
      'Content regeneration',
      'Multiple
    relatedComponents: ['DocumentTemplateLibr
    complexity: 'High',
  },
    name: 'ComplianceChecker',
    description: 'Municipa
      
      'Status tracking (Cumple, No Cumple, Pendiente, N/A)',
      'Progress visualization',
    ],
    hooks: ['useStat
    
  }
    name: 'MunicipalCompli
    description: 'Manag
      'Municipality database management',
      'Apply to new or existing checklists',
      'Custom r
    relatedComponents: ['ComplianceChecker'],
    complexity: 'Medium',
  },
    name: 'BudgetManager',
    de
      'BC3 file import and export',
      'Budget status tracking (Draft,
      'Budget item mana
    dependencies: ['
    
  }
    name: 'InvoiceManager',
    description: 'Comple
    features: [
      'Line item manageme
      'PDF expo
      'Auto-invoice on phase completio
    relatedComponents: ['BillingManager', 'C
    complexity: 'High',
  },
    name: 'ClientMa
    description: 'Client database with
      
      'Payment terms tracking',
      'NIF validation'
    relatedComponents: ['ClientDi
    complexity: 'Medium'
  },
    name: 'BillingMa
    
   
      'Tax configuration',
    ],
    hooks: ['useKV', 'useState'],
    status: 'St
  {
    category: 'Dialog',
    props: ['open', 'onOpenChange'
      'Stakeholder type selection',
      'Professional creden
    ],
    complexity: 'Low',
  },
    name: 'VisaManager'
    description: 'Pr
    
   
      'Status tracking',
    ],
    hooks: ['useKV', 'useState'],
    status: 'St
  {
    category: 'Manager',
    props: [],
      'Flow template management
      
      'Progress visualization',
    ],
    hooks: ['useKV', 'u
    status: 'Stable'
  {
   
    features: [
      'Authentication se
      'Configuration validation'
    relatedComp
    complexity: 'Medium',
  },
    name: 'QualifiedSignatureRequestViewer',
    description: 'Dashboard for viewin
      'Status filtering',
      'Signature validation',
    ],
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Utility'
    props: ['onSign'
    
   
    ],
    hooks: ['useState', 
    status: 'Stable'
  {
    category: 'Dialog',
    features: [
      'OTP verification',
      'Provider selection'
    dependencies: ['Dialog', 'Inpu
    co
  },
    name: 'ProjectCalendar',
    description: 'Calenda
      'Project miles
    
   
    hooks: ['useKV', 'useS
    status: 'Stable'
  {
    category: '
    props: ['open', 'onOpenChange',
      'Milestone title and descript
      'Status tracking',
    ],
    hooks: ['useState'],
    st
  {
    category: 'Utility',
    props: [],
      'Natural langu
    
   
    dependencies: ['Dialog'
    hooks: ['useState'],
    status: 'Stable'
  {
    category: '
    features: [
      'Status workflow',
      'Timeline tracking
    dependencies: ['Dialog', 'Table', 'Badge', '
    complexity: 'High',
  },
    na
    description: 'Email server configuration for notificati
    features: [
      'Test email funct
    ],
    
   
  {
    category: 'Dialog',
    features: [
      'Search a
    ],
    hooks: ['useKV', 'useState'],
    status: 'Stable'
  {
    category: 'Dialog'
    pr
      'Folder structure analysis',
      'Import validation'
    relatedComponents: ['
    complexity: 'Hig
  },
   
    description: 'Bulk proj
      'Batch document de
      'Progress tracking'
    relatedComp
    complexity: 'High',
  },
    name: 'BulkProjectExpo
    description: 'Export mult
      
      'Metadata export',
    ],
    hooks: ['useState'],
    status: 'Stable'
  {
   
    features: [
      'Search functiona
      'PDF export',
      'Visual guides integration'
    dependencie
    complexity: 'High',
  },
    name: 'DeveloperManual',
    description: 'Compl
    fe
      'API reference',
      'Component hiera
      'PDF export',
    
   
    status: 'Stable'
  {
    category: 'Utility',
    features: [
      'Component relationships',
      'Interactive navigatio
    dependencies: ['Dial
    complexity: 'High',
  },
    name: 'VisualG
    de
    features: [
      'Annotations and highlights
      'Export to PDF'
    dependencies: ['
    
  }
    name: 'ComplianceReportGener
    description: 'Genera
    features: [
      'Require
      'Export f
    dependencies: ['Button'],
    apis: ['jsPDF'],
    status: 'Stable'
  {
    category: 'Utility',
    features: [
      
      'Recent documents'
    dependencies: ['Dialog', 'Car
    complexity: 'Medium
  },
    
   
    features: [
      'Code search',
      'Historical price tracking'
    dependencie
    complexity: 'Medium',
  },
    name: 'PGOUImporter',
    description: 'Import PGOU (P
    fe
      'Text parsing',
    ],
    hooks: ['useState'],
    status: 'Stable'
]
con
    name: 'types.ts',
    exports: ['Project',
  {
    description
  },
    name: 'email-service
    exports: ['sendEmail', 'u
  {
    de
  },
    name: 'project-utils.ts',
    exports: ['calculateP
  {
    
  }
    name: 'invoice-utils.ts',
    exports: ['generateP
  {
    description: 'Budget calculati
  },
    name: 'bc3-parser.ts',
    exports: ['parseBC3', 'generateBC
  {
    description: 'Mun
  },
    name: 'visa-utils.ts',
    exports: ['calculateVisaFee', 
  {
    description: 'Vi
  },
   
    exports: ['DOCUMENT_TEMPLATES', '
  {
    description: 'Approval flow type definitions',
  },
    name: 'qualified-signature-service.ts',
    exports: ['createSign
  {
    description: 'Visual g
  },
    name: 'construction-codes.ts',
    exports: ['searchCod
  {
    description: 'AI
  }

  const [searchTerm, setSear
  const [selectedComponen

    const cats 
  }, [])
  const filteredComponen
      const matchesSearch = 
        component.descrip
      
  }, [searchTerm, selectedCategory])
  const exportToMarkdown = () => 
    markdown += `Generate
    markdown += `Tot
    
   
      acc[component.category
    }, {} as Record<str
    Object.entries(categoryGroups).forEach(([category, components]) =>
      components.forEach(component => {
        markdow
        if (component.props && component
        }
          markdown += '*
          markdown += '
      
        }
          markdown += `*
        if (component.
        }
    
   
    })
    markdown += '## Util
      markdown += `### ${module.name}\n\n`
      if (modu
      }
    })
    const blob = new Blob(
    const a = document.creat
    a.download = `AFO-CORE-MANAGER-Components-${
    URL.revokeObjectURL(url)

    const doc = new jsPDF()
    const margin = 15

      doc.setFontSize(fon
      const lines = 
    
   
      yPos += lines.length * fon

    addText('Complete Component Registry', 16, true)
    yPos += 5
    addText(`Total Utility 

      if (!acc[component.c
      }
      

      if (yPos > pageHeight - 40)
        yPos = margin
      addText(`${cat
    
   
        }
        addText(compone
        if (component.features && component.features.length > 0)
            addText(`• ${feature}`, 
        }
      })

    doc.addPage()
    yP
      if (yPos > pageHeight - 30) {
        yPos = margin
      addText(module.name
      yPos += 3

  }
  return (
      <DialogTrigger as
          <Package size={18} weight="duotone" />
        </Butto
      <DialogContent className="m
          <DialogTitle classN
            Registro Comp
      
          </DialogDescription>

          <div classNa
              placeh
    
   
              <FileCode size={16
            </Button>
              <Download size={16} />
            </Button>

            <TabsList className="w
                <TabsTrigger
                </TabsTri
      
            <TabsContent value={selectedCategory} c
                <div cla
                    fil
                    
    
   
                            <CardTit
                       
                            </div>
               
                          </CardD
                        {compone
                         
      
                              ))}
                        
                      <
                  ) 
    
   
              </ScrollArea>
          </Tabs>
          <Separator />
          <div 
              <p className="text
            </div>
              <p classNa
            </div>
      
              </p>
            </div>
        </div>

    
   
              <div clas
                <Badge va
            </div>
          </Dia
            {selectedCompone
                {selectedComp
                    <h4 
                   
                      ))}
                  </div>

                  <div>
                    <ul 
                       
                    
    
   
                    <h4 clas
                      {se
                      ))}
              

                  <div>
                    <d
                        <Badge key={com
                    </div>
                )}
                {se
                    <h4
      
                      ))}
                  </div>

                  <d
    
   
                    </div>
                )}
            )}
        </Dialo
    </Dialog>
}




























































































































































































































































































































































































































































































































































