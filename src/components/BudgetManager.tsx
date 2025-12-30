import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Budget, BudgetItem, BudgetPrice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calculator, Download, Plus, Pencil, Trash, FileText, Database, FileArrowDown, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { formatCurrency, calculateBudgetTotals, downloadBC3 } from '@/lib/budget-utils'
import { BudgetItemDialog } from './BudgetItemDialog'
import { PriceDatabaseDialog } from './PriceDatabaseDialog'
import { BC3ImportDialog } from './BC3ImportDialog'
import { OnlineDatabaseBrowser } from './OnlineDatabaseBrowser'
import { BC3ParseResult } from '@/lib/bc3-parser'
import { motion } from 'framer-motion'

interface BudgetManagerProps {
  projectId: string
  projectName: string
}

export function BudgetManager({ projectId, projectName }: BudgetManagerProps) {
  const [budgets, setBudgets] = useKV<Budget[]>('budgets', [])
  const [prices, setPrices] = useKV<BudgetPrice[]>('budget-prices', [])
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [priceDbOpen, setPriceDbOpen] = useState(false)
  const [bc3ImportOpen, setBC3ImportOpen] = useState(false)
  const [onlineDbOpen, setOnlineDbOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | undefined>()
  
  const projectBudgets = (budgets || []).filter(b => b.projectId === projectId)

  const handleCreateBudget = () => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      projectId,
      name: 'Nuevo Presupuesto',
      version: '1.0',
      items: [],
      totalPEM: 0,
      totalGG: 0,
      totalBI: 0,
      totalIVA: 0,
      totalPresupuesto: 0,
      percentageGG: 13,
      percentageBI: 6,
      percentageIVA: 21,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft'
    }
    
    setBudgets(current => [...(current || []), newBudget])
    setSelectedBudget(newBudget)
    toast.success('Presupuesto creado')
  }

  const handleUpdateBudget = (updates: Partial<Budget>) => {
    if (!selectedBudget) return
    
    const totals = calculateBudgetTotals(
      updates.items || selectedBudget.items,
      updates.percentageGG ?? selectedBudget.percentageGG,
      updates.percentageBI ?? selectedBudget.percentageBI,
      updates.percentageIVA ?? selectedBudget.percentageIVA
    )
    
    const updatedBudget = {
      ...selectedBudget,
      ...updates,
      ...totals,
      updatedAt: Date.now()
    }
    
    setBudgets(current => 
      (current || []).map(b => b.id === selectedBudget.id ? updatedBudget : b)
    )
    setSelectedBudget(updatedBudget)
  }

  const handleSaveItem = (item: BudgetItem) => {
    if (!selectedBudget) return
    
    const updatedItems = [...selectedBudget.items]
    
    if (editingItem) {
      const index = updatedItems.findIndex(i => i.id === editingItem.id)
      if (index !== -1) {
        updatedItems[index] = item
      }
    } else {
      updatedItems.push(item)
    }
    
    handleUpdateBudget({ items: updatedItems })
    toast.success(editingItem ? 'Partida actualizada' : 'Partida añadida')
  }

  const handleDeleteItem = (itemId: string) => {
    if (!selectedBudget) return
    
    const updatedItems = selectedBudget.items.filter(i => i.id !== itemId)
    handleUpdateBudget({ items: updatedItems })
    toast.success('Partida eliminada')
  }

  const handleExportBC3 = () => {
    if (!selectedBudget) return
    downloadBC3(selectedBudget, projectName)
    toast.success('Archivo BC3 exportado')
  }

  const handleBC3Import = (items: BudgetItem[], importedPrices: BudgetPrice[], metadata: BC3ParseResult['metadata']) => {
    setPrices(currentPrices => {
      const existingCodes = new Set((currentPrices || []).map(p => p.code))
      const newPrices = importedPrices.filter(p => !existingCodes.has(p.code))
      return [...(currentPrices || []), ...newPrices]
    })

    if (selectedBudget) {
      const updatedItems = [...selectedBudget.items, ...items]
      handleUpdateBudget({ 
        items: updatedItems,
        name: metadata.title || selectedBudget.name
      })
    } else {
      const newBudget: Budget = {
        id: Date.now().toString(),
        projectId,
        name: metadata.title || 'Presupuesto Importado',
        version: '1.0',
        items,
        totalPEM: 0,
        totalGG: 0,
        totalBI: 0,
        totalIVA: 0,
        totalPresupuesto: 0,
        percentageGG: 13,
        percentageBI: 6,
        percentageIVA: 21,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft'
      }
      
      const totals = calculateBudgetTotals(items, 13, 6, 21)
      const budgetWithTotals = { ...newBudget, ...totals }
      
      setBudgets(current => [...(current || []), budgetWithTotals])
      setSelectedBudget(budgetWithTotals)
    }
  }

  const handleOnlinePriceImport = (importedPrices: BudgetPrice[]) => {
    setPrices(currentPrices => {
      const existingCodes = new Set((currentPrices || []).map(p => p.code))
      const newPrices = importedPrices.filter(p => !existingCodes.has(p.code))
      return [...(currentPrices || []), ...newPrices]
    })
  }

  const renderBudgetItem = (item: BudgetItem, level: number = 0) => {
    const isChapter = item.type === 'chapter'
    
    return (
      <>
        <TableRow key={item.id} className={level > 0 ? 'bg-muted/30' : ''}>
          <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{item.code}</span>
              {isChapter && <Badge variant="outline" className="text-xs">Capítulo</Badge>}
            </div>
          </TableCell>
          <TableCell>
            <div className={isChapter ? 'font-semibold' : ''}>
              {item.description}
            </div>
          </TableCell>
          <TableCell className="text-center">
            {!isChapter && (item.unit || '-')}
          </TableCell>
          <TableCell className="text-right">
            {!isChapter && item.quantity ? item.quantity.toFixed(2) : '-'}
          </TableCell>
          <TableCell className="text-right">
            {!isChapter && item.unitPrice ? formatCurrency(item.unitPrice) : '-'}
          </TableCell>
          <TableCell className="text-right font-semibold">
            {item.totalPrice ? formatCurrency(item.totalPrice) : '-'}
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingItem(item)
                  setItemDialogOpen(true)
                }}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash size={16} className="text-destructive" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isChapter && item.children?.map(child => renderBudgetItem(child, level + 1))}
      </>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator size={18} />
          Presupuestos (PEM)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator size={24} />
            Presupuestos de Ejecución Material
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Listado</TabsTrigger>
            {selectedBudget && <TabsTrigger value="detail">Detalle</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {projectBudgets.length} presupuesto{projectBudgets.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setOnlineDbOpen(true)} 
                  className="gap-2"
                >
                  <Globe size={18} />
                  Bases Online
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setBC3ImportOpen(true)} 
                  className="gap-2"
                >
                  <FileArrowDown size={18} />
                  Importar BC3
                </Button>
                <Button onClick={handleCreateBudget} className="gap-2">
                  <Plus size={18} weight="bold" />
                  Nuevo Presupuesto
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[650px]">
              <div className="space-y-3">
                {projectBudgets.map((budget, index) => (
                  <motion.div
                    key={budget.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => setSelectedBudget(budget)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{budget.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Versión {budget.version} • {new Date(budget.updatedAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <Badge variant={
                        budget.status === 'approved' ? 'default' :
                        budget.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {budget.status === 'approved' ? 'Aprobado' :
                         budget.status === 'draft' ? 'Borrador' : 'Archivado'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">PEM</p>
                        <p className="font-semibold">{formatCurrency(budget.totalPEM)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">GG + BI</p>
                        <p className="font-semibold">{formatCurrency(budget.totalGG + budget.totalBI)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">IVA</p>
                        <p className="font-semibold">{formatCurrency(budget.totalIVA)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">{formatCurrency(budget.totalPresupuesto)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {projectBudgets.length === 0 && (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <Calculator size={48} className="text-muted-foreground" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Sin presupuestos</h3>
                    <p className="text-muted-foreground mb-6">
                      Crea un nuevo presupuesto o importa uno existente en formato BC3
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => setOnlineDbOpen(true)} 
                        className="gap-2"
                      >
                        <Globe size={18} />
                        Bases Online
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setBC3ImportOpen(true)} 
                        className="gap-2"
                      >
                        <FileArrowDown size={18} />
                        Importar BC3
                      </Button>
                      <Button onClick={handleCreateBudget} className="gap-2">
                        <Plus size={18} weight="bold" />
                        Crear Presupuesto
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {selectedBudget && (
            <TabsContent value="detail" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Input
                    value={selectedBudget.name}
                    onChange={(e) => handleUpdateBudget({ name: e.target.value })}
                    className="font-semibold text-lg"
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Versión:</Label>
                      <Input
                        value={selectedBudget.version}
                        onChange={(e) => handleUpdateBudget({ version: e.target.value })}
                        className="w-20 h-8 text-sm"
                      />
                    </div>
                    <Select
                      value={selectedBudget.status}
                      onValueChange={(value) => handleUpdateBudget({ status: value as Budget['status'] })}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="approved">Aprobado</SelectItem>
                        <SelectItem value="archived">Archivado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOnlineDbOpen(true)}
                    className="gap-2"
                  >
                    <Globe size={16} />
                    Bases Online
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBC3ImportOpen(true)}
                    className="gap-2"
                  >
                    <FileArrowDown size={16} />
                    Importar BC3
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPriceDbOpen(true)}
                    className="gap-2"
                  >
                    <Database size={16} />
                    Base de Precios
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportBC3}
                    className="gap-2"
                  >
                    <Download size={16} />
                    Exportar BC3
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingItem(undefined)
                      setItemDialogOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Plus size={16} weight="bold" />
                    Añadir Partida
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[550px] border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-center">Unidad</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedBudget.items.map(item => renderBudgetItem(item))}
                    {selectedBudget.items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          <FileText size={48} className="mx-auto mb-2 opacity-50" weight="duotone" />
                          <p>No hay partidas en este presupuesto</p>
                          <p className="text-sm">Añade capítulos y partidas para comenzar</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>

              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-xs">Gastos Generales (%)</Label>
                    <Input
                      type="number"
                      value={selectedBudget.percentageGG}
                      onChange={(e) => handleUpdateBudget({ percentageGG: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Beneficio Industrial (%)</Label>
                    <Input
                      type="number"
                      value={selectedBudget.percentageBI}
                      onChange={(e) => handleUpdateBudget({ percentageBI: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">IVA (%)</Label>
                    <Input
                      type="number"
                      value={selectedBudget.percentageIVA}
                      onChange={(e) => handleUpdateBudget({ percentageIVA: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Presupuesto de Ejecución Material (PEM)</span>
                    <span className="font-semibold">{formatCurrency(selectedBudget.totalPEM)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gastos Generales ({selectedBudget.percentageGG}%)</span>
                    <span>{formatCurrency(selectedBudget.totalGG)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Beneficio Industrial ({selectedBudget.percentageBI}%)</span>
                    <span>{formatCurrency(selectedBudget.totalBI)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Base Imponible</span>
                    <span>{formatCurrency(selectedBudget.totalPEM + selectedBudget.totalGG + selectedBudget.totalBI)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA ({selectedBudget.percentageIVA}%)</span>
                    <span>{formatCurrency(selectedBudget.totalIVA)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t-2 pt-3 text-primary">
                    <span>TOTAL PRESUPUESTO</span>
                    <span>{formatCurrency(selectedBudget.totalPresupuesto)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {selectedBudget && (
          <>
            <BudgetItemDialog
              open={itemDialogOpen}
              onOpenChange={setItemDialogOpen}
              onSave={handleSaveItem}
              item={editingItem}
            />
            <PriceDatabaseDialog
              open={priceDbOpen}
              onOpenChange={setPriceDbOpen}
              onSelectPrice={(price) => {
                setEditingItem(undefined)
                setItemDialogOpen(true)
              }}
            />
            
            <BC3ImportDialog
              open={bc3ImportOpen}
              onOpenChange={setBC3ImportOpen}
              onImport={handleBC3Import}
            />
            
            <OnlineDatabaseBrowser
              open={onlineDbOpen}
              onOpenChange={setOnlineDbOpen}
              onImportPrices={handleOnlinePriceImport}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
