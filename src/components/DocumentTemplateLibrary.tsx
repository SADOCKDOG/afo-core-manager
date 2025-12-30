import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  ArrowLeft, 
  MagnifyingGlass,
  BookOpen,
  Files,
  FileArchive,
  Calculator,
  Blueprint,
  Download,
  Eye,
  Sparkle
} from '@phosphor-icons/react'
import { DocumentTemplate, TEMPLATE_CATEGORIES, TemplateCategory } from '@/lib/types'
import { ARCHITECTURAL_TEMPLATES, getTemplatesByCategory } from '@/lib/document-templates'
import { motion } from 'framer-motion'

interface DocumentTemplateLibraryProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DocumentTemplateLibrary({ open: controlledOpen, onOpenChange }: DocumentTemplateLibraryProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      (template.discipline && template.discipline.toLowerCase().includes(query))
    )
  })

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
  }

  const handleBack = () => {
    setSelectedTemplate(null)
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

  const getCategoryStats = () => {
    const stats: Record<string, number> = {
      all: ARCHITECTURAL_TEMPLATES.length
    }
    
    Object.keys(TEMPLATE_CATEGORIES).forEach(category => {
      stats[category] = ARCHITECTURAL_TEMPLATES.filter(t => t.category === category).length
    })
    
    return stats
  }

  const stats = getCategoryStats()

  const trigger = (
    <Button variant="outline" className="gap-2">
      <BookOpen size={18} weight="duotone" />
      Biblioteca de Plantillas
    </Button>
  )

  const content = (
    <DialogContent className="max-w-[92vw] max-h-[95vh] p-0">
      {!selectedTemplate ? (
        <>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <BookOpen size={32} weight="duotone" />
              </div>
              <div>
                <div>Biblioteca de Plantillas</div>
                <DialogDescription className="mt-1">
                  Explore y utilice plantillas profesionales para entregables arquitectónicos comunes
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="px-6">
            <div className="relative mb-4">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar plantillas por nombre, categoría o disciplina..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                    : 'bg-card hover:border-primary hover:shadow-sm'
                }`}
              >
                <div className="text-2xl font-bold">{stats.all}</div>
                <div className="text-xs mt-1">Todas</div>
              </button>
              {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedCategory === key 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                      : 'bg-card hover:border-primary hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-center mb-1">
                    {getCategoryIcon(key as TemplateCategory, 20)}
                  </div>
                  <div className="text-lg font-bold">{stats[key]}</div>
                  <div className="text-xs mt-1 line-clamp-1">{label}</div>
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[650px] px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="group relative p-5 rounded-lg border bg-card text-left transition-all hover:shadow-lg hover:border-primary h-full w-full"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {getCategoryIcon(template.category, 24)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.sections.length} secciones
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {template.name}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {template.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {TEMPLATE_CATEGORIES[template.category]}
                        </Badge>
                        {template.discipline && (
                          <Badge variant="outline" className="text-xs">
                            {template.discipline}
                          </Badge>
                        )}
                      </div>
                      
                      {template.requiredFields.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkle size={12} />
                          <span>{template.requiredFields.length} campos requeridos</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                </motion.div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-6 rounded-full bg-muted mb-4">
                  <FileText size={64} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No se encontraron plantillas</h3>
                <p className="text-muted-foreground mb-4">
                  Intente ajustar los filtros o búsqueda
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}>
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <>
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft size={20} />
              </Button>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {getCategoryIcon(selectedTemplate.category, 24)}
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedTemplate.name}</DialogTitle>
                      <DialogDescription className="mt-1">{selectedTemplate.description}</DialogDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">
                    {TEMPLATE_CATEGORIES[selectedTemplate.category]}
                  </Badge>
                  {selectedTemplate.discipline && (
                    <Badge variant="outline">
                      {selectedTemplate.discipline}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {selectedTemplate.folder || 'Sin carpeta definida'}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[700px] px-6">
            <div className="space-y-6 py-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkle size={18} className="text-primary" />
                    Información General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Tipo de Documento</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {selectedTemplate.type}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Secciones Incluidas</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTemplate.sections.length} secciones
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Campos Requeridos</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedTemplate.requiredFields.length} campos
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Ubicación Sugerida</div>
                      <div className="text-sm text-muted-foreground font-mono text-xs">
                        {selectedTemplate.folder || 'Flexible'}
                      </div>
                    </div>
                  </div>

                  {selectedTemplate.requiredFields.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm font-medium mb-2">Campos que necesitará proporcionar:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTemplate.requiredFields.map(field => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Files size={18} className="text-primary" />
                    Estructura del Documento ({selectedTemplate.sections.length} secciones)
                  </CardTitle>
                  <CardDescription>
                    Vista previa del contenido y organización de la plantilla
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTemplate.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{section.title}</h4>
                            {section.required && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Sección obligatoria
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <details className="group">
                        <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mb-2">
                          <Eye size={14} />
                          <span>Ver contenido de la sección</span>
                        </summary>
                        <div className="mt-3 p-3 rounded bg-background border">
                          <pre className="text-sm font-mono whitespace-pre-wrap text-muted-foreground leading-relaxed">
                            {section.content}
                          </pre>
                        </div>
                      </details>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-accent/20 text-accent-foreground">
                      <Sparkle size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Cómo usar esta plantilla</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Los campos entre corchetes [CAMPO] serán reemplazados con sus datos</li>
                        <li>Puede editar el contenido generado antes de guardarlo</li>
                        <li>Las secciones obligatorias deben incluirse en el documento final</li>
                        <li>Use esta plantilla desde el gestor de documentos del proyecto</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack}>
              Volver a la Biblioteca
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download size={18} />
                Exportar Plantilla
              </Button>
            </div>
          </div>
        </>
      )}
    </DialogContent>
  )

  if (isControlled) {
    return <Dialog open={open} onOpenChange={handleOpenChange}>{content}</Dialog>
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
