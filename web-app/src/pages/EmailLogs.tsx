import { EmailLogsTable } from '../features/email/EmailLogsTable'

export function EmailLogsPage() {
    return (
        <div className="page">
            <div className="page-header">
                <p className="eyebrow">Email</p>
                <h1>Histórico de Envíos</h1>
            </div>
            <EmailLogsTable />
        </div>
    )
}