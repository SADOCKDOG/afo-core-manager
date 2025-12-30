import { useState, useEffect } from 'react'
import { Project, ProjectMilestone, MilestoneType, MilestonePriority, MILESTONE_TYPE_LABELS, MILESTONE_PRIORITY_LABELS, PHASE_LABELS, ProjectPhase } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarBlank, Trash, CheckCircle, XCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MilestoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (milestone: Partial<ProjectMilestone>) => void
  onDelete?: (milestoneId: string) => void
  milestone?: ProjectMilestone
  projects: Project[]
  preselectedDate?: Date | null
}

export function MilestoneDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  milestone,
  projects,
  preselectedDate
}: MilestoneDialogProps) {
  const [formData, setFormData] = useState<Partial<ProjectMilestone>>({
    projectId: '',
    title: '',
    description: '',
    type: 'custom',
    date: Date.now(),
    priority: 'medium',
    status: 'pending'
  })
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  useEffect(() => {
    if (milestone) {
      setFormData(milestone)
    } else {
      setFormData({
        projectId: '',
        title: '',
        description: '',
        type: 'custom',
        date: preselectedDate ? preselectedDate.getTime() : Date.now(),
        priority: 'medium',
        status: 'pending'
      })
    }
  }, [milestone, open, preselectedDate])

  const selectedProject = projects.find(p => p.id === formData.projectId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.projectId || !formData.title || !formData.type || !formData.date) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    onSave(formData)
    toast.success(milestone ? 'Hito actualizado correctamente' : 'Hito creado correctamente')
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (milestone && onDelete) {
      if (confirm('¿Estás seguro de que quieres eliminar este hito?')) {
        onDelete(milestone.id)
        toast.success('Hito eliminado correctamente')
        onOpenChange(false)
      }
    }
  }

  const handleStatusChange = (newStatus: 'pending' | 'completed' | 'cancelled') => {
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : undefined
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {milestone ? 'Editar Hito' : 'Nuevo Hito'}
          </DialogTitle>
          <DialogDescription>
            {milestone ? 'Modifica los detalles del hito' : 'Crea un nuevo hito para el proyecto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Proyecto *</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectId: value }))}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Selecciona un proyecto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej: Entrega de Proyecto Básico"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalles adicionales del hito..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: MilestoneType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MILESTONE_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: MilestonePriority) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MILESTONE_PRIORITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fecha *</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarBlank className="mr-2" size={16} />
                    {formData.date ? format(new Date(formData.date), 'PPP', { locale: es }) : 'Selecciona una fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFormData(prev => ({ ...prev, date: date.getTime() }))
                        setDatePickerOpen(false)
                      }
                    }}
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedProject && selectedProject.phases && selectedProject.phases.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="relatedPhase">Fase Relacionada (Opcional)</Label>
                <Select
                  value={formData.relatedPhase || ''}
                  onValueChange={(value: ProjectPhase) => setFormData(prev => ({ ...prev, relatedPhase: value || undefined }))}
                >
                  <SelectTrigger id="relatedPhase">
                    <SelectValue placeholder="Ninguna" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguna</SelectItem>
                    {selectedProject.phases.map((phase) => (
                      <SelectItem key={phase.phase} value={phase.phase}>
                        {PHASE_LABELS[phase.phase]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {milestone && (
              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.status === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('pending')}
                    className="flex-1"
                  >
                    Pendiente
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle size={16} weight="fill" />
                    Completado
                  </Button>
                  <Button
                    type="button"
                    variant={formData.status === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange('cancelled')}
                    className="flex-1 gap-2"
                  >
                    <XCircle size={16} weight="fill" />
                    Cancelado
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            {milestone && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto gap-2"
              >
                <Trash size={16} weight="bold" />
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {milestone ? 'Guardar Cambios' : 'Crear Hito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
