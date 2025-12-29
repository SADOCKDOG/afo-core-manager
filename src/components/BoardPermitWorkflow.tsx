import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  VisaApplication,
  VisaStatus,
  VISA_STATUS_LABELS,
  VISA_DOCUMENT_TYPE_LABELS,
  PROFESSIONAL_COLLEGE_LABELS,
  ProfessionalCollege,
  VisaDocument
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VisaApplicationDialog } from '@/components/VisaApplicationDialog'
import { Stamp, Plus, CheckCircle, Warning, ClockCounterClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface BoardPermitWorkflowProps {
  projectId?: string
}

export function BoardPermitWorkflow({ projectId }: BoardPermitWorkflowProps) {
  const [open, setOpen] = useState(false)
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [applicationDialogOpen, setApplicationDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'pending' | 'completed'>('overview')

  const filteredApplications = projectId
    ? (visaApplications || []).filter(v => v.projectId === projectId)
    : (visaApplications || [])

  const handleCreateApplication = () => {
    setSelectedVisa(null)
    setApplicationDialogOpen(true)
  }

  const handleSaveVisa = (visaData: Partial<VisaApplication>) => {
    if (visaData.id) {
      handleUpdateVisa(visaData.id, visaData)
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
        updatedAt: Date.now(),
      }
      
      setVisaApplications(currentVisas => [...(currentVisas || []), newVisa])
      toast.success('Solicitud de visado creada')
    }
  }

  const handleUpdateVisa = (visaId: string, updates: Partial<VisaApplication>) => {
    setVisaApplications(currentVisas =>
      (currentVisas || []).map(v =>
        v.id === visaId
          ? { ...v, ...updates, updatedAt: Date.now() }
          : v
      )
    )
    
    if (selectedVisa?.id === visaId) {
      setSelectedVisa(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null)
    }
  }

  const handleAddDocument = (document: VisaDocument) => {
    if (!selectedVisa) return
    const updatedDocuments = [...selectedVisa.documents, document]
    handleUpdateVisa(selectedVisa.id, { documents: updatedDocuments })
  }

  const handleValidateAndSubmit = () => {
    if (!selectedVisa) return

    const requiredDocs = selectedVisa.documents.filter(d => d.isRequired)
    const missingDocs = requiredDocs.filter(d => !d.name)

    if (missingDocs.length > 0) {
      toast.error('Documentos obligatorios faltantes', {
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
    })

    toast.success('Solicitud lista para presentar', {
      description: 'Todos los documentos han sido validados correctamente'
    })
  }

  const getStatusBadgeClass = (status: VisaStatus): string => {
    const classes: Record<VisaStatus, string> = {
      'draft': 'bg-gray-500/20 text-gray-600',
      'pending-submission': 'bg-yellow-500/20 text-yellow-600',
      'submitted': 'bg-blue-500/20 text-blue-600',
      'under-review': 'bg-purple-500/20 text-purple-600',
      'required': 'bg-orange-500/20 text-orange-600',
      'pending-payment': 'bg-amber-500/20 text-amber-600',
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
          Visados
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Gestión de Visados Colegiales</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gestiona las solicitudes de visado con validación de documentación
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="overview">
                Todas
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes
              </TabsTrigger>
              <TabsTrigger value="completed">
                <ClockCounterClockwise size={16} className="mr-2" />
                Completadas
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
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
                    <p className="text-sm text-muted-foreground mb-4">
                      Crea tu primera solicitud de visado colegial
                    </p>
                    <Button onClick={handleCreateApplication} className="gap-2">
                      <Plus size={18} />
                      Nueva Solicitud
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        Solicitudes ({filteredApplications.length})
                      </h3>
                      <Button onClick={handleCreateApplication} size="sm" className="gap-2">
                        <Plus size={16} />
                        Nueva
                      </Button>
                    </div>

                    {filteredApplications.map(visa => {
                      const validDocsCount = visa.documents.filter(d => d.isValid).length
                      const totalDocsCount = visa.documents.length
                      
                      return (
                        <Card
                          key={visa.id}
                          className="cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => {
                            setSelectedVisa(visa)
                          }}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">
                                  {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {visa.applicationNumber || 'Sin número de solicitud'}
                                </p>
                              </div>
                              <Badge className={getStatusBadgeClass(visa.status)}>
                                {VISA_STATUS_LABELS[visa.status]}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Documentos:</span>
                              <span className="font-medium">
                                {validDocsCount}/{totalDocsCount} validados
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Fases:</span>
                              <span className="font-medium">{visa.phases.length}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="border-l pl-6">
                {!applicationDialogOpen && filteredApplications.length > 0 && (
                  <Button onClick={() => setApplicationDialogOpen(true)} className="mb-4 w-full">
                    Crear Nueva Solicitud
                  </Button>
                )}

                {selectedVisa ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Detalles de Solicitud</h3>
                      <Badge className={getStatusBadgeClass(selectedVisa.status)}>
                        {VISA_STATUS_LABELS[selectedVisa.status]}
                      </Badge>
                    </div>

                    {selectedVisa.status === 'draft' && (
                      <Button
                        onClick={handleValidateAndSubmit}
                        className="w-full gap-2"
                        variant="default"
                      >
                        <CheckCircle size={18} />
                        Validar y Marcar Lista
                      </Button>
                    )}

                    {selectedVisa.status === 'pending-submission' && (
                      <Button
                        className="w-full gap-2"
                        variant="default"
                      >
                        <CheckCircle size={18} />
                        Presentar Solicitud
                      </Button>
                    )}

                    {selectedVisa.status !== 'draft' && selectedVisa.status !== 'pending-submission' && (
                      <Button
                        className="w-full gap-2"
                        variant="outline"
                        disabled
                      >
                        Marcar Listo para Presentar
                      </Button>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Información General</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Colegio</p>
                            <p className="text-sm font-medium">
                              {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">N° Solicitud</p>
                            <p className="text-sm font-medium">
                              {selectedVisa.applicationNumber || 'Pendiente'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tasa Estimada</p>
                            <p className="text-sm font-medium">
                              {selectedVisa.estimatedFee
                                ? `${selectedVisa.estimatedFee.toFixed(2)} €`
                                : 'No calculada'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fases</p>
                            <p className="text-sm font-medium">{selectedVisa.phases.length}</p>
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
                          {selectedVisa.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2 rounded border">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {VISA_DOCUMENT_TYPE_LABELS[doc.type]}
                                </p>
                                {doc.validationErrors.length > 0 && (
                                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <Warning size={12} />
                                    {doc.validationErrors[0]}
                                  </p>
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
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Selecciona una solicitud para ver sus detalles
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <p className="text-muted-foreground text-center py-8">
              Solicitudes pendientes de revisión o presentación
            </p>
          </TabsContent>

          <TabsContent value="completed">
            <p className="text-muted-foreground text-center py-8">
              Solicitudes aprobadas o completadas
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <VisaApplicationDialog
        open={applicationDialogOpen}
        onOpenChange={setApplicationDialogOpen}
        onSave={handleSaveVisa}
        visa={selectedVisa || undefined}
      />
    </Dialog>
  )
}
