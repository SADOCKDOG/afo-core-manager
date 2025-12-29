import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication, 
  VisaDocument, 
  VisaStatus, 
  Project,
  VISA_STATUS_LABELS,
  PROFESSIONAL_COLLEGE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Certificate, CheckCircle, Upload, Eye, Plus } from '@phosphor-icons/react'
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
      requirements: visaData.requirements || [],
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
    const colors: Record<VisaStatus, string> = {
      'draft': 'bg-muted text-muted-foreground',
      'pending-submission': 'bg-blue-500/10 text-blue-500',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-yellow-500/20 text-yellow-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-purple-500/20 text-purple-600',
      'pending-pickup': 'bg-cyan-500/20 text-cyan-600',
      'approved': 'bg-green-500/20 text-green-600',
      'rejected': 'bg-red-500/20 text-red-600'
    }
    return colors[status]
  }

  const getCompletionPercentage = (visa: VisaApplication) => {
    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    const uploadedTypes = visa.documents.map(d => d.type)
    
    const uploadedRequired = requiredDocs.filter(req => uploadedTypes.includes(req.type))
    const validDocuments = uploadedRequired.filter(req => {
      const doc = visa.documents.find(d => d.type === req.type)
      return doc && doc.isValid
    })
    
    return requiredDocs.length > 0 
      ? Math.round((validDocuments.length / requiredDocs.length) * 100)
      : 0
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Certificate size={18} weight="duotone" />
          Visado Colegial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30">
              <Certificate size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle>Visado Colegial</DialogTitle>
              <DialogDescription>
                Gestione las solicitudes de visado ante el Colegio de Arquitectos
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="gap-2">
                <Eye size={16} />
                Visión General
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus size={16} />
                Nueva Solicitud
              </TabsTrigger>
              <TabsTrigger value="validate" className="gap-2" disabled={!selectedVisa}>
                <CheckCircle size={16} />
                Validar Documentos
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6">
            <TabsContent value="overview" className="mt-4 mb-6">
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
                    Comience creando una nueva solicitud de visado para este proyecto
                  </p>
                  <Button onClick={() => setActiveTab('create')} className="gap-2">
                    <Upload size={18} />
                    Crear Solicitud
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4 pb-4">
                  {projectVisas.map((visa, index) => {
                    const completion = getCompletionPercentage(visa)
                    const project = (projects || []).find(p => p.id === visa.projectId)
                    
                    return (
                      <motion.div
                        key={visa.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedVisa(visa)
                            setActiveTab('validate')
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{project?.title || 'Proyecto sin título'}</CardTitle>
                                <CardDescription>
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusColor(visa.status)}>
                                {VISA_STATUS_LABELS[visa.status]}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Completado</span>
                                <span className="font-medium">{completion}%</span>
                              </div>
                              <Progress value={completion} className="h-2" />

                              <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{visa.phases.length}</div>
                                  <div className="text-xs text-muted-foreground">Fases</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{visa.documents.length}</div>
                                  <div className="text-xs text-muted-foreground">Documentos</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {visa.documents.filter(d => d.isValid).length}
                                  </div>
                                  <div className="text-xs text-muted-foreground">Validados</div>
                                </div>
                              </div>

                              {visa.submittedAt && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
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
            </TabsContent>

            <TabsContent value="create" className="mt-4 mb-6">
              <div className="pr-4">
                <PermitApplicationForm
                  projectId={projectId}
                  onSubmit={handleCreateVisa}
                  onCancel={() => setActiveTab('overview')}
                />
              </div>
            </TabsContent>

            <TabsContent value="validate" className="mt-4 mb-6 h-full">
              {selectedVisa && (
                <div className="h-full flex flex-col pr-4">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {(projects || []).find(p => p.id === selectedVisa.projectId)?.title || 'Proyecto'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                        </span>
                        <Badge className={getStatusColor(selectedVisa.status)}>
                          {VISA_STATUS_LABELS[selectedVisa.status]}
                        </Badge>
                      </div>
                    </div>
                    {selectedVisa.status === 'draft' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitVisa(selectedVisa.id)}
                          className="gap-2"
                        >
                          <Upload size={16} />
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
                      <TabsContent value="documents" className="flex-1 overflow-auto mt-4">
                        <DocumentValidationPanel
                          visa={selectedVisa}
                          onDocumentUpload={(docs) => handleDocumentUpload(selectedVisa.id, docs)}
                          onUpdateVisa={(updates) => handleUpdateVisa(selectedVisa.id, updates)}
                        />
                      </TabsContent>
                      <TabsContent value="status" className="flex-1 overflow-auto mt-4">
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
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
