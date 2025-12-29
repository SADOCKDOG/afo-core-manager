import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication, 
  VisaDocument, 
  VisaStatus, 
  VisaDocumentType,
  ProfessionalCollege,
  ProjectPhase,
  Project,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Certificate, File, Upload, CheckCircle, Warning, X, Clock, Eye } from '@phosphor-icons/react'
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
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'required': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'submitted':
      case 'under-review': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'pending-payment': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      default: return 'bg-muted/20 text-muted-foreground border-border'
    }
  }

  const getCompletionPercentage = (visa: VisaApplication) => {
    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    if (requiredDocs.length === 0) return 0
    
    const uploadedTypes = visa.documents.map(d => d.type)
    const uploadedRequired = requiredDocs.filter(req => uploadedTypes.includes(req.type))
    const validDocuments = uploadedRequired.filter(req => {
      const doc = visa.documents.find(d => d.type === req.type)
      return doc?.isValid
    })
    
    return Math.round((validDocuments.length / requiredDocs.length) * 100)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Certificate size={18} weight="duotone" />
          Visado Colegial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Certificate size={24} weight="duotone" />
            </div>
            Gestión de Visado Colegial
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <Eye size={16} />
              Solicitudes
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Upload size={16} />
              Nueva Solicitud
            </TabsTrigger>
            <TabsTrigger value="validate" className="gap-2" disabled={!selectedVisa}>
              <File size={16} />
              Validar Documentos
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="overview" className="h-full m-0">
              <ScrollArea className="h-[calc(90vh-200px)]">
                {projectVisas.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <Certificate size={48} className="text-muted-foreground" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No hay solicitudes de visado</h3>
                    <p className="text-muted-foreground mb-6">
                      Cree una nueva solicitud para comenzar el proceso de visado colegial
                    </p>
                    <Button onClick={() => setActiveTab('create')} className="gap-2">
                      <Upload size={18} />
                      Crear Primera Solicitud
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid gap-4 pr-4">
                    {projectVisas.map((visa, index) => {
                      const project = (projects || []).find(p => p.id === visa.projectId)
                      const completion = getCompletionPercentage(visa)
                      
                      return (
                        <motion.div
                          key={visa.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => {
                            setSelectedVisa(visa)
                            setActiveTab('validate')
                          }}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg mb-1">
                                    {project?.title || 'Proyecto sin título'}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-2">
                                    {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                    {visa.applicationNumber && (
                                      <>
                                        <span>•</span>
                                        <span className="font-mono text-xs">{visa.applicationNumber}</span>
                                      </>
                                    )}
                                  </CardDescription>
                                </div>
                                <Badge variant="outline" className={getStatusColor(visa.status)}>
                                  {VISA_STATUS_LABELS[visa.status]}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Documentación</span>
                                    <span className="font-medium">{completion}%</span>
                                  </div>
                                  <Progress value={completion} className="h-2" />
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground mb-1">Documentos</div>
                                    <div className="font-semibold">{visa.documents.length}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground mb-1">Fases</div>
                                    <div className="font-semibold">{visa.phases.length}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground mb-1">Validados</div>
                                    <div className="font-semibold text-green-400">
                                      {visa.documents.filter(d => d.isValid).length}
                                    </div>
                                  </div>
                                </div>

                                {visa.status === 'submitted' && visa.submittedAt && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                                    <Clock size={14} />
                                    Presentado el {new Date(visa.submittedAt).toLocaleDateString('es-ES')}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="create" className="h-full m-0">
              <ScrollArea className="h-[calc(90vh-200px)]">
                <div className="pr-4">
                  <PermitApplicationForm
                    projectId={projectId}
                    onSubmit={handleCreateVisa}
                    onCancel={() => setActiveTab('overview')}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="validate" className="h-full m-0">
              {selectedVisa && (
                <div className="h-full flex flex-col">
                  <div className="mb-4 p-4 bg-card/50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">
                          {(projects || []).find(p => p.id === selectedVisa.projectId)?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                        </p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(selectedVisa.status)}>
                        {VISA_STATUS_LABELS[selectedVisa.status]}
                      </Badge>
                    </div>
                    
                    {selectedVisa.status === 'draft' && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleSubmitVisa(selectedVisa.id)}
                          className="gap-2"
                          disabled={getCompletionPercentage(selectedVisa) < 100}
                        >
                          <CheckCircle size={18} weight="duotone" />
                          Presentar Solicitud
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab('overview')}
                        >
                          Volver
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="documents" className="h-full flex flex-col">
                      <TabsList>
                        <TabsTrigger value="documents">Documentos</TabsTrigger>
                        <TabsTrigger value="status">Estado</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="documents" className="flex-1 m-0 mt-4">
                        <DocumentValidationPanel
                          visa={selectedVisa}
                          onDocumentUpload={(docs) => handleDocumentUpload(selectedVisa.id, docs)}
                          onUpdateVisa={(updates) => handleUpdateVisa(selectedVisa.id, updates)}
                        />
                      </TabsContent>
                      
                      <TabsContent value="status" className="flex-1 m-0 mt-4">
                        <PermitStatusTracker
                          visa={selectedVisa}
                          onUpdateStatus={(status) => handleUpdateVisa(selectedVisa.id, { status })}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
