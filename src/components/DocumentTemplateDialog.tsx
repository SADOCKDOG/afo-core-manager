import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  ArrowLeft, 
  Check, 
  MagnifyingGlass,
  BookOpen,
  Files,
  FileArchive,
  Calculator,
  Blueprint
} from '@phosphor-icons/react'
import { DocumentTemplate, TEMPLATE_CATEGORIES, TemplateCategory } from '@/lib/types'
import { ARCHITECTURAL_TEMPLATES, getTemplatesByCategory } from '@/lib/document-templates'
import { toast } from 'sonner'

interface DocumentTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: DocumentTemplate, customFields: Record<string, string>) => void
}

export function DocumentTemplateDialog({ open, onOpenChange, onSelectTemplate }: DocumentTemplateDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})

  const filteredTemplates = getTemplatesByCategory(selectedCategory).filter(template => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query)
    )
  })

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
    const initialFields: Record<string, string> = {}
    template.requiredFields.forEach(field => {
      initialFields[field] = ''
    })
    setCustomFields(initialFields)
  }

  const handleBack = () => {
    setSelectedTemplate(null)
    setCustomFields({})
  }

  const handleFieldChange = (field: string, value: string) => {
    setCustomFields(prev => ({ ...prev, [field]: value }))
  }

  const handleUseTemplate = () => {
    if (!selectedTemplate) return

    const missingFields = selectedTemplate.requiredFields.filter(field => !customFields[field]?.trim())
    if (missingFields.length > 0) {
      toast.error('Por favor, complete todos los campos obligatorios')
      return
    }

    onSelectTemplate(selectedTemplate, customFields)
    onOpenChange(false)
    setSelectedTemplate(null)
    setCustomFields({})
    setSearchQuery('')
    toast.success('Plantilla seleccionada correctamente')
  }

  const getCategoryIcon = (category: TemplateCategory) => {
    switch (category) {
      case 'memoria':
        return <BookOpen size={18} weight="duotone" />
      case 'planos':
        return <Blueprint size={18} weight="duotone" />
      case 'administrativo':
        return <FileArchive size={18} weight="duotone" />
      case 'presupuesto':
        return <Calculator size={18} weight="duotone" />
      case 'calculo':
        return <Files size={18} weight="duotone" />
    }
  }

  const fieldLabels: Record<string, string> = {
    promotor: 'Promotor',
    arquitecto: 'Arquitecto',
    ubicacion: 'Ubicación',
    superficie: 'Superficie',
    constructor: 'Constructor',
    zona_climatica: 'Zona Climática',
    superficie_util: 'Superficie Útil',
    uso: 'Uso del Edificio',
    proyecto: 'Nombre del Proyecto',
    direccion_obra: 'Dirección de la Obra',
    escala: 'Escala'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0">
        {!selectedTemplate ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <FileText size={28} weight="duotone" className="text-primary" />
                Plantillas de Documentos
              </DialogTitle>
              <DialogDescription>
                Seleccione una plantilla para crear documentos arquitectónicos estandarizados
              </DialogDescription>
            </DialogHeader>

            <div className="px-6">
              <div className="relative mb-4">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar plantillas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  {Object.entries(TEMPLATE_CATEGORIES).map(([key, label]) => (
                    <TabsTrigger key={key} value={key} className="gap-2">
                      {getCategoryIcon(key as TemplateCategory)}
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="h-[600px] px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="group relative p-5 rounded-lg border bg-card text-left transition-all hover:shadow-md hover:border-primary"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getCategoryIcon(template.category)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {template.sections.length} secciones
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {TEMPLATE_CATEGORIES[template.category]}
                      </Badge>
                      {template.discipline && (
                        <span>· {template.discipline}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <FileText size={48} className="text-muted-foreground" weight="duotone" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No se encontraron plantillas</h3>
                  <p className="text-muted-foreground">
                    Intente ajustar los filtros o búsqueda
                  </p>
                </div>
              )}
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft size={18} />
                </Button>
                <div className="flex-1">
                  <DialogTitle className="text-xl">{selectedTemplate.name}</DialogTitle>
                  <DialogDescription>{selectedTemplate.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[600px] px-6">
              <div className="space-y-6 pb-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Check size={18} className="text-primary" />
                    Campos Obligatorios
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTemplate.requiredFields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field}>
                          {fieldLabels[field] || field} *
                        </Label>
                        <Input
                          id={field}
                          value={customFields[field] || ''}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          placeholder={`Ingrese ${fieldLabels[field]?.toLowerCase() || field}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Files size={18} className="text-primary" />
                    Estructura del Documento
                  </h3>
                  <div className="space-y-3">
                    {selectedTemplate.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="p-4 rounded-lg border bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm">{section.title}</h4>
                          {section.required && (
                            <Badge variant="secondary" className="text-xs">
                              Obligatorio
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3 font-mono">
                          {section.content.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Nota:</strong> Esta plantilla generará un documento con {selectedTemplate.sections.length} secciones predefinidas. 
                    Los campos entre corchetes [CAMPO] serán reemplazados con la información que proporcione.
                  </p>
                </div>
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={handleBack}>
                Cancelar
              </Button>
              <Button onClick={handleUseTemplate} className="gap-2">
                <Check size={18} />
                Usar Plantilla
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
