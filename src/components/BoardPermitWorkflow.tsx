import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication, 
  VisaStatus, 
  VISA_STATUS_
} from '@/
import { Dialog, Dial
  PROFESSIONAL_COLLEGE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Certificate, FileCheck, Upload, Eye, Plus } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { PermitApplicationForm } from './PermitApplicationForm'
import { DocumentValidationPanel } from './DocumentValidationPanel'
import { PermitStatusTracker } from './PermitStatusTracker'
import { getRequiredDocuments } from '@/lib/visa-validation'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [open, setOpen] = useState(false)
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
    ? (visaApplications || []).filter(v => v.projectI

    const newVisa: VisaApplication = {

      status: 'draft',
      documents: [],
      createdAt: Date.now(),


    setSelectedVisa(newVisa)
    toast.success('Solicitud de 
    })

    setVisaApplication
        v.id === visaId 
          : v
    )
    if (selectedVisa?.id ===
    }

    c

    handleUpdateVisa(visaId, { documents: updatedDocuments })
    toast.success(`${documen
    })

    const visa = (visaApplications || []).find(v => v.id === visaId

   

      toast.error('Faltan documentos requeridos', {
      })
    }
    const invalidDocs = 
      toast.error('Documentos con errores de validación'
      })
    }
    h

    })
    toast.success('Solicitud presentada al Colegio', {
    }


      'pending-submission': 'bg-blue-500/10 text-blue-500',
      'under-review': 'bg-yellow-500/20 text-yellow-600',
      'pending-paymen

    }
  }
  co
    const uploadedTypes = visa.documents.map(d => d.type)
    const uploadedRequired = requiredDocs.fi
      
   

      : 0

    <Dialog open={ope

          Visado Colegial
      </DialogTrigger>
        <DialogHeader className="px-6 pt-6 pb-4 border-b">

            </div>
              <DialogTitle>Visado Colegial</DialogT
                Gestione las solicitudes de visado ante el Colegio de Arquitectos
        
        </Di
     

                <Eye size={16} />
              </TabsTrigger>
                <Plus size={16} />
              </TabsTrigger>
        
            
     

              {projectVisas.le
                  initial=
                  className="t
                  <div className="inline-flex
      

                  </p>
                    <Upload size={18} />
      
   

                    const project = (projects || [
                    return (
                        key={visa.id}
                        animate={{ opacity: 1, y: 0 }}
                      >
                          className="cursor-pointer hover
                            setSelectedVisa(visa)
                          }}
                          <CardHeader>
                              <div className="space
                                <CardDescripti
     
                         
   

                            <div className="space-y-3">
                                <span className="text-muted-foreground">
                              </div>

                                <div className="text-center">
                                  <div className="text-xs t
                                <div className="text-center">
                               
      
    
                                  <
                              </div>
         
   

          
                      </motion.div>
                  })}
              )}

              <div classN
                 
                  onCa
              </div>

              {selectedVisa && (
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <h3 className="text-lg font-semibo
                  
                 
                        </span>
                          {VISA_S
                      </div>
                    {selectedVisa.
                  
                
                       

                          variant="outline"
                        >
                        </Button>
                    )}
                  
                    <Tabs defa
                        <Tab
                      </TabsList>
                        <DocumentV
                          onDoc
                        />
                      <TabsContent value="status" className="flex-1 overflow-auto mt-4"
                          visa={selecte
                        />
                    </Tabs>
                </div>
            </Ta

    </Dialog>
}







































































































































































