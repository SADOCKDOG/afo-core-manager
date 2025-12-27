import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Project, Stakeholder } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProjectCard } from '@/components/ProjectCard'
import { ProjectDialog } from '@/components/ProjectDialog'
import { ProjectDetail } from '@/components/ProjectDetail'
import { StakeholderDialog } from '@/components/StakeholderDialog'
import { AIRegulatoryAssistant } from '@/components/AIRegulatoryAssistant'
import { MunicipalComplianceManager } from '@/components/MunicipalComplianceManager'
import { VisaManager } from '@/components/VisaManager'
import { Plus, Buildings, Users, BookOpen } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Toaster, toast } from 'sonner'

type ViewMode = 'dashboard' | 'detail'

function App() {
  const [projects, setProjects] = useKV<Project[]>('projects', [])
  const [stakeholders, setStakeholders] = useKV<Stakeholder[]>('stakeholders', [])
  
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'archived'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [stakeholderDialogOpen, setStakeholderDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()

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
  }

  const hasProjects = (projects || []).length > 0

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <header className="border-b bg-card sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Buildings size={28} weight="duotone" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AFO CORE MANAGER</h1>
                <p className="text-sm text-muted-foreground">Gestión Integral de Proyectos Arquitectónicos</p>
              </div>
            </div>
            
            {viewMode === 'dashboard' && (
              <div className="flex items-center gap-3">
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
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
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
                <div className="inline-flex p-6 rounded-full bg-primary/10 mb-6">
                  <Buildings size={64} className="text-primary" weight="duotone" />
                </div>
                <h2 className="text-3xl font-bold mb-3">Bienvenido a AFO CORE MANAGER</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Centralice la gestión de sus proyectos arquitectónicos, desde la concepción hasta la entrega final.
                  Comience creando su primer proyecto.
                </p>
                <Button
                  size="lg"
                  className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    setEditingProject(undefined)
                    setProjectDialogOpen(true)
                  }}
                >
                  <Plus size={20} weight="bold" />
                  Crear Primer Proyecto
                </Button>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="p-6 rounded-lg border bg-card">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                      <Buildings size={24} weight="duotone" />
                    </div>
                    <h3 className="font-semibold mb-2">Gestión de Proyectos</h3>
                    <p className="text-sm text-muted-foreground">
                      Organice fases, intervinientes y documentación de forma centralizada
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                      <Users size={24} weight="duotone" />
                    </div>
                    <h3 className="font-semibold mb-2">Registro de Intervinientes</h3>
                    <p className="text-sm text-muted-foreground">
                      Mantenga información de clientes, arquitectos y técnicos reutilizable
                    </p>
                  </div>
                  <div className="p-6 rounded-lg border bg-card">
                    <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
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
    </div>
  )
}

export default App
