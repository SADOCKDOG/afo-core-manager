import { CTEWizardStep } from '../features/compliance/CTEWizardStep'

export function ComplianceWizardPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">CTE</p>
                <h1>Asistente Guiado de Cumplimiento CTE</h1>
            </div>
            <div className="grid two">
                <CTEWizardStep code="DB-SE" title="Seguridad estructural" />
                <CTEWizardStep code="DB-SI" title="Seguridad en caso de incendio" />
                <CTEWizardStep code="DB-SUA" title="Accesibilidad" />
                <CTEWizardStep code="DB-HS" title="Salubridad" />
                <CTEWizardStep code="DB-HE" title="Ahorro de energía" />
            </div>
        </div>
    )
}