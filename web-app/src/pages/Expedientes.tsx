import { useMemo, useState } from 'react'
import { Section } from '../components/common/Section'
import { ProjectCard } from '../components/projects/ProjectCard'
import { useProjectContext } from '../lib/context/ProjectContext'
import { mockClients } from '../lib/data/mockClients'
import { mockVisadoStates } from '../lib/data/mockExtended'
import { mockProjects } from '../lib/data/mockProjects'
import { linkProjectToClient } from '../lib/services/client-project-link'
import { listClients } from '../lib/services/clients'
import { createProject, listProjects } from '../lib/services/projects'

export function ExpedientesPage() {
    const { setProjectId } = useProjectContext()
    const [filter, setFilter] = useState<'all' | 'active' | 'on-hold'>('all')
    const [refresh, setRefresh] = useState(0)

    const projects = useMemo(() => {
        const stored = listProjects()
        return stored.length ? stored : mockProjects
    }, [refresh])

    const clients = useMemo(() => {
        const stored = listClients()
        return stored.length ? stored : mockClients
    }, [refresh])

    const filteredProjects = projects.filter(p => {
        if (filter === 'all') return true
        return p.status === filter
    })

    const [form, setForm] = useState({ title: '', location: '', clientId: clients[0]?.id })

    const handleCreate = () => {
        if (!form.title || !form.clientId) return
        const clientName = clients.find(c => c.id === form.clientId)?.name || ''
        const project = createProject({
            title: form.title,
            location: form.location,
            status: 'active',
            phases: [],
            client: clientName,
            clientId: form.clientId,
        })
        linkProjectToClient(form.clientId, project.id)
        setProjectId(project.id)
        setForm({ title: '', location: '', clientId: clients[0]?.id })
        setRefresh(x => x + 1)
    }

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
            </div>

            <Section title="Alta de expediente" description="Crear proyecto y vincular cliente">
                <div className="grid two">
                    <div className="card">
                        <div className="card-head"><div className="card-title-row"><div className="card-icon">➕</div><div><h2>Nuevo expediente</h2><p className="muted">Título, localización y cliente</p></div></div></div>
                        <div className="card-body">
                            <div className="form-row"><label>Título</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div className="form-row"><label>Localización</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                            <div className="form-row"><label>Cliente</label>
                                <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })}>
                                    {clients.map(c => (<option key={c.id} value={c.id}>{c.code ? `${c.code} — ${c.name}` : c.name}</option>))}
                                </select>
                            </div>
                            <button className="primary" onClick={handleCreate}>Crear expediente</button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Filtros */}
            <div className="filter-bar">
                <button
                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('all')}
                >
                    Todos ({projects.length})
                </button>
                <button
                    className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('active')}
                >
                    Activos ({projects.filter(p => p.status === 'active').length})
                </button>
                <button
                    className={filter === 'on-hold' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('on-hold')}
                >
                    En espera ({projects.filter(p => p.status === 'on-hold').length})
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
                            <div className="phases-detail">
                                <div className="phases-header">Fases contratadas:</div>
                                <div className="phases-list">
                                    {project.phases.map(phase => (
                                        <div key={phase.phase} className="phase-item">
                                            <div className="phase-name">{phase.phase}</div>
                                            <div className="phase-meta">
                                                <span className="phase-pct">{phase.percentage}%</span>
                                                <span className={`phase-status status-${phase.status}`}>{phase.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {mockVisadoStates[project.id]?.status === 'requerido' && (
                                getVisadoMotivos(project.id)
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Flujo de visado colegial">
                <div className="visado-flow">
                    <div className="flow-step">
                        <div className="flow-badge badge-tramitacion">En tramitación</div>
                        <div className="flow-desc muted">Expediente en revisión por el colegio profesional</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-requerido">Requerido</div>
                        <div className="flow-desc muted">Subsanar documentación indicada en plazo establecido</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-pago">Pendiente de pago</div>
                        <div className="flow-desc muted">Realizar pago de tasas de visado</div>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="flow-badge badge-retirar">Pendiente de retirar</div>
                        <div className="flow-desc muted">Recoger expediente visado en sede colegial</div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
