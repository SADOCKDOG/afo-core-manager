import { useState } from 'react'
import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { ProjectCard } from '../components/projects/ProjectCard'
import { mockProjects } from '../lib/data/mockProjects'
import { mockVisadoStates } from '../lib/data/mockExtended'

export function ExpedientesPage() {
    const [filter, setFilter] = useState<'all' | 'active' | 'on-hold'>('all')

    const filteredProjects = mockProjects.filter(p => {
        if (filter === 'all') return true
        return p.status === filter
    })

    const getVisadoMotivos = (projectId: string) => {
        const state = mockVisadoStates[projectId]
        if (!state || !state.motivosRequerido) return null

        return (
            <div className="visado-motivos">
                <div className="motivos-header">
                    <span className="label">Motivos requeridos:</span>
                </div>
                <ul className="motivos-list">
                    {state.motivosRequerido.map((motivo, idx) => (
                        <li key={idx}>{motivo}</li>
                    ))}
                </ul>
                {state.observaciones && (
                    <div className="motivos-obs muted">{state.observaciones}</div>
                )}
            </div>
        )
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Expedientes</p>
                    <h1>Gestión de proyectos y visado</h1>
                </div>
                <div className="page-actions">
                    <button className="primary">+ Nuevo expediente</button>
                </div>
            </div>

            {/* Filtros */}
            <div className="filter-bar">
                <button
                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('all')}
                >
                    Todos ({mockProjects.length})
                </button>
                <button
                    className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('active')}
                >
                    Activos ({mockProjects.filter(p => p.status === 'active').length})
                </button>
                <button
                    className={filter === 'on-hold' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('on-hold')}
                >
                    En espera ({mockProjects.filter(p => p.status === 'on-hold').length})
                </button>
            </div>

            {/* Lista de proyectos */}
            <Section title="Expedientes" description="Fases contratadas y estado de visado">
                <div className="projects-grid">
                    {filteredProjects.map(project => (
                        <div key={project.id} className="project-detail-card">
                            <ProjectCard
                                project={project}
                                visadoState={mockVisadoStates[project.id]}
                            />
                            
                            {/* Detalle de fases */}
                            <div className="phases-detail">
                                <div className="phases-header">Fases contratadas:</div>
                                <div className="phases-list">
                                    {project.phases.map(phase => (
                                        <div key={phase.phase} className="phase-item">
                                            <div className="phase-name">{phase.phase}</div>
                                            <div className="phase-meta">
                                                <span className="phase-pct">{phase.percentage}%</span>
                                                <span className={`phase-status status-${phase.status}`}>
                                                    {phase.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Detalle de visado si está requerido */}
                            {mockVisadoStates[project.id]?.status === 'requerido' && (
                                getVisadoMotivos(project.id)
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {/* Ayuda contextual */}
            <Section title="Flujo de visado colegial">
                <div className="visado-flow">
                    <div className="flow-step">
                        <div className="flow-badge badge-tramitacion">En tramitación</div>
                        <div className="flow-desc muted">
                            Expediente en revisión por el colegio profesional
                        </div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-requerido">Requerido</div>
                        <div className="flow-desc muted">
                            Subsanar documentación indicada en plazo establecido
                        </div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-pago">Pendiente de pago</div>
                        <div className="flow-desc muted">
                            Realizar pago de tasas de visado
                        </div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-retirar">Pendiente de retirar</div>
                        <div className="flow-desc muted">
                            Recoger expediente visado en sede colegial
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
