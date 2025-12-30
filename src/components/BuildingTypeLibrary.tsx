import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Building, MagnifyingGlass, ListChecks, FileText, Wrench, Sparkle } from '@phosphor-icons/react'
import { BUILDING_TYPE_TEMPLATES, BuildingTypeTemplate, getBuildingTypesByCategory } from '@/lib/building-type-templates'
import { BUILDING_TYPE_LABELS } from '@/lib/types'

export function BuildingTypeLibrary() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<BuildingTypeTemplate | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residencial' | 'comercial' | 'industrial' | 'educativo'>('all')

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'residencial': return 'bg-blue-500/10 text-blue-700 border-blue-200'
      case 'comercial': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'industrial': return 'bg-orange-500/10 text-orange-700 border-orange-200'
      case 'educativo': return 'bg-purple-500/10 text-purple-700 border-purple-200'
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200'
    }
  }

  const filteredTemplates = BUILDING_TYPE_TEMPLATES.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Building size={16} weight="duotone" />
          Biblioteca de Tipologías
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building size={28} weight="duotone" className="text-primary" />
            Biblioteca de Tipologías de Edificios
          </DialogTitle>
          <DialogDescription>
            Explore las plantillas de edificios con requisitos, normativa y consideraciones técnicas específicas
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(90vh-150px)]">
          <div className="md:w-1/3 space-y-4">
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar tipología..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                <TabsTrigger value="residencial" className="text-xs">Resid.</TabsTrigger>
                <TabsTrigger value="comercial" className="text-xs">Comerc.</TabsTrigger>
                <TabsTrigger value="industrial" className="text-xs">Indust.</TabsTrigger>
                <TabsTrigger value="educativo" className="text-xs">Educ.</TabsTrigger>
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[calc(90vh-320px)]">
              <div className="space-y-2 pr-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.type}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.type === template.type ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge className={getCategoryColor(template.category)} variant="outline">
                          {template.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No se encontraron tipologías</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="md:w-2/3">
            {selectedTemplate ? (
              <ScrollArea className="h-full pr-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold">{selectedTemplate.name}</h3>
                        <p className="text-muted-foreground mt-1">{selectedTemplate.description}</p>
                      </div>
                      <Badge className={getCategoryColor(selectedTemplate.category)}>
                        {selectedTemplate.category.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      Uso predeterminado: {selectedTemplate.defaultUse}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <ListChecks size={20} weight="duotone" className="text-accent" />
                      Requisitos Específicos
                    </div>
                    <ul className="space-y-2 text-sm">
                      {selectedTemplate.specificRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 bg-muted/50 p-3 rounded-lg">
                          <span className="text-accent mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText size={20} weight="duotone" className="text-accent" />
                      Normativa y Regulaciones
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.regulatoryFocus.map((reg, i) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Building size={20} weight="duotone" className="text-accent" />
                      Espacios Típicos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.typicalSpaces.map((space, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          {space}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Wrench size={20} weight="duotone" className="text-accent" />
                      Consideraciones Técnicas
                    </div>
                    <ul className="space-y-2 text-sm">
                      {selectedTemplate.technicalConsiderations.map((consideration, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">→</span>
                          <span>{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <Sparkle size={20} weight="duotone" className="text-primary" />
                      Documentación Necesaria
                    </div>
                    <ul className="space-y-2 text-sm">
                      {selectedTemplate.documentationNeeds.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Building size={64} className="mb-4 opacity-50" weight="duotone" />
                <h3 className="text-lg font-semibold mb-2">Selecciona una tipología</h3>
                <p className="text-sm max-w-md">
                  Selecciona una tipología de edificio de la lista para ver sus requisitos específicos,
                  normativa aplicable y consideraciones técnicas.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
