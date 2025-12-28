import { Project } from '../types'

export const mockProjects: Project[] = [
    {
        id: 'p-001',
        title: 'Vivienda Unifamiliar en Seseña',
        client: 'Promociones Seseña',
        location: 'Seseña, Toledo',
        status: 'active',
        phases: [
            { phase: 'basico', percentage: 40, status: 'completed' },
            { phase: 'ejecucion', percentage: 40, status: 'in-progress' },
            { phase: 'direccion-obra', percentage: 20, status: 'pending' }
        ],
        nextMilestone: 'Entrega planos ejecución - 12/02'
    },
    {
        id: 'p-002',
        title: 'Reforma Local Comercial Lavapiés',
        client: 'BCN Retail',
        location: 'Madrid',
        status: 'on-hold',
        phases: [
            { phase: 'anteproyecto', percentage: 30, status: 'completed' },
            { phase: 'basico', percentage: 30, status: 'pending' },
            { phase: 'ejecucion', percentage: 40, status: 'pending' }
        ],
        nextMilestone: 'Revisión requisitos PGOU Madrid - 22/02'
    }
]
