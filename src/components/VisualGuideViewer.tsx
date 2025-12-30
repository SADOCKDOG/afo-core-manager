import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MagnifyingGlass, 
  X, 
  CaretLeft, 
  CaretRight, 
  BookOpen,
  Camera,
  ListNumbers,
  Check,
  Info,
  Warning,
  Lightbulb,
  DownloadSimple,
  FilePdf,
  FileDoc
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { visualGuidesData } from '@/lib/visual-guides-data'
import { toast } from 'sonner'
import { exportVisualGuide } from '@/lib/visual-guide-export'

interface VisualGuideViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guideId?: string
}

export function VisualGuideViewer({ open, onOpenChange, guideId }: VisualGuideViewerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGuideId, setSelectedGuideId] = useState(guideId || '')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

  const filteredGuides = visualGuidesData.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedGuide = visualGuidesData.find(g => g.id === selectedGuideId)

  const handleSelectGuide = (id: string) => {
    setSelectedGuideId(id)
    setCurrentStepIndex(0)
    setViewMode('detail')
  }

  const handleNextStep = () => {
    if (selectedGuide && currentStepIndex < selectedGuide.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const handleExportGuide = async (format: 'pdf' | 'markdown') => {
    if (!selectedGuide) return
    
    try {
      await exportVisualGuide(selectedGuide, format)
      toast.success(`Guía exportada correctamente en formato ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Error al exportar la guía')
      console.error(error)
    }
  }

  const categoryColors: Record<string, string> = {
    'Gestión de Proyectos': 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    'Documentos': 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    'Facturación': 'bg-green-500/10 text-green-600 border-green-500/30',
    'Normativa': 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    'Firmas Digitales': 'bg-pink-500/10 text-pink-600 border-pink-500/30',
    'Aprobaciones': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    'Importación/Exportación': 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    'Configuración': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <BookOpen size={24} weight="duotone" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Guías Visuales Paso a Paso</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tutoriales interactivos con capturas de pantalla
                </p>
              </div>
            </div>
            
            {viewMode === 'detail' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <X size={18} />
              </Button>
            )}
          </div>

          {viewMode === 'list' && (
            <div className="mt-4 flex items-center gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Buscar guías por título, categoría o etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          )}
        </DialogHeader>

        {viewMode === 'list' && (
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {filteredGuides.length === 0 ? (
                <div className="text-center py-12">
                  <MagnifyingGlass size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron guías</h3>
                  <p className="text-muted-foreground">
                    Intenta con otros términos de búsqueda
                  </p>
                </div>
              ) : (
                <>
                  {Object.entries(
                    filteredGuides.reduce((acc, guide) => {
                      if (!acc[guide.category]) acc[guide.category] = []
                      acc[guide.category].push(guide)
                      return acc
                    }, {} as Record<string, typeof filteredGuides>)
                  ).map(([category, guides]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Badge variant="outline" className={cn("border", categoryColors[category])}>
                          {category}
                        </Badge>
                        <span className="text-muted-foreground text-sm font-normal">
                          ({guides.length} {guides.length === 1 ? 'guía' : 'guías'})
                        </span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {guides.map(guide => (
                          <Card 
                            key={guide.id}
                            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                            onClick={() => handleSelectGuide(guide.id)}
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <CardTitle className="text-base mb-1 flex items-center gap-2">
                                    <Camera size={18} weight="duotone" className="text-primary" />
                                    {guide.title}
                                  </CardTitle>
                                  <CardDescription className="text-sm">
                                    {guide.description}
                                  </CardDescription>
                                </div>
                                <Badge variant="secondary" className="shrink-0">
                                  {guide.steps.length} pasos
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {guide.tags.slice(0, 4).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {guide.tags.length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{guide.tags.length - 4}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ListNumbers size={14} />
                                <span>Dificultad: {guide.difficulty === 'beginner' ? 'Principiante' : guide.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}</span>
                                {guide.estimatedTime && (
                                  <>
                                    <span>•</span>
                                    <span>~{guide.estimatedTime}</span>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </ScrollArea>
        )}

        {viewMode === 'detail' && selectedGuide && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{selectedGuide.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedGuide.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportGuide('pdf')}
                  >
                    <FilePdf size={16} className="mr-2" weight="duotone" />
                    Exportar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportGuide('markdown')}
                  >
                    <FileDoc size={16} className="mr-2" weight="duotone" />
                    Exportar MD
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={cn("border", categoryColors[selectedGuide.category])}>
                  {selectedGuide.category}
                </Badge>
                <Badge variant="secondary">
                  Paso {currentStepIndex + 1} de {selectedGuide.steps.length}
                </Badge>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / selectedGuide.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              {selectedGuide.steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "transition-all duration-300",
                    index === currentStepIndex ? "block" : "hidden"
                  )}
                >
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-lg shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {step.screenshot && (
                      <Card className="overflow-hidden border-2">
                        <div className="bg-muted/30 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Camera size={20} weight="duotone" className="text-primary" />
                            <span className="text-sm font-semibold">Captura de Pantalla</span>
                          </div>
                          <div className="bg-background rounded-lg border-2 border-dashed p-8 min-h-[400px] flex items-center justify-center">
                            <div className="text-center">
                              <Camera size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Vista previa de pantalla
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {step.screenshot.description}
                              </p>
                              {step.screenshot.highlights && step.screenshot.highlights.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                  {step.screenshot.highlights.map((highlight, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      → {highlight}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {step.actions && step.actions.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Check size={20} weight="bold" className="text-green-600" />
                            Acciones a Realizar
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ol className="space-y-3">
                            {step.actions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="flex-1 leading-relaxed">{action}</span>
                              </li>
                            ))}
                          </ol>
                        </CardContent>
                      </Card>
                    )}

                    {step.tips && step.tips.length > 0 && (
                      <Card className="border-yellow-500/30 bg-yellow-500/5">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb size={20} weight="duotone" className="text-yellow-600" />
                            Consejos Útiles
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-yellow-600 mt-1">•</span>
                                <span className="flex-1 text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {step.warnings && step.warnings.length > 0 && (
                      <Card className="border-red-500/30 bg-red-500/5">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Warning size={20} weight="duotone" className="text-red-600" />
                            Advertencias Importantes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.warnings.map((warning, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">⚠</span>
                                <span className="flex-1 text-sm font-medium">{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {step.notes && step.notes.length > 0 && (
                      <Card className="border-blue-500/30 bg-blue-500/5">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Info size={20} weight="duotone" className="text-blue-600" />
                            Notas Adicionales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {step.notes.map((note, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">ℹ</span>
                                <span className="flex-1 text-sm">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {step.relatedGuides && step.relatedGuides.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Guías Relacionadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {step.relatedGuides.map((guideId, idx) => {
                              const relatedGuide = visualGuidesData.find(g => g.id === guideId)
                              return relatedGuide ? (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSelectGuide(guideId)}
                                >
                                  <BookOpen size={14} className="mr-2" />
                                  {relatedGuide.title}
                                </Button>
                              ) : null
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="px-6 py-4 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                >
                  <CaretLeft size={18} weight="bold" className="mr-2" />
                  Paso Anterior
                </Button>

                <div className="flex items-center gap-2">
                  {selectedGuide.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentStepIndex 
                          ? "bg-primary w-8" 
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      )}
                    />
                  ))}
                </div>

                <Button
                  variant="default"
                  onClick={handleNextStep}
                  disabled={currentStepIndex === selectedGuide.steps.length - 1}
                >
                  Siguiente Paso
                  <CaretRight size={18} weight="bold" className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
