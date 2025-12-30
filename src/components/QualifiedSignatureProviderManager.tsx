import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  QualifiedSignatureProvider,
  QualifiedSignatureProviderType,
  ClaveProviderConfig,
  ViafirmaProviderConfig
} from '@/lib/qualified-signature-types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Gear, Stamp, Plus, CheckCircle, XCircle, ShieldCheck } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function QualifiedSignatureProviderManager() {
  const [providers, setProviders] = useKV<QualifiedSignatureProvider[]>('qsig-providers', [])
  const [open, setOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<QualifiedSignatureProvider | null>(null)
  const [providerType, setProviderType] = useState<QualifiedSignatureProviderType>('clave')

  const [name, setName] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [testMode, setTestMode] = useState(true)

  const [claveEntityId, setClaveEntityId] = useState('afo-core-manager')
  const [claveMetadataUrl, setClaveMetadataUrl] = useState('')
  const [claveAssertionUrl, setClaveAssertionUrl] = useState('')
  const [claveSignatureAlg, setClaveSignatureAlg] = useState<'SHA256' | 'SHA512'>('SHA256')
  const [claveValidateCerts, setClaveValidateCerts] = useState(true)

  const [viafirmaApiKey, setViafirmaApiKey] = useState('')
  const [viafirmaApiSecret, setViafirmaApiSecret] = useState('')
  const [viafirmaEndpoint, setViafirmaEndpoint] = useState('https://api.viafirma.com/v1')
  const [viafirmaWorkflowId, setViafirmaWorkflowId] = useState('')
  const [viafirmaFormat, setViafirmaFormat] = useState<'PAdES' | 'XAdES' | 'CAdES'>('PAdES')
  const [viafirmaLevel, setViafirmaLevel] = useState<'B' | 'T' | 'LT' | 'LTA'>('LTA')
  const [viafirmaTimestamp, setViafirmaTimestamp] = useState(true)

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('El nombre del proveedor es obligatorio')
      return
    }

    let config: ClaveProviderConfig | ViafirmaProviderConfig

    if (providerType === 'clave') {
      config = {
        type: 'clave',
        entityId: claveEntityId,
        metadataUrl: claveMetadataUrl,
        assertionConsumerServiceUrl: claveAssertionUrl,
        singleLogoutServiceUrl: '',
        signatureAlgorithm: claveSignatureAlg,
        validateCertificates: claveValidateCerts
      }
    } else if (providerType === 'viafirma') {
      if (!viafirmaApiKey || !viafirmaApiSecret) {
        toast.error('API Key y API Secret son obligatorios para Viafirma')
        return
      }
      config = {
        type: 'viafirma',
        apiKey: viafirmaApiKey,
        apiSecret: viafirmaApiSecret,
        endpointUrl: viafirmaEndpoint,
        workflowId: viafirmaWorkflowId,
        signatureFormat: viafirmaFormat,
        signatureLevel: viafirmaLevel,
        timestampEnabled: viafirmaTimestamp
      }
    } else {
      config = {
        type: 'clave',
        entityId: 'internal',
        metadataUrl: '',
        assertionConsumerServiceUrl: '',
        singleLogoutServiceUrl: '',
        signatureAlgorithm: 'SHA256',
        validateCertificates: false
      }
    }

    const provider: QualifiedSignatureProvider = {
      id: editingProvider?.id || `provider-${Date.now()}`,
      name,
      type: providerType,
      enabled,
      config,
      testMode,
      createdAt: editingProvider?.createdAt || Date.now(),
      updatedAt: Date.now()
    }

    setProviders(current => {
      if (editingProvider) {
        return (current || []).map(p => p.id === editingProvider.id ? provider : p)
      }
      return [...(current || []), provider]
    })

    toast.success(editingProvider ? 'Proveedor actualizado' : 'Proveedor creado')
    handleClose()
  }

  const handleEdit = (provider: QualifiedSignatureProvider) => {
    setEditingProvider(provider)
    setName(provider.name)
    setProviderType(provider.type)
    setEnabled(provider.enabled)
    setTestMode(provider.testMode)

    if (provider.config.type === 'clave') {
      const config = provider.config as ClaveProviderConfig
      setClaveEntityId(config.entityId)
      setClaveMetadataUrl(config.metadataUrl)
      setClaveAssertionUrl(config.assertionConsumerServiceUrl)
      setClaveSignatureAlg(config.signatureAlgorithm)
      setClaveValidateCerts(config.validateCertificates)
    } else if (provider.config.type === 'viafirma') {
      const config = provider.config as ViafirmaProviderConfig
      setViafirmaApiKey(config.apiKey)
      setViafirmaApiSecret(config.apiSecret)
      setViafirmaEndpoint(config.endpointUrl)
      setViafirmaWorkflowId(config.workflowId || '')
      setViafirmaFormat(config.signatureFormat)
      setViafirmaLevel(config.signatureLevel)
      setViafirmaTimestamp(config.timestampEnabled)
    }

    setOpen(true)
  }

  const handleDelete = (id: string) => {
    setProviders(current => (current || []).filter(p => p.id !== id))
    toast.success('Proveedor eliminado')
  }

  const handleToggleEnabled = (id: string, enabled: boolean) => {
    setProviders(current =>
      (current || []).map(p => p.id === id ? { ...p, enabled, updatedAt: Date.now() } : p)
    )
    toast.success(enabled ? 'Proveedor activado' : 'Proveedor desactivado')
  }

  const handleClose = () => {
    setOpen(false)
    setEditingProvider(null)
    setName('')
    setProviderType('clave')
    setEnabled(true)
    setTestMode(true)
    setClaveEntityId('afo-core-manager')
    setClaveMetadataUrl('')
    setClaveAssertionUrl('')
    setClaveSignatureAlg('SHA256')
    setClaveValidateCerts(true)
    setViafirmaApiKey('')
    setViafirmaApiSecret('')
    setViafirmaEndpoint('https://api.viafirma.com/v1')
    setViafirmaWorkflowId('')
    setViafirmaFormat('PAdES')
    setViafirmaLevel('LTA')
    setViafirmaTimestamp(true)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Stamp size={16} weight="duotone" />
          Proveedores de Firma
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Stamp size={24} weight="duotone" />
            </div>
            Proveedores de Firma Electrónica Cualificada
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="list" className="flex-1">
          <TabsList>
            <TabsTrigger value="list">Proveedores Configurados</TabsTrigger>
            <TabsTrigger value="new">
              <Plus size={16} className="mr-2" />
              {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="list" className="mt-0">
              {(providers || []).length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-8 pb-8 text-center">
                    <ShieldCheck size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">No hay proveedores configurados</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configura Cl@ve o ViafirmaPro para habilitar firmas cualificadas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {(providers || []).map(provider => (
                    <Card key={provider.id} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <Stamp size={20} weight="duotone" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{provider.name}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {provider.type === 'clave' ? 'Cl@ve' : provider.type === 'viafirma' ? 'ViafirmaPro' : 'Interno'}
                                </Badge>
                                {provider.testMode && (
                                  <Badge variant="secondary" className="text-xs">
                                    Modo Prueba
                                  </Badge>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {provider.enabled ? (
                              <CheckCircle size={20} weight="duotone" className="text-green-500" />
                            ) : (
                              <XCircle size={20} weight="duotone" className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(provider)}
                          >
                            <Gear size={16} className="mr-2" />
                            Configurar
                          </Button>
                          <Button
                            variant={provider.enabled ? 'secondary' : 'default'}
                            size="sm"
                            onClick={() => handleToggleEnabled(provider.id, !provider.enabled)}
                          >
                            {provider.enabled ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(provider.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="new" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Nombre del Proveedor</Label>
                    <Input
                      id="provider-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ej. Cl@ve Producción"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provider-type">Tipo de Proveedor</Label>
                    <Select value={providerType} onValueChange={(v) => setProviderType(v as QualifiedSignatureProviderType)}>
                      <SelectTrigger id="provider-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clave">Cl@ve (Gobierno de España)</SelectItem>
                        <SelectItem value="viafirma">ViafirmaPro</SelectItem>
                        <SelectItem value="internal">Firma Interna (Demo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Proveedor Activo</Label>
                      <p className="text-xs text-muted-foreground">Permitir usar este proveedor para firmas</p>
                    </div>
                    <Switch checked={enabled} onCheckedChange={setEnabled} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Modo de Prueba</Label>
                      <p className="text-xs text-muted-foreground">Usar entorno de prueba del proveedor</p>
                    </div>
                    <Switch checked={testMode} onCheckedChange={setTestMode} />
                  </div>
                </CardContent>
              </Card>

              {providerType === 'clave' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración Cl@ve</CardTitle>
                    <CardDescription>
                      Configura la integración con el sistema Cl@ve del Gobierno de España
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clave-entity-id">Entity ID</Label>
                      <Input
                        id="clave-entity-id"
                        value={claveEntityId}
                        onChange={(e) => setClaveEntityId(e.target.value)}
                        placeholder="afo-core-manager"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clave-metadata-url">URL de Metadatos SAML</Label>
                      <Input
                        id="clave-metadata-url"
                        value={claveMetadataUrl}
                        onChange={(e) => setClaveMetadataUrl(e.target.value)}
                        placeholder="https://clave.gob.es/metadata"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clave-assertion-url">Assertion Consumer Service URL</Label>
                      <Input
                        id="clave-assertion-url"
                        value={claveAssertionUrl}
                        onChange={(e) => setClaveAssertionUrl(e.target.value)}
                        placeholder={`${window.location.origin}/signature-callback`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clave-signature-alg">Algoritmo de Firma</Label>
                      <Select value={claveSignatureAlg} onValueChange={(v) => setClaveSignatureAlg(v as 'SHA256' | 'SHA512')}>
                        <SelectTrigger id="clave-signature-alg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SHA256">SHA-256</SelectItem>
                          <SelectItem value="SHA512">SHA-512</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Validar Certificados</Label>
                        <p className="text-xs text-muted-foreground">Verificar cadena de certificados SAML</p>
                      </div>
                      <Switch checked={claveValidateCerts} onCheckedChange={setClaveValidateCerts} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {providerType === 'viafirma' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración ViafirmaPro</CardTitle>
                    <CardDescription>
                      Configura la integración con ViafirmaPro para firmas cualificadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="viafirma-api-key">API Key</Label>
                      <Input
                        id="viafirma-api-key"
                        type="password"
                        value={viafirmaApiKey}
                        onChange={(e) => setViafirmaApiKey(e.target.value)}
                        placeholder="API Key de ViafirmaPro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="viafirma-api-secret">API Secret</Label>
                      <Input
                        id="viafirma-api-secret"
                        type="password"
                        value={viafirmaApiSecret}
                        onChange={(e) => setViafirmaApiSecret(e.target.value)}
                        placeholder="API Secret de ViafirmaPro"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="viafirma-endpoint">Endpoint API</Label>
                      <Input
                        id="viafirma-endpoint"
                        value={viafirmaEndpoint}
                        onChange={(e) => setViafirmaEndpoint(e.target.value)}
                        placeholder="https://api.viafirma.com/v1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="viafirma-workflow">Workflow ID (Opcional)</Label>
                      <Input
                        id="viafirma-workflow"
                        value={viafirmaWorkflowId}
                        onChange={(e) => setViafirmaWorkflowId(e.target.value)}
                        placeholder="ID del workflow de firma"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="viafirma-format">Formato de Firma</Label>
                        <Select value={viafirmaFormat} onValueChange={(v) => setViafirmaFormat(v as 'PAdES' | 'XAdES' | 'CAdES')}>
                          <SelectTrigger id="viafirma-format">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PAdES">PAdES (PDF)</SelectItem>
                            <SelectItem value="XAdES">XAdES (XML)</SelectItem>
                            <SelectItem value="CAdES">CAdES (Binary)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="viafirma-level">Nivel de Firma</Label>
                        <Select value={viafirmaLevel} onValueChange={(v) => setViafirmaLevel(v as 'B' | 'T' | 'LT' | 'LTA')}>
                          <SelectTrigger id="viafirma-level">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="B">B-Level (Básico)</SelectItem>
                            <SelectItem value="T">T-Level (Con Timestamp)</SelectItem>
                            <SelectItem value="LT">LT-Level (Long Term)</SelectItem>
                            <SelectItem value="LTA">LTA-Level (Archive)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Timestamp Automático</Label>
                        <p className="text-xs text-muted-foreground">Añadir sello de tiempo a las firmas</p>
                      </div>
                      <Switch checked={viafirmaTimestamp} onCheckedChange={setViafirmaTimestamp} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {providerType === 'internal' && (
                <Card className="border-dashed">
                  <CardContent className="pt-8 pb-8 text-center">
                    <ShieldCheck size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">Firma Interna (Modo Demo)</h3>
                    <p className="text-sm text-muted-foreground">
                      Este proveedor usa firmas simuladas para pruebas. No es válido legalmente.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingProvider ? 'Actualizar Proveedor' : 'Crear Proveedor'}
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
