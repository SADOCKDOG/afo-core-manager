import { 
  Invoice, 
  InvoiceLineItem, 
  InvoiceType,
  VisaApplication,
  ProfessionalCollege,
  PROFESSIONAL_COLLEGE_LABELS 
} from './types'

const STANDARD_TAX_RATE = 21

export function generateInvoiceNumber(type: InvoiceType): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  const prefix = type === 'visa-fee' ? 'VF' : 
                 type === 'professional-fee' ? 'PF' : 
                 type === 'expense' ? 'EX' : 'OT'
  
  return `${prefix}-${year}-${random}-${timestamp.toString().slice(-4)}`
}

export function calculateInvoiceTotals(lineItems: InvoiceLineItem[]): {
  subtotal: number
  taxAmount: number
  total: number
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
  const taxAmount = lineItems.reduce((sum, item) => {
    return sum + (item.totalPrice * item.taxRate / 100)
  }, 0)
  const total = subtotal + taxAmount
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export function generateVisaFeeInvoice(
  visa: VisaApplication,
  projectId: string,
  clientName: string,
  clientNIF: string,
  clientAddress?: string
): Partial<Invoice> {
  const lineItem: InvoiceLineItem = {
    id: Date.now().toString(),
    description: `Tasa de Visado Colegial - ${PROFESSIONAL_COLLEGE_LABELS[visa.college]}`,
    quantity: 1,
    unitPrice: visa.estimatedFee || 0,
    totalPrice: visa.estimatedFee || 0,
    taxRate: STANDARD_TAX_RATE
  }
  
  const totals = calculateInvoiceTotals([lineItem])
  const now = Date.now()
  const dueDate = now + (30 * 24 * 60 * 60 * 1000)
  
  return {
    invoiceNumber: generateInvoiceNumber('visa-fee'),
    type: 'visa-fee',
    projectId,
    visaId: visa.id,
    clientName,
    clientNIF,
    clientAddress,
    status: 'issued',
    lineItems: [lineItem],
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    total: totals.total,
    issuedDate: now,
    dueDate,
    notes: `Factura generada automáticamente por aprobación de visado ${visa.applicationNumber || ''}`,
    createdAt: now,
    updatedAt: now
  }
}

export function getInvoiceStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'issued':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    default:
      return 'bg-amber-100 text-amber-800 border-amber-200'
  }
}

export function isInvoiceOverdue(invoice: Invoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'cancelled') {
    return false
  }
  
  if (!invoice.dueDate) {
    return false
  }
  
  return Date.now() > invoice.dueDate
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function generatePhaseCompletionInvoice(
  projectId: string,
  projectTitle: string,
  phaseData: { phase: string; percentage: number; phaseLabel: string },
  clientName: string,
  clientNIF: string,
  clientAddress?: string,
  projectPEM?: number
): Partial<Invoice> {
  const baseAmount = projectPEM 
    ? (projectPEM * phaseData.percentage / 100)
    : (10000 * phaseData.percentage / 100)
  
  const lineItem: InvoiceLineItem = {
    id: Date.now().toString(),
    description: `${phaseData.phaseLabel} - ${projectTitle}`,
    quantity: 1,
    unitPrice: baseAmount,
    totalPrice: baseAmount,
    taxRate: STANDARD_TAX_RATE,
    phaseId: phaseData.phase
  }
  
  const totals = calculateInvoiceTotals([lineItem])
  const now = Date.now()
  const dueDate = now + (30 * 24 * 60 * 60 * 1000)
  
  return {
    invoiceNumber: generateInvoiceNumber('phase-payment'),
    type: 'phase-payment',
    projectId,
    clientName,
    clientNIF,
    clientAddress,
    status: 'draft',
    lineItems: [lineItem],
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    taxRate: STANDARD_TAX_RATE,
    total: totals.total,
    issuedDate: now,
    dueDate,
    notes: `Factura generada automáticamente al completar la fase: ${phaseData.phaseLabel} (${phaseData.percentage}% del proyecto)`,
    createdAt: now,
    updatedAt: now
  }
}
