import { useState, useEffect } from 'react'
import { BudgetItem, BudgetItemType, UnitType, UNIT_TYPE_LABELS } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface BudgetItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (item: BudgetItem) => void
  item?: BudgetItem
}

export function BudgetItemDialog({ open, onOpenChange, onSave, item }: BudgetItemDialogProps) {
  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    type: 'unit',
    code: '',
    description: '',
    unit: 'ud',
    quantity: 1,
    unitPrice: 0,
    order: 0
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        type: 'unit',
        code: '',
        description: '',
        unit: 'ud',
        quantity: 1,
        unitPrice: 0,
        order: 0
      })
    }
  }, [item, open])

  const handleSubmit = () => {
    const totalPrice = (formData.quantity || 0) * (formData.unitPrice || 0)
    
    const budgetItem: BudgetItem = {
      id: item?.id || Date.now().toString(),
      code: formData.code || '',
      type: formData.type || 'unit',
      description: formData.description || '',
      unit: formData.unit,
      quantity: formData.quantity,
      unitPrice: formData.unitPrice,
      totalPrice,
      order: formData.order || 0,
      children: formData.children,
      resources: formData.resources,
      parentId: formData.parentId
    }

    onSave(budgetItem)
    onOpenChange(false)
  }

  const isChapter = formData.type === 'chapter'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Partida' : 'Nueva Partida'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as BudgetItemType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chapter">Capítulo</SelectItem>
                  <SelectItem value="unit">Unidad de obra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Código</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="01"
              />
            </div>
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la partida"
              rows={3}
            />
          </div>

          {!isChapter && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Unidad</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => setFormData({ ...formData, unit: value as UnitType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(UNIT_TYPE_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {key.toUpperCase()} - {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.quantity || ''}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Precio unitario (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice || ''}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {((formData.quantity || 0) * (formData.unitPrice || 0)).toFixed(2)} €
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {item ? 'Actualizar' : 'Añadir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
