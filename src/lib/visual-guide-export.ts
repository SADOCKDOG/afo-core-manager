import jsPDF from 'jspdf'
import { VisualGuide } from './visual-guides-data'

export async function exportVisualGuide(guide: VisualGuide, format: 'pdf' | 'markdown'): Promise<void> {
  if (format === 'pdf') {
    await exportToPDF(guide)
  } else {
    await exportToMarkdown(guide)
  }
}

async function exportToPDF(guide: VisualGuide): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal')
    pdf.setTextColor(color[0], color[1], color[2])
    
    const lines = pdf.splitTextToSize(text, contentWidth)
    const lineHeight = fontSize * 0.5
    
    addNewPageIfNeeded(lines.length * lineHeight)
    
    lines.forEach((line: string) => {
      pdf.text(line, margin, yPosition)
      yPosition += lineHeight
    })
    
    return lines.length * lineHeight
  }

  pdf.setFillColor(82, 114, 229)
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('GUÍA VISUAL PASO A PASO', margin, 20)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('AFO CORE MANAGER', margin, 30)
  
  yPosition = 55

  addText(guide.title, 18, true, [82, 114, 229])
  yPosition += 5
  
  addText(guide.description, 11, false, [100, 100, 100])
  yPosition += 10

  pdf.setDrawColor(200, 200, 200)
  pdf.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 8

  pdf.setFillColor(240, 240, 240)
  pdf.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'F')
  
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Categoría:', margin + 5, yPosition + 8)
  pdf.setFont('helvetica', 'normal')
  pdf.text(guide.category, margin + 30, yPosition + 8)
  
  pdf.setFont('helvetica', 'bold')
  pdf.text('Dificultad:', margin + 5, yPosition + 16)
  pdf.setFont('helvetica', 'normal')
  const difficultyText = guide.difficulty === 'beginner' ? 'Principiante' : 
                         guide.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'
  pdf.text(difficultyText, margin + 30, yPosition + 16)
  
  if (guide.estimatedTime) {
    pdf.setFont('helvetica', 'bold')
    pdf.text('Tiempo estimado:', margin + 5, yPosition + 24)
    pdf.setFont('helvetica', 'normal')
    pdf.text(guide.estimatedTime, margin + 45, yPosition + 24)
  }
  
  yPosition += 38

  guide.steps.forEach((step, index) => {
    addNewPageIfNeeded(60)
    
    pdf.setFillColor(82, 114, 229)
    pdf.circle(margin + 5, yPosition + 3, 5, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text((index + 1).toString(), margin + 5, yPosition + 5, { align: 'center' })
    
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(14)
    pdf.text(`Paso ${index + 1}: ${step.title}`, margin + 15, yPosition + 5)
    
    yPosition += 10
    
    addText(step.description, 10, false, [80, 80, 80])
    yPosition += 5
    
    if (step.screenshot) {
      addNewPageIfNeeded(45)
      
      pdf.setFillColor(250, 250, 250)
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 2, 2, 'F')
      
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.5)
      pdf.roundedRect(margin, yPosition, contentWidth, 40, 2, 2, 'S')
      
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'italic')
      
      const screenshotLines = pdf.splitTextToSize(`📷 ${step.screenshot.description}`, contentWidth - 10)
      let screenshotY = yPosition + 8
      screenshotLines.forEach((line: string) => {
        pdf.text(line, margin + 5, screenshotY)
        screenshotY += 4
      })
      
      if (step.screenshot.highlights && step.screenshot.highlights.length > 0) {
        screenshotY += 3
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Puntos destacados:', margin + 5, screenshotY)
        screenshotY += 4
        
        step.screenshot.highlights.forEach(highlight => {
          const highlightLines = pdf.splitTextToSize(`→ ${highlight}`, contentWidth - 15)
          highlightLines.forEach((line: string) => {
            pdf.text(line, margin + 8, screenshotY)
            screenshotY += 3.5
          })
        })
      }
      
      yPosition += 45
    }
    
    if (step.actions && step.actions.length > 0) {
      addNewPageIfNeeded(30)
      
      pdf.setFillColor(220, 255, 220)
      const actionsHeight = step.actions.length * 6 + 10
      addNewPageIfNeeded(actionsHeight)
      pdf.roundedRect(margin, yPosition, contentWidth, actionsHeight, 2, 2, 'F')
      
      pdf.setTextColor(0, 120, 0)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('✓ Acciones a realizar:', margin + 5, yPosition + 6)
      
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      
      step.actions.forEach((action, idx) => {
        const actionLines = pdf.splitTextToSize(`${idx + 1}. ${action}`, contentWidth - 15)
        actionLines.forEach((line: string) => {
          pdf.text(line, margin + 8, yPosition)
          yPosition += 4
        })
        yPosition += 1
      })
      
      yPosition += 5
    }
    
    if (step.tips && step.tips.length > 0) {
      addNewPageIfNeeded(20)
      
      pdf.setFillColor(255, 250, 220)
      const tipsHeight = step.tips.length * 5 + 10
      addNewPageIfNeeded(tipsHeight)
      pdf.roundedRect(margin, yPosition, contentWidth, tipsHeight, 2, 2, 'F')
      
      pdf.setTextColor(200, 150, 0)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('💡 Consejos útiles:', margin + 5, yPosition + 6)
      
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      
      step.tips.forEach(tip => {
        const tipLines = pdf.splitTextToSize(`• ${tip}`, contentWidth - 15)
        tipLines.forEach((line: string) => {
          pdf.text(line, margin + 8, yPosition)
          yPosition += 4
        })
      })
      
      yPosition += 5
    }
    
    if (step.warnings && step.warnings.length > 0) {
      addNewPageIfNeeded(20)
      
      pdf.setFillColor(255, 230, 230)
      const warningsHeight = step.warnings.length * 5 + 10
      addNewPageIfNeeded(warningsHeight)
      pdf.roundedRect(margin, yPosition, contentWidth, warningsHeight, 2, 2, 'F')
      
      pdf.setTextColor(200, 0, 0)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('⚠ Advertencias importantes:', margin + 5, yPosition + 6)
      
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      
      step.warnings.forEach(warning => {
        const warningLines = pdf.splitTextToSize(`⚠ ${warning}`, contentWidth - 15)
        warningLines.forEach((line: string) => {
          pdf.text(line, margin + 8, yPosition)
          yPosition += 4
        })
      })
      
      yPosition += 5
    }
    
    if (step.notes && step.notes.length > 0) {
      addNewPageIfNeeded(20)
      
      pdf.setFillColor(230, 240, 255)
      const notesHeight = step.notes.length * 5 + 10
      addNewPageIfNeeded(notesHeight)
      pdf.roundedRect(margin, yPosition, contentWidth, notesHeight, 2, 2, 'F')
      
      pdf.setTextColor(0, 100, 200)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('ℹ Notas adicionales:', margin + 5, yPosition + 6)
      
      yPosition += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      
      step.notes.forEach(note => {
        const noteLines = pdf.splitTextToSize(`ℹ ${note}`, contentWidth - 15)
        noteLines.forEach((line: string) => {
          pdf.text(line, margin + 8, yPosition)
          yPosition += 4
        })
      })
      
      yPosition += 5
    }
    
    yPosition += 10
    
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10
  })

  addNewPageIfNeeded(30)
  pdf.setFillColor(240, 240, 240)
  pdf.roundedRect(margin, yPosition, contentWidth, 20, 2, 2, 'F')
  
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'italic')
  pdf.text('Documento generado por AFO CORE MANAGER', margin + 5, yPosition + 8)
  pdf.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, margin + 5, yPosition + 14)

  const totalPages = pdf.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin - 20, pageHeight - 10)
  }

  pdf.save(`guia_${guide.id}_${Date.now()}.pdf`)
}

async function exportToMarkdown(guide: VisualGuide): Promise<void> {
  let markdown = `# ${guide.title}\n\n`
  markdown += `> ${guide.description}\n\n`
  
  markdown += `---\n\n`
  
  markdown += `**Categoría:** ${guide.category}\n\n`
  markdown += `**Dificultad:** ${guide.difficulty === 'beginner' ? 'Principiante' : guide.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}\n\n`
  
  if (guide.estimatedTime) {
    markdown += `**Tiempo estimado:** ${guide.estimatedTime}\n\n`
  }
  
  markdown += `**Etiquetas:** ${guide.tags.join(', ')}\n\n`
  
  markdown += `---\n\n`
  
  markdown += `## Índice de Pasos\n\n`
  guide.steps.forEach((step, index) => {
    markdown += `${index + 1}. [${step.title}](#paso-${index + 1}-${step.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')})\n`
  })
  markdown += `\n`
  
  guide.steps.forEach((step, index) => {
    markdown += `## Paso ${index + 1}: ${step.title}\n\n`
    markdown += `${step.description}\n\n`
    
    if (step.screenshot) {
      markdown += `### 📷 Captura de Pantalla\n\n`
      markdown += `${step.screenshot.description}\n\n`
      
      if (step.screenshot.highlights && step.screenshot.highlights.length > 0) {
        markdown += `**Puntos destacados:**\n\n`
        step.screenshot.highlights.forEach(highlight => {
          markdown += `- → ${highlight}\n`
        })
        markdown += `\n`
      }
    }
    
    if (step.actions && step.actions.length > 0) {
      markdown += `### ✓ Acciones a Realizar\n\n`
      step.actions.forEach((action, idx) => {
        markdown += `${idx + 1}. ${action}\n`
      })
      markdown += `\n`
    }
    
    if (step.tips && step.tips.length > 0) {
      markdown += `### 💡 Consejos Útiles\n\n`
      step.tips.forEach(tip => {
        markdown += `- ${tip}\n`
      })
      markdown += `\n`
    }
    
    if (step.warnings && step.warnings.length > 0) {
      markdown += `### ⚠️ Advertencias Importantes\n\n`
      step.warnings.forEach(warning => {
        markdown += `- **${warning}**\n`
      })
      markdown += `\n`
    }
    
    if (step.notes && step.notes.length > 0) {
      markdown += `### ℹ️ Notas Adicionales\n\n`
      step.notes.forEach(note => {
        markdown += `- ${note}\n`
      })
      markdown += `\n`
    }
    
    if (step.relatedGuides && step.relatedGuides.length > 0) {
      markdown += `### 🔗 Guías Relacionadas\n\n`
      step.relatedGuides.forEach(guideId => {
        markdown += `- [Ver guía: ${guideId}](#)\n`
      })
      markdown += `\n`
    }
    
    markdown += `---\n\n`
  })
  
  markdown += `## Información del Documento\n\n`
  markdown += `- **Documento generado por:** AFO CORE MANAGER\n`
  markdown += `- **Fecha de generación:** ${new Date().toLocaleDateString('es-ES')}\n`
  markdown += `- **ID de guía:** ${guide.id}\n`

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `guia_${guide.id}_${Date.now()}.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
