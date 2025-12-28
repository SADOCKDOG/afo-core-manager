export interface CTESection {
    code: 'DB-SE' | 'DB-SI' | 'DB-SUA' | 'DB-HS' | 'DB-HE'
    title: string
    items: { id: string; text: string; reference?: string; done?: boolean }[]
}

export const CTE_SECTIONS: CTESection[] = [
    {
        code: 'DB-SE', title: 'Seguridad estructural', items: [
            { id: 'se-01', text: 'Comprobación de acciones: CTE DB-SE-AE 3.1', reference: 'CTE DB-SE-AE 3.1' },
            { id: 'se-02', text: 'Dimensionado elementos resistentes' }
        ]
    },
    {
        code: 'DB-SI', title: 'Seguridad en caso de incendio', items: [
            { id: 'si-01', text: 'Evacuación y recorridos: CTE DB-SI 3', reference: 'CTE DB-SI 3' },
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
