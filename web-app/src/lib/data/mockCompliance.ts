import { ComplianceRequirement } from '../types'

export const mockCompliance: ComplianceRequirement[] = [
    {
        id: 'c-cte-si-01',
        category: 'Seguridad en caso de incendio',
        requirement: 'Recorridos de evacuación < 25 m y dos salidas en zonas públicas',
        reference: 'CTE DB-SI 3.2',
        code: 'cte',
        priority: 'high'
    },
    {
        id: 'c-cte-he-01',
        category: 'Ahorro de energía',
        requirement: 'Transmisión térmica de cerramientos conforme a zona D3',
        reference: 'CTE DB-HE 1.3',
        code: 'cte',
        priority: 'medium'
    },
    {
        id: 'c-rite-01',
        category: 'Instalaciones térmicas',
        requirement: 'Producción ACS con rendimiento estacional mínimo',
        reference: 'RITE IT 1.2.4.2',
        code: 'rite',
        priority: 'medium'
    },
    {
        id: 'c-mun-01',
        category: 'Urbanismo local',
        requirement: 'Altura máxima 12 m sobre rasante en casco histórico',
        reference: 'PGOU Madrid Art. 6.2',
        code: 'municipal',
        priority: 'high'
    }
]
