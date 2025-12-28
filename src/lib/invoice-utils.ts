import { 
  Invoice, 
  InvoiceLineItem, 
  InvoiceType,
  VisaApplication,
  ProfessionalCollege,
  PROFESSIONAL_COLLEGE_LABELS,
  Client,
  PaymentTerms
} from './types'

const STANDARD_TAX_RATE = 21

export function getClientTaxRate(client?: Client): number {
  if (client?.customTaxRate !== undefined) {
    return client.customTaxRate
  }
  return STANDARD_TAX_RATE
}

export function getClientPaymentDays(client?: Client): number {
  if (!client?.paymentTerms) return 30
  
  switch (client.paymentTerms) {
    case 'immediate':
      return 0
    case '15-days':
      return 15
    case '30-days':
      return 30
    case '60-days':
      return 60
    case '90-days':
      return 90
    case 'custom':
      return client.customPaymentDays || 30
    default:
      return 30
  }
}

export function calculateDueDate(issuedDate: number, paymentDays: number): number {
  return issuedDate + (paymentDays * 24 * 60 * 60 * 1000)
}

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
  clientAddress?: string,
  client?: Client
): Partial<Invoice> {
  const taxRate = getClientTaxRate(client)
  const paymentDays = getClientPaymentDays(client)
  
  const lineItem: InvoiceLineItem = {
    id: Date.now().toString(),
    description: `Tasa de Visado Colegial - ${PROFESSIONAL_COLLEGE_LABELS[visa.college]}`,
    quantity: 1,
    unitPrice: visa.estimatedFee || 0,
    totalPrice: visa.estimatedFee || 0,
    taxRate
  }
  
  const totals = calculateInvoiceTotals([lineItem])
  const now = Date.now()
  const dueDate = calculateDueDate(now, paymentDays)
  
  let notes = `Factura generada automáticamente por aprobación de visado ${visa.applicationNumber || ''}`
  if (client?.earlyPaymentDiscount && client.earlyPaymentDiscount > 0) {
    notes += `\n\nDescuento por pronto pago: ${client.earlyPaymentDiscount}% si se paga antes del vencimiento.`
  }
  
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
    taxRate,
    total: totals.total,
    issuedDate: now,
    dueDate,
    notes,
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
  projectPEM?: number,
  client?: Client
): Partial<Invoice> {
  const taxRate = getClientTaxRate(client)
  const paymentDays = getClientPaymentDays(client)
  
  const baseAmount = projectPEM 
    ? (projectPEM * phaseData.percentage / 100)
    : (10000 * phaseData.percentage / 100)
  
  const lineItem: InvoiceLineItem = {
    id: Date.now().toString(),
    description: `${phaseData.phaseLabel} - ${projectTitle}`,
    quantity: 1,
    unitPrice: baseAmount,
    totalPrice: baseAmount,
    taxRate,
    phaseId: phaseData.phase
  }
  
  const totals = calculateInvoiceTotals([lineItem])
  const now = Date.now()
  const dueDate = calculateDueDate(now, paymentDays)
  
  let notes = `Factura generada automáticamente al completar la fase: ${phaseData.phaseLabel} (${phaseData.percentage}% del proyecto)`
  if (client?.earlyPaymentDiscount && client.earlyPaymentDiscount > 0) {
    notes += `\n\nDescuento por pronto pago: ${client.earlyPaymentDiscount}% si se paga antes del vencimiento.`
  }
  
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
    taxRate,
    total: totals.total,
    issuedDate: now,
    dueDate,
    notes,
    createdAt: now,
    updatedAt: now
  }
}
