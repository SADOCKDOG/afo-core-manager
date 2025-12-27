import { useState } from 'react'
import { FolderStructureType, FOLDER_STRUCTURES } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Folder, TreeStructure, WarningCircle } from '@phosphor-icons/react'

interface FolderStructureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStructure?: FolderStructureType
  onSelect: (type: FolderStructureType) => void
}

export function FolderStructureDialog({ 
  open, 
  onOpenChange, 
  currentStructure,
  onSelect 
}: FolderStructureDialogProps) {
  const [selectedType, setSelectedType] = useState<FolderStructureType>(
    currentStructure || 'by-type'
  )

  const handleConfirm = () => {
    onSelect(selectedType)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TreeStructure size={24} weight="duotone" />
            Configurar Estructura de Carpetas
          </DialogTitle>
          <DialogDescription>
            Seleccione el tipo de organización de carpetas para este proyecto
          </DialogDescription>
        </DialogHeader>

        {currentStructure && (
          <Alert>
            <WarningCircle size={18} weight="duotone" />
            <AlertDescription>
              Cambiar la estructura de carpetas no moverá los documentos existentes automáticamente.
              Deberá reasignarlos manualmente a las nuevas carpetas.
            </AlertDescription>
          </Alert>
        )}

        <RadioGroup value={selectedType} onValueChange={(val) => setSelectedType(val as FolderStructureType)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                selectedType === 'by-type' 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'hover:border-accent/50'
              }`}
              onClick={() => setSelectedType('by-type')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Folder size={24} weight="duotone" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Por Tipo de Archivo</CardTitle>
                      <CardDescription>Organización clásica e intuitiva</CardDescription>
                    </div>
                  </div>
                  <RadioGroupItem value="by-type" id="by-type" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ideal para proyectos tradicionales donde la separación por tipo de documento
                  facilita la búsqueda y el archivo.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Carpetas creadas:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    {FOLDER_STRUCTURES['by-type'].folders.map(folder => (
                      <div key={folder} className="flex items-center gap-2">
                        <Folder size={14} weight="duotone" />
                        {folder}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                selectedType === 'screaming-architecture' 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'hover:border-accent/50'
              }`}
              onClick={() => setSelectedType('screaming-architecture')}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <TreeStructure size={24} weight="duotone" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Arquitectura de Gritos</CardTitle>
                      <CardDescription>Organización funcional del proyecto</CardDescription>
                    </div>
                  </div>
                  <RadioGroupItem value="screaming-architecture" id="screaming-architecture" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfecta para metodologías modernas donde los documentos se organizan según
                  su función dentro del proyecto, no por su formato.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Carpetas creadas:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    {FOLDER_STRUCTURES['screaming-architecture'].folders.map(folder => (
                      <div key={folder} className="flex items-center gap-2">
                        <Folder size={14} weight="duotone" />
                        {folder}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            {currentStructure ? 'Cambiar Estructura' : 'Confirmar Selección'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
