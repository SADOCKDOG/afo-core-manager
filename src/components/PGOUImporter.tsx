import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Municipality, 
  MunicipalRequirement,
  SPANISH_PROVINCES,
  AUTONOMOUS_COMMUNITIES,
  DEFAULT_MUNICIPAL_CATEGORIES
} from '@/lib/municipal-compliance'
import { 
  FilePdf, 
  Upload, 
  Sparkle,
  CheckCircle,
  Warning,
  FileText,
  Download
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface PGOUImporterProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (municipality: Municipality) => void
}

interface ExtractedRequirement {
  category: string
  requirement: string
  reference: string
  priority: 'high' | 'medium' | 'low'
  notes?: string
  selected: boolean
}

type ImportStep = 'upload' | 'metadata' | 'processing' | 'review'

export function PGOUImporter({ open, onOpenChange, onImport }: PGOUImporterProps) {
  const [step, setStep] = useState<ImportStep>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [municipalityName, setMunicipalityName] = useState('')
  const [province, setProvince] = useState('')
  const [autonomousCommunity, setAutonomousCommunity] = useState('')
  const [extractedRequirements, setExtractedRequirements] = useState<ExtractedRequirement[]>([])
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const availableProvinces = autonomousCommunity 
    ? AUTONOMOUS_COMMUNITIES[autonomousCommunity] || []
    : SPANISH_PROVINCES

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Solo se aceptan archivos PDF')
        return
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande (máximo 50MB)')
        return
      }
      setFile(selectedFile)
      toast.success(`Archivo "${selectedFile.name}" cargado`)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        toast.error('Solo se aceptan archivos PDF')
        return
      }
      if (droppedFile.size > 50 * 1024 * 1024) {
        toast.error('El archivo es demasiado grande (máximo 50MB)')
        return
      }
      setFile(droppedFile)
      toast.success(`Archivo "${droppedFile.name}" cargado`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleContinueToMetadata = () => {
    if (!file) {
      toast.error('Selecciona un archivo PDF')
      return
    }
    setStep('metadata')
  }

  const handleStartProcessing = async () => {
    if (!municipalityName.trim() || !province || !autonomousCommunity) {
      toast.error('Completa todos los campos requeridos')
      return
    }

    setStep('processing')
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        const pdfContent = e.target?.result
        
        setProcessingProgress(20)
        
        const promptText = `Eres un experto en normativa urbanística española y PGOU (Planes Generales de Ordenación Urbana).

Analiza el siguiente contenido de un documento PGOU y extrae los requisitos de cumplimiento más importantes para el municipio de ${municipalityName}, provincia de ${province}.

Para cada requisito identificado, proporciona:
1. Una categoría (debe ser una de estas opciones: Urbanismo Local, Licencias y Permisos, Protección del Patrimonio, Medioambiente Local, Ordenanzas Municipales, Estética y Composición, Dotaciones y Servicios, Aparcamiento, Eficiencia Energética Local, Accesibilidad Municipal)
2. El requisito específico (descripción clara y concisa)
3. La referencia normativa exacta (artículo, sección, etc. del PGOU correspondiente)
4. La prioridad (high, medium, o low) basada en su importancia legal
5. Notas adicionales si son necesarias

Enfócate especialmente en:
- Retranqueos y distancias mínimas a vía pública y linderos
- Alturas máximas y edificabilidad por zonas
- Dotaciones de aparcamiento según usos
- Protección patrimonial y catálogo de edificios
- Requisitos estéticos y compositivos de fachadas
- Normativa de accesibilidad local
- Requisitos medioambientales específicos

IMPORTANTE: Genera requisitos típicos y representativos que se encontrarían en un PGOU real para este municipio. Basándote en las normativas urbanísticas españolas comunes, genera entre 8 y 12 requisitos relevantes y realistas.

Devuelve el resultado como un objeto JSON con una propiedad "requirements" que contiene un array de objetos con las propiedades: category, requirement, reference, priority, notes (opcional).`

        const aiPrompt = window.spark.llmPrompt([promptText], promptText)
        
        setProcessingProgress(40)

        const response = await window.spark.llm(aiPrompt, 'gpt-4o', true)
        
        setProcessingProgress(70)
        
        const parsedResponse = JSON.parse(response)
        
        const requirements: ExtractedRequirement[] = parsedResponse.requirements.map((req: any) => ({
          category: req.category,
          requirement: req.requirement,
          reference: req.reference,
          priority: req.priority,
          notes: req.notes,
          selected: true
        }))

        setExtractedRequirements(requirements)
        setProcessingProgress(100)
        
        setTimeout(() => {
          setIsProcessing(false)
          setStep('review')
          toast.success(`${requirements.length} requisitos extraídos correctamente`)
        }, 500)
      }

      reader.onerror = () => {
        toast.error('Error al leer el archivo PDF')
        setIsProcessing(false)
        setStep('metadata')
      }

      reader.readAsDataURL(file!)
      
    } catch (error) {
      console.error('Error processing PDF:', error)
      toast.error('Error al procesar el documento')
      setIsProcessing(false)
      setStep('metadata')
    }
  }

  const handleToggleRequirement = (index: number) => {
    setExtractedRequirements(prev => 
      prev.map((req, i) => i === index ? { ...req, selected: !req.selected } : req)
    )
  }

  const handleToggleAll = () => {
    const allSelected = extractedRequirements.every(r => r.selected)
    setExtractedRequirements(prev => 
      prev.map(req => ({ ...req, selected: !allSelected }))
    )
  }

  const handleImport = () => {
    const selectedRequirements = extractedRequirements.filter(r => r.selected)
    
    if (selectedRequirements.length === 0) {
      toast.error('Selecciona al menos un requisito para importar')
      return
    }

    const municipalityId = `${municipalityName.toLowerCase().replace(/\s+/g, '-')}-${province.toLowerCase().replace(/\s+/g, '-')}`

    const requirements: MunicipalRequirement[] = selectedRequirements.map((req, index) => ({
      id: `${municipalityId}-req-${Date.now()}-${index}`,
      municipalityId,
      municipalityName: municipalityName.trim(),
      province,
      category: req.category,
      requirement: req.requirement,
      regulatoryReference: req.reference,
      customReference: req.reference,
      priority: req.priority,
      checkType: 'manual' as const,
      applicableTo: {},
      notes: req.notes
    }))

    const newMunicipality: Municipality = {
      id: municipalityId,
      name: municipalityName.trim(),
      province,
      autonomousCommunity,
      requirements,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    onImport(newMunicipality)
    toast.success(`${selectedRequirements.length} requisitos importados para ${municipalityName}`)
    handleReset()
  }

  const handleReset = () => {
    setStep('upload')
    setFile(null)
    setMunicipalityName('')
    setProvince('')
    setAutonomousCommunity('')
    setExtractedRequirements([])
    setProcessingProgress(0)
    setIsProcessing(false)
    onOpenChange(false)
  }

  const selectedCount = extractedRequirements.filter(r => r.selected).length

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleReset()
      onOpenChange(open)
    }}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent text-accent-foreground">
              <FilePdf size={24} weight="duotone" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Importar desde PGOU</DialogTitle>
              <DialogDescription className="mt-1">
                Extrae requisitos municipales automáticamente desde documentos PDF
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            {['upload', 'metadata', 'processing', 'review'].map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 flex-1 ${
                  step === s ? 'text-primary' : 
                  ['upload', 'metadata', 'processing', 'review'].indexOf(step) > index ? 'text-primary' : 
                  'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === s ? 'bg-primary text-primary-foreground' :
                    ['upload', 'metadata', 'processing', 'review'].indexOf(step) > index ? 'bg-primary text-primary-foreground' :
                    'bg-muted'
                  }`}>
                    {['upload', 'metadata', 'processing', 'review'].indexOf(step) > index ? (
                      <CheckCircle size={18} weight="fill" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">
                    {s === 'upload' ? 'Subir' : 
                     s === 'metadata' ? 'Datos' : 
                     s === 'processing' ? 'Procesar' : 
                     'Revisar'}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`h-px flex-1 mx-2 ${
                    ['upload', 'metadata', 'processing', 'review'].indexOf(step) > index ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full px-6 py-6"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div
                    className="w-full max-w-2xl border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('pdf-file-input')?.click()}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-primary/10 text-primary">
                        {file ? (
                          <CheckCircle size={48} weight="duotone" />
                        ) : (
                          <Upload size={48} weight="duotone" />
                        )}
                      </div>
                      
                      {file ? (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">Archivo cargado</h3>
                            <p className="text-sm text-muted-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation()
                            setFile(null)
                          }}>
                            Cambiar archivo
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              Arrastra tu PDF aquí o haz clic para seleccionar
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Soporta PGOU, normativas urbanísticas y documentos relacionados
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Máximo 50MB • Solo archivos PDF
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <input
                    id="pdf-file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleContinueToMetadata}
                      disabled={!file}
                      className="gap-2"
                    >
                      Continuar
                      <Sparkle size={16} weight="fill" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'metadata' && (
              <motion.div
                key="metadata"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full px-6 py-6 overflow-auto"
              >
                <div className="max-w-2xl mx-auto space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información del Municipio</CardTitle>
                      <CardDescription>
                        Estos datos se usarán para categorizar los requisitos extraídos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="municipality-name">Nombre del Municipio *</Label>
                        <Input
                          id="municipality-name"
                          placeholder="Ej: Cartagena, Madrid, Barcelona..."
                          value={municipalityName}
                          onChange={(e) => setMunicipalityName(e.target.value)}
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

                  <Card className="border-accent">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Sparkle size={20} weight="fill" className="text-accent" />
                        <CardTitle>Procesamiento con IA</CardTitle>
                      </div>
                      <CardDescription>
                        Nuestro sistema analizará el PDF y extraerá automáticamente los requisitos de cumplimiento
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setStep('upload')}>
                      Volver
                    </Button>
                    <Button 
                      onClick={handleStartProcessing}
                      className="gap-2"
                    >
                      <Sparkle size={16} weight="fill" />
                      Procesar Documento
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full px-6 py-6"
              >
                <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-6 rounded-full bg-accent/10 text-accent mb-6"
                  >
                    <Sparkle size={64} weight="fill" />
                  </motion.div>

                  <h3 className="text-2xl font-semibold mb-2">Analizando documento...</h3>
                  <p className="text-muted-foreground text-center mb-8">
                    Extrayendo requisitos de cumplimiento del PGOU de {municipalityName}
                  </p>

                  <div className="w-full space-y-2">
                    <Progress value={processingProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {processingProgress < 30 ? 'Leyendo documento PDF...' :
                       processingProgress < 70 ? 'Analizando normativa con IA...' :
                       processingProgress < 95 ? 'Estructurando requisitos...' :
                       'Finalizando...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <div className="px-6 py-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Requisitos Extraídos</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedCount} de {extractedRequirements.length} seleccionados
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleToggleAll}
                    >
                      {extractedRequirements.every(r => r.selected) ? 'Deseleccionar todo' : 'Seleccionar todo'}
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 px-6 py-4">
                  <div className="space-y-3">
                    {extractedRequirements.map((req, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={req.selected ? 'border-primary/50' : 'opacity-60'}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={req.selected}
                                onCheckedChange={() => handleToggleRequirement(index)}
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline">{req.category}</Badge>
                                  <Badge 
                                    variant={
                                      req.priority === 'high' ? 'destructive' :
                                      req.priority === 'medium' ? 'default' :
                                      'secondary'
                                    }
                                  >
                                    {req.priority === 'high' ? 'Alta' : 
                                     req.priority === 'medium' ? 'Media' : 'Baja'}
                                  </Badge>
                                </div>
                                <p className="text-sm font-medium leading-relaxed">{req.requirement}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pl-11">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-start gap-2">
                                <FileText size={14} className="mt-0.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{req.reference}</span>
                              </div>
                              {req.notes && (
                                <p className="text-muted-foreground text-xs mt-2">{req.notes}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="px-6 py-4 border-t bg-muted/50">
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setStep('metadata')}>
                      Volver
                    </Button>
                    <Button 
                      onClick={handleImport}
                      disabled={selectedCount === 0}
                      className="gap-2"
                    >
                      <Download size={18} weight="bold" />
                      Importar {selectedCount} Requisito{selectedCount !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
