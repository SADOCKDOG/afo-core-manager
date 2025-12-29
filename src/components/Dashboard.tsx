import { Project, Client, Invoice, Budget } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Buildings, 
  UsersThree, 
  Receipt,
  CheckCircle,
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
  const issuedInvoices = invoices.filter(inv => inv.status === 'issued')
  const pendingInvoices = invoices.filter(inv => inv.status === 'draft')

  const completedPhases = projects.reduce((sum, p) => 
    sum + p.phases.filter(phase => phase.status === 'completed').length, 0
  )
  const totalPhases = projects.reduce((sum, p) => sum + p.phases.length, 0)

  const recentProjects = projects
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)

  const projectStats = [
    { label: 'Activos', count: activeProjects.length, color: 'bg-chart-1' },
    { label: 'Archivados', count: archivedProjects.length, color: 'bg-chart-2' }
  ]

  const stats = [
    {
      label: 'Proyectos',
      value: projects.length.toString(),
      icon: Buildings,
      color: 'text-chart-1',
      onClick: () => onNavigate('projects')
    },
    {
      label: 'Clientes',
      value: clients.length.toString(),
      icon: UsersThree,
      color: 'text-chart-2',
      onClick: () => onNavigate('clients')
    },
    {
      label: 'Facturas',
      value: invoices.length.toString(),
      icon: Receipt,
      color: 'text-chart-3',
      onClick: () => onNavigate('invoices')
    },
    {
      label: 'Fases Completadas',
      value: `${completedPhases}/${totalPhases}`,
      icon: CheckCircle,
      color: 'text-chart-4'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Resumen de tu actividad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`p-6 ${stat.onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={32} weight="duotone" className={stat.color} />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Proyectos Recientes</h3>
                <p className="text-sm text-muted-foreground">Últimos proyectos actualizados</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('projects')}
              >
                Ver todos
              </Button>
            </div>

            {recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => {
                  const completedCount = project.phases.filter(p => p.status === 'completed').length
                  const totalCount = project.phases.length
                  
                  return (
                    <div
                      key={project.id}
                      onClick={() => onNavigate('projects')}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                          <p className="text-xs text-muted-foreground">{project.location}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'active' 
                            ? 'bg-chart-1/20 text-chart-1' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {project.status === 'active' ? 'Activo' : 'Archivado'}
                        </span>
                      </div>
                      
                      {totalCount > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-chart-1 h-full transition-all"
                              style={{ width: `${(completedCount / totalCount) * 100}%` }}
                            />
                          </div>
                          <span>{completedCount}/{totalCount} fases</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay proyectos recientes</p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Estado de Proyectos</h3>
            
            <div className="space-y-4 mb-6">
              {projectStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-sm font-bold">{stat.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${stat.color} h-full transition-all`}
                      style={{ width: projects.length > 0 ? `${(stat.count / projects.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3">Facturas Pendientes</h4>
            </div>
            
            <div className="space-y-3">
              {pendingInvoices.length > 0 ? (
                <>
                  {pendingInvoices.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => onNavigate('invoices')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-muted-foreground">{invoice.clientName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-amber-500" />
                          <span className="text-sm font-semibold">
                            {invoice.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingInvoices.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => onNavigate('invoices')}
                    >
                      Ver todas las facturas pendientes
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
                  <CheckCircle size={32} weight="duotone" className="text-chart-4" />
                  <p className="text-sm">No hay facturas pendientes</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
