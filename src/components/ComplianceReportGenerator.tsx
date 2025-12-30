import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText,
  Download,
  Sparkle,
  CheckCircle,
  XCircle,
  Clock,
  Warning,
  ChartBar,
  PaperPlaneRight
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Project, ComplianceCheck, Stakeholder } from '@/lib/types'
import { marked } from 'marked'
import { motion } from 'framer-motion'
import { ComplianceReportEmailDialog } from './ComplianceReportEmailDialog'

interface ComplianceReportGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  checks: ComplianceCheck[]
  stakeholders?: Stakeholder[]
}

interface ComplianceReport {
  id: string
  projectId: string
  projectTitle: string
  generatedAt: number
  summary: {
    totalChecks: number
    compliant: number
    nonCompliant: number
    pending: number
    notApplicable: number
    completionPercentage: number
  }
  reportContent: string
  recommendations: string[]
  nextSteps: string[]
}

export function ComplianceReportGenerator({
  open,
  onOpenChange,
  project,
  checks,
  stakeholders = []
}: ComplianceReportGeneratorProps) {
  const [reports, setReports] = useKV<ComplianceReport[]>('compliance-reports', [])
  const [currentReport, setCurrentReport] = useState<ComplianceReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'history'>('preview')
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)

  const projectReports = (reports || []).filter(r => r.projectId === project.id)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const reportContent = await generateDetailedComplianceReport(project, checks)
      
      const summary = {
        totalChecks: checks.length,
        compliant: checks.filter(c => c.status === 'compliant').length,
        nonCompliant: checks.filter(c => c.status === 'non-compliant').length,
        pending: checks.filter(c => c.status === 'pending').length,
        notApplicable: checks.filter(c => c.status === 'not-applicable').length,
        completionPercentage: Math.round(
          (checks.filter(c => c.status !== 'pending').length / checks.length) * 100
        )
      }

      const recommendations = extractRecommendations(checks)
      const nextSteps = generateNextSteps(checks)

      const newReport: ComplianceReport = {
        id: Date.now().toString(),
        projectId: project.id,
        projectTitle: project.title,
        generatedAt: Date.now(),
        summary,
        reportContent,
        recommendations,
        nextSteps
      }

      setCurrentReport(newReport)
      setReports(currentReports => [...(currentReports || []), newReport])
      setActiveTab('preview')
      
      toast.success('Informe de cumplimiento generado correctamente')
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Error al generar el informe')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = (report: ComplianceReport) => {
    const reportText = formatReportForDownload(report)
    const blob = new Blob([reportText], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Informe_Cumplimiento_${project.title.replace(/\s+/g, '_')}_${new Date(report.generatedAt).toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Informe descargado')
  }

  const handleViewReport = (report: ComplianceReport) => {
    setCurrentReport(report)
    setActiveTab('preview')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={24} weight="duotone" />
            Generador de Informes de Cumplimiento
          </DialogTitle>
          <DialogDescription>
            Genera informes profesionales de cumplimiento normativo para el proyecto {project.title}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="preview">Vista Previa</TabsTrigger>
              <TabsTrigger value="history">Historial ({projectReports.length})</TabsTrigger>
            </TabsList>
            
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || checks.length === 0}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkle size={18} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkle size={18} weight="duotone" />
                  Generar Nuevo Informe
                </>
              )}
            </Button>
          </div>

          <TabsContent value="preview" className="mt-0">
            {currentReport ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Resumen Ejecutivo</CardTitle>
                        <CardDescription>
                          Generado el {new Date(currentReport.generatedAt).toLocaleString('es-ES')}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => setEmailDialogOpen(true)}
                        >
                          <PaperPlaneRight size={16} />
                          Enviar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownloadReport(currentReport)}
                        >
                          <Download size={16} />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Card className="border-green-200 bg-green-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle size={20} weight="fill" className="text-green-600" />
                            <span className="text-sm font-medium text-green-700">Conformes</span>
                          </div>
                          <div className="text-2xl font-bold text-green-700">
                            {currentReport.summary.compliant}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-red-200 bg-red-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle size={20} weight="fill" className="text-red-600" />
                            <span className="text-sm font-medium text-red-700">No Conformes</span>
                          </div>
                          <div className="text-2xl font-bold text-red-700">
                            {currentReport.summary.nonCompliant}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-yellow-200 bg-yellow-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={20} weight="fill" className="text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-700">Pendientes</span>
                          </div>
                          <div className="text-2xl font-bold text-yellow-700">
                            {currentReport.summary.pending}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <ChartBar size={20} className="text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">Progreso de Verificación</span>
                          <span className="text-muted-foreground">
                            {currentReport.summary.completionPercentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentReport.summary.completionPercentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {currentReport.recommendations.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Warning size={20} weight="duotone" className="text-yellow-600" />
                        Recomendaciones Prioritarias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentReport.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-yellow-600 shrink-0">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Informe Completo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: marked(currentReport.reportContent)
                        }}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>

                {currentReport.nextSteps.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Próximos Pasos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {currentReport.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <Badge variant="outline" className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center p-0">
                              {idx + 1}
                            </Badge>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText size={64} className="text-muted-foreground mb-4" weight="duotone" />
                <h3 className="text-lg font-semibold mb-2">No hay informe generado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Genera un nuevo informe de cumplimiento para visualizarlo aquí
                </p>
                {checks.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Primero debes generar verificaciones de cumplimiento
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <ScrollArea className="h-[600px]">
              {projectReports.length > 0 ? (
                <div className="space-y-3">
                  {projectReports
                    .sort((a, b) => b.generatedAt - a.generatedAt)
                    .map((report) => (
                      <Card key={report.id} className="hover:bg-muted/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText size={20} weight="duotone" className="text-primary shrink-0" />
                                <h4 className="font-semibold text-sm truncate">
                                  Informe de Cumplimiento - {report.projectTitle}
                                </h4>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">
                                {new Date(report.generatedAt).toLocaleString('es-ES')}
                              </p>
                              <div className="grid grid-cols-4 gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <CheckCircle size={14} className="text-green-600" />
                                  <span>{report.summary.compliant} conformes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <XCircle size={14} className="text-red-600" />
                                  <span>{report.summary.nonCompliant} no conformes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} className="text-yellow-600" />
                                  <span>{report.summary.pending} pendientes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ChartBar size={14} className="text-primary" />
                                  <span>{report.summary.completionPercentage}% completado</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleViewReport(report)}
                              >
                                <FileText size={14} />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownloadReport(report)}
                              >
                                <Download size={14} />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText size={64} className="text-muted-foreground mb-4" weight="duotone" />
                  <h3 className="text-lg font-semibold mb-2">Sin historial de informes</h3>
                  <p className="text-sm text-muted-foreground">
                    Los informes generados aparecerán aquí
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {currentReport && (
        <ComplianceReportEmailDialog
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          report={currentReport}
          project={project}
          stakeholders={stakeholders}
        />
      )}
    </Dialog>
  )
}

async function generateDetailedComplianceReport(
  project: Project,
  checks: ComplianceCheck[]
): Promise<string> {
  const categorizedChecks = checks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = []
    }
    acc[check.category].push(check)
    return acc
  }, {} as Record<string, ComplianceCheck[]>)

  const promptText = `Genera un informe profesional de cumplimiento normativo para el proyecto "${project.title}".

DATOS DEL PROYECTO:
- Título: ${project.title}
- Ubicación: ${project.location}
- Descripción: ${project.description || 'No especificada'}

VERIFICACIONES REALIZADAS:
Total: ${checks.length}
Conformes: ${checks.filter(c => c.status === 'compliant').length}
No conformes: ${checks.filter(c => c.status === 'non-compliant').length}
Pendientes: ${checks.filter(c => c.status === 'pending').length}
No aplicables: ${checks.filter(c => c.status === 'not-applicable').length}

DETALLE POR CATEGORÍA:
${Object.entries(categorizedChecks).map(([category, categoryChecks]) => `
${category}:
${categoryChecks.map(check => `  - [${check.status.toUpperCase()}] ${check.requirement}
    Referencia: ${check.regulatoryReference || 'Sin referencia'}
    ${check.notes ? `Notas: ${check.notes}` : ''}
    ${check.evidence ? `Evidencia: ${check.evidence}` : ''}`).join('\n')}
`).join('\n')}

INSTRUCCIONES:
Genera un informe en formato Markdown con la siguiente estructura:

# Informe de Cumplimiento Normativo
## ${project.title}

### 1. Resumen Ejecutivo
- Breve descripción del proyecto
- Estado general de cumplimiento
- Conclusión sobre la viabilidad normativa

### 2. Análisis por Categoría Normativa
Para cada categoría:
- Estado de cumplimiento
- Requisitos verificados
- Observaciones relevantes

### 3. No Conformidades Detectadas
Lista detallada de verificaciones no conformes con:
- Descripción del requisito incumplido
- Normativa aplicable
- Impacto en el proyecto (alto/medio/bajo)
- Recomendaciones para subsanar

### 4. Verificaciones Pendientes
Lista de verificaciones que requieren atención

### 5. Conclusiones y Recomendaciones
- Valoración global
- Riesgos identificados
- Plan de acción recomendado

El informe debe ser profesional, técnico pero claro, y orientado a la toma de decisiones.`

  const prompt = spark.llmPrompt([promptText], promptText)
  const result = await spark.llm(prompt, 'gpt-4o', false)
  return result
}

function extractRecommendations(checks: ComplianceCheck[]): string[] {
  const nonCompliant = checks.filter(c => c.status === 'non-compliant')
  const highPriority = nonCompliant.filter(c => c.priority === 'high')
  
  const recommendations: string[] = []
  
  if (highPriority.length > 0) {
    recommendations.push(`Atender ${highPriority.length} no conformidades de prioridad alta de forma inmediata`)
  }
  
  if (nonCompliant.length > 0) {
    recommendations.push(`Subsanar ${nonCompliant.length} no conformidades antes de presentar documentación`)
  }
  
  const pending = checks.filter(c => c.status === 'pending')
  if (pending.length > 0) {
    recommendations.push(`Completar verificación de ${pending.length} requisitos pendientes`)
  }
  
  const categoriesWithIssues = new Set(
    nonCompliant.map(c => c.category)
  )
  
  if (categoriesWithIssues.size > 0) {
    recommendations.push(`Revisar en detalle: ${Array.from(categoriesWithIssues).join(', ')}`)
  }
  
  return recommendations.slice(0, 5)
}

function generateNextSteps(checks: ComplianceCheck[]): string[] {
  const steps: string[] = []
  
  const pending = checks.filter(c => c.status === 'pending')
  if (pending.length > 0) {
    steps.push(`Completar verificación de ${pending.length} requisitos pendientes`)
  }
  
  const nonCompliant = checks.filter(c => c.status === 'non-compliant')
  if (nonCompliant.length > 0) {
    steps.push(`Elaborar plan de subsanación para ${nonCompliant.length} no conformidades`)
  }
  
  const highPriority = checks.filter(c => c.status === 'non-compliant' && c.priority === 'high')
  if (highPriority.length > 0) {
    steps.push(`Priorizar resolución de ${highPriority.length} incumplimientos críticos`)
  }
  
  steps.push('Documentar evidencias de cumplimiento para todas las verificaciones conformes')
  steps.push('Actualizar documentación del proyecto con las correcciones realizadas')
  steps.push('Programar revisión de cumplimiento antes de presentación a visado')
  
  return steps
}

function formatReportForDownload(report: ComplianceReport): string {
  return `# Informe de Cumplimiento Normativo
## ${report.projectTitle}

**Fecha de generación:** ${new Date(report.generatedAt).toLocaleString('es-ES')}

---

## Resumen Ejecutivo

- **Total de verificaciones:** ${report.summary.totalChecks}
- **Verificaciones conformes:** ${report.summary.compliant}
- **Verificaciones no conformes:** ${report.summary.nonCompliant}
- **Verificaciones pendientes:** ${report.summary.pending}
- **Verificaciones no aplicables:** ${report.summary.notApplicable}
- **Progreso de verificación:** ${report.summary.completionPercentage}%

---

${report.reportContent}

---

## Recomendaciones Prioritarias

${report.recommendations.map((rec, idx) => `${idx + 1}. ${rec}`).join('\n')}

---

## Próximos Pasos

${report.nextSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

---

*Informe generado automáticamente por AFO CORE MANAGER*
`
}
