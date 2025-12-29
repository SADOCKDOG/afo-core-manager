import { useState } from 'react'
import { 
  VisaApplication, 
  VisaStatus,
  VisaRequirement,
  VISA_STATUS_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  Warning,
  CreditCard,
  Package,
  Check,
  XCircle,
  ListChecks
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { generateSubmissionChecklist } from '@/lib/visa-validation'

interface PermitStatusTrackerProps {
  visa: VisaApplication
  onUpdateStatus: (status: VisaStatus) => void
}

export function PermitStatusTracker({ visa, onUpdateStatus }: PermitStatusTrackerProps) {
  const [notes, setNotes] = useState(visa.notes || '')

  const statusFlow: VisaStatus[] = [
    'draft',
    'pending-submission',
    'submitted',
    'under-review',
    'pending-payment',
    'pending-pickup',
    'approved'
  ]

  const currentStatusIndex = statusFlow.indexOf(visa.status)

  const handleStatusChange = (newStatus: VisaStatus) => {
    onUpdateStatus(newStatus)
    toast.success('Estado actualizado', {
      description: `Nuevo estado: ${VISA_STATUS_LABELS[newStatus]}`
    })
  }

  const getStatusIcon = (status: VisaStatus) => {
    switch (status) {
      case 'draft':
      case 'pending-submission':
        return <Clock size={20} weight="duotone" />
      case 'submitted':
      case 'under-review':
        return <Check size={20} weight="duotone" />
      case 'required':
        return <Warning size={20} weight="duotone" />
      case 'pending-payment':
        return <CreditCard size={20} weight="duotone" />
      case 'pending-pickup':
        return <Package size={20} weight="duotone" />
      case 'approved':
        return <CheckCircle size={20} weight="duotone" />
      case 'rejected':
        return <XCircle size={20} weight="duotone" />
      default:
        return <Clock size={20} weight="duotone" />
    }
  }

  const getStatusColor = (status: VisaStatus) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'required': return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
      case 'submitted':
      case 'under-review': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'pending-payment': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'pending-pickup': return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30'
      default: return 'text-muted-foreground bg-muted/20 border-border'
    }
  }

  const submissionChecklist = generateSubmissionChecklist(visa)

  return (
    <ScrollArea className="h-[calc(90vh-400px)]">
      <div className="space-y-6 pr-4">
        <Card>
          <CardHeader>
            <CardTitle>Estado Actual</CardTitle>
            <CardDescription>
              Seguimiento del proceso de visado colegial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(visa.status)}`}>
                  {getStatusIcon(visa.status)}
                </div>
                <div>
                  <p className="font-semibold">{VISA_STATUS_LABELS[visa.status]}</p>
                  {visa.applicationNumber && (
                    <p className="text-sm text-muted-foreground font-mono">
                      {visa.applicationNumber}
                    </p>
                  )}
                </div>
              </div>
              
              {visa.submittedAt && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Presentado</p>
                  <p className="text-sm font-medium">
                    {new Date(visa.submittedAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {visa.status === 'draft' && (
          <Alert>
            <ListChecks size={18} />
            <AlertTitle>Lista de verificación previa</AlertTitle>
            <AlertDescription>
              <ul className="mt-3 space-y-2 text-sm">
                {submissionChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {visa.status === 'required' && visa.rejectionReasons && visa.rejectionReasons.length > 0 && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Warning size={18} className="text-amber-400" />
            <AlertTitle className="text-amber-400">Documentación Requerida</AlertTitle>
            <AlertDescription>
              <ul className="mt-3 space-y-2 text-sm">
                {visa.rejectionReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleStatusChange('pending-submission')}
              >
                Marcar como Subsanado
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Requisitos del Colegio</CardTitle>
            <CardDescription>
              Verifique que se cumplen todos los requisitos administrativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visa.requirements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay requisitos definidos
              </p>
            ) : (
              <div className="space-y-3">
                {visa.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <Checkbox
                      id={`req-${req.id}`}
                      checked={req.isMet}
                      disabled={visa.status !== 'draft' && visa.status !== 'pending-submission'}
                    />
                    <Label
                      htmlFor={`req-${req.id}`}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      {req.description}
                      {req.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{req.notes}</p>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {visa.estimatedFee && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasa de Visado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Importe estimado</span>
                <span className="text-2xl font-bold">
                  {visa.estimatedFee.toFixed(2)} €
                </span>
              </div>
              {visa.paymentReference && (
                <div className="mt-3 p-3 rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground">Referencia de pago</p>
                  <p className="font-mono text-sm mt-1">{visa.paymentReference}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            <CardDescription>
              Actualizar el estado de la solicitud
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {visa.status === 'submitted' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('under-review')}
                    className="gap-2"
                  >
                    <Check size={16} />
                    En Revisión
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('required')}
                    className="gap-2"
                  >
                    <Warning size={16} />
                    Requerido
                  </Button>
                </>
              )}
              
              {visa.status === 'under-review' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('pending-payment')}
                    className="gap-2"
                  >
                    <CreditCard size={16} />
                    Pdte. Pago
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange('approved')}
                    className="gap-2"
                  >
                    <CheckCircle size={16} />
                    Aprobado
                  </Button>
                </>
              )}
              
              {visa.status === 'pending-payment' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('pending-pickup')}
                  className="gap-2 col-span-2"
                >
                  <Package size={16} />
                  Pdte. Retirar
                </Button>
              )}
              
              {visa.status === 'pending-pickup' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange('approved')}
                  className="gap-2 col-span-2"
                >
                  <CheckCircle size={16} />
                  Marcar como Recogido
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas</CardTitle>
            <CardDescription>
              Información adicional sobre el trámite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Agregar notas sobre el proceso de visado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
