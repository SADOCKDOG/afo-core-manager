import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Invoice, InvoiceLineItem, Client, Project, INVOICE_TYPE_LABELS, INVOICE_STATUS_LABELS, PAYMENT_METHOD_LABELS, PaymentMethod, InvoiceType, InvoiceStatus } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (invoice: Partial<Invoice>) => void
  invoice?: Invoice
  projectId?: string
  clientId?: string
}

export function InvoiceDialog({ open, onOpenChange, onSave, invoice, projectId, clientId }: InvoiceDialogProps) {
  const [clients] = useKV<Client[]>('clients', [])
  const [projects] = useKV<Project[]>('projects', [])
  
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [type, setType] = useState<InvoiceType>('professional-fee')
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '')
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId || '')
  const [status, setStatus] = useState<InvoiceStatus>('draft')
  const [issuedDate, setIssuedDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [paidDate, setPaidDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transferencia')
  const [taxRate, setTaxRate] = useState(21)
  const [notes, setNotes] = useState('')
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([])

  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.invoiceNumber)
      setType(invoice.type)
      setSelectedProjectId(invoice.projectId || '')
      setSelectedClientId(invoice.clientId || '')
      setStatus(invoice.status)
      setIssuedDate(invoice.issuedDate ? new Date(invoice.issuedDate).toISOString().split('T')[0] : '')
      setDueDate(invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '')
      setPaidDate(invoice.paidDate ? new Date(invoice.paidDate).toISOString().split('T')[0] : '')
      setPaymentMethod(invoice.paymentMethod || 'transferencia')
      setTaxRate(invoice.taxRate)
      setNotes(invoice.notes || '')
      setLineItems(invoice.lineItems)
    } else {
      resetForm()
      generateInvoiceNumber()
    }
  }, [invoice, open])

  useEffect(() => {
    if (projectId) setSelectedProjectId(projectId)
  }, [projectId])

  useEffect(() => {
    if (clientId) setSelectedClientId(clientId)
  }, [clientId])

  const resetForm = () => {
    setInvoiceNumber('')
    setType('professional-fee')
    setSelectedProjectId(projectId || '')
    setSelectedClientId(clientId || '')
    setStatus('draft')
    setIssuedDate('')
    setDueDate('')
    setPaidDate('')
    setPaymentMethod('transferencia')
    setTaxRate(21)
    setNotes('')
    setLineItems([{
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: 21
    }])
  }

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    setInvoiceNumber(`F${year}-${timestamp}`)
  }

  const addLineItem = () => {
    setLineItems([...lineItems, {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxRate: taxRate
    }])
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice
        }
        return updated
      }
      return item
    }))
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const calculateTaxAmount = () => {
    return calculateSubtotal() * (taxRate / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount()
  }

  const getClientInfo = (cId: string) => {
    const client = (clients || []).find(c => c.id === cId)
    if (!client) return { name: '', nif: '', address: '' }
    
    const name = client.type === 'persona-juridica' 
      ? client.razonSocial || ''
      : `${client.nombre || ''} ${client.apellido1 || ''} ${client.apellido2 || ''}`.trim()
    
    return {
      name,
      nif: client.nif,
      address: client.direccion || ''
    }
  }

  const handleSave = () => {
    if (!invoiceNumber.trim()) {
      toast.error('El número de factura es obligatorio')
      return
    }

    if (!selectedClientId) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    if (lineItems.length === 0 || lineItems.every(item => !item.description.trim())) {
      toast.error('Debe añadir al menos una línea de factura')
      return
    }

    const clientInfo = getClientInfo(selectedClientId)

    const invoiceData: Partial<Invoice> = {
      id: invoice?.id,
      invoiceNumber: invoiceNumber.trim(),
      type,
      projectId: selectedProjectId || undefined,
      clientId: selectedClientId,
      clientName: clientInfo.name,
      clientNIF: clientInfo.nif,
      clientAddress: clientInfo.address,
      status,
      lineItems,
      subtotal: calculateSubtotal(),
      taxAmount: calculateTaxAmount(),
      taxRate,
      total: calculateTotal(),
      issuedDate: issuedDate ? new Date(issuedDate).getTime() : undefined,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      paidDate: paidDate ? new Date(paidDate).getTime() : undefined,
      paymentMethod: paymentMethod,
      notes: notes.trim() || undefined
    }

    onSave(invoiceData)
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Editar Factura' : 'Nueva Factura'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Número de Factura *</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="F2024-001"
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo de Factura *</Label>
              <Select value={type} onValueChange={(val) => setType(val as InvoiceType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INVOICE_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as InvoiceStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INVOICE_STATUS_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Cliente *</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {(clients || []).map(client => {
                    const name = client.type === 'persona-juridica' 
                      ? client.razonSocial 
                      : `${client.nombre} ${client.apellido1}`
                    return (
                      <SelectItem key={client.id} value={client.id}>
                        {name} - {client.nif}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="project">Proyecto (Opcional)</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Sin proyecto asociado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin proyecto</SelectItem>
                  {(projects || []).map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="issuedDate">Fecha de Emisión</Label>
              <Input
                id="issuedDate"
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="paidDate">Fecha de Pago</Label>
              <Input
                id="paidDate"
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Líneas de Factura *</Label>
              <Button size="sm" variant="outline" onClick={addLineItem} className="gap-2">
                <Plus size={16} weight="bold" />
                Añadir Línea
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Descripción</TableHead>
                    <TableHead className="w-[15%]">Cantidad</TableHead>
                    <TableHead className="w-[15%]">Precio Unit.</TableHead>
                    <TableHead className="w-[15%]">IVA %</TableHead>
                    <TableHead className="w-[15%]">Total</TableHead>
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          placeholder="Descripción del servicio"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.taxRate}
                          onChange={(e) => updateLineItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.totalPrice.toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash size={16} weight="duotone" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA ({taxRate}%):</span>
                <span className="font-medium">{calculateTaxAmount().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxRate">IVA General (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional, condiciones de pago, etc."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {invoice ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
