import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
  VisaApp
  VISA_STATUS_LABE
  Project,
  VISA_DOCUMENT_TYPE_
import { Button } from '@/comp
import { B
  VisaDocument,
  VISA_DOCUMENT_TYPE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
interface BoardPermitWorkflowProps {
}
export function BoardPermitWor
  const [activeTab, setActiveTab] = useState<'overview' | '
  const [visaApplications, setVisaApplications] = useKV<VisaApplica



    const newVisa: V
 

      documents: [],
      createdAt: Date.now(),
    }
    setActiveTab('new')
  }
  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) =

          ? { ...v, ...updates, 
      )
    if (selectedVisa?.id === v


    const visa = (visaApplications || 
    const updatedDocuments = [..
    handleUpdateVisa(visaId, { do

    if (!selectedVisa)

    const missingDoc
    if (missingDocs.len
        description: 'Por fa
      return

    if (invalidDocs.length >
        description: `$
      return


    })
      description: 'Recibirá una no
  }
  const getStatusBadgeCl
      'draft': 'bg-gray-500/20 text-gray-600',
      'submit
      '
     
      'rejected': 'bg-red-500/20 text-
    return classes[status] || 'bg-gray-500/20 text-gray-600'

   

    ).length
  }
  return (
      <DialogTrigger asChild>
          <Stamp size={18} weight="duotone" />
        </Button>
   

              <Stamp size={24} weight
            <div>
              <p className="t

          </div>

    
              <FileText size={16}
            </TabsTrigger>
              <Plus size={16} />
        
            
     

            <div className="pt-4 space-y-4">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                >
        
            
     

                    Crear Solic
                </motion.d
                <>
      
                      <Plus size={18} />
                    </Button>
      
   

                          setSelectedVisa(visa)
                        }}
                        <CardHeader>
                            <div className="space-y-1">
                                {PROFESSIONAL_COLL
                              <p className="text-sm text-
                              </p>
                            <Badge className={getStatusBad
                            </Badge>
                        </CardHeader>
                          <div className="spac
     
                              </span>
   

                            </div>
                          </div>
                      </Card>
                  </div>
              )}
          </
          <TabsContent value="new" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
   

          
                    </p>
                  <div classN
                      Estado: {VISA_STATUS_LABELS[se
                    {selectedVisa.status === '
                        onCl
                 
                    )}
                      <Button
                        onClick={() => handleUpdateVisa(se
                        Marcar Listo para Presentar
                    )}
                </div>
                  
                 
                  <TabsContent value="documents">
                      visa={selectedVisa}
                      onUpdateVisa={(updates) => handleUpdateVisa(selectedVisa.id,
                  
                  
                
                  </Tab

          </TabsContent>
          <TabsContent value="tracking" cl
              <div className="pt-4">
                  visa={selectedVisa
                />
            )}
        </Tabs>
    </Dialog>
}

























































































































































