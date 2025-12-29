import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  VisaApplication, 
  Project,
  ProfessionalCollege,
  ProjectPhase,
  PROFESSIONAL_COLLEGE_LABELS,
  PHASE_LABELS
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Buildings, CheckSquare } from '@phosphor-icons/react'
import { getDefaultRequirements } from '@/lib/visa-validation'

interface PermitApplicationFormProps {
  projectId?: string
  onSubmit: (data: Partial<VisaApplication>) => void
  onCancel: () => void
}

export function PermitApplicationForm({ projectId, onSubmit, onCancel }: PermitApplicationFormProps) {
  const [projects] = useKV<Project[]>('projects', [])
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '')
  const [selectedCollege, setSelectedCollege] = useState<ProfessionalCollege>('COAM')
  const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>([])
  const [notes, setNotes] = useState('')

  const availableProjects = (projects || []).filter(p => p.status === 'active')

  const handlePhaseToggle = (phase: ProjectPhase, checked: boolean) => {
    if (checked) {
      setSelectedPhases(prev => [...prev, phase])
    } else {
      setSelectedPhases(prev => prev.filter(p => p !== phase))
    }
  }

  const handleSubmit = () => {
    if (!selectedProjectId) return
    if (selectedPhases.length === 0) return

    const requirements = getDefaultRequirements(selectedPhases, selectedCollege)

    onSubmit({
      projectId: selectedProjectId,
      college: selectedCollege,
      phases: selectedPhases,
      requirements,
      notes: notes.trim() || undefined
    })
  }

  const isValid = selectedProjectId && selectedPhases.length > 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Buildings size={20} weight="duotone" />
            Datos del Proyecto
          </CardTitle>
          <CardDescription>
            Seleccione el proyecto y las fases a visar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project">Proyecto</Label>
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
              disabled={!!projectId}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Seleccionar proyecto..." />
              </SelectTrigger>
              <SelectContent>
                {availableProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title} - {project.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="college">Colegio Profesional</Label>
            <Select
              value={selectedCollege}
              onValueChange={(val) => setSelectedCollege(val as ProfessionalCollege)}
            >
              <SelectTrigger id="college">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROFESSIONAL_COLLEGE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare size={20} weight="duotone" />
            Fases a Visar
          </CardTitle>
          <CardDescription>
            Seleccione las fases del proyecto que desea incluir en el visado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(PHASE_LABELS).map(([phase, label]) => (
            <div key={phase} className="flex items-center space-x-2">
              <Checkbox
                id={`phase-${phase}`}
                checked={selectedPhases.includes(phase as ProjectPhase)}
                onCheckedChange={(checked) => handlePhaseToggle(phase as ProjectPhase, checked as boolean)}
              />
              <Label
                htmlFor={`phase-${phase}`}
                className="text-sm font-normal cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}

          {selectedPhases.length === 0 && (
            <p className="text-sm text-amber-400 mt-2">
              Debe seleccionar al menos una fase
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas Adicionales</CardTitle>
          <CardDescription>
            Información adicional sobre la solicitud (opcional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Ej: Proyecto en suelo urbano consolidado, cumple PGOU Seseña..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Crear Solicitud
        </Button>
      </div>
    </div>
  )
}
