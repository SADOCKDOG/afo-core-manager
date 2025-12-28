import { useMemo } from 'react'
import { useProjectContext } from '../../lib/context/ProjectContext'
import { mockProjects } from '../../lib/data/mockProjects'
import { listProjects } from '../../lib/services/projects'

export function ProjectSelector() {
    const { projectId, setProjectId } = useProjectContext()
    const projects = useMemo(() => {
        const stored = listProjects()
        return stored.length ? stored : mockProjects
    }, [])
    return (
        <div className="toolbar">
            <label className="muted">Expediente</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}>
                {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.code ? `${p.code} — ${p.title}` : p.title}</option>
                ))}
            </select>
        </div>
    )
}
