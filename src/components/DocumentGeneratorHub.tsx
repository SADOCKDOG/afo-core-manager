import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Sparkle, 
  FileText, 
  Files, 
  MagicWand,
  Robot,
  BookOpen,
  Lightning,
  Rocket,
  MagnifyingGlass,
  ArrowRight,
  Download,
  Stack,
  ListChecks
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DocumentTemplate, Project, Stakeholder } from '@/lib/types'
import { ARCHITECTURAL_TEMPLATES, getTemplatesByCategory } from '@/lib/document-templates'

interface DocumentGeneratorHubProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  stakeholders?: Stakeholder[]
  onGenerateFromTemplate: (template: DocumentTemplate, customFields: Record<string, string>, customSections: Record<string, string>) => void
}

type GeneratorMode = 'templates' | 'ai-custom' | 'batch' | 'guided'

interface TemplateStats {
  total: number
  byCategory: Record<string, number>
  mostUsed: DocumentTemplate[]
  recentlyUsed: DocumentTemplate[]
}

export function DocumentGeneratorHub({
  open,
  onOpenChange,
  project,
  stakeholders,
  onGenerateFromTemplate
}: DocumentGeneratorHubProps) {
  const [mode, setMode] = useState<GeneratorMode>('templates')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())

  const stats: TemplateStats = {
    total: ARCHITECTURAL_TEMPLATES.length,
    byCategory: ARCHITECTURAL_TEMPLATES.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    mostUsed: ARCHITECTURAL_TEMPLATES.slice(0, 3),
    recentlyUsed: ARCHITECTURAL_TEMPLATES.slice(0, 5)
  }

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      (template.discipline && template.discipline.toLowerCase().includes(query))
    )
  })

  const toggleTemplateSelection = (templateId: string) => {
    const newSelection = new Set(selectedTemplates)
    if (newSelection.has(templateId)) {
      newSelection.delete(templateId)
    } else {
      newSelection.add(templateId)
    }
    setSelectedTemplates(newSelection)
  }

  const handleBatchGenerate = () => {
    const templates = ARCHITECTURAL_TEMPLATES.filter(t => selectedTemplates.has(t.id))
    templates.forEach(template => {
      onGenerateFromTemplate(template, {}, {})
    })
    setSelectedTemplates(new Set())
  }

  const generatorModes = [
    {
      id: 'templates' as GeneratorMode,
      icon: FileText,
      title: 'Plantillas',
      description: 'Selecciona plantillas predefinidas',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'ai-custom' as GeneratorMode,
      icon: Robot,
      title: 'IA Personalizada',
      description: 'Genera contenido único con IA',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'batch' as GeneratorMode,
      icon: Stack,
      title: 'Generación Masiva',
      description: 'Múltiples documentos a la vez',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'guided' as GeneratorMode,
      icon: Rocket,
      title: 'Asistente Guiado',
      description: 'Paso a paso con recomendaciones',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ]

  const quickActions = [
    {
      title: 'Memoria Completa',
      description: 'Genera todas las secciones de memoria',
      icon: BookOpen,
      count: 8,
      action: () => {}
    },
    {
      title: 'Documentación Básica',
      description: 'Set completo para proyecto básico',
      icon: Files,
      count: 12,
      action: () => {}
    },
    {
      title: 'Pack Ejecución',
      description: 'Todo lo necesario para ejecución',
      icon: ListChecks,
      count: 15,
      action: () => {}
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <Sparkle size={28} weight="fill" />
                  </div>
                  Hub de Generación Documental
                </DialogTitle>
                <DialogDescription className="mt-2">
                  Centro de creación inteligente de documentación técnica para {project.title}
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Lightning size={14} weight="fill" />
                  {stats.total} plantillas
                </Badge>
                {selectedTemplates.size > 0 && (
                  <Badge className="gap-1.5 bg-accent text-accent-foreground">
                    {selectedTemplates.size} seleccionados
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-12 h-full">
              <div className="col-span-3 border-r bg-muted/20 p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Modo de Generación
                  </h3>
                  <div className="space-y-2">
                    {generatorModes.map((modeOption) => (
                      <button
                        key={modeOption.id}
                        onClick={() => setMode(modeOption.id)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all group ${
                          mode === modeOption.id
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-transparent bg-card hover:border-primary/30 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${modeOption.bgColor} ${modeOption.color} transition-transform group-hover:scale-110`}>
                            <modeOption.icon size={20} weight="duotone" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm mb-0.5 group-hover:text-primary transition-colors">
                              {modeOption.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {modeOption.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full p-3 rounded-lg bg-card border hover:border-accent hover:shadow-md transition-all text-left group"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <action.icon size={16} className="text-accent mt-0.5" weight="duotone" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium group-hover:text-accent transition-colors">
                              {action.title}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {action.count}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {action.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <MagicWand size={16} className="text-accent mt-0.5" weight="duotone" />
                        <div>
                          <div className="text-xs font-medium mb-1">Tip del día</div>
                          <p className="text-xs text-muted-foreground">
                            Usa la generación masiva para crear todo el set de documentos de una fase completa
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="col-span-9 flex flex-col">
                {mode === 'templates' && (
                  <div className="flex-1 flex flex-col">
                    <div className="p-4 border-b space-y-3">
                      <div className="relative">
                        <MagnifyingGlass 
                          size={18} 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                        />
                        <Input
                          placeholder="Buscar plantillas por nombre, categoría o disciplina..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-1">
                        <Button
                          variant={selectedCategory === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory('all')}
                        >
                          Todas ({stats.total})
                        </Button>
                        {Object.entries(stats.byCategory).map(([category, count]) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category} ({count})
                          </Button>
                        ))}
                      </div>
                    </div>

                    <ScrollArea className="flex-1 p-4">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredTemplates.map((template, index) => (
                          <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all hover:shadow-lg group ${
                                selectedTemplates.has(template.id)
                                  ? 'ring-2 ring-primary bg-primary/5'
                                  : 'hover:border-primary'
                              }`}
                              onClick={() => toggleTemplateSelection(template.id)}
                            >
                              <CardHeader className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <FileText size={20} weight="duotone" />
                                  </div>
                                  {selectedTemplates.has(template.id) && (
                                    <div className="p-1.5 rounded-full bg-primary text-primary-foreground">
                                      <ListChecks size={14} weight="bold" />
                                    </div>
                                  )}
                                </div>
                                <CardTitle className="text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                  {template.name}
                                </CardTitle>
                                <CardDescription className="text-xs line-clamp-2">
                                  {template.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="flex flex-wrap gap-1.5">
                                  <Badge variant="secondary" className="text-xs">
                                    {template.sections.length} secciones
                                  </Badge>
                                  {template.requiredFields.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {template.requiredFields.length} campos
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {filteredTemplates.length === 0 && (
                        <div className="text-center py-16">
                          <div className="inline-flex p-6 rounded-full bg-muted mb-4">
                            <FileText size={48} className="text-muted-foreground" weight="duotone" />
                          </div>
                          <h3 className="text-lg font-semibold mb-2">No se encontraron plantillas</h3>
                          <p className="text-sm text-muted-foreground">
                            Intenta ajustar los filtros o la búsqueda
                          </p>
                        </div>
                      )}
                    </ScrollArea>

                    {selectedTemplates.size > 0 && (
                      <div className="p-4 border-t bg-muted/20">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium">
                              {selectedTemplates.size} plantilla{selectedTemplates.size !== 1 ? 's' : ''} seleccionada{selectedTemplates.size !== 1 ? 's' : ''}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedTemplates(new Set())}
                            >
                              Limpiar selección
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="gap-2"
                              onClick={handleBatchGenerate}
                            >
                              <Download size={18} />
                              Generar Individualmente
                            </Button>
                            <Button
                              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                              onClick={handleBatchGenerate}
                            >
                              <Sparkle size={18} weight="fill" />
                              Generar Todo
                              <ArrowRight size={18} weight="bold" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === 'ai-custom' && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-lg">
                      <div className="inline-flex p-6 rounded-full bg-purple-500/10 mb-6">
                        <Robot size={64} className="text-purple-500" weight="duotone" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Generación IA Personalizada</h3>
                      <p className="text-muted-foreground mb-6">
                        Crea documentos únicos describiendo exactamente lo que necesitas. 
                        La IA generará contenido profesional adaptado a tu proyecto.
                      </p>
                      <Button size="lg" className="gap-2">
                        <Sparkle size={20} weight="fill" />
                        Comenzar Generación IA
                      </Button>
                    </div>
                  </div>
                )}

                {mode === 'batch' && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-lg">
                      <div className="inline-flex p-6 rounded-full bg-green-500/10 mb-6">
                        <Stack size={64} className="text-green-500" weight="duotone" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Generación Masiva</h3>
                      <p className="text-muted-foreground mb-6">
                        Genera múltiples documentos simultáneamente. Perfecto para crear 
                        toda la documentación de una fase completa.
                      </p>
                      <div className="grid grid-cols-1 gap-3 text-left mb-6">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            className="p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                <action.icon size={24} weight="duotone" />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="font-medium group-hover:text-primary transition-colors">
                                  {action.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {action.description}
                                </div>
                              </div>
                              <Badge>{action.count} docs</Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'guided' && (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-lg">
                      <div className="inline-flex p-6 rounded-full bg-orange-500/10 mb-6">
                        <Rocket size={64} className="text-orange-500" weight="duotone" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">Asistente Guiado</h3>
                      <p className="text-muted-foreground mb-6">
                        Te guiaremos paso a paso para crear toda la documentación necesaria, 
                        con recomendaciones basadas en el tipo de proyecto.
                      </p>
                      <Button size="lg" className="gap-2">
                        <ArrowRight size={20} weight="bold" />
                        Iniciar Asistente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
