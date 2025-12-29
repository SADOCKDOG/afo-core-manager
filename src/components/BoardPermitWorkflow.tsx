import { useState } from 'react'
import {
  VisaSt
  VISA_DOCUMENT_TY
  VisaStatus,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
import { Dialog, Dialo
import { Card,
import { VisaApplica
import { motion } from 'framer-motion'

  projectId?: string

  const [open, setOpen] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'completed'>('overview')
  const filteredApplications = project
    : (visaApplications || [])

    setApplicationDialogOpen(true)

 

        id: Date.now().toString(),
        college: visaData.college!,
        phases: visaData.phases || [],
        requirements: visaData.requirements || [],
        updatedAt: Date.now(),
      

  }
  const handleUpdateVisa = (visaId: string, updates: Partial<VisaAppl
      (currentVisas || []).map

      )
    
      setSelectedVisa(prev => prev
  }

    const updatedDocuments = [...selectedVisa.documents, document]
  }
  const handleValidateAndSubmit = () => {

    const missingDocs = requiredDocs.fil
    if (missingDocs.length > 0) {
        description: 'Por favor, sube t
      return

    if (invalidDocs.length > 0) {
        description: `${invalidDocs.length} 
      return

      status: 'pending-submiss

      
  }
  const getStatusBadgeClass = (status: VisaStatus
     
   

      'pending-pickup': 'bg-teal-500/20 text-teal-600',
      'rejected': 'bg-red-500/20 text-r
    return classes[status] || ''

    <Dialog open={open} onOpenChange={setOpen}>
        <Butt
       
     
    
          <div className="flex items-c
              <DialogTitle>Gestión de Visados Colegiales</DialogTitle>
     
   

        <Tabs value={activeTab} onValueChange={(val) => s
            <TabsList classNa
                Todas
              <TabsTrigger value="pending">
   

              </TabsTrigger>
          </div>

              <div>
                  <motion.div

                  >
                      <Stamp size={48} className="text-m
                    <h3 className="text-lg font-semibold mb-2">No hay solicitudes de visado
        
            
     

                  <div className="space-y-4">
                      <h3 classNa
                      </h3>
                        <Plus size={16} />
        

     

                        <Card
                          className
      

                            <div className="flex just
                                <CardTitle className="text-base">
      
   

                                {VISA_STATUS_LABELS[visa.status
                            </div>
                          <CardContent>
                              <span className="text-muted-foreg
                                {validDocsCount}/{
                            </div>
                              <span className="text-m
                            </div>
                        </Card>
                    })}
                )}

                {!applicationDia
   

          
                    <div className="flex justif
                      <Badge 
                      </Badge>

                 
                 
                      

                    )}
                    {s
                        className="w-full gap-2"
                 
                        Presentar Solicitud
                    )}
                    {selectedVisa.status !== 'draft' && selectedVisa.status !== 'p
                  
                  
                
                    )}

                        <CardTitle className="text-base">Información General</CardTitle>
                      <CardContent>
                          <div>
                            <p className="te
                     
                          <d
                            <p className="t
                          
                          <d
                            <p className="tex
                                ? `${selectedVisa.estimatedFee.toFix
                           
                          <d
                       
                

                    <Card>
                        <CardTitle className="text-base">Documentos
                   
                          {selectedVisa.documents.map(
                             
                                  {VISA_DOCUMENT_TY
                                {doc.validationErr
                                    <Warning size
                   
                              </div>
                                {doc.isValid ? 'Válido' : 'Error'}
                          
                          {selectedVisa.documents.length === 0 && (
                              No hay documentos adjuntos
                          )}
                      </
                  </div>
                  <p className="text-mut
                  </p>
              </div>
          </TabsContent>
          <TabsConten
              Solicitudes pendientes de revis
          </TabsContent>
          <TabsContent value="completed">
              Solicitudes aprobadas o completadas
          </TabsContent>
      </DialogContent>
      <VisaApplicationDialog
        onOpenChange={setAppl
        visa={selectedVisa || u
    </Dialog>

































































































































































































