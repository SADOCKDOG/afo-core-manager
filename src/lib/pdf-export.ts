import { jsPDF } from 'jspdf'
import { Document, DocumentVersion, ArchitectProfile } from './types'

export interface PDFExportOptions {
  includeMetadata?: boolean
  includeHeader?: boolean
  includeFooter?: boolean
  pageNumbers?: boolean
  watermark?: string
  fontSize?: number
  lineSpacing?: number
  architectProfile?: ArchitectProfile | null
  margins?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

const DEFAULT_OPTIONS: PDFExportOptions = {
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
}

export function exportDocumentToPDF(
  document: Document,
  content: string,
  projectTitle?: string,
  options: PDFExportOptions = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - opts.margins!.left - opts.margins!.right
  const contentHeight = pageHeight - opts.margins!.top - opts.margins!.bottom
  
  let currentY = opts.margins!.top
  let pageNumber = 1
  
  const latestVersion = document.versions[0]

  const addHeader = () => {
    if (!opts.includeHeader) return
    
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    
    doc.text(document.name, opts.margins!.left, 15)
    
    if (projectTitle) {
      const projectText = `Proyecto: ${projectTitle}`
      const projectWidth = doc.getTextWidth(projectText)
      doc.text(projectText, pageWidth - opts.margins!.right - projectWidth, 15)
    }
    
    doc.setDrawColor(200, 200, 200)
    doc.line(opts.margins!.left, 18, pageWidth - opts.margins!.right, 18)
  }

  const addFooter = () => {
    if (!opts.includeFooter) return
    
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    
    doc.setDrawColor(200, 200, 200)
    doc.line(opts.margins!.left, pageHeight - 18, pageWidth - opts.margins!.right, pageHeight - 18)
    
    let footerText = `Generado: ${new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`
    
    if (opts.architectProfile) {
      const architectName = opts.architectProfile.razonSocial || opts.architectProfile.nombreCompleto
      footerText = `${architectName} | ${footerText}`
    }
    
    doc.text(footerText, opts.margins!.left, pageHeight - 12)
    
    if (opts.pageNumbers) {
      const pageText = `Página ${pageNumber}`
      const pageWidth_text = doc.getTextWidth(pageText)
      doc.text(pageText, pageWidth - opts.margins!.right - pageWidth_text, pageHeight - 12)
    }
  }

  const addWatermark = () => {
    if (!opts.watermark) return
    
    doc.saveGraphicsState()
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(60)
    doc.setFont('helvetica', 'bold')
    
    const watermarkWidth = doc.getTextWidth(opts.watermark)
    const centerX = pageWidth / 2
    const centerY = pageHeight / 2
    
    doc.text(opts.watermark, centerX, centerY, {
      align: 'center',
      angle: 45,
      renderingMode: 'stroke'
    })
    
    doc.restoreGraphicsState()
  }

  const checkPageBreak = (requiredSpace: number): boolean => {
    if (currentY + requiredSpace > pageHeight - opts.margins!.bottom - 10) {
      doc.addPage()
      pageNumber++
      addHeader()
      addFooter()
      addWatermark()
      currentY = opts.margins!.top
      return true
    }
    return false
  }

  const addCoverPage = () => {
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    
    const titleLines = doc.splitTextToSize(document.name, contentWidth - 20)
    const titleHeight = titleLines.length * 10
    let titleY = pageHeight / 2 - titleHeight - 30
    
    titleLines.forEach((line: string) => {
      const lineWidth = doc.getTextWidth(line)
      doc.text(line, pageWidth / 2 - lineWidth / 2, titleY)
      titleY += 10
    })
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    
    let metadataY = titleY + 20
    
    if (projectTitle) {
      const projectLine = `Proyecto: ${projectTitle}`
      const projectWidth = doc.getTextWidth(projectLine)
      doc.text(projectLine, pageWidth / 2 - projectWidth / 2, metadataY)
      metadataY += 8
    }
    
    if (latestVersion) {
      const versionLine = `Versión: ${latestVersion.version}`
      const versionWidth = doc.getTextWidth(versionLine)
      doc.text(versionLine, pageWidth / 2 - versionWidth / 2, metadataY)
      metadataY += 8
      
      const statusLabels: Record<string, string> = {
        draft: 'Borrador',
        shared: 'Compartido',
        approved: 'Aprobado'
      }
      const statusLine = `Estado: ${statusLabels[latestVersion.status] || latestVersion.status}`
      const statusWidth = doc.getTextWidth(statusLine)
      doc.text(statusLine, pageWidth / 2 - statusWidth / 2, metadataY)
      metadataY += 8
    }
    
    if (document.metadata.discipline) {
      const disciplineLine = `Disciplina: ${document.metadata.discipline}`
      const disciplineWidth = doc.getTextWidth(disciplineLine)
      doc.text(disciplineLine, pageWidth / 2 - disciplineWidth / 2, metadataY)
      metadataY += 8
    }
    
    if (opts.architectProfile) {
      metadataY += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      
      const architectName = opts.architectProfile.razonSocial || opts.architectProfile.nombreCompleto
      const architectWidth = doc.getTextWidth(architectName)
      doc.text(architectName, pageWidth / 2 - architectWidth / 2, metadataY)
      metadataY += 6
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      if (opts.architectProfile.numeroColegial && opts.architectProfile.colegioOficial) {
        const collegeLine = `${opts.architectProfile.colegioOficial} - Nº ${opts.architectProfile.numeroColegial}`
        const collegeWidth = doc.getTextWidth(collegeLine)
        doc.text(collegeLine, pageWidth / 2 - collegeWidth / 2, metadataY)
        metadataY += 5
      }
      
      if (opts.architectProfile.email) {
        const emailWidth = doc.getTextWidth(opts.architectProfile.email)
        doc.text(opts.architectProfile.email, pageWidth / 2 - emailWidth / 2, metadataY)
        metadataY += 5
      }
    }
    
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    const dateLine = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    const dateWidth = doc.getTextWidth(dateLine)
    doc.text(dateLine, pageWidth / 2 - dateWidth / 2, pageHeight - 40)
    
    doc.addPage()
    pageNumber++
  }

  addCoverPage()
  addHeader()
  addFooter()
  addWatermark()

  if (opts.includeMetadata && document.metadata.description) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Descripción:', opts.margins!.left, currentY)
    currentY += 6
    
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 60)
    const descLines = doc.splitTextToSize(document.metadata.description, contentWidth)
    descLines.forEach((line: string) => {
      checkPageBreak(6)
      doc.text(line, opts.margins!.left, currentY)
      currentY += 5
    })
    
    currentY += 10
    checkPageBreak(10)
    
    doc.setDrawColor(220, 220, 220)
    doc.line(opts.margins!.left, currentY, pageWidth - opts.margins!.right, currentY)
    currentY += 10
  }

  const lines = content.split('\n')
  const lineHeight = opts.fontSize! * opts.lineSpacing! * 0.352778
  
  doc.setFontSize(opts.fontSize!)
  doc.setTextColor(0, 0, 0)
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    if (trimmed === '') {
      currentY += lineHeight * 0.5
      continue
    }
    
    if (trimmed.match(/^[A-ZÁÉÍÓÚÑ\s]{5,}$/)) {
      checkPageBreak(lineHeight * 2)
      currentY += lineHeight
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(opts.fontSize! + 4)
      doc.setTextColor(0, 0, 0)
      
      const titleLines = doc.splitTextToSize(trimmed, contentWidth)
      titleLines.forEach((tLine: string) => {
        checkPageBreak(lineHeight * 1.5)
        doc.text(tLine, opts.margins!.left, currentY)
        currentY += lineHeight * 1.3
      })
      
      doc.setDrawColor(100, 100, 100)
      doc.setLineWidth(0.5)
      doc.line(opts.margins!.left, currentY, opts.margins!.left + 40, currentY)
      
      currentY += lineHeight
      doc.setFontSize(opts.fontSize!)
      doc.setFont('helvetica', 'normal')
      
    } else if (trimmed.match(/^\d+\./)) {
      checkPageBreak(lineHeight * 1.5)
      currentY += lineHeight * 0.5
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(opts.fontSize! + 2)
      doc.setTextColor(20, 20, 20)
      
      const subtitleLines = doc.splitTextToSize(trimmed, contentWidth)
      subtitleLines.forEach((sLine: string) => {
        checkPageBreak(lineHeight * 1.2)
        doc.text(sLine, opts.margins!.left, currentY)
        currentY += lineHeight * 1.2
      })
      
      currentY += lineHeight * 0.3
      doc.setFontSize(opts.fontSize!)
      doc.setFont('helvetica', 'normal')
      
    } else if (trimmed.match(/^[•\-]\s/)) {
      checkPageBreak(lineHeight * 1.2)
      
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      
      const bulletText = trimmed.substring(2)
      const bulletLines = doc.splitTextToSize(bulletText, contentWidth - 8)
      
      doc.text('•', opts.margins!.left + 2, currentY)
      
      bulletLines.forEach((bLine: string, idx: number) => {
        if (idx > 0) checkPageBreak(lineHeight)
        doc.text(bLine, opts.margins!.left + 8, currentY)
        currentY += lineHeight
      })
      
    } else {
      checkPageBreak(lineHeight * 1.5)
      
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      
      const textLines = doc.splitTextToSize(trimmed, contentWidth)
      textLines.forEach((tLine: string) => {
        checkPageBreak(lineHeight)
        doc.text(tLine, opts.margins!.left, currentY, { 
          align: 'justify',
          maxWidth: contentWidth 
        })
        currentY += lineHeight
      })
    }
  }

  const filename = `${document.name.replace(/[^a-z0-9]/gi, '_')}_${latestVersion.version}.pdf`
  doc.save(filename)
}

export function exportMultipleDocumentsToPDF(
  documents: Array<{ document: Document; content: string }>,
  projectTitle?: string,
  options: PDFExportOptions = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  
  const mainTitle = projectTitle || 'Documentación del Proyecto'
  const titleLines = doc.splitTextToSize(mainTitle, pageWidth - 40)
  let titleY = pageHeight / 2 - titleLines.length * 5
  
  titleLines.forEach((line: string) => {
    const lineWidth = doc.getTextWidth(line)
    doc.text(line, pageWidth / 2 - lineWidth / 2, titleY)
    titleY += 12
  })
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  
  const subtitle = `Colección de ${documents.length} documento${documents.length > 1 ? 's' : ''}`
  const subtitleWidth = doc.getTextWidth(subtitle)
  doc.text(subtitle, pageWidth / 2 - subtitleWidth / 2, titleY + 10)
  
  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  const dateLine = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const dateWidth = doc.getTextWidth(dateLine)
  doc.text(dateLine, pageWidth / 2 - dateWidth / 2, pageHeight - 40)

  documents.forEach(({ document: singleDoc, content }, index) => {
    doc.addPage()
    
    const tempDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    exportDocumentToPDF(singleDoc, content, projectTitle, opts)
    
    if (index < documents.length - 1) {
      doc.addPage()
    }
  })

  const filename = `${projectTitle?.replace(/[^a-z0-9]/gi, '_') || 'documentos'}_completo.pdf`
  doc.save(filename)
}

export function exportInvoiceToPDF(
  invoice: any,
  architectProfile?: any | null
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let currentY = margin

  if (architectProfile?.logo) {
    try {
      doc.addImage(architectProfile.logo, 'PNG', margin, currentY, 30, 30)
    } catch (e) {
      console.warn('No se pudo cargar el logo')
    }
  }

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  
  const issuerName = invoice.issuerName || architectProfile?.razonSocial || architectProfile?.nombreCompleto || 'Emisor'
  doc.text(issuerName, architectProfile?.logo ? margin + 35 : margin, currentY + 10)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  
  let issuerY = currentY + 16
  
  if (invoice.issuerNIF || architectProfile?.nif) {
    doc.text(`NIF: ${invoice.issuerNIF || architectProfile?.nif}`, architectProfile?.logo ? margin + 35 : margin, issuerY)
    issuerY += 4
  }
  
  if (invoice.issuerAddress || architectProfile?.direccion) {
    doc.text(invoice.issuerAddress || architectProfile?.direccion || '', architectProfile?.logo ? margin + 35 : margin, issuerY)
    issuerY += 4
  }
  
  if (invoice.issuerEmail || architectProfile?.email) {
    doc.text(invoice.issuerEmail || architectProfile?.email || '', architectProfile?.logo ? margin + 35 : margin, issuerY)
    issuerY += 4
  }
  
  if (invoice.issuerPhone || architectProfile?.telefono) {
    doc.text(`Tel: ${invoice.issuerPhone || architectProfile?.telefono}`, architectProfile?.logo ? margin + 35 : margin, issuerY)
  }

  currentY = Math.max(issuerY + 10, currentY + 35)

  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('FACTURA', pageWidth - margin, currentY, { align: 'right' })
  
  currentY += 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Nº ${invoice.invoiceNumber}`, pageWidth - margin, currentY, { align: 'right' })

  currentY += 15

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENTE', margin, currentY)
  
  currentY += 6
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)
  doc.text(invoice.clientName, margin, currentY)
  
  currentY += 5
  doc.text(`NIF: ${invoice.clientNIF}`, margin, currentY)
  
  if (invoice.clientAddress) {
    currentY += 5
    doc.text(invoice.clientAddress, margin, currentY)
  }

  currentY += 15

  const tableTop = currentY
  const colWidths = [80, 25, 30, 35]
  const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1], margin + colWidths[0] + colWidths[1] + colWidths[2]]

  doc.setFillColor(240, 240, 240)
  doc.rect(margin, tableTop, pageWidth - 2 * margin, 8, 'F')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Descripción', colX[0] + 2, tableTop + 5)
  doc.text('Cantidad', colX[1] + 2, tableTop + 5)
  doc.text('Precio Unit.', colX[2] + 2, tableTop + 5)
  doc.text('Total', colX[3] + 2, tableTop + 5)

  currentY = tableTop + 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  invoice.lineItems.forEach((item: any) => {
    if (currentY > pageHeight - 60) {
      doc.addPage()
      currentY = margin
    }

    const descLines = doc.splitTextToSize(item.description, colWidths[0] - 4)
    const lineHeight = 5
    const itemHeight = descLines.length * lineHeight

    descLines.forEach((line: string, idx: number) => {
      doc.text(line, colX[0] + 2, currentY + (idx + 1) * lineHeight - 1)
    })

    doc.text(item.quantity.toString(), colX[1] + 2, currentY + 4)
    doc.text(`${item.unitPrice.toFixed(2)}€`, colX[2] + 2, currentY + 4)
    doc.text(`${item.totalPrice.toFixed(2)}€`, colX[3] + 2, currentY + 4)

    currentY += Math.max(itemHeight, 8)
    
    doc.setDrawColor(220, 220, 220)
    doc.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 2
  })

  currentY += 5

  const totalsX = pageWidth - margin - 70

  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', totalsX, currentY)
  doc.text(`${invoice.subtotal.toFixed(2)}€`, pageWidth - margin, currentY, { align: 'right' })
  
  currentY += 6
  doc.text(`IVA (${invoice.taxRate}%):`, totalsX, currentY)
  doc.text(`${invoice.taxAmount.toFixed(2)}€`, pageWidth - margin, currentY, { align: 'right' })
  
  currentY += 8
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('TOTAL:', totalsX, currentY)
  doc.text(`${invoice.total.toFixed(2)}€`, pageWidth - margin, currentY, { align: 'right' })

  currentY += 15

  if (invoice.notes) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Notas:', margin, currentY)
    currentY += 5
    
    doc.setFont('helvetica', 'normal')
    const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin)
    notesLines.forEach((line: string) => {
      doc.text(line, margin, currentY)
      currentY += 4
    })
  }

  if (invoice.issuerIBAN || architectProfile?.iban) {
    currentY += 10
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Datos bancarios:', margin, currentY)
    currentY += 5
    
    doc.setFont('helvetica', 'normal')
    doc.text(`IBAN: ${invoice.issuerIBAN || architectProfile?.iban}`, margin, currentY)
  }

  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-ES')}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  )

  const filename = `Factura_${invoice.invoiceNumber.replace(/[^a-z0-9]/gi, '_')}.pdf`
  doc.save(filename)
}
