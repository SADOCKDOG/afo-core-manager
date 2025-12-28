import { BudgetEditor } from '../features/finance/BudgetEditor'

export function BudgetManagerPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Presupuestos</p>
                <h1>Gestión de Presupuestos</h1>
            </div>
            <div className="grid two">
                <BudgetEditor />
                <div className="card">
                    <div className="card-head">
                        <div className="card-title-row">
                            <div className="card-icon">🗃️</div>
                            <div>
                                <h2>Importar BC3</h2>
                                <p className="muted">Presupuestos estándar construcción</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="callout">Importador BC3 y mapeo de partidas (pendiente)</div>
                    </div>
                </div>
            </div>
        </div>
    )
}