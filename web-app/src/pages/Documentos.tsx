import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { mockDocuments } from '../lib/data/mockDocuments'

export function DocumentosPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Documentos</p>
                <h1>Estructura ISO19650-2 y versionado</h1>
            </div>
            <Section title="Listado" description="Disciplinas y versiones P/C">
                <div className="grid two">
                    {mockDocuments.map(doc => (
                        <Card key={doc.id} title={doc.name} subtitle={`${doc.discipline} • ${doc.type}`}>
                            <div className="pill-row">
                                <span className="pill">{doc.version}</span>
                                <span className="pill">{doc.status}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
            <Section title="Pendientes" description="Importador inteligente de proyectos heredados">
                <div className="callout">Analizar carpetas, metadatos PDF y asignar disciplina/tipo automáticamente.</div>
            </Section>
        </div>
    )
}
