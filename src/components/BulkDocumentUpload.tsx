import { useState, useRef, useCallback } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  UploadSimple, 
  X, 
  File, 
  CheckCircle, 
  WarningCircle,
  FilePdf,
  FileDoc,
  FileImage
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Document, DocumentType, DocumentVersion, Project, DOCUMENT_TYPE_LABELS } from '@/lib/types'
import { generateVersionNumber, formatFileSize, validateFileName } from '@/lib/document-utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FileUploadItem {
  id: string
  file: File
  type: DocumentType
  folder: string
  discipline: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface BulkDocumentUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  folders: string[]
  onUpload: (documents: Document[]) => void
}

export function BulkDocumentUpload({
  open,
  onOpenChange,
  project,
  folders,
  onUpload
}: BulkDocumentUploadProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [defaultType, setDefaultType] = useState<DocumentType>('plano')
  const [defaultFolder, setDefaultFolder] = useState(folders[0] || '')
  const [defaultDiscipline, setDefaultDiscipline] = useState('ARQ')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf':
        return <FilePdf size={24} weight="duotone" className="text-red-500" />
      case 'doc':
      case 'docx':
        return <FileDoc size={24} weight="duotone" className="text-blue-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage size={24} weight="duotone" className="text-green-500" />
      case 'dwg':
      case 'dxf':
        return <File size={24} weight="duotone" className="text-yellow-500" />
      default:
        return <File size={24} weight="duotone" className="text-muted-foreground" />
    }
  }

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: FileUploadItem[] = []
    
    Array.from(fileList).forEach(file => {
      const validation = validateFileName(file.name)
      
      const fileItem: FileUploadItem = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        type: defaultType,
        folder: defaultFolder,
        discipline: defaultDiscipline,
        status: validation.valid ? 'pending' : 'error',
        progress: 0,
        error: validation.error
      }
      
      newFiles.push(fileItem)
    })
    
    setFiles(prev => [...prev, ...newFiles])
  }, [defaultType, defaultFolder, defaultDiscipline])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const updateFileProperty = <K extends keyof FileUploadItem>(
    id: string,
    key: K,
    value: FileUploadItem[K]
  ) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f))
  }

  const simulateUpload = (fileItem: FileUploadItem): Promise<void> => {
    return new Promise((resolve) => {
      updateFileProperty(fileItem.id, 'status', 'uploading')
      
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          updateFileProperty(fileItem.id, 'progress', 100)
          updateFileProperty(fileItem.id, 'status', 'success')
          resolve()
        } else {
          updateFileProperty(fileItem.id, 'progress', Math.min(progress, 95))
        }
      }, 200)
    })
  }

  const handleUpload = async () => {
    const validFiles = files.filter(f => f.status === 'pending')
    
    if (validFiles.length === 0) {
      toast.error('No hay archivos válidos para subir')
      return
    }

    setIsUploading(true)

    const uploadPromises = validFiles.map(fileItem => simulateUpload(fileItem))
    await Promise.all(uploadPromises)

    const uploadedDocuments: Document[] = validFiles.map(fileItem => {
      const version: DocumentVersion = {
        id: `${Date.now()}-${Math.random()}`,
        version: generateVersionNumber(1, 1, 'draft'),
        fileName: fileItem.file.name,
        fileSize: fileItem.file.size,
        uploadedAt: Date.now(),
        uploadedBy: 'current-user',
        status: 'draft'
      }

      const document: Document = {
        id: `doc-${Date.now()}-${Math.random()}`,
        projectId: project.id,
        name: fileItem.file.name.replace(/\.[^/.]+$/, ''),
        type: fileItem.type,
        folder: fileItem.folder,
        currentVersion: version.version,
        versions: [version],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        metadata: {
          discipline: fileItem.discipline,
          format: fileItem.file.name.split('.').pop(),
          description: ''
        }
      }

      return document
    })

    onUpload(uploadedDocuments)
    
    toast.success(`${uploadedDocuments.length} documento${uploadedDocuments.length > 1 ? 's' : ''} subido${uploadedDocuments.length > 1 ? 's' : ''} correctamente`)
    
    setIsUploading(false)
    setFiles([])
    onOpenChange(false)
  }

  const totalFiles = files.length
  const successFiles = files.filter(f => f.status === 'success').length
  const errorFiles = files.filter(f => f.status === 'error').length
  const pendingFiles = files.filter(f => f.status === 'pending').length
  const uploadingFiles = files.filter(f => f.status === 'uploading').length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Subida Masiva de Documentos</DialogTitle>
          <DialogDescription>
            Arrastre múltiples archivos o haga clic para seleccionar. Configure el tipo y carpeta por defecto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div>
            <Label htmlFor="default-type">Tipo por defecto</Label>
            <Select value={defaultType} onValueChange={(val) => setDefaultType(val as DocumentType)}>
              <SelectTrigger id="default-type">
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

          <div>
            <Label htmlFor="default-folder">Carpeta por defecto</Label>
            <Select value={defaultFolder} onValueChange={setDefaultFolder}>
              <SelectTrigger id="default-folder">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map(folder => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="default-discipline">Disciplina por defecto</Label>
            <Select value={defaultDiscipline} onValueChange={setDefaultDiscipline}>
              <SelectTrigger id="default-discipline">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARQ">Arquitectura</SelectItem>
                <SelectItem value="EST">Estructuras</SelectItem>
                <SelectItem value="INS">Instalaciones</SelectItem>
                <SelectItem value="URB">Urbanismo</SelectItem>
                <SelectItem value="GEN">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer",
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
            accept=".pdf,.dwg,.dxf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          />
          
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadSimple size={32} weight="duotone" className="text-primary" />
            </div>
            <div>
              <p className="font-medium">
                Arrastre archivos aquí o haga clic para seleccionar
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Soporta PDF, DWG, DXF, DOC, DOCX, JPG, PNG, XLS, XLSX
              </p>
            </div>
          </div>
        </div>

        {totalFiles > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Archivos ({totalFiles})
              </h3>
              <div className="flex gap-2">
                {successFiles > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle size={14} weight="fill" className="text-primary" />
                    {successFiles} completado{successFiles > 1 ? 's' : ''}
                  </Badge>
                )}
                {errorFiles > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <WarningCircle size={14} weight="fill" />
                    {errorFiles} error{errorFiles > 1 ? 'es' : ''}
                  </Badge>
                )}
              </div>
            </div>

            <ScrollArea className="h-64 border rounded-lg">
              <div className="p-4 space-y-2">
                <AnimatePresence>
                  {files.map(fileItem => (
                    <motion.div
                      key={fileItem.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border bg-card",
                        fileItem.status === 'error' && "border-destructive/50 bg-destructive/5"
                      )}
                    >
                      <div className="shrink-0 mt-0.5">
                        {getFileIcon(fileItem.file.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate text-sm">
                              {fileItem.file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(fileItem.file.size)} • {DOCUMENT_TYPE_LABELS[fileItem.type]} • {fileItem.folder}
                            </p>
                          </div>
                          
                          {fileItem.status === 'pending' && !isUploading && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFile(fileItem.id)
                              }}
                            >
                              <X size={14} />
                            </Button>
                          )}

                          {fileItem.status === 'success' && (
                            <CheckCircle size={20} weight="fill" className="text-primary shrink-0" />
                          )}

                          {fileItem.status === 'error' && (
                            <WarningCircle size={20} weight="fill" className="text-destructive shrink-0" />
                          )}
                        </div>

                        {fileItem.status === 'uploading' && (
                          <Progress value={fileItem.progress} className="h-1" />
                        )}

                        {fileItem.error && (
                          <p className="text-xs text-destructive mt-1">
                            {fileItem.error}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setFiles([])
              onOpenChange(false)
            }}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            disabled={pendingFiles === 0 || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>Subiendo {uploadingFiles}/{totalFiles}...</>
            ) : (
              <>
                <UploadSimple size={18} weight="bold" />
                Subir {pendingFiles} archivo{pendingFiles > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
