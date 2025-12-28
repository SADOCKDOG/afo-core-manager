import { Client } from '../types'
import { storage } from './storage'

const CLIENTS_KEY = 'clients'

function getYear(): number { return new Date().getFullYear() }
function seqKey(year: number) { return `client-seq-${year}` }

export function generateClientCode(): string {
    const year = getYear()
    const key = seqKey(year)
    const current = storage.get<number>(key, 0)
    const next = current + 1
    storage.set(key, next)
    return `CLI-${year}-${String(next).padStart(4, '0')}`
}

export function listClients(): Client[] {
    return storage.get<Client[]>(CLIENTS_KEY, [])
}

export function saveClients(clients: Client[]) {
    storage.set(CLIENTS_KEY, clients)
}

export function createClient(data: Omit<Client, 'id' | 'code'>): Client {
    const id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    const code = generateClientCode()
    const client: Client = { id, code, ...data }
    const clients = listClients()
    clients.push(client)
    saveClients(clients)
    return client
}
