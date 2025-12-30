import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash, Warning, FloppyDisk, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createFullBackup, exportBackupToFile } from '@/lib/backup-restore'

interface DeleteAllDataDialogProps {
  onConfirmDelete: () => void
  trigger?: React.ReactNode
}

export function DeleteAllDataDialog({ onConfirmDelete, trigger }: DeleteAllDataDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [confirmText, setConfirmText] = useState('')
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setStep(1)
      setConfirmText('')
      setBackupCreated(false)
      setIsCreatingBackup(false)
    }
  }

  const handleCreateBackupBeforeDelete = async () => {
    setIsCreatingBackup(true)
    try {
      const backup = await createFullBackup()
      await exportBackupToFile(backup)
      setBackupCreated(true)
      toast.success('Respaldo creado y descargado', {
        description: 'Ahora puedes proceder con la eliminación'
      })
    } catch (error) {
      toast.error('Error al crear respaldo', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    if (confirmText === 'ELIMINAR TODO') {
      onConfirmDelete()
      handleOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <div onClick={() => setOpen(true)}>
          {trigger}
        </div>
      )}
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl text-destructive">
            <Trash size={24} weight="duotone" />
            Eliminar Todos los Datos
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              {step === 1 ? (
                <>
                  <Alert variant="destructive" className="border-2">
                    <Warning size={20} weight="duotone" className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <strong>¡ADVERTENCIA!</strong> Esta acción eliminará permanentemente todos tus datos
                    </AlertDescription>
                  </Alert>

                  <div className="text-sm space-y-3 text-foreground">
                    <p className="font-medium">Se eliminarán los siguientes datos:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Tu perfil profesional y logo</li>
                      <li>Todos los proyectos y documentos</li>
                      <li>Clientes y promotores</li>
                      <li>Facturas y presupuestos</li>
                      <li>Intervinientes</li>
                      <li>Configuraciones de email</li>
                      <li>Plantillas de documentos</li>
                      <li>Flujos de aprobación</li>
                      <li>Toda la configuración de la aplicación</li>
                    </ul>

                    {backupCreated ? (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <FloppyDisk size={18} weight="duotone" className="text-green-500 mt-0.5" />
                          <div className="flex-1">
                            <p><strong>✓ Respaldo creado y descargado</strong></p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Tus datos han sido respaldados de forma segura
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 border rounded-lg p-3">
                        <div className="space-y-3">
                          <p><strong>Recomendación:</strong> Crea un respaldo de tus datos antes de continuar</p>
                          <Button
                            onClick={handleCreateBackupBeforeDelete}
                            disabled={isCreatingBackup}
                            variant="outline"
                            size="sm"
                            className="gap-2 w-full"
                          >
                            <Download size={16} weight="bold" />
                            {isCreatingBackup ? 'Creando respaldo...' : 'Crear Respaldo Ahora'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Alert variant="destructive" className="border-2">
                    <Warning size={20} weight="duotone" className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <strong>Última advertencia: Esta acción NO se puede deshacer</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <p className="text-sm text-foreground">
                      Para confirmar que deseas eliminar <strong>permanentemente</strong> todos los datos, escribe exactamente:
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-text" className="text-base font-semibold">
                        ELIMINAR TODO
                      </Label>
                      <Input
                        id="confirm-text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Escribe aquí..."
                        className="h-12 text-base font-mono"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          {step === 1 ? (
            <Button variant="destructive" onClick={handleFirstConfirm} className="gap-2">
              <Warning size={18} weight="duotone" />
              Continuar
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleFinalConfirm}
              disabled={confirmText !== 'ELIMINAR TODO'}
              className="gap-2"
            >
              <Trash size={18} weight="bold" />
              Eliminar Todo Permanentemente
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
