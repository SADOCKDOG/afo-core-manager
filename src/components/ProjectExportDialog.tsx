import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Document } from '@/lib/types'
import { exportProjectDocuments, ExportOptions } from '@/lib/project-export'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Download, FileArchive, CheckCircle, XCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ProjectExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function ProjectExportDialog({ open, onOpenChange, project }: ProjectExportDialogProps) {
  const [documents] = useKV<Document[]>('documents', [])
  const [isExporting, setIsExporting] = useState(false)
  const [includeAllVersions, setIncludeAllVersions] = useState(false)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [structureType, setStructureType] = useState<'project' | 'custom'>(
    project.folderStructure ? 'project' : 'custom'
  )
  const [customStructure, setCustomStructure] = useState<'by-type' | 'screaming-architecture'>('by-type')

  const projectDocuments = (documents || []).filter(doc => doc.projectId === project.id)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      const options: ExportOptions = {
        includeAllVersions,
        includeMetadata,
        structureType: structureType === 'project' 
          ? project.folderStructure || 'by-type'
          : customStructure
      }

      const result = await exportProjectDocuments(project, projectDocuments, options)

      if (result.success) {
        toast.success('Proyecto exportado correctamente', {
          description: `Archivo: ${result.fileName}`,
          icon: <CheckCircle weight="duotone" />
        })
        onOpenChange(false)
      } else {
        toast.error('Error al exportar proyecto', {
          description: result.error,
          icon: <XCircle weight="duotone" />
        })
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Error inesperado al exportar', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const totalVersions = projectDocuments.reduce((sum, doc) => sum + doc.versions.length, 0)
  const totalSize = projectDocuments.reduce((sum, doc) => {
    return sum + doc.versions.reduce((vsum, v) => vsum + v.fileSize, 0)
  }, 0)

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/20 text-accent">
              <FileArchive size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle>Exportar Proyecto</DialogTitle>
              <DialogDescription>
                {project.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-semibold mb-3 text-sm">Resumen del Proyecto</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Ubicación:</span>
                <p className="font-medium">{project.location}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <p className="font-medium capitalize">{project.status}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Documentos:</span>
                <p className="font-medium">{projectDocuments.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Versiones totales:</span>
                <p className="font-medium">{totalVersions}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tamaño estimado:</span>
                <p className="font-medium">{formatSize(totalSize)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Fases:</span>
                <p className="font-medium">{project.phases.length}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Opciones de Exportación</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="all-versions"
                    checked={includeAllVersions}
                    onCheckedChange={(checked) => setIncludeAllVersions(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="all-versions"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Incluir todas las versiones de documentos
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Por defecto solo se exporta la versión actual de cada documento
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="metadata"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Incluir archivos de metadatos
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Genera METADATA.json, README.md e INDICE_DOCUMENTOS.md
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Estructura de Carpetas</h4>
              
              <RadioGroup value={structureType} onValueChange={(val) => setStructureType(val as any)}>
                <div className="space-y-3">
                  {project.folderStructure && (
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="project" id="project-structure" />
                      <div className="flex-1">
                        <Label htmlFor="project-structure" className="text-sm font-medium cursor-pointer">
                          Usar estructura del proyecto
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {project.folderStructure === 'by-type' 
                            ? 'Por Tipo de Documento (01_Planos, 02_Memorias, etc.)'
                            : 'Arquitectura Gritante (Componentes, Servicios, etc.)'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="custom" id="custom-structure" />
                    <div className="flex-1">
                      <Label htmlFor="custom-structure" className="text-sm font-medium cursor-pointer">
                        Estructura personalizada
                      </Label>
                      
                      {structureType === 'custom' && (
                        <RadioGroup
                          value={customStructure}
                          onValueChange={(val) => setCustomStructure(val as any)}
                          className="mt-3 ml-4 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="by-type" id="by-type" />
                            <Label htmlFor="by-type" className="text-xs cursor-pointer">
                              Por Tipo de Documento
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="screaming-architecture" id="screaming" />
                            <Label htmlFor="screaming" className="text-xs cursor-pointer">
                              Arquitectura Gritante
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {projectDocuments.length === 0 && (
            <div className="p-4 rounded-lg bg-muted/50 border border-muted-foreground/20">
              <p className="text-sm text-muted-foreground text-center">
                Este proyecto no tiene documentos para exportar
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || projectDocuments.length === 0}
            className="gap-2"
          >
            {isExporting ? (
              <>Exportando...</>
            ) : (
              <>
                <Download size={18} weight="duotone" />
                Exportar Proyecto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
