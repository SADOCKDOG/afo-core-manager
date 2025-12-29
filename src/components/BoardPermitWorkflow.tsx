import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication,
  VisaStatus, 
  VISA_STATUS_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  Project,
  VisaDocument,
  VISA_DOCUMENT_TYPE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Stamp, Plus, FileText, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { PermitStatusTracker } from './PermitStatusTracker'
import { DocumentValidationPanel } from './DocumentValidationPanel'
import { motion } from 'framer-motion'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'tracking'>('overview')
  const [projects] = useKV<Project[]>('projects', [])
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)

  const projectVisas = projectId
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleCreateNewVisa = () => {
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
    setSelectedVisa(newVisa)
    setActiveTab('new')
    toast.success('Nueva solicitud de visado creada')
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
      setSelectedVisa(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const handleAddDocuments = (visaId: string, documents: VisaDocument[]) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return
    const updatedDocuments = [...visa.documents, ...documents]
    toast.success(`${documents.length} documento(s) añadido(s)`)
    handleUpdateVisa(visaId, { documents: updatedDocuments })
  }

  const handleSubmitToBoard = () => {
    if (!selectedVisa) return
    const visa = selectedVisa

    const requiredDocs = visa.documents.filter(d => d.isRequired)
    const missingDocs = requiredDocs.filter(d => !d.name || d.fileSize === 0)
    
    if (missingDocs.length > 0) {
      toast.error('Faltan documentos obligatorios', {
        description: 'Por favor, suba todos los documentos requeridos antes de presentar'
      })
      return
    }

    const invalidDocs = visa.documents.filter(d => !d.isValid && d.validationErrors.length > 0)
    if (invalidDocs.length > 0) {
      toast.error('Hay documentos con errores de validación', {
        description: `${invalidDocs.length} documento(s) necesita(n) ser corregido(s)`
      })
      return
    }

    handleUpdateVisa(visa.id, {
      status: 'submitted',
      submittedAt: Date.now()
    })
    toast.success('Solicitud presentada correctamente', {
      description: 'Recibirá una notificación cuando el colegio revise su solicitud'
    })
  }

  const getStatusBadgeClass = (status: VisaStatus) => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/20 text-gray-600',
      'pending-submission': 'bg-yellow-500/20 text-yellow-600',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-purple-500/20 text-purple-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-amber-500/20 text-amber-600',
      'pending-pickup': 'bg-teal-500/20 text-teal-600',
      'approved': 'bg-green-500/20 text-green-600',
      'rejected': 'bg-red-500/20 text-red-600'
    }
    return classes[status] || 'bg-gray-500/20 text-gray-600'
  }

  const calculateCompletionPercentage = (visa: VisaApplication) => {
    if (!visa.documents.length) return 0
    const requiredDocs = visa.documents.filter(d => d.isRequired)
    const uploadedRequired = requiredDocs.filter(req => 
      req.fileSize > 0 && req.isValid
    ).length
    return requiredDocs.length > 0 ? (uploadedRequired / requiredDocs.length) * 100 : 0
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Gestión de Visados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Stamp size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle>Gestión de Visados de Colegio</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gestione las solicitudes de visado ante los colegios profesionales
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="overview" className="gap-2">
              <FileText size={16} />
              Vista General
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2" disabled={!selectedVisa}>
              <Plus size={16} />
              Nueva Solicitud
            </TabsTrigger>
            <TabsTrigger value="tracking" className="gap-2" disabled={!selectedVisa}>
              <Stamp size={16} />
              Seguimiento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            <div className="pt-4 space-y-4">
              {projectVisas.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <Stamp size={48} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No hay solicitudes de visado</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Cree una nueva solicitud para iniciar el proceso de visado ante el colegio profesional
                  </p>
                  <Button onClick={handleCreateNewVisa} className="gap-2">
                    <Upload size={18} />
                    Crear Solicitud
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Solicitudes de Visado</h3>
                    <Button onClick={handleCreateNewVisa} className="gap-2">
                      <Plus size={18} />
                      Nueva Solicitud
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {projectVisas.map(visa => (
                      <Card 
                        key={visa.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => {
                          setSelectedVisa(visa)
                          setActiveTab('tracking')
                        }}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-base">
                                {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                Fases: {visa.phases.join(', ') || 'Sin fases'}
                              </p>
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
                                Documentos: {visa.documents.filter(d => d.fileSize > 0).length} / {visa.documents.filter(d => d.isRequired).length} requeridos
                              </span>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {calculateCompletionPercentage(visa).toFixed(0)}% completado
                                </div>
                              </div>
                            </div>
                            <Progress value={calculateCompletionPercentage(visa)} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            {selectedVisa && (
              <div className="pt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Nueva Solicitud de Visado</h3>
                    <p className="text-sm text-muted-foreground">
                      {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Estado: {VISA_STATUS_LABELS[selectedVisa.status]}
                    </span>
                    {selectedVisa.status === 'pending-submission' && (
                      <Button
                        onClick={() => handleSubmitToBoard()}
                      >
                        Presentar al Colegio
                      </Button>
                    )}
                    {selectedVisa.status === 'draft' && (
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateVisa(selectedVisa.id, { status: 'pending-submission' })}
                      >
                        Marcar Listo para Presentar
                      </Button>
                    )}
                  </div>
                </div>
                <Tabs defaultValue="documents">
                  <TabsList>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
                    <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
                  </TabsList>
                  <TabsContent value="documents">
                    <DocumentValidationPanel
                      visa={selectedVisa}
                      onDocumentUpload={(docs) => handleAddDocuments(selectedVisa.id, docs)}
                      onUpdateVisa={(updates) => handleUpdateVisa(selectedVisa.id, updates)}
                    />
                  </TabsContent>
                  <TabsContent value="tracking">
                    <PermitStatusTracker
                      visa={selectedVisa}
                      onUpdateStatus={(status) => handleUpdateVisa(selectedVisa.id, { status })}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracking" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            {selectedVisa && (
              <div className="pt-4">
                <PermitStatusTracker
                  visa={selectedVisa}
                  onUpdateStatus={(status) => handleUpdateVisa(selectedVisa.id, { status })}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
