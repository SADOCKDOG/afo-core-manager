import { ComplianceChecklist } from '../features/compliance/ComplianceChecklist'

export function AFOChecklistPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">AFO</p>
                <h1>Checklist AFO y Licencias Municipales</h1>
            </div>
            <div className="grid two">
                <ComplianceChecklist />

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