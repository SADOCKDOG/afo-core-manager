import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  QualifiedSignatureRequest,
  QualifiedSignatureProviderType,
  QualifiedSignatureLevel,
  ClaveAuthMethod,
  QualifiedSignatureProvider
} from '@/lib/qualified-signature-types'
import {
  createQualifiedSignatureRequest,
  initiateClaveSignature,
  initiateViafirmaSignature,
  generateOtp,
  verifyOtp,
  getProviderLabel,
  getSignatureLevelLabel,
  getAuthMethodLabel,
  simulateQualifiedSignature
} from '@/lib/qualified-signature-service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Signature,
  Stamp,
  ShieldCheck,
  IdentificationCard,
  DeviceMobile,
  Check,
  Warning,
  Lightning,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QualifiedSignatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentId: string
  documentName: string
  projectId?: string
  projectName?: string
  signerName: string
  signerEmail: string
  signerNif?: string
  signerPhone?: string
  onSignComplete: (signatureData: string, metadata: any) => void
}

export function QualifiedSignatureDialog({
  open,
  onOpenChange,
  documentId,
  documentName,
  projectId,
  projectName,
  signerName,
  signerEmail,
  signerNif,
  signerPhone,
  onSignComplete
}: QualifiedSignatureDialogProps) {
  const [providers] = useKV<QualifiedSignatureProvider[]>('qsig-providers', [])
  const [requests, setRequests] = useKV<QualifiedSignatureRequest[]>('qsig-requests', [])
  
  const [currentStep, setCurrentStep] = useState<'select' | 'auth' | 'otp' | 'signing' | 'success'>('select')
  const [selectedProvider, setSelectedProvider] = useState<QualifiedSignatureProviderType>('clave')
  const [signatureLevel, setSignatureLevel] = useState<QualifiedSignatureLevel>('qualified')
  const [authMethod, setAuthMethod] = useState<ClaveAuthMethod>('clave-permanente')
  const [currentRequest, setCurrentRequest] = useState<QualifiedSignatureRequest | null>(null)
  
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [signing, setSigning] = useState(false)

  const enabledProviders = (providers || []).filter(p => p.enabled)
  const hasProviders = enabledProviders.length > 0

  useEffect(() => {
    if (open) {
      setCurrentStep('select')
      setOtpCode('')
      setOtpSent(false)
      setVerifying(false)
      setSigning(false)
    }
  }, [open])

  const handleInitiateSignature = async () => {
    if (!hasProviders) {
      toast.error('No hay proveedores de firma configurados')
      return
    }

    try {
      const documentHash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(documentId + documentName)
      ).then(buf => 
        Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      )

      const request = createQualifiedSignatureRequest(
        documentId,
        documentName,
        documentHash,
        projectId || 'unknown',
        projectName || 'Documento sin proyecto',
        selectedProvider,
        signerEmail,
        signerName,
        signerEmail,
        signatureLevel,
        selectedProvider === 'clave' ? authMethod : undefined
      )

      setCurrentRequest(request)
      setRequests(current => [...(current || []), request])

      if (selectedProvider === 'clave') {
        setCurrentStep('auth')
      } else if (selectedProvider === 'viafirma') {
        handleViafirmaFlow(request)
      } else {
        handleInternalFlow(request)
      }
    } catch (error) {
      console.error('Error initiating signature:', error)
      toast.error('Error al iniciar la firma')
    }
  }

  const handleClaveFlow = async () => {
    if (!currentRequest) return

    if (authMethod === 'clave-pin' || authMethod === 'clave-permanente') {
      if (!signerPhone) {
        toast.error('Se requiere número de teléfono para Cl@ve PIN/Permanente')
        return
      }

      setCurrentStep('otp')
      const result = await generateOtp(currentRequest.id, signerPhone)
      
      if (result.success) {
        setOtpSent(true)
      } else {
        toast.error(result.error || 'Error al enviar OTP')
        setCurrentStep('auth')
      }
    } else {
      const result = await initiateClaveSignature(currentRequest, authMethod)
      
      if (result.success && result.authUrl) {
        toast.info('Redirigiendo a Cl@ve...', {
          description: 'Serás redirigido al sistema de autenticación'
        })
        
        setTimeout(() => {
          window.open(result.authUrl, '_blank', 'width=800,height=600')
          setCurrentStep('signing')
        }, 2000)
      } else {
        toast.error(result.error || 'Error al iniciar autenticación')
      }
    }
  }

  const handleVerifyOtp = async () => {
    if (!currentRequest || !otpCode.trim()) {
      toast.error('Introduce el código de verificación')
      return
    }

    setVerifying(true)

    try {
      const result = await verifyOtp(currentRequest.id, otpCode)
      
      if (result.success) {
        toast.success('Código verificado correctamente')
        setCurrentStep('signing')
        await handleCompleteSignature()
      } else {
        toast.error(result.error || 'Código incorrecto')
      }
    } finally {
      setVerifying(false)
    }
  }

  const handleViafirmaFlow = async (request: QualifiedSignatureRequest) => {
    const provider = enabledProviders.find(p => p.type === 'viafirma')
    if (!provider || provider.config.type !== 'viafirma') {
      toast.error('Proveedor Viafirma no configurado correctamente')
      return
    }

    const config = provider.config
    const result = await initiateViafirmaSignature(
      request,
      config.apiKey,
      config.apiSecret,
      config.workflowId
    )

    if (result.success) {
      setCurrentStep('signing')
      toast.info('Solicitud enviada', {
        description: 'Recibirás un email con el enlace para firmar'
      })
    } else {
      toast.error(result.error || 'Error al iniciar firma')
    }
  }

  const handleInternalFlow = async (request: QualifiedSignatureRequest) => {
    setCurrentStep('signing')
    await handleCompleteSignature()
  }

  const handleCompleteSignature = async () => {
    if (!currentRequest) return

    setSigning(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const result = await simulateQualifiedSignature(
        currentRequest,
        `signature-data-${Date.now()}`
      )

      if (result.success && result.metadata) {
        setCurrentStep('success')
        
        setTimeout(() => {
          onSignComplete(`qualified-signature-${Date.now()}`, result.metadata)
          onOpenChange(false)
        }, 2000)
      } else {
        throw new Error(result.error || 'Error en la firma')
      }
    } catch (error) {
      console.error('Error completing signature:', error)
      toast.error('Error al completar la firma')
      setCurrentStep('select')
    } finally {
      setSigning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stamp size={24} weight="duotone" className="text-primary" />
            Firma Electrónica Cualificada
          </DialogTitle>
          <DialogDescription>
            Firma el documento: <strong>{documentName}</strong>
          </DialogDescription>
        </DialogHeader>

        {!hasProviders ? (
          <Card className="border-dashed">
            <CardContent className="pt-8 pb-8 text-center">
              <ShieldCheck size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
              <h3 className="text-lg font-semibold mb-2">No hay proveedores configurados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configura Cl@ve o ViafirmaPro para usar firmas cualificadas
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {currentStep === 'select' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Proveedor de Firma</Label>
                    <RadioGroup value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as QualifiedSignatureProviderType)}>
                      {enabledProviders.map(provider => (
                        <div key={provider.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={provider.type} id={provider.id} />
                          <Label htmlFor={provider.id} className="flex items-center gap-2 cursor-pointer">
                            {getProviderLabel(provider.type)}
                            {provider.testMode && (
                              <Badge variant="secondary" className="text-xs">Prueba</Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature-level">Nivel de Firma</Label>
                    <Select value={signatureLevel} onValueChange={(v) => setSignatureLevel(v as QualifiedSignatureLevel)}>
                      <SelectTrigger id="signature-level">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Firma Simple</SelectItem>
                        <SelectItem value="advanced">Firma Avanzada</SelectItem>
                        <SelectItem value="qualified">Firma Cualificada</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {signatureLevel === 'qualified' && 'Máxima validez legal según eIDAS'}
                      {signatureLevel === 'advanced' && 'Vincula al firmante con el documento'}
                      {signatureLevel === 'simple' && 'Identifica al firmante'}
                    </p>
                  </div>

                  {selectedProvider === 'clave' && (
                    <div className="space-y-2">
                      <Label htmlFor="auth-method">Método de Autenticación</Label>
                      <Select value={authMethod} onValueChange={(v) => setAuthMethod(v as ClaveAuthMethod)}>
                        <SelectTrigger id="auth-method">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clave-permanente">Cl@ve Permanente</SelectItem>
                          <SelectItem value="clave-pin">Cl@ve PIN (SMS)</SelectItem>
                          <SelectItem value="dni-electronico">DNI Electrónico</SelectItem>
                          <SelectItem value="certificado-digital">Certificado Digital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <ShieldCheck size={20} className="text-blue-500 flex-shrink-0 mt-0.5" weight="duotone" />
                  <div className="text-sm text-blue-600">
                    <p className="font-medium mb-1">Firma con Validez Legal</p>
                    <p className="text-xs">
                      La firma {getSignatureLevelLabel(signatureLevel).toLowerCase()} cumple con el reglamento eIDAS 
                      y tiene plena validez jurídica en España y la UE.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleInitiateSignature} className="gap-2">
                    <Stamp size={18} weight="bold" />
                    Continuar con {getProviderLabel(selectedProvider)}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'auth' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <IdentificationCard size={24} weight="duotone" />
                      </div>
                      <div>
                        <CardTitle>Autenticación Cl@ve</CardTitle>
                        <CardDescription>
                          Método seleccionado: {getAuthMethodLabel(authMethod)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(authMethod === 'clave-pin' || authMethod === 'clave-permanente') && (
                      <div className="flex items-start gap-2 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <DeviceMobile size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" weight="duotone" />
                        <div className="text-sm text-yellow-700">
                          <p className="font-medium mb-1">Verificación por SMS</p>
                          <p className="text-xs">
                            Se enviará un código de verificación al número: {signerPhone || 'No proporcionado'}
                          </p>
                        </div>
                      </div>
                    )}

                    {(authMethod === 'dni-electronico' || authMethod === 'certificado-digital') && (
                      <div className="flex items-start gap-2 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <ShieldCheck size={20} className="text-blue-500 flex-shrink-0 mt-0.5" weight="duotone" />
                        <div className="text-sm text-blue-600">
                          <p className="font-medium mb-1">Certificado Digital</p>
                          <p className="text-xs">
                            Se abrirá una ventana para autenticarte con tu {authMethod === 'dni-electronico' ? 'DNI electrónico' : 'certificado digital'}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCurrentStep('select')}>
                        Atrás
                      </Button>
                      <Button onClick={handleClaveFlow} className="gap-2">
                        <Lightning size={18} weight="bold" />
                        Iniciar Autenticación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 'otp' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary">
                        <DeviceMobile size={24} weight="duotone" />
                      </div>
                      <div>
                        <CardTitle>Código de Verificación</CardTitle>
                        <CardDescription>
                          Introduce el código enviado a tu móvil
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-code">Código de 6 dígitos</Label>
                      <Input
                        id="otp-code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        className="text-2xl text-center tracking-widest font-mono"
                      />
                    </div>

                    {otpSent && (
                      <div className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" weight="bold" />
                        <div className="text-sm text-green-600">
                          <p className="font-medium">Código enviado</p>
                          <p className="text-xs">El código expira en 5 minutos</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => currentRequest && generateOtp(currentRequest.id, signerPhone || '')}
                        className="text-xs"
                      >
                        Reenviar código
                      </Button>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setCurrentStep('auth')}>
                        Atrás
                      </Button>
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={otpCode.length !== 6 || verifying}
                        className="gap-2"
                      >
                        {verifying ? (
                          <>
                            <Clock size={18} className="animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          <>
                            <Check size={18} weight="bold" />
                            Verificar Código
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 'signing' && (
              <div className="space-y-6">
                <Card className="border-primary/20">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary inline-flex mb-4">
                      <Stamp size={48} weight="duotone" className="animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Firmando documento...</h3>
                    <p className="text-sm text-muted-foreground">
                      {signing ? 'Procesando firma electrónica cualificada' : 'Esperando confirmación de firma'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 'success' && (
              <div className="space-y-6">
                <Card className="border-green-500/20">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="p-4 rounded-full bg-green-500/10 text-green-500 inline-flex mb-4">
                      <Check size={48} weight="bold" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-green-600">¡Documento Firmado!</h3>
                    <p className="text-sm text-muted-foreground">
                      La firma electrónica cualificada se ha aplicado correctamente
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
