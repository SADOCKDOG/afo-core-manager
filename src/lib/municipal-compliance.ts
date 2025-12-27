import { RegulatoryCode, BuildingType, BuildingUse } from './types'

export interface MunicipalRequirement {
  id: string
  municipalityId: string
  municipalityName: string
  province: string
  category: string
  requirement: string
  regulatoryReference: string
  customReference: string
  priority: 'high' | 'medium' | 'low'
  checkType: 'automatic' | 'manual'
  applicableTo: {
    buildingTypes?: BuildingType[]
    buildingUses?: BuildingUse[]
    conditions?: string
  }
  effectiveDate?: number
  expiryDate?: number
  notes?: string
}

export interface Municipality {
  id: string
  name: string
  province: string
  autonomousCommunity: string
  requirements: MunicipalRequirement[]
  createdAt: number
  updatedAt: number
}

export const SPANISH_PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona',
  'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba',
  'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca',
  'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida',
  'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra',
  'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
]

export const AUTONOMOUS_COMMUNITIES: Record<string, string[]> = {
  'Andalucía': ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'],
  'Aragón': ['Huesca', 'Teruel', 'Zaragoza'],
  'Asturias': ['Asturias'],
  'Islas Baleares': ['Islas Baleares'],
  'Canarias': ['Las Palmas', 'Santa Cruz de Tenerife'],
  'Cantabria': ['Cantabria'],
  'Castilla y León': ['Ávila', 'Burgos', 'León', 'Palencia', 'Salamanca', 'Segovia', 'Soria', 'Valladolid', 'Zamora'],
  'Castilla-La Mancha': ['Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara', 'Toledo'],
  'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
  'Comunidad Valenciana': ['Alicante', 'Castellón', 'Valencia'],
  'Extremadura': ['Badajoz', 'Cáceres'],
  'Galicia': ['La Coruña', 'Lugo', 'Ourense', 'Pontevedra'],
  'Madrid': ['Madrid'],
  'Murcia': ['Murcia'],
  'Navarra': ['Navarra'],
  'País Vasco': ['Álava', 'Guipúzcoa', 'Vizcaya'],
  'La Rioja': ['La Rioja']
}

export const DEFAULT_MUNICIPAL_CATEGORIES = [
  'Urbanismo Local',
  'Licencias y Permisos',
  'Protección del Patrimonio',
  'Medioambiente Local',
  'Ordenanzas Municipales',
  'Estética y Composición',
  'Dotaciones y Servicios',
  'Aparcamiento',
  'Eficiencia Energética Local',
  'Accesibilidad Municipal'
]

export const EXAMPLE_MUNICIPALITIES: Municipality[] = [
  {
    id: 'cartagena-murcia',
    name: 'Cartagena',
    province: 'Murcia',
    autonomousCommunity: 'Murcia',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    requirements: [
      {
        id: 'cart-001',
        municipalityId: 'cartagena-murcia',
        municipalityName: 'Cartagena',
        province: 'Murcia',
        category: 'Urbanismo Local',
        requirement: 'Retranqueo mínimo de 5 metros a vía pública en zona residencial',
        regulatoryReference: 'PGOU Cartagena Art. 7.23',
        customReference: 'Plan General de Ordenación Urbana de Cartagena, Título VII, Art. 7.23',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {
          buildingTypes: ['vivienda-unifamiliar', 'vivienda-plurifamiliar']
        }
      },
      {
        id: 'cart-002',
        municipalityId: 'cartagena-murcia',
        municipalityName: 'Cartagena',
        province: 'Murcia',
        category: 'Protección del Patrimonio',
        requirement: 'Conservación de elementos arquitectónicos en edificios catalogados',
        regulatoryReference: 'Catálogo de Bienes Protegidos Cartagena',
        customReference: 'Catálogo Municipal de Bienes y Espacios Protegidos',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {}
      },
      {
        id: 'cart-003',
        municipalityId: 'cartagena-murcia',
        municipalityName: 'Cartagena',
        province: 'Murcia',
        category: 'Aparcamiento',
        requirement: 'Dotación de 1 plaza de aparcamiento por cada 80m² construidos en uso residencial',
        regulatoryReference: 'PGOU Cartagena Art. 8.15',
        customReference: 'Plan General de Ordenación Urbana, Normas sobre dotación de aparcamiento',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {
          buildingUses: ['residencial-vivienda']
        }
      }
    ]
  },
  {
    id: 'madrid-capital',
    name: 'Madrid',
    province: 'Madrid',
    autonomousCommunity: 'Madrid',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    requirements: [
      {
        id: 'mad-001',
        municipalityId: 'madrid-capital',
        municipalityName: 'Madrid',
        province: 'Madrid',
        category: 'Medioambiente Local',
        requirement: 'Protocolo de contaminación: restricción de obras en episodios de alta contaminación',
        regulatoryReference: 'Ordenanza de Calidad del Aire Madrid',
        customReference: 'Ordenanza de Calidad del Aire y Sostenibilidad del Ayuntamiento de Madrid',
        priority: 'medium',
        checkType: 'manual',
        applicableTo: {}
      },
      {
        id: 'mad-002',
        municipalityId: 'madrid-capital',
        municipalityName: 'Madrid',
        province: 'Madrid',
        category: 'Estética y Composición',
        requirement: 'Composición de fachadas en Áreas de Protección: respeto a tipología tradicional',
        regulatoryReference: 'PGOUM Madrid Catálogo de Edificios Protegidos',
        customReference: 'Plan General de Ordenación Urbana de Madrid, Normativa de Protección',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {}
      },
      {
        id: 'mad-003',
        municipalityId: 'madrid-capital',
        municipalityName: 'Madrid',
        province: 'Madrid',
        category: 'Eficiencia Energética Local',
        requirement: 'Instalación obligatoria de energías renovables en edificios de nueva construcción',
        regulatoryReference: 'Ordenanza de Rehabilitación y Conservación Madrid',
        customReference: 'Ordenanza sobre Conservación y Rehabilitación de Edificios',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {}
      }
    ]
  },
  {
    id: 'barcelona-capital',
    name: 'Barcelona',
    province: 'Barcelona',
    autonomousCommunity: 'Cataluña',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    requirements: [
      {
        id: 'bcn-001',
        municipalityId: 'barcelona-capital',
        municipalityName: 'Barcelona',
        province: 'Barcelona',
        category: 'Accesibilidad Municipal',
        requirement: 'Itinerarios accesibles: pendiente máxima del 8% en vía pública',
        regulatoryReference: 'Código de Accesibilidad de Cataluña',
        customReference: 'Decreto 135/1995 Código de Accesibilidad aplicable en Barcelona',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {}
      },
      {
        id: 'bcn-002',
        municipalityId: 'barcelona-capital',
        municipalityName: 'Barcelona',
        province: 'Barcelona',
        category: 'Dotaciones y Servicios',
        requirement: 'Reserva de espacio para contenedores de reciclaje selectivo en edificios >1000m²',
        regulatoryReference: 'Ordenanza de Gestión de Residuos Barcelona',
        customReference: 'Ordenanza General de Gestión de Residuos Municipales',
        priority: 'medium',
        checkType: 'manual',
        applicableTo: {}
      },
      {
        id: 'bcn-003',
        municipalityId: 'barcelona-capital',
        municipalityName: 'Barcelona',
        province: 'Barcelona',
        category: 'Estética y Composición',
        requirement: 'Protección visual del Eixample: altura máxima cornisa 16,20m en manzanas cerradas',
        regulatoryReference: 'PGM Barcelona Normativa Urbanística',
        customReference: 'Plan General Metropolitano, Normativa Urbanística del Eixample',
        priority: 'high',
        checkType: 'manual',
        applicableTo: {}
      }
    ]
  }
]

export function getMunicipalityById(id: string, municipalities: Municipality[]): Municipality | undefined {
  return municipalities.find(m => m.id === id)
}

export function getMunicipalitiesByProvince(province: string, municipalities: Municipality[]): Municipality[] {
  return municipalities.filter(m => m.province === province)
}

export function searchMunicipalities(query: string, municipalities: Municipality[]): Municipality[] {
  const lowerQuery = query.toLowerCase()
  return municipalities.filter(m => 
    m.name.toLowerCase().includes(lowerQuery) ||
    m.province.toLowerCase().includes(lowerQuery) ||
    m.autonomousCommunity.toLowerCase().includes(lowerQuery)
  )
}

export function getMunicipalRequirementsForProject(
  municipalityId: string,
  municipalities: Municipality[],
  buildingType?: BuildingType,
  buildingUse?: BuildingUse
): MunicipalRequirement[] {
  const municipality = getMunicipalityById(municipalityId, municipalities)
  if (!municipality) return []

  return municipality.requirements.filter(req => {
    if (buildingType && req.applicableTo.buildingTypes && !req.applicableTo.buildingTypes.includes(buildingType)) {
      return false
    }
    if (buildingUse && req.applicableTo.buildingUses && !req.applicableTo.buildingUses.includes(buildingUse)) {
      return false
    }
    
    if (req.effectiveDate && Date.now() < req.effectiveDate) {
      return false
    }
    if (req.expiryDate && Date.now() > req.expiryDate) {
      return false
    }
    
    return true
  })
}
