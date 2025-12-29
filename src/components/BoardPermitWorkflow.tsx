import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  VisaApplication,
  VisaStatus,
  VISA_STATUS_LABELS,
  Project,
  VISA_DOCUMENT_TYPE_LABELS,
  VisaDocument,
  PROFESSIONAL_COLLEGE_LABELS,
  ProfessionalCollege
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VisaApplicationDialog } from '@/components/VisaApplicationDialog'
import { Stamp, Plus, FileText, ClockCounterClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'tracking'>('overview')
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [projects] = useKV<Project[]>('projects', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)

  const currentProject = projectId ? (projects || []).find(p => p.id === projectId) : undefined
  const filteredApplications = projectId 
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleCreateApplication = () => {
    setSelectedVisa(null)
    setApplicationDialogOpen(true)
    setActiveTab('new')
  }

  const handleSaveVisa = (visaData: Partial<VisaApplication>) => {
    if (visaData.id) {
      handleUpdateVisa(visaData.id, visaData)
      toast.success('Solicitud actualizada correctamente')
    } else {
      const newVisa: VisaApplication = {
        id: Date.now().toString(),
        projectId: projectId || visaData.projectId!,
        college: visaData.college!,
        status: 'draft',
        phases: visaData.phases || [],
        documents: visaData.documents || [],
        requirements: visaData.requirements || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...visaData
      }
      setVisaApplications(current => [...(current || []), newVisa])
      toast.success('Solicitud creada correctamente')
    }
    setApplicationDialogOpen(false)
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(currentVisa =>
      (currentVisa || []).map(v =>
        v.id === visaId
          ? { ...v, ...updates, updatedAt: Date.now() }
          : v
      )
    )
    if (selectedVisa?.id === visaId) {
      setSelectedVisa(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null)
    }
  }

  const handleAddDocument = (visaId: string, document: VisaDocument) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return
    
    const updatedDocuments = [...visa.documents, document]
    handleUpdateVisa(visaId, { documents: updatedDocuments })
  }

  const handleSubmitForReview = () => {
    if (!selectedVisa) return

    const missingDocs = selectedVisa.documents.filter(d => d.isRequired && !d.documentId)
    if (missingDocs.length > 0) {
      toast.error('Documentos requeridos faltantes', {
        description: 'Por favor, sube todos los documentos obligatorios antes de presentar'
      })
      return
    }

    const invalidDocs = selectedVisa.documents.filter(d => !d.isValid && d.validationErrors.length > 0)
    if (invalidDocs.length > 0) {
      toast.error('Documentos con errores de validación', {
        description: `${invalidDocs.length} documento(s) tienen errores que deben corregirse`
      })
      return
    }

    handleUpdateVisa(selectedVisa.id, {
      status: 'pending-submission',
      submittedAt: Date.now()
    })

    toast.success('Solicitud lista para presentar', {
      description: 'Recibirá una notificación cuando el colegio la revise'
    })
  }

  const getStatusBadgeClass = (status: VisaStatus) => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/20 text-gray-600',
      'pending-submission': 'bg-yellow-500/20 text-yellow-600',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-purple-500/20 text-purple-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-yellow-500/20 text-yellow-600',
      'pending-pickup': 'bg-cyan-500/20 text-cyan-600',
      'approved': 'bg-green-500/20 text-green-600',
      'rejected': 'bg-red-500/20 text-red-600'
    }
    return classes[status] || 'bg-gray-500/20 text-gray-600'
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Visados
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Stamp size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle>Gestión de Visados Colegiales</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona las solicitudes de visado profesional ante colegios oficiales
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="gap-2">
                <FileText size={16} />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="new" className="gap-2">
                <Plus size={16} />
                Nueva Solicitud
              </TabsTrigger>
              <TabsTrigger value="tracking" className="gap-2">
                <ClockCounterClockwise size={16} />
                Seguimiento
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            <div className="pt-4 space-y-4">
              {filteredApplications.length === 0 ? (
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
                    Crear solicitudes de visado para tus proyectos
                  </p>
                  <Button onClick={handleCreateApplication} className="gap-2">
                    <Plus size={18} />
                    Crear Solicitud
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">Solicitudes Activas</h3>
                      <p className="text-sm text-muted-foreground">
                        {filteredApplications.filter(v => v.status === 'approved').length} de {filteredApplications.length} completados
                      </p>
                    </div>
                    <Button onClick={handleCreateApplication} className="gap-2">
                      <Plus size={18} />
                      Nueva Solicitud
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {filteredApplications.map(visa => {
                      const project = (projects || []).find(p => p.id === visa.projectId)
                      return (
                        <Card
                          key={visa.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            setSelectedVisa(visa)
                            setActiveTab('tracking')
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-base">
                                  {project?.title || 'Proyecto sin título'}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college as ProfessionalCollege]}
                                </p>
                              </div>
                              <Badge className={getStatusBadgeClass(visa.status)}>
                                {VISA_STATUS_LABELS[visa.status]}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Documentos:</span>
                                <span className="font-medium">
                                  {visa.documents.filter(d => d.documentId).length} / {visa.documents.filter(d => d.isRequired).length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Fases:</span>
                                <span className="font-medium">{visa.phases.length}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="new" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            <div className="pt-4">
              <VisaApplicationDialog
                open={applicationDialogOpen}
                onOpenChange={setApplicationDialogOpen}
                visa={selectedVisa || undefined}
                project={currentProject}
                onSave={handleSaveVisa}
              />
              {!applicationDialogOpen && (
                <div className="text-center py-12">
                  <Button onClick={() => setApplicationDialogOpen(true)} size="lg" className="gap-2">
                    <Plus size={20} />
                    Crear Nueva Solicitud
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="flex-1 overflow-y-auto px-6 pb-6 mt-0">
            {selectedVisa ? (
              <div className="pt-4 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {(projects || []).find(p => p.id === selectedVisa.projectId)?.title || 'Proyecto'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Estado: {VISA_STATUS_LABELS[selectedVisa.status]}
                    </p>
                  </div>
                  {selectedVisa.status === 'draft' && (
                    <Button
                      onClick={handleSubmitForReview}
                      className="gap-2"
                    >
                      Presentar Solicitud
                    </Button>
                  )}
                  {selectedVisa.status === 'pending-submission' && (
                    <Button
                      onClick={() => handleUpdateVisa(selectedVisa.id, { status: 'submitted' })}
                      className="gap-2"
                    >
                      Marcar Listo para Presentar
                    </Button>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Información de la Solicitud</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Colegio</p>
                        <p className="font-medium">{PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college as ProfessionalCollege]}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Número de Solicitud</p>
                        <p className="font-medium">{selectedVisa.applicationNumber || 'Pendiente'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Documentos</p>
                        <p className="font-medium">
                          {selectedVisa.documents.filter(d => d.documentId).length} de {selectedVisa.documents.filter(d => d.isRequired).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tasa Estimada</p>
                        <p className="font-medium">{selectedVisa.estimatedFee ? `${selectedVisa.estimatedFee.toFixed(2)} €` : 'No calculada'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentos Adjuntos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedVisa.documents.length > 0 ? (
                        selectedVisa.documents.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{VISA_DOCUMENT_TYPE_LABELS[doc.type]}</p>
                              <p className="text-xs text-muted-foreground">{doc.name}</p>
                            </div>
                            <Badge variant={doc.isValid ? 'default' : 'destructive'}>
                              {doc.isValid ? 'Válido' : 'Errores'}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No hay documentos adjuntos
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="pt-12 text-center">
                <p className="text-muted-foreground">Selecciona una solicitud para ver su seguimiento</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
