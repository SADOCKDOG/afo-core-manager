import { DocumentItem } from '../types'
import { storage } from './storage'

const DOCS_KEY = 'documents'

export function listDocuments(projectId?: string): DocumentItem[] {
    const suffix = projectId ? `-${projectId}` : ''
    return storage.get<DocumentItem[]>(DOCS_KEY + suffix, [])
}

export function saveDocuments(docs: DocumentItem[], projectId?: string) {
    const suffix = projectId ? `-${projectId}` : ''
    storage.set(DOCS_KEY + suffix, docs)
}

export function getNextVersion(base: string): string {
    // Simple versioning: P01 -> P01.01 -> P01.02 ... C01
    if (base.startsWith('P') && base.includes('.')) {
        const [major, minor] = base.slice(1).split('.')
        const nMinor = String(parseInt(minor || '0') + 1).padStart(2, '0')
        return `P${major}.${nMinor}`
    }
    if (base.startsWith('P')) {
        const major = base.slice(1)
        const nMajor = String(parseInt(major || '1')).padStart(2, '0')
        return `P${nMajor}.01`
    }
    if (base.startsWith('C')) {
        const major = base.slice(1)
        const nMajor = String(parseInt(major || '1')).padStart(2, '0')
        return `C${nMajor}`
    }
    return 'P01'
}

export function iso19650Name(project: string, disciplina: string, descripcion: string, version: string, ext: string): string {
    return `${project}_${disciplina}_${descripcion}_${version}.${ext}`
}
