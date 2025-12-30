import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import {
  FilePdf,
  FileText,
  Check,
  CheckCircle,
  Gear,
  ArrowRight,
  Package
} from '@phosphor-icons/react'
import { Document } from '@/lib/types'
import { exportDocumentToPDF, PDFExportOptions } from '@/lib/pdf-export'
import { toast } from 'sonner'

interface BulkPDFExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documents: Document[]
  documentsContent: Map<string, string>
  projectTitle?: string
}

export function BulkPDFExportDialog({
  open,
  onOpenChange,
  documents,
  documentsContent,
  projectTitle
}: BulkPDFExportDialogProps) {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())
  const [exporting, setExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [pdfOptions, setPdfOptions] = useState<PDFExportOptions>({
    includeMetadata: true,
    includeHeader: true,
    includeFooter: true,
    pageNumbers: true,
    fontSize: 11,
    lineSpacing: 1.5,
    margins: {
      top: 25,
      bottom: 25,
      left: 25,
      right: 25
    }
  })

  const toggleDocument = (docId: string) => {
    const newSelection = new Set(selectedDocs)
    if (newSelection.has(docId)) {
      newSelection.delete(docId)
    } else {
      newSelection.add(docId)
    }
    setSelectedDocs(newSelection)
  }

  const selectAll = () => {
    setSelectedDocs(new Set(documents.map(d => d.id)))
  }

  const deselectAll = () => {
    setSelectedDocs(new Set())
  }

  const handleBulkExport = async () => {
    if (selectedDocs.size === 0) {
      toast.error('Selecciona al menos un documento')
      return
    }

    setExporting(true)
    setExportProgress(0)

    const selectedDocuments = documents.filter(d => selectedDocs.has(d.id))
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < selectedDocuments.length; i++) {
      const doc = selectedDocuments[i]
      const content = documentsContent.get(doc.id)

      if (!content) {
        errorCount++
        continue
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        exportDocumentToPDF(doc, content, projectTitle, pdfOptions)
        successCount++
      } catch (error) {
        console.error(`Error exporting ${doc.name}:`, error)
        errorCount++
      }

      setExportProgress(((i + 1) / selectedDocuments.length) * 100)
    }

    setExporting(false)
    setExportProgress(0)

    if (successCount > 0) {
      toast.success(`${successCount} documento${successCount > 1 ? 's exportados' : ' exportado'}`, {
        description: errorCount > 0 ? `${errorCount} error${errorCount > 1 ? 'es' : ''}` : 'Todos los PDFs generados correctamente'
      })
    } else {
      toast.error('No se pudo exportar ningún documento')
    }

    if (errorCount === 0) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20 text-accent">
                  <FilePdf size={24} weight="duotone" />
                </div>
                Exportación Masiva a PDF
              </DialogTitle>
              <DialogDescription className="mt-2">
                Exporta múltiples documentos a PDF con formato optimizado para impresión
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {selectedDocs.size} de {documents.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-2/3 border-r flex flex-col">
            <div className="p-4 border-b bg-muted/30 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Documentos Disponibles</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={selectAll}>
                    <CheckCircle size={16} className="mr-2" />
                    Todos
                  </Button>
                  <Button size="sm" variant="outline" onClick={deselectAll}>
                    Ninguno
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2 pb-4">
                {documents.map((doc) => {
                  const hasContent = documentsContent.has(doc.id)
                  const isSelected = selectedDocs.has(doc.id)

                  return (
                    <Card
                      key={doc.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? 'ring-2 ring-primary bg-primary/5'
                          : hasContent
                          ? 'hover:border-primary/50'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => hasContent && toggleDocument(doc.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={!hasContent}
                            onCheckedChange={() => hasContent && toggleDocument(doc.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-1">{doc.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {doc.type} • Versión {doc.versions[0].version}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {hasContent ? (
                                  <Badge variant="outline" className="text-xs">
                                    <Check size={12} className="mr-1" />
                                    Listo
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    Sin contenido
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="w-1/3 flex flex-col">
            <div className="p-4 border-b bg-muted/30 flex-shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Gear size={16} />
                Opciones de Exportación
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Contenido
                  </Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="metadata"
                      checked={pdfOptions.includeMetadata}
                      onCheckedChange={(checked) =>
                        setPdfOptions(prev => ({ ...prev, includeMetadata: !!checked }))
                      }
                    />
                    <Label htmlFor="metadata" className="text-sm font-normal">
                      Incluir metadata
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="header"
                      checked={pdfOptions.includeHeader}
                      onCheckedChange={(checked) =>
                        setPdfOptions(prev => ({ ...prev, includeHeader: !!checked }))
                      }
                    />
                    <Label htmlFor="header" className="text-sm font-normal">
                      Encabezado de página
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="footer"
                      checked={pdfOptions.includeFooter}
                      onCheckedChange={(checked) =>
                        setPdfOptions(prev => ({ ...prev, includeFooter: !!checked }))
                      }
                    />
                    <Label htmlFor="footer" className="text-sm font-normal">
                      Pie de página
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pagenumbers"
                      checked={pdfOptions.pageNumbers}
                      onCheckedChange={(checked) =>
                        setPdfOptions(prev => ({ ...prev, pageNumbers: !!checked }))
                      }
                    />
                    <Label htmlFor="pagenumbers" className="text-sm font-normal">
                      Números de página
                    </Label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Formato
                  </Label>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontsize" className="text-sm">
                        Tamaño de fuente
                      </Label>
                      <span className="text-sm font-medium">{pdfOptions.fontSize}pt</span>
                    </div>
                    <Slider
                      id="fontsize"
                      min={9}
                      max={14}
                      step={1}
                      value={[pdfOptions.fontSize || 11]}
                      onValueChange={([value]) =>
                        setPdfOptions(prev => ({ ...prev, fontSize: value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="linespacing" className="text-sm">
                        Interlineado
                      </Label>
                      <span className="text-sm font-medium">{pdfOptions.lineSpacing?.toFixed(1)}x</span>
                    </div>
                    <Slider
                      id="linespacing"
                      min={1}
                      max={2}
                      step={0.1}
                      value={[pdfOptions.lineSpacing || 1.5]}
                      onValueChange={([value]) =>
                        setPdfOptions(prev => ({ ...prev, lineSpacing: value }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">
                    Marca de Agua (Opcional)
                  </Label>
                  <Input
                    placeholder="Ej: BORRADOR"
                    value={pdfOptions.watermark || ''}
                    onChange={(e) =>
                      setPdfOptions(prev => ({ ...prev, watermark: e.target.value || undefined }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Aparecerá diagonal en el centro de cada página
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {exporting && (
          <div className="px-6 py-3 border-t bg-muted/30 flex-shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Exportando documentos...</span>
                <span className="text-muted-foreground">{Math.round(exportProgress)}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t bg-muted/10 flex items-center justify-between flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={exporting}>
            Cancelar
          </Button>
          <Button
            onClick={handleBulkExport}
            disabled={selectedDocs.size === 0 || exporting}
            className="gap-2"
          >
            <Package size={18} weight="duotone" />
            {exporting ? 'Exportando...' : `Exportar ${selectedDocs.size} PDF${selectedDocs.size > 1 ? 's' : ''}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
