import { useState } from 'react'
import { Document, Project, DocumentType, DOCUMENT_TYPE_LABELS } from '@/lib/types'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UploadSimple, Info } from '@phosphor-icons/react'
import { generateVersionNumber, generateStandardizedFileName, validateFileName } from '@/lib/document-utils'
import { toast } from 'sonner'

interface DocumentUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  folders: string[]
  onUpload: (document: Document) => void
}

export function DocumentUploadDialog({ 
  open, 
  onOpenChange, 
  project,
  folders,
  onUpload 
}: DocumentUploadDialogProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<DocumentType>('plano')
  const [folder, setFolder] = useState(folders[0] || '')
  const [discipline, setDiscipline] = useState('')
  const [description, setDescription] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(1000000)
  const [useStandardNaming, setUseStandardNaming] = useState(true)

  const handleUpload = () => {
    const nameValidation = validateFileName(name)
    if (!nameValidation.valid) {
      toast.error(nameValidation.error)
      return
    }

    if (!folder) {
      toast.error('Debe seleccionar una carpeta')
      return
    }

    const version = generateVersionNumber(1, 1, 'draft')
    const extension = 'pdf'
    
    const finalFileName = useStandardNaming && discipline && description
      ? generateStandardizedFileName(
          project.title.substring(0, 10),
          discipline,
          description,
          version,
          extension
        )
      : `${name}.${extension}`

    const now = Date.now()
    
    const newDocument: Document = {
      id: now.toString(),
      projectId: project.id,
      name,
      type,
      folder,
      currentVersion: version,
      versions: [
        {
          id: `${now}-v1`,
          version,
          fileName: finalFileName,
          fileSize,
          uploadedAt: now,
          uploadedBy: 'Usuario',
          status: 'draft',
          notes: 'Versión inicial'
        }
      ],
      createdAt: now,
      updatedAt: now,
      metadata: {
        discipline: discipline || undefined,
        description: description || undefined,
        format: extension,
        application: 'AFO CORE MANAGER'
      }
    }

    onUpload(newDocument)
    toast.success('Documento subido correctamente')
    
    setName('')
    setDiscipline('')
    setDescription('')
    setFileName('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadSimple size={24} weight="duotone" />
            Subir Nuevo Documento
          </DialogTitle>
          <DialogDescription>
            Complete la información del documento para agregarlo al proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info size={18} weight="duotone" />
            <AlertDescription className="text-xs">
              Esta es una simulación. En producción, aquí se cargaría el archivo real desde su sistema.
              El documento se creará con valores de ejemplo.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Documento *</Label>
            <Input
              id="name"
              placeholder="Ej: Planta Baja Principal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Documento *</Label>
              <Select value={type} onValueChange={(val) => setType(val as DocumentType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder">Carpeta *</Label>
              <Select value={folder} onValueChange={setFolder}>
                <SelectTrigger id="folder">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discipline">Disciplina (opcional)</Label>
            <Input
              id="discipline"
              placeholder="Ej: ARQ, EST, INS"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Usado para nomenclatura estandarizada según ISO 19650-2
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descripción breve del contenido del documento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {discipline && description && (
            <Alert>
              <Info size={18} weight="duotone" />
              <AlertDescription className="text-xs">
                <strong>Nombre estandarizado:</strong>{' '}
                {generateStandardizedFileName(
                  project.title.substring(0, 10),
                  discipline,
                  description,
                  'P01.01',
                  'pdf'
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!name || !folder}>
            Subir Documento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
