import { useState, useEffect } from 'react'
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
import { Trash, Warning, FloppyDisk, Download, Spinner } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createFullBackup, exportBackupToFile } from '@/lib/backup-restore'

interface DeleteAllDataDialogProps {
  onConfirmDelete: () => void
  trigger?: React.ReactNode
}

interface DataCounts {
  projects: number
  clients: number
  invoices: number
  documents: number
  stakeholders: number
  budgets: number
  milestones: number
  templates: number
  approvalFlows: number
  totalKeys: number
}

export function DeleteAllDataDialog({ onConfirmDelete, trigger }: DeleteAllDataDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [confirmText, setConfirmText] = useState('')
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)
  const [dataCounts, setDataCounts] = useState<DataCounts | null>(null)
  const [isLoadingCounts, setIsLoadingCounts] = useState(false)

  useEffect(() => {
    if (open) {
      loadDataCounts()
    }
  }, [open])

  const loadDataCounts = async () => {
    setIsLoadingCounts(true)
    try {
      const allKeys = await spark.kv.keys()
      
      const projects = await spark.kv.get<any[]>('projects') || []
      const clients = await spark.kv.get<any[]>('clients') || []
      const invoices = await spark.kv.get<any[]>('invoices') || []
      const documents = await spark.kv.get<any[]>('project-documents') || []
      const stakeholders = await spark.kv.get<any[]>('stakeholders') || []
      const budgets = await spark.kv.get<any[]>('budgets') || []
      const milestones = await spark.kv.get<any[]>('project-milestones') || []
      const templates = await spark.kv.get<any[]>('document-templates') || []
      const approvalFlows = await spark.kv.get<any[]>('approval-flows') || []

      setDataCounts({
        projects: Array.isArray(projects) ? projects.length : 0,
        clients: Array.isArray(clients) ? clients.length : 0,
        invoices: Array.isArray(invoices) ? invoices.length : 0,
        documents: Array.isArray(documents) ? documents.length : 0,
        stakeholders: Array.isArray(stakeholders) ? stakeholders.length : 0,
        budgets: Array.isArray(budgets) ? budgets.length : 0,
        milestones: Array.isArray(milestones) ? milestones.length : 0,
        templates: Array.isArray(templates) ? templates.length : 0,
        approvalFlows: Array.isArray(approvalFlows) ? approvalFlows.length : 0,
        totalKeys: allKeys.length
      })
    } catch (error) {
      console.error('Error loading data counts:', error)
      toast.error('Error al cargar conteo de datos')
    } finally {
      setIsLoadingCounts(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setStep(1)
      setConfirmText('')
      setBackupCreated(false)
      setIsCreatingBackup(false)
      setDataCounts(null)
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

                  {isLoadingCounts ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner size={32} className="animate-spin text-primary" />
                      <span className="ml-3 text-sm text-muted-foreground">Contando datos...</span>
                    </div>
                  ) : dataCounts ? (
                    <div className="text-sm space-y-4 text-foreground">
                      <div className="bg-muted/50 border rounded-lg p-4">
                        <p className="font-semibold mb-3 text-base">Resumen de datos a eliminar:</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Proyectos</span>
                            <span className="font-bold text-primary">{dataCounts.projects}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Clientes</span>
                            <span className="font-bold text-primary">{dataCounts.clients}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Documentos</span>
                            <span className="font-bold text-primary">{dataCounts.documents}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Facturas</span>
                            <span className="font-bold text-primary">{dataCounts.invoices}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Presupuestos</span>
                            <span className="font-bold text-primary">{dataCounts.budgets}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Intervinientes</span>
                            <span className="font-bold text-primary">{dataCounts.stakeholders}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Hitos</span>
                            <span className="font-bold text-primary">{dataCounts.milestones}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Plantillas</span>
                            <span className="font-bold text-primary">{dataCounts.templates}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Flujos de Aprobación</span>
                            <span className="font-bold text-primary">{dataCounts.approvalFlows}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-background/50 rounded">
                            <span>Total de Claves</span>
                            <span className="font-bold text-destructive">{dataCounts.totalKeys}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="font-medium">También se eliminará:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                          <li>Tu perfil profesional y logo</li>
                          <li>Configuraciones de email</li>
                          <li>Proveedores de firma digital</li>
                          <li>Normativas municipales</li>
                          <li>Toda la configuración de la aplicación</li>
                        </ul>
                      </div>

                      {backupCreated ? (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <FloppyDisk size={18} weight="duotone" className="text-green-500 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-green-700 dark:text-green-400">✓ Respaldo creado y descargado</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Tus datos han sido respaldados de forma segura
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <Warning size={18} weight="duotone" className="text-orange-500 mt-0.5" />
                              <div className="flex-1">
                                <p className="font-semibold text-orange-700 dark:text-orange-400">Recomendación Importante</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Se recomienda encarecidamente crear un respaldo de tus {dataCounts.totalKeys} elementos antes de continuar
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={handleCreateBackupBeforeDelete}
                              disabled={isCreatingBackup}
                              variant="outline"
                              size="sm"
                              className="gap-2 w-full border-orange-500/20 hover:bg-orange-500/10"
                            >
                              <Download size={16} weight="bold" />
                              {isCreatingBackup ? 'Creando respaldo...' : 'Crear Respaldo Ahora'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <Alert variant="destructive" className="border-2">
                    <Warning size={20} weight="duotone" className="h-5 w-5" />
                    <AlertDescription className="ml-2">
                      <strong>Última advertencia: Esta acción NO se puede deshacer</strong>
                    </AlertDescription>
                  </Alert>

                  {dataCounts && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <p className="font-semibold text-destructive mb-2">Estás a punto de eliminar:</p>
                      <div className="text-sm space-y-1 text-foreground">
                        <p>• <strong>{dataCounts.projects}</strong> proyectos</p>
                        <p>• <strong>{dataCounts.documents}</strong> documentos</p>
                        <p>• <strong>{dataCounts.clients}</strong> clientes</p>
                        <p>• <strong>{dataCounts.invoices}</strong> facturas</p>
                        <p>• Y <strong>{dataCounts.totalKeys - dataCounts.projects - dataCounts.documents - dataCounts.clients - dataCounts.invoices}</strong> elementos adicionales</p>
                      </div>
                    </div>
                  )}

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
                        autoFocus
                      />
                      {confirmText && confirmText !== 'ELIMINAR TODO' && (
                        <p className="text-xs text-muted-foreground">
                          Debe coincidir exactamente: <span className="font-mono font-semibold">ELIMINAR TODO</span>
                        </p>
                      )}
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
            <Button 
              variant="destructive" 
              onClick={handleFirstConfirm} 
              className="gap-2"
              disabled={isLoadingCounts}
            >
              <Warning size={18} weight="duotone" />
              Continuar con la Eliminación
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleFinalConfirm}
              disabled={confirmText !== 'ELIMINAR TODO'}
              className="gap-2"
            >
              <Trash size={18} weight="bold" />
              Eliminar {dataCounts?.totalKeys || 'Todos los'} Elementos
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
