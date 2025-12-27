import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Document, Project, FOLDER_STRUCTURES, DOCUMENT_TYPE_LABELS } from '@/lib/types'
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
  TreeStructure
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { DocumentUploadDialog } from './DocumentUploadDialog'
import { DocumentVersionDialog } from './DocumentVersionDialog'
import { FolderStructureDialog } from './FolderStructureDialog'
import { formatFileSize, sortVersions } from '@/lib/document-utils'

interface DocumentManagerProps {
  project: Project
  onProjectUpdate: (project: Partial<Project>) => void
}

export function DocumentManager({ project, onProjectUpdate }: DocumentManagerProps) {
  const [documents, setDocuments] = useKV<Document[]>('documents', [])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [versionDialogOpen, setVersionDialogOpen] = useState(false)
  const [structureDialogOpen, setStructureDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  
  const projectDocuments = (documents || []).filter(doc => doc.projectId === project.id)
  
  const folderStructure = project.folderStructure 
    ? FOLDER_STRUCTURES[project.folderStructure] 
    : null

  const folders = folderStructure?.folders || []
  
  const filteredDocuments = selectedFolder === 'all'
    ? projectDocuments
    : projectDocuments.filter(doc => doc.folder === selectedFolder)

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setVersionDialogOpen(true)
  }

  const handleSetupStructure = () => {
    setStructureDialogOpen(true)
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
            Estructura: {folderStructure?.name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSetupStructure} className="gap-2">
            <TreeStructure size={18} weight="duotone" />
            Cambiar Estructura
          </Button>
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Plus size={18} weight="bold" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      <Tabs value={selectedFolder} onValueChange={setSelectedFolder}>
        <ScrollArea className="w-full">
          <TabsList className="inline-flex">
            <TabsTrigger value="all">
              Todos ({projectDocuments.length})
            </TabsTrigger>
            {folders.map(folder => {
              const count = projectDocuments.filter(doc => doc.folder === folder).length
              return (
                <TabsTrigger key={folder} value={folder}>
                  {folder} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>
        </ScrollArea>

        <TabsContent value={selectedFolder} className="mt-6">
          {filteredDocuments.length > 0 ? (
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
                                <p className="text-sm text-muted-foreground">
                                  {DOCUMENT_TYPE_LABELS[doc.type]}
                                </p>
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
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <FolderOpen size={48} className="text-muted-foreground" weight="duotone" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay documentos</h3>
              <p className="text-muted-foreground mb-6">
                {selectedFolder === 'all' 
                  ? 'Comience subiendo su primer documento al proyecto'
                  : `No hay documentos en la carpeta ${selectedFolder}`
                }
              </p>
              <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
                <Plus size={18} weight="bold" />
                Subir Documento
              </Button>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

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
    </div>
  )
}
