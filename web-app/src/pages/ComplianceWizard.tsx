import { useState } from 'react'
import { CTEWizardStep } from '../features/compliance/CTEWizardStep'
import { mockProjects } from '../lib/data/mockProjects'

export function ComplianceWizardPage() {
    const [projectId, setProjectId] = useState<string | undefined>(mockProjects[0]?.id)
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">CTE</p>
                <h1>Asistente Guiado de Cumplimiento CTE</h1>
            </div>
            <div className="grid two">
                <div className="toolbar">
                    <label className="muted">Expediente</label>
                    <select value={projectId} onChange={e => setProjectId(e.target.value)}>
                        {mockProjects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
                <CTEWizardStep code="DB-SE" title="Seguridad estructural" projectId={projectId} />
                <CTEWizardStep code="DB-SI" title="Seguridad en caso de incendio" projectId={projectId} />
                <CTEWizardStep code="DB-SUA" title="Accesibilidad" projectId={projectId} />
                <CTEWizardStep code="DB-HS" title="Salubridad" projectId={projectId} />
                <CTEWizardStep code="DB-HE" title="Ahorro de energía" projectId={projectId} />
            </div>
        </div>
    )
}