import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  VisaApplication,
  VisaStatus,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  Project
} from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisaApplicationDialog } from '@/components/VisaApplicationDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Stamp, Plus, CheckCircle, Warning, FileText, PaperPlaneTilt } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { validateDocument, canSubmitVisa } from '@/lib/visa-utils'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [projects] = useKV<Project[]>('projects', [])
  const [open, setOpen] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'completed'>('overview')

  const filteredApplications = projectId 
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleNewApplication = () => {
    setSelectedVisa(null)
    setApplicationDialogOpen(true)
  }

  const handleSaveApplication = (visaData: Partial<VisaApplication>) => {
    setVisaApplications(currentVisas => {
      const visasList = currentVisas || []
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
          college: visaData.college!,
          status: visaData.status || 'draft',
          phases: visaData.phases || [],
          documents: visaData.documents || [],
          requirements: visaData.requirements || [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        } as VisaApplication
        toast.success('Solicitud de visado creada')
        return [...visasList, newVisa]
      }
    })
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(currentVisas => 
      (currentVisas || []).map(v => 
        v.id === visaId ? { ...v, ...updates, updatedAt: Date.now() } as VisaApplication : v
      )
    )
    setSelectedVisa(prev => prev ? { ...prev, ...updates } as VisaApplication : null)
  }

  const handleAddDocument = (document: any) => {
    if (!selectedVisa) return
    const updatedDocuments = [...selectedVisa.documents, document]
    handleUpdateVisa(selectedVisa.id, { documents: updatedDocuments })
  }

  const handleValidateAndSubmit = () => {
    if (!selectedVisa) return

    const requiredDocs = selectedVisa.documents.filter(d => d.isRequired)
    const missingDocs = requiredDocs.filter(d => !d.isValid)
    
    if (missingDocs.length > 0) {
      toast.error('Documentos incompletos', {
        description: 'Por favor, sube todos los documentos requeridos antes de presentar'
      })
      return
    }

    const invalidDocs = selectedVisa.documents.filter(d => !d.isValid && d.validationErrors.length > 0)
    if (invalidDocs.length > 0) {
      toast.error('Documentos con errores', {
        description: `${invalidDocs.length} documento(s) tienen errores de validación`
      })
      return
    }

    if (!canSubmitVisa(selectedVisa)) {
      toast.error('La solicitud no cumple los requisitos para ser presentada')
      return
    }

    handleUpdateVisa(selectedVisa.id, {
      status: 'pending-submission',
      submittedAt: Date.now()
    })
    
    toast.success('Solicitud preparada para presentación', {
      description: 'La solicitud está lista para ser presentada en el colegio profesional'
    })
  }

  const getStatusBadgeClass = (status: VisaStatus) => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/20 text-gray-600',
      'pending-submission': 'bg-yellow-500/20 text-yellow-600',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-indigo-500/20 text-indigo-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-purple-500/20 text-purple-600',
      'pending-pickup': 'bg-teal-500/20 text-teal-600',
      'approved': 'bg-green-500/20 text-green-600',
      'rejected': 'bg-red-500/20 text-red-600',
    }
    return classes[status] || ''
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Visados Colegiales
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Gestión de Visados Colegiales</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              Todas ({filteredApplications.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendientes ({filteredApplications.filter(v => ['draft', 'pending-submission', 'submitted', 'under-review'].includes(v.status)).length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completadas ({filteredApplications.filter(v => ['approved', 'rejected'].includes(v.status)).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stamp size={48} className="text-muted-foreground" weight="duotone" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold mb-2">No hay solicitudes de visado</h3>
                <p className="text-muted-foreground mb-6">
                  Crea una nueva solicitud para iniciar el proceso de visado colegial
                </p>
                <Button onClick={handleNewApplication} className="gap-2">
                  <Plus size={16} />
                  Nueva Solicitud
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold">
                    Solicitudes de Visado
                  </h3>
                  <Button onClick={handleNewApplication} size="sm" className="gap-2">
                    <Plus size={16} />
                    Nueva Solicitud
                  </Button>
                </div>

                <div className="space-y-3">
                  {filteredApplications.map((visa) => {
                    const project = (projects || []).find(p => p.id === visa.projectId)
                    const validDocsCount = visa.documents.filter(d => d.isValid).length
                    
                    return (
                      <Card
                        key={visa.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setSelectedVisa(visa)
                          setApplicationDialogOpen(true)
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className="text-base">
                                {project?.title || 'Proyecto sin asignar'}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                              </p>
                            </div>
                            <Badge className={getStatusBadgeClass(visa.status)}>
                              {VISA_STATUS_LABELS[visa.status]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-muted-foreground" />
                              <span className="text-muted-foreground">Documentos:</span>
                              <span className="font-medium">
                                {validDocsCount}/{visa.documents.length}
                              </span>
                            </div>
                            {visa.estimatedFee && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Tasa estimada:</span>
                                <span className="font-medium">{visa.estimatedFee.toFixed(2)}€</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {!applicationDialogOpen && selectedVisa && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      Detalle de Solicitud
                    </CardTitle>
                    <Badge className={getStatusBadgeClass(selectedVisa.status)}>
                      {VISA_STATUS_LABELS[selectedVisa.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    {selectedVisa.status === 'draft' && (
                      <Button
                        onClick={handleValidateAndSubmit}
                        className="w-full gap-2"
                      >
                        <PaperPlaneTilt size={18} />
                        Presentar Solicitud
                      </Button>
                    )}
                    {selectedVisa.status !== 'draft' && selectedVisa.status !== 'pending-submission' && (
                      <Button variant="outline" className="w-full" disabled>
                        {VISA_STATUS_LABELS[selectedVisa.status]}
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Información General</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Colegio</p>
                            <p className="font-medium">{PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fases</p>
                            <p className="font-medium">{selectedVisa.phases.length} fase(s)</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tasa estimada</p>
                            <p className="font-medium">
                              {selectedVisa.estimatedFee 
                                ? `${selectedVisa.estimatedFee.toFixed(2)}€` 
                                : 'No calculada'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Número de aplicación</p>
                            <p className="font-medium">{selectedVisa.applicationNumber || 'Pendiente'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Documentos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedVisa.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <span className="text-sm">{VISA_DOCUMENT_TYPE_LABELS[doc.type]}</span>
                                {doc.validationErrors.length > 0 && (
                                  <Warning size={16} className="text-destructive" />
                                )}
                              </div>
                              <Badge variant={doc.isValid ? 'default' : 'destructive'}>
                                {doc.isValid ? 'Válido' : 'Error'}
                              </Badge>
                            </div>
                          ))}
                          {selectedVisa.documents.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No hay documentos adjuntos
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedVisa.notes && (
                    <div>
                      <p className="text-sm font-medium mb-2">Notas</p>
                      <p className="text-sm text-muted-foreground">{selectedVisa.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            <p className="text-sm text-muted-foreground">
              Solicitudes pendientes de revisión o aprobación
            </p>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            <p className="text-sm text-muted-foreground">
              Solicitudes aprobadas o completadas
            </p>
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
