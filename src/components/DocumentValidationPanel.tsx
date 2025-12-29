import { useState } from 'react'
import { 
  VisaApplication, 
  VisaDocument,
  VisaDocumentType,
  VISA_DOCUMENT_TYPE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Warning, 
  X, 
  Upload, 
  File,
  Trash
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { getRequiredDocuments, validateDocument } from '@/lib/visa-validation'

interface DocumentValidationPanelProps {
  visa: VisaApplication
  onDocumentUpload: (documents: VisaDocument[]) => void
  onUpdateVisa: (updates: Partial<VisaApplication>) => void
}

export function DocumentValidationPanel({ 
  visa, 
  onDocumentUpload, 
  onUpdateVisa 
}: DocumentValidationPanelProps) {
  const [selectedDocType, setSelectedDocType] = useState<VisaDocumentType | ''>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
  const uploadedTypes = visa.documents.map(d => d.type)
  const completion = requiredDocs.length > 0
    ? Math.round((visa.documents.filter(d => d.isValid).length / requiredDocs.length) * 100)
    : 0

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !selectedDocType) {
      toast.error('Complete todos los campos')
      return
    }

    const newDocument: VisaDocument = {
      id: Date.now().toString(),
      type: selectedDocType,
      name: selectedFile.name,
      fileSize: selectedFile.size,
      uploadedAt: Date.now(),
      isRequired: requiredDocs.some(r => r.type === selectedDocType && r.isRequired),
      isValid: false,
      validationErrors: []
    }

    const requiredDoc = requiredDocs.find(r => r.type === selectedDocType)
    const validation = validateDocument(newDocument, requiredDoc)

    newDocument.isValid = validation.isValid
    newDocument.validationErrors = [...validation.errors, ...validation.warnings]

    onDocumentUpload([newDocument])

    setSelectedFile(null)
    setSelectedDocType('')
    
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = visa.documents.filter(d => d.id !== docId)
    onUpdateVisa({ documents: updatedDocs })
    toast.success('Documento eliminado')
  }

  const getMissingRequiredDocs = () => {
    return requiredDocs.filter(req => req.isRequired && !uploadedTypes.includes(req.type))
  }

  const getDocumentIcon = (doc: VisaDocument) => {
    if (doc.isValid) {
      return <CheckCircle size={20} weight="fill" className="text-green-400" />
    }
    if (doc.validationErrors.length > 0) {
      return <Warning size={20} weight="fill" className="text-amber-400" />
    }
    return <X size={20} weight="fill" className="text-red-400" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <ScrollArea className="h-[calc(90vh-400px)]">
      <div className="space-y-6 pr-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Progreso de Documentación</h3>
              <p className="text-sm text-muted-foreground">
                {visa.documents.filter(d => d.isValid).length} de {requiredDocs.length} documentos validados
              </p>
            </div>
            <span className="text-2xl font-bold">{completion}%</span>
          </div>
          <Progress value={completion} className="h-3" />
        </div>

        <Separator />

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Subir Nuevo Documento</CardTitle>
            <CardDescription>
              Seleccione el tipo de documento y el archivo a validar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-type">Tipo de Documento</Label>
              <Select
                value={selectedDocType}
                onValueChange={(val) => setSelectedDocType(val as VisaDocumentType)}
              >
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VISA_DOCUMENT_TYPE_LABELS).map(([value, label]) => {
                    const isUploaded = uploadedTypes.includes(value as VisaDocumentType)
                    return (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          {label}
                          {isUploaded && (
                            <Badge variant="secondary" className="text-xs">Subido</Badge>
                          )}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">Archivo</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.dwg,.xml,.bc3"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedDocType}
              className="w-full gap-2"
            >
              <Upload size={18} />
              Subir y Validar
            </Button>
          </CardContent>
        </Card>

        {getMissingRequiredDocs().length > 0 && (
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Warning size={18} className="text-amber-400" />
            <AlertDescription>
              <div className="font-medium mb-2">Documentos requeridos pendientes:</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {getMissingRequiredDocs().map(doc => (
                  <li key={doc.type}>{VISA_DOCUMENT_TYPE_LABELS[doc.type]}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="font-semibold mb-3">Documentos Cargados ({visa.documents.length})</h3>
          
          {visa.documents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <File size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  No hay documentos cargados todavía
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {visa.documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                  >
                    <Card className={
                      doc.isValid 
                        ? 'border-green-500/30' 
                        : doc.validationErrors.length > 0 
                          ? 'border-amber-500/30' 
                          : 'border-red-500/30'
                    }>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {getDocumentIcon(doc)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{doc.name}</p>
                                {doc.isRequired && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    Requerido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {VISA_DOCUMENT_TYPE_LABELS[doc.type]} • {formatFileSize(doc.fileSize)}
                              </p>
                              
                              {doc.validationErrors.length > 0 && (
                                <div className="space-y-1">
                                  {doc.validationErrors.map((error, idx) => (
                                    <p key={idx} className="text-xs text-amber-400">
                                      • {error}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {doc.isValid && (
                                <p className="text-xs text-green-400">
                                  ✓ Documento validado correctamente
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}
