import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
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
  CaretUp
} from '@phosphor-icons/react'
import { DocumentTemplate, TEMPLATE_CATEGORIES, TemplateCategory, TemplateSection } from '@/lib/types'
import { ARCHITECTURAL_TEMPLATES, getTemplatesByCategory } from '@/lib/document-templates'
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
}

export function DocumentTemplateWithAI({ 
  open, 
  onOpenChange, 
  onSelectTemplate,
  projectContext 
}: DocumentTemplateWithAIProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [customSections, setCustomSections] = useState<Record<string, string>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState<TemplateSection | null>(null)

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query)
    )
  })

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    const initialFields: Record<string, string> = {}
    template.requiredFields.forEach(field => {
      initialFields[field] = ''
    })
    setCustomFields(initialFields)
    setCustomSections({})
    setExpandedSections({})
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

  const getCategoryIcon = (category: TemplateCategory) => {
    switch (category) {
      case 'memoria':
        return <BookOpen size={18} weight="duotone" />
      case 'planos':
        return <Blueprint size={18} weight="duotone" />
      case 'administrativo':
        return <FileArchive size={18} weight="duotone" />
      case 'presupuesto':
        return <Calculator size={18} weight="duotone" />
      case 'calculo':
        return <Files size={18} weight="duotone" />
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

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                      <TabsTrigger key={key} value={key} className="gap-2">
                        {getCategoryIcon(key as TemplateCategory)}
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
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
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Check size={18} className="text-primary" />
                      Campos Obligatorios
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedTemplate.requiredFields.map((field) => (
                        <div key={field} className="space-y-2">
                          <Label htmlFor={field}>
                            {fieldLabels[field] || field} *
                          </Label>
                          <Input
                            id={field}
                            value={customFields[field] || ''}
                            onChange={(e) => handleFieldChange(field, e.target.value)}
                            placeholder={`Ingrese ${fieldLabels[field]?.toLowerCase() || field}`}
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
