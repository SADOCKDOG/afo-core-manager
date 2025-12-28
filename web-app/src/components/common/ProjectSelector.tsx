import { useProjectContext } from '../../lib/context/ProjectContext'
import { mockProjects } from '../../lib/data/mockProjects'

export function ProjectSelector() {
    const { projectId, setProjectId } = useProjectContext()
    return (
        <div className="toolbar">
            <label className="muted">Expediente</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}>
                {mockProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                ))}
            </select>
        </div>
    )
}
