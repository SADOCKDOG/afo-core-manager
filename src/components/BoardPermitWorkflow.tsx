import { useState, useEffect } from 'react'
import { 
import { 
  VisaApplication, 
  VisaDocument, 
  VisaStatus, 
  VisaDocumentType,
  ProfessionalCollege,
  VISA_STATUS_L
  PROFESSI
import { Button } fro
import { Tabs, TabsList, Tab
import { Badge } from '@/comp
import { ScrollArea 
import { Certificate, File, Upload, CheckCircle
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Certificate, FileCheck, Upload, CheckCircle, Warning, X, Clock, Eye } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { PermitApplicationForm } from './PermitApplicationForm'
import { DocumentValidationPanel } from './DocumentValidationPanel'
import { PermitStatusTracker } from './PermitStatusTracker'
import { getRequiredDocuments, validateDocument } from '@/lib/visa-validation'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [open, setOpen] = useState(false)
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [projects] = useKV<Project[]>('projects', [])
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'validate'>('overview')
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)

  const projectVisas = projectId 
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleCreateVisa = (visaData: Partial<VisaApplication>) => {
    const newVisa: VisaApplication = {
      id: Date.now().toString(),
      projectId: visaData.projectId!,
      college: visaData.college || 'COAM',
      status: 'draft',
      phases: visaData.phases || [],
      documents: [],
      requirements: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...visaData
    }

    setVisaApplications(current => [...(current || []), newVisa])
    setSelectedVisa(newVisa)
    setActiveTab('validate')
    toast.success('Solicitud de visado creada', {
      description: 'Ahora puede agregar documentos para validación'
    })
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(current => 
      (current || []).map(v => 
        v.id === visaId 
          ? { ...v, ...updates, updatedAt: Date.now() } 
          : v
      )
    )

    if (selectedVisa?.id === visaId) {
      setSelectedVisa(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null)
    }
  }

  const handleDocumentUpload = (visaId: string, documents: VisaDocument[]) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return

    const updatedDocuments = [...visa.documents, ...documents]
    handleUpdateVisa(visaId, { documents: updatedDocuments })
    
    toast.success(`${documents.length} documento(s) agregado(s)`, {
      description: 'Validando documentos...'
    })
  }

  const handleSubmitVisa = (visaId: string) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return

    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    const uploadedTypes = visa.documents.map(d => d.type)
    const missingDocs = requiredDocs.filter(req => !uploadedTypes.includes(req.type))

    if (missingDocs.length > 0) {
      toast.error('Faltan documentos requeridos', {
        description: `${missingDocs.length} documento(s) obligatorio(s) no se han subido`
      })
      return
    }

    const invalidDocs = visa.documents.filter(d => !d.isValid)
    if (invalidDocs.length > 0) {
      toast.error('Documentos con errores de validación', {
        description: `${invalidDocs.length} documento(s) tienen errores que deben corregirse`
      })
      return
    }

    handleUpdateVisa(visaId, {
      status: 'submitted',
      submittedAt: Date.now(),
      applicationNumber: `VISA-${Date.now()}`
    })

    toast.success('Solicitud presentada al Colegio', {
      description: 'Recibirá notificaciones sobre el estado del visado'
    })
  }

  const getStatusColor = (status: VisaStatus) => {

    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    
    const uploadedRequired = requiredDocs.filter(req => uploadedTypes.includes(req
      const doc = visa.
    })
    return Math.round((validDocuments.length / requiredDocs.length) * 100)

    <
   

      </DialogTrigger>
        <DialogHeader>
            <div className="p-2 rounded-lg 
    
          </DialogTitle>

          <TabsList className="grid w-full grid-cols-3">
              <Eye size={16} />
            </TabsTrigger
      
    
              <File size={16} />
   

          
                {projectVisas.length === 0 ? (
                    initial={
                    className="text-center py-16"
                    <div className="inline-flex p-4 
                    </div
                 
                    </
                      <Upload size={18} />
                    </
                ) : (
                    {projectVisas.map((visa, index) => {
                      const completion = getCompletionPe
                  
                          key={visa.id
                        
                       

                          }}>
                              <div className="flex items
                                  <CardTitle className="text
                               
                         
                          
                                        <span className="f
                                  
                             
                          
                              </div>
                            <CardCont
                                
                          
                     

                                <div className="grid gr
                                    <div className="text-muted-fo
                                  </div>
                                    <div class
                             
                                    <div className=
                                      {visa.docume
                                  </div>

                                  <div className="flex items-center gap-2 text-x
                                    Presentado el {new Date(visa.submittedAt).toLocaleDateString('
                          
                            </CardContent>
                        </motion.div>
                    })}
                )}
            </TabsContent>
            <TabsContent value="create" cl
                <div className="pr-4">
                    projectId
                    onCancel={(
                </div
            </TabsContent>
            <TabsContent value="validate" className="h-f
                <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between 
                      
                        </h3>
                          {PROFESSI
                      </div>
                        {VISA_STATUS_LABELS[selectedVisa.
                    </div>
                    {selectedVisa.status === 'draft' && (
                        <
                          className="gap-2"
                        >
                          Presentar Solicitud
                        <Butt
                          onClick={() =>
                          Volver
                      </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                      <TabsList>
                        <TabsTrigger value="status">Estado</TabsTrigger>
                      
                        <DocumentValidationPanel
                          onDocumentUplo
                        />
                      
                        <PermitStatusTrac
                          onUpdateStat
                      </TabsContent>
                  </div>
              )}
          </div>
      </DialogContent>
  )































































































































