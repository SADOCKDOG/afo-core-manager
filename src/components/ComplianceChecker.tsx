import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  Sparkle,
  FileText,
  Plus,
  ListChecks
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ComplianceCheck } from '@/lib/regulatory-data'
import { performComplianceCheck, generateComplianceReport } from '@/lib/ai-regulatory'
import { Project } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { marked } from 'marked'

interface ComplianceCheckerProps {
  project: Project
}

export function ComplianceChecker({ project }: ComplianceCheckerProps) {
  const [checks, setChecks] = useKV<ComplianceCheck[]>(`compliance-checks-${project.id}`, [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<ComplianceCheck | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [report, setReport] = useState('')
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const handleGenerateChecks = async () => {
    setIsGenerating(true)
    try {
      const projectData = {
        location: project.location,
        buildingType: project.description,
        use: project.title
      }

      const generatedChecks = await performComplianceCheck(projectData)
      
      const checksWithIds: ComplianceCheck[] = generatedChecks.map((check: any) => ({
        id: Date.now().toString() + Math.random(),
        projectId: project.id,
        checkType: 'automatic' as const,
        category: check.category || 'General',
        requirement: check.requirement || check.notes || 'Verificación sin descripción',
        status: 'pending' as const,
        notes: check.notes || `Verificar según ${check.document} ${check.section}`
      }))

      setChecks(currentChecks => [...(currentChecks || []), ...checksWithIds])
      toast.success(`${checksWithIds.length} verificaciones generadas`)
    } catch (error) {
      console.error('Error generating checks:', error)
      toast.error('Error al generar verificaciones')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateCheckStatus = (checkId: string, status: ComplianceCheck['status']) => {
    setChecks(currentChecks =>
      (currentChecks || []).map(check =>
        check.id === checkId
          ? { ...check, status, checkedAt: Date.now() }
          : check
      )
    )
    toast.success('Estado actualizado')
  }

  const handleUpdateCheckNotes = (checkId: string, notes: string, evidence?: string) => {
    setChecks(currentChecks =>
      (currentChecks || []).map(check =>
        check.id === checkId
          ? { ...check, notes, evidence, checkedAt: Date.now() }
          : check
      )
    )
    setEditDialogOpen(false)
    toast.success('Verificación actualizada')
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    setReportDialogOpen(true)
    try {
      const reportContent = await generateComplianceReport(project.title, checks || [])
      setReport(reportContent)
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Error al generar informe')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const allChecks = checks || []
  const filteredChecks = filterStatus === 'all' 
    ? allChecks
    : allChecks.filter(c => c.status === filterStatus)

  const stats = {
    total: allChecks.length,
    compliant: allChecks.filter(c => c.status === 'compliant').length,
    nonCompliant: allChecks.filter(c => c.status === 'non-compliant').length,
    pending: allChecks.filter(c => c.status === 'pending').length,
    notApplicable: allChecks.filter(c => c.status === 'not-applicable').length
  }

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} weight="fill" className="text-green-600" />
      case 'non-compliant':
        return <XCircle size={20} weight="fill" className="text-red-600" />
      case 'pending':
        return <Clock size={20} weight="fill" className="text-yellow-600" />
      case 'not-applicable':
        return <MinusCircle size={20} weight="fill" className="text-gray-400" />
    }
  }

  const getStatusLabel = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant': return 'Conforme'
      case 'non-compliant': return 'No Conforme'
      case 'pending': return 'Pendiente'
      case 'not-applicable': return 'No Aplica'
    }
  }

  const categorizedChecks = filteredChecks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = []
    }
    acc[check.category].push(check)
    return acc
  }, {} as Record<string, ComplianceCheck[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ListChecks size={24} weight="duotone" />
            Verificación de Cumplimiento Normativo
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Checklist automatizado de requisitos normativos aplicables
          </p>
        </div>
        <div className="flex gap-2">
          {allChecks.length > 0 && (
            <Button variant="outline" className="gap-2" onClick={handleGenerateReport}>
              <FileText size={18} weight="duotone" />
              Generar Informe
            </Button>
          )}
          <Button 
            className="gap-2"
            onClick={handleGenerateChecks}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkle size={18} className="animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Plus size={18} weight="bold" />
                Generar Verificaciones IA
              </>
            )}
          </Button>
        </div>
      </div>

      {allChecks.length > 0 && (
        <>
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-700">{stats.compliant}</div>
                <div className="text-xs text-green-600">Conformes</div>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-red-50/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-700">{stats.nonCompliant}</div>
                <div className="text-xs text-red-600">No Conformes</div>
              </CardContent>
            </Card>
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                <div className="text-xs text-yellow-600">Pendientes</div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 bg-gray-50/50">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-700">{stats.notApplicable}</div>
                <div className="text-xs text-gray-600">No Aplican</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="filter-status" className="text-sm">Filtrar:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="filter-status" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas ({stats.total})</SelectItem>
                <SelectItem value="pending">Pendientes ({stats.pending})</SelectItem>
                <SelectItem value="compliant">Conformes ({stats.compliant})</SelectItem>
                <SelectItem value="non-compliant">No Conformes ({stats.nonCompliant})</SelectItem>
                <SelectItem value="not-applicable">No Aplican ({stats.notApplicable})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {Object.entries(categorizedChecks).map(([category, categoryChecks]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-base">{category}</CardTitle>
                  <CardDescription>
                    {categoryChecks.length} verificación{categoryChecks.length !== 1 ? 'es' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryChecks.map((check) => (
                      <motion.div
                        key={check.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 shrink-0 pt-0.5">
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium mb-1">{check.requirement}</p>
                          {check.notes && (
                            <p className="text-xs text-muted-foreground">{check.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Select
                            value={check.status}
                            onValueChange={(value) => handleUpdateCheckStatus(check.id, value as ComplianceCheck['status'])}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="compliant">Conforme</SelectItem>
                              <SelectItem value="non-compliant">No Conforme</SelectItem>
                              <SelectItem value="not-applicable">No Aplica</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCheck(check)
                              setEditDialogOpen(true)
                            }}
                          >
                            Editar
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {allChecks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ListChecks size={64} className="mx-auto mb-4 opacity-20" weight="duotone" />
            <h4 className="text-lg font-semibold mb-2">No hay verificaciones generadas</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Usa la IA para generar un checklist automático basado en los datos del proyecto
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Verificación</DialogTitle>
            <DialogDescription>
              Añade notas y evidencias del cumplimiento
            </DialogDescription>
          </DialogHeader>
          {selectedCheck && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Requisito</Label>
                <p className="text-sm">{selectedCheck.requirement}</p>
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
                  Notas de Verificación
                </Label>
                <Textarea
                  id="notes"
                  defaultValue={selectedCheck.notes}
                  placeholder="Describe cómo se verifica o justifica el cumplimiento..."
                  className="min-h-[100px]"
                  onBlur={(e) => {
                    handleUpdateCheckNotes(selectedCheck.id, e.target.value, selectedCheck.evidence)
                  }}
                />
              </div>
              <div>
                <Label htmlFor="evidence" className="text-sm font-medium mb-2 block">
                  Evidencia / Referencia
                </Label>
                <Textarea
                  id="evidence"
                  defaultValue={selectedCheck.evidence}
                  placeholder="Referencia a planos, cálculos, documentos..."
                  className="min-h-[60px]"
                  onBlur={(e) => {
                    handleUpdateCheckNotes(selectedCheck.id, selectedCheck.notes || '', e.target.value)
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText size={24} weight="duotone" />
              Informe de Cumplimiento Normativo
            </DialogTitle>
            <DialogDescription>
              {project.title}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {isGeneratingReport ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Sparkle size={48} className="mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Generando informe con IA...</p>
                </div>
              </div>
            ) : (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: marked.parse(report) }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
