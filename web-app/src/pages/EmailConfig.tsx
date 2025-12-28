import { EmailConfigForm } from '../features/email/EmailConfigForm'
export function EmailConfigPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Email</p>
                <h1>Configuración de Email</h1>
            </div>
            <div className="grid two">
                <EmailConfigForm />
            </div>
        </div>
    )
}