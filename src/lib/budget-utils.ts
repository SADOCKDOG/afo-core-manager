import { Budget, BudgetItem } from './types'

export function calculateBudgetTotals(
  items: BudgetItem[],
  percentageGG: number = 13,
  percentageBI: number = 6,
  percentageIVA: number = 21
): {
  totalPEM: number
  totalGG: number
  totalBI: number
  totalIVA: number
  totalPresupuesto: number
} {
  const totalPEM = items.reduce((sum, item) => {
    if (item.type === 'chapter') {
      return sum + (item.children?.reduce((childSum, child) => 
        childSum + (child.totalPrice || 0), 0) || 0)
    }
    return sum + (item.totalPrice || 0)
  }, 0)

  const totalGG = totalPEM * (percentageGG / 100)
  const totalBI = totalPEM * (percentageBI / 100)
  const baseImponible = totalPEM + totalGG + totalBI
  const totalIVA = baseImponible * (percentageIVA / 100)
  const totalPresupuesto = baseImponible + totalIVA

  return {
    totalPEM,
    totalGG,
    totalBI,
    totalIVA,
    totalPresupuesto
  }
}

export function exportToBC3(budget: Budget, projectName: string): string {
  const lines: string[] = []
  
  lines.push(`~V|FIEBDC-3/2012|ANSI|${projectName}|${budget.version}|||||`)
  lines.push(`~C|${budget.id}|0|${budget.name}|${budget.description || ''}|||${budget.totalPresupuesto.toFixed(2)}|0|`)
  
  const processItem = (item: BudgetItem, parentCode: string = '') => {
    const fullCode = parentCode ? `${parentCode}.${item.code}` : item.code
    
    if (item.type === 'chapter') {
      const chapterTotal = item.children?.reduce((sum, child) => 
        sum + (child.totalPrice || 0), 0) || 0
      lines.push(`~C|${fullCode}|1|${item.description}||||${chapterTotal.toFixed(2)}|0|`)
      
      if (item.children) {
        item.children.forEach(child => processItem(child, fullCode))
      }
    } else if (item.type === 'unit') {
      lines.push(`~C|${fullCode}|2|${item.description}|${item.unit || 'ud'}||${item.unitPrice?.toFixed(2) || '0.00'}|0|`)
      
      if (item.resources && item.resources.length > 0) {
        const decomposition = item.resources.map(res => 
          `${res.code}\\${res.quantity.toFixed(4)}\\${res.unitPrice.toFixed(2)}\\`
        ).join('#')
        lines.push(`~D|${fullCode}|${decomposition}|`)
      }
      
      if (parentCode) {
        lines.push(`~C|${parentCode}|1||||||`)
        lines.push(`~D|${parentCode}|${fullCode}\\${item.quantity || 1}\\${item.unitPrice?.toFixed(2) || '0.00'}\\|`)
      }
    }
  }
  
  budget.items.forEach(item => processItem(item))
  
  lines.push(`~K|\\n\\nPRESUPUESTO DE EJECUCIÓN MATERIAL: ${budget.totalPEM.toFixed(2)} €`)
  lines.push(`~K|Gastos Generales (${budget.percentageGG}%): ${budget.totalGG.toFixed(2)} €`)
  lines.push(`~K|Beneficio Industrial (${budget.percentageBI}%): ${budget.totalBI.toFixed(2)} €`)
  lines.push(`~K|SUMA: ${(budget.totalPEM + budget.totalGG + budget.totalBI).toFixed(2)} €`)
  lines.push(`~K|IVA (${budget.percentageIVA}%): ${budget.totalIVA.toFixed(2)} €`)
  lines.push(`~K|\\nPRESUPUESTO DE EJECUCIÓN POR CONTRATA: ${budget.totalPresupuesto.toFixed(2)} €|`)
  
  return lines.join('\n')
}

export function downloadBC3(budget: Budget, projectName: string): void {
  const bc3Content = exportToBC3(budget, projectName)
  const blob = new Blob([bc3Content], { type: 'text/plain;charset=windows-1252' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${projectName}_${budget.name}_v${budget.version}.bc3`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function generateBudgetCode(parentCode: string | undefined, childIndex: number): string {
  if (!parentCode) {
    return String(childIndex + 1).padStart(2, '0')
  }
  return `${parentCode}.${String(childIndex + 1).padStart(2, '0')}`
}
