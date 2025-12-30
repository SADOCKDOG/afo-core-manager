import { BudgetItem, BudgetPrice, BudgetItemType, UnitType } from './types'

  prices: BudgetPrice[]
    title?: string
  prices: BudgetPrice[]
  metadata: {
    title?: string
    author?: string
  }
    totalItems: number
    chapters: number
    materials: numb
   
}
export interface BC3Re
  fields: string[]

  const lines = c
    return trimmed &&
  
  
   
 

    }
  
    throw new Erro
 

  const itemMap = new Map<string, BudgetItem>()
  const metadata: BC3ParseResult['metadata'] = {}
  for (const record of records) {
  
          parseVersionRecord(
        case 'K':
          break
          parsePriceRecord(
        case 'T':
          break
          parseDecompositionRecord(r
     
   
  
  applyTextsToItems(itemMap, tex
  
  
  
    items: rootItems,
    metadata,
  

  items: BudgetItem[],
  itemMap: Map<
  const allItems = Array.from(itemMap.values
  return {
    totalPrices
    units: allItems.filter(i => i.type === 
    labor: pr
  }

  if (record.
    metadata.fo
}
function pars
  const value =
  if (!field || !value) return
  const field
  swi
   
  
    case 'AUTHOR':
      break
  
      break
  
      metadata.description = value
  

  record: BC3Record, 
  priceMap:
  if (record.
  const code =
  
 

  
  if (typeStr === '0')
  else if (typeStr === '
  if (!priceMap.has(code)) {
      id: `bc3-price-${code}-${Da
      description: code,
  
      last
      category: getCategoryFromT
    
    priceMap.set(code, price)
}
function parseTextRecord(
  textMap: Map<string, string>
  if (record.fields.length < 2) return
  c
 

}
function parseDecompositionRecord
  itemMap: Map<string, BudgetItem>,
) {
  
 

  const quantityStr = record.fields[2]?.replace(',', '.') || '1'
  const typeStr = record.fields[8]?.trim() || 
  
  
  else if (typeCode === 2) ite
  
  if (!itemMap.has(parentCode)) {
  
      code: parentCode,
      descriptio
      quantity: 1,
      totalPrice: parentPric
      order
    itemMap.set(p
  
  const childId = `item-${chi
  const chi
    code: childCo
    description:
    quantity: isNaN(quantit
    totalPr
    order: itemMap.siz
  
  if (parentItem?.child
    
      (sum,
   
}

  textMap: Map<string, str
  for (const [code, i
    if (text) {
    }
}
function applyTextsToPrices(
  
  for (const price of prices) {
    if (text) {
  
}
function getCategoryFromType(type: 'material' | 'labor' | 'ma
    'material': 'Materiales',
  
  }
}
function normalizeUnit(unit: string): UnitType {
  
    'm': 'm',
    'm2': 'm2',
  
    'ud': 'ud',
    'un': 'ud',
    'kgs': 'kg',
    'lt': '
    'hr': 'h',
  }
  return unitMap[normalized] || 'ud'

  return new Promise((resolve,
    
      try {
     
    
          content = de
          const decoder = new
   
 

        
        
          reject(new Error('No
   
        resolve(result)
  
      }
    
  
    
  })

 

      valid: false, 
    }
  
    return { 
   
  }
  
      valid: false, 
    }
  
}
ex
  const sizeKB = (file.size / 1024).toFixed(2)
  
}

















































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
  if (!file.name.toLowerCase().endsWith('.bc3')) {
    return { valid: false, error: 'El archivo debe tener extensión .bc3' }
  }
  
  if (file.size > 50 * 1024 * 1024) {
    return { valid: false, error: 'El archivo no puede superar los 50 MB' }
  }
  
  return { valid: true }
}
