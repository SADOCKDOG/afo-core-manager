import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Sparkle, 
  CheckCircle, 
  Warning, 
  Info,
  FileText,
  MagnifyingGlass,
  ArrowsClockwise,
  Trash
} from '@phosphor-icons/react'
import { 
  AIClassificationResult, 
  ClassificationContext,
  classifyDocumentWithAI,
  improveClassificationWithBatch,
  getConfidenceBadgeVariant,
  getConfidenceColor
} from '@/lib/ai-document-classifier'
import { DocumentType, DOCUMENT_TYPE_LABELS } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ClassificationItem {
  context: ClassificationContext
  result: AIClassificationResult | null
  isProcessing: boolean
  userOverride?: DocumentType
}

interface AIDocumentClassifierProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contexts: ClassificationContext[]
  onClassificationComplete: (classifications: Array<{
    fileName: string
    type: DocumentType
    confidence: number
    metadata: AIClassificationResult['metadata']
  }>) => void
}

export function AIDocumentClassifier({ 
  open, 
  onOpenChange, 
  contexts,
  onClassificationComplete 
}: AIDocumentClassifierProps) {
  const [items, setItems] = useState<ClassificationItem[]>(
    contexts.map(ctx => ({
      context: ctx,
      result: null,
      isProcessing: false
    }))
  )
  const [isClassifying, setIsClassifying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mode, setMode] = useState<'individual' | 'batch'>('batch')
  const [viewFilter, setViewFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const handleStartClassification = async () => {
    setIsClassifying(true)
    setProgress(0)

    try {
      if (mode === 'batch') {
        const results = await improveClassificationWithBatch(contexts)
        
        setItems(contexts.map((ctx, idx) => ({
          context: ctx,
          result: results[idx] || null,
          isProcessing: false
        })))
        
        setProgress(100)
        toast.success('Clasificación completada', {
          description: `${results.length} documentos clasificados con IA`
        })
      } else {
        for (let i = 0; i < contexts.length; i++) {
          setItems(prev => prev.map((item, idx) => 
            idx === i ? { ...item, isProcessing: true } : item
          ))

          try {
            const result = await classifyDocumentWithAI(contexts[i])
            
            setItems(prev => prev.map((item, idx) => 
              idx === i ? { ...item, result, isProcessing: false } : item
            ))
          } catch (error) {
            console.error(`Error classifying ${contexts[i].fileName}:`, error)
            setItems(prev => prev.map((item, idx) => 
              idx === i ? { ...item, isProcessing: false } : item
            ))
          }

          setProgress(((i + 1) / contexts.length) * 100)
        }

        toast.success('Clasificación completada', {
          description: `${contexts.length} documentos clasificados individualmente`
        })
      }
    } catch (error) {
      console.error('Classification error:', error)
      toast.error('Error en la clasificación', {
        description: 'Por favor, intenta nuevamente'
      })
    } finally {
      setIsClassifying(false)
    }
  }

  const handleReclassifyOne = async (index: number) => {
    setItems(prev => prev.map((item, idx) => 
      idx === index ? { ...item, isProcessing: true } : item
    ))

    try {
      const result = await classifyDocumentWithAI(contexts[index])
      setItems(prev => prev.map((item, idx) => 
        idx === index ? { ...item, result, isProcessing: false } : item
      ))
      toast.success('Documento reclasificado correctamente')
    } catch (error) {
      console.error('Reclassification error:', error)
      toast.error('Error al reclasificar')
      setItems(prev => prev.map((item, idx) => 
        idx === index ? { ...item, isProcessing: false } : item
      ))
    }
  }

  const handleTypeOverride = (index: number, type: DocumentType) => {
    setItems(prev => prev.map((item, idx) => 
      idx === index ? { ...item, userOverride: type } : item
    ))
  }

  const handleClearOverride = (index: number) => {
    setItems(prev => prev.map((item, idx) => 
      idx === index ? { ...item, userOverride: undefined } : item
    ))
  }

  const handleComplete = () => {
    const classifications = items.map(item => ({
      fileName: item.context.fileName,
      type: item.userOverride || item.result?.type || 'otros' as DocumentType,
      confidence: item.result?.confidence || 0,
      metadata: item.result?.metadata || { keywords: [] }
    }))

    onClassificationComplete(classifications)
    onOpenChange(false)
  }

  const filteredItems = items.filter(item => {
    if (viewFilter === 'all') return true
    if (!item.result) return false
    
    const confidence = item.result.confidence
    if (viewFilter === 'high') return confidence >= 80
    if (viewFilter === 'medium') return confidence >= 50 && confidence < 80
    if (viewFilter === 'low') return confidence < 50
    return true
  })

  const stats = {
    total: items.length,
    classified: items.filter(i => i.result !== null).length,
    high: items.filter(i => i.result && i.result.confidence >= 80).length,
    medium: items.filter(i => i.result && i.result.confidence >= 50 && i.result.confidence < 80).length,
    low: items.filter(i => i.result && i.result.confidence < 50).length,
    overrides: items.filter(i => i.userOverride).length
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkle size={24} weight="duotone" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">Clasificación Inteligente de Documentos</DialogTitle>
              <DialogDescription className="mt-1">
                Utiliza IA avanzada para clasificar automáticamente {contexts.length} documentos con alta precisión
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {!isClassifying && stats.classified === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10">
                      <Sparkle size={32} weight="duotone" className="text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Listo para Clasificar</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Selecciona el modo de clasificación y comienza el análisis inteligente
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Tabs value={mode} onValueChange={(v) => setMode(v as 'individual' | 'batch')} className="w-full max-w-md">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="batch">
                          <Sparkle size={16} className="mr-2" weight="duotone" />
                          Análisis en Lote
                        </TabsTrigger>
                        <TabsTrigger value="individual">
                          <FileText size={16} className="mr-2" weight="duotone" />
                          Individual
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="text-xs text-muted-foreground max-w-md">
                      {mode === 'batch' ? (
                        <p>✨ <strong>Recomendado:</strong> Analiza todos los documentos juntos para mejor contexto y precisión</p>
                      ) : (
                        <p>📄 Clasifica cada documento individualmente, ideal para revisión detallada</p>
                      )}
                    </div>

                    <Button
                      size="lg"
                      onClick={handleStartClassification}
                      className="gap-2 mt-2"
                    >
                      <Sparkle size={20} weight="fill" />
                      Iniciar Clasificación con IA
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isClassifying && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkle size={20} className="text-primary animate-spin" weight="duotone" />
                      <span className="font-medium">Clasificando documentos...</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {mode === 'batch' 
                      ? 'Analizando todos los documentos en conjunto para mejor precisión'
                      : `Procesando documento ${Math.ceil((progress / 100) * contexts.length)} de ${contexts.length}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.classified > 0 && (
            <>
              <div className="grid grid-cols-6 gap-3">
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.high}</div>
                      <div className="text-xs text-muted-foreground">Alta Confianza</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
                      <div className="text-xs text-muted-foreground">Media</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{stats.low}</div>
                      <div className="text-xs text-muted-foreground">Baja</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.overrides}</div>
                      <div className="text-xs text-muted-foreground">Ajustadas</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 pb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round((stats.classified / stats.total) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Completado</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex items-center gap-2">
                <Tabs value={viewFilter} onValueChange={(v) => setViewFilter(v as any)} className="flex-1">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
                    <TabsTrigger value="high">Alta ({stats.high})</TabsTrigger>
                    <TabsTrigger value="medium">Media ({stats.medium})</TabsTrigger>
                    <TabsTrigger value="low">Baja ({stats.low})</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-3 pb-4">
                  <AnimatePresence>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.context.fileName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <Card className={cn(
                          "relative overflow-hidden transition-all",
                          item.userOverride && "ring-2 ring-primary"
                        )}>
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText size={18} weight="duotone" className="text-muted-foreground flex-shrink-0" />
                                      <h4 className="font-medium truncate">{item.context.fileName}</h4>
                                    </div>
                                    {item.context.folderPath && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        📁 {item.context.folderPath}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {item.result && (
                                    <Badge variant={getConfidenceBadgeVariant(item.result.confidence)}>
                                      {item.result.confidence}% confianza
                                    </Badge>
                                  )}
                                </div>

                                {item.isProcessing && (
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Sparkle size={16} className="animate-spin" weight="duotone" />
                                    Analizando con IA...
                                  </div>
                                )}

                                {item.result && !item.isProcessing && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Tipo:</span>
                                        <Select
                                          value={item.userOverride || item.result.type}
                                          onValueChange={(v) => handleTypeOverride(items.indexOf(item), v as DocumentType)}
                                        >
                                          <SelectTrigger className="w-[200px] h-8">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                                              <SelectItem key={value} value={value}>
                                                {label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {item.userOverride && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleClearOverride(items.indexOf(item))}
                                          >
                                            <Trash size={14} />
                                          </Button>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                      <Info size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" weight="duotone" />
                                      <p className="text-xs text-muted-foreground flex-1">
                                        {item.result.reasoning}
                                      </p>
                                    </div>

                                    {item.result.metadata.keywords && item.result.metadata.keywords.length > 0 && (
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs text-muted-foreground">Palabras clave:</span>
                                        {item.result.metadata.keywords.map((keyword, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {keyword}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}

                                    {item.result.alternativeTypes.length > 0 && (
                                      <details className="text-xs">
                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                          Ver tipos alternativos ({item.result.alternativeTypes.length})
                                        </summary>
                                        <div className="mt-2 space-y-1 pl-4">
                                          {item.result.alternativeTypes.map((alt, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                              <span>{DOCUMENT_TYPE_LABELS[alt.type]}</span>
                                              <span className="text-muted-foreground">{alt.confidence}%</span>
                                            </div>
                                          ))}
                                        </div>
                                      </details>
                                    )}
                                  </div>
                                )}
                              </div>

                              {item.result && !item.isProcessing && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReclassifyOne(items.indexOf(item))}
                                  className="flex-shrink-0"
                                >
                                  <ArrowsClockwise size={16} />
                                </Button>
                              )}
                            </div>
                          </CardContent>

                          {item.userOverride && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
                              Ajustado manualmente
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {stats.classified > 0 && (
              <>
                {stats.classified} de {stats.total} documentos clasificados
                {stats.overrides > 0 && ` • ${stats.overrides} ajustados manualmente`}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isClassifying}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isClassifying || stats.classified === 0}
              className="gap-2"
            >
              <CheckCircle size={18} weight="duotone" />
              Aplicar Clasificaciones
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
