import { Card } from '../components/common/Card'
import { Section } from '../components/common/Section'
import { DocumentList } from '../features/documents/DocumentList'
import { DocumentUpload } from '../features/documents/DocumentUpload'

export function DocumentosPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Documentos</p>
                <h1>Estructura ISO19650-2 y versionado</h1>
            </div>
            <Section title="Listado" description="Disciplinas y versiones P/C">
                <div className="grid two">
                    <DocumentList />
                </div>
            </Section>
            <Section title="Pendientes" description="Importador inteligente de proyectos heredados">
                <div className="grid two">
                    <DocumentUpload />
                    <Card title="Importador inteligente" subtitle="Proyectos heredados">
                        <div className="callout">Analizar carpetas, metadatos PDF y asignar disciplina/tipo automáticamente.</div>
                    </Card>
                </div>
            </Section>
        </div>
    )
}
