import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
} from '
import { toast
interface ProjectDia
  onOpenChange: (ope
  onDelete?: (project
}
const ALL_PHASES: Pr
export function Proj
  
  const [description, setDescription]
  const [clientId, setClientId] = useState(''
  const [selectedPhases, setSe

  useEffect(() => {
      setTitle(
      setLocation(project.location)
      setStatus(project.status)
      setSelectedPhases(phases)
      project.phase
 

      setDescription('')

      setSelectedPhases(new Set())
    }

    const newSelected = new Set(selected
      newSelected.delete(phase)
      delete newPercentages[phase]
    } else {
      setPhasePercentages({ ...phasePercentages, [phase]: 0 })
    setSelectedPhases(newSelected)

    const numValue = parseInt(value) || 0

  const totalPercen
  const handleSubm
    
      phase,
      status: project?.phases.find(

      ...(project || {}),
      description,
      clientId,
      phases,
    })
    onOpenChange(false)

    if (project && onDelete) {
      setDel
      toast.succes
  }
  return (
      <DialogContent 
          <DialogTitle cl
          </DialogTitle>
            Complete la información básica del proyecto y sel
     
        <form onSubmi

              <Input
                value={title}
                placeholder="Ej: 
              />

              <Label htmlFor="loca
                id="location"
            
                required
            </div>
     
              <Textarea
   

              />

              <Label htmlFor="client">Cliente (Promotor) *</Label>
   

                  {(clients || []).length === 0 ? (

                      const name = client.type =
                      
    
                        </SelectItem>
            
                </SelectContent>
              {(clients || []).length === 0 && (
       


              <Label html
            
                </
               
               
             
          </d
          <Separator />
      
    
                Selecci
   

                <div key={phase} clas
                    id={phase}
                    onChec
                  <Label htmlFor
                  </Label
                    <div className="flex items-center g
     
   

          
                    </div>
                </div>
            </div>
          <DialogTitle className="text-2xl">
            {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </DialogTitle>
          <DialogDescription>
            Complete la información básica del proyecto y seleccione las fases contratadas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Proyecto *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Vivienda Unifamiliar en Cartagena"
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
                placeholder="Breve descripción del proyecto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Cliente (Promotor) *</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {(clients || []).length === 0 ? (
                    <SelectItem value="" disabled>No hay clientes disponibles</SelectItem>
                  ) : (
                    (clients || []).map(client => {
                      const name = client.type === 'persona-juridica' 
                        ? client.razonSocial 
                        : `${client.nombre} ${client.apellido1}`
                      return (
                        <SelectItem key={client.id} value={client.id}>
                          {name} - {client.nif}
                        </SelectItem>
                      )
                    })
                  )}
                </SelectContent>
              </Select>
              {(clients || []).length === 0 && (
                <p className="text-sm text-destructive">
                  Debe crear un cliente antes de crear un proyecto
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado del Proyecto</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as ProjectStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="on-hold">En Pausa</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-base">Fases Contratadas</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Seleccione las fases del proyecto y asigne el porcentaje de participación.
              </p>
            </div>

            <div className="space-y-3">
              {ALL_PHASES.map(phase => (
                <div key={phase} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                  <Checkbox
                    id={phase}
                    checked={selectedPhases.has(phase)}
                    onCheckedChange={() => handlePhaseToggle(phase)}
                  />
                  <Label htmlFor={phase} className="flex-1 cursor-pointer font-normal">
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
                        className="w-20 font-mono text-right"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPhases.size > 0 && (
              <div className={`p-3 rounded-lg border ${totalPercentage === 100 ? 'bg-primary/10 border-primary/30' : 'bg-accent/10 border-accent/30'}`}>
































































