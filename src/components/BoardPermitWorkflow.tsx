import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication, 
  VisaStatus, 
  VISA_STATUS_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  Project
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Certificate, Upload, Eye, Plus } from '@phosphor-icons/react'
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
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'new'>('overview')

  const projectVisas = projectId
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleCreateVisa = () => {
    const newVisa: VisaApplication = {
      id: Date.now().toString(),
      projectId: projectId || '',
      college: 'COAM',
      status: 'draft',
      phases: [],
      documents: [],
      requirements: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setVisaApplications(current => [...(current || []), newVisa])
    setSelectedVisa(newVisa)
    setActiveTab('new')
    toast.success('Solicitud de visado creada')
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(current => 
      (current || []).map(v => 
        v.id === visaId 
          ? { ...v, ...updates, updatedAt: Date.now() } as VisaApplication
          : v
      )
    )
    if (selectedVisa?.id === visaId) {
      setSelectedVisa(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const handleAddDocuments = (visaId: string, documents: any[]) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return

    const updatedDocuments = [...visa.documents, ...documents]
    handleUpdateVisa(visaId, { documents: updatedDocuments })
    toast.success(`${documents.length} documento(s) añadido(s)`)
  }

  const handleSubmitToCollege = (visaId: string) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return

    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    const missingDocs = requiredDocs.filter(req => 
      !visa.documents.some(doc => doc.type === req.type)
    )

    if (missingDocs.length > 0) {
      toast.error('Faltan documentos requeridos', {
        description: `Faltan ${missingDocs.length} documentos obligatorios`
      })
      return
    }

    const invalidDocs = visa.documents.filter(doc => !doc.isValid)
    if (invalidDocs.length > 0) {
      toast.error('Documentos con errores de validación', {
        description: `${invalidDocs.length} documentos tienen errores`
      })
      return
    }

    handleUpdateVisa(visaId, { 
      status: 'submitted',
      submittedAt: Date.now()
    })
    toast.success('Solicitud presentada al Colegio', {
      description: 'Recibirá una notificación cuando esté en revisión'
    })
  }

  const handleUpdateStatus = (visaId: string, status: VisaStatus) => {
    handleUpdateVisa(visaId, { status })
    toast.success(`Estado actualizado: ${VISA_STATUS_LABELS[status]}`)
  }

  const getStatusBadgeClass = (status: VisaStatus) => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/10 text-gray-500',
      'pending-submission': 'bg-blue-500/10 text-blue-500',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-yellow-500/20 text-yellow-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-purple-500/20 text-purple-600',
      'pending-pickup': 'bg-teal-500/20 text-teal-600',
      'approved': 'bg-green-500/20 text-green-600',
      'rejected': 'bg-red-500/20 text-red-600'
    }
    return classes[status] || 'bg-gray-500/10 text-gray-500'
  }

  const calculateCompletionPercentage = (visa: VisaApplication) => {
    const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
    if (requiredDocs.length === 0) return 0

    const uploadedTypes = visa.documents.map(d => d.type)
    const uploadedRequired = requiredDocs.filter(req => 
      uploadedTypes.includes(req.type)
    ).length

    return Math.round((uploadedRequired / requiredDocs.length) * 100)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Certificate size={18} weight="duotone" />
          Visado Colegial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="overview" className="gap-2">
              <Eye size={16} />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2" disabled={!selectedVisa}>
              <Plus size={16} />
              Nueva Solicitud
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-auto px-6 pb-6 mt-4">
            <div className="space-y-4">
              {projectVisas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <Certificate size={48} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No hay solicitudes de visado</h3>
                  <p className="text-muted-foreground mb-6">
                    Comience creando una nueva solicitud para este proyecto
                  </p>
                  <Button onClick={handleCreateVisa} className="gap-2">
                    <Upload size={18} />
                    Nueva Solicitud de Visado
                  </Button>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {projectVisas.map((visa, index) => {
                    const project = (projects || []).find(p => p.id === visa.projectId)
                    return (
                      <motion.div
                        key={visa.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className="cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => {
                            setSelectedVisa(visa)
                            setActiveTab('new')
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">
                                  {project?.title || 'Proyecto sin título'}
                                </CardTitle>
                                <CardDescription>
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                </CardDescription>
                              </div>
                              <Badge className={getStatusBadgeClass(visa.status)}>
                                {VISA_STATUS_LABELS[visa.status]}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Documentos: {visa.documents.length}
                                </span>
                                <span className="text-muted-foreground">
                                  Fases: {visa.phases.length}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className="text-muted-foreground">Completado</span>
                                  <div className="text-center">
                                    <div className="text-xs text-muted-foreground">
                                      {calculateCompletionPercentage(visa)}%
                                    </div>
                                  </div>
                                </div>
                                <Progress value={calculateCompletionPercentage(visa)} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleCreateVisa} className="gap-2">
                  <Plus size={18} />
                  Nueva Solicitud
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="new" className="flex-1 overflow-auto px-6 pb-6 mt-4">
            {selectedVisa && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-lg font-semibold">Solicitud de Visado</h3>
                    <p className="text-sm text-muted-foreground">
                      {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusBadgeClass(selectedVisa.status)}>
                      <span className="text-xs">
                        {VISA_STATUS_LABELS[selectedVisa.status]}
                      </span>
                    </Badge>
                    {selectedVisa.status === 'pending-submission' && (
                      <Button
                        onClick={() => handleSubmitToCollege(selectedVisa.id)}
                        className="gap-2"
                      >
                        <Upload size={16} />
                        Presentar al Colegio
                      </Button>
                    )}
                    {selectedVisa.status === 'draft' && (
                      <Button
                        onClick={() => handleUpdateVisa(selectedVisa.id, { status: 'pending-submission' })}
                        variant="outline"
                      >
                        Marcar Listo para Presentar
                      </Button>
                    )}
                  </div>
                </div>

                <Tabs defaultValue="documents" className="flex-1">
                  <TabsList>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                    <TabsTrigger value="status">Estado y Seguimiento</TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents" className="flex-1 overflow-auto mt-4">
                    <DocumentValidationPanel
                      visa={selectedVisa}
                      onDocumentUpload={(docs) => handleAddDocuments(selectedVisa.id, docs)}
                      onUpdateVisa={(updates) => handleUpdateVisa(selectedVisa.id, updates)}
                    />
                  </TabsContent>
                  <TabsContent value="status" className="flex-1 overflow-auto mt-4">
                    <PermitStatusTracker
                      visa={selectedVisa}
                      onUpdateStatus={(status) => handleUpdateStatus(selectedVisa.id, status)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
