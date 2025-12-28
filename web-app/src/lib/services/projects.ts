import { Project } from '../types'
import { storage } from './storage'

const PROJECTS_KEY = 'projects'

function getYear(): number {
    return new Date().getFullYear()
}

function getSeqKey(year: number) {
    return `project-seq-${year}`
}

export function generateProjectCode(): string {
    const year = getYear()
    const seqKey = getSeqKey(year)
    const current = storage.get<number>(seqKey, 0)
    const next = current + 1
    storage.set(seqKey, next)
    const seqStr = String(next).padStart(4, '0')
    return `EXP-${year}-${seqStr}`
}

export function listProjects(): Project[] {
    return storage.get<Project[]>(PROJECTS_KEY, [])
}

export function saveProjects(projects: Project[]) {
    storage.set(PROJECTS_KEY, projects)
}

export function createProject(data: Omit<Project, 'id' | 'code'>): Project {
    const code = generateProjectCode()
    const id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    const project: Project = { id, code, ...data }
    const projects = listProjects()
    projects.push(project)
    saveProjects(projects)
    return project
}
