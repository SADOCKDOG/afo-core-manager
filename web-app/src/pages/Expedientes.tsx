import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { mockProjects } from '../lib/data/mockProjects'

export function ExpedientesPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Expedientes</p>
                <h1>Gestión de proyectos y visado</h1>
            </div>
            <Section title="Proyectos" description="Fases contratadas y estado de visado">
                <div className="grid two">
                    {mockProjects.map(p => (
                        <Card key={p.id} title={p.title} subtitle={`${p.client} • ${p.location}`}>
                            <div className="muted">Estado: {p.status}</div>
                            <div className="pill-row">
                                {p.phases.map(ph => (
                                    <span key={ph.phase} className="pill">
                                        {ph.phase} ({ph.percentage}%) — {ph.status}
                                    </span>
                                ))}
                            </div>
                            <div className="callout">Visado: tramitación / requerido / pago / retirar (pendiente de implementación)</div>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}
