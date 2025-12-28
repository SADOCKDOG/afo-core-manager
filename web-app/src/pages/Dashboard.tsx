import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { mockCompliance } from '../lib/data/mockCompliance'
import { mockDocuments } from '../lib/data/mockDocuments'
import { mockFinance } from '../lib/data/mockFinance'
import { mockProjects } from '../lib/data/mockProjects'

export function DashboardPage() {
    const active = mockProjects.filter(p => p.status === 'active')
    const pendingInvoices = mockFinance.filter(f => f.status === 'pending')
    const urgentCompliance = mockCompliance.filter(c => c.priority === 'high')

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Dashboard</p>
                    <h1>Visión general del estudio</h1>
                </div>
            </div>
            <div className="grid">
                <Card title="Proyectos activos" subtitle="Seguimiento resumido">
                    <ul className="list">
                        {active.map(p => (
                            <li key={p.id} className="list-row">
                                <div>
                                    <div className="strong">{p.title}</div>
                                    <div className="muted">{p.client} • {p.location}</div>
                                </div>
                                <div className="pill">{p.nextMilestone}</div>
                            </li>
                        ))}
                    </ul>
                </Card>
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
                <Card title="Documentos recientes" subtitle="ISO19650-2" >
                    <ul className="list">
                        {mockDocuments.slice(0, 3).map(doc => (
                            <li key={doc.id} className="list-row">
                                <div>
                                    <div className="strong">{doc.name}</div>
                                    <div className="muted">{doc.discipline} • {doc.type}</div>
                                </div>
                                <div className="pill">{doc.version}</div>
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
                                <div className="pill">{inv.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Section title="Próximos pasos" description="Hitos y acciones rápidas" >
                <div className="grid two">
                    <div className="callout">Añadir calendario de hitos y feed de notificaciones.</div>
                    <div className="callout">Integrar checklist AFO y licencias municipales.</div>
                </div>
            </Section>
        </div>
    )
}
