import { useMemo } from 'react'
import { useProjectContext } from '../../lib/context/ProjectContext'
import { mockDocuments } from '../../lib/data/mockDocuments'
import { listDocuments } from '../../lib/services/documents'

export function DocumentList() {
    const { projectId } = useProjectContext()
    const docs = useMemo(() => {
        const stored = listDocuments(projectId)
        return stored.length ? stored : mockDocuments
    }, [projectId])
    return (
        <div className="card">
            <div className="card-head">
                <div className="card-title-row">
                    <div className="card-icon">🗃️</div>
                    <div>
                        <h2>Documentos recientes</h2>
                        <p className="muted">ISO19650-2</p>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <ul className="list">
                    {docs.slice(0, 5).map(doc => (
                        <li key={doc.id} className="list-row">
                            <div>
                                <div className="strong">{doc.name}</div>
                                <div className="muted">{doc.version} — {doc.status}</div>
                            </div>
                            <div className="pill">{doc.discipline}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
