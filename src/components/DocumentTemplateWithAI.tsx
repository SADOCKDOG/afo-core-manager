import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  FileText, 
  ArrowLeft, 
  Check, 
  MagnifyingGlass,
  BookOpen,
  Files,
  FileArchive,
  Calculator,
  Blueprint,
  Sparkle,
  CaretDown,
  CaretUp,
  Robot,
  Lightning,
  MagicWand,
  Eye,
  EyeSlash
} from '@phosphor-icons/react'
import { DocumentTemplate, TEMPLATE_CATEGORIES, TemplateCategory, TemplateSection, Project, Stakeholder, ArchitectProfile } from '@/lib/types'
import { ARCHITECTURAL_TEMPLATES, getTemplatesByCategory } from '@/lib/document-templates'
import { replaceArchitectPlaceholders } from '@/lib/document-utils'
import { AIContentGenerator } from '@/components/AIContentGenerator'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface DocumentTemplateWithAIProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: DocumentTemplate, customFields: Record<string, string>, customSections: Record<string, string>) => void
  projectContext?: {
    title?: string
    location?: string
    description?: string
    phase?: string
  }
  project?: Project
  stakeholders?: Stakeholder[]
}

export function DocumentTemplateWithAI({ 
  open, 
  onOpenChange, 
  onSelectTemplate,
  projectContext,
  project,
  stakeholders 
}: DocumentTemplateWithAIProps) {
  const [architectProfile] = useKV<ArchitectProfile | null>('architect-profile', null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [customSections, setCustomSections] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<TemplateSection | null>(null)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set())

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query)
    )
  })

  const autoFillFromProjectData = (template: DocumentTemplate): Record<string, string> => {
    const fields: Record<string, string> = {}
    const filled = new Set<string>()

    if (!project) return fields

    const projectStakeholders = stakeholders?.filter(s => project.stakeholders.includes(s.id)) || []
    const promotor = projectStakeholders.find(s => s.type === 'promotor')
    const arquitecto = projectStakeholders.find(s => s.type === 'architect')

    template.requiredFields.forEach(field => {
      switch (field) {
        case 'promotor':
          if (promotor) {
            const name = promotor.razonSocial || `${promotor.name} ${promotor.apellido1 || ''} ${promotor.apellido2 || ''}`.trim()
            fields[field] = name
            filled.add(field)
          }
          break
        case 'arquitecto':
          if (architectProfile) {
            const name = architectProfile.razonSocial || architectProfile.nombreCompleto
            const collegiateInfo = architectProfile.numeroColegial ? ` - Nº Col. ${architectProfile.numeroColegial}` : ''
            fields[field] = name + collegiateInfo
            filled.add(field)
          } else if (arquitecto) {
            const name = `${arquitecto.name} ${arquitecto.apellido1 || ''} ${arquitecto.apellido2 || ''}`.trim()
            const collegiateInfo = arquitecto.collegiateNumber ? ` - Nº Col. ${arquitecto.collegiateNumber}` : ''
            fields[field] = name + collegiateInfo
            filled.add(field)
          }
          break
        case 'ubicacion':
        case 'direccion_obra':
          if (project.location) {
            fields[field] = project.location
            filled.add(field)
          }
          break
        case 'proyecto':
          if (project.title) {
            fields[field] = project.title
            filled.add(field)
          }
          break
        case 'superficie':
        case 'superficie_util':
          if (project.description && /\d+\s*m[2²]/.test(project.description)) {
            const match = project.description.match(/(\d+(?:\.\d+)?)\s*m[2²]/)
            if (match) {
              fields[field] = match[1]
              filled.add(field)
            }
          }
          break
        case 'uso':
          if (project.description) {
            const lowerDesc = project.description.toLowerCase()
            if (lowerDesc.includes('vivienda')) fields[field] = 'Residencial Vivienda'
            else if (lowerDesc.includes('comercial')) fields[field] = 'Comercial'
            else if (lowerDesc.includes('oficina')) fields[field] = 'Administrativo'
            else if (lowerDesc.includes('docente') || lowerDesc.includes('escuela')) fields[field] = 'Docente'
            if (fields[field]) filled.add(field)
          }
          break
        default:
          fields[field] = ''
      }
    })

    setAutoFilledFields(filled)
    return fields
  }

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    const autoFilledFields = autoFillFromProjectData(template)
    setCustomFields(autoFilledFields)
    setCustomSections({})
    setExpandedSections({})
    
    const filledCount = Object.values(autoFilledFields).filter(v => v.trim()).length
    if (filledCount > 0) {
      toast.success(`${filledCount} campo${filledCount > 1 ? 's' : ''} auto-completado${filledCount > 1 ? 's' : ''} desde datos del proyecto`, {
        description: 'Los campos restantes pueden completarse manualmente o con IA'
      })
    }
  }

  const handleBack = () => {
    setSelectedTemplate(null)
    setCustomFields({})
    setCustomSections({})
    setExpandedSections({})
  }

  const handleFieldChange = (field: string, value: string) => {
    setCustomFields(prev => ({ ...prev, [field]: value }))
  }

  const handleSectionContentChange = (sectionId: string, content: string) => {
    setCustomSections(prev => ({ ...prev, [sectionId]: content }))
  }

  const toggleSectionExpand = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const handleGenerateAI = (section: TemplateSection) => {
    setCurrentSection(section)
    setAiGeneratorOpen(true)
  }

  const handleAISmartFill = async () => {
    if (!selectedTemplate || !project) return

    setIsAutoFilling(true)
    const emptyFields = selectedTemplate.requiredFields.filter(field => !customFields[field]?.trim())

    if (emptyFields.length === 0) {
      toast.info('Todos los campos ya están completados')
      setIsAutoFilling(false)
      return
    }

    try {
      const projectContext = {
        title: project.title,
        location: project.location,
        description: project.description,
        phases: project.phases.map(p => p.phase).join(', '),
        stakeholders: stakeholders?.filter(s => project.stakeholders.includes(s.id)).map(s => ({
          type: s.type,
          name: s.razonSocial || `${s.name} ${s.apellido1 || ''}`.trim(),
          nif: s.nif
        }))
      }

      const promptText = `Eres un asistente para arquitectos españoles. Basándote en los datos del proyecto, genera valores apropiados para los siguientes campos de una plantilla de documento arquitectónico.

Datos del proyecto:
- Título: ${projectContext.title}
- Ubicación: ${projectContext.location}
- Descripción: ${projectContext.description || 'No especificada'}
- Fases: ${projectContext.phases}

Campos a completar: ${emptyFields.join(', ')}

Para cada campo, proporciona un valor profesional y apropiado basado en los datos del proyecto. Si un valor no puede deducirse, proporciona un placeholder descriptivo.

IMPORTANTE: Devuelve SOLO un objeto JSON con los nombres de los campos como claves y los valores sugeridos. No incluyas explicaciones adicionales.

Ejemplo de formato:
{
  "zona_climatica": "D3 (Toledo)",
  "constructor": "[Por determinar - A asignar en fase de licitación]",
  "escala": "1:100"
}`

      const result = await spark.llm(promptText, 'gpt-4o', true)
      const suggestedValues = JSON.parse(result)

      const newFields = { ...customFields }
      let filledCount = 0

      emptyFields.forEach(field => {
        if (suggestedValues[field]) {
          newFields[field] = suggestedValues[field]
          filledCount++
        }
      })

      setCustomFields(newFields)
      toast.success(`${filledCount} campo${filledCount > 1 ? 's' : ''} completado${filledCount > 1 ? 's' : ''} con IA`, {
        description: 'Revise y ajuste los valores sugeridos según sea necesario'
      })
    } catch (error) {
      console.error('Error in AI smart fill:', error)
      toast.error('Error al generar sugerencias con IA', {
        description: 'Por favor, complete los campos manualmente'
      })
    } finally {
      setIsAutoFilling(false)
    }
  }

  const handleAIContentGenerated = (content: string) => {
    if (currentSection) {
      handleSectionContentChange(currentSection.id, content)
      setExpandedSections(prev => ({ ...prev, [currentSection.id]: true }))
    }
  }

  const handleUseTemplate = () => {
    if (!selectedTemplate) return

    const missingFields = selectedTemplate.requiredFields.filter(field => !customFields[field]?.trim())
    if (missingFields.length > 0) {
      toast.error('Por favor, complete todos los campos obligatorios')
      return
    }

    onSelectTemplate(selectedTemplate, customFields, customSections)
    onOpenChange(false)
    setSelectedTemplate(null)
    setCustomFields({})
    setCustomSections({})
    setSearchQuery('')
    setExpandedSections({})
    toast.success('Plantilla preparada con contenido personalizado')
  }

  const getCategoryIcon = (category: TemplateCategory, size: number = 18) => {
    switch (category) {
      case 'memoria':
        return <BookOpen size={size} weight="duotone" />
      case 'planos':
        return <Blueprint size={size} weight="duotone" />
      case 'administrativo':
        return <FileArchive size={size} weight="duotone" />
      case 'presupuesto':
        return <Calculator size={size} weight="duotone" />
      case 'calculo':
        return <Files size={size} weight="duotone" />
    }
  }

  const fieldLabels: Record<string, string> = {
    promotor: 'Promotor',
    arquitecto: 'Arquitecto',
    ubicacion: 'Ubicación',
    superficie: 'Superficie',
    constructor: 'Constructor',
    zona_climatica: 'Zona Climática',
    superficie_util: 'Superficie Útil',
    uso: 'Uso del Edificio',
    proyecto: 'Nombre del Proyecto',
    direccion_obra: 'Dirección de la Obra',
    escala: 'Escala'
  }

  const hasAIGeneratedContent = selectedTemplate 
    ? selectedTemplate.sections.some(section => customSections[section.id])
    : false

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          {!selectedTemplate ? (
            <>
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <FileText size={28} weight="duotone" className="text-primary" />
                  Plantillas de Documentos con IA
                </DialogTitle>
                <DialogDescription>
                  Seleccione una plantilla y personalice las secciones con contenido generado por IA
                </DialogDescription>
              </DialogHeader>

              <div className="px-6">
                <div className="relative mb-4">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar plantillas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Todas
                  </Button>
                  {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(key)}
                      className="gap-2 shrink-0"
                    >
                      {getCategoryIcon(key as TemplateCategory, 16)}
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[450px] px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className="group relative p-5 rounded-lg border bg-card text-left transition-all hover:shadow-md hover:border-primary"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getCategoryIcon(template.category)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.sections.length} secciones
                          </Badge>
                          <div className="p-1.5 rounded bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <Sparkle size={12} weight="fill" />
                          </div>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {template.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {template.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {TEMPLATE_CATEGORIES[template.category]}
                        </Badge>
                        {template.discipline && (
                          <span>· {template.discipline}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <FileText size={48} className="text-muted-foreground" weight="duotone" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No se encontraron plantillas</h3>
                    <p className="text-muted-foreground">
                      Intente ajustar los filtros o búsqueda
                    </p>
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <>
              <DialogHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft size={18} />
                  </Button>
                  <div className="flex-1">
                    <DialogTitle className="text-xl flex items-center gap-2">
                      {selectedTemplate.name}
                      <Badge variant="secondary" className="text-xs font-normal">
                        <Sparkle size={12} weight="fill" className="mr-1" />
                        IA Habilitado
                      </Badge>
                    </DialogTitle>
                    <DialogDescription>{selectedTemplate.description}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="h-[550px] px-6">
                <div className="space-y-6 pb-6 pt-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Check size={18} className="text-primary" />
                        Campos Obligatorios
                        {autoFilledFields.size > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Lightning size={12} weight="fill" className="mr-1" />
                            {autoFilledFields.size} auto-completado{autoFilledFields.size !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </h3>
                      <Button
                        onClick={handleAISmartFill}
                        disabled={isAutoFilling || !project}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        {isAutoFilling ? (
                          <>
                            <Sparkle size={14} weight="fill" className="animate-pulse" />
                            Completando...
                          </>
                        ) : (
                          <>
                            <Robot size={14} weight="duotone" />
                            Completar con IA
                          </>
                        )}
                      </Button>
                    </div>
                    {!project && (
                      <div className="mb-4 p-3 rounded-lg bg-muted/50 border border-dashed">
                        <p className="text-sm text-muted-foreground">
                          💡 Para auto-completar campos automáticamente, abra las plantillas desde un proyecto específico
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedTemplate.requiredFields.map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={field} className="flex items-center gap-2">
                            {fieldLabels[field] || field} *
                            {autoFilledFields.has(field) && (
                              <Lightning size={12} weight="fill" className="text-accent" />
                            )}
                          </Label>
                          <Input
                            id={field}
                            value={customFields[field] || ''}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            placeholder={`Ingrese ${fieldLabels[field]?.toLowerCase() || field}`}
                            className={autoFilledFields.has(field) ? 'border-accent/50' : ''}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Files size={18} className="text-primary" />
                        Contenido de Secciones
                        {hasAIGeneratedContent && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkle size={12} weight="fill" className="mr-1" />
                            {Object.keys(customSections).length} personalizada{Object.keys(customSections).length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      Personalice el contenido de cada sección usando IA o déjelas con el contenido predeterminado de la plantilla
                    </p>

                    <div className="space-y-3">
                      {selectedTemplate.sections.map((section) => (
                        <div
                          key={section.id}
                          className="rounded-lg border bg-card overflow-hidden"
                        >
                          <div className="p-4 flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{section.title}</h4>
                                {section.required && (
                                  <Badge variant="secondary" className="text-xs">
                                    Obligatorio
                                  </Badge>
                                )}
                                {customSections[section.id] && (
                                  <Badge variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                                    <Sparkle size={10} weight="fill" className="mr-1" />
                                    IA
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {customSections[section.id] 
                                  ? 'Contenido personalizado generado por IA'
                                  : 'Contenido predeterminado de la plantilla'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateAI(section)}
                                className="gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border-purple-200"
                              >
                                <Sparkle size={14} weight="fill" />
                                Generar con IA
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSectionExpand(section.id)}
                              >
                                {expandedSections[section.id] ? <CaretUp size={16} /> : <CaretDown size={16} />}
                              </Button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedSections[section.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t overflow-hidden"
                              >
                                <div className="p-4 bg-muted/30 space-y-3">
                                  <div>
                                    <Label htmlFor={`section-${section.id}`} className="text-xs mb-2 block">
                                      Contenido Personalizado (opcional)
                                    </Label>
                                    <Textarea
                                      id={`section-${section.id}`}
                                      value={customSections[section.id] || ''}
                                      onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
                                      placeholder="Deje vacío para usar el contenido predeterminado de la plantilla, o escriba/genere contenido personalizado..."
                                      rows={6}
                                      className="font-mono text-xs resize-none"
                                    />
                                  </div>
                                  {customSections[section.id] && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSectionContentChange(section.id, '')}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      Restaurar contenido predeterminado
                                    </Button>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200">
                    <div className="flex gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white h-fit">
                        <Sparkle size={20} weight="fill" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Generación Inteligente con IA</p>
                        <p className="text-xs text-muted-foreground">
                          Utilice la IA para generar contenido profesional y técnicamente preciso para cada sección. 
                          El contenido generado incorpora automáticamente el contexto de su proyecto y referencias normativas relevantes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="px-6 py-4 border-t flex justify-between items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {Object.keys(customSections).length > 0 && (
                    <span className="flex items-center gap-2">
                      <Sparkle size={14} weight="fill" className="text-purple-500" />
                      {Object.keys(customSections).length} sección{Object.keys(customSections).length !== 1 ? 'es' : ''} personalizada{Object.keys(customSections).length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBack}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUseTemplate} className="gap-2">
                    <Check size={18} />
                    Generar Documento
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AIContentGenerator
        open={aiGeneratorOpen}
        onOpenChange={setAiGeneratorOpen}
        sectionTitle={currentSection?.title}
        sectionContext={currentSection?.content}
        onGenerate={handleAIContentGenerated}
        projectContext={projectContext}
      />
    </>
  )
}
