import { BudgetItem, BudgetPrice, BudgetItemType, UnitType } from './types'

export interface BC3ParseResult {
  items: BudgetItem[]
  prices: BudgetPrice[]
  metadata: {
    title?: string
    author?: string
    description?: string
    format?: string
    totalItems: number
    totalPrices: number
    chapters: number
    materials: number
    labor: number
    units: number
  }
}

interface BC3Record {
  type: string
  fields: string[]
}

function parseBC3Content(content: string): BC3Record[] {
  const lines = content.split('\n').filter(line => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('#')
  })
  
  const records: BC3Record[] = []
  
  for (const line of lines) {
    if (!line.startsWith('~')) continue
    
    const parts = line.substring(1).split('|')
    if (parts.length < 2) continue
    
    const type = parts[0].trim()
    const fields = parts.slice(1).map(f => f.trim())
    
    records.push({ type, fields })
  }
  
  return records
}

export function parseBC3File(content: string): BC3ParseResult {
  if (!content || content.trim().length === 0) {
    throw new Error('El contenido del archivo BC3 está vacío')
  }

  const records = parseBC3Content(content)
  
  if (records.length === 0) {
    throw new Error('No se encontraron registros válidos en el archivo BC3')
  }

  const itemMap = new Map<string, BudgetItem>()
  const priceMap = new Map<string, BudgetPrice>()
  const textMap = new Map<string, string>()
  const metadata: BC3ParseResult['metadata'] = {
    totalItems: 0,
    totalPrices: 0,
    chapters: 0,
    materials: 0,
    labor: 0,
    units: 0
  }

  for (const record of records) {
    switch (record.type) {
      case 'V':
        parseVersionRecord(record, metadata)
        break
      case 'K':
        parseMetadataRecord(record, metadata)
        break
      case 'C':
        parsePriceRecord(record, priceMap)
        break
      case 'T':
        parseTextRecord(record, textMap)
        break
      case 'D':
        parseDecompositionRecord(record, itemMap, priceMap)
        break
    }
  }

  applyTextsToItems(itemMap, textMap)
  applyTextsToPrices(Array.from(priceMap.values()), textMap)

  const rootItems = Array.from(itemMap.values()).filter(item => !item.parentId)
  const allPrices = Array.from(priceMap.values())

  return {
    items: rootItems,
    prices: allPrices,
    metadata: {
      ...metadata,
      ...calculateStatistics(rootItems, itemMap)
    }
  }
}

function calculateStatistics(
  items: BudgetItem[],
  itemMap: Map<string, BudgetItem>
): Partial<BC3ParseResult['metadata']> {
  const allItems = Array.from(itemMap.values())
  
  return {
    totalItems: allItems.length,
    totalPrices: allItems.length,
    units: allItems.filter(i => i.type === 'unit').length,
    labor: allItems.filter(i => i.type === 'labor').length,
    materials: allItems.filter(i => i.type === 'material').length
  }
}

function parseVersionRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  if (record.fields.length > 0) {
    metadata.format = `BC3 ${record.fields[0]}`
  }
}

function parseMetadataRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  const field = record.fields[0]
  const value = record.fields.slice(1).join('|').trim()
  
  if (!field || !value) return
  
  const fieldUpper = field.toUpperCase()
  
  switch (fieldUpper) {
    case 'OBRA':
    case 'TITLE':
      metadata.title = value
      break
    case 'AUTHOR':
    case 'AUTOR':
      metadata.author = value
      break
    case 'DESCRIPTION':
    case 'DESCRIPCION':
      metadata.description = value
      break
  }
}

function parsePriceRecord(
  record: BC3Record, 
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 2) return
  
  const code = record.fields[0]?.trim()
  if (!code) return
  
  const unitStr = record.fields[1]?.trim() || 'ud'
  const priceStr = record.fields[4]?.replace(',', '.') || '0'
  const typeStr = record.fields[5]?.trim() || '0'
  
  let type: BudgetItemType = 'unit'
  if (typeStr === '0') type = 'unit'
  else if (typeStr === '1') type = 'labor'
  else if (typeStr === '2') type = 'material'
  else if (typeStr === '3') type = 'machinery'

  if (!priceMap.has(code)) {
    const price: BudgetPrice = {
      id: `bc3-price-${code}-${Date.now()}`,
      code,
      description: code,
      unit: normalizeUnit(unitStr),
      unitPrice: parseFloat(priceStr) || 0,
      type: type === 'unit' ? 'unit' : type === 'labor' ? 'labor' : type === 'material' ? 'material' : 'machinery',
      lastUpdated: Date.now(),
      category: getCategoryFromType(type)
    }
    priceMap.set(code, price)
  }
}

function parseTextRecord(
  record: BC3Record,
  textMap: Map<string, string>
) {
  if (record.fields.length < 2) return
  
  const code = record.fields[0]?.trim()
  const text = record.fields.slice(1).join('|').trim()
  
  if (code && text) {
    textMap.set(code, text)
  }
}

function parseDecompositionRecord(
  record: BC3Record,
  itemMap: Map<string, BudgetItem>,
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 3) return
  
  const parentCode = record.fields[0]?.trim()
  const childCode = record.fields[1]?.trim()
  
  if (!parentCode || !childCode) return
  
  const quantityStr = record.fields[2]?.replace(',', '.') || '1'
  const quantity = parseFloat(quantityStr) || 1
  const typeStr = record.fields[8]?.trim() || '0'
  
  const typeCode = parseInt(typeStr, 10)
  let itemType: BudgetItemType = 'unit'
  if (typeCode === 0) itemType = 'unit'
  else if (typeCode === 1) itemType = 'labor'
  else if (typeCode === 2) itemType = 'material'
  else if (typeCode === 3) itemType = 'machinery'
  
  const parentPrice = priceMap.get(parentCode)
  
  if (!itemMap.has(parentCode)) {
    const parentItem: BudgetItem = {
      id: `item-${parentCode}-${Date.now()}`,
      code: parentCode,
      description: parentCode,
      type: 'unit',
      unit: parentPrice?.unit || 'ud',
      quantity: 1,
      unitPrice: parentPrice?.unitPrice || 0,
      totalPrice: parentPrice?.unitPrice || 0,
      children: [],
      order: itemMap.size
    }
    itemMap.set(parentCode, parentItem)
  }
  
  const parentItem = itemMap.get(parentCode)!
  const childPrice = priceMap.get(childCode)
  
  const childId = `item-${childCode}-${Date.now()}-${Math.random()}`
  const childItem: BudgetItem = {
    id: childId,
    code: childCode,
    description: childCode,
    type: itemType,
    unit: childPrice?.unit || 'ud',
    quantity: isNaN(quantity) ? 1 : quantity,
    unitPrice: childPrice?.unitPrice || 0,
    totalPrice: (childPrice?.unitPrice || 0) * quantity,
    parentId: parentItem.id,
    order: itemMap.size
  }
  
  if (parentItem?.children) {
    parentItem.children.push(childItem)
    parentItem.totalPrice = parentItem.children.reduce(
      (sum, child) => sum + (child.totalPrice || 0),
      0
    )
  }
}

function applyTextsToItems(
  itemMap: Map<string, BudgetItem>,
  textMap: Map<string, string>
) {
  for (const [code, item] of itemMap.entries()) {
    const text = textMap.get(code)
    if (text) {
      item.description = text
      if (item.children) {
        item.children.forEach(child => {
          const childText = textMap.get(child.code)
          if (childText) {
            child.description = childText
          }
        })
      }
    }
  }
}

function applyTextsToPrices(
  prices: BudgetPrice[],
  textMap: Map<string, string>
) {
  for (const price of prices) {
    const text = textMap.get(price.code)
    if (text) {
      price.description = text
    }
  }
}

function getCategoryFromType(type: 'material' | 'labor' | 'machinery' | 'unit'): string {
  const categoryMap = {
    'material': 'Materiales',
    'labor': 'Mano de Obra',
    'machinery': 'Maquinaria',
    'unit': 'Unidades de Obra'
  }
  return categoryMap[type]
}

function normalizeUnit(unit: string): UnitType {
  const normalized = unit.toLowerCase().trim()
  
  const unitMap: Record<string, UnitType> = {
    'm': 'm',
    'ml': 'm',
    'm2': 'm2',
    'm²': 'm2',
    'm3': 'm3',
    'm³': 'm3',
    'ud': 'ud',
    'u': 'ud',
    'un': 'ud',
    'kg': 'kg',
    'kgs': 'kg',
    'l': 'l',
    'lt': 'l',
    'h': 'h',
    'hr': 'h',
    'pa': 'pa'
  }
  
  return unitMap[normalized] || 'ud'
}

export async function importBC3FromFile(file: File): Promise<BC3ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        
        let content = ''
        try {
          const decoder = new TextDecoder('ISO-8859-1')
          content = decoder.decode(arrayBuffer)
        } catch {
          const decoder = new TextDecoder('windows-1252')
          content = decoder.decode(arrayBuffer)
        }
        
        if (!content || content.trim().length === 0) {
          reject(new Error('El archivo BC3 está vacío o no se pudo leer'))
          return
        }
        
        const result = parseBC3File(content)
        
        if (result.prices.length === 0 && result.items.length === 0) {
          reject(new Error('No se encontraron datos válidos en el archivo BC3'))
          return
        }
        
        resolve(result)
      } catch (error) {
        console.error('Error detallado al parsear BC3:', error)
        reject(new Error(`Error al parsear archivo BC3: ${error instanceof Error ? error.message : 'Error desconocido'}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsArrayBuffer(file)
  })
}

export function validateBC3File(file: File): { valid: boolean; error?: string } {
  if (!file.name.toLowerCase().endsWith('.bc3')) {
    return { valid: false, error: 'El archivo debe tener extensión .bc3' }
  }
  
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'El archivo no puede superar los 50 MB' }
  }
  
  return { valid: true }
}

export function getBC3FileInfo(file: File): string {
  const sizeKB = (file.size / 1024).toFixed(2)
  return `Archivo: ${file.name} (${sizeKB} KB)`
}
