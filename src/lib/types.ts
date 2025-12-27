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

export type FolderStructureType = 'by-type' | 'screaming-architecture'

export type DocumentType = 
  | 'plano'
  | 'memoria'
  | 'presupuesto'
  | 'imagen'
  | 'administrativo'
  | 'modelo'
  | 'instalaciones'
  | 'detalles-constructivos'
  | 'otros'

export type DocumentStatus = 
  | 'draft'
  | 'shared'
  | 'approved'

export interface DocumentVersion {
  id: string
  version: string
  fileName: string
  fileSize: number
  uploadedAt: number
  uploadedBy: string
  status: DocumentStatus
  notes?: string
}

export interface Document {
  id: string
  projectId: string
  name: string
  type: DocumentType
  folder: string
  currentVersion: string
  versions: DocumentVersion[]
  createdAt: number
  updatedAt: number
  metadata: {
    discipline?: string
    description?: string
    format?: string
    application?: string
  }
}

export interface FolderStructure {
  id: string
  projectId: string
  type: FolderStructureType
  folders: string[]
  createdAt: number
}

export interface Project {
  id: string
  title: string
  description?: string
  location: string
  status: ProjectStatus
  phases: ProjectPhaseData[]
  stakeholders: string[]
  folderStructure?: FolderStructureType
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

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  'plano': 'Planos',
  'memoria': 'Memorias',
  'presupuesto': 'Presupuestos',
  'imagen': 'Imágenes',
  'administrativo': 'Administrativo',
  'modelo': 'Modelos 3D',
  'instalaciones': 'Instalaciones',
  'detalles-constructivos': 'Detalles Constructivos',
  'otros': 'Otros'
}

export const FOLDER_STRUCTURES: Record<FolderStructureType, { name: string; folders: string[] }> = {
  'by-type': {
    name: 'Por Tipo de Archivo',
    folders: [
      '01_Planos',
      '02_Memorias',
      '03_Presupuestos',
      '04_Imágenes',
      '05_Administrativo',
      '06_Modelos_3D',
      '07_Instalaciones',
      '08_Otros'
    ]
  },
  'screaming-architecture': {
    name: 'Arquitectura de Gritos',
    folders: [
      'Componentes',
      'Servicios',
      'Modelos',
      'Documentación',
      'Administrativo',
      'Presentación',
      'Referencias'
    ]
  }
}
