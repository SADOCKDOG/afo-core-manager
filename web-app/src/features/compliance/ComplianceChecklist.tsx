import { useEffect, useState } from 'react'
import { CTE_SECTIONS, getChecklist, getCTEProgress, toggleChecklistItem } from '../../lib/services/compliance'

export function ComplianceChecklist() {
    const [state, setState] = useState(getChecklist('cte'))

    useEffect(() => {
        setState(getChecklist('cte'))
    }, [])

    const progress = getCTEProgress(state)

    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">✅</div>
                    <div>
                        <h2>Checklist CTE</h2>
                        <p className="muted">Secciones del CTE y puntos de revisión</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="grid two">
                    {progress.map(p => (
                        <div key={p.code} className="metric">
                            <div className="muted">{p.code}</div>
                            <div className="strong">{p.pct}%</div>
                            <div className="muted">{p.done}/{p.total} hechos</div>
                        </div>
                    ))}
                </div>
                {CTE_SECTIONS.map(section => (
                    <div key={section.code} className="section">
                        <div className="section-head">
                            <h3>{section.code} — {section.title}</h3>
                        </div>
                        <ul className="list">
                            {section.items.map(item => (
                                <li key={item.id} className="list-row">
                                    <div>
                                        <div className="strong">{item.text}</div>
                                        {item.reference && <div className="muted">{item.reference}</div>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!state[item.id]}
                                        onChange={() => setState(toggleChecklistItem('cte', item.id))}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
