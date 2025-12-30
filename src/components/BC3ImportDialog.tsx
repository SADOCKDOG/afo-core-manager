import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FileArrowDown, Globe, CheckCircle, Warning, Spinner } from '@phosphor-icons/react'
import { importBC3FromFile, validateBC3File, BC3ParseResult } from '@/lib/bc3-parser'
import { BudgetItem, BudgetPrice } from '@/lib/types'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface BC3ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (items: BudgetItem[], prices: BudgetPrice[], metadata: BC3ParseResult['metadata']) => void
}

export function BC3ImportDialog({ open, onOpenChange, onImport }: BC3ImportDialogProps) {
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
      toast.success('Archivo BC3 analizado correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al procesar el archivo')
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

    onImport(preview.items, preview.prices, preview.metadata)
    toast.success(`Importadas ${preview.items.length} partidas y ${preview.prices.length} precios`)
    
    setFile(null)
    setPreview(null)
    onOpenChange(false)
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
      toast.error('No se pudo descargar el archivo desde la URL')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setOnlineUrl('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileArrowDown size={24} />
            Importar Base de Precios
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">
              <Upload size={18} className="mr-2" />
              Archivo BC3
            </TabsTrigger>
            <TabsTrigger value="online">
              <Globe size={18} className="mr-2" />
              Base Online
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            {!preview ? (
              <div className="space-y-4">
                <div
                  className={`
                    relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
                    ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
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
                    accept=".bc3"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    disabled={loading}
                  />

                  {loading ? (
                    <div className="space-y-3">
                      <Spinner size={48} className="mx-auto animate-spin text-primary" />
                      <p className="text-muted-foreground">Procesando archivo BC3...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload size={48} className="mx-auto text-muted-foreground" weight="duotone" />
                      <div>
                        <p className="font-semibold">Arrastra un archivo BC3 aquí</p>
                        <p className="text-sm text-muted-foreground">o haz clic para seleccionar</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Máximo 50 MB</p>
                    </div>
                  )}
                </div>

                <Alert>
                  <Warning size={18} />
                  <AlertDescription>
                    El formato BC3 es el estándar FIEBDC-3 utilizado en España para el intercambio de bases de precios 
                    y presupuestos de construcción. Compatible con PRESTO, Arquímedes, TCQ y otras aplicaciones del sector.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{preview.metadata.title || file?.name}</h4>
                      {preview.metadata.author && (
                        <p className="text-sm text-muted-foreground">Autor: {preview.metadata.author}</p>
                      )}
                      {preview.metadata.date && (
                        <p className="text-sm text-muted-foreground">Fecha: {preview.metadata.date}</p>
                      )}
                    </div>
                    <CheckCircle size={32} className="text-green-500" weight="fill" />
                  </div>

                  {preview.metadata.description && (
                    <p className="text-sm text-muted-foreground mb-3">{preview.metadata.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded bg-background">
                      <p className="text-2xl font-bold text-primary">{preview.items.length}</p>
                      <p className="text-sm text-muted-foreground">Partidas</p>
                    </div>
                    <div className="p-3 rounded bg-background">
                      <p className="text-2xl font-bold text-primary">{preview.prices.length}</p>
                      <p className="text-sm text-muted-foreground">Precios</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Vista Previa de Partidas</Label>
                  <ScrollArea className="h-[400px] rounded border p-4">
                    <div className="space-y-2">
                      {preview.items.slice(0, 20).map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="p-3 rounded bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-primary font-semibold">{item.code}</span>
                                {item.type === 'chapter' && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                    Capítulo
                                  </span>
                                )}
                              </div>
                              <p className="text-sm truncate">{item.description}</p>
                            </div>
                            {item.totalPrice && (
                              <span className="text-sm font-semibold whitespace-nowrap">
                                {item.totalPrice.toFixed(2)} €
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {preview.items.length > 20 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          Y {preview.items.length - 20} partidas más...
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleImport} className="flex-1 gap-2">
                    <CheckCircle size={18} weight="fill" />
                    Importar Datos
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="online" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="online-url">URL de Base de Precios</Label>
                <div className="flex gap-2">
                  <Input
                    id="online-url"
                    type="url"
                    placeholder="https://ejemplo.com/base-precios.bc3"
                    value={onlineUrl}
                    onChange={(e) => setOnlineUrl(e.target.value)}
                    disabled={loading}
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
                  <p className="font-semibold mb-2">Bases de Precios Online Recomendadas:</p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>BEDEC (ITeC):</strong> Base de datos del Instituto de Tecnología de la Construcción de Cataluña</li>
                    <li>• <strong>PREOC:</strong> Precios de la edificación en Galicia</li>
                    <li>• <strong>BASE:</strong> Banco estructurado de precios de Navarra</li>
                    <li>• <strong>BPHU:</strong> Base de Precios de la Edificación del País Vasco</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4 bg-muted/30 space-y-3">
                <h4 className="font-semibold">Instrucciones</h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Accede a una base de precios online (BEDEC, PREOC, etc.)</li>
                  <li>Busca y selecciona las partidas que necesites</li>
                  <li>Exporta la selección en formato BC3</li>
                  <li>Introduce la URL del archivo BC3 exportado</li>
                  <li>Haz clic en "Descargar" para importar los datos</li>
                </ol>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
