import { Project, PHASE_LABELS, Stakeholder } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Circle, Clock, Pencil } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ProjectDetailProps {
  project: Project
  stakeholders: Stakeholder[]
  onBack: () => void
  onEdit: () => void
  onUpdatePhaseStatus: (phaseIndex: number, status: 'pending' | 'in-progress' | 'completed') => void
}

export function ProjectDetail({ project, stakeholders, onBack, onEdit, onUpdatePhaseStatus }: ProjectDetailProps) {
  const projectStakeholders = stakeholders.filter(s => project.stakeholders.includes(s.id))
  
  const statusColors = {
    active: 'bg-primary text-primary-foreground',
    archived: 'bg-muted text-muted-foreground',
    'on-hold': 'bg-accent text-accent-foreground'
  }

  const statusLabels = {
    active: 'Activo',
    archived: 'Archivado',
    'on-hold': 'En Pausa'
  }

  const phaseStatusColors = {
    pending: 'text-muted-foreground',
    'in-progress': 'text-accent',
    completed: 'text-primary'
  }

  const PhaseIcon = ({ status }: { status: 'pending' | 'in-progress' | 'completed' }) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} weight="fill" className="text-primary" />
      case 'in-progress':
        return <Clock size={20} weight="duotone" className="text-accent" />
      default:
        return <Circle size={20} weight="regular" className="text-muted-foreground" />
    }
  }

  const completedPhases = project.phases.filter(p => p.status === 'completed').length
  const totalPhases = project.phases.length
  const progressPercentage = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              <Badge className={statusColors[project.status]}>
                {statusLabels[project.status]}
              </Badge>
            </div>
            <p className="text-muted-foreground">{project.location}</p>
          </div>
        </div>
        <Button onClick={onEdit} variant="outline" className="gap-2">
          <Pencil size={16} />
          Editar
        </Button>
      </div>

      {project.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Fases del Proyecto</CardTitle>
              <CardDescription className="mt-1">
                {completedPhases} de {totalPhases} fases completadas
              </CardDescription>
            </div>
            <span className="text-2xl font-bold font-mono">{Math.round(progressPercentage)}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercentage} className="h-3" />
          
          <div className="space-y-3">
            {project.phases.map((phase, index) => (
              <div key={phase.phase} className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                <PhaseIcon status={phase.status} />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{PHASE_LABELS[phase.phase]}</h4>
                    <span className={`text-sm font-mono ${phaseStatusColors[phase.status]}`}>
                      {phase.percentage}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {phase.status !== 'completed' && (
                    <>
                      {phase.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdatePhaseStatus(index, 'in-progress')}
                        >
                          Iniciar
                        </Button>
                      )}
                      {phase.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdatePhaseStatus(index, 'completed')}
                        >
                          Completar
                        </Button>
                      )}
                    </>
                  )}
                  {phase.status === 'completed' && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Completada
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {projectStakeholders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Intervinientes</CardTitle>
            <CardDescription>
              Personas y entidades asociadas al proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectStakeholders.map(stakeholder => (
                <div key={stakeholder.id} className="flex items-start gap-4 p-4 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{stakeholder.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stakeholder.type === 'promotor' ? 'Promotor' : stakeholder.type === 'architect' ? 'Arquitecto' : 'Técnico'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>NIF/CIF: {stakeholder.nif}</p>
                      {stakeholder.email && <p>Email: {stakeholder.email}</p>}
                      {stakeholder.phone && <p>Teléfono: {stakeholder.phone}</p>}
                      {stakeholder.collegiateNumber && <p>Nº Colegiado: {stakeholder.collegiateNumber}</p>}
                      {stakeholder.qualification && <p>Titulación: {stakeholder.qualification}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Fecha de Creación</p>
              <p className="font-medium">{new Date(project.createdAt).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Última Actualización</p>
              <p className="font-medium">{new Date(project.updatedAt).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
