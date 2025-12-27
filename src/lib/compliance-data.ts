import { ComplianceCheck, RegulatoryCode, BuildingType, BuildingUse } from './types'

export interface ComplianceRequirement {
  category: string
  requirement: string
  regulatoryReference: string
  code: RegulatoryCode
  priority: 'high' | 'medium' | 'low'
  checkType: 'automatic' | 'manual'
  applicableTo: {
    buildingTypes?: BuildingType[]
    buildingUses?: BuildingUse[]
    conditions?: string
  }
}

export const RESIDENTIAL_COMPLIANCE_REQUIREMENTS: ComplianceRequirement[] = [
  {
    category: 'Seguridad Estructural',
    requirement: 'Verificación de cargas permanentes y variables según uso residencial',
    regulatoryReference: 'CTE DB-SE-AE 3.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Seguridad Estructural',
    requirement: 'Comprobación de acciones en edificación según sobrecarga de uso (2 kN/m²)',
    regulatoryReference: 'CTE DB-SE-AE Tabla 3.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Seguridad Estructural',
    requirement: 'Coeficientes de seguridad estructural aplicados',
    regulatoryReference: 'CTE DB-SE 4.3',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Propagación interior: compartimentación en sectores de incendio (≤2.500 m²)',
    regulatoryReference: 'CTE DB-SI 1.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Resistencia al fuego de elementos estructurales (R60 mínimo para altura <15m)',
    regulatoryReference: 'CTE DB-SI Tabla 3.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Reacción al fuego de materiales (suelos C-s2,d0; paredes y techos B-s1,d0)',
    regulatoryReference: 'CTE DB-SI 1.4',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Evacuación: número suficiente de salidas y recorridos de evacuación <25m',
    regulatoryReference: 'CTE DB-SI 3.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Instalación de detectores de humo en viviendas',
    regulatoryReference: 'CTE DB-SI 4.1',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Seguridad en caso de Incendio',
    requirement: 'Extintores portátiles en zonas comunes (1 cada 15m de recorrido)',
    regulatoryReference: 'CTE DB-SI 4.1',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Desniveles máximos sin protección (60 cm máximo)',
    regulatoryReference: 'CTE DB-SUA 1.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Dimensiones de escaleras: huella ≥22cm, contrahuella ≤20cm, anchura ≥1m',
    regulatoryReference: 'CTE DB-SUA 1.3.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Barandillas y antepechos: altura ≥90cm en viviendas (≥110cm en diferencias >6m)',
    regulatoryReference: 'CTE DB-SUA 1.3.3',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Suelos con características antideslizantes (clase 1 o 2 según localización)',
    regulatoryReference: 'CTE DB-SUA 1.4',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Accesibilidad en edificios de viviendas (itinerario accesible desde entrada)',
    regulatoryReference: 'CTE DB-SUA 9',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Seguridad de Utilización y Accesibilidad',
    requirement: 'Dotación de plazas de aparcamiento accesible (1 por cada 33 plazas)',
    regulatoryReference: 'CTE DB-SUA 9',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Salubridad',
    requirement: 'Protección frente a la humedad del suelo (muro enterrado tipo C2 o superior)',
    regulatoryReference: 'CTE DB-HS 1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Salubridad',
    requirement: 'Ventilación mecánica o natural con caudal mínimo en dormitorios (5 l/s·persona)',
    regulatoryReference: 'CTE DB-HS 3 Tabla 2.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Salubridad',
    requirement: 'Ventilación de baños y aseos sin ventana (admisión 10 l/s, extracción 15 l/s)',
    regulatoryReference: 'CTE DB-HS 3.1.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Salubridad',
    requirement: 'Red de evacuación de aguas residuales y pluviales independiente',
    regulatoryReference: 'CTE DB-HS 5',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Salubridad',
    requirement: 'Dimensionado de instalación de ACS según demanda (28 litros/día·persona)',
    regulatoryReference: 'CTE DB-HS 4',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Protección frente al Ruido',
    requirement: 'Aislamiento acústico a ruido aéreo entre recintos protegidos (≥50 dBA)',
    regulatoryReference: 'CTE DB-HR Tabla 2.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Protección frente al Ruido',
    requirement: 'Limitación de ruido de impacto en forjados (≤65 dB)',
    regulatoryReference: 'CTE DB-HR Tabla 2.2',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Ahorro de Energía',
    requirement: 'Limitación de demanda energética según zona climática',
    regulatoryReference: 'CTE DB-HE 1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Ahorro de Energía',
    requirement: 'Transmitancia térmica máxima de cerramientos según zona climática',
    regulatoryReference: 'CTE DB-HE 1 Tabla 3.1.1',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Ahorro de Energía',
    requirement: 'Contribución solar mínima de ACS (30%-70% según zona climática)',
    regulatoryReference: 'CTE DB-HE 4',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Ahorro de Energía',
    requirement: 'Certificación energética del edificio (obtención y registro)',
    regulatoryReference: 'RD 390/2021 Certificación Energética',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Instalaciones Térmicas',
    requirement: 'Bienestar térmico: temperatura operativa 21-23°C invierno, 23-25°C verano',
    regulatoryReference: 'RITE IT 1.1.4.1.2',
    code: 'rite',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Instalaciones Térmicas',
    requirement: 'Calidad del aire interior: categoría IDA 2 para viviendas',
    regulatoryReference: 'RITE IT 1.1.4.2.2',
    code: 'rite',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Instalaciones Térmicas',
    requirement: 'Eficiencia energética mínima de generadores de calor y frío',
    regulatoryReference: 'RITE IT 1.2.4.1',
    code: 'rite',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Instalaciones Térmicas',
    requirement: 'Recuperación de energía en sistemas de ventilación (rendimiento ≥75%)',
    regulatoryReference: 'RITE IT 1.2.4.5.2',
    code: 'rite',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Instalaciones Eléctricas',
    requirement: 'Grado de electrificación básica mínima para viviendas (5.750 W a 230V)',
    regulatoryReference: 'REBT ITC-BT-25',
    code: 'rebt',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Instalaciones Eléctricas',
    requirement: 'Instalación de interruptor diferencial (≤30mA) en circuitos de vivienda',
    regulatoryReference: 'REBT ITC-BT-25',
    code: 'rebt',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Instalaciones Eléctricas',
    requirement: 'Circuitos independientes: iluminación, tomas, cocina, lavadora, baño',
    regulatoryReference: 'REBT ITC-BT-25',
    code: 'rebt',
    priority: 'high',
    checkType: 'manual',
    applicableTo: { buildingUses: ['residencial-vivienda'] }
  },
  {
    category: 'Instalaciones Eléctricas',
    requirement: 'Protección contra sobretensiones (categoría II)',
    regulatoryReference: 'REBT ITC-BT-23',
    code: 'rebt',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Urbanismo y Planeamiento',
    requirement: 'Cumplimiento de retranqueos y separación a linderos según PGOU',
    regulatoryReference: 'PGOU Normas Urbanísticas',
    code: 'urbanismo',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Urbanismo y Planeamiento',
    requirement: 'Edificabilidad máxima según ordenanza de zona aplicable',
    regulatoryReference: 'PGOU Normas Urbanísticas',
    code: 'urbanismo',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Urbanismo y Planeamiento',
    requirement: 'Altura máxima de edificación según ordenanza',
    regulatoryReference: 'PGOU Normas Urbanísticas',
    code: 'urbanismo',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Urbanismo y Planeamiento',
    requirement: 'Ocupación máxima de parcela según normativa municipal',
    regulatoryReference: 'PGOU Normas Urbanísticas',
    code: 'urbanismo',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Urbanismo y Planeamiento',
    requirement: 'Dotación de plazas de aparcamiento (1 plaza/100m² construidos)',
    regulatoryReference: 'PGOU Normas Urbanísticas',
    code: 'urbanismo',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Gestión de Residuos',
    requirement: 'Elaboración de estudio de gestión de residuos de construcción',
    regulatoryReference: 'RD 105/2008 Gestión de Residuos',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Gestión de Residuos',
    requirement: 'Estimación de residuos generados por tipología y peso',
    regulatoryReference: 'RD 105/2008 Art. 4',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Control de Calidad',
    requirement: 'Plan de control de calidad conforme a normativa autonómica',
    regulatoryReference: 'Normativa Autonómica Calidad',
    code: 'cte',
    priority: 'high',
    checkType: 'manual',
    applicableTo: {}
  },
  {
    category: 'Libro del Edificio',
    requirement: 'Elaboración del Libro del Edificio con documentación final de obra',
    regulatoryReference: 'RD 515/1989 y Autonómicas',
    code: 'cte',
    priority: 'medium',
    checkType: 'manual',
    applicableTo: {}
  }
]

export function generateComplianceChecksForProject(
  projectId: string,
  buildingType: BuildingType,
  buildingUse: BuildingUse,
  buildingSurface?: number,
  buildingHeight?: number
): ComplianceCheck[] {
  return RESIDENTIAL_COMPLIANCE_REQUIREMENTS
    .filter(req => {
      if (req.applicableTo.buildingTypes && !req.applicableTo.buildingTypes.includes(buildingType)) {
        return false
      }
      if (req.applicableTo.buildingUses && !req.applicableTo.buildingUses.includes(buildingUse)) {
        return false
      }
      return true
    })
    .map(req => ({
      id: `${projectId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      checkType: req.checkType,
      category: req.category,
      requirement: req.requirement,
      regulatoryReference: req.regulatoryReference,
      status: 'pending' as const,
      priority: req.priority,
      evidence: undefined,
      notes: undefined,
      checkedAt: undefined,
      checkedBy: undefined
    }))
}

export const COMPLIANCE_CATEGORIES = [
  'Seguridad Estructural',
  'Seguridad en caso de Incendio',
  'Seguridad de Utilización y Accesibilidad',
  'Salubridad',
  'Protección frente al Ruido',
  'Ahorro de Energía',
  'Instalaciones Térmicas',
  'Instalaciones Eléctricas',
  'Urbanismo y Planeamiento',
  'Gestión de Residuos',
  'Control de Calidad',
  'Libro del Edificio'
]

export const BUILDING_TYPE_LABELS = {
  'vivienda-unifamiliar': 'Vivienda Unifamiliar',
  'vivienda-colectiva': 'Vivienda Colectiva',
  'vivienda-plurifamiliar': 'Edificio Plurifamiliar',
  'rehabilitacion': 'Rehabilitación',
  'ampliacion': 'Ampliación'
}

export const BUILDING_USE_LABELS = {
  'residencial-vivienda': 'Residencial Vivienda',
  'residencial-publico': 'Residencial Público',
  'administrativo': 'Administrativo',
  'sanitario': 'Sanitario',
  'docente': 'Docente',
  'comercial': 'Comercial',
  'aparcamiento': 'Aparcamiento'
}

export const CLIMATE_ZONES = [
  { value: 'A3', label: 'A3 - Almería, Málaga' },
  { value: 'A4', label: 'A4 - Cádiz, Sevilla' },
  { value: 'B3', label: 'B3 - Valencia, Murcia' },
  { value: 'B4', label: 'B4 - Badajoz, Córdoba' },
  { value: 'C1', label: 'C1 - La Coruña, Santander' },
  { value: 'C2', label: 'C2 - Barcelona, Tarragona' },
  { value: 'C3', label: 'C3 - Castellón, Alicante' },
  { value: 'C4', label: 'C4 - Toledo, Ciudad Real' },
  { value: 'D1', label: 'D1 - Lugo, Pontevedra' },
  { value: 'D2', label: 'D2 - Valladolid, Zaragoza' },
  { value: 'D3', label: 'D3 - Madrid, Guadalajara' },
  { value: 'E1', label: 'E1 - Burgos, León' }
]
