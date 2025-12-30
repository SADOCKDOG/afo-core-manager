import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Eye,
  Download,
  FileText,
  Folder,
  FolderOpen,
  MagnifyingGlass,
  SortAscending,
  Funnel,
  Clock,
  CheckCircle,
  Warning,
  TreeStructure,
  FileArrowDown,
  FilePdf,
  Package,
  Tag,
  Calendar,
  User,
  ChartBar,
  X,
  ArrowsClockwise,
  Plus
} from '@phosphor-icons/react'
import { Document, DOCUMENT_TYPE_LABELS, DocumentType, Project } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { formatFileSize, sortVersions } from '@/lib/document-utils'
import { cn } from '@/lib/utils'

interface EnhancedDocumentViewerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  documents: Document[]
  onDocumentSelect?: (document: Document) => void
}

type ViewMode = 'grid' | 'list' | 'tree' | 'timeline' | 'stats'
type SortBy = 'name' | 'date' | 'type' | 'size'
type SortOrder = 'asc' | 'desc'

interface DocumentStats {
  totalDocuments: number
  totalSize: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  byFolder: Record<string, number>
  recentActivity: Document[]
}

export function EnhancedDocumentViewer({
  open,
  onOpenChange,
  project,
  documents,
  onDocumentSelect
}: EnhancedDocumentViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all')
  const [filterFolder, setFilterFolder] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const stats: DocumentStats = useMemo(() => {
    const byType: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    const byFolder: Record<string, number> = {}
    let totalSize = 0

    documents.forEach(doc => {
      const latestVersion = sortVersions(doc.versions)[0]
      totalSize += latestVersion?.fileSize || 0

      byType[DOCUMENT_TYPE_LABELS[doc.type]] = (byType[DOCUMENT_TYPE_LABELS[doc.type]] || 0) + 1
      byStatus[latestVersion?.status || 'draft'] = (byStatus[latestVersion?.status || 'draft'] || 0) + 1
      
      if (doc.folder) {
        byFolder[doc.folder] = (byFolder[doc.folder] || 0) + 1
      }
    })

    const recentActivity = [...documents]
      .sort((a, b) => {
        const latestA = sortVersions(a.versions)[0]
        const latestB = sortVersions(b.versions)[0]
        return (latestB?.uploadedAt || 0) - (latestA?.uploadedAt || 0)
      })
      .slice(0, 10)

    return {
      totalDocuments: documents.length,
      totalSize,
      byType,
      byStatus,
      byFolder,
      recentActivity
    }
  }, [documents])

  const folders = useMemo(() => {
    const folderSet = new Set<string>()
    documents.forEach(doc => {
      if (doc.folder) {
        folderSet.add(doc.folder)
      }
    })
    return Array.from(folderSet).sort()
  }, [documents])

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const latestVersion = sortVersions(doc.versions)[0]
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = doc.name.toLowerCase().includes(query)
        const matchesDescription = doc.metadata.description?.toLowerCase().includes(query)
        const matchesDiscipline = doc.metadata.discipline?.toLowerCase().includes(query)
        
        if (!matchesName && !matchesDescription && !matchesDiscipline) {
          return false
        }
      }

      if (filterType !== 'all' && doc.type !== filterType) {
        return false
      }

      if (filterFolder !== 'all' && doc.folder !== filterFolder) {
        return false
      }

      return true
    })

    filtered.sort((a, b) => {
      const latestA = sortVersions(a.versions)[0]
      const latestB = sortVersions(b.versions)[0]

      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'date':
          comparison = (latestB?.uploadedAt || 0) - (latestA?.uploadedAt || 0)
          break
        case 'type':
          comparison = DOCUMENT_TYPE_LABELS[a.type].localeCompare(DOCUMENT_TYPE_LABELS[b.type])
          break
        case 'size':
          comparison = (latestB?.fileSize || 0) - (latestA?.fileSize || 0)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [documents, searchQuery, filterType, filterFolder, sortBy, sortOrder])

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    if (onDocumentSelect) {
      onDocumentSelect(doc)
    }
  }

  const renderDocumentCard = (doc: Document, index: number) => {
    const latestVersion = sortVersions(doc.versions)[0]
    
    return (
      <motion.div
        key={doc.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.03 }}
      >
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
          onClick={() => handleDocumentClick(doc)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} weight="duotone" className="text-primary flex-shrink-0" />
                  <CardTitle className="text-base truncate">{doc.name}</CardTitle>
                </div>
                {doc.metadata.description && (
                  <CardDescription className="text-sm line-clamp-2">
                    {doc.metadata.description}
                  </CardDescription>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0">
                {DOCUMENT_TYPE_LABELS[doc.type]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {doc.folder && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Folder size={14} />
                <span className="truncate">{doc.folder}</span>
              </div>
            )}
            
            {latestVersion && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{new Date(latestVersion.uploadedAt).toLocaleDateString()}</span>
                </div>
                <span>{formatFileSize(latestVersion.fileSize)}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              {latestVersion?.status === 'approved' && (
                <Badge variant="default" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Aprobado
                </Badge>
              )}
              {latestVersion?.status === 'shared' && (
                <Badge variant="secondary" className="text-xs">
                  <Clock size={12} className="mr-1" />
                  Compartido
                </Badge>
              )}
              {doc.versions.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  v{latestVersion?.version} ({doc.versions.length} versiones)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderDocumentList = (doc: Document, index: number) => {
    const latestVersion = sortVersions(doc.versions)[0]
    
    return (
      <motion.div
        key={doc.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.02 }}
      >
        <div
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all hover:border-primary/50"
          onClick={() => handleDocumentClick(doc)}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <FileText size={24} weight="duotone" className="text-primary flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium truncate">{doc.name}</h4>
                {latestVersion?.status === 'approved' && (
                  <CheckCircle size={16} weight="fill" className="text-green-500 flex-shrink-0" />
                )}
              </div>
              {doc.metadata.description && (
                <p className="text-sm text-muted-foreground truncate">
                  {doc.metadata.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Badge variant="secondary">
              {DOCUMENT_TYPE_LABELS[doc.type]}
            </Badge>
            
            {latestVersion && (
              <div className="text-sm text-muted-foreground text-right">
                <div>{new Date(latestVersion.uploadedAt).toLocaleDateString()}</div>
                <div className="text-xs">{formatFileSize(latestVersion.fileSize)}</div>
              </div>
            )}

            {doc.folder && (
              <div className="text-sm text-muted-foreground max-w-[150px] truncate">
                <Folder size={14} className="inline mr-1" />
                {doc.folder}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-[98vw] max-h-[98vh] h-[98vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2">
                Explorador de Documentos - {project.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                Gestión avanzada de {stats.totalDocuments} documentos • {formatFileSize(stats.totalSize)} total
              </DialogDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileArrowDown size={18} weight="duotone" className="mr-2" />
                Exportar Todo
              </Button>
              <Button variant="default" size="sm">
                <Plus size={18} weight="bold" className="mr-2" />
                Nuevo Documento
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="flex-1 flex flex-col">
            <div className="px-6 py-4 border-b bg-muted/30 space-y-4">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="grid" className="gap-2">
                  <Package size={16} />
                  Cuadrícula
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <FileText size={16} />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="tree" className="gap-2">
                  <TreeStructure size={16} />
                  Árbol
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Calendar size={16} />
                  Línea Tiempo
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <ChartBar size={16} />
                  Estadísticas
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>

                <Select value={filterType} onValueChange={(v) => setFilterType(v as DocumentType | 'all')}>
                  <SelectTrigger className="w-48 h-10">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {folders.length > 0 && (
                  <Select value={filterFolder} onValueChange={setFilterFolder}>
                    <SelectTrigger className="w-48 h-10">
                      <SelectValue placeholder="Carpeta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las carpetas</SelectItem>
                      {folders.map(folder => (
                        <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                  <SelectTrigger className="w-40 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="date">Fecha</SelectItem>
                    <SelectItem value="type">Tipo</SelectItem>
                    <SelectItem value="size">Tamaño</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  <SortAscending size={18} className={cn(
                    "transition-transform",
                    sortOrder === 'desc' && "rotate-180"
                  )} />
                </Button>

                {(searchQuery || filterType !== 'all' || filterFolder !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterType('all')
                      setFilterFolder('all')
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                Mostrando {filteredAndSortedDocuments.length} de {stats.totalDocuments} documentos
              </div>
            </div>

            <TabsContent value="grid" className="flex-1 m-0 p-6 overflow-auto">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {filteredAndSortedDocuments.map((doc, idx) => renderDocumentCard(doc, idx))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <FileText size={64} className="mx-auto text-muted-foreground opacity-50" weight="duotone" />
                      <h3 className="text-lg font-semibold">No se encontraron documentos</h3>
                      <p className="text-muted-foreground">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="list" className="flex-1 m-0 p-6 overflow-auto">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAndSortedDocuments.map((doc, idx) => renderDocumentList(doc, idx))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-3">
                      <FileText size={64} className="mx-auto text-muted-foreground opacity-50" weight="duotone" />
                      <h3 className="text-lg font-semibold">No se encontraron documentos</h3>
                      <p className="text-muted-foreground">
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="tree" className="flex-1 m-0 p-6 overflow-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Vista de Árbol por Carpetas</CardTitle>
                  <CardDescription>
                    Navega por la estructura jerárquica de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {folders.length > 0 ? (
                      folders.map(folder => {
                        const folderDocs = filteredAndSortedDocuments.filter(
                          doc => doc.folder === folder
                        )
                        
                        return (
                          <details key={folder} className="group" open>
                            <summary className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors">
                              <FolderOpen size={20} weight="duotone" className="text-primary" />
                              <span className="font-medium">{folder}</span>
                              <Badge variant="secondary" className="ml-auto">
                                {folderDocs.length}
                              </Badge>
                            </summary>
                            <div className="ml-8 mt-2 space-y-2">
                              {folderDocs.map(doc => (
                                <div
                                  key={doc.id}
                                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                  onClick={() => handleDocumentClick(doc)}
                                >
                                  <FileText size={16} weight="duotone" />
                                  <span className="text-sm flex-1">{doc.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {DOCUMENT_TYPE_LABELS[doc.type]}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </details>
                        )
                      })
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay estructura de carpetas definida
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 m-0 p-6 overflow-auto">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                      Últimas actualizaciones de documentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentActivity.map(doc => {
                        const latestVersion = sortVersions(doc.versions)[0]
                        return (
                          <div 
                            key={doc.id}
                            className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-muted/50 p-3 rounded-lg transition-colors"
                            onClick={() => handleDocumentClick(doc)}
                          >
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <FileText size={20} weight="duotone" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium mb-1">{doc.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {latestVersion && new Date(latestVersion.uploadedAt).toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {DOCUMENT_TYPE_LABELS[doc.type]}
                                </Badge>
                                {doc.folder && (
                                  <Badge variant="outline" className="text-xs">
                                    <Folder size={12} className="mr-1" />
                                    {doc.folder}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="flex-1 m-0 p-6 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Tipo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(stats.byType).map(([type, count]) => {
                      const percentage = (count / stats.totalDocuments) * 100
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{type}</span>
                            <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estado de Documentos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(stats.byStatus).map(([status, count]) => {
                      const percentage = (count / stats.totalDocuments) * 100
                      const statusLabels: Record<string, string> = {
                        draft: 'Borrador',
                        review: 'En Revisión',
                        approved: 'Aprobado',
                        archived: 'Archivado'
                      }
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{statusLabels[status] || status}</span>
                            <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {folders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Documentos por Carpeta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(stats.byFolder).map(([folder, count]) => {
                        const percentage = (count / stats.totalDocuments) * 100
                        return (
                          <div key={folder} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium truncate flex-1">{folder}</span>
                              <span className="text-muted-foreground ml-2">{count} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Resumen General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">Total Documentos</span>
                      <span className="text-2xl font-bold">{stats.totalDocuments}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">Tamaño Total</span>
                      <span className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">Tamaño Promedio</span>
                      <span className="text-lg font-semibold">
                        {formatFileSize(stats.totalSize / stats.totalDocuments)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Tipos de Documento</span>
                      <span className="text-lg font-semibold">{Object.keys(stats.byType).length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredAndSortedDocuments.length} documentos mostrados
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
