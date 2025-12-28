import { Project, Document, FolderStructureType } from './types'
import JSZip from 'jszip'

export interface ExportOptions {
  includeAllVersions: boolean
  includeMetadata: boolean
  structureType?: FolderStructureType
}

export interface ExportResult {
  success: boolean
  fileName: string
  error?: string
}

const FOLDER_STRUCTURE_BY_TYPE = [
  '01_Planos',
  '02_Memorias',
  '03_Presupuestos',
  '04_Imágenes',
  '05_Administrativo',
  '06_Modelos_3D',
  '07_Instalaciones',
  '08_Otros'
]

const FOLDER_STRUCTURE_SCREAMING = [
  'Componentes',
  'Servicios',
  'Modelos',
  'Documentación',
  'Presentación',
  'Administrativo',
  'Referencias'
]

export function getFolderStructureForType(type: FolderStructureType): string[] {
  return type === 'by-type' ? FOLDER_STRUCTURE_BY_TYPE : FOLDER_STRUCTURE_SCREAMING
}

export function sanitizeFolderName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 255)
}

export function generateProjectMetadataFile(
  project: Project,
  documents: Document[]
): string {
  const metadata = {
    proyecto: {
      nombre: project.title,
      ubicacion: project.location,
      descripcion: project.description || '',
      estado: project.status,
      fechaCreacion: new Date(project.createdAt).toISOString(),
      fechaActualizacion: new Date(project.updatedAt).toISOString()
    },
    fases: project.phases.map(phase => ({
      fase: phase.phase,
      porcentaje: phase.percentage,
      estado: phase.status
    })),
    documentos: {
      total: documents.length,
      porTipo: documents.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    },
    estadisticas: {
      totalVersiones: documents.reduce((sum, doc) => sum + doc.versions.length, 0),
      tamañoTotal: documents.reduce((sum, doc) => {
        return sum + doc.versions.reduce((vsum, v) => vsum + v.fileSize, 0)
      }, 0)
    },
    estructura: project.folderStructure || 'by-type',
    exportadoEn: new Date().toISOString()
  }

  return JSON.stringify(metadata, null, 2)
}

export function generateDocumentIndex(documents: Document[]): string {
  let markdown = '# Índice de Documentos\n\n'
  markdown += `Generado el: ${new Date().toLocaleDateString('es-ES')}\n\n`
  markdown += `Total de documentos: ${documents.length}\n\n`

  const byFolder = documents.reduce((acc, doc) => {
    if (!acc[doc.folder]) {
      acc[doc.folder] = []
    }
    acc[doc.folder].push(doc)
    return acc
  }, {} as Record<string, Document[]>)

  Object.entries(byFolder)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([folder, docs]) => {
      markdown += `## ${folder}\n\n`
      docs.forEach(doc => {
        const latestVersion = doc.versions[0]
        markdown += `- **${doc.name}** (${doc.currentVersion})\n`
        markdown += `  - Tipo: ${doc.type}\n`
        markdown += `  - Última actualización: ${new Date(doc.updatedAt).toLocaleDateString('es-ES')}\n`
        markdown += `  - Versiones: ${doc.versions.length}\n`
        if (doc.metadata.discipline) {
          markdown += `  - Disciplina: ${doc.metadata.discipline}\n`
        }
        markdown += '\n'
      })
    })

  return markdown
}

export async function exportProjectDocuments(
  project: Project,
  documents: Document[],
  options: ExportOptions
): Promise<ExportResult> {
  try {
    const zip = new JSZip()
    
    const projectFolderName = sanitizeFolderName(project.title)
    const projectFolder = zip.folder(projectFolderName)
    
    if (!projectFolder) {
      throw new Error('No se pudo crear la carpeta del proyecto')
    }

    const structureType = options.structureType || project.folderStructure || 'by-type'
    const folders = getFolderStructureForType(structureType)
    
    folders.forEach(folderName => {
      projectFolder.folder(folderName)
    })

    if (options.includeMetadata) {
      const metadataContent = generateProjectMetadataFile(project, documents)
      projectFolder.file('METADATA.json', metadataContent)
      
      const indexContent = generateDocumentIndex(documents)
      projectFolder.file('INDICE_DOCUMENTOS.md', indexContent)
      
      const readmeContent = generateReadmeFile(project, structureType)
      projectFolder.file('README.md', readmeContent)
    }

    for (const doc of documents) {
      const docFolder = projectFolder.folder(doc.folder)
      if (!docFolder) continue

      if (options.includeAllVersions) {
        const versionFolder = docFolder.folder(sanitizeFolderName(doc.name))
        if (versionFolder) {
          for (const version of doc.versions) {
            versionFolder.file(
              version.fileName,
              `[Placeholder for ${version.fileName} - Version ${version.version}]\n` +
              `File size: ${version.fileSize} bytes\n` +
              `Uploaded: ${new Date(version.uploadedAt).toISOString()}\n` +
              `Status: ${version.status}\n` +
              (version.notes ? `Notes: ${version.notes}\n` : '')
            )
          }
        }
      } else {
        const currentVersion = doc.versions.find(v => v.version === doc.currentVersion)
        if (currentVersion) {
          docFolder.file(
            currentVersion.fileName,
            `[Placeholder for ${currentVersion.fileName} - Version ${currentVersion.version}]\n` +
            `File size: ${currentVersion.fileSize} bytes\n` +
            `Uploaded: ${new Date(currentVersion.uploadedAt).toISOString()}\n` +
            `Status: ${currentVersion.status}\n`
          )
        }
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    
    const fileName = `${sanitizeFolderName(project.title)}_${Date.now()}.zip`
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    
    URL.revokeObjectURL(url)

    return {
      success: true,
      fileName
    }
  } catch (error) {
    console.error('Error exporting project:', error)
    return {
      success: false,
      fileName: '',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

function generateReadmeFile(project: Project, structureType: FolderStructureType): string {
  let readme = `# ${project.title}\n\n`
  readme += `**Ubicación:** ${project.location}\n\n`
  
  if (project.description) {
    readme += `## Descripción\n\n${project.description}\n\n`
  }

  readme += `## Estructura del Proyecto\n\n`
  readme += `Este proyecto utiliza una estructura de carpetas tipo: **${structureType === 'by-type' ? 'Por Tipo de Documento' : 'Arquitectura Gritante (Screaming Architecture)'}**\n\n`

  readme += `### Carpetas\n\n`
  const folders = getFolderStructureForType(structureType)
  folders.forEach(folder => {
    readme += `- **${folder}**: ${getFolderDescription(folder)}\n`
  })

  readme += `\n## Fases del Proyecto\n\n`
  project.phases.forEach(phase => {
    readme += `- ${phase.phase} (${phase.percentage}%) - Estado: ${phase.status}\n`
  })

  readme += `\n## Información de Exportación\n\n`
  readme += `- Exportado el: ${new Date().toLocaleString('es-ES')}\n`
  readme += `- Sistema: AFO CORE MANAGER\n`
  readme += `\n---\n`
  readme += `\nPara más información, consulte el archivo METADATA.json\n`

  return readme
}

function getFolderDescription(folder: string): string {
  const descriptions: Record<string, string> = {
    '01_Planos': 'Planos arquitectónicos, de situación, emplazamiento, plantas, alzados y secciones',
    '02_Memorias': 'Memorias descriptivas, constructivas y justificativas del proyecto',
    '03_Presupuestos': 'Presupuestos, mediciones y documentos económicos',
    '04_Imágenes': 'Renders, fotografías y visualizaciones del proyecto',
    '05_Administrativo': 'Documentación administrativa, licencias y permisos',
    '06_Modelos_3D': 'Modelos BIM, SketchUp y otros archivos 3D',
    '07_Instalaciones': 'Documentación de instalaciones eléctricas, fontanería, HVAC',
    '08_Otros': 'Otros documentos y archivos varios',
    'Componentes': 'Elementos constructivos, detalles y especificaciones',
    'Servicios': 'Instalaciones y sistemas del edificio',
    'Modelos': 'Modelos 3D y BIM del proyecto',
    'Documentación': 'Memorias, informes y documentos técnicos',
    'Presentación': 'Renders, visualizaciones y material de presentación',
    'Administrativo': 'Trámites, licencias y documentación legal',
    'Referencias': 'Documentos de referencia y material auxiliar'
  }
  return descriptions[folder] || 'Documentos del proyecto'
}

export async function exportMultipleProjects(
  projects: Array<{ project: Project; documents: Document[] }>,
  options: ExportOptions
): Promise<ExportResult> {
  try {
    const zip = new JSZip()
    
    const rootFolderName = `Exportacion_Proyectos_${Date.now()}`
    const rootFolder = zip.folder(rootFolderName)
    
    if (!rootFolder) {
      throw new Error('No se pudo crear la carpeta raíz')
    }

    for (const { project, documents } of projects) {
      const projectFolderName = sanitizeFolderName(project.title)
      const projectFolder = rootFolder.folder(projectFolderName)
      
      if (!projectFolder) continue

      const structureType = options.structureType || project.folderStructure || 'by-type'
      const folders = getFolderStructureForType(structureType)
      
      folders.forEach(folderName => {
        projectFolder.folder(folderName)
      })

      if (options.includeMetadata) {
        const metadataContent = generateProjectMetadataFile(project, documents)
        projectFolder.file('METADATA.json', metadataContent)
        
        const indexContent = generateDocumentIndex(documents)
        projectFolder.file('INDICE_DOCUMENTOS.md', indexContent)
        
        const readmeContent = generateReadmeFile(project, structureType)
        projectFolder.file('README.md', readmeContent)
      }

      for (const doc of documents) {
        const docFolder = projectFolder.folder(doc.folder)
        if (!docFolder) continue

        if (options.includeAllVersions) {
          const versionFolder = docFolder.folder(sanitizeFolderName(doc.name))
          if (versionFolder) {
            for (const version of doc.versions) {
              versionFolder.file(
                version.fileName,
                `[Placeholder for ${version.fileName}]`
              )
            }
          }
        } else {
          const currentVersion = doc.versions.find(v => v.version === doc.currentVersion)
          if (currentVersion) {
            docFolder.file(currentVersion.fileName, `[Placeholder for ${currentVersion.fileName}]`)
          }
        }
      }
    }

    const summaryContent = generateMultiProjectSummary(projects)
    rootFolder.file('RESUMEN_EXPORTACION.md', summaryContent)

    const blob = await zip.generateAsync({ type: 'blob' })
    
    const fileName = `${rootFolderName}.zip`
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    
    URL.revokeObjectURL(url)

    return {
      success: true,
      fileName
    }
  } catch (error) {
    console.error('Error exporting multiple projects:', error)
    return {
      success: false,
      fileName: '',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

function generateMultiProjectSummary(
  projects: Array<{ project: Project; documents: Document[] }>
): string {
  let summary = '# Resumen de Exportación\n\n'
  summary += `Exportado el: ${new Date().toLocaleString('es-ES')}\n\n`
  summary += `Total de proyectos: ${projects.length}\n\n`

  summary += '## Proyectos Incluidos\n\n'
  projects.forEach(({ project, documents }) => {
    summary += `### ${project.title}\n\n`
    summary += `- **Ubicación:** ${project.location}\n`
    summary += `- **Estado:** ${project.status}\n`
    summary += `- **Documentos:** ${documents.length}\n`
    summary += `- **Fases:** ${project.phases.length}\n`
    summary += '\n'
  })

  const totalDocuments = projects.reduce((sum, p) => sum + p.documents.length, 0)
  summary += `\n## Estadísticas Totales\n\n`
  summary += `- Total de documentos: ${totalDocuments}\n`

  return summary
}
