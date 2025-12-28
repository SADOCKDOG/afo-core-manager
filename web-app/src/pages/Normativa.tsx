import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { mockCompliance } from '../lib/data/mockCompliance'

export function NormativaPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Normativa</p>
                <h1>Checklists CTE, RITE, REBT y municipal</h1>
            </div>
            <Section title="Requisitos" description="Prioriza por criticidad">
                <div className="grid two">
                    {mockCompliance.map(req => (
                        <Card key={req.id} title={req.category} subtitle={req.reference}>
                            <div className="muted">{req.requirement}</div>
                            <div className="pill-row">
                                <span className="pill">{req.code.toUpperCase()}</span>
                                <span className="pill">{req.priority}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
            <Section title="Pendientes" description="Checklist AFO y licencias municipales aún por integrar">
                <div className="callout">Añadir plantillas AFO y licencias como generadores configurables.</div>
            </Section>
        </div>
    )
}
