import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  ApprovalFlow, 
  ApprovalFlowTemplate, 
  ApprovalFlowType 
} from '@/lib/approval-types'
import { Project, Stakeholder, Document } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Users } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createApprovalStep } from '@/lib/approval-utils'

interface CreateApprovalFlowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedProjectId?: string
  preselectedDocumentId?: string
}

interface StepFormData {
  approverIds: string[]
  requiredApprovals: number
}

export function CreateApprovalFlowDialog({ 
  open, 
  onOpenChange,
  preselectedProjectId,
  preselectedDocumentId
}: CreateApprovalFlowDialogProps) {
  const [flows, setFlows] = useKV<ApprovalFlow[]>('approval-flows', [])
  const [projects] = useKV<Project[]>('projects', [])
  const [stakeholders] = useKV<Stakeholder[]>('stakeholders', [])
  const [documents] = useKV<Document[]>('documents', [])
  const [templates] = useKV<ApprovalFlowTemplate[]>('approval-flow-templates', [])

  const [projectId, setProjectId] = useState(preselectedProjectId || '')
  const [documentId, setDocumentId] = useState(preselectedDocumentId || '')
  const [flowType, setFlowType] = useState<ApprovalFlowType>('sequential')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [steps, setSteps] = useState<StepFormData[]>([{ approverIds: [], requiredApprovals: 1 }])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    if (preselectedProjectId) setProjectId(preselectedProjectId)
    if (preselectedDocumentId) setDocumentId(preselectedDocumentId)
  }, [preselectedProjectId, preselectedDocumentId])

  const selectedProject = (projects || []).find(p => p.id === projectId)
  const selectedDocument = (documents || []).find(d => d.id === documentId)
  const projectStakeholders = (stakeholders || []).filter(s => 
    selectedProject?.stakeholders.includes(s.id)
  )

  const handleAddStep = () => {
    setSteps([...steps, { approverIds: [], requiredApprovals: 1 }])
  }

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const handleStepChange = (index: number, field: keyof StepFormData, value: any) => {
    const newSteps = [...steps]
    newSteps[index] = { ...newSteps[index], [field]: value }
    setSteps(newSteps)
  }

  const handleApproverToggle = (stepIndex: number, approverId: string) => {
    const step = steps[stepIndex]
    const newApproverIds = step.approverIds.includes(approverId)
      ? step.approverIds.filter(id => id !== approverId)
      : [...step.approverIds, approverId]
    
    handleStepChange(stepIndex, 'approverIds', newApproverIds)
  }

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId) {
      setSelectedTemplate('')
      return
    }

    const template = (templates || []).find(t => t.id === templateId)
    if (!template) return

    setSelectedTemplate(templateId)
    setFlowType(template.flowType)
    
    const templateSteps: StepFormData[] = template.steps.map(step => ({
      approverIds: step.approverIds,
      requiredApprovals: step.requiredApprovals
    }))
    
    setSteps(templateSteps)
  }

  const handleCreate = () => {
    if (!projectId || !documentId) {
      toast.error('Selecciona un proyecto y documento')
      return
    }

    if (steps.some(step => step.approverIds.length === 0)) {
      toast.error('Cada paso debe tener al menos un aprobador')
      return
    }

    const user = { id: 'current-user', name: 'Usuario Actual' }

    const approvalSteps = steps.map((stepData, index) => {
      const approvers = stepData.approverIds.map(id => 
        projectStakeholders.find(s => s.id === id)
      ).filter(Boolean) as Stakeholder[]

      return createApprovalStep(
        index + 1,
        approvers.map(a => a.id),
        approvers.map(a => a.name),
        approvers.map(a => a.email || ''),
        approvers.map(a => a.type),
        stepData.requiredApprovals
      )
    })

    const newFlow: ApprovalFlow = {
      id: `flow-${Date.now()}`,
      documentId,
      documentName: selectedDocument?.name || 'Documento',
      projectId,
      projectName: selectedProject?.title || 'Proyecto',
      templateId: selectedTemplate || undefined,
      flowType,
      status: 'pending',
      currentStepNumber: 1,
      steps: approvalSteps,
      initiatedBy: user.id,
      initiatedByName: user.name,
      initiatedAt: Date.now(),
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      notes
    }

    setFlows(currentFlows => [...(currentFlows || []), newFlow])
    
    toast.success('Flujo de aprobación creado', {
      description: `${newFlow.steps.length} paso(s) configurado(s)`
    })

    handleReset()
    onOpenChange(false)
  }

  const handleReset = () => {
    if (!preselectedProjectId) setProjectId('')
    if (!preselectedDocumentId) setDocumentId('')
    setFlowType('sequential')
    setDueDate('')
    setNotes('')
    setSteps([{ approverIds: [], requiredApprovals: 1 }])
    setSelectedTemplate('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} weight="bold" />
          Nuevo Flujo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Crear Flujo de Aprobación</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto *</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Selecciona proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {(projects || []).map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Documento *</Label>
                <Select value={documentId} onValueChange={setDocumentId} disabled={!projectId}>
                  <SelectTrigger id="document">
                    <SelectValue placeholder="Selecciona documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {(documents || [])
                      .filter(d => d.projectId === projectId)
                      .map(doc => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(templates || []).length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="template">Plantilla (opcional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Usar plantilla existente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin plantilla</SelectItem>
                    {(templates || []).map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flowType">Tipo de Flujo</Label>
                <Select value={flowType} onValueChange={(v) => setFlowType(v as ApprovalFlowType)}>
                  <SelectTrigger id="flowType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Secuencial</SelectItem>
                    <SelectItem value="parallel">Paralelo</SelectItem>
                    <SelectItem value="unanimous">Unánime</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Fecha Límite (opcional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones adicionales para los aprobadores..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Pasos de Aprobación</Label>
                <Button variant="outline" size="sm" onClick={handleAddStep} className="gap-2">
                  <Plus size={14} weight="bold" />
                  Añadir Paso
                </Button>
              </div>

              {steps.map((step, stepIndex) => (
                <Card key={stepIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Paso {stepIndex + 1}</CardTitle>
                      {steps.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStep(stepIndex)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Aprobadores</Label>
                      <div className="flex flex-wrap gap-2">
                        {projectStakeholders.length > 0 ? (
                          projectStakeholders.map(stakeholder => (
                            <Badge
                              key={stakeholder.id}
                              variant={step.approverIds.includes(stakeholder.id) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleApproverToggle(stepIndex, stakeholder.id)}
                            >
                              {stakeholder.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Selecciona un proyecto con intervinientes
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`required-${stepIndex}`} className="text-xs">
                        Aprobaciones Requeridas
                      </Label>
                      <Input
                        id={`required-${stepIndex}`}
                        type="number"
                        min={1}
                        max={step.approverIds.length || 1}
                        value={step.requiredApprovals}
                        onChange={(e) => handleStepChange(stepIndex, 'requiredApprovals', parseInt(e.target.value))}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>
            Crear Flujo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
