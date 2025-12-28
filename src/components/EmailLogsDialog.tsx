import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  Clock,
  EnvelopeSimple,
  CalendarBlank,
  Trash,
  Warning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useEmailLogs, useScheduledEmails } from '@/lib/email-service'

interface EmailLogsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailLogsDialog({ open, onOpenChange }: EmailLogsDialogProps) {
  const { logs, clearLogs } = useEmailLogs()
  const { scheduledEmails, toggleScheduledEmail, removeScheduledEmail } = useScheduledEmails()
  const [activeTab, setActiveTab] = useState<'logs' | 'scheduled'>('logs')

  const handleClearLogs = () => {
    if (logs.length === 0) return
    
    if (confirm('¿Está seguro de que desea borrar todos los registros de email?')) {
      clearLogs()
      toast.success('Registros borrados correctamente')
    }
  }

  const handleToggleScheduled = (id: string) => {
    toggleScheduledEmail(id)
    toast.success('Estado actualizado')
  }

  const handleRemoveScheduled = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta entrega automática?')) {
      removeScheduledEmail(id)
      toast.success('Entrega automática eliminada')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={18} className="text-primary" weight="duotone" />
      case 'failed':
        return <XCircle size={18} className="text-destructive" weight="duotone" />
      case 'pending':
        return <Clock size={18} className="text-muted-foreground" weight="duotone" />
      default:
        return <EnvelopeSimple size={18} weight="duotone" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Enviado</Badge>
      case 'failed':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getFrequencyText = (frequency: string, dayOfWeek?: number, dayOfMonth?: number) => {
    switch (frequency) {
      case 'daily':
        return 'Diario'
      case 'weekly':
        return `Semanal - ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][dayOfWeek! - 1]}`
      case 'monthly':
        return `Mensual - Día ${dayOfMonth}`
      default:
        return frequency
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClockCounterClockwise size={24} weight="duotone" />
            Registro de Emails
          </DialogTitle>
          <DialogDescription>
            Historial de emails enviados y entregas automáticas configuradas
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logs" className="gap-2">
              <EnvelopeSimple size={16} />
              Historial ({logs.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="gap-2">
              <CalendarBlank size={16} />
              Automáticos ({scheduledEmails.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Últimos {logs.length} emails enviados
              </p>
              {logs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearLogs}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash size={16} />
                  Borrar Todo
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px] pr-4">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <EnvelopeSimple size={32} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No hay emails enviados todavía
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <Card key={log.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {getStatusIcon(log.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">
                                  {log.subject}
                                </h4>
                                {getStatusBadge(log.status)}
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>
                                  <strong>Para:</strong> {log.to.join(', ')}
                                </p>
                                <p>
                                  <strong>Proveedor:</strong> {log.provider}
                                </p>
                                {log.messageId && (
                                  <p>
                                    <strong>ID:</strong> {log.messageId}
                                  </p>
                                )}
                                {log.error && (
                                  <p className="text-destructive">
                                    <strong>Error:</strong> {log.error}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="scheduled" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Entregas automáticas configuradas
              </p>
            </div>

            <ScrollArea className="h-[500px] pr-4">
              {scheduledEmails.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <CalendarBlank size={32} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No hay entregas automáticas configuradas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledEmails.map((scheduled) => (
                    <Card key={scheduled.id} className={!scheduled.active ? 'opacity-60' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              <CalendarBlank size={18} className="text-primary" weight="duotone" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-sm">
                                  {scheduled.reportType}
                                </h4>
                                {scheduled.active ? (
                                  <Badge className="bg-primary/10 text-primary border-primary/20">
                                    Activo
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">Pausado</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>
                                  <strong>Frecuencia:</strong> {getFrequencyText(
                                    scheduled.schedule.frequency,
                                    scheduled.schedule.dayOfWeek,
                                    scheduled.schedule.dayOfMonth
                                  )}
                                </p>
                                <p>
                                  <strong>Para:</strong> {scheduled.emailParams.to.map(r => r.email).join(', ')}
                                </p>
                                <p>
                                  <strong>Próximo envío:</strong> {new Date(scheduled.nextSendAt).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                {scheduled.lastSentAt && (
                                  <p>
                                    <strong>Último envío:</strong> {new Date(scheduled.lastSentAt).toLocaleString('es-ES', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleScheduled(scheduled.id)}
                            >
                              {scheduled.active ? 'Pausar' : 'Activar'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveScheduled(scheduled.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
