import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Project,
  VisaApplication,
  VISA_STATUS_LABELS,
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
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all')

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

  const handleSaveApplication = (visaData: Partial<VisaApplication>) => {
    setVisaApplications(currentList => {
      if (visaData.id) {
        const updated = (currentList || []).map(v => 
          v.id === visaData.id 
            ? { ...v, ...visaData, updatedAt: Date.now() } as VisaApplication
            : v
        )
        toast.success('Solicitud de visado actualizada')
        return updated
      } else {
        const newVisa: VisaApplication = {
          id: Date.now().toString(),
          projectId: visaData.projectId!,
          college: visaData.college!,
          status: 'draft',
          phases: visaData.phases || [],
          documents: visaData.documents || [],
          requirements: visaData.requirements || [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        } as VisaApplication
        
        toast.success('Solicitud de visado creada')
        return [...(currentList || []), newVisa]
      }
    })
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
    setSelectedVisa({ ...selectedVisa, documents: updatedDocuments })
    handleUpdateVisa(selectedVisa.id, { documents: updatedDocuments })
  }

  const handleSubmitVisa = () => {
    if (!selectedVisa) return

    const requiredDocs = selectedVisa.documents.filter(d => d.isRequired)
    if (requiredDocs.some(d => !d.isValid)) {
      toast.error('Faltan documentos requeridos o tienen errores', {
        description: 'Revisa la lista de documentos antes de presentar'
      })
      return
    }

    const invalidDocs = selectedVisa.documents.filter(d => !d.isValid)
    if (invalidDocs.length > 0) {
      toast.error('Hay documentos con errores de validación', {
        description: 'Corrige los errores antes de presentar'
      })
      return
    }

    if (!canSubmitVisa(selectedVisa)) {
      toast.error('No se puede presentar el visado', {
        description: 'Faltan requisitos por cumplir'
      })
      return
    }

    handleUpdateVisa(selectedVisa.id, {
      status: 'submitted',
      submittedAt: Date.now()
    })

    toast.success('Visado presentado correctamente', {
      description: 'Se ha registrado la fecha de presentación'
    })
  }

  const getStatusColor = (status: VisaApplication['status']) => {
    const colors: Record<VisaApplication['status'], string> = {
      'draft': 'bg-gray-500/20 text-gray-700 border-gray-300',
      'pending-submission': 'bg-yellow-500/20 text-yellow-700 border-yellow-300',
      'submitted': 'bg-blue-500/20 text-blue-700 border-blue-300',
      'under-review': 'bg-indigo-500/20 text-indigo-700 border-indigo-300',
      'required': 'bg-orange-500/20 text-orange-700 border-orange-300',
      'pending-payment': 'bg-amber-500/20 text-amber-700 border-amber-300',
      'pending-pickup': 'bg-teal-500/20 text-teal-700 border-teal-300',
      'approved': 'bg-green-500/20 text-green-700 border-green-300',
      'rejected': 'bg-red-500/20 text-red-700 border-red-300'
    }
    return colors[status]
  }

  const getStatusIcon = (status: VisaApplication['status']) => {
    if (status === 'approved') {
      return <CheckCircle size={16} weight="fill" className="text-green-600" />
    }
    if (status === 'rejected' || status === 'required') {
      return <WarningCircle size={16} weight="fill" className="text-orange-600" />
    }
    return <Clock size={16} weight="fill" className="text-blue-600" />
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
          Visados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Stamp size={24} weight="duotone" className="text-primary" />
            Flujo de Tramitación de Visados
          </DialogTitle>
          <DialogDescription>
            Gestiona la presentación de visados ante los colegios profesionales
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">
                Todos ({filteredApplications.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                En Curso ({pendingApplications.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Finalizados ({completedApplications.length})
              </TabsTrigger>
            </TabsList>

            <Button onClick={handleCreateApplication} className="gap-2">
              <Plus size={18} weight="bold" />
              Nueva Solicitud
            </Button>
          </div>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {displayApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Stamp size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No hay solicitudes de visado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comienza creando una nueva solicitud de visado colegial
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {displayApplications.map((visa, index) => {
                  const project = (projects || []).find(p => p.id === visa.projectId)
                  const validationPercentage = visa.documents.length > 0
                    ? (visa.documents.filter(d => d.isValid).length / visa.documents.length) * 100
                    : 0

                  return (
                    <motion.div
                      key={visa.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {project?.title || 'Proyecto sin identificar'}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                </p>
                                {visa.applicationNumber && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Expediente: {visa.applicationNumber}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className={getStatusColor(visa.status)}>
                                  {getStatusIcon(visa.status)}
                                  <span className="ml-1">{VISA_STATUS_LABELS[visa.status]}</span>
                                </Badge>
                                {visa.phases.map(phase => (
                                  <Badge key={phase} variant="secondary" className="text-xs">
                                    {phase.replace('-', ' ').toUpperCase()}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground mb-1">Validación</p>
                                <Progress value={validationPercentage} className="h-2" />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {Math.round(validationPercentage)}% completado
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText size={16} className="text-muted-foreground" />
                                <span>{visa.documents.length} documentos</span>
                              </div>
                              {visa.estimatedFee && (
                                <div>
                                  <p className="text-muted-foreground">Tasa estimada</p>
                                  <p className="font-semibold">{visa.estimatedFee.toFixed(2)} €</p>
                                </div>
                              )}
                            </div>

                            {visa.rejectionReasons && visa.rejectionReasons.length > 0 && (
                              <div className="p-3 rounded-lg bg-red-500/10 border border-red-300">
                                <p className="text-sm font-medium text-red-700 mb-1">
                                  Motivos de rechazo:
                                </p>
                                <ul className="text-xs text-red-600 list-disc list-inside">
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
                            {visa.status === 'draft' && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedVisa(visa)
                                  handleSubmitVisa()
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
        onSave={handleSaveApplication}
        visa={selectedVisa || undefined}
      />
    </Dialog>
  )
}
