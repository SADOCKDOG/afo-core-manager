import { DocumentType, DOCUMENT_TYPE_LABELS } from './types'

export interface AIClassificationResult {
  type: DocumentType
  confidence: number
  reasoning: string
  alternativeTypes: Array<{
    type: DocumentType
    confidence: number
  }>
  metadata: {
    discipline?: string
    phase?: string
    keywords: string[]
  }
}

export interface ClassificationContext {
  fileName: string
  folderPath: string
  fileExtension: string
  fileSize: number
  projectContext?: {
    projectName?: string
    location?: string
    existingDocuments?: Array<{ name: string; type: DocumentType }>
  }
}

const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  'plano': 'Planos arquitectónicos, de emplazamiento, plantas, alzados, secciones, detalles gráficos en formato CAD (DWG, DXF) o PDF',
  'memoria': 'Memorias descriptivas, constructivas, justificativas, informes técnicos, documentos de texto explicativos del proyecto',
  'presupuesto': 'Presupuestos, mediciones, precios, análisis de costes, archivos BC3, hojas de cálculo de costes',
  'imagen': 'Renders, fotografías, imágenes de visualización 3D, fotos de estado actual, perspectivas',
  'administrativo': 'Documentos administrativos, licencias, permisos, visados, actas, certificados, comunicaciones oficiales, registro',
  'modelo': 'Modelos 3D BIM (Revit, IFC), modelos SketchUp, archivos 3D nativos de software de diseño',
  'instalaciones': 'Planos y documentación de instalaciones eléctricas, fontanería, HVAC, climatización, saneamiento, telecomunicaciones',
  'detalles-constructivos': 'Detalles constructivos específicos, encuentros, soluciones técnicas detalladas, detalles de carpintería',
  'otros': 'Documentos que no encajan en ninguna de las categorías anteriores, anexos, documentos varios'
}

export async function classifyDocumentWithAI(context: ClassificationContext): Promise<AIClassificationResult> {
  const projectContextInfo = context.projectContext?.projectName ? `CONTEXTO DEL PROYECTO:
- Nombre del proyecto: ${context.projectContext.projectName}
- Ubicación: ${context.projectContext.location || 'No especificada'}` : ''

  const existingDocsInfo = context.projectContext?.existingDocuments && context.projectContext.existingDocuments.length > 0 ? `
DOCUMENTOS EXISTENTES EN EL PROYECTO:
${context.projectContext.existingDocuments.slice(0, 10).map(d => `- ${d.name} (${DOCUMENT_TYPE_LABELS[d.type]})`).join('\n')}` : ''

  const typeDescriptions = Object.entries(DOCUMENT_TYPE_DESCRIPTIONS).map(([type, desc]) => 
    `- ${type}: ${desc}`
  ).join('\n')

  const promptText = `Eres un experto clasificador de documentos arquitectónicos. 

Analiza el siguiente documento y determina su tipo más apropiado.

INFORMACIÓN DEL DOCUMENTO:
- Nombre del archivo: ${context.fileName}
- Ruta de la carpeta: ${context.folderPath || 'raíz del proyecto'}
- Extensión: ${context.fileExtension}
- Tamaño: ${formatBytes(context.fileSize)}

${projectContextInfo}

${existingDocsInfo}

TIPOS DE DOCUMENTOS DISPONIBLES:
${typeDescriptions}

INSTRUCCIONES:
1. Analiza cuidadosamente el nombre del archivo, la ruta de carpeta, y la extensión
2. Considera el contexto del proyecto si está disponible
3. Identifica palabras clave relevantes en el nombre del archivo
4. Determina el tipo de documento más apropiado
5. Asigna un nivel de confianza (0-100) basado en la claridad de la clasificación
6. Si hay otros tipos posibles, inclúyelos como alternativas
7. Sugiere la disciplina si es relevante (arquitectura, estructura, instalaciones, etc.)
8. Identifica la fase del proyecto si es posible (estudio previo, básico, ejecución, etc.)

Responde SOLO con un objeto JSON válido en este formato exacto:
{
  "type": "tipo de documento (uno de los tipos listados arriba)",
  "confidence": número entre 0 y 100,
  "reasoning": "breve explicación de por qué elegiste este tipo",
  "alternativeTypes": [
    {"type": "tipo alternativo 1", "confidence": número},
    {"type": "tipo alternativo 2", "confidence": número}
  ],
  "metadata": {
    "discipline": "disciplina del documento o null",
    "phase": "fase del proyecto o null",
    "keywords": ["palabra clave 1", "palabra clave 2"]
  }
}`

  try {
    const response = await spark.llm(promptText, 'gpt-4o', true)
    const result = JSON.parse(response)
    
    if (!result.type || !DOCUMENT_TYPE_LABELS[result.type as DocumentType]) {
      throw new Error('Invalid document type returned')
    }

    return {
      type: result.type,
      confidence: Math.min(100, Math.max(0, result.confidence || 50)),
      reasoning: result.reasoning || 'Clasificación automática',
      alternativeTypes: (result.alternativeTypes || [])
        .filter((alt: any) => alt.type && DOCUMENT_TYPE_LABELS[alt.type as DocumentType])
        .slice(0, 3),
      metadata: {
        discipline: result.metadata?.discipline || undefined,
        phase: result.metadata?.phase || undefined,
        keywords: result.metadata?.keywords || []
      }
    }
  } catch (error) {
    console.error('Error in AI classification:', error)
    throw error
  }
}

export async function classifyMultipleDocuments(
  contexts: ClassificationContext[],
  onProgress?: (current: number, total: number) => void
): Promise<AIClassificationResult[]> {
  const results: AIClassificationResult[] = []
  
  for (let i = 0; i < contexts.length; i++) {
    try {
      const result = await classifyDocumentWithAI(contexts[i])
      results.push(result)
      
      if (onProgress) {
        onProgress(i + 1, contexts.length)
      }
    } catch (error) {
      console.error(`Error classifying document ${contexts[i].fileName}:`, error)
      results.push(createFallbackClassification(contexts[i]))
    }
  }
  
  return results
}

export async function improveClassificationWithBatch(
  contexts: ClassificationContext[]
): Promise<AIClassificationResult[]> {
  if (contexts.length === 0) return []
  
  if (contexts.length === 1) {
    return [await classifyDocumentWithAI(contexts[0])]
  }

  const documentsInfo = contexts.map((ctx, idx) => `
${idx + 1}. ${ctx.fileName}
   - Carpeta: ${ctx.folderPath || 'raíz'}
   - Extensión: ${ctx.fileExtension}
   - Tamaño: ${formatBytes(ctx.fileSize)}
`).join('\n')

  const typeDescriptions = Object.entries(DOCUMENT_TYPE_DESCRIPTIONS).map(([type, desc]) => 
    `- ${type}: ${desc}`
  ).join('\n')

  const promptText = `Eres un experto clasificador de documentos arquitectónicos.

Analiza el siguiente conjunto de documentos y clasifícalos considerando el contexto completo del proyecto.

DOCUMENTOS A CLASIFICAR:
${documentsInfo}

TIPOS DE DOCUMENTOS DISPONIBLES:
${typeDescriptions}

INSTRUCCIONES:
1. Analiza todos los documentos en conjunto para entender el contexto del proyecto
2. Identifica patrones y relaciones entre los documentos
3. Clasifica cada documento individualmente pero con conocimiento del conjunto
4. Asigna confianza basada en la claridad y el contexto

Responde SOLO con un objeto JSON con un array "classifications":
{
  "classifications": [
    {
      "index": 0,
      "type": "tipo de documento",
      "confidence": número entre 0 y 100,
      "reasoning": "explicación breve",
      "alternativeTypes": [{"type": "alternativa", "confidence": número}],
      "metadata": {
        "discipline": "disciplina o null",
        "phase": "fase o null",
        "keywords": ["palabra1", "palabra2"]
      }
    }
  ]
}`

  try {
    const response = await spark.llm(promptText, 'gpt-4o', true)
    const data = JSON.parse(response)
    
    if (!data.classifications || !Array.isArray(data.classifications)) {
      throw new Error('Invalid response format')
    }

    return data.classifications.map((item: any, index: number) => {
      if (!item.type || !DOCUMENT_TYPE_LABELS[item.type as DocumentType]) {
        return createFallbackClassification(contexts[index])
      }

      return {
        type: item.type,
        confidence: Math.min(100, Math.max(0, item.confidence || 50)),
        reasoning: item.reasoning || 'Clasificación automática por lote',
        alternativeTypes: (item.alternativeTypes || [])
          .filter((alt: any) => alt.type && DOCUMENT_TYPE_LABELS[alt.type as DocumentType])
          .slice(0, 3),
        metadata: {
          discipline: item.metadata?.discipline || undefined,
          phase: item.metadata?.phase || undefined,
          keywords: item.metadata?.keywords || []
        }
      }
    })
  } catch (error) {
    console.error('Error in batch AI classification:', error)
    return contexts.map(ctx => createFallbackClassification(ctx))
  }
}

function createFallbackClassification(context: ClassificationContext): AIClassificationResult {
  const analysis = analyzeFileNameBasic(context.fileName, context.folderPath, context.fileExtension)
  
  return {
    type: analysis.type,
    confidence: analysis.confidence,
    reasoning: 'Clasificación basada en reglas (IA no disponible)',
    alternativeTypes: [],
    metadata: {
      keywords: []
    }
  }
}

function analyzeFileNameBasic(
  fileName: string, 
  folderPath: string, 
  extension: string
): { type: DocumentType; confidence: number } {
  const nameLower = fileName.toLowerCase()
  const pathLower = folderPath.toLowerCase()
  const extLower = extension.toLowerCase()

  const keywords: Record<DocumentType, string[]> = {
    'plano': ['plano', 'plan', 'dwg', 'dxf', 'planta', 'alzado', 'seccion'],
    'memoria': ['memoria', 'descriptiv', 'constructiv', 'justificativ'],
    'presupuesto': ['presupuesto', 'medicion', 'pem', 'bc3', 'coste'],
    'imagen': ['render', 'foto', 'imagen', 'jpg', 'png'],
    'administrativo': ['licencia', 'permiso', 'visado', 'certificado'],
    'modelo': ['modelo', 'revit', 'bim', 'ifc', 'skp'],
    'instalaciones': ['instalacion', 'electric', 'fontaner', 'climatizacion'],
    'detalles-constructivos': ['detalle', 'constructivo', 'encuentro'],
    'otros': []
  }

  const extensionMap: Record<string, DocumentType> = {
    'dwg': 'plano', 'dxf': 'plano',
    'pdf': 'memoria', 'doc': 'memoria', 'docx': 'memoria',
    'xls': 'presupuesto', 'xlsx': 'presupuesto', 'bc3': 'presupuesto',
    'jpg': 'imagen', 'jpeg': 'imagen', 'png': 'imagen', 'tif': 'imagen',
    'rvt': 'modelo', 'ifc': 'modelo', 'skp': 'modelo'
  }

  for (const [type, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (nameLower.includes(word) || pathLower.includes(word)) {
        return { type: type as DocumentType, confidence: 60 }
      }
    }
  }

  if (extensionMap[extLower]) {
    return { type: extensionMap[extLower], confidence: 40 }
  }

  return { type: 'otros', confidence: 30 }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 80) return 'high'
  if (confidence >= 50) return 'medium'
  return 'low'
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-green-600'
  if (confidence >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

export function getConfidenceBadgeVariant(confidence: number): 'default' | 'secondary' | 'destructive' {
  if (confidence >= 80) return 'default'
  if (confidence >= 50) return 'secondary'
  return 'destructive'
}
