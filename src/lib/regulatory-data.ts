export type RegulatoryCode = 
  | 'cte'
  | 'rite'
  | 'rebt'
  | 'costas'
  | 'urbanismo'
  | 'ehe'

export type CTEDocument = 
  | 'DB-SE'
  | 'DB-SE-AE'
  | 'DB-SE-C'
  | 'DB-SE-A'
  | 'DB-SE-F'
  | 'DB-SI'
  | 'DB-SUA'
  | 'DB-HS'
  | 'DB-HR'
  | 'DB-HE'

export interface RegulatoryQuery {
  id: string
  projectId?: string
  query: string
  codes: RegulatoryCode[]
  timestamp: number
  response?: string
  references?: RegulatoryReference[]
}

export interface RegulatoryReference {
  code: RegulatoryCode
  document: string
  section: string
  article?: string
  description: string
  content: string
  applicability?: string
}

export interface ComplianceCheck {
  id: string
  projectId: string
  checkType: 'automatic' | 'manual'
  category: string
  requirement: string
  status: 'compliant' | 'non-compliant' | 'pending' | 'not-applicable'
  evidence?: string
  notes?: string
  checkedAt?: number
  checkedBy?: string
}

export const REGULATORY_CODES: Record<RegulatoryCode, { name: string; description: string; color: string }> = {
  'cte': {
    name: 'CTE',
    description: 'Código Técnico de la Edificación',
    color: 'oklch(0.35 0.08 250)'
  },
  'rite': {
    name: 'RITE',
    description: 'Reglamento de Instalaciones Térmicas',
    color: 'oklch(0.65 0.15 40)'
  },
  'rebt': {
    name: 'REBT',
    description: 'Reglamento Electrotécnico para Baja Tensión',
    color: 'oklch(0.6 0.15 60)'
  },
  'ehe': {
    name: 'EHE-08',
    description: 'Instrucción de Hormigón Estructural',
    color: 'oklch(0.5 0.1 200)'
  },
  'costas': {
    name: 'Ley de Costas',
    description: 'Legislación de Costas y Servidumbres',
    color: 'oklch(0.55 0.12 220)'
  },
  'urbanismo': {
    name: 'Urbanismo',
    description: 'Normativa Urbanística Municipal',
    color: 'oklch(0.45 0.1 150)'
  }
}

export const CTE_DOCUMENTS: Record<CTEDocument, { name: string; description: string }> = {
  'DB-SE': {
    name: 'DB-SE',
    description: 'Seguridad Estructural'
  },
  'DB-SE-AE': {
    name: 'DB-SE-AE',
    description: 'Seguridad Estructural - Acciones en la Edificación'
  },
  'DB-SE-C': {
    name: 'DB-SE-C',
    description: 'Seguridad Estructural - Cimientos'
  },
  'DB-SE-A': {
    name: 'DB-SE-A',
    description: 'Seguridad Estructural - Acero'
  },
  'DB-SE-F': {
    name: 'DB-SE-F',
    description: 'Seguridad Estructural - Fábrica'
  },
  'DB-SI': {
    name: 'DB-SI',
    description: 'Seguridad en Caso de Incendio'
  },
  'DB-SUA': {
    name: 'DB-SUA',
    description: 'Seguridad de Utilización y Accesibilidad'
  },
  'DB-HS': {
    name: 'DB-HS',
    description: 'Salubridad'
  },
  'DB-HR': {
    name: 'DB-HR',
    description: 'Protección frente al Ruido'
  },
  'DB-HE': {
    name: 'DB-HE',
    description: 'Ahorro de Energía'
  }
}

export const COMMON_QUERIES = [
  {
    category: 'Escaleras y Accesibilidad',
    queries: [
      'Dimensiones mínimas de escaleras',
      'Altura máxima de tramos de escalera',
      'Anchura mínima de pasillos',
      'Requisitos de accesibilidad para rampas'
    ]
  },
  {
    category: 'Protección contra Incendios',
    queries: [
      'Distancia máxima de recorrido de evacuación',
      'Anchura mínima de puertas de evacuación',
      'Resistencia al fuego de elementos estructurales',
      'Requisitos de sector de incendios'
    ]
  },
  {
    category: 'Estructuras y Cimentación',
    queries: [
      'Recubrimientos mínimos hormigón',
      'Coeficientes de seguridad estructural',
      'Tensión admisible del terreno',
      'Acciones de viento según ubicación'
    ]
  },
  {
    category: 'Instalaciones',
    queries: [
      'Ventilación sala de calderas',
      'Sección mínima de conductos de ventilación',
      'Distancias a líneas eléctricas',
      'Requisitos de red de agua potable'
    ]
  },
  {
    category: 'Eficiencia Energética',
    queries: [
      'Transmitancia térmica máxima de fachadas',
      'Requisitos de aislamiento acústico',
      'Limitación de demanda energética',
      'Instalaciones de energía renovable obligatorias'
    ]
  }
]
