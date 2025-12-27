import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { BudgetPrice } from '@/lib/types'
import { DEFAULT_PRICE_DATABASE, PRICE_CATEGORIES } from '@/lib/budget-prices'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Plus, Download } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/budget-utils'
import { toast } from 'sonner'

interface PriceDatabaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectPrice: (price: BudgetPrice) => void
}

export function PriceDatabaseDialog({ open, onOpenChange, onSelectPrice }: PriceDatabaseDialogProps) {
  const [priceDatabase, setPriceDatabase] = useKV<BudgetPrice[]>('price-database', DEFAULT_PRICE_DATABASE)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredPrices = (priceDatabase || []).filter(price => {
    const matchesSearch = 
      price.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || price.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleAddCustomPrice = () => {
    const newPrice: BudgetPrice = {
      id: Date.now().toString(),
      code: 'CUSTOM' + Date.now(),
      description: 'Nueva partida personalizada',
      unit: 'ud',
      unitPrice: 0,
      type: 'unit',
      category: 'Otros',
      lastUpdated: Date.now(),
      source: 'Personalizado'
    }

    setPriceDatabase(current => [...(current || []), newPrice])
    toast.success('Partida añadida a la base de precios')
  }

  const handleImportPrices = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.bc3,.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast.info('Funcionalidad de importación en desarrollo')
      }
    }
    input.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Base de Datos de Precios</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportPrices}
                className="gap-2"
              >
                <Download size={16} />
                Importar BC3
              </Button>
              <Button
                size="sm"
                onClick={handleAddCustomPrice}
                className="gap-2"
              >
                <Plus size={16} weight="bold" />
                Nueva Partida
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <MagnifyingGlass 
                  size={18} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Buscar por código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {PRICE_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredPrices.length} partida{filteredPrices.length !== 1 ? 's' : ''} encontrada{filteredPrices.length !== 1 ? 's' : ''}
          </div>

          <ScrollArea className="h-[500px] border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="w-[100px]">Unidad</TableHead>
                  <TableHead className="w-[120px] text-right">Precio</TableHead>
                  <TableHead className="w-[150px]">Categoría</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.map(price => (
                  <TableRow key={price.id} className="hover:bg-muted/50">
                    <TableCell>
                      <span className="font-mono text-sm">{price.code}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{price.description}</div>
                        {price.source && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Fuente: {price.source}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {price.unit.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(price.unitPrice)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{price.category}</span>
                      {price.subcategory && (
                        <div className="text-xs text-muted-foreground">{price.subcategory}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          onSelectPrice(price)
                          toast.success('Partida seleccionada')
                        }}
                      >
                        Usar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPrices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      <MagnifyingGlass size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                      <p>No se encontraron partidas</p>
                      <p className="text-sm">Prueba con otros términos de búsqueda</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
