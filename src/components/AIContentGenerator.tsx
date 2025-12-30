import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Sparkle, ArrowsClockwise, Check, Copy, MagicWand, Lightning } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AIContentGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionTitle?: string
  sectionContext?: string
  onGenerate: (content: string) => void
  projectContext?: {
    title?: string
    location?: string
    description?: string
    phase?: string
  }
}

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal y Técnico', description: 'Lenguaje profesional para memorias oficiales' },
  { value: 'descriptive', label: 'Descriptivo', description: 'Explicaciones detalladas y claras' },
  { value: 'concise', label: 'Conciso', description: 'Información directa y resumida' },
  { value: 'normative', label: 'Normativo', description: 'Enfocado en cumplimiento regulatorio' }
]

const LENGTH_OPTIONS = [
  { value: 'brief', label: 'Breve', description: '1-2 párrafos' },
  { value: 'medium', label: 'Media', description: '3-5 párrafos' },
  { value: 'detailed', label: 'Detallada', description: '6+ párrafos con subsecciones' }
]

export function AIContentGenerator({ 
  open, 
  onOpenChange, 
  sectionTitle,
  sectionContext,
  onGenerate,
  projectContext 
}: AIContentGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('formal')
  const [length, setLength] = useState('medium')
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim() && !sectionContext) {
      toast.error('Por favor, proporcione una descripción de lo que necesita')
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')
    setGenerationProgress(0)

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      const contextInfo = projectContext 
        ? `\nContexto del Proyecto:
- Título: ${projectContext.title || 'No especificado'}
- Ubicación: ${projectContext.location || 'No especificado'}
- Descripción: ${projectContext.description || 'No especificado'}
- Fase: ${projectContext.phase || 'No especificado'}`
        : ''

      const toneDescription = TONE_OPTIONS.find(t => t.value === tone)?.description || ''
      const lengthDescription = LENGTH_OPTIONS.find(l => l.value === length)?.description || ''

      const promptText = `Eres un arquitecto profesional español especializado en redacción de documentación técnica arquitectónica.

Sección del Documento: ${sectionTitle || 'Sección personalizada'}
${sectionContext ? `Contenido de plantilla: ${sectionContext}` : ''}
${contextInfo}

Instrucciones del usuario: ${prompt || 'Generar contenido apropiado para esta sección'}

Tono requerido: ${toneDescription}
Longitud requerida: ${lengthDescription}

IMPORTANTE:
- Redacta en español profesional
- Usa terminología arquitectónica precisa
- Incluye referencias normativas cuando sea relevante (CTE, RITE, etc.)
- Estructura el contenido con claridad usando subtítulos si es necesario
- Sé específico y técnico, evita generalidades
- No uses placeholder entre corchetes, proporciona contenido real y completo
- Si hay información específica del proyecto en el contexto, incorpórala
- Mantén un formato profesional apropiado para documentación oficial

Genera el contenido de la sección:`

      const aiPrompt = window.spark.llmPrompt([promptText], promptText)
      const content = await window.spark.llm(aiPrompt, 'gpt-4o')
      setGenerationProgress(100)
      setGeneratedContent(content)
      toast.success('Contenido generado correctamente')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Error al generar contenido. Intente nuevamente.')
    } finally {
      clearInterval(progressInterval)
      setGenerationProgress(0)
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      toast.success('Contenido copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar al portapapeles')
    }
  }

  const handleUseContent = () => {
    if (generatedContent) {
      onGenerate(generatedContent)
      onOpenChange(false)
      setPrompt('')
      setGeneratedContent('')
      setTone('formal')
      setLength('medium')
      toast.success('Contenido aplicado correctamente')
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setPrompt('')
    setGeneratedContent('')
    setTone('formal')
    setLength('medium')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Sparkle size={24} weight="fill" />
            </div>
            Generador de Contenido IA
          </DialogTitle>
          <DialogDescription>
            {sectionTitle 
              ? `Genere contenido profesional para: ${sectionTitle}`
              : 'Genere contenido profesional personalizado para su documento'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 px-6 pb-6 overflow-hidden">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Descripción del Contenido Requerido</Label>
              <Textarea
                id="prompt"
                placeholder="Ej: Describe las características estructurales del edificio, incluyendo cimentación, estructura vertical y horizontal, materiales utilizados y justificación según CTE DB-SE..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Describa lo que necesita incluir en esta sección. Sea específico para obtener mejores resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tono del Documento</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Extensión</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTH_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {projectContext && (
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MagicWand size={20} weight="duotone" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold">Contexto del Proyecto</span>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Lightning size={10} weight="fill" />
                          Auto-detectado
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {projectContext.title && (
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[80px]">Proyecto:</span>
                            <span>{projectContext.title}</span>
                          </div>
                        )}
                        {projectContext.location && (
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[80px]">Ubicación:</span>
                            <span>{projectContext.location}</span>
                          </div>
                        )}
                        {projectContext.phase && (
                          <div className="flex gap-2">
                            <span className="font-medium min-w-[80px]">Fase:</span>
                            <span>{projectContext.phase}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Este contexto se utilizará para personalizar el contenido generado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <ArrowsClockwise size={18} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkle size={18} weight="fill" />
                  Generar Contenido
                </>
              )}
            </Button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Contenido Generado</Label>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    <Copy size={16} />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="gap-2"
                  >
                    <ArrowsClockwise size={16} />
                    Regenerar
                  </Button>
                </div>
              )}
            </div>

            <ScrollArea className="h-[400px] rounded-lg border bg-muted/30 p-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="relative">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Sparkle size={40} weight="fill" className="animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 animate-ping opacity-40"></div>
                  </div>
                  <div className="w-64 space-y-2">
                    <p className="text-sm font-medium text-center animate-pulse">
                      Generando contenido profesional...
                    </p>
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {generationProgress}% completado
                    </p>
                  </div>
                </div>
              ) : generatedContent ? (
                <div className="prose prose-lg max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-base leading-loose text-foreground">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="p-4 rounded-full bg-muted">
                    <Sparkle size={32} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Listo para generar contenido</p>
                    <p className="text-xs text-muted-foreground">
                      Complete los campos y haga clic en "Generar Contenido"
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            {generatedContent && (
              <Button 
                onClick={handleUseContent}
                className="w-full gap-2"
                size="lg"
              >
                <Check size={18} weight="bold" />
                Usar Este Contenido
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
