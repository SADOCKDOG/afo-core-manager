import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stakeholder, StakeholderType, STAKEHOLDER_TYPE_LABELS } from '@/lib/types'
import { useState, useEffect } from 'react'

interface StakeholderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (stakeholder: Partial<Stakeholder>) => void
  stakeholder?: Stakeholder
}

export function StakeholderDialog({ open, onOpenChange, onSave, stakeholder }: StakeholderDialogProps) {
  const [type, setType] = useState<StakeholderType>('promotor')
  const [nif, setNif] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [collegiateNumber, setCollegiateNumber] = useState('')
  const [qualification, setQualification] = useState('')

  useEffect(() => {
    if (stakeholder) {
      setType(stakeholder.type)
      setNif(stakeholder.nif)
      setName(stakeholder.name)
      setAddress(stakeholder.address || '')
      setEmail(stakeholder.email || '')
      setPhone(stakeholder.phone || '')
      setCollegiateNumber(stakeholder.collegiateNumber || '')
      setQualification(stakeholder.qualification || '')
    } else {
      setType('promotor')
      setNif('')
      setName('')
      setAddress('')
      setEmail('')
      setPhone('')
      setCollegiateNumber('')
      setQualification('')
    }
  }, [stakeholder, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave({
      ...(stakeholder || {}),
      type,
      nif,
      name,
      address: address || undefined,
      email: email || undefined,
      phone: phone || undefined,
      collegiateNumber: collegiateNumber || undefined,
      qualification: qualification || undefined
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {stakeholder ? 'Editar Interviniente' : 'Nuevo Interviniente'}
          </DialogTitle>
          <DialogDescription>
            Complete la información del interviniente del proyecto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Interviniente *</Label>
            <Select value={type} onValueChange={(val) => setType(val as StakeholderType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotor">Promotor</SelectItem>
                <SelectItem value="architect">Arquitecto</SelectItem>
                <SelectItem value="technician">Técnico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nif">NIF/NIE/CIF *</Label>
              <Input
                id="nif"
                value={nif}
                onChange={(e) => setNif(e.target.value)}
                placeholder="12345678A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                {type === 'promotor' ? 'Nombre o Razón Social *' : 'Nombre y Apellidos *'}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={type === 'promotor' ? 'Empresa S.L.' : 'Juan Pérez García'}
                required
              />
            </div>
          </div>

          {type === 'promotor' && (
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle Principal 123, Madrid"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 123 456"
              />
            </div>
          </div>

          {type === 'architect' && (
            <div className="space-y-2">
              <Label htmlFor="collegiateNumber">Número de Colegiado</Label>
              <Input
                id="collegiateNumber"
                value={collegiateNumber}
                onChange={(e) => setCollegiateNumber(e.target.value)}
                placeholder="COAM 12345"
              />
            </div>
          )}

          {type === 'technician' && (
            <div className="space-y-2">
              <Label htmlFor="qualification">Titulación</Label>
              <Input
                id="qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Ingeniero Industrial"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!nif || !name}>
              {stakeholder ? 'Guardar Cambios' : 'Añadir Interviniente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
