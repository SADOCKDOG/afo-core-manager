import { mockFinance } from '../../lib/data/mockFinance'
import { formatEUR } from '../../lib/services/finance'

export function InvoiceList() {
    const pending = mockFinance.filter(f => f.status === 'pending')
    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">📄</div>
                    <div>
                        <h2>Facturas pendientes</h2>
                        <p className="muted">Cobros por hitos</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <ul className="list">
                    {pending.map(inv => (
                        <li key={inv.id} className="list-row">
                            <div>
                                <div className="strong">{inv.concept}</div>
                                <div className="muted">Proyecto {inv.projectId}</div>
                            </div>
                            <div className="pill">{formatEUR(inv.amount)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
