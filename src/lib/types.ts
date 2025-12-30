export type ProjectPhase = 
  | 'estudio-previo'
  | 'anteproyecto'
  | 'basico'
  | 'ejecucion'
  | 'direccion-obra'

export type PhaseStatus = 'pending' | 'in-progress' | 'completed'

export type ProjectStatus = 'active' | 'archived' | 'on-hold'

export type StakeholderType = 'promotor' | 'architect' | 'technician'

export interface ProjectPhaseData {
  phase: ProjectPhase
  percentage: number
  status: PhaseStatus
}

export interface Stakeholder {
  id: string
  type: StakeholderType
  nif: string
  name: string
  address?: string
  email?: string
  phone?: string
  collegiateNumber?: string
  qualification?: string
  apellido1?: string
  apellido2?: string
  razonSocial?: string
  representante?: string
}

export type FolderStructureType = 'by-type' | 'screaming-architecture'

export type DocumentType = 
  | 'plano'
  | 'memoria'
  | 'presupuesto'
  | 'imagen'
  | 'administrativo'
  | 'modelo'
  | 'instalaciones'
  | 'detalles-constructivos'
  | 'otros'

export type DocumentStatus = 
  | 'draft'
  | 'shared'
  | 'approved'

export interface DocumentVersion {
  id: string
  version: string
  fileName: string
  fileSize: number
  uploadedAt: number
  uploadedBy: string
  status: DocumentStatus
  notes?: string
}

export interface Document {
  id: string
  projectId: string
  name: string
  type: DocumentType
  folder: string
  currentVersion: string
  versions: DocumentVersion[]
  createdAt: number
  updatedAt: number
  metadata: {
    discipline?: string
    description?: string
    format?: string
    application?: string
  }
}

export interface FolderStructure {
  id: string
  projectId: string
  type: FolderStructureType
  folders: string[]
  createdAt: number
}

export interface Project {
  id: string
  title: string
  description?: string
  location: string
  status: ProjectStatus
  phases: ProjectPhaseData[]
  stakeholders: string[]
  clientId?: string
  folderStructure?: FolderStructureType
  createdAt: number
  updatedAt: number
}

export const PHASE_LABELS: Record<ProjectPhase, string> = {
  'estudio-previo': 'Estudio Previo',
  'anteproyecto': 'Anteproyecto',
  'basico': 'Proyecto Básico',
  'ejecucion': 'Proyecto de Ejecución',
  'direccion-obra': 'Dirección de Obra'
}

export const STAKEHOLDER_TYPE_LABELS: Record<StakeholderType, string> = {
  'promotor': 'Promotor',
  'architect': 'Arquitecto',
  'technician': 'Técnico'
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  'plano': 'Planos',
  'memoria': 'Memorias',
  'presupuesto': 'Presupuestos',
  'imagen': 'Imágenes',
  'administrativo': 'Administrativo',
  'modelo': 'Modelos 3D',
  'instalaciones': 'Instalaciones',
  'detalles-constructivos': 'Detalles Constructivos',
  'otros': 'Otros'
}

export const FOLDER_STRUCTURES: Record<FolderStructureType, { name: string; folders: string[] }> = {
  'by-type': {
    name: 'Por Tipo de Archivo',
    folders: [
      '01_Planos',
      '02_Memorias',
      '03_Presupuestos',
      '04_Imágenes',
      '05_Administrativo',
      '06_Modelos_3D',
      '07_Instalaciones',
      '08_Otros'
    ]
  },
  'screaming-architecture': {
    name: 'Arquitectura de Gritos',
    folders: [
      'Componentes',
      'Servicios',
      'Modelos',
      'Documentación',
      'Administrativo',
      'Presentación',
      'Referencias'
    ]
  }
}

export type TemplateCategory = 
  | 'memoria'
  | 'planos'
  | 'administrativo'
  | 'presupuesto'
  | 'calculo'

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  type: DocumentType
  discipline?: string
  sections: TemplateSection[]
  requiredFields: string[]
  folder?: string
}

export interface TemplateSection {
  id: string
  title: string
  content: string
  order: number
  required: boolean
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, string> = {
  'memoria': 'Memorias',
  'planos': 'Planos',
  'administrativo': 'Administrativo',
  'presupuesto': 'Presupuestos y Mediciones',
  'calculo': 'Cálculos y Justificaciones'
}

export type RegulatoryCode = 
  | 'cte'
  | 'rite'
  | 'rebt'
  | 'costas'
  | 'urbanismo'
  | 'ehe'

export interface ComplianceCheck {
  id: string
  projectId: string
  checkType: 'automatic' | 'manual'
  category: string
  requirement: string
  regulatoryReference?: string
  status: 'compliant' | 'non-compliant' | 'pending' | 'not-applicable'
  evidence?: string
  notes?: string
  checkedAt?: number
  checkedBy?: string
  priority?: 'high' | 'medium' | 'low'
}

export type BuildingType = 
  | 'vivienda-unifamiliar'
  | 'vivienda-colectiva'
  | 'vivienda-plurifamiliar'
  | 'rehabilitacion'
  | 'ampliacion'

export type BuildingUse = 
  | 'residencial-vivienda'
  | 'residencial-publico'
  | 'administrativo'
  | 'sanitario'
  | 'docente'
  | 'comercial'
  | 'aparcamiento'

export interface ComplianceChecklist {
  id: string
  projectId: string
  buildingType: BuildingType
  buildingUse: BuildingUse
  buildingSurface?: number
  buildingHeight?: number
  occupancyLoad?: number
  climateZone?: string
  municipalityId?: string
  checks: ComplianceCheck[]
  generatedAt: number
  lastUpdated: number
  completionPercentage: number
}

export interface ComplianceCategory {
  id: string
  name: string
  description: string
  code: RegulatoryCode
  priority: 'high' | 'medium' | 'low'
}

export interface ArchitectProfile {
  id: string
  nombreCompleto: string
  nif: string
  razonSocial?: string
  direccion?: string
  codigoPostal?: string
  localidad?: string
  provincia?: string
  telefono?: string
  email?: string
  numeroColegial?: string
  colegioOficial?: string
  titulacion?: string
  logo?: string
  web?: string
  iban?: string
  createdAt: number
  updatedAt: number
}

export type UnitType = 
  | 'm'
  | 'm2'
  | 'm3'
  | 'ud'
  | 'kg'
  | 'l'
  | 'h'
  | 'pa'

export type BudgetItemType = 
  | 'chapter'
  | 'unit'
  | 'material'
  | 'labor'
  | 'machinery'

export interface BudgetPrice {
  id: string
  code: string
  description: string
  unit: UnitType
  unitPrice: number
  type: 'material' | 'labor' | 'machinery' | 'unit'
  category?: string
  subcategory?: string
  lastUpdated: number
  source?: string
}

export interface BudgetItem {
  id: string
  code: string
  type: BudgetItemType
  description: string
  unit?: UnitType
  quantity?: number
  unitPrice?: number
  totalPrice?: number
  parentId?: string
  children?: BudgetItem[]
  resources?: BudgetResource[]
  order: number
}

export interface BudgetResource {
  id: string
  priceId: string
  code: string
  description: string
  type: 'material' | 'labor' | 'machinery'
  unit: UnitType
  quantity: number
  unitPrice: number
  totalPrice: number
  yield?: number
}

export interface Budget {
  id: string
  projectId: string
  name: string
  description?: string
  version: string
  items: BudgetItem[]
  totalPEM: number
  totalGG: number
  totalBI: number
  totalIVA: number
  totalPresupuesto: number
  percentageGG: number
  percentageBI: number
  percentageIVA: number
  createdAt: number
  updatedAt: number
  status: 'draft' | 'approved' | 'archived'
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  'm': 'Metro lineal',
  'm2': 'Metro cuadrado',
  'm3': 'Metro cúbico',
  'ud': 'Unidad',
  'kg': 'Kilogramo',
  'l': 'Litro',
  'h': 'Hora',
  'pa': 'Partida alzada'
}

export const BUDGET_ITEM_TYPE_LABELS: Record<BudgetItemType, string> = {
  'chapter': 'Capítulo',
  'unit': 'Unidad de obra',
  'material': 'Material',
  'labor': 'Mano de obra',
  'machinery': 'Maquinaria'
}

export type ProfessionalCollege = 'COAM' | 'COACM' | 'COAG' | 'OTHER'

export type VisaStatus = 
  | 'draft'
  | 'pending-submission'
  | 'submitted'
  | 'under-review'
  | 'required'
  | 'pending-payment'
  | 'pending-pickup'
  | 'approved'
  | 'rejected'

export type VisaDocumentType = 
  | 'memoria-descriptiva'
  | 'memoria-constructiva'
  | 'pliego-condiciones'
  | 'presupuesto'
  | 'planos-situacion'
  | 'planos-arquitectonicos'
  | 'planos-estructuras'
  | 'planos-instalaciones'
  | 'estudio-seguridad'
  | 'estudio-gestion-residuos'
  | 'eficiencia-energetica'
  | 'anexo-calculo'
  | 'otro'

export interface VisaDocument {
  id: string
  type: VisaDocumentType
  name: string
  fileSize: number
  uploadedAt: number
  isRequired: boolean
  isValid: boolean
  validationErrors: string[]
  documentId?: string
}

export interface VisaValidationRule {
  id: string
  name: string
  description: string
  validator: (doc: VisaDocument, visa: VisaApplication) => { isValid: boolean; errors: string[] }
  applicableDocumentTypes: VisaDocumentType[]
}

export interface VisaRequirement {
  id: string
  description: string
  isMet: boolean
  evidence?: string
  notes?: string
}

export interface VisaApplication {
  id: string
  projectId: string
  college: ProfessionalCollege
  status: VisaStatus
  applicationNumber?: string
  submittedAt?: number
  phases: ProjectPhase[]
  documents: VisaDocument[]
  requirements: VisaRequirement[]
  estimatedFee?: number
  paymentReference?: string
  rejectionReasons?: string[]
  notes?: string
  createdAt: number
  updatedAt: number
}

export const PROFESSIONAL_COLLEGE_LABELS: Record<ProfessionalCollege, string> = {
  'COAM': 'Colegio Oficial de Arquitectos de Madrid',
  'COACM': 'Colegio Oficial de Arquitectos de Castilla-La Mancha',
  'COAG': 'Colexio Oficial de Arquitectos de Galicia',
  'OTHER': 'Otro Colegio'
}

export const VISA_STATUS_LABELS: Record<VisaStatus, string> = {
  'draft': 'Borrador',
  'pending-submission': 'Pendiente de Presentación',
  'submitted': 'Presentado',
  'under-review': 'En Revisión',
  'required': 'Requerido',
  'pending-payment': 'Pendiente de Pago',
  'pending-pickup': 'Pendiente de Retirar',
  'approved': 'Visado Concedido',
  'rejected': 'Rechazado'
}

export const VISA_DOCUMENT_TYPE_LABELS: Record<VisaDocumentType, string> = {
  'memoria-descriptiva': 'Memoria Descriptiva',
  'memoria-constructiva': 'Memoria Constructiva',
  'pliego-condiciones': 'Pliego de Condiciones',
  'presupuesto': 'Presupuesto',
  'planos-situacion': 'Planos de Situación',
  'planos-arquitectonicos': 'Planos Arquitectónicos',
  'planos-estructuras': 'Planos de Estructuras',
  'planos-instalaciones': 'Planos de Instalaciones',
  'estudio-seguridad': 'Estudio de Seguridad y Salud',
  'estudio-gestion-residuos': 'Estudio de Gestión de Residuos',
  'eficiencia-energetica': 'Certificado de Eficiencia Energética',
  'anexo-calculo': 'Anexo de Cálculo',
  'otro': 'Otro Documento'
}

export type PaymentTerms = 
  | 'immediate'
  | '15-days'
  | '30-days'
  | '60-days'
  | '90-days'
  | 'custom'

export interface Client {
  id: string
  type: 'persona-fisica' | 'persona-juridica'
  nif: string
  nombre?: string
  apellido1?: string
  apellido2?: string
  razonSocial?: string
  direccion?: string
  email?: string
  telefono?: string
  representante?: string
  notas?: string
  customTaxRate?: number
  paymentTerms?: PaymentTerms
  customPaymentDays?: number
  earlyPaymentDiscount?: number
  createdAt: number
  updatedAt: number
}

export const PAYMENT_TERMS_LABELS: Record<PaymentTerms, string> = {
  'immediate': 'Inmediato',
  '15-days': '15 días',
  '30-days': '30 días',
  '60-days': '60 días',
  '90-days': '90 días',
  'custom': 'Personalizado'
}

export type PaymentMethod = 'transferencia' | 'efectivo' | 'tarjeta' | 'cheque' | 'otros'

export type InvoiceType = 'visa-fee' | 'professional-fee' | 'expense' | 'phase-payment' | 'other'

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  taxRate: number
  phaseId?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  type: InvoiceType
  projectId?: string
  clientId?: string
  visaId?: string
  clientName: string
  clientNIF: string
  clientAddress?: string
  status: InvoiceStatus
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxAmount: number
  taxRate: number
  total: number
  issuedDate?: number
  dueDate?: number
  paidDate?: number
  paymentMethod?: PaymentMethod
  notes?: string
  createdAt: number
  updatedAt: number
}

export interface PaymentReminder {
  id: string
  invoiceId: string
  sentAt: number
  method: 'email' | 'manual'
  status: 'sent' | 'failed'
}

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  'visa-fee': 'Tasa de Visado Colegial',
  'professional-fee': 'Honorarios Profesionales',
  'phase-payment': 'Pago por Fase de Proyecto',
  'expense': 'Gasto Reembolsable',
  'other': 'Otro'
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  'draft': 'Borrador',
  'issued': 'Emitida',
  'paid': 'Pagada',
  'overdue': 'Vencida',
  'cancelled': 'Anulada'
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  'transferencia': 'Transferencia Bancaria',
  'efectivo': 'Efectivo',
  'tarjeta': 'Tarjeta',
  'cheque': 'Cheque',
  'otros': 'Otros'
}

export type MilestoneType = 
  | 'phase-deadline'
  | 'visa-submission'
  | 'permit-submission'
  | 'payment-due'
  | 'meeting'
  | 'site-visit'
  | 'construction-start'
  | 'construction-end'
  | 'custom'

export type MilestonePriority = 'low' | 'medium' | 'high' | 'critical'

export interface ProjectMilestone {
  id: string
  projectId: string
  title: string
  description?: string
  type: MilestoneType
  date: number
  priority: MilestonePriority
  status: 'pending' | 'completed' | 'overdue' | 'cancelled'
  relatedPhase?: ProjectPhase
  relatedInvoiceId?: string
  relatedVisaId?: string
  completedAt?: number
  createdAt: number
  updatedAt: number
}

export const MILESTONE_TYPE_LABELS: Record<MilestoneType, string> = {
  'phase-deadline': 'Plazo de Fase',
  'visa-submission': 'Presentación de Visado',
  'permit-submission': 'Presentación de Licencia',
  'payment-due': 'Vencimiento de Pago',
  'meeting': 'Reunión',
  'site-visit': 'Visita de Obra',
  'construction-start': 'Inicio de Obra',
  'construction-end': 'Fin de Obra',
  'custom': 'Personalizado'
}

export const MILESTONE_PRIORITY_LABELS: Record<MilestonePriority, string> = {
  'low': 'Baja',
  'medium': 'Media',
  'high': 'Alta',
  'critical': 'Crítica'
}
