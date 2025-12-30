import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, ProjectPhase, ProjectStatus, Client, PHASE_LABELS, BuildingType, BuildingUse, BUILDING_TYPE_LABELS, BUILDING_USE_LABELS } from '@/lib/types'
import { toast } from 'sonner'
import { Trash, Info } from '@phosphor-icons/react'
import { getBuildingTypeTemplate } from '@/lib/building-type-templates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: Partial<Project>) => void
  onDelete?: (projectId: string) => void
  project?: Project
}

const ALL_PHASES: ProjectPhase[] = [
  'estudio-previo',
  'anteproyecto',
  'basico',
  'ejecucion',
  'direccion-obra'
]

export function ProjectDialog({ open, onOpenChange, onSave, onDelete, project }: ProjectDialogProps) {
  const [clients] = useKV<Client[]>('clients', [])
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [selectedPhases, setSelectedPhases] = useState<Set<ProjectPhase>>(new Set())
  const [phasePercentages, setPhasePercentages] = useState<Record<ProjectPhase, number>>({} as Record<ProjectPhase, number>)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [buildingType, setBuildingType] = useState<BuildingType | undefined>(undefined)
  const [buildingUse, setBuildingUse] = useState<BuildingUse | undefined>(undefined)
  const [buildingSurface, setBuildingSurface] = useState<string>('')

  const buildingTemplate = buildingType ? getBuildingTypeTemplate(buildingType) : undefined

  useEffect(() => {
    if (project) {
      setTitle(project.title)
      setLocation(project.location)
      setDescription(project.description || '')
      setClientId(project.clientId)
      setStatus(project.status)
      setBuildingType(project.buildingType)
      setBuildingUse(project.buildingUse)
      setBuildingSurface(project.buildingSurface?.toString() || '')
      const phases = new Set(project.phases.map(p => p.phase))
      setSelectedPhases(phases)
      const percentages = project.phases.reduce((acc, p) => {
        acc[p.phase] = p.percentage
        return acc
      }, {} as Record<ProjectPhase, number>)
      setPhasePercentages(percentages)
    } else {
      setTitle('')
      setLocation('')
      setDescription('')
      setClientId('')
      setStatus('active')
      setBuildingType(undefined)
      setBuildingUse(undefined)
      setBuildingSurface('')
      setSelectedPhases(new Set())
      setPhasePercentages({} as Record<ProjectPhase, number>)
    }
  }, [project, open])

  const handlePhaseToggle = (phase: ProjectPhase) => {
    const newSelected = new Set(selectedPhases)
    const newPercentages = { ...phasePercentages }
    
    if (newSelected.has(phase)) {
      newSelected.delete(phase)
      delete newPercentages[phase]
    } else {
      newSelected.add(phase)
      newPercentages[phase] = 0
    }
    
    setSelectedPhases(newSelected)
    setPhasePercentages(newPercentages)
  }

  const handlePercentageChange = (phase: ProjectPhase, value: string) => {
    const numValue = parseInt(value) || 0
    setPhasePercentages({ ...phasePercentages, [phase]: Math.min(100, Math.max(0, numValue)) })
  }

  const totalPercentage = Object.values(phasePercentages).reduce((sum, val) => sum + val, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const phases = Array.from(selectedPhases).map(phase => ({
      phase,
      percentage: phasePercentages[phase] || 0,
      status: project?.phases.find(p => p.phase === phase)?.status || 'pending' as const
    }))

    onSave({
      ...(project || {}),
      title,
      location,
      description,
      clientId,
      status,
      phases,
      buildingType,
      buildingUse,
      buildingSurface: buildingSurface ? parseFloat(buildingSurface) : undefined,
    })
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (project && onDelete) {
      setDeleteDialogOpen(false)
      onDelete(project.id)
      onOpenChange(false)
      toast.success('Proyecto eliminado correctamente')
    }
  }

  const getClientDisplayName = (client: Client) => {
    if (client.type === 'persona-juridica') {
      return client.razonSocial || 'Sin nombre'
    }
    return `${client.nombre || ''} ${client.apellido1 || ''} ${client.apellido2 || ''}`.trim() || 'Sin nombre'
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </DialogTitle>
            <DialogDescription>
              {project ? 'Modifica los datos del proyecto' : 'Crea un nuevo proyecto arquitectónico'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del Proyecto *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Vivienda Unifamiliar en..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej: Cartagena, Murcia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción opcional del proyecto..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Cliente (Promotor) *</Label>
                  <Select value={clientId} onValueChange={setClientId} required>
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {(clients || []).length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No hay clientes registrados
                        </div>
                      ) : (
                        (clients || []).map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {getClientDisplayName(client)} ({client.nif})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {(clients || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Necesitas crear un cliente primero desde el menú de Herramientas
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado del Proyecto</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                      <SelectItem value="on-hold">En Pausa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    Tipología del Edificio
                    <Badge variant="secondary" className="text-xs">Nuevo</Badge>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buildingType">Tipo de Edificio</Label>
                    <Select 
                      value={buildingType} 
                      onValueChange={(v) => {
                        setBuildingType(v as BuildingType)
                        const template = getBuildingTypeTemplate(v as BuildingType)
                        if (template) {
                          setBuildingUse(template.defaultUse)
                        }
                      }}
                    >
                      <SelectTrigger id="buildingType">
                        <SelectValue placeholder="Selecciona tipo de edificio" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2">
                          <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">RESIDENCIAL</div>
                          <SelectItem value="vivienda-unifamiliar">Vivienda Unifamiliar</SelectItem>
                          <SelectItem value="vivienda-colectiva">Vivienda Colectiva</SelectItem>
                          <SelectItem value="vivienda-plurifamiliar">Vivienda Plurifamiliar</SelectItem>
                          <SelectItem value="rehabilitacion">Rehabilitación</SelectItem>
                          <SelectItem value="ampliacion">Ampliación</SelectItem>
                          
                          <Separator className="my-2" />
                          <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">COMERCIAL</div>
                          <SelectItem value="edificio-oficinas">Edificio de Oficinas</SelectItem>
                          <SelectItem value="centro-comercial">Centro Comercial</SelectItem>
                          <SelectItem value="local-comercial">Local Comercial</SelectItem>
                          <SelectItem value="hotel">Hotel</SelectItem>
                          <SelectItem value="restaurante">Restaurante/Cafetería</SelectItem>
                          
                          <Separator className="my-2" />
                          <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">INDUSTRIAL</div>
                          <SelectItem value="nave-industrial">Nave Industrial</SelectItem>
                          <SelectItem value="almacen-logistico">Almacén Logístico</SelectItem>
                          <SelectItem value="taller-industrial">Taller Industrial</SelectItem>
                          <SelectItem value="centro-produccion">Centro de Producción</SelectItem>
                          <SelectItem value="parking-industrial">Parking Industrial</SelectItem>
                          
                          <Separator className="my-2" />
                          <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">EDUCATIVO</div>
                          <SelectItem value="colegio">Colegio</SelectItem>
                          <SelectItem value="instituto">Instituto</SelectItem>
                          <SelectItem value="universidad">Universidad</SelectItem>
                          <SelectItem value="centro-formacion">Centro de Formación</SelectItem>
                          <SelectItem value="guarderia">Guardería</SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingUse">Uso del Edificio</Label>
                    <Select value={buildingUse} onValueChange={(v) => setBuildingUse(v as BuildingUse)}>
                      <SelectTrigger id="buildingUse">
                        <SelectValue placeholder="Selecciona uso" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(BUILDING_USE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingSurface">Superficie Construida (m²)</Label>
                  <Input
                    id="buildingSurface"
                    type="number"
                    step="0.01"
                    min="0"
                    value={buildingSurface}
                    onChange={(e) => setBuildingSurface(e.target.value)}
                    placeholder="Ej: 250.50"
                  />
                </div>

                {buildingTemplate && (
                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info size={16} weight="duotone" className="text-accent" />
                        Información de la Tipología
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {buildingTemplate.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <div>
                        <div className="font-semibold mb-1">Requisitos Específicos:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {buildingTemplate.specificRequirements.slice(0, 4).map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Normativa Principal:</div>
                        <div className="flex flex-wrap gap-1">
                          {buildingTemplate.regulatoryFocus.slice(0, 4).map((reg, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{reg}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Fases del Proyecto *</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seleccione las fases del proyecto y asigne el porcentaje de honorarios a cada una
                  </p>
                </div>
                <div className="space-y-3">
                  {ALL_PHASES.map((phase) => (
                    <div key={phase} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Checkbox
                        id={phase}
                        checked={selectedPhases.has(phase)}
                        onCheckedChange={() => handlePhaseToggle(phase)}
                      />
                      <Label htmlFor={phase} className="flex-1 cursor-pointer">
                        {PHASE_LABELS[phase]}
                      </Label>
                      {selectedPhases.has(phase) && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={phasePercentages[phase] || 0}
                            onChange={(e) => handlePercentageChange(phase, e.target.value)}
                            className="w-20"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {selectedPhases.size > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total de porcentaje asignado:</span>
                      <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-primary' : 'text-accent'}`}>
                        {totalPercentage}%
                      </span>
                    </div>
                    {totalPercentage !== 100 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        El total debería sumar 100% para un proyecto completo
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center gap-3 pt-4">
                <div>
                  {project && onDelete && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="gap-2"
                    >
                      <Trash size={18} weight="duotone" />
                      Eliminar Proyecto
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={!title || !location || !clientId || selectedPhases.size === 0}
                  >
                    {project ? 'Guardar Cambios' : 'Crear Proyecto'}
                  </Button>
                </div>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el proyecto "{project?.title}" y todos sus datos asociados 
              (documentos, presupuestos, hitos, facturas). Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar Definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
