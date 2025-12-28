import { storage } from './storage';

export interface CTESection {
    code: 'DB-SE' | 'DB-SI' | 'DB-SUA' | 'DB-HS' | 'DB-HE'
    title: string
    items: { id: string; text: string; reference?: string }[]
}

export type ChecklistState = Record<string, boolean>

const CTE_KEY = 'cte-checklist'
const AFO_KEY = 'afo-checklist'

export const CTE_SECTIONS: CTESection[] = [
    {
        code: 'DB-SE', title: 'Seguridad estructural', items: [
            { id: 'se-01', text: 'Comprobación de acciones', reference: 'CTE DB-SE-AE 3.1' },
            { id: 'se-02', text: 'Dimensionado elementos resistentes' }
        ]
    },
    {
        code: 'DB-SI', title: 'Seguridad en caso de incendio', items: [
            { id: 'si-01', text: 'Evacuación y recorridos', reference: 'CTE DB-SI 3' },
            { id: 'si-02', text: 'Resistencia al fuego de estructura' }
        ]
    },
    {
        code: 'DB-SUA', title: 'Accesibilidad', items: [
            { id: 'sua-01', text: 'Itinerarios accesibles' },
            { id: 'sua-02', text: 'Aseos adaptados' }
        ]
    },
    {
        code: 'DB-HS', title: 'Salubridad', items: [
            { id: 'hs-01', text: 'Ventilación adecuada' },
            { id: 'hs-02', text: 'Protección frente a humedad' }
        ]
    },
    {
        code: 'DB-HE', title: 'Ahorro de energía', items: [
            { id: 'he-01', text: 'Limitación de demanda energética' },
            { id: 'he-02', text: 'Rendimiento instalaciones térmicas' }
        ]
    }
]

export const AFO_ITEMS: { id: string; text: string; reference?: string }[] = [
    { id: 'afo-01', text: 'Solicitud y declaración responsable', reference: 'LOUA / Ordenanza municipal' },
    { id: 'afo-02', text: 'Certificado técnico de seguridad (DB-SE, DB-SI)' },
    { id: 'afo-03', text: 'Informe de salubridad (DB-HS)' },
    { id: 'afo-04', text: 'Situación fuera de ordenación documentada' }
]

export function getChecklist(key: 'cte' | 'afo'): ChecklistState {
    const storeKey = key === 'cte' ? CTE_KEY : AFO_KEY
    return storage.get<ChecklistState>(storeKey, {})
}

export function setChecklist(key: 'cte' | 'afo', state: ChecklistState) {
    const storeKey = key === 'cte' ? CTE_KEY : AFO_KEY
    storage.set(storeKey, state)
}

export function toggleChecklistItem(key: 'cte' | 'afo', itemId: string): ChecklistState {
    const current = getChecklist(key)
    const next: ChecklistState = { ...current, [itemId]: !current[itemId] }
    setChecklist(key, next)
    return next
}

export function getCTEProgress(state: ChecklistState) {
    return CTE_SECTIONS.map(section => {
        const total = section.items.length
        const done = section.items.filter(i => state[i.id]).length
        const pct = total === 0 ? 0 : Math.round((done / total) * 100)
        return { code: section.code, title: section.title, done, total, pct }
    })
}
