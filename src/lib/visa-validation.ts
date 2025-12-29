import { 
  VisaApplication, 
  VisaDocument, 
  VisaDocumentType,
  ProfessionalCollege,
  ProjectPhase,
  VisaRequirement,
  VISA_DOCUMENT_TYPE_LABELS
} from '@/lib/types'

export interface RequiredDocument {
  type: VisaDocumentType
  isRequired: boolean
  description: string
  minFileSize?: number
  maxFileSize?: number
  acceptedFormats?: string[]
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function getRequiredDocuments(
  phases: ProjectPhase[], 
  college: ProfessionalCollege
): RequiredDocument[] {
  const required: RequiredDocument[] = []

  if (phases.includes('basico') || phases.includes('ejecucion')) {
    required.push(
      {
        type: 'memoria-descriptiva',
        isRequired: true,
        description: 'Memoria descriptiva del proyecto',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'memoria-constructiva',
        isRequired: true,
        description: 'Memoria constructiva con cumplimiento del CTE',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'planos-situacion',
        isRequired: true,
        description: 'Plano de situación y emplazamiento',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf', 'dwg']
      },
      {
        type: 'planos-arquitectonicos',
        isRequired: true,
        description: 'Planos arquitectónicos (plantas, alzados, secciones)',
        minFileSize: 10000,
        maxFileSize: 100000000,
        acceptedFormats: ['pdf', 'dwg']
      }
    )
  }

  if (phases.includes('ejecucion')) {
    required.push(
      {
        type: 'pliego-condiciones',
        isRequired: true,
        description: 'Pliego de condiciones técnicas particulares',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'presupuesto',
        isRequired: true,
        description: 'Presupuesto de ejecución material con mediciones',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf', 'bc3']
      },
      {
        type: 'planos-estructuras',
        isRequired: true,
        description: 'Planos de estructuras',
        minFileSize: 10000,
        maxFileSize: 100000000,
        acceptedFormats: ['pdf', 'dwg']
      },
      {
        type: 'planos-instalaciones',
        isRequired: true,
        description: 'Planos de instalaciones',
        minFileSize: 10000,
        maxFileSize: 100000000,
        acceptedFormats: ['pdf', 'dwg']
      },
      {
        type: 'anexo-calculo',
        isRequired: true,
        description: 'Anexo de cálculo estructural y de instalaciones',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'estudio-seguridad',
        isRequired: true,
        description: 'Estudio de seguridad y salud',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'estudio-gestion-residuos',
        isRequired: true,
        description: 'Estudio de gestión de residuos',
        minFileSize: 5000,
        maxFileSize: 25000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'eficiencia-energetica',
        isRequired: true,
        description: 'Certificado de eficiencia energética',
        minFileSize: 5000,
        maxFileSize: 25000000,
        acceptedFormats: ['pdf', 'xml']
      }
    )
  }

  if (phases.includes('estudio-previo') || phases.includes('anteproyecto')) {
    required.push(
      {
        type: 'memoria-descriptiva',
        isRequired: true,
        description: 'Memoria descriptiva del proyecto',
        minFileSize: 5000,
        maxFileSize: 25000000,
        acceptedFormats: ['pdf']
      },
      {
        type: 'planos-arquitectonicos',
        isRequired: true,
        description: 'Planos generales del proyecto',
        minFileSize: 10000,
        maxFileSize: 50000000,
        acceptedFormats: ['pdf', 'dwg']
      }
    )
  }

  return required
}

export function validateDocument(
  document: VisaDocument,
  requiredDoc?: RequiredDocument
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (document.fileSize === 0) {
    errors.push('El archivo está vacío')
  }

  if (requiredDoc) {
    if (requiredDoc.minFileSize && document.fileSize < requiredDoc.minFileSize) {
      warnings.push(`El archivo es muy pequeño (mínimo recomendado: ${formatFileSize(requiredDoc.minFileSize)})`)
    }

    if (requiredDoc.maxFileSize && document.fileSize > requiredDoc.maxFileSize) {
      errors.push(`El archivo excede el tamaño máximo permitido (${formatFileSize(requiredDoc.maxFileSize)})`)
    }

    const fileExtension = document.name.split('.').pop()?.toLowerCase()
    if (requiredDoc.acceptedFormats && fileExtension && !requiredDoc.acceptedFormats.includes(fileExtension)) {
      errors.push(`Formato no válido. Formatos aceptados: ${requiredDoc.acceptedFormats.join(', ')}`)
    }
  }

  if (!document.name || document.name.trim() === '') {
    errors.push('El documento debe tener un nombre')
  }

  const nameLower = document.name.toLowerCase()
  if (nameLower.includes('borrador') || nameLower.includes('draft')) {
    warnings.push('El nombre del archivo indica que puede ser un borrador')
  }

  if (nameLower.includes('version') || nameLower.includes('v0') || nameLower.includes('rev0')) {
    warnings.push('Verifique que esta es la versión correcta para presentar')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function validateVisaApplication(visa: VisaApplication): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (visa.phases.length === 0) {
    errors.push('Debe seleccionar al menos una fase del proyecto')
  }

  const requiredDocs = getRequiredDocuments(visa.phases, visa.college)
  const uploadedTypes = visa.documents.map(d => d.type)

  requiredDocs.forEach(reqDoc => {
    if (reqDoc.isRequired && !uploadedTypes.includes(reqDoc.type)) {
      errors.push(`Falta documento requerido: ${VISA_DOCUMENT_TYPE_LABELS[reqDoc.type]}`)
    }
  })

  const invalidDocs = visa.documents.filter(d => !d.isValid)
  if (invalidDocs.length > 0) {
    errors.push(`${invalidDocs.length} documento(s) tienen errores de validación`)
  }

  const docsWithWarnings = visa.documents.filter(d => d.validationErrors && d.validationErrors.length > 0)
  if (docsWithWarnings.length > 0) {
    warnings.push(`${docsWithWarnings.length} documento(s) tienen advertencias`)
  }

  if (!visa.college) {
    errors.push('Debe seleccionar el colegio profesional')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

export function getDefaultRequirements(
  phases: ProjectPhase[],
  college: ProfessionalCollege
): VisaRequirement[] {
  const requirements: VisaRequirement[] = []

  requirements.push(
    {
      id: 'req-1',
      description: 'Todos los documentos deben estar firmados digitalmente por el arquitecto autor',
      isMet: false
    },
    {
      id: 'req-2',
      description: 'El proyecto debe cumplir con la normativa urbanística municipal',
      isMet: false
    },
    {
      id: 'req-3',
      description: 'El arquitecto debe estar colegiado y al corriente de pago',
      isMet: false
    }
  )

  if (phases.includes('ejecucion')) {
    requirements.push(
      {
        id: 'req-4',
        description: 'Incluir declaración responsable de cumplimiento del CTE',
        isMet: false
      },
      {
        id: 'req-5',
        description: 'Incluir justificación de cumplimiento de la normativa de accesibilidad',
        isMet: false
      },
      {
        id: 'req-6',
        description: 'Incluir datos del coordinador de seguridad y salud',
        isMet: false
      }
    )
  }

  if (college === 'COAM') {
    requirements.push({
      id: 'req-coam-1',
      description: 'Cumplimentar formulario online del COAM previo a la presentación',
      isMet: false
    })
  }

  return requirements
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function generateSubmissionChecklist(visa: VisaApplication): string[] {
  const checklist: string[] = []

  checklist.push('✓ Todos los documentos requeridos están cargados')
  checklist.push('✓ Los documentos han pasado la validación automática')
  checklist.push('✓ Los planos están en formato PDF/A o DWG según corresponda')
  checklist.push('✓ Las memorias incluyen firma digital del arquitecto')
  checklist.push('✓ El presupuesto coincide con el PEM declarado')
  checklist.push('✓ Los documentos siguen la nomenclatura estándar ISO19650')

  if (visa.phases.includes('ejecucion')) {
    checklist.push('✓ Se ha incluido el estudio de seguridad y salud')
    checklist.push('✓ Se ha incluido el estudio de gestión de residuos')
    checklist.push('✓ Se ha incluido el certificado de eficiencia energética')
  }

  checklist.push('✓ Se han completado todos los requisitos administrativos')
  checklist.push('✓ Se ha verificado el colegiado responsable del visado')

  return checklist
}
