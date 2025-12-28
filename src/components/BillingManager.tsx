import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Invoice, Client, Project, INVOICE_TYPE_LABELS, INVOICE_STATUS_LABELS } from '@/lib/types'
import { getInvoiceStatusColor, formatCurrency, isInvoiceOverdue } from '@/lib/invoice-utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Receipt, Plus, Pencil, Trash, MagnifyingGlass, CalendarBlank, Clock, WarningCircle, CheckCircle, EnvelopeSimple } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { InvoiceDialog } from './InvoiceDialog'
import { toast } from 'sonner'
import { sendEmailReminder } from '@/lib/email-service'

export function BillingManager() {
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [clients] = useKV<Client[]>('clients', [])
  const [projects] = useKV<Project[]>('projects', [])
  
  const [open, setOpen] = useState(false)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'issued' | 'paid' | 'overdue'>('all')

  const filteredInvoices = (invoices || []).filter(invoice => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.clientName.toLowerCase().includes(searchLower) ||
      invoice.clientNIF.toLowerCase().includes(searchLower)
    
    let matchesFilter = true
    if (filterStatus === 'overdue') {
      matchesFilter = isInvoiceOverdue(invoice)
    } else if (filterStatus !== 'all') {
      matchesFilter = invoice.status === filterStatus
    }
    
    return matchesSearch && matchesFilter
  })

  const handleSaveInvoice = (invoiceData: Partial<Invoice>) => {
    setInvoices(currentInvoices => {
      const invoicesList = currentInvoices || []
      if (invoiceData.id) {
        return invoicesList.map(i => 
          i.id === invoiceData.id 
            ? { ...i, ...invoiceData, updatedAt: Date.now() } as Invoice
            : i
        )
      } else {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now()
        } as Invoice
        toast.success('Factura creada correctamente')
        return [...invoicesList, newInvoice]
      }
    })
    
    if (invoiceData.id) {
      toast.success('Factura actualizada correctamente')
    }
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setInvoiceDialogOpen(true)
  }

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      setInvoices(currentInvoices => 
        (currentInvoices || []).filter(i => i.id !== invoiceId)
      )
      toast.success('Factura eliminada correctamente')
    }
  }

  const handleSendReminder = async (invoice: Invoice) => {
    const client = (clients || []).find(c => c.id === invoice.clientId)
    if (!client?.email) {
      toast.error('El cliente no tiene email configurado')
      return
    }

    try {
      const subject = `Recordatorio de pago - Factura ${invoice.invoiceNumber}`
      const body = `
Estimado/a ${invoice.clientName},

Le recordamos que tiene pendiente el pago de la factura ${invoice.invoiceNumber} por un importe de ${formatCurrency(invoice.total)}.

Fecha de vencimiento: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('es-ES') : 'No especificada'}

Le agradeceríamos que realizara el pago a la mayor brevedad posible.

Saludos cordiales
      `.trim()

      await sendEmailReminder(client.email, subject, body)
      toast.success('Recordatorio enviado correctamente')
    } catch (error) {
      toast.error('Error al enviar el recordatorio')
      console.error(error)
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

  const getTotalsByStatus = () => {
    const totals = {
      all: 0,
      draft: 0,
      issued: 0,
      paid: 0,
      overdue: 0
    }

    ;(invoices || []).forEach(invoice => {
      totals.all += invoice.total
      if (isInvoiceOverdue(invoice)) {
        totals.overdue += invoice.total
      } else {
        totals[invoice.status] += invoice.total
      }
    })

    return totals
  }

  const totals = getTotalsByStatus()

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Receipt size={18} weight="duotone" />
        Facturación
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Receipt size={28} weight="duotone" className="text-primary" />
              Gestión de Facturación
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Facturado</div>
                <div className="text-2xl font-bold">{formatCurrency(totals.all)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Cobrado</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.paid)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Pendiente</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totals.issued)}</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">Vencido</div>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(totals.overdue)}</div>
              </Card>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar por número, cliente o NIF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Tabs value={filterStatus} onValueChange={(val) => setFilterStatus(val as typeof filterStatus)}>
                <TabsList>
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="draft">Borradores</TabsTrigger>
                  <TabsTrigger value="issued">Emitidas</TabsTrigger>
                  <TabsTrigger value="paid">Pagadas</TabsTrigger>
                  <TabsTrigger value="overdue">Vencidas</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button 
                onClick={() => {
                  setSelectedInvoice(undefined)
                  setInvoiceDialogOpen(true)
                }}
                className="gap-2"
              >
                <Plus size={18} weight="bold" />
                Nueva Factura
              </Button>
            </div>

            {filteredInvoices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Receipt size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No se encontraron facturas' : 'No hay facturas registradas'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Intenta con otros términos de búsqueda o filtros'
                    : 'Comienza creando tu primera factura'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Button 
                    onClick={() => {
                      setSelectedInvoice(undefined)
                      setInvoiceDialogOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Plus size={18} weight="bold" />
                    Crear Primera Factura
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          {getStatusIcon(invoice)}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{invoice.invoiceNumber}</span>
                              <Badge variant="outline" className={getInvoiceStatusColor(invoice.status)}>
                                {INVOICE_STATUS_LABELS[invoice.status]}
                              </Badge>
                              <Badge variant="secondary">
                                {INVOICE_TYPE_LABELS[invoice.type]}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              {invoice.clientName} - {invoice.clientNIF}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              {invoice.issuedDate && (
                                <div className="flex items-center gap-1">
                                  <CalendarBlank size={14} />
                                  Emitida: {new Date(invoice.issuedDate).toLocaleDateString('es-ES')}
                                </div>
                              )}
                              {invoice.dueDate && (
                                <div className={`flex items-center gap-1 ${isInvoiceOverdue(invoice) ? 'text-destructive font-medium' : ''}`}>
                                  <Clock size={14} />
                                  Vence: {new Date(invoice.dueDate).toLocaleDateString('es-ES')}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {formatCurrency(invoice.total)}
                            </div>
                            {invoice.subtotal !== invoice.total && (
                              <div className="text-xs text-muted-foreground">
                                Base: {formatCurrency(invoice.subtotal)}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {invoice.status === 'issued' && isInvoiceOverdue(invoice) && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleSendReminder(invoice)}
                              title="Enviar recordatorio de pago"
                            >
                              <EnvelopeSimple size={16} weight="duotone" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Pencil size={16} weight="duotone" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteInvoice(invoice.id)}
                          >
                            <Trash size={16} weight="duotone" />
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
      </Dialog>

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
      />
    </>
  )
}
