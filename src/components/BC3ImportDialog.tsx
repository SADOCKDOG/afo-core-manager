import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Upload, FileArrowDown, Globe, CheckCircle, Warning, Spinner, Database, TrendUp, Package, Info } from '@phosphor-icons/react'
import { importBC3FromFile, validateBC3File, BC3ParseResult } from '@/lib/bc3-parser'
import { BudgetPrice } from '@/lib/types'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface BC3ImportDialogProps {
  trigger?: React.ReactNode | null
  embedded?: boolean
}

export function BC3ImportDialog({ trigger, embedded = false }: BC3ImportDialogProps) {
  const [priceDatabase, setPriceDatabase] = useKV<BudgetPrice[]>('price-database', [])
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<BC3ParseResult | null>(null)
  const [onlineUrl, setOnlineUrl] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = async (selectedFile: File | null) => {
    if (!selectedFile) return

    const validation = validateBC3File(selectedFile)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    setFile(selectedFile)
    setLoading(true)

    try {
      const result = await importBC3FromFile(selectedFile)
      setPreview(result)
      toast.success('Archivo BC3 analizado correctamente', {
        description: `${result.metadata.totalPrices} precios y ${result.metadata.totalItems} partidas detectados`
      })
    } catch (error) {
      console.error('Error al importar BC3:', error)
      toast.error(error instanceof Error ? error.message : 'Error al procesar el archivo BC3')
      setFile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleImport = () => {
    if (!preview) return

    const existingCodes = new Set((priceDatabase || []).map(p => p.code))
    const newPrices = preview.prices.filter(p => !existingCodes.has(p.code))
    
    setPriceDatabase(current => [...(current || []), ...newPrices])
    
    toast.success('Base de precios importada correctamente', {
      description: `${newPrices.length} nuevos precios añadidos${preview.prices.length - newPrices.length > 0 ? ` (${preview.prices.length - newPrices.length} duplicados omitidos)` : ''}`
    })
    
    handleReset()
    if (!embedded) {
      setOpen(false)
    }
  }

  const handleOnlineImport = async () => {
    if (!onlineUrl.trim()) {
      toast.error('Introduce una URL válida')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(onlineUrl)
      if (!response.ok) throw new Error('Error al descargar el archivo')
      
      const blob = await response.blob()
      const file = new File([blob], 'imported.bc3', { type: 'application/octet-stream' })
      await handleFileChange(file)
    } catch (error) {
      toast.error('No se pudo descargar el archivo desde la URL proporcionada')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setOnlineUrl('')
  }

  const renderContent = () => (
    <Tabs defaultValue="file" className="flex-1 flex flex-col overflow-hidden">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="file" className="gap-2">
          <Upload size={18} />
          Archivo Local
        </TabsTrigger>
        <TabsTrigger value="online" className="gap-2">
          <Globe size={18} />
          Base Online
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file" className="space-y-4 flex-1 overflow-auto mt-4">
        {!preview ? (
          <div className="space-y-4">
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-12 text-center transition-all
                ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border'}
                ${!loading && 'cursor-pointer hover:border-primary hover:bg-muted/50'}
              `}
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onClick={() => !loading && document.getElementById('bc3-file-input')?.click()}
            >
              <input
                id="bc3-file-input"
                type="file"
                accept=".bc3,.BC3"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                disabled={loading}
              />

              {loading ? (
                <div className="space-y-3">
                  <Spinner size={56} className="mx-auto animate-spin text-primary" weight="bold" />
                  <p className="text-lg font-medium">Procesando archivo BC3...</p>
                  <p className="text-sm text-muted-foreground">Esto puede tardar unos segundos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload size={56} className="mx-auto text-primary" weight="duotone" />
                  <div>
                    <p className="text-lg font-semibold mb-1">Arrastra un archivo BC3 aquí</p>
                    <p className="text-sm text-muted-foreground">o haz clic para seleccionar desde tu ordenador</p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span>Formato: .BC3</span>
                    <span>•</span>
                    <span>Tamaño máximo: 50 MB</span>
                  </div>
                </div>
              )}
            </div>

            <Alert>
              <Info size={18} />
              <AlertDescription>
                <p className="font-semibold mb-2">Sobre el formato BC3</p>
                <p className="text-sm">
                  El formato BC3 es el estándar FIEBDC-3 utilizado en España para el intercambio de bases de precios 
                  y presupuestos de construcción. Compatible con PRESTO, Arquímedes, TCQ, CYPE y otras aplicaciones del sector.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-primary/20 p-6 bg-primary/5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold mb-1">{preview.metadata.title || file?.name}</h4>
                  {preview.metadata.author && (
                    <p className="text-sm text-muted-foreground">Autor: {preview.metadata.author}</p>
                  )}
                  {preview.metadata.format && (
                    <p className="text-sm text-muted-foreground">Formato: {preview.metadata.format}</p>
                  )}
                  {preview.metadata.description && (
                    <p className="text-sm text-muted-foreground mt-2">{preview.metadata.description}</p>
                  )}
                </div>
                <CheckCircle size={40} className="text-green-500 flex-shrink-0" weight="fill" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-background border">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={20} className="text-primary" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Precios</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{preview.metadata.totalPrices}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendUp size={20} className="text-blue-500" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Partidas</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{preview.metadata.totalItems}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border">
                  <p className="text-xs text-muted-foreground mb-1">Capítulos</p>
                  <p className="text-2xl font-bold">{preview.metadata.chapters}</p>
                </div>
                <div className="p-3 rounded-lg bg-background border">
                  <p className="text-xs text-muted-foreground mb-1">Unidades</p>
                  <p className="text-2xl font-bold">{preview.metadata.units}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold">Vista Previa de Precios</Label>
              <ScrollArea className="h-[400px] rounded-lg border">
                <div className="p-4 space-y-2">
                  {preview.prices.slice(0, 50).map((price, index) => (
                    <motion.div
                      key={price.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-primary">{price.code}</span>
                            <Badge variant="outline" className="text-xs">
                              {price.unit.toUpperCase()}
                            </Badge>
                            {price.type !== 'unit' && (
                              <Badge variant="secondary" className="text-xs">
                                {price.type === 'material' && 'Material'}
                                {price.type === 'labor' && 'M.O.'}
                                {price.type === 'machinery' && 'Maquinaria'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{price.description}</p>
                        </div>
                        <span className="text-sm font-bold whitespace-nowrap text-primary">
                          {price.unitPrice.toFixed(2)} €
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {preview.prices.length > 50 && (
                    <div className="text-sm text-muted-foreground text-center py-3 bg-muted/30 rounded">
                      Y {preview.prices.length - 50} precios más...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleImport} className="flex-1 gap-2 bg-primary">
                <CheckCircle size={20} weight="fill" />
                Importar a Base de Datos
              </Button>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="online" className="space-y-4 flex-1 overflow-auto mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="online-url">URL de Base de Precios BC3</Label>
            <div className="flex gap-2">
              <Input
                id="online-url"
                type="url"
                placeholder="https://ejemplo.com/base-precios.bc3"
                value={onlineUrl}
                onChange={(e) => setOnlineUrl(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button 
                onClick={handleOnlineImport} 
                disabled={!onlineUrl.trim() || loading}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size={18} className="animate-spin" />
                    Descargando
                  </>
                ) : (
                  <>
                    <FileArrowDown size={18} />
                    Descargar
                  </>
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <Globe size={18} />
            <AlertDescription>
              <p className="font-semibold mb-3">Bases de Precios Online Recomendadas</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground">BEDEC (ITeC)</p>
                  <p className="text-muted-foreground">Base de datos del Instituto de Tecnología de la Construcción de Cataluña</p>
                  <a href="https://itec.cat/bedec/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                    https://itec.cat/bedec/
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground">PREOC</p>
                  <p className="text-muted-foreground">Precios de la edificación en Galicia</p>
                  <a href="https://www.preoc.es/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                    https://www.preoc.es/
                  </a>
                </div>
                <div>
                  <p className="font-semibold text-foreground">BPHU</p>
                  <p className="text-muted-foreground">Base de Precios de la Edificación del País Vasco</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">BASE</p>
                  <p className="text-muted-foreground">Banco estructurado de precios de Navarra</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
            <h4 className="font-semibold">Instrucciones de Uso</h4>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Accede a una base de precios online (BEDEC, PREOC, etc.)</li>
              <li>Busca y selecciona las partidas que necesites para tu proyecto</li>
              <li>Exporta la selección en formato BC3 (FIEBDC-3)</li>
              <li>Si la plataforma permite descarga directa, copia la URL del archivo</li>
              <li>Pega la URL en el campo superior y haz clic en "Descargar"</li>
            </ol>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )

  if (embedded || trigger === null) {
    return renderContent()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database size={28} weight="duotone" className="text-primary" />
            Importar Base de Precios BC3
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Importa bases de precios en formato FIEBDC-3 (BC3) desde archivo local o URL
          </p>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
