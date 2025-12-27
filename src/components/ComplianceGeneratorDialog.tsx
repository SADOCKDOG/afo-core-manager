import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sparkle, ArrowRight, MapPin } from '@phosphor-icons/react'
import { BuildingType, BuildingUse } from '@/lib/types'
import { BUILDING_TYPE_LABELS, BUILDING_USE_LABELS, CLIMATE_ZONES } from '@/lib/compliance-data'
import { Municipality, EXAMPLE_MUNICIPALITIES } from '@/lib/municipal-compliance'

interface ComplianceGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (data: {
    buildingType: BuildingType
    buildingUse: BuildingUse
    buildingSurface?: number
    buildingHeight?: number
    climateZone?: string
    municipalityId?: string
  }) => void
  projectTitle: string
}

export function ComplianceGeneratorDialog({
  open,
  onOpenChange,
  onGenerate,
  projectTitle
}: ComplianceGeneratorDialogProps) {
  const [municipalities] = useKV<Municipality[]>('municipalities', EXAMPLE_MUNICIPALITIES)
  const [buildingType, setBuildingType] = useState<BuildingType>('vivienda-unifamiliar')
  const [buildingUse, setBuildingUse] = useState<BuildingUse>('residencial-vivienda')
  const [buildingSurface, setBuildingSurface] = useState('')
  const [buildingHeight, setBuildingHeight] = useState('')
  const [climateZone, setClimateZone] = useState('')
  const [municipalityId, setMunicipalityId] = useState('')

  const selectedMunicipality = municipalities?.find(m => m.id === municipalityId)

  const handleGenerate = () => {
    onGenerate({
      buildingType,
      buildingUse,
      buildingSurface: buildingSurface ? parseFloat(buildingSurface) : undefined,
      buildingHeight: buildingHeight ? parseFloat(buildingHeight) : undefined,
      climateZone: climateZone || undefined,
      municipalityId: municipalityId || undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Sparkle size={24} weight="duotone" />
            </div>
            <DialogTitle className="text-2xl">Generar Checklist de Cumplimiento</DialogTitle>
          </div>
          <DialogDescription>
            Cree automáticamente una lista de verificación de cumplimiento normativo personalizada para <strong>{projectTitle}</strong>. 
            El sistema generará requisitos específicos según las características del edificio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building-type">Tipo de Edificación *</Label>
              <Select value={buildingType} onValueChange={(val) => setBuildingType(val as BuildingType)}>
                <SelectTrigger id="building-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUILDING_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="building-use">Uso del Edificio *</Label>
              <Select value={buildingUse} onValueChange={(val) => setBuildingUse(val as BuildingUse)}>
                <SelectTrigger id="building-use">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUILDING_USE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surface">Superficie Construida (m²)</Label>
              <Input
                id="surface"
                type="number"
                placeholder="150"
                value={buildingSurface}
                onChange={(e) => setBuildingSurface(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Opcional: Para cálculos específicos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura de Edificación (m)</Label>
              <Input
                id="height"
                type="number"
                placeholder="7.5"
                value={buildingHeight}
                onChange={(e) => setBuildingHeight(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Opcional: Para requisitos de altura</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="climate-zone">Zona Climática</Label>
              <Select value={climateZone} onValueChange={setClimateZone}>
                <SelectTrigger id="climate-zone">
                  <SelectValue placeholder="Seleccionar zona climática" />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATE_ZONES.map(zone => (
                    <SelectItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Opcional: Requisitos energéticos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">Municipio</Label>
              <Select value={municipalityId} onValueChange={setMunicipalityId}>
                <SelectTrigger id="municipality">
                  <SelectValue placeholder="Sin municipio específico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Ninguno</SelectItem>
                  {(municipalities || []).map(municipality => (
                    <SelectItem key={municipality.id} value={municipality.id}>
                      {municipality.name} ({municipality.province})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Opcional: Requisitos locales</p>
            </div>
          </div>

          {selectedMunicipality && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <MapPin size={18} weight="duotone" />
                <h4 className="font-semibold text-sm">
                  Requisitos Municipales: {selectedMunicipality.name}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Se añadirán {selectedMunicipality.requirements.length} requisitos específicos de {selectedMunicipality.name}, {selectedMunicipality.province}
              </p>
            </div>
          )}

          <Separator />

          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkle size={16} weight="fill" className="text-accent" />
              Checklist Generado Incluye:
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-start">CTE - Seguridad Estructural</Badge>
              <Badge variant="outline" className="justify-start">CTE - Seguridad en Incendio</Badge>
              <Badge variant="outline" className="justify-start">CTE - Accesibilidad (SUA)</Badge>
              <Badge variant="outline" className="justify-start">CTE - Salubridad (HS)</Badge>
              <Badge variant="outline" className="justify-start">CTE - Ahorro de Energía (HE)</Badge>
              <Badge variant="outline" className="justify-start">CTE - Protección Ruido (HR)</Badge>
              <Badge variant="outline" className="justify-start">RITE - Instalaciones Térmicas</Badge>
              <Badge variant="outline" className="justify-start">REBT - Instalaciones Eléctricas</Badge>
              <Badge variant="outline" className="justify-start">Urbanismo y Planeamiento</Badge>
              <Badge variant="outline" className="justify-start">Gestión de Residuos</Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerate} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Sparkle size={18} weight="fill" />
            Generar Checklist
            <ArrowRight size={18} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
