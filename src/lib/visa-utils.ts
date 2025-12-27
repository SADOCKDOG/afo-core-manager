import { 
  VisaDocument, 
  VisaApplication, 
  VisaDocumentType, 
  ProjectPhase,
  VisaRequirement,
  ProfessionalCollege
} from './types'

export const MAX_FILE_SIZE_MB = 80
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export const REQUIRED_DOCUMENTS_BY_PHASE: Record<ProjectPhase, VisaDocumentType[]> = {
  'estudio-previo': [
    'memoria-descriptiva',
    'planos-situacion',
    'presupuesto'
  ],
  'anteproyecto': [
    'memoria-descriptiva',
    'planos-situacion',
    'planos-arquitectonicos',
    'presupuesto'
  ],
  'basico': [
    'memoria-descriptiva',
    'memoria-constructiva',
    'planos-situacion',
    'planos-arquitectonicos',
    'planos-estructuras',
    'planos-instalaciones',
    'presupuesto',
    'pliego-condiciones'
  ],
  'ejecucion': [
    'memoria-descriptiva',
    'memoria-constructiva',
    'pliego-condiciones',
    'presupuesto',
    'planos-situacion',
    'planos-arquitectonicos',
    'planos-estructuras',
    'planos-instalaciones',
    'estudio-seguridad',
    'estudio-gestion-residuos',
    'anexo-calculo'
  ],
  'direccion-obra': [
    'memoria-descriptiva',
    'planos-arquitectonicos'
  ]
}

export function validateFileSize(fileSize: number): { isValid: boolean; error?: string } {
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `El archivo supera el tamaño máximo permitido de ${MAX_FILE_SIZE_MB}MB`
    }
  }
  return { isValid: true }
}

export function validateFileName(fileName: string): { isValid: boolean; error?: string } {
  const invalidChars = /[<>:"|?*]/
  if (invalidChars.test(fileName)) {
    return {
      isValid: false,
      error: 'El nombre del archivo contiene caracteres no permitidos'
    }
  }
  
  if (fileName.length > 255) {
    return {
      isValid: false,
      error: 'El nombre del archivo es demasiado largo (máximo 255 caracteres)'
    }
  }
  
  return { isValid: true }
}

export function validateFileFormat(fileName: string, allowedFormats: string[]): { isValid: boolean; error?: string } {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  if (!extension || !allowedFormats.includes(extension)) {
    return {
      isValid: false,
      error: `Formato no permitido. Formatos aceptados: ${allowedFormats.join(', ')}`
    }
  }
  
  return { isValid: true }
}

export function validateDocument(doc: VisaDocument, visa: VisaApplication): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  const sizeValidation = validateFileSize(doc.fileSize)
  if (!sizeValidation.isValid && sizeValidation.error) {
    errors.push(sizeValidation.error)
  }
  
  const nameValidation = validateFileName(doc.name)
  if (!nameValidation.isValid && nameValidation.error) {
    errors.push(nameValidation.error)
  }
  
  const formatValidation = validateFileFormat(doc.name, ['pdf', 'dwg', 'dxf', 'doc', 'docx'])
  if (!formatValidation.isValid && formatValidation.error) {
    errors.push(formatValidation.error)
  }
  
  if (doc.name.toLowerCase().endsWith('.pdf')) {
    if (doc.fileSize < 1024) {
      errors.push('El archivo PDF parece estar corrupto o vacío')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getRequiredDocuments(phases: ProjectPhase[]): VisaDocumentType[] {
  const requiredDocs = new Set<VisaDocumentType>()
  
  phases.forEach(phase => {
    const phaseDocs = REQUIRED_DOCUMENTS_BY_PHASE[phase] || []
    phaseDocs.forEach(doc => requiredDocs.add(doc))
  })
  
  return Array.from(requiredDocs)
}

export function checkDocumentCompleteness(visa: VisaApplication): {
  isComplete: boolean
  missingDocuments: VisaDocumentType[]
  completionPercentage: number
} {
  const requiredDocs = getRequiredDocuments(visa.phases)
  const uploadedTypes = new Set(visa.documents.map(d => d.type))
  
  const missingDocuments = requiredDocs.filter(doc => !uploadedTypes.has(doc))
  
  const completionPercentage = requiredDocs.length > 0
    ? Math.round((requiredDocs.length - missingDocuments.length) / requiredDocs.length * 100)
    : 100
  
  return {
    isComplete: missingDocuments.length === 0,
    missingDocuments,
    completionPercentage
  }
}

export function calculateVisaFee(
  college: ProfessionalCollege,
  phases: ProjectPhase[],
  budgetAmount?: number
): number {
  let baseFee = 0
  
  switch (college) {
    case 'COAM':
      baseFee = 150
      if (phases.includes('ejecucion')) {
        baseFee += budgetAmount ? budgetAmount * 0.003 : 300
      }
      break
    case 'COACM':
      baseFee = 120
      if (phases.includes('ejecucion')) {
        baseFee += budgetAmount ? budgetAmount * 0.0025 : 250
      }
      break
    default:
      baseFee = 100
      if (phases.includes('ejecucion')) {
        baseFee += budgetAmount ? budgetAmount * 0.002 : 200
      }
  }
  
  return Math.round(baseFee * 100) / 100
}

export function generateDefaultRequirements(phases: ProjectPhase[]): VisaRequirement[] {
  const requirements: VisaRequirement[] = [
    {
      id: 'req-1',
      description: 'El arquitecto está colegiado y en situación de alta',
      isMet: false
    },
    {
      id: 'req-2',
      description: 'Los datos del promotor son correctos y están completos',
      isMet: false
    },
    {
      id: 'req-3',
      description: 'La ubicación del proyecto está correctamente identificada',
      isMet: false
    },
    {
      id: 'req-4',
      description: 'Todos los documentos están firmados digitalmente',
      isMet: false
    }
  ]
  
  if (phases.includes('basico') || phases.includes('ejecucion')) {
    requirements.push({
      id: 'req-5',
      description: 'El presupuesto de ejecución material (PEM) está correctamente calculado',
      isMet: false
    })
  }
  
  if (phases.includes('ejecucion')) {
    requirements.push(
      {
        id: 'req-6',
        description: 'El Estudio de Seguridad y Salud cumple con el RD 1627/1997',
        isMet: false
      },
      {
        id: 'req-7',
        description: 'El Estudio de Gestión de Residuos cumple con el RD 105/2008',
        isMet: false
      }
    )
  }
  
  return requirements
}

export function detectDocumentType(fileName: string): VisaDocumentType | null {
  const lowerName = fileName.toLowerCase()
  
  if (lowerName.includes('memoria') && lowerName.includes('descriptiv')) {
    return 'memoria-descriptiva'
  }
  if (lowerName.includes('memoria') && lowerName.includes('constructiv')) {
    return 'memoria-constructiva'
  }
  if (lowerName.includes('pliego')) {
    return 'pliego-condiciones'
  }
  if (lowerName.includes('presupuesto') || lowerName.includes('medicion')) {
    return 'presupuesto'
  }
  if (lowerName.includes('situacion') || lowerName.includes('emplazamiento')) {
    return 'planos-situacion'
  }
  if (lowerName.includes('arquitect') || lowerName.includes('planta') || lowerName.includes('alzado')) {
    return 'planos-arquitectonicos'
  }
  if (lowerName.includes('estructur')) {
    return 'planos-estructuras'
  }
  if (lowerName.includes('instalacion')) {
    return 'planos-instalaciones'
  }
  if (lowerName.includes('seguridad')) {
    return 'estudio-seguridad'
  }
  if (lowerName.includes('residuo')) {
    return 'estudio-gestion-residuos'
  }
  if (lowerName.includes('energetic') || lowerName.includes('eficiencia')) {
    return 'eficiencia-energetica'
  }
  if (lowerName.includes('calculo') || lowerName.includes('cálculo')) {
    return 'anexo-calculo'
  }
  
  return null
}

export function generateApplicationNumber(college: ProfessionalCollege): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 90000) + 10000
  
  switch (college) {
    case 'COAM':
      return `COAM/${year}/${random}`
    case 'COACM':
      return `COACM/${year}/${random}`
    case 'COAG':
      return `COAG/${year}/${random}`
    default:
      return `VIS/${year}/${random}`
  }
}

export function canSubmitVisa(visa: VisaApplication): { canSubmit: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  const completeness = checkDocumentCompleteness(visa)
  if (!completeness.isComplete) {
    reasons.push(`Faltan ${completeness.missingDocuments.length} documento(s) obligatorio(s)`)
  }
  
  const invalidDocs = visa.documents.filter(doc => !doc.isValid)
  if (invalidDocs.length > 0) {
    reasons.push(`Hay ${invalidDocs.length} documento(s) con errores de validación`)
  }
  
  const unmetRequirements = visa.requirements.filter(req => !req.isMet)
  if (unmetRequirements.length > 0) {
    reasons.push(`Faltan ${unmetRequirements.length} requisito(s) por cumplir`)
  }
  
  return {
    canSubmit: reasons.length === 0,
    reasons
  }
}
