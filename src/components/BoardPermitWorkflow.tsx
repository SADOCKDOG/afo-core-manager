import { useState } from 'react'
import {
  VisaSt
  VISA_DOCUMENT_TY
  VisaStatus,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
import { 
import { Badge } fro
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { validateDocument, canSubmitVisa } from '@/lib/visa-utils'
interface BoardPermitWorkflowProps {
}
export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [projects] = useKV<Project[]>('projects', [
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [activeTab, setActiveTab] = us
  const filteredApplications =
    : (visaApplications || [])

    setApplicationDialogOpen(true)

 

          v.id === visaData.id 
            : v
        toast.success('Solicitud de visado actualizad
      } else {
          ...visaData,
          projectId: visaData.projectId || projectId || '',
          status: visaData.status || 'draft',

          createdAt: Date.now(),
        } as VisaApplication
        return [...visasList, 


    setVisaApplications(c
        v.id === visaId ? { ...v, 
   

  const handleAddDocument = (document: any) => {
    const updatedDocuments = [...selected
  }
  const handleValidateAn

    const missingDocs = require
    if (missingDocs.length > 0) {
        descrip
      ret

    if (invalidDocs.le
        descri
      return

      toast.error('La solicitud no c
    }
    handleUpdateVisa(selectedVisa.id,
      submittedAt: Date.now()
    
      description: 'La solicitud está lista pa
  }
  const getStatusBadgeClass = (s
      'draft': 'bg-gray-500/20 t
      'submitted': 'bg-blue-
      'required': 'bg-orange-500/20 text-orange-600
      'pending-pickup': 'bg-teal-500/2
      '
    re


        <Button variant="outline" className="gap-2">
          Visados Colegiales
      </DialogTrigger>
        <DialogHeader>
       
     
        </DialogHeader>
   

            </TabsTrigger>
              Pendientes ({fi
            <TabsTrigger value="completed">
            </TabsTrigger>


                <div className="inline-fl
                    initial={

                    <Stamp size={48} className="text-muted-foreground" we
                </div>
    
                </p>
                  <Plus size={16} />
                </Button>
        
            
     

                    Nueva Solicitud
                </div>
                <div className="space-y-3">
                    const project = (projects || []).find(p => p.id === visa.projectId
        
            
     

                        }}
                        <CardHeader className="pb-3">
            
     

                              </p>
                            <Badge 
                            <
      
    
                              <FileText size={16} className=
                              <span className="font-medium">
      
   

                              </div>
                          </div>
                      </Card>
                  })}
              </div>

              <Card>
                  <div className="flex justify-between items
                      Detalle de Solicitud
                    <Badge className={getStatusBadg
                    </Badge>
     
                  <div className
   

          
                      </Button>
                    {selected
                        {VISA_STATUS_LABELS[selected
                    )}

                 
                      
                      <CardContent>
                      
                            <p className="font-medium">{PROFE
                 
                            <p className="font-medium">{selectedVisa.p
                  
                
                       

                          <div>
                            <p className="font-medium">{
                        </div>
                    </Card>
                    <Card>
                        <CardTitle classN
                      <CardContent>
                          
                              <div classNam
                                <span className="text-sm">{VISA_DOCUMENT_TYPE_LABELS[doc.type]}</span>
                          
                     

                            </div>
                          {selectedVisa.documents.
                              No hay documentos a
                          )}
                      </CardC
                  </div>
                  {selectedVisa.notes && (
                      <p className="text-sm font-m
                   
                </CardContent>
            )}

            <p className="text-sm text-muted-foreground">
            </p>

            <p class
            </p>
        </Tabs>

        open={application
        onSave={hand
      />
  )




























































































































































































