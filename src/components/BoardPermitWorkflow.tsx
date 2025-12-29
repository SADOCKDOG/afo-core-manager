import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  VisaApplication,
  Project,
  VisaStatus,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  VisaDocument
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Stamp, Plus, CheckCircle, WarningCircle, FileText, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { validateDocument, canSubmitVisa } from '@/lib/visa-utils'
import { VisaApplicationDialog } from './VisaApplicationDialog'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [projects] = useKV<Project[]>('projects', [])
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all')
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)

  const filteredApplications = projectId
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const pendingApplications = filteredApplications.filter(v => 
    v.status !== 'approved' && v.status !== 'rejected'
  )
  const completedApplications = filteredApplications.filter(v => 
    v.status === 'approved' || v.status === 'rejected'
  )

  const handleCreateApplication = () => {
    setSelectedVisa(null)
    setApplicationDialogOpen(true)
  }

  const handleSaveVisa = (visaData: Partial<VisaApplication>) => {
    setVisaApplications(currentList => {
      const visasList = currentList || []
      if (visaData.id) {
        const updated = visasList.map(v => 
          v.id === visaData.id 
            ? { ...v, ...visaData, updatedAt: Date.now() } as VisaApplication
            : v
        )
        toast.success('Solicitud de visado actualizada')
        return updated
      } else {
        const newVisa: VisaApplication = {
          ...visaData,
          id: Date.now().toString(),
          projectId: visaData.projectId || projectId || '',
          status: visaData.status || 'draft',
          documents: visaData.documents || [],
          requirements: visaData.requirements || [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        } as VisaApplication
        toast.success('Solicitud de visado creada')
        return [...visasList, newVisa]
      }
    })
    setApplicationDialogOpen(false)
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(currentList =>
      (currentList || []).map(v => 
        v.id === visaId ? { ...v, ...updates, updatedAt: Date.now() } : v
      )
    )
  }

  const handleAddDocument = (document: VisaDocument) => {
    if (!selectedVisa) return
    const updatedDocuments = [...selectedVisa.documents, document]
    handleUpdateVisa(selectedVisa.id, { documents: updatedDocuments })
    setSelectedVisa({ ...selectedVisa, documents: updatedDocuments })
  }

  const handleValidateAndSubmit = () => {
    if (!selectedVisa) return

    const requiredDocs = Object.keys(VISA_DOCUMENT_TYPE_LABELS)
    const missingDocs = requiredDocs.filter(
      type => !selectedVisa.documents.find(d => d.type === type && d.isRequired)
    )

    if (missingDocs.length > 0) {
      toast.error('Faltan documentos requeridos', {
        description: `Necesitas adjuntar: ${missingDocs.slice(0, 3).join(', ')}`
      })
      return
    }

    const invalidDocs = selectedVisa.documents.filter(d => !d.isValid)
    if (invalidDocs.length > 0) {
      toast.error('Hay documentos con errores de validación', {
        description: `Revisa los ${invalidDocs.length} documento(s) con errores`
      })
      return
    }

    if (!canSubmitVisa(selectedVisa)) {
      toast.error('La solicitud no cumple los requisitos mínimos')
      return
    }

    handleUpdateVisa(selectedVisa.id, {
      status: 'submitted',
      submittedAt: Date.now()
    })

    toast.success('Solicitud presentada correctamente', {
      description: 'La solicitud está lista para tramitarse en el colegio'
    })
  }

  const getStatusBadgeClass = (status: VisaStatus): string => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/20 text-gray-700 border-gray-300',
      'pending-submission': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      'submitted': 'bg-blue-500/20 text-blue-700 border-blue-300',
      'under-review': 'bg-indigo-500/20 text-indigo-700 border-indigo-300',
      'required': 'bg-orange-500/20 text-orange-600 border-orange-300',
      'pending-payment': 'bg-amber-500/20 text-amber-700 border-amber-300',
      'pending-pickup': 'bg-teal-500/20 text-teal-700 border-teal-300',
      'approved': 'bg-green-500/20 text-green-700 border-green-300',
      'rejected': 'bg-red-500/20 text-red-700 border-red-300'
    }
    return classes[status] || classes.draft
  }

  const getStatusIcon = (status: VisaStatus) => {
    if (status === 'approved') {
      return <CheckCircle size={20} weight="fill" className="text-green-600" />
    }
    if (status === 'rejected' || status === 'required') {
      return <WarningCircle size={20} weight="fill" className="text-destructive" />
    }
    return <Clock size={20} className="text-muted-foreground" />
  }

  const displayApplications = activeTab === 'all' 
    ? filteredApplications 
    : activeTab === 'pending' 
      ? pendingApplications 
      : completedApplications

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Visados Colegiales
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Stamp size={28} weight="duotone" className="text-primary" />
            Flujo de Tramitación de Visados
          </DialogTitle>
          <DialogDescription>
            Gestión profesional del proceso de visado colegial con validación de documentación
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">
                Todas ({filteredApplications.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completadas ({completedApplications.length})
              </TabsTrigger>
            </TabsList>
            <Button onClick={handleCreateApplication} className="gap-2">
              <Plus size={18} weight="bold" />
              Nueva Solicitud
            </Button>
          </div>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {displayApplications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Stamp size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No hay solicitudes</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Comienza creando una nueva solicitud de visado colegial
                </p>
                <Button onClick={handleCreateApplication} className="gap-2">
                  <Plus size={16} />
                  Crear Primera Solicitud
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-4">
                {displayApplications.map((visa, index) => {
                  const project = (projects || []).find(p => p.id === visa.projectId)
                  const validationProgress = visa.documents.length > 0
                    ? (visa.documents.filter(d => d.isValid).length / visa.documents.length) * 100
                    : 0

                  return (
                    <motion.div
                      key={visa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(visa.status)}
                              <div>
                                <h4 className="font-semibold">
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                </h4>
                                {project && (
                                  <p className="text-sm text-muted-foreground">{project.title}</p>
                                )}
                                {visa.applicationNumber && (
                                  <p className="text-xs text-muted-foreground">
                                    Expediente: {visa.applicationNumber}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className={getStatusBadgeClass(visa.status)}>
                                {VISA_STATUS_LABELS[visa.status]}
                              </Badge>
                              {visa.phases.map(phase => (
                                <Badge key={phase} variant="secondary">
                                  {phase.replace('-', ' ').toUpperCase()}
                                </Badge>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Validación de documentos</span>
                                <span className="font-medium">{validationProgress.toFixed(0)}%</span>
                              </div>
                              <Progress value={validationProgress} className="h-2" />
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <FileText size={16} />
                                <span>{visa.documents.length} documentos</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle size={16} />
                                <span>
                                  {visa.documents.filter(d => d.isValid).length} validados
                                </span>
                              </div>
                              {visa.estimatedFee && (
                                <div>Tasa: {visa.estimatedFee.toFixed(2)}€</div>
                              )}
                            </div>

                            {visa.status === 'required' && visa.rejectionReasons && (
                              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <p className="text-sm font-medium text-destructive mb-1">
                                  Requerimientos pendientes:
                                </p>
                                <ul className="text-sm text-destructive list-disc list-inside">
                                  {visa.rejectionReasons.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVisa(visa)
                                setApplicationDialogOpen(true)
                              }}
                            >
                              Ver Detalles
                            </Button>
                            {visa.status === 'draft' && canSubmitVisa(visa) && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedVisa(visa)
                                  handleValidateAndSubmit()
                                }}
                              >
                                Presentar
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>

      <VisaApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
        visa={selectedVisa || undefined}
        onSave={handleSaveVisa}
      />
    </Dialog>
  )
}
