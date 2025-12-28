import { useState } from 'react'
import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { MilestoneCalendar } from '../components/dashboard/MilestoneCalendar'
import { NotificationFeed } from '../components/dashboard/NotificationFeed'
import { TaskList } from '../components/dashboard/TaskList'
import { ProjectCard } from '../components/projects/ProjectCard'
import { mockProjects } from '../lib/data/mockProjects'
import { mockCompliance } from '../lib/data/mockCompliance'
import { mockFinance } from '../lib/data/mockFinance'
import {
    mockMilestones,
    mockNotifications,
    mockTasks,
    mockVisadoStates
} from '../lib/data/mockExtended'

export function DashboardPage() {
    const [notifications, setNotifications] = useState(mockNotifications)
    const activeProjects = mockProjects.filter(p => p.status === 'active')
    const pendingInvoices = mockFinance.filter(f => f.status === 'pending')
    const urgentCompliance = mockCompliance.filter(c => c.priority === 'high')
    const upcomingMilestones = mockMilestones.filter(m => !m.completed)

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        )
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Dashboard</p>
                    <h1>Visión general del estudio</h1>
                </div>
            </div>

            {/* Sección de proyectos activos */}
            <Section title="Proyectos activos" description="Estado y avance de expedientes">
                <div className="projects-grid">
                    {activeProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            visadoState={mockVisadoStates[project.id]}
                        />
                    ))}
                </div>
            </Section>

            {/* Fila de columnas: Tareas, Calendario, Notificaciones */}
            <div className="dashboard-columns">
                <Card title="Tareas pendientes" subtitle={`${mockTasks.filter(t => !t.completed).length} activas`}>
                    <TaskList tasks={mockTasks} />
                </Card>

                <Card title="Próximos hitos" subtitle="Calendario de entregas">
                    <MilestoneCalendar milestones={upcomingMilestones} />
                </Card>

                <Card title="Notificaciones" subtitle={`${notifications.filter(n => !n.read).length} sin leer`}>
                    <NotificationFeed
                        notifications={notifications}
                        onMarkAsRead={handleMarkAsRead}
                    />
                </Card>
            </div>

            {/* Fila de alertas y finanzas */}
            <div className="grid two">
                <Card title="Alertas normativas" subtitle="Prioridad alta">
                    <ul className="list">
                        {urgentCompliance.map(item => (
                            <li key={item.id} className="list-row">
                                <div>
                                    <div className="strong">{item.category}</div>
                                    <div className="muted">{item.requirement}</div>
                                </div>
                                <div className="badge">{item.reference}</div>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Cobros pendientes" subtitle="Facturación por hitos">
                    <ul className="list">
                        {pendingInvoices.map(inv => (
                            <li key={inv.id} className="list-row">
                                <div>
                                    <div className="strong">{inv.concept}</div>
                                    <div className="muted">Proyecto {inv.projectId}</div>
                                </div>
                                <div className="pill">
                                    {inv.amount.toLocaleString('es-ES', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    )
}
