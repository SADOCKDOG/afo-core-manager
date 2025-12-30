import { 
  ApprovalFlow, 
  ApprovalStep, 
  ApprovalStatus, 
  SignatureData,
  ApprovalAction,
  AuditLogEntry 
} from './approval-types'

export function createApprovalStep(
  stepNumber: number,
  approverIds: string[],
  approverNames: string[],
  approverEmails: string[],
  approverRoles: string[],
  requiredApprovals: number = 1
): ApprovalStep {
  return {
    id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    stepNumber,
    approverIds,
    approverNames,
    approverEmails,
    approverRoles,
    status: 'pending',
    requiredApprovals: Math.min(requiredApprovals, approverIds.length),
    currentApprovals: 0,
    signatures: approverIds.map((id, idx) => ({
      id: `sig-${Date.now()}-${idx}`,
      signerId: id,
      signerName: approverNames[idx],
      signerEmail: approverEmails[idx],
      signerRole: approverRoles[idx],
      status: 'pending'
    }))
  }
}

export function updateFlowStatus(flow: ApprovalFlow): ApprovalFlow {
  const allStepsCompleted = flow.steps.every(step => step.status === 'approved')
  const anyStepRejected = flow.steps.some(step => step.status === 'rejected')
  const anyStepCancelled = flow.steps.some(step => step.status === 'cancelled')

  let newStatus: ApprovalStatus = flow.status
  
  if (anyStepCancelled) {
    newStatus = 'cancelled'
  } else if (anyStepRejected) {
    newStatus = 'rejected'
  } else if (allStepsCompleted) {
    newStatus = 'approved'
  } else {
    const currentStep = flow.steps.find(s => s.stepNumber === flow.currentStepNumber)
    if (currentStep && currentStep.currentApprovals > 0) {
      newStatus = 'in-review'
    }
  }

  return {
    ...flow,
    status: newStatus,
    completedAt: (newStatus === 'approved' || newStatus === 'rejected') ? Date.now() : flow.completedAt
  }
}

export function approveStep(
  flow: ApprovalFlow,
  stepId: string,
  approverId: string,
  approverName: string,
  comments?: string,
  signatureData?: string
): ApprovalFlow {
  const updatedSteps = flow.steps.map(step => {
    if (step.id !== stepId) return step

    const updatedSignatures = step.signatures.map(sig => {
      if (sig.signerId === approverId && sig.status === 'pending') {
        return {
          ...sig,
          status: 'signed' as const,
          signedAt: Date.now(),
          signatureData,
          ipAddress: 'client-generated',
          userAgent: navigator.userAgent
        }
      }
      return sig
    })

    const newApprovals = step.currentApprovals + 1
    const isStepComplete = newApprovals >= step.requiredApprovals

    return {
      ...step,
      signatures: updatedSignatures,
      currentApprovals: newApprovals,
      status: isStepComplete ? ('approved' as ApprovalStatus) : step.status,
      completedAt: isStepComplete ? Date.now() : undefined,
      comments: comments ? `${step.comments || ''}\n[${approverName}]: ${comments}`.trim() : step.comments
    }
  })

  let updatedFlow = { ...flow, steps: updatedSteps }

  const currentStep = updatedSteps.find(s => s.id === stepId)
  if (currentStep?.status === 'approved' && flow.flowType === 'sequential') {
    const nextStep = updatedSteps.find(s => s.stepNumber === currentStep.stepNumber + 1)
    if (nextStep) {
      updatedFlow.currentStepNumber = nextStep.stepNumber
    }
  }

  return updateFlowStatus(updatedFlow)
}

export function rejectStep(
  flow: ApprovalFlow,
  stepId: string,
  approverId: string,
  approverName: string,
  reason: string
): ApprovalFlow {
  const updatedSteps = flow.steps.map(step => {
    if (step.id !== stepId) return step

    const updatedSignatures = step.signatures.map(sig => {
      if (sig.signerId === approverId && sig.status === 'pending') {
        return {
          ...sig,
          status: 'rejected' as const,
          rejectedAt: Date.now(),
          rejectionReason: reason,
          ipAddress: 'client-generated',
          userAgent: navigator.userAgent
        }
      }
      return sig
    })

    return {
      ...step,
      signatures: updatedSignatures,
      status: 'rejected' as ApprovalStatus,
      completedAt: Date.now(),
      comments: `${step.comments || ''}\n[${approverName} - RECHAZADO]: ${reason}`.trim()
    }
  })

  const updatedFlow = { ...flow, steps: updatedSteps }
  return updateFlowStatus(updatedFlow)
}

export function cancelApprovalFlow(
  flow: ApprovalFlow,
  userId: string,
  userName: string,
  reason: string
): ApprovalFlow {
  return {
    ...flow,
    status: 'cancelled',
    cancelledAt: Date.now(),
    cancellationReason: `Cancelado por ${userName}: ${reason}`
  }
}

export function getActiveApprovers(flow: ApprovalFlow): string[] {
  if (flow.status !== 'pending' && flow.status !== 'in-review') {
    return []
  }

  if (flow.flowType === 'sequential') {
    const currentStep = flow.steps.find(s => s.stepNumber === flow.currentStepNumber)
    if (!currentStep || currentStep.status === 'approved') return []
    
    return currentStep.approverIds.filter((id, idx) => 
      currentStep.signatures[idx]?.status === 'pending'
    )
  }

  return flow.steps
    .filter(step => step.status === 'pending' || step.status === 'in-review')
    .flatMap(step => 
      step.approverIds.filter((id, idx) => 
        step.signatures[idx]?.status === 'pending'
      )
    )
}

export function canUserApprove(flow: ApprovalFlow, userId: string): boolean {
  const activeApprovers = getActiveApprovers(flow)
  return activeApprovers.includes(userId)
}

export function getApprovalProgress(flow: ApprovalFlow): {
  totalSteps: number
  completedSteps: number
  percentage: number
  totalSignatures: number
  completedSignatures: number
} {
  const totalSteps = flow.steps.length
  const completedSteps = flow.steps.filter(s => s.status === 'approved').length
  
  const totalSignatures = flow.steps.reduce((sum, step) => sum + step.signatures.length, 0)
  const completedSignatures = flow.steps.reduce((sum, step) => 
    sum + step.signatures.filter(sig => sig.status === 'signed').length, 0
  )

  return {
    totalSteps,
    completedSteps,
    percentage: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    totalSignatures,
    completedSignatures
  }
}

export function generateSignatureHash(
  documentId: string,
  signerId: string,
  timestamp: number
): string {
  const data = `${documentId}:${signerId}:${timestamp}`
  return btoa(data)
}

export function createAuditLog(
  entityType: 'approval-flow' | 'signature' | 'document',
  entityId: string,
  action: string,
  userId: string,
  userName: string,
  details: Record<string, any>
): AuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entityType,
    entityId,
    action,
    userId,
    userName,
    timestamp: Date.now(),
    details,
    ipAddress: 'client-generated',
    userAgent: navigator.userAgent
  }
}

export function validateApprovalFlow(flow: ApprovalFlow): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!flow.documentId) errors.push('El flujo debe estar asociado a un documento')
  if (!flow.projectId) errors.push('El flujo debe estar asociado a un proyecto')
  if (flow.steps.length === 0) errors.push('El flujo debe tener al menos un paso')
  
  flow.steps.forEach((step, idx) => {
    if (step.approverIds.length === 0) {
      errors.push(`El paso ${idx + 1} debe tener al menos un aprobador`)
    }
    if (step.requiredApprovals > step.approverIds.length) {
      errors.push(`El paso ${idx + 1} requiere más aprobaciones que aprobadores disponibles`)
    }
    if (step.requiredApprovals < 1) {
      errors.push(`El paso ${idx + 1} debe requerir al menos 1 aprobación`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

export function formatFlowDuration(startTime: number, endTime?: number): string {
  const end = endTime || Date.now()
  const duration = end - startTime
  
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function isFlowOverdue(flow: ApprovalFlow): boolean {
  if (!flow.dueDate) return false
  return Date.now() > flow.dueDate && flow.status === 'pending'
}

export function getFlowStatusColor(status: ApprovalStatus): string {
  switch (status) {
    case 'approved': return 'text-green-500'
    case 'rejected': return 'text-red-500'
    case 'in-review': return 'text-blue-500'
    case 'cancelled': return 'text-gray-500'
    default: return 'text-yellow-500'
  }
}

export function getFlowStatusBadge(status: ApprovalStatus): string {
  switch (status) {
    case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/30'
    case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30'
    case 'in-review': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    case 'cancelled': return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
    default: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
  }
}

export function getFlowStatusLabel(status: ApprovalStatus): string {
  switch (status) {
    case 'pending': return 'Pendiente'
    case 'in-review': return 'En Revisión'
    case 'approved': return 'Aprobado'
    case 'rejected': return 'Rechazado'
    case 'cancelled': return 'Cancelado'
  }
}
