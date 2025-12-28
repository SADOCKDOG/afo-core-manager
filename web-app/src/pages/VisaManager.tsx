export function VisaManagerPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Visado</p>
                <h1>Gestión del Visado Colegial (COAM/COACM)</h1>
            </div>
            <div className="grid two">
                <div className="card">
                    <div className="card-head">
                        <div className="card-title-row">
                            <div className="card-icon">📋</div>
                            <div>
                                <h2>Estados del visado</h2>
                                <p className="muted">Tramitación → Requerido → Pago → Retirar</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="visado-flow">
                            <div className="flow-step"><div className="flow-badge badge-tramitacion">En tramitación</div></div>
                            <div className="flow-arrow">→</div>
                            <div className="flow-step"><div className="flow-badge badge-requerido">Requerido</div></div>
                            <div className="flow-arrow">→</div>
                            <div className="flow-step"><div className="flow-badge badge-pago">Pendiente de pago</div></div>
                            <div className="flow-arrow">→</div>
                            <div className="flow-step"><div className="flow-badge badge-retirar">Pendiente de retirar</div></div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-head">
                        <div className="card-title-row">
                            <div className="card-icon">🔎</div>
                            <div>
                                <h2>Motivos requeridos</h2>
                                <p className="muted">Detalle y subsanación</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="callout">Listado de motivos y documentos a aportar (pendiente de datos)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}