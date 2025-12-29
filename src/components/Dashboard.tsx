import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  UsersThree,
  CheckCircle,
  Receipt,
  Buildings,
  Clock
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

type ViewMode = 'dashboard' | 'projects' | 'clients' | 'invoices' | 'project-detail'

interface DashboardProps {
  projects: Project[]
  clients: Client[]
  invoices: Invoice[]
  budgets: Budget[]
  onNavigate: (view: ViewMode) => void
}

export function Dashboard({ projects, clients, invoices, budgets, onNavigate }: DashboardProps) {
  const activeProjects = projects.filter(p => p.status === 'active')
  const archivedProjects = projects.filter(p => p.status === 'archived')
  const issuedInvoices = invoices.filter(i => i.status === 'issued')
  
  const totalCompletedPhases = projects.reduce(
    (sum, p) => sum + p.phases.filter(phase => phase.status === 'completed').length,
    0
  )

  const recentProjects = projects
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const stats = [
    {
      label: 'Proyectos Activos',
      value: activeProjects.length.toString(),
      icon: Buildings,
      color: 'text-chart-1',
    },
    {
      label: 'Clientes',
      value: clients.length.toString(),
      icon: UsersThree,
      color: 'text-chart-2',
    },
    {
      label: 'Facturas Emitidas',
      value: issuedInvoices.length.toString(),
      icon: Receipt,
      color: 'text-chart-3',
    },
    {
      label: 'Fases Completadas',
      value: totalCompletedPhases.toString(),
      icon: CheckCircle,
      color: 'text-chart-4',
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Vista general de tu gestión</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon size={24} weight="duotone" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Proyectos Recientes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('projects')}
            >
              Ver todos
            </Button>
          </div>
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project) => {
                const totalPhases = project.phases.length
                const completedPhases = project.phases.filter(p => p.status === 'completed').length
                const inProgressPhases = project.phases.filter(p => p.status === 'in-progress').length
                
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => onNavigate('projects')}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {totalPhases > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle size={16} weight="duotone" className="text-chart-4" />
                          <span>{completedPhases}/{totalPhases}</span>
                        </div>
                      )}
                      {inProgressPhases > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} weight="duotone" className="text-chart-2" />
                          <span>{inProgressPhases}</span>
                        </div>
                      )}
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        project.status === 'active' 
                          ? 'bg-chart-1/20 text-chart-1' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {project.status === 'active' ? 'Activo' : 'Archivado'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay proyectos todavía</p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
