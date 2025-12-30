import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DeleteAllDataDialogProps {
  onConfirmDelete: () => void
  trigger?: React.ReactNode
}

export function DeleteAllDataDialog({ onConfirmDelete, trigger }: DeleteAllDataDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [step, setStep] = useState(1)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setConfirmText('')
      setStep(1)
    }
  }

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    if (confirmText === 'ELIMINAR TODO') {
      onConfirmDelete()
      toast.success('Todos los datos han sido eliminados', {
        description: 'La aplicación se reiniciará'
      })
      handleOpenChange(false)
    } else {
      toast.error('Texto incorrecto', {
        description: 'Debes escribir exactamente "ELIMINAR TODO"'
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" className="gap-2">
            <Trash size={18} weight="duotone" />
            Eliminar Todos los Datos
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-2xl text-destructive">
            <Warning size={32} weight="duotone" />
            {step === 1 ? '¿Eliminar todos los datos?' : 'Confirmación final'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-4">
              {step === 1 ? (
                <>
                  <Alert variant="destructive" className="border-2">
                    <Warning size={20} weight="duotone" className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <strong>Esta acción es irreversible y permanente</strong>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3 text-sm">
                    <p className="font-semibold text-foreground">Se eliminarán los siguientes datos:</p>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      <li>Tu perfil profesional y logo</li>
                      <li>Todos los proyectos y sus documentos</li>
                      <li>Todos los clientes registrados</li>
                      <li>Todas las facturas y presupuestos</li>
                      <li>Todos los intervinientes</li>
                      <li>Toda la configuración de email</li>
                      <li>Todos los flujos de aprobación</li>
                      <li>Todas las plantillas personalizadas</li>
                      <li>Todos los registros de actividad</li>
                      <li>Cualquier otro dato almacenado en la aplicación</li>
                    </ul>
                  </div>

                  <Alert className="bg-muted">
                    <AlertDescription className="text-sm">
                      <strong>Recomendación:</strong> Antes de continuar, considera exportar tus proyectos desde el menú de Herramientas.
                    </AlertDescription>
                  </Alert>
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
