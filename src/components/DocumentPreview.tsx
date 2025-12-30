import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  Download, 
  Eye, 
  Printer,
  Share,
  Copy,
  Check,
  TextAlignLeft,
  ListNumbers,
  FilePdf,
  Gear
} from '@phosphor-icons/react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Document, ArchitectProfile } from '@/lib/types'
import { exportDocumentToPDF, PDFExportOptions } from '@/lib/pdf-export'
import { toast } from 'sonner'

interface DocumentPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document
  content?: string
  projectTitle?: string
}

export function DocumentPreview({ open, onOpenChange, document, content, projectTitle }: DocumentPreviewProps) {
  const [architectProfile] = useKV<ArchitectProfile | null>('architect-profile', null)
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted')
  const [copied, setCopied] = useState(false)
  const [pdfOptions, setPdfOptions] = useState<PDFExportOptions>({
    includeMetadata: true,
    includeHeader: true,
    includeFooter: true,
    pageNumbers: true,
    fontSize: 11,
    lineSpacing: 1.5
  })

  const latestVersion = document.versions[0]

  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Contenido copiado al portapapeles')
    } catch (error) {
      toast.error('Error al copiar al portapapeles')
    }
  }

  const handleDownload = () => {
    if (!content) return
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${document.name}.txt`
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Documento descargado correctamente')
  }

  const handleExportPDF = () => {
    if (!content) return
    try {
      exportDocumentToPDF(document, content, projectTitle, {
        ...pdfOptions,
        architectProfile
      })
      toast.success('PDF generado correctamente', {
        description: 'El documento se ha exportado con formato optimizado para impresión'
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Error al generar el PDF')
    }
  }

  const handlePrint = () => {
    if (!content) return
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${document.name}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              padding: 50px;
              line-height: 1.8;
              max-width: 900px;
              margin: 0 auto;
              font-size: 13pt;
            }
            h1, h2, h3 {
              font-family: 'Arial', sans-serif;
              margin-top: 28px;
              margin-bottom: 16px;
            }
            h1 { font-size: 22pt; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { font-size: 18pt; }
            h3 { font-size: 15pt; }
            p { 
              margin: 14px 0; 
              text-align: justify;
            }
            .header {
              text-align: center;
              margin-bottom: 50px;
              border-bottom: 3px solid #333;
              padding-bottom: 25px;
            }
            .metadata {
              font-size: 10pt;
              color: #666;
              margin-top: 50px;
              border-top: 1px solid #ccc;
              padding-top: 25px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${document.name}</h1>
            <p><strong>Proyecto:</strong> ${document.projectId}</p>
            <p><strong>Versión:</strong> ${latestVersion.version}</p>
          </div>
          <div class="content">
            ${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
          </div>
          <div class="metadata">
            <p><strong>Documento generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
            <p><strong>Estado:</strong> ${latestVersion.status}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const formatContent = (text: string) => {
    const lines = text.split('\n')
    const formatted: React.ReactElement[] = []
    
    lines.forEach((line, index) => {
      const trimmed = line.trim()
      
      if (trimmed === '') {
        formatted.push(<div key={index} className="h-5" />)
      } else if (trimmed.match(/^[A-Z\s]{5,}$/)) {
        formatted.push(
          <h2 key={index} className="text-2xl font-bold mt-10 mb-5 text-primary border-b-2 border-primary/20 pb-3">
            {trimmed}
          </h2>
        )
      } else if (trimmed.match(/^\d+\./)) {
        formatted.push(
          <h3 key={index} className="text-xl font-semibold mt-7 mb-4 text-foreground">
            {trimmed}
          </h3>
        )
      } else if (trimmed.match(/^-\s/)) {
        formatted.push(
          <li key={index} className="ml-8 mb-3 text-foreground text-base leading-relaxed">
            {trimmed.substring(2)}
          </li>
        )
      } else {
        formatted.push(
          <p key={index} className="mb-4 text-foreground text-base leading-loose text-justify">
            {trimmed}
          </p>
        )
      }
    })
    
    return formatted
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[98vh] h-[98vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Eye size={24} weight="duotone" />
                </div>
                Vista Previa del Documento
              </DialogTitle>
              <DialogDescription className="mt-2">
                {document.name} - Versión {latestVersion.version}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {document.type}
              </Badge>
              <Badge variant="outline">
                {latestVersion.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'formatted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('formatted')}
                className="gap-2"
              >
                <TextAlignLeft size={16} />
                Formateado
              </Button>
              <Button
                variant={viewMode === 'raw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('raw')}
                className="gap-2"
              >
                <ListNumbers size={16} />
                Texto Plano
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-2"
                disabled={!content}
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={!content}
                  >
                    <FilePdf size={16} weight="fill" />
                    Exportar PDF
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Gear size={16} />
                    Opciones de Exportación
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuCheckboxItem
                    checked={pdfOptions.includeMetadata}
                    onCheckedChange={(checked) => 
                      setPdfOptions(prev => ({ ...prev, includeMetadata: checked }))
                    }
                  >
                    Incluir metadata del documento
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuCheckboxItem
                    checked={pdfOptions.includeHeader}
                    onCheckedChange={(checked) => 
                      setPdfOptions(prev => ({ ...prev, includeHeader: checked }))
                    }
                  >
                    Incluir encabezado en páginas
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuCheckboxItem
                    checked={pdfOptions.includeFooter}
                    onCheckedChange={(checked) => 
                      setPdfOptions(prev => ({ ...prev, includeFooter: checked }))
                    }
                  >
                    Incluir pie de página
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuCheckboxItem
                    checked={pdfOptions.pageNumbers}
                    onCheckedChange={(checked) => 
                      setPdfOptions(prev => ({ ...prev, pageNumbers: checked }))
                    }
                  >
                    Numerar páginas
                  </DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FilePdf size={16} className="mr-2" weight="fill" />
                    Generar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2"
                disabled={!content}
              >
                <Printer size={16} />
                Imprimir
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="gap-2"
                disabled={!content}
              >
                <Download size={16} />
                Descargar
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="px-6 py-6 min-h-full">
            {content ? (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-10">
                  {viewMode === 'formatted' ? (
                    <div className="prose prose-lg max-w-none">
                      {formatContent(content)}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-base leading-loose">
                      {content}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex p-6 rounded-full bg-muted mb-4">
                  <FileText size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sin Contenido Disponible</h3>
                <p className="text-muted-foreground">
                  No hay contenido de vista previa para este documento
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Subido: {new Date(latestVersion.uploadedAt).toLocaleDateString('es-ES')}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Por: {latestVersion.uploadedBy}</span>
              {latestVersion.notes && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span>Notas: {latestVersion.notes}</span>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
