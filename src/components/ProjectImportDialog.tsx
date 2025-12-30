import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Warning, 
  Folder,
  ArrowRight,
  Eye,
  Pencil,
  Tree,
  Sparkle
} from '@phosphor-icons/react'
import { 
  analyzeProjectFiles, 
  ImportAnalysis, 
  ImportedFile,
  getImportStatistics,
  generateDocumentsFromImport
} from '@/lib/project-import'
import { 
  DOCUMENT_TYPE_LABELS, 
  DocumentType, 
  FolderStructureType,
  FOLDER_STRUCTURES,
  Client
} from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { ClassificationContext } from '@/lib/ai-document-classifier'
import { AIDocumentClassifier } from './AIDocumentClassifier'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderTree } from '@/components/FolderTree'

interface ProjectImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (projectData: {
    title: string
    location: string
    clientId: string
    folderStructure: FolderStructureType
    documents: any[]
  }) => void
}

type ImportStep = 'upload' | 'analyze' | 'ai-classify' | 'review' | 'confirm'

export function ProjectImportDialog({ open, onOpenChange, onImportComplete }: ProjectImportDialogProps) {
  const [clients] = useKV<Client[]>('clients', [])
  const [step, setStep] = useState<ImportStep>('upload')
  const [files, setFiles] = useState<File[]>([])
  const [analysis, setAnalysis] = useState<ImportAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectLocation, setProjectLocation] = useState('')
  const [clientId, setClientId] = useState('')
  const [selectedStructure, setSelectedStructure] = useState<FolderStructureType>('by-type')
  const [editingFile, setEditingFile] = useState<ImportedFile | null>(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')
  const [aiClassifierOpen, setAiClassifierOpen] = useState(false)
  const [classificationContexts, setClassificationContexts] = useState<ClassificationContext[]>([])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length === 0) return

    setFiles(selectedFiles)
    setStep('analyze')
    setIsAnalyzing(true)

    try {
      const result = await analyzeProjectFiles(selectedFiles)
      setAnalysis(result)
      setProjectTitle(result.projectNameSuggestion || '')
      setProjectLocation(result.locationSuggestion || '')
      setSelectedStructure(result.suggestedStructure)
      setStep('review')
    } catch (error) {
      console.error('Error analyzing files:', error)
      toast.error('Error al analizar los archivos')
      setStep('upload')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOpenAIClassifier = () => {
    if (!analysis) return

    const contexts: ClassificationContext[] = analysis.analyzedFiles.map(file => ({
      fileName: file.name,
      folderPath: file.path.split('/').slice(0, -1).join('/'),
      fileExtension: file.extension,
      fileSize: file.size,
      projectContext: {
        projectName: projectTitle,
        location: projectLocation,
        existingDocuments: analysis.analyzedFiles.map(f => ({
          name: f.name,
          type: f.suggestedType
        }))
      }
    }))

    setClassificationContexts(contexts)
    setAiClassifierOpen(true)
  }

  const handleAIClassificationComplete = (classifications: Array<{
    fileName: string
    type: DocumentType
    confidence: number
    metadata: any
  }>) => {
    if (!analysis) return

    const updatedFiles = analysis.analyzedFiles.map(file => {
      const classification = classifications.find(c => c.fileName === file.name)
      if (classification) {
        return {
          ...file,
          suggestedType: classification.type,
          confidence: classification.confidence >= 80 ? 'high' : 
                     classification.confidence >= 50 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
          metadata: {
            ...file.metadata,
            ...classification.metadata
          }
        }
      }
      return file
    })

    setAnalysis({
      ...analysis,
      analyzedFiles: updatedFiles
    })

    toast.success('Clasificación con IA completada', {
      description: `${classifications.length} documentos clasificados automáticamente`
    })
  }

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e)
  }

  const handleFileTypeChange = (file: ImportedFile, newType: DocumentType) => {
    if (!analysis) return

    const updatedFiles = analysis.analyzedFiles.map(f =>
      f.path === file.path
        ? { ...f, suggestedType: newType }
        : f
    )

    setAnalysis({
      ...analysis,
      analyzedFiles: updatedFiles
    })
    setEditingFile(null)
  }

  const handleImport = () => {
    if (!analysis || !projectTitle || !projectLocation || !clientId) {
      toast.error('Por favor, complete todos los campos requeridos')
      return
    }

    const tempProjectId = `temp-${Date.now()}`
    const documents = generateDocumentsFromImport(analysis.analyzedFiles, tempProjectId)

    onImportComplete({
      title: projectTitle,
      location: projectLocation,
      clientId,
      folderStructure: selectedStructure,
      documents
    })

    const stats = getImportStatistics(analysis)
    const totalFolders = new Set(analysis.analyzedFiles.map(f => {
      const parts = f.path.split('/')
      return parts.slice(0, -1).join('/')
    })).size

    toast.success(`Proyecto "${projectTitle}" importado correctamente`, {
      description: `${analysis.totalFiles} documentos desde ${totalFolders} carpetas • ${stats.byConfidence.high} con alta confianza`
    })
    handleReset()
    onOpenChange(false)
  }

  const handleReset = () => {
    setStep('upload')
    setFiles([])
    setAnalysis(null)
    setProjectTitle('')
    setProjectLocation('')
    setClientId('')
    setSelectedStructure('by-type')
    setEditingFile(null)
    setSearchFilter('')
    setTypeFilter('all')
  }

  const statistics = analysis ? getImportStatistics(analysis) : null

  const filteredFiles = analysis?.analyzedFiles.filter(file => {
    const matchesSearch = searchFilter === '' || 
      file.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      file.path.toLowerCase().includes(searchFilter.toLowerCase())
    
    const matchesType = typeFilter === 'all' || file.suggestedType === typeFilter

    return matchesSearch && matchesType
  }) || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] w-[96vw] max-h-[96vh] h-[96vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={24} weight="duotone" />
            Importar Proyecto Existente
          </DialogTitle>
          <DialogDescription>
            Organice automáticamente archivos de proyectos caóticos con análisis inteligente de múltiples carpetas y subcarpetas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col items-center justify-center gap-6 py-12"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-2">
                    <Folder size={48} weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold">Seleccione carpeta o archivos del proyecto</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    La herramienta analizará todas las carpetas y subcarpetas, clasificando automáticamente cada documento detectado
                  </p>
                </div>

                <div className="flex gap-4">
                  <div>
                    <input
                      type="file"
                      id="folder-upload"
                      onChange={handleFolderSelect}
                      className="hidden"
                      {...({webkitdirectory: "", directory: ""} as any)}
                      multiple
                    />
                    <Button
                      size="lg"
                      onClick={() => document.getElementById('folder-upload')?.click()}
                      className="gap-2"
                    >
                      <Folder size={20} weight="duotone" />
                      Seleccionar Carpeta Completa
                    </Button>
                  </div>

                  <div>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileSelect}
                      className="hidden"
                      multiple
                      accept=".pdf,.dwg,.dxf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.rvt,.skp,.ifc,.txt,.odt,.ods,.ppt,.pptx"
                    />
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="gap-2"
                    >
                      <FileText size={20} weight="duotone" />
                      Seleccionar Archivos Individuales
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 max-w-2xl">
                  <h4 className="font-medium mb-2 text-sm">✨ Análisis Automático Incluye:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Escaneo recursivo de todas las carpetas y subcarpetas</li>
                    <li>• Clasificación inteligente por tipo de documento</li>
                    <li>• Sugerencia de estructura de carpetas óptima</li>
                    <li>• Extracción de metadatos del proyecto</li>
                    <li>• Detección automática de ubicación y nombre del proyecto</li>
                    <li>• Visualización de árbol de carpetas completo</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {step === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-6 py-12"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary animate-pulse">
                  <Upload size={48} weight="duotone" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Analizando archivos...</h3>
                  <p className="text-sm text-muted-foreground">
                    Procesando {files.length} archivo{files.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Progress value={50} className="w-64" />
              </motion.div>
            )}

            {step === 'review' && analysis && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                  <TabsList className="grid grid-cols-4 w-full mb-4">
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="tree">Árbol ({analysis.totalFiles})</TabsTrigger>
                    <TabsTrigger value="files">Lista Archivos</TabsTrigger>
                    <TabsTrigger value="settings">Configuración</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="flex-1 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Total Archivos</div>
                        <div className="text-2xl font-bold">{analysis.totalFiles}</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Tamaño Total</div>
                        <div className="text-2xl font-bold">
                          {(statistics!.totalSize / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                      <div className="bg-card border rounded-lg p-4">
                        <div className="text-sm text-muted-foreground mb-1">Alta Confianza</div>
                        <div className="text-2xl font-bold text-green-500">
                          {statistics!.byConfidence.high}
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Distribución por Tipo</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(statistics!.byType).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm">{type}</span>
                            <Badge variant="secondary">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Nivel de Confianza</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-green-600">Alta</span>
                            <span>{statistics!.byConfidence.high} archivos</span>
                          </div>
                          <Progress 
                            value={(statistics!.byConfidence.high / analysis.totalFiles) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-yellow-600">Media</span>
                            <span>{statistics!.byConfidence.medium} archivos</span>
                          </div>
                          <Progress 
                            value={(statistics!.byConfidence.medium / analysis.totalFiles) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600">Baja</span>
                            <span>{statistics!.byConfidence.low} archivos</span>
                          </div>
                          <Progress 
                            value={(statistics!.byConfidence.low / analysis.totalFiles) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tree" className="flex-1">
                    <div className="border rounded-lg bg-card">
                      <div className="p-3 border-b bg-muted/50">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Tree size={16} weight="duotone" />
                          Estructura de Carpetas Detectada
                        </div>
                      </div>
                      <ScrollArea className="h-[calc(96vh-400px)]">
                        <div className="p-3">
                          <FolderTree files={analysis.analyzedFiles} />
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="flex-1">
                    <div className="mb-3 flex gap-2">
                      <Input
                        placeholder="Buscar archivos..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as DocumentType | 'all')}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los tipos</SelectItem>
                          {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <ScrollArea className="h-[calc(96vh-420px)] border rounded-lg">
                      <div className="p-4 space-y-2">
                        {filteredFiles.length > 0 ? (
                          filteredFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileText size={16} weight="duotone" />
                                  <span className="font-medium text-sm truncate">{file.name}</span>
                                  {file.confidence === 'high' && (
                                    <CheckCircle size={14} weight="fill" className="text-green-500" />
                                  )}
                                  {file.confidence === 'medium' && (
                                    <Warning size={14} weight="fill" className="text-yellow-500" />
                                  )}
                                  {file.confidence === 'low' && (
                                    <Warning size={14} weight="fill" className="text-red-500" />
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {file.path} • {file.suggestedFolder} • {(file.size / 1024).toFixed(0)} KB
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {DOCUMENT_TYPE_LABELS[file.suggestedType]}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingFile(file)}
                                >
                                  <Pencil size={14} />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No se encontraron archivos con los filtros aplicados
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Mostrando {filteredFiles.length} de {analysis?.totalFiles || 0} archivos
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="flex-1 space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="project-title">Nombre del Proyecto *</Label>
                        <Input
                          id="project-title"
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="Ej: Vivienda Unifamiliar en Seseña"
                          className="mt-1"
                        />
                        {analysis.projectNameSuggestion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Sugerencia detectada: {analysis.projectNameSuggestion}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="project-location">Ubicación *</Label>
                        <Input
                          id="project-location"
                          value={projectLocation}
                          onChange={(e) => setProjectLocation(e.target.value)}
                          placeholder="Ej: Seseña, Toledo"
                          className="mt-1"
                        />
                        {analysis.locationSuggestion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Sugerencia detectada: {analysis.locationSuggestion}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="client">Cliente (Promotor) *</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                          <SelectTrigger id="client" className="mt-1">
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {(clients || []).length === 0 ? (
                              <SelectItem value="" disabled>No hay clientes disponibles</SelectItem>
                            ) : (
                              (clients || []).map(client => {
                                const name = client.type === 'persona-juridica' 
                                  ? client.razonSocial 
                                  : `${client.nombre} ${client.apellido1}`
                                return (
                                  <SelectItem key={client.id} value={client.id}>
                                    {name} - {client.nif}
                                  </SelectItem>
                                )
                              })
                            )}
                          </SelectContent>
                        </Select>
                        {(clients || []).length === 0 && (
                          <p className="text-xs text-destructive mt-1">
                            Debe crear un cliente antes de importar un proyecto
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="folder-structure">Estructura de Carpetas</Label>
                        <Select
                          value={selectedStructure}
                          onValueChange={(value) => setSelectedStructure(value as FolderStructureType)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(FOLDER_STRUCTURES).map(([key, value]) => (
                              <SelectItem key={key} value={key}>
                                {value.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estructura recomendada: {FOLDER_STRUCTURES[analysis.suggestedStructure].name}
                        </p>
                      </div>

                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                          <Eye size={16} weight="duotone" />
                          Vista Previa de Carpetas
                        </h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {FOLDER_STRUCTURES[selectedStructure].folders.map((folder) => (
                            <div key={folder} className="flex items-center gap-2">
                              <Folder size={14} />
                              {folder}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 'review') {
                handleReset()
              } else {
                onOpenChange(false)
              }
            }}
          >
            {step === 'review' ? 'Cancelar' : 'Cerrar'}
          </Button>

          <div className="flex gap-2">
            {step === 'review' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleOpenAIClassifier}
                  className="gap-2"
                >
                  <Sparkle size={18} weight="duotone" />
                  Mejorar con IA
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!projectTitle || !projectLocation}
                  className="gap-2"
                >
                  <CheckCircle size={18} weight="duotone" />
                  Importar Proyecto
                </Button>
              </>
            )}
          </div>
        </div>

        {analysis && (
          <AIDocumentClassifier
            open={aiClassifierOpen}
            onOpenChange={setAiClassifierOpen}
            contexts={classificationContexts}
            onClassificationComplete={handleAIClassificationComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
