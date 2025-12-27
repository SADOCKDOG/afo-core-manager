import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Gavel, Sparkle, MagnifyingGlass, ListChecks, FileText, BookOpen } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { RegulatoryCode, RegulatoryQuery, REGULATORY_CODES, COMMON_QUERIES } from '@/lib/regulatory-data'
import { interpretRegulatoryCode } from '@/lib/ai-regulatory'
import { marked } from 'marked'
import { motion, AnimatePresence } from 'framer-motion'

interface AIRegulatoryAssistantProps {
  projectId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AIRegulatoryAssistant({ projectId, open, onOpenChange }: AIRegulatoryAssistantProps) {
  const [queryHistory, setQueryHistory] = useKV<RegulatoryQuery[]>('regulatory-queries', [])
  const [currentQuery, setCurrentQuery] = useState('')
  const [selectedCodes, setSelectedCodes] = useState<RegulatoryCode[]>(['cte'])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeQuery, setActiveQuery] = useState<RegulatoryQuery | null>(null)
  const [activeTab, setActiveTab] = useState('query')

  const handleSubmitQuery = async () => {
    if (!currentQuery.trim()) {
      toast.error('Por favor, introduce una consulta')
      return
    }

    if (selectedCodes.length === 0) {
      toast.error('Selecciona al menos un código normativo')
      return
    }

    setIsProcessing(true)

    try {
      const result = await interpretRegulatoryCode(currentQuery, selectedCodes)
      
      const newQuery: RegulatoryQuery = {
        id: Date.now().toString(),
        projectId,
        query: currentQuery,
        codes: selectedCodes,
        timestamp: Date.now(),
        response: result.response,
        references: result.references
      }

      setQueryHistory(currentHistory => [newQuery, ...(currentHistory || [])])
      setActiveQuery(newQuery)
      setCurrentQuery('')
      toast.success('Consulta procesada correctamente')
    } catch (error) {
      console.error('Error processing query:', error)
      toast.error('Error al procesar la consulta')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickQuery = (query: string) => {
    setCurrentQuery(query)
    setActiveTab('query')
  }

  const toggleCode = (code: RegulatoryCode) => {
    setSelectedCodes(current => 
      current.includes(code) 
        ? current.filter(c => c !== code)
        : [...current, code]
    )
  }

  const renderResponse = (response: string) => {
    const html = marked.parse(response)
    return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Gavel size={18} weight="duotone" />
          Asistente Normativo IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Gavel size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Asistente Normativo con IA</DialogTitle>
              <DialogDescription>
                Consulta e interpreta la normativa técnica de edificación española
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="query" className="gap-2">
              <MagnifyingGlass size={16} />
              Nueva Consulta
            </TabsTrigger>
            <TabsTrigger value="quick" className="gap-2">
              <BookOpen size={16} />
              Consultas Rápidas
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <FileText size={16} />
              Historial
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden px-6 pb-6">
            <TabsContent value="query" className="h-full mt-4 flex gap-4">
              <div className="w-2/5 flex flex-col gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tu Consulta</CardTitle>
                    <CardDescription>Describe lo que necesitas verificar o conocer</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      placeholder="Ej: ¿Cuáles son las dimensiones mínimas de escaleras según el CTE?..."
                      className="min-h-[120px] resize-none"
                    />

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Códigos Aplicables</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {(Object.entries(REGULATORY_CODES) as [RegulatoryCode, typeof REGULATORY_CODES[RegulatoryCode]][]).map(([code, info]) => (
                          <div key={code} className="flex items-start gap-2">
                            <Checkbox
                              id={code}
                              checked={selectedCodes.includes(code)}
                              onCheckedChange={() => toggleCode(code)}
                            />
                            <div className="flex-1">
                              <Label
                                htmlFor={code}
                                className="text-sm font-medium cursor-pointer leading-tight"
                              >
                                {info.name}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {info.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full gap-2"
                      onClick={handleSubmitQuery}
                      disabled={isProcessing || !currentQuery.trim()}
                    >
                      {isProcessing ? (
                        <>
                          <Sparkle size={18} className="animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Sparkle size={18} weight="duotone" />
                          Consultar Normativa
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1 flex flex-col">
                <Card className="flex-1 flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">Respuesta</CardTitle>
                    <CardDescription>Interpretación normativa con referencias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                      {activeQuery ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-wrap gap-2 mb-4">
                            {activeQuery.codes.map(code => (
                              <Badge key={code} variant="secondary">
                                {REGULATORY_CODES[code].name}
                              </Badge>
                            ))}
                          </div>

                          <div className="prose prose-sm max-w-none">
                            {renderResponse(activeQuery.response || '')}
                          </div>

                          {activeQuery.references && activeQuery.references.length > 0 && (
                            <div className="mt-6 pt-6 border-t">
                              <h4 className="font-semibold text-sm mb-3">Referencias Normativas</h4>
                              <div className="space-y-3">
                                {activeQuery.references.map((ref, idx) => (
                                  <Card key={idx} className="bg-muted/30">
                                    <CardContent className="p-4">
                                      <div className="flex items-start gap-3">
                                        <Badge 
                                          className="mt-0.5"
                                          style={{ 
                                            backgroundColor: REGULATORY_CODES[ref.code as RegulatoryCode]?.color || 'var(--primary)',
                                            color: 'white'
                                          }}
                                        >
                                          {ref.document || ref.code.toUpperCase()}
                                        </Badge>
                                        <div className="flex-1 space-y-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">{ref.description}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {ref.section}
                                            </Badge>
                                          </div>
                                          <p className="text-xs text-muted-foreground line-clamp-2">
                                            {ref.applicability || ref.content}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                          <div>
                            <Gavel size={48} className="mx-auto mb-3 opacity-20" weight="duotone" />
                            <p className="text-sm">
                              Las respuestas aparecerán aquí
                            </p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="quick" className="h-full mt-4">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  {COMMON_QUERIES.map((category, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          {category.queries.map((query, qIdx) => (
                            <Button
                              key={qIdx}
                              variant="outline"
                              className="justify-start text-left h-auto py-3 px-4"
                              onClick={() => handleQuickQuery(query)}
                            >
                              <div className="flex items-start gap-2 w-full">
                                <MagnifyingGlass size={16} className="mt-0.5 shrink-0" weight="duotone" />
                                <span className="text-sm flex-1">{query}</span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="h-full mt-4">
              <ScrollArea className="h-full">
                {queryHistory && queryHistory.length > 0 ? (
                  <div className="space-y-3 pr-4">
                    {queryHistory.map((query) => (
                      <Card 
                        key={query.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setActiveQuery(query)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                              <FileText size={20} weight="duotone" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm mb-2 line-clamp-2">
                                {query.query}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(query.timestamp).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {query.codes.map(code => (
                                  <Badge key={code} variant="secondary" className="text-xs">
                                    {REGULATORY_CODES[code].name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                    <div>
                      <FileText size={48} className="mx-auto mb-3 opacity-20" weight="duotone" />
                      <p className="text-sm">
                        No hay consultas en el historial
                      </p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
