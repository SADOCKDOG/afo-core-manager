import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  PaperPlaneRight,
  EnvelopeSimple,
  User,
  Clock,
  CheckCircle,
  Sparkle,
  Plus,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Project, Stakeholder } from '@/lib/types'

interface ComplianceReport {
  id: string
  projectId: string
  projectTitle: string
  generatedAt: number
  summary: {
    totalChecks: number
    compliant: number
    nonCompliant: number
    pending: number
    notApplicable: number
    completionPercentage: number
  }
  reportContent: string
  recommendations: string[]
  nextSteps: string[]
}

interface EmailRecipient {
  email: string
  name: string
  fromStakeholder?: boolean
  stakeholderId?: string
}

interface ComplianceReportEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: ComplianceReport
  project: Project
  stakeholders: Stakeholder[]
}

interface EmailSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  dayOfWeek?: number
  dayOfMonth?: number
}

export function ComplianceReportEmailDialog({
  open,
  onOpenChange,
  report,
  project,
  stakeholders
}: ComplianceReportEmailDialogProps) {
  const projectStakeholders = stakeholders.filter(s => 
    project.stakeholders.includes(s.id) && s.email
  )

  const [recipients, setRecipients] = useState<EmailRecipient[]>(() => 
    projectStakeholders.map(s => ({
      email: s.email!,
      name: s.name,
      fromStakeholder: true,
      stakeholderId: s.id
    }))
  )
  const [customEmail, setCustomEmail] = useState('')
  const [customName, setCustomName] = useState('')
  const [subject, setSubject] = useState(
    `Informe de Cumplimiento Normativo - ${project.title}`
  )
  const [message, setMessage] = useState(
    `Estimado/a,\n\nAdjunto encontrará el informe de cumplimiento normativo del proyecto "${project.title}".\n\nEste informe incluye:\n- Análisis detallado de ${report.summary.totalChecks} puntos de verificación\n- Estado actual de cumplimiento: ${report.summary.completionPercentage}%\n- Recomendaciones prioritarias\n- Próximos pasos\n\nQuedo a su disposición para cualquier consulta.\n\nSaludos cordiales`
  )
  const [includeReportPDF, setIncludeReportPDF] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [schedule, setSchedule] = useState<EmailSchedule>({
    enabled: false,
    frequency: 'weekly',
    dayOfWeek: 1
  })

  const handleAddCustomRecipient = () => {
    if (!customEmail || !customName) {
      toast.error('Por favor, complete el nombre y email del destinatario')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customEmail)) {
      toast.error('Por favor, ingrese un email válido')
      return
    }

    if (recipients.some(r => r.email === customEmail)) {
      toast.error('Este email ya está en la lista de destinatarios')
      return
    }

    setRecipients([...recipients, {
      email: customEmail,
      name: customName,
      fromStakeholder: false
    }])
    setCustomEmail('')
    setCustomName('')
    toast.success('Destinatario añadido')
  }

  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r.email !== email))
    toast.success('Destinatario eliminado')
  }

  const handleSendEmail = async () => {
    if (recipients.length === 0) {
      toast.error('Por favor, añade al menos un destinatario')
      return
    }

    if (!subject.trim()) {
      toast.error('Por favor, ingrese un asunto para el email')
      return
    }

    setIsSending(true)

    try {
      await sendComplianceReportEmail({
        recipients: recipients.map(r => ({ email: r.email, name: r.name })),
        subject,
        message,
        report,
        project,
        includeReportPDF,
        includeSummary,
        schedule: schedule.enabled ? schedule : undefined
      })

      toast.success(
        schedule.enabled 
          ? 'Entrega automática configurada correctamente'
          : `Email enviado correctamente a ${recipients.length} destinatario(s)`
      )
      onOpenChange(false)
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Error al enviar el email. Por favor, inténtelo de nuevo.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EnvelopeSimple size={24} weight="duotone" />
            Enviar Informe por Email
          </DialogTitle>
          <DialogDescription>
            Configure y envíe el informe de cumplimiento a los intervinientes del proyecto
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Destinatarios</Label>
                <Badge variant="secondary">
                  {recipients.length} destinatario{recipients.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {recipients.length > 0 && (
                <div className="space-y-2 mb-4">
                  {recipients.map((recipient) => (
                    <Card key={recipient.email}>
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <User size={18} weight="duotone" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{recipient.name}</div>
                            <div className="text-xs text-muted-foreground">{recipient.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {recipient.fromStakeholder && (
                            <Badge variant="outline" className="text-xs">
                              Interviniente
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveRecipient(recipient.email)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                    <div>
                      <Label htmlFor="custom-name" className="text-xs">Nombre</Label>
                      <Input
                        id="custom-name"
                        placeholder="Nombre del destinatario"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRecipient()}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-email" className="text-xs">Email</Label>
                      <Input
                        id="custom-email"
                        type="email"
                        placeholder="email@ejemplo.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomRecipient()}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={handleAddCustomRecipient}
                      >
                        <Plus size={16} />
                        Añadir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div>
              <Label htmlFor="subject" className="text-base font-semibold">Asunto</Label>
              <Input
                id="subject"
                className="mt-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Asunto del email"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-base font-semibold">Mensaje</Label>
              <Textarea
                id="message"
                className="mt-2 min-h-[180px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensaje personalizado para los destinatarios"
              />
            </div>

            <Separator />

            <div>
              <Label className="text-base font-semibold mb-3 block">Contenido del Email</Label>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="include-pdf"
                    checked={includeReportPDF}
                    onCheckedChange={(checked) => setIncludeReportPDF(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="include-pdf" className="cursor-pointer font-normal">
                      Incluir informe completo en PDF
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Adjunta el informe detallado en formato PDF
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="include-summary"
                    checked={includeSummary}
                    onCheckedChange={(checked) => setIncludeSummary(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="include-summary" className="cursor-pointer font-normal">
                      Incluir resumen ejecutivo en el cuerpo
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Muestra las estadísticas clave directamente en el email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-start gap-3 mb-4">
                <Checkbox
                  id="enable-schedule"
                  checked={schedule.enabled}
                  onCheckedChange={(checked) => setSchedule({ ...schedule, enabled: checked as boolean })}
                />
                <div className="flex-1">
                  <Label htmlFor="enable-schedule" className="cursor-pointer text-base font-semibold">
                    Entrega Automática
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Envía el informe actualizado de forma automática a los destinatarios
                  </p>
                </div>
              </div>

              {schedule.enabled && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Label htmlFor="frequency" className="text-sm">Frecuencia</Label>
                      <select
                        id="frequency"
                        className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
                        value={schedule.frequency}
                        onChange={(e) => setSchedule({ ...schedule, frequency: e.target.value as any })}
                      >
                        <option value="daily">Diario</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>

                    {schedule.frequency === 'weekly' && (
                      <div>
                        <Label htmlFor="day-of-week" className="text-sm">Día de la semana</Label>
                        <select
                          id="day-of-week"
                          className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md text-sm"
                          value={schedule.dayOfWeek}
                          onChange={(e) => setSchedule({ ...schedule, dayOfWeek: parseInt(e.target.value) })}
                        >
                          <option value="1">Lunes</option>
                          <option value="2">Martes</option>
                          <option value="3">Miércoles</option>
                          <option value="4">Jueves</option>
                          <option value="5">Viernes</option>
                        </select>
                      </div>
                    )}

                    {schedule.frequency === 'monthly' && (
                      <div>
                        <Label htmlFor="day-of-month" className="text-sm">Día del mes</Label>
                        <Input
                          id="day-of-month"
                          type="number"
                          min="1"
                          max="28"
                          className="mt-1"
                          value={schedule.dayOfMonth || 1}
                          onChange={(e) => setSchedule({ ...schedule, dayOfMonth: parseInt(e.target.value) })}
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-3 bg-background rounded-lg border">
                      <Clock size={18} className="text-primary mt-0.5 shrink-0" weight="duotone" />
                      <div className="text-xs text-muted-foreground">
                        {schedule.frequency === 'daily' && 'Se enviará un informe actualizado cada día a las 9:00 AM'}
                        {schedule.frequency === 'weekly' && `Se enviará un informe actualizado cada ${
                          ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][schedule.dayOfWeek! - 1]
                        } a las 9:00 AM`}
                        {schedule.frequency === 'monthly' && `Se enviará un informe actualizado el día ${schedule.dayOfMonth || 1} de cada mes a las 9:00 AM`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-primary mt-0.5 shrink-0" weight="duotone" />
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Resumen del Informe</p>
                    <div className="text-muted-foreground space-y-0.5">
                      <p>• Total de verificaciones: {report.summary.totalChecks}</p>
                      <p>• Conformes: {report.summary.compliant}</p>
                      <p>• No conformes: {report.summary.nonCompliant}</p>
                      <p>• Progreso de verificación: {report.summary.completionPercentage}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSendEmail}
            disabled={isSending || recipients.length === 0}
            className="gap-2"
          >
            {isSending ? (
              <>
                <Sparkle size={18} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <PaperPlaneRight size={18} weight="duotone" />
                {schedule.enabled ? 'Configurar Entrega' : 'Enviar Ahora'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

async function sendComplianceReportEmail(params: {
  recipients: { email: string; name: string }[]
  subject: string
  message: string
  report: ComplianceReport
  project: Project
  includeReportPDF: boolean
  includeSummary: boolean
  schedule?: EmailSchedule
}) {
  const {
    recipients,
    subject,
    message,
    report,
    project,
    includeReportPDF,
    includeSummary,
    schedule
  } = params

  await new Promise(resolve => setTimeout(resolve, 1500))

  const emailHTML = generateEmailHTML({
    message,
    report,
    project,
    includeSummary
  })

  console.log('Email enviado:', {
    to: recipients.map(r => r.email).join(', '),
    subject,
    includesPDF: includeReportPDF,
    includesSummary: includeSummary,
    schedule,
    html: emailHTML
  })

  return {
    success: true,
    messageId: Date.now().toString(),
    recipients: recipients.length,
    scheduledDelivery: schedule?.enabled
  }
}

function generateEmailHTML(params: {
  message: string
  report: ComplianceReport
  project: Project
  includeSummary: boolean
}) {
  const { message, report, project, includeSummary } = params

  const messageHTML = message.split('\n').map(line => `<p style="margin: 0 0 1em 0;">${line}</p>`).join('')

  let summaryHTML = ''
  if (includeSummary) {
    summaryHTML = `
      <div style="margin: 2em 0; padding: 1.5em; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid oklch(0.35 0.18 140);">
        <h3 style="margin: 0 0 1em 0; color: oklch(0.20 0.12 140); font-size: 1.1em;">📊 Resumen Ejecutivo</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 0.5em 0; font-weight: 600;">Total de verificaciones:</td>
            <td style="padding: 0.5em 0; text-align: right;">${report.summary.totalChecks}</td>
          </tr>
          <tr style="background-color: #e8f5e9;">
            <td style="padding: 0.5em 0; font-weight: 600;">✓ Conformes:</td>
            <td style="padding: 0.5em 0; text-align: right; color: #2e7d32; font-weight: 600;">${report.summary.compliant}</td>
          </tr>
          <tr style="background-color: #ffebee;">
            <td style="padding: 0.5em 0; font-weight: 600;">✗ No conformes:</td>
            <td style="padding: 0.5em 0; text-align: right; color: #c62828; font-weight: 600;">${report.summary.nonCompliant}</td>
          </tr>
          <tr style="background-color: #fff3e0;">
            <td style="padding: 0.5em 0; font-weight: 600;">⏱ Pendientes:</td>
            <td style="padding: 0.5em 0; text-align: right; color: #f57c00; font-weight: 600;">${report.summary.pending}</td>
          </tr>
          <tr>
            <td style="padding: 0.5em 0; font-weight: 600; border-top: 2px solid #ddd;">Progreso de verificación:</td>
            <td style="padding: 0.5em 0; text-align: right; border-top: 2px solid #ddd;">
              <strong style="font-size: 1.2em; color: oklch(0.35 0.18 140);">${report.summary.completionPercentage}%</strong>
            </td>
          </tr>
        </table>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif; line-height: 1.6; color: oklch(0.20 0.12 140); max-width: 600px; margin: 0 auto; padding: 2em 1em;">
      <div style="background-color: oklch(0.35 0.18 140); color: white; padding: 2em; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 1.5em;">AFO CORE MANAGER</h1>
        <p style="margin: 0.5em 0 0 0; opacity: 0.9;">Informe de Cumplimiento Normativo</p>
      </div>
      
      <div style="background-color: white; padding: 2em; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 0.5em 0; color: oklch(0.20 0.12 140); font-size: 1.3em;">${project.title}</h2>
        <p style="margin: 0 0 1.5em 0; color: oklch(0.45 0.08 140); font-size: 0.9em;">
          Generado el ${new Date(report.generatedAt).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        
        ${messageHTML}
        
        ${summaryHTML}
        
        ${report.recommendations.length > 0 ? `
          <div style="margin: 2em 0; padding: 1.5em; background-color: #fff8e1; border-radius: 8px; border-left: 4px solid #f57c00;">
            <h3 style="margin: 0 0 1em 0; color: #e65100; font-size: 1.1em;">⚠️ Recomendaciones Prioritarias</h3>
            <ul style="margin: 0; padding-left: 1.5em;">
              ${report.recommendations.map(rec => `<li style="margin: 0.5em 0;">${rec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
      
      <div style="margin-top: 2em; padding: 1.5em; background-color: #f8f9fa; border-radius: 8px; text-align: center; color: oklch(0.45 0.08 140); font-size: 0.85em;">
        <p style="margin: 0;">Este email ha sido generado automáticamente por AFO CORE MANAGER</p>
        <p style="margin: 0.5em 0 0 0;">Sistema de Gestión Integral de Proyectos Arquitectónicos</p>
      </div>
    </body>
    </html>
  `
}
