import { useState } from 'react'
import {
  Projec
  VISA_STATUS_LABE
  PROFESSI
} from '@/lib
import { Dialog, Dial
import { Card } from '@/comp
  PROFESSIONAL_COLLEGE_LABELS,
  VisaDocument
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Stamp, Plus, CheckCircle, WarningCircle, FileText, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { validateDocument, canSubmitVisa } from '@/lib/visa-utils'
import { VisaApplicationDialog } from './VisaApplicationDialog'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [projects] = useKV<Project[]>('projects', [])
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
    v.status !== 'approved' && v.status !== 'rejected'
  const completedApplications = filteredApplications.filter(v => 

  const handleCreateApplication = () => 
    setApplicationDialogOpen(true)


      if (visaData.id) {
          v.id === visaData.id 
   
        toast.success('Solicitud de visado actualizada')
      } else {
   

          documents: visaData.documents |
          createdAt: Date
        } as VisaApplication
   

  }
  const handleUpdateVisa = (visaId: stri
      (currentList || []).map(v => 
      )
  }
  const handleAddDocument = (do
    const updatedDocuments = [...selectedVisa.documents, document]
    setSelected

    if (!selectedVisa) return
    const requiredDocs
      type => 

      toast.error('Fal
      })
    }
    const invalidDocs = selectedVisa.document
      toast.error('Hay documentos con errores 
      })
    }
    if (!canSubmitVisa(selected
      return

      status: 'submitted',
    })
    to
    })


      'pending-submission': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      'under-review': 'bg-indigo-500/2
      'pending-payment': 'bg-amber-
      'approved': 'bg-green-500/20 text-green-700 border-green-300',
    }
  }
  c

    if (status === 'rejected' || status === 'required') {
    }
  }
  const displayApplications = activeTab === 'all' 
    : activeTab === 'pending' 
   

      <DialogTrigger asChild>
          <Stamp size={18} we

      <DialogContent className="max-w-6xl max-h-[85vh] overflow
          <DialogTitle className="flex items
            Flujo de Tramitación de Visados
     


          <div className="flex items-center justify
              <TabsTrigger value="all">
        
            
     

            <Button onClick={handleCreateApplication} className="gap-2
              Nueva Solicitud
          </div>
          <TabsContent value={activeTab} className="space-y-4 mt-6">
        
            
     

                <h3 className="text-lg 
                  Comienza creando una nueva solicitud de visado c
            
     

              <div className="grid gap-
                  const pr
                    ? (visa.d


                      initial={{ opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.05 }}
      
   

                                <h4 className="font-semibold">
                                </h4>
                                  <p className="text-sm text-m
                                {visa.applicationNumber && (
                                    Expediente: {visa.applicationN
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {VISA_STATUS_LABELS[visa.status]}
                              {visa.phases.map(phase => (
                                  {phase.replace('-', ' ').to
     

   

                              <Progress value={va

                              <div className="flex items-center gap-1">
     
                              <div className="flex items-
                                <span>
     
                              {visa.estimatedFee && (
   

                              <div className="p-3 
                           
                              
                            
                             


            
                             
                                setSelectedVisa(visa
                              }}
                            
                 
                      
                                  setSelectedVisa(visa)
                      
                                Presentar
                            )}
                        </div>
                    </mo
                })}
            )}
        </Tabs>


        visa={selectedVisa || undefined}
      />
  )


































































































































































