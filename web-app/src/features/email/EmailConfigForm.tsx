import { getEmailConfig } from '../../lib/services/email'

export function EmailConfigForm() {
    const cfg = getEmailConfig()
    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">⚙️</div>
                    <div>
                        <h2>Configuración</h2>
                        <p className="muted">Proveedor y remitente</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="callout">Formulario de configuración (pendiente)</div>
            </div>
        </div>
    )
}
