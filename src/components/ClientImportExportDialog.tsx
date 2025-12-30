import { useState, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Client } from '@/lib/types'
import {
  exportClientsToJSON,
  exportClientsToCSV,
  importClientsFromJSON,
  importClientsFromCSV,
  downloadFile,
  generateClientTemplate,
  ClientImportResult
} from '@/lib/client-import-export'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DownloadSimple,
  UploadSimple,
  FileJs,
  FileCsv,
  CheckCircle,
  WarningCircle,
  X,
  FileArrowDown,
  FileText
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ClientImportExportDialogProps {
  trigger?: React.ReactNode
}

export function ClientImportExportDialog({ trigger }: ClientImportExportDialogProps) {
  const [clients, setClients] = useKV<Client[]>('clients', [])
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [importResult, setImportResult] = useState<ClientImportResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportJSON = () => {
    try {
      const jsonContent = exportClientsToJSON(clients || [])
      const timestamp = new Date().toISOString().split('T')[0]
      downloadFile(
        jsonContent,
        `clientes_${timestamp}.json`,
        'application/json'
      )
      toast.success('Clientes exportados correctamente', {
        description: `${(clients || []).length} clientes exportados a JSON`
      })
    } catch (error) {
      toast.error('Error al exportar clientes', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleExportCSV = () => {
    try {
      const csvContent = exportClientsToCSV(clients || [])
      const timestamp = new Date().toISOString().split('T')[0]
      downloadFile(
        csvContent,
        `clientes_${timestamp}.csv`,
        'text/csv;charset=utf-8;'
      )
      toast.success('Clientes exportados correctamente', {
        description: `${(clients || []).length} clientes exportados a CSV`
      })
    } catch (error) {
      toast.error('Error al exportar clientes', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleDownloadTemplate = (format: 'json' | 'csv') => {
    try {
      const templateContent = generateClientTemplate(format)
      const extension = format === 'json' ? 'json' : 'csv'
      const mimeType = format === 'json' ? 'application/json' : 'text/csv;charset=utf-8;'
      
      downloadFile(
        templateContent,
        `plantilla_clientes.${extension}`,
        mimeType
      )
      toast.success('Plantilla descargada', {
        description: `Plantilla de ejemplo en formato ${format.toUpperCase()}`
      })
    } catch (error) {
      toast.error('Error al descargar plantilla', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setImportResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let result: ClientImportResult

        if (file.name.endsWith('.json')) {
          result = importClientsFromJSON(content, clients || [])
        } else if (file.name.endsWith('.csv')) {
          result = importClientsFromCSV(content, clients || [])
        } else {
          toast.error('Formato de archivo no soportado', {
            description: 'Solo se permiten archivos JSON y CSV'
          })
          setIsProcessing(false)
          return
        }

        setImportResult(result)

        if (result.success && result.clients.length > 0) {
          setClients(currentClients => [...(currentClients || []), ...result.clients])
          toast.success(`${result.imported} clientes importados correctamente`, {
            description: result.skipped > 0 
              ? `${result.skipped} clientes omitidos`
              : 'Todos los clientes fueron importados'
          })
        } else if (result.errors.length > 0) {
          toast.error('Error al importar clientes', {
            description: `${result.errors.length} errores encontrados`
          })
        }
      } catch (error) {
        toast.error('Error al procesar el archivo', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        })
      } finally {
        setIsProcessing(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }

    reader.onerror = () => {
      toast.error('Error al leer el archivo')
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <DownloadSimple size={16} weight="duotone" />
            Importar/Exportar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Importar/Exportar Clientes
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'export' | 'import')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" className="gap-2">
              <DownloadSimple size={18} weight="duotone" />
              Exportar
            </TabsTrigger>
            <TabsTrigger value="import" className="gap-2">
              <UploadSimple size={18} weight="duotone" />
              Importar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Clientes</CardTitle>
                <CardDescription>
                  Descarga tu lista de clientes en formato JSON o CSV para crear copias de seguridad o transferir datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">Total de clientes</p>
                    <p className="text-sm text-muted-foreground">
                      Clientes disponibles para exportar
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {(clients || []).length}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileJs size={24} weight="duotone" className="text-primary" />
                        <CardTitle className="text-lg">Formato JSON</CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Formato estructurado ideal para respaldos y reimportación completa
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Mantiene toda la información</li>
                        <li>• Fácil de reimportar</li>
                        <li>• Compatible con otras aplicaciones</li>
                      </ul>
                      <Button 
                        onClick={handleExportJSON}
                        disabled={(clients || []).length === 0}
                        className="w-full gap-2"
                      >
                        <DownloadSimple size={18} weight="bold" />
                        Exportar JSON
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <FileCsv size={24} weight="duotone" className="text-accent" />
                        <CardTitle className="text-lg">Formato CSV</CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Compatible con Excel, Google Sheets y otras hojas de cálculo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Editable en hojas de cálculo</li>
                        <li>• Fácil análisis de datos</li>
                        <li>• Formato universal</li>
                      </ul>
                      <Button 
                        onClick={handleExportCSV}
                        disabled={(clients || []).length === 0}
                        className="w-full gap-2"
                        variant="secondary"
                      >
                        <DownloadSimple size={18} weight="bold" />
                        Exportar CSV
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar Clientes</CardTitle>
                <CardDescription>
                  Carga clientes desde un archivo JSON o CSV. Los clientes duplicados (mismo NIF) serán omitidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="client-import-file"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="gap-2 flex-1"
                      size="lg"
                    >
                      <UploadSimple size={20} weight="bold" />
                      {isProcessing ? 'Procesando...' : 'Seleccionar Archivo'}
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground text-center">
                    Formatos aceptados: JSON, CSV
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileArrowDown size={20} weight="duotone" />
                    Descargar Plantillas de Ejemplo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadTemplate('json')}
                      className="gap-2 justify-start"
                    >
                      <FileJs size={18} weight="duotone" />
                      Plantilla JSON
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadTemplate('csv')}
                      className="gap-2 justify-start"
                    >
                      <FileCsv size={18} weight="duotone" />
                      Plantilla CSV
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Las plantillas contienen ejemplos de datos para ayudarte con el formato correcto
                  </p>
                </div>

                {importResult && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText size={20} weight="duotone" />
                        Resultado de la Importación
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <Card className={cn(
                          "border-2",
                          importResult.success && "border-green-500 bg-green-50 dark:bg-green-950"
                        )}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle 
                                size={20} 
                                weight="fill" 
                                className="text-green-600 dark:text-green-400" 
                              />
                              <span className="font-semibold text-green-700 dark:text-green-300">
                                Importados
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                              {importResult.imported}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={cn(
                          "border-2",
                          importResult.skipped > 0 && "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                        )}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-1">
                              <WarningCircle 
                                size={20} 
                                weight="fill" 
                                className="text-yellow-600 dark:text-yellow-400" 
                              />
                              <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                                Omitidos
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                              {importResult.skipped}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className={cn(
                          "border-2",
                          importResult.errors.length > 0 && "border-red-500 bg-red-50 dark:bg-red-950"
                        )}>
                          <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-1">
                              <X 
                                size={20} 
                                weight="bold" 
                                className="text-red-600 dark:text-red-400" 
                              />
                              <span className="font-semibold text-red-700 dark:text-red-300">
                                Errores
                              </span>
                            </div>
                            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                              {importResult.errors.length}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {importResult.errors.length > 0 && (
                        <Card className="border-destructive">
                          <CardHeader>
                            <CardTitle className="text-sm">Detalles de Errores</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-48">
                              <div className="space-y-2">
                                {importResult.errors.map((error, index) => (
                                  <div 
                                    key={index}
                                    className="text-sm p-2 bg-destructive/10 rounded border-l-2 border-destructive"
                                  >
                                    <span className="font-semibold">
                                      Fila {error.row}:
                                    </span>{' '}
                                    {error.error}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
