import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Municipality, 
  MunicipalRequirement, 
  SPANISH_PROVINCES, 
  AUTONOMOUS_COMMUNITIES,
  DEFAULT_MUNICIPAL_CATEGORIES,
  EXAMPLE_MUNICIPALITIES,
  searchMunicipalities,
  getMunicipalitiesByProvince
} from '@/lib/municipal-compliance'
import { BuildingType, BuildingUse } from '@/lib/types'
import { BUILDING_TYPE_LABELS, BUILDING_USE_LABELS } from '@/lib/compliance-data'
import { PGOUImporter } from '@/components/PGOUImporter'
import { 
  MapPin, 
  Plus, 
  MagnifyingGlass, 
  Buildings, 
  Pencil,
  Trash,
  FileText,
  CheckCircle,
  Warning,
  FilePdf
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface MunicipalComplianceManagerProps {
  projectId?: string
  onSelectMunicipality?: (municipalityId: string) => void
}

export function MunicipalComplianceManager({ projectId, onSelectMunicipality }: MunicipalComplianceManagerProps) {
  const [municipalities, setMunicipalities] = useKV<Municipality[]>('municipalities', EXAMPLE_MUNICIPALITIES)
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)
  const [editingRequirement, setEditingRequirement] = useState<MunicipalRequirement | null>(null)
  const [requirementDialogOpen, setRequirementDialogOpen] = useState(false)
  const [importerOpen, setImporterOpen] = useState(false)

  const filteredMunicipalities = useMemo(() => {
    let result = municipalities || []
    
    if (searchQuery) {
      result = searchMunicipalities(searchQuery, result)
    }
    
    if (selectedProvince) {
      result = getMunicipalitiesByProvince(selectedProvince, result)
    }
    
    return result
  }, [municipalities, searchQuery, selectedProvince])

  const handleCreateMunicipality = () => {
    setSelectedMunicipality(null)
    setActiveTab('create')
  }

  const handleSelectMunicipality = (municipality: Municipality) => {
    setSelectedMunicipality(municipality)
    setActiveTab('details')
  }

  const handleAddRequirement = () => {
    if (!selectedMunicipality) {
      toast.error('Selecciona un municipio primero')
      return
    }
    setEditingRequirement(null)
    setRequirementDialogOpen(true)
  }

  const handleEditRequirement = (requirement: MunicipalRequirement) => {
    setEditingRequirement(requirement)
    setRequirementDialogOpen(true)
  }

  const handleDeleteRequirement = (requirementId: string) => {
    if (!selectedMunicipality) return

    setMunicipalities(current => {
      return (current || []).map(m => {
        if (m.id === selectedMunicipality.id) {
          return {
            ...m,
            requirements: m.requirements.filter(r => r.id !== requirementId),
            updatedAt: Date.now()
          }
        }
        return m
      })
    })

    setSelectedMunicipality(prev => prev ? {
      ...prev,
      requirements: prev.requirements.filter(r => r.id !== requirementId)
    } : null)

    toast.success('Requisito eliminado')
  }

  const handleApplyToProject = () => {
    if (!selectedMunicipality || !projectId) return
    if (onSelectMunicipality) {
      onSelectMunicipality(selectedMunicipality.id)
      setOpen(false)
      toast.success(`${selectedMunicipality.requirements.length} requisitos de ${selectedMunicipality.name} aplicados al proyecto`)
    }
  }

  const handleImportFromPDF = (municipality: Municipality) => {
    const existingIndex = (municipalities || []).findIndex(m => m.id === municipality.id)
    
    if (existingIndex >= 0) {
      setMunicipalities(current => {
        const updated = [...(current || [])]
        updated[existingIndex] = {
          ...updated[existingIndex],
          requirements: [...updated[existingIndex].requirements, ...municipality.requirements],
          updatedAt: Date.now()
        }
        return updated
      })
      toast.success(`${municipality.requirements.length} requisitos añadidos a ${municipality.name}`)
    } else {
      setMunicipalities(current => [...(current || []), municipality])
      toast.success(`Municipio ${municipality.name} creado con ${municipality.requirements.length} requisitos`)
    }
    
    setSelectedMunicipality(municipality)
    setActiveTab('details')
    setImporterOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MapPin size={18} weight="duotone" />
          Normativa Municipal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Normativa Municipal y Regional</DialogTitle>
              <DialogDescription className="mt-1">
                Gestiona requisitos específicos de cumplimiento para municipios y regiones
              </DialogDescription>
            </div>
            {selectedMunicipality && projectId && (
              <Button onClick={handleApplyToProject} className="gap-2">
                <CheckCircle size={18} weight="bold" />
                Aplicar al Proyecto
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 pb-4 border-b">
            <TabsList>
              <TabsTrigger value="browse">Explorar Municipios</TabsTrigger>
              <TabsTrigger value="create">Crear Municipio</TabsTrigger>
              {selectedMunicipality && (
                <TabsTrigger value="details">
                  Detalles: {selectedMunicipality.name}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="browse" className="flex-1 px-6 py-4 overflow-hidden">
            <div className="flex flex-col h-full gap-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlass 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  />
                  <Input
                    placeholder="Buscar municipio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedProvince || "_all"} onValueChange={(value) => setSelectedProvince(value === '_all' ? '' : value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_all">Todas las provincias</SelectItem>
                    {SPANISH_PROVINCES.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateMunicipality} className="gap-2" variant="outline">
                  <Plus size={18} weight="bold" />
                  Nuevo Municipio
                </Button>
                <Button onClick={() => setImporterOpen(true)} className="gap-2">
                  <FilePdf size={18} weight="duotone" />
                  Importar PGOU
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
                  <AnimatePresence mode="popLayout">
                    {filteredMunicipalities.map((municipality, index) => (
                      <motion.div
                        key={municipality.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
                          onClick={() => handleSelectMunicipality(municipality)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                  <Buildings size={20} weight="duotone" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{municipality.name}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {municipality.province} • {municipality.autonomousCommunity}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {municipality.requirements.length} requisitos
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {[...new Set(municipality.requirements.map(r => r.category))].slice(0, 3).map(category => (
                                <Badge key={category} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {[...new Set(municipality.requirements.map(r => r.category))].length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{[...new Set(municipality.requirements.map(r => r.category))].length - 3} más
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredMunicipalities.length === 0 && (
                    <div className="col-span-2 text-center py-16">
                      <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                        <MapPin size={48} className="text-muted-foreground" weight="duotone" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No se encontraron municipios</h3>
                      <p className="text-muted-foreground mb-4">
                        Prueba con otros criterios de búsqueda o crea un nuevo municipio
                      </p>
                      <Button onClick={handleCreateMunicipality} className="gap-2">
                        <Plus size={18} weight="bold" />
                        Crear Municipio
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="create" className="flex-1 px-6 py-4">
            <CreateMunicipalityForm
              municipalities={municipalities || []}
              onSave={(municipality) => {
                setMunicipalities(current => [...(current || []), municipality])
                setSelectedMunicipality(municipality)
                setActiveTab('details')
                toast.success(`Municipio ${municipality.name} creado correctamente`)
              }}
              onCancel={() => setActiveTab('browse')}
            />
          </TabsContent>

          {selectedMunicipality && (
            <TabsContent value="details" className="flex-1 px-6 py-4 overflow-hidden">
              <div className="flex flex-col h-full gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMunicipality.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedMunicipality.province} • {selectedMunicipality.autonomousCommunity}
                    </p>
                  </div>
                  <Button onClick={handleAddRequirement} className="gap-2">
                    <Plus size={18} weight="bold" />
                    Añadir Requisito
                  </Button>
                </div>

                <Separator />

                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-4">
                    {selectedMunicipality.requirements.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                          <FileText size={48} className="text-muted-foreground" weight="duotone" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No hay requisitos definidos</h3>
                        <p className="text-muted-foreground mb-4">
                          Añade requisitos de cumplimiento específicos para este municipio
                        </p>
                        <Button onClick={handleAddRequirement} className="gap-2">
                          <Plus size={18} weight="bold" />
                          Añadir Primer Requisito
                        </Button>
                      </div>
                    ) : (
                      selectedMunicipality.requirements.map((requirement, index) => (
                        <motion.div
                          key={requirement.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{requirement.category}</Badge>
                                    <Badge 
                                      variant={
                                        requirement.priority === 'high' ? 'destructive' :
                                        requirement.priority === 'medium' ? 'default' :
                                        'secondary'
                                      }
                                    >
                                      {requirement.priority === 'high' ? 'Alta' : 
                                       requirement.priority === 'medium' ? 'Media' : 'Baja'}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-base">{requirement.requirement}</CardTitle>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditRequirement(requirement)}
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteRequirement(requirement.id)}
                                  >
                                    <Trash size={16} />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Referencia: </span>
                                  <span className="font-medium">{requirement.customReference}</span>
                                </div>
                                {requirement.notes && (
                                  <div>
                                    <span className="text-muted-foreground">Notas: </span>
                                    <span>{requirement.notes}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {requirementDialogOpen && selectedMunicipality && (
          <RequirementDialog
            open={requirementDialogOpen}
            onOpenChange={setRequirementDialogOpen}
            municipality={selectedMunicipality}
            requirement={editingRequirement}
            onSave={(requirement) => {
              setMunicipalities(current => {
                return (current || []).map(m => {
                  if (m.id === selectedMunicipality.id) {
                    const existingIndex = m.requirements.findIndex(r => r.id === requirement.id)
                    if (existingIndex >= 0) {
                      const updatedRequirements = [...m.requirements]
                      updatedRequirements[existingIndex] = requirement
                      return { ...m, requirements: updatedRequirements, updatedAt: Date.now() }
                    } else {
                      return { ...m, requirements: [...m.requirements, requirement], updatedAt: Date.now() }
                    }
                  }
                  return m
                })
              })

              setSelectedMunicipality(prev => {
                if (!prev) return null
                const existingIndex = prev.requirements.findIndex(r => r.id === requirement.id)
                if (existingIndex >= 0) {
                  const updatedRequirements = [...prev.requirements]
                  updatedRequirements[existingIndex] = requirement
                  return { ...prev, requirements: updatedRequirements }
                } else {
                  return { ...prev, requirements: [...prev.requirements, requirement] }
                }
              })

              toast.success(editingRequirement ? 'Requisito actualizado' : 'Requisito añadido')
            }}
          />
        )}
      </DialogContent>

      <PGOUImporter
        open={importerOpen}
        onOpenChange={setImporterOpen}
        onImport={handleImportFromPDF}
      />
    </Dialog>
  )
}

interface CreateMunicipalityFormProps {
  municipalities: Municipality[]
  onSave: (municipality: Municipality) => void
  onCancel: () => void
}

function CreateMunicipalityForm({ municipalities, onSave, onCancel }: CreateMunicipalityFormProps) {
  const [name, setName] = useState('')
  const [province, setProvince] = useState('')
  const [autonomousCommunity, setAutonomousCommunity] = useState('')

  const availableProvinces = autonomousCommunity 
    ? AUTONOMOUS_COMMUNITIES[autonomousCommunity] || []
    : SPANISH_PROVINCES

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !province || !autonomousCommunity) {
      toast.error('Completa todos los campos requeridos')
      return
    }

    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${province.toLowerCase().replace(/\s+/g, '-')}`
    
    if (municipalities.some(m => m.id === id)) {
      toast.error('Ya existe un municipio con ese nombre en la provincia')
      return
    }

    const newMunicipality: Municipality = {
      id,
      name: name.trim(),
      province,
      autonomousCommunity,
      requirements: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    onSave(newMunicipality)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Información del Municipio</CardTitle>
          <CardDescription>
            Introduce los datos básicos del municipio o región
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="municipality-name">Nombre del Municipio *</Label>
            <Input
              id="municipality-name"
              placeholder="Ej: Cartagena, Madrid, Barcelona..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="autonomous-community">Comunidad Autónoma *</Label>
            <Select value={autonomousCommunity} onValueChange={(value) => {
              setAutonomousCommunity(value)
              setProvince('')
            }}>
              <SelectTrigger id="autonomous-community">
                <SelectValue placeholder="Selecciona comunidad autónoma" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(AUTONOMOUS_COMMUNITIES).map(community => (
                  <SelectItem key={community} value={community}>{community}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Provincia *</Label>
            <Select value={province} onValueChange={setProvince} disabled={!autonomousCommunity}>
              <SelectTrigger id="province">
                <SelectValue placeholder="Selecciona provincia" />
              </SelectTrigger>
              <SelectContent>
                {availableProvinces.map(prov => (
                  <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Municipio
        </Button>
      </div>
    </form>
  )
}

interface RequirementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  municipality: Municipality
  requirement: MunicipalRequirement | null
  onSave: (requirement: MunicipalRequirement) => void
}

function RequirementDialog({ open, onOpenChange, municipality, requirement, onSave }: RequirementDialogProps) {
  const [category, setCategory] = useState(requirement?.category || '')
  const [requirementText, setRequirementText] = useState(requirement?.requirement || '')
  const [customReference, setCustomReference] = useState(requirement?.customReference || '')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(requirement?.priority || 'medium')
  const [notes, setNotes] = useState(requirement?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!category || !requirementText.trim() || !customReference.trim()) {
      toast.error('Completa todos los campos requeridos')
      return
    }

    const newRequirement: MunicipalRequirement = {
      id: requirement?.id || `${municipality.id}-req-${Date.now()}`,
      municipalityId: municipality.id,
      municipalityName: municipality.name,
      province: municipality.province,
      category,
      requirement: requirementText.trim(),
      regulatoryReference: customReference.trim(),
      customReference: customReference.trim(),
      priority,
      checkType: 'manual',
      applicableTo: {},
      notes: notes.trim() || undefined
    }

    onSave(newRequirement)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {requirement ? 'Editar Requisito' : 'Nuevo Requisito'}
          </DialogTitle>
          <DialogDescription>
            Define un requisito específico de cumplimiento para {municipality.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona categoría" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_MUNICIPAL_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirement">Requisito *</Label>
            <Textarea
              id="requirement"
              placeholder="Describe el requisito de cumplimiento..."
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referencia Normativa *</Label>
            <Input
              id="reference"
              placeholder="Ej: PGOU Cartagena Art. 7.23"
              value={customReference}
              onChange={(e) => setCustomReference(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridad</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as 'high' | 'medium' | 'low')}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Notas adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {requirement ? 'Actualizar' : 'Crear'} Requisito
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
