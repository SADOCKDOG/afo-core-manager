import { InvoiceList } from '../features/finance/InvoiceList'

export function BillingManagerPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Facturación</p>
                <h1>Gestión de Facturas</h1>
            </div>
            <div className="grid two">
                <InvoiceList />
                <div className="card">
                    <div className="card-head">
                        <div className="card-title-row">
                            <div className="card-icon">🧾</div>
                            <div>
                                <h2>Generación automática CFO</h2>
                                <p className="muted">Trigger de factura final</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="callout">Al completar el CFO, generar factura (pendiente)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}