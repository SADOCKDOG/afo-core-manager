import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, Warning, FloppyDisk, Download, Spinner, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createFullBackup, exportBackupToFile } from '@/lib/backup-restore'

interface SelectiveDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

interface DataCategory {
  key: string
  label: string
  description: string
  count: number
  icon: string
  relatedKeys?: string[]
}

interface DeletionStep {
  step: 1 | 2 | 3
}

export function SelectiveDeleteDialog({ open, onOpenChange, trigger }: SelectiveDeleteDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [confirmText, setConfirmText] = useState('')
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupCreated, setBackupCreated] = useState(false)
  const [isLoadingCounts, setIsLoadingCounts] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [categories, setCategories] = useState<DataCategory[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (open) {
      loadDataCategories()
    }
  }, [open])

  const loadDataCategories = async () => {
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
      const approvalFlowTemplates = await spark.kv.get<any[]>('approval-flow-templates') || []
      const signatureProviders = await spark.kv.get<any[]>('qualified-signature-providers') || []
      const signatureRequests = await spark.kv.get<any[]>('qualified-signature-requests') || []
      const complianceData = await spark.kv.get<any[]>('municipal-compliance-data') || []
      const visas = await spark.kv.get<any[]>('visas') || []
      const emailLogs = await spark.kv.get<any[]>('email-logs') || []
      const architectProfile = await spark.kv.get<any>('architect-profile')
      const emailConfig = await spark.kv.get<any>('email-config')

      const categoriesList: DataCategory[] = [
        {
          key: 'projects',
          label: 'Proyectos',
          description: 'Todos los proyectos, incluyendo sus fases y datos relacionados',
          count: Array.isArray(projects) ? projects.length : 0,
          icon: '🏗️'
        },
        {
          key: 'documents',
          label: 'Documentos',
          description: 'Todos los documentos vinculados a proyectos',
          count: Array.isArray(documents) ? documents.length : 0,
          icon: '📄',
          relatedKeys: ['project-documents']
        },
        {
          key: 'clients',
          label: 'Clientes',
          description: 'Base de datos de clientes',
          count: Array.isArray(clients) ? clients.length : 0,
          icon: '👥'
        },
        {
          key: 'invoices',
          label: 'Facturas',
          description: 'Todas las facturas emitidas y borradores',
          count: Array.isArray(invoices) ? invoices.length : 0,
          icon: '🧾'
        },
        {
          key: 'budgets',
          label: 'Presupuestos',
          description: 'Presupuestos de proyectos',
          count: Array.isArray(budgets) ? budgets.length : 0,
          icon: '💰'
        },
        {
          key: 'stakeholders',
          label: 'Intervinientes',
          description: 'Base de datos de intervinientes (arquitectos, ingenieros, etc.)',
          count: Array.isArray(stakeholders) ? stakeholders.length : 0,
          icon: '👤'
        },
        {
          key: 'milestones',
          label: 'Hitos',
          description: 'Hitos de proyectos',
          count: Array.isArray(milestones) ? milestones.length : 0,
          icon: '🎯',
          relatedKeys: ['project-milestones']
        },
        {
          key: 'templates',
          label: 'Plantillas de Documentos',
          description: 'Plantillas personalizadas de documentos',
          count: Array.isArray(templates) ? templates.length : 0,
          icon: '📋',
          relatedKeys: ['document-templates']
        },
        {
          key: 'approvalFlows',
          label: 'Flujos de Aprobación',
          description: 'Flujos de aprobación activos y plantillas',
          count: (Array.isArray(approvalFlows) ? approvalFlows.length : 0) + (Array.isArray(approvalFlowTemplates) ? approvalFlowTemplates.length : 0),
          icon: '✅',
          relatedKeys: ['approval-flows', 'approval-flow-templates']
        },
        {
          key: 'signatures',
          label: 'Firmas Digitales',
          description: 'Proveedores de firma y solicitudes de firma',
          count: (Array.isArray(signatureProviders) ? signatureProviders.length : 0) + (Array.isArray(signatureRequests) ? signatureRequests.length : 0),
          icon: '✍️',
          relatedKeys: ['qualified-signature-providers', 'qualified-signature-requests']
        },
        {
          key: 'compliance',
          label: 'Normativas Municipales',
          description: 'Datos de normativas y cumplimiento municipal',
          count: Array.isArray(complianceData) ? complianceData.length : 0,
          icon: '⚖️',
          relatedKeys: ['municipal-compliance-data']
        },
        {
          key: 'visas',
          label: 'Visados',
          description: 'Registros de visados profesionales',
          count: Array.isArray(visas) ? visas.length : 0,
          icon: '🏛️'
        },
        {
          key: 'emailLogs',
          label: 'Registros de Email',
          description: 'Historial de emails enviados',
          count: Array.isArray(emailLogs) ? emailLogs.length : 0,
          icon: '📧',
          relatedKeys: ['email-logs']
        },
        {
          key: 'profile',
          label: 'Perfil Profesional',
          description: 'Tu perfil profesional y logo',
          count: architectProfile ? 1 : 0,
          icon: '👨‍💼',
          relatedKeys: ['architect-profile']
        },
        {
          key: 'emailConfig',
          label: 'Configuración de Email',
          description: 'Configuración SMTP para envío de emails',
          count: emailConfig ? 1 : 0,
          icon: '⚙️',
          relatedKeys: ['email-config']
        }
      ]

      setCategories(categoriesList.filter(cat => cat.count > 0))
    } catch (error) {
      console.error('Error loading data categories:', error)
      toast.error('Error al cargar categorías de datos')
    } finally {
      setIsLoadingCounts(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      setStep(1)
      setConfirmText('')
      setBackupCreated(false)
      setIsCreatingBackup(false)
      setSelectedCategories(new Set())
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

  const toggleCategory = (categoryKey: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryKey)) {
      newSelected.delete(categoryKey)
    } else {
      newSelected.add(categoryKey)
    }
    setSelectedCategories(newSelected)
  }

  const selectAll = () => {
    setSelectedCategories(new Set(categories.map(cat => cat.key)))
  }

  const deselectAll = () => {
    setSelectedCategories(new Set())
  }

  const handleNextStep = () => {
    if (step === 1 && selectedCategories.size === 0) {
      toast.error('Debes seleccionar al menos una categoría')
      return
    }
    if (step < 3) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3)
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3)
      setConfirmText('')
    }
  }

  const handleDelete = async () => {
    if (confirmText !== 'ELIMINAR') {
      return
    }

    setIsDeleting(true)
    try {
      const selectedCats = categories.filter(cat => selectedCategories.has(cat.key))
      const keysToDelete = new Set<string>()

      for (const cat of selectedCats) {
        if (cat.relatedKeys && cat.relatedKeys.length > 0) {
          cat.relatedKeys.forEach(key => keysToDelete.add(key))
        } else {
          keysToDelete.add(cat.key)
        }
      }

      let deletedCount = 0
      for (const key of keysToDelete) {
        try {
          await spark.kv.delete(key)
          deletedCount++
        } catch (error) {
          console.error(`Error deleting key ${key}:`, error)
        }
      }

      toast.success(`${deletedCount} categorías eliminadas`, {
        description: 'Los datos seleccionados han sido eliminados permanentemente'
      })

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Error deleting data:', error)
      toast.error('Error al eliminar datos', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getTotalItems = () => {
    return categories
      .filter(cat => selectedCategories.has(cat.key))
      .reduce((sum, cat) => sum + cat.count, 0)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && (
        <div onClick={() => onOpenChange(true)}>
          {trigger}
        </div>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trash size={24} weight="duotone" className="text-destructive" />
            Eliminación Selectiva de Datos
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Selecciona las categorías de datos que deseas eliminar'}
            {step === 2 && 'Revisa tu selección antes de continuar'}
            {step === 3 && 'Confirmación final de eliminación'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {step === 1 && (
            <div className="space-y-4 h-full flex flex-col">
              {isLoadingCounts ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size={32} className="animate-spin text-primary" />
                  <span className="ml-3 text-sm text-muted-foreground">Cargando datos...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedCategories.size} de {categories.length} categorías seleccionadas
                      {selectedCategories.size > 0 && ` (${getTotalItems()} elementos)`}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        disabled={selectedCategories.size === categories.length}
                      >
                        Seleccionar Todo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAll}
                        disabled={selectedCategories.size === 0}
                      >
                        Deseleccionar
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 pr-4 -mr-4" style={{ maxHeight: 'calc(90vh - 280px)' }}>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <div
                          key={category.key}
                          className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => toggleCategory(category.key)}
                        >
                          <Checkbox
                            checked={selectedCategories.has(category.key)}
                            onCheckedChange={() => toggleCategory(category.key)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{category.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-base">{category.label}</p>
                                <p className="text-sm text-muted-foreground">{category.description}</p>
                              </div>
                              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                {category.count}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {categories.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-lg font-semibold">No hay datos para eliminar</p>
                      <p className="text-sm text-muted-foreground">Tu aplicación está vacía</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <ScrollArea className="h-full pr-4 -mr-4" style={{ maxHeight: 'calc(90vh - 240px)' }}>
              <div className="space-y-4">
                <Alert variant="destructive" className="border-2">
                  <Warning size={20} weight="duotone" />
                  <AlertDescription className="ml-2">
                    <strong>¡ADVERTENCIA!</strong> Esta acción eliminará permanentemente los datos seleccionados
                  </AlertDescription>
                </Alert>

                <div className="bg-muted/50 border rounded-lg p-4 space-y-4">
                  <div>
                    <p className="font-semibold mb-3 text-base">Resumen de eliminación:</p>
                    <div className="space-y-2">
                      {categories
                        .filter(cat => selectedCategories.has(cat.key))
                        .map(category => (
                          <div 
                            key={category.key}
                            className="flex items-center justify-between px-3 py-2 bg-background/50 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{category.icon}</span>
                              <span className="font-medium">{category.label}</span>
                            </div>
                            <span className="font-bold text-destructive">{category.count}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between px-3 py-2 bg-destructive/10 rounded">
                      <span className="font-bold">Total de elementos a eliminar</span>
                      <span className="font-bold text-destructive text-lg">{getTotalItems()}</span>
                    </div>
                  </div>
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
                            Se recomienda encarecidamente crear un respaldo antes de continuar
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
            </ScrollArea>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Alert variant="destructive" className="border-2">
                <Warning size={20} weight="duotone" />
                <AlertDescription className="ml-2">
                  <strong>Última advertencia: Esta acción NO se puede deshacer</strong>
                </AlertDescription>
              </Alert>

              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="font-semibold text-destructive mb-2">Estás a punto de eliminar:</p>
                <div className="text-sm space-y-1 text-foreground">
                  {categories
                    .filter(cat => selectedCategories.has(cat.key))
                    .map(category => (
                      <p key={category.key}>
                        • <strong>{category.count}</strong> {category.label.toLowerCase()}
                      </p>
                    ))}
                  <p className="pt-2 text-base border-t border-destructive/20 mt-2">
                    Total: <strong>{getTotalItems()}</strong> elementos
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-foreground">
                  Para confirmar que deseas eliminar <strong>permanentemente</strong> estos datos, escribe exactamente:
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirm-text" className="text-base font-semibold">
                    ELIMINAR
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
                  {confirmText && confirmText !== 'ELIMINAR' && (
                    <p className="text-xs text-muted-foreground">
                      Debe coincidir exactamente: <span className="font-mono font-semibold">ELIMINAR</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePreviousStep} disabled={isDeleting}>
                Atrás
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            {step < 3 ? (
              <Button 
                onClick={handleNextStep}
                disabled={selectedCategories.size === 0 || isLoadingCounts}
                className="gap-2"
              >
                Continuar
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== 'ELIMINAR' || isDeleting}
                className="gap-2"
              >
                {isDeleting ? (
                  <>
                    <Spinner size={18} className="animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash size={18} weight="bold" />
                    Eliminar {getTotalItems()} Elementos
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
