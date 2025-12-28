import { storage } from './storage'

const LINK_KEY = 'client-project-map'

export type ClientProjectMap = Record<string, string[]> // clientId -> [projectId]

export function getClientProjectMap(): ClientProjectMap {
    return storage.get<ClientProjectMap>(LINK_KEY, {})
}

export function linkProjectToClient(clientId: string, projectId: string) {
    const map = getClientProjectMap()
    const list = map[clientId] || []
    if (!list.includes(projectId)) list.push(projectId)
    map[clientId] = list
    storage.set(LINK_KEY, map)
}

export function listProjectsForClient(clientId: string): string[] {
    const map = getClientProjectMap()
    return map[clientId] || []
}

export function getClientForProject(projectId: string): string | undefined {
    const map = getClientProjectMap()
    for (const [clientId, projects] of Object.entries(map)) {
        if (projects.includes(projectId)) return clientId
    }
    return undefined
}
