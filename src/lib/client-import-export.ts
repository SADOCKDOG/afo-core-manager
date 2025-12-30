import { Client } from './types'

export interface ClientExportData {
  version: string
  exportedAt: number
  exportedBy: string
  totalClients: number
  clients: Client[]
}

export interface ClientImportResult {
  success: boolean
  imported: number
  skipped: number
  errors: Array<{ row: number; error: string }>
  clients: Client[]
}

export function exportClientsToJSON(clients: Client[]): string {
  const exportData: ClientExportData = {
    version: '1.0',
    exportedAt: Date.now(),
    exportedBy: 'AFO CORE MANAGER',
    totalClients: clients.length,
    clients: clients
  }
  
  return JSON.stringify(exportData, null, 2)
}

export function exportClientsToCSV(clients: Client[]): string {
  const headers = [
    'ID',
    'Tipo',
    'NIF/CIF',
    'Nombre',
    'Apellido 1',
    'Apellido 2',
    'Razón Social',
    'Dirección',
    'Email',
    'Teléfono',
    'Representante',
    'Notas',
    'IVA Personalizado (%)',
    'Condiciones de Pago',
    'Días Pago Personalizados',
    'Descuento Pronto Pago (%)',
    'Fecha Creación',
    'Fecha Actualización'
  ]
  
  const rows = clients.map(client => [
    client.id,
    client.type,
    client.nif,
    client.nombre || '',
    client.apellido1 || '',
    client.apellido2 || '',
    client.razonSocial || '',
    client.direccion || '',
    client.email || '',
    client.telefono || '',
    client.representante || '',
    client.notas || '',
    client.customTaxRate?.toString() || '',
    client.paymentTerms || '',
    client.customPaymentDays?.toString() || '',
    client.earlyPaymentDiscount?.toString() || '',
    new Date(client.createdAt).toISOString(),
    new Date(client.updatedAt).toISOString()
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      const cellStr = String(cell)
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`
      }
      return cellStr
    }).join(','))
  ].join('\n')
  
  return csvContent
}

export function importClientsFromJSON(jsonContent: string, existingClients: Client[]): ClientImportResult {
  const result: ClientImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
    clients: []
  }
  
  try {
    const data = JSON.parse(jsonContent) as ClientExportData | { clients: Client[] } | Client[]
    
    let clientsToImport: Client[] = []
    
    if (Array.isArray(data)) {
      clientsToImport = data
    } else if ('clients' in data && Array.isArray(data.clients)) {
      clientsToImport = data.clients
    } else {
      result.errors.push({ row: 0, error: 'Formato de archivo JSON no válido' })
      return result
    }
    
    const existingNIFs = new Set(existingClients.map(c => c.nif?.toLowerCase()))
    
    clientsToImport.forEach((client, index) => {
      try {
        if (!client.nif) {
          result.errors.push({ row: index + 1, error: 'NIF/CIF es obligatorio' })
          result.skipped++
          return
        }
        
        if (existingNIFs.has(client.nif.toLowerCase())) {
          result.errors.push({ row: index + 1, error: `Cliente con NIF ${client.nif} ya existe` })
          result.skipped++
          return
        }
        
        const newClient: Client = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          type: client.type || 'persona-fisica',
          nif: client.nif,
          nombre: client.nombre,
          apellido1: client.apellido1,
          apellido2: client.apellido2,
          razonSocial: client.razonSocial,
          direccion: client.direccion,
          email: client.email,
          telefono: client.telefono,
          representante: client.representante,
          notas: client.notas,
          customTaxRate: client.customTaxRate,
          paymentTerms: client.paymentTerms,
          customPaymentDays: client.customPaymentDays,
          earlyPaymentDiscount: client.earlyPaymentDiscount,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        
        result.clients.push(newClient)
        result.imported++
        existingNIFs.add(client.nif.toLowerCase())
      } catch (error) {
        result.errors.push({ 
          row: index + 1, 
          error: `Error procesando cliente: ${error instanceof Error ? error.message : 'Error desconocido'}` 
        })
        result.skipped++
      }
    })
    
    result.success = result.imported > 0
    
  } catch (error) {
    result.errors.push({ 
      row: 0, 
      error: `Error al procesar el archivo JSON: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    })
  }
  
  return result
}

export function importClientsFromCSV(csvContent: string, existingClients: Client[]): ClientImportResult {
  const result: ClientImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
    clients: []
  }
  
  try {
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      result.errors.push({ row: 0, error: 'El archivo CSV está vacío o solo contiene encabezados' })
      return result
    }
    
    const headers = parseCSVLine(lines[0])
    const existingNIFs = new Set(existingClients.map(c => c.nif?.toLowerCase()))
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i])
        
        if (values.length < headers.length) {
          result.errors.push({ row: i + 1, error: 'Número de columnas no coincide con los encabezados' })
          result.skipped++
          continue
        }
        
        const row: Record<string, string> = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        
        const nif = row['NIF/CIF']?.trim()
        
        if (!nif) {
          result.errors.push({ row: i + 1, error: 'NIF/CIF es obligatorio' })
          result.skipped++
          continue
        }
        
        if (existingNIFs.has(nif.toLowerCase())) {
          result.errors.push({ row: i + 1, error: `Cliente con NIF ${nif} ya existe` })
          result.skipped++
          continue
        }
        
        const type = row['Tipo']?.toLowerCase() === 'persona-juridica' ? 'persona-juridica' : 'persona-fisica'
        
        const newClient: Client = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          type,
          nif,
          nombre: row['Nombre']?.trim() || undefined,
          apellido1: row['Apellido 1']?.trim() || undefined,
          apellido2: row['Apellido 2']?.trim() || undefined,
          razonSocial: row['Razón Social']?.trim() || undefined,
          direccion: row['Dirección']?.trim() || undefined,
          email: row['Email']?.trim() || undefined,
          telefono: row['Teléfono']?.trim() || undefined,
          representante: row['Representante']?.trim() || undefined,
          notas: row['Notas']?.trim() || undefined,
          customTaxRate: row['IVA Personalizado (%)'] ? parseFloat(row['IVA Personalizado (%)']) : undefined,
          paymentTerms: row['Condiciones de Pago'] as any || undefined,
          customPaymentDays: row['Días Pago Personalizados'] ? parseInt(row['Días Pago Personalizados']) : undefined,
          earlyPaymentDiscount: row['Descuento Pronto Pago (%)'] ? parseFloat(row['Descuento Pronto Pago (%)']) : undefined,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        
        result.clients.push(newClient)
        result.imported++
        existingNIFs.add(nif.toLowerCase())
        
      } catch (error) {
        result.errors.push({ 
          row: i + 1, 
          error: `Error procesando fila: ${error instanceof Error ? error.message : 'Error desconocido'}` 
        })
        result.skipped++
      }
    }
    
    result.success = result.imported > 0
    
  } catch (error) {
    result.errors.push({ 
      row: 0, 
      error: `Error al procesar el archivo CSV: ${error instanceof Error ? error.message : 'Error desconocido'}` 
    })
  }
  
  return result
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  
  return result
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateClientTemplate(format: 'csv' | 'json'): string {
  const templateClients: Client[] = [
    {
      id: 'ejemplo-1',
      type: 'persona-fisica',
      nif: '12345678A',
      nombre: 'Juan',
      apellido1: 'García',
      apellido2: 'López',
      direccion: 'Calle Mayor 123, 28001 Madrid',
      email: 'juan.garcia@example.com',
      telefono: '+34 600 123 456',
      paymentTerms: '30-days',
      createdAt: Date.now(),
      updatedAt: Date.now()
    },
    {
      id: 'ejemplo-2',
      type: 'persona-juridica',
      nif: 'B87654321',
      razonSocial: 'Construcciones Ejemplo S.L.',
      representante: 'María Rodríguez',
      direccion: 'Avenida Principal 456, 28002 Madrid',
      email: 'info@construcciones-ejemplo.com',
      telefono: '+34 910 234 567',
      customTaxRate: 21,
      paymentTerms: '60-days',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]
  
  if (format === 'json') {
    return exportClientsToJSON(templateClients)
  } else {
    return exportClientsToCSV(templateClients)
  }
}
