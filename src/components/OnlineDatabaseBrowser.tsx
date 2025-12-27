import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Globe, MagnifyingGlass, CheckCircle, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { BudgetPrice } from '@/lib/types'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface OnlineDatabaseBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportPrices: (prices: BudgetPrice[]) => void
}

interface OnlineDatabase {
  id: string
  name: string
  description: string
  region: string
  url: string
  format: 'bc3' | 'api' | 'web'
  status: 'available' | 'coming-soon'
}

const ONLINE_DATABASES: OnlineDatabase[] = [
  {
    id: 'bedec',
    name: 'BEDEC (ITeC)',
    description: 'Base de datos de elementos constructivos del Instituto de Tecnología de la Construcción de Cataluña',
    region: 'Cataluña',
    url: 'https://itec.cat/bedec/',
    format: 'bc3',
    status: 'available'
  },
  {
    id: 'preoc',
    name: 'PREOC',
    description: 'Base de precios de la edificación del Colegio Oficial de Arquitectos de Galicia',
    region: 'Galicia',
    url: 'https://www.preoc.es/',
    format: 'bc3',
    status: 'available'
  },
  {
    id: 'base',
    name: 'BASE',
    description: 'Banco estructurado de precios de la construcción de Navarra',
    region: 'Navarra',
    url: 'https://www.base.navarra.es/',
    format: 'bc3',
    status: 'available'
  },
  {
    id: 'bphu',
    name: 'BPHU',
    description: 'Base de Precios de la Edificación del País Vasco',
    region: 'País Vasco',
    url: 'http://www.euskadi.eus/bphu/',
    format: 'bc3',
    status: 'available'
  },
  {
    id: 'preciocentro',
    name: 'Preciocentro',
    description: 'Base de precios de la construcción de referencia en España',
    region: 'Nacional',
    url: 'https://preciocentro.com/',
    format: 'web',
    status: 'available'
  },
  {
    id: 'cype',
    name: 'Generador de Precios CYPE',
    description: 'Generador de precios de construcción con más de 70,000 partidas',
    region: 'Nacional',
    url: 'http://www.generadordeprecios.info/',
    format: 'bc3',
    status: 'available'
  },
  {
    id: 'construmatica',
    name: 'Construmática',
    description: 'Portal de construcción con base de precios y recursos técnicos',
    region: 'Nacional',
    url: 'https://www.construmatica.com/construpedia/',
    format: 'web',
    status: 'available'
  },
  {
    id: 'ai-generate',
    name: 'Generación con IA',
    description: 'Genera precios y partidas personalizadas usando inteligencia artificial basada en proyectos similares',
    region: 'Universal',
    url: '',
    format: 'api',
    status: 'coming-soon'
  }
]

export function OnlineDatabaseBrowser({ open, onOpenChange, onImportPrices }: OnlineDatabaseBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDatabase, setSelectedDatabase] = useState<OnlineDatabase | null>(null)
  const [generating, setGenerating] = useState(false)

  const filteredDatabases = ONLINE_DATABASES.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    db.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    db.region.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDatabase = (database: OnlineDatabase) => {
    if (database.status === 'coming-soon') {
      toast.info('Esta funcionalidad estará disponible próximamente')
      return
    }

    if (database.id === 'ai-generate') {
      handleAIGeneration()
      return
    }

    window.open(database.url, '_blank')
    toast.info('Exporta el presupuesto en formato BC3 y usa "Importar BC3" para añadirlo al proyecto')
  }

  const handleAIGeneration = async () => {
    setGenerating(true)
    
    try {
      const promptText = `Genera 10 partidas de presupuesto realistas para un proyecto de vivienda unifamiliar en España. 
      Para cada partida incluye:
      - code: código de partida (formato E##ABC###)
      - description: descripción técnica completa
      - unit: unidad de medida (m, m2, m3, ud, kg, l, h, pa)
      - unitPrice: precio unitario en euros (realista según mercado español 2024)
      - category: categoría de la partida
      - subcategory: subcategoría
      
      Devuelve un JSON con una propiedad "prices" que contenga el array de partidas.`
      
      const prompt = spark.llmPrompt([promptText], promptText)
      const result = await spark.llm(prompt, 'gpt-4o', true)
      const data = JSON.parse(result)
      
      const prices: BudgetPrice[] = data.prices.map((p: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        code: p.code,
        description: p.description,
        unit: p.unit,
        unitPrice: p.unitPrice,
        type: 'unit' as const,
        category: p.category,
        subcategory: p.subcategory,
        lastUpdated: Date.now(),
        source: 'IA - Generación Automática'
      }))
      
      onImportPrices(prices)
      toast.success(`${prices.length} partidas generadas con IA`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Error al generar partidas con IA')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe size={24} />
            Bases de Precios Online
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-db">Buscar base de precios</Label>
            <div className="relative">
              <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-db"
                type="text"
                placeholder="Busca por nombre, región o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Alert>
            <Globe size={18} />
            <AlertDescription>
              <strong>Cómo usar las bases de precios online:</strong>
              <ol className="mt-2 space-y-1 text-sm list-decimal list-inside">
                <li>Selecciona una base de datos de tu región o nacional</li>
                <li>Busca y selecciona las partidas que necesites</li>
                <li>Exporta tu selección en formato BC3</li>
                <li>Vuelve aquí y usa el botón "Importar BC3" para añadirlas a tu presupuesto</li>
              </ol>
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[450px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredDatabases.map((db, index) => (
                <motion.div
                  key={db.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    border rounded-lg p-4 hover:border-primary transition-all cursor-pointer
                    ${db.status === 'coming-soon' ? 'opacity-60' : 'hover:shadow-md'}
                  `}
                  onClick={() => handleOpenDatabase(db)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {db.id === 'ai-generate' ? (
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                          <Sparkle size={20} className="text-white" weight="fill" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Globe size={20} className="text-primary" weight="duotone" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{db.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {db.region}
                        </Badge>
                      </div>
                    </div>
                    {db.status === 'coming-soon' ? (
                      <Badge variant="secondary" className="text-xs">
                        Próximamente
                      </Badge>
                    ) : (
                      <ArrowRight size={20} className="text-muted-foreground" />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {db.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {db.format === 'bc3' ? 'Formato BC3' : 
                       db.format === 'api' ? 'API' : 'Web'}
                    </Badge>
                    {db.status === 'available' && db.id !== 'ai-generate' && (
                      <span className="text-xs text-primary font-medium">
                        Abrir sitio →
                      </span>
                    )}
                    {db.id === 'ai-generate' && db.status === 'coming-soon' && (
                      <span className="text-xs text-muted-foreground font-medium">
                        En desarrollo
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDatabases.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron bases de precios</p>
              </div>
            )}
          </ScrollArea>

          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" weight="fill" />
              Recomendaciones
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>BEDEC (ITeC):</strong> Referencia en Cataluña, actualización continua</li>
              <li>• <strong>Generador CYPE:</strong> Más completo a nivel nacional, interfaz intuitiva</li>
              <li>• <strong>Bases regionales:</strong> Mejor ajuste a precios locales y normativa autonómica</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
