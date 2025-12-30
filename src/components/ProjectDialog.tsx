import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, ProjectPhase, ProjectStatus, Client, PHASE_LABELS } from '@/lib/types'
import { toast } from 'sonner'
import { Trash } from '@phosphor-icons/react'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: Partial<Project>) => void
  onDelete?: (projectId: string) => void
  project?: Project
}

const ALL_PHASES: ProjectPhase[] = [
  'estudio-previo',
  'anteproyecto',
  'basico',
  'ejecucion',
  'direccion-obra'
]

export function ProjectDialog({ open, onOpenChange, onSave, onDelete, project }: ProjectDialogProps) {
  const [clients] = useKV<Client[]>('clients', [])
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [selectedPhases, setSelectedPhases] = useState<Set<ProjectPhase>>(new Set())
  const [phasePercentages, setPhasePercentages] = useState<Record<ProjectPhase, number>>({} as Record<ProjectPhase, number>)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setLocation(project.location)
      setDescription(project.description || '')
      setClientId(project.clientId)
      setStatus(project.status)
      const phases = new Set(project.phases.map(p => p.phase))
      setSelectedPhases(phases)
      const percentages = project.phases.reduce((acc, p) => {
        acc[p.phase] = p.percentage
        return acc
      }, {} as Record<ProjectPhase, number>)
      setPhasePercentages(percentages)
    } else {
      setTitle('')
      setLocation('')
      setDescription('')
      setClientId('')
      setStatus('active')
      setSelectedPhases(new Set())
      setPhasePercentages({} as Record<ProjectPhase, number>)
    }
  }, [project, open])

  const handlePhaseToggle = (phase: ProjectPhase) => {
    const newSelected = new Set(selectedPhases)
    const newPercentages = { ...phasePercentages }
    
    if (newSelected.has(phase)) {
      newSelected.delete(phase)
      delete newPercentages[phase]
    } else {
      newSelected.add(phase)
      newPercentages[phase] = 0
    }
    
    setSelectedPhases(newSelected)
    setPhasePercentages(newPercentages)
  }

  const handlePercentageChange = (phase: ProjectPhase, value: string) => {
    const numValue = parseInt(value) || 0
    setPhasePercentages({ ...phasePercentages, [phase]: Math.min(100, Math.max(0, numValue)) })
  }

  const totalPercentage = Object.values(phasePercentages).reduce((sum, val) => sum + val, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const phases = Array.from(selectedPhases).map(phase => ({
      phase,
      percentage: phasePercentages[phase] || 0,
      status: project?.phases.find(p => p.phase === phase)?.status || 'pending' as const
    }))

    onSave({
      ...(project || {}),
      title,
      location,
      description,
      clientId,
      status,
      phases,
    })
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (project && onDelete) {
      setDeleteDialogOpen(false)
      onDelete(project.id)
      onOpenChange(false)
      toast.success('Proyecto eliminado correctamente')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh]" key={open ? 'open' : 'closed'}>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
            <DialogDescription>
              Complete la información básica del proyecto y seleccione las fases contratadas.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Vivienda Unifamiliar en Cartagena"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Cartagena, Murcia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descripción del proyecto..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Cliente (Promotor) *</Label>
                  <Select 
                    value={clientId || undefined} 
                    onValueChange={(value) => {
                      setClientId(value)
                    }}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {(clients || []).length === 0 ? (
                        <SelectItem value="__no_clients__" disabled>No hay clientes disponibles</SelectItem>
                      ) : (
                        (clients || []).map(client => {
                          const name = client.type === 'persona-juridica' 
                            ? client.razonSocial 
                            : `${client.nombre} ${client.apellido1 || ''}`
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
                    <p className="text-sm text-destructive">
                      Debe crear un cliente antes de crear un proyecto
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado del Proyecto</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val as ProjectStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="on-hold">En Pausa</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label className="text-base">Fases Contratadas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seleccione las fases del proyecto y asigne el porcentaje de participación.
                  </p>
                </div>

                <div className="space-y-3">
                  {ALL_PHASES.map(phase => (
                    <div key={phase} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                      <Checkbox
                        id={phase}
                        checked={selectedPhases.has(phase)}
                        onCheckedChange={() => handlePhaseToggle(phase)}
                      />
                      <Label htmlFor={phase} className="flex-1 cursor-pointer font-normal">
                        {PHASE_LABELS[phase]}
                      </Label>
                      {selectedPhases.has(phase) && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={phasePercentages[phase] || 0}
                            onChange={(e) => handlePercentageChange(phase, e.target.value)}
                            className="w-20 font-mono text-right"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedPhases.size > 0 && (
                  <div className={`p-3 rounded-lg border ${totalPercentage === 100 ? 'bg-primary/10 border-primary/30' : 'bg-accent/10 border-accent/30'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total de porcentaje asignado:</span>
                      <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-primary' : 'text-accent'}`}>
                        {totalPercentage}%
                      </span>
                    </div>
                    {totalPercentage !== 100 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        El total debería sumar 100% para un proyecto completo
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center gap-3 pt-4">
                <div>
                  {project && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="gap-2"
                    >
                      <Trash size={18} weight="duotone" />
                      Eliminar Proyecto
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!title || !location || !clientId || selectedPhases.size === 0}
                  >
                    {project ? 'Guardar Cambios' : 'Crear Proyecto'}
                  </Button>
                </div>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el proyecto "{project?.title}" y todos sus datos asociados 
              (documentos, presupuestos, hitos, facturas). Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
