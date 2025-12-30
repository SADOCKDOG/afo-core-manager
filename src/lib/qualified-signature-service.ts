import {
  QualifiedSignatureRequest,
  QualifiedSignatureStatus,
  QualifiedSignatureProviderType,
  QualifiedSignatureLevel,
  QualifiedSignatureAudit,
  ClaveAuthMethod,
  ClaveAuthSession,
  ViafirmaSignatureJob,
  OtpVerification,
  QualifiedSignatureMetadata
} from './qualified-signature-types'
import { toast } from 'sonner'

export async function generateDocumentHash(documentContent: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(documentContent)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return btoa(documentContent).substring(0, 64)
  }
}

export function createQualifiedSignatureRequest(
  documentId: string,
  documentName: string,
  documentHash: string,
  projectId: string,
  projectName: string,
  provider: QualifiedSignatureProviderType,
  signerId: string,
  signerName: string,
  signerEmail: string,
  signatureLevel: QualifiedSignatureLevel = 'qualified',
  authMethod?: ClaveAuthMethod
): QualifiedSignatureRequest {
  const now = Date.now()
  const expiresAt = now + (7 * 24 * 60 * 60 * 1000)

  return {
    id: `qsig-${now}-${Math.random().toString(36).substr(2, 9)}`,
    documentId,
    documentName,
    documentHash,
    projectId,
    projectName,
    provider,
    signatureLevel,
    signerId,
    signerName,
    signerEmail,
    status: 'pending',
    authMethod,
    otpRequired: provider === 'clave',
    createdAt: now,
    expiresAt
  }
}

export async function initiateClaveSignature(
  request: QualifiedSignatureRequest,
  authMethod: ClaveAuthMethod
): Promise<{ success: boolean; sessionId?: string; authUrl?: string; error?: string }> {
  try {
    const sessionId = `clave-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const samlRequest = generateSAMLRequest(
      request.signerNif || request.signerEmail,
      authMethod,
      request.documentHash
    )

    const session: ClaveAuthSession = {
      id: sessionId,
      requestId: request.id,
      samlRequest,
      relayState: btoa(JSON.stringify({ requestId: request.id, documentId: request.documentId })),
      authMethod,
      returnUrl: `${window.location.origin}/signature-callback`,
      createdAt: Date.now(),
      expiresAt: Date.now() + (15 * 60 * 1000),
      status: 'pending'
    }

    await spark.kv.set(`clave-session-${sessionId}`, session)

    const authUrl = buildClaveAuthUrl(session)

    return {
      success: true,
      sessionId,
      authUrl
    }
  } catch (error) {
    console.error('Error initiating Cl@ve signature:', error)
    return {
      success: false,
      error: 'Error al iniciar firma con Cl@ve. Inténtalo de nuevo.'
    }
  }
}

export async function initiateViafirmaSignature(
  request: QualifiedSignatureRequest,
  apiKey: string,
  apiSecret: string,
  workflowId?: string
): Promise<{ success: boolean; jobId?: string; signatureUrl?: string; error?: string }> {
  try {
    const jobId = `viafirma-job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const job: ViafirmaSignatureJob = {
      id: jobId,
      requestId: request.id,
      workflowId: workflowId || 'default-signature-workflow',
      documentId: request.documentId,
      signerEmail: request.signerEmail,
      status: 'created',
      notificationUrl: `${window.location.origin}/api/viafirma-webhook`,
      expirationDate: request.expiresAt,
      createdAt: Date.now()
    }

    await spark.kv.set(`viafirma-job-${jobId}`, job)

    const signatureUrl = `https://viafirma-demo.viafirma.com/sign/${jobId}`

    toast.info('Solicitud de firma enviada', {
      description: 'Recibirás un email con el enlace de firma'
    })

    return {
      success: true,
      jobId,
      signatureUrl
    }
  } catch (error) {
    console.error('Error initiating Viafirma signature:', error)
    return {
      success: false,
      error: 'Error al iniciar firma con Viafirma. Inténtalo de nuevo.'
    }
  }
}

function generateSAMLRequest(
  identifier: string,
  authMethod: ClaveAuthMethod,
  documentHash: string
): string {
  const timestamp = new Date().toISOString()
  const requestId = `_${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  const samlTemplate = `
    <samlp:AuthnRequest
      xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
      xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
      ID="${requestId}"
      Version="2.0"
      IssueInstant="${timestamp}"
      Destination="https://clave.gob.es/ServiceProvider"
      AssertionConsumerServiceURL="${window.location.origin}/signature-callback"
      ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
      <saml:Issuer>AFO-CORE-MANAGER</saml:Issuer>
      <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" AllowCreate="true"/>
      <samlp:RequestedAuthnContext Comparison="exact">
        <saml:AuthnContextClassRef>${getAuthContextRef(authMethod)}</saml:AuthnContextClassRef>
      </samlp:RequestedAuthnContext>
    </samlp:AuthnRequest>
  `.trim()

  return btoa(samlTemplate)
}

function getAuthContextRef(authMethod: ClaveAuthMethod): string {
  switch (authMethod) {
    case 'clave-pin':
      return 'urn:oasis:names:tc:SAML:2.0:ac:classes:Password'
    case 'clave-permanente':
      return 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
    case 'dni-electronico':
      return 'urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI'
    case 'certificado-digital':
      return 'urn:oasis:names:tc:SAML:2.0:ac:classes:X509'
    default:
      return 'urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified'
  }
}

function buildClaveAuthUrl(session: ClaveAuthSession): string {
  const baseUrl = 'https://clave.gob.es/servicios/login'
  const params = new URLSearchParams({
    SAMLRequest: session.samlRequest,
    RelayState: session.relayState
  })
  
  return `${baseUrl}?${params.toString()}`
}

export async function generateOtp(
  requestId: string,
  phone: string
): Promise<{ success: boolean; expiresIn?: number; error?: string }> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const now = Date.now()
    const expiresAt = now + (5 * 60 * 1000)

    const otp: OtpVerification = {
      requestId,
      code,
      sentAt: now,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      verified: false
    }

    await spark.kv.set(`otp-${requestId}`, otp)

    console.log(`OTP para ${phone}: ${code}`)

    toast.success('Código de verificación enviado', {
      description: `Se ha enviado un SMS al ${phone.substring(phone.length - 4)}`
    })

    return {
      success: true,
      expiresIn: 300
    }
  } catch (error) {
    console.error('Error generating OTP:', error)
    return {
      success: false,
      error: 'Error al enviar código de verificación'
    }
  }
}

export async function verifyOtp(
  requestId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const otp = await spark.kv.get<OtpVerification>(`otp-${requestId}`)

    if (!otp) {
      return { success: false, error: 'Código no encontrado o expirado' }
    }

    if (Date.now() > otp.expiresAt) {
      return { success: false, error: 'Código expirado' }
    }

    if (otp.attempts >= otp.maxAttempts) {
      return { success: false, error: 'Máximo de intentos alcanzado' }
    }

    otp.attempts += 1

    if (otp.code !== code) {
      await spark.kv.set(`otp-${requestId}`, otp)
      return { 
        success: false, 
        error: `Código incorrecto (${otp.maxAttempts - otp.attempts} intentos restantes)` 
      }
    }

    otp.verified = true
    otp.verifiedAt = Date.now()
    await spark.kv.set(`otp-${requestId}`, otp)

    return { success: true }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      success: false,
      error: 'Error al verificar código'
    }
  }
}

export function createAuditLog(
  requestId: string,
  action: QualifiedSignatureAudit['action'],
  userId: string,
  userName: string,
  details: Record<string, any>,
  provider?: QualifiedSignatureProviderType,
  errorMessage?: string
): QualifiedSignatureAudit {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requestId,
    action,
    userId,
    userName,
    timestamp: Date.now(),
    ipAddress: 'client-ip',
    userAgent: navigator.userAgent,
    details,
    provider,
    errorMessage
  }
}

export function getSignatureStatusLabel(status: QualifiedSignatureStatus): string {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'awaiting-otp': return 'Esperando OTP'
    case 'signing': return 'Firmando'
    case 'signed': return 'Firmado'
    case 'rejected': return 'Rechazado'
    case 'failed': return 'Fallido'
    case 'expired': return 'Expirado'
    case 'cancelled': return 'Cancelado'
  }
}

export function getSignatureStatusColor(status: QualifiedSignatureStatus): string {
  switch (status) {
    case 'signed': return 'text-green-500'
    case 'rejected':
    case 'failed': return 'text-red-500'
    case 'signing':
    case 'awaiting-otp': return 'text-blue-500'
    case 'expired':
    case 'cancelled': return 'text-gray-500'
    default: return 'text-yellow-500'
  }
}

export function getProviderLabel(provider: QualifiedSignatureProviderType): string {
  switch (provider) {
    case 'clave': return 'Cl@ve'
    case 'viafirma': return 'ViafirmaPro'
    case 'internal': return 'Firma Interna'
  }
}

export function getSignatureLevelLabel(level: QualifiedSignatureLevel): string {
  switch (level) {
    case 'simple': return 'Firma Simple'
    case 'advanced': return 'Firma Avanzada'
    case 'qualified': return 'Firma Cualificada'
  }
}

export function getAuthMethodLabel(method: ClaveAuthMethod): string {
  switch (method) {
    case 'clave-pin': return 'Cl@ve PIN'
    case 'clave-permanente': return 'Cl@ve Permanente'
    case 'dni-electronico': return 'DNI Electrónico'
    case 'certificado-digital': return 'Certificado Digital'
  }
}

export function isSignatureExpired(request: QualifiedSignatureRequest): boolean {
  if (!request.expiresAt) return false
  return Date.now() > request.expiresAt
}

export function getTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now()
  if (remaining <= 0) return 'Expirado'
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export async function simulateQualifiedSignature(
  request: QualifiedSignatureRequest,
  signatureData: string
): Promise<{ success: boolean; metadata?: QualifiedSignatureMetadata; error?: string }> {
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const metadata: QualifiedSignatureMetadata = {
      signatureFormat: request.provider === 'clave' ? 'XAdES' : 'PAdES',
      signatureAlgorithm: 'RSA-SHA256',
      timestampToken: `TS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      certificateSerialNumber: `SN-${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
      certificateIssuer: 'CN=FNMT Clase 2 CA, O=FNMT-RCM, C=ES',
      certificateSubject: `CN=${request.signerName}, serialNumber=${request.signerNif || 'DEMO'}, C=ES`,
      certificateValidFrom: Date.now() - (365 * 24 * 60 * 60 * 1000),
      certificateValidTo: Date.now() + (3 * 365 * 24 * 60 * 60 * 1000),
      signatureValue: btoa(signatureData).substring(0, 128),
      signerReason: 'Firma del documento',
      contactInfo: request.signerEmail
    }

    return {
      success: true,
      metadata
    }
  } catch (error) {
    console.error('Error simulating signature:', error)
    return {
      success: false,
      error: 'Error al simular firma'
    }
  }
}
