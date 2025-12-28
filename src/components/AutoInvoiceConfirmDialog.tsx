import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Receipt, CheckCircle, X } from '@phosphor-icons/react'
import { Invoice, Client, Budget, PHASE_LABELS } from '@/lib/types'
import { formatCurrency } from '@/lib/invoice-utils'

interface AutoInvoiceConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (invoiceData: Partial<Invoice>, issueImmediately: boolean) => void
  onCancel: () => void
  invoiceData: Partial<Invoice>
  projectTitle: string
  phaseLabel: string
  client?: Client
  projectBudget?: Budget
}

export function AutoInvoiceConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  invoiceData,
  projectTitle,
  phaseLabel,
  client,
  projectBudget
}: AutoInvoiceConfirmDialogProps) {
  const [editableInvoice, setEditableInvoice] = useState<Partial<Invoice>>(invoiceData)
  const [issueImmediately, setIssueImmediately] = useState(false)

  useEffect(() => {
    if (projectBudget?.totalPEM && invoiceData.lineItems?.[0]) {
      const phasePercentage = (invoiceData.lineItems[0].totalPrice / projectBudget.totalPEM) * 100
      const newAmount = projectBudget.totalPEM * phasePercentage / 100
      
      const updatedLineItem = {
        ...invoiceData.lineItems[0],
        unitPrice: newAmount,
        totalPrice: newAmount
      }
      
      const newSubtotal = newAmount
      const newTaxAmount = newAmount * (invoiceData.taxRate || 21) / 100
      const newTotal = newSubtotal + newTaxAmount
      
      setEditableInvoice({
        ...invoiceData,
        lineItems: [updatedLineItem],
        subtotal: newSubtotal,
        taxAmount: newTaxAmount,
        total: newTotal
      })
    } else {
      setEditableInvoice(invoiceData)
    }
  }, [invoiceData, projectBudget])

  const handleAmountChange = (newAmount: number) => {
    if (!editableInvoice.lineItems?.[0]) return
    
    const updatedLineItem = {
      ...editableInvoice.lineItems[0],
      unitPrice: newAmount,
      totalPrice: newAmount
    }
    
    const newSubtotal = newAmount
    const newTaxAmount = newAmount * (editableInvoice.taxRate || 21) / 100
    const newTotal = newSubtotal + newTaxAmount
    
    setEditableInvoice({
      ...editableInvoice,
      lineItems: [updatedLineItem],
      subtotal: newSubtotal,
      taxAmount: newTaxAmount,
      total: newTotal
    })
  }

  const handleConfirm = () => {
    onConfirm(editableInvoice, issueImmediately)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Receipt size={28} weight="duotone" className="text-primary" />
            Generar Factura Automática
          </DialogTitle>
          <DialogDescription>
            Se ha completado la fase "{phaseLabel}" del proyecto "{projectTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <CheckCircle size={24} weight="fill" className="text-primary" />
              </div>
              <div>
                <p className="font-semibold">Fase completada</p>
                <p className="text-sm text-muted-foreground">{phaseLabel}</p>
              </div>
            </div>
            <Badge className="bg-accent text-accent-foreground">
              {editableInvoice.lineItems?.[0]?.phaseId && 
                PHASE_LABELS[editableInvoice.lineItems[0].phaseId as keyof typeof PHASE_LABELS]
              }
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Cliente</Label>
                <p className="font-medium">{client?.razonSocial || client?.nombre || editableInvoice.clientName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">NIF/CIF</Label>
                <p className="font-medium">{client?.nif || editableInvoice.clientNIF}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Importe Base (sin IVA)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={editableInvoice.lineItems?.[0]?.totalPrice || 0}
                onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
              {projectBudget && (
                <p className="text-xs text-muted-foreground mt-1">
                  Calculado sobre PEM del presupuesto: {formatCurrency(projectBudget.totalPEM)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Subtotal</Label>
                <p className="font-semibold">{formatCurrency(editableInvoice.subtotal || 0)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">IVA ({editableInvoice.taxRate || 21}%)</Label>
                <p className="font-semibold">{formatCurrency(editableInvoice.taxAmount || 0)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total</Label>
                <p className="text-xl font-bold text-primary">{formatCurrency(editableInvoice.total || 0)}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={editableInvoice.notes || ''}
                onChange={(e) => setEditableInvoice({ ...editableInvoice, notes: e.target.value })}
                placeholder="Añadir notas adicionales para la factura..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Estado inicial de la factura</Label>
              <Select
                value={issueImmediately ? 'issued' : 'draft'}
                onValueChange={(value) => setIssueImmediately(value === 'issued')}
              >
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador (revisar antes de emitir)</SelectItem>
                  <SelectItem value="issued">Emitida (lista para enviar al cliente)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X size={16} />
            No generar factura
          </Button>
          <Button onClick={handleConfirm} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <Receipt size={16} weight="bold" />
            Generar Factura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
