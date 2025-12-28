import { useState } from 'react'
import { AFOChecklist } from '../features/compliance/AFOChecklist'
import { mockProjects } from '../lib/data/mockProjects'

export function AFOChecklistPage() {
    const [projectId, setProjectId] = useState<string | undefined>(mockProjects[0]?.id)
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">AFO</p>
                <h1>Checklist AFO y Licencias Municipales</h1>
            </div>
            <div className="grid two">
                <div>
                    <div className="toolbar">
                        <label className="muted">Expediente</label>
                        <select value={projectId} onChange={e => setProjectId(e.target.value)}>
                            {mockProjects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <AFOChecklist projectId={projectId} />
                </div>

                <div className="card">
                    <div className="card-head">
                        <div className="card-title-row">
                            <div className="card-icon">🏛️</div>
                            <div>
                                <h2>Licencias Municipales</h2>
                                <p className="muted">Plantillas y requisitos por ayuntamiento</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="callout">Integración de PGOU y ordenanzas municipales (pendiente de datos)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}