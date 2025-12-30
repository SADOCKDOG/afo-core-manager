import { useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  AlertDialogContent,
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components
import { Trash, Warn
import { createFull
interface DeleteAllDa
  trigger?: React.ReactNode

  const [open, setOpen] = useState(false)
  const [step, setStep] = useS
  const [backupCreated, setBackupCreated] = useState(false)

    if (!newOpen) {
      setStep(1)
      setIsCreatingBackup(f
 

    try {
      await exportBackupToFile(backup)
      toast.success('Respaldo creado y descargado', 
      })
      toast.error('Error al crear respaldo', {
      })

  }
  const handleFirstC
    if (!newOpen) {
      setConfirmText('')
      setStep(1)
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
          <AlertDialogD
              {step === 1 ? (
                  <Alert variant="destructive" cla
        
                    </AlertDe

                    <p className="font-
                      <li>Tu perfil profesional y logo</li>
        
     
   

          

                    <FloppyDisk si
                     
                          <p><strong>✓ Respaldo creado y d
                        </div>
                        <div classNa
                   
          
                           
                          >
                           
                        </div>
                    </AlertDescription>
                </>
                <>
                    <Warning size={20} wei
                      <strong>Última adverte
                  </Alert>
                  
                      Para confirmar que deseas eliminar <strong>per
                    <div className="space-y-2">
                        ELIMINAR TODO
                      <Input
                        value={confirmT
                        pl

                    </div>
                </>
            </div>
        </AlertDialogHeader>
          <Button variant="outline" onClick={() => handleOpenChange
          </Button>
            <Button variant="destructive" onClick={handleFirstCo
              Continuar
          ) : (
              variant="destructive"
              disabled={confirmText !== 'ELIMINAR TODO'}
            >
              Eliminar Todo Permanentemente
          )}
      </AlertDialogConte










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
                      )}
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
