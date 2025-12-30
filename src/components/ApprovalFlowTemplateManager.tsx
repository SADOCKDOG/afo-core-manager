import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { ApprovalFlowTemplate, ApprovalFlowType } from '@/lib/approval-types'
import { Stakeholder } from '@/lib/types'
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
import { 
  Plus, 
  Trash, 
  ListChecks, 
  PencilSimple,
  Copy
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface StepFormData {
  approverIds: string[]
  approverNames: string[]
  approverEmails: string[]
  approverRoles: string[]
  requiredApprovals: number
}

export function ApprovalFlowTemplateManager() {
  const [templates, setTemplates] = useKV<ApprovalFlowTemplate[]>('approval-flow-templates', [])
  const [stakeholders] = useKV<Stakeholder[]>('stakeholders', [])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ApprovalFlowTemplate | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [flowType, setFlowType] = useState<ApprovalFlowType>('sequential')
  const [steps, setSteps] = useState<StepFormData[]>([
    { approverIds: [], approverNames: [], approverEmails: [], approverRoles: [], requiredApprovals: 1 }
  ])

  const handleAddStep = () => {
    setSteps([...steps, { 
      approverIds: [], 
      approverNames: [], 
      approverEmails: [], 
      approverRoles: [], 
      requiredApprovals: 1 
    }])
  }

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const handleApproverToggle = (stepIndex: number, stakeholder: Stakeholder) => {
    const step = steps[stepIndex]
    const existingIndex = step.approverIds.indexOf(stakeholder.id)
    
    if (existingIndex >= 0) {
      setSteps(steps.map((s, i) => {
        if (i !== stepIndex) return s
        return {
          ...s,
          approverIds: s.approverIds.filter((_, idx) => idx !== existingIndex),
          approverNames: s.approverNames.filter((_, idx) => idx !== existingIndex),
          approverEmails: s.approverEmails.filter((_, idx) => idx !== existingIndex),
          approverRoles: s.approverRoles.filter((_, idx) => idx !== existingIndex)
        }
      }))
    } else {
      setSteps(steps.map((s, i) => {
        if (i !== stepIndex) return s
        return {
          ...s,
          approverIds: [...s.approverIds, stakeholder.id],
          approverNames: [...s.approverNames, stakeholder.name],
          approverEmails: [...s.approverEmails, stakeholder.email || ''],
          approverRoles: [...s.approverRoles, stakeholder.type]
        }
      }))
    }
  }

  const handleSave = () => {
    if (!name.trim() || !documentType.trim()) {
      toast.error('Completa los campos requeridos')
      return
    }

    if (steps.some(step => step.approverIds.length === 0)) {
      toast.error('Cada paso debe tener al menos un aprobador')
      return
    }

    const templateData: ApprovalFlowTemplate = {
      id: editingTemplate?.id || `template-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      documentType: documentType.trim(),
      flowType,
      steps: steps.map((step, index) => ({
        stepNumber: index + 1,
        approverIds: step.approverIds,
        approverNames: step.approverNames,
        approverEmails: step.approverEmails,
        approverRoles: step.approverRoles,
        requiredApprovals: step.requiredApprovals
      })),
      autoNotify: true,
      createdAt: editingTemplate?.createdAt || Date.now(),
      updatedAt: Date.now()
    }

    if (editingTemplate) {
      setTemplates(current => 
        (current || []).map(t => t.id === templateData.id ? templateData : t)
      )
      toast.success('Plantilla actualizada')
    } else {
      setTemplates(current => [...(current || []), templateData])
      toast.success('Plantilla creada')
    }

    handleReset()
  }

  const handleEdit = (template: ApprovalFlowTemplate) => {
    setEditingTemplate(template)
    setName(template.name)
    setDescription(template.description || '')
    setDocumentType(template.documentType)
    setFlowType(template.flowType)
    setSteps(template.steps.map(step => ({
      approverIds: step.approverIds,
      approverNames: step.approverNames,
      approverEmails: step.approverEmails,
      approverRoles: step.approverRoles,
      requiredApprovals: step.requiredApprovals
    })))
    setCreateDialogOpen(true)
  }

  const handleDuplicate = (template: ApprovalFlowTemplate) => {
    const duplicated: ApprovalFlowTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    setTemplates(current => [...(current || []), duplicated])
    toast.success('Plantilla duplicada')
  }

  const handleDelete = (templateId: string) => {
    setTemplates(current => (current || []).filter(t => t.id !== templateId))
    toast.success('Plantilla eliminada')
  }

  const handleReset = () => {
    setName('')
    setDescription('')
    setDocumentType('')
    setFlowType('sequential')
    setSteps([{ approverIds: [], approverNames: [], approverEmails: [], approverRoles: [], requiredApprovals: 1 }])
    setEditingTemplate(null)
    setCreateDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={createDialogOpen} onOpenChange={(open) => {
          setCreateDialogOpen(open)
          if (!open) handleReset()
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus size={14} weight="bold" />
              Nueva Plantilla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Plantilla' : 'Crear Plantilla'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Aprobación de Planos"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documentType">Tipo de Documento *</Label>
                  <Input
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="Ej: Planos, Memoria..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el propósito de esta plantilla..."
                  rows={2}
                />
              </div>

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
                        <Label className="text-xs">Roles de Aprobadores</Label>
                        <div className="flex flex-wrap gap-2">
                          {(stakeholders || []).length > 0 ? (
                            (stakeholders || []).map(stakeholder => (
                              <Badge
                                key={stakeholder.id}
                                variant={step.approverIds.includes(stakeholder.id) ? 'default' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => handleApproverToggle(stepIndex, stakeholder)}
                              >
                                {stakeholder.name}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No hay intervinientes. Añade algunos primero.
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
                          onChange={(e) => {
                            const newSteps = [...steps]
                            newSteps[stepIndex].requiredApprovals = parseInt(e.target.value) || 1
                            setSteps(newSteps)
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingTemplate ? 'Actualizar' : 'Crear'} Plantilla
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {(templates || []).length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ListChecks size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
          <p className="text-muted-foreground">No hay plantillas creadas</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crea plantillas para reutilizar flujos de aprobación
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(templates || []).map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(template)}
                      className="h-8 w-8 p-0"
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline">{template.documentType}</Badge>
                  <span className="text-muted-foreground">
                    {template.flowType === 'sequential' ? 'Secuencial' :
                     template.flowType === 'parallel' ? 'Paralelo' :
                     'Unánime'}
                  </span>
                  <span className="text-muted-foreground">
                    {template.steps.length} paso(s)
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
