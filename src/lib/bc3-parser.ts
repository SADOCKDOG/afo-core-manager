import { BudgetItem, BudgetPrice, BudgetItemType, UnitType } from './types'

export interface BC3ParseResult {
  items: BudgetItem[]
  prices: BudgetPrice[]
  metadata: {
    title?: string
    author?: string
    date?: string
    description?: string
  }
}

export interface BC3Record {
  type: string
  fields: string[]
}

export function parseBC3File(content: string): BC3ParseResult {
  const lines = content.split('\n')
  const records: BC3Record[] = []
  
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) continue
    
    const match = line.match(/^~([A-Z])~/)
    if (match) {
      const type = match[1]
      const fields = line.substring(3).split('|')
      records.push({ type, fields })
    }
  }
  
  const items: BudgetItem[] = []
  const prices: BudgetPrice[] = []
  const priceMap = new Map<string, BudgetPrice>()
  const itemMap = new Map<string, BudgetItem>()
  const metadata: BC3ParseResult['metadata'] = {}
  
  for (const record of records) {
    switch (record.type) {
      case 'V':
        parseVersionRecord(record, metadata)
        break
      case 'C':
        parsePriceRecord(record, prices, priceMap)
        break
      case 'D':
        parseDecompositionRecord(record, items, itemMap, priceMap)
        break
      case 'T':
        parseTextRecord(record, itemMap)
        break
      case 'K':
        parseHeaderRecord(record, metadata)
        break
    }
  }
  
  const rootItems = Array.from(itemMap.values()).filter(item => !item.parentId)
  
  return {
    items: rootItems,
    prices,
    metadata
  }
}

function parseVersionRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  if (record.fields.length > 0) {
    metadata.title = record.fields[0]
  }
}

function parseHeaderRecord(record: BC3Record, metadata: BC3ParseResult['metadata']) {
  const [field, value] = record.fields
  
  switch (field) {
    case 'OBRA':
      metadata.title = value
      break
    case 'AUTOR':
      metadata.author = value
      break
    case 'FECHA':
      metadata.date = value
      break
    case 'COMENTARIO':
      metadata.description = value
      break
  }
}

function parsePriceRecord(
  record: BC3Record, 
  prices: BudgetPrice[], 
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 3) return
  
  const [code, unit, priceStr, , , type] = record.fields
  const unitPrice = parseFloat(priceStr?.replace(',', '.') || '0')
  
  let priceType: 'material' | 'labor' | 'machinery' | 'unit' = 'unit'
  if (type === '0') priceType = 'material'
  else if (type === '1') priceType = 'labor'
  else if (type === '2') priceType = 'machinery'
  
  const price: BudgetPrice = {
    id: `bc3-${code}-${Date.now()}`,
    code: code.trim(),
    description: '',
    unit: normalizeUnit(unit),
    unitPrice,
    type: priceType,
    lastUpdated: Date.now(),
    source: 'BC3 Import'
  }
  
  prices.push(price)
  priceMap.set(code.trim(), price)
}

function parseDecompositionRecord(
  record: BC3Record,
  items: BudgetItem[],
  itemMap: Map<string, BudgetItem>,
  priceMap: Map<string, BudgetPrice>
) {
  if (record.fields.length < 2) return
  
  const [parentCode, childCode, quantityStr, , , , , , typeStr] = record.fields
  
  const parent = parentCode.trim()
  const child = childCode?.trim()
  
  if (!child) return
  
  const quantity = parseFloat(quantityStr?.replace(',', '.') || '0')
  const typeCode = parseInt(typeStr || '0')
  
  let itemType: BudgetItemType = 'unit'
  if (typeCode === 0) itemType = 'chapter'
  else if (typeCode === 1) itemType = 'unit'
  else if (typeCode === 2) itemType = 'material'
  else if (typeCode === 3) itemType = 'labor'
  else if (typeCode === 4) itemType = 'machinery'
  
  if (!itemMap.has(parent)) {
    const price = priceMap.get(parent)
    const parentItem: BudgetItem = {
      id: `item-${parent}-${Date.now()}`,
      code: parent,
      type: typeCode === 0 ? 'chapter' : 'unit',
      description: price?.description || parent,
      unit: price?.unit,
      quantity: 1,
      unitPrice: price?.unitPrice || 0,
      totalPrice: price?.unitPrice || 0,
      children: [],
      order: itemMap.size
    }
    itemMap.set(parent, parentItem)
    items.push(parentItem)
  }
  
  if (!itemMap.has(child)) {
    const price = priceMap.get(child)
    const childItem: BudgetItem = {
      id: `item-${child}-${Date.now()}-${Math.random()}`,
      code: child,
      type: itemType,
      description: price?.description || child,
      unit: price?.unit,
      quantity,
      unitPrice: price?.unitPrice || 0,
      totalPrice: (price?.unitPrice || 0) * quantity,
      parentId: parent,
      order: itemMap.size
    }
    itemMap.set(child, childItem)
    
    const parentItem = itemMap.get(parent)
    if (parentItem?.children) {
      parentItem.children.push(childItem)
    }
  }
}

function parseTextRecord(record: BC3Record, itemMap: Map<string, BudgetItem>) {
  if (record.fields.length < 2) return
  
  const [code, description] = record.fields
  const item = itemMap.get(code.trim())
  
  if (item && description) {
    item.description = description.trim()
  }
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
        const content = e.target?.result as string
        const result = parseBC3File(content)
        resolve(result)
      } catch (error) {
        reject(new Error(`Error al parsear archivo BC3: ${error}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsText(file, 'ISO-8859-1')
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
