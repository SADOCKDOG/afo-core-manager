import { Document, DocumentType, DocumentStatus, FolderStructureType, DOCUMENT_TYPE_LABELS } from './types'

  name: string
  size: number
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
  totalFiles: numb
    author?: string
  'imagen': ['render
  '
 

const FOLDER_TYPE_KEYWORDS: Recor
  'memoria': ['memor
  'imagen': ['imagenes', 'image
  'modelo': ['modelos', 'models', '3d', '
  'detalles-constructivos': ['de
}
c

  'doc': 'memoria',
  'xls': 'presupuesto',
  'bc3': 'presupuesto',
  'jpeg': 'imagen',
  'tif': 'imagen',
  'rvt': 'modelo',
  'skp': 'modelo',
  '3ds': 'modelo',
  'fbx': 'modelo',
}
e

  const nameLower = fileName.toLowerCase()
  const extension = fileName.split('.').pop()?.toLowerCase() |
  let bestMatch: DocumentType = 'otros'
  let confidence: 'high' | 'medium' | 'low' = 'low'
  for (const [docType, keywords] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {

      if (nameLower.includes(keyword)) {
      }

    for (const keyword of folderKeywords) {
 

    if (score > highestScore) {
      bestMatch = d
  }
  if (extension &
    if (highestScor
      highestScore =
      highestScore += 2
  }
  if (highestScore >= 4
  } else if (highe
  } else {
  }
  return { type: b

  docType: Documen
): string {
    const folderMa
      'memoria': '
      'imagen': '0
      'modelo': '0
      'detalles-co
    }
 

      'presupuesto': 'Documentación',
      'administrativ
      'instalaciones': 'Servicios',
   
    return folderMap[docType]
}
export function extractProjectMetadata(files: ImportedFile[]): {

  const fileNames = files.map(f => f.na

    /(?:en|de)\s+([a-záéíóúñ\s]+?)(?:\.|_|-|$)/gi,

  let locationMatch: string | undefined
    const matches

    }

    /^([^_\-\.]+)/
    /vi


    if (match && match[1]) {
      break
  }
  return {
    loc
}

  
  let screamingScore = 0
  const byTypeKeywords = ['planos', 'memo

   

    }
      if (path.includes(keyword)) {
      }
  }
  return screamingScor

  files: File[]
  con
  f



    try {
    } catch (error) {
    }
    const importedFile
   

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
      confidence: analysis.confidence
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
    locationSuggestion: metadata.locationSuggestion
  }


export function generateDocumentsFromImport(
  analyzedFiles: ImportedFile[],

): Document[] {


  analyzedFiles.forEach((file, index) => {
    const doc: Document = {

      projectId,

      type: file.suggestedType,

      currentVersion: 'P01',

        {
          id: `v-${Date.now()}-${index}`,
          version: 'P01',
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: Date.now(),
          uploadedBy: 'import',
          status: 'draft',
          notes: `Importado automáticamente con confianza ${file.confidence}`

      ],

      updatedAt: Date.now(),

        format: file.extension,

      }



  })

  return documents


export function getImportStatistics(analysis: ImportAnalysis) {
  const byType: Record<string, number> = {}

    high: 0,
    medium: 0,
    low: 0


  for (const file of analysis.analyzedFiles) {
    const typeLabel = DOCUMENT_TYPE_LABELS[file.suggestedType]
    byType[typeLabel] = (byType[typeLabel] || 0) + 1
    byConfidence[file.confidence]++
  }


    byType,

    totalSize: analysis.analyzedFiles.reduce((sum, f) => sum + f.size, 0)

}
