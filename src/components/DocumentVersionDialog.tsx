import { useState } from 'react'
import { Document, DocumentStatus } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Clock, 
  CheckCircle, 
  ShareNetwork, 
  File,
  Plus,
  ArrowsClockwise,
  Download
} from '@phosphor-icons/react'
import { formatFileSize, sortVersions, getNextVersion } from '@/lib/document-utils'
import { toast } from 'sonner'

interface DocumentVersionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document
  onUpdate: (document: Document) => void
}

export function DocumentVersionDialog({ 
  open, 
  onOpenChange, 
  document,
  onUpdate 
}: DocumentVersionDialogProps) {
  const [newVersionStatus, setNewVersionStatus] = useState<DocumentStatus>('draft')
  const [newVersionNotes, setNewVersionNotes] = useState('')

  const sortedVersions = sortVersions(document.versions)
  const latestVersion = sortedVersions[0]

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} weight="fill" className="text-primary" />
      case 'shared':
        return <ShareNetwork size={16} weight="duotone" className="text-accent" />
      default:
        return <Clock size={16} weight="duotone" className="text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return 'Aprobado'
      case 'shared':
        return 'Compartido'
      default:
        return 'Borrador'
    }
  }

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-primary text-primary-foreground'
      case 'shared':
        return 'bg-accent text-accent-foreground'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleAddVersion = () => {
    if (!newVersionNotes.trim()) {
      toast.error('Debe agregar notas para la nueva versión')
      return
    }

    const newVersionNumber = getNextVersion(latestVersion.version, newVersionStatus)
    const now = Date.now()

    const newVersion = {
      id: `${document.id}-v${now}`,
      version: newVersionNumber,
      fileName: document.name,
      fileSize: latestVersion.fileSize + Math.random() * 10000,
      uploadedAt: now,
      uploadedBy: 'Usuario',
      status: newVersionStatus,
      notes: newVersionNotes
    }

    const updatedDocument = {
      ...document,
      currentVersion: newVersionNumber,
      versions: [...document.versions, newVersion],
      updatedAt: now
    }

    onUpdate(updatedDocument)
    setNewVersionNotes('')
    toast.success('Nueva versión creada correctamente')
  }

  const handleChangeStatus = (versionId: string, newStatus: DocumentStatus) => {
    const updatedVersions = document.versions.map(v => {
      if (v.id === versionId) {
        const newVersionNumber = getNextVersion(v.version, newStatus)
        return { ...v, status: newStatus, version: newVersionNumber }
      }
      return v
    })

    const updatedDocument = {
      ...document,
      versions: updatedVersions,
      currentVersion: sortVersions(updatedVersions)[0].version,
      updatedAt: Date.now()
    }

    onUpdate(updatedDocument)
    toast.success('Estado actualizado correctamente')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <File size={28} weight="duotone" className="text-primary" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            Control de versiones y estado del documento
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-0">
          <div className="md:col-span-2 flex flex-col gap-4 overflow-hidden min-h-0">
            <div className="flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-semibold text-lg">Historial de Versiones</h3>
                <p className="text-sm text-muted-foreground">
                  {document.versions.length} versiones
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(latestVersion.status)}
                <Badge className={getStatusColor(latestVersion.status)}>
                  {latestVersion.version}
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1 pr-4 min-h-0">
              <div className="space-y-3 pb-4">
                {sortedVersions.map((version, index) => (
                  <div 
                    key={version.id} 
                    className={`p-4 rounded-lg border ${
                      index === 0 ? 'border-primary bg-primary/5' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(version.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold font-mono">{version.version}</span>
                            {index === 0 && (
                              <Badge variant="outline" className="text-xs">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(version.uploadedAt).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(version.status)}>
                        {getStatusLabel(version.status)}
                      </Badge>
                    </div>

                    {version.notes && (
                      <p className="text-sm text-muted-foreground mb-3 mt-2">
                        {version.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(version.fileSize)}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 gap-1">
                          <Download size={14} />
                          Descargar
                        </Button>
                        {version.status === 'draft' && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 gap-1"
                            onClick={() => handleChangeStatus(version.id, 'shared')}
                          >
                            <ShareNetwork size={14} />
                            Compartir
                          </Button>
                        )}
                        {version.status === 'shared' && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 gap-1"
                            onClick={() => handleChangeStatus(version.id, 'approved')}
                          >
                            <CheckCircle size={14} />
                            Aprobar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Información del Documento</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Tipo</p>
                  <p className="font-medium">{document.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Carpeta</p>
                  <p className="font-medium">{document.folder}</p>
                </div>
                {document.metadata.discipline && (
                  <div>
                    <p className="text-muted-foreground mb-1">Disciplina</p>
                    <p className="font-medium">{document.metadata.discipline}</p>
                  </div>
                )}
                {document.metadata.description && (
                  <div>
                    <p className="text-muted-foreground mb-1">Descripción</p>
                    <p className="text-sm">{document.metadata.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Formato</p>
                  <p className="font-medium uppercase">{document.metadata.format}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Plus size={18} weight="bold" />
                Nueva Versión
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={newVersionStatus} onValueChange={(val) => setNewVersionStatus(val as DocumentStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="shared">Compartido</SelectItem>
                      <SelectItem value="approved">Aprobado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas de la versión</Label>
                  <Textarea
                    id="notes"
                    placeholder="Cambios realizados en esta versión..."
                    value={newVersionNotes}
                    onChange={(e) => setNewVersionNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleAddVersion} 
                  className="w-full gap-2"
                  disabled={!newVersionNotes.trim()}
                >
                  <ArrowsClockwise size={18} weight="bold" />
                  Crear Versión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
