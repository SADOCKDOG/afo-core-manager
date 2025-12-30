import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Invoice, Project, INVOICE_TYPE_LABELS, INVOICE_STATUS_LABELS } from '@/lib/types'
import { getInvoiceStatusColor, formatCurrency, isInvoiceOverdue } from '@/lib/invoice-utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Receipt, CalendarBlank, CheckCircle, Clock, WarningCircle, Download } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface InvoiceManagerProps {
  project?: Project
}

export function InvoiceManager({ project }: InvoiceManagerProps) {
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const projectInvoices = project 
    ? (invoices || []).filter(i => i.projectId === project.id)
    : (invoices || [])

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDetailDialogOpen(true)
  }

  const handleUpdateStatus = (invoiceId: string, newStatus: string) => {
    setInvoices(current => 
      (current || []).map(i => 
        i.id === invoiceId 
          ? { 
              ...i, 
              status: newStatus as any,
              paidDate: newStatus === 'paid' ? Date.now() : i.paidDate,
              updatedAt: Date.now() 
            }
          : i
      )
    )
    
    if (newStatus === 'paid') {
      toast.success('Factura marcada como pagada')
    } else {
      toast.success('Estado actualizado correctamente')
    }
  }

  const getStatusIcon = (invoice: Invoice) => {
    if (isInvoiceOverdue(invoice)) {
      return <WarningCircle size={20} weight="fill" className="text-destructive" />
    }
    
    switch (invoice.status) {
      case 'paid':
        return <CheckCircle size={20} weight="fill" className="text-green-600" />
      case 'issued':
        return <Clock size={20} weight="fill" className="text-blue-600" />
      default:
        return <Receipt size={20} className="text-muted-foreground" />
    }
  }

  const handleExportInvoice = (invoice: Invoice) => {
    toast.info('Exportación de factura', {
      description: 'Funcionalidad de exportación en desarrollo'
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Receipt size={18} weight="duotone" />
          Facturas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Receipt size={28} weight="duotone" className="text-primary" />
            Gestión de Facturas
          </DialogTitle>
          <DialogDescription>
            Facturas generadas automáticamente y manuales del proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {projectInvoices.length === 0 
                  ? 'No hay facturas registradas'
                  : `${projectInvoices.length} factura${projectInvoices.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>

          {projectInvoices.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Receipt size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sin facturas</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Las facturas se generan automáticamente al completar fases del proyecto o aprobar visados
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {projectInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(invoice)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(invoice)}
                          <div>
                            <h4 className="font-semibold">
                              {invoice.invoiceNumber}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {invoice.clientName} - {invoice.clientNIF}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                            {INVOICE_STATUS_LABELS[invoice.status]}
                          </Badge>
                          <Badge variant="secondary">
                            {INVOICE_TYPE_LABELS[invoice.type]}
                          </Badge>
                          {invoice.type === 'phase-payment' && (
                            <Badge className="bg-accent/20 text-accent-foreground border border-accent/30">
                              Auto-generada
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarBlank size={16} />
                            <span>Emitida: {invoice.issuedDate ? new Date(invoice.issuedDate).toLocaleDateString('es-ES') : '-'}</span>
                          </div>
                          {invoice.dueDate && (
                            <div className={`flex items-center gap-1 ${isInvoiceOverdue(invoice) ? 'text-destructive font-medium' : ''}`}>
                              <Clock size={16} />
                              <span>Vence: {new Date(invoice.dueDate).toLocaleDateString('es-ES')}</span>
                            </div>
                          )}
                          <div className="font-semibold text-primary ml-auto">
                            Total: {formatCurrency(invoice.total)}
                          </div>
                        </div>

                        {isInvoiceOverdue(invoice) && (
                          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                            <p className="text-sm font-medium text-destructive">
                              ⚠️ Factura vencida - Pago pendiente
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExportInvoice(invoice)
                          }}
                        >
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>

      {selectedInvoice && (
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Detalle de Factura
              </DialogTitle>
              <DialogDescription>
                {selectedInvoice.invoiceNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Información del Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Nombre</Label>
                      <p className="font-medium">{selectedInvoice.clientName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">NIF</Label>
                      <p className="font-medium">{selectedInvoice.clientNIF}</p>
                    </div>
                    {selectedInvoice.clientAddress && (
                      <div>
                        <Label className="text-muted-foreground">Dirección</Label>
                        <p className="font-medium">{selectedInvoice.clientAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Información de Factura</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Tipo</Label>
                      <p className="font-medium">{INVOICE_TYPE_LABELS[selectedInvoice.type]}</p>
                    </div>
                    {selectedInvoice.issuedDate && (
                      <div>
                        <Label className="text-muted-foreground">Fecha emisión</Label>
                        <p className="font-medium">{new Date(selectedInvoice.issuedDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    )}
                    {selectedInvoice.dueDate && (
                      <div>
                        <Label className="text-muted-foreground">Fecha vencimiento</Label>
                        <p className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    )}
                    {selectedInvoice.paidDate && (
                      <div>
                        <Label className="text-muted-foreground">Fecha pago</Label>
                        <p className="font-medium">{new Date(selectedInvoice.paidDate).toLocaleDateString('es-ES')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-semibold mb-2 block">Estado de Factura</Label>
                <Select 
                  value={selectedInvoice.status} 
                  onValueChange={(value) => handleUpdateStatus(selectedInvoice.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INVOICE_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Conceptos</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Descripción</th>
                        <th className="text-right p-3 text-sm font-medium">Cant.</th>
                        <th className="text-right p-3 text-sm font-medium">Precio Unit.</th>
                        <th className="text-right p-3 text-sm font-medium">IVA</th>
                        <th className="text-right p-3 text-sm font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.lineItems.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          <td className="p-3 text-sm">{item.description}</td>
                          <td className="p-3 text-sm text-right">{item.quantity}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 text-sm text-right">{item.taxRate}%</td>
                          <td className="p-3 text-sm text-right font-medium">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA</span>
                  <span className="font-medium">{formatCurrency(selectedInvoice.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Notas</h4>
                    <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                      {selectedInvoice.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  )
}
