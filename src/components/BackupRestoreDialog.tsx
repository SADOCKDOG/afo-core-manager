import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FloppyDisk, 
  Upload, 
  Download, 
  Info, 
  CheckCircle,
  Warning,
  FileArchive
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  createFullBackup, 
  exportBackupToFile, 
  importBackupFromFile, 
  restoreFromBackup,
  formatBackupDate,
  formatBackupSize,
  type BackupData 
} from '@/lib/backup-restore'
import { motion, AnimatePresence } from 'framer-motion'

interface BackupRestoreDialogProps {
  trigger?: React.ReactNode
}

export function BackupRestoreDialog({ trigger }: BackupRestoreDialogProps) {
  const [open, setOpen] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [currentBackup, setCurrentBackup] = useState<BackupData | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewBackup, setPreviewBackup] = useState<BackupData | null>(null)

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      const backup = await createFullBackup()
      setCurrentBackup(backup)
      toast.success('Respaldo creado correctamente', {
        description: 'Ahora puedes descargarlo'
      })
    } catch (error) {
      toast.error('Error al crear respaldo', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleDownloadBackup = async () => {
    if (!currentBackup) return
    
    try {
      await exportBackupToFile(currentBackup)
    } catch (error) {
      toast.error('Error al descargar respaldo', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    
    try {
      const backup = await importBackupFromFile(file)
      setPreviewBackup(backup)
      toast.success('Archivo de respaldo cargado', {
        description: 'Revisa los detalles antes de restaurar'
      })
    } catch (error) {
      toast.error('Error al leer archivo', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
      setSelectedFile(null)
      setPreviewBackup(null)
    }
    
    event.target.value = ''
  }

  const handleRestoreBackup = async () => {
    if (!previewBackup) return

    setIsRestoring(true)
    try {
      await restoreFromBackup(previewBackup)
    } catch (error) {
      toast.error('Error al restaurar datos', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
      setIsRestoring(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setCurrentBackup(null)
      setSelectedFile(null)
      setPreviewBackup(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <FloppyDisk size={18} weight="duotone" />
            Respaldo y Restauración
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FloppyDisk size={32} weight="duotone" className="text-primary" />
            Respaldo y Restauración de Datos
          </DialogTitle>
          <DialogDescription>
            Crea copias de seguridad de todos tus datos o restaura desde un respaldo anterior
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Alert>
            <Info size={20} weight="duotone" />
            <AlertDescription className="ml-2">
              <strong>Importante:</strong> Los respaldos incluyen todos los datos de la aplicación: proyectos, clientes, facturas, documentos, configuración y más.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download size={24} weight="duotone" className="text-primary" />
                  Crear Respaldo
                </CardTitle>
                <CardDescription>
                  Exporta todos tus datos a un archivo JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Download size={20} weight="bold" />
                  {isCreatingBackup ? 'Creando respaldo...' : 'Crear Respaldo'}
                </Button>

                <AnimatePresence mode="wait">
                  {currentBackup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <Alert className="bg-primary/10 border-primary/30">
                        <CheckCircle size={20} weight="duotone" className="text-primary" />
                        <AlertDescription className="ml-2">
                          <strong>Respaldo creado correctamente</strong>
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span className="font-medium">{formatBackupDate(currentBackup.timestamp)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Tamaño:</span>
                          <span className="font-medium">{formatBackupSize(currentBackup)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Proyectos:</span>
                          <span className="font-medium">{currentBackup.metadata.projectCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Clientes:</span>
                          <span className="font-medium">{currentBackup.metadata.clientCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Facturas:</span>
                          <span className="font-medium">{currentBackup.metadata.invoiceCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Documentos:</span>
                          <span className="font-medium">{currentBackup.metadata.documentCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Intervinientes:</span>
                          <span className="font-medium">{currentBackup.metadata.stakeholderCount}</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleDownloadBackup}
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <FileArchive size={20} weight="duotone" />
                        Descargar Archivo de Respaldo
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload size={24} weight="duotone" className="text-accent" />
                  Restaurar Respaldo
                </CardTitle>
                <CardDescription>
                  Importa y restaura datos desde un archivo de respaldo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-file" className="text-base">
                    Seleccionar archivo de respaldo
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => document.getElementById('backup-file')?.click()}
                      variant="outline"
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Upload size={20} weight="bold" />
                      {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                    </Button>
                    <input
                      id="backup-file"
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {previewBackup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <Alert className="bg-accent/10 border-accent/30">
                        <CheckCircle size={20} weight="duotone" className="text-accent" />
                        <AlertDescription className="ml-2">
                          <strong>Archivo válido</strong>
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Fecha:</span>
                          <span className="font-medium">{formatBackupDate(previewBackup.timestamp)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Tamaño:</span>
                          <span className="font-medium">{formatBackupSize(previewBackup)}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Proyectos:</span>
                          <span className="font-medium">{previewBackup.metadata.projectCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Clientes:</span>
                          <span className="font-medium">{previewBackup.metadata.clientCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Facturas:</span>
                          <span className="font-medium">{previewBackup.metadata.invoiceCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Documentos:</span>
                          <span className="font-medium">{previewBackup.metadata.documentCount}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b">
                          <span className="text-muted-foreground">Intervinientes:</span>
                          <span className="font-medium">{previewBackup.metadata.stakeholderCount}</span>
                        </div>
                      </div>

                      <Alert variant="destructive" className="border-2">
                        <Warning size={20} weight="duotone" />
                        <AlertDescription className="ml-2">
                          <strong>Advertencia:</strong> Al restaurar, todos los datos actuales serán reemplazados por los datos del respaldo.
                        </AlertDescription>
                      </Alert>

                      <Button
                        onClick={handleRestoreBackup}
                        disabled={isRestoring}
                        variant="default"
                        className="w-full gap-2"
                      >
                        <Upload size={20} weight="bold" />
                        {isRestoring ? 'Restaurando...' : 'Restaurar Datos'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          <Alert className="bg-muted">
            <Info size={20} weight="duotone" />
            <AlertDescription className="ml-2 space-y-2">
              <p><strong>Recomendaciones:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                <li>Crea respaldos regularmente, especialmente antes de hacer cambios importantes</li>
                <li>Guarda los archivos de respaldo en un lugar seguro (nube, disco externo, etc.)</li>
                <li>Verifica que el respaldo se haya descargado correctamente antes de eliminar datos</li>
                <li>Los respaldos son compatibles únicamente con esta versión de la aplicación</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  )
}
