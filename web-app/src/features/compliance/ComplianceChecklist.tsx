import { CTE_SECTIONS } from '../../lib/services/compliance'

export function ComplianceChecklist() {
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
                                    <input type="checkbox" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
