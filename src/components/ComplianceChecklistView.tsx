import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { ComplianceChecklist, ComplianceCheck, Project } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ComplianceGeneratorDialog } from './ComplianceGeneratorDialog'
import { MunicipalComplianceManager } from './MunicipalComplianceManager'
import { generateComplianceChecksForProject, COMPLIANCE_CATEGORIES } from '@/lib/compliance-data'
import { Municipality, EXAMPLE_MUNICIPALITIES, getMunicipalRequirementsForProject } from '@/lib/municipal-compliance'
import { 
  CheckCircle, 
  Circle, 
  XCircle, 
  Clock, 
  Warning,
  Sparkle,
  MagnifyingGlass,
  FunnelSimple,
  Download,
  ArrowLeft,
  MapPin
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface ComplianceChecklistViewProps {
  project: Project
  onBack: () => void
}

export function ComplianceChecklistView({ project, onBack }: ComplianceChecklistViewProps) {
  const [checklists, setChecklists] = useKV<Record<string, ComplianceChecklist>>('compliance-checklists', {})
  const [municipalities] = useKV<Municipality[]>('municipalities', EXAMPLE_MUNICIPALITIES)
  const [generatorOpen, setGeneratorOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'compliant' | 'non-compliant'>('all')
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null)

  const currentChecklist = checklists?.[project.id]

  const handleGenerate = (data: {
    buildingType: any
    buildingUse: any
    buildingSurface?: number
    buildingHeight?: number
    climateZone?: string
    municipalityId?: string
  }) => {
    const checks = generateComplianceChecksForProject(
      project.id,
      data.buildingType,
      data.buildingUse,
      data.buildingSurface,
      data.buildingHeight
    )

    if (data.municipalityId) {
      const municipalReqs = getMunicipalRequirementsForProject(
        data.municipalityId,
        municipalities || [],
        data.buildingType,
        data.buildingUse
      )

      const municipalChecks: ComplianceCheck[] = municipalReqs.map(req => ({
        id: `${project.id}-${req.id}-${Date.now()}`,
        projectId: project.id,
        checkType: req.checkType,
        category: req.category,
        requirement: req.requirement,
        regulatoryReference: req.customReference,
        status: 'pending' as const,
        priority: req.priority,
        evidence: undefined,
        notes: req.notes,
        checkedAt: undefined,
        checkedBy: undefined
      }))

      checks.push(...municipalChecks)
    }

    const newChecklist: ComplianceChecklist = {
      id: `checklist-${project.id}`,
      projectId: project.id,
      buildingType: data.buildingType,
      buildingUse: data.buildingUse,
      buildingSurface: data.buildingSurface,
      buildingHeight: data.buildingHeight,
      climateZone: data.climateZone,
      municipalityId: data.municipalityId,
      checks,
      generatedAt: Date.now(),
      lastUpdated: Date.now(),
      completionPercentage: 0
    }

    setChecklists(current => ({
      ...current,
      [project.id]: newChecklist
    }))

    const municipalityName = data.municipalityId 
      ? municipalities?.find(m => m.id === data.municipalityId)?.name 
      : null

    toast.success(
      municipalityName
        ? `Checklist generado con ${checks.length} requisitos (incluyendo ${municipalities?.find(m => m.id === data.municipalityId)?.requirements.length || 0} requisitos de ${municipalityName})`
        : `Checklist generado con ${checks.length} requisitos de cumplimiento`
    )
  }

  const handleApplyMunicipalRequirements = (municipalityId: string) => {
    if (!currentChecklist) {
      toast.error('Primero debes generar un checklist base para el proyecto')
      return
    }

    const municipality = municipalities?.find(m => m.id === municipalityId)
    if (!municipality) {
      toast.error('Municipio no encontrado')
      return
    }

    const municipalReqs = getMunicipalRequirementsForProject(
      municipalityId,
      municipalities || [],
      currentChecklist.buildingType,
      currentChecklist.buildingUse
    )

    const existingReqIds = new Set(currentChecklist.checks.map(c => c.regulatoryReference))
    const newMunicipalChecks: ComplianceCheck[] = municipalReqs
      .filter(req => !existingReqIds.has(req.customReference))
      .map(req => ({
        id: `${project.id}-${req.id}-${Date.now()}-${Math.random()}`,
        projectId: project.id,
        checkType: req.checkType,
        category: req.category,
        requirement: req.requirement,
        regulatoryReference: req.customReference,
        status: 'pending' as const,
        priority: req.priority,
        evidence: undefined,
        notes: req.notes,
        checkedAt: undefined,
        checkedBy: undefined
      }))

    if (newMunicipalChecks.length === 0) {
      const alreadyAppliedCount = municipalReqs.length
      if (alreadyAppliedCount > 0) {
        toast.info(`Los requisitos de ${municipality.name} ya están aplicados al checklist`, {
          description: `${alreadyAppliedCount} requisitos municipales ya incluidos`
        })
      } else {
        toast.info(`No hay requisitos aplicables de ${municipality.name} para este tipo de proyecto`)
      }
      return
    }

    const updatedChecks = [...currentChecklist.checks, ...newMunicipalChecks]

    setChecklists(current => ({
      ...current,
      [project.id]: {
        ...currentChecklist,
        municipalityId,
        checks: updatedChecks,
        lastUpdated: Date.now()
      }
    }))

    const categoryBreakdown = newMunicipalChecks.reduce((acc, check) => {
      acc[check.category] = (acc[check.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categorySummary = Object.entries(categoryBreakdown)
      .map(([cat, count]) => `${count} de ${cat}`)
      .slice(0, 3)
      .join(', ')

    toast.success(`Requisitos municipales aplicados al checklist`, {
      description: `${newMunicipalChecks.length} requisitos de ${municipality.name} añadidos: ${categorySummary}${Object.keys(categoryBreakdown).length > 3 ? '...' : ''}`
    })
  }

  const handleUpdateCheck = (checkId: string, updates: Partial<ComplianceCheck>) => {
    if (!currentChecklist) return

    const updatedChecks = currentChecklist.checks.map(check =>
      check.id === checkId ? { ...check, ...updates, checkedAt: Date.now() } : check
    )

    const completedChecks = updatedChecks.filter(c => 
      c.status === 'compliant' || c.status === 'not-applicable'
    ).length
    const completionPercentage = Math.round((completedChecks / updatedChecks.length) * 100)

    setChecklists(current => ({
      ...current,
      [project.id]: {
        ...currentChecklist,
        checks: updatedChecks,
        lastUpdated: Date.now(),
        completionPercentage
      }
    }))
  }

  const filteredChecks = useMemo(() => {
    if (!currentChecklist) return []

    let filtered = currentChecklist.checks

    if (activeCategory !== 'all') {
      filtered = filtered.filter(check => check.category === activeCategory)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(check => check.priority === priorityFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(check => check.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(check =>
        check.requirement.toLowerCase().includes(query) ||
        check.category.toLowerCase().includes(query) ||
        check.regulatoryReference?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [currentChecklist, activeCategory, priorityFilter, statusFilter, searchQuery])

  const categoryStats = useMemo(() => {
    if (!currentChecklist) return {}

    const stats: Record<string, { total: number; completed: number }> = {}

    COMPLIANCE_CATEGORIES.forEach(category => {
      const categoryChecks = currentChecklist.checks.filter(c => c.category === category)
      const completed = categoryChecks.filter(c => c.status === 'compliant' || c.status === 'not-applicable').length
      stats[category] = { total: categoryChecks.length, completed }
    })

    return stats
  }, [currentChecklist])

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={20} weight="fill" className="text-green-600" />
      case 'non-compliant':
        return <XCircle size={20} weight="fill" className="text-red-600" />
      case 'not-applicable':
        return <Circle size={20} weight="regular" className="text-muted-foreground" />
      default:
        return <Clock size={20} weight="regular" className="text-orange-500" />
    }
  }

  const getPriorityBadge = (priority?: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="gap-1"><Warning size={12} weight="fill" />Alta</Badge>
      case 'medium':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Media</Badge>
      case 'low':
        return <Badge variant="outline">Baja</Badge>
      default:
        return null
    }
  }

  const exportChecklist = () => {
    if (!currentChecklist) return

    const csvContent = [
      ['Categoría', 'Requisito', 'Referencia Normativa', 'Estado', 'Prioridad', 'Notas'].join(','),
      ...currentChecklist.checks.map(check => [
        check.category,
        `"${check.requirement}"`,
        check.regulatoryReference || '',
        check.status,
        check.priority || '',
        `"${check.notes || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `checklist-cumplimiento-${project.title.replace(/\s+/g, '-')}.csv`
    link.click()

    toast.success('Checklist exportado correctamente')
  }

  if (!currentChecklist) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft size={18} />
            Volver al Proyecto
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="inline-flex p-6 rounded-full bg-accent/10 mb-6">
            <Sparkle size={64} className="text-accent" weight="duotone" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Checklist de Cumplimiento Normativo</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Genere automáticamente una lista de verificación completa de cumplimiento normativo para este proyecto.
            El sistema incluirá requisitos del CTE, RITE, REBT, normativa urbanística y requisitos municipales específicos.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => setGeneratorOpen(true)}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Sparkle size={20} weight="fill" />
              Generar Checklist Automático
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            O primero añade requisitos municipales específicos:
          </p>
          <div className="flex justify-center mt-2">
            <MunicipalComplianceManager projectId={project.id} />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border bg-card">
              <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                <CheckCircle size={24} weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Cumplimiento Completo</h3>
              <p className="text-sm text-muted-foreground">
                Más de 40 requisitos normativos aplicables a edificación residencial
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                <Sparkle size={24} weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Requisitos específicos según tipo de edificio, uso y características
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                <Download size={24} weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Exportable</h3>
              <p className="text-sm text-muted-foreground">
                Exporte a CSV para documentación y presentación a cliente
              </p>
            </div>
          </div>
        </motion.div>

        <ComplianceGeneratorDialog
          open={generatorOpen}
          onOpenChange={setGeneratorOpen}
          onGenerate={handleGenerate}
          projectTitle={project.title}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft size={18} />
            Volver
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-2xl font-bold">Checklist de Cumplimiento</h2>
            <p className="text-sm text-muted-foreground">{project.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportChecklist} className="gap-2">
            <Download size={18} />
            Exportar CSV
          </Button>
          <MunicipalComplianceManager 
            projectId={project.id} 
            onSelectMunicipality={handleApplyMunicipalRequirements}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>Progreso General</CardTitle>
              <CardDescription>
                {currentChecklist.checks.filter(c => c.status === 'compliant' || c.status === 'not-applicable').length} de {currentChecklist.checks.length} requisitos cumplidos
              </CardDescription>
              {currentChecklist.municipalityId && municipalities && (() => {
                const municipality = municipalities.find(m => m.id === currentChecklist.municipalityId)
                if (!municipality) return null
                const municipalChecks = currentChecklist.checks.filter(check => 
                  check.category.includes('Municipal') || 
                  check.category.includes('Local') || 
                  check.category.includes('Urbanismo') ||
                  check.regulatoryReference?.includes('PGOU') ||
                  check.regulatoryReference?.includes('Plan General')
                )
                return (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
                    <MapPin size={16} weight="fill" className="text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {municipality.name} • {municipality.province} ({municipalChecks.length} requisitos municipales)
                    </span>
                  </div>
                )
              })()}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{currentChecklist.completionPercentage}%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={currentChecklist.completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar requisitos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelSimple size={18} className="text-muted-foreground" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todas las prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="compliant">Cumple</option>
            <option value="non-compliant">No Cumple</option>
          </select>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">
            Todos ({currentChecklist.checks.length})
          </TabsTrigger>
          {COMPLIANCE_CATEGORIES.map(category => {
            const stats = categoryStats[category]
            if (!stats || stats.total === 0) return null
            
            return (
              <TabsTrigger key={category} value={category}>
                {category} ({stats.completed}/{stats.total})
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-3 mt-6">
          {filteredChecks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No hay requisitos que coincidan con los filtros aplicados</p>
              </CardContent>
            </Card>
          ) : (
            filteredChecks.map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <Card className={expandedCheck === check.id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5">
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {check.category}
                                </Badge>
                                {getPriorityBadge(check.priority)}
                                {(check.category.includes('Municipal') || check.category.includes('Local') || check.category.includes('Urbanismo')) && (
                                  <Badge variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
                                    <MapPin size={12} weight="fill" />
                                    Municipal
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{check.requirement}</p>
                              {check.regulatoryReference && (
                                <p className="text-sm text-muted-foreground font-mono mt-1">
                                  {check.regulatoryReference}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
                            >
                              {expandedCheck === check.id ? 'Ocultar' : 'Detalles'}
                            </Button>
                          </div>

                          {expandedCheck === check.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4 pt-4 border-t"
                            >
                              <div className="grid grid-cols-4 gap-2">
                                <button
                                  onClick={() => handleUpdateCheck(check.id, { status: 'compliant' })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    check.status === 'compliant'
                                      ? 'border-green-600 bg-green-50'
                                      : 'border-border hover:border-green-600'
                                  }`}
                                >
                                  <CheckCircle size={20} weight="fill" className="text-green-600 mx-auto mb-1" />
                                  <p className="text-xs font-medium">Cumple</p>
                                </button>
                                <button
                                  onClick={() => handleUpdateCheck(check.id, { status: 'non-compliant' })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    check.status === 'non-compliant'
                                      ? 'border-red-600 bg-red-50'
                                      : 'border-border hover:border-red-600'
                                  }`}
                                >
                                  <XCircle size={20} weight="fill" className="text-red-600 mx-auto mb-1" />
                                  <p className="text-xs font-medium">No Cumple</p>
                                </button>
                                <button
                                  onClick={() => handleUpdateCheck(check.id, { status: 'pending' })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    check.status === 'pending'
                                      ? 'border-orange-500 bg-orange-50'
                                      : 'border-border hover:border-orange-500'
                                  }`}
                                >
                                  <Clock size={20} weight="regular" className="text-orange-500 mx-auto mb-1" />
                                  <p className="text-xs font-medium">Pendiente</p>
                                </button>
                                <button
                                  onClick={() => handleUpdateCheck(check.id, { status: 'not-applicable' })}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    check.status === 'not-applicable'
                                      ? 'border-muted-foreground bg-muted'
                                      : 'border-border hover:border-muted-foreground'
                                  }`}
                                >
                                  <Circle size={20} weight="regular" className="text-muted-foreground mx-auto mb-1" />
                                  <p className="text-xs font-medium">N/A</p>
                                </button>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`notes-${check.id}`}>Notas y Observaciones</Label>
                                <Textarea
                                  id={`notes-${check.id}`}
                                  placeholder="Añadir notas sobre el cumplimiento, documentación de evidencia, etc."
                                  value={check.notes || ''}
                                  onChange={(e) => handleUpdateCheck(check.id, { notes: e.target.value })}
                                  rows={3}
                                />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
