import { BudgetItem, BudgetPrice, BudgetItemType, UnitType } from './types'

export interface BC3ParseResult {
  items: BudgetItem[]
  prices: BudgetPrice[]
  metadata: {
    title?: string
    author?: string
    date?: string
    description?: string
    version?: string
    format?: string
  }
  statistics: {
    totalItems: number
    totalPrices: number
    chapters: number
    units: number
    materials: number
    labor: number
    machinery: number
  }
}

export interface BC3Record {
  type: string
  fields: string[]
}

export function parseBC3File(content: string): BC3ParseResult {
  const lines = content.split(/\r?\n/).filter(line => {
    const trimmed = line.trim()
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//')
  })
  
  const records: BC3Record[] = []
  
  for (const line of lines) {
    const match = line.match(/^~([A-Z])~/)
    if (match) {
      const type = match[1]
      const rest = line.substring(3)
      const fields = rest.split('|').map(f => f.trim())
      records.push({ type, fields })
    }
  }
  
  if (records.length === 0) {
    throw new Error('No se encontraron registros válidos en el archivo BC3. Asegúrate de que el archivo tiene el formato FIEBDC-3 correcto.')
  }
  
  const items: BudgetItem[] = []
  const prices: BudgetPrice[] = []
  const priceMap = new Map<string, BudgetPrice>()
  const itemMap = new Map<string, BudgetItem>()
  const textMap = new Map<string, string>()
  const metadata: BC3ParseResult['metadata'] = {}
  
  for (const record of records) {
    try {
      switch (record.type) {
        case 'V':
          parseVersionRecord(record, metadata)
          break
        case 'K':
          parseHeaderRecord(record, metadata)
          break
        case 'C':
          parsePriceRecord(record, prices, priceMap)
          break
        case 'T':
          parseTextRecord(record, textMap)
          break
        case 'D':
          parseDecompositionRecord(record, itemMap, priceMap)
          break
      }
    } catch (error) {
      console.warn(`Error al procesar registro tipo ${record.type}:`, error)
    }
  }
  
  applyTextsToItems(itemMap, textMap)
  applyTextsToPrices(prices, textMap)
  
  const rootItems = Array.from(itemMap.values()).filter(item => !item.parentId)
  
  const statistics = calculateStatistics(items, prices, itemMap)
  
  return {
    items: rootItems,
    prices,
    metadata,
    statistics
  }
}

function calculateStatistics(
  items: BudgetItem[],
  prices: BudgetPrice[],
  itemMap: Map<string, BudgetItem>
): BC3ParseResult['statistics'] {
  const allItems = Array.from(itemMap.values())
  
  return {
    totalItems: allItems.length,
    totalPrices: prices.length,
    chapters: allItems.filter(i => i.type === 'chapter').length,
    units: allItems.filter(i => i.type === 'unit').length,
    materials: prices.filter(p => p.type === 'material').length,
    labor: prices.filter(p => p.type === 'labor').length,
    machinery: prices.filter(p => p.type === 'machinery').length
  }
}

function parseVersionRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  if (record.fields.length > 0) {
    metadata.version = record.fields[0] || 'FIEBDC-3'
    metadata.format = 'BC3'
  }
}

function parseHeaderRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  const [field, ...valueParts] = record.fields
  const value = valueParts.join('|').trim()
  
  if (!field || !value) return
  
  const fieldUpper = field.toUpperCase()
  
  switch (fieldUpper) {
    case 'OBRA':
    case 'PROYECTO':
      metadata.title = value
      break
    case 'AUTOR':
    case 'AUTHOR':
      metadata.author = value
      break
    case 'FECHA':
    case 'DATE':
      metadata.date = value
      break
    case 'COMENTARIO':
    case 'DESCRIPCION':
    case 'DESCRIPTION':
      metadata.description = value
      break
  }
}

function parsePriceRecord(
  record: BC3Record, 
  prices: BudgetPrice[], 
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 2) return
  
  const code = record.fields[0]?.trim()
  if (!code) return
  
  const unit = record.fields[1]?.trim() || 'ud'
  const priceStr = record.fields[2]?.replace(',', '.') || '0'
  const unitPrice = parseFloat(priceStr)
  
  const typeStr = record.fields[5]?.trim() || '0'
  
  let priceType: 'material' | 'labor' | 'machinery' | 'unit' = 'unit'
  if (typeStr === '0') priceType = 'material'
  else if (typeStr === '1') priceType = 'labor'
  else if (typeStr === '2') priceType = 'machinery'
  
  if (!priceMap.has(code)) {
    const price: BudgetPrice = {
      id: `bc3-price-${code}-${Date.now()}-${Math.random()}`,
      code,
      description: code,
      unit: normalizeUnit(unit),
      unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
      type: priceType,
      lastUpdated: Date.now(),
      source: 'BC3 Import',
      category: getCategoryFromType(priceType)
    }
    
    prices.push(price)
    priceMap.set(code, price)
  }
}

function parseTextRecord(
  record: BC3Record,
  textMap: Map<string, string>
) {
  if (record.fields.length < 2) return
  
  const code = record.fields[0]?.trim()
  const text = record.fields[1]?.trim()
  
  if (code && text) {
    textMap.set(code, text)
  }
}

function parseDecompositionRecord(
  record: BC3Record,
  itemMap: Map<string, BudgetItem>,
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 2) return
  
  const parentCode = record.fields[0]?.trim()
  const childCode = record.fields[1]?.trim()
  
  if (!parentCode || !childCode) return
  
  const quantityStr = record.fields[2]?.replace(',', '.') || '1'
  const quantity = parseFloat(quantityStr)
  const typeStr = record.fields[8]?.trim() || '0'
  const typeCode = parseInt(typeStr)
  
  let itemType: BudgetItemType = 'unit'
  if (typeCode === 0) itemType = 'chapter'
  else if (typeCode === 1) itemType = 'unit'
  else if (typeCode === 2) itemType = 'material'
  else if (typeCode === 3) itemType = 'labor'
  else if (typeCode === 4) itemType = 'machinery'
  
  if (!itemMap.has(parentCode)) {
    const parentPrice = priceMap.get(parentCode)
    const parentItem: BudgetItem = {
      id: `item-${parentCode}-${Date.now()}-${Math.random()}`,
      code: parentCode,
      type: typeCode === 0 ? 'chapter' : 'unit',
      description: parentPrice?.description || parentCode,
      unit: parentPrice?.unit,
      quantity: 1,
      unitPrice: parentPrice?.unitPrice || 0,
      totalPrice: parentPrice?.unitPrice || 0,
      children: [],
      order: itemMap.size
    }
    itemMap.set(parentCode, parentItem)
  }
  
  const childPrice = priceMap.get(childCode)
  const childId = `item-${childCode}-${parentCode}-${Date.now()}-${Math.random()}`
  
  const childItem: BudgetItem = {
    id: childId,
    code: childCode,
    type: itemType,
    description: childPrice?.description || childCode,
    unit: childPrice?.unit,
    quantity: isNaN(quantity) ? 0 : quantity,
    unitPrice: childPrice?.unitPrice || 0,
    totalPrice: (childPrice?.unitPrice || 0) * (isNaN(quantity) ? 0 : quantity),
    parentId: parentCode,
    order: itemMap.size
  }
  
  const parentItem = itemMap.get(parentCode)
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
  const fileName = file.name.toLowerCase()
  
  if (!fileName.endsWith('.bc3')) {
    return { 
      valid: false, 
      error: 'El archivo debe tener extensión .bc3 (formato FIEBDC-3)' 
    }
  }
  
  if (file.size === 0) {
    return { 
      valid: false, 
      error: 'El archivo está vacío' 
    }
  }
  
  if (file.size > 50 * 1024 * 1024) {
    return { 
      valid: false, 
      error: `El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(2)} MB). El tamaño máximo es 50 MB` 
    }
  }
  
  return { valid: true }
}

export function getBC3FileInfo(file: File): string {
  const sizeMB = (file.size / 1024 / 1024).toFixed(2)
  const sizeKB = (file.size / 1024).toFixed(2)
  const size = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`
  
  return `${file.name} (${size})`
}
