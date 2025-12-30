import { toast } from 'sonner'

export interface BackupData {
  version: string
  timestamp: number
  data: Record<string, any>
  metadata: {
    projectCount: number
    clientCount: number
    invoiceCount: number
    documentCount: number
    stakeholderCount: number
  }
}

export async function createFullBackup(): Promise<BackupData> {
  try {
    const allKeys = await spark.kv.keys()
    const data: Record<string, any> = {}
    
    for (const key of allKeys) {
      const value = await spark.kv.get(key)
      if (value !== undefined) {
        data[key] = value
      }
    }

    const projects = data['projects'] || []
    const clients = data['clients'] || []
    const invoices = data['invoices'] || []
    const documents = data['project-documents'] || []
    const stakeholders = data['stakeholders'] || []

    const backup: BackupData = {
      version: '1.0.0',
      timestamp: Date.now(),
      data,
      metadata: {
        projectCount: Array.isArray(projects) ? projects.length : 0,
        clientCount: Array.isArray(clients) ? clients.length : 0,
        invoiceCount: Array.isArray(invoices) ? invoices.length : 0,
        documentCount: Array.isArray(documents) ? documents.length : 0,
        stakeholderCount: Array.isArray(stakeholders) ? stakeholders.length : 0,
      }
    }

    return backup
  } catch (error) {
    console.error('Error creating backup:', error)
    throw new Error('Error al crear el respaldo de datos')
  }
}

export async function exportBackupToFile(backup: BackupData): Promise<void> {
  try {
    const json = JSON.stringify(backup, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const date = new Date(backup.timestamp)
    const dateStr = date.toISOString().split('T')[0]
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-')
    const filename = `afo-backup-${dateStr}-${timeStr}.json`
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Respaldo exportado correctamente', {
      description: `Archivo: ${filename}`
    })
  } catch (error) {
    console.error('Error exporting backup:', error)
    throw new Error('Error al exportar el archivo de respaldo')
  }
}

export async function restoreFromBackup(backup: BackupData): Promise<void> {
  try {
    if (!backup.version || !backup.data || !backup.timestamp) {
      throw new Error('Formato de respaldo inválido')
    }

    const existingKeys = await spark.kv.keys()
    for (const key of existingKeys) {
      await spark.kv.delete(key)
    }

    for (const [key, value] of Object.entries(backup.data)) {
      await spark.kv.set(key, value)
    }

    toast.success('Datos restaurados correctamente', {
      description: 'La aplicación se recargará'
    })

    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    console.error('Error restoring backup:', error)
    throw new Error('Error al restaurar los datos del respaldo')
  }
}

export async function importBackupFromFile(file: File): Promise<BackupData> {
  try {
    const text = await file.text()
    const backup = JSON.parse(text) as BackupData
    
    if (!backup.version || !backup.data || !backup.timestamp) {
      throw new Error('El archivo no tiene el formato correcto de respaldo')
    }

    return backup
  } catch (error) {
    console.error('Error importing backup file:', error)
    if (error instanceof SyntaxError) {
      throw new Error('El archivo no es un JSON válido')
    }
    throw new Error('Error al leer el archivo de respaldo')
  }
}

export function formatBackupSize(backup: BackupData): string {
  const json = JSON.stringify(backup)
  const bytes = new Blob([json]).size
  
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
}

export function formatBackupDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
