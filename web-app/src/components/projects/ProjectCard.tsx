import { Project } from '../../lib/types'
import { VisadoState } from '../../lib/types-extended'

interface ProjectCardProps {
    project: Project
    visadoState?: VisadoState
    onClick?: () => void
}

export function ProjectCard({ project, visadoState, onClick }: ProjectCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'status-active'
            case 'on-hold': return 'status-hold'
            case 'archived': return 'status-archived'
            default: return ''
        }
    }

    const getVisadoBadge = (state?: VisadoState) => {
        if (!state) return null

        const badges: Record<string, { label: string; class: string }> = {
            'tramitacion': { label: 'En tramitación', class: 'badge-tramitacion' },
            'requerido': { label: 'Requerido', class: 'badge-requerido' },
            'pendiente-pago': { label: 'Pendiente pago', class: 'badge-pago' },
            'pendiente-retirar': { label: 'Pendiente retirar', class: 'badge-retirar' },
            'completado': { label: 'Completado', class: 'badge-completado' }
        }

        const badge = badges[state.status]
        return badge ? <span className={`visado-badge ${badge.class}`}>{badge.label}</span> : null
    }

    const getCurrentPhase = () => {
        const inProgress = project.phases.find(p => p.status === 'in-progress')
        return inProgress?.phase || project.phases[project.phases.length - 1]?.phase
    }

    const getProgressPercentage = () => {
        const completed = project.phases.filter(p => p.status === 'completed')
        const total = project.phases.length
        return Math.round((completed.length / total) * 100)
    }

    return (
        <div className="project-card" onClick={onClick}>
            <div className="project-card-header">
                <div>
                    <h3>{project.title}</h3>
                    <p className="muted">{project.client} • {project.location}</p>
                </div>
                <span className={`status-badge ${getStatusColor(project.status)}`}>
                    {project.status}
                </span>
            </div>

            <div className="project-card-body">
                <div className="project-phase">
                    <span className="label">Fase actual:</span>
                    <span className="value">{getCurrentPhase()}</span>
                </div>

                {visadoState && (
                    <div className="project-visado">
                        <span className="label">Visado:</span>
                        {getVisadoBadge(visadoState)}
                    </div>
                )}

                <div className="project-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                    </div>
                    <span className="progress-text">{getProgressPercentage()}%</span>
                </div>

                {project.nextMilestone && (
                    <div className="project-milestone">
                        <span className="milestone-icon">📅</span>
                        <span className="milestone-text">{project.nextMilestone}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
