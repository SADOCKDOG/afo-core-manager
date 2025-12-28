import { useState, useEffect } from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Gear,
  EnvelopeSimple,
  CheckCircle,
  Warning,
  Info,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmailConfig, useEmailConfig, emailService } from '@/lib/email-service'

interface EmailConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailConfigDialog({ open, onOpenChange }: EmailConfigDialogProps) {
  const { config: savedConfig, updateConfig, isConfigured } = useEmailConfig()
  
  const [provider, setProvider] = useState<'sendgrid' | 'aws-ses'>(
    savedConfig?.provider || 'sendgrid'
  )
  const [sendgridApiKey, setSendgridApiKey] = useState(savedConfig?.apiKey || '')
  const [awsRegion, setAwsRegion] = useState(savedConfig?.awsRegion || 'us-east-1')
  const [awsAccessKeyId, setAwsAccessKeyId] = useState(savedConfig?.awsAccessKeyId || '')
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState(savedConfig?.awsSecretAccessKey || '')
  const [fromEmail, setFromEmail] = useState(savedConfig?.fromEmail || '')
  const [fromName, setFromName] = useState(savedConfig?.fromName || 'AFO CORE MANAGER')
  const [replyToEmail, setReplyToEmail] = useState(savedConfig?.replyToEmail || '')
  
  const [showSendGridKey, setShowSendGridKey] = useState(false)
  const [showAwsSecret, setShowAwsSecret] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    if (savedConfig) {
      setProvider(savedConfig.provider)
      setSendgridApiKey(savedConfig.apiKey || '')
      setAwsRegion(savedConfig.awsRegion || 'us-east-1')
      setAwsAccessKeyId(savedConfig.awsAccessKeyId || '')
      setAwsSecretAccessKey(savedConfig.awsSecretAccessKey || '')
      setFromEmail(savedConfig.fromEmail)
      setFromName(savedConfig.fromName)
      setReplyToEmail(savedConfig.replyToEmail || '')
    }
  }, [savedConfig])

  const handleSave = () => {
    if (!fromEmail) {
      toast.error('El email de remitente es obligatorio')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(fromEmail)) {
      toast.error('Por favor, ingrese un email válido')
      return
    }

    if (replyToEmail && !emailRegex.test(replyToEmail)) {
      toast.error('Por favor, ingrese un email de respuesta válido')
      return
    }

    if (provider === 'sendgrid' && !sendgridApiKey) {
      toast.error('La API Key de SendGrid es obligatoria')
      return
    }

    if (provider === 'aws-ses') {
      if (!awsAccessKeyId || !awsSecretAccessKey) {
        toast.error('Las credenciales de AWS SES son obligatorias')
        return
      }
    }

    const newConfig: EmailConfig = {
      provider,
      fromEmail,
      fromName,
      replyToEmail: replyToEmail || undefined,
      ...(provider === 'sendgrid' && { apiKey: sendgridApiKey }),
      ...(provider === 'aws-ses' && {
        awsRegion,
        awsAccessKeyId,
        awsSecretAccessKey
      })
    }

    updateConfig(newConfig)
    toast.success('Configuración de email guardada correctamente')
    onOpenChange(false)
  }

  const handleTestEmail = async () => {
    if (!fromEmail) {
      toast.error('Configure primero el email de remitente')
      return
    }

    const testConfig: EmailConfig = {
      provider,
      fromEmail,
      fromName,
      replyToEmail: replyToEmail || undefined,
      ...(provider === 'sendgrid' && { apiKey: sendgridApiKey }),
      ...(provider === 'aws-ses' && {
        awsRegion,
        awsAccessKeyId,
        awsSecretAccessKey
      })
    }

    emailService.setConfig(testConfig)

    setIsTesting(true)
    try {
      const result = await emailService.sendEmail({
        to: [{ email: fromEmail, name: fromName }],
        subject: 'Email de Prueba - AFO CORE MANAGER',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
          </head>
          <body style="font-family: system-ui, -apple-system, sans-serif; padding: 2em; max-width: 600px; margin: 0 auto;">
            <div style="background-color: oklch(0.35 0.18 140); color: white; padding: 2em; border-radius: 8px; text-align: center;">
              <h1 style="margin: 0;">✓ Email de Prueba Exitoso</h1>
            </div>
            <div style="padding: 2em; background-color: #f8f9fa; border-radius: 8px; margin-top: 1em;">
              <p>Este es un email de prueba de AFO CORE MANAGER.</p>
              <p>Si recibe este mensaje, su configuración de email está funcionando correctamente.</p>
              <p style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd; color: #666; font-size: 0.9em;">
                Enviado: ${new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </body>
          </html>
        `
      })

      if (result.success) {
        toast.success('Email de prueba enviado correctamente. Revise su bandeja de entrada.')
      } else {
        toast.error(result.error || 'Error al enviar el email de prueba')
      }
    } catch (error) {
      console.error('Test email error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al enviar el email de prueba')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gear size={24} weight="duotone" />
            Configuración de Email
          </DialogTitle>
          <DialogDescription>
            Configure el servicio de email para enviar informes y notificaciones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isConfigured && (
            <Alert className="bg-primary/5 border-primary/20">
              <CheckCircle size={18} className="text-primary" weight="duotone" />
              <AlertDescription className="text-sm">
                El servicio de email está configurado y listo para usar
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={provider} onValueChange={(v) => setProvider(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sendgrid">
                SendGrid
              </TabsTrigger>
              <TabsTrigger value="aws-ses">
                AWS SES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sendgrid" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">SendGrid Configuration</CardTitle>
                  <CardDescription>
                    Servicio de email robusto y fácil de configurar (recomendado)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info size={18} className="text-primary" weight="duotone" />
                    <AlertDescription className="text-sm">
                      <strong>Cómo obtener su API Key:</strong>
                      <ol className="mt-2 ml-4 space-y-1 list-decimal text-xs">
                        <li>Vaya a <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">sendgrid.com</a> y cree una cuenta</li>
                        <li>Verifique su dominio o email de remitente</li>
                        <li>Vaya a Settings → API Keys</li>
                        <li>Cree una nueva API Key con permisos "Full Access"</li>
                        <li>Copie la key y péguela aquí (solo se muestra una vez)</li>
                      </ol>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="sendgrid-key">
                      SendGrid API Key <Badge variant="destructive" className="ml-2">Requerido</Badge>
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="sendgrid-key"
                        type={showSendGridKey ? 'text' : 'password'}
                        placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                        value={sendgridApiKey}
                        onChange={(e) => setSendgridApiKey(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowSendGridKey(!showSendGridKey)}
                      >
                        {showSendGridKey ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Su API Key se almacena de forma segura en su navegador
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aws-ses" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AWS SES Configuration</CardTitle>
                  <CardDescription>
                    Amazon Simple Email Service para envío a gran escala
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info size={18} className="text-primary" weight="duotone" />
                    <AlertDescription className="text-sm">
                      <strong>Requisitos previos:</strong>
                      <ul className="mt-2 ml-4 space-y-1 list-disc text-xs">
                        <li>Cuenta de AWS activa</li>
                        <li>SES configurado y verificado en su región</li>
                        <li>Dominio o email verificado en SES</li>
                        <li>Usuario IAM con permisos de SES</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="aws-region">
                      Región de AWS <Badge variant="destructive" className="ml-2">Requerido</Badge>
                    </Label>
                    <select
                      id="aws-region"
                      className="w-full mt-2 px-3 py-2 bg-background border border-input rounded-md text-sm"
                      value={awsRegion}
                      onChange={(e) => setAwsRegion(e.target.value)}
                    >
                      <option value="us-east-1">US East (N. Virginia) - us-east-1</option>
                      <option value="us-west-2">US West (Oregon) - us-west-2</option>
                      <option value="eu-west-1">EU (Ireland) - eu-west-1</option>
                      <option value="eu-central-1">EU (Frankfurt) - eu-central-1</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore) - ap-southeast-1</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="aws-access-key">
                      AWS Access Key ID <Badge variant="destructive" className="ml-2">Requerido</Badge>
                    </Label>
                    <Input
                      id="aws-access-key"
                      type="text"
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      value={awsAccessKeyId}
                      onChange={(e) => setAwsAccessKeyId(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aws-secret-key">
                      AWS Secret Access Key <Badge variant="destructive" className="ml-2">Requerido</Badge>
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="aws-secret-key"
                        type={showAwsSecret ? 'text' : 'password'}
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        value={awsSecretAccessKey}
                        onChange={(e) => setAwsSecretAccessKey(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowAwsSecret(!showAwsSecret)}
                      >
                        {showAwsSecret ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sus credenciales se almacenan de forma segura en su navegador
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuración del Remitente</CardTitle>
              <CardDescription>
                Información que aparecerá en los emails enviados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="from-email">
                  Email de Remitente <Badge variant="destructive" className="ml-2">Requerido</Badge>
                </Label>
                <Input
                  id="from-email"
                  type="email"
                  placeholder="estudio@ejemplo.com"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {provider === 'sendgrid' && 'Debe ser un email o dominio verificado en SendGrid'}
                  {provider === 'aws-ses' && 'Debe ser un email o dominio verificado en AWS SES'}
                </p>
              </div>

              <div>
                <Label htmlFor="from-name">Nombre del Remitente</Label>
                <Input
                  id="from-name"
                  type="text"
                  placeholder="AFO CORE MANAGER"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="reply-to">Email de Respuesta (Opcional)</Label>
                <Input
                  id="reply-to"
                  type="email"
                  placeholder="respuestas@ejemplo.com"
                  value={replyToEmail}
                  onChange={(e) => setReplyToEmail(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Los destinatarios verán este email al responder
                </p>
              </div>
            </CardContent>
          </Card>

          {(provider === 'sendgrid' && sendgridApiKey && fromEmail) || 
           (provider === 'aws-ses' && awsAccessKeyId && awsSecretAccessKey && fromEmail) ? (
            <Alert className="bg-muted/50">
              <Warning size={18} className="text-primary" weight="duotone" />
              <AlertDescription className="text-sm">
                <strong>Pruebe su configuración</strong> antes de guardar para verificar que todo funciona correctamente
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-4 border-t gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          
          <div className="flex gap-2">
            {((provider === 'sendgrid' && sendgridApiKey && fromEmail) || 
              (provider === 'aws-ses' && awsAccessKeyId && awsSecretAccessKey && fromEmail)) && (
              <Button
                variant="outline"
                onClick={handleTestEmail}
                disabled={isTesting}
                className="gap-2"
              >
                <EnvelopeSimple size={18} />
                {isTesting ? 'Enviando...' : 'Enviar Prueba'}
              </Button>
            )}
            
            <Button
              onClick={handleSave}
              className="gap-2"
            >
              <CheckCircle size={18} weight="duotone" />
              Guardar Configuración
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
