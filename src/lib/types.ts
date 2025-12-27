export type ProjectPhase = 
  | 'estudio-previo'
  | 'anteproyecto'
  | 'basico'
  | 'ejecucion'
  | 'direccion-obra'

export type PhaseStatus = 'pending' | 'in-progress' | 'completed'

export type ProjectStatus = 'active' | 'archived' | 'on-hold'

export type StakeholderType = 'promotor' | 'architect' | 'technician'

export interface ProjectPhaseData {
  phase: ProjectPhase
  percentage: number
  status: PhaseStatus
}

export interface Stakeholder {
  id: string
  type: StakeholderType
  nif: string
  name: string
  address?: string
  email?: string
  phone?: string
  collegiateNumber?: string
  qualification?: string
}

export interface Project {
  id: string
  title: string
  description?: string
  location: string
  status: ProjectStatus
  phases: ProjectPhaseData[]
  stakeholders: string[]
  createdAt: number
  updatedAt: number
}

export const PHASE_LABELS: Record<ProjectPhase, string> = {
  'estudio-previo': 'Estudio Previo',
  'anteproyecto': 'Anteproyecto',
  'basico': 'Proyecto Básico',
  'ejecucion': 'Proyecto de Ejecución',
  'direccion-obra': 'Dirección de Obra'
}

export const STAKEHOLDER_TYPE_LABELS: Record<StakeholderType, string> = {
  'promotor': 'Promotor',
  'architect': 'Arquitecto',
  'technician': 'Técnico'
}
