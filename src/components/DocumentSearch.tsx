import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  MagnifyingGlass, 
  Funnel, 
  X,
  SlidersHorizontal 
} from '@phosphor-icons/react'
import { DocumentType, DocumentStatus, DOCUMENT_TYPE_LABELS } from '@/lib/types'

export interface DocumentFilters {
  searchQuery: string
  type: DocumentType | 'all'
  status: DocumentStatus | 'all'
  discipline: string | 'all'
  folder: string | 'all'
}

interface DocumentSearchProps {
  filters: DocumentFilters
  onFiltersChange: (filters: DocumentFilters) => void
  availableFolders: string[]
  availableDisciplines: string[]
  documentCount: number
  filteredCount: number
}

export function DocumentSearch({
  filters,
  onFiltersChange,
  availableFolders,
  availableDisciplines,
  documentCount,
  filteredCount
}: DocumentSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const hasActiveFilters = 
    filters.type !== 'all' ||
    filters.status !== 'all' ||
    filters.discipline !== 'all' ||
    filters.folder !== 'all' ||
    filters.searchQuery !== ''

  const activeFilterCount = [
    filters.type !== 'all',
    filters.status !== 'all',
    filters.discipline !== 'all',
    filters.folder !== 'all',
    filters.searchQuery !== ''
  ].filter(Boolean).length

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      type: 'all',
      status: 'all',
      discipline: 'all',
      folder: 'all'
    })
  }

  const handleRemoveFilter = (filterKey: keyof DocumentFilters) => {
    onFiltersChange({
      ...filters,
      [filterKey]: filterKey === 'searchQuery' ? '' : 'all'
    })
  }

  const statusLabels: Record<DocumentStatus | 'all', string> = {
    all: 'Todos',
    draft: 'Borrador',
    shared: 'Compartido',
    approved: 'Aprobado'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Buscar documentos por nombre, descripción o disciplina..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="pl-10 pr-10"
          />
          {filters.searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
            >
              <X size={16} />
            </Button>
          )}
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 relative">
              <Funnel size={18} weight={hasActiveFilters ? 'fill' : 'regular'} />
              Filtros
              {activeFilterCount > 0 && (
                <Badge 
                  variant="default" 
                  className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filtros avanzados</h4>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearFilters}
                    className="h-8 text-xs"
                  >
                    Limpiar todo
                  </Button>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="type-filter" className="text-xs font-medium">
                    Tipo de documento
                  </Label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => onFiltersChange({ ...filters, type: value as DocumentType | 'all' })}
                  >
                    <SelectTrigger id="type-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <Separator className="my-1" />
                      {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-filter" className="text-xs font-medium">
                    Estado
                  </Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => onFiltersChange({ ...filters, status: value as DocumentStatus | 'all' })}
                  >
                    <SelectTrigger id="status-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {availableDisciplines.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="discipline-filter" className="text-xs font-medium">
                      Disciplina
                    </Label>
                    <Select 
                      value={filters.discipline} 
                      onValueChange={(value) => onFiltersChange({ ...filters, discipline: value })}
                    >
                      <SelectTrigger id="discipline-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las disciplinas</SelectItem>
                        <Separator className="my-1" />
                        {availableDisciplines.map((discipline) => (
                          <SelectItem key={discipline} value={discipline}>
                            {discipline}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {availableFolders.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="folder-filter" className="text-xs font-medium">
                      Carpeta
                    </Label>
                    <Select 
                      value={filters.folder} 
                      onValueChange={(value) => onFiltersChange({ ...filters, folder: value })}
                    >
                      <SelectTrigger id="folder-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las carpetas</SelectItem>
                        <Separator className="my-1" />
                        {availableFolders.map((folder) => (
                          <SelectItem key={folder} value={folder}>
                            {folder}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Mostrando {filteredCount} de {documentCount} documentos
                </span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClearFilters}
            className="shrink-0"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              <span className="text-xs">Búsqueda: {filters.searchQuery}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter('searchQuery')}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              <span className="text-xs">Tipo: {DOCUMENT_TYPE_LABELS[filters.type]}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter('type')}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              <span className="text-xs">Estado: {statusLabels[filters.status]}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter('status')}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.discipline !== 'all' && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              <span className="text-xs">Disciplina: {filters.discipline}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter('discipline')}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
          {filters.folder !== 'all' && (
            <Badge variant="secondary" className="gap-1.5 pl-2 pr-1">
              <span className="text-xs">Carpeta: {filters.folder}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter('folder')}
              >
                <X size={12} />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
