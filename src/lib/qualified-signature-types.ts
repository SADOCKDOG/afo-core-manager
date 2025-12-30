export type QualifiedSignatureProviderType = 'clave' | 'viafirma' | 'internal'

export type QualifiedSignatureStatus = 
  | 'pending'
  | 'awaiting-otp'
  | 'signing'
  | 'signed'
  | 'rejected'
  | 'failed'
  | 'expired'
  | 'cancelled'

export type QualifiedSignatureLevel = 
  | 'simple'
  | 'advanced'
  | 'qualified'

export type ClaveAuthMethod = 
  | 'clave-pin'
  | 'clave-permanente'
  | 'dni-electronico'
  | 'certificado-digital'

export interface QualifiedSignatureProvider {
  id: string
  name: string
  type: QualifiedSignatureProviderType
  enabled: boolean
  config: ClaveProviderConfig | ViafirmaProviderConfig
  testMode: boolean
  createdAt: number
  updatedAt: number
}

export interface ClaveProviderConfig {
  type: 'clave'
  entityId: string
  metadataUrl: string
  assertionConsumerServiceUrl: string
  singleLogoutServiceUrl: string
  signatureAlgorithm: 'SHA256' | 'SHA512'
  certificatePath?: string
  privateKeyPath?: string
  validateCertificates: boolean
}

export interface ViafirmaProviderConfig {
  type: 'viafirma'
  apiKey: string
  apiSecret: string
  endpointUrl: string
  workflowId?: string
  certificateAlias?: string
  signatureFormat: 'PAdES' | 'XAdES' | 'CAdES'
  signatureLevel: 'B' | 'T' | 'LT' | 'LTA'
  timestampEnabled: boolean
}

export interface QualifiedSignatureRequest {
  id: string
  flowId?: string
  documentId: string
  documentName: string
  documentHash: string
  projectId: string
  projectName: string
  provider: QualifiedSignatureProviderType
  signatureLevel: QualifiedSignatureLevel
  signerId: string
  signerName: string
  signerEmail: string
  signerNif?: string
  signerPhone?: string
  status: QualifiedSignatureStatus
  authMethod?: ClaveAuthMethod
  otpRequired: boolean
  otpSentAt?: number
  otpVerified?: boolean
  signatureMetadata?: QualifiedSignatureMetadata
  externalRequestId?: string
  externalSignatureId?: string
  callbackUrl?: string
  redirectUrl?: string
  createdAt: number
  initiatedAt?: number
  signedAt?: number
  expiresAt?: number
  cancelledAt?: number
  errorMessage?: string
}

export interface QualifiedSignatureMetadata {
  signatureFormat: string
  signatureAlgorithm: string
  timestampToken?: string
  certificateChain?: string[]
  certificateSerialNumber?: string
  certificateIssuer?: string
  certificateSubject?: string
  certificateValidFrom?: number
  certificateValidTo?: number
  signatureValue?: string
  signerLocation?: string
  signerReason?: string
  contactInfo?: string
  pdfSignatureField?: string
  signaturePage?: number
  signaturePosition?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ClaveAuthSession {
  id: string
  requestId: string
  samlRequest: string
  relayState: string
  authMethod: ClaveAuthMethod
  returnUrl: string
  createdAt: number
  expiresAt: number
  status: 'pending' | 'authenticated' | 'failed' | 'expired'
  samlResponse?: string
  attributes?: Record<string, string>
  errorCode?: string
  errorMessage?: string
}

export interface ViafirmaSignatureJob {
  id: string
  requestId: string
  workflowId: string
  documentId: string
  signerEmail: string
  status: 'created' | 'sent' | 'viewed' | 'signed' | 'rejected' | 'expired'
  notificationUrl?: string
  expirationDate?: number
  createdAt: number
  completedAt?: number
  signedDocumentUrl?: string
  auditTrailUrl?: string
  errorMessage?: string
}

export interface QualifiedSignatureAudit {
  id: string
  requestId: string
  action: 'created' | 'initiated' | 'otp-sent' | 'otp-verified' | 'signed' | 'rejected' | 'cancelled' | 'expired' | 'error'
  userId?: string
  userName?: string
  timestamp: number
  ipAddress?: string
  userAgent?: string
  details: Record<string, any>
  provider?: QualifiedSignatureProviderType
  errorMessage?: string
}

export interface SignatureCertificateInfo {
  serialNumber: string
  issuer: string
  subject: string
  validFrom: number
  validTo: number
  publicKey: string
  algorithm: string
  fingerprint: string
  keyUsage: string[]
  extendedKeyUsage: string[]
  subjectAlternativeNames?: string[]
  crlDistributionPoints?: string[]
  ocspUrl?: string
}

export interface QualifiedSignatureConfig {
  enabledProviders: QualifiedSignatureProviderType[]
  defaultProvider?: QualifiedSignatureProviderType
  requireOtp: boolean
  otpExpirationMinutes: number
  signatureExpirationDays: number
  allowSimpleSignatureFallback: boolean
  enableAuditTrail: boolean
  enableTimestamp: boolean
  pdfSignatureVisible: boolean
  pdfSignaturePosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'custom'
}

export interface OtpVerification {
  requestId: string
  code: string
  sentAt: number
  expiresAt: number
  attempts: number
  maxAttempts: number
  verified: boolean
  verifiedAt?: number
}

export interface SignatureValidationResult {
  valid: boolean
  signatureLevel: QualifiedSignatureLevel
  signerCertificate: SignatureCertificateInfo
  signatureTime: number
  timestampValid?: boolean
  certificateChainValid: boolean
  revocationChecked: boolean
  revoked: boolean
  errors: string[]
  warnings: string[]
  validationTime: number
}
