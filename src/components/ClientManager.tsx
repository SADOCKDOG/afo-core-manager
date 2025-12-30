import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Client, PAYMENT_TERMS_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Pencil, Trash, MagnifyingGlass, Percent, CalendarBlank } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { ClientDialog } from './ClientDialog'
import { toast } from 'sonner'

export function ClientManager() {
  const [clients, setClients] = useKV<Client[]>('clients', [])
  const [open, setOpen] = useState(false)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | undefined>()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = (clients || []).filter(client => {
    const searchLower = searchTerm.toLowerCase()
    const nif = client.nif?.toLowerCase() || ''
    const nombre = client.nombre?.toLowerCase() || ''
    const razonSocial = client.razonSocial?.toLowerCase() || ''
    const apellido1 = client.apellido1?.toLowerCase() || ''
    const email = client.email?.toLowerCase() || ''
    
    return nif.includes(searchLower) || 
           nombre.includes(searchLower) || 
           razonSocial.includes(searchLower) ||
           apellido1.includes(searchLower) ||
           email.includes(searchLower)
  })

  const handleSaveClient = (clientData: Partial<Client>) => {
    setClients(currentClients => {
      const clientsList = currentClients || []
      if (clientData.id) {
        return clientsList.map(c => 
          c.id === clientData.id 
            ? { ...c, ...clientData, updatedAt: Date.now() } as Client
            : c
        )
      } else {
        const newClient: Client = {
          id: Date.now().toString(),
          type: clientData.type || 'persona-fisica',
          nif: clientData.nif!,
          nombre: clientData.nombre,
          apellido1: clientData.apellido1,
          apellido2: clientData.apellido2,
          razonSocial: clientData.razonSocial,
          direccion: clientData.direccion,
          email: clientData.email,
          telefono: clientData.telefono,
          representante: clientData.representante,
          notas: clientData.notas,
          customTaxRate: clientData.customTaxRate,
          paymentTerms: clientData.paymentTerms,
          customPaymentDays: clientData.customPaymentDays,
          earlyPaymentDiscount: clientData.earlyPaymentDiscount,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        toast.success('Cliente añadido correctamente')
        return [...clientsList, newClient]
      }
    })
    
    if (clientData.id) {
      toast.success('Cliente actualizado correctamente')
    }
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setClientDialogOpen(true)
  }

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClients(currentClients => 
        (currentClients || []).filter(c => c.id !== clientId)
      )
      toast.success('Cliente eliminado correctamente')
    }
  }

  const getClientDisplayName = (client: Client) => {
    if (client.type === 'persona-juridica') {
      return client.razonSocial || 'Sin nombre'
    }
    return `${client.nombre || ''} ${client.apellido1 || ''} ${client.apellido2 || ''}`.trim() || 'Sin nombre'
  }

  const getPaymentTermsLabel = (client: Client) => {
    if (!client.paymentTerms) return '30 días'
    if (client.paymentTerms === 'custom' && client.customPaymentDays) {
      return `${client.customPaymentDays} días`
    }
    return PAYMENT_TERMS_LABELS[client.paymentTerms]
  }

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Users size={18} weight="duotone" />
        Clientes ({(clients || []).length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users size={28} weight="duotone" className="text-primary" />
              Gestión de Clientes
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar por NIF, nombre, razón social o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => {
                  setSelectedClient(undefined)
                  setClientDialogOpen(true)
                }}
                className="gap-2"
              >
                <Plus size={18} weight="bold" />
                Añadir Cliente
              </Button>
            </div>

            {filteredClients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                  <Users size={48} className="text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comienza añadiendo tu primer cliente'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => {
                      setSelectedClient(undefined)
                      setClientDialogOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Plus size={18} weight="bold" />
                    Añadir Primer Cliente
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>NIF/CIF</TableHead>
                      <TableHead>Nombre/Razón Social</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Percent size={14} />
                          IVA
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CalendarBlank size={14} />
                          Plazo
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <Badge variant={client.type === 'persona-fisica' ? 'default' : 'secondary'}>
                            {client.type === 'persona-fisica' ? 'Física' : 'Jurídica'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{client.nif}</TableCell>
                        <TableCell className="font-medium">
                          {getClientDisplayName(client)}
                          {client.representante && client.type === 'persona-juridica' && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Rep.: {client.representante}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{client.email || '-'}</TableCell>
                        <TableCell className="text-sm">{client.telefono || '-'}</TableCell>
                        <TableCell className="text-center text-sm">
                          {client.customTaxRate !== undefined ? (
                            <Badge variant="outline" className="font-mono">
                              {client.customTaxRate}%
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">21%</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          <div className="flex flex-col items-center gap-1">
                            <span>{getPaymentTermsLabel(client)}</span>
                            {client.earlyPaymentDiscount !== undefined && client.earlyPaymentDiscount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                -{client.earlyPaymentDiscount}% PP
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClient(client)}
                            >
                              <Pencil size={16} weight="duotone" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash size={16} weight="duotone" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        onSave={handleSaveClient}
        client={selectedClient}
      />
    </>
  )
}
