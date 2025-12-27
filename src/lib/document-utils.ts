import { DocumentStatus, DocumentVersion } from './types'

export function generateVersionNumber(
  deliveryNumber: number,
  saveNumber: number,
  status: DocumentStatus
): string {
  if (status === 'approved') {
    return `C${deliveryNumber.toString().padStart(2, '0')}`
  }
  if (status === 'shared') {
    return `P${deliveryNumber.toString().padStart(2, '0')}`
  }
  return `P${deliveryNumber.toString().padStart(2, '0')}.${saveNumber.toString().padStart(2, '0')}`
}

export function parseVersionNumber(version: string): {
  deliveryNumber: number
  saveNumber: number
  status: DocumentStatus
} {
  if (version.startsWith('C')) {
    const deliveryNumber = parseInt(version.slice(1))
    return { deliveryNumber, saveNumber: 0, status: 'approved' }
  }
  
  if (version.includes('.')) {
    const [delivery, save] = version.slice(1).split('.')
    return {
      deliveryNumber: parseInt(delivery),
      saveNumber: parseInt(save),
      status: 'draft'
    }
  }
  
  const deliveryNumber = parseInt(version.slice(1))
  return { deliveryNumber, saveNumber: 0, status: 'shared' }
}

export function getNextVersion(
  currentVersion: string,
  newStatus: DocumentStatus
): string {
  const parsed = parseVersionNumber(currentVersion)
  
  if (newStatus === 'approved') {
    return generateVersionNumber(parsed.deliveryNumber, 0, 'approved')
  }
  
  if (newStatus === 'shared') {
    if (parsed.status === 'draft') {
      return generateVersionNumber(parsed.deliveryNumber, 0, 'shared')
    }
    return generateVersionNumber(parsed.deliveryNumber + 1, 0, 'shared')
  }
  
  if (parsed.status === 'draft') {
    return generateVersionNumber(parsed.deliveryNumber, parsed.saveNumber + 1, 'draft')
  }
  return generateVersionNumber(parsed.deliveryNumber + 1, 1, 'draft')
}

export function generateStandardizedFileName(
  projectCode: string,
  discipline: string,
  description: string,
  version: string,
  extension: string
): string {
  const cleanProjectCode = projectCode.replace(/\s+/g, '-').toUpperCase()
  const cleanDiscipline = discipline.replace(/\s+/g, '-').toUpperCase()
  const cleanDescription = description.replace(/\s+/g, '-')
  
  return `${cleanProjectCode}_${cleanDiscipline}_${cleanDescription}_${version}.${extension}`
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function sortVersions(versions: DocumentVersion[]): DocumentVersion[] {
  return [...versions].sort((a, b) => {
    const parsedA = parseVersionNumber(a.version)
    const parsedB = parseVersionNumber(b.version)
    
    if (parsedA.deliveryNumber !== parsedB.deliveryNumber) {
      return parsedB.deliveryNumber - parsedA.deliveryNumber
    }
    
    if (parsedA.status === 'approved' && parsedB.status !== 'approved') return -1
    if (parsedA.status !== 'approved' && parsedB.status === 'approved') return 1
    
    return parsedB.saveNumber - parsedA.saveNumber
  })
}

export function validateFileName(fileName: string): { valid: boolean; error?: string } {
  if (!fileName || fileName.trim() === '') {
    return { valid: false, error: 'El nombre del archivo no puede estar vacío' }
  }
  
  const invalidChars = /[<>:"/\\|?*]/g
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'El nombre contiene caracteres no permitidos' }
  }
  
  if (fileName.length > 255) {
    return { valid: false, error: 'El nombre del archivo es demasiado largo (máximo 255 caracteres)' }
  }
  
  return { valid: true }
}
