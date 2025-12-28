import { useEffect, useState } from 'react'
import { getChecklist, getCTEProgress } from '../../lib/services/compliance'

interface CTEWizardStepProps {
    code: string
    title: string
    description?: string
}

export function CTEWizardStep({ code, title, description }: CTEWizardStepProps) {
    const [state, setState] = useState(getChecklist('cte'))

    useEffect(() => {
        setState(getChecklist('cte'))
    }, [])

    const sectionProgress = getCTEProgress(state).find(p => p.code === code)

    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">🧭</div>
                    <div>
                        <h2>{code} — {title}</h2>
                        {description && <p className="muted">{description}</p>}
                    </div>
                </div>
            </div>
            <div className="card-body">
                {sectionProgress && (
                    <div className="metric">
                        <div className="muted">Progreso</div>
                        <div className="strong">{sectionProgress.pct}%</div>
                        <div className="muted">{sectionProgress.done}/{sectionProgress.total} hechos</div>
                    </div>
                )}
                <div className="callout">Contenido del paso (formularios y validaciones) — pendiente</div>
            </div>
        </div>
    )
}
