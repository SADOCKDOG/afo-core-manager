export type ApprovalStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'cancelled'

export type SignatureStatus = 'pending' | 'signed' | 'rejected'

export type ApprovalFlowType = 'sequential' | 'parallel' | 'unanimous'

export interface SignatureData {
  id: string
  signerId: string
  signerName: string
  signerEmail: string
  signerRole: string
  status: SignatureStatus
  signedAt?: number
  rejectedAt?: number
  rejectionReason?: string
  signatureData?: string
  signatureType?: 'drawn' | 'typed' | 'qualified'
  qualifiedMetadata?: {
    provider?: string
    signatureLevel?: string
    certificateSerialNumber?: string
    certificateIssuer?: string
    timestampToken?: string
    signatureFormat?: string
  }
  ipAddress?: string
  userAgent?: string
}

export interface ApprovalStep {
  id: string
  stepNumber: number
  approverIds: string[]
  approverNames: string[]
  approverEmails: string[]
  approverRoles: string[]
  status: ApprovalStatus
  requiredApprovals: number
  currentApprovals: number
  completedAt?: number
  comments?: string
  signatures: SignatureData[]
}

export interface ApprovalFlowTemplate {
  id: string
  name: string
  description?: string
  documentType: string
  flowType: ApprovalFlowType
  steps: Omit<ApprovalStep, 'id' | 'status' | 'currentApprovals' | 'completedAt' | 'signatures'>[]
  autoNotify: boolean
  reminderDays?: number
  createdAt: number
  updatedAt: number
}

export interface ApprovalFlow {
  id: string
  documentId: string
  documentName: string
  projectId: string
  projectName: string
  templateId?: string
  flowType: ApprovalFlowType
  status: ApprovalStatus
  currentStepNumber: number
  steps: ApprovalStep[]
  initiatedBy: string
  initiatedByName: string
  initiatedAt: number
  completedAt?: number
  cancelledAt?: number
  cancellationReason?: string
  dueDate?: number
  notes?: string
}

export interface ApprovalNotification {
  id: string
  flowId: string
  stepId: string
  recipientId: string
  recipientEmail: string
  type: 'request' | 'reminder' | 'completed' | 'rejected' | 'cancelled'
  sentAt: number
  read: boolean
  readAt?: number
}

export interface ApprovalAction {
  id: string
  flowId: string
  stepId: string
  userId: string
  userName: string
  action: 'approve' | 'reject' | 'request-changes' | 'comment' | 'sign' | 'cancel'
  comments?: string
  timestamp: number
  metadata?: Record<string, any>
}

export interface DigitalCertificate {
  id: string
  userId: string
  userName: string
  certificateType: 'self-signed' | 'qualified' | 'advanced'
  issuer: string
  validFrom: number
  validUntil: number
  fingerprint: string
  publicKey: string
  status: 'active' | 'revoked' | 'expired'
  createdAt: number
}

export interface SignatureRequest {
  id: string
  documentId: string
  flowId?: string
  requestedBy: string
  requestedByName: string
  signerIds: string[]
  signerEmails: string[]
  signerNames: string[]
  message?: string
  dueDate?: number
  requireAllSignatures: boolean
  createdAt: number
  completedAt?: number
  status: 'pending' | 'completed' | 'expired'
}

export interface AuditLogEntry {
  id: string
  entityType: 'approval-flow' | 'signature' | 'document'
  entityId: string
  action: string
  userId: string
  userName: string
  timestamp: number
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
}
