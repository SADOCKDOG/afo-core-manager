import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Project, PHASE_LABELS } from '@/lib/types'
import { Buildings, Clock, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: Project
  onClick: () => void
  index: number
}

export function ProjectCard({ project, onClick, index }: ProjectCardProps) {
  const completedPhases = project.phases.filter(p => p.status === 'completed').length
  const totalPhases = project.phases.length
  const progressPercentage = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0
  
  const inProgressPhases = project.phases.filter(p => p.status === 'in-progress')
  const currentPhase = inProgressPhases[0]

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card 
        className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-accent/50 group"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Buildings size={20} weight="duotone" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold tracking-tight truncate">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  {project.location}
                </CardDescription>
              </div>
            </div>
            <Badge className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium font-mono">
                {completedPhases}/{totalPhases} fases
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {currentPhase && (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-accent" weight="duotone" />
              <span className="text-muted-foreground">En curso:</span>
              <span className="font-medium">{PHASE_LABELS[currentPhase.phase]}</span>
            </div>
          )}

          {completedPhases === totalPhases && totalPhases > 0 && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <CheckCircle size={16} weight="fill" />
              <span className="font-medium">Todas las fases completadas</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
