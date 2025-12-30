import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Stakeholder, Invoice, Client, Budget, ProjectMilestone, ArchitectProfile, Document } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dashboard } from '@/components/Dashboard'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectDialog } from '@/components/ProjectDialog'
import { ProjectDetail } from '@/components/ProjectDetail'
import { StakeholderDialog } from '@/components/StakeholderDialog'
import { AIRegulatoryAssistant } from '@/components/AIRegulatoryAssistant'
import { MunicipalComplianceManager } from '@/components/MunicipalComplianceManager'
import { VisaManager } from '@/components/VisaManager'
import { InvoiceManager } from '@/components/InvoiceManager'
import { EmailConfigDialog } from '@/components/EmailConfigDialog'
import { EmailLogsDialog } from '@/components/EmailLogsDialog'
import { ProjectImportDialog } from '@/components/ProjectImportDialog'
import { BulkProjectImportDialog } from '@/components/BulkProjectImportDialog'
import { BulkProjectExportDialog } from '@/components/BulkProjectExportDialog'
import { ClientManager } from '@/components/ClientManager'
import { BillingManager } from '@/components/BillingManager'
import { AutoInvoiceConfirmDialog } from '@/components/AutoInvoiceConfirmDialog'
import { DocumentTemplateLibrary } from '@/components/DocumentTemplateLibrary'
import { BoardPermitWorkflow } from '@/components/BoardPermitWorkflow'
import { ProjectCalendar } from '@/components/ProjectCalendar'
import { ApprovalFlowManager } from '@/components/ApprovalFlowManager'
import { QualifiedSignatureProviderManager } from '@/components/QualifiedSignatureProviderManager'
import { QualifiedSignatureRequestViewer } from '@/components/QualifiedSignatureRequestViewer'
import { UserManual } from '@/components/UserManual'
import { DeveloperManual } from '@/components/DeveloperManual'
import { ComponentRegistry } from '@/components/ComponentRegistry'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ArchitectProfileEditor } from '@/components/ArchitectProfileEditor'
import { DeleteAllDataDialog } from '@/components/DeleteAllDataDialog'
import { SelectiveDeleteDialog } from '@/components/SelectiveDeleteDialog'
import { BackupRestoreDialog } from '@/components/BackupRestoreDialog'
import { BC3ImportDialog } from '@/components/BC3ImportDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Buildings, 
  Users, 
  BookOpen, 
  Gear, 
  EnvelopeSimple, 
  ClockCounterClockwise, 
  Upload, 
  FolderOpen, 
  DownloadSimple, 
  Plus,
  SquaresFour,
  Folders,
  Receipt,
  UsersThree,
  DotsThreeVertical,
  Stamp,
  FileText,
  Sparkle,
  Bank,
  CalendarBlank,
  Question,
  UserCircle,
  Trash,
  FloppyDisk,
  FileArrowDown
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { useEmailConfig } from '@/lib/email-service'
import { generatePhaseCompletionInvoice } from '@/lib/invoice-utils'
import { PHASE_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

type ViewMode = 'dashboard' | 'projects' | 'clients' | 'invoices' | 'calendar' | 'project-detail'
type ProjectFilter = 'all' | 'active' | 'archived'

function App() {
  const [architectProfile, setArchitectProfile, deleteArchitectProfile] = useKV<ArchitectProfile | null>('architect-profile', null)
  const [projects, setProjects, deleteProjects] = useKV<Project[] | null>('projects', null)
  const [stakeholders, setStakeholders, deleteStakeholders] = useKV<Stakeholder[] | null>('stakeholders', null)
  const [invoices, setInvoices, deleteInvoices] = useKV<Invoice[] | null>('invoices', null)
  const [clients, setClients, deleteClients] = useKV<Client[] | null>('clients', null)
  const [budgets, setBudgets, deleteBudgets] = useKV<Budget[] | null>('budgets', null)
  const [milestones, setMilestones, deleteMilestones] = useKV<ProjectMilestone[] | null>('project-milestones', null)
  const [documents, setDocuments, deleteDocuments] = useKV<Document[] | null>('project-documents', null)
  const { isConfigured } = useEmailConfig()
  
  const [isInitialized, setIsInitialized] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false)
  const [emailConfigDialogOpen, setEmailConfigDialogOpen] = useState(false)
  const [emailLogsDialogOpen, setEmailLogsDialogOpen] = useState(false)
  const [projectImportDialogOpen, setProjectImportDialogOpen] = useState(false)
  const [bulkProjectImportDialogOpen, setBulkProjectImportDialogOpen] = useState(false)
  const [bulkProjectExportDialogOpen, setBulkProjectExportDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [autoInvoiceDialogOpen, setAutoInvoiceDialogOpen] = useState(false)
  const [selectiveDeleteDialogOpen, setSelectiveDeleteDialogOpen] = useState(false)
  const [pendingInvoiceData, setPendingInvoiceData] = useState<{
    invoiceData: Partial<Invoice>
    projectTitle: string
    phaseLabel: string
    client?: Client
    projectBudget?: Budget
  } | null>(null)

  useEffect(() => {
    if (architectProfile) {
      setIsInitialized(true)
      document.title = architectProfile.razonSocial || architectProfile.nombreCompleto || 'AFO CORE MANAGER'
    }
  }, [architectProfile])

  const handleWelcomeComplete = (profileData: Omit<ArchitectProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProfile: ArchitectProfile = {
      ...profileData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    setArchitectProfile(newProfile)
    setIsInitialized(true)
    toast.success('¡Bienvenido a AFO CORE MANAGER!', {
      description: 'Tu perfil ha sido configurado correctamente'
    })
  }

  const handleProfileUpdate = (updatedProfile: ArchitectProfile) => {
    setArchitectProfile(updatedProfile)
  }

  const handleDeleteAllData = async () => {
    try {
      const allKeys = await spark.kv.keys()
      console.log('Claves antes de eliminar:', allKeys)
      
      for (const key of allKeys) {
        await spark.kv.delete(key)
        console.log(`Clave eliminada: ${key}`)
      }
      
      const remainingKeys = await spark.kv.keys()
      console.log('Claves después de eliminar:', remainingKeys)
      
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Error al eliminar datos:', error)
      toast.error('Error al eliminar los datos', {
        description: 'Por favor, intenta de nuevo'
      })
    }
  }

  if (!isInitialized) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  const filteredProjects = (projects || []).filter(project => {
    if (projectFilter === 'all') return true
    if (projectFilter === 'active') return project.status === 'active'
    if (projectFilter === 'archived') return project.status === 'archived'
    return true
  })

  const handleSaveProject = (projectData: Partial<Project>) => {
    setProjects(currentProjects => {
      const projectsList = currentProjects || []
      if (projectData.id) {
        const updated = projectsList.map(p => 
          p.id === projectData.id 
            ? { ...p, ...projectData, updatedAt: Date.now() } as Project
            : p
        )
        
        if (selectedProject?.id === projectData.id) {
          const updatedProject = updated.find(p => p.id === projectData.id)
          if (updatedProject) {
            setSelectedProject(updatedProject)
          }
        }
        
        return updated
      } else {
        const newProject: Project = {
          id: Date.now().toString(),
          title: projectData.title!,
          description: projectData.description,
          location: projectData.location!,
          clientId: projectData.clientId!,
          status: projectData.status || 'active',
          phases: projectData.phases || [],
          stakeholders: projectData.stakeholders || [],
          folderStructure: projectData.folderStructure,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        toast.success('Proyecto creado correctamente')
        return [...projectsList, newProject]
      }
    })
    
    if (projectData.id) {
      toast.success('Proyecto actualizado correctamente')
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(currentProjects => (currentProjects || []).filter(p => p.id !== projectId))
    
    setDocuments(currentDocs => (currentDocs || []).filter(d => d.projectId !== projectId))
    setBudgets(currentBudgets => (currentBudgets || []).filter(b => b.projectId !== projectId))
    setMilestones(currentMilestones => (currentMilestones || []).filter(m => m.projectId !== projectId))
    setInvoices(currentInvoices => (currentInvoices || []).filter(i => i.projectId !== projectId))
    
    if (selectedProject?.id === projectId) {
      setSelectedProject(null)
      setViewMode('projects')
    }
  }

  const handleImportComplete = (importData: {
    title: string
    location: string
    clientId: string
    folderStructure: any
    documents: any[]
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: importData.title,
      location: importData.location,
      clientId: importData.clientId,
      status: 'active',
      phases: [],
      stakeholders: [],
      folderStructure: importData.folderStructure,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setProjects(currentProjects => [...(currentProjects || []), newProject])
    
    const documentsWithCorrectProjectId = importData.documents.map(doc => ({
      ...doc,
      projectId: newProject.id
    }))
    
    setDocuments(currentDocs => [...(currentDocs || []), ...documentsWithCorrectProjectId])
    
    toast.success(`Proyecto "${importData.title}" importado con ${importData.documents.length} documentos`, {
      description: 'Los documentos han sido clasificados y organizados automáticamente'
    })
  }

  const handleBulkImportComplete = (importedProjects: Array<{
    title: string
    location: string
    clientId: string
    folderStructure: any
    documents: any[]
  }>) => {
    const newProjects: Project[] = importedProjects.map(importData => ({
      id: `${Date.now()}-${Math.random()}`,
      title: importData.title,
      location: importData.location,
      clientId: importData.clientId,
      status: 'active',
      phases: [],
      stakeholders: [],
      folderStructure: importData.folderStructure,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }))

    setProjects(currentProjects => [...(currentProjects || []), ...newProjects])
    
    const allDocuments: Document[] = []
    importedProjects.forEach((importData, index) => {
      const projectId = newProjects[index].id
      const documentsWithCorrectProjectId = importData.documents.map(doc => ({
        ...doc,
        projectId
      }))
      allDocuments.push(...documentsWithCorrectProjectId)
    })
    
    setDocuments(currentDocs => [...(currentDocs || []), ...allDocuments])
    
    toast.success(`${newProjects.length} proyectos importados con ${allDocuments.length} documentos totales`, {
      description: 'Todos los documentos han sido clasificados y organizados automáticamente'
    })
  }

  const handleSaveStakeholder = (stakeholderData: Partial<Stakeholder>) => {
    setStakeholders(currentStakeholders => {
      const stakeholdersList = currentStakeholders || []
      if (stakeholderData.id) {
        return stakeholdersList.map(s => 
          s.id === stakeholderData.id 
            ? { ...s, ...stakeholderData } as Stakeholder
            : s
        )
      } else {
        const newStakeholder: Stakeholder = {
          id: Date.now().toString(),
          type: stakeholderData.type!,
          nif: stakeholderData.nif!,
          name: stakeholderData.name!,
          address: stakeholderData.address,
          email: stakeholderData.email,
          phone: stakeholderData.phone,
          collegiateNumber: stakeholderData.collegiateNumber,
          qualification: stakeholderData.qualification
        }
        toast.success('Interviniente añadido correctamente')
        return [...stakeholdersList, newStakeholder]
      }
    })
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setViewMode('project-detail')
  }

  const handleBackToDashboard = () => {
    setViewMode('dashboard')
    setSelectedProject(null)
  }

  const handleBackToProjects = () => {
    setViewMode('projects')
    setSelectedProject(null)
  }

  const handleEditProject = () => {
    if (selectedProject) {
      setEditingProject(selectedProject)
      setProjectDialogOpen(true)
    }
  }

  const handleUpdatePhaseStatus = (phaseIndex: number, status: 'pending' | 'in-progress' | 'completed') => {
    if (!selectedProject) return
    
    const phase = selectedProject.phases[phaseIndex]
    const wasNotCompleted = phase.status !== 'completed'
    const isNowCompleted = status === 'completed'
    
    const updatedProject = {
      ...selectedProject,
      phases: selectedProject.phases.map((phase, idx) => 
        idx === phaseIndex ? { ...phase, status } : phase
      ),
      updatedAt: Date.now()
    }
    
    setProjects(currentProjects => 
      (currentProjects || []).map(p => p.id === selectedProject.id ? updatedProject : p)
    )
    setSelectedProject(updatedProject)
    toast.success('Estado de la fase actualizado')
    
    if (wasNotCompleted && isNowCompleted) {
      const projectClient = (clients || []).find(c => c.id === selectedProject.clientId)
      const projectBudget = (budgets || []).find(b => b.projectId === selectedProject.id && b.status === 'approved')
      
      const phaseLabel = PHASE_LABELS[phase.phase]
      
      const invoiceData = generatePhaseCompletionInvoice(
        selectedProject.id,
        selectedProject.title,
        {
          phase: phase.phase,
          percentage: phase.percentage,
          phaseLabel
        },
        projectClient?.razonSocial || projectClient?.nombre || 'Cliente',
        projectClient?.nif || '',
        projectClient?.direccion,
        projectBudget?.totalPEM,
        projectClient,
        architectProfile
      )
      
      setPendingInvoiceData({
        invoiceData,
        projectTitle: selectedProject.title,
        phaseLabel,
        client: projectClient,
        projectBudget
      })
      
      setAutoInvoiceDialogOpen(true)
    }
  }

  const handleConfirmAutoInvoice = (invoiceData: Partial<Invoice>, issueImmediately: boolean) => {
    const finalInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      status: issueImmediately ? 'issued' : 'draft',
      taxRate: invoiceData.taxRate || 21
    } as Invoice
    
    setInvoices(currentInvoices => [...(currentInvoices || []), finalInvoice])
    
    toast.success(
      issueImmediately ? 'Factura generada y emitida correctamente' : 'Factura guardada como borrador',
      {
        description: `Número de factura: ${finalInvoice.invoiceNumber}`
      }
    )
    
    setPendingInvoiceData(null)
  }

  const handleCancelAutoInvoice = () => {
    toast.info('Factura no generada', {
      description: 'Puedes crear la factura manualmente desde el gestor de facturas'
    })
    setPendingInvoiceData(null)
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: SquaresFour },
    { id: 'projects', label: 'Proyectos', icon: Buildings },
    { id: 'calendar', label: 'Calendario', icon: CalendarBlank },
    { id: 'clients', label: 'Clientes', icon: UsersThree },
    { id: 'invoices', label: 'Facturas', icon: Receipt },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/20 text-primary ring-2 ring-primary/30 overflow-hidden">
                  {architectProfile?.logo ? (
                    <img 
                      src={architectProfile.logo} 
                      alt="Logo" 
                      className="w-7 h-7 object-contain"
                    />
                  ) : (
                    <Buildings size={28} weight="duotone" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {architectProfile?.razonSocial || 'AFO CORE MANAGER'}
                  </h1>
                  <p className="text-xs text-muted-foreground">Gestión Integral Arquitectónica</p>
                </div>
              </div>

              <nav className="hidden lg:flex items-center gap-2 ml-8">
                {navItems.map(item => (
                  <Button
                    key={item.id}
                    variant={viewMode === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(item.id as ViewMode)}
                    className={cn(
                      "gap-2 transition-all",
                      viewMode === item.id && "shadow-md"
                    )}
                  >
                    <item.icon size={18} weight={viewMode === item.id ? 'fill' : 'regular'} />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <ComponentRegistry />
              <UserManual />
              <DeveloperManual />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hidden md:flex">
                    <DotsThreeVertical size={18} weight="bold" />
                    Herramientas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setStakeholderDialogOpen(true)}>
                    <Users size={16} className="mr-2" weight="duotone" />
                    Intervinientes
                  </DropdownMenuItem>
                  <ClientManager />
                  <BillingManager />
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Normativa y Visados</DropdownMenuLabel>
                  <MunicipalComplianceManager />
                  <VisaManager />
                  <BoardPermitWorkflow />
                  <AIRegulatoryAssistant />
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Documentos y Aprobaciones</DropdownMenuLabel>
                  <DocumentTemplateLibrary />
                  <ApprovalFlowManager />
                  <QualifiedSignatureProviderManager />
                  <QualifiedSignatureRequestViewer />
                  <DropdownMenuItem onClick={() => setProjectImportDialogOpen(true)}>
                    <Upload size={16} className="mr-2" weight="duotone" />
                    Importar Proyecto
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBulkProjectImportDialogOpen(true)}>
                    <FolderOpen size={16} className="mr-2" weight="duotone" />
                    Importación Múltiple
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setBulkProjectExportDialogOpen(true)}
                    disabled={(projects || []).length === 0}
                  >
                    <DownloadSimple size={16} className="mr-2" weight="duotone" />
                    Exportar Proyectos
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Presupuestos y Bases de Precios</DropdownMenuLabel>
                  <BC3ImportDialog 
                    trigger={
                      <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                        <FileArrowDown size={16} className="mr-2" weight="duotone" />
                        Importar Base de Precios BC3
                      </button>
                    }
                  />
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                  {architectProfile && (
                    <ArchitectProfileEditor 
                      profile={architectProfile}
                      onSave={handleProfileUpdate}
                      trigger={
                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                          <UserCircle size={16} className="mr-2" weight="duotone" />
                          Perfil Profesional
                        </button>
                      }
                    />
                  )}
                  <DropdownMenuItem onClick={() => setEmailLogsDialogOpen(true)}>
                    <ClockCounterClockwise size={16} className="mr-2" weight="duotone" />
                    Registro de Emails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEmailConfigDialogOpen(true)}>
                    <Gear size={16} className="mr-2" weight="duotone" />
                    Configurar Email
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Datos</DropdownMenuLabel>
                  <BackupRestoreDialog 
                    trigger={
                      <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground w-full">
                        <FloppyDisk size={16} className="mr-2" weight="duotone" />
                        Respaldo y Restauración
                      </button>
                    }
                  />
                  <DropdownMenuItem onClick={() => setSelectiveDeleteDialogOpen(true)}>
                    <Trash size={16} className="mr-2" weight="duotone" />
                    Eliminación Selectiva
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DeleteAllDataDialog 
                    onConfirmDelete={handleDeleteAllData}
                    trigger={
                      <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive hover:text-destructive-foreground w-full text-destructive">
                        <Trash size={16} className="mr-2" weight="duotone" />
                        Eliminar Todos los Datos
                      </button>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <InvoiceManager />

              {viewMode === 'projects' && (
                <Button
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
                  size="sm"
                  onClick={() => {
                    setEditingProject(undefined)
                    setProjectDialogOpen(true)
                  }}
                >
                  <Plus size={18} weight="bold" />
                  Nuevo Proyecto
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard 
                projects={projects || []}
                clients={clients || []}
                invoices={invoices || []}
                budgets={budgets || []}
                milestones={milestones || []}
                onNavigate={setViewMode}
              />
            </motion.div>
          )}

          {viewMode === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Proyectos</h2>
                  <p className="text-muted-foreground">Gestiona tu cartera de proyectos</p>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                {(['all', 'active', 'archived'] as const).map(filter => (
                  <Button
                    key={filter}
                    variant={projectFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProjectFilter(filter)}
                    className="gap-2"
                  >
                    {filter === 'all' && `Todos (${(projects || []).length})`}
                    {filter === 'active' && `Activos (${(projects || []).filter(p => p.status === 'active').length})`}
                    {filter === 'archived' && `Archivados (${(projects || []).filter(p => p.status === 'archived').length})`}
                  </Button>
                ))}
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                  <Buildings size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
                  <h3 className="text-xl font-semibold mb-2">No hay proyectos {projectFilter === 'active' ? 'activos' : 'archivados'}</h3>
                  <p className="text-muted-foreground mb-6">
                    {projectFilter === 'active' 
                      ? 'Todos los proyectos están archivados'
                      : 'No hay proyectos archivados en este momento'}
                  </p>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      setEditingProject(undefined)
                      setProjectDialogOpen(true)
                    }}
                  >
                    <Plus size={18} weight="bold" />
                    Crear Primer Proyecto
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === 'project-detail' && selectedProject && (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectDetail
                project={selectedProject}
                stakeholders={stakeholders || []}
                onBack={handleBackToProjects}
                onEdit={handleEditProject}
                onUpdatePhaseStatus={handleUpdatePhaseStatus}
                onProjectUpdate={(updates) => handleSaveProject({ ...updates, id: selectedProject.id })}
              />
            </motion.div>
          )}

          {viewMode === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCalendar projects={projects || []} />
            </motion.div>
          )}

          {viewMode === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Gestión de Clientes</h2>
                  <p className="text-muted-foreground">Administra tu cartera de clientes</p>
                </div>
              </div>
              <ClientManager asView />
            </motion.div>
          )}

          {viewMode === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center py-20"
            >
              <Receipt size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Vista de Facturas</h3>
              <p className="text-muted-foreground mb-6">
                Usa el botón "Gestión de Facturas" en el menú superior
              </p>
              <InvoiceManager />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        project={editingProject}
      />

      <StakeholderDialog
        open={stakeholderDialogOpen}
        onOpenChange={setStakeholderDialogOpen}
        onSave={handleSaveStakeholder}
      />

      <EmailConfigDialog
        open={emailConfigDialogOpen}
        onOpenChange={setEmailConfigDialogOpen}
      />

      <EmailLogsDialog
        open={emailLogsDialogOpen}
        onOpenChange={setEmailLogsDialogOpen}
      />

      <ProjectImportDialog
        open={projectImportDialogOpen}
        onOpenChange={setProjectImportDialogOpen}
        onImportComplete={handleImportComplete}
      />

      <BulkProjectImportDialog
        open={bulkProjectImportDialogOpen}
        onOpenChange={setBulkProjectImportDialogOpen}
        onImportComplete={handleBulkImportComplete}
      />

      <BulkProjectExportDialog
        open={bulkProjectExportDialogOpen}
        onOpenChange={setBulkProjectExportDialogOpen}
      />

      {pendingInvoiceData && (
        <AutoInvoiceConfirmDialog
          open={autoInvoiceDialogOpen}
          onOpenChange={setAutoInvoiceDialogOpen}
          onConfirm={handleConfirmAutoInvoice}
          onCancel={handleCancelAutoInvoice}
          invoiceData={pendingInvoiceData.invoiceData}
          projectTitle={pendingInvoiceData.projectTitle}
          phaseLabel={pendingInvoiceData.phaseLabel}
          client={pendingInvoiceData.client}
          projectBudget={pendingInvoiceData.projectBudget}
        />
      )}

      <SelectiveDeleteDialog
        open={selectiveDeleteDialogOpen}
        onOpenChange={setSelectiveDeleteDialogOpen}
      />
    </div>
  )
}

export default App
