import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sparkle, 
  MagnifyingGlass,
  Plus,
  Trash,
  Calculator,
  CheckCircle,
  Lightning,
  Database,
  Info,
  Package,
  Wrench,
  Gear,
  Warning
} from '@phosphor-icons/react'
import { Budget, BudgetItem, BudgetPrice, Project } from '@/lib/types'
import { calculateBudgetTotals } from '@/lib/budget-utils'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AutomatedBudgetGeneratorProps {
  projectId: string
  projectTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onBudgetGenerated?: () => void
}

interface SelectedPrice {
  price: BudgetPrice
  quantity: number
  chapter?: string
}

interface BudgetTemplate {
  id: string
  name: string
  description: string
  buildingType: 'vivienda-unifamiliar' | 'vivienda-colectiva' | 'rehabilitacion' | 'ampliacion' | 'local'
  categories: {
    name: string
    codes: string[]
  }[]
}

const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'vivienda-unifamiliar',
    name: 'Vivienda Unifamiliar',
    description: 'Plantilla para construcción de vivienda unifamiliar nueva',
    buildingType: 'vivienda-unifamiliar',
    categories: [
      { name: 'Movimiento de tierras', codes: ['ADL', 'ADD', 'ADE'] },
      { name: 'Cimentación', codes: ['C', 'CAP', 'CZE', 'CZS'] },
      { name: 'Estructura', codes: ['E', 'EHP', 'EHM', 'EHV', 'EAM'] },
      { name: 'Albañilería', codes: ['E07', 'E08', 'E09'] },
      { name: 'Revestimientos', codes: ['E10', 'E11', 'E12'] },
      { name: 'Carpintería', codes: ['E13', 'E14', 'E15'] },
      { name: 'Instalaciones', codes: ['E16', 'E17', 'E18', 'E19', 'E20'] }
    ]
  },
  {
    id: 'rehabilitacion',
    name: 'Rehabilitación Integral',
    description: 'Plantilla para rehabilitación completa de edificio existente',
    buildingType: 'rehabilitacion',
    categories: [
      { name: 'Demoliciones', codes: ['D', 'DDM', 'DDT'] },
      { name: 'Refuerzo estructural', codes: ['ERE', 'ERH'] },
      { name: 'Albañilería', codes: ['E07', 'E08'] },
      { name: 'Revestimientos', codes: ['E10', 'E11'] },
      { name: 'Carpintería', codes: ['E13', 'E14'] },
      { name: 'Instalaciones', codes: ['E16', 'E17', 'E18'] }
    ]
  }
]

export function AutomatedBudgetGenerator({ 
  projectId, 
  projectTitle, 
  open, 
  onOpenChange,
  onBudgetGenerated 
}: AutomatedBudgetGeneratorProps) {
  const [priceDatabase] = useKV<BudgetPrice[]>('price-database', [])
  const [budgets, setBudgets] = useKV<Budget[]>('budgets', [])
  
  const [budgetName, setBudgetName] = useState(`Presupuesto ${projectTitle}`)
  const [budgetDescription, setBudgetDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedPrices, setSelectedPrices] = useState<SelectedPrice[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentChapter, setCurrentChapter] = useState('01')
  const [chapterName, setChapterName] = useState('Capítulo 01')
  const [useAI, setUseAI] = useState(false)
  const [aiPrompt, setAIPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredPrices = useMemo(() => {
    if (!priceDatabase || priceDatabase.length === 0) return []
    
    let filtered = priceDatabase
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.code.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [priceDatabase, searchQuery])

  const estimatedTotal = useMemo(() => {
    const pem = selectedPrices.reduce((sum, sp) => 
      sum + (sp.price.unitPrice * sp.quantity), 0
    )
    const totals = calculateBudgetTotals([
      { 
        id: 'temp', 
        code: '00', 
        type: 'unit', 
        description: 'temp', 
        totalPrice: pem, 
        order: 0 
      }
    ])
    return totals
  }, [selectedPrices])

  const handleAddPrice = (price: BudgetPrice) => {
    setSelectedPrices(prev => [...prev, { 
      price, 
      quantity: 1,
      chapter: currentChapter 
    }])
    toast.success('Precio añadido al presupuesto')
  }

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setSelectedPrices(prev => prev.map((sp, i) => 
      i === index ? { ...sp, quantity: Math.max(0, quantity) } : sp
    ))
  }

  const handleRemovePrice = (index: number) => {
    setSelectedPrices(prev => prev.filter((_, i) => i !== index))
  }

  const handleApplyTemplate = (templateId: string) => {
    const template = BUDGET_TEMPLATES.find(t => t.id === templateId)
    if (!template || !priceDatabase) return

    toast.info('Aplicando plantilla...', { description: 'Buscando precios compatibles' })

    const newPrices: SelectedPrice[] = []
    template.categories.forEach((category, catIndex) => {
      const chapterCode = String(catIndex + 1).padStart(2, '0')
      
      category.codes.forEach(codePrefix => {
        const matchingPrices = priceDatabase.filter(p => 
          p.code.toUpperCase().startsWith(codePrefix.toUpperCase())
        )
        
        matchingPrices.slice(0, 3).forEach(price => {
          newPrices.push({
            price,
            quantity: 1,
            chapter: chapterCode
          })
        })
      })
    })

    if (newPrices.length > 0) {
      setSelectedPrices(newPrices)
      toast.success(`Plantilla aplicada: ${newPrices.length} partidas añadidas`)
    } else {
      toast.error('No se encontraron precios compatibles con la plantilla')
    }
  }

  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Introduce una descripción del proyecto')
      return
    }

    setIsGenerating(true)
    
    try {
      const priceList = priceDatabase?.slice(0, 100).map(p => 
        `${p.code}: ${p.description} (${p.unitPrice.toFixed(2)}€/${p.unit})`
      ).join('\n') || ''

      const promptText = `Eres un experto en presupuestos de construcción. 

Descripción del proyecto: ${aiPrompt}

Base de precios disponible (primeros 100):
${priceList}

Genera una lista de partidas recomendadas para este proyecto. Para cada partida, proporciona:
- Código de la base de precios (debe coincidir exactamente con uno de los códigos listados)
- Cantidad estimada
- Capítulo (número de 01 a 10)

Devuelve SOLO un JSON válido con este formato:
{
  "items": [
    {
      "code": "CODIGO_EXACTO_DE_LA_BASE",
      "quantity": 100,
      "chapter": "01"
    }
  ]
}`

      const response = await spark.llm(promptText, 'gpt-4o', true)
      const result = JSON.parse(response)
      
      if (!result.items || !Array.isArray(result.items)) {
        throw new Error('Respuesta inválida de la IA')
      }

      const newPrices: SelectedPrice[] = []
      result.items.forEach((item: any) => {
        const price = priceDatabase?.find(p => p.code === item.code)
        if (price) {
          newPrices.push({
            price,
            quantity: item.quantity || 1,
            chapter: item.chapter || '01'
          })
        }
      })

      if (newPrices.length > 0) {
        setSelectedPrices(newPrices)
        toast.success(`IA ha generado ${newPrices.length} partidas`, {
          description: 'Revisa y ajusta las cantidades según necesites'
        })
      } else {
        toast.warning('La IA no pudo encontrar partidas compatibles', {
          description: 'Intenta con una descripción más detallada'
        })
      }
    } catch (error) {
      console.error('Error en generación con IA:', error)
      toast.error('Error al generar presupuesto con IA', {
        description: 'Revisa la descripción e intenta de nuevo'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateBudget = () => {
    if (selectedPrices.length === 0) {
      toast.error('Añade al menos una partida al presupuesto')
      return
    }

    const chapterMap = new Map<string, BudgetItem[]>()
    
    selectedPrices.forEach((sp, index) => {
      const chapter = sp.chapter || '01'
      if (!chapterMap.has(chapter)) {
        chapterMap.set(chapter, [])
      }
      
      const item: BudgetItem = {
        id: `item-${Date.now()}-${index}`,
        code: sp.price.code,
        type: 'unit',
        description: sp.price.description,
        unit: sp.price.unit,
        quantity: sp.quantity,
        unitPrice: sp.price.unitPrice,
        totalPrice: sp.price.unitPrice * sp.quantity,
        order: index
      }
      
      chapterMap.get(chapter)!.push(item)
    })

    const items: BudgetItem[] = []
    let orderCounter = 0
    
    Array.from(chapterMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([chapterCode, chapterItems]) => {
        const chapterTotal = chapterItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
        
        const chapter: BudgetItem = {
          id: `chapter-${chapterCode}-${Date.now()}`,
          code: chapterCode,
          type: 'chapter',
          description: `Capítulo ${chapterCode}`,
          totalPrice: chapterTotal,
          children: chapterItems,
          order: orderCounter++
        }
        
        items.push(chapter)
      })

    const totals = calculateBudgetTotals(items)

    const newBudget: Budget = {
      id: Date.now().toString(),
      projectId,
      name: budgetName || `Presupuesto ${projectTitle}`,
      description: budgetDescription,
      version: '1.0',
      items,
      ...totals,
      percentageGG: 13,
      percentageBI: 6,
      percentageIVA: 21,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft'
    }

    setBudgets(current => [...(current || []), newBudget])
    
    toast.success('Presupuesto generado correctamente', {
      description: `${items.length} capítulos, ${selectedPrices.length} partidas - Total: ${totals.totalPresupuesto.toFixed(2)}€`
    })

    setSelectedPrices([])
    setBudgetName(`Presupuesto ${projectTitle}`)
    setBudgetDescription('')
    onOpenChange(false)
    onBudgetGenerated?.()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'material': return <Package size={16} className="text-blue-500" weight="duotone" />
      case 'labor': return <Wrench size={16} className="text-green-500" weight="duotone" />
      case 'machinery': return <Gear size={16} className="text-orange-500" weight="duotone" />
      default: return <Package size={16} className="text-muted-foreground" weight="duotone" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Lightning size={32} weight="duotone" className="text-accent" />
            Generación Automática de Presupuesto
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Genera presupuestos rápidamente usando tu base de precios BC3 importada
          </p>
        </DialogHeader>

        {!priceDatabase || priceDatabase.length === 0 ? (
          <Alert className="border-warning/50 bg-warning/10">
            <Warning size={18} className="text-warning" />
            <AlertDescription>
              <p className="font-semibold mb-2">Base de precios vacía</p>
              <p className="text-sm">
                Necesitas importar una base de precios BC3 primero. Ve a Herramientas → Gestión de Base de Precios → Importar BC3
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="manual" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="gap-2">
                <Database size={18} />
                Manual
              </TabsTrigger>
              <TabsTrigger value="template" className="gap-2">
                <CheckCircle size={18} />
                Plantilla
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkle size={18} />
                IA Automática
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="flex-1 flex flex-col overflow-hidden space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Presupuesto</Label>
                  <Input
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    placeholder="Presupuesto de Ejecución Material"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capítulo Actual</Label>
                  <Input
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    placeholder="Capítulo 01 - Movimiento de tierras"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción (opcional)</Label>
                <Textarea
                  value={budgetDescription}
                  onChange={(e) => setBudgetDescription(e.target.value)}
                  placeholder="Descripción adicional del presupuesto"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label>Base de Precios ({priceDatabase.length})</Label>
                    <Badge variant="secondary">{filteredPrices.length} resultados</Badge>
                  </div>
                  
                  <div className="relative">
                    <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar precios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="flex-1 rounded-lg border">
                    <div className="p-3 space-y-2">
                      {filteredPrices.map((price, index) => (
                        <motion.div
                          key={price.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(index * 0.01, 0.2) }}
                          className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all border border-transparent hover:border-primary/20 group cursor-pointer"
                          onClick={() => handleAddPrice(price)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {getTypeIcon(price.type)}
                                <span className="font-mono text-xs font-bold">{price.code}</span>
                                <Badge variant="outline" className="text-xs">{price.unit}</Badge>
                              </div>
                              <p className="text-sm line-clamp-2">{price.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm font-bold text-primary whitespace-nowrap">
                                {price.unitPrice.toFixed(2)} €
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddPrice(price)
                                }}
                              >
                                <Plus size={14} weight="bold" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredPrices.length === 0 && (
                        <div className="text-center py-12">
                          <MagnifyingGlass size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'No se encontraron resultados' : 'Introduce un término de búsqueda'}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <Label>Partidas Seleccionadas</Label>
                    <Badge variant="default">{selectedPrices.length} partidas</Badge>
                  </div>

                  <ScrollArea className="flex-1 rounded-lg border">
                    <div className="p-3 space-y-2">
                      <AnimatePresence mode="popLayout">
                        {selectedPrices.map((sp, index) => (
                          <motion.div
                            key={`${sp.price.id}-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {getTypeIcon(sp.price.type)}
                                  <span className="font-mono text-xs font-bold">{sp.price.code}</span>
                                  <Badge variant="outline" className="text-xs">Cap. {sp.chapter}</Badge>
                                </div>
                                <p className="text-sm mb-2">{sp.price.description}</p>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={sp.quantity}
                                    onChange={(e) => handleUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                                    className="w-24 h-8 text-sm"
                                    min="0"
                                    step="0.01"
                                  />
                                  <span className="text-xs text-muted-foreground">× {sp.price.unitPrice.toFixed(2)}€</span>
                                  <span className="text-sm font-bold text-primary ml-auto">
                                    = {(sp.price.unitPrice * sp.quantity).toFixed(2)} €
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemovePrice(index)}
                              >
                                <Trash size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {selectedPrices.length === 0 && (
                        <div className="text-center py-16">
                          <Calculator size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" weight="duotone" />
                          <p className="text-sm text-muted-foreground mb-2">
                            No hay partidas seleccionadas
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Haz clic en los precios de la izquierda para añadirlos
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {selectedPrices.length > 0 && (
                    <div className="p-4 rounded-lg bg-muted border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>PEM Estimado:</span>
                        <span className="font-semibold">{estimatedTotal.totalPEM.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>GG + BI (19%):</span>
                        <span>{(estimatedTotal.totalGG + estimatedTotal.totalBI).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IVA (21%):</span>
                        <span>{estimatedTotal.totalIVA.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                        <span>Total:</span>
                        <span>{estimatedTotal.totalPresupuesto.toFixed(2)} €</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template" className="flex-1 flex flex-col overflow-hidden space-y-4 mt-4">
              <Alert>
                <Info size={18} />
                <AlertDescription>
                  <p className="font-semibold mb-2">Plantillas de Presupuesto</p>
                  <p className="text-sm">
                    Selecciona una plantilla predefinida que buscará automáticamente partidas compatibles en tu base de precios
                  </p>
                </AlertDescription>
              </Alert>

              <ScrollArea className="flex-1">
                <div className="grid gap-4 p-1">
                  {BUDGET_TEMPLATES.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "p-6 rounded-lg border-2 transition-all cursor-pointer hover:border-primary",
                        selectedTemplate === template.id ? "border-primary bg-primary/5" : "border-border"
                      )}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-1">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <CheckCircle size={24} className="text-primary" weight="fill" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Categorías incluidas:</Label>
                        <div className="flex flex-wrap gap-2">
                          {template.categories.map((cat, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedTemplate === template.id && (
                        <Button
                          className="w-full mt-4 gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApplyTemplate(template.id)
                          }}
                        >
                          <Lightning size={18} weight="fill" />
                          Aplicar Plantilla
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 flex flex-col overflow-hidden space-y-4 mt-4">
              <Alert>
                <Sparkle size={18} className="text-accent" />
                <AlertDescription>
                  <p className="font-semibold mb-2">Generación Inteligente con IA</p>
                  <p className="text-sm">
                    Describe tu proyecto y la IA seleccionará automáticamente las partidas más relevantes de tu base de precios BC3
                  </p>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Descripción del Proyecto</Label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAIPrompt(e.target.value)}
                    placeholder="Ejemplo: Construcción de vivienda unifamiliar de 150m2 en dos plantas, estructura de hormigón, cubierta inclinada de teja, revestimientos de gres porcelánico..."
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleAIGeneration}
                  disabled={isGenerating || !aiPrompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Sparkle size={20} className="animate-pulse" weight="fill" />
                      Generando con IA...
                    </>
                  ) : (
                    <>
                      <Sparkle size={20} weight="fill" />
                      Generar Presupuesto con IA
                    </>
                  )}
                </Button>

                {selectedPrices.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted border">
                    <p className="text-sm font-semibold mb-2">
                      ✓ La IA ha generado {selectedPrices.length} partidas
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Revisa las cantidades en la pestaña "Manual" antes de generar el presupuesto
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {priceDatabase && priceDatabase.length > 0 && (
              <>
                Base de precios: {priceDatabase.length} precios disponibles
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleGenerateBudget}
              disabled={selectedPrices.length === 0}
            >
              <Lightning size={20} weight="fill" />
              Generar Presupuesto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
