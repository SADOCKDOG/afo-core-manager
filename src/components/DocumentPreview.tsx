import { useState } from 'react'
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
  ListNumbers
} from '@phosphor-icons/react'
import { Document } from '@/lib/types'
import { toast } from 'sonner'

interface DocumentPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document
  content?: string
}

export function DocumentPreview({ open, onOpenChange, document, content }: DocumentPreviewProps) {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted')
  const [copied, setCopied] = useState(false)

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
              padding: 40px;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 {
              font-family: 'Arial', sans-serif;
              margin-top: 24px;
              margin-bottom: 12px;
            }
            h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 8px; }
            h2 { font-size: 20px; }
            h3 { font-size: 16px; }
            p { margin: 12px 0; }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #333;
              padding-bottom: 20px;
            }
            .metadata {
              font-size: 12px;
              color: #666;
              margin-top: 40px;
              border-top: 1px solid #ccc;
              padding-top: 20px;
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
        formatted.push(<div key={index} className="h-4" />)
      } else if (trimmed.match(/^[A-Z\s]{5,}$/)) {
        formatted.push(
          <h2 key={index} className="text-xl font-bold mt-8 mb-4 text-primary border-b-2 border-primary/20 pb-2">
            {trimmed}
          </h2>
        )
      } else if (trimmed.match(/^\d+\./)) {
        formatted.push(
          <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-foreground">
            {trimmed}
          </h3>
        )
      } else if (trimmed.match(/^-\s/)) {
        formatted.push(
          <li key={index} className="ml-6 mb-2 text-foreground">
            {trimmed.substring(2)}
          </li>
        )
      } else {
        formatted.push(
          <p key={index} className="mb-3 text-foreground leading-relaxed text-justify">
            {trimmed}
          </p>
        )
      }
    })
    
    return formatted
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
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

        <div className="px-6 py-4 border-b bg-muted/20">
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

        <ScrollArea className="flex-1 h-[calc(95vh-200px)]">
          <div className="px-6 py-6">
            {content ? (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-8">
                  {viewMode === 'formatted' ? (
                    <div className="prose prose-sm max-w-none">
                      {formatContent(content)}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
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

        <div className="px-6 py-4 border-t bg-muted/20">
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
