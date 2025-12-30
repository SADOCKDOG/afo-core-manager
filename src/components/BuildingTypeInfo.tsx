import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Building, ListChecks, FileText, Wrench } from '@phosphor-icons/react'
import { BuildingType, BUILDING_TYPE_LABELS } from '@/lib/types'
import { getBuildingTypeTemplate } from '@/lib/building-type-templates'

interface BuildingTypeInfoProps {
  buildingType: BuildingType
  buildingSurface?: number
}

export function BuildingTypeInfo({ buildingType, buildingSurface }: BuildingTypeInfoProps) {
  const template = getBuildingTypeTemplate(buildingType)

  if (!template) {
    return null
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'residencial': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'comercial': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'industrial': return 'bg-orange-500/10 text-orange-700 border-orange-200'
      case 'educativo': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building size={24} weight="duotone" className="text-primary" />
              {BUILDING_TYPE_LABELS[buildingType]}
            </CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </div>
          <Badge className={getCategoryColor(template.category)}>
            {template.category.toUpperCase()}
          </Badge>
        </div>
        {buildingSurface && (
          <div className="text-sm text-muted-foreground mt-2">
            Superficie construida: <span className="font-semibold">{buildingSurface.toLocaleString('es-ES')} m²</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <ListChecks size={18} weight="duotone" className="text-accent" />
              Requisitos Específicos
            </div>
            <ScrollArea className="h-32">
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {template.specificRequirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <FileText size={18} weight="duotone" className="text-accent" />
              Normativa Principal
            </div>
            <ScrollArea className="h-32">
              <div className="flex flex-wrap gap-1.5">
                {template.regulatoryFocus.map((reg, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {reg}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Wrench size={18} weight="duotone" className="text-accent" />
            Consideraciones Técnicas Principales
          </div>
          <ScrollArea className="h-24">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {template.technicalConsiderations.slice(0, 6).map((consideration, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold text-sm">Espacios Típicos</div>
          <div className="flex flex-wrap gap-1.5">
            {template.typicalSpaces.slice(0, 8).map((space, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {space}
              </Badge>
            ))}
            {template.typicalSpaces.length > 8 && (
              <Badge variant="secondary" className="text-xs">
                +{template.typicalSpaces.length - 8} más
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold text-sm">Documentación Necesaria</div>
          <ScrollArea className="h-24">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {template.documentationNeeds.map((doc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
