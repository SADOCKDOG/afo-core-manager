import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
  VisaAp
  VISA_STATUS_LABE
  VISA_DOCUME
  PROFESSIONAL_COLLEG
} from '@/
import { Dialog, DialogConte
  VisaDocument,
  PROFESSIONAL_COLLEGE_LABELS,
  ProfessionalCollege
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
  projectId?: string

  const [open, setOpen] = useState(false)
  const [visaApplications, setVisaAppl
  const [selectedVisa, setSele

  const filteredApplications = projec

  const handleCreateApplication = () => {
    setApplicationDialogOpen(true)
  }
  const handleSaveVisa = (visaData: Partial<VisaApplication>) => {
      handleUpdateVisa(visaData.id, visaData)
    } else {
        id: Date.now().toString(),

        phases: visaData.phases || [],
        requirements: vis
        updatedAt: Date.now(),
      }
   


    setVisaApplications(currentVisa =>
        v.id === visaId
          : v
    )
      setSele
  }
  con
    if (!visa) return
    const updatedDocuments = [...visa.documents, document]
  }
  c

    if (missingDocs.length > 0) {
        description: 'Por favor, sube todos los documentos obligator
      return

    if (invalidDocs.length > 0) {
        description: `${invalidDocs.length} documento(s) tien
   

      status: 'pending-submission',
    })

    })

    const classes: Record<VisaStatus, string> = {
      'pending-submission': 'bg-yellow-500/20 text-yellow-600',
      'u
      'pendi
     

  }
  return (
      <DialogTrigger asChild>
          <Stamp size={18} weight="duotone" />
        

     

            </div>
              <DialogTitle>Gestión 
                Gestiona las 
      

        <Tabs value={activeTab} onValueChange={(val) 
            <TabsList className="grid w-full grid-cols-3">
      
   

              </TabsTrigger>
                <ClockCounterClockwise size={16} 
              </TabsTrigger>
          </div>
          <TabsContent value="overview" className=
              {filteredApplications.length === 0 ? (
                  initial={{ opacity: 0, y: 20 }}
                  className="text-center py-12"
                  <div className="inline-flex p-4 round
                  </div>
                  <p className="text-sm text-m
     
                    <Plus size={18} />
   

                  <div className="flex justify-
                      <h3 className="text-lg fon
                        {filt
            
   


                    {filteredApplications.map(v
                      return 
                          key={visa.id}
                          onClick={() => {
                 
                 
                      

                                </CardTitle>
                                  {PROFESSIONAL_COLLEGE_LA
                              </div>
                                {VISA_STATUS_LABELS[visa.status]}
                            </div>
                  
                 
                                <span className="font-medium">
                                </span>
                              <div className="flex justify-between">
                  
                  
                
                    })}

            </div>

            <div className="pt-4">
                open={applicationDialogOpen}
                visa={selectedVisa || 
                onSave=
              {!applicationD
                  <Button onClick={() => setApplicationDi
                    Crear Nueva So
                </div>
            </div>

            {selectedVisa ? (
                <div classN
                    <h3 clas
                    </h
                

                    <Button
                      className="gap-2"
                      Presentar Solicitud
                  )}
                    <Button
                      className="gap-2"
                      Marcar Listo para Present
                 

                  <CardHeader>
                  </Card
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-muted-foreground"
                      </div>
                      
                      </div>
                        <p className="
                          {selected
                      </div
                        <p cl
                   
                  

                  <CardHe
                  </CardHeader>
                    <div className="space-y-2">
                        selectedVisa.documents.map(doc => (
                          
                          
                            <Badge variant={doc.isValid ? 'default' : 'destructi
                            </Badge>
                        ))
                        <p cl
                        

                </Card>
            ) : (
                <p className="text-muted-foreground">Selecciona una solicitud para ver su
            )}
        </Tabs>
    </Dialog>
}





























































































































































