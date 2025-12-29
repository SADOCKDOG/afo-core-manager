import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Project,
  VisaApplication,
  VisaStatus,
  VISA_STATUS_LABELS,
  VisaDocument,
  PROFESSIONAL_COLLEGE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Stamp, CheckCircle, Clock, WarningCircle, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [projects] = useKV<Project[]>('projects', [])
  const [open, setOpen] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)

  const filteredApplications = projectId
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const pendingApplications = filteredApplications.filter(v => 
    v.status !== 'approved' && v.status !== 'rejected'
  )

  const completedApplications = filteredApplications.filter(v => 
    v.status === 'approved' || v.status === 'rejected'
  )

  const handleClose = () => {
    setOpen(false)
    setSelectedVisa(null)
  }

  const handleSaveApplication = (visaData: Partial<VisaApplication>) => {
    setVisaApplications(current => {
      const applications = current || []
      if (visaData.id) {
        const updated = applications.map(v => 
          v.id === visaData.id ? { ...v, ...visaData, updatedAt: Date.now() } : v
        )
        toast.success('Solicitud de visado actualizada')
        return updated
      } else {
        const newVisa: VisaApplication = {
          id: Date.now().toString(),
          projectId: visaData.projectId || '',
          college: visaData.college!,
          phases: visaData.phases || [],
          status: 'draft',
          documents: [],
          requirements: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        toast.success('Solicitud de visado creada')
        return [...applications, newVisa]
      }
    })
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(current => 
      (current || []).map(v => 
        v.id === visaId ? { ...v, ...updates, updatedAt: Date.now() } : v
      )
    )
  }

  const handleDocumentUpload = (doc: VisaDocument) => {
    if (!selectedVisa) return
    setSelectedVisa({ ...selectedVisa, documents: [...selectedVisa.documents, doc] })
  }

  const handleSubmitVisa = () => {
    if (!selectedVisa) return

    const requiredDocs = selectedVisa.documents.filter(d => d.isRequired)
    if (requiredDocs.some(d => !d.isValid)) {
      toast.error('Documentos inválidos', {
        description: 'Algunos documentos requeridos no cumplen los requisitos'
      })
      return
    }

    const invalidDocs = selectedVisa.documents.filter(d => !d.isValid)
    if (invalidDocs.length > 0) {
      toast.error('Documentos inválidos', {
        description: 'Corrige los errores en los documentos antes de enviar'
      })
      return
    }

    if (selectedVisa.requirements.some(r => !r.isMet)) {
      toast.error('No se puede presentar', {
        description: 'Completa todos los requisitos obligatorios'
      })
      return
    }

    handleUpdateVisa(selectedVisa.id, {
      status: 'submitted',
      submittedAt: Date.now()
    })

    toast.success('Solicitud presentada', {
      description: 'Se ha registrado correctamente la presentación'
    })
  }

  const getStatusColor = (status: VisaStatus): string => {
    const colors: Record<VisaStatus, string> = {
      'draft': 'bg-muted text-muted-foreground border-muted',
      'pending-submission': 'bg-muted text-muted-foreground border-muted',
      'submitted': 'bg-blue-500/20 text-blue-700 border-blue-500/50',
      'under-review': 'bg-blue-500/20 text-blue-700 border-blue-500/50',
      'required': 'bg-orange-500/20 text-orange-700 border-orange-500/50',
      'pending-payment': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/50',
      'pending-pickup': 'bg-purple-500/20 text-purple-700 border-purple-500/50',
      'approved': 'bg-green-500/20 text-green-700 border-green-500/50',
      'rejected': 'bg-red-500/20 text-red-700 border-red-500/50'
    }
    return colors[status]
  }

  const getStatusIcon = (status: VisaStatus) => {
    if (status === 'approved') {
      return <CheckCircle size={16} weight="fill" className="text-green-600" />
    }
    if (status === 'rejected' || status === 'required') {
      return <WarningCircle size={16} weight="fill" className="text-orange-600" />
    }
    return <Clock size={16} weight="fill" className="text-blue-600" />
  }

  const getProject = (projectId: string) => {
    return (projects || []).find(p => p.id === projectId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Gestión de Visados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stamp size={24} weight="duotone" />
            Gestión de Visados Colegiales
          </DialogTitle>
          <DialogDescription>
            Gestiona la presentación de proyectos para visado profesional
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="pending" className="mt-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pendientes ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completados ({completedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingApplications.length > 0 ? (
              <div className="grid gap-4">
                {pendingApplications.map((visa) => {
                  const project = getProject(visa.projectId)
                  const completionPercentage = visa.requirements.length > 0
                    ? (visa.requirements.filter(r => r.isMet).length / visa.requirements.length) * 100
                    : 0

                  return (
                    <Card key={visa.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {project?.title || 'Sin proyecto asignado'}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(visa.status)}>
                              {getStatusIcon(visa.status)}
                              <span className="ml-1">{VISA_STATUS_LABELS[visa.status]}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{PROFESSIONAL_COLLEGE_LABELS[visa.college]}</span>
                            <span>•</span>
                            <span>{visa.phases.length} fases</span>
                            <span>•</span>
                            <span>{visa.documents.length} documentos</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso de requisitos</span>
                          <span className="font-medium">{Math.round(completionPercentage)}%</span>
                        </div>
                        <Progress value={completionPercentage} className="h-2" />
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <Stamp size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
                <p className="text-muted-foreground mb-4">No hay solicitudes pendientes</p>
                <Button variant="outline" className="gap-2">
                  <Plus size={18} />
                  Nueva Solicitud
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedApplications.length > 0 ? (
              <div className="grid gap-4">
                {completedApplications.map((visa) => {
                  const project = getProject(visa.projectId)

                  return (
                    <Card key={visa.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">
                              {project?.title || 'Sin proyecto asignado'}
                            </h4>
                            <Badge variant="outline" className={getStatusColor(visa.status)}>
                              {getStatusIcon(visa.status)}
                              <span className="ml-1">{VISA_STATUS_LABELS[visa.status]}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{PROFESSIONAL_COLLEGE_LABELS[visa.college]}</span>
                            {visa.applicationNumber && (
                              <>
                                <span>•</span>
                                <span>N° {visa.applicationNumber}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <CheckCircle size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
                <p className="text-muted-foreground">No hay solicitudes completadas</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
