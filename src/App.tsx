import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Stakeholder, Invoice, Client, Budget, PHASE_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { ClientManager } from '@/components/ClientManager'
import { BillingManager } from '@/components/BillingManager'
import { AutoInvoiceConfirmDialog } from '@/components/AutoInvoiceConfirmDialog'
import { Plus, Buildings, Users, BookOpen, Gear, EnvelopeSimple, ClockCounterClockwise, Upload, FolderOpen } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'
import { useEmailConfig } from '@/lib/email-service'
import { generatePhaseCompletionInvoice } from '@/lib/invoice-utils'

type ViewMode = 'dashboard' | 'detail'

function App() {
  const [projects, setProjects] = useKV<Project[]>('projects', [])
  const [stakeholders, setStakeholders] = useKV<Stakeholder[]>('stakeholders', [])
  const [invoices, setInvoices] = useKV<Invoice[]>('invoices', [])
  const [clients, setClients] = useKV<Client[]>('clients', [])
  const [budgets, setBudgets] = useKV<Budget[]>('budgets', [])
  const { isConfigured } = useEmailConfig()
  
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false)
  const [emailConfigDialogOpen, setEmailConfigDialogOpen] = useState(false)
  const [emailLogsDialogOpen, setEmailLogsDialogOpen] = useState(false)
  const [projectImportDialogOpen, setProjectImportDialogOpen] = useState(false)
  const [bulkProjectImportDialogOpen, setBulkProjectImportDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [autoInvoiceDialogOpen, setAutoInvoiceDialogOpen] = useState(false)
  const [pendingInvoiceData, setPendingInvoiceData] = useState<{
    invoiceData: Partial<Invoice>
    projectTitle: string
    phaseLabel: string
    client?: Client
    projectBudget?: Budget
  } | null>(null)

  const filteredProjects = (projects || []).filter(project => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return project.status === 'active'
    if (activeTab === 'archived') return project.status === 'archived'
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

  const handleImportComplete = (importData: {
    title: string
    location: string
    folderStructure: any
    documents: any[]
  }) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: importData.title,
      location: importData.location,
      status: 'active',
      phases: [],
      stakeholders: [],
      folderStructure: importData.folderStructure,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setProjects(currentProjects => [...(currentProjects || []), newProject])
    toast.success(`Proyecto "${importData.title}" importado con ${importData.documents.length} documentos`)
  }

  const handleBulkImportComplete = (importedProjects: Array<{
    title: string
    location: string
    folderStructure: any
    documents: any[]
  }>) => {
    const newProjects: Project[] = importedProjects.map(importData => ({
      id: `${Date.now()}-${Math.random()}`,
      title: importData.title,
      location: importData.location,
      status: 'active',
      phases: [],
      stakeholders: [],
      folderStructure: importData.folderStructure,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }))

    setProjects(currentProjects => [...(currentProjects || []), ...newProjects])
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
    setViewMode('detail')
  }

  const handleBackToDashboard = () => {
    setViewMode('dashboard')
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
        projectBudget?.totalPEM
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

  const hasProjects = (projects || []).length > 0

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <header className="border-b bg-card/95 sticky top-0 z-10 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary ring-1 ring-primary/30">
                <Buildings size={28} weight="duotone" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AFO CORE MANAGER</h1>
                <p className="text-sm text-muted-foreground">Gestión Integral de Proyectos Arquitectónicos</p>
              </div>
            </div>
            
            {viewMode === 'dashboard' && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEmailLogsDialogOpen(true)}
                  title="Registro de emails"
                >
                  <ClockCounterClockwise size={20} weight="duotone" />
                </Button>
                <Button
                  variant={isConfigured ? "ghost" : "outline"}
                  size="icon"
                  onClick={() => setEmailConfigDialogOpen(true)}
                  title={isConfigured ? "Configuración de email" : "Configurar servicio de email"}
                  className={!isConfigured ? "border-primary/50 bg-primary/10 text-primary" : ""}
                >
                  {isConfigured ? (
                    <EnvelopeSimple size={20} weight="duotone" />
                  ) : (
                    <Gear size={20} weight="duotone" className="text-primary" />
                  )}
                </Button>
                <ClientManager />
                <BillingManager />
                <InvoiceManager />
                <MunicipalComplianceManager />
                <VisaManager />
                <AIRegulatoryAssistant />
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setStakeholderDialogOpen(true)}
                >
                  <Users size={18} />
                  Intervinientes
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setProjectImportDialogOpen(true)}
                >
                  <Upload size={18} weight="duotone" />
                  Importar Proyecto
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setBulkProjectImportDialogOpen(true)}
                >
                  <FolderOpen size={18} weight="duotone" />
                  Importación Múltiple
                </Button>
                <Button
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setEditingProject(undefined)
                    setProjectDialogOpen(true)
                  }}
                >
                  <Plus size={18} weight="bold" />
                  Nuevo Proyecto
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        {viewMode === 'dashboard' ? (
          <>
            {hasProjects ? (
              <>
                <div className="mb-8">
                  <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
                    <TabsList>
                      <TabsTrigger value="all">
                        Todos ({(projects || []).length})
                      </TabsTrigger>
                      <TabsTrigger value="active">
                        Activos ({(projects || []).filter(p => p.status === 'active').length})
                      </TabsTrigger>
                      <TabsTrigger value="archived">
                        Archivados ({(projects || []).filter(p => p.status === 'archived').length})
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
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
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <Buildings size={48} className="text-muted-foreground" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No hay proyectos {activeTab === 'active' ? 'activos' : 'archivados'}</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'active' 
                        ? 'Todos los proyectos están archivados o en pausa'
                        : 'No hay proyectos archivados en este momento'}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="inline-flex p-6 rounded-2xl bg-primary/20 mb-6 ring-1 ring-primary/30">
                  <Buildings size={64} className="text-primary" weight="duotone" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Bienvenido a AFO CORE MANAGER</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Centralice la gestión de sus proyectos arquitectónicos, desde la concepción hasta la entrega final.
                  Comience creando su primer proyecto.
                </p>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      setEditingProject(undefined)
                      setProjectDialogOpen(true)
                    }}
                  >
                    <Plus size={20} weight="bold" />
                    Crear Primer Proyecto
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                    onClick={() => setProjectImportDialogOpen(true)}
                  >
                    <Upload size={20} weight="duotone" />
                    Importar Proyecto
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                    onClick={() => setBulkProjectImportDialogOpen(true)}
                  >
                    <FolderOpen size={20} weight="duotone" />
                    Importación Múltiple
                  </Button>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="p-6 rounded-lg border bg-card shadow-md hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4 ring-1 ring-primary/30">
                      <Buildings size={24} weight="duotone" />
                    </div>
                    <h3 className="font-semibold mb-2">Gestión de Proyectos</h3>
                    <p className="text-sm text-muted-foreground">
                      Organice fases, intervinientes y documentación de forma centralizada
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card shadow-md hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4 ring-1 ring-primary/30">
                      <Users size={24} weight="duotone" />
                    </div>
                    <h3 className="font-semibold mb-2">Registro de Intervinientes</h3>
                    <p className="text-sm text-muted-foreground">
                      Mantenga información de clientes, arquitectos y técnicos reutilizable
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card shadow-md hover:shadow-lg transition-shadow">
                    <div className="inline-flex p-3 rounded-lg bg-primary/20 text-primary mb-4 ring-1 ring-primary/30">
                      <BookOpen size={24} weight="duotone" />
                    </div>
                    <h3 className="font-semibold mb-2">Normativa Integrada</h3>
                    <p className="text-sm text-muted-foreground">
                      Acceso rápido a CTE, RITE y normativa urbanística aplicable
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          selectedProject && (
            <ProjectDetail
              project={selectedProject}
              stakeholders={stakeholders || []}
              onBack={handleBackToDashboard}
              onEdit={handleEditProject}
              onUpdatePhaseStatus={handleUpdatePhaseStatus}
              onProjectUpdate={(updates) => handleSaveProject({ ...updates, id: selectedProject.id })}
            />
          )
        )}
      </main>

      <ProjectDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSave={handleSaveProject}
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
    </div>
  )
}

export default App
