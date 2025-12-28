import { useEffect, useState } from 'react'
import { AFO_ITEMS, getChecklist, toggleChecklistItem } from '../../lib/services/compliance'

export function AFOChecklist() {
    const [state, setState] = useState(getChecklist('afo'))

    useEffect(() => {
        setState(getChecklist('afo'))
    }, [])

    const total = AFO_ITEMS.length
    const done = AFO_ITEMS.filter(i => state[i.id]).length
    const pct = total === 0 ? 0 : Math.round((done / total) * 100)

    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">📋</div>
                    <div>
                        <h2>Checklist AFO</h2>
                        <p className="muted">Protocolo de Asimilado Fuera de Ordenación</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="metric">
                    <div className="muted">Progreso</div>
                    <div className="strong">{pct}%</div>
                    <div className="muted">{done}/{total} hechos</div>
                </div>
                <ul className="list">
                    {AFO_ITEMS.map(item => (
                        <li key={item.id} className="list-row">
                            <div>
                                <div className="strong">{item.text}</div>
                                {item.reference && <div className="muted">{item.reference}</div>}
                            </div>
                            <input
                                type="checkbox"
                                checked={!!state[item.id]}
                                onChange={() => setState(toggleChecklistItem('afo', item.id))}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
