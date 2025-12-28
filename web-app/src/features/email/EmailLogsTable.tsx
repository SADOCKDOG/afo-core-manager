import { getEmailLogs } from '../../lib/services/email'

export function EmailLogsTable() {
    const logs = getEmailLogs()
    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">📬</div>
                    <div>
                        <h2>Histórico</h2>
                        <p className="muted">Envíos realizados</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <ul className="list">
                    {logs.map(log => (
                        <li key={log.id} className="list-row">
                            <div>
                                <div className="strong">{log.subject}</div>
                                <div className="muted">{log.to}</div>
                            </div>
                            <div className="pill">{log.status}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
