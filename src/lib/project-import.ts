import { Document, DocumentType, DocumentStatus, FolderStructureType, DOCUMENT_TYPE_LABELS } from './types'

export interface ImportedFile {
  fileName: string
  name: string
  path: string
  size: number
  extension: string
  suggestedType: DocumentType
  suggestedFolder: string
  confidence: 'high' | 'medium' | 'low'
  file?: File
  fileData?: string
  metadata?: {
    author?: string
    createdDate?: Date
  }
}

export interface ImportAnalysis {
  analyzedFiles: ImportedFile[]
  suggestedStructure: FolderStructureType
  projectNameSuggestion?: string
  locationSuggestion?: string
  totalFiles: number
}

const DOCUMENT_TYPE_KEYWORDS: Record<DocumentType, string[]> = {
  'plano': ['plano', 'planta', 'seccion', 'alzado', 'dwg', 'dxf', 'plan'],
  'memoria': ['memoria', 'descriptiva', 'justificativa', 'tecnica', 'constructiva'],
  'presupuesto': ['presupuesto', 'mediciones', 'precios', 'coste', 'bc3'],
  'administrativo': ['licencia', 'permiso', 'solicitud', 'instancia', 'certificado'],
  'imagen': ['render', 'foto', 'imagen', 'visualizacion', 'perspectiva'],
  'modelo': ['modelo', '3d', 'bim', 'revit', 'sketchup'],
  'instalaciones': ['instalacion', 'electrica', 'fontaneria', 'climatizacion', 'saneamiento'],
  'detalles-constructivos': ['detalle', 'constructivo', 'solucion'],
  'otros': []
}

const FOLDER_TYPE_KEYWORDS: Record<string, string[]> = {
  'memoria': ['memoria', 'memorias'],
  'plano': ['plano', 'planos', 'plans'],
  'presupuesto': ['presupuesto', 'presupuestos', 'budget'],
  'imagen': ['imagenes', 'images', 'renders', 'fotos'],
  'modelo': ['modelos', 'models', '3d', 'bim'],
  'detalles-constructivos': ['detalles', 'details']
}

const EXTENSION_TYPE_MAP: Record<string, DocumentType> = {
  'pdf': 'plano',
  'dwg': 'plano',
  'dxf': 'plano',
  'doc': 'memoria',
  'docx': 'memoria',
  'xls': 'presupuesto',
  'xlsx': 'presupuesto',
  'bc3': 'presupuesto',
  'jpg': 'imagen',
  'jpeg': 'imagen',
  'png': 'imagen',
  'tif': 'imagen',
  'tiff': 'imagen',
  'rvt': 'modelo',
  'skp': 'modelo',
  '3ds': 'modelo',
  'fbx': 'modelo',
}

export function analyzeFileName(fileName: string, folderPath?: string): { 
  type: DocumentType
  confidence: 'high' | 'medium' | 'low' 
} {
  const nameLower = fileName.toLowerCase()
  const extension = fileName.split('.').pop()?.toLowerCase() || ''
  
  let bestMatch: DocumentType = 'otros'
  let highestScore = 0
  let confidence: 'high' | 'medium' | 'low' = 'low'

  for (const [docType, keywords] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {
    let score = 0
    
    for (const keyword of keywords) {
      if (nameLower.includes(keyword)) {
        score += 2
      }
    }

    if (folderPath) {
      const folderKeywords = FOLDER_TYPE_KEYWORDS[docType] || []
      for (const keyword of folderKeywords) {
        if (folderPath.toLowerCase().includes(keyword)) {
          score += 3
        }
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = docType as DocumentType
    }
  }

  if (extension && EXTENSION_TYPE_MAP[extension]) {
    if (highestScore === 0) {
      bestMatch = EXTENSION_TYPE_MAP[extension]
      highestScore = 1
    } else {
      highestScore += 2
    }
  }

  if (highestScore >= 4) {
    confidence = 'high'
  } else if (highestScore >= 2) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  return { type: bestMatch, confidence }
}

export function suggestFolderForDocument(
  docType: DocumentType,
  structureType: FolderStructureType
): string {
  if (structureType === 'by-type') {
    const folderMap: Record<DocumentType, string> = {
      'plano': '01_Planos',
      'memoria': '02_Memorias',
      'presupuesto': '03_Presupuestos',
      'imagen': '04_Imágenes',
      'administrativo': '05_Administrativo',
      'modelo': '06_Modelos_3D',
      'instalaciones': '07_Instalaciones',
      'detalles-constructivos': '01_Planos/Detalles',
      'otros': '08_Otros'
    }
    return folderMap[docType]
  } else {
    const folderMap: Record<DocumentType, string> = {
      'plano': 'Componentes',
      'memoria': 'Documentación',
      'presupuesto': 'Documentación',
      'imagen': 'Presentación',
      'administrativo': 'Administrativo',
      'modelo': 'Modelos',
      'instalaciones': 'Servicios',
      'detalles-constructivos': 'Componentes',
      'otros': 'Referencias'
    }
    return folderMap[docType]
  }
}

export function extractProjectMetadata(files: ImportedFile[]): {
  projectNameSuggestion?: string
  locationSuggestion?: string
} {
  const fileNames = files.map(f => f.name.toLowerCase())
  const allText = fileNames.join(' ')

  const locationPatterns = [
    /(?:en|de)\s+([a-záéíóúñ\s]+?)(?:\.|_|-|$)/gi,
    /([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+){0,2})_\d{4}/gi
  ]

  let locationMatch: string | undefined
  for (const pattern of locationPatterns) {
    const matches = [...allText.matchAll(pattern)]
    if (matches.length > 0) {
      locationMatch = matches[0][1]?.trim()
      break
    }
  }

  const projectPatterns = [
    /^([^_\-\.]+)/,
    /proyecto[_\s]+([a-záéíóúñ\s]+)/gi,
    /vivienda[_\s]+([a-záéíóúñ\s]+)/gi
  ]

  let projectMatch: string | undefined
  for (const pattern of projectPatterns) {
    const match = allText.match(pattern)
    if (match && match[1]) {
      projectMatch = match[1].trim()
      break
    }
  }

  return {
    projectNameSuggestion: projectMatch,
    locationSuggestion: locationMatch
  }
}

export function determineStructureType(files: ImportedFile[]): FolderStructureType {
  const paths = files.map(f => f.path.toLowerCase())
  
  let byTypeScore = 0
  let screamingScore = 0

  const byTypeKeywords = ['planos', 'memorias', 'presupuestos', 'imagenes', 'administrativo']
  const screamingKeywords = ['componentes', 'servicios', 'modelos', 'documentacion', 'presentacion']

  for (const path of paths) {
    for (const keyword of byTypeKeywords) {
      if (path.includes(keyword)) {
        byTypeScore++
      }
    }
    for (const keyword of screamingKeywords) {
      if (path.includes(keyword)) {
        screamingScore++
      }
    }
  }

  return screamingScore > byTypeScore ? 'screaming-architecture' : 'by-type'
}

export async function analyzeProjectFiles(
  files: File[]
): Promise<ImportAnalysis> {
  const analyzedFiles: ImportedFile[] = []

  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    const path = (file as any).webkitRelativePath || file.name
    const folderPath = path.substring(0, path.lastIndexOf('/'))

    const analysis = analyzeFileName(file.name, folderPath)

    const importedFile: ImportedFile = {
      fileName: file.name,
      name: file.name,
      path: path,
      size: file.size,
      extension,
      suggestedType: analysis.type,
      suggestedFolder: '',
      confidence: analysis.confidence,
      file: file
    }

    analyzedFiles.push(importedFile)
  }

  const structureType = determineStructureType(analyzedFiles)

  analyzedFiles.forEach(file => {
    file.suggestedFolder = suggestFolderForDocument(file.suggestedType, structureType)
  })

  const metadata = extractProjectMetadata(analyzedFiles)

  return {
    analyzedFiles,
    suggestedStructure: structureType,
    projectNameSuggestion: metadata.projectNameSuggestion,
    locationSuggestion: metadata.locationSuggestion,
    totalFiles: analyzedFiles.length
  }
}

export function generateDocumentsFromImport(
  analyzedFiles: ImportedFile[],
  projectId: string
): Document[] {
  const documents: Document[] = []

  analyzedFiles.forEach((file, index) => {
    const doc: Document = {
      id: `doc-${Date.now()}-${index}`,
      projectId,
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: file.suggestedType,
      folder: file.suggestedFolder,
      currentVersion: 'P01',
      versions: [
        {
          id: `v-${Date.now()}-${index}`,
          version: 'P01',
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: Date.now(),
          uploadedBy: 'import',
          status: 'draft',
          notes: `Importado automáticamente con confianza ${file.confidence}`
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        format: file.extension,
        suggestedFolder: file.suggestedFolder
      }
    }

    documents.push(doc)
  })

  return documents
}

export function getImportStatistics(analysis: ImportAnalysis) {
  const byType: Record<string, number> = {}
  const byConfidence = {
    high: 0,
    medium: 0,
    low: 0
  }

  for (const file of analysis.analyzedFiles) {
    const typeLabel = DOCUMENT_TYPE_LABELS[file.suggestedType]
    byType[typeLabel] = (byType[typeLabel] || 0) + 1
    byConfidence[file.confidence]++
  }

  return {
    byType,
    byConfidence,
    totalSize: analysis.analyzedFiles.reduce((sum, f) => sum + f.size, 0)
  }
}
