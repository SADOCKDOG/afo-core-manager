import { createContext, useContext, useMemo, useState } from 'react'
import { mockProjects } from '../data/mockProjects'
import { listProjects } from '../services/projects'

interface ProjectContextValue {
    projectId?: string
    setProjectId: (id?: string) => void
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const stored = listProjects()
    const initialId = (stored.length ? stored[0]?.id : mockProjects[0]?.id)
    const [projectId, setProjectId] = useState<string | undefined>(initialId)
    const value = useMemo(() => ({ projectId, setProjectId }), [projectId])
    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjectContext() {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error('useProjectContext must be used within ProjectProvider')
    return ctx
}
