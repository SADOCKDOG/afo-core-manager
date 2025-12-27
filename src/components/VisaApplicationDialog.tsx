import { useState, useEffect } from 'react'
import { VisaApplication, Project, ProfessionalCollege, ProjectPhase, VisaDocumentType, VisaDocument, VisaRequirement, PROFESSIONAL_COLLEGE_LABELS, PHASE_LABELS, VISA_DOCUMENT_TYPE_LABELS } from '@/lib/types'
import {
  generateDefaultRequirements,
  calculateVisaFee,
  getRequiredDocuments,
  checkDocumentCompleteness,
  validateDocument,
  detectDocumentType,
  canSubmitVisa,
  generateApplicationNumber
} from '@/lib/visa-utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FileText, CheckCircle, WarningCircle, Trash, Plus, PaperPlaneTilt, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface VisaApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  visa?: VisaApplication
  project?: Project
  onSave: (visa: Partial<VisaApplication>) => void
}

export function VisaApplicationDialog({ open, onOpenChange, visa, project, onSave }: VisaApplicationDialogProps) {
  const [college, setCollege] = useState<ProfessionalCollege>(visa?.college || 'COAM')
  const [selectedPhases, setSelectedPhases] = useState<ProjectPhase[]>(visa?.phases || [])
  const [documents, setDocuments] = useState<VisaDocument[]>(visa?.documents || [])
  const [requirements, setRequirements] = useState<VisaRequirement[]>(visa?.requirements || [])
  const [notes, setNotes] = useState(visa?.notes || '')
  const [activeTab, setActiveTab] = useState('phases')

  useEffect(() => {
    if (visa) {
      setCollege(visa.college)
      setSelectedPhases(visa.phases)
      setDocuments(visa.documents)
      setRequirements(visa.requirements)
      setNotes(visa.notes || '')
    } else {
      setCollege('COAM')
      setSelectedPhases([])
      setDocuments([])
      setRequirements([])
      setNotes('')
    }
  }, [visa, open])

  useEffect(() => {
    if (selectedPhases.length > 0 && requirements.length === 0) {
      setRequirements(generateDefaultRequirements(selectedPhases))
    }
  }, [selectedPhases])

  const handlePhaseToggle = (phase: ProjectPhase) => {
    setSelectedPhases(prev => 
      prev.includes(phase)
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    )
  }

  const handleAddDocument = () => {
    const mockDoc: VisaDocument = {
      id: Date.now().toString(),
      type: 'memoria-descriptiva',
      name: `documento-${documents.length + 1}.pdf`,
      fileSize: Math.random() * 10 * 1024 * 1024,
      uploadedAt: Date.now(),
      isRequired: true,
      isValid: true,
      validationErrors: []
    }

    const tempVisa: VisaApplication = {
      id: visa?.id || '',
      projectId: project?.id || '',
      college,
      status: 'draft',
      phases: selectedPhases,
      documents: [...documents],
      requirements,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    const validation = validateDocument(mockDoc, tempVisa)
    mockDoc.isValid = validation.isValid
    mockDoc.validationErrors = validation.errors

    setDocuments(prev => [...prev, mockDoc])
    toast.success('Documento simulado añadido')
  }

  const handleDocumentTypeChange = (docId: string, newType: VisaDocumentType) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, type: newType }
          : doc
      )
    )
  }

  const handleRemoveDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId))
    toast.success('Documento eliminado')
  }

  const handleRequirementToggle = (reqId: string) => {
    setRequirements(prev =>
      prev.map(req =>
        req.id === reqId
          ? { ...req, isMet: !req.isMet }
          : req
      )
    )
  }

  const handleSave = () => {
    if (selectedPhases.length === 0) {
      toast.error('Debes seleccionar al menos una fase del proyecto')
      return
    }

    const estimatedFee = calculateVisaFee(college, selectedPhases)

    const visaData: Partial<VisaApplication> = {
      ...(visa?.id && { id: visa.id }),
      projectId: project?.id,
      college,
      phases: selectedPhases,
      documents,
      requirements,
      estimatedFee,
      notes: notes || undefined,
      status: visa?.status || 'draft'
    }

    onSave(visaData)
    toast.success(visa ? 'Solicitud actualizada' : 'Solicitud creada')
    onOpenChange(false)
  }

  const handleSubmit = () => {
    const tempVisa: VisaApplication = {
      id: visa?.id || Date.now().toString(),
      projectId: project?.id || '',
      college,
      status: 'draft',
      phases: selectedPhases,
      documents,
      requirements,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    const submission = canSubmitVisa(tempVisa)

    if (!submission.canSubmit) {
      toast.error('No se puede presentar la solicitud', {
        description: submission.reasons.join('. ')
      })
      return
    }

    const applicationNumber = generateApplicationNumber(college)
    
    const visaData: Partial<VisaApplication> = {
      ...(visa?.id && { id: visa.id }),
      projectId: project?.id,
      college,
      phases: selectedPhases,
      documents,
      requirements,
      estimatedFee: calculateVisaFee(college, selectedPhases),
      notes: notes || undefined,
      status: 'submitted',
      applicationNumber,
      submittedAt: Date.now()
    }

    onSave(visaData)
    toast.success('Solicitud presentada correctamente', {
      description: `Número de expediente: ${applicationNumber}`
    })
    onOpenChange(false)
  }

  const completeness = checkDocumentCompleteness({
    id: '',
    projectId: '',
    college,
    status: 'draft',
    phases: selectedPhases,
    documents,
    requirements,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })

  const allRequirementsMet = requirements.every(req => req.isMet)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {visa ? 'Editar Solicitud de Visado' : 'Nueva Solicitud de Visado'}
          </DialogTitle>
          <DialogDescription>
            Complete la información para tramitar el visado colegial del proyecto
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="phases">Fases</TabsTrigger>
            <TabsTrigger value="documents">
              Documentos
              {documents.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {documents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requirements">
              Requisitos
              {requirements.length > 0 && (
                <Badge 
                  variant={allRequirementsMet ? "default" : "secondary"} 
                  className="ml-2"
                >
                  {requirements.filter(r => r.isMet).length}/{requirements.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="summary">Resumen</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="phases" className="space-y-6 m-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="college">Colegio Profesional</Label>
                  <Select value={college} onValueChange={(v) => setCollege(v as ProfessionalCollege)}>
                    <SelectTrigger id="college">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROFESSIONAL_COLLEGE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Fases del Proyecto a Visar</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(PHASE_LABELS).map(([value, label]) => (
                      <Card
                        key={value}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPhases.includes(value as ProjectPhase)
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handlePhaseToggle(value as ProjectPhase)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedPhases.includes(value as ProjectPhase)}
                            onCheckedChange={() => handlePhaseToggle(value as ProjectPhase)}
                          />
                          <div>
                            <p className="font-medium">{label}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {selectedPhases.length > 0 && (
                  <Alert>
                    <Info size={20} />
                    <AlertDescription>
                      Tasa estimada de visado: <strong>{calculateVisaFee(college, selectedPhases).toFixed(2)}€</strong>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 m-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Documentos Requeridos</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPhases.length === 0 
                        ? 'Selecciona fases para ver documentos requeridos'
                        : `${completeness.completionPercentage}% completado`
                      }
                    </p>
                  </div>
                  <Button onClick={handleAddDocument} variant="outline" size="sm" className="gap-2">
                    <Plus size={16} />
                    Añadir Documento
                  </Button>
                </div>

                {selectedPhases.length > 0 && (
                  <Progress value={completeness.completionPercentage} className="h-2" />
                )}

                {completeness.missingDocuments.length > 0 && (
                  <Alert>
                    <WarningCircle size={20} />
                    <AlertDescription>
                      <p className="font-medium mb-1">Documentos pendientes:</p>
                      <ul className="text-sm list-disc list-inside">
                        {completeness.missingDocuments.map(doc => (
                          <li key={doc}>{VISA_DOCUMENT_TYPE_LABELS[doc]}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  {documents.map(doc => (
                    <Card key={doc.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {doc.isValid ? (
                            <CheckCircle size={24} weight="fill" className="text-green-600" />
                          ) : (
                            <WarningCircle size={24} weight="fill" className="text-destructive" />
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(doc.fileSize / 1024 / 1024).toFixed(2)} MB · {new Date(doc.uploadedAt).toLocaleDateString('es-ES')}
                            </p>
                          </div>

                          <div>
                            <Label className="text-xs">Tipo de documento</Label>
                            <Select 
                              value={doc.type} 
                              onValueChange={(v) => handleDocumentTypeChange(doc.id, v as VisaDocumentType)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(VISA_DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {doc.validationErrors.length > 0 && (
                            <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                              <p className="text-xs font-medium text-destructive mb-1">Errores de validación:</p>
                              <ul className="text-xs text-destructive list-disc list-inside">
                                {doc.validationErrors.map((error, idx) => (
                                  <li key={idx}>{error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(doc.id)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {documents.length === 0 && (
                    <Card className="p-12">
                      <div className="text-center">
                        <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No hay documentos añadidos
                        </p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6 m-0">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Requisitos del Visado</h4>
                  <p className="text-sm text-muted-foreground">
                    Verifica que se cumplen todos los requisitos antes de presentar
                  </p>
                </div>

                <div className="space-y-3">
                  {requirements.map(req => (
                    <Card
                      key={req.id}
                      className={`p-4 cursor-pointer transition-all ${
                        req.isMet ? 'border-green-300 bg-green-50' : ''
                      }`}
                      onClick={() => handleRequirementToggle(req.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={req.isMet}
                          onCheckedChange={() => handleRequirementToggle(req.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{req.description}</p>
                          {req.evidence && (
                            <p className="text-xs text-muted-foreground mt-1">{req.evidence}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {requirements.length === 0 && (
                  <Card className="p-8">
                    <p className="text-sm text-muted-foreground text-center">
                      Selecciona las fases del proyecto para ver los requisitos
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6 m-0">
              <div className="space-y-6">
                <Card className="p-6">
                  <h4 className="font-semibold mb-4">Resumen de la Solicitud</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Colegio</Label>
                      <p className="font-medium">{PROFESSIONAL_COLLEGE_LABELS[college]}</p>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-muted-foreground">Fases seleccionadas</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedPhases.map(phase => (
                          <Badge key={phase} variant="secondary">
                            {PHASE_LABELS[phase]}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Documentos</Label>
                        <p className="text-2xl font-bold">{documents.length}</p>
                        <p className="text-xs text-muted-foreground">
                          {documents.filter(d => d.isValid).length} válidos
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Requisitos</Label>
                        <p className="text-2xl font-bold">
                          {requirements.filter(r => r.isMet).length}/{requirements.length}
                        </p>
                        <p className="text-xs text-muted-foreground">cumplidos</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tasa estimada</Label>
                        <p className="text-2xl font-bold">
                          {calculateVisaFee(college, selectedPhases).toFixed(2)}€
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-muted-foreground">Completitud</Label>
                      <div className="mt-2">
                        <Progress value={completeness.completionPercentage} className="h-3" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {completeness.completionPercentage}% de documentos requeridos
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Observaciones, comentarios internos..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Borrador
          </Button>
          {visa && visa.status !== 'submitted' && (
            <Button 
              onClick={handleSubmit}
              className="gap-2"
              disabled={!completeness.isComplete || !allRequirementsMet}
            >
              <PaperPlaneTilt size={16} weight="fill" />
              Presentar Solicitud
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
