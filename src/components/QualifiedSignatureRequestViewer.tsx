import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { QualifiedSignatureRequest } from '@/lib/qualified-signature-types'
import {
  getSignatureStatusLabel,
  getSignatureStatusColor,
  getProviderLabel,
  getSignatureLevelLabel,
  getTimeRemaining,
  isSignatureExpired
} from '@/lib/qualified-signature-service'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Stamp, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  User,
  Calendar,
  ShieldCheck
} from '@phosphor-icons/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function QualifiedSignatureRequestViewer() {
  const [requests] = useKV<QualifiedSignatureRequest[]>('qsig-requests', [])
  const [open, setOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<QualifiedSignatureRequest | null>(null)

  const pendingRequests = (requests || []).filter(r => 
    r.status === 'pending' || r.status === 'awaiting-otp' || r.status === 'signing'
  )
  const signedRequests = (requests || []).filter(r => r.status === 'signed')
  const failedRequests = (requests || []).filter(r => 
    r.status === 'rejected' || r.status === 'failed' || r.status === 'expired' || r.status === 'cancelled'
  )

  const handleViewDetails = (request: QualifiedSignatureRequest) => {
    setSelectedRequest(request)
  }

  const RequestCard = ({ request }: { request: QualifiedSignatureRequest }) => (
    <Card 
      className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => handleViewDetails(request)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText size={20} weight="duotone" />
            </div>
            <div>
              <CardTitle className="text-base">{request.documentName}</CardTitle>
              <CardDescription className="mt-1">
                {request.projectName}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getSignatureStatusColor(request.status)}
          >
            {getSignatureStatusLabel(request.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={16} />
            <span>{request.signerName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck size={16} />
            <span>{getProviderLabel(request.provider)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span>{formatDistanceToNow(request.createdAt, { addSuffix: true, locale: es })}</span>
          </div>
          {request.expiresAt && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              <span className={isSignatureExpired(request) ? 'text-red-500' : ''}>
                {isSignatureExpired(request) ? 'Expirado' : `Expira: ${getTimeRemaining(request.expiresAt)}`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Stamp size={16} weight="duotone" />
          Solicitudes de Firma
          {pendingRequests.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Stamp size={24} weight="duotone" />
            </div>
            Solicitudes de Firma Cualificada
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pending" className="flex-1">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock size={16} weight="duotone" />
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="signed" className="gap-2">
              <CheckCircle size={16} weight="duotone" />
              Firmados ({signedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="failed" className="gap-2">
              <XCircle size={16} weight="duotone" />
              Fallidos ({failedRequests.length})
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="pending" className="mt-0">
              {pendingRequests.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-8 pb-8 text-center">
                    <Clock size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">No hay solicitudes pendientes</h3>
                    <p className="text-sm text-muted-foreground">
                      Las solicitudes de firma aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signed" className="mt-0">
              {signedRequests.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-8 pb-8 text-center">
                    <CheckCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">No hay documentos firmados</h3>
                    <p className="text-sm text-muted-foreground">
                      Los documentos firmados aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {signedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="failed" className="mt-0">
              {failedRequests.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-8 pb-8 text-center">
                    <XCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">No hay solicitudes fallidas</h3>
                    <p className="text-sm text-muted-foreground">
                      Las solicitudes rechazadas o fallidas aparecerán aquí
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {failedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText size={24} weight="duotone" className="text-primary" />
                  Detalles de la Solicitud
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información del Documento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Documento:</span>
                      <span className="font-medium">{selectedRequest.documentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proyecto:</span>
                      <span className="font-medium">{selectedRequest.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hash:</span>
                      <span className="font-mono text-xs">{selectedRequest.documentHash.substring(0, 16)}...</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información del Firmante</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre:</span>
                      <span className="font-medium">{selectedRequest.signerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedRequest.signerEmail}</span>
                    </div>
                    {selectedRequest.signerNif && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NIF:</span>
                        <span className="font-medium">{selectedRequest.signerNif}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Información de la Firma</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <Badge variant="outline">{getProviderLabel(selectedRequest.provider)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nivel:</span>
                      <Badge variant="outline">{getSignatureLevelLabel(selectedRequest.signatureLevel)}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estado:</span>
                      <Badge variant="outline" className={getSignatureStatusColor(selectedRequest.status)}>
                        {getSignatureStatusLabel(selectedRequest.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creada:</span>
                      <span className="font-medium">
                        {new Date(selectedRequest.createdAt).toLocaleString('es-ES')}
                      </span>
                    </div>
                    {selectedRequest.signedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Firmada:</span>
                        <span className="font-medium">
                          {new Date(selectedRequest.signedAt).toLocaleString('es-ES')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedRequest.signatureMetadata && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Metadatos de la Firma</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {selectedRequest.signatureMetadata.certificateSerialNumber && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Número de Serie:</span>
                          <span className="font-mono text-xs">
                            {selectedRequest.signatureMetadata.certificateSerialNumber}
                          </span>
                        </div>
                      )}
                      {selectedRequest.signatureMetadata.certificateIssuer && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Emisor:</span>
                          <span className="text-xs">
                            {selectedRequest.signatureMetadata.certificateIssuer}
                          </span>
                        </div>
                      )}
                      {selectedRequest.signatureMetadata.signatureFormat && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Formato:</span>
                          <Badge variant="secondary">
                            {selectedRequest.signatureMetadata.signatureFormat}
                          </Badge>
                        </div>
                      )}
                      {selectedRequest.signatureMetadata.timestampToken && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span className="font-mono text-xs">
                            {selectedRequest.signatureMetadata.timestampToken.substring(0, 16)}...
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
