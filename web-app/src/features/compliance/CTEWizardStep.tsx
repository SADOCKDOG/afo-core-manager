interface CTEWizardStepProps {
    code: string
    title: string
    description?: string
}

export function CTEWizardStep({ code, title, description }: CTEWizardStepProps) {
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
                <div className="callout">Contenido del paso (formularios y validaciones) — pendiente</div>
            </div>
        </div>
    )
}
