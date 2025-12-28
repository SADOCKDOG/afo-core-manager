import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Scissors, FileArrowDown, Warning, CheckCircle, FileText, SplitVertical } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DocumentUtilitiesProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentUtilities({ open, onOpenChange }: DocumentUtilitiesProps) {
  const [splitSize, setSplitSize] = useState<number>(80)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF')
        return
      }
      setSelectedFile(file)
      setProgress(0)
    }
  }

  const handleSplitPDF = async () => {
    if (!selectedFile) {
      toast.error('Por favor, seleccione un archivo PDF')
      return
    }

    setProcessing(true)
    setProgress(0)

    try {
      const fileSizeMB = selectedFile.size / (1024 * 1024)
      
      if (fileSizeMB <= splitSize) {
        toast.info('El archivo es menor que el tamaño máximo especificado', {
          description: `Tamaño del archivo: ${fileSizeMB.toFixed(2)} MB`
        })
        setProcessing(false)
        return
      }

      const reader = new FileReader()
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress((event.loaded / event.total) * 100)
        }
      }

      reader.onload = async () => {
        setProgress(100)
        
        toast.warning('División de PDF en Proceso', {
          description: `Esta funcionalidad requiere procesamiento del lado del servidor. El archivo será descargado para división manual.`
        })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(selectedFile)
        link.download = selectedFile.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        setTimeout(() => {
          setProcessing(false)
          setProgress(0)
          setSelectedFile(null)
          toast.success('Archivo preparado para división', {
            description: 'Utilice una herramienta externa de división de PDF para completar el proceso.'
          })
        }, 1000)
      }

      reader.readAsArrayBuffer(selectedFile)

    } catch (error) {
      console.error('Error processing PDF:', error)
      toast.error('Error al procesar el PDF')
      setProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SplitVertical size={24} weight="duotone" className="text-primary" />
            Utilidades de Documentos
          </DialogTitle>
          <DialogDescription>
            Herramientas para manipulación y optimización de archivos del proyecto
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="split" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="split" className="gap-2">
              <Scissors size={16} />
              Dividir PDF
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-2">
              <FileText size={16} />
              Metadatos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="split" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dividir Archivos PDF Grandes</CardTitle>
                <CardDescription>
                  Divida PDFs que superen el límite de tamaño para plataformas de visado colegial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-accent/50 bg-accent/5">
                  <Warning size={18} weight="duotone" className="text-accent" />
                  <AlertDescription className="text-sm">
                    <strong>Importante:</strong> La división de un PDF invalidará cualquier firma digital existente.
                    Asegúrese de realizar este proceso antes de firmar el documento.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="split-size">Tamaño Máximo por Archivo (MB)</Label>
                    <Input
                      id="split-size"
                      type="number"
                      value={splitSize}
                      onChange={(e) => setSplitSize(Number(e.target.value))}
                      min={1}
                      max={500}
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Límite típico del COAM: 80 MB
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="pdf-file">Seleccionar Archivo PDF</Label>
                    <Input
                      id="pdf-file"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      disabled={processing}
                      className="mt-1.5"
                    />
                    {selectedFile && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <FileArrowDown size={16} />
                        <span className="truncate">{selectedFile.name}</span>
                        <span className="ml-auto shrink-0">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>

                  {processing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Procesando archivo...</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSplitPDF}
                    disabled={!selectedFile || processing}
                    className="gap-2"
                  >
                    <Scissors size={18} weight="duotone" />
                    {processing ? 'Procesando...' : 'Dividir PDF'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null)
                      setProgress(0)
                    }}
                    disabled={processing || !selectedFile}
                  >
                    Limpiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gestión de Metadatos</CardTitle>
                <CardDescription>
                  Información sobre el estándar eEMGDE de metadatos documentales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-primary/50 bg-primary/5">
                  <CheckCircle size={18} weight="duotone" className="text-primary" />
                  <AlertDescription className="text-sm">
                    AFO CORE MANAGER gestiona automáticamente los metadatos esenciales según el esquema eEMGDE:
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-muted/30">
                    <h4 className="font-semibold text-sm mb-2">Metadatos Gestionados Automáticamente:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• <strong>Identificador Único:</strong> Generado automáticamente para cada documento</li>
                      <li>• <strong>Fechas:</strong> Fecha de creación y última modificación</li>
                      <li>• <strong>Versión:</strong> Sistema de versionado ISO19650-2 (P01, P02, C01)</li>
                      <li>• <strong>Formato:</strong> Tipo MIME y extensión del archivo</li>
                      <li>• <strong>Aplicación:</strong> Software utilizado para crear el documento</li>
                      <li>• <strong>Disciplina:</strong> Categoría técnica del documento</li>
                      <li>• <strong>Descripción:</strong> Descripción textual del contenido</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-3 bg-card">
                    <h4 className="font-semibold text-sm mb-2">Características Técnicas Registradas:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1.5">
                      <li>• Tamaño del archivo en bytes</li>
                      <li>• Formato original y formato de visualización</li>
                      <li>• Usuario que subió el documento</li>
                      <li>• Estado del documento (Borrador, Compartido, Aprobado)</li>
                      <li>• Historial completo de versiones</li>
                    </ul>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <p>
                      <strong>Nota:</strong> Todos los metadatos se almacenan de forma persistente y son exportables.
                      La nomenclatura de archivos sigue el estándar ISO19650-2 para garantizar la interoperabilidad.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
