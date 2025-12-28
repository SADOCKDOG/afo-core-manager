import { VisadoState } from '../../lib/types-extended'

interface VisaStatusPanelProps { state: VisadoState }

export function VisaStatusPanel({ state }: VisaStatusPanelProps) {
    const map: Record<VisadoState['status'], string> = {
        'tramitacion': 'En tramitación',
        'requerido': 'Requerido',
        'pendiente-pago': 'Pendiente de pago',
        'pendiente-retirar': 'Pendiente de retirar',
        'completado': 'Completado'
    }
    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">📋</div>
                    <div>
                        <h2>Estado del visado</h2>
                        <p className="muted">{map[state.status]}</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {state.motivosRequerido && state.motivosRequerido.length > 0 && (
                    <div className="visado-motivos">
                        <div className="motivos-header"><span className="label">Motivos requeridos</span></div>
                        <ul className="motivos-list">
                            {state.motivosRequerido.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
