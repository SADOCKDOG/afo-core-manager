export type Phase = 'estudio-previo' | 'anteproyecto' | 'basico' | 'ejecucion' | 'direccion-obra'
export type PhaseStatus = 'pending' | 'in-progress' | 'completed'
export type ProjectStatus = 'active' | 'archived' | 'on-hold'

export interface ProjectPhaseData {
    phase: Phase
    percentage: number
    status: PhaseStatus
}

export interface Project {
    id: string
    title: string
    client: string
    location: string
    status: ProjectStatus
    phases: ProjectPhaseData[]
    nextMilestone?: string
}

export interface ComplianceRequirement {
    id: string
    category: string
    requirement: string
    reference: string
    code: 'cte' | 'rite' | 'rebt' | 'municipal'
    priority: 'high' | 'medium' | 'low'
}

export interface DocumentItem {
    id: string
    name: string
    discipline: string
    type: string
    version: string
    status: 'draft' | 'shared' | 'approved'
}

export interface FinanceItem {
    id: string
    projectId: string
    concept: string
    amount: number
    status: 'pending' | 'paid'
}
