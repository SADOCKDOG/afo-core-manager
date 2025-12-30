import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Document, Project, FOLDER_STRUCTURES, DOCUMENT_TYPE_LABELS, DocumentTemplate, Stakeholder } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FolderOpen, 
  File, 
  Plus, 
  Clock, 
  CheckCircle, 
  ShareNetwork,
  Folder,
  TreeStructure,
  FileText,
  Wrench,
  Table,
  ChartBar
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DocumentUploadDialog } from './DocumentUploadDialog'
import { DocumentVersionDialog } from './DocumentVersionDialog'
import { FolderStructureDialog } from './FolderStructureDialog'
import { DocumentSearch, DocumentFilters } from './DocumentSearch'
import { BulkDocumentUpload } from './BulkDocumentUpload'
import { DocumentTemplateWithAI } from './DocumentTemplateWithAI'
import { DocumentUtilities } from './DocumentUtilities'
import { DocumentGeneratorHub } from './DocumentGeneratorHub'
import { formatFileSize, sortVersions } from '@/lib/document-utils'
import { toast } from 'sonner'
import { PHASE_LABELS } from '@/lib/types'

interface DocumentManagerProps {
  project: Project
  stakeholders?: Stakeholder[]
  onProjectUpdate: (project: Partial<Project>) => void
}

export function DocumentManager({ project, stakeholders, onProjectUpdate }: DocumentManagerProps) {
  const [documents, setDocuments] = useKV<Document[]>('documents', [])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [versionDialogOpen, setVersionDialogOpen] = useState(false)
  const [structureDialogOpen, setStructureDialogOpen] = useState(false)
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [generatorHubOpen, setGeneratorHubOpen] = useState(false)
  const [utilitiesDialogOpen, setUtilitiesDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'folders' | 'stats'>('list')
  const [filters, setFilters] = useState<DocumentFilters>({
    searchQuery: '',
    type: 'all',
    status: 'all',
    discipline: 'all',
    folder: 'all'
  })
  
  const projectDocuments = (documents || []).filter(doc => doc.projectId === project.id)
  
  const folderStructure = project.folderStructure 
    ? FOLDER_STRUCTURES[project.folderStructure] 
    : null

  const folders = folderStructure?.folders || []
  
  const availableDisciplines = useMemo(() => {
    const disciplines = new Set<string>()
    projectDocuments.forEach(doc => {
      if (doc.metadata.discipline) {
        disciplines.add(doc.metadata.discipline)
      }
    })
    return Array.from(disciplines).sort()
  }, [projectDocuments])

  const filteredDocuments = useMemo(() => {
    return projectDocuments.filter(doc => {
      const latestVersion = sortVersions(doc.versions)[0]
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = doc.name.toLowerCase().includes(query)
        const matchesDescription = doc.metadata.description?.toLowerCase().includes(query)
        const matchesDiscipline = doc.metadata.discipline?.toLowerCase().includes(query)
        const matchesType = DOCUMENT_TYPE_LABELS[doc.type].toLowerCase().includes(query)
        
        if (!matchesName && !matchesDescription && !matchesDiscipline && !matchesType) {
          return false
        }
      }
      
      if (filters.type !== 'all' && doc.type !== filters.type) {
        return false
      }
      
      if (filters.status !== 'all' && latestVersion.status !== filters.status) {
        return false
      }
      
      if (filters.discipline !== 'all' && doc.metadata.discipline !== filters.discipline) {
        return false
      }
      
      if (filters.folder !== 'all' && doc.folder !== filters.folder) {
        return false
      }
      
      return true
    })
  }, [projectDocuments, filters])

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setVersionDialogOpen(true)
  }

  const handleSetupStructure = () => {
    setStructureDialogOpen(true)
  }

  const handleTemplateSelect = (template: DocumentTemplate, customFields: Record<string, string>, customSections: Record<string, string>) => {
    let content = ''
    
    template.sections.forEach((section) => {
      let sectionContent = customSections[section.id] || section.content
      
      Object.entries(customFields).forEach(([key, value]) => {
        const placeholder = `[${key.toUpperCase()}]`
        sectionContent = sectionContent.replace(new RegExp(placeholder, 'g'), value)
      })
      
      content += `${section.title}\n\n${sectionContent}\n\n\n`
    })

    const newDocument: Document = {
      id: Date.now().toString(),
      projectId: project.id,
      name: template.name,
      type: template.type,
      folder: template.folder || folders[0] || '',
      currentVersion: 'P01',
      versions: [
        {
          id: `${Date.now()}-v1`,
          version: 'P01',
          fileName: `${template.name.replace(/\s+/g, '_')}_P01.txt`,
          fileSize: new Blob([content]).size,
          uploadedAt: Date.now(),
          uploadedBy: 'Usuario',
          status: 'draft',
          notes: `Documento generado desde plantilla con IA: ${template.name}`
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      metadata: {
        discipline: template.discipline,
        description: template.description,
        format: 'text/plain',
        application: 'AFO CORE MANAGER - Plantillas IA'
      }
    }

    setDocuments((currentDocs) => [...(currentDocs || []), newDocument])
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name.replace(/\s+/g, '_')}_P01.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    const hasAIContent = Object.keys(customSections).length > 0
    toast.success(
      hasAIContent 
        ? `Documento generado con ${Object.keys(customSections).length} sección${Object.keys(customSections).length !== 1 ? 'es' : ''} personalizada${Object.keys(customSections).length !== 1 ? 's' : ''} por IA`
        : 'Documento generado desde plantilla'
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} weight="fill" className="text-primary" />
      case 'shared':
        return <ShareNetwork size={16} weight="duotone" className="text-accent" />
      default:
        return <Clock size={16} weight="duotone" className="text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado'
      case 'shared':
        return 'Compartido'
      default:
        return 'Borrador'
    }
  }

  const getDocumentsByFolder = () => {
    const grouped = new Map<string, Document[]>()
    
    folders.forEach(folder => {
      grouped.set(folder, [])
    })
    
    projectDocuments.forEach(doc => {
      if (grouped.has(doc.folder)) {
        grouped.get(doc.folder)!.push(doc)
      } else {
        grouped.set(doc.folder, [doc])
      }
    })
    
    return grouped
  }

  if (!project.folderStructure) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="inline-flex p-6 rounded-full bg-primary/10 mb-6">
          <TreeStructure size={64} className="text-primary" weight="duotone" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Configurar Estructura de Carpetas</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Antes de comenzar a gestionar documentos, seleccione el tipo de estructura de carpetas
          que mejor se adapte a su metodología de trabajo.
        </p>
        <Button size="lg" onClick={handleSetupStructure} className="gap-2">
          <Folder size={20} weight="duotone" />
          Configurar Estructura
        </Button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Por Tipo de Archivo</CardTitle>
              <CardDescription>Organización clásica y intuitiva</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Planos</li>
                <li>• Memorias</li>
                <li>• Presupuestos</li>
                <li>• Imágenes</li>
                <li>• Modelos 3D</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Arquitectura de Gritos</CardTitle>
              <CardDescription>Organización por función del proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Componentes</li>
                <li>• Servicios</li>
                <li>• Modelos</li>
                <li>• Documentación</li>
                <li>• Presentación</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <FolderStructureDialog
          open={structureDialogOpen}
          onOpenChange={setStructureDialogOpen}
          onSelect={(type) => {
            onProjectUpdate({ folderStructure: type })
            setStructureDialogOpen(false)
          }}
        />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestor de Documentos</h2>
          <p className="text-muted-foreground">
            Estructura: {folderStructure?.name} • {projectDocuments.length} documentos
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setUtilitiesDialogOpen(true)} 
            className="gap-2"
          >
            <Wrench size={18} weight="duotone" />
            Utilidades
          </Button>
          <Button variant="outline" onClick={handleSetupStructure} className="gap-2">
            <TreeStructure size={18} weight="duotone" />
            Cambiar Estructura
          </Button>
          <Button 
            variant="default" 
            onClick={() => setGeneratorHubOpen(true)} 
            className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
          >
            <FileText size={18} weight="duotone" />
            Hub de Generación
          </Button>
          <Button variant="outline" onClick={() => setBulkUploadOpen(true)} className="gap-2">
            <Plus size={18} weight="bold" />
            Subida Masiva
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus size={18} weight="bold" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      <DocumentSearch
        filters={filters}
        onFiltersChange={setFilters}
        availableFolders={folders}
        availableDisciplines={availableDisciplines}
        documentCount={projectDocuments.length}
        filteredCount={filteredDocuments.length}
      />

      <Card className="border-primary/20 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <File size={16} />
                Lista
              </Button>
              <Button
                variant={viewMode === 'folders' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('folders')}
                className="gap-2"
              >
                <Folder size={16} />
                Por Carpeta
              </Button>
              <Button
                variant={viewMode === 'stats' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('stats')}
                className="gap-2"
              >
                <ChartBar size={16} />
                Estadísticas
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Clock size={12} />
                  {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'draft').length} Borradores
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <ShareNetwork size={12} />
                  {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'shared').length} Compartidos
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <CheckCircle size={12} />
                  {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'approved').length} Aprobados
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length > 0 ? (
        <>
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 gap-4">
              {filteredDocuments.map((doc, index) => {
                const latestVersion = sortVersions(doc.versions)[0]
                return (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md hover:border-accent/50 transition-all"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                            <File size={24} weight="duotone" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">{doc.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{DOCUMENT_TYPE_LABELS[doc.type]}</span>
                                  {doc.metadata.discipline && (
                                    <>
                                      <span>•</span>
                                      <span>{doc.metadata.discipline}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span className="text-xs">{doc.folder}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {getStatusIcon(latestVersion.status)}
                                <Badge variant="outline">
                                  {latestVersion.version}
                                </Badge>
                              </div>
                            </div>
                            
                            {doc.metadata.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {doc.metadata.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{doc.versions.length} versiones</span>
                              <span>•</span>
                              <span>{formatFileSize(latestVersion.fileSize)}</span>
                              <span>•</span>
                              <span>
                                {new Date(latestVersion.uploadedAt).toLocaleDateString('es-ES')}
                              </span>
                              {doc.metadata.format && (
                                <>
                                  <span>•</span>
                                  <span className="uppercase">{doc.metadata.format}</span>
                                </>
                              )}
                              <span className="ml-auto">
                                {getStatusLabel(latestVersion.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}

          {viewMode === 'folders' && (
            <div className="space-y-6">
              {folders.map((folder) => {
                const folderDocs = filteredDocuments.filter(d => d.folder === folder)
                if (folderDocs.length === 0) return null
                
                return (
                  <div key={folder} className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Folder size={20} weight="duotone" className="text-primary" />
                      {folder}
                      <Badge variant="secondary" className="ml-2">
                        {folderDocs.length}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-6">
                      {folderDocs.map((doc) => {
                        const latestVersion = sortVersions(doc.versions)[0]
                        return (
                          <Card 
                            key={doc.id}
                            className="cursor-pointer hover:shadow-md hover:border-accent/50 transition-all"
                            onClick={() => handleDocumentClick(doc)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <File size={20} weight="duotone" className="text-primary shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {DOCUMENT_TYPE_LABELS[doc.type]}
                                  </p>
                                </div>
                                {getStatusIcon(latestVersion.status)}
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{latestVersion.version}</span>
                                <span>{formatFileSize(latestVersion.fileSize)}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {viewMode === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por Tipo de Documento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => {
                    const count = projectDocuments.filter(d => d.type === type).length
                    if (count === 0) return null
                    return (
                      <div key={type} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Por Estado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock size={14} />
                      Borradores
                    </span>
                    <Badge variant="secondary">
                      {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'draft').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShareNetwork size={14} />
                      Compartidos
                    </span>
                    <Badge variant="secondary">
                      {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'shared').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <CheckCircle size={14} />
                      Aprobados
                    </span>
                    <Badge variant="secondary">
                      {projectDocuments.filter(d => sortVersions(d.versions)[0].status === 'approved').length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Documentos</span>
                    <Badge variant="secondary">{projectDocuments.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Versiones</span>
                    <Badge variant="secondary">
                      {projectDocuments.reduce((acc, doc) => acc + doc.versions.length, 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tamaño Total</span>
                    <Badge variant="secondary">
                      {formatFileSize(
                        projectDocuments.reduce((acc, doc) => 
                          acc + sortVersions(doc.versions)[0].fileSize, 0
                        )
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Disciplinas Únicas</span>
                    <Badge variant="secondary">{availableDisciplines.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex p-4 rounded-full bg-muted mb-4">
            <FolderOpen size={48} className="text-muted-foreground" weight="duotone" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {projectDocuments.length === 0 
              ? 'No hay documentos' 
              : 'No se encontraron documentos'
            }
          </h3>
          <p className="text-muted-foreground mb-6">
            {projectDocuments.length === 0
              ? 'Comience subiendo su primer documento al proyecto'
              : 'Intente ajustar los filtros de búsqueda'
            }
          </p>
          {projectDocuments.length === 0 && (
            <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
              <Plus size={18} weight="bold" />
              Subir Documento
            </Button>
          )}
        </motion.div>
      )}

      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        project={project}
        folders={folders}
        onUpload={(docData) => {
          setDocuments(current => [...(current || []), docData])
          setUploadDialogOpen(false)
        }}
      />

      <BulkDocumentUpload
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        project={project}
        folders={folders}
        onUpload={(docDataArray) => {
          setDocuments(current => [...(current || []), ...docDataArray])
        }}
      />

      {selectedDocument && (
        <DocumentVersionDialog
          open={versionDialogOpen}
          onOpenChange={setVersionDialogOpen}
          document={selectedDocument}
          onUpdate={(updated) => {
            setDocuments(current => 
              (current || []).map(doc => doc.id === updated.id ? updated : doc)
            )
            setSelectedDocument(updated)
          }}
        />
      )}

      <FolderStructureDialog
        open={structureDialogOpen}
        onOpenChange={setStructureDialogOpen}
        currentStructure={project.folderStructure}
        onSelect={(type) => {
          onProjectUpdate({ folderStructure: type })
          setStructureDialogOpen(false)
        }}
      />

      <DocumentGeneratorHub
        open={generatorHubOpen}
        onOpenChange={setGeneratorHubOpen}
        project={project}
        stakeholders={stakeholders}
        onGenerateFromTemplate={handleTemplateSelect}
      />

      <DocumentTemplateWithAI
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleTemplateSelect}
        project={project}
        stakeholders={stakeholders}
        projectContext={{
          title: project.title,
          location: project.location,
          description: project.description,
          phase: project.phases.length > 0 
            ? PHASE_LABELS[project.phases[0].phase] 
            : undefined
        }}
      />

      <DocumentUtilities
        open={utilitiesDialogOpen}
        onOpenChange={setUtilitiesDialogOpen}
      />
    </div>
  )
}
