import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Warning, 
  Folder,
  ArrowRight,
  Trash,
  FolderOpen,
  X,
  Sparkle
} from '@phosphor-icons/react'
import { 
  analyzeProjectFiles, 
  ImportAnalysis, 
  getImportStatistics,
  generateDocumentsFromImport
} from '@/lib/project-import'
import { 
  FolderStructureType,
  FOLDER_STRUCTURES,
  Client
} from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { ClassificationContext } from '@/lib/ai-document-classifier'
import { AIDocumentClassifier } from './AIDocumentClassifier'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectImportData {
  id: string
  folderName: string
  files: File[]
  analysis: ImportAnalysis | null
  isAnalyzing: boolean
  title: string
  location: string
  clientId: string
  folderStructure: FolderStructureType
  selected: boolean
  error?: string
}

interface BulkProjectImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportComplete: (projects: Array<{
    title: string
    location: string
    clientId: string
    folderStructure: FolderStructureType
    documents: any[]
  }>) => void
}

type ImportStep = 'select' | 'analyze' | 'configure' | 'importing'

export function BulkProjectImportDialog({ open, onOpenChange, onImportComplete }: BulkProjectImportDialogProps) {
  const [clients] = useKV<Client[]>('clients', [])
  const [step, setStep] = useState<ImportStep>('select')
  const [projects, setProjects] = useState<ProjectImportData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFoldersSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (selectedFiles.length === 0) return

    const folderMap = new Map<string, File[]>()
    
    selectedFiles.forEach(file => {
      const pathParts = file.webkitRelativePath.split('/')
      const folderName = pathParts[0]
      
      if (!folderMap.has(folderName)) {
        folderMap.set(folderName, [])
      }
      folderMap.get(folderName)!.push(file)
    })

    const newProjects: ProjectImportData[] = Array.from(folderMap.entries()).map(([folderName, files]) => ({
      id: `${Date.now()}-${Math.random()}`,
      folderName,
      files,
      analysis: null,
      isAnalyzing: false,
      title: folderName,
      location: '',
      clientId: '',
      folderStructure: 'by-type' as FolderStructureType,
      selected: true
    }))

    setProjects(newProjects)
    setStep('analyze')
    analyzeAllProjects(newProjects)
  }

  const analyzeAllProjects = async (projectsToAnalyze: ProjectImportData[]) => {
    setIsProcessing(true)
    
    const analyzed: ProjectImportData[] = []
    
    for (let i = 0; i < projectsToAnalyze.length; i++) {
      const project = projectsToAnalyze[i]
      setProgress(((i + 1) / projectsToAnalyze.length) * 100)
      
      try {
        const analysis = await analyzeProjectFiles(project.files)
        analyzed.push({
          ...project,
          analysis,
          title: analysis.projectNameSuggestion || project.folderName,
          location: analysis.locationSuggestion || '',
          folderStructure: analysis.suggestedStructure
        })
      } catch (error) {
        analyzed.push({
          ...project,
          error: 'Error al analizar carpeta'
        })
      }
    }
    
    setProjects(analyzed)
    setIsProcessing(false)
    setProgress(0)
    setStep('configure')
  }

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleToggleProject = (id: string) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ))
  }

  const handleUpdateProject = (id: string, updates: Partial<ProjectImportData>) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ))
  }

  const handleImportAll = async () => {
    const selectedProjects = projects.filter(p => p.selected && p.analysis && !p.error)
    
    if (selectedProjects.length === 0) {
      toast.error('Seleccione al menos un proyecto válido para importar')
      return
    }

    const hasInvalidProjects = selectedProjects.some(p => !p.title || !p.location || !p.clientId)
    if (hasInvalidProjects) {
      toast.error('Complete todos los campos requeridos (nombre, ubicación y cliente)')
      return
    }

    setStep('importing')
    setIsProcessing(true)

    try {
      const importedProjects = selectedProjects.map(project => {
        const tempProjectId = `temp-${Date.now()}-${Math.random()}`
        const documents = generateDocumentsFromImport(project.analysis!.analyzedFiles, tempProjectId)

        return {
          title: project.title,
          location: project.location,
          clientId: project.clientId,
          folderStructure: project.folderStructure,
          documents
        }
      })

      const totalDocs = importedProjects.reduce((sum, p) => sum + p.documents.length, 0)
      const totalFolders = selectedProjects.reduce((sum, p) => {
        const uniqueFolders = new Set(p.analysis!.analyzedFiles.map(f => {
          const parts = f.path.split('/')
          return parts.slice(0, -1).join('/')
        }))
        return sum + uniqueFolders.size
      }, 0)

      onImportComplete(importedProjects)
      
      toast.success(`${importedProjects.length} proyecto${importedProjects.length !== 1 ? 's' : ''} importado${importedProjects.length !== 1 ? 's' : ''} correctamente`, {
        description: `${totalDocs} documentos desde ${totalFolders} carpetas procesados automáticamente`
      })
      handleReset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error importing projects:', error)
      toast.error('Error al importar proyectos')
      setIsProcessing(false)
      setStep('configure')
    }
  }

  const handleReset = () => {
    setStep('select')
    setProjects([])
    setProgress(0)
    setIsProcessing(false)
  }

  const selectedCount = projects.filter(p => p.selected).length
  const validProjectsCount = projects.filter(p => p.analysis && !p.error).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/30">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen size={28} weight="duotone" />
            Importación Múltiple de Proyectos
          </DialogTitle>
          <DialogDescription className="text-base">
            Importe varios proyectos simultáneamente desde carpetas diferentes con análisis automático completo
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col items-center justify-center gap-6 py-12"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-2">
                    <FolderOpen size={48} weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold">Seleccione múltiples carpetas de proyectos</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Seleccione una carpeta que contenga varios proyectos. La herramienta detectará y analizará cada subcarpeta automáticamente
                  </p>
                </div>

                <div>
                  <input
                    type="file"
                    id="bulk-folder-upload"
                    onChange={handleFoldersSelect}
                    className="hidden"
                    {...({webkitdirectory: "", directory: ""} as any)}
                    multiple
                  />
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('bulk-folder-upload')?.click()}
                    className="gap-2"
                  >
                    <FolderOpen size={20} weight="duotone" />
                    Seleccionar Carpeta Principal
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 max-w-2xl">
                  <h4 className="font-medium mb-2 text-sm">💡 Cómo Funciona:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Seleccione la carpeta raíz que contiene todos sus proyectos</li>
                    <li>• Cada subcarpeta será detectada como un proyecto independiente</li>
                    <li>• Análisis automático de archivos en cada carpeta</li>
                    <li>• Configure detalles de cada proyecto antes de importar</li>
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
                  <h3 className="text-lg font-semibold">Analizando proyectos...</h3>
                  <p className="text-sm text-muted-foreground">
                    Procesando {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="w-64 space-y-2">
                  <Progress value={progress} />
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.round(progress)}% completado
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'configure' && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-base text-muted-foreground font-medium">
                    {validProjectsCount} de {projects.length} proyectos detectados • {selectedCount} seleccionados
                  </div>
                  <Button
                    size="default"
                    variant="outline"
                    onClick={() => setProjects(projects.map(p => ({ ...p, selected: !p.selected })))}
                  >
                    {selectedCount === projects.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                  </Button>
                </div>

                <ScrollArea className="flex-1 border rounded-lg h-[calc(98vh-300px)]">
                  <div className="p-5 space-y-5">
                    {projects.map((project) => {
                      const stats = project.analysis ? getImportStatistics(project.analysis) : null

                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-5 ${
                            project.error ? 'border-destructive/50 bg-destructive/5' : 
                            project.selected ? 'border-primary/50 bg-primary/5' : 
                            'bg-card'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-1">
                              <Checkbox
                                checked={project.selected}
                                onCheckedChange={() => handleToggleProject(project.id)}
                                disabled={!!project.error}
                                className="w-5 h-5"
                              />
                            </div>

                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Folder size={24} weight="duotone" className="text-primary" />
                                  <span className="font-medium text-lg">{project.folderName}</span>
                                  {project.error && (
                                    <Badge variant="destructive" className="text-sm">Error</Badge>
                                  )}
                                  {!project.error && project.analysis && (
                                    <Badge variant="secondary" className="text-sm py-1 px-3">
                                      {project.analysis.totalFiles} archivos
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRemoveProject(project.id)}
                                >
                                  <X size={18} />
                                </Button>
                              </div>

                              {project.error ? (
                                <div className="flex items-center gap-2 text-base text-destructive">
                                  <Warning size={18} weight="fill" />
                                  {project.error}
                                </div>
                              ) : project.analysis ? (
                                <>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor={`title-${project.id}`} className="text-sm">
                                        Nombre del Proyecto *
                                      </Label>
                                      <Input
                                        id={`title-${project.id}`}
                                        value={project.title}
                                        onChange={(e) => handleUpdateProject(project.id, { title: e.target.value })}
                                        placeholder="Nombre del proyecto"
                                        className="mt-2 h-10 text-base"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`location-${project.id}`} className="text-sm">
                                        Ubicación *
                                      </Label>
                                      <Input
                                        id={`location-${project.id}`}
                                        value={project.location}
                                        onChange={(e) => handleUpdateProject(project.id, { location: e.target.value })}
                                        placeholder="Ciudad, Provincia"
                                        className="mt-2 h-10 text-base"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor={`client-${project.id}`} className="text-sm">
                                      Cliente (Promotor) *
                                    </Label>
                                    <Select
                                      value={project.clientId}
                                      onValueChange={(value) => handleUpdateProject(project.id, { clientId: value })}
                                    >
                                      <SelectTrigger className="mt-2 h-10">
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
                                      <p className="text-sm text-destructive mt-2">
                                        ⚠️ Debe crear un cliente antes de importar proyectos
                                      </p>
                                    )}
                                  </div>

                                  <div>
                                    <Label htmlFor={`structure-${project.id}`} className="text-sm">
                                      Estructura de Carpetas
                                    </Label>
                                    <Select
                                      value={project.folderStructure}
                                      onValueChange={(value) => handleUpdateProject(project.id, { folderStructure: value as FolderStructureType })}
                                    >
                                      <SelectTrigger className="mt-2 h-10">
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
                                  </div>

                                  {stats && (
                                    <div className="flex gap-5 text-sm text-muted-foreground flex-wrap">
                                      <div className="flex items-center gap-1.5">
                                        <FileText size={14} />
                                        {stats.totalSize > 0 ? `${(stats.totalSize / 1024 / 1024).toFixed(1)} MB` : '0 MB'}
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <CheckCircle size={14} className="text-green-500" />
                                        {stats.byConfidence.high} alta confianza
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Warning size={14} className="text-yellow-500" />
                                        {stats.byConfidence.medium} media
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Warning size={14} className="text-red-500" />
                                        {stats.byConfidence.low} baja
                                      </div>
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </motion.div>
            )}

            {step === 'importing' && (
              <motion.div
                key="importing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-6 py-12"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary animate-pulse">
                  <CheckCircle size={48} weight="duotone" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Importando proyectos...</h3>
                  <p className="text-sm text-muted-foreground">
                    Creando {selectedCount} proyecto{selectedCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              if (step === 'configure' && !isProcessing) {
                handleReset()
              } else if (step === 'select') {
                onOpenChange(false)
              }
            }}
            disabled={isProcessing}
          >
            {step === 'configure' ? 'Volver' : 'Cerrar'}
          </Button>

          {step === 'configure' && (
            <Button
              size="lg"
              onClick={handleImportAll}
              disabled={selectedCount === 0 || isProcessing}
              className="gap-2"
            >
              Importar {selectedCount} Proyecto{selectedCount !== 1 ? 's' : ''}
              <ArrowRight size={18} weight="bold" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
