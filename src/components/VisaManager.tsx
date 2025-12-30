import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { VisaApplication, Project, Invoice, Stakeholder, Client, ArchitectProfile, VISA_STATUS_LABELS, PROFESSIONAL_COLLEGE_LABELS } from '@/lib/types'
import { generateVisaFeeInvoice } from '@/lib/invoice-utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Stamp, FileText, Clock, CheckCircle, WarningCircle, Plus, Receipt } from '@phosphor-icons/react'
import { VisaApplicationDialog } from './VisaApplicationDialog'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface VisaManagerProps {
  project?: Project
}

export function VisaManager({ project }: VisaManagerProps) {
  const [visaApplications, setVisaApplications] = useKV<VisaApplication[]>('visa-applications', [])
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [stakeholders] = useKV<Stakeholder[]>('stakeholders', [])
  const [clients] = useKV<Client[]>('clients', [])
  const [architectProfile] = useKV<ArchitectProfile | null>('architect-profile', null)
  const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const projectVisas = project 
    ? (visaApplications || []).filter(v => v.projectId === project.id)
    : (visaApplications || [])

  const handleCreateVisa = () => {
    setSelectedVisa(null)
    setDialogOpen(true)
  }

  const handleEditVisa = (visa: VisaApplication) => {
    setSelectedVisa(visa)
    setDialogOpen(true)
  }

  const handleViewDetails = (visa: VisaApplication) => {
    setSelectedVisa(visa)
    setDetailDialogOpen(true)
  }

  const handleSaveVisa = (visaData: Partial<VisaApplication>) => {
    const previousVisa = visaData.id 
      ? (visaApplications || []).find(v => v.id === visaData.id)
      : null
    
    const wasApproved = previousVisa?.status !== 'approved' && visaData.status === 'approved'
    
    setVisaApplications(current => {
      const list = current || []
      if (visaData.id) {
        return list.map(v => 
          v.id === visaData.id 
            ? { ...v, ...visaData, updatedAt: Date.now() } as VisaApplication
            : v
        )
      } else {
        const newVisa: VisaApplication = {
          id: Date.now().toString(),
          projectId: visaData.projectId || project?.id || '',
          college: visaData.college || 'COAM',
          status: 'draft',
          phases: visaData.phases || [],
          documents: [],
          requirements: visaData.requirements || [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        return [...list, newVisa]
      }
    })
    
    if (wasApproved) {
      generateInvoiceForVisa(visaData as VisaApplication)
    }
    
    setDialogOpen(false)
  }

  const generateInvoiceForVisa = (visa: VisaApplication) => {
    if (!project) {
      toast.error('No se puede generar factura sin proyecto asociado')
      return
    }

    const projectClient = (clients || []).find(c => c.id === project.clientId)
    
    const promotorIds = project.stakeholders || []
    const promotor = (stakeholders || []).find(s => 
      promotorIds.includes(s.id) && s.type === 'promotor'
    )

    const clientName = projectClient?.razonSocial || projectClient?.nombre || promotor?.name || 'Cliente'
    const clientNIF = projectClient?.nif || promotor?.nif || ''
    const clientAddress = projectClient?.direccion || promotor?.address

    if (!clientNIF) {
      toast.error('No se encontró información del cliente o promotor', {
        description: 'Añade un cliente al proyecto o un promotor para generar la factura automáticamente'
      })
      return
    }

    const invoiceData = generateVisaFeeInvoice(
      visa,
      project.id,
      clientName,
      clientNIF,
      clientAddress,
      projectClient,
      architectProfile
    )

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      ...invoiceData
    } as Invoice

    setInvoices(current => [...(current || []), newInvoice])

    toast.success('Visado aprobado - Factura generada automáticamente', {
      description: `Factura ${newInvoice.invoiceNumber} por ${newInvoice.total.toFixed(2)}€`,
      duration: 5000,
      action: {
        label: 'Ver Factura',
        onClick: () => {
          console.log('Ver factura:', newInvoice.id)
        }
      }
    })
  }

  const handleDeleteVisa = (visaId: string) => {
    setVisaApplications(current => 
      (current || []).filter(v => v.id !== visaId)
    )
  }

  const handleUpdateStatus = (visaId: string, newStatus: string) => {
    const visa = (visaApplications || []).find(v => v.id === visaId)
    if (!visa) return
    
    const wasApproved = visa.status !== 'approved' && newStatus === 'approved'
    
    setVisaApplications(current => 
      (current || []).map(v => 
        v.id === visaId 
          ? { ...v, status: newStatus as any, updatedAt: Date.now() }
          : v
      )
    )
    
    if (wasApproved) {
      const updatedVisa = { ...visa, status: 'approved' as const }
      generateInvoiceForVisa(updatedVisa)
    }
    
    toast.success('Estado actualizado correctamente')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} weight="fill" className="text-green-600" />
      case 'required':
      case 'rejected':
        return <WarningCircle size={20} weight="fill" className="text-destructive" />
      case 'pending-payment':
      case 'pending-pickup':
        return <Clock size={20} weight="fill" className="text-amber-600" />
      default:
        return <Clock size={20} className="text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'required':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending-payment':
      case 'pending-pickup':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'submitted':
      case 'under-review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Stamp size={18} weight="duotone" />
          Gestión de Visados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Stamp size={28} weight="duotone" className="text-primary" />
            Gestión de Visados Colegiales
          </DialogTitle>
          <DialogDescription>
            Gestiona las solicitudes de visado ante el Colegio Oficial de Arquitectos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {projectVisas.length === 0 
                  ? 'No hay solicitudes de visado registradas'
                  : `${projectVisas.length} solicitud${projectVisas.length !== 1 ? 'es' : ''} de visado`
                }
              </p>
            </div>
            <Button onClick={handleCreateVisa} className="gap-2">
              <Plus size={18} weight="bold" />
              Nueva Solicitud
            </Button>
          </div>

          {projectVisas.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Stamp size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sin solicitudes de visado</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Comienza creando una nueva solicitud de visado colegial
                </p>
                <Button onClick={handleCreateVisa} className="gap-2">
                  <Plus size={18} weight="bold" />
                  Crear Primera Solicitud
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {projectVisas.map((visa, index) => (
                <motion.div
                  key={visa.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(visa)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(visa.status)}
                          <div>
                            <h4 className="font-semibold">
                              {PROFESSIONAL_COLLEGE_LABELS[visa.college]}
                            </h4>
                            {visa.applicationNumber && (
                              <p className="text-sm text-muted-foreground">
                                Exp. {visa.applicationNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getStatusColor(visa.status)}>
                            {VISA_STATUS_LABELS[visa.status]}
                          </Badge>
                          {visa.phases.map(phase => (
                            <Badge key={phase} variant="secondary">
                              {phase.replace('-', ' ').toUpperCase()}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText size={16} />
                            <span>{visa.documents.length} documentos</span>
                          </div>
                          {visa.estimatedFee && (
                            <div>
                              Tasa estimada: {visa.estimatedFee.toFixed(2)}€
                            </div>
                          )}
                          <div>
                            {new Date(visa.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>

                        {visa.status === 'required' && visa.rejectionReasons && (
                          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm font-medium text-destructive mb-1">
                              Motivos del requerimiento:
                            </p>
                            <ul className="text-sm text-destructive list-disc list-inside">
                              {visa.rejectionReasons.map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditVisa(visa)
                          }}
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      <VisaApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        visa={selectedVisa || undefined}
        project={project}
        onSave={handleSaveVisa}
      />

      {selectedVisa && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detalles de Solicitud de Visado
              </DialogTitle>
              <DialogDescription>
                {PROFESSIONAL_COLLEGE_LABELS[selectedVisa.college]}
                {selectedVisa.applicationNumber && ` - Exp. ${selectedVisa.applicationNumber}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Estado del Visado</Label>
                <Select 
                  value={selectedVisa.status} 
                  onValueChange={(value) => handleUpdateStatus(selectedVisa.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VISA_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVisa.status === 'approved' && (
                  <div className="mt-2 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                    <Receipt size={20} className="text-green-700" weight="duotone" />
                    <p className="text-sm text-green-700">
                      Se generó automáticamente una factura al aprobar este visado
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Fases incluidas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVisa.phases.map(phase => (
                    <Badge key={phase} variant="secondary">
                      {phase.replace('-', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Documentos ({selectedVisa.documents.length})</h4>
                <div className="space-y-2">
                  {selectedVisa.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <FileText size={20} />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      {doc.isValid ? (
                        <CheckCircle size={20} weight="fill" className="text-green-600" />
                      ) : (
                        <WarningCircle size={20} weight="fill" className="text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedVisa.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notas</h4>
                    <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                      {selectedVisa.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
