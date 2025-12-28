import { FinanceItem } from '../types'

export const mockFinance: FinanceItem[] = [
    { id: 'f-001', projectId: 'p-001', concept: 'Factura Fase Básico', amount: 4200, status: 'paid' },
    { id: 'f-002', projectId: 'p-001', concept: 'Certificación obra enero', amount: 6100, status: 'pending' },
    { id: 'f-003', projectId: 'p-002', concept: 'Anticipo proyecto básico', amount: 2500, status: 'pending' }
]
