import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Project,
  VISA_STATUS_LABE
  VisaDocument
import { Button } from '@/comp
import { Badge
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

  projectId?: string

  const [projects] = useKV<Project[]>('projects', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplicat

  const filteredApplications = proje
    : (visaApplicati
 

    v.status === 'approved' || v.status === 'rejected'

    setSelectedVisa(null)
  }
  const handleSaveApplication = (visaData: Partial<VisaApplication>) => {
      if (visaData.id) {

            : v
        toast.success('Solicitud de visado actualizada')
      } else {

          college: visaData.college!,
          phases: visaData.phases || [],
   
          updatedAt: Date.now()
        
   


    setVisaApplications(c
        v.id === visaId ? { ...v, 
   

    if (!selectedVisa) return
    setSelectedVisa({ ...selectedVisa, d
  }
  const handleSubmitVisa = () => {

    if (requiredDocs.some(d => !d.isValid)) {
        descrip
      ret

    if (invalidDocs.le
        descri
      return

      toast.error('No se puede presentar 
      })
    }
    handleUpdateVisa(selectedVisa.id, {
      submittedAt: Date.now()

      description: 'Se ha regist
  }
  const getStatusColor = (st
      'd
      'submitted': 'bg-blue-500/20 text-blue-700 bo
      'required': 'bg-orange-500/20 text-orange-
      '
      
   

    if (status === 'approved') {
    }
      return <WarningCircle size={1
    return <Clock size={16} weight="fill" className="text-blue-600" />

    ?
   

    <Dialog>
        <Button variant="outl
          Visados
      </DialogTrigger>
        <DialogHeader>
   

            Gestiona la presentaci
        </DialogHeader>

            <TabsList>
                Todos ({filteredApplications.
              <TabsTrigger value="pending">
              </TabsTrigger>
        
            
     

          </div>
          <TabsContent value={act
              <div className="text-center py-12">
                  <Stamp size={48} className="text-muted-fore
        
            
     

                  const project = (proj
                    ? (visa.documents.filter(d => d.is

        
            
     

                          <div classNam
                          
                             
      

                                  <p className="text-x
                                  </p>
      
   

                                {visa.phases.map(phase => (
                                    {phase.replace('-', ' ').to
                                ))}
                            </div>
                            <Separator />
                            <div className="grid grid-cols-3 gap-4 text-sm"
                                <p className="text-muted-foreground mb-
                                <p className="text-xs text-muted-foreground
                                </p>
                              <div className="flex items-center gap-
                                <span>{visa.documents.length}
     
                         
   

                            {visa.rejectionReasons && visa.rejec
                                
                                </p>
     
                                  ))}
                              </div>
     
                          <div className="flex flex-col gap-2">
   

                                setApplicationDial
                           
                            </
                            
                             

          
            
                            )
                        </div>
                    </motion.div>
                }
            )}
        </Tabs>

        open={applicat
        onSave={handleSaveApplication}
      />
  )


































































































































































