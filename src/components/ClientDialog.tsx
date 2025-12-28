import { useState, useEffect } from 'react'
import { Client } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { User, Buildings } from '@phosphor-icons/react'

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (client: Partial<Client>) => void
  client?: Client
}

export function ClientDialog({ open, onOpenChange, onSave, client }: ClientDialogProps) {
  const [type, setType] = useState<'persona-fisica' | 'persona-juridica'>('persona-fisica')
  const [nif, setNif] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido1, setApellido1] = useState('')
  const [apellido2, setApellido2] = useState('')
  const [razonSocial, setRazonSocial] = useState('')
  const [direccion, setDireccion] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [representante, setRepresentante] = useState('')
  const [notas, setNotas] = useState('')

  useEffect(() => {
    if (client) {
      setType(client.type)
      setNif(client.nif)
      setNombre(client.nombre || '')
      setApellido1(client.apellido1 || '')
      setApellido2(client.apellido2 || '')
      setRazonSocial(client.razonSocial || '')
      setDireccion(client.direccion || '')
      setEmail(client.email || '')
      setTelefono(client.telefono || '')
      setRepresentante(client.representante || '')
      setNotas(client.notas || '')
    } else {
      resetForm()
    }
  }, [client, open])

  const resetForm = () => {
    setType('persona-fisica')
    setNif('')
    setNombre('')
    setApellido1('')
    setApellido2('')
    setRazonSocial('')
    setDireccion('')
    setEmail('')
    setTelefono('')
    setRepresentante('')
    setNotas('')
  }

  const handleSave = () => {
    if (!nif.trim()) {
      alert('El NIF/CIF es obligatorio')
      return
    }

    if (type === 'persona-fisica' && !nombre.trim()) {
      alert('El nombre es obligatorio para personas físicas')
      return
    }

    if (type === 'persona-juridica' && !razonSocial.trim()) {
      alert('La razón social es obligatoria para personas jurídicas')
      return
    }

    const clientData: Partial<Client> = {
      id: client?.id,
      type,
      nif: nif.trim(),
      nombre: type === 'persona-fisica' ? nombre.trim() : undefined,
      apellido1: type === 'persona-fisica' ? apellido1.trim() : undefined,
      apellido2: type === 'persona-fisica' ? apellido2.trim() : undefined,
      razonSocial: type === 'persona-juridica' ? razonSocial.trim() : undefined,
      direccion: direccion.trim() || undefined,
      email: email.trim() || undefined,
      telefono: telefono.trim() || undefined,
      representante: type === 'persona-juridica' ? representante.trim() || undefined : undefined,
      notas: notas.trim() || undefined
    }

    onSave(clientData)
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(val) => setType(val as typeof type)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="persona-fisica" className="gap-2">
              <User size={16} weight="duotone" />
              Persona Física
            </TabsTrigger>
            <TabsTrigger value="persona-juridica" className="gap-2">
              <Buildings size={16} weight="duotone" />
              Persona Jurídica
            </TabsTrigger>
          </TabsList>

          <TabsContent value="persona-fisica" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="nif">NIF/NIE *</Label>
                <Input
                  id="nif"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="12345678A"
                />
              </div>

              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan"
                />
              </div>

              <div>
                <Label htmlFor="apellido1">Apellido 1 *</Label>
                <Input
                  id="apellido1"
                  value={apellido1}
                  onChange={(e) => setApellido1(e.target.value)}
                  placeholder="García"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="apellido2">Apellido 2</Label>
                <Input
                  id="apellido2"
                  value={apellido2}
                  onChange={(e) => setApellido2(e.target.value)}
                  placeholder="López"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Calle Principal, 123"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 600 123 456"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Información adicional sobre el cliente..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="persona-juridica" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cif">CIF *</Label>
                <Input
                  id="cif"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="A12345678"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  value={razonSocial}
                  onChange={(e) => setRazonSocial(e.target.value)}
                  placeholder="Empresa S.L."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="representante">Representante</Label>
                <Input
                  id="representante"
                  value={representante}
                  onChange={(e) => setRepresentante(e.target.value)}
                  placeholder="Nombre del representante legal"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="direccion-juridica">Dirección</Label>
                <Input
                  id="direccion-juridica"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Polígono Industrial, Nave 5"
                />
              </div>

              <div>
                <Label htmlFor="email-juridica">Email</Label>
                <Input
                  id="email-juridica"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="telefono-juridica">Teléfono</Label>
                <Input
                  id="telefono-juridica"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 900 123 456"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notas-juridica">Notas</Label>
                <Textarea
                  id="notas-juridica"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Información adicional sobre el cliente..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {client ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
