import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { BC3ImportDialog } from '@/components/BC3ImportDialog'
import { 
  Database, 
  MagnifyingGlass, 
  Trash, 
  DownloadSimple, 
  FileArrowDown,
  Package,
  Wrench,
  Gear,
  Briefcase,
  FunnelSimple,
  SortAscending,
  Info,
  Warning,
  CheckCircle,
  X
} from '@phosphor-icons/react'
import { BudgetPrice } from '@/lib/types'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PriceDatabaseManagerProps {
  trigger?: React.ReactNode
}

type SortField = 'code' | 'description' | 'unitPrice' | 'type' | 'lastUpdated'
type SortDirection = 'asc' | 'desc'
type FilterType = 'all' | 'material' | 'labor' | 'machinery' | 'unit'

export function PriceDatabaseManager({ trigger }: PriceDatabaseManagerProps) {
  const [priceDatabase, setPriceDatabase] = useKV<BudgetPrice[]>('price-database', [])
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortField, setSortField] = useState<SortField>('code')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedPrice, setSelectedPrice] = useState<BudgetPrice | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filteredAndSortedPrices = useMemo(() => {
    let result = priceDatabase || []

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(price => 
        price.code.toLowerCase().includes(query) ||
        price.description.toLowerCase().includes(query) ||
        price.category?.toLowerCase().includes(query)
      )
    }

    if (filterType !== 'all') {
      result = result.filter(price => price.type === filterType)
    }

    result = [...result].sort((a, b) => {
      let aVal: any = a[sortField]
      let bVal: any = b[sortField]

      if (sortField === 'lastUpdated') {
        aVal = a.lastUpdated || 0
        bVal = b.lastUpdated || 0
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })

    return result
  }, [priceDatabase, searchQuery, filterType, sortField, sortDirection])

  const statistics = useMemo(() => {
    const db = priceDatabase || []
    return {
      total: db.length,
      materials: db.filter(p => p.type === 'material').length,
      labor: db.filter(p => p.type === 'labor').length,
      machinery: db.filter(p => p.type === 'machinery').length,
      units: db.filter(p => p.type === 'unit').length
    }
  }, [priceDatabase])

  const handleDeletePrice = (priceId: string) => {
    setPriceDatabase(current => (current || []).filter(p => p.id !== priceId))
    toast.success('Precio eliminado de la base de datos')
    setDeleteDialogOpen(false)
    setSelectedPrice(null)
  }

  const handleClearDatabase = () => {
    if (confirm('¿Estás seguro de que deseas eliminar TODOS los precios de la base de datos? Esta acción no se puede deshacer.')) {
      setPriceDatabase([])
      toast.success('Base de precios vaciada')
    }
  }

  const handleExportToJSON = () => {
    const dataStr = JSON.stringify(priceDatabase || [], null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `base-precios-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Base de precios exportada')
  }

  const handleExportToCSV = () => {
    if (!priceDatabase || priceDatabase.length === 0) {
      toast.error('No hay datos para exportar')
      return
    }

    const headers = ['Código', 'Descripción', 'Unidad', 'Precio Unitario', 'Tipo', 'Categoría', 'Fuente', 'Última Actualización']
    const rows = priceDatabase.map(p => [
      p.code,
      p.description,
      p.unit,
      p.unitPrice.toFixed(2),
      p.type,
      p.category || '',
      p.source || '',
      new Date(p.lastUpdated).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n')

    const dataBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `base-precios-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Base de precios exportada a CSV')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'material': return <Package size={18} className="text-blue-500" weight="duotone" />
      case 'labor': return <Wrench size={18} className="text-green-500" weight="duotone" />
      case 'machinery': return <Gear size={18} className="text-orange-500" weight="duotone" />
      case 'unit': return <Briefcase size={18} className="text-purple-500" weight="duotone" />
      default: return <Package size={18} className="text-muted-foreground" weight="duotone" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'material': 'Material',
      'labor': 'M.O.',
      'machinery': 'Maquinaria',
      'unit': 'Unidad'
    }
    return labels[type] || type
  }

  const getTypeBadgeClass = (type: string) => {
    const classes: Record<string, string> = {
      'material': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'labor': 'bg-green-500/10 text-green-500 border-green-500/20',
      'machinery': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'unit': 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    }
    return classes[type] || ''
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {trigger ? (
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Database size={18} weight="duotone" />
              Base de Precios
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Database size={32} weight="duotone" className="text-primary" />
              Gestión de Base de Precios
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Administra tu biblioteca de precios de construcción BC3 (BEDEC, PREOC, BPHU)
            </p>
          </DialogHeader>

          <Tabs defaultValue="database" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="database" className="gap-2">
                <Database size={18} />
                Base de Datos ({statistics.total})
              </TabsTrigger>
              <TabsTrigger value="import" className="gap-2">
                <FileArrowDown size={18} />
                Importar BC3
              </TabsTrigger>
            </TabsList>

            <TabsContent value="database" className="flex-1 flex flex-col space-y-4 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Database size={20} className="text-primary" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{statistics.total}</p>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={20} className="text-blue-500" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Materiales</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{statistics.materials}</p>
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench size={20} className="text-green-500" weight="duotone" />
                    <p className="text-xs text-muted-foreground">M.O.</p>
                  </div>
                  <p className="text-2xl font-bold text-green-500">{statistics.labor}</p>
                </div>

                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Gear size={20} className="text-orange-500" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Maquinaria</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-500">{statistics.machinery}</p>
                </div>

                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={20} className="text-purple-500" weight="duotone" />
                    <p className="text-xs text-muted-foreground">Unidades</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-500">{statistics.units}</p>
                </div>
              </div>

              {statistics.total === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-md">
                    <Database size={64} className="mx-auto text-muted-foreground opacity-50" weight="duotone" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Base de precios vacía</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comienza importando una base de precios en formato BC3 desde la pestaña "Importar BC3"
                      </p>
                    </div>
                    <Alert>
                      <Info size={18} />
                      <AlertDescription className="text-sm">
                        <p className="font-semibold mb-2">Fuentes recomendadas:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>BEDEC - Base de datos del ITeC (Cataluña)</li>
                          <li>PREOC - Precios de edificación de Galicia</li>
                          <li>BPHU - Base de precios del País Vasco</li>
                          <li>BASE - Banco estructurado de precios de Navarra</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por código, descripción o categoría..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <FunnelSimple size={18} className="mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="material">Materiales</SelectItem>
                        <SelectItem value="labor">Mano de Obra</SelectItem>
                        <SelectItem value="machinery">Maquinaria</SelectItem>
                        <SelectItem value="unit">Unidades</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SortAscending size={18} className="mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="code">Por código</SelectItem>
                        <SelectItem value="description">Por descripción</SelectItem>
                        <SelectItem value="unitPrice">Por precio</SelectItem>
                        <SelectItem value="type">Por tipo</SelectItem>
                        <SelectItem value="lastUpdated">Por fecha</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
                      title={sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
                    >
                      <SortAscending size={18} className={cn(sortDirection === 'desc' && 'rotate-180')} />
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Mostrando {filteredAndSortedPrices.length} de {statistics.total} precios
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportToJSON} className="gap-2">
                        <DownloadSimple size={16} />
                        Exportar JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportToCSV} className="gap-2">
                        <DownloadSimple size={16} />
                        Exportar CSV
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleClearDatabase}
                        className="gap-2"
                        disabled={statistics.total === 0}
                      >
                        <Trash size={16} />
                        Vaciar Base
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 rounded-lg border">
                    <div className="p-4 space-y-2">
                      <AnimatePresence mode="popLayout">
                        {filteredAndSortedPrices.map((price, index) => (
                          <motion.div
                            key={price.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: Math.min(index * 0.02, 0.3) }}
                            className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all border border-transparent hover:border-primary/20 group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(price.type)}
                                  <span className="font-mono text-sm font-bold text-primary">
                                    {price.code}
                                  </span>
                                  <Badge variant="outline" className={cn("text-xs", getTypeBadgeClass(price.type))}>
                                    {getTypeLabel(price.type)}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {price.unit.toUpperCase()}
                                  </Badge>
                                  {price.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {price.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm mb-2">{price.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  {price.source && (
                                    <span>Fuente: {price.source}</span>
                                  )}
                                  <span>•</span>
                                  <span>Actualizado: {new Date(price.lastUpdated).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">
                                    {price.unitPrice.toFixed(2)} €
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    / {price.unit}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setSelectedPrice(price)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash size={18} className="text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {filteredAndSortedPrices.length === 0 && searchQuery && (
                        <div className="text-center py-12">
                          <MagnifyingGlass size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-sm text-muted-foreground">
                            No se encontraron resultados para "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </TabsContent>

            <TabsContent value="import" className="flex-1 flex flex-col overflow-hidden mt-4">
              <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                <Alert>
                  <Info size={18} />
                  <AlertDescription>
                    <p className="font-semibold mb-2">Importar Base de Precios BC3</p>
                    <p className="text-sm">
                      Importa bases de precios oficiales españolas en formato FIEBDC-3 (BC3) desde archivo local o URL. 
                      Compatible con BEDEC, PREOC, BPHU y otras bases de precios.
                    </p>
                  </AlertDescription>
                </Alert>
                
                <BC3ImportDialog trigger={null} embedded={true} />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Warning size={24} className="text-destructive" weight="duotone" />
              Confirmar eliminación
            </DialogTitle>
          </DialogHeader>
          
          {selectedPrice && (
            <div className="space-y-4">
              <Alert>
                <Info size={18} />
                <AlertDescription>
                  <p className="text-sm">
                    ¿Estás seguro de que deseas eliminar este precio de la base de datos?
                  </p>
                </AlertDescription>
              </Alert>

              <div className="p-3 rounded-lg bg-muted border">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedPrice.type)}
                  <span className="font-mono text-sm font-bold">{selectedPrice.code}</span>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(selectedPrice.type)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedPrice.description}</p>
                <p className="text-lg font-bold text-primary mt-2">
                  {selectedPrice.unitPrice.toFixed(2)} € / {selectedPrice.unit}
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setDeleteDialogOpen(false)
                    setSelectedPrice(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 gap-2"
                  onClick={() => handleDeletePrice(selectedPrice.id)}
                >
                  <Trash size={18} />
                  Eliminar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
