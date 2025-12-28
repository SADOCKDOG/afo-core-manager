import { createContext, useContext, useMemo, useState } from 'react'
import { mockProjects } from '../data/mockProjects'

interface ProjectContextValue {
    projectId?: string
    setProjectId: (id?: string) => void
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projectId, setProjectId] = useState<string | undefined>(mockProjects[0]?.id)
    const value = useMemo(() => ({ projectId, setProjectId }), [projectId])
    return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProjectContext() {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error('useProjectContext must be used within ProjectProvider')
    return ctx
}
