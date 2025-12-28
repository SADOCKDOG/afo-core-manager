import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Document } from '@/lib/types'
import { exportMultipleProjects, ExportOptions } from '@/lib/project-export'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, FileArchive, CheckCircle, XCircle, FolderOpen } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BulkProjectExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkProjectExportDialog({ open, onOpenChange }: BulkProjectExportDialogProps) {
  const [projects] = useKV<Project[]>('projects', [])
  const [documents] = useKV<Document[]>('documents', [])
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [includeAllVersions, setIncludeAllVersions] = useState(false)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [structureType, setStructureType] = useState<'by-type' | 'screaming-architecture'>('by-type')

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const selectAll = () => {
    if (projects) {
      setSelectedProjects(new Set(projects.map(p => p.id)))
    }
  }

  const deselectAll = () => {
    setSelectedProjects(new Set())
  }

  const handleExport = async () => {
    if (selectedProjects.size === 0) {
      toast.error('Seleccione al menos un proyecto')
      return
    }

    setIsExporting(true)

    try {
      const projectsToExport = (projects || [])
        .filter(p => selectedProjects.has(p.id))
        .map(project => ({
          project,
          documents: (documents || []).filter(doc => doc.projectId === project.id)
        }))

      const options: ExportOptions = {
        includeAllVersions,
        includeMetadata,
        structureType
      }

      const result = await exportMultipleProjects(projectsToExport, options)

      if (result.success) {
        toast.success('Proyectos exportados correctamente', {
          description: `${selectedProjects.size} proyecto(s) - Archivo: ${result.fileName}`,
          icon: <CheckCircle weight="duotone" />
        })
        onOpenChange(false)
        setSelectedProjects(new Set())
      } else {
        toast.error('Error al exportar proyectos', {
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

  const getProjectStats = (projectId: string) => {
    const projectDocs = (documents || []).filter(doc => doc.projectId === projectId)
    const totalVersions = projectDocs.reduce((sum, doc) => sum + doc.versions.length, 0)
    return {
      documents: projectDocs.length,
      versions: totalVersions
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/20 text-accent">
              <FolderOpen size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle>Exportación Múltiple de Proyectos</DialogTitle>
              <DialogDescription>
                Seleccione los proyectos que desea exportar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedProjects.size} de {(projects || []).length} proyectos seleccionados
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                disabled={(projects || []).length === 0}
              >
                Seleccionar todos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deselectAll}
                disabled={selectedProjects.size === 0}
              >
                Deseleccionar todos
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[300px] rounded-lg border">
            <div className="p-4 space-y-2">
              {(projects || []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No hay proyectos disponibles
                </div>
              ) : (
                (projects || []).map(project => {
                  const stats = getProjectStats(project.id)
                  const isSelected = selectedProjects.has(project.id)
                  
                  return (
                    <div
                      key={project.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-accent/10 border-accent'
                          : 'bg-card hover:bg-muted/50 border-border'
                      }`}
                      onClick={() => toggleProject(project.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleProject(project.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{project.location}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Estado: <span className="capitalize">{project.status}</span></span>
                            <span>Documentos: {stats.documents}</span>
                            <span>Versiones: {stats.versions}</span>
                            <span>Fases: {project.phases.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 text-sm">Opciones de Exportación</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="bulk-all-versions"
                    checked={includeAllVersions}
                    onCheckedChange={(checked) => setIncludeAllVersions(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="bulk-all-versions"
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
                    id="bulk-metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="bulk-metadata"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Incluir archivos de metadatos
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Genera METADATA.json, README.md e INDICE_DOCUMENTOS.md para cada proyecto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-sm">Estructura de Carpetas</h4>
              
              <RadioGroup value={structureType} onValueChange={(val) => setStructureType(val as any)}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="by-type" id="bulk-by-type" />
                    <div className="flex-1">
                      <Label htmlFor="bulk-by-type" className="text-sm font-medium cursor-pointer">
                        Por Tipo de Documento
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        01_Planos, 02_Memorias, 03_Presupuestos, etc.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="screaming-architecture" id="bulk-screaming" />
                    <div className="flex-1">
                      <Label htmlFor="bulk-screaming" className="text-sm font-medium cursor-pointer">
                        Arquitectura Gritante
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Componentes, Servicios, Modelos, Documentación, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedProjects.size === 0}
            className="gap-2"
          >
            {isExporting ? (
              <>Exportando...</>
            ) : (
              <>
                <Download size={18} weight="duotone" />
                Exportar {selectedProjects.size > 0 ? `(${selectedProjects.size})` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
