import { useState } from 'react'
import { 
  VisaSta
  PROFESSIONAL_COLL
  VisaStatus, 
  VISA_STATUS_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  Project
import { Card, CardC
import { Progress } from '@/components/ui/progr
import { toast } from 'sonner'
import { PermitStatusTracker } from './PermitStatusTracker'
import { motion } from 'framer-motion'
interface BoardPermitWorkflowProps {
}
export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflow
  const [activeTab, setActiveT
  const [projects] = useKV<Project[]>('projects', [])

    ? (visaApplications || []).filter(v => v.projectId === p


      projectId: projectId || '',
      status: 'draft
 

    }
    setSelectedVisa(newVisa)
    toast.success('Nueva solicitud de visado creada')

    setVisaApplications(current => 
        v.id === visaId 

    )
      setSelectedVisa(prev => prev ? { ...prev, ...updates } : null)
  }

    if (!visa) return
    const updatedDocuments = [...visa.
    toast.success(`${documents.l

    handleUpdateVisa(v

    const visa = 

    const missingDocs =
    )
    if (missingDocs.length 
     
      return

    if (invalidDocs.len
        description: `${invalidDocs.length} documento
   

      status: 'submitted',
    })
      description: 'Recibirá un
  }
  const getStatusBadgeClass = (status: VisaStatus) => {
      'draft'
      '
     
      'pending-pickup': 'bg-teal-500/2
      'rejected': 'bg-red-500/20 text-red-600'
    r



    const uploadedRequired = requiredDocs.filter(req => 
    ).length


    <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="outline" className="gap-2">
   

        <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="p-2 rounded-
   

                Gestione las solicitudes de visado an
            </div>
        </DialogHeade

            <TabsTrigger value="overview" className="gap-2">
              Vista General
            <TabsTrigger value="new" className="gap-2" d
     

          <TabsContent value="ove
              {projectVisas.length === 0 ? (
                  initial={{ opacity: 0, y: 20 }}
        
            
     

                  </p>
                    <Upload size=
                  </Button>
              ) : (
        
            
     

                      >
                          
                            s
      
                          <CardHeader>
                              <div className="space-y-1">
      
   

                              <Badge className={getStat
                              </Badge>
                          </CardHeader>
                            <div className="space-y-3">
                                <span className="t
                                </span>
                                  Fases: {visa.phases
                              </div>
                                <div className="flex it
                                  <div className="t
                                      {calcula
     
                                <Progress value={calculateCo
   

                    )
                </div>


                  Nueva Solicitud
              </div>
          </TabsContent>
          <T

                  <div>
   

          
                      <span className="text-xs"
                      </span>
                    {selectedVisa.status === 'pendin
                        onClick={() => handleSubmitT
                      >
                 
                    )}
                      <Button
                        variant="outline"
                        Marcar Listo para Presentar
                    )}
                </div>
                <T
                 
                  </TabsList>
                    <DocumentVali
                      onDocumentUpload={(docs) => handleAddDocuments(selectedVisa
                    />
                  
                
                    />

            )}
        </Tabs>
    </Dialog>
}



































































































































































