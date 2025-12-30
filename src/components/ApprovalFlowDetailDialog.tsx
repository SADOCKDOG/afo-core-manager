import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { ApprovalFlow } from '@/lib/approval-types'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Signature,
  Warning,
  ChatCircle,
  ListChecks
} from '@phosphor-icons/react'
import {
  getApprovalProgress,
  getFlowStatusLabel,
  getFlowStatusBadge,
  formatFlowDuration,
  canUserApprove,
  approveStep,
  rejectStep,
  cancelApprovalFlow,
  getActiveApprovers,
  createAuditLog
} from '@/lib/approval-utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface ApprovalFlowDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flow: ApprovalFlow
  onFlowUpdate: (flow: ApprovalFlow) => void
}

export function ApprovalFlowDetailDialog({
  open,
  onOpenChange,
  flow,
  onFlowUpdate
}: ApprovalFlowDetailDialogProps) {
  const [auditLogs, setAuditLogs] = useKV<any[]>('approval-audit-logs', [])
  const [actionComments, setActionComments] = useState('')
  const [showApproveConfirm, setShowApproveConfirm] = useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const progress = getApprovalProgress(flow)
  const currentUser = { id: 'current-user', name: 'Usuario Actual' }
  const canApprove = canUserApprove(flow, currentUser.id)
  const activeApprovers = getActiveApprovers(flow)

  const handleApprove = () => {
    const currentStep = flow.steps.find(s => s.stepNumber === flow.currentStepNumber)
    if (!currentStep) return

    const signatureData = `SIGNATURE:${currentUser.id}:${Date.now()}`
    const updatedFlow = approveStep(
      flow,
      currentStep.id,
      currentUser.id,
      currentUser.name,
      actionComments,
      signatureData
    )

    const auditLog = createAuditLog(
      'approval-flow',
      flow.id,
      'approve',
      currentUser.id,
      currentUser.name,
      {
        stepNumber: currentStep.stepNumber,
        comments: actionComments
      }
    )

    setAuditLogs(current => [...(current || []), auditLog])
    onFlowUpdate(updatedFlow)
    
    toast.success('Aprobación registrada', {
      description: 'El documento ha sido aprobado y firmado digitalmente'
    })

    setActionComments('')
    setShowApproveConfirm(false)
  }

  const handleReject = () => {
    if (!actionComments.trim()) {
      toast.error('Debes proporcionar un motivo de rechazo')
      return
    }

    const currentStep = flow.steps.find(s => s.stepNumber === flow.currentStepNumber)
    if (!currentStep) return

    const updatedFlow = rejectStep(
      flow,
      currentStep.id,
      currentUser.id,
      currentUser.name,
      actionComments
    )

    const auditLog = createAuditLog(
      'approval-flow',
      flow.id,
      'reject',
      currentUser.id,
      currentUser.name,
      {
        stepNumber: currentStep.stepNumber,
        reason: actionComments
      }
    )

    setAuditLogs(current => [...(current || []), auditLog])
    onFlowUpdate(updatedFlow)
    
    toast.error('Documento rechazado', {
      description: 'Se ha notificado al iniciador del flujo'
    })

    setActionComments('')
    setShowRejectConfirm(false)
  }

  const handleCancel = () => {
    if (!actionComments.trim()) {
      toast.error('Debes proporcionar un motivo de cancelación')
      return
    }

    const updatedFlow = cancelApprovalFlow(
      flow,
      currentUser.id,
      currentUser.name,
      actionComments
    )

    const auditLog = createAuditLog(
      'approval-flow',
      flow.id,
      'cancel',
      currentUser.id,
      currentUser.name,
      {
        reason: actionComments
      }
    )

    setAuditLogs(current => [...(current || []), auditLog])
    onFlowUpdate(updatedFlow)
    
    toast.info('Flujo cancelado', {
      description: 'El flujo de aprobación ha sido cancelado'
    })

    setActionComments('')
    setShowCancelConfirm(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl mb-2">{flow.documentName}</DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <FileText size={14} />
                {flow.projectName}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getFlowStatusBadge(flow.status)}>
              {getFlowStatusLabel(flow.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4 flex-shrink-0">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Progreso</p>
                <p className="text-3xl font-bold">{progress.percentage}%</p>
                <Progress value={progress.percentage} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Pasos</p>
                <p className="text-3xl font-bold">
                  {progress.completedSteps}/{progress.totalSteps}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Firmas</p>
                <p className="text-3xl font-bold">
                  {progress.completedSignatures}/{progress.totalSignatures}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="steps" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TabsTrigger value="steps" className="gap-2">
              <ListChecks size={16} />
              Pasos
            </TabsTrigger>
            <TabsTrigger value="signatures" className="gap-2">
              <Signature size={16} />
              Firmas
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <FileText size={16} />
              Información
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-full">
              <TabsContent value="steps" className="mt-0 space-y-4 pb-4">
              {flow.steps.map((step, index) => {
                const isCurrentStep = step.stepNumber === flow.currentStepNumber
                const isCompleted = step.status === 'approved'
                const isRejected = step.status === 'rejected'
                const isPending = step.status === 'pending'

                return (
                  <Card key={step.id} className={isCurrentStep ? 'border-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                            isCompleted ? 'bg-green-500 border-green-500 text-white' :
                            isRejected ? 'bg-red-500 border-red-500 text-white' :
                            isCurrentStep ? 'border-primary text-primary' :
                            'border-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle size={18} weight="fill" /> : 
                             isRejected ? <XCircle size={18} weight="fill" /> :
                             step.stepNumber}
                          </span>
                          Paso {step.stepNumber}
                          {isCurrentStep && <Badge variant="outline" className="ml-2">Actual</Badge>}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {step.currentApprovals}/{step.requiredApprovals} aprobaciones
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {step.signatures.map((signature) => (
                          <div
                            key={signature.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <User size={16} className="text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{signature.signerName}</p>
                                <p className="text-xs text-muted-foreground">{signature.signerRole}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {signature.status === 'signed' && (
                                <>
                                  <CheckCircle size={16} className="text-green-500" weight="fill" />
                                  <span className="text-xs text-muted-foreground">
                                    {signature.signedAt && format(signature.signedAt, 'dd/MM HH:mm', { locale: es })}
                                  </span>
                                </>
                              )}
                              {signature.status === 'rejected' && (
                                <>
                                  <XCircle size={16} className="text-red-500" weight="fill" />
                                  <span className="text-xs text-red-500">Rechazado</span>
                                </>
                              )}
                              {signature.status === 'pending' && (
                                <>
                                  <Clock size={16} className="text-yellow-500" />
                                  <span className="text-xs text-muted-foreground">Pendiente</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {step.comments && (
                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-start gap-2">
                            <ChatCircle size={16} className="text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Comentarios</p>
                              <p className="text-sm whitespace-pre-wrap">{step.comments}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

              <TabsContent value="signatures" className="mt-0 pb-4">
                <div className="space-y-4">
                  {flow.steps.flatMap(step => 
                    step.signatures.map(sig => ({
                      ...sig,
                      stepNumber: step.stepNumber
                    }))
                  ).map((signature) => (
                    <Card key={signature.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              signature.status === 'signed' ? 'bg-green-500/10 text-green-500' :
                              signature.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                              'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              <Signature size={20} weight="duotone" />
                            </div>
                            <div>
                              <p className="font-medium">{signature.signerName}</p>
                              <p className="text-sm text-muted-foreground">{signature.signerEmail}</p>
                              <p className="text-xs text-muted-foreground mt-1">Paso {signature.stepNumber}</p>
                              {signature.signedAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Firmado: {format(signature.signedAt, 'dd MMM yyyy HH:mm', { locale: es })}
                                </p>
                              )}
                              {signature.rejectionReason && (
                                <p className="text-xs text-red-500 mt-1">
                                  Motivo: {signature.rejectionReason}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant="outline" className={
                            signature.status === 'signed' ? 'bg-green-500/20 text-green-500 border-green-500/30' :
                            signature.status === 'rejected' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                          }>
                            {signature.status === 'signed' ? 'Firmado' :
                             signature.status === 'rejected' ? 'Rechazado' :
                             'Pendiente'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="info" className="mt-0 pb-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo de Flujo</Label>
                      <p className="text-sm font-medium mt-1">
                        {flow.flowType === 'sequential' ? 'Secuencial' :
                         flow.flowType === 'parallel' ? 'Paralelo' :
                         'Unánime'}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-xs text-muted-foreground">Iniciado por</Label>
                      <p className="text-sm font-medium mt-1">{flow.initiatedByName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(flow.initiatedAt, 'dd MMM yyyy HH:mm', { locale: es })}
                      </p>
                    </div>

                    {flow.dueDate && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Fecha Límite</Label>
                          <p className="text-sm font-medium mt-1">
                            {format(flow.dueDate, 'dd MMM yyyy', { locale: es })}
                          </p>
                        </div>
                      </>
                    )}

                    {flow.completedAt && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Completado</Label>
                          <p className="text-sm font-medium mt-1">
                            {format(flow.completedAt, 'dd MMM yyyy HH:mm', { locale: es })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duración: {formatFlowDuration(flow.initiatedAt, flow.completedAt)}
                          </p>
                        </div>
                      </>
                    )}

                    {flow.notes && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Notas</Label>
                          <p className="text-sm mt-1 whitespace-pre-wrap">{flow.notes}</p>
                        </div>
                      </>
                    )}

                    {flow.cancellationReason && (
                      <>
                        <Separator />
                        <div>
                          <Label className="text-xs text-muted-foreground">Motivo de Cancelación</Label>
                          <p className="text-sm mt-1 whitespace-pre-wrap text-destructive">
                            {flow.cancellationReason}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        {canApprove && (flow.status === 'pending' || flow.status === 'in-review') && (
          <div className="border-t pt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="action-comments">Comentarios</Label>
              <Textarea
                id="action-comments"
                value={actionComments}
                onChange={(e) => setActionComments(e.target.value)}
                placeholder="Añade comentarios sobre tu decisión..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={() => setShowApproveConfirm(true)}
              >
                <CheckCircle size={18} weight="fill" />
                Aprobar y Firmar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => setShowRejectConfirm(true)}
              >
                <XCircle size={18} weight="fill" />
                Rechazar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(true)}
              >
                <Warning size={18} />
                Cancelar Flujo
              </Button>
            </div>
          </div>
        )}

        <Dialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Aprobación</DialogTitle>
              <DialogDescription>
                Al aprobar, tu firma digital será registrada en el documento. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveConfirm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleApprove}>
                Confirmar Aprobación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Rechazo</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres rechazar este documento? Debes proporcionar un motivo.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectConfirm(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                Confirmar Rechazo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar Flujo</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres cancelar todo el flujo de aprobación? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>
                No Cancelar
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Sí, Cancelar Flujo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
